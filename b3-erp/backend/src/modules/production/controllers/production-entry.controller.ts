import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ProductionEntryService } from '../services/production-entry.service';
import { CreateProductionEntryDto, UpdateProductionEntryDto, ProductionEntryResponseDto } from '../dto';

@ApiTags('Production - Production Entry')
@Controller('production/production-entry')
export class ProductionEntryController {
  constructor(private readonly productionEntryService: ProductionEntryService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new production entry' })
  @ApiResponse({ status: HttpStatus.CREATED, type: ProductionEntryResponseDto })
  async create(@Body() createDto: CreateProductionEntryDto): Promise<ProductionEntryResponseDto> {
    return this.productionEntryService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all production entries' })
  @ApiQuery({ name: 'workOrderId', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiResponse({ status: HttpStatus.OK, type: [ProductionEntryResponseDto] })
  async findAll(
    @Query('workOrderId') workOrderId?: string,
    @Query('status') status?: any,
    @Query('startDate') startDate?: string,
  ): Promise<ProductionEntryResponseDto[]> {
    return this.productionEntryService.findAll({ workOrderId, status, startDate });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get production entry by ID' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: HttpStatus.OK, type: ProductionEntryResponseDto })
  async findOne(@Param('id') id: string): Promise<ProductionEntryResponseDto> {
    return this.productionEntryService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update production entry' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: HttpStatus.OK, type: ProductionEntryResponseDto })
  async update(@Param('id') id: string, @Body() updateDto: UpdateProductionEntryDto): Promise<ProductionEntryResponseDto> {
    return this.productionEntryService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete production entry' })
  @ApiParam({ name: 'id' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.productionEntryService.remove(id);
  }

  @Post(':id/post')
  @ApiOperation({ summary: 'Post production to inventory' })
  @ApiParam({ name: 'id' })
  async postProduction(@Param('id') id: string, @Body('postedBy') postedBy: string): Promise<ProductionEntryResponseDto> {
    return this.productionEntryService.postProduction(id, postedBy);
  }

  @Post(':id/consume-materials')
  @ApiOperation({ summary: 'Consume materials' })
  @ApiParam({ name: 'id' })
  async consumeMaterials(
    @Param('id') id: string,
    @Body('materialsConsumed') materialsConsumed: any[],
  ): Promise<ProductionEntryResponseDto> {
    return this.productionEntryService.consumeMaterials(id, materialsConsumed);
  }

  @Post(':id/reverse')
  @ApiOperation({ summary: 'Reverse production entry' })
  @ApiParam({ name: 'id' })
  async reverse(
    @Param('id') id: string,
    @Body('reversedBy') reversedBy: string,
    @Body('reason') reason: string,
  ): Promise<ProductionEntryResponseDto> {
    return this.productionEntryService.reverse(id, reversedBy, reason);
  }
}
