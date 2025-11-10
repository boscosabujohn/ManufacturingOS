import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { WarehouseService } from '../services/warehouse.service';
import {
  CreateWarehouseDto,
  UpdateWarehouseDto,
  WarehouseResponseDto,
} from '../dto';

@ApiTags('Inventory - Warehouse')
@Controller('inventory/warehouses')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new warehouse' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Warehouse created successfully',
    type: WarehouseResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input',
  })
  async create(
    @Body() createDto: CreateWarehouseDto,
  ): Promise<WarehouseResponseDto> {
    return this.warehouseService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all warehouses' })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter by status',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    description: 'Filter by warehouse type',
  })
  @ApiQuery({
    name: 'branchId',
    required: false,
    description: 'Filter by branch',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of warehouses',
    type: [WarehouseResponseDto],
  })
  async findAll(
    @Query('status') status?: string,
    @Query('type') type?: string,
    @Query('branchId') branchId?: string,
  ): Promise<WarehouseResponseDto[]> {
    return this.warehouseService.findAll({ status, type, branchId });
  }

  @Get('active')
  @ApiOperation({ summary: 'Get all active warehouses' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of active warehouses',
    type: [WarehouseResponseDto],
  })
  async findActive(): Promise<WarehouseResponseDto[]> {
    return this.warehouseService.findActive();
  }

  @Get('capacity-utilization')
  @ApiOperation({ summary: 'Get warehouse capacity utilization report' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Capacity utilization report',
  })
  async getCapacityUtilization(): Promise<any> {
    return this.warehouseService.getCapacityUtilization();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get warehouse by ID' })
  @ApiParam({ name: 'id', description: 'Warehouse ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Warehouse details',
    type: WarehouseResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Warehouse not found',
  })
  async findOne(@Param('id') id: string): Promise<WarehouseResponseDto> {
    return this.warehouseService.findOne(id);
  }

  @Get(':id/locations')
  @ApiOperation({ summary: 'Get all locations in a warehouse' })
  @ApiParam({ name: 'id', description: 'Warehouse ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of locations in warehouse',
  })
  async getLocations(@Param('id') id: string): Promise<any[]> {
    return this.warehouseService.getLocations(id);
  }

  @Get(':id/stock-summary')
  @ApiOperation({ summary: 'Get stock summary for a warehouse' })
  @ApiParam({ name: 'id', description: 'Warehouse ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Stock summary for warehouse',
  })
  async getStockSummary(@Param('id') id: string): Promise<any> {
    return this.warehouseService.getStockSummary(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update warehouse' })
  @ApiParam({ name: 'id', description: 'Warehouse ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Warehouse updated successfully',
    type: WarehouseResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Warehouse not found',
  })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateWarehouseDto,
  ): Promise<WarehouseResponseDto> {
    return this.warehouseService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete warehouse' })
  @ApiParam({ name: 'id', description: 'Warehouse ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Warehouse deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Warehouse not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Cannot delete warehouse with active stock',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.warehouseService.remove(id);
  }

  @Post(':id/activate')
  @ApiOperation({ summary: 'Activate warehouse' })
  @ApiParam({ name: 'id', description: 'Warehouse ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Warehouse activated successfully',
    type: WarehouseResponseDto,
  })
  async activate(@Param('id') id: string): Promise<WarehouseResponseDto> {
    return this.warehouseService.activate(id);
  }

  @Post(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate warehouse' })
  @ApiParam({ name: 'id', description: 'Warehouse ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Warehouse deactivated successfully',
    type: WarehouseResponseDto,
  })
  async deactivate(@Param('id') id: string): Promise<WarehouseResponseDto> {
    return this.warehouseService.deactivate(id);
  }
}
