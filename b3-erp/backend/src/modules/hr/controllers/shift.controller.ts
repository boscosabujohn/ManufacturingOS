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
import { ShiftService } from '../services/shift.service';

@ApiTags('HR - Shift')
@Controller('hr/shifts')
export class ShiftController {
  constructor(private readonly service: ShiftService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new shift' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Shift created successfully',
  })
  async create(@Body() createDto: any): Promise<any> {
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all shifts' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of shifts',
  })
  async findAll(
    @Query() filters: any,
  ): Promise<any[]> {
    return this.service.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get shift by ID' })
  @ApiParam({ name: 'id', description: 'Shift ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Shift details',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Shift not found' })
  async findOne(@Param('id') id: string): Promise<any> {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update shift' })
  @ApiParam({ name: 'id', description: 'Shift ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Shift updated successfully',
  })
  async update(
    @Param('id') id: string,
    @Body() updateDto: any,
  ): Promise<any> {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete shift' })
  @ApiParam({ name: 'id', description: 'Shift ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Shift deleted successfully',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(id);
  }
}
