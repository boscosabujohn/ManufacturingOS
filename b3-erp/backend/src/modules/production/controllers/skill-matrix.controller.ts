import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { SkillMatrixService } from '../services/skill-matrix.service';
import { SkillMatrix, ProficiencyLevel } from '../entities/skill-matrix.entity';

@ApiTags('Production - Human-Centric')
@Controller('production/skill-matrices')
export class SkillMatrixController {
  constructor(private readonly skillMatrixService: SkillMatrixService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new skill matrix' })
  @ApiResponse({ status: HttpStatus.CREATED })
  async create(@Body() createDto: Partial<SkillMatrix>): Promise<SkillMatrix> {
    return this.skillMatrixService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all skill matrices' })
  @ApiQuery({ name: 'department', required: false })
  @ApiQuery({ name: 'employeeId', required: false })
  async findAll(
    @Query('department') department?: string,
    @Query('employeeId') employeeId?: string,
  ): Promise<SkillMatrix[]> {
    return this.skillMatrixService.findAll({ department, employeeId });
  }

  @Get('gap-analysis')
  @ApiOperation({ summary: 'Get skill gap analysis' })
  @ApiQuery({ name: 'companyId', required: true })
  async getSkillGapAnalysis(@Query('companyId') companyId: string): Promise<any> {
    return this.skillMatrixService.getSkillGapAnalysis(companyId);
  }

  @Get('by-skill/:skillId')
  @ApiOperation({ summary: 'Find employees with skill' })
  @ApiParam({ name: 'skillId' })
  @ApiQuery({ name: 'companyId', required: true })
  @ApiQuery({ name: 'minLevel', required: false })
  async findEmployeesWithSkill(
    @Param('skillId') skillId: string,
    @Query('companyId') companyId: string,
    @Query('minLevel') minLevel?: ProficiencyLevel,
  ): Promise<SkillMatrix[]> {
    return this.skillMatrixService.findEmployeesWithSkill(companyId, skillId, minLevel);
  }

  @Get('employee/:employeeId')
  @ApiOperation({ summary: 'Get skill matrix by employee' })
  @ApiParam({ name: 'employeeId' })
  async findByEmployee(@Param('employeeId') employeeId: string): Promise<SkillMatrix | null> {
    return this.skillMatrixService.findByEmployee(employeeId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get skill matrix by ID' })
  @ApiParam({ name: 'id' })
  async findOne(@Param('id') id: string): Promise<SkillMatrix> {
    return this.skillMatrixService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update skill matrix' })
  @ApiParam({ name: 'id' })
  async update(@Param('id') id: string, @Body() updateDto: Partial<SkillMatrix>): Promise<SkillMatrix> {
    return this.skillMatrixService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete skill matrix' })
  @ApiParam({ name: 'id' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.skillMatrixService.remove(id);
  }

  @Post(':id/skill')
  @ApiOperation({ summary: 'Add skill' })
  @ApiParam({ name: 'id' })
  async addSkill(@Param('id') id: string, @Body() skill: any): Promise<SkillMatrix> {
    return this.skillMatrixService.addSkill(id, skill);
  }

  @Put(':id/skill/:skillId')
  @ApiOperation({ summary: 'Update skill' })
  @ApiParam({ name: 'id' })
  @ApiParam({ name: 'skillId' })
  async updateSkill(
    @Param('id') id: string,
    @Param('skillId') skillId: string,
    @Body() updates: any,
  ): Promise<SkillMatrix> {
    return this.skillMatrixService.updateSkill(id, skillId, updates);
  }

  @Post(':id/certification')
  @ApiOperation({ summary: 'Add certification' })
  @ApiParam({ name: 'id' })
  async addCertification(@Param('id') id: string, @Body() certification: any): Promise<SkillMatrix> {
    return this.skillMatrixService.addCertification(id, certification);
  }

  @Post(':id/training')
  @ApiOperation({ summary: 'Add training' })
  @ApiParam({ name: 'id' })
  async addTraining(@Param('id') id: string, @Body() training: any): Promise<SkillMatrix> {
    return this.skillMatrixService.addTraining(id, training);
  }
}
