import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export type ConsolidationType = 'same_customer' | 'same_route' | 'same_destination' | 'weight_based' | 'volume_based';
export type ConsolidationStatus = 'pending' | 'consolidated' | 'dispatched' | 'cancelled';

export interface ShipmentOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  deliveryAddress: DeliveryAddress;
  items: ShipmentItem[];
  totalWeight: number;
  totalVolume: number;
  totalValue: number;
  requiredDeliveryDate: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'pending' | 'consolidated' | 'shipped';
  consolidationId?: string;
}

export interface DeliveryAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  zone?: string;
}

export interface ShipmentItem {
  itemId: string;
  itemCode: string;
  itemName: string;
  quantity: number;
  weight: number;
  volume: number;
  isFragile: boolean;
  requiresTemperatureControl: boolean;
}

export interface ConsolidatedShipment {
  id: string;
  consolidationNumber: string;
  type: ConsolidationType;
  status: ConsolidationStatus;
  orders: ShipmentOrder[];
  totalOrders: number;
  totalWeight: number;
  totalVolume: number;
  totalValue: number;
  estimatedCost: number;
  costSavings: number;
  savingsPercent: number;
  vehicleType: string;
  vehicleCapacity: { weight: number; volume: number };
  utilizationPercent: number;
  route: RouteInfo;
  scheduledDispatch: string;
  estimatedDelivery: string;
  createdAt: string;
}

export interface RouteInfo {
  startPoint: string;
  endPoint: string;
  stops: RouteStop[];
  totalDistance: number;
  estimatedDuration: number;
  optimizedSequence: string[];
}

export interface RouteStop {
  orderId: string;
  customerId: string;
  customerName: string;
  address: DeliveryAddress;
  sequence: number;
  estimatedArrival: string;
  estimatedDuration: number;
}

export interface ConsolidationRule {
  id: string;
  name: string;
  type: ConsolidationType;
  priority: number;
  conditions: {
    maxOrders?: number;
    maxWeight?: number;
    maxVolume?: number;
    maxDistance?: number;
    sameZone?: boolean;
    samePriority?: boolean;
    deliveryWindow?: number;
  };
  isActive: boolean;
}

export interface ConsolidationSuggestion {
  orders: ShipmentOrder[];
  type: ConsolidationType;
  score: number;
  estimatedSavings: number;
  vehicleRecommendation: string;
  reason: string;
}

@Injectable()
export class ConsolidationService {
  private orders: ShipmentOrder[] = [];
  private consolidations: ConsolidatedShipment[] = [];
  private rules: ConsolidationRule[] = [];
  private consolidationCounter = 1000;

  constructor() {
    this.seedMockData();
  }

  async findConsolidationOpportunities(): Promise<ConsolidationSuggestion[]> {
    const pendingOrders = this.orders.filter(o => o.status === 'pending');
    const suggestions: ConsolidationSuggestion[] = [];

    // Group by customer
    const customerGroups = this.groupBy(pendingOrders, 'customerId');
    for (const [customerId, orders] of Object.entries(customerGroups)) {
      if (orders.length >= 2) {
        suggestions.push(this.createSuggestion(orders, 'same_customer', 'Multiple orders for same customer'));
      }
    }

    // Group by destination zone
    const zoneGroups = this.groupByZone(pendingOrders);
    for (const [zone, orders] of Object.entries(zoneGroups)) {
      if (orders.length >= 2) {
        suggestions.push(this.createSuggestion(orders, 'same_destination', `Multiple orders to ${zone} zone`));
      }
    }

    // Group by delivery date
    const dateGroups = this.groupBy(pendingOrders, 'requiredDeliveryDate');
    for (const [date, orders] of Object.entries(dateGroups)) {
      if (orders.length >= 3) {
        suggestions.push(this.createSuggestion(orders, 'same_route', `Multiple orders for ${date}`));
      }
    }

    return suggestions.sort((a, b) => b.score - a.score);
  }

  private groupBy(orders: ShipmentOrder[], key: keyof ShipmentOrder): Record<string, ShipmentOrder[]> {
    return orders.reduce((groups, order) => {
      const value = String(order[key]);
      if (!groups[value]) groups[value] = [];
      groups[value].push(order);
      return groups;
    }, {} as Record<string, ShipmentOrder[]>);
  }

