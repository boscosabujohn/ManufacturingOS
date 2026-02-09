import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from '../entities/attendance.entity';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly repository: Repository<Attendance>,
  ) { }

  async create(createDto: any): Promise<any> {
    const entity = this.repository.create(createDto) as unknown as Attendance;
    if (!entity.workingHours && entity.checkInTime && entity.checkOutTime) {
      entity.workingHours = this.calculateWorkingHours(entity.checkInTime, entity.checkOutTime);
    }
    return await this.repository.save(entity);
  }

  async syncBiometricLogs(deviceId: string, logs: any[]): Promise<any> {
    const results = [];
    for (const log of logs) {
      let attendance = await this.repository.findOne({
        where: { employeeId: log.employeeId, date: log.date },
      });

      if (!attendance) {
        attendance = this.repository.create({
          employeeId: log.employeeId,
          date: log.date,
          status: 'Present' as any,
          isManualEntry: false,
          deviceId: deviceId,
          biometricLogs: [],
        });
      }

      attendance.biometricLogs = attendance.biometricLogs || [];
      attendance.biometricLogs.push({
        time: log.time,
        type: log.type,
        deviceId: deviceId,
      });

      if (log.type === 'IN' && (!attendance.checkInTime || log.time < attendance.checkInTime)) {
        attendance.checkInTime = log.time;
      }
      if (log.type === 'OUT' && (!attendance.checkOutTime || log.time > attendance.checkOutTime)) {
        attendance.checkOutTime = log.time;
      }

      if (attendance.checkInTime && attendance.checkOutTime) {
        attendance.workingHours = this.calculateWorkingHours(attendance.checkInTime, attendance.checkOutTime);
      }

      results.push(await this.repository.save(attendance));
    }
    return results;
  }

  private calculateWorkingHours(checkIn: string, checkOut: string): number {
    const [inH, inM] = checkIn.split(':').map(Number);
    const [outH, outM] = checkOut.split(':').map(Number);
    const totalMinutes = (outH * 60 + outM) - (inH * 60 + inM);
    return Math.max(0, Number((totalMinutes / 60).toFixed(2)));
  }

  async findAll(filters?: any): Promise<any[]> {
    const query = this.repository.createQueryBuilder('entity');

    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          query.andWhere(`entity.${key} = :${key}`, { [key]: filters[key] });
        }
      });
    }

    return await query.getMany();
  }

  async findOne(id: string): Promise<any> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException(`Attendance with ID ${id} not found`);
    }
    return entity;
  }

  async update(id: string, updateDto: any): Promise<any> {
    const entity = await this.findOne(id);
    Object.assign(entity, updateDto);
    return await this.repository.save(entity);
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);
    await this.repository.remove(entity);
  }
}
