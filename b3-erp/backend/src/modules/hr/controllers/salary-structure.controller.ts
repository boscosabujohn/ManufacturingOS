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
import { SalaryStructureService } from '../services/salary-structure.service';

@ApiTags('HR - SalaryStructure')
@Controller('hr/salary-structures')
export class SalaryStructureController {
  constructor(private readonly service: SalaryStructureService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new salary-structure' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'SalaryStructure created successfully',
  })
  async create(@Body() createDto: any): Promise<any> {
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all salary-structures' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of salary-structures',
  })
  async findAll(
    @Query() filters: any,
  ): Promise<any[]> {
    return this.service.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get salary-structure by ID' })
  @ApiParam({ name: 'id', description: 'SalaryStructure ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'SalaryStructure details',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'SalaryStructure not found' })
  async findOne(@Param('id') id: string): Promise<any> {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update salary-structure' })
  @ApiParam({ name: 'id', description: 'SalaryStructure ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'SalaryStructure updated successfully',
  })
  async update(
    @Param('id') id: string,
    @Body() updateDto: any,
  ): Promise<any> {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete salary-structure' })
  @ApiParam({ name: 'id', description: 'SalaryStructure ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'SalaryStructure deleted successfully',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(id);
  }
}
