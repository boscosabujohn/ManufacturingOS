import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ShiftHandoffService } from '../services/shift-handoff.service';
import { ShiftHandoff, HandoffStatus, HandoffShiftType } from '../entities/shift-handoff.entity';

@ApiTags('Production - Collaboration - Shift Handoff')
@Controller('production/collaboration/shift-handoffs')
export class ShiftHandoffController {
  constructor(private readonly shiftHandoffService: ShiftHandoffService) {}

  @Post()
  @ApiOperation({ summary: 'Create shift handoff' })
  @ApiResponse({ status: HttpStatus.CREATED })
  async create(@Body() createDto: Partial<ShiftHandoff>): Promise<ShiftHandoff> {
    return this.shiftHandoffService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all shift handoffs' })
  @ApiQuery({ name: 'companyId', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'outgoingShiftType', required: false })
  @ApiQuery({ name: 'incomingShiftType', required: false })
  @ApiQuery({ name: 'workstationId', required: false })
  @ApiQuery({ name: 'productionLineId', required: false })
  async findAll(
    @Query('companyId') companyId?: string,
    @Query('status') status?: HandoffStatus,
    @Query('outgoingShiftType') outgoingShiftType?: HandoffShiftType,
    @Query('incomingShiftType') incomingShiftType?: HandoffShiftType,
    @Query('workstationId') workstationId?: string,
    @Query('productionLineId') productionLineId?: string,
  ): Promise<ShiftHandoff[]> {
    return this.shiftHandoffService.findAll({ companyId, status, outgoingShiftType, incomingShiftType, workstationId, productionLineId });
  }

  @Get('pending')
  @ApiOperation({ summary: 'Get pending handoffs' })
  @ApiQuery({ name: 'companyId', required: true })
  async getPendingHandoffs(@Query('companyId') companyId: string): Promise<ShiftHandoff[]> {
    return this.shiftHandoffService.getPendingHandoffs(companyId);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get handoff summary' })
  @ApiQuery({ name: 'companyId', required: true })
  @ApiQuery({ name: 'startDate', required: true })
  @ApiQuery({ name: 'endDate', required: true })
  async getHandoffSummary(
    @Query('companyId') companyId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<any> {
    return this.shiftHandoffService.getHandoffSummary(companyId, new Date(startDate), new Date(endDate));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get shift handoff by ID' })
  @ApiParam({ name: 'id' })
  async findOne(@Param('id') id: string): Promise<ShiftHandoff> {
    return this.shiftHandoffService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update shift handoff' })
  @ApiParam({ name: 'id' })
  async update(@Param('id') id: string, @Body() updateDto: Partial<ShiftHandoff>): Promise<ShiftHandoff> {
    return this.shiftHandoffService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete shift handoff' })
  @ApiParam({ name: 'id' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.shiftHandoffService.remove(id);
  }

  @Post(':id/start')
  @ApiOperation({ summary: 'Start handoff' })
  @ApiParam({ name: 'id' })
  async startHandoff(@Param('id') id: string): Promise<ShiftHandoff> {
    return this.shiftHandoffService.startHandoff(id);
  }

  @Post(':id/complete')
  @ApiOperation({ summary: 'Complete handoff' })
  @ApiParam({ name: 'id' })
  async completeHandoff(@Param('id') id: string): Promise<ShiftHandoff> {
    return this.shiftHandoffService.completeHandoff(id);
  }

  @Post(':id/acknowledge')
  @ApiOperation({ summary: 'Acknowledge handoff' })
  @ApiParam({ name: 'id' })
  async acknowledgeHandoff(
    @Param('id') id: string,
    @Body() data: { incomingUserId: string; incomingUserName: string; notes?: string },
  ): Promise<ShiftHandoff> {
    return this.shiftHandoffService.acknowledgeHandoff(id, data.incomingUserId, data.incomingUserName, data.notes);
  }

  @Put(':id/checklist/:itemId')
  @ApiOperation({ summary: 'Update checklist item' })
  @ApiParam({ name: 'id' })
  @ApiParam({ name: 'itemId' })
  async updateChecklistItem(
    @Param('id') id: string,
    @Param('itemId') itemId: string,
    @Body() update: { isCompleted: boolean; notes?: string; completedBy?: string },
  ): Promise<ShiftHandoff> {
    return this.shiftHandoffService.updateChecklistItem(id, itemId, update.isCompleted, update.notes, update.completedBy);
  }

  @Post(':id/issue')
  @ApiOperation({ summary: 'Add active issue' })
  @ApiParam({ name: 'id' })
  async addActiveIssue(@Param('id') id: string, @Body() issue: any): Promise<ShiftHandoff> {
    return this.shiftHandoffService.addActiveIssue(id, issue);
  }

  @Put(':id/issue/:issueId/resolve')
  @ApiOperation({ summary: 'Resolve issue' })
  @ApiParam({ name: 'id' })
  @ApiParam({ name: 'issueId' })
  async resolveIssue(
    @Param('id') id: string,
    @Param('issueId') issueId: string,
    @Body('resolution') resolution: string,
  ): Promise<ShiftHandoff> {
    return this.shiftHandoffService.resolveIssue(id, issueId, resolution);
  }
}
