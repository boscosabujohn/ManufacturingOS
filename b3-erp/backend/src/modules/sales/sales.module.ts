import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from '../core/entities/item.entity';
import { TaxMaster } from '../finance/entities/tax.entity';
import { PrismaModule } from '../prisma/prisma.module';
import { WorkflowModule } from '../workflow/workflow.module';
import { OrderController } from './controllers/order.controller';
import { QuotationController } from './controllers/quotation.controller';
import { SalesMastersController } from './controllers/sales-masters.controller';
import { PaymentTerms } from './entities/payment-terms.entity';
import { Quotation, QuotationItem } from './entities/quotation.entity';
import { RFPController } from './rfp.controller';
import { RFPService } from './rfp.service';
import { ApprovalWorkflowService } from './services/approval-workflow.service';
import { BOQValidationService } from './services/boq-validation.service';
import { Customer360Service } from './services/customer-360.service';
import { InformationRequestService } from './services/information-request.service';
import { OrderService } from './services/order.service';
import { PaymentTermsSeederService } from './services/payment-terms-seeder.service';
import { PricingService } from './services/pricing.service';
import { QuotationService } from './services/quotation.service';
import { SalesMastersService } from './services/sales-masters.service';

@Module({
  imports: [
    PrismaModule,
    TypeOrmModule.forFeature([PaymentTerms, Quotation, QuotationItem, Item, TaxMaster]),
    forwardRef(() => WorkflowModule),
  ],
  controllers: [RFPController, OrderController, QuotationController, SalesMastersController],
  providers: [
    RFPService,
    OrderService,
    QuotationService,
    SalesMastersService,
    ApprovalWorkflowService,
    PricingService,
    BOQValidationService,
    Customer360Service,
    InformationRequestService,
    PaymentTermsSeederService,
  ],
  exports: [
    RFPService,
    OrderService,
    QuotationService,
    SalesMastersService,
    ApprovalWorkflowService,
    PricingService,
    BOQValidationService,
    Customer360Service,
    InformationRequestService,
  ],
})
export class SalesModule {}
