import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export type OnboardingStatus = 'not_started' | 'in_progress' | 'completed' | 'cancelled';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'skipped' | 'overdue';
export type TaskCategory = 'documentation' | 'it_setup' | 'training' | 'compliance' | 'introduction' | 'assets';

export interface OnboardingTask {
  id: string;
  taskNumber: number;
  name: string;
  description: string;
  category: TaskCategory;
  assignedToId: string;
  assignedToName: string;
  assignedToDepartment: string;
  dueDate: string;
  completedDate?: string;
  status: TaskStatus;
  isMandatory: boolean;
  dependsOn?: string[];
  notes?: string;
  attachments?: string[];
}

export interface OnboardingChecklist {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  department: string;
  position: string;
  joiningDate: string;
  status: OnboardingStatus;
  templateId: string;
  templateName: string;
  tasks: OnboardingTask[];
  progress: number;
  completedTasks: number;
  totalTasks: number;
  buddyId?: string;
  buddyName?: string;
  managerId: string;
  managerName: string;
  welcomeEmailSent: boolean;
  itAccessProvisioned: boolean;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface OnboardingTemplate {
  id: string;
  name: string;
  description: string;
  department?: string;
  position?: string;
  tasks: Array<{
    name: string;
    description: string;
    category: TaskCategory;
    defaultAssigneeRole: string;
    daysFromJoining: number;
    isMandatory: boolean;
    dependsOn?: number[];
  }>;
  isActive: boolean;
  createdAt: string;
}

@Injectable()
export class OnboardingWorkflowService {
  private checklists: OnboardingChecklist[] = [];
  private templates: OnboardingTemplate[] = [];

  constructor() {
    this.initializeTemplates();
    this.seedMockData();
  }

