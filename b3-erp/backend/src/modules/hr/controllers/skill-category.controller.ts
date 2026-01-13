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
} from '@nestjs/swagger';
import { SkillCategoryService } from '../services/skill-category.service';
import {
  CreateSkillCategoryDto,
  UpdateSkillCategoryDto,
  SkillCategoryResponseDto,
} from '../dto';

@ApiTags('HR - Skill Categories')
@Controller('hr/skill-categories')
export class SkillCategoryController {
  constructor(private readonly service: SkillCategoryService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new skill category' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Skill category created successfully',
    type: SkillCategoryResponseDto,
  })
  async create(@Body() createDto: CreateSkillCategoryDto): Promise<SkillCategoryResponseDto> {
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all skill categories' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of skill categories',
    type: [SkillCategoryResponseDto],
  })
  async findAll(@Query() filters: any): Promise<SkillCategoryResponseDto[]> {
    return this.service.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get skill category by ID' })
  @ApiParam({ name: 'id', description: 'Skill category ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Skill category details',
    type: SkillCategoryResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Skill category not found' })
  async findOne(@Param('id') id: string): Promise<SkillCategoryResponseDto> {
    return this.service.findOne(id);
  }

  @Get('code/:code')
  @ApiOperation({ summary: 'Get skill category by code' })
  @ApiParam({ name: 'code', description: 'Skill category code' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Skill category details',
    type: SkillCategoryResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Skill category not found' })
  async findByCode(@Param('code') code: string): Promise<SkillCategoryResponseDto> {
    return this.service.findByCode(code);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update skill category' })
  @ApiParam({ name: 'id', description: 'Skill category ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Skill category updated successfully',
    type: SkillCategoryResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateSkillCategoryDto,
  ): Promise<SkillCategoryResponseDto> {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete skill category' })
  @ApiParam({ name: 'id', description: 'Skill category ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Skill category deleted successfully',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(id);
  }
}
