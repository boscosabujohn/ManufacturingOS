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
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { ItemService } from '../services/item.service';
import { CreateItemDto } from '../dto/create-item.dto';
import { UpdateItemDto } from '../dto/update-item.dto';
import { ItemResponseDto } from '../dto/item-response.dto';

@ApiTags('Items')
@Controller('api/v1/core/items')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Get()
  @ApiOperation({ summary: 'Get all items with pagination and filters' })
  @ApiResponse({
    status: 200,
    description: 'List of items retrieved successfully',
    type: [ItemResponseDto],
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'itemType', required: false, type: String })
  @ApiQuery({ name: 'category', required: false, type: String })
  @ApiQuery({ name: 'subCategory', required: false, type: String })
  @ApiQuery({ name: 'brand', required: false, type: String })
  @ApiQuery({ name: 'manufacturer', required: false, type: String })
  @ApiQuery({ name: 'maintainStock', required: false, type: Boolean })
  @ApiQuery({ name: 'isManufactured', required: false, type: Boolean })
  @ApiQuery({ name: 'isPurchased', required: false, type: Boolean })
  @ApiQuery({ name: 'isSold', required: false, type: Boolean })
  @ApiQuery({ name: 'allowSales', required: false, type: Boolean })
  @ApiQuery({ name: 'allowPurchase', required: false, type: Boolean })
  @ApiQuery({ name: 'preferredVendorId', required: false, type: String })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'] })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('itemType') itemType?: string,
    @Query('category') category?: string,
    @Query('subCategory') subCategory?: string,
    @Query('brand') brand?: string,
    @Query('manufacturer') manufacturer?: string,
    @Query('maintainStock') maintainStock?: boolean,
    @Query('isManufactured') isManufactured?: boolean,
    @Query('isPurchased') isPurchased?: boolean,
    @Query('isSold') isSold?: boolean,
    @Query('allowSales') allowSales?: boolean,
    @Query('allowPurchase') allowPurchase?: boolean,
    @Query('preferredVendorId') preferredVendorId?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
  ) {
    const filters = {
      search,
      status,
      itemType,
      category,
      subCategory,
      brand,
      manufacturer,
      maintainStock,
      isManufactured,
      isPurchased,
      isSold,
      allowSales,
      allowPurchase,
      preferredVendorId,
    };

    const pagination = {
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      sortBy,
      sortOrder,
    };

    return this.itemService.findAll(filters, pagination);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new item' })
  @ApiResponse({
    status: 201,
    description: 'Item created successfully',
    type: ItemResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Item already exists' })
  async create(@Body() createItemDto: CreateItemDto): Promise<ItemResponseDto> {
    return this.itemService.create(createItemDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get item by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Item UUID' })
  @ApiResponse({
    status: 200,
    description: 'Item retrieved successfully',
    type: ItemResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Item not found' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ItemResponseDto> {
    return this.itemService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update item by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Item UUID' })
  @ApiResponse({
    status: 200,
    description: 'Item updated successfully',
    type: ItemResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Item not found' })
  @ApiResponse({ status: 409, description: 'Item code already exists' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateItemDto: UpdateItemDto,
  ): Promise<ItemResponseDto> {
    return this.itemService.update(id, updateItemDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete item by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Item UUID' })
  @ApiResponse({ status: 204, description: 'Item deleted successfully' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  @ApiResponse({
    status: 400,
    description: 'Cannot delete item with current stock',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.itemService.remove(id);
  }

  @Get('category/:category')
  @ApiOperation({ summary: 'Get items by category' })
  @ApiParam({ name: 'category', type: String })
  @ApiResponse({
    status: 200,
    description: 'Items retrieved successfully',
    type: [ItemResponseDto],
  })
  async getItemsByCategory(
    @Param('category') category: string,
  ): Promise<ItemResponseDto[]> {
    return this.itemService.getItemsByCategory(category);
  }

  @Get('vendor/:vendorId')
  @ApiOperation({ summary: 'Get items by vendor' })
  @ApiParam({ name: 'vendorId', type: String })
  @ApiResponse({
    status: 200,
    description: 'Items retrieved successfully',
    type: [ItemResponseDto],
  })
  async getItemsByVendor(
    @Param('vendorId') vendorId: string,
  ): Promise<ItemResponseDto[]> {
    return this.itemService.getItemsByVendor(vendorId);
  }

  @Get('reports/needs-reorder')
  @ApiOperation({ summary: 'Get items needing reorder' })
  @ApiResponse({
    status: 200,
    description: 'Items needing reorder retrieved successfully',
    type: [ItemResponseDto],
  })
  async getItemsNeedingReorder(): Promise<ItemResponseDto[]> {
    return this.itemService.getItemsNeedingReorder();
  }

  @Get('reports/low-stock')
  @ApiOperation({ summary: 'Get low stock items' })
  @ApiResponse({
    status: 200,
    description: 'Low stock items retrieved successfully',
    type: [ItemResponseDto],
  })
  async getLowStockItems(): Promise<ItemResponseDto[]> {
    return this.itemService.getLowStockItems();
  }

  @Get('reports/out-of-stock')
  @ApiOperation({ summary: 'Get out of stock items' })
  @ApiResponse({
    status: 200,
    description: 'Out of stock items retrieved successfully',
    type: [ItemResponseDto],
  })
  async getOutOfStockItems(): Promise<ItemResponseDto[]> {
    return this.itemService.getOutOfStockItems();
  }

  @Get('reports/top-selling')
  @ApiOperation({ summary: 'Get top selling items' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Top selling items retrieved successfully',
    type: [ItemResponseDto],
  })
  async getTopSellingItems(
    @Query('limit') limit?: number,
  ): Promise<ItemResponseDto[]> {
    return this.itemService.getTopSellingItems(
      limit ? Number(limit) : undefined,
    );
  }

  @Get('search/name')
  @ApiOperation({ summary: 'Search items by name' })
  @ApiQuery({ name: 'q', required: true, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Items matching search term retrieved successfully',
    type: [ItemResponseDto],
  })
  async searchItemsByName(
    @Query('q') searchTerm: string,
    @Query('limit') limit?: number,
  ): Promise<ItemResponseDto[]> {
    return this.itemService.searchItemsByName(
      searchTerm,
      limit ? Number(limit) : undefined,
    );
  }
}
