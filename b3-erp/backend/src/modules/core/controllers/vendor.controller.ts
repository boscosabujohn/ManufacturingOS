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
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { VendorService } from '../services/vendor.service';
import { CreateVendorDto } from '../dto/create-vendor.dto';
import { UpdateVendorDto } from '../dto/update-vendor.dto';
import { VendorResponseDto } from '../dto/vendor-response.dto';

@ApiTags('Vendors')
@Controller('api/v1/core/vendors')
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  @Get()
  @ApiOperation({ summary: 'Get all vendors with pagination and filters' })
  @ApiResponse({
    status: 200,
    description: 'List of vendors retrieved successfully',
    type: [VendorResponseDto],
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'vendorType', required: false, type: String })
  @ApiQuery({ name: 'category', required: false, type: String })
  @ApiQuery({ name: 'buyerId', required: false, type: String })
  @ApiQuery({ name: 'isApproved', required: false, type: Boolean })
  @ApiQuery({ name: 'qualityRating', required: false, type: String })
  @ApiQuery({ name: 'deliveryRating', required: false, type: String })
  @ApiQuery({ name: 'overallRating', required: false, type: String })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'] })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('vendorType') vendorType?: string,
    @Query('category') category?: string,
    @Query('buyerId') buyerId?: string,
    @Query('isApproved') isApproved?: boolean,
    @Query('qualityRating') qualityRating?: string,
    @Query('deliveryRating') deliveryRating?: string,
    @Query('overallRating') overallRating?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
  ) {
    const filters = {
      search,
      status,
      vendorType,
      category,
      buyerId,
      isApproved,
      qualityRating,
      deliveryRating,
      overallRating,
    };

    const pagination = {
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      sortBy,
      sortOrder,
    };

    return this.vendorService.findAll(filters, pagination);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new vendor' })
  @ApiResponse({
    status: 201,
    description: 'Vendor created successfully',
    type: VendorResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Vendor already exists' })
  async create(
    @Body() createVendorDto: CreateVendorDto,
  ): Promise<VendorResponseDto> {
    return this.vendorService.create(createVendorDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get vendor by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Vendor UUID' })
  @ApiResponse({
    status: 200,
    description: 'Vendor retrieved successfully',
    type: VendorResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<VendorResponseDto> {
    return this.vendorService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update vendor by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Vendor UUID' })
  @ApiResponse({
    status: 200,
    description: 'Vendor updated successfully',
    type: VendorResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  @ApiResponse({ status: 409, description: 'Vendor code already exists' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateVendorDto: UpdateVendorDto,
  ): Promise<VendorResponseDto> {
    return this.vendorService.update(id, updateVendorDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete vendor by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Vendor UUID' })
  @ApiResponse({ status: 204, description: 'Vendor deleted successfully' })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  @ApiResponse({
    status: 400,
    description: 'Cannot delete vendor with outstanding payables',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.vendorService.remove(id);
  }

  @Patch(':id/approve')
  @ApiOperation({ summary: 'Approve vendor' })
  @ApiParam({ name: 'id', type: String, description: 'Vendor UUID' })
  @ApiResponse({
    status: 200,
    description: 'Vendor approved successfully',
    type: VendorResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  @ApiResponse({ status: 400, description: 'Vendor is already approved' })
  async approve(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('approvedBy') approvedBy: string,
  ): Promise<VendorResponseDto> {
    return this.vendorService.approve(id, approvedBy);
  }

  @Get('category/:category')
  @ApiOperation({ summary: 'Get vendors by category' })
  @ApiParam({ name: 'category', type: String })
  @ApiResponse({
    status: 200,
    description: 'Vendors retrieved successfully',
    type: [VendorResponseDto],
  })
  async getVendorsByCategory(
    @Param('category') category: string,
  ): Promise<VendorResponseDto[]> {
    return this.vendorService.getVendorsByCategory(category);
  }

  @Get('filter/approved')
  @ApiOperation({ summary: 'Get all approved vendors' })
  @ApiResponse({
    status: 200,
    description: 'Approved vendors retrieved successfully',
    type: [VendorResponseDto],
  })
  async getApprovedVendors(): Promise<VendorResponseDto[]> {
    return this.vendorService.getApprovedVendors();
  }

  @Get('reports/top-vendors')
  @ApiOperation({ summary: 'Get top vendors by purchases' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Top vendors retrieved successfully',
    type: [VendorResponseDto],
  })
  async getTopVendorsByPurchases(
    @Query('limit') limit?: number,
  ): Promise<VendorResponseDto[]> {
    return this.vendorService.getTopVendorsByPurchases(
      limit ? Number(limit) : undefined,
    );
  }

  @Get('reports/outstanding-payables')
  @ApiOperation({ summary: 'Get vendors with outstanding payables' })
  @ApiResponse({
    status: 200,
    description: 'Vendors with outstanding payables retrieved successfully',
    type: [VendorResponseDto],
  })
  async getVendorsWithOutstandingPayables(): Promise<VendorResponseDto[]> {
    return this.vendorService.getVendorsWithOutstandingPayables();
  }

  @Get('reports/top-rated')
  @ApiOperation({ summary: 'Get top rated vendors' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Top rated vendors retrieved successfully',
    type: [VendorResponseDto],
  })
  async getTopRatedVendors(
    @Query('limit') limit?: number,
  ): Promise<VendorResponseDto[]> {
    return this.vendorService.getTopRatedVendors(
      limit ? Number(limit) : undefined,
    );
  }
}
