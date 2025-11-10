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
import { LeaveTypeService } from '../services/leave-type.service';

@ApiTags('HR - LeaveType')
@Controller('hr/leave-types')
export class LeaveTypeController {
  constructor(private readonly service: LeaveTypeService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new leave-type' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'LeaveType created successfully',
  })
  async create(@Body() createDto: any): Promise<any> {
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all leave-types' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of leave-types',
  })
  async findAll(
    @Query() filters: any,
  ): Promise<any[]> {
    return this.service.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get leave-type by ID' })
  @ApiParam({ name: 'id', description: 'LeaveType ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'LeaveType details',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'LeaveType not found' })
  async findOne(@Param('id') id: string): Promise<any> {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update leave-type' })
  @ApiParam({ name: 'id', description: 'LeaveType ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'LeaveType updated successfully',
  })
  async update(
    @Param('id') id: string,
    @Body() updateDto: any,
  ): Promise<any> {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete leave-type' })
  @ApiParam({ name: 'id', description: 'LeaveType ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'LeaveType deleted successfully',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(id);
  }
}
