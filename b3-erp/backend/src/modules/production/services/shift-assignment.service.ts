import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShiftAssignment, AssignmentStatus } from '../entities/shift-assignment.entity';

@Injectable()
export class ShiftAssignmentService {
  constructor(
    @InjectRepository(ShiftAssignment)
    private readonly shiftAssignmentRepository: Repository<ShiftAssignment>,
  ) {}

  async create(createDto: Partial<ShiftAssignment>): Promise<ShiftAssignment> {
    const assignment = this.shiftAssignmentRepository.create(createDto);
    return this.shiftAssignmentRepository.save(assignment);
  }

  async findAll(filters?: {
    companyId?: string;
    status?: AssignmentStatus;
    employeeId?: string;
    shiftId?: string;
    assignmentDate?: Date;
  }): Promise<ShiftAssignment[]> {
    const query = this.shiftAssignmentRepository.createQueryBuilder('assignment');

    if (filters?.companyId) {
      query.andWhere('assignment.companyId = :companyId', { companyId: filters.companyId });
    }

    if (filters?.status) {
      query.andWhere('assignment.status = :status', { status: filters.status });
    }

    if (filters?.employeeId) {
      query.andWhere('assignment.employeeId = :employeeId', { employeeId: filters.employeeId });
    }

    if (filters?.shiftId) {
      query.andWhere('assignment.shiftId = :shiftId', { shiftId: filters.shiftId });
    }

    if (filters?.assignmentDate) {
      query.andWhere('assignment.assignmentDate = :assignmentDate', { assignmentDate: filters.assignmentDate });
    }

    query.orderBy('assignment.assignmentDate', 'DESC');
    return query.getMany();
  }

  async findOne(id: string): Promise<ShiftAssignment> {
    const assignment = await this.shiftAssignmentRepository.findOne({ where: { id } });
    if (!assignment) {
      throw new NotFoundException(`Shift Assignment with ID ${id} not found`);
    }
    return assignment;
  }

  async update(id: string, updateDto: Partial<ShiftAssignment>): Promise<ShiftAssignment> {
    const assignment = await this.findOne(id);
    Object.assign(assignment, updateDto);
    return this.shiftAssignmentRepository.save(assignment);
  }

  async remove(id: string): Promise<void> {
    const assignment = await this.findOne(id);
    if (assignment.status === 'completed') {
      throw new BadRequestException('Cannot delete completed assignments');
    }
    await this.shiftAssignmentRepository.remove(assignment);
  }

  async clockIn(id: string): Promise<ShiftAssignment> {
    const assignment = await this.findOne(id);
    assignment.actualStart = new Date();
    assignment.status = 'active';
    return this.shiftAssignmentRepository.save(assignment);
  }

  async clockOut(id: string): Promise<ShiftAssignment> {
    const assignment = await this.findOne(id);
    assignment.actualEnd = new Date();
    assignment.status = 'completed';

    if (assignment.actualStart) {
      const hoursWorked = (assignment.actualEnd.getTime() - new Date(assignment.actualStart).getTime()) / (1000 * 60 * 60);
      assignment.actualHours = hoursWorked;
    }

    return this.shiftAssignmentRepository.save(assignment);
  }

  async getAttendanceSummary(companyId: string, date: Date): Promise<any> {
    const assignments = await this.findAll({ companyId, assignmentDate: date });

    const total = assignments.length;
    const present = assignments.filter(a => a.status === 'active' || a.status === 'completed').length;
    const absent = assignments.filter(a => a.status === 'absent').length;
    const late = assignments.filter(a => {
      if (a.actualStart && a.scheduledStart) {
        return new Date(a.actualStart) > new Date(a.scheduledStart);
      }
      return false;
    }).length;

    return {
      date,
      totalAssignments: total,
      present,
      absent,
      late,
      attendanceRate: total > 0 ? (present / total) * 100 : 0,
    };
  }
}
