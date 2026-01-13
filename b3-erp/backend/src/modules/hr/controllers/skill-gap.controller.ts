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
import { SkillGapService } from '../services/skill-gap.service';
import {
  CreateSkillGapDto,
  UpdateSkillGapDto,
  SkillGapResponseDto,
} from '../dto';

@ApiTags('HR - Skill Gap Analysis')
@Controller('hr/skill-gaps')
export class SkillGapController {
  constructor(private readonly service: SkillGapService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new skill gap' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Skill gap created successfully',
    type: SkillGapResponseDto,
  })
  async create(@Body() createDto: CreateSkillGapDto): Promise<SkillGapResponseDto> {
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all skill gaps' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status' })
  @ApiQuery({ name: 'priority', required: false, description: 'Filter by priority' })
  @ApiQuery({ name: 'skillId', required: false, description: 'Filter by skill ID' })
  @ApiQuery({ name: 'roleId', required: false, description: 'Filter by role ID' })
  @ApiQuery({ name: 'departmentId', required: false, description: 'Filter by department ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of skill gaps',
    type: [SkillGapResponseDto],
  })
  async findAll(
    @Query('status') status?: string,
    @Query('priority') priority?: string,
    @Query('skillId') skillId?: string,
    @Query('roleId') roleId?: string,
    @Query('departmentId') departmentId?: string,
  ): Promise<SkillGapResponseDto[]> {
    return this.service.findAll({ status, priority, skillId, roleId, departmentId });
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get skill gap analysis summary' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Gap analysis summary statistics',
  })
  async getSummary(): Promise<any> {
    return this.service.getGapAnalysisSummary();
  }

  @Get('by-priority')
  @ApiOperation({ summary: 'Get skill gaps grouped by priority' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Skill gaps grouped by priority',
  })
  async getByPriority(): Promise<Record<string, SkillGapResponseDto[]>> {
    return this.service.getGapsByPriority();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get skill gap by ID' })
  @ApiParam({ name: 'id', description: 'Skill gap ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Skill gap details',
    type: SkillGapResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Skill gap not found' })
  async findOne(@Param('id') id: string): Promise<SkillGapResponseDto> {
    return this.service.findOne(id);
  }

  @Get('code/:code')
  @ApiOperation({ summary: 'Get skill gap by code' })
  @ApiParam({ name: 'code', description: 'Skill gap code' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Skill gap details',
    type: SkillGapResponseDto,
  })
  async findByCode(@Param('code') code: string): Promise<SkillGapResponseDto> {
    return this.service.findByCode(code);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update skill gap' })
  @ApiParam({ name: 'id', description: 'Skill gap ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Skill gap updated successfully',
    type: SkillGapResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateSkillGapDto,
  ): Promise<SkillGapResponseDto> {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete skill gap' })
  @ApiParam({ name: 'id', description: 'Skill gap ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Skill gap deleted successfully',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(id);
  }
}
