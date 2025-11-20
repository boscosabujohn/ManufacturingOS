import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum OrderTrackingStatus {
  ORDER_PLACED = 'order_placed',
  ORDER_CONFIRMED = 'order_confirmed',
  PRODUCTION_PLANNING = 'production_planning',
  MATERIAL_PROCUREMENT = 'material_procurement',
  IN_PRODUCTION = 'in_production',
  QUALITY_CHECK = 'quality_check',
  READY_FOR_DISPATCH = 'ready_for_dispatch',
  DISPATCHED = 'dispatched',
  IN_TRANSIT = 'in_transit',
  DELIVERED = 'delivered',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  ON_HOLD = 'on_hold',
}

export interface OrderTrackingEvent {
  status: OrderTrackingStatus;
  timestamp: Date;
  description: string;
  userId: string;
  metadata?: Record<string, any>;
}

export interface WorkOrderInfo {
  workOrderId: string;
  workOrderNumber: string;
  itemName: string;
  quantity: number;
  status: string;
  plannedStartDate?: Date;
  plannedEndDate?: Date;
  actualStartDate?: Date;
  actualEndDate?: Date;
}

export interface ShipmentInfo {
  shipmentId: string;
  shipmentNumber: string;
  carrier?: string;
  trackingNumber?: string;
  status: string;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  dispatchDate?: Date;
}

export interface InvoiceInfo {
  invoiceId: string;
  invoiceNumber: string;
  amount: number;
  dueDate: Date;
  status: string;
  paidDate?: Date;
}

export interface PaymentInfo {
  paymentId: string;
  paymentNumber: string;
  amount: number;
  paymentDate: Date;
  paymentMethod: string;
}

@Entity('order_tracking')
@Index(['orderId'])
@Index(['orderNumber'])
@Index(['customerId'])
@Index(['status'])
export class OrderTracking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'order_id', unique: true })
  orderId: string;

  @Column({ name: 'order_number', unique: true })
  orderNumber: string;

  @Column({ name: 'customer_id' })
  customerId: string;

  @Column({ name: 'customer_name' })
  customerName: string;

  @Column({
    type: 'enum',
    enum: OrderTrackingStatus,
    default: OrderTrackingStatus.ORDER_PLACED,
  })
  status: OrderTrackingStatus;

  @Column({ name: 'total_amount', type: 'decimal', precision: 15, scale: 2 })
  totalAmount: number;

  @Column({ name: 'item_count', type: 'int' })
  itemCount: number;

  @Column({ name: 'expected_delivery_date', type: 'timestamp', nullable: true })
  expectedDeliveryDate: Date;

  @Column({ name: 'actual_delivery_date', type: 'timestamp', nullable: true })
  actualDeliveryDate: Date;

  @Column({ name: 'completed_date', type: 'timestamp', nullable: true })
  completedDate: Date;

  @Column({ type: 'jsonb', default: [] })
  events: OrderTrackingEvent[];

  @Column({ name: 'work_orders', type: 'jsonb', default: [] })
  workOrders: WorkOrderInfo[];

  @Column({ type: 'jsonb', default: [] })
  shipments: ShipmentInfo[];

  @Column({ type: 'jsonb', default: [] })
  invoices: InvoiceInfo[];

  @Column({ type: 'jsonb', default: [] })
  payments: PaymentInfo[];

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Helper methods
  getLatestEvent(): OrderTrackingEvent | null {
    if (!this.events || this.events.length === 0) return null;
    return this.events[this.events.length - 1];
  }

  getProgressPercentage(): number {
    const statusOrder = [
      OrderTrackingStatus.ORDER_PLACED,
      OrderTrackingStatus.ORDER_CONFIRMED,
      OrderTrackingStatus.PRODUCTION_PLANNING,
      OrderTrackingStatus.MATERIAL_PROCUREMENT,
      OrderTrackingStatus.IN_PRODUCTION,
      OrderTrackingStatus.QUALITY_CHECK,
      OrderTrackingStatus.READY_FOR_DISPATCH,
      OrderTrackingStatus.DISPATCHED,
      OrderTrackingStatus.IN_TRANSIT,
      OrderTrackingStatus.DELIVERED,
      OrderTrackingStatus.COMPLETED,
    ];

    const currentIndex = statusOrder.indexOf(this.status);
    if (currentIndex === -1) return 0;

    return Math.round((currentIndex / (statusOrder.length - 1)) * 100);
  }

  isComplete(): boolean {
    return this.status === OrderTrackingStatus.COMPLETED;
  }

  isCancelled(): boolean {
    return this.status === OrderTrackingStatus.CANCELLED;
  }

  isOnHold(): boolean {
    return this.status === OrderTrackingStatus.ON_HOLD;
  }
}
