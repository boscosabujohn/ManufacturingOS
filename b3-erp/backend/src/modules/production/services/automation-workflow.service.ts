import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AutomationWorkflow, WorkflowStatus, WorkflowType } from '../entities/automation-workflow.entity';

@Injectable()
export class AutomationWorkflowService {
  constructor(
    @InjectRepository(AutomationWorkflow)
    private readonly automationWorkflowRepository: Repository<AutomationWorkflow>,
  ) {}

  async create(createDto: Partial<AutomationWorkflow>): Promise<AutomationWorkflow> {
    const existing = await this.automationWorkflowRepository.findOne({
      where: { workflowCode: createDto.workflowCode },
    });

    if (existing) {
      throw new BadRequestException(`Automation Workflow ${createDto.workflowCode} already exists`);
    }

    const workflow = this.automationWorkflowRepository.create(createDto);
    return this.automationWorkflowRepository.save(workflow);
  }

  async findAll(filters?: {
    companyId?: string;
    status?: WorkflowStatus;
    workflowType?: WorkflowType;
  }): Promise<AutomationWorkflow[]> {
    const query = this.automationWorkflowRepository.createQueryBuilder('workflow');

    if (filters?.companyId) {
      query.andWhere('workflow.companyId = :companyId', { companyId: filters.companyId });
    }

    if (filters?.status) {
      query.andWhere('workflow.status = :status', { status: filters.status });
    }

    if (filters?.workflowType) {
      query.andWhere('workflow.workflowType = :workflowType', { workflowType: filters.workflowType });
    }

    query.orderBy('workflow.createdAt', 'DESC');
    return query.getMany();
  }

  async findOne(id: string): Promise<AutomationWorkflow> {
    const workflow = await this.automationWorkflowRepository.findOne({ where: { id } });
    if (!workflow) {
      throw new NotFoundException(`Automation Workflow with ID ${id} not found`);
    }
    return workflow;
  }

  async update(id: string, updateDto: Partial<AutomationWorkflow>): Promise<AutomationWorkflow> {
    const workflow = await this.findOne(id);
    Object.assign(workflow, updateDto);
    return this.automationWorkflowRepository.save(workflow);
  }

  async remove(id: string): Promise<void> {
    const workflow = await this.findOne(id);
    if (workflow.status === 'active') {
      throw new BadRequestException('Cannot delete active workflow');
    }
    await this.automationWorkflowRepository.remove(workflow);
  }

  async activate(id: string): Promise<AutomationWorkflow> {
    const workflow = await this.findOne(id);
    workflow.status = 'active';
    workflow.isActive = true;
    return this.automationWorkflowRepository.save(workflow);
  }

  async pause(id: string): Promise<AutomationWorkflow> {
    const workflow = await this.findOne(id);
    workflow.status = 'paused';
    return this.automationWorkflowRepository.save(workflow);
  }

  async disable(id: string): Promise<AutomationWorkflow> {
    const workflow = await this.findOne(id);
    workflow.status = 'disabled';
    workflow.isActive = false;
    return this.automationWorkflowRepository.save(workflow);
  }

  async execute(id: string): Promise<any> {
    const workflow = await this.findOne(id);

    if (workflow.status !== 'active') {
      throw new BadRequestException('Workflow is not active');
    }

    const executionId = `EXEC-${Date.now()}`;
    const startTime = new Date();

    // Mock execution
    workflow.executionCount++;
    workflow.successCount++;
    workflow.lastExecutionAt = new Date();
    workflow.lastExecutionStatus = 'success';

    if (!workflow.executionHistory) {
      workflow.executionHistory = [];
    }

    workflow.executionHistory.push({
      executionId,
      startTime: startTime.toISOString(),
      endTime: new Date().toISOString(),
      status: 'success',
      stepsCompleted: workflow.steps?.length || 0,
      error: null,
    });

    await this.automationWorkflowRepository.save(workflow);

    return {
      executionId,
      workflowId: workflow.id,
      status: 'success',
      stepsExecuted: workflow.steps?.length || 0,
    };
  }

  async getExecutionHistory(id: string): Promise<any> {
    const workflow = await this.findOne(id);
    return {
      workflowId: workflow.id,
      workflowName: workflow.workflowName,
      executionCount: workflow.executionCount,
      successCount: workflow.successCount,
      failureCount: workflow.failureCount,
      successRate: workflow.executionCount > 0 ? (workflow.successCount / workflow.executionCount) * 100 : 0,
      history: workflow.executionHistory || [],
    };
  }
}
