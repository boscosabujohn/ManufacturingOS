import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { MaterialRequirementService } from '../services/material-requirement.service';
import { MaterialRequirement } from '../entities/material-requirement.entity';

@ApiTags('Production - Material Requirements')
@Controller('production/material-requirements')
export class MaterialRequirementController {
  constructor(private readonly materialRequirementService: MaterialRequirementService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new material requirement' })
  @ApiResponse({ status: HttpStatus.CREATED })
  async create(@Body() createDto: Partial<MaterialRequirement>): Promise<MaterialRequirement> {
    return this.materialRequirementService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all material requirements' })
  @ApiQuery({ name: 'requirementType', required: false })
  @ApiQuery({ name: 'itemId', required: false })
  @ApiQuery({ name: 'mrpRunId', required: false })
  async findAll(
    @Query('requirementType') requirementType?: any,
    @Query('itemId') itemId?: string,
    @Query('mrpRunId') mrpRunId?: string,
  ): Promise<MaterialRequirement[]> {
    return this.materialRequirementService.findAll({ requirementType, itemId, mrpRunId });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get material requirement by ID' })
  @ApiParam({ name: 'id' })
  async findOne(@Param('id') id: string): Promise<MaterialRequirement> {
    return this.materialRequirementService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update material requirement' })
  @ApiParam({ name: 'id' })
  async update(@Param('id') id: string, @Body() updateDto: Partial<MaterialRequirement>): Promise<MaterialRequirement> {
    return this.materialRequirementService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete material requirement' })
  @ApiParam({ name: 'id' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.materialRequirementService.remove(id);
  }

  @Get(':id/calculate-net')
  @ApiOperation({ summary: 'Calculate net requirement' })
  @ApiParam({ name: 'id' })
  async calculateNetRequirement(@Param('id') id: string): Promise<any> {
    return this.materialRequirementService.calculateNetRequirement(id);
  }
}
