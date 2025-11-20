import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { WorkflowRepositoryService } from './workflow-repository.service';
import {
  WorkflowType,
  WorkflowStatus,
  WorkflowTrigger,
  WorkflowStepDefinition,
} from '../entities/workflow-definition.entity';

@Injectable()
export class WorkflowSeederService implements OnModuleInit {
  private readonly logger = new Logger(WorkflowSeederService.name);

  constructor(
    private readonly workflowRepository: WorkflowRepositoryService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seedWorkflowDefinitions();
  }

  async seedWorkflowDefinitions(): Promise<void> {
    this.logger.log('Seeding workflow definitions...');

    const workflows = [
      this.getSalesToProductionWorkflow(),
      this.getProcurementToInventoryWorkflow(),
      this.getQualityInspectionWorkflow(),
      this.getOrderFulfillmentWorkflow(),
      this.getPurchaseRequisitionWorkflow(),
      this.getGoodsReceiptWorkflow(),
    ];

    for (const workflow of workflows) {
      try {
        const existing = await this.workflowRepository.getDefinitionByName(workflow.name);
        if (!existing) {
          await this.workflowRepository.createDefinition(workflow);
          this.logger.log(`Created workflow definition: ${workflow.name}`);
        } else {
          this.logger.log(`Workflow definition already exists: ${workflow.name}`);
        }
      } catch (error) {
        this.logger.error(`Failed to seed workflow ${workflow.name}: ${error.message}`);
      }
    }

    this.logger.log('Workflow definitions seeding completed');
  }

  private getSalesToProductionWorkflow(): any {
    return {
      name: 'Sales to Production',
      description: 'Automates the flow from RFP approval through production to shipment',
      type: WorkflowType.SALES_TO_PRODUCTION,
      status: WorkflowStatus.ACTIVE,
      version: 1,
      triggers: [
        {
          event: 'sales.rfp.approved',
          conditions: { status: 'approved' },
        },
        {
          event: 'sales.order.confirmed',
          conditions: { status: 'confirmed' },
        },
      ] as WorkflowTrigger[],
      steps: [
        {
          id: 'create-order',
          name: 'Create Sales Order from RFP',
          description: 'Automatically create a sales order when RFP is approved',
          actions: [
            {
              type: 'queue-job',
              config: {
                queue: 'workflow',
                job: 'create-order-from-rfp',
              },
              order: 1,
            },
            {
              type: 'notification',
              config: {
                team: 'sales',
                template: 'order-created',
              },
              order: 2,
            },
          ],
          nextSteps: ['check-materials'],
        },
        {
          id: 'check-materials',
          name: 'Check Material Availability',
          description: 'Verify materials are available for production',
          actions: [
            {
              type: 'queue-job',
              config: {
                queue: 'workflow',
                job: 'check-material-availability',
              },
              order: 1,
            },
          ],
          nextSteps: ['create-work-orders'],
          conditions: { orderConfirmed: true },
        },
        {
          id: 'create-work-orders',
          name: 'Create Work Orders',
          description: 'Generate work orders for each item in the sales order',
          actions: [
            {
              type: 'queue-job',
              config: {
                queue: 'workflow',
                job: 'create-work-orders-from-order',
              },
              order: 1,
            },
            {
              type: 'notification',
              config: {
                team: 'production',
                template: 'work-order-created',
              },
              order: 2,
            },
          ],
          nextSteps: ['reserve-materials'],
        },
        {
          id: 'reserve-materials',
          name: 'Reserve Materials',
          description: 'Reserve required materials for work orders',
          actions: [
            {
              type: 'queue-job',
              config: {
                queue: 'workflow',
                job: 'reserve-materials-for-work-order',
              },
              order: 1,
            },
          ],
          nextSteps: ['issue-materials'],
        },
        {
          id: 'issue-materials',
          name: 'Issue Materials',
          description: 'Issue materials to production floor',
          actions: [
            {
              type: 'queue-job',
              config: {
                queue: 'workflow',
                job: 'issue-materials-for-work-order',
              },
              order: 1,
            },
          ],
          nextSteps: ['receive-finished-goods'],
        },
        {
          id: 'receive-finished-goods',
          name: 'Receive Finished Goods',
          description: 'Receive completed products into inventory',
          actions: [
            {
              type: 'queue-job',
              config: {
                queue: 'workflow',
                job: 'receive-finished-goods',
              },
              order: 1,
            },
          ],
          nextSteps: ['create-inspection'],
        },
        {
          id: 'create-inspection',
          name: 'Create Quality Inspection',
          description: 'Request quality inspection for finished goods',
          actions: [
            {
              type: 'queue-job',
              config: {
                queue: 'workflow',
                job: 'create-production-inspection',
              },
              order: 1,
            },
            {
              type: 'notification',
              config: {
                team: 'quality',
                template: 'inspection-required',
              },
              order: 2,
            },
          ],
          nextSteps: ['check-completion'],
        },
        {
          id: 'check-completion',
          name: 'Check Order Completion',
          description: 'Verify if all work orders are completed',
          actions: [
            {
              type: 'queue-job',
              config: {
                queue: 'workflow',
                job: 'check-order-completion',
              },
              order: 1,
            },
          ],
          nextSteps: ['create-shipment'],
        },
        {
          id: 'create-shipment',
          name: 'Create Shipment',
          description: 'Create shipment for completed order',
          actions: [
            {
              type: 'queue-job',
              config: {
                queue: 'workflow',
                job: 'create-shipment-for-order',
              },
              order: 1,
            },
            {
              type: 'notification',
              config: {
                team: 'logistics',
                template: 'shipment-created',
              },
              order: 2,
            },
          ],
          nextSteps: ['create-invoice'],
        },
        {
          id: 'create-invoice',
          name: 'Create Invoice',
          description: 'Generate invoice for the order',
          actions: [
            {
              type: 'queue-job',
              config: {
                queue: 'workflow',
                job: 'create-invoice-for-order',
              },
              order: 1,
            },
            {
              type: 'notification',
              config: {
                team: 'finance',
                template: 'invoice-created',
              },
              order: 2,
            },
          ],
          nextSteps: [],
        },
      ] as WorkflowStepDefinition[],
      metadata: {
        estimatedDuration: '3-7 days',
        category: 'Order Processing',
        department: 'Sales',
      },
      createdBy: 'system',
    };
  }

