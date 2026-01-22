/**
 * HR API Service
 * Wires frontend to backend HR module APIs
 */

import apiClient from '@/lib/api-client';

// ============================================
// TYPES
// ============================================

export interface Employee {
  id: string;
  employeeCode: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  fullName: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  maritalStatus: 'Single' | 'Married' | 'Divorced' | 'Widowed';
  personalEmail: string;
  companyEmail?: string;
  mobileNumber: string;
  currentAddress: string;
  departmentId: string;
  departmentName?: string;
  designationId: string;
  designationTitle?: string;
  employmentType: 'Full Time' | 'Part Time' | 'Contract' | 'Intern' | 'Consultant' | 'Temporary';
  joiningDate: string;
  confirmationDate?: string;
  reportingManagerId?: string;
  reportingManagerName?: string;
  shiftId?: string;
  workLocation?: string;
  basicSalary: number;
  grossSalary: number;
  status: 'Active' | 'On Leave' | 'On Probation' | 'Suspended' | 'Resigned' | 'Terminated' | 'Retired';
  profilePhotoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeeDto {
  employeeCode: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  maritalStatus?: 'Single' | 'Married' | 'Divorced' | 'Widowed';
  personalEmail: string;
  mobileNumber: string;
  currentAddress: string;
  departmentId: string;
  designationId: string;
  employmentType: 'Full Time' | 'Part Time' | 'Contract' | 'Intern' | 'Consultant' | 'Temporary';
  joiningDate: string;
  reportingManagerId?: string;
  shiftId?: string;
  basicSalary: number;
  grossSalary: number;
}

export interface Department {
  id: string;
  code: string;
  name: string;
  description?: string;
  parentDepartmentId?: string;
  headOfDepartmentId?: string;
  headOfDepartmentName?: string;
  location?: string;
  email?: string;
  phone?: string;
  status: 'Active' | 'Inactive';
  employeeCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Designation {
  id: string;
  code: string;
  title: string;
  description?: string;
  level: string;
  reportsTo?: string;
  gradeLevel: number;
  minSalary?: number;
  maxSalary?: number;
  responsibilities?: string[];
  requiredSkills?: string[];
  status: 'Active' | 'Inactive';
  createdAt: string;
  updatedAt: string;
}

export interface LeaveType {
  id: string;
  code: string;
  name: string;
  description?: string;
  isPaid: boolean;
  maxDaysPerYear: number;
  allowCarryForward: boolean;
  maxCarryForward: number;
  allowEncashment: boolean;
  requiresApproval: boolean;
  requiresDocument: boolean;
  allowHalfDay: boolean;
  color?: string;
  status: 'Active' | 'Inactive';
}

export interface LeaveApplication {
  id: string;
  applicationNumber: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  leaveTypeId: string;
  leaveTypeName: string;
  fromDate: string;
  toDate: string;
  numberOfDays: number;
  isHalfDay: boolean;
  halfDayType?: 'First Half' | 'Second Half';
  reason: string;
  status: 'Draft' | 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
  approverId?: string;
  approverName?: string;
  approvalDate?: string;
  approvalComments?: string;
  attachments?: { fileName: string; fileUrl: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface LeaveBalance {
  id: string;
  employeeId: string;
  leaveTypeId: string;
  leaveTypeCode: string;
  leaveTypeName: string;
  year: number;
  openingBalance: number;
  accrued: number;
  taken: number;
  pending: number;
  adjusted: number;
  carryForward: number;
  encashed: number;
  balance: number;
}

export interface Attendance {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  date: string;
  shiftId?: string;
  shiftName?: string;
  checkInTime?: string;
  checkOutTime?: string;
  workingHours?: number;
  overtimeHours?: number;
  status: 'Present' | 'Absent' | 'Half Day' | 'On Leave' | 'Holiday' | 'Weekend' | 'Late';
  lateMinutes?: number;
  earlyLeaveMinutes?: number;
  remarks?: string;
}

export interface Shift {
  id: string;
  code: string;
  name: string;
  description?: string;
  type: 'General' | 'Rotating' | 'Flexible' | 'Night';
  startTime: string;
  endTime: string;
  workingHours: number;
  breakHours: number;
  graceMinutes: number;
  workingDays: string[];
  allowOvertime: boolean;
  overtimeMultiplier: number;
  isNightShift: boolean;
  status: 'Active' | 'Inactive';
}

export interface Payroll {
  id: string;
  payrollNumber: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  month: number;
  year: number;
  basicSalary: number;
  grossSalary: number;
  totalEarnings: number;
  totalDeductions: number;
  netSalary: number;
  paymentDate?: string;
  paymentMode?: string;
  paymentReference?: string;
  status: 'Draft' | 'Calculated' | 'Approved' | 'Paid' | 'Cancelled';
  earnings: PayrollComponent[];
  deductions: PayrollComponent[];
  createdAt: string;
  updatedAt: string;
}

export interface PayrollComponent {
  componentId: string;
  componentName: string;
  componentType: 'Earning' | 'Deduction';
  amount: number;
  isFixed: boolean;
}

export interface SalarySlip {
  id: string;
  slipNumber: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  departmentName: string;
  designationTitle: string;
  month: number;
  year: number;
  paymentDate: string;
  workingDays: number;
  presentDays: number;
  leaveDays: number;
  basicSalary: number;
  earnings: PayrollComponent[];
  deductions: PayrollComponent[];
  totalEarnings: number;
  totalDeductions: number;
  netSalary: number;
  netSalaryInWords: string;
  bankName?: string;
  accountNumber?: string;
}

// ============================================
// EMPLOYEE API
// ============================================

export const employeeApi = {
  async getAll(filters?: {
    departmentId?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: Employee[]; total: number }> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }
    const response = await apiClient.get(`/hr/employees?${params.toString()}`);
    return response.data;
  },

  async getById(id: string): Promise<Employee> {
    const response = await apiClient.get(`/hr/employees/${id}`);
    return response.data;
  },

  async create(data: CreateEmployeeDto): Promise<Employee> {
    const response = await apiClient.post('/hr/employees', data);
    return response.data;
  },

  async update(id: string, data: Partial<CreateEmployeeDto>): Promise<Employee> {
    const response = await apiClient.put(`/hr/employees/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/hr/employees/${id}`);
  },

  async getActiveCount(): Promise<{ count: number }> {
    const response = await apiClient.get('/hr/employees/active/count');
    return response.data;
  },

  async getByDepartment(departmentId: string): Promise<Employee[]> {
    const response = await apiClient.get(`/hr/employees/department/${departmentId}`);
    return response.data;
  },

  async onboard(id: string, data: { confirmationDate?: string }): Promise<Employee> {
    const response = await apiClient.post(`/hr/employees/${id}/onboard`, data);
    return response.data;
  },

  async confirm(id: string): Promise<Employee> {
    const response = await apiClient.post(`/hr/employees/${id}/confirm`);
    return response.data;
  },

  async transfer(
    id: string,
    data: { newDepartmentId: string; newDesignationId?: string; effectiveDate: string; reason?: string },
  ): Promise<Employee> {
    const response = await apiClient.post(`/hr/employees/${id}/transfer`, data);
    return response.data;
  },

  async promote(
    id: string,
    data: { newDesignationId: string; newSalary?: number; effectiveDate: string; reason?: string },
  ): Promise<Employee> {
    const response = await apiClient.post(`/hr/employees/${id}/promote`, data);
    return response.data;
  },

  async terminate(
    id: string,
    data: { lastWorkingDay: string; reason: string; notes?: string },
  ): Promise<Employee> {
    const response = await apiClient.post(`/hr/employees/${id}/terminate`, data);
    return response.data;
  },

  async resign(
    id: string,
    data: { lastWorkingDay: string; reason: string; notes?: string },
  ): Promise<Employee> {
    const response = await apiClient.post(`/hr/employees/${id}/resign`, data);
    return response.data;
  },
};

// ============================================
// DEPARTMENT API
// ============================================

export const departmentApi = {
  async getAll(): Promise<Department[]> {
    const response = await apiClient.get('/hr/departments');
    return response.data;
  },

  async getById(id: string): Promise<Department> {
    const response = await apiClient.get(`/hr/departments/${id}`);
    return response.data;
  },

  async create(data: Partial<Department>): Promise<Department> {
    const response = await apiClient.post('/hr/departments', data);
    return response.data;
  },

  async update(id: string, data: Partial<Department>): Promise<Department> {
    const response = await apiClient.put(`/hr/departments/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/hr/departments/${id}`);
  },
};

// ============================================
// DESIGNATION API
// ============================================

export const designationApi = {
  async getAll(): Promise<Designation[]> {
    const response = await apiClient.get('/hr/designations');
    return response.data;
  },

  async getById(id: string): Promise<Designation> {
    const response = await apiClient.get(`/hr/designations/${id}`);
    return response.data;
  },

  async create(data: Partial<Designation>): Promise<Designation> {
    const response = await apiClient.post('/hr/designations', data);
    return response.data;
  },

  async update(id: string, data: Partial<Designation>): Promise<Designation> {
    const response = await apiClient.put(`/hr/designations/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/hr/designations/${id}`);
  },
};

// ============================================
// LEAVE API
// ============================================

export const leaveTypeApi = {
  async getAll(): Promise<LeaveType[]> {
    const response = await apiClient.get('/hr/leave-types');
    return response.data;
  },

  async getById(id: string): Promise<LeaveType> {
    const response = await apiClient.get(`/hr/leave-types/${id}`);
    return response.data;
  },

  async create(data: Partial<LeaveType>): Promise<LeaveType> {
    const response = await apiClient.post('/hr/leave-types', data);
    return response.data;
  },

  async update(id: string, data: Partial<LeaveType>): Promise<LeaveType> {
    const response = await apiClient.put(`/hr/leave-types/${id}`, data);
    return response.data;
  },
};

export const leaveApplicationApi = {
  async getAll(filters?: {
    employeeId?: string;
    leaveTypeId?: string;
    status?: string;
    fromDate?: string;
    toDate?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: LeaveApplication[]; total: number }> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }
    const response = await apiClient.get(`/hr/leave-applications?${params.toString()}`);
    return response.data;
  },

