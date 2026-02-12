import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AutomationWorkflowService } from '../services/automation-workflow.service';
import { AutomationWorkflow } from '../entities/automation-workflow.entity';

@ApiTags('Production - Automation')
@Controller('production/automation-workflows')
export class AutomationWorkflowController {
  constructor(private readonly automationWorkflowService: AutomationWorkflowService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new automation workflow' })
  @ApiResponse({ status: HttpStatus.CREATED })
  async create(@Body() createDto: Partial<AutomationWorkflow>): Promise<AutomationWorkflow> {
    return this.automationWorkflowService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all automation workflows' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'workflowType', required: false })
  async findAll(
    @Query('status') status?: any,
    @Query('workflowType') workflowType?: any,
  ): Promise<AutomationWorkflow[]> {
    return this.automationWorkflowService.findAll({ status, workflowType });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get automation workflow by ID' })
  @ApiParam({ name: 'id' })
  async findOne(@Param('id') id: string): Promise<AutomationWorkflow> {
    return this.automationWorkflowService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update automation workflow' })
  @ApiParam({ name: 'id' })
  async update(@Param('id') id: string, @Body() updateDto: Partial<AutomationWorkflow>): Promise<AutomationWorkflow> {
    return this.automationWorkflowService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete automation workflow' })
  @ApiParam({ name: 'id' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.automationWorkflowService.remove(id);
  }

  @Post(':id/activate')
  @ApiOperation({ summary: 'Activate workflow' })
  @ApiParam({ name: 'id' })
  async activate(@Param('id') id: string): Promise<AutomationWorkflow> {
    return this.automationWorkflowService.activate(id);
  }

  @Post(':id/pause')
  @ApiOperation({ summary: 'Pause workflow' })
  @ApiParam({ name: 'id' })
  async pause(@Param('id') id: string): Promise<AutomationWorkflow> {
    return this.automationWorkflowService.pause(id);
  }

  @Post(':id/disable')
  @ApiOperation({ summary: 'Disable workflow' })
  @ApiParam({ name: 'id' })
  async disable(@Param('id') id: string): Promise<AutomationWorkflow> {
    return this.automationWorkflowService.disable(id);
  }

  @Post(':id/execute')
  @ApiOperation({ summary: 'Execute workflow' })
  @ApiParam({ name: 'id' })
  async execute(@Param('id') id: string): Promise<any> {
    return this.automationWorkflowService.execute(id);
  }

  @Get(':id/execution-history')
  @ApiOperation({ summary: 'Get execution history' })
  @ApiParam({ name: 'id' })
  async getExecutionHistory(@Param('id') id: string): Promise<any> {
    return this.automationWorkflowService.getExecutionHistory(id);
  }
}
