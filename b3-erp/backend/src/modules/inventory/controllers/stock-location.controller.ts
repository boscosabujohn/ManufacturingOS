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
import { StockLocationService } from '../services/stock-location.service';
import {
  CreateStockLocationDto,
  UpdateStockLocationDto,
  StockLocationResponseDto,
} from '../dto';

@ApiTags('Inventory - Stock Location')
@Controller('inventory/stock-locations')
export class StockLocationController {
  constructor(private readonly stockLocationService: StockLocationService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new stock location' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: StockLocationResponseDto,
  })
  async create(
    @Body() createDto: CreateStockLocationDto,
  ): Promise<StockLocationResponseDto> {
    return this.stockLocationService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all stock locations' })
  @ApiQuery({ name: 'warehouseId', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiResponse({ status: HttpStatus.OK, type: [StockLocationResponseDto] })
  async findAll(
    @Query('warehouseId') warehouseId?: string,
    @Query('status') status?: string,
  ): Promise<StockLocationResponseDto[]> {
    return this.stockLocationService.findAll({ warehouseId, status });
  }

  @Get('warehouse/:warehouseId')
  @ApiOperation({ summary: 'Get locations by warehouse' })
  @ApiParam({ name: 'warehouseId' })
  @ApiResponse({ status: HttpStatus.OK, type: [StockLocationResponseDto] })
  async findByWarehouse(
    @Param('warehouseId') warehouseId: string,
  ): Promise<StockLocationResponseDto[]> {
    return this.stockLocationService.findByWarehouse(warehouseId);
  }

  @Get('available')
  @ApiOperation({ summary: 'Get available locations for putaway' })
  @ApiQuery({ name: 'warehouseId', required: true })
  @ApiQuery({ name: 'itemId', required: false })
  @ApiResponse({ status: HttpStatus.OK, type: [StockLocationResponseDto] })
  async findAvailableForPutaway(
    @Query('warehouseId') warehouseId: string,
    @Query('itemId') itemId?: string,
  ): Promise<StockLocationResponseDto[]> {
    return this.stockLocationService.findAvailableForPutaway(
      warehouseId,
      itemId,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get stock location by ID' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: HttpStatus.OK, type: StockLocationResponseDto })
  async findOne(@Param('id') id: string): Promise<StockLocationResponseDto> {
    return this.stockLocationService.findOne(id);
  }

  @Get(':id/stock-balance')
  @ApiOperation({ summary: 'Get stock balance for location' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: HttpStatus.OK })
  async getStockBalance(@Param('id') id: string): Promise<any> {
    return this.stockLocationService.getStockBalance(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update stock location' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: HttpStatus.OK, type: StockLocationResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateStockLocationDto,
  ): Promise<StockLocationResponseDto> {
    return this.stockLocationService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete stock location' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  async remove(@Param('id') id: string): Promise<void> {
    return this.stockLocationService.remove(id);
  }

  @Post(':id/block')
  @ApiOperation({ summary: 'Block location' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: HttpStatus.OK, type: StockLocationResponseDto })
  async block(@Param('id') id: string): Promise<StockLocationResponseDto> {
    return this.stockLocationService.block(id);
  }

  @Post(':id/unblock')
  @ApiOperation({ summary: 'Unblock location' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: HttpStatus.OK, type: StockLocationResponseDto })
  async unblock(@Param('id') id: string): Promise<StockLocationResponseDto> {
    return this.stockLocationService.unblock(id);
  }
}
