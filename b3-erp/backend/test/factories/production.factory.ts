import { WorkOrder, WorkOrderStatus, WorkOrderType, WorkOrderPriority } from '../../src/modules/production/entities/work-order.entity';
import { WorkOrderItem } from '../../src/modules/production/entities/work-order-item.entity';

export class ProductionFactory {
    private static woCounter = 0;
    private static itemCounter = 0;

    static createWorkOrder(overrides: Partial<WorkOrder> = {}): WorkOrder {
        this.woCounter++;
        const wo = new WorkOrder();
        wo.id = overrides.id || `wo-uuid-${this.woCounter}`;
        wo.workOrderNumber = overrides.workOrderNumber || `WO-2026-03-${this.woCounter.toString().padStart(5, '0')}`;
        wo.workOrderName = overrides.workOrderName || `Work Order ${this.woCounter}`;
        wo.status = overrides.status || WorkOrderStatus.DRAFT;
        wo.workOrderType = overrides.workOrderType || WorkOrderType.PRODUCTION;
        wo.priority = overrides.priority || WorkOrderPriority.NORMAL;
        wo.itemId = overrides.itemId || 'item-1';
        wo.itemCode = overrides.itemCode || 'ITEM-1';
        wo.itemName = overrides.itemName || 'Test Item';
        wo.uom = overrides.uom || 'PCS';
        wo.plannedQuantity = overrides.plannedQuantity || 100;
        wo.pendingQuantity = wo.plannedQuantity;
        wo.producedQuantity = overrides.producedQuantity || 0;
        wo.plannedStartDate = overrides.plannedStartDate || new Date();
        wo.plannedEndDate = overrides.plannedEndDate || new Date();
        wo.items = overrides.items || [];

        return Object.assign(wo, overrides);
    }

    static resetCounters() {
        this.woCounter = 0;
        this.itemCounter = 0;
    }
}
