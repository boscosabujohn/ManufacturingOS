import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { WorkOrderService } from '../services/work-order.service';
import { CreateWorkOrderDto, UpdateWorkOrderDto, WorkOrderResponseDto } from '../dto';

@ApiTags('Production - Work Order')
@Controller('production/work-order')
export class WorkOrderController {
  constructor(private readonly workOrderService: WorkOrderService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new work order' })
  @ApiResponse({ status: HttpStatus.CREATED, type: WorkOrderResponseDto })
  async create(@Body() createDto: CreateWorkOrderDto): Promise<WorkOrderResponseDto> {
    return this.workOrderService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all work orders' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'itemId', required: false })
  @ApiQuery({ name: 'workCenterId', required: false })
  @ApiResponse({ status: HttpStatus.OK, type: [WorkOrderResponseDto] })
  async findAll(
    @Query('status') status?: any,
    @Query('itemId') itemId?: string,
    @Query('workCenterId') workCenterId?: string,
  ): Promise<WorkOrderResponseDto[]> {
    return this.workOrderService.findAll({ status, itemId, workCenterId });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get work order by ID' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: HttpStatus.OK, type: WorkOrderResponseDto })
  async findOne(@Param('id') id: string): Promise<WorkOrderResponseDto> {
    return this.workOrderService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update work order' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: HttpStatus.OK, type: WorkOrderResponseDto })
  async update(@Param('id') id: string, @Body() updateDto: UpdateWorkOrderDto): Promise<WorkOrderResponseDto> {
    return this.workOrderService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete work order' })
  @ApiParam({ name: 'id' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.workOrderService.remove(id);
  }

  @Post(':id/submit')
  @ApiOperation({ summary: 'Submit work order' })
  @ApiParam({ name: 'id' })
  async submit(@Param('id') id: string, @Body('submittedBy') submittedBy: string): Promise<WorkOrderResponseDto> {
    return this.workOrderService.submit(id, submittedBy);
  }

  @Post(':id/release')
  @ApiOperation({ summary: 'Release work order to production' })
  @ApiParam({ name: 'id' })
  async release(@Param('id') id: string, @Body('releasedBy') releasedBy: string): Promise<WorkOrderResponseDto> {
    return this.workOrderService.release(id, releasedBy);
  }

  @Post(':id/start')
  @ApiOperation({ summary: 'Start work order production' })
  @ApiParam({ name: 'id' })
  async start(@Param('id') id: string, @Body('startedBy') startedBy: string): Promise<WorkOrderResponseDto> {
    return this.workOrderService.start(id, startedBy);
  }

  @Post(':id/complete')
  @ApiOperation({ summary: 'Complete work order' })
  @ApiParam({ name: 'id' })
  async complete(@Param('id') id: string, @Body('completedBy') completedBy: string): Promise<WorkOrderResponseDto> {
    return this.workOrderService.complete(id, completedBy);
  }

  @Post(':id/close')
  @ApiOperation({ summary: 'Close work order' })
  @ApiParam({ name: 'id' })
  async close(@Param('id') id: string, @Body('closedBy') closedBy: string): Promise<WorkOrderResponseDto> {
    return this.workOrderService.close(id, closedBy);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel work order' })
  @ApiParam({ name: 'id' })
  async cancel(
    @Param('id') id: string,
    @Body('cancelledBy') cancelledBy: string,
    @Body('reason') reason: string,
  ): Promise<WorkOrderResponseDto> {
    return this.workOrderService.cancel(id, cancelledBy, reason);
  }

  @Put(':id/progress')
  @ApiOperation({ summary: 'Update production progress' })
  @ApiParam({ name: 'id' })
  async updateProgress(
    @Param('id') id: string,
    @Body('producedQuantity') producedQty: number,
  ): Promise<WorkOrderResponseDto> {
    return this.workOrderService.updateProgress(id, producedQty);
  }
}
