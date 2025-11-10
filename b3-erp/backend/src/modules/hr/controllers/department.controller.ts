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
import { DepartmentService } from '../services/department.service';

@ApiTags('HR - Department')
@Controller('hr/departments')
export class DepartmentController {
  constructor(private readonly service: DepartmentService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new department' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Department created successfully',
  })
  async create(@Body() createDto: any): Promise<any> {
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all departments' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of departments',
  })
  async findAll(
    @Query() filters: any,
  ): Promise<any[]> {
    return this.service.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get department by ID' })
  @ApiParam({ name: 'id', description: 'Department ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Department details',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Department not found' })
  async findOne(@Param('id') id: string): Promise<any> {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update department' })
  @ApiParam({ name: 'id', description: 'Department ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Department updated successfully',
  })
  async update(
    @Param('id') id: string,
    @Body() updateDto: any,
  ): Promise<any> {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete department' })
  @ApiParam({ name: 'id', description: 'Department ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Department deleted successfully',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(id);
  }
}
