import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { OrderService } from '../services/order.service';
import { ApprovalWorkflowService } from '../services/approval-workflow.service';
import { PricingService } from '../services/pricing.service';
import { SalesOrder, OrderStatus } from '../entities/order.entity';

@Controller('api/v1/sales/orders')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly approvalWorkflowService: ApprovalWorkflowService,
    private readonly pricingService: PricingService,
  ) {}

  @Post()
  async create(@Body() createOrderDto: Partial<SalesOrder>): Promise<SalesOrder> {
    return this.orderService.create(createOrderDto);
  }

  @Post('from-rfp/:rfpId')
  async createFromRFP(
    @Param('rfpId') rfpId: string,
    @Body('createdBy') createdBy: string,
  ): Promise<SalesOrder> {
    return this.orderService.createFromRFP(rfpId, createdBy);
  }

  @Get()
  async findAll(
    @Query('status') status?: OrderStatus,
    @Query('customerId') customerId?: string,
    @Query('salesPersonId') salesPersonId?: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
  ): Promise<SalesOrder[]> {
    return this.orderService.findAll({
      status,
      customerId,
      salesPersonId,
      fromDate,
      toDate,
    });
  }

  @Get('statistics')
  async getStatistics() {
    return this.orderService.getOrderStatistics();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<SalesOrder> {
    return this.orderService.findOne(id);
  }

  @Get(':id/tracking')
  async trackStatus(@Param('id') id: string) {
    return this.orderService.trackOrderStatus(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: Partial<SalesOrder>,
  ): Promise<SalesOrder> {
    return this.orderService.update(id, updateOrderDto);
  }

  @Post(':id/validate-po')
  async validatePO(
    @Param('id') id: string,
    @Body() poData: { poNumber: string; poDate: string; poValue: number },
  ) {
    return this.orderService.validatePO(id, poData);
  }

  @Patch(':id/confirm')
  async confirmOrder(
    @Param('id') id: string,
    @Body('confirmedBy') confirmedBy: string,
  ): Promise<SalesOrder> {
    return this.orderService.confirmOrder(id, confirmedBy);
  }

  @Patch(':id/approve')
  async approveOrder(
    @Param('id') id: string,
    @Body() approvalData: {
      approverId: string;
      approverName: string;
      role: string;
      level: number;
      comments?: string;
    },
  ): Promise<SalesOrder> {
    return this.orderService.approveOrder(
      id,
      approvalData.approverId,
      approvalData.approverName,
      approvalData.role,
      approvalData.level,
      approvalData.comments,
    );
  }

  @Patch(':id/reject')
  async rejectOrder(
    @Param('id') id: string,
    @Body() rejectionData: {
      approverId: string;
      approverName: string;
      role: string;
      level: number;
      comments: string;
    },
  ): Promise<SalesOrder> {
    return this.orderService.rejectOrder(
      id,
      rejectionData.approverId,
      rejectionData.approverName,
      rejectionData.role,
      rejectionData.level,
      rejectionData.comments,
    );
  }

  @Post(':id/handover-package')
  async createHandoverPackage(
    @Param('id') id: string,
    @Body('createdBy') createdBy: string,
  ) {
    return this.orderService.createHandoverPackage(id, createdBy);
  }

  @Patch(':id/handover-to-production')
  async handoverToProduction(
    @Param('id') id: string,
    @Body() handoverData: { acceptedBy: string; acceptanceRemarks?: string },
  ): Promise<SalesOrder> {
    return this.orderService.handoverToProduction(
      id,
      handoverData.acceptedBy,
      handoverData.acceptanceRemarks,
    );
  }

  // Approval Workflow Endpoints
  @Get('approvals/pending')
  async getPendingApprovals(
    @Query('approverId') approverId?: string,
    @Query('role') role?: string,
  ) {
    return this.approvalWorkflowService.getPendingApprovals(approverId, role);
  }

  @Get('approvals/history/:referenceId')
  async getApprovalHistory(@Param('referenceId') referenceId: string) {
    return this.approvalWorkflowService.getApprovalHistory(referenceId);
  }

  @Post('approvals/request')
  async createApprovalRequest(
    @Body() requestData: {
      requestType: 'discount' | 'payment_terms' | 'delivery' | 'margin' | 'credit_limit';
      referenceId: string;
      referenceNumber: string;
      requestValue: number;
      requestedBy: string;
      reason: string;
    },
  ) {
    return this.approvalWorkflowService.createApprovalRequest(
      requestData.requestType,
      requestData.referenceId,
      requestData.referenceNumber,
      requestData.requestValue,
      requestData.requestedBy,
      requestData.reason,
    );
  }

  @Patch('approvals/:requestId/approve')
  async approveRequest(
    @Param('requestId') requestId: string,
    @Body() approvalData: { approverId: string; comments?: string },
  ) {
    return this.approvalWorkflowService.approveRequest(
      requestId,
      approvalData.approverId,
      approvalData.comments,
    );
  }

  @Patch('approvals/:requestId/reject')
  async rejectRequest(
    @Param('requestId') requestId: string,
    @Body() rejectionData: { approverId: string; comments: string },
  ) {
    return this.approvalWorkflowService.rejectRequest(
      requestId,
      rejectionData.approverId,
      rejectionData.comments,
    );
  }

  @Patch('approvals/:requestId/escalate')
  async escalateRequest(
    @Param('requestId') requestId: string,
    @Body() escalationData: { escalatedToId: string; escalatedToName: string },
  ) {
    return this.approvalWorkflowService.escalateRequest(
      requestId,
      escalationData.escalatedToId,
      escalationData.escalatedToName,
    );
  }

  @Post('approvals/check-escalations')
  @HttpCode(HttpStatus.OK)
  async checkEscalations() {
    return this.approvalWorkflowService.checkEscalationTimeout();
  }

  @Post('approvals/validate-discount')
  async validateDiscount(
    @Body() validationData: { discount: number; margin: number },
  ) {
    return this.approvalWorkflowService.validateDiscountApproval(
      validationData.discount,
      validationData.margin,
    );
  }

  // Pricing Endpoints
  @Post('pricing/calculate')
  async calculatePrice(
    @Body() priceRequest: {
      itemId: string;
      quantity: number;
      customerId: string;
      date?: string;
    },
  ) {
    const date = priceRequest.date ? new Date(priceRequest.date) : new Date();
    return this.pricingService.calculatePrice(
      priceRequest.itemId,
      priceRequest.quantity,
      priceRequest.customerId,
      date,
    );
  }

  @Post('pricing/quote')
  async getQuotePrice(
    @Body() quoteRequest: {
      items: Array<{ itemId: string; quantity: number }>;
      customerId: string;
      date?: string;
    },
  ) {
    const date = quoteRequest.date ? new Date(quoteRequest.date) : new Date();
    return this.pricingService.getQuotePrice(
      quoteRequest.items,
      quoteRequest.customerId,
      date,
    );
  }

  @Get('pricing/quantity-breaks/:itemId')
  async getQuantityBreaks(@Param('itemId') itemId: string) {
    return this.pricingService.getQuantityBreaks(itemId);
  }

  @Post('pricing/validate-margin')
  async validateMargin(
    @Body() marginData: { sellPrice: number; costPrice: number },
  ) {
    return this.pricingService.validateMargin(
      marginData.sellPrice,
      marginData.costPrice,
    );
  }

  @Get('pricing/promotions')
  async getActivePromotions(
    @Query('date') date?: string,
    @Query('itemId') itemId?: string,
  ) {
    const dateObj = date ? new Date(date) : new Date();
    return this.pricingService.getActivePromotions(dateObj, itemId);
  }

  @Get('pricing/history/:itemId')
  async getPriceHistory(@Param('itemId') itemId: string) {
    return this.pricingService.getPriceHistory(itemId);
  }
}
