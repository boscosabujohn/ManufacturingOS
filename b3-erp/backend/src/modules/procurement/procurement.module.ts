import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkflowModule } from '../workflow/workflow.module';

// Entities
import {
  PurchaseRequisition,
  PurchaseOrder,
  PurchaseOrderItem,
  RFQ,
  VendorQuotation,
  GoodsReceipt,
  GoodsReceiptItem,
  PurchaseReturn,
  PurchaseInvoice,
  VendorEvaluation,
} from './entities';

// Controllers
import {
  PurchaseRequisitionController,
  PurchaseOrderController,
  RFQController,
  VendorQuotationController,
  GoodsReceiptController,
  PurchaseReturnController,
  PurchaseInvoiceController,
  VendorEvaluationController,
} from './controllers';

// Services
import {
  PurchaseRequisitionService,
  PurchaseOrderService,
  RFQService,
  VendorQuotationService,
  GoodsReceiptService,
  PurchaseReturnService,
  PurchaseInvoiceService,
  VendorEvaluationService,
  ApprovalThresholdSeederService,
} from './services';
import { ThreeWayMatchingService } from './services/three-way-matching.service';
import { ContractService } from './services/contract.service';
import { ApprovalMatrixService } from './services/approval-matrix.service';
import { RFQPolicyService } from './services/rfq-policy.service';
import { SpendAnalysisService } from './services/spend-analysis.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      // Purchase Requisitions
      PurchaseRequisition,

      // Purchase Orders
      PurchaseOrder,
      PurchaseOrderItem,

      // RFQ & Quotations
      RFQ,
      VendorQuotation,

      // Goods Receipts
      GoodsReceipt,
      GoodsReceiptItem,

      // Purchase Returns
      PurchaseReturn,

      // Purchase Invoices
      PurchaseInvoice,

      // Vendor Evaluations
      VendorEvaluation,
    ]),
    WorkflowModule,
  ],
  controllers: [
    PurchaseRequisitionController,
    PurchaseOrderController,
    RFQController,
    VendorQuotationController,
    GoodsReceiptController,
    PurchaseReturnController,
    PurchaseInvoiceController,
    VendorEvaluationController,
  ],
  providers: [
    PurchaseRequisitionService,
    PurchaseOrderService,
    RFQService,
    VendorQuotationService,
    GoodsReceiptService,
    PurchaseReturnService,
    PurchaseInvoiceService,
    VendorEvaluationService,
    ThreeWayMatchingService,
    ContractService,
    ApprovalMatrixService,
    RFQPolicyService,
    SpendAnalysisService,
    ApprovalThresholdSeederService,
  ],
  exports: [
    PurchaseRequisitionService,
    PurchaseOrderService,
    RFQService,
    VendorQuotationService,
    GoodsReceiptService,
    PurchaseReturnService,
    PurchaseInvoiceService,
    VendorEvaluationService,
    ThreeWayMatchingService,
    ContractService,
    ApprovalMatrixService,
    RFQPolicyService,
    SpendAnalysisService,
    ApprovalThresholdSeederService,
  ],
})
export class ProcurementModule {}
