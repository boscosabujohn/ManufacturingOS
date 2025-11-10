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
import { LeaveBalanceService } from '../services/leave-balance.service';

@ApiTags('HR - LeaveBalance')
@Controller('hr/leave-balances')
export class LeaveBalanceController {
  constructor(private readonly service: LeaveBalanceService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new leave-balance' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'LeaveBalance created successfully',
  })
  async create(@Body() createDto: any): Promise<any> {
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all leave-balances' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of leave-balances',
  })
  async findAll(
    @Query() filters: any,
  ): Promise<any[]> {
    return this.service.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get leave-balance by ID' })
  @ApiParam({ name: 'id', description: 'LeaveBalance ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'LeaveBalance details',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'LeaveBalance not found' })
  async findOne(@Param('id') id: string): Promise<any> {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update leave-balance' })
  @ApiParam({ name: 'id', description: 'LeaveBalance ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'LeaveBalance updated successfully',
  })
  async update(
    @Param('id') id: string,
    @Body() updateDto: any,
  ): Promise<any> {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete leave-balance' })
  @ApiParam({ name: 'id', description: 'LeaveBalance ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'LeaveBalance deleted successfully',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(id);
  }
}
