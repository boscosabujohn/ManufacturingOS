import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export type TrainingType = 'technical' | 'soft_skills' | 'compliance' | 'safety' | 'leadership' | 'product' | 'certification';
export type TrainingMode = 'classroom' | 'online' | 'on_the_job' | 'workshop' | 'seminar' | 'self_paced';
export type TrainingStatus = 'planned' | 'in_progress' | 'completed' | 'cancelled';
export type EnrollmentStatus = 'enrolled' | 'in_progress' | 'completed' | 'failed' | 'withdrawn';

export interface TrainingProgram {
  id: string;
  programCode: string;
  title: string;
  description: string;
  type: TrainingType;
  mode: TrainingMode;
  duration: number; // hours
  maxParticipants: number;
  prerequisites?: string[];
  objectives: string[];
  curriculum: CurriculumModule[];
  trainerId?: string;
  trainerName?: string;
  externalVendor?: string;
  cost: number;
  isActive: boolean;
  createdAt: string;
}

export interface CurriculumModule {
  id: string;
  title: string;
  description: string;
  duration: number; // hours
  materials?: string[];
  assessmentType?: 'quiz' | 'assignment' | 'practical' | 'none';
}

export interface TrainingSchedule {
  id: string;
  programId: string;
  programTitle: string;
  startDate: string;
  endDate: string;
  location: string;
  mode: TrainingMode;
  status: TrainingStatus;
  maxParticipants: number;
  enrolledCount: number;
  trainerId?: string;
  trainerName?: string;
  sessions: TrainingSession[];
  createdAt: string;
}

export interface TrainingSession {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  topic: string;
  venue?: string;
  onlineLink?: string;
}

export interface TrainingEnrollment {
  id: string;
  scheduleId: string;
  programId: string;
  programTitle: string;
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  department: string;
  enrollmentDate: string;
  status: EnrollmentStatus;
  completionDate?: string;
  score?: number;
  grade?: string;
  feedback?: string;
  certificateId?: string;
  attendance: AttendanceRecord[];
}

export interface AttendanceRecord {
  sessionId: string;
  date: string;
  present: boolean;
  remarks?: string;
}

export interface TrainingNeed {
  id: string;
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  department: string;
  identifiedBy: string;
  identifiedDate: string;
  skillGap: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  suggestedProgram?: string;
  targetDate?: string;
  status: 'identified' | 'planned' | 'addressed' | 'closed';
  remarks?: string;
}

export interface TrainingBudget {
  id: string;
  fiscalYear: string;
  department: string;
  allocatedBudget: number;
  utilizedBudget: number;
  remainingBudget: number;
  trainingsPlanned: number;
  trainingsCompleted: number;
}

export interface TrainingEffectiveness {
  programId: string;
  programTitle: string;
  totalParticipants: number;
  completionRate: number;
  averageScore: number;
  passRate: number;
  satisfactionRating: number;
  skillImprovementPercent: number;
  roi?: number;
}

@Injectable()
export class TrainingService {
  private programs: TrainingProgram[] = [];
  private schedules: TrainingSchedule[] = [];
  private enrollments: TrainingEnrollment[] = [];
  private needs: TrainingNeed[] = [];
  private budgets: TrainingBudget[] = [];

  constructor() {
    this.seedMockData();
  }

  async createProgram(program: Omit<TrainingProgram, 'id' | 'createdAt'>): Promise<TrainingProgram> {
    const newProgram: TrainingProgram = {
      ...program,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };

    this.programs.push(newProgram);
    return newProgram;
  }

  async scheduleTraining(
    programId: string,
    startDate: string,
    endDate: string,
    location: string,
    sessions: Omit<TrainingSession, 'id'>[]
  ): Promise<TrainingSchedule> {
    const program = this.programs.find(p => p.id === programId);
    if (!program) throw new Error(`Program ${programId} not found`);

    const schedule: TrainingSchedule = {
      id: uuidv4(),
      programId,
      programTitle: program.title,
      startDate,
      endDate,
      location,
      mode: program.mode,
      status: 'planned',
      maxParticipants: program.maxParticipants,
      enrolledCount: 0,
      trainerId: program.trainerId,
      trainerName: program.trainerName,
      sessions: sessions.map(s => ({ ...s, id: uuidv4() })),
      createdAt: new Date().toISOString(),
    };

    this.schedules.push(schedule);
    return schedule;
  }

