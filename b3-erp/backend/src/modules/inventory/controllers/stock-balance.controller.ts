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
import { StockBalanceService } from '../services/stock-balance.service';
import {
  CreateStockBalanceDto,
  UpdateStockBalanceDto,
  StockBalanceResponseDto,
} from '../dto';

@ApiTags('Inventory - Stock Balance')
@Controller('inventory/stock-balances')
export class StockBalanceController {
  constructor(private readonly stockBalanceService: StockBalanceService) {}

  @Post()
  @ApiOperation({ summary: 'Create stock balance' })
  @ApiResponse({ status: HttpStatus.CREATED, type: StockBalanceResponseDto })
  async create(
    @Body() createDto: CreateStockBalanceDto,
  ): Promise<StockBalanceResponseDto> {
    return this.stockBalanceService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all stock balances' })
  @ApiQuery({ name: 'itemId', required: false })
  @ApiQuery({ name: 'warehouseId', required: false })
  @ApiQuery({ name: 'locationId', required: false })
  @ApiResponse({ status: HttpStatus.OK, type: [StockBalanceResponseDto] })
  async findAll(
    @Query('itemId') itemId?: string,
    @Query('warehouseId') warehouseId?: string,
    @Query('locationId') locationId?: string,
  ): Promise<StockBalanceResponseDto[]> {
    return this.stockBalanceService.findAll({ itemId, warehouseId, locationId });
  }

  @Get('real-time')
  @ApiOperation({ summary: 'Get real-time stock balance' })
  @ApiQuery({ name: 'itemId', required: true })
  @ApiQuery({ name: 'warehouseId', required: true })
  @ApiResponse({ status: HttpStatus.OK })
  async getRealTimeBalance(
    @Query('itemId') itemId: string,
    @Query('warehouseId') warehouseId: string,
  ): Promise<any> {
    return this.stockBalanceService.getRealTimeBalance(itemId, warehouseId);
  }

  @Get('aging-report')
  @ApiOperation({ summary: 'Get stock aging report' })
  @ApiQuery({ name: 'warehouseId', required: false })
  @ApiResponse({ status: HttpStatus.OK })
  async getAgingReport(@Query('warehouseId') warehouseId?: string): Promise<any> {
    return this.stockBalanceService.getAgingReport(warehouseId);
  }

  @Get('abc-analysis')
  @ApiOperation({ summary: 'Get ABC analysis report' })
  @ApiQuery({ name: 'warehouseId', required: false })
  @ApiResponse({ status: HttpStatus.OK })
  async getABCAnalysis(@Query('warehouseId') warehouseId?: string): Promise<any> {
    return this.stockBalanceService.getABCAnalysis(warehouseId);
  }

  @Get('valuation-report')
  @ApiOperation({ summary: 'Get stock valuation report' })
  @ApiQuery({ name: 'warehouseId', required: false })
  @ApiQuery({ name: 'asOfDate', required: false })
  @ApiResponse({ status: HttpStatus.OK })
  async getValuationReport(
    @Query('warehouseId') warehouseId?: string,
    @Query('asOfDate') asOfDate?: string,
  ): Promise<any> {
    return this.stockBalanceService.getValuationReport(warehouseId, asOfDate);
  }

  @Get('reorder-analysis')
  @ApiOperation({ summary: 'Get items below reorder level' })
  @ApiQuery({ name: 'warehouseId', required: false })
  @ApiResponse({ status: HttpStatus.OK })
  async getReorderAnalysis(@Query('warehouseId') warehouseId?: string): Promise<any> {
    return this.stockBalanceService.getReorderAnalysis(warehouseId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get stock balance by ID' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: HttpStatus.OK, type: StockBalanceResponseDto })
  async findOne(@Param('id') id: string): Promise<StockBalanceResponseDto> {
    return this.stockBalanceService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update stock balance' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: HttpStatus.OK, type: StockBalanceResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateStockBalanceDto,
  ): Promise<StockBalanceResponseDto> {
    return this.stockBalanceService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete stock balance' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  async remove(@Param('id') id: string): Promise<void> {
    return this.stockBalanceService.remove(id);
  }
}
