/**
 * Procurement API Service
 * Wires frontend to backend Procurement module APIs
 */

import apiClient from '@/lib/api-client';

// ============================================
// TYPES
// ============================================

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  vendorId: string;
  vendorCode: string;
  vendorName: string;
  vendorAddress?: string;
  status: 'draft' | 'submitted' | 'approved' | 'sent' | 'acknowledged' | 'partially_received' | 'received' | 'closed' | 'cancelled';
  poDate: string;
  expectedDeliveryDate?: string;
  paymentTerms?: string;
  paymentTermsDays?: number;
  currency: string;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  freightCharges: number;
  otherCharges: number;
  totalAmount: number;
  receivedAmount: number;
  invoicedAmount: number;
  paidAmount: number;
  purchaseRequisitionId?: string;
  purchaseRequisitionNumber?: string;
  rfqId?: string;
  rfqNumber?: string;
  items: PurchaseOrderItem[];
  deliveryAddress?: string;
  billingAddress?: string;
  notes?: string;
  termsAndConditions?: string;
  attachments?: { fileName: string; fileUrl: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrderItem {
  id: string;
  itemId: string;
  itemCode: string;
  itemName: string;
  description?: string;
  quantity: number;
  receivedQuantity: number;
  pendingQuantity: number;
  uom: string;
  unitPrice: number;
  discountPercent: number;
  discountAmount: number;
  taxPercent: number;
  taxAmount: number;
  totalAmount: number;
  expectedDeliveryDate?: string;
  warehouseId?: string;
  warehouseName?: string;
}

export interface PurchaseRequisition {
  id: string;
  prNumber: string;
  requestedBy: string;
  requestedByName: string;
  departmentId: string;
  departmentName: string;
  status: 'draft' | 'submitted' | 'approved' | 'partially_ordered' | 'ordered' | 'rejected' | 'cancelled';
  requisitionDate: string;
  requiredDate?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  purpose?: string;
  items: PurchaseRequisitionItem[];
  totalEstimatedCost: number;
  currency: string;
  notes?: string;
  attachments?: { fileName: string; fileUrl: string }[];
  approvedBy?: string;
  approvedByName?: string;
  approvedDate?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseRequisitionItem {
  id: string;
  itemId: string;
  itemCode: string;
  itemName: string;
  description?: string;
  quantity: number;
  orderedQuantity: number;
  uom: string;
  estimatedUnitPrice?: number;
  estimatedTotalPrice?: number;
  preferredVendorId?: string;
  preferredVendorName?: string;
  requiredDate?: string;
  specification?: string;
}

export interface GoodsReceipt {
  id: string;
  grnNumber: string;
  purchaseOrderId: string;
  purchaseOrderNumber: string;
  vendorId: string;
  vendorName: string;
  status: 'draft' | 'submitted' | 'inspection_pending' | 'inspection_complete' | 'posted' | 'cancelled';
  receiptDate: string;
  challanNumber?: string;
  challanDate?: string;
  vehicleNumber?: string;
  driverName?: string;
  warehouseId: string;
  warehouseName: string;
  items: GoodsReceiptItem[];
  totalQuantity: number;
  acceptedQuantity: number;
  rejectedQuantity: number;
  inspectionRequired: boolean;
  inspectionId?: string;
  inspectionStatus?: string;
  receivedBy: string;
  receivedByName: string;
  notes?: string;
  attachments?: { fileName: string; fileUrl: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface GoodsReceiptItem {
  id: string;
  poItemId: string;
  itemId: string;
  itemCode: string;
  itemName: string;
  orderedQuantity: number;
  receivedQuantity: number;
  acceptedQuantity: number;
  rejectedQuantity: number;
  uom: string;
  batchNumber?: string;
  serialNumbers?: string[];
  expiryDate?: string;
  storageLocationId?: string;
  storageLocationName?: string;
  remarks?: string;
}

export interface PurchaseInvoice {
  id: string;
  invoiceNumber: string;
  vendorInvoiceNumber: string;
  vendorInvoiceDate: string;
  vendorId: string;
  vendorName: string;
  purchaseOrderId?: string;
  purchaseOrderNumber?: string;
  grnId?: string;
  grnNumber?: string;
  status: 'draft' | 'submitted' | 'verified' | 'approved' | 'posted' | 'paid' | 'cancelled';
  invoiceDate: string;
  dueDate: string;
  currency: string;
  subtotal: number;
  taxAmount: number;
  tdsAmount: number;
  discountAmount: number;
  freightCharges: number;
  otherCharges: number;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  items: PurchaseInvoiceItem[];
  threeWayMatchStatus?: 'pending' | 'matched' | 'discrepancy';
  matchingNotes?: string;
  paymentTerms?: string;
  notes?: string;
  attachments?: { fileName: string; fileUrl: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseInvoiceItem {
  id: string;
  itemId: string;
  itemCode: string;
  itemName: string;
  description?: string;
  quantity: number;
  uom: string;
  unitPrice: number;
  discountPercent: number;
  discountAmount: number;
  taxPercent: number;
  taxAmount: number;
  tdsPercent: number;
  tdsAmount: number;
  totalAmount: number;
  poQuantity?: number;
  grnQuantity?: number;
  hsnCode?: string;
}

export interface PurchaseReturn {
  id: string;
  returnNumber: string;
  vendorId: string;
  vendorName: string;
  purchaseOrderId?: string;
  purchaseOrderNumber?: string;
  grnId?: string;
  grnNumber?: string;
  status: 'draft' | 'submitted' | 'approved' | 'shipped' | 'received_by_vendor' | 'credit_note_received' | 'closed' | 'cancelled';
  returnDate: string;
  returnReason: 'quality_issue' | 'damaged' | 'wrong_item' | 'excess_quantity' | 'other';
  reasonDescription?: string;
  items: PurchaseReturnItem[];
  totalQuantity: number;
  totalValue: number;
  currency: string;
  creditNoteNumber?: string;
  creditNoteDate?: string;
  creditNoteAmount?: number;
  shipmentId?: string;
  trackingNumber?: string;
  notes?: string;
  attachments?: { fileName: string; fileUrl: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseReturnItem {
  id: string;
  itemId: string;
  itemCode: string;
  itemName: string;
  returnQuantity: number;
  uom: string;
  unitPrice: number;
  totalAmount: number;
  batchNumber?: string;
  serialNumbers?: string[];
  reason?: string;
}

// ============================================
// PURCHASE ORDER API
// ============================================

export const purchaseOrderApi = {
  async getAll(filters?: {
    status?: string;
    vendorId?: string;
    fromDate?: string;
    toDate?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: PurchaseOrder[]; total: number }> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }
    const response = await apiClient.get(`/procurement/purchase-orders?${params.toString()}`);
    return response.data;
  },

  async getById(id: string): Promise<PurchaseOrder> {
    const response = await apiClient.get(`/procurement/purchase-orders/${id}`);
    return response.data;
  },

  async create(data: {
    vendorId: string;
    poDate: string;
    expectedDeliveryDate?: string;
    paymentTerms?: string;
    currency?: string;
    purchaseRequisitionId?: string;
    rfqId?: string;
    items: {
      itemId: string;
      quantity: number;
      unitPrice: number;
      discountPercent?: number;
      taxPercent?: number;
      expectedDeliveryDate?: string;
      warehouseId?: string;
    }[];
    deliveryAddress?: string;
    notes?: string;
  }): Promise<PurchaseOrder> {
    const response = await apiClient.post('/procurement/purchase-orders', data);
    return response.data;
  },

  async update(id: string, data: Partial<PurchaseOrder>): Promise<PurchaseOrder> {
    const response = await apiClient.put(`/procurement/purchase-orders/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/procurement/purchase-orders/${id}`);
  },

  async submit(id: string): Promise<PurchaseOrder> {
    const response = await apiClient.post(`/procurement/purchase-orders/${id}/submit`);
    return response.data;
  },

  async approve(id: string): Promise<PurchaseOrder> {
    const response = await apiClient.post(`/procurement/purchase-orders/${id}/approve`);
    return response.data;
  },

  async send(id: string): Promise<PurchaseOrder> {
    const response = await apiClient.post(`/procurement/purchase-orders/${id}/send`);
    return response.data;
  },

  async close(id: string): Promise<PurchaseOrder> {
    const response = await apiClient.post(`/procurement/purchase-orders/${id}/close`);
    return response.data;
  },

  async cancel(id: string, reason: string): Promise<PurchaseOrder> {
    const response = await apiClient.post(`/procurement/purchase-orders/${id}/cancel`, { reason });
    return response.data;
  },

  async getOutstanding(): Promise<PurchaseOrder[]> {
    const response = await apiClient.get('/procurement/purchase-orders/outstanding');
    return response.data;
  },

  async print(id: string): Promise<{ pdfUrl: string }> {
    const response = await apiClient.post(`/procurement/purchase-orders/${id}/print`);
    return response.data;
  },
};

// ============================================
// PURCHASE REQUISITION API
// ============================================

export const purchaseRequisitionApi = {
  async getAll(filters?: {
    status?: string;
    departmentId?: string;
    requestedBy?: string;
    priority?: string;
    fromDate?: string;
    toDate?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: PurchaseRequisition[]; total: number }> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }
    const response = await apiClient.get(`/procurement/purchase-requisitions?${params.toString()}`);
    return response.data;
  },

  async getById(id: string): Promise<PurchaseRequisition> {
    const response = await apiClient.get(`/procurement/purchase-requisitions/${id}`);
    return response.data;
  },

  async create(data: {
    departmentId: string;
    requisitionDate: string;
    requiredDate?: string;
    priority?: string;
    purpose?: string;
    items: {
      itemId: string;
      quantity: number;
      estimatedUnitPrice?: number;
      preferredVendorId?: string;
      requiredDate?: string;
      specification?: string;
    }[];
    notes?: string;
  }): Promise<PurchaseRequisition> {
    const response = await apiClient.post('/procurement/purchase-requisitions', data);
    return response.data;
  },

  async update(id: string, data: Partial<PurchaseRequisition>): Promise<PurchaseRequisition> {
    const response = await apiClient.put(`/procurement/purchase-requisitions/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/procurement/purchase-requisitions/${id}`);
  },

  async submit(id: string): Promise<PurchaseRequisition> {
    const response = await apiClient.post(`/procurement/purchase-requisitions/${id}/submit`);
    return response.data;
  },

  async approve(id: string): Promise<PurchaseRequisition> {
    const response = await apiClient.post(`/procurement/purchase-requisitions/${id}/approve`);
    return response.data;
  },

  async reject(id: string, reason: string): Promise<PurchaseRequisition> {
    const response = await apiClient.post(`/procurement/purchase-requisitions/${id}/reject`, { reason });
    return response.data;
  },

  async convertToPO(id: string, data?: { vendorId?: string }): Promise<PurchaseOrder> {
    const response = await apiClient.post(`/procurement/purchase-requisitions/${id}/convert-to-po`, data);
    return response.data;
  },
};

// ============================================
// GOODS RECEIPT API
// ============================================

export const goodsReceiptApi = {
  async getAll(filters?: {
    status?: string;
    vendorId?: string;
    purchaseOrderId?: string;
    warehouseId?: string;
    fromDate?: string;
    toDate?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: GoodsReceipt[]; total: number }> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }
    const response = await apiClient.get(`/procurement/goods-receipt?${params.toString()}`);
    return response.data;
  },

  async getById(id: string): Promise<GoodsReceipt> {
    const response = await apiClient.get(`/procurement/goods-receipt/${id}`);
    return response.data;
  },

  async create(data: {
    purchaseOrderId: string;
    receiptDate: string;
    challanNumber?: string;
    challanDate?: string;
    vehicleNumber?: string;
    driverName?: string;
    warehouseId: string;
    items: {
      poItemId: string;
      receivedQuantity: number;
      batchNumber?: string;
      serialNumbers?: string[];
      expiryDate?: string;
      storageLocationId?: string;
      remarks?: string;
    }[];
    notes?: string;
  }): Promise<GoodsReceipt> {
    const response = await apiClient.post('/procurement/goods-receipt', data);
    return response.data;
  },

  async update(id: string, data: Partial<GoodsReceipt>): Promise<GoodsReceipt> {
    const response = await apiClient.put(`/procurement/goods-receipt/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/procurement/goods-receipt/${id}`);
  },

  async submit(id: string): Promise<GoodsReceipt> {
    const response = await apiClient.post(`/procurement/goods-receipt/${id}/submit`);
    return response.data;
  },

  async triggerInspection(id: string): Promise<GoodsReceipt> {
    const response = await apiClient.post(`/procurement/goods-receipt/${id}/trigger-inspection`);
    return response.data;
  },

  async updateInspectionResults(id: string, data: {
    items: { itemId: string; acceptedQuantity: number; rejectedQuantity: number; remarks?: string }[];
  }): Promise<GoodsReceipt> {
    const response = await apiClient.post(`/procurement/goods-receipt/${id}/inspection-results`, data);
    return response.data;
  },

  async post(id: string): Promise<GoodsReceipt> {
    const response = await apiClient.post(`/procurement/goods-receipt/${id}/post`);
    return response.data;
  },
};

// ============================================
// PURCHASE INVOICE API
// ============================================

export const purchaseInvoiceApi = {
  async getAll(filters?: {
    status?: string;
    vendorId?: string;
    purchaseOrderId?: string;
    fromDate?: string;
    toDate?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: PurchaseInvoice[]; total: number }> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }
    const response = await apiClient.get(`/procurement/purchase-invoices?${params.toString()}`);
    return response.data;
  },

  async getById(id: string): Promise<PurchaseInvoice> {
    const response = await apiClient.get(`/procurement/purchase-invoices/${id}`);
    return response.data;
  },

  async create(data: {
    vendorInvoiceNumber: string;
    vendorInvoiceDate: string;
    vendorId: string;
    purchaseOrderId?: string;
    grnId?: string;
    invoiceDate: string;
    dueDate: string;
    currency?: string;
    items: {
      itemId: string;
      quantity: number;
      unitPrice: number;
      discountPercent?: number;
      taxPercent?: number;
      tdsPercent?: number;
      hsnCode?: string;
    }[];
    freightCharges?: number;
    otherCharges?: number;
    notes?: string;
  }): Promise<PurchaseInvoice> {
    const response = await apiClient.post('/procurement/purchase-invoices', data);
    return response.data;
  },

  async update(id: string, data: Partial<PurchaseInvoice>): Promise<PurchaseInvoice> {
    const response = await apiClient.put(`/procurement/purchase-invoices/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/procurement/purchase-invoices/${id}`);
  },

  async submit(id: string): Promise<PurchaseInvoice> {
    const response = await apiClient.post(`/procurement/purchase-invoices/${id}/submit`);
    return response.data;
  },

  async verify(id: string): Promise<PurchaseInvoice> {
    const response = await apiClient.post(`/procurement/purchase-invoices/${id}/verify`);
    return response.data;
  },

  async approve(id: string): Promise<PurchaseInvoice> {
    const response = await apiClient.post(`/procurement/purchase-invoices/${id}/approve`);
    return response.data;
  },

  async post(id: string): Promise<PurchaseInvoice> {
    const response = await apiClient.post(`/procurement/purchase-invoices/${id}/post`);
    return response.data;
  },

  async threeWayMatch(id: string): Promise<{
    invoice: PurchaseInvoice;
    matchResult: {
      status: 'matched' | 'discrepancy';
      poMatch: boolean;
      grnMatch: boolean;
      discrepancies: { field: string; expected: any; actual: any }[];
    };
  }> {
    const response = await apiClient.post(`/procurement/purchase-invoices/${id}/three-way-match`);
    return response.data;
  },
};

// ============================================
// PURCHASE RETURN API
// ============================================

export const purchaseReturnApi = {
  async getAll(filters?: {
    status?: string;
    vendorId?: string;
    fromDate?: string;
    toDate?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: PurchaseReturn[]; total: number }> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }
    const response = await apiClient.get(`/procurement/purchase-returns?${params.toString()}`);
    return response.data;
  },

  async getById(id: string): Promise<PurchaseReturn> {
    const response = await apiClient.get(`/procurement/purchase-returns/${id}`);
    return response.data;
  },

  async create(data: {
    vendorId: string;
    purchaseOrderId?: string;
    grnId?: string;
    returnDate: string;
    returnReason: string;
    reasonDescription?: string;
    items: {
      itemId: string;
      returnQuantity: number;
      unitPrice: number;
      batchNumber?: string;
      serialNumbers?: string[];
      reason?: string;
    }[];
    notes?: string;
  }): Promise<PurchaseReturn> {
    const response = await apiClient.post('/procurement/purchase-returns', data);
    return response.data;
  },

  async update(id: string, data: Partial<PurchaseReturn>): Promise<PurchaseReturn> {
    const response = await apiClient.put(`/procurement/purchase-returns/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/procurement/purchase-returns/${id}`);
  },

  async submit(id: string): Promise<PurchaseReturn> {
    const response = await apiClient.post(`/procurement/purchase-returns/${id}/submit`);
    return response.data;
  },

  async approve(id: string): Promise<PurchaseReturn> {
    const response = await apiClient.post(`/procurement/purchase-returns/${id}/approve`);
    return response.data;
  },

  async ship(id: string, data: { trackingNumber?: string; shipmentDate?: string }): Promise<PurchaseReturn> {
    const response = await apiClient.post(`/procurement/purchase-returns/${id}/ship`, data);
    return response.data;
  },

  async recordCreditNote(id: string, data: {
    creditNoteNumber: string;
    creditNoteDate: string;
    creditNoteAmount: number;
  }): Promise<PurchaseReturn> {
    const response = await apiClient.post(`/procurement/purchase-returns/${id}/credit-note`, data);
    return response.data;
  },

  async close(id: string): Promise<PurchaseReturn> {
    const response = await apiClient.post(`/procurement/purchase-returns/${id}/close`);
    return response.data;
  },
};

// Export all APIs as a single object
export const procurementService = {
  purchaseOrders: purchaseOrderApi,
  purchaseRequisitions: purchaseRequisitionApi,
  goodsReceipt: goodsReceiptApi,
  purchaseInvoices: purchaseInvoiceApi,
  purchaseReturns: purchaseReturnApi,
};

export default procurementService;
