import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { PlannedOrderService } from '../services/planned-order.service';
import { PlannedOrder } from '../entities/planned-order.entity';

@ApiTags('Production - Planned Orders')
@Controller('production/planned-orders')
export class PlannedOrderController {
  constructor(private readonly plannedOrderService: PlannedOrderService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new planned order' })
  @ApiResponse({ status: HttpStatus.CREATED })
  async create(@Body() createDto: Partial<PlannedOrder>): Promise<PlannedOrder> {
    return this.plannedOrderService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all planned orders' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'orderType', required: false })
  @ApiQuery({ name: 'itemId', required: false })
  async findAll(
    @Query('status') status?: any,
    @Query('orderType') orderType?: any,
    @Query('itemId') itemId?: string,
  ): Promise<PlannedOrder[]> {
    return this.plannedOrderService.findAll({ status, orderType, itemId });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get planned order by ID' })
  @ApiParam({ name: 'id' })
  async findOne(@Param('id') id: string): Promise<PlannedOrder> {
    return this.plannedOrderService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update planned order' })
  @ApiParam({ name: 'id' })
  async update(@Param('id') id: string, @Body() updateDto: Partial<PlannedOrder>): Promise<PlannedOrder> {
    return this.plannedOrderService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete planned order' })
  @ApiParam({ name: 'id' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.plannedOrderService.remove(id);
  }

  @Post(':id/release')
  @ApiOperation({ summary: 'Release planned order' })
  @ApiParam({ name: 'id' })
  async release(
    @Param('id') id: string,
    @Body() releaseDto: { releasedOrderId: string },
  ): Promise<PlannedOrder> {
    return this.plannedOrderService.release(id, releaseDto.releasedOrderId);
  }

  @Post(':id/firm')
  @ApiOperation({ summary: 'Firm planned order' })
  @ApiParam({ name: 'id' })
  async firm(
    @Param('id') id: string,
    @Body() firmDto: { firmedBy: string },
  ): Promise<PlannedOrder> {
    return this.plannedOrderService.firm(id, firmDto.firmedBy);
  }
}
