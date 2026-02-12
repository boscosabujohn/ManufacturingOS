import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkloadAssignment, WorkloadAssignmentStatus, BalanceStatus } from '../entities/workload-assignment.entity';

@Injectable()
export class WorkloadAssignmentService {
  constructor(
    @InjectRepository(WorkloadAssignment)
    private readonly workloadAssignmentRepository: Repository<WorkloadAssignment>,
  ) {}

  async create(createDto: Partial<WorkloadAssignment>): Promise<WorkloadAssignment> {
    const assignment = this.workloadAssignmentRepository.create(createDto);

    // Calculate utilization and balance status
    if (assignment.totalPlannedHours && assignment.availableHours) {
      assignment.utilizationRate = (assignment.totalPlannedHours / assignment.availableHours) * 100;
      assignment.balanceStatus = this.calculateBalanceStatus(assignment.utilizationRate);
    }

    return this.workloadAssignmentRepository.save(assignment);
  }

  private calculateBalanceStatus(utilizationRate: number): BalanceStatus {
    if (utilizationRate > 100) return 'overloaded';
    if (utilizationRate < 70) return 'underutilized';
    return 'balanced';
  }

  async findAll(filters?: {
    companyId?: string;
    status?: WorkloadAssignmentStatus;
    employeeId?: string;
    assignmentDate?: Date;
  }): Promise<WorkloadAssignment[]> {
    const query = this.workloadAssignmentRepository.createQueryBuilder('assignment');

    if (filters?.companyId) {
      query.andWhere('assignment.companyId = :companyId', { companyId: filters.companyId });
    }

    if (filters?.status) {
      query.andWhere('assignment.status = :status', { status: filters.status });
    }

    if (filters?.employeeId) {
      query.andWhere('assignment.employeeId = :employeeId', { employeeId: filters.employeeId });
    }

    if (filters?.assignmentDate) {
      query.andWhere('assignment.assignmentDate = :assignmentDate', { assignmentDate: filters.assignmentDate });
    }

    query.orderBy('assignment.assignmentDate', 'DESC');
    return query.getMany();
  }

  async findOne(id: string): Promise<WorkloadAssignment> {
    const assignment = await this.workloadAssignmentRepository.findOne({ where: { id } });
    if (!assignment) {
      throw new NotFoundException(`Workload Assignment with ID ${id} not found`);
    }
    return assignment;
  }

  async update(id: string, updateDto: Partial<WorkloadAssignment>): Promise<WorkloadAssignment> {
    const assignment = await this.findOne(id);
    Object.assign(assignment, updateDto);

    // Recalculate utilization
    if (assignment.totalPlannedHours && assignment.availableHours) {
      assignment.utilizationRate = (assignment.totalPlannedHours / assignment.availableHours) * 100;
      assignment.balanceStatus = this.calculateBalanceStatus(assignment.utilizationRate);
    }

    return this.workloadAssignmentRepository.save(assignment);
  }

  async remove(id: string): Promise<void> {
    const assignment = await this.findOne(id);
    if (assignment.status === 'completed') {
      throw new BadRequestException('Cannot delete completed assignments');
    }
    await this.workloadAssignmentRepository.remove(assignment);
  }

  async addTask(id: string, task: any): Promise<WorkloadAssignment> {
    const assignment = await this.findOne(id);
    if (!assignment.assignedTasks) {
      assignment.assignedTasks = [];
    }
    assignment.assignedTasks.push(task);
    assignment.totalPlannedHours += task.estimatedHours;
    assignment.utilizationRate = (assignment.totalPlannedHours / assignment.availableHours) * 100;
    assignment.balanceStatus = this.calculateBalanceStatus(assignment.utilizationRate);
    return this.workloadAssignmentRepository.save(assignment);
  }

  async updateTaskStatus(id: string, taskId: string, status: string, actualHours?: number): Promise<WorkloadAssignment> {
    const assignment = await this.findOne(id);
    if (assignment.assignedTasks) {
      const taskIndex = assignment.assignedTasks.findIndex(t => t.taskId === taskId);
      if (taskIndex !== -1) {
        assignment.assignedTasks[taskIndex].status = status;
        if (actualHours !== undefined) {
          assignment.assignedTasks[taskIndex].actualHours = actualHours;
          assignment.totalActualHours = assignment.assignedTasks.reduce((sum, t) => sum + (t.actualHours || 0), 0);
        }
      }
    }
    return this.workloadAssignmentRepository.save(assignment);
  }

  async getWorkloadBalance(companyId: string, date: Date): Promise<any> {
    const assignments = await this.findAll({ companyId, assignmentDate: date });

    const balanceCounts = {
      balanced: assignments.filter(a => a.balanceStatus === 'balanced').length,
      overloaded: assignments.filter(a => a.balanceStatus === 'overloaded').length,
      underutilized: assignments.filter(a => a.balanceStatus === 'underutilized').length,
    };

    const avgUtilization = assignments.length > 0
      ? assignments.reduce((sum, a) => sum + a.utilizationRate, 0) / assignments.length
      : 0;

    return {
      date,
      totalAssignments: assignments.length,
      balanceDistribution: balanceCounts,
      averageUtilization: avgUtilization,
      overloadedEmployees: assignments
        .filter(a => a.balanceStatus === 'overloaded')
        .map(a => ({ employeeId: a.employeeId, employeeName: a.employeeName, utilization: a.utilizationRate })),
    };
  }

  async optimizeWorkload(companyId: string, date: Date): Promise<any> {
    const assignments = await this.findAll({ companyId, assignmentDate: date });

    // Mock optimization suggestions
    const suggestions = assignments
      .filter(a => a.balanceStatus !== 'balanced')
      .map(a => ({
        employeeId: a.employeeId,
        employeeName: a.employeeName,
        currentUtilization: a.utilizationRate,
        suggestion: a.balanceStatus === 'overloaded'
          ? 'Transfer some tasks to underutilized employees'
          : 'Assign additional tasks to increase utilization',
      }));

    return {
      date,
      suggestions,
      potentialImprovement: suggestions.length * 5, // Mock improvement percentage
    };
  }
}