  async enrollEmployee(
    scheduleId: string,
    employeeId: string,
    employeeCode: string,
    employeeName: string,
    department: string
  ): Promise<TrainingEnrollment> {
    const schedule = this.schedules.find(s => s.id === scheduleId);
    if (!schedule) throw new Error(`Schedule ${scheduleId} not found`);

    if (schedule.enrolledCount >= schedule.maxParticipants) {
      throw new Error('Training is at full capacity');
    }

    // Check for duplicate enrollment
    const existing = this.enrollments.find(
      e => e.scheduleId === scheduleId && e.employeeId === employeeId
    );
    if (existing) throw new Error('Employee already enrolled');

    const enrollment: TrainingEnrollment = {
      id: uuidv4(),
      scheduleId,
      programId: schedule.programId,
      programTitle: schedule.programTitle,
      employeeId,
      employeeCode,
      employeeName,
      department,
      enrollmentDate: new Date().toISOString().split('T')[0],
      status: 'enrolled',
      attendance: [],
    };

    this.enrollments.push(enrollment);
    schedule.enrolledCount++;

    return enrollment;
  }

  async markAttendance(
    enrollmentId: string,
    sessionId: string,
    present: boolean,
    remarks?: string
  ): Promise<TrainingEnrollment> {
    const enrollment = this.enrollments.find(e => e.id === enrollmentId);
    if (!enrollment) throw new Error(`Enrollment ${enrollmentId} not found`);

    const schedule = this.schedules.find(s => s.id === enrollment.scheduleId);
    const session = schedule?.sessions.find(s => s.id === sessionId);
    if (!session) throw new Error(`Session ${sessionId} not found`);

    // Update or add attendance record
    const existingIndex = enrollment.attendance.findIndex(a => a.sessionId === sessionId);
    const record: AttendanceRecord = {
      sessionId,
      date: session.date,
      present,
      remarks,
    };

    if (existingIndex >= 0) {
      enrollment.attendance[existingIndex] = record;
    } else {
      enrollment.attendance.push(record);
    }

    // Update enrollment status
    if (enrollment.status === 'enrolled') {
      enrollment.status = 'in_progress';
    }

    return enrollment;
  }

  async completeTraining(
    enrollmentId: string,
    score: number,
    feedback?: string
  ): Promise<TrainingEnrollment> {
    const enrollment = this.enrollments.find(e => e.id === enrollmentId);
    if (!enrollment) throw new Error(`Enrollment ${enrollmentId} not found`);

    enrollment.status = score >= 60 ? 'completed' : 'failed';
    enrollment.completionDate = new Date().toISOString().split('T')[0];
    enrollment.score = score;
    enrollment.grade = this.calculateGrade(score);
    enrollment.feedback = feedback;

    if (enrollment.status === 'completed') {
      enrollment.certificateId = `CERT-${Date.now()}`;
    }

    return enrollment;
  }

  async identifyTrainingNeed(
    employeeId: string,
    employeeCode: string,
    employeeName: string,
    department: string,
    skillGap: string,
    priority: TrainingNeed['priority'],
    identifiedBy: string
  ): Promise<TrainingNeed> {
    const need: TrainingNeed = {
      id: uuidv4(),
      employeeId,
      employeeCode,
      employeeName,
      department,
      identifiedBy,
      identifiedDate: new Date().toISOString().split('T')[0],
      skillGap,
      priority,
      status: 'identified',
    };

    this.needs.push(need);
    return need;
  }