  private groupByZone(orders: ShipmentOrder[]): Record<string, ShipmentOrder[]> {
    return orders.reduce((groups, order) => {
      const zone = order.deliveryAddress.zone || 'Unknown';
      if (!groups[zone]) groups[zone] = [];
      groups[zone].push(order);
      return groups;
    }, {} as Record<string, ShipmentOrder[]>);
  }

  private createSuggestion(
    orders: ShipmentOrder[],
    type: ConsolidationType,
    reason: string
  ): ConsolidationSuggestion {
    const totalWeight = orders.reduce((sum, o) => sum + o.totalWeight, 0);
    const totalVolume = orders.reduce((sum, o) => sum + o.totalVolume, 0);
    const totalValue = orders.reduce((sum, o) => sum + o.totalValue, 0);

    // Calculate savings (simplified)
    const individualCost = orders.length * 500; // Base cost per shipment
    const consolidatedCost = 500 + orders.length * 100; // Reduced cost
    const savings = individualCost - consolidatedCost;

    return {
      orders,
      type,
      score: savings * orders.length,
      estimatedSavings: savings,
      vehicleRecommendation: this.recommendVehicle(totalWeight, totalVolume),
      reason,
    };
  }

  private recommendVehicle(weight: number, volume: number): string {
    if (weight <= 500 && volume <= 2) return 'Van';
    if (weight <= 2000 && volume <= 10) return 'Small Truck';
    if (weight <= 5000 && volume <= 25) return 'Medium Truck';
    return 'Large Truck';
  }

  async consolidateOrders(
    orderIds: string[],
    type: ConsolidationType,
    vehicleType: string,
    scheduledDispatch: string
  ): Promise<ConsolidatedShipment> {
    const orders = this.orders.filter(o => orderIds.includes(o.id));
    if (orders.length === 0) throw new Error('No valid orders found');

    const totalWeight = orders.reduce((sum, o) => sum + o.totalWeight, 0);
    const totalVolume = orders.reduce((sum, o) => sum + o.totalVolume, 0);
    const totalValue = orders.reduce((sum, o) => sum + o.totalValue, 0);

    // Calculate cost and savings
    const individualCost = orders.length * 500;
    const consolidatedCost = 500 + orders.length * 100;
    const savings = individualCost - consolidatedCost;

    // Get vehicle capacity
    const vehicleCapacity = this.getVehicleCapacity(vehicleType);
    const utilization = Math.max(
      (totalWeight / vehicleCapacity.weight) * 100,
      (totalVolume / vehicleCapacity.volume) * 100
    );

    // Create route
    const route = this.createOptimizedRoute(orders);

    const consolidation: ConsolidatedShipment = {
      id: uuidv4(),
      consolidationNumber: `CON-${++this.consolidationCounter}`,
      type,
      status: 'consolidated',
      orders,
      totalOrders: orders.length,
      totalWeight,
      totalVolume,
      totalValue,
      estimatedCost: consolidatedCost,
      costSavings: savings,
      savingsPercent: Math.round((savings / individualCost) * 100),
      vehicleType,
      vehicleCapacity,
      utilizationPercent: Math.round(utilization),
      route,
      scheduledDispatch,
      estimatedDelivery: this.calculateEstimatedDelivery(route, scheduledDispatch),
      createdAt: new Date().toISOString(),
    };

    // Update order statuses
    for (const order of orders) {
      order.status = 'consolidated';
      order.consolidationId = consolidation.id;
    }

    this.consolidations.push(consolidation);
    return consolidation;
  }

  private getVehicleCapacity(vehicleType: string): { weight: number; volume: number } {
    const capacities: Record<string, { weight: number; volume: number }> = {
      'Van': { weight: 500, volume: 2 },
      'Small Truck': { weight: 2000, volume: 10 },
      'Medium Truck': { weight: 5000, volume: 25 },
      'Large Truck': { weight: 10000, volume: 50 },
    };
    return capacities[vehicleType] || capacities['Medium Truck'];
  }

  private createOptimizedRoute(orders: ShipmentOrder[]): RouteInfo {
    // Simple route optimization (would use actual routing algorithm)
    const stops: RouteStop[] = orders.map((order, index) => ({
      orderId: order.id,
      customerId: order.customerId,
      customerName: order.customerName,
      address: order.deliveryAddress,
      sequence: index + 1,
      estimatedArrival: this.calculateArrivalTime(index),
      estimatedDuration: 15, // minutes for unloading
    }));

    return {
      startPoint: 'Warehouse',
      endPoint: 'Warehouse',
      stops,
      totalDistance: orders.length * 15, // km estimate
      estimatedDuration: orders.length * 30, // minutes
      optimizedSequence: orders.map(o => o.id),
    };
  }