  async getById(id: string): Promise<LeaveApplication> {
    const response = await apiClient.get(`/hr/leave-applications/${id}`);
    return response.data;
  },

  async create(data: {
    leaveTypeId: string;
    fromDate: string;
    toDate: string;
    isHalfDay?: boolean;
    halfDayType?: 'First Half' | 'Second Half';
    reason: string;
  }): Promise<LeaveApplication> {
    const response = await apiClient.post('/hr/leave-applications', data);
    return response.data;
  },

  async approve(id: string, comments?: string): Promise<LeaveApplication> {
    const response = await apiClient.post(`/hr/leave-applications/${id}/approve`, { comments });
    return response.data;
  },

  async reject(id: string, comments: string): Promise<LeaveApplication> {
    const response = await apiClient.post(`/hr/leave-applications/${id}/reject`, { comments });
    return response.data;
  },

  async cancel(id: string): Promise<LeaveApplication> {
    const response = await apiClient.post(`/hr/leave-applications/${id}/cancel`);
    return response.data;
  },
};

export const leaveBalanceApi = {
  async getByEmployee(employeeId: string, year?: number): Promise<LeaveBalance[]> {
    const params = year ? `?year=${year}` : '';
    const response = await apiClient.get(`/hr/leave-balance/employee/${employeeId}${params}`);
    return response.data;
  },

  async getAll(filters?: { year?: number; departmentId?: string }): Promise<LeaveBalance[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }
    const response = await apiClient.get(`/hr/leave-balance?${params.toString()}`);
    return response.data;
  },
};

// ============================================
// ATTENDANCE API
// ============================================

export const attendanceApi = {
  async getAll(filters?: {
    employeeId?: string;
    departmentId?: string;
    fromDate?: string;
    toDate?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: Attendance[]; total: number }> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }
    const response = await apiClient.get(`/hr/attendance?${params.toString()}`);
    return response.data;
  },