  async getTrainingNeedAnalysis(): Promise<{
    byDepartment: Record<string, number>;
    byPriority: Record<string, number>;
    bySkillCategory: Record<string, number>;
    totalNeeds: number;
    addressedRate: number;
  }> {
    const byDepartment: Record<string, number> = {};
    const byPriority: Record<string, number> = {};
    const bySkillCategory: Record<string, number> = {};
    let addressed = 0;

    for (const need of this.needs) {
      byDepartment[need.department] = (byDepartment[need.department] || 0) + 1;
      byPriority[need.priority] = (byPriority[need.priority] || 0) + 1;

      // Categorize skill gaps
      const category = this.categorizeSkillGap(need.skillGap);
      bySkillCategory[category] = (bySkillCategory[category] || 0) + 1;

      if (need.status === 'addressed' || need.status === 'closed') {
        addressed++;
      }
    }

    return {
      byDepartment,
      byPriority,
      bySkillCategory,
      totalNeeds: this.needs.length,
      addressedRate: this.needs.length > 0 ? Math.round((addressed / this.needs.length) * 100) : 0,
    };
  }

  async calculateEffectiveness(programId: string): Promise<TrainingEffectiveness> {
    const program = this.programs.find(p => p.id === programId);
    if (!program) throw new Error(`Program ${programId} not found`);

    const programEnrollments = this.enrollments.filter(e => e.programId === programId);

    if (programEnrollments.length === 0) {
      return {
        programId,
        programTitle: program.title,
        totalParticipants: 0,
        completionRate: 0,
        averageScore: 0,
        passRate: 0,
        satisfactionRating: 0,
        skillImprovementPercent: 0,
      };
    }

    const completed = programEnrollments.filter(e => e.status === 'completed' || e.status === 'failed');
    const passed = programEnrollments.filter(e => e.status === 'completed');
    const scores = completed.filter(e => e.score !== undefined).map(e => e.score!);

    return {
      programId,
      programTitle: program.title,
      totalParticipants: programEnrollments.length,
      completionRate: Math.round((completed.length / programEnrollments.length) * 100),
      averageScore: scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0,
      passRate: completed.length > 0 ? Math.round((passed.length / completed.length) * 100) : 0,
      satisfactionRating: 4.2, // Would come from feedback surveys
      skillImprovementPercent: 35, // Would come from pre/post assessments
    };
  }

  async getBudgetUtilization(department?: string): Promise<TrainingBudget[]> {
    if (department) {
      return this.budgets.filter(b => b.department === department);
    }
    return this.budgets;
  }

  async getEmployeeTrainingHistory(employeeId: string): Promise<TrainingEnrollment[]> {
    return this.enrollments.filter(e => e.employeeId === employeeId);
  }

  async getUpcomingTrainings(): Promise<TrainingSchedule[]> {
    const today = new Date().toISOString().split('T')[0];
    return this.schedules.filter(s => s.startDate >= today && s.status === 'planned');
  }

  async getTrainingCalendar(month: string): Promise<TrainingSchedule[]> {
    return this.schedules.filter(s => s.startDate.startsWith(month));
  }

  async getTrainingSummary(): Promise<{
    totalPrograms: number;
    activePrograms: number;
    totalEnrollments: number;
    completedTrainings: number;
    upcomingSchedules: number;
    avgCompletionRate: number;
    totalHoursDelivered: number;
  }> {
    const activePrograms = this.programs.filter(p => p.isActive).length;
    const completedEnrollments = this.enrollments.filter(e => e.status === 'completed');
    const today = new Date().toISOString().split('T')[0];
    const upcoming = this.schedules.filter(s => s.startDate >= today).length;

    const completionRate = this.enrollments.length > 0
      ? (completedEnrollments.length / this.enrollments.length) * 100
      : 0;

    const totalHours = this.programs.reduce((sum, p) => sum + p.duration, 0) * completedEnrollments.length;

    return {
      totalPrograms: this.programs.length,
      activePrograms,
      totalEnrollments: this.enrollments.length,
      completedTrainings: completedEnrollments.length,
      upcomingSchedules: upcoming,
      avgCompletionRate: Math.round(completionRate),
      totalHoursDelivered: totalHours,
    };
  }

