import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export type SeparationType = 'resignation' | 'termination' | 'retirement' | 'contract_end' | 'death' | 'absconding';
export type SeparationStatus = 'initiated' | 'in_progress' | 'pending_fnf' | 'completed' | 'cancelled';
export type ClearanceStatus = 'pending' | 'cleared' | 'not_applicable';
export type FnFStatus = 'pending' | 'calculated' | 'approved' | 'processed' | 'paid';

export interface SeparationRequest {
  id: string;
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  department: string;
  designation: string;
  dateOfJoining: string;
  separationType: SeparationType;
  requestDate: string;
  lastWorkingDate: string;
  noticePeriodDays: number;
  noticePeriodServed: number;
  noticePeriodShortfall: number;
  reason: string;
  status: SeparationStatus;
  initiatedBy: string;
  approvedBy?: string;
  approvalDate?: string;
  exitInterviewDate?: string;
  exitInterviewNotes?: string;
  clearances: DepartmentClearance[];
  fnfSettlement?: FnFSettlement;
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentClearance {
  id: string;
  department: string;
  responsiblePerson: string;
  items: ClearanceItem[];
  status: ClearanceStatus;
  clearedDate?: string;
  remarks?: string;
}

export interface ClearanceItem {
  id: string;
  description: string;
  isCleared: boolean;
  clearedDate?: string;
  remarks?: string;
}

export interface FnFSettlement {
  id: string;
  separationId: string;
  employeeId: string;
  status: FnFStatus;

  // Earnings
  basicSalaryDue: number;
  leaveEncashment: number;
  bonusPayable: number;
  gratuity: number;
  reimbursements: number;
  otherEarnings: number;
  totalEarnings: number;

  // Deductions
  noticePeriodRecovery: number;
  advanceRecovery: number;
  loanRecovery: number;
  taxDeduction: number;
  otherDeductions: number;
  totalDeductions: number;

  // Net
  netPayable: number;

  calculatedDate: string;
  calculatedBy: string;
  approvedDate?: string;
  approvedBy?: string;
  paymentDate?: string;
  paymentReference?: string;

  breakdown: FnFBreakdownItem[];
}

export interface FnFBreakdownItem {
  category: 'earning' | 'deduction';
  component: string;
  description: string;
  amount: number;
  calculation?: string;
}

export interface ExitInterviewTemplate {
  id: string;
  name: string;
  questions: ExitInterviewQuestion[];
  isActive: boolean;
}

export interface ExitInterviewQuestion {
  id: string;
  question: string;
  type: 'rating' | 'text' | 'multiple_choice';
  options?: string[];
  required: boolean;
}

export interface ExitInterviewResponse {
  separationId: string;
  responses: {
    questionId: string;
    answer: string | number;
  }[];
  overallRating?: number;
  wouldRecommend?: boolean;
  additionalComments?: string;
  conductedDate: string;
  conductedBy: string;
}

@Injectable()
export class SeparationService {
  private separations: SeparationRequest[] = [];
  private exitTemplates: ExitInterviewTemplate[] = [];
  private exitResponses: ExitInterviewResponse[] = [];

  constructor() {
    this.seedMockData();
  }

