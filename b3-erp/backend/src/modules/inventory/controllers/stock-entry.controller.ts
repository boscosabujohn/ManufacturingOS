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
import { StockEntryService } from '../services/stock-entry.service';
import {
  CreateStockEntryDto,
  UpdateStockEntryDto,
  StockEntryResponseDto,
} from '../dto';

@ApiTags('Inventory - Stock Entry')
@Controller('inventory/stock-entries')
export class StockEntryController {
  constructor(private readonly stockEntryService: StockEntryService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new stock entry' })
  @ApiResponse({ status: HttpStatus.CREATED, type: StockEntryResponseDto })
  async create(
    @Body() createDto: CreateStockEntryDto,
  ): Promise<StockEntryResponseDto> {
    return this.stockEntryService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all stock entries' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'entryType', required: false })
  @ApiQuery({ name: 'warehouseId', required: false })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiResponse({ status: HttpStatus.OK, type: [StockEntryResponseDto] })
  async findAll(
    @Query('status') status?: string,
    @Query('entryType') entryType?: string,
    @Query('warehouseId') warehouseId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<StockEntryResponseDto[]> {
    return this.stockEntryService.findAll({
      status,
      entryType,
      warehouseId,
      startDate,
      endDate,
    });
  }

  @Get('pending-post')
  @ApiOperation({ summary: 'Get pending stock entries for posting' })
  @ApiResponse({ status: HttpStatus.OK, type: [StockEntryResponseDto] })
  async getPendingPost(): Promise<StockEntryResponseDto[]> {
    return this.stockEntryService.getPendingPost();
  }

  @Get('stock-ledger')
  @ApiOperation({ summary: 'Get stock ledger report' })
  @ApiQuery({ name: 'itemId', required: false })
  @ApiQuery({ name: 'warehouseId', required: false })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiResponse({ status: HttpStatus.OK })
  async getStockLedger(
    @Query('itemId') itemId?: string,
    @Query('warehouseId') warehouseId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<any> {
    return this.stockEntryService.getStockLedger({
      itemId,
      warehouseId,
      startDate,
      endDate,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get stock entry by ID' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: HttpStatus.OK, type: StockEntryResponseDto })
  async findOne(@Param('id') id: string): Promise<StockEntryResponseDto> {
    return this.stockEntryService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update stock entry' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: HttpStatus.OK, type: StockEntryResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateStockEntryDto,
  ): Promise<StockEntryResponseDto> {
    return this.stockEntryService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete stock entry' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  async remove(@Param('id') id: string): Promise<void> {
    return this.stockEntryService.remove(id);
  }

  @Post(':id/submit')
  @ApiOperation({ summary: 'Submit stock entry' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: HttpStatus.OK, type: StockEntryResponseDto })
  async submit(@Param('id') id: string): Promise<StockEntryResponseDto> {
    return this.stockEntryService.submit(id);
  }

  @Post(':id/post')
  @ApiOperation({ summary: 'Post stock entry to inventory' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: HttpStatus.OK, type: StockEntryResponseDto })
  async post(@Param('id') id: string): Promise<StockEntryResponseDto> {
    return this.stockEntryService.post(id);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel stock entry' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: HttpStatus.OK, type: StockEntryResponseDto })
  async cancel(@Param('id') id: string): Promise<StockEntryResponseDto> {
    return this.stockEntryService.cancel(id);
  }
}
