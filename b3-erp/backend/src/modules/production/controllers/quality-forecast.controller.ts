import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { QualityForecastService } from '../services/quality-forecast.service';
import { QualityForecast } from '../entities/quality-forecast.entity';

@ApiTags('Production - Smart AI')
@Controller('production/quality-forecasts')
export class QualityForecastController {
  constructor(private readonly qualityForecastService: QualityForecastService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new quality forecast' })
  @ApiResponse({ status: HttpStatus.CREATED })
  async create(@Body() createDto: Partial<QualityForecast>): Promise<QualityForecast> {
    return this.qualityForecastService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all quality forecasts' })
  @ApiQuery({ name: 'forecastType', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'productId', required: false })
  async findAll(
    @Query('forecastType') forecastType?: any,
    @Query('status') status?: any,
    @Query('productId') productId?: string,
  ): Promise<QualityForecast[]> {
    return this.qualityForecastService.findAll({ forecastType, status, productId });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get quality forecast by ID' })
  @ApiParam({ name: 'id' })
  async findOne(@Param('id') id: string): Promise<QualityForecast> {
    return this.qualityForecastService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update quality forecast' })
  @ApiParam({ name: 'id' })
  async update(@Param('id') id: string, @Body() updateDto: Partial<QualityForecast>): Promise<QualityForecast> {
    return this.qualityForecastService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete quality forecast' })
  @ApiParam({ name: 'id' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.qualityForecastService.remove(id);
  }

  @Post(':id/activate')
  @ApiOperation({ summary: 'Activate forecast' })
  @ApiParam({ name: 'id' })
  async activate(@Param('id') id: string): Promise<QualityForecast> {
    return this.qualityForecastService.activate(id);
  }

  @Post(':id/validate')
  @ApiOperation({ summary: 'Validate forecast' })
  @ApiParam({ name: 'id' })
  async validate(@Param('id') id: string, @Body('validatedBy') validatedBy: string): Promise<QualityForecast> {
    return this.qualityForecastService.validate(id, validatedBy);
  }

  @Post(':id/validation-result')
  @ApiOperation({ summary: 'Add validation result' })
  @ApiParam({ name: 'id' })
  async addValidationResult(@Param('id') id: string, @Body() result: any): Promise<QualityForecast> {
    return this.qualityForecastService.addValidationResult(id, result);
  }

  @Get(':id/accuracy')
  @ApiOperation({ summary: 'Get forecast accuracy' })
  @ApiParam({ name: 'id' })
  async getAccuracy(@Param('id') id: string): Promise<any> {
    return this.qualityForecastService.getForecastAccuracy(id);
  }
}
