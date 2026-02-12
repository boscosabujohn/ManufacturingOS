import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { MarkupRule, Pricing, PricingStatus } from '../entities/pricing.entity';
import { PricingService } from '../services/pricing.service';

@Controller('estimation/pricing')
export class PricingController {
  constructor(private readonly pricingService: PricingService) {}

  // Pricing CRUD
  @Post()
  create(
    @Headers('x-company-id') companyId: string,
    @Body() data: Partial<Pricing>,
  ): Promise<Pricing> {
    return this.pricingService.create(companyId, data);
  }

  @Get()
  findAll(
    @Headers('x-company-id') companyId: string,
    @Query('status') status?: PricingStatus,
    @Query('customerId') customerId?: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
  ): Promise<Pricing[]> {
    return this.pricingService.findAll(companyId, {
      status,
      customerId,
      fromDate,
      toDate,
    });
  }

  @Get(':id')
  findOne(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
  ): Promise<Pricing> {
    return this.pricingService.findOne(companyId, id);
  }

  @Get(':id/margin-analysis')
  getMarginAnalysis(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
  ) {
    return this.pricingService.getMarginAnalysis(companyId, id);
  }

  @Get(':id/competitive-analysis')
  getCompetitivePricingAnalysis(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
  ) {
    return this.pricingService.getCompetitivePricingAnalysis(companyId, id);
  }

  @Patch(':id')
  update(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
    @Body() data: Partial<Pricing>,
  ): Promise<Pricing> {
    return this.pricingService.update(companyId, id, data);
  }

  @Post(':id/approve')
  approve(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
    @Body() data: { approvedBy: string; notes?: string },
  ): Promise<Pricing> {
    return this.pricingService.approve(
      companyId,
      id,
      data.approvedBy,
      data.notes,
    );
  }

  @Post(':id/reject')
  reject(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
    @Body() data: { notes?: string },
  ): Promise<Pricing> {
    return this.pricingService.reject(companyId, id, data.notes);
  }

  @Post(':id/send-to-customer')
  sendToCustomer(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
  ): Promise<Pricing> {
    return this.pricingService.sendToCustomer(companyId, id);
  }

  @Post(':id/customer-response')
  recordCustomerResponse(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
    @Body() data: { accepted: boolean; feedback?: string },
  ): Promise<Pricing> {
    return this.pricingService.recordCustomerResponse(
      companyId,
      id,
      data.accepted,
      data.feedback,
    );
  }

  @Post(':id/apply-markup-rules')
  applyMarkupRules(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
  ): Promise<Pricing> {
    return this.pricingService.applyMarkupRules(companyId, id);
  }

  @Delete(':id')
  delete(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
  ): Promise<void> {
    return this.pricingService.delete(companyId, id);
  }

  // Markup Rules
  @Post('markup-rules')
  createMarkupRule(
    @Headers('x-company-id') companyId: string,
    @Body() data: Partial<MarkupRule>,
  ): Promise<MarkupRule> {
    return this.pricingService.createMarkupRule(companyId, data);
  }

  @Get('markup-rules/all')
  findAllMarkupRules(
    @Headers('x-company-id') companyId: string,
  ): Promise<MarkupRule[]> {
    return this.pricingService.findAllMarkupRules(companyId);
  }

  @Get('markup-rules/active')
  findActiveMarkupRules(
    @Headers('x-company-id') companyId: string,
  ): Promise<MarkupRule[]> {
    return this.pricingService.findActiveMarkupRules(companyId);
  }

  @Patch('markup-rules/:id')
  updateMarkupRule(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
    @Body() data: Partial<MarkupRule>,
  ): Promise<MarkupRule> {
    return this.pricingService.updateMarkupRule(companyId, id, data);
  }

  @Delete('markup-rules/:id')
  deleteMarkupRule(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
  ): Promise<void> {
    return this.pricingService.deleteMarkupRule(companyId, id);
  }
}
