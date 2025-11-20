import { Module } from '@nestjs/common';
import { RFPController } from './rfp.controller';
import { RFPService } from './rfp.service';
import { OrderController } from './controllers/order.controller';
import { OrderService } from './services/order.service';
import { ApprovalWorkflowService } from './services/approval-workflow.service';
import { PricingService } from './services/pricing.service';
import { BOQValidationService } from './services/boq-validation.service';
import { WorkflowModule } from '../workflow/workflow.module';

@Module({
  imports: [WorkflowModule],
  controllers: [RFPController, OrderController],
  providers: [
    RFPService,
    OrderService,
    ApprovalWorkflowService,
    PricingService,
    BOQValidationService,
  ],
  exports: [
    RFPService,
    OrderService,
    ApprovalWorkflowService,
    PricingService,
    BOQValidationService,
  ],
})
export class SalesModule {}
