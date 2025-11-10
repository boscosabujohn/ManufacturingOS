import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeaveApplication, LeaveApplicationStatus } from '../entities/leave-application.entity';
import { LeaveBalance } from '../entities/leave-balance.entity';

@Injectable()
export class LeaveApplicationService {
  constructor(
    @InjectRepository(LeaveApplication)
    private readonly repository: Repository<LeaveApplication>,
    @InjectRepository(LeaveBalance)
    private readonly leaveBalanceRepository: Repository<LeaveBalance>,
  ) {}

  async create(createDto: any): Promise<any> {
    const applicationNumber = await this.generateApplicationNumber();
    const entity = this.repository.create({
      ...createDto,
      applicationNumber,
      applicationDate: new Date(),
      status: LeaveApplicationStatus.DRAFT,
    });
    return await this.repository.save(entity);
  }

  async findAll(filters?: any): Promise<any[]> {
    const query = this.repository.createQueryBuilder('entity');

    if (filters) {
      if (filters.employeeId) {
        query.andWhere('entity.employeeId = :employeeId', { employeeId: filters.employeeId });
      }
      if (filters.status) {
        query.andWhere('entity.status = :status', { status: filters.status });
      }
    }

    query.orderBy('entity.applicationDate', 'DESC');
    return await query.getMany();
  }

  async findOne(id: string): Promise<any> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException(`Leave Application with ID ${id} not found`);
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

  // Special Operations
  async submit(id: string): Promise<any> {
    const application = await this.findOne(id);
    if (application.status !== LeaveApplicationStatus.DRAFT) {
      throw new BadRequestException('Only draft applications can be submitted');
    }
    application.status = LeaveApplicationStatus.SUBMITTED;
    return await this.repository.save(application);
  }

  async approve(id: string, approverId: string, remarks?: string): Promise<any> {
    const application = await this.findOne(id);
    if (application.status !== LeaveApplicationStatus.SUBMITTED) {
      throw new BadRequestException('Only submitted applications can be approved');
    }

    application.status = LeaveApplicationStatus.APPROVED;
    application.finalApproverId = approverId;
    application.finalApprovalDate = new Date();

    if (remarks) {
      application.approver1Remarks = remarks;
    }

    // Update leave balance
    const leaveBalance = await this.leaveBalanceRepository.findOne({
      where: {
        employeeId: application.employeeId,
        leaveTypeId: application.leaveTypeId,
        year: new Date().getFullYear(),
      },
    });

    if (leaveBalance) {
      leaveBalance.used += application.totalDays;
      leaveBalance.available = leaveBalance.allocated - leaveBalance.used;
      await this.leaveBalanceRepository.save(leaveBalance);
    }

    return await this.repository.save(application);
  }

  async reject(id: string, rejectedBy: string, reason: string): Promise<any> {
    const application = await this.findOne(id);
    if (application.status !== LeaveApplicationStatus.SUBMITTED) {
      throw new BadRequestException('Only submitted applications can be rejected');
    }

    application.status = LeaveApplicationStatus.REJECTED;
    application.rejectedBy = rejectedBy;
    application.rejectedDate = new Date();
    application.rejectionReason = reason;

    return await this.repository.save(application);
  }

  async cancel(id: string, cancelledBy: string, reason: string): Promise<any> {
    const application = await this.findOne(id);

    application.status = LeaveApplicationStatus.CANCELLED;
    application.cancelledBy = cancelledBy;
    application.cancelledDate = new Date();
    application.cancellationReason = reason;

    // Restore leave balance if previously approved
    if (application.status === LeaveApplicationStatus.APPROVED) {
      const leaveBalance = await this.leaveBalanceRepository.findOne({
        where: {
          employeeId: application.employeeId,
          leaveTypeId: application.leaveTypeId,
          year: new Date().getFullYear(),
        },
      });

      if (leaveBalance) {
        leaveBalance.used -= application.totalDays;
        leaveBalance.available = leaveBalance.allocated - leaveBalance.used;
        await this.leaveBalanceRepository.save(leaveBalance);
      }
    }

    return await this.repository.save(application);
  }

  async getLeaveBalance(employeeId: string, leaveTypeId: string): Promise<any> {
    const balance = await this.leaveBalanceRepository.findOne({
      where: {
        employeeId,
        leaveTypeId,
        year: new Date().getFullYear(),
      },
    });

    return balance || { available: 0, used: 0, pending: 0 };
  }

  async getLeaveHistory(employeeId: string, year?: number): Promise<any[]> {
    const query = this.repository.createQueryBuilder('leave')
      .where('leave.employeeId = :employeeId', { employeeId });

    if (year) {
      query.andWhere('EXTRACT(YEAR FROM leave.fromDate) = :year', { year });
    }

    query.orderBy('leave.fromDate', 'DESC');
    return await query.getMany();
  }

  private async generateApplicationNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.repository.count();
    return `LA-${year}-${String(count + 1).padStart(6, '0')}`;
  }
}
