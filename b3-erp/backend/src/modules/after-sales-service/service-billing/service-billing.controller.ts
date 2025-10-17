import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ServiceBillingService } from './service-billing.service';
import { CreateServiceInvoiceDto } from '../dto/create-service-invoice.dto';
import { UpdateServiceInvoiceDto } from '../dto/update-service-invoice.dto';

@Controller('after-sales/billing')
export class ServiceBillingController {
  constructor(private readonly serviceBillingService: ServiceBillingService) {}

  @Post('invoices')
  createInvoice(@Body() createServiceInvoiceDto: CreateServiceInvoiceDto) {
    return this.serviceBillingService.createInvoice(createServiceInvoiceDto);
  }

  @Get('invoices')
  findAllInvoices(
    @Query('status') status?: string,
    @Query('customerId') customerId?: string,
    @Query('invoiceType') invoiceType?: string,
  ) {
    return this.serviceBillingService.findAllInvoices({
      status,
      customerId,
      invoiceType,
    });
  }

  @Get('invoices/overdue')
  getOverdueInvoices() {
    return this.serviceBillingService.getOverdueInvoices();
  }

  @Get('invoices/statistics')
  getStatistics() {
    return this.serviceBillingService.getStatistics();
  }

  @Get('invoices/:id')
  findOneInvoice(@Param('id') id: string) {
    return this.serviceBillingService.findOneInvoice(id);
  }

  @Patch('invoices/:id')
  updateInvoice(
    @Param('id') id: string,
    @Body() updateServiceInvoiceDto: UpdateServiceInvoiceDto,
  ) {
    return this.serviceBillingService.updateInvoice(id, updateServiceInvoiceDto);
  }

  @Post('invoices/:id/send')
  sendInvoice(@Param('id') id: string, @Body() body: { sentBy: string }) {
    return this.serviceBillingService.sendInvoice(id, body.sentBy);
  }

  @Post('invoices/:id/record-payment')
  recordPayment(
    @Param('id') id: string,
    @Body()
    paymentData: {
      amount: number;
      paymentMethod: string;
      paymentReference?: string;
      paymentDate: Date;
      notes?: string;
      recordedBy: string;
    },
  ) {
    return this.serviceBillingService.recordPayment(id, paymentData);
  }

  @Post('invoices/:id/void')
  voidInvoice(
    @Param('id') id: string,
    @Body() body: { reason: string; voidedBy: string },
  ) {
    return this.serviceBillingService.voidInvoice(id, body.reason, body.voidedBy);
  }

  @Post('invoices/:id/write-off')
  writeOffInvoice(
    @Param('id') id: string,
    @Body() body: { reason: string; approvedBy: string },
  ) {
    return this.serviceBillingService.writeOffInvoice(
      id,
      body.reason,
      body.approvedBy,
    );
  }

  @Post('amc-invoices/generate')
  generateAMCInvoices(@Body() body: { month: number; year: number; generatedBy: string }) {
    return this.serviceBillingService.generateAMCInvoices(
      body.month,
      body.year,
      body.generatedBy,
    );
  }

  @Get('revenue/summary')
  getRevenueSummary(@Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
    return this.serviceBillingService.getRevenueSummary(
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Get('revenue/by-type')
  getRevenueByType(@Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
    return this.serviceBillingService.getRevenueByType(
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Get('payments')
  getPaymentHistory(@Query('customerId') customerId?: string, @Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
    return this.serviceBillingService.getPaymentHistory(
      customerId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Delete('invoices/:id')
  removeInvoice(@Param('id') id: string) {
    return this.serviceBillingService.removeInvoice(id);
  }
}
