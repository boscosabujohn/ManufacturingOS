import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkflowModule } from '../workflow/workflow.module';
import {
  AuditTrailController,
  GoodsReceiptController,
  PurchaseInvoiceController,
  PurchaseOrderController,
  PurchaseRequisitionController,
  PurchaseReturnController,
  RFQController,
  SourcingIntegrationController,
  VendorCollaborationController,
  VendorContractController,
  VendorEvaluationController,
  VendorQuotationController,
} from './controllers';
import {
  AuditTrail,
  GoodsReceipt,
  GoodsReceiptItem,
  PurchaseInvoice,
  PurchaseOrder,
  PurchaseOrderItem,
  PurchaseRequisition,
  PurchaseReturn,
  RFQ,
  SourcingRule,
  VendorContract,
  VendorEvaluation,
  VendorMessage,
  VendorQuotation,
} from './entities';
import {
  ApprovalThresholdSeederService,
  GoodsReceiptService,
  PurchaseInvoiceService,
  PurchaseOrderService,
  PurchaseRequisitionService,
  PurchaseReturnService,
  RFQService,
  VendorEvaluationService,
  VendorQuotationService,
} from './services';
import { ApprovalMatrixService } from './services/approval-matrix.service';
import { AuditTrailService } from './services/audit-trail.service';
import { ContractService } from './services/contract.service';
import { RFQPolicyService } from './services/rfq-policy.service';
import { SourcingIntegrationService } from './services/sourcing-integration.service';
import { SpendAnalysisService } from './services/spend-analysis.service';
import { ThreeWayMatchingService } from './services/three-way-matching.service';
import { VendorCollaborationService } from './services/vendor-collaboration.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AuditTrail,
      GoodsReceipt,
      GoodsReceiptItem,
      PurchaseInvoice,
      PurchaseOrder,
      PurchaseOrderItem,
      PurchaseRequisition,
      PurchaseReturn,
      RFQ,
      SourcingRule,
      VendorContract,
      VendorEvaluation,
      VendorMessage,
      VendorQuotation,
    ]),
    WorkflowModule,
  ],
  controllers: [
    AuditTrailController,
    GoodsReceiptController,
    PurchaseInvoiceController,
    PurchaseOrderController,
    PurchaseRequisitionController,
    PurchaseReturnController,
    RFQController,
    SourcingIntegrationController,
    VendorCollaborationController,
    VendorContractController,
    VendorEvaluationController,
    VendorQuotationController,
  ],
  providers: [
    ApprovalMatrixService,
    ApprovalThresholdSeederService,
    AuditTrailService,
    ContractService,
    GoodsReceiptService,
    PurchaseInvoiceService,
    PurchaseOrderService,
    PurchaseRequisitionService,
    PurchaseReturnService,
    RFQPolicyService,
    RFQService,
    SourcingIntegrationService,
    SpendAnalysisService,
    ThreeWayMatchingService,
    VendorCollaborationService,
    VendorEvaluationService,
    VendorQuotationService,
  ],
  exports: [
    ApprovalMatrixService,
    ApprovalThresholdSeederService,
    AuditTrailService,
    ContractService,
    GoodsReceiptService,
    PurchaseInvoiceService,
    PurchaseOrderService,
    PurchaseRequisitionService,
    PurchaseReturnService,
    RFQPolicyService,
    RFQService,
    SourcingIntegrationService,
    SpendAnalysisService,
    ThreeWayMatchingService,
    VendorCollaborationService,
    VendorEvaluationService,
    VendorQuotationService,
  ],
})
export class ProcurementModule {}
