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
import { PurchaseInvoiceService } from '../services/purchase-invoice.service';
import {
  CreatePurchaseInvoiceDto,
  UpdatePurchaseInvoiceDto,
  PurchaseInvoiceResponseDto,
} from '../dto';

@ApiTags('Procurement - Purchase Invoices')
@Controller('procurement/purchase-invoices')
export class PurchaseInvoiceController {
  constructor(private readonly invoiceService: PurchaseInvoiceService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new purchase invoice' })
  async create(@Body() createDto: CreatePurchaseInvoiceDto): Promise<PurchaseInvoiceResponseDto> {
    return this.invoiceService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all purchase invoices' })
  async findAll(@Query() filters?: any): Promise<PurchaseInvoiceResponseDto[]> {
    return this.invoiceService.findAll(filters);
  }

  @Get('pending')
  @ApiOperation({ summary: 'Get pending purchase invoices' })
  async getPendingInvoices(): Promise<any[]> {
    return this.invoiceService.getPendingInvoices();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get purchase invoice by ID' })
  async findOne(@Param('id') id: string): Promise<PurchaseInvoiceResponseDto> {
    return this.invoiceService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update purchase invoice' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdatePurchaseInvoiceDto,
  ): Promise<PurchaseInvoiceResponseDto> {
    return this.invoiceService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete purchase invoice' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.invoiceService.remove(id);
  }

  @Post(':id/three-way-match')
  @ApiOperation({ summary: 'Perform 3-way matching (PO-GRN-Invoice)' })
  async performThreeWayMatching(@Param('id') id: string): Promise<any> {
    return this.invoiceService.performThreeWayMatching(id);
  }

  @Post(':id/approve')
  @ApiOperation({ summary: 'Approve purchase invoice' })
  async approve(@Param('id') id: string, @Body() approverData: any): Promise<PurchaseInvoiceResponseDto> {
    return this.invoiceService.approve(id, approverData);
  }

  @Post(':id/post-to-accounting')
  @ApiOperation({ summary: 'Post purchase invoice to accounting' })
  async postToAccounting(@Param('id') id: string): Promise<PurchaseInvoiceResponseDto> {
    return this.invoiceService.postToAccounting(id);
  }
}
