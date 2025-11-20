import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Query,
  HttpStatus,
} from '@nestjs/common';
import { WorkflowRepositoryService } from '../services/workflow-repository.service';
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
import { WorkflowHistory, HistoryEventType } from '../entities/workflow-history.entity';

@Controller('workflow-repository')
export class WorkflowRepositoryController {
  constructor(
    private readonly workflowRepository: WorkflowRepositoryService,
  ) {}

  // ==================== DEFINITIONS ====================

  @Get('definitions')
  async getAllDefinitions(
    @Query('type') type?: WorkflowType,
    @Query('status') status?: WorkflowStatus,
  ): Promise<WorkflowDefinition[]> {
    return this.workflowRepository.getAllDefinitions({ type, status });
  }

  @Get('definitions/:id')
  async getDefinition(@Param('id') id: string): Promise<WorkflowDefinition> {
    return this.workflowRepository.getDefinition(id);
  }

  @Post('definitions')
  async createDefinition(
    @Body() data: Partial<WorkflowDefinition>,
  ): Promise<WorkflowDefinition> {
    return this.workflowRepository.createDefinition(data);
  }

  @Put('definitions/:id')
  async updateDefinition(
    @Param('id') id: string,
    @Body() data: Partial<WorkflowDefinition>,
  ): Promise<WorkflowDefinition> {
    return this.workflowRepository.updateDefinition(id, data);
  }

  @Put('definitions/:id/activate')
  async activateDefinition(@Param('id') id: string): Promise<WorkflowDefinition> {
    return this.workflowRepository.activateDefinition(id);
  }

  @Put('definitions/:id/deactivate')
  async deactivateDefinition(@Param('id') id: string): Promise<WorkflowDefinition> {
    return this.workflowRepository.deactivateDefinition(id);
  }

  // ==================== INSTANCES ====================

  @Get('instances')
  async getAllInstances(
    @Query('status') status?: InstanceStatus,
    @Query('priority') priority?: InstancePriority,
    @Query('sourceType') sourceType?: string,
    @Query('limit') limit?: number,
  ): Promise<WorkflowInstance[]> {
    return this.workflowRepository.getAllInstances({
      status,
      priority,
      sourceType,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get('instances/:id')
  async getInstance(@Param('id') id: string): Promise<WorkflowInstance> {
    return this.workflowRepository.getInstance(id);
  }

  @Get('instances/by-number/:instanceNumber')
  async getInstanceByNumber(
    @Param('instanceNumber') instanceNumber: string,
  ): Promise<WorkflowInstance | null> {
    return this.workflowRepository.getInstanceByNumber(instanceNumber);
  }

  @Get('instances/by-source/:sourceType/:sourceId')
  async getInstancesBySource(
    @Param('sourceType') sourceType: string,
    @Param('sourceId') sourceId: string,
  ): Promise<WorkflowInstance[]> {
    return this.workflowRepository.getInstancesBySource(sourceType, sourceId);
  }

  @Post('instances')
  async createInstance(
    @Body() data: {
      definitionId?: string;
      sourceType: string;
      sourceId: string;
      sourceNumber: string;
      context?: Record<string, any>;
      priority?: InstancePriority;
      createdBy?: string;
    },
  ): Promise<WorkflowInstance> {
    return this.workflowRepository.createInstance(data);
  }

  @Put('instances/:id/start')
  async startInstance(
    @Param('id') id: string,
    @Body('userId') userId?: string,
  ): Promise<WorkflowInstance> {
    return this.workflowRepository.startInstance(id, userId);
  }

  @Put('instances/:id/complete')
  async completeInstance(
    @Param('id') id: string,
    @Body('userId') userId?: string,
  ): Promise<WorkflowInstance> {
    return this.workflowRepository.completeInstance(id, userId);
  }

  @Put('instances/:id/fail')
  async failInstance(
    @Param('id') id: string,
    @Body() data: {
      errorMessage: string;
      errorDetails?: Record<string, any>;
      userId?: string;
    },
  ): Promise<WorkflowInstance> {
    return this.workflowRepository.failInstance(
      id,
      data.errorMessage,
      data.errorDetails,
      data.userId,
    );
  }

  @Put('instances/:id/context')
  async updateInstanceContext(
    @Param('id') id: string,
    @Body() data: {
      context: Record<string, any>;
      userId?: string;
    },
  ): Promise<WorkflowInstance> {
    return this.workflowRepository.updateInstanceContext(id, data.context, data.userId);
  }

  // ==================== STEPS ====================

  @Get('instances/:instanceId/steps')
  async getStepsByInstance(
    @Param('instanceId') instanceId: string,
  ): Promise<any[]> {
    return this.workflowRepository.getStepsByInstance(instanceId);
  }

  // ==================== HISTORY ====================

  @Get('instances/:instanceId/history')
  async getHistory(
    @Param('instanceId') instanceId: string,
    @Query('limit') limit?: number,
  ): Promise<WorkflowHistory[]> {
    return this.workflowRepository.getHistory(instanceId, limit ? Number(limit) : undefined);
  }

  @Get('history/by-event-type/:eventType')
  async getHistoryByEventType(
    @Param('eventType') eventType: HistoryEventType,
    @Query('limit') limit?: number,
  ): Promise<WorkflowHistory[]> {
    return this.workflowRepository.getHistoryByEventType(
      eventType,
      undefined,
      undefined,
      limit ? Number(limit) : undefined,
    );
  }

  // ==================== ANALYTICS ====================

  @Get('stats')
  async getWorkflowStats(): Promise<{
    totalDefinitions: number;
    activeDefinitions: number;
    totalInstances: number;
    runningInstances: number;
    completedInstances: number;
    failedInstances: number;
  }> {
    return this.workflowRepository.getWorkflowStats();
  }

  @Get('recent-activity')
  async getRecentActivity(
    @Query('limit') limit?: number,
  ): Promise<WorkflowHistory[]> {
    return this.workflowRepository.getRecentActivity(limit ? Number(limit) : 20);
  }
}