  async generateSkillMatrix(department: string): Promise<{
    employees: {
      employeeId: string;
      employeeName: string;
      skills: Record<string, number>;
    }[];
    skills: string[];
  }> {
    const departmentEnrollments = this.enrollments.filter(e => e.department === department);
    const employeeMap = new Map<string, { name: string; skills: Record<string, number> }>();
    const skillSet = new Set<string>();

    for (const enrollment of departmentEnrollments) {
      if (enrollment.status === 'completed' && enrollment.score) {
        if (!employeeMap.has(enrollment.employeeId)) {
          employeeMap.set(enrollment.employeeId, {
            name: enrollment.employeeName,
            skills: {},
          });
        }

        const emp = employeeMap.get(enrollment.employeeId)!;
        emp.skills[enrollment.programTitle] = enrollment.score;
        skillSet.add(enrollment.programTitle);
      }
    }

    return {
      employees: Array.from(employeeMap.entries()).map(([id, data]) => ({
        employeeId: id,
        employeeName: data.name,
        skills: data.skills,
      })),
      skills: Array.from(skillSet),
    };
  }

  private calculateGrade(score: number): string {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    return 'F';
  }

  private categorizeSkillGap(skillGap: string): string {
    const lower = skillGap.toLowerCase();
    if (lower.includes('technical') || lower.includes('software') || lower.includes('coding')) {
      return 'Technical';
    }
    if (lower.includes('communication') || lower.includes('leadership') || lower.includes('team')) {
      return 'Soft Skills';
    }
    if (lower.includes('safety') || lower.includes('compliance')) {
      return 'Compliance';
    }
    return 'General';
  }

  private seedMockData(): void {
    // Sample training programs
    this.programs = [
      {
        id: uuidv4(),
        programCode: 'TRN-001',
        title: 'Advanced Manufacturing Techniques',
        description: 'Learn advanced manufacturing processes and quality control',
        type: 'technical',
        mode: 'classroom',
        duration: 16,
        maxParticipants: 20,
        objectives: [
          'Understand modern manufacturing processes',
          'Apply lean manufacturing principles',
          'Implement quality control measures',
        ],
        curriculum: [
          {
            id: uuidv4(),
            title: 'Introduction to Advanced Manufacturing',
            description: 'Overview of modern manufacturing techniques',
            duration: 4,
            assessmentType: 'quiz',
          },
          {
            id: uuidv4(),
            title: 'Lean Manufacturing',
            description: 'Principles and implementation',
            duration: 6,
            assessmentType: 'assignment',
          },
          {
            id: uuidv4(),
            title: 'Quality Control',
            description: 'SPC and quality management',
            duration: 6,
            assessmentType: 'practical',
          },
        ],
        trainerId: 'trainer-001',
        trainerName: 'Dr. Smith',
        cost: 25000,
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        programCode: 'TRN-002',
        title: 'Leadership Development Program',
        description: 'Develop leadership and management skills',
        type: 'leadership',
        mode: 'workshop',
        duration: 24,
        maxParticipants: 15,
        objectives: [
          'Develop effective leadership styles',
          'Improve team management skills',
          'Enhance decision-making abilities',
        ],
        curriculum: [
          {
            id: uuidv4(),
            title: 'Leadership Fundamentals',
            description: 'Core leadership concepts',
            duration: 8,
            assessmentType: 'assignment',
          },
          {
            id: uuidv4(),
            title: 'Team Management',
            description: 'Building and leading teams',
            duration: 8,
            assessmentType: 'practical',
          },
          {
            id: uuidv4(),
            title: 'Strategic Thinking',
            description: 'Decision making and planning',
            duration: 8,
            assessmentType: 'assignment',
          },
        ],
        externalVendor: 'Leadership Institute',
        cost: 50000,
        isActive: true,
        createdAt: new Date().toISOString(),
      },
    ];

    // Sample budgets
    this.budgets = [
      {
        id: uuidv4(),
        fiscalYear: '2024-25',
        department: 'Engineering',
        allocatedBudget: 500000,
        utilizedBudget: 175000,
        remainingBudget: 325000,
        trainingsPlanned: 12,
        trainingsCompleted: 5,
      },
      {
        id: uuidv4(),
        fiscalYear: '2024-25',
        department: 'Production',
        allocatedBudget: 400000,
        utilizedBudget: 120000,
        remainingBudget: 280000,
        trainingsPlanned: 10,
        trainingsCompleted: 3,
      },
    ];
  }
}
