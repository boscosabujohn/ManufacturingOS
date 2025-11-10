import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { OperationService } from '../services/operation.service';
import { CreateOperationDto, UpdateOperationDto, OperationResponseDto } from '../dto';

@ApiTags('Production - Operation')
@Controller('production/operation')
export class OperationController {
  constructor(private readonly operationService: OperationService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new operation' })
  @ApiResponse({ status: HttpStatus.CREATED, type: OperationResponseDto })
  async create(@Body() createDto: CreateOperationDto): Promise<OperationResponseDto> {
    return this.operationService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all operations' })
  @ApiQuery({ name: 'operationType', required: false })
  @ApiQuery({ name: 'workCenterId', required: false })
  @ApiQuery({ name: 'isActive', required: false })
  @ApiResponse({ status: HttpStatus.OK, type: [OperationResponseDto] })
  async findAll(
    @Query('operationType') operationType?: string,
    @Query('workCenterId') workCenterId?: string,
    @Query('isActive') isActive?: boolean,
  ): Promise<OperationResponseDto[]> {
    return this.operationService.findAll({ operationType, workCenterId, isActive });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get operation by ID' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: HttpStatus.OK, type: OperationResponseDto })
  async findOne(@Param('id') id: string): Promise<OperationResponseDto> {
    return this.operationService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update operation' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: HttpStatus.OK, type: OperationResponseDto })
  async update(@Param('id') id: string, @Body() updateDto: UpdateOperationDto): Promise<OperationResponseDto> {
    return this.operationService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete operation' })
  @ApiParam({ name: 'id' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.operationService.remove(id);
  }
}
