import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shift, ShiftStatus, ShiftType } from '../entities/shift.entity';

@Injectable()
export class ShiftSeederService implements OnModuleInit {
  private readonly logger = new Logger(ShiftSeederService.name);

  constructor(
    @InjectRepository(Shift)
    private readonly shiftRepository: Repository<Shift>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seedShifts();
  }

  async seedShifts(): Promise<void> {
    this.logger.log('Seeding shifts...');

    const shifts = [
      {
        code: 'GENERAL',
        name: 'General Shift',
        description: 'Standard office hours shift for administrative and management staff.',
        type: ShiftType.GENERAL,
        startTime: '09:00:00',
        endTime: '18:00:00',
        workingHours: 8,
        breakStartTime: '13:00:00',
        breakEndTime: '14:00:00',
        breakHours: 1,
        graceMinutes: 15,
        lateMarkAfterMinutes: 30,
        halfDayAfterMinutes: 120,
        absentAfterMinutes: 240,
        workingDays: [1, 2, 3, 4, 5], // Monday to Friday
        allowOvertime: true,
        overtimeMultiplier: 1.5,
        isNightShift: false,
        nightShiftAllowance: 0,
        status: ShiftStatus.ACTIVE,
        createdBy: 'system',
      },
      {
        code: 'MORNING',
        name: 'Morning Shift',
        description: 'Early morning shift for production staff.',
        type: ShiftType.ROTATING,
        startTime: '06:00:00',
        endTime: '14:00:00',
        workingHours: 7.5,
        breakStartTime: '10:00:00',
        breakEndTime: '10:30:00',
        breakHours: 0.5,
        graceMinutes: 10,
        lateMarkAfterMinutes: 20,
        halfDayAfterMinutes: 120,
        absentAfterMinutes: 240,
        workingDays: [1, 2, 3, 4, 5, 6], // Monday to Saturday
        allowOvertime: true,
        overtimeMultiplier: 1.5,
        isNightShift: false,
        nightShiftAllowance: 0,
        status: ShiftStatus.ACTIVE,
        createdBy: 'system',
      },
      {
        code: 'EVENING',
        name: 'Evening Shift',
        description: 'Afternoon to evening shift for production staff.',
        type: ShiftType.ROTATING,
        startTime: '14:00:00',
        endTime: '22:00:00',
        workingHours: 7.5,
        breakStartTime: '18:00:00',
        breakEndTime: '18:30:00',
        breakHours: 0.5,
        graceMinutes: 10,
        lateMarkAfterMinutes: 20,
        halfDayAfterMinutes: 120,
        absentAfterMinutes: 240,
        workingDays: [1, 2, 3, 4, 5, 6], // Monday to Saturday
        allowOvertime: true,
        overtimeMultiplier: 1.5,
        isNightShift: false,
        nightShiftAllowance: 0,
        status: ShiftStatus.ACTIVE,
        createdBy: 'system',
      },
      {
        code: 'NIGHT',
        name: 'Night Shift',
        description: 'Overnight shift for continuous production operations.',
        type: ShiftType.NIGHT,
        startTime: '22:00:00',
        endTime: '06:00:00',
        workingHours: 7.5,
        breakStartTime: '02:00:00',
        breakEndTime: '02:30:00',
        breakHours: 0.5,
        graceMinutes: 10,
        lateMarkAfterMinutes: 20,
        halfDayAfterMinutes: 120,
        absentAfterMinutes: 240,
        workingDays: [1, 2, 3, 4, 5, 6], // Monday to Saturday
        allowOvertime: true,
        overtimeMultiplier: 2.0,
        isNightShift: true,
        nightShiftAllowance: 200,
        status: ShiftStatus.ACTIVE,
        createdBy: 'system',
      },
    ];

    for (const shift of shifts) {
      try {
        const existing = await this.shiftRepository.findOne({
          where: { code: shift.code },
        });
        if (!existing) {
          await this.shiftRepository.save(shift);
          this.logger.log(`Created shift: ${shift.name}`);
        }
      } catch (error) {
        this.logger.error(`Failed to seed shift ${shift.name}: ${error.message}`);
      }
    }

    this.logger.log('Shifts seeding completed');
  }
}
