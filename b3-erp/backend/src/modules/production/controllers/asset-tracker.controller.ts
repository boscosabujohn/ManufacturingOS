import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AssetTrackerService } from '../services/asset-tracker.service';
import { AssetTracker } from '../entities/asset-tracker.entity';

@ApiTags('Production - Industry 4.0')
@Controller('production/asset-trackers')
export class AssetTrackerController {
  constructor(private readonly assetTrackerService: AssetTrackerService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new asset tracker' })
  @ApiResponse({ status: HttpStatus.CREATED })
  async create(@Body() createDto: Partial<AssetTracker>): Promise<AssetTracker> {
    return this.assetTrackerService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all asset trackers' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'assetType', required: false })
  async findAll(
    @Query('status') status?: any,
    @Query('assetType') assetType?: any,
  ): Promise<AssetTracker[]> {
    return this.assetTrackerService.findAll({ status, assetType });
  }

  @Get('by-code/:assetCode')
  @ApiOperation({ summary: 'Get asset by code' })
  @ApiParam({ name: 'assetCode' })
  async findByCode(@Param('assetCode') assetCode: string): Promise<AssetTracker> {
    return this.assetTrackerService.findByCode(assetCode);
  }

  @Get('by-rfid/:rfidTag')
  @ApiOperation({ summary: 'Get asset by RFID' })
  @ApiParam({ name: 'rfidTag' })
  async findByRFID(@Param('rfidTag') rfidTag: string): Promise<AssetTracker> {
    return this.assetTrackerService.findByRFID(rfidTag);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get asset tracker by ID' })
  @ApiParam({ name: 'id' })
  async findOne(@Param('id') id: string): Promise<AssetTracker> {
    return this.assetTrackerService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update asset tracker' })
  @ApiParam({ name: 'id' })
  async update(@Param('id') id: string, @Body() updateDto: Partial<AssetTracker>): Promise<AssetTracker> {
    return this.assetTrackerService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete asset tracker' })
  @ApiParam({ name: 'id' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.assetTrackerService.remove(id);
  }

  @Post(':id/update-location')
  @ApiOperation({ summary: 'Update asset location' })
  @ApiParam({ name: 'id' })
  async updateLocation(
    @Param('id') id: string,
    @Body('location') location: any,
    @Body('movedBy') movedBy: string,
    @Body('reason') reason: string,
  ): Promise<AssetTracker> {
    return this.assetTrackerService.updateLocation(id, location, movedBy, reason);
  }

  @Post(':id/assign-work-order')
  @ApiOperation({ summary: 'Assign to work order' })
  @ApiParam({ name: 'id' })
  async assignToWorkOrder(@Param('id') id: string, @Body('workOrderId') workOrderId: string): Promise<AssetTracker> {
    return this.assetTrackerService.assignToWorkOrder(id, workOrderId);
  }

  @Post(':id/release')
  @ApiOperation({ summary: 'Release from work order' })
  @ApiParam({ name: 'id' })
  async releaseFromWorkOrder(@Param('id') id: string): Promise<AssetTracker> {
    return this.assetTrackerService.releaseFromWorkOrder(id);
  }

  @Get(':id/utilization')
  @ApiOperation({ summary: 'Get asset utilization' })
  @ApiParam({ name: 'id' })
  async getUtilization(@Param('id') id: string): Promise<any> {
    return this.assetTrackerService.getAssetUtilization(id);
  }
}
