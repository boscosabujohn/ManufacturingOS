import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ShiftService } from '../services/shift.service';
import { Shift } from '../entities/shift.entity';

@ApiTags('Production - Settings')
@Controller('production/shifts')
export class ShiftController {
  constructor(private readonly shiftService: ShiftService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new shift' })
  @ApiResponse({ status: HttpStatus.CREATED })
  async create(@Body() createDto: Partial<Shift>): Promise<Shift> {
    return this.shiftService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all shifts' })
  @ApiQuery({ name: 'isActive', required: false })
  async findAll(@Query('isActive') isActive?: string): Promise<Shift[]> {
    return this.shiftService.findAll({ isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined });
  }

  @Get('current')
  @ApiOperation({ summary: 'Get current shift' })
  @ApiQuery({ name: 'companyId', required: true })
  async getCurrentShift(@Query('companyId') companyId: string): Promise<Shift | null> {
    return this.shiftService.getCurrentShift(companyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get shift by ID' })
  @ApiParam({ name: 'id' })
  async findOne(@Param('id') id: string): Promise<Shift> {
    return this.shiftService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update shift' })
  @ApiParam({ name: 'id' })
  async update(@Param('id') id: string, @Body() updateDto: Partial<Shift>): Promise<Shift> {
    return this.shiftService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete shift' })
  @ApiParam({ name: 'id' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.shiftService.remove(id);
  }
}
