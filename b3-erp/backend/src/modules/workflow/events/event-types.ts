// Event Types for ManufacturingOS Workflow Automation
// These events enable inter-module communication and workflow orchestration

export enum WorkflowEventType {
  // Sales Events
  RFP_CREATED = 'rfp.created',
  RFP_APPROVED = 'rfp.approved',
  RFP_REJECTED = 'rfp.rejected',
  QUOTE_CREATED = 'quote.created',
  QUOTE_APPROVED = 'quote.approved',
  QUOTE_SENT = 'quote.sent',
  ORDER_CREATED = 'order.created',
  ORDER_CONFIRMED = 'order.confirmed',
  ORDER_CANCELLED = 'order.cancelled',
  ORDER_COMPLETED = 'order.completed',

  // Production Events
  WORK_ORDER_CREATED = 'work_order.created',
  WORK_ORDER_RELEASED = 'work_order.released',
  WORK_ORDER_STARTED = 'work_order.started',
  WORK_ORDER_COMPLETED = 'work_order.completed',
  WORK_ORDER_CANCELLED = 'work_order.cancelled',
  PRODUCTION_STARTED = 'production.started',
  PRODUCTION_COMPLETED = 'production.completed',
  PRODUCTION_DELAYED = 'production.delayed',
  BOM_CREATED = 'bom.created',
  BOM_APPROVED = 'bom.approved',

  // Inventory Events
  STOCK_RECEIVED = 'stock.received',
  STOCK_RESERVED = 'stock.reserved',
  STOCK_RELEASED = 'stock.released',
  STOCK_CONSUMED = 'stock.consumed',
  STOCK_LOW = 'stock.low',
  STOCK_OUT = 'stock.out',
  STOCK_ADJUSTED = 'stock.adjusted',
  STOCK_TRANSFERRED = 'stock.transferred',

  // Procurement Events
  PURCHASE_REQUEST_CREATED = 'purchase_request.created',
  PURCHASE_REQUEST_APPROVED = 'purchase_request.approved',
  PURCHASE_ORDER_CREATED = 'purchase_order.created',
  PURCHASE_ORDER_SENT = 'purchase_order.sent',
  PURCHASE_ORDER_CONFIRMED = 'purchase_order.confirmed',
  GOODS_RECEIVED = 'goods.received',
  GOODS_INSPECTED = 'goods.inspected',

  // Quality Events
  INSPECTION_REQUIRED = 'inspection.required',
  INSPECTION_PASSED = 'inspection.passed',
  INSPECTION_FAILED = 'inspection.failed',
  NCR_CREATED = 'ncr.created',
  NCR_RESOLVED = 'ncr.resolved',
  CAPA_CREATED = 'capa.created',
  CAPA_COMPLETED = 'capa.completed',

  // Finance Events
  INVOICE_CREATED = 'invoice.created',
  INVOICE_SENT = 'invoice.sent',
  PAYMENT_RECEIVED = 'payment.received',
  PAYMENT_OVERDUE = 'payment.overdue',
  GL_POSTED = 'gl.posted',

  // Logistics Events
  SHIPMENT_CREATED = 'shipment.created',
  SHIPMENT_DISPATCHED = 'shipment.dispatched',
  SHIPMENT_IN_TRANSIT = 'shipment.in_transit',
  SHIPMENT_DELIVERED = 'shipment.delivered',

  // General Workflow Events
  APPROVAL_REQUIRED = 'approval.required',
  APPROVAL_GRANTED = 'approval.granted',
  APPROVAL_REJECTED = 'approval.rejected',
  NOTIFICATION_SEND = 'notification.send',
}

// Base event payload interface
export interface BaseEventPayload {
  eventId: string;
  timestamp: Date;
  userId: string;
  tenantId?: string;
  metadata?: Record<string, any>;
}

// Sales Event Payloads
export interface RFPEventPayload extends BaseEventPayload {
  rfpId: string;
  rfpNumber: string;
  customerId: string;
  customerName: string;
  totalAmount?: number;
  items?: Array<{
    itemId: string;
    itemName: string;
    quantity: number;
    unit: string;
  }>;
  deliveryDate?: Date;
  status: string;
}

