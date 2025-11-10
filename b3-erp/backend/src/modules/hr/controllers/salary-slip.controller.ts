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
import { SalarySlipService } from '../services/salary-slip.service';

@ApiTags('HR - SalarySlip')
@Controller('hr/salary-slips')
export class SalarySlipController {
  constructor(private readonly service: SalarySlipService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new salary-slip' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'SalarySlip created successfully',
  })
  async create(@Body() createDto: any): Promise<any> {
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all salary-slips' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of salary-slips',
  })
  async findAll(
    @Query() filters: any,
  ): Promise<any[]> {
    return this.service.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get salary-slip by ID' })
  @ApiParam({ name: 'id', description: 'SalarySlip ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'SalarySlip details',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'SalarySlip not found' })
  async findOne(@Param('id') id: string): Promise<any> {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update salary-slip' })
  @ApiParam({ name: 'id', description: 'SalarySlip ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'SalarySlip updated successfully',
  })
  async update(
    @Param('id') id: string,
    @Body() updateDto: any,
  ): Promise<any> {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete salary-slip' })
  @ApiParam({ name: 'id', description: 'SalarySlip ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'SalarySlip deleted successfully',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(id);
  }
}
