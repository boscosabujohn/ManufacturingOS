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
import { AttendanceService } from '../services/attendance.service';

@ApiTags('HR - Attendance')
@Controller('hr/attendances')
export class AttendanceController {
  constructor(private readonly service: AttendanceService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new attendance' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Attendance created successfully',
  })
  async create(@Body() createDto: any): Promise<any> {
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all attendances' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of attendances',
  })
  async findAll(
    @Query() filters: any,
  ): Promise<any[]> {
    return this.service.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get attendance by ID' })
  @ApiParam({ name: 'id', description: 'Attendance ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Attendance details',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Attendance not found' })
  async findOne(@Param('id') id: string): Promise<any> {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update attendance' })
  @ApiParam({ name: 'id', description: 'Attendance ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Attendance updated successfully',
  })
  async update(
    @Param('id') id: string,
    @Body() updateDto: any,
  ): Promise<any> {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete attendance' })
  @ApiParam({ name: 'id', description: 'Attendance ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Attendance deleted successfully',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(id);
  }
}