export interface OrderEventPayload extends BaseEventPayload {
  orderId: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  totalAmount: number;
  items: Array<{
    itemId: string;
    itemName: string;
    quantity: number;
    unit: string;
    unitPrice: number;
  }>;
  deliveryDate: Date;
  status: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

// Production Event Payloads
export interface WorkOrderEventPayload extends BaseEventPayload {
  workOrderId: string;
  workOrderNumber: string;
  orderId?: string;
  orderNumber?: string;
  itemId: string;
  itemName: string;
  quantity: number;
  unit: string;
  plannedStartDate: Date;
  plannedEndDate: Date;
  status: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  materials?: Array<{
    itemId: string;
    itemName: string;
    requiredQty: number;
    availableQty: number;
    unit: string;
  }>;
}

export interface ProductionEventPayload extends BaseEventPayload {
  productionEntryId: string;
  workOrderId: string;
  workOrderNumber: string;
  itemId: string;
  itemName: string;
  producedQty: number;
  scrapQty?: number;
  unit: string;
  workCenterId?: string;
  operatorId?: string;
}

// Inventory Event Payloads
export interface StockEventPayload extends BaseEventPayload {
  stockEntryId?: string;
  itemId: string;
  itemCode: string;
  itemName: string;
  warehouseId: string;
  warehouseName: string;
  locationId?: string;
  quantity: number;
  unit: string;
  batchNumber?: string;
  serialNumber?: string;
  reorderLevel?: number;
  currentStock?: number;
  reservedQty?: number;
  availableQty?: number;
  referenceType?: 'work_order' | 'purchase_order' | 'sales_order' | 'transfer';
  referenceId?: string;
}

export interface StockReservationPayload extends BaseEventPayload {
  reservationId: string;
  itemId: string;
  itemName: string;
  warehouseId: string;
  quantity: number;
  unit: string;
  referenceType: 'work_order' | 'sales_order';
  referenceId: string;
  expiresAt?: Date;
}

// Procurement Event Payloads
export interface PurchaseOrderEventPayload extends BaseEventPayload {
  purchaseOrderId: string;
  poNumber: string;
  vendorId: string;
  vendorName: string;
  totalAmount: number;
  items: Array<{
    itemId: string;
    itemName: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    expectedDate?: Date;
  }>;
  expectedDeliveryDate: Date;
  status: string;
}

export interface GoodsReceiptEventPayload extends BaseEventPayload {
  receiptId: string;
  receiptNumber: string;
  purchaseOrderId: string;
  poNumber: string;
  vendorId: string;
  warehouseId: string;
  items: Array<{
    itemId: string;
    itemName: string;
    orderedQty: number;
    receivedQty: number;
    unit: string;
    batchNumber?: string;
    inspectionRequired: boolean;
  }>;
}

// Quality Event Payloads
export interface InspectionEventPayload extends BaseEventPayload {
  inspectionId: string;
  inspectionNumber: string;
  referenceType: 'goods_receipt' | 'production' | 'in_process';
  referenceId: string;
  itemId: string;
  itemName: string;
  quantity: number;
  unit: string;
  result?: 'passed' | 'failed' | 'conditional';
  defects?: Array<{
    type: string;
    quantity: number;
    severity: 'minor' | 'major' | 'critical';
  }>;
}

// Finance Event Payloads
export interface InvoiceEventPayload extends BaseEventPayload {
  invoiceId: string;
  invoiceNumber: string;
  customerId?: string;
  vendorId?: string;
  orderId?: string;
  totalAmount: number;
  taxAmount: number;
  dueDate: Date;
  status: string;
  type: 'sales' | 'purchase';
}

export interface PaymentEventPayload extends BaseEventPayload {
  paymentId: string;
  paymentNumber: string;
  invoiceId: string;
  amount: number;
  paymentMethod: string;
  paymentDate: Date;
}

// Logistics Event Payloads
export interface ShipmentEventPayload extends BaseEventPayload {
  shipmentId: string;
  shipmentNumber: string;
  orderId: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  deliveryAddress: string;
  carrier?: string;
  trackingNumber?: string;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  status: string;
}

// Notification Event Payloads
export interface NotificationEventPayload extends BaseEventPayload {
  type: 'email' | 'sms' | 'push' | 'in_app';
  recipients: string[];
  subject: string;
  message: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  data?: Record<string, any>;
  scheduledAt?: Date;
}

// Approval Event Payloads
export interface ApprovalEventPayload extends BaseEventPayload {
  approvalId: string;
  entityType: string;
  entityId: string;
  entityNumber: string;
  requiredApprovers: string[];
  currentLevel: number;
  maxLevel: number;
  amount?: number;
  reason?: string;
  decision?: 'approved' | 'rejected';
  comments?: string;
}
