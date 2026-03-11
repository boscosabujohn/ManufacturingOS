import { PurchaseOrder, POStatus, POType, PaymentTerms, DeliveryTerms } from '../../src/modules/procurement/entities/purchase-order.entity';
import { PurchaseOrderItem, POItemStatus } from '../../src/modules/procurement/entities/purchase-order-item.entity';

export class ProcurementFactory {
    private static poCounter = 0;
    private static itemCounter = 0;

    static createPurchaseOrder(overrides: Partial<PurchaseOrder> = {}): PurchaseOrder {
        this.poCounter++;
        const po = new PurchaseOrder();
        po.id = overrides.id || `po-uuid-${this.poCounter}`;
        po.poNumber = overrides.poNumber || `PO-202603-${this.poCounter.toString().padStart(5, '0')}`;
        po.poDate = overrides.poDate || new Date();
        po.deliveryDate = overrides.deliveryDate || new Date();
        po.status = overrides.status || POStatus.DRAFT;
        po.poType = overrides.poType || POType.STANDARD;
        po.vendorId = overrides.vendorId || 'vendor-1';
        po.vendorName = overrides.vendorName || 'Test Vendor';
        po.deliveryAddress = overrides.deliveryAddress || 'Test Address';
        po.deliveryTerms = overrides.deliveryTerms || DeliveryTerms.FOB;
        po.currency = overrides.currency || 'INR';
        po.paymentTerms = overrides.paymentTerms || PaymentTerms.NET_30;
        po.subtotal = overrides.subtotal || 0;
        po.taxAmount = overrides.taxAmount || 0;
        po.totalAmount = overrides.totalAmount || 0;
        po.buyerId = overrides.buyerId || 'buyer-1';
        po.buyerName = overrides.buyerName || 'Test Buyer';
        po.items = overrides.items || [];

        return Object.assign(po, overrides);
    }

    static createPurchaseOrderItem(overrides: Partial<PurchaseOrderItem> = {}): PurchaseOrderItem {
        this.itemCounter++;
        const item = new PurchaseOrderItem();
        item.id = overrides.id || `po-item-uuid-${this.itemCounter}`;
        item.lineNumber = overrides.lineNumber || this.itemCounter;
        item.status = overrides.status || POItemStatus.PENDING;
        item.itemId = overrides.itemId || 'item-1';
        item.itemCode = overrides.itemCode || 'ITEM-1';
        item.itemName = overrides.itemName || 'Test Item';
        item.uom = overrides.uom || 'PCS';
        item.orderedQuantity = overrides.orderedQuantity || 10;
        item.pendingQuantity = item.orderedQuantity;
        item.unitPrice = overrides.unitPrice || 100;
        item.netUnitPrice = item.unitPrice;
        item.lineTotal = item.orderedQuantity * item.unitPrice;
        item.taxRate = overrides.taxRate || 18;
        item.taxAmount = (item.lineTotal * item.taxRate) / 100;
        item.totalAmount = item.lineTotal + item.taxAmount;

        return Object.assign(item, overrides);
    }

    static resetCounters() {
        this.poCounter = 0;
        this.itemCounter = 0;
    }
}
