import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ProductionPlanService } from '../services/production-plan.service';
import { CreateProductionPlanDto, UpdateProductionPlanDto, ProductionPlanResponseDto } from '../dto';

@ApiTags('Production - Production Plan')
@Controller('production/production-plan')
export class ProductionPlanController {
  constructor(private readonly productionPlanService: ProductionPlanService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new production plan' })
  @ApiResponse({ status: HttpStatus.CREATED, type: ProductionPlanResponseDto })
  async create(@Body() createDto: CreateProductionPlanDto): Promise<ProductionPlanResponseDto> {
    return this.productionPlanService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all production plans' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'periodStartDate', required: false })
  @ApiResponse({ status: HttpStatus.OK, type: [ProductionPlanResponseDto] })
  async findAll(
    @Query('status') status?: any,
    @Query('periodStartDate') periodStartDate?: string,
  ): Promise<ProductionPlanResponseDto[]> {
    return this.productionPlanService.findAll({ status, periodStartDate });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get production plan by ID' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: HttpStatus.OK, type: ProductionPlanResponseDto })
  async findOne(@Param('id') id: string): Promise<ProductionPlanResponseDto> {
    return this.productionPlanService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update production plan' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: HttpStatus.OK, type: ProductionPlanResponseDto })
  async update(@Param('id') id: string, @Body() updateDto: UpdateProductionPlanDto): Promise<ProductionPlanResponseDto> {
    return this.productionPlanService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete production plan' })
  @ApiParam({ name: 'id' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.productionPlanService.remove(id);
  }

  @Post(':id/run-mrp')
  @ApiOperation({ summary: 'Run MRP calculation' })
  @ApiParam({ name: 'id' })
  async runMRP(@Param('id') id: string, @Body('runBy') runBy: string): Promise<any> {
    return this.productionPlanService.runMRP(id, runBy);
  }

  @Get(':id/capacity-planning')
  @ApiOperation({ summary: 'Perform capacity planning analysis' })
  @ApiParam({ name: 'id' })
  async capacityPlanning(@Param('id') id: string): Promise<any> {
    return this.productionPlanService.capacityPlanning(id);
  }

  @Post(':id/freeze')
  @ApiOperation({ summary: 'Freeze production plan' })
  @ApiParam({ name: 'id' })
  async freeze(@Param('id') id: string): Promise<ProductionPlanResponseDto> {
    return this.productionPlanService.freeze(id);
  }
}
