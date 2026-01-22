import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from '../entities/department.entity';
import { Designation } from '../entities/designation.entity';
import { LeaveType } from '../entities/leave-type.entity';
import { Shift } from '../entities/shift.entity';
import {
  DEFAULT_DEPARTMENTS,
  DEFAULT_DESIGNATIONS,
  DEFAULT_LEAVE_TYPES,
  DEFAULT_SHIFTS,
  DefaultDepartment,
  DefaultDesignation,
  DefaultLeaveType,
  DefaultShift,
} from '../data/default-hr-masters.data';

@Injectable()
export class HRSeederService implements OnModuleInit {
  private readonly logger = new Logger(HRSeederService.name);

  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
    @InjectRepository(Designation)
    private readonly designationRepository: Repository<Designation>,
    @InjectRepository(LeaveType)
    private readonly leaveTypeRepository: Repository<LeaveType>,
    @InjectRepository(Shift)
    private readonly shiftRepository: Repository<Shift>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seedAll();
  }

  async seedAll(): Promise<{
    departments: { created: number; skipped: number; errors: number };
    designations: { created: number; skipped: number; errors: number };
    leaveTypes: { created: number; skipped: number; errors: number };
    shifts: { created: number; skipped: number; errors: number };
  }> {
    this.logger.log('Starting HR module seeding...');

    const departmentsResult = await this.seedDepartments();
    const designationsResult = await this.seedDesignations();
    const leaveTypesResult = await this.seedLeaveTypes();
    const shiftsResult = await this.seedShifts();

    this.logger.log('HR module seeding completed');

    return {
      departments: departmentsResult,
      designations: designationsResult,
      leaveTypes: leaveTypesResult,
      shifts: shiftsResult,
    };
  }

  async seedDepartments(): Promise<{ created: number; skipped: number; errors: number }> {
    this.logger.log('Seeding departments...');

    const result = { created: 0, skipped: 0, errors: 0 };
    const departmentCodeToIdMap = new Map<string, string>();

    // First, get all existing departments
    const existingDepartments = await this.departmentRepository.find();
    for (const dept of existingDepartments) {
      departmentCodeToIdMap.set(dept.code, dept.id);
    }

    // Sort by whether they have parent or not (root departments first)
    const sortedDepartments = [...DEFAULT_DEPARTMENTS].sort((a, b) => {
      if (!a.parentDepartmentCode && b.parentDepartmentCode) return -1;
      if (a.parentDepartmentCode && !b.parentDepartmentCode) return 1;
      return 0;
    });

    for (const defaultDept of sortedDepartments) {
      try {
        const existing = await this.departmentRepository.findOne({
          where: { code: defaultDept.code },
        });

        if (existing) {
          departmentCodeToIdMap.set(defaultDept.code, existing.id);
          result.skipped++;
          continue;
        }

        // Resolve parent department ID
        let parentDepartmentId: string | undefined;
        if (defaultDept.parentDepartmentCode) {
          parentDepartmentId = departmentCodeToIdMap.get(defaultDept.parentDepartmentCode);
          if (!parentDepartmentId) {
            this.logger.warn(
              `Parent department not found for ${defaultDept.code}: ${defaultDept.parentDepartmentCode}`,
            );
            result.errors++;
            continue;
          }
        }

        const department = this.departmentRepository.create({
          code: defaultDept.code,
          name: defaultDept.name,
          description: defaultDept.description,
          parentDepartmentId: parentDepartmentId,
          location: defaultDept.location,
          email: defaultDept.email,
          phone: defaultDept.phone,
          status: defaultDept.status,
          createdBy: 'SYSTEM_SEEDER',
        });

        const savedDept = await this.departmentRepository.save(department);
        departmentCodeToIdMap.set(defaultDept.code, savedDept.id);
        result.created++;

        this.logger.debug(`Created department: ${defaultDept.name}`);
      } catch (error) {
        this.logger.error(
          `Error creating department ${defaultDept.code}: ${error.message}`,
        );
        result.errors++;
      }
    }

    this.logger.log(
      `Departments seeding completed. Created: ${result.created}, Skipped: ${result.skipped}, Errors: ${result.errors}`,
    );
    return result;
  }

  async seedDesignations(): Promise<{ created: number; skipped: number; errors: number }> {
    this.logger.log('Seeding designations...');

    const result = { created: 0, skipped: 0, errors: 0 };
    const designationCodeToIdMap = new Map<string, string>();

    // First, get all existing designations
    const existingDesignations = await this.designationRepository.find();
    for (const desig of existingDesignations) {
      designationCodeToIdMap.set(desig.code, desig.id);
    }

    // Sort by whether they have reportsTo or not (top-level first)
    const sortedDesignations = [...DEFAULT_DESIGNATIONS].sort((a, b) => {
      if (!a.reportsToCode && b.reportsToCode) return -1;
      if (a.reportsToCode && !b.reportsToCode) return 1;
      return (b.gradeLevel || 0) - (a.gradeLevel || 0);
    });

    for (const defaultDesig of sortedDesignations) {
      try {
        const existing = await this.designationRepository.findOne({
          where: { code: defaultDesig.code },
        });

        if (existing) {
          designationCodeToIdMap.set(defaultDesig.code, existing.id);
          result.skipped++;
          continue;
        }

        // Resolve reportsTo ID
        let reportsTo: string | undefined;
        if (defaultDesig.reportsToCode) {
          reportsTo = designationCodeToIdMap.get(defaultDesig.reportsToCode);
          // It's OK if reportsTo is not found - it might be created later
        }

        const designation = this.designationRepository.create({
          code: defaultDesig.code,
          title: defaultDesig.title,
          description: defaultDesig.description,
          level: defaultDesig.level,
          reportsTo: reportsTo,
          reportsToTitle: defaultDesig.reportsToCode,
          gradeLevel: defaultDesig.gradeLevel,
          minSalary: defaultDesig.minSalary,
          maxSalary: defaultDesig.maxSalary,
          responsibilities: defaultDesig.responsibilities,
          requiredSkills: defaultDesig.requiredSkills,
          qualifications: defaultDesig.qualifications,
          minExperience: defaultDesig.minExperience,
          status: defaultDesig.status,
          createdBy: 'SYSTEM_SEEDER',
        });

        const savedDesig = await this.designationRepository.save(designation);
        designationCodeToIdMap.set(defaultDesig.code, savedDesig.id);
        result.created++;

        this.logger.debug(`Created designation: ${defaultDesig.title}`);
      } catch (error) {
        this.logger.error(
          `Error creating designation ${defaultDesig.code}: ${error.message}`,
        );
        result.errors++;
      }
    }

    this.logger.log(
      `Designations seeding completed. Created: ${result.created}, Skipped: ${result.skipped}, Errors: ${result.errors}`,
    );
    return result;
  }

  async seedLeaveTypes(): Promise<{ created: number; skipped: number; errors: number }> {
    this.logger.log('Seeding leave types...');

    const result = { created: 0, skipped: 0, errors: 0 };

    for (const defaultLeaveType of DEFAULT_LEAVE_TYPES) {
      try {
        const existing = await this.leaveTypeRepository.findOne({
          where: { code: defaultLeaveType.code },
        });

        if (existing) {
          result.skipped++;
          continue;
        }

        const leaveType = this.leaveTypeRepository.create({
          code: defaultLeaveType.code,
          name: defaultLeaveType.name,
          description: defaultLeaveType.description,
          isPaid: defaultLeaveType.isPaid,
          maxDaysPerYear: defaultLeaveType.maxDaysPerYear,
          minDaysPerApplication: defaultLeaveType.minDaysPerApplication,
          maxDaysPerApplication: defaultLeaveType.maxDaysPerApplication,
          maxCarryForward: defaultLeaveType.maxCarryForward,
          allowCarryForward: defaultLeaveType.allowCarryForward,
          allowEncashment: defaultLeaveType.allowEncashment,
          maxEncashmentDays: defaultLeaveType.maxEncashmentDays,
          requiresApproval: defaultLeaveType.requiresApproval,
          requiresDocument: defaultLeaveType.requiresDocument,
          minAdvanceNoticeDays: defaultLeaveType.minAdvanceNoticeDays,
          maxBackdatedDays: defaultLeaveType.maxBackdatedDays,
          accrualType: defaultLeaveType.accrualType,
          accrualRate: defaultLeaveType.accrualRate,
          allowHalfDay: defaultLeaveType.allowHalfDay,
          allowNegativeBalance: defaultLeaveType.allowNegativeBalance,
          includeHolidays: defaultLeaveType.includeHolidays,
          includeWeekends: defaultLeaveType.includeWeekends,
          applicableAfterMonths: defaultLeaveType.applicableAfterMonths,
          displayOrder: defaultLeaveType.displayOrder,
          color: defaultLeaveType.color,
          status: defaultLeaveType.status,
          createdBy: 'SYSTEM_SEEDER',
        });

        await this.leaveTypeRepository.save(leaveType);
        result.created++;

        this.logger.debug(`Created leave type: ${defaultLeaveType.name}`);
      } catch (error) {
        this.logger.error(
          `Error creating leave type ${defaultLeaveType.code}: ${error.message}`,
        );
        result.errors++;
      }
    }

    this.logger.log(
      `Leave types seeding completed. Created: ${result.created}, Skipped: ${result.skipped}, Errors: ${result.errors}`,
    );
    return result;
  }

  async seedShifts(): Promise<{ created: number; skipped: number; errors: number }> {
    this.logger.log('Seeding shifts...');

    const result = { created: 0, skipped: 0, errors: 0 };

    for (const defaultShift of DEFAULT_SHIFTS) {
      try {
        const existing = await this.shiftRepository.findOne({
          where: { code: defaultShift.code },
        });

        if (existing) {
          result.skipped++;
          continue;
        }

        const shift = this.shiftRepository.create({
          code: defaultShift.code,
          name: defaultShift.name,
          description: defaultShift.description,
          type: defaultShift.type,
          startTime: defaultShift.startTime,
          endTime: defaultShift.endTime,
          workingHours: defaultShift.workingHours,
          breakStartTime: defaultShift.breakStartTime,
          breakEndTime: defaultShift.breakEndTime,
          breakHours: defaultShift.breakHours,
          graceMinutes: defaultShift.graceMinutes,
          lateMarkAfterMinutes: defaultShift.lateMarkAfterMinutes,
          halfDayAfterMinutes: defaultShift.halfDayAfterMinutes,
          absentAfterMinutes: defaultShift.absentAfterMinutes,
          workingDays: defaultShift.workingDays,
          allowOvertime: defaultShift.allowOvertime,
          overtimeMultiplier: defaultShift.overtimeMultiplier,
          isNightShift: defaultShift.isNightShift,
          nightShiftAllowance: defaultShift.nightShiftAllowance,
          status: defaultShift.status,
          createdBy: 'SYSTEM_SEEDER',
        });

        await this.shiftRepository.save(shift);
        result.created++;

        this.logger.debug(`Created shift: ${defaultShift.name}`);
      } catch (error) {
        this.logger.error(
          `Error creating shift ${defaultShift.code}: ${error.message}`,
        );
        result.errors++;
      }
    }

    this.logger.log(
      `Shifts seeding completed. Created: ${result.created}, Skipped: ${result.skipped}, Errors: ${result.errors}`,
    );
    return result;
  }

  getStats(): {
    departments: number;
    designations: number;
    leaveTypes: number;
    shifts: number;
  } {
    return {
      departments: DEFAULT_DEPARTMENTS.length,
      designations: DEFAULT_DESIGNATIONS.length,
      leaveTypes: DEFAULT_LEAVE_TYPES.length,
      shifts: DEFAULT_SHIFTS.length,
    };
  }
}