  async initiateSeparation(
    employeeId: string,
    separationType: SeparationType,
    lastWorkingDate: string,
    reason: string,
    initiatedBy: string
  ): Promise<SeparationRequest> {
    // Mock employee data
    const employee = this.getMockEmployee(employeeId);

    const requestDate = new Date().toISOString().split('T')[0];
    const lwdDate = new Date(lastWorkingDate);
    const reqDate = new Date(requestDate);
    const noticeDays = Math.ceil((lwdDate.getTime() - reqDate.getTime()) / (1000 * 60 * 60 * 24));

    const requiredNotice = this.getRequiredNoticePeriod(employee.designation);
    const shortfall = Math.max(0, requiredNotice - noticeDays);

    const separation: SeparationRequest = {
      id: uuidv4(),
      employeeId,
      employeeCode: employee.code,
      employeeName: employee.name,
      department: employee.department,
      designation: employee.designation,
      dateOfJoining: employee.dateOfJoining,
      separationType,
      requestDate,
      lastWorkingDate,
      noticePeriodDays: requiredNotice,
      noticePeriodServed: noticeDays,
      noticePeriodShortfall: shortfall,
      reason,
      status: 'initiated',
      initiatedBy,
      clearances: this.createDefaultClearances(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.separations.push(separation);
    return separation;
  }

  async approveSeparation(id: string, approvedBy: string): Promise<SeparationRequest> {
    const separation = this.separations.find(s => s.id === id);
    if (!separation) throw new Error(`Separation ${id} not found`);

    separation.status = 'in_progress';
    separation.approvedBy = approvedBy;
    separation.approvalDate = new Date().toISOString();
    separation.updatedAt = new Date().toISOString();

    return separation;
  }

  async updateClearance(
    separationId: string,
    department: string,
    itemId: string,
    isCleared: boolean,
    remarks?: string
  ): Promise<DepartmentClearance> {
    const separation = this.separations.find(s => s.id === separationId);
    if (!separation) throw new Error(`Separation ${separationId} not found`);

    const clearance = separation.clearances.find(c => c.department === department);
    if (!clearance) throw new Error(`Clearance for ${department} not found`);

    const item = clearance.items.find(i => i.id === itemId);
    if (!item) throw new Error(`Clearance item ${itemId} not found`);

    item.isCleared = isCleared;
    item.clearedDate = isCleared ? new Date().toISOString() : undefined;
    item.remarks = remarks;

    // Check if all items are cleared
    if (clearance.items.every(i => i.isCleared)) {
      clearance.status = 'cleared';
      clearance.clearedDate = new Date().toISOString();
    }

    // Check if all clearances are done
    if (separation.clearances.every(c => c.status === 'cleared' || c.status === 'not_applicable')) {
      separation.status = 'pending_fnf';
    }

    separation.updatedAt = new Date().toISOString();
    return clearance;
  }

  async calculateFnF(separationId: string, calculatedBy: string): Promise<FnFSettlement> {
    const separation = this.separations.find(s => s.id === separationId);
    if (!separation) throw new Error(`Separation ${separationId} not found`);

    const employee = this.getMockEmployee(separation.employeeId);
    const breakdown: FnFBreakdownItem[] = [];

    // Calculate earnings
    const daysWorked = this.calculateDaysWorked(separation.lastWorkingDate);
    const dailyBasic = employee.basicSalary / 30;
    const basicDue = Math.round(dailyBasic * daysWorked);
    breakdown.push({
      category: 'earning',
      component: 'Basic Salary',
      description: `${daysWorked} days @ ${dailyBasic.toFixed(2)}/day`,
      amount: basicDue,
    });

    // Leave encashment
    const leaveBalance = employee.leaveBalance;
    const leaveEncashment = Math.round(leaveBalance * dailyBasic);
    breakdown.push({
      category: 'earning',
      component: 'Leave Encashment',
      description: `${leaveBalance} days @ ${dailyBasic.toFixed(2)}/day`,
      amount: leaveEncashment,
    });

    // Gratuity (if eligible - 5+ years)
    const yearsOfService = this.calculateYearsOfService(employee.dateOfJoining, separation.lastWorkingDate);
    let gratuity = 0;
    if (yearsOfService >= 5) {
      gratuity = Math.round((employee.basicSalary * 15 * yearsOfService) / 26);
      breakdown.push({
        category: 'earning',
        component: 'Gratuity',
        description: `${yearsOfService} years service (Basic × 15 × Years / 26)`,
        amount: gratuity,
      });
    }

    // Bonus (pro-rata)
    const bonusPayable = Math.round(employee.basicSalary * 0.0833 * daysWorked / 30);
    breakdown.push({
      category: 'earning',
      component: 'Bonus (Pro-rata)',
      description: 'Statutory bonus 8.33%',
      amount: bonusPayable,
    });

    const reimbursements = 5000; // Mock pending reimbursements
    breakdown.push({
      category: 'earning',
      component: 'Pending Reimbursements',
      description: 'Medical and travel claims',
      amount: reimbursements,
    });

    // Deductions
    let noticePeriodRecovery = 0;
    if (separation.noticePeriodShortfall > 0) {
      noticePeriodRecovery = Math.round(separation.noticePeriodShortfall * dailyBasic);
      breakdown.push({
        category: 'deduction',
        component: 'Notice Period Recovery',
        description: `${separation.noticePeriodShortfall} days shortfall`,
        amount: noticePeriodRecovery,
      });
    }

    const advanceRecovery = employee.advanceBalance;
    if (advanceRecovery > 0) {
      breakdown.push({
        category: 'deduction',
        component: 'Advance Recovery',
        description: 'Pending salary advance',
        amount: advanceRecovery,
      });
    }

    const loanRecovery = employee.loanBalance;
    if (loanRecovery > 0) {
      breakdown.push({
        category: 'deduction',
        component: 'Loan Recovery',
        description: 'Outstanding loan balance',
        amount: loanRecovery,
      });
    }

    // Tax deduction (simplified)
    const totalEarnings = basicDue + leaveEncashment + gratuity + bonusPayable + reimbursements;
    const taxDeduction = Math.round(totalEarnings * 0.1);
    breakdown.push({
      category: 'deduction',
      component: 'TDS',
      description: '10% tax deduction',
      amount: taxDeduction,
    });

    const totalDeductions = noticePeriodRecovery + advanceRecovery + loanRecovery + taxDeduction;

    const fnf: FnFSettlement = {
      id: uuidv4(),
      separationId,
      employeeId: separation.employeeId,
      status: 'calculated',
      basicSalaryDue: basicDue,
      leaveEncashment,
      bonusPayable,
      gratuity,
      reimbursements,
      otherEarnings: 0,
      totalEarnings,
      noticePeriodRecovery,
      advanceRecovery,
      loanRecovery,
      taxDeduction,
      otherDeductions: 0,
      totalDeductions,
      netPayable: totalEarnings - totalDeductions,
      calculatedDate: new Date().toISOString(),
      calculatedBy,
      breakdown,
    };

    separation.fnfSettlement = fnf;
    separation.updatedAt = new Date().toISOString();

    return fnf;
  }

  async approveFnF(separationId: string, approvedBy: string): Promise<FnFSettlement> {
    const separation = this.separations.find(s => s.id === separationId);
    if (!separation || !separation.fnfSettlement) {
      throw new Error('F&F settlement not found');
    }

    separation.fnfSettlement.status = 'approved';
    separation.fnfSettlement.approvedBy = approvedBy;
    separation.fnfSettlement.approvedDate = new Date().toISOString();
    separation.updatedAt = new Date().toISOString();

    return separation.fnfSettlement;
  }

  async processFnFPayment(separationId: string, paymentReference: string): Promise<FnFSettlement> {
    const separation = this.separations.find(s => s.id === separationId);
    if (!separation || !separation.fnfSettlement) {
      throw new Error('F&F settlement not found');
    }

    if (separation.fnfSettlement.status !== 'approved') {
      throw new Error('F&F must be approved before payment');
    }

    separation.fnfSettlement.status = 'paid';
    separation.fnfSettlement.paymentDate = new Date().toISOString();
    separation.fnfSettlement.paymentReference = paymentReference;
    separation.status = 'completed';
    separation.updatedAt = new Date().toISOString();

    return separation.fnfSettlement;
  }

  async conductExitInterview(
    separationId: string,
    responses: ExitInterviewResponse['responses'],
    conductedBy: string,
    additionalComments?: string
  ): Promise<ExitInterviewResponse> {
    const separation = this.separations.find(s => s.id === separationId);
    if (!separation) throw new Error(`Separation ${separationId} not found`);

    const exitResponse: ExitInterviewResponse = {
      separationId,
      responses,
      additionalComments,
      conductedDate: new Date().toISOString(),
      conductedBy,
    };

    // Calculate overall rating from rating-type questions
    const ratingResponses = responses.filter(r => typeof r.answer === 'number');
    if (ratingResponses.length > 0) {
      const sum = ratingResponses.reduce((acc, r) => acc + (r.answer as number), 0);
      exitResponse.overallRating = Math.round((sum / ratingResponses.length) * 10) / 10;
    }

    this.exitResponses.push(exitResponse);

    separation.exitInterviewDate = exitResponse.conductedDate;
    separation.exitInterviewNotes = additionalComments;
    separation.updatedAt = new Date().toISOString();

    return exitResponse;
  }

  async getSeparationsByStatus(status: SeparationStatus): Promise<SeparationRequest[]> {
    return this.separations.filter(s => s.status === status);
  }

  async getPendingClearances(): Promise<{
    separationId: string;
    employeeName: string;
    department: string;
    pendingCount: number;
  }[]> {
    const pending: {
      separationId: string;
      employeeName: string;
      department: string;
      pendingCount: number;
    }[] = [];

    for (const separation of this.separations) {
      if (separation.status !== 'in_progress') continue;

      for (const clearance of separation.clearances) {
        if (clearance.status === 'pending') {
          const pendingItems = clearance.items.filter(i => !i.isCleared).length;
          pending.push({
            separationId: separation.id,
            employeeName: separation.employeeName,
            department: clearance.department,
            pendingCount: pendingItems,
          });
        }
      }
    }

    return pending;
  }

  async getSeparationReport(): Promise<{
    total: number;
    byType: Record<string, number>;
    byStatus: Record<string, number>;
    avgNoticePeriod: number;
    totalFnFValue: number;
    pendingFnF: number;
  }> {
    const byType: Record<string, number> = {};
    const byStatus: Record<string, number> = {};
    let totalNotice = 0;
    let totalFnF = 0;
    let pendingFnF = 0;

    for (const sep of this.separations) {
      byType[sep.separationType] = (byType[sep.separationType] || 0) + 1;
      byStatus[sep.status] = (byStatus[sep.status] || 0) + 1;
      totalNotice += sep.noticePeriodServed;

      if (sep.fnfSettlement) {
        totalFnF += sep.fnfSettlement.netPayable;
        if (sep.fnfSettlement.status !== 'paid') {
          pendingFnF++;
        }
      }
    }

    return {
      total: this.separations.length,
      byType,
      byStatus,
      avgNoticePeriod: this.separations.length > 0 ? Math.round(totalNotice / this.separations.length) : 0,
      totalFnFValue: totalFnF,
      pendingFnF,
    };
  }

  private createDefaultClearances(): DepartmentClearance[] {
    return [
      {
        id: uuidv4(),
        department: 'IT',
        responsiblePerson: 'IT Manager',
        status: 'pending',
        items: [
          { id: uuidv4(), description: 'Laptop/Desktop returned', isCleared: false },
          { id: uuidv4(), description: 'Email account deactivated', isCleared: false },
          { id: uuidv4(), description: 'Access cards returned', isCleared: false },
          { id: uuidv4(), description: 'Software licenses revoked', isCleared: false },
        ],
      },
      {
        id: uuidv4(),
        department: 'Finance',
        responsiblePerson: 'Finance Manager',
        status: 'pending',
        items: [
          { id: uuidv4(), description: 'Expense claims settled', isCleared: false },
          { id: uuidv4(), description: 'Advance recovered', isCleared: false },
          { id: uuidv4(), description: 'Corporate card returned', isCleared: false },
        ],
      },
      {
        id: uuidv4(),
        department: 'Admin',
        responsiblePerson: 'Admin Manager',
        status: 'pending',
        items: [
          { id: uuidv4(), description: 'ID card returned', isCleared: false },
          { id: uuidv4(), description: 'Parking pass returned', isCleared: false },
          { id: uuidv4(), description: 'Keys returned', isCleared: false },
        ],
      },
      {
        id: uuidv4(),
        department: 'HR',
        responsiblePerson: 'HR Manager',
        status: 'pending',
        items: [
          { id: uuidv4(), description: 'Exit interview conducted', isCleared: false },
          { id: uuidv4(), description: 'Knowledge transfer completed', isCleared: false },
          { id: uuidv4(), description: 'Documents submitted', isCleared: false },
        ],
      },
    ];
  }

  private getMockEmployee(employeeId: string) {
    return {
      id: employeeId,
      code: 'EMP-001',
      name: 'John Doe',
      department: 'Engineering',
      designation: 'Senior Engineer',
      dateOfJoining: '2019-01-15',
      basicSalary: 50000,
      leaveBalance: 12,
      advanceBalance: 5000,
      loanBalance: 20000,
    };
  }

  private getRequiredNoticePeriod(designation: string): number {
    if (designation.toLowerCase().includes('senior') || designation.toLowerCase().includes('manager')) {
      return 60;
    }
    return 30;
  }

  private calculateDaysWorked(lastWorkingDate: string): number {
    const lwd = new Date(lastWorkingDate);
    const monthStart = new Date(lwd.getFullYear(), lwd.getMonth(), 1);
    return Math.ceil((lwd.getTime() - monthStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  }

  private calculateYearsOfService(joiningDate: string, lastWorkingDate: string): number {
    const start = new Date(joiningDate);
    const end = new Date(lastWorkingDate);
    return Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365));
  }

  private seedMockData(): void {
    this.exitTemplates = [
      {
        id: uuidv4(),
        name: 'Standard Exit Interview',
        isActive: true,
        questions: [
          {
            id: uuidv4(),
            question: 'How would you rate your overall experience?',
            type: 'rating',
            required: true,
          },
          {
            id: uuidv4(),
            question: 'Primary reason for leaving',
            type: 'multiple_choice',
            options: ['Better opportunity', 'Compensation', 'Work-life balance', 'Career growth', 'Relocation', 'Other'],
            required: true,
          },
          {
            id: uuidv4(),
            question: 'What could we have done better?',
            type: 'text',
            required: false,
          },
        ],
      },
    ];
  }
}
