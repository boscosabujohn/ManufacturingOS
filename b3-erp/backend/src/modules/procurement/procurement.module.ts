import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

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
} from './services';

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
  ],
})
export class ProcurementModule {}
