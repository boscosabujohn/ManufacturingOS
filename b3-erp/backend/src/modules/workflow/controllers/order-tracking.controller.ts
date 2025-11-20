import { Controller, Get, Param, Query, HttpException, HttpStatus } from '@nestjs/common';
import { OrderTrackingService } from '../services/order-tracking.service';
import { OrderTracking, OrderTrackingStatus } from '../entities/order-tracking.entity';

@Controller('api/workflow/order-tracking')
export class OrderTrackingController {
  constructor(private readonly orderTrackingService: OrderTrackingService) {}

  /**
   * Get order tracking by order ID
   */
  @Get(':orderId')
  async getOrderTracking(@Param('orderId') orderId: string): Promise<OrderTracking> {
    const tracking = await this.orderTrackingService.getOrderTracking(orderId);
    if (!tracking) {
      throw new HttpException('Order tracking not found', HttpStatus.NOT_FOUND);
    }
    return tracking;
  }

  /**
   * Get order tracking by order number
   */
  @Get('by-number/:orderNumber')
  async getOrderTrackingByNumber(@Param('orderNumber') orderNumber: string): Promise<OrderTracking> {
    const tracking = await this.orderTrackingService.getOrderTrackingByNumber(orderNumber);
    if (!tracking) {
      throw new HttpException('Order tracking not found', HttpStatus.NOT_FOUND);
    }
    return tracking;
  }

  /**
   * Get all orders for a customer
   */
  @Get('customer/:customerId')
  async getCustomerOrderTracking(@Param('customerId') customerId: string): Promise<OrderTracking[]> {
    return this.orderTrackingService.getCustomerOrderTracking(customerId);
  }

  /**
   * Get orders by status
   */
  @Get()
  async getOrdersByStatus(@Query('status') status?: string): Promise<OrderTracking[]> {
    if (status) {
      const trackingStatus = status as OrderTrackingStatus;
      if (!Object.values(OrderTrackingStatus).includes(trackingStatus)) {
        throw new HttpException('Invalid status', HttpStatus.BAD_REQUEST);
      }
      return this.orderTrackingService.getOrdersByStatus(trackingStatus);
    }
    // Return all if no status filter
    return this.orderTrackingService.getOrdersByStatus(OrderTrackingStatus.IN_PRODUCTION);
  }

  /**
   * Get order progress summary
   */
  @Get(':orderId/progress')
  async getOrderProgress(@Param('orderId') orderId: string): Promise<{
    orderId: string;
    orderNumber: string;
    status: string;
    progress: number;
    events: any[];
    workOrders: any[];
  }> {
    const tracking = await this.orderTrackingService.getOrderTracking(orderId);
    if (!tracking) {
      throw new HttpException('Order tracking not found', HttpStatus.NOT_FOUND);
    }

    return {
      orderId: tracking.orderId,
      orderNumber: tracking.orderNumber,
      status: tracking.status,
      progress: tracking.getProgressPercentage(),
      events: tracking.events,
      workOrders: tracking.workOrders,
    };
  }
}
