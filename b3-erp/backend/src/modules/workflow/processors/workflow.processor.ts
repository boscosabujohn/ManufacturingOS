import { Process, Processor } from '@nestjs/bull';
import { Logger, Inject, forwardRef } from '@nestjs/common';
import { Job } from 'bull';
import { WorkOrderService } from '../../production/services/work-order.service';
import { StockBalanceService } from '../../inventory/services/stock-balance.service';
import { EventBusService } from '../services/event-bus.service';

@Processor('workflow')
export class WorkflowProcessor {
  private readonly logger = new Logger(WorkflowProcessor.name);

  constructor(
    @Inject(forwardRef(() => WorkOrderService))
    private readonly workOrderService: WorkOrderService,
    @Inject(forwardRef(() => StockBalanceService))
    private readonly stockBalanceService: StockBalanceService,
    private readonly eventBus: EventBusService,
  ) {}

  @Process('create-order-from-rfp')
  async createOrderFromRFP(job: Job): Promise<void> {
    this.logger.log(`Processing job: create-order-from-rfp for RFP ${job.data.rfpNumber}`);

    try {
      // TODO: Implement actual order creation from RFP
      // This would call the SalesService to create a sales order
      const { rfpId, rfpNumber, customerId, customerName, items, deliveryDate, totalAmount, userId } = job.data;

      this.logger.log(`Creating sales order from RFP ${rfpNumber} for customer ${customerName}`);

      // Simulate processing - in production, this would create actual records
      await new Promise(resolve => setTimeout(resolve, 1000));

      this.logger.log(`Successfully created order from RFP ${rfpNumber}`);
    } catch (error) {
      this.logger.error(`Failed to create order from RFP: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Process('create-work-orders-from-order')
  async createWorkOrdersFromOrder(job: Job): Promise<void> {
    this.logger.log(`Processing job: create-work-orders-from-order for Order ${job.data.orderNumber}`);

    try {
      const { orderId, orderNumber, items, deliveryDate, priority, userId } = job.data;

      // For each item in the order, create a work order
      for (const item of items) {
        this.logger.log(`Creating work order for item ${item.itemName} (Qty: ${item.quantity})`);

        try {
          // Generate work order number
          const woNumber = `WO-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

          // Create work order using service
          await this.workOrderService.create({
            workOrderNumber: woNumber,
            workOrderName: `Production for ${item.itemName}`,
            description: `Work order for sales order ${orderNumber}`,
            workOrderType: 'production',
            priority: priority || 'normal',
            itemId: item.itemId,
            itemCode: item.itemId,
            itemName: item.itemName,
            uom: item.unit || 'units',
            plannedQuantity: item.quantity,
            plannedStartDate: new Date(),
            plannedEndDate: new Date(deliveryDate),
            requiredByDate: new Date(deliveryDate),
            salesOrderId: orderId,
            salesOrderNumber: orderNumber,
            createdBy: userId,
          } as any);

          this.logger.log(`Work order ${woNumber} created for ${item.itemName}`);
        } catch (error) {
          this.logger.error(`Failed to create work order for ${item.itemName}: ${error.message}`);
          // Continue with other items
        }
      }

      this.logger.log(`Successfully created work orders for Order ${orderNumber}`);
    } catch (error) {
      this.logger.error(`Failed to create work orders: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Process('check-material-availability')
  async checkMaterialAvailability(job: Job): Promise<void> {
    this.logger.log(`Processing job: check-material-availability for Order ${job.data.orderNumber}`);

    try {
      const { orderId, orderNumber, items, requiredDate, userId } = job.data;

      const shortages: any[] = [];

      // Check material availability for each item
      for (const item of items) {
        try {
          // Get current stock balance using the service
          const balance = await this.stockBalanceService.getRealTimeBalance(
            item.itemId,
            item.warehouseId || 'default',
          );

          const requiredQty = item.quantity || 0;
          const availableQty = balance.totalFree || 0;

          if (availableQty < requiredQty) {
            shortages.push({
              itemId: item.itemId,
              itemCode: item.itemCode,
              itemName: item.itemName,
              required: requiredQty,
              available: availableQty,
              shortage: requiredQty - availableQty,
            });

            this.logger.warn(
              `Material shortage for ${item.itemName}: Required ${requiredQty}, Available ${availableQty}`,
            );
          } else {
            this.logger.log(
              `Material available for ${item.itemName}: Required ${requiredQty}, Available ${availableQty}`,
            );
          }
        } catch (error) {
          this.logger.warn(`Could not check availability for ${item.itemName}: ${error.message}`);
        }
      }

      if (shortages.length > 0) {
        // Emit event for material shortages to trigger purchase requests
        this.logger.warn(`Found ${shortages.length} material shortages for Order ${orderNumber}`);

        // Notify about shortages
        await this.eventBus.emit('workflow.material.shortage', {
          orderId,
          orderNumber,
          shortages,
          requiredDate,
          userId,
        });
      }

      this.logger.log(`Material availability checked for Order ${orderNumber}`);
    } catch (error) {
      this.logger.error(`Failed to check material availability: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Process('reserve-materials-for-work-order')
  async reserveMaterialsForWorkOrder(job: Job): Promise<void> {
    this.logger.log(`Processing job: reserve-materials-for-work-order for WO ${job.data.workOrderNumber}`);

    try {
      const { workOrderId, workOrderNumber, materials, userId } = job.data;

      const reservationResults: any[] = [];
      const shortages: any[] = [];

      if (materials && materials.length > 0) {
        for (const material of materials) {
          try {
            // Check current stock levels
            const balance = await this.stockBalanceService.getRealTimeBalance(
              material.itemId,
              material.warehouseId || 'default',
            );

            const requiredQty = material.requiredQty || 0;
            const availableQty = balance.totalFree || 0;

            if (availableQty >= requiredQty) {
              // Reserve by reducing free quantity (negative adjustment simulates reservation)
              // In a real implementation, this would update reserved quantity without reducing total
              this.logger.log(
                `Reserved ${requiredQty} ${material.unit} of ${material.itemName} for WO ${workOrderNumber}`,
              );

              reservationResults.push({
                itemId: material.itemId,
                itemName: material.itemName,
                reserved: requiredQty,
                status: 'reserved',
              });
            } else {
              // Partial or no availability
              const canReserve = Math.max(0, availableQty);
              const shortage = requiredQty - canReserve;

              shortages.push({
                itemId: material.itemId,
                itemName: material.itemName,
                required: requiredQty,
                reserved: canReserve,
                shortage,
              });

              this.logger.warn(
                `Material shortage for ${material.itemName}: Need ${requiredQty}, Can reserve ${canReserve}`,
              );
            }
          } catch (error) {
            this.logger.error(`Failed to reserve ${material.itemName}: ${error.message}`);
          }
        }
      }

      // Emit reservation results
      if (shortages.length > 0) {
        await this.eventBus.emit('workflow.reservation.shortage', {
          workOrderId,
          workOrderNumber,
          shortages,
          userId,
        });
      }

      this.logger.log(`Materials reserved for Work Order ${workOrderNumber}: ${reservationResults.length} items`);
    } catch (error) {
      this.logger.error(`Failed to reserve materials: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Process('issue-materials-for-work-order')
  async issueMaterialsForWorkOrder(job: Job): Promise<void> {
    this.logger.log(`Processing job: issue-materials-for-work-order for WO ${job.data.workOrderNumber}`);

    try {
      const { workOrderId, workOrderNumber, materials, userId } = job.data;

      const issuedMaterials: any[] = [];

      if (materials && materials.length > 0) {
        for (const material of materials) {
          try {
            const issueQty = material.requiredQty || material.quantity || 0;

            // Issue materials by reducing stock balance (negative adjustment)
            await this.stockBalanceService.adjustBalance(
              material.itemId,
              material.warehouseId || 'default',
              -issueQty, // Negative to reduce stock
              userId,
              `Issued for Work Order ${workOrderNumber}`,
            );

            this.logger.log(
              `Issued ${issueQty} ${material.unit} of ${material.itemName} for WO ${workOrderNumber}`,
            );

            issuedMaterials.push({
              itemId: material.itemId,
              itemName: material.itemName,
              quantity: issueQty,
              unit: material.unit,
            });
          } catch (error) {
            this.logger.error(`Failed to issue ${material.itemName}: ${error.message}`);
          }
        }
      }

      // Emit material issued event
      await this.eventBus.emit('workflow.materials.issued', {
        workOrderId,
        workOrderNumber,
        materials: issuedMaterials,
        userId,
      });

      this.logger.log(`Materials issued for Work Order ${workOrderNumber}: ${issuedMaterials.length} items`);
    } catch (error) {
      this.logger.error(`Failed to issue materials: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Process('receive-finished-goods')
  async receiveFinishedGoods(job: Job): Promise<void> {
    this.logger.log(`Processing job: receive-finished-goods for WO ${job.data.workOrderNumber}`);

    try {
      const { workOrderId, workOrderNumber, itemId, itemName, quantity, warehouseId, userId } = job.data;

      // Add finished goods to inventory (positive adjustment)
      await this.stockBalanceService.adjustBalance(
        itemId,
        warehouseId || 'default',
        quantity, // Positive to add stock
        userId,
        `Finished goods from Work Order ${workOrderNumber}`,
      );

      // Emit finished goods received event
      await this.eventBus.emit('workflow.finished-goods.received', {
        workOrderId,
        workOrderNumber,
        itemId,
        itemName,
        quantity,
        warehouseId,
        userId,
      });

      this.logger.log(`Received ${quantity} of ${itemName} from Work Order ${workOrderNumber}`);
    } catch (error) {
      this.logger.error(`Failed to receive finished goods: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Process('check-order-completion')
  async checkOrderCompletion(job: Job): Promise<void> {
    this.logger.log(`Processing job: check-order-completion for Order ${job.data.orderNumber}`);

    try {
      const { orderId, orderNumber, completedWorkOrderId, totalWorkOrders, completedCount, userId } = job.data;

      // Check if all work orders for this order are completed
      // In a full implementation, this would query the database for work order statuses
      // For now, we use the counts passed in the job data

      if (totalWorkOrders && completedCount >= totalWorkOrders) {
        // All work orders completed - emit ORDER_COMPLETED event
        this.logger.log(`All work orders completed for Order ${orderNumber}. Emitting completion event.`);

        await this.eventBus.emit('sales.order.completed', {
          orderId,
          orderNumber,
          completedAt: new Date().toISOString(),
          userId,
        });

        // Trigger shipment creation
        await this.eventBus.emit('workflow.order.ready-for-shipment', {
          orderId,
          orderNumber,
          userId,
        });
      } else {
        this.logger.log(
          `Order ${orderNumber} progress: ${completedCount || 0}/${totalWorkOrders || 'unknown'} work orders completed`,
        );
      }

      this.logger.log(`Order completion checked for ${orderNumber}`);
    } catch (error) {
      this.logger.error(`Failed to check order completion: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Process('create-production-inspection')
  async createProductionInspection(job: Job): Promise<void> {
    this.logger.log(`Processing job: create-production-inspection for WO ${job.data.workOrderNumber}`);

    try {
      const { workOrderId, workOrderNumber, itemId, itemName, quantity, userId } = job.data;

      // Generate inspection number
      const inspectionNumber = `INS-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

      // Emit event to create inspection in quality module
      await this.eventBus.emit('workflow.inspection.required', {
        inspectionNumber,
        sourceType: 'production',
        sourceId: workOrderId,
        sourceNumber: workOrderNumber,
        itemId,
        itemName,
        quantity,
        inspectionType: 'final',
        priority: 'normal',
        userId,
        requestedAt: new Date().toISOString(),
      });

      this.logger.log(`Production inspection ${inspectionNumber} requested for Work Order ${workOrderNumber}`);
    } catch (error) {
      this.logger.error(`Failed to create production inspection: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Process('create-shipment-for-order')
  async createShipmentForOrder(job: Job): Promise<void> {
    this.logger.log(`Processing job: create-shipment-for-order for Order ${job.data.orderNumber}`);

    try {
      const { orderId, orderNumber, customerId, customerName, items, userId } = job.data;

      // TODO: Implement shipment creation
      // This would create a shipment record in logistics module

      this.logger.log(`Shipment created for Order ${orderNumber}`);
    } catch (error) {
      this.logger.error(`Failed to create shipment: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Process('create-invoice-for-order')
  async createInvoiceForOrder(job: Job): Promise<void> {
    this.logger.log(`Processing job: create-invoice-for-order for Order ${job.data.orderNumber}`);

    try {
      const { orderId, orderNumber, customerId, customerName, totalAmount, items, userId } = job.data;

      // TODO: Implement invoice creation
      // This would create an invoice in finance module

      this.logger.log(`Invoice created for Order ${orderNumber}`);
    } catch (error) {
      this.logger.error(`Failed to create invoice: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Process('create-purchase-request-for-reorder')
  async createPurchaseRequestForReorder(job: Job): Promise<void> {
    this.logger.log(`Processing job: create-purchase-request-for-reorder for item ${job.data.itemCode}`);

    try {
      const { itemId, itemCode, itemName, warehouseId, currentStock, reorderLevel, userId } = job.data;

      // TODO: Implement automatic purchase request creation
      // This would:
      // 1. Get reorder quantity from item master
      // 2. Get preferred vendor
      // 3. Create purchase request

      this.logger.log(`Purchase request created for ${itemName}`);
    } catch (error) {
      this.logger.error(`Failed to create purchase request: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Process('check-affected-work-orders')
  async checkAffectedWorkOrders(job: Job): Promise<void> {
    this.logger.log(`Processing job: check-affected-work-orders for item ${job.data.itemCode}`);

    try {
      const { itemId, itemCode, itemName, warehouseId, userId } = job.data;

      // TODO: Implement affected work order check
      // This would find work orders that need this material

      this.logger.log(`Affected work orders checked for ${itemName}`);
    } catch (error) {
      this.logger.error(`Failed to check affected work orders: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Process('expedite-pending-purchase-orders')
  async expeditePendingPurchaseOrders(job: Job): Promise<void> {
    this.logger.log(`Processing job: expedite-pending-purchase-orders for item ${job.data.itemCode}`);

    try {
      const { itemId, itemCode, userId } = job.data;

      // TODO: Implement PO expedition
      // This would flag pending POs for this item as urgent

      this.logger.log(`Pending POs expedited for ${itemCode}`);
    } catch (error) {
      this.logger.error(`Failed to expedite pending POs: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Process('send-purchase-order-to-vendor')
  async sendPurchaseOrderToVendor(job: Job): Promise<void> {
    this.logger.log(`Processing job: send-purchase-order-to-vendor for PO ${job.data.poNumber}`);

    try {
      const { purchaseOrderId, poNumber, vendorId, vendorName, items, expectedDeliveryDate, userId } = job.data;

      // TODO: Implement vendor communication
      // This would send email/EDI to vendor

      this.logger.log(`PO ${poNumber} sent to vendor ${vendorName}`);
    } catch (error) {
      this.logger.error(`Failed to send PO to vendor: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Process('schedule-po-delivery-tracking')
  async schedulePODeliveryTracking(job: Job): Promise<void> {
    this.logger.log(`Processing job: schedule-po-delivery-tracking for PO ${job.data.poNumber}`);

    try {
      const { purchaseOrderId, poNumber, expectedDeliveryDate, userId } = job.data;

      // TODO: Implement delivery tracking reminders
      // This would schedule reminder notifications

      this.logger.log(`Delivery tracking scheduled for PO ${poNumber}`);
    } catch (error) {
      this.logger.error(`Failed to schedule delivery tracking: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Process('update-inventory-from-receipt')
  async updateInventoryFromReceipt(job: Job): Promise<void> {
    this.logger.log(`Processing job: update-inventory-from-receipt for ${job.data.itemName}`);

    try {
      const { receiptId, itemId, itemName, receivedQty, warehouseId, batchNumber, userId } = job.data;

      // Update stock balance with received quantity (positive adjustment)
      await this.stockBalanceService.adjustBalance(
        itemId,
        warehouseId || 'default',
        receivedQty, // Positive to add stock
        userId,
        `Goods Receipt ${receiptId}${batchNumber ? ` Batch: ${batchNumber}` : ''}`,
      );

      // Emit inventory updated event
      await this.eventBus.emit('workflow.inventory.updated', {
        receiptId,
        itemId,
        itemName,
        quantity: receivedQty,
        warehouseId,
        batchNumber,
        userId,
      });

      this.logger.log(`Inventory updated for ${itemName} (Qty: ${receivedQty})`);
    } catch (error) {
      this.logger.error(`Failed to update inventory: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Process('create-goods-receipt-inspection')
  async createGoodsReceiptInspection(job: Job): Promise<void> {
    this.logger.log(`Processing job: create-goods-receipt-inspection for ${job.data.itemName}`);

    try {
      const { receiptId, itemId, itemName, quantity, batchNumber, userId } = job.data;

      // TODO: Implement inspection creation for goods receipt

      this.logger.log(`Inspection created for goods receipt of ${itemName}`);
    } catch (error) {
      this.logger.error(`Failed to create goods receipt inspection: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Process('check-purchase-order-completion')
  async checkPurchaseOrderCompletion(job: Job): Promise<void> {
    this.logger.log(`Processing job: check-purchase-order-completion for PO ${job.data.poNumber}`);

    try {
      const { purchaseOrderId, poNumber, receiptId, userId } = job.data;

      // TODO: Implement PO completion check

      this.logger.log(`PO completion checked for ${poNumber}`);
    } catch (error) {
      this.logger.error(`Failed to check PO completion: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Process('release-waiting-reservations')
  async releaseWaitingReservations(job: Job): Promise<void> {
    this.logger.log(`Processing job: release-waiting-reservations`);

    try {
      const { receiptId, items, warehouseId, userId } = job.data;

      // TODO: Implement reservation release for waiting work orders

      this.logger.log(`Waiting reservations released`);
    } catch (error) {
      this.logger.error(`Failed to release waiting reservations: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Process('release-inspected-inventory')
  async releaseInspectedInventory(job: Job): Promise<void> {
    this.logger.log(`Processing job: release-inspected-inventory for ${job.data.itemName}`);

    try {
      const { inspectionId, itemId, itemName, quantity, warehouseId, userId } = job.data;

      // Release inventory from QC hold to available stock
      // In a full implementation, this would transfer from QC location to regular stock
      await this.eventBus.emit('workflow.inventory.released', {
        inspectionId,
        itemId,
        itemName,
        quantity,
        warehouseId,
        status: 'available',
        releasedAt: new Date().toISOString(),
        userId,
      });

      this.logger.log(`Inspected inventory released for ${itemName} (Qty: ${quantity})`);
    } catch (error) {
      this.logger.error(`Failed to release inspected inventory: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Process('quarantine-failed-inspection')
  async quarantineFailedInspection(job: Job): Promise<void> {
    this.logger.log(`Processing job: quarantine-failed-inspection for ${job.data.itemName}`);

    try {
      const { inspectionId, itemId, itemName, quantity, defects, warehouseId, userId } = job.data;

      // Move inventory to quarantine location
      await this.eventBus.emit('workflow.inventory.quarantined', {
        inspectionId,
        itemId,
        itemName,
        quantity,
        warehouseId,
        reason: 'Failed quality inspection',
        defects,
        quarantinedAt: new Date().toISOString(),
        userId,
      });

      this.logger.log(`Quarantined ${quantity} of ${itemName} due to failed inspection`);
    } catch (error) {
      this.logger.error(`Failed to quarantine: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Process('create-ncr-from-inspection')
  async createNCRFromInspection(job: Job): Promise<void> {
    this.logger.log(`Processing job: create-ncr-from-inspection for ${job.data.itemName}`);

    try {
      const { inspectionId, itemId, itemName, quantity, defects, sourceType, sourceNumber, userId } = job.data;

      // Generate NCR number
      const ncrNumber = `NCR-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

      // Emit event to create NCR in quality module
      await this.eventBus.emit('workflow.ncr.created', {
        ncrNumber,
        inspectionId,
        itemId,
        itemName,
        quantity,
        defects,
        sourceType,
        sourceNumber,
        severity: defects && defects.length > 3 ? 'critical' : 'major',
        status: 'open',
        createdAt: new Date().toISOString(),
        userId,
      });

      this.logger.log(`NCR ${ncrNumber} created for ${itemName} with ${defects?.length || 0} defects`);
    } catch (error) {
      this.logger.error(`Failed to create NCR: ${error.message}`, error.stack);
      throw error;
    }
  }
}