  private getProcurementToInventoryWorkflow(): any {
    return {
      name: 'Procurement to Inventory',
      description: 'Automates the flow from stock shortage to inventory replenishment',
      type: WorkflowType.PROCUREMENT_TO_INVENTORY,
      status: WorkflowStatus.ACTIVE,
      version: 1,
      triggers: [
        {
          event: 'inventory.stock.low',
          conditions: { belowReorderLevel: true },
        },
        {
          event: 'inventory.stock.out',
          conditions: { quantity: 0 },
        },
        {
          event: 'procurement.goods.received',
          conditions: {},
        },
      ] as WorkflowTrigger[],
      steps: [
        {
          id: 'create-purchase-request',
          name: 'Create Purchase Request',
          description: 'Automatically create purchase request for low stock items',
          actions: [
            {
              type: 'queue-job',
              config: {
                queue: 'workflow',
                job: 'create-purchase-request-for-reorder',
              },
              order: 1,
            },
            {
              type: 'notification',
              config: {
                team: 'procurement',
                template: 'purchase-request-created',
              },
              order: 2,
            },
          ],
          nextSteps: ['check-affected-work-orders'],
        },
        {
          id: 'check-affected-work-orders',
          name: 'Check Affected Work Orders',
          description: 'Identify work orders waiting for this material',
          actions: [
            {
              type: 'queue-job',
              config: {
                queue: 'workflow',
                job: 'check-affected-work-orders',
              },
              order: 1,
            },
          ],
          nextSteps: ['expedite-orders'],
          conditions: { stockOut: true },
        },
        {
          id: 'expedite-orders',
          name: 'Expedite Pending Orders',
          description: 'Flag pending POs as urgent for stock-out items',
          actions: [
            {
              type: 'queue-job',
              config: {
                queue: 'workflow',
                job: 'expedite-pending-purchase-orders',
              },
              order: 1,
            },
            {
              type: 'notification',
              config: {
                team: 'procurement',
                priority: 'high',
                template: 'urgent-reorder',
              },
              order: 2,
            },
          ],
          nextSteps: [],
        },
        {
          id: 'send-to-vendor',
          name: 'Send PO to Vendor',
          description: 'Transmit purchase order to vendor',
          actions: [
            {
              type: 'queue-job',
              config: {
                queue: 'workflow',
                job: 'send-purchase-order-to-vendor',
              },
              order: 1,
            },
          ],
          nextSteps: ['schedule-tracking'],
        },
        {
          id: 'schedule-tracking',
          name: 'Schedule Delivery Tracking',
          description: 'Set up reminders for delivery follow-up',
          actions: [
            {
              type: 'queue-job',
              config: {
                queue: 'workflow',
                job: 'schedule-po-delivery-tracking',
              },
              order: 1,
            },
          ],
          nextSteps: [],
        },
        {
          id: 'update-inventory',
          name: 'Update Inventory',
          description: 'Update stock balances from goods receipt',
          actions: [
            {
              type: 'queue-job',
              config: {
                queue: 'workflow',
                job: 'update-inventory-from-receipt',
              },
              order: 1,
            },
          ],
          nextSteps: ['create-grn-inspection'],
        },
        {
          id: 'create-grn-inspection',
          name: 'Create GRN Inspection',
          description: 'Request quality inspection for received goods',
          actions: [
            {
              type: 'queue-job',
              config: {
                queue: 'workflow',
                job: 'create-goods-receipt-inspection',
              },
              order: 1,
            },
            {
              type: 'notification',
              config: {
                team: 'quality',
                template: 'grn-inspection-required',
              },
              order: 2,
            },
          ],
          nextSteps: ['check-po-completion'],
        },
        {
          id: 'check-po-completion',
          name: 'Check PO Completion',
          description: 'Verify if purchase order is fully received',
          actions: [
            {
              type: 'queue-job',
              config: {
                queue: 'workflow',
                job: 'check-purchase-order-completion',
              },
              order: 1,
            },
          ],
          nextSteps: ['release-reservations'],
        },
        {
          id: 'release-reservations',
          name: 'Release Waiting Reservations',
          description: 'Fulfill pending material reservations',
          actions: [
            {
              type: 'queue-job',
              config: {
                queue: 'workflow',
                job: 'release-waiting-reservations',
              },
              order: 1,
            },
            {
              type: 'notification',
              config: {
                team: 'production',
                template: 'materials-available',
              },
              order: 2,
            },
          ],
          nextSteps: [],
        },
      ] as WorkflowStepDefinition[],
      metadata: {
        estimatedDuration: '5-14 days',
        category: 'Procurement',
        department: 'Procurement',
      },
      createdBy: 'system',
    };
  }

