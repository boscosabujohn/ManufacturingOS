import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Between, Like } from 'typeorm';
import {
  WorkflowDefinition,
  WorkflowType,
  WorkflowStatus,
} from '../entities/workflow-definition.entity';
import {
  WorkflowInstance,
  InstanceStatus,
  InstancePriority,
} from '../entities/workflow-instance.entity';
import { WorkflowStep, StepStatus } from '../entities/workflow-step.entity';
import {
  WorkflowHistory,
  HistoryEventType,
  HistorySeverity,
} from '../entities/workflow-history.entity';

@Injectable()
export class WorkflowRepositoryService {
  private readonly logger = new Logger(WorkflowRepositoryService.name);

  constructor(
    @InjectRepository(WorkflowDefinition)
    private readonly definitionRepository: Repository<WorkflowDefinition>,
    @InjectRepository(WorkflowInstance)
    private readonly instanceRepository: Repository<WorkflowInstance>,
    @InjectRepository(WorkflowStep)
    private readonly stepRepository: Repository<WorkflowStep>,
    @InjectRepository(WorkflowHistory)
    private readonly historyRepository: Repository<WorkflowHistory>,
  ) {}

  // ==================== WORKFLOW DEFINITIONS ====================

  async createDefinition(data: Partial<WorkflowDefinition>): Promise<WorkflowDefinition> {
    const definition = this.definitionRepository.create(data);
    const saved = await this.definitionRepository.save(definition);
    this.logger.log(`Created workflow definition: ${saved.name} (${saved.id})`);
    return saved;
  }

  async getDefinition(id: string): Promise<WorkflowDefinition> {
    const definition = await this.definitionRepository.findOne({
      where: { id },
      relations: ['instances'],
    });
    if (!definition) {
      throw new NotFoundException(`Workflow definition ${id} not found`);
    }
    return definition;
  }

  async getDefinitionByName(name: string): Promise<WorkflowDefinition | null> {
    return this.definitionRepository.findOne({ where: { name } });
  }

  async getAllDefinitions(filters?: {
    type?: WorkflowType;
    status?: WorkflowStatus;
  }): Promise<WorkflowDefinition[]> {
    const query = this.definitionRepository.createQueryBuilder('def');

    if (filters?.type) {
      query.andWhere('def.type = :type', { type: filters.type });
    }
    if (filters?.status) {
      query.andWhere('def.status = :status', { status: filters.status });
    }

    return query.orderBy('def.name', 'ASC').getMany();
  }

  async updateDefinition(
    id: string,
    data: Partial<WorkflowDefinition>,
  ): Promise<WorkflowDefinition> {
    const definition = await this.getDefinition(id);
    Object.assign(definition, data);
    return this.definitionRepository.save(definition);
  }

  async activateDefinition(id: string): Promise<WorkflowDefinition> {
    return this.updateDefinition(id, { status: WorkflowStatus.ACTIVE });
  }

  async deactivateDefinition(id: string): Promise<WorkflowDefinition> {
    return this.updateDefinition(id, { status: WorkflowStatus.INACTIVE });
  }

  // ==================== WORKFLOW INSTANCES ====================