  async markAttendance(data: {
    employeeId: string;
    date: string;
    checkInTime?: string;
    checkOutTime?: string;
    status: string;
    remarks?: string;
  }): Promise<Attendance> {
    const response = await apiClient.post('/hr/attendance', data);
    return response.data;
  },

  async bulkImport(
    data: {
      employeeId: string;
      date: string;
      checkInTime?: string;
      checkOutTime?: string;
      status: string;
    }[],
  ): Promise<{ success: number; failed: number; errors: string[] }> {
    const response = await apiClient.post('/hr/attendance/bulk-import', { records: data });
    return response.data;
  },

  async getMonthlyReport(
    employeeId: string,
    month: number,
    year: number,
  ): Promise<{
    employee: Employee;
    summary: {
      totalDays: number;
      presentDays: number;
      absentDays: number;
      leaveDays: number;
      lateDays: number;
      totalWorkingHours: number;
      overtimeHours: number;
    };
    records: Attendance[];
  }> {
    const response = await apiClient.get(
      `/hr/attendance/report/monthly?employeeId=${employeeId}&month=${month}&year=${year}`,
    );
    return response.data;
  },
};

// ============================================
// SHIFT API
// ============================================

export const shiftApi = {
  async getAll(): Promise<Shift[]> {
    const response = await apiClient.get('/hr/shifts');
    return response.data;
  },

  async getById(id: string): Promise<Shift> {
    const response = await apiClient.get(`/hr/shifts/${id}`);
    return response.data;
  },

  async create(data: Partial<Shift>): Promise<Shift> {
    const response = await apiClient.post('/hr/shifts', data);
    return response.data;
  },

  async update(id: string, data: Partial<Shift>): Promise<Shift> {
    const response = await apiClient.put(`/hr/shifts/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/hr/shifts/${id}`);
  },
};

