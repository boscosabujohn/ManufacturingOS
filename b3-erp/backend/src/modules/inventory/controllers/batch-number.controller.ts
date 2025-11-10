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
import { BatchNumberService } from '../services/batch-number.service';
import {
  CreateBatchNumberDto,
  UpdateBatchNumberDto,
  BatchNumberResponseDto,
} from '../dto';

@ApiTags('Inventory - Batch Number')
@Controller('inventory/batch-numbers')
export class BatchNumberController {
  constructor(private readonly batchNumberService: BatchNumberService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new batch number' })
  @ApiResponse({ status: HttpStatus.CREATED, type: BatchNumberResponseDto })
  async create(
    @Body() createDto: CreateBatchNumberDto,
  ): Promise<BatchNumberResponseDto> {
    return this.batchNumberService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all batch numbers' })
  @ApiQuery({ name: 'itemId', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiResponse({ status: HttpStatus.OK, type: [BatchNumberResponseDto] })
  async findAll(
    @Query('itemId') itemId?: string,
    @Query('status') status?: string,
  ): Promise<BatchNumberResponseDto[]> {
    return this.batchNumberService.findAll({ itemId, status });
  }

  @Get('available')
  @ApiOperation({ summary: 'Get available batches' })
  @ApiQuery({ name: 'itemId', required: true })
  @ApiResponse({ status: HttpStatus.OK, type: [BatchNumberResponseDto] })
  async findAvailable(
    @Query('itemId') itemId: string,
  ): Promise<BatchNumberResponseDto[]> {
    return this.batchNumberService.findAvailable(itemId);
  }

  @Get('expiring-soon')
  @ApiOperation({ summary: 'Get batches expiring soon' })
  @ApiQuery({ name: 'days', required: false, description: 'Days threshold' })
  @ApiResponse({ status: HttpStatus.OK, type: [BatchNumberResponseDto] })
  async getExpiringSoon(
    @Query('days') days?: number,
  ): Promise<BatchNumberResponseDto[]> {
    return this.batchNumberService.getExpiringSoon(days || 30);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get batch number by ID' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: HttpStatus.OK, type: BatchNumberResponseDto })
  async findOne(@Param('id') id: string): Promise<BatchNumberResponseDto> {
    return this.batchNumberService.findOne(id);
  }

  @Get('by-batch/:batchNumber')
  @ApiOperation({ summary: 'Get by batch number' })
  @ApiParam({ name: 'batchNumber' })
  @ApiQuery({ name: 'itemId', required: true })
  @ApiResponse({ status: HttpStatus.OK, type: BatchNumberResponseDto })
  async findByBatch(
    @Param('batchNumber') batchNumber: string,
    @Query('itemId') itemId: string,
  ): Promise<BatchNumberResponseDto> {
    return this.batchNumberService.findByBatch(batchNumber, itemId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update batch number' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: HttpStatus.OK, type: BatchNumberResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateBatchNumberDto,
  ): Promise<BatchNumberResponseDto> {
    return this.batchNumberService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete batch number' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  async remove(@Param('id') id: string): Promise<void> {
    return this.batchNumberService.remove(id);
  }
}
