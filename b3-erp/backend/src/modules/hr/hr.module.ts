import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import {
  Department,
  Designation,
  Shift,
  Holiday,
  Employee,
  LeaveType,
  LeaveBalance,
  LeaveApplication,
  Attendance,
  SalaryStructure,
  Payroll,
  SalarySlip,
  PerformanceReview,
  SkillCategory,
  Skill,
  ProficiencyLevel,
  UserSkill,
  SkillGap,
} from './entities';

// Controllers
import {
  DepartmentController,
  DesignationController,
  ShiftController,
  HolidayController,
  EmployeeController,
  LeaveTypeController,
  LeaveBalanceController,
  LeaveApplicationController,
  AttendanceController,
  SalaryStructureController,
  PayrollController,
  SalarySlipController,
  PerformanceReviewController,
  SkillCategoryController,
  SkillController,
  ProficiencyLevelController,
  UserSkillController,
  SkillGapController,
} from './controllers';

// Services
import {
  DepartmentService,
  DesignationService,
  ShiftService,
  HolidayService,
  EmployeeService,
  LeaveTypeService,
  LeaveBalanceService,
  LeaveApplicationService,
  AttendanceService,
  SalaryStructureService,
  PayrollService,
  SalarySlipService,
  PerformanceReviewService,
  SkillCategoryService,
  SkillService,
  ProficiencyLevelService,
  UserSkillService,
  SkillGapService,
} from './services';
import { OnboardingWorkflowService } from './services/onboarding-workflow.service';
import { SeparationService } from './services/separation.service';
import { TrainingService } from './services/training.service';
import { SkillSeederService } from './services/skill-seeder.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      // Core HR
      Department,
      Designation,
      Shift,
      Holiday,

      // Employee Management
      Employee,

      // Leave Management
      LeaveType,
      LeaveBalance,
      LeaveApplication,

      // Attendance Management
      Attendance,

      // Payroll Management
      SalaryStructure,
      Payroll,
      SalarySlip,

      // Performance Management
      PerformanceReview,

      // Skill Management
      SkillCategory,
      Skill,
      ProficiencyLevel,
      UserSkill,
      SkillGap,
    ]),
  ],
  controllers: [
    DepartmentController,
    DesignationController,
    ShiftController,
    HolidayController,
    EmployeeController,
    LeaveTypeController,
    LeaveBalanceController,
    LeaveApplicationController,
    AttendanceController,
    SalaryStructureController,
    PayrollController,
    SalarySlipController,
    PerformanceReviewController,
    SkillCategoryController,
    SkillController,
    ProficiencyLevelController,
    UserSkillController,
    SkillGapController,
  ],
  providers: [
    DepartmentService,
    DesignationService,
    ShiftService,
    HolidayService,
    EmployeeService,
    LeaveTypeService,
    LeaveBalanceService,
    LeaveApplicationService,
    AttendanceService,
    SalaryStructureService,
    PayrollService,
    SalarySlipService,
    PerformanceReviewService,
    OnboardingWorkflowService,
    SeparationService,
    TrainingService,
    SkillCategoryService,
    SkillService,
    ProficiencyLevelService,
    UserSkillService,
    SkillGapService,
    SkillSeederService,
  ],
  exports: [
    DepartmentService,
    DesignationService,
    ShiftService,
    HolidayService,
    EmployeeService,
    LeaveTypeService,
    LeaveBalanceService,
    LeaveApplicationService,
    AttendanceService,
    SalaryStructureService,
    PayrollService,
    SalarySlipService,
    PerformanceReviewService,
    OnboardingWorkflowService,
    SeparationService,
    TrainingService,
    SkillCategoryService,
    SkillService,
    ProficiencyLevelService,
    UserSkillService,
    SkillGapService,
  ],
})
export class HrModule {}
