import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ShopFloorControlService } from '../services/shop-floor-control.service';
import { CreateShopFloorControlDto, UpdateShopFloorControlDto, ShopFloorControlResponseDto } from '../dto';

@ApiTags('Production - Shop Floor Control')
@Controller('production/shop-floor-control')
export class ShopFloorControlController {
  constructor(private readonly shopFloorControlService: ShopFloorControlService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new shop floor entry' })
  @ApiResponse({ status: HttpStatus.CREATED, type: ShopFloorControlResponseDto })
  async create(@Body() createDto: CreateShopFloorControlDto): Promise<ShopFloorControlResponseDto> {
    return this.shopFloorControlService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all shop floor entries' })
  @ApiQuery({ name: 'workOrderId', required: false })
  @ApiQuery({ name: 'workCenterId', required: false })
  @ApiResponse({ status: HttpStatus.OK, type: [ShopFloorControlResponseDto] })
  async findAll(
    @Query('workOrderId') workOrderId?: string,
    @Query('workCenterId') workCenterId?: string,
  ): Promise<ShopFloorControlResponseDto[]> {
    return this.shopFloorControlService.findAll({ workOrderId, workCenterId });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get shop floor entry by ID' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: HttpStatus.OK, type: ShopFloorControlResponseDto })
  async findOne(@Param('id') id: string): Promise<ShopFloorControlResponseDto> {
    return this.shopFloorControlService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update shop floor entry' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: HttpStatus.OK, type: ShopFloorControlResponseDto })
  async update(@Param('id') id: string, @Body() updateDto: UpdateShopFloorControlDto): Promise<ShopFloorControlResponseDto> {
    return this.shopFloorControlService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete shop floor entry' })
  @ApiParam({ name: 'id' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.shopFloorControlService.remove(id);
  }

  @Post(':id/start-operation')
  @ApiOperation({ summary: 'Start operation' })
  @ApiParam({ name: 'id' })
  async startOperation(@Param('id') id: string): Promise<ShopFloorControlResponseDto> {
    return this.shopFloorControlService.startOperation(id);
  }

  @Post(':id/complete-operation')
  @ApiOperation({ summary: 'Complete operation' })
  @ApiParam({ name: 'id' })
  async completeOperation(
    @Param('id') id: string,
    @Body('completedQuantity') completedQty: number,
  ): Promise<ShopFloorControlResponseDto> {
    return this.shopFloorControlService.completeOperation(id, completedQty);
  }

  @Post(':id/report-downtime')
  @ApiOperation({ summary: 'Report downtime' })
  @ApiParam({ name: 'id' })
  async reportDowntime(@Param('id') id: string, @Body() downtimeData: any): Promise<ShopFloorControlResponseDto> {
    return this.shopFloorControlService.reportDowntime(id, downtimeData);
  }
}
