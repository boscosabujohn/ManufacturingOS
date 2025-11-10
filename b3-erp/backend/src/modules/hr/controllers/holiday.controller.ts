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
import { HolidayService } from '../services/holiday.service';

@ApiTags('HR - Holiday')
@Controller('hr/holidays')
export class HolidayController {
  constructor(private readonly service: HolidayService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new holiday' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Holiday created successfully',
  })
  async create(@Body() createDto: any): Promise<any> {
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all holidays' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of holidays',
  })
  async findAll(
    @Query() filters: any,
  ): Promise<any[]> {
    return this.service.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get holiday by ID' })
  @ApiParam({ name: 'id', description: 'Holiday ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Holiday details',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Holiday not found' })
  async findOne(@Param('id') id: string): Promise<any> {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update holiday' })
  @ApiParam({ name: 'id', description: 'Holiday ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Holiday updated successfully',
  })
  async update(
    @Param('id') id: string,
    @Body() updateDto: any,
  ): Promise<any> {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete holiday' })
  @ApiParam({ name: 'id', description: 'Holiday ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Holiday deleted successfully',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(id);
  }
}
