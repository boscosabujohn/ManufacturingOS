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
import { SkillService } from '../services/skill.service';
import {
  CreateSkillDto,
  UpdateSkillDto,
  SkillResponseDto,
} from '../dto';

@ApiTags('HR - Skills')
@Controller('hr/skills')
export class SkillController {
  constructor(private readonly service: SkillService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new skill' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Skill created successfully',
    type: SkillResponseDto,
  })
  async create(@Body() createDto: CreateSkillDto): Promise<SkillResponseDto> {
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all skills' })
  @ApiQuery({ name: 'categoryId', required: false, description: 'Filter by category ID' })
  @ApiQuery({ name: 'skillType', required: false, description: 'Filter by skill type' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status' })
  @ApiQuery({ name: 'search', required: false, description: 'Search by name, code, or description' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of skills',
    type: [SkillResponseDto],
  })
  async findAll(
    @Query('categoryId') categoryId?: string,
    @Query('skillType') skillType?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ): Promise<SkillResponseDto[]> {
    return this.service.findAll({ categoryId, skillType, status, search });
  }

  @Get('grouped')
  @ApiOperation({ summary: 'Get skills grouped by category' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Skills grouped by category',
  })
  async getSkillsByCategory(): Promise<Record<string, SkillResponseDto[]>> {
    return this.service.getSkillsByCategory();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get skill by ID' })
  @ApiParam({ name: 'id', description: 'Skill ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Skill details',
    type: SkillResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Skill not found' })
  async findOne(@Param('id') id: string): Promise<SkillResponseDto> {
    return this.service.findOne(id);
  }

  @Get('code/:code')
  @ApiOperation({ summary: 'Get skill by code' })
  @ApiParam({ name: 'code', description: 'Skill code' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Skill details',
    type: SkillResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Skill not found' })
  async findByCode(@Param('code') code: string): Promise<SkillResponseDto> {
    return this.service.findByCode(code);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update skill' })
  @ApiParam({ name: 'id', description: 'Skill ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Skill updated successfully',
    type: SkillResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateSkillDto,
  ): Promise<SkillResponseDto> {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete skill' })
  @ApiParam({ name: 'id', description: 'Skill ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Skill deleted successfully',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(id);
  }
}