// ============================================
// PAYROLL API
// ============================================

export const payrollApi = {
  async getAll(filters?: {
    month?: number;
    year?: number;
    departmentId?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: Payroll[]; total: number }> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }
    const response = await apiClient.get(`/hr/payroll?${params.toString()}`);
    return response.data;
  },

  async getById(id: string): Promise<Payroll> {
    const response = await apiClient.get(`/hr/payroll/${id}`);
    return response.data;
  },

  async processPayroll(data: {
    month: number;
    year: number;
    departmentId?: string;
    employeeIds?: string[];
  }): Promise<{ processed: number; errors: string[] }> {
    const response = await apiClient.post('/hr/payroll/process', data);
    return response.data;
  },

  async approve(id: string): Promise<Payroll> {
    const response = await apiClient.post(`/hr/payroll/${id}/approve`);
    return response.data;
  },

  async generateSalarySlip(payrollId: string): Promise<SalarySlip> {
    const response = await apiClient.post(`/hr/payroll/${payrollId}/salary-slip`);
    return response.data;
  },

  async getSalarySlip(employeeId: string, month: number, year: number): Promise<SalarySlip> {
    const response = await apiClient.get(
      `/hr/salary-slips?employeeId=${employeeId}&month=${month}&year=${year}`,
    );
    return response.data;
  },
};

// Export all APIs as a single object
export const hrService = {
  employees: employeeApi,
  departments: departmentApi,
  designations: designationApi,
  leaveTypes: leaveTypeApi,
  leaveApplications: leaveApplicationApi,
  leaveBalances: leaveBalanceApi,
  attendance: attendanceApi,
  shifts: shiftApi,
  payroll: payrollApi,
};

export default hrService;