  async createOnboarding(data: {
    employeeId: string;
    employeeName: string;
    employeeEmail: string;
    department: string;
    position: string;
    joiningDate: string;
    managerId: string;
    managerName: string;
    buddyId?: string;
    buddyName?: string;
    templateId?: string;
  }): Promise<OnboardingChecklist> {
    const template = data.templateId
      ? this.templates.find(t => t.id === data.templateId)
      : this.templates.find(t => t.isActive && (!t.department || t.department === data.department));

    if (!template) {
      throw new NotFoundException('No suitable onboarding template found');
    }

    const joiningDate = new Date(data.joiningDate);
    const tasks: OnboardingTask[] = template.tasks.map((t, index) => {
      const dueDate = new Date(joiningDate);
      dueDate.setDate(dueDate.getDate() + t.daysFromJoining);

      return {
        id: uuidv4(),
        taskNumber: index + 1,
        name: t.name,
        description: t.description,
        category: t.category,
        assignedToId: this.getAssigneeByRole(t.defaultAssigneeRole, data.managerId),
        assignedToName: this.getAssigneeNameByRole(t.defaultAssigneeRole, data.managerName),
        assignedToDepartment: t.defaultAssigneeRole === 'manager' ? data.department : t.defaultAssigneeRole,
        dueDate: dueDate.toISOString().split('T')[0],
        status: 'pending',
        isMandatory: t.isMandatory,
        dependsOn: t.dependsOn?.map(i => template.tasks[i]?.name),
      };
    });

    const checklist: OnboardingChecklist = {
      id: uuidv4(),
      employeeId: data.employeeId,
      employeeName: data.employeeName,
      employeeEmail: data.employeeEmail,
      department: data.department,
      position: data.position,
      joiningDate: data.joiningDate,
      status: 'not_started',
      templateId: template.id,
      templateName: template.name,
      tasks,
      progress: 0,
      completedTasks: 0,
      totalTasks: tasks.length,
      buddyId: data.buddyId,
      buddyName: data.buddyName,
      managerId: data.managerId,
      managerName: data.managerName,
      welcomeEmailSent: false,
      itAccessProvisioned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.checklists.push(checklist);
    return checklist;
  }

  async getOnboarding(id: string): Promise<OnboardingChecklist> {
    const checklist = this.checklists.find(c => c.id === id);
    if (!checklist) {
      throw new NotFoundException(`Onboarding ${id} not found`);
    }
    this.updateProgress(checklist);
    return checklist;
  }

  async startOnboarding(id: string): Promise<OnboardingChecklist> {
    const checklist = await this.getOnboarding(id);
    checklist.status = 'in_progress';
    checklist.updatedAt = new Date().toISOString();
    return checklist;
  }

  async completeTask(
    checklistId: string,
    taskId: string,
    completedById: string,
    notes?: string
  ): Promise<OnboardingChecklist> {
    const checklist = await this.getOnboarding(checklistId);
    const task = checklist.tasks.find(t => t.id === taskId);

    if (!task) {
      throw new NotFoundException(`Task ${taskId} not found`);
    }

    // Check dependencies
    if (task.dependsOn && task.dependsOn.length > 0) {
      const incompleteDeps = task.dependsOn.filter(depName => {
        const depTask = checklist.tasks.find(t => t.name === depName);
        return depTask && depTask.status !== 'completed';
      });

      if (incompleteDeps.length > 0) {
        throw new Error(`Cannot complete task. Pending dependencies: ${incompleteDeps.join(', ')}`);
      }
    }

    task.status = 'completed';
    task.completedDate = new Date().toISOString().split('T')[0];
    task.notes = notes;

    this.updateProgress(checklist);

    // Check if IT setup task
    if (task.category === 'it_setup' && task.name.toLowerCase().includes('access')) {
      checklist.itAccessProvisioned = true;
    }

    // Check if all tasks completed
    if (checklist.progress === 100) {
      checklist.status = 'completed';
      checklist.completedAt = new Date().toISOString();
    }

    checklist.updatedAt = new Date().toISOString();
    return checklist;
  }

  async skipTask(
    checklistId: string,
    taskId: string,
    reason: string
  ): Promise<OnboardingChecklist> {
    const checklist = await this.getOnboarding(checklistId);
    const task = checklist.tasks.find(t => t.id === taskId);

    if (!task) {
      throw new NotFoundException(`Task ${taskId} not found`);
    }

    if (task.isMandatory) {
      throw new Error('Cannot skip mandatory task');
    }

    task.status = 'skipped';
    task.notes = `Skipped: ${reason}`;

    this.updateProgress(checklist);
    checklist.updatedAt = new Date().toISOString();

    return checklist;
  }

  async reassignTask(
    checklistId: string,
    taskId: string,
    newAssigneeId: string,
    newAssigneeName: string
  ): Promise<OnboardingChecklist> {
    const checklist = await this.getOnboarding(checklistId);
    const task = checklist.tasks.find(t => t.id === taskId);

    if (!task) {
      throw new NotFoundException(`Task ${taskId} not found`);
    }

    task.assignedToId = newAssigneeId;
    task.assignedToName = newAssigneeName;
    checklist.updatedAt = new Date().toISOString();

    return checklist;
  }

  async sendWelcomeEmail(checklistId: string): Promise<OnboardingChecklist> {
    const checklist = await this.getOnboarding(checklistId);
    checklist.welcomeEmailSent = true;
    checklist.updatedAt = new Date().toISOString();
    return checklist;
  }

  async getActiveOnboardings(): Promise<OnboardingChecklist[]> {
    return this.checklists.filter(c =>
      c.status === 'in_progress' || c.status === 'not_started'
    );
  }

  async getOnboardingsByManager(managerId: string): Promise<OnboardingChecklist[]> {
    return this.checklists.filter(c => c.managerId === managerId);
  }

  async getMyTasks(userId: string): Promise<Array<{
    checklist: OnboardingChecklist;
    task: OnboardingTask;
  }>> {
    const myTasks: Array<{ checklist: OnboardingChecklist; task: OnboardingTask }> = [];

    for (const checklist of this.checklists) {
      if (['completed', 'cancelled'].includes(checklist.status)) continue;

      for (const task of checklist.tasks) {
        if (task.assignedToId === userId && task.status === 'pending') {
          myTasks.push({ checklist, task });
        }
      }
    }

    return myTasks.sort((a, b) => a.task.dueDate.localeCompare(b.task.dueDate));
  }

  async getOverdueTasks(): Promise<Array<{
    checklist: OnboardingChecklist;
    task: OnboardingTask;
  }>> {
    const today = new Date().toISOString().split('T')[0];
    const overdue: Array<{ checklist: OnboardingChecklist; task: OnboardingTask }> = [];

    for (const checklist of this.checklists) {
      if (['completed', 'cancelled'].includes(checklist.status)) continue;

      for (const task of checklist.tasks) {
        if (task.status === 'pending' && task.dueDate < today) {
          task.status = 'overdue';
          overdue.push({ checklist, task });
        }
      }
    }

    return overdue;
  }

  async getStatistics(): Promise<{
    totalOnboardings: number;
    inProgress: number;
    completed: number;
    averageCompletionDays: number;
    taskCompletionRate: number;
    overdueTaskCount: number;
    byDepartment: Record<string, number>;
  }> {
    const byDepartment: Record<string, number> = {};
    let totalCompletionDays = 0;
    let completedCount = 0;
    let totalTasks = 0;
    let completedTasks = 0;
    let overdueTaskCount = 0;
    const today = new Date().toISOString().split('T')[0];

    for (const c of this.checklists) {
      byDepartment[c.department] = (byDepartment[c.department] || 0) + 1;

      if (c.completedAt) {
        const days = Math.floor(
          (new Date(c.completedAt).getTime() - new Date(c.joiningDate).getTime()) / (1000 * 60 * 60 * 24)
        );
        totalCompletionDays += days;
        completedCount++;
      }

      for (const task of c.tasks) {
        totalTasks++;
        if (task.status === 'completed') completedTasks++;
        if (task.status === 'pending' && task.dueDate < today) overdueTaskCount++;
      }
    }

    return {
      totalOnboardings: this.checklists.length,
      inProgress: this.checklists.filter(c => c.status === 'in_progress').length,
      completed: this.checklists.filter(c => c.status === 'completed').length,
      averageCompletionDays: completedCount > 0 ? Math.round(totalCompletionDays / completedCount) : 0,
      taskCompletionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      overdueTaskCount,
      byDepartment,
    };
  }

  private updateProgress(checklist: OnboardingChecklist): void {
    const completed = checklist.tasks.filter(t =>
      t.status === 'completed' || t.status === 'skipped'
    ).length;
    checklist.completedTasks = completed;
    checklist.progress = Math.round((completed / checklist.totalTasks) * 100);
  }

  private getAssigneeByRole(role: string, managerId: string): string {
    const roleMap: Record<string, string> = {
      hr: 'hr-001',
      it: 'it-001',
      admin: 'admin-001',
      manager: managerId,
      security: 'security-001',
      training: 'training-001',
    };
    return roleMap[role] || managerId;
  }

  private getAssigneeNameByRole(role: string, managerName: string): string {
    const roleMap: Record<string, string> = {
      hr: 'HR Team',
      it: 'IT Support',
      admin: 'Admin Team',
      manager: managerName,
      security: 'Security Team',
      training: 'Training Team',
    };
    return roleMap[role] || managerName;
  }

  private initializeTemplates(): void {
    this.templates.push({
      id: uuidv4(),
      name: 'Standard Employee Onboarding',
      description: 'Default onboarding template for all employees',
      isActive: true,
      createdAt: new Date().toISOString(),
      tasks: [
        { name: 'Document Verification', description: 'Verify identity and educational documents', category: 'documentation', defaultAssigneeRole: 'hr', daysFromJoining: -3, isMandatory: true },
        { name: 'Employment Contract', description: 'Sign employment contract and NDA', category: 'documentation', defaultAssigneeRole: 'hr', daysFromJoining: -1, isMandatory: true },
        { name: 'Create Email Account', description: 'Create corporate email account', category: 'it_setup', defaultAssigneeRole: 'it', daysFromJoining: -1, isMandatory: true },
        { name: 'System Access Provisioning', description: 'Set up access to required systems', category: 'it_setup', defaultAssigneeRole: 'it', daysFromJoining: 0, isMandatory: true, dependsOn: [2] },
        { name: 'Workstation Setup', description: 'Prepare workstation with required equipment', category: 'it_setup', defaultAssigneeRole: 'it', daysFromJoining: 0, isMandatory: true },
        { name: 'ID Card Issuance', description: 'Issue employee ID card', category: 'assets', defaultAssigneeRole: 'security', daysFromJoining: 0, isMandatory: true },
        { name: 'Welcome Orientation', description: 'Company overview and policies', category: 'introduction', defaultAssigneeRole: 'hr', daysFromJoining: 1, isMandatory: true },
        { name: 'Team Introduction', description: 'Introduce to team members', category: 'introduction', defaultAssigneeRole: 'manager', daysFromJoining: 1, isMandatory: true },
        { name: 'Safety Training', description: 'Workplace safety orientation', category: 'compliance', defaultAssigneeRole: 'training', daysFromJoining: 2, isMandatory: true },
        { name: 'Department Orientation', description: 'Department-specific training', category: 'training', defaultAssigneeRole: 'manager', daysFromJoining: 3, isMandatory: true },
        { name: 'Compliance Training', description: 'Complete mandatory compliance modules', category: 'compliance', defaultAssigneeRole: 'training', daysFromJoining: 7, isMandatory: true },
        { name: '30-Day Check-in', description: 'First month review with manager', category: 'introduction', defaultAssigneeRole: 'manager', daysFromJoining: 30, isMandatory: false },
      ],
    });
  }

  private seedMockData(): void {
    this.createOnboarding({
      employeeId: 'emp-new-001',
      employeeName: 'Rahul Sharma',
      employeeEmail: 'rahul.sharma@company.com',
      department: 'Engineering',
      position: 'Software Engineer',
      joiningDate: new Date().toISOString().split('T')[0],
      managerId: 'mgr-001',
      managerName: 'Priya Patel',
      buddyId: 'emp-005',
      buddyName: 'Amit Kumar',
    });
  }
}