  private getQualityInspectionWorkflow(): any {
    return {
      name: 'Quality Inspection',
      description: 'Handles quality inspection results and subsequent actions',
      type: WorkflowType.QUALITY_INSPECTION,
      status: WorkflowStatus.ACTIVE,
      version: 1,
      triggers: [
        {
          event: 'quality.inspection.passed',
          conditions: { result: 'passed' },
        },
        {
          event: 'quality.inspection.failed',
          conditions: { result: 'failed' },
        },
      ] as WorkflowTrigger[],
      steps: [
        {
          id: 'release-inventory',
          name: 'Release Inspected Inventory',
          description: 'Release approved inventory for use',
          actions: [
            {
              type: 'queue-job',
              config: {
                queue: 'workflow',
                job: 'release-inspected-inventory',
              },
              order: 1,
            },
            {
              type: 'notification',
              config: {
                team: 'inventory',
                template: 'inventory-released',
              },
              order: 2,
            },
          ],
          nextSteps: [],
          conditions: { inspectionPassed: true },
        },
        {
          id: 'quarantine-failed',
          name: 'Quarantine Failed Items',
          description: 'Move failed items to quarantine location',
          actions: [
            {
              type: 'queue-job',
              config: {
                queue: 'workflow',
                job: 'quarantine-failed-inspection',
              },
              order: 1,
            },
          ],
          nextSteps: ['create-ncr'],
          conditions: { inspectionFailed: true },
        },
        {
          id: 'create-ncr',
          name: 'Create Non-Conformance Report',
          description: 'Generate NCR for failed inspection',
          actions: [
            {
              type: 'queue-job',
              config: {
                queue: 'workflow',
                job: 'create-ncr-from-inspection',
              },
              order: 1,
            },
            {
              type: 'notification',
              config: {
                team: 'quality',
                priority: 'high',
                template: 'ncr-created',
              },
              order: 2,
            },
          ],
          nextSteps: ['notify-vendor'],
          conditions: { sourceType: 'goods_receipt' },
        },
        {
          id: 'notify-vendor',
          name: 'Notify Vendor',
          description: 'Send quality issue notification to vendor',
          actions: [
            {
              type: 'notification',
              config: {
                recipient: 'vendor',
                template: 'quality-issue',
              },
              order: 1,
            },
          ],
          nextSteps: [],
        },
      ] as WorkflowStepDefinition[],
      metadata: {
        estimatedDuration: '1-3 days',
        category: 'Quality',
        department: 'Quality',
      },
      createdBy: 'system',
    };
  }

