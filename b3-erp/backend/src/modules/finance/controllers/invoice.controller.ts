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
import { InvoiceService } from '../services/invoice.service';
import {
  CreateInvoiceDto,
  UpdateInvoiceDto,
  InvoiceResponseDto,
} from '../dto';

@ApiTags('Finance - Invoice')
@Controller('finance/invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new invoice' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Invoice created successfully',
    type: InvoiceResponseDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  async create(
    @Body() createDto: CreateInvoiceDto,
  ): Promise<InvoiceResponseDto> {
    return this.invoiceService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all invoices' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status' })
  @ApiQuery({ name: 'invoiceType', required: false, description: 'Filter by invoice type' })
  @ApiQuery({ name: 'partyId', required: false, description: 'Filter by party' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date (YYYY-MM-DD)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of invoices',
    type: [InvoiceResponseDto],
  })
  async findAll(
    @Query('status') status?: string,
    @Query('invoiceType') invoiceType?: string,
    @Query('partyId') partyId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<InvoiceResponseDto[]> {
    return this.invoiceService.findAll({
      status,
      invoiceType,
      partyId,
      startDate,
      endDate,
    });
  }

  @Get('overdue')
  @ApiOperation({ summary: 'Get all overdue invoices' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of overdue invoices',
    type: [InvoiceResponseDto],
  })
  async getOverdue(): Promise<InvoiceResponseDto[]> {
    return this.invoiceService.getOverdue();
  }

  @Get('aging-report')
  @ApiOperation({ summary: 'Get invoice aging report' })
  @ApiQuery({ name: 'invoiceType', required: false, description: 'Invoice type filter' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Invoice aging report',
  })
  async getAgingReport(
    @Query('invoiceType') invoiceType?: string,
  ): Promise<any> {
    return this.invoiceService.getAgingReport(invoiceType);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get invoice by ID' })
  @ApiParam({ name: 'id', description: 'Invoice ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Invoice details',
    type: InvoiceResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Invoice not found' })
  async findOne(@Param('id') id: string): Promise<InvoiceResponseDto> {
    return this.invoiceService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update invoice' })
  @ApiParam({ name: 'id', description: 'Invoice ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Invoice updated successfully',
    type: InvoiceResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Invoice not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Cannot update posted invoice' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateInvoiceDto,
  ): Promise<InvoiceResponseDto> {
    return this.invoiceService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete invoice' })
  @ApiParam({ name: 'id', description: 'Invoice ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Invoice deleted successfully',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Invoice not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Cannot delete posted invoice' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.invoiceService.remove(id);
  }

  @Post(':id/submit')
  @ApiOperation({ summary: 'Submit invoice' })
  @ApiParam({ name: 'id', description: 'Invoice ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Invoice submitted successfully',
    type: InvoiceResponseDto,
  })
  async submit(@Param('id') id: string): Promise<InvoiceResponseDto> {
    return this.invoiceService.submit(id);
  }

  @Post(':id/approve')
  @ApiOperation({ summary: 'Approve invoice' })
  @ApiParam({ name: 'id', description: 'Invoice ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Invoice approved successfully',
    type: InvoiceResponseDto,
  })
  async approve(@Param('id') id: string): Promise<InvoiceResponseDto> {
    return this.invoiceService.approve(id);
  }

  @Post(':id/post')
  @ApiOperation({ summary: 'Post invoice to general ledger' })
  @ApiParam({ name: 'id', description: 'Invoice ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Invoice posted successfully',
    type: InvoiceResponseDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invoice not approved or already posted' })
  async post(@Param('id') id: string): Promise<InvoiceResponseDto> {
    return this.invoiceService.postToGL(id);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel invoice' })
  @ApiParam({ name: 'id', description: 'Invoice ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Invoice cancelled successfully',
    type: InvoiceResponseDto,
  })
  async cancel(@Param('id') id: string): Promise<InvoiceResponseDto> {
    return this.invoiceService.cancel(id);
  }

  @Get('party/:partyId/outstanding')
  @ApiOperation({ summary: 'Get outstanding balance for a party' })
  @ApiParam({ name: 'partyId', description: 'Party ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Outstanding balance',
  })
  async getOutstandingBalance(@Param('partyId') partyId: string): Promise<any> {
    return this.invoiceService.getOutstandingBalance(partyId);
  }
}
