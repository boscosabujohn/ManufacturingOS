import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CarbonFootprintService } from '../services/carbon-footprint.service';
import { CarbonFootprint, EmissionScope, EmissionSource } from '../entities/carbon-footprint.entity';

@ApiTags('Production - Sustainability - Carbon Footprint')
@Controller('production/sustainability/carbon-footprint')
export class CarbonFootprintController {
  constructor(private readonly carbonFootprintService: CarbonFootprintService) {}

  @Post()
  @ApiOperation({ summary: 'Create carbon footprint record' })
  @ApiResponse({ status: HttpStatus.CREATED })
  async create(@Body() createDto: Partial<CarbonFootprint>): Promise<CarbonFootprint> {
    return this.carbonFootprintService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all carbon footprint records' })
  @ApiQuery({ name: 'companyId', required: false })
  @ApiQuery({ name: 'scope', required: false })
  @ApiQuery({ name: 'source', required: false })
  async findAll(
    @Query('companyId') companyId?: string,
    @Query('scope') scope?: EmissionScope,
    @Query('source') source?: EmissionSource,
  ): Promise<CarbonFootprint[]> {
    return this.carbonFootprintService.findAll({ companyId, scope, source });
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get emissions summary' })
  @ApiQuery({ name: 'companyId', required: true })
  @ApiQuery({ name: 'startDate', required: true })
  @ApiQuery({ name: 'endDate', required: true })
  async getEmissionsSummary(
    @Query('companyId') companyId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<any> {
    return this.carbonFootprintService.getEmissionsSummary(companyId, new Date(startDate), new Date(endDate));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get carbon footprint by ID' })
  @ApiParam({ name: 'id' })
  async findOne(@Param('id') id: string): Promise<CarbonFootprint> {
    return this.carbonFootprintService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update carbon footprint record' })
  @ApiParam({ name: 'id' })
  async update(@Param('id') id: string, @Body() updateDto: Partial<CarbonFootprint>): Promise<CarbonFootprint> {
    return this.carbonFootprintService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete carbon footprint record' })
  @ApiParam({ name: 'id' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.carbonFootprintService.remove(id);
  }

  @Post(':id/verify')
  @ApiOperation({ summary: 'Verify carbon footprint record' })
  @ApiParam({ name: 'id' })
  async verify(@Param('id') id: string, @Body('verifiedBy') verifiedBy: string): Promise<CarbonFootprint> {
    return this.carbonFootprintService.verify(id, verifiedBy);
  }
}