  private getOrderFulfillmentWorkflow(): any {
    return {
      name: 'Order Fulfillment',
      description: 'Tracks order from confirmation to delivery',
      type: WorkflowType.ORDER_FULFILLMENT,
      status: WorkflowStatus.ACTIVE,
      version: 1,
      triggers: [
        {
          event: 'sales.order.confirmed',
          conditions: {},
        },
      ] as WorkflowTrigger[],
      steps: [
        {
          id: 'confirm-order',
          name: 'Confirm Order',
          description: 'Validate and confirm sales order',
          actions: [
            {
              type: 'validation',
              config: {
                rules: ['check-credit', 'check-inventory'],
              },
              order: 1,
            },
            {
              type: 'notification',
              config: {
                recipient: 'customer',
                template: 'order-confirmation',
              },
              order: 2,
            },
          ],
          nextSteps: ['allocate-inventory'],
        },
        {
          id: 'allocate-inventory',
          name: 'Allocate Inventory',
          description: 'Reserve inventory for the order',
          actions: [
            {
              type: 'queue-job',
              config: {
                queue: 'workflow',
                job: 'reserve-materials-for-work-order',
              },
              order: 1,
            },
          ],
          nextSteps: ['pick-pack'],
        },
        {
          id: 'pick-pack',
          name: 'Pick and Pack',
          description: 'Generate pick list and pack items',
          actions: [
            {
              type: 'notification',
              config: {
                team: 'warehouse',
                template: 'pick-list',
              },
              order: 1,
            },
          ],
          nextSteps: ['ship-order'],
        },
        {
          id: 'ship-order',
          name: 'Ship Order',
          description: 'Create shipment and generate shipping documents',
          actions: [
            {
              type: 'queue-job',
              config: {
                queue: 'workflow',
                job: 'create-shipment-for-order',
              },
              order: 1,
            },
            {
              type: 'notification',
              config: {
                recipient: 'customer',
                template: 'shipment-notification',
              },
              order: 2,
            },
          ],
          nextSteps: ['invoice-order'],
        },
        {
          id: 'invoice-order',
          name: 'Invoice Order',
          description: 'Generate and send invoice',
          actions: [
            {
              type: 'queue-job',
              config: {
                queue: 'workflow',
                job: 'create-invoice-for-order',
              },
              order: 1,
            },
          ],
          nextSteps: [],
        },
      ] as WorkflowStepDefinition[],
      metadata: {
        estimatedDuration: '1-5 days',
        category: 'Order Processing',
        department: 'Sales',
      },
      createdBy: 'system',
    };
  }

