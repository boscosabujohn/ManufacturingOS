import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { ProficiencyLevelService } from '../services/proficiency-level.service';
import {
  CreateProficiencyLevelDto,
  UpdateProficiencyLevelDto,
  ProficiencyLevelResponseDto,
} from '../dto';

@ApiTags('HR - Proficiency Levels')
@Controller('hr/proficiency-levels')
export class ProficiencyLevelController {
  constructor(private readonly service: ProficiencyLevelService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new proficiency level' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Proficiency level created successfully',
    type: ProficiencyLevelResponseDto,
  })
  async create(@Body() createDto: CreateProficiencyLevelDto): Promise<ProficiencyLevelResponseDto> {
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all proficiency levels' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of proficiency levels',
    type: [ProficiencyLevelResponseDto],
  })
  async findAll(): Promise<ProficiencyLevelResponseDto[]> {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get proficiency level by ID' })
  @ApiParam({ name: 'id', description: 'Proficiency level ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Proficiency level details',
    type: ProficiencyLevelResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Proficiency level not found' })
  async findOne(@Param('id') id: string): Promise<ProficiencyLevelResponseDto> {
    return this.service.findOne(id);
  }

  @Get('code/:code')
  @ApiOperation({ summary: 'Get proficiency level by code' })
  @ApiParam({ name: 'code', description: 'Proficiency level code' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Proficiency level details',
    type: ProficiencyLevelResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Proficiency level not found' })
  async findByCode(@Param('code') code: string): Promise<ProficiencyLevelResponseDto> {
    return this.service.findByCode(code);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update proficiency level' })
  @ApiParam({ name: 'id', description: 'Proficiency level ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Proficiency level updated successfully',
    type: ProficiencyLevelResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateProficiencyLevelDto,
  ): Promise<ProficiencyLevelResponseDto> {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete proficiency level' })
  @ApiParam({ name: 'id', description: 'Proficiency level ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Proficiency level deleted successfully',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(id);
  }
}