  async createInstance(data: {
    definitionId?: string;
    sourceType: string;
    sourceId: string;
    sourceNumber: string;
    context?: Record<string, any>;
    priority?: InstancePriority;
    createdBy?: string;
  }): Promise<WorkflowInstance> {
    const instanceNumber = `WF-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

    const instance = this.instanceRepository.create({
      instanceNumber,
      definitionId: data.definitionId,
      sourceType: data.sourceType,
      sourceId: data.sourceId,
      sourceNumber: data.sourceNumber,
      context: data.context || {},
      priority: data.priority || InstancePriority.NORMAL,
      status: InstanceStatus.PENDING,
      createdBy: data.createdBy,
    });

    const saved = await this.instanceRepository.save(instance);

    // Log history
    await this.addHistory({
      instanceId: saved.id,
      eventType: HistoryEventType.INSTANCE_CREATED,
      message: `Workflow instance ${instanceNumber} created for ${data.sourceType} ${data.sourceNumber}`,
      userId: data.createdBy,
      eventData: { sourceType: data.sourceType, sourceNumber: data.sourceNumber },
    });

    this.logger.log(`Created workflow instance: ${instanceNumber} (${saved.id})`);
    return saved;
  }

  async getInstance(id: string): Promise<WorkflowInstance> {
    const instance = await this.instanceRepository.findOne({
      where: { id },
      relations: ['definition', 'steps', 'history'],
    });
    if (!instance) {
      throw new NotFoundException(`Workflow instance ${id} not found`);
    }
    return instance;
  }

  async getInstanceByNumber(instanceNumber: string): Promise<WorkflowInstance | null> {
    return this.instanceRepository.findOne({
      where: { instanceNumber },
      relations: ['steps', 'history'],
    });
  }

  async getInstancesBySource(
    sourceType: string,
    sourceId: string,
  ): Promise<WorkflowInstance[]> {
    return this.instanceRepository.find({
      where: { sourceType, sourceId },
      relations: ['steps'],
      order: { createdAt: 'DESC' },
    });
  }

  async getAllInstances(filters?: {
    status?: InstanceStatus | InstanceStatus[];
    priority?: InstancePriority;
    sourceType?: string;
    fromDate?: Date;
    toDate?: Date;
    limit?: number;
  }): Promise<WorkflowInstance[]> {
    const query = this.instanceRepository.createQueryBuilder('inst');

    if (filters?.status) {
      if (Array.isArray(filters.status)) {
        query.andWhere('inst.status IN (:...statuses)', { statuses: filters.status });
      } else {
        query.andWhere('inst.status = :status', { status: filters.status });
      }
    }
    if (filters?.priority) {
      query.andWhere('inst.priority = :priority', { priority: filters.priority });
    }
    if (filters?.sourceType) {
      query.andWhere('inst.sourceType = :sourceType', { sourceType: filters.sourceType });
    }
    if (filters?.fromDate) {
      query.andWhere('inst.createdAt >= :fromDate', { fromDate: filters.fromDate });
    }
    if (filters?.toDate) {
      query.andWhere('inst.createdAt <= :toDate', { toDate: filters.toDate });
    }

    query.orderBy('inst.createdAt', 'DESC');

    if (filters?.limit) {
      query.take(filters.limit);
    }

    return query.getMany();
  }

  async startInstance(id: string, userId?: string): Promise<WorkflowInstance> {
    const instance = await this.getInstance(id);
    instance.status = InstanceStatus.RUNNING;
    instance.startedAt = new Date();
    instance.updatedBy = userId;

    const saved = await this.instanceRepository.save(instance);

    await this.addHistory({
      instanceId: id,
      eventType: HistoryEventType.INSTANCE_STARTED,
      message: `Workflow instance started`,
      userId,
    });

    return saved;
  }

  async completeInstance(id: string, userId?: string): Promise<WorkflowInstance> {
    const instance = await this.getInstance(id);
    instance.status = InstanceStatus.COMPLETED;
    instance.completedAt = new Date();
    instance.progressPercentage = 100;
    instance.updatedBy = userId;

    const saved = await this.instanceRepository.save(instance);

    await this.addHistory({
      instanceId: id,
      eventType: HistoryEventType.INSTANCE_COMPLETED,
      message: `Workflow instance completed successfully`,
      userId,
    });

    return saved;
  }

  async failInstance(
    id: string,
    errorMessage: string,
    errorDetails?: Record<string, any>,
    userId?: string,
  ): Promise<WorkflowInstance> {
    const instance = await this.getInstance(id);
    instance.status = InstanceStatus.FAILED;
    instance.completedAt = new Date();
    instance.errorMessage = errorMessage;
    instance.errorDetails = errorDetails;
    instance.updatedBy = userId;

    const saved = await this.instanceRepository.save(instance);

    await this.addHistory({
      instanceId: id,
      eventType: HistoryEventType.INSTANCE_FAILED,
      severity: HistorySeverity.ERROR,
      message: `Workflow instance failed: ${errorMessage}`,
      userId,
      eventData: errorDetails,
    });

    return saved;
  }

  async updateInstanceProgress(
    id: string,
    completedSteps: number,
    totalSteps: number,
    currentStepId?: string,
    currentStepName?: string,
  ): Promise<WorkflowInstance> {
    const instance = await this.getInstance(id);
    instance.completedSteps = completedSteps;
    instance.totalSteps = totalSteps;
    instance.calculateProgress();
    if (currentStepId) {
      instance.currentStepId = currentStepId;
    }
    if (currentStepName) {
      instance.currentStepName = currentStepName;
    }

    return this.instanceRepository.save(instance);
  }

  async updateInstanceContext(
    id: string,
    context: Record<string, any>,
    userId?: string,
  ): Promise<WorkflowInstance> {
    const instance = await this.getInstance(id);
    const previousContext = { ...instance.context };
    instance.context = { ...instance.context, ...context };
    instance.updatedBy = userId;

    const saved = await this.instanceRepository.save(instance);

    await this.addHistory({
      instanceId: id,
      eventType: HistoryEventType.CONTEXT_UPDATED,
      message: 'Workflow context updated',
      userId,
      previousState: previousContext,
      newState: instance.context,
    });

    return saved;
  }

  // ==================== WORKFLOW STEPS ====================

  async createStep(data: {
    instanceId: string;
    stepDefinitionId: string;
    stepName: string;
    stepType?: string;
    order: number;
    input?: Record<string, any>;
  }): Promise<WorkflowStep> {
    const step = this.stepRepository.create({
      ...data,
      status: StepStatus.PENDING,
    });
    return this.stepRepository.save(step);
  }

  async getStep(id: string): Promise<WorkflowStep> {
    const step = await this.stepRepository.findOne({ where: { id } });
    if (!step) {
      throw new NotFoundException(`Workflow step ${id} not found`);
    }
    return step;
  }

  async getStepsByInstance(instanceId: string): Promise<WorkflowStep[]> {
    return this.stepRepository.find({
      where: { instanceId },
      order: { order: 'ASC' },
    });
  }

  async startStep(id: string, jobId?: string, userId?: string): Promise<WorkflowStep> {
    const step = await this.getStep(id);
    step.start();
    if (jobId) {
      step.jobId = jobId;
    }
    step.executedBy = userId;

    const saved = await this.stepRepository.save(step);

    await this.addHistory({
      instanceId: step.instanceId,
      stepId: id,
      eventType: HistoryEventType.STEP_STARTED,
      message: `Step "${step.stepName}" started`,
      userId,
    });

    return saved;
  }

  async completeStep(
    id: string,
    output?: Record<string, any>,
    userId?: string,
  ): Promise<WorkflowStep> {
    const step = await this.getStep(id);
    step.complete(output);

    const saved = await this.stepRepository.save(step);

    await this.addHistory({
      instanceId: step.instanceId,
      stepId: id,
      eventType: HistoryEventType.STEP_COMPLETED,
      message: `Step "${step.stepName}" completed`,
      userId,
      eventData: output,
    });

    return saved;
  }

  async failStep(
    id: string,
    errorMessage: string,
    errorDetails?: Record<string, any>,
    userId?: string,
  ): Promise<WorkflowStep> {
    const step = await this.getStep(id);
    step.fail(errorMessage, errorDetails);

    const saved = await this.stepRepository.save(step);

    await this.addHistory({
      instanceId: step.instanceId,
      stepId: id,
      eventType: HistoryEventType.STEP_FAILED,
      severity: HistorySeverity.ERROR,
      message: `Step "${step.stepName}" failed: ${errorMessage}`,
      userId,
      eventData: errorDetails,
    });

    return saved;
  }

  // ==================== WORKFLOW HISTORY ====================

  async addHistory(data: {
    instanceId?: string;
    stepId?: string;
    eventType: HistoryEventType;
    severity?: HistorySeverity;
    message: string;
    details?: string;
    eventData?: Record<string, any>;
    previousState?: Record<string, any>;
    newState?: Record<string, any>;
    sourceEvent?: string;
    sourceModule?: string;
    userId?: string;
    userName?: string;
  }): Promise<WorkflowHistory> {
    const history = this.historyRepository.create({
      ...data,
      severity: data.severity || HistorySeverity.INFO,
    });
    return this.historyRepository.save(history);
  }

  async getHistory(instanceId: string, limit?: number): Promise<WorkflowHistory[]> {
    const query = this.historyRepository.createQueryBuilder('hist')
      .where('hist.instanceId = :instanceId', { instanceId })
      .orderBy('hist.createdAt', 'DESC');

    if (limit) {
      query.take(limit);
    }

    return query.getMany();
  }

  async getHistoryByEventType(
    eventType: HistoryEventType,
    fromDate?: Date,
    toDate?: Date,
    limit?: number,
  ): Promise<WorkflowHistory[]> {
    const query = this.historyRepository.createQueryBuilder('hist')
      .where('hist.eventType = :eventType', { eventType });

    if (fromDate) {
      query.andWhere('hist.createdAt >= :fromDate', { fromDate });
    }
    if (toDate) {
      query.andWhere('hist.createdAt <= :toDate', { toDate });
    }

    query.orderBy('hist.createdAt', 'DESC');

    if (limit) {
      query.take(limit);
    }

    return query.getMany();
  }

  // ==================== ANALYTICS & REPORTING ====================

  async getWorkflowStats(): Promise<{
    totalDefinitions: number;
    activeDefinitions: number;
    totalInstances: number;
    runningInstances: number;
    completedInstances: number;
    failedInstances: number;
  }> {
    const [
      totalDefinitions,
      activeDefinitions,
      totalInstances,
      runningInstances,
      completedInstances,
      failedInstances,
    ] = await Promise.all([
      this.definitionRepository.count(),
      this.definitionRepository.count({ where: { status: WorkflowStatus.ACTIVE } }),
      this.instanceRepository.count(),
      this.instanceRepository.count({ where: { status: InstanceStatus.RUNNING } }),
      this.instanceRepository.count({ where: { status: InstanceStatus.COMPLETED } }),
      this.instanceRepository.count({ where: { status: InstanceStatus.FAILED } }),
    ]);

    return {
      totalDefinitions,
      activeDefinitions,
      totalInstances,
      runningInstances,
      completedInstances,
      failedInstances,
    };
  }

  async getRecentActivity(limit: number = 20): Promise<WorkflowHistory[]> {
    return this.historyRepository.find({
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }
}
