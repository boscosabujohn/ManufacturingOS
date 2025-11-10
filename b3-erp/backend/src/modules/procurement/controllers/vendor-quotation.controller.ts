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
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { VendorQuotationService } from '../services/vendor-quotation.service';
import {
  CreateVendorQuotationDto,
  UpdateVendorQuotationDto,
  VendorQuotationResponseDto,
} from '../dto';

@ApiTags('Procurement - Vendor Quotations')
@Controller('procurement/vendor-quotations')
export class VendorQuotationController {
  constructor(private readonly quotationService: VendorQuotationService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new vendor quotation' })
  async create(@Body() createDto: CreateVendorQuotationDto): Promise<VendorQuotationResponseDto> {
    return this.quotationService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all vendor quotations' })
  async findAll(@Query() filters?: any): Promise<VendorQuotationResponseDto[]> {
    return this.quotationService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get vendor quotation by ID' })
  async findOne(@Param('id') id: string): Promise<VendorQuotationResponseDto> {
    return this.quotationService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update vendor quotation' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateVendorQuotationDto,
  ): Promise<VendorQuotationResponseDto> {
    return this.quotationService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete vendor quotation' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.quotationService.remove(id);
  }

  @Post(':id/submit')
  @ApiOperation({ summary: 'Submit vendor quotation' })
  async submit(@Param('id') id: string): Promise<VendorQuotationResponseDto> {
    return this.quotationService.submit(id);
  }

  @Post(':id/evaluate')
  @ApiOperation({ summary: 'Evaluate vendor quotation' })
  async evaluate(@Param('id') id: string, @Body() evaluationData: any): Promise<VendorQuotationResponseDto> {
    return this.quotationService.evaluate(id, evaluationData);
  }

  @Post(':id/award')
  @ApiOperation({ summary: 'Award vendor quotation' })
  async award(@Param('id') id: string, @Body() poData: any): Promise<VendorQuotationResponseDto> {
    return this.quotationService.award(id, poData);
  }
}