  private getPurchaseRequisitionWorkflow(): any {
    return {
      name: 'Purchase Requisition',
      description: 'Handles purchase requisition approval and PO creation',
      type: WorkflowType.PURCHASE_REQUISITION,
      status: WorkflowStatus.ACTIVE,
      version: 1,
      triggers: [
        {
          event: 'procurement.requisition.created',
          conditions: {},
        },
        {
          event: 'procurement.requisition.approved',
          conditions: { status: 'approved' },
        },
      ] as WorkflowTrigger[],
      steps: [
        {
          id: 'submit-approval',
          name: 'Submit for Approval',
          description: 'Route PR for approval based on amount',
          actions: [
            {
              type: 'approval',
              config: {
                rules: [
                  { maxAmount: 1000, approver: 'supervisor' },
                  { maxAmount: 10000, approver: 'manager' },
                  { maxAmount: 100000, approver: 'director' },
                ],
              },
              order: 1,
            },
            {
              type: 'notification',
              config: {
                recipient: 'approver',
                template: 'pr-approval-request',
              },
              order: 2,
            },
          ],
          nextSteps: ['create-rfq'],
        },
        {
          id: 'create-rfq',
          name: 'Create RFQ',
          description: 'Generate Request for Quotation',
          actions: [
            {
              type: 'notification',
              config: {
                team: 'procurement',
                template: 'create-rfq',
              },
              order: 1,
            },
          ],
          nextSteps: ['evaluate-quotes'],
          conditions: { requiresQuotes: true },
        },
        {
          id: 'evaluate-quotes',
          name: 'Evaluate Quotes',
          description: 'Compare and select best vendor',
          actions: [
            {
              type: 'notification',
              config: {
                team: 'procurement',
                template: 'evaluate-quotes',
              },
              order: 1,
            },
          ],
          nextSteps: ['create-po'],
        },
        {
          id: 'create-po',
          name: 'Create Purchase Order',
          description: 'Generate PO from approved PR',
          actions: [
            {
              type: 'queue-job',
              config: {
                queue: 'workflow',
                job: 'send-purchase-order-to-vendor',
              },
              order: 1,
            },
            {
              type: 'notification',
              config: {
                team: 'procurement',
                template: 'po-created',
              },
              order: 2,
            },
          ],
          nextSteps: [],
        },
      ] as WorkflowStepDefinition[],
      metadata: {
        estimatedDuration: '2-7 days',
        category: 'Procurement',
        department: 'Procurement',
      },
      createdBy: 'system',
    };
  }

  private getGoodsReceiptWorkflow(): any {
    return {
      name: 'Goods Receipt',
      description: 'Processes goods receipt and updates inventory',
      type: WorkflowType.GOODS_RECEIPT,
      status: WorkflowStatus.ACTIVE,
      version: 1,
      triggers: [
        {
          event: 'procurement.goods.received',
          conditions: {},
        },
      ] as WorkflowTrigger[],
      steps: [
        {
          id: 'receive-goods',
          name: 'Receive Goods',
          description: 'Record goods receipt against PO',
          actions: [
            {
              type: 'queue-job',
              config: {
                queue: 'workflow',
                job: 'update-inventory-from-receipt',
              },
              order: 1,
            },
          ],
          nextSteps: ['quality-check'],
        },
        {
          id: 'quality-check',
          name: 'Quality Check',
          description: 'Perform incoming quality inspection',
          actions: [
            {
              type: 'queue-job',
              config: {
                queue: 'workflow',
                job: 'create-goods-receipt-inspection',
              },
              order: 1,
            },
          ],
          nextSteps: ['put-away'],
        },
        {
          id: 'put-away',
          name: 'Put Away',
          description: 'Move goods to storage location',
          actions: [
            {
              type: 'notification',
              config: {
                team: 'warehouse',
                template: 'put-away-required',
              },
              order: 1,
            },
          ],
          nextSteps: ['update-po-status'],
        },
        {
          id: 'update-po-status',
          name: 'Update PO Status',
          description: 'Check and update PO completion status',
          actions: [
            {
              type: 'queue-job',
              config: {
                queue: 'workflow',
                job: 'check-purchase-order-completion',
              },
              order: 1,
            },
          ],
          nextSteps: ['create-voucher'],
        },
        {
          id: 'create-voucher',
          name: 'Create Payment Voucher',
          description: 'Generate AP voucher for payment',
          actions: [
            {
              type: 'notification',
              config: {
                team: 'finance',
                template: 'ap-voucher-required',
              },
              order: 1,
            },
          ],
          nextSteps: [],
        },
      ] as WorkflowStepDefinition[],
      metadata: {
        estimatedDuration: '1-2 days',
        category: 'Procurement',
        department: 'Warehouse',
      },
      createdBy: 'system',
    };
  }
}