  private calculateArrivalTime(stopIndex: number): string {
    const baseTime = new Date();
    baseTime.setHours(8, 0, 0); // Start at 8 AM
    baseTime.setMinutes(baseTime.getMinutes() + stopIndex * 30);
    return baseTime.toISOString();
  }

  private calculateEstimatedDelivery(route: RouteInfo, dispatchTime: string): string {
    const dispatch = new Date(dispatchTime);
    dispatch.setMinutes(dispatch.getMinutes() + route.estimatedDuration);
    return dispatch.toISOString();
  }

  async dispatchConsolidation(consolidationId: string): Promise<ConsolidatedShipment> {
    const consolidation = this.consolidations.find(c => c.id === consolidationId);
    if (!consolidation) throw new Error(`Consolidation ${consolidationId} not found`);

    consolidation.status = 'dispatched';

    for (const order of consolidation.orders) {
      const originalOrder = this.orders.find(o => o.id === order.id);
      if (originalOrder) originalOrder.status = 'shipped';
    }

    return consolidation;
  }

  async getConsolidationReport(): Promise<{
    totalConsolidations: number;
    totalOrdersConsolidated: number;
    totalSavings: number;
    avgSavingsPercent: number;
    avgUtilization: number;
    byType: Record<string, number>;
    byStatus: Record<string, number>;
  }> {
    const byType: Record<string, number> = {};
    const byStatus: Record<string, number> = {};
    let totalSavings = 0;
    let totalSavingsPercent = 0;
    let totalUtilization = 0;
    let totalOrders = 0;

    for (const con of this.consolidations) {
      byType[con.type] = (byType[con.type] || 0) + 1;
      byStatus[con.status] = (byStatus[con.status] || 0) + 1;
      totalSavings += con.costSavings;
      totalSavingsPercent += con.savingsPercent;
      totalUtilization += con.utilizationPercent;
      totalOrders += con.totalOrders;
    }

    const count = this.consolidations.length || 1;

    return {
      totalConsolidations: this.consolidations.length,
      totalOrdersConsolidated: totalOrders,
      totalSavings,
      avgSavingsPercent: Math.round(totalSavingsPercent / count),
      avgUtilization: Math.round(totalUtilization / count),
      byType,
      byStatus,
    };
  }

  async getPendingOrders(): Promise<ShipmentOrder[]> {
    return this.orders.filter(o => o.status === 'pending');
  }

  private seedMockData(): void {
    // Sample shipment orders
    const zones = ['North', 'South', 'East', 'West'];

    for (let i = 1; i <= 10; i++) {
      const zone = zones[i % zones.length];
      this.orders.push({
        id: uuidv4(),
        orderNumber: `SO-${1000 + i}`,
        customerId: `cust-${(i % 3) + 1}`,
        customerName: `Customer ${(i % 3) + 1}`,
        deliveryAddress: {
          street: `${i * 100} Main Street`,
          city: `City ${zone}`,
          state: 'State',
          postalCode: `${10000 + i}`,
          country: 'Country',
          zone,
        },
        items: [
          {
            itemId: `item-${i}`,
            itemCode: `ITM-${i}`,
            itemName: `Item ${i}`,
            quantity: 10,
            weight: 50 + (i * 5),
            volume: 1 + (i * 0.1),
            isFragile: i % 3 === 0,
            requiresTemperatureControl: false,
          },
        ],
        totalWeight: 50 + (i * 5),
        totalVolume: 1 + (i * 0.1),
        totalValue: 5000 + (i * 500),
        requiredDeliveryDate: this.addDays(i % 3 + 1),
        priority: i % 4 === 0 ? 'high' : 'normal',
        status: 'pending',
      });
    }

    // Consolidation rules
    this.rules = [
      {
        id: uuidv4(),
        name: 'Same Customer',
        type: 'same_customer',
        priority: 100,
        conditions: {
          maxOrders: 10,
          maxWeight: 5000,
        },
        isActive: true,
      },
      {
        id: uuidv4(),
        name: 'Same Zone',
        type: 'same_destination',
        priority: 80,
        conditions: {
          maxOrders: 20,
          maxWeight: 10000,
          sameZone: true,
        },
        isActive: true,
      },
    ];
  }

  private addDays(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  }
}
