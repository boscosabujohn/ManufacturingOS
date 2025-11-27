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
  ApiBody,
} from '@nestjs/swagger';
import { StockAdjustmentService } from '../services/stock-adjustment.service';
import {
  CreateStockAdjustmentDto,
  UpdateStockAdjustmentDto,
  StockAdjustmentResponseDto,
} from '../dto';

@ApiTags('Inventory - Stock Adjustment')
@Controller('inventory/stock-adjustments')
export class StockAdjustmentController {
  constructor(
    private readonly stockAdjustmentService: StockAdjustmentService,
  ) { }

  @Post()
  @ApiOperation({ summary: 'Create a new stock adjustment' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: StockAdjustmentResponseDto,
  })
  async create(
    @Body() createDto: CreateStockAdjustmentDto,
  ): Promise<StockAdjustmentResponseDto> {
    return this.stockAdjustmentService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all stock adjustments' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'adjustmentType', required: false })
  @ApiQuery({ name: 'warehouseId', required: false })
  @ApiResponse({ status: HttpStatus.OK, type: [StockAdjustmentResponseDto] })
  async findAll(
    @Query('status') status?: string,
    @Query('adjustmentType') adjustmentType?: string,
    @Query('warehouseId') warehouseId?: string,
  ): Promise<StockAdjustmentResponseDto[]> {
    return this.stockAdjustmentService.findAll({
      status,
      adjustmentType,
      warehouseId,
    });
  }

  @Get('pending-approval')
  @ApiOperation({ summary: 'Get pending adjustments' })
  @ApiResponse({ status: HttpStatus.OK, type: [StockAdjustmentResponseDto] })
  async getPendingApproval(): Promise<StockAdjustmentResponseDto[]> {
    return this.stockAdjustmentService.getPendingApproval();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get stock adjustment by ID' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: HttpStatus.OK, type: StockAdjustmentResponseDto })
  async findOne(@Param('id') id: string): Promise<StockAdjustmentResponseDto> {
    return this.stockAdjustmentService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update stock adjustment' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: HttpStatus.OK, type: StockAdjustmentResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateStockAdjustmentDto,
  ): Promise<StockAdjustmentResponseDto> {
    return this.stockAdjustmentService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete stock adjustment' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  async remove(@Param('id') id: string): Promise<void> {
    return this.stockAdjustmentService.remove(id);
  }

  @Post(':id/submit')
  @ApiOperation({ summary: 'Submit adjustment for approval' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: HttpStatus.OK, type: StockAdjustmentResponseDto })
  async submit(@Param('id') id: string): Promise<StockAdjustmentResponseDto> {
    return this.stockAdjustmentService.submit(id);
  }

  @Post(':id/approve')
  @ApiOperation({ summary: 'Approve adjustment' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: HttpStatus.OK, type: StockAdjustmentResponseDto })
  async approve(@Param('id') id: string): Promise<StockAdjustmentResponseDto> {
    return this.stockAdjustmentService.approve(id);
  }

  @Post(':id/reject')
  @ApiOperation({ summary: 'Reject adjustment' })
  @ApiParam({ name: 'id' })
  @ApiBody({ description: 'Rejection reason', schema: { type: 'object' } })
  @ApiResponse({ status: HttpStatus.OK, type: StockAdjustmentResponseDto })
  async reject(
    @Param('id') id: string,
    @Body() rejectData: any,
  ): Promise<StockAdjustmentResponseDto> {
    return this.stockAdjustmentService.reject(id, rejectData);
  }

  @Post(':id/post')
  @ApiOperation({ summary: 'Post adjustment to inventory' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: HttpStatus.OK, type: StockAdjustmentResponseDto })
  async post(@Param('id') id: string): Promise<StockAdjustmentResponseDto> {
    return this.stockAdjustmentService.post(id);
  }
}
