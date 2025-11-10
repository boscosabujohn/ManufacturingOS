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
import { DesignationService } from '../services/designation.service';

@ApiTags('HR - Designation')
@Controller('hr/designations')
export class DesignationController {
  constructor(private readonly service: DesignationService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new designation' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Designation created successfully',
  })
  async create(@Body() createDto: any): Promise<any> {
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all designations' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of designations',
  })
  async findAll(
    @Query() filters: any,
  ): Promise<any[]> {
    return this.service.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get designation by ID' })
  @ApiParam({ name: 'id', description: 'Designation ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Designation details',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Designation not found' })
  async findOne(@Param('id') id: string): Promise<any> {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update designation' })
  @ApiParam({ name: 'id', description: 'Designation ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Designation updated successfully',
  })
  async update(
    @Param('id') id: string,
    @Body() updateDto: any,
  ): Promise<any> {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete designation' })
  @ApiParam({ name: 'id', description: 'Designation ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Designation deleted successfully',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(id);
  }
}
