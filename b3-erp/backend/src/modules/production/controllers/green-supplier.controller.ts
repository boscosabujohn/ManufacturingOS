import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { GreenSupplierService } from '../services/green-supplier.service';
import { GreenSupplier, SupplierTier, AssessmentStatus } from '../entities/green-supplier.entity';

@ApiTags('Production - Sustainability - Green Suppliers')
@Controller('production/sustainability/green-suppliers')
export class GreenSupplierController {
  constructor(private readonly greenSupplierService: GreenSupplierService) {}

  @Post()
  @ApiOperation({ summary: 'Create green supplier record' })
  @ApiResponse({ status: HttpStatus.CREATED })
  async create(@Body() createDto: Partial<GreenSupplier>): Promise<GreenSupplier> {
    return this.greenSupplierService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all green suppliers' })
  @ApiQuery({ name: 'companyId', required: false })
  @ApiQuery({ name: 'tier', required: false })
  @ApiQuery({ name: 'assessmentStatus', required: false })
  @ApiQuery({ name: 'isPreferred', required: false })
  async findAll(
    @Query('companyId') companyId?: string,
    @Query('tier') tier?: SupplierTier,
    @Query('assessmentStatus') assessmentStatus?: AssessmentStatus,
    @Query('isPreferred') isPreferred?: boolean,
  ): Promise<GreenSupplier[]> {
    return this.greenSupplierService.findAll({ companyId, tier, assessmentStatus, isPreferred });
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get supplier summary' })
  @ApiQuery({ name: 'companyId', required: true })
  async getSupplierSummary(@Query('companyId') companyId: string): Promise<any> {
    return this.greenSupplierService.getSupplierSummary(companyId);
  }

  @Get('expiring-certifications')
  @ApiOperation({ summary: 'Get expiring certifications' })
  @ApiQuery({ name: 'companyId', required: true })
  @ApiQuery({ name: 'daysAhead', required: false })
  async getExpiringCertifications(
    @Query('companyId') companyId: string,
    @Query('daysAhead') daysAhead?: number,
  ): Promise<any[]> {
    return this.greenSupplierService.getExpiringCertifications(companyId, daysAhead);
  }

  @Get('vendor/:vendorId')
  @ApiOperation({ summary: 'Get green supplier by vendor ID' })
  @ApiParam({ name: 'vendorId' })
  async findByVendorId(@Param('vendorId') vendorId: string): Promise<GreenSupplier | null> {
    return this.greenSupplierService.findByVendorId(vendorId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get green supplier by ID' })
  @ApiParam({ name: 'id' })
  async findOne(@Param('id') id: string): Promise<GreenSupplier> {
    return this.greenSupplierService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update green supplier' })
  @ApiParam({ name: 'id' })
  async update(@Param('id') id: string, @Body() updateDto: Partial<GreenSupplier>): Promise<GreenSupplier> {
    return this.greenSupplierService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete green supplier' })
  @ApiParam({ name: 'id' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.greenSupplierService.remove(id);
  }

  @Post(':id/assessment')
  @ApiOperation({ summary: 'Add assessment to green supplier' })
  @ApiParam({ name: 'id' })
  async addAssessment(@Param('id') id: string, @Body() assessment: any): Promise<GreenSupplier> {
    return this.greenSupplierService.addAssessment(id, assessment);
  }
}
