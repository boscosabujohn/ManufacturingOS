import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ProductionLineService } from '../services/production-line.service';
import { ProductionLine } from '../entities/production-line.entity';

@ApiTags('Production - Settings')
@Controller('production/production-lines')
export class ProductionLineController {
  constructor(private readonly productionLineService: ProductionLineService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new production line' })
  @ApiResponse({ status: HttpStatus.CREATED })
  async create(@Body() createDto: Partial<ProductionLine>): Promise<ProductionLine> {
    return this.productionLineService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all production lines' })
  @ApiQuery({ name: 'status', required: false })
  async findAll(@Query('status') status?: any): Promise<ProductionLine[]> {
    return this.productionLineService.findAll({ status });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get production line by ID' })
  @ApiParam({ name: 'id' })
  async findOne(@Param('id') id: string): Promise<ProductionLine> {
    return this.productionLineService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update production line' })
  @ApiParam({ name: 'id' })
  async update(@Param('id') id: string, @Body() updateDto: Partial<ProductionLine>): Promise<ProductionLine> {
    return this.productionLineService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete production line' })
  @ApiParam({ name: 'id' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.productionLineService.remove(id);
  }

  @Get(':id/capacity-utilization')
  @ApiOperation({ summary: 'Get capacity utilization' })
  @ApiParam({ name: 'id' })
  async getCapacityUtilization(@Param('id') id: string): Promise<any> {
    return this.productionLineService.getCapacityUtilization(id);
  }
}
