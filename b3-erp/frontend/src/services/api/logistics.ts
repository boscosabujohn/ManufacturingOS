/**
 * Logistics API Service
 * Wires frontend to backend Logistics module APIs
 */

import apiClient from '@/lib/api-client';

// ============================================
// TYPES
// ============================================

export interface Shipment {
  id: string;
  shipmentNumber: string;
  shipmentType: 'outbound' | 'inbound' | 'transfer';
  status: 'draft' | 'scheduled' | 'dispatched' | 'in_transit' | 'delivered' | 'cancelled';
  originType: 'warehouse' | 'vendor' | 'customer';
  originId: string;
  originName: string;
  originAddress: string;
  destinationType: 'warehouse' | 'vendor' | 'customer';
  destinationId: string;
  destinationName: string;
  destinationAddress: string;
  salesOrderId?: string;
  salesOrderNumber?: string;
  purchaseOrderId?: string;
  purchaseOrderNumber?: string;
  plannedShipDate: string;
  actualShipDate?: string;
  plannedDeliveryDate: string;
  actualDeliveryDate?: string;
  carrierId?: string;
  carrierName?: string;
  trackingNumber?: string;
  vehicleId?: string;
  vehicleNumber?: string;
  driverId?: string;
  driverName?: string;
  totalWeight: number;
  weightUom: string;
  totalVolume: number;
  volumeUom: string;
  totalItems: number;
  freightCharges: number;
  insuranceCharges: number;
  otherCharges: number;
  totalCharges: number;
  currency: string;
  items: ShipmentItem[];
  trackingEvents: TrackingEvent[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShipmentItem {
  id: string;
  itemId: string;
  itemCode: string;
  itemName: string;
  quantity: number;
  uom: string;
  weight: number;
  volume: number;
  packageType?: string;
  packageCount?: number;
  serialNumbers?: string[];
  batchNumbers?: string[];
}

export interface TrackingEvent {
  id: string;
  eventType: string;
  eventDate: string;
  location: string;
  description: string;
  recordedBy: string;
  latitude?: number;
  longitude?: number;
}

export interface DeliveryNote {
  id: string;
  deliveryNoteNumber: string;
  shipmentId: string;
  shipmentNumber: string;
  deliveryDate: string;
  customerId: string;
  customerName: string;
  deliveryAddress: string;
  contactPerson?: string;
  contactPhone?: string;
  status: 'draft' | 'printed' | 'delivered' | 'signed' | 'cancelled';
  items: DeliveryNoteItem[];
  receiverName?: string;
  receiverSignature?: string;
  receivedDate?: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeliveryNoteItem {
  id: string;
  itemId: string;
  itemCode: string;
  itemName: string;
  orderedQuantity: number;
  deliveredQuantity: number;
  uom: string;
  remarks?: string;
}

export interface Vehicle {
  id: string;
  vehicleNumber: string;
  vehicleType: 'truck' | 'van' | 'pickup' | 'container' | 'other';
  make?: string;
  model?: string;
  year?: number;
  capacity: number;
  capacityUom: string;
  volumeCapacity?: number;
  volumeUom?: string;
  status: 'available' | 'in_use' | 'maintenance' | 'inactive';
  currentDriverId?: string;
  currentDriverName?: string;
  currentLocation?: string;
  fuelType?: string;
  registrationExpiry?: string;
  insuranceExpiry?: string;
  fitnessExpiry?: string;
  gpsEnabled: boolean;
  gpsDeviceId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Driver {
  id: string;
  driverCode: string;
  driverName: string;
  licenseNumber: string;
  licenseType: string;
  licenseExpiry: string;
  mobileNumber: string;
  email?: string;
  address?: string;
  dateOfBirth?: string;
  joiningDate: string;
  status: 'available' | 'on_trip' | 'on_leave' | 'inactive';
  currentVehicleId?: string;
  currentVehicleNumber?: string;
  rating?: number;
  totalTrips?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Route {
  id: string;
  routeCode: string;
  routeName: string;
  description?: string;
  originName: string;
  originAddress: string;
  destinationName: string;
  destinationAddress: string;
  distanceKm: number;
  estimatedTimeMinutes: number;
  waypoints?: {
    name: string;
    address: string;
    sequenceNumber: number;
    estimatedArrivalMinutes: number;
  }[];
  tollCharges?: number;
  fuelEstimate?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Trip {
  id: string;
  tripNumber: string;
  vehicleId: string;
  vehicleNumber: string;
  driverId: string;
  driverName: string;
  routeId?: string;
  routeName?: string;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  startLocation: string;
  endLocation: string;
  plannedStartTime: string;
  plannedEndTime: string;
  actualStartTime?: string;
  actualEndTime?: string;
  distancePlanned: number;
  distanceActual?: number;
  shipmentIds: string[];
  fuelConsumed?: number;
  tollCharges?: number;
  otherExpenses?: number;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FreightCharge {
  id: string;
  chargeCode: string;
  chargeName: string;
  chargeType: 'per_kg' | 'per_unit' | 'per_trip' | 'flat' | 'percentage';
  baseAmount: number;
  currency: string;
  applicableTo: 'all' | 'specific_routes' | 'specific_carriers';
  routeIds?: string[];
  carrierIds?: string[];
  minWeight?: number;
  maxWeight?: number;
  isActive: boolean;
  effectiveFrom: string;
  effectiveTo?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// SHIPMENT API
// ============================================

export const shipmentApi = {
  async getAll(filters?: {
    status?: string;
    shipmentType?: string;
    originId?: string;
    destinationId?: string;
    fromDate?: string;
    toDate?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: Shipment[]; total: number }> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }
    const response = await apiClient.get(`/logistics/shipments?${params.toString()}`);
    return response.data;
  },

  async getById(id: string): Promise<Shipment> {
    const response = await apiClient.get(`/logistics/shipments/${id}`);
    return response.data;
  },

  async create(data: {
    shipmentType: 'outbound' | 'inbound' | 'transfer';
    originType: string;
    originId: string;
    destinationType: string;
    destinationId: string;
    salesOrderId?: string;
    purchaseOrderId?: string;
    plannedShipDate: string;
    plannedDeliveryDate: string;
    carrierId?: string;
    items: {
      itemId: string;
      quantity: number;
      serialNumbers?: string[];
      batchNumbers?: string[];
    }[];
    notes?: string;
  }): Promise<Shipment> {
    const response = await apiClient.post('/logistics/shipments', data);
    return response.data;
  },

  async update(id: string, data: Partial<Shipment>): Promise<Shipment> {
    const response = await apiClient.put(`/logistics/shipments/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/logistics/shipments/${id}`);
  },

  async dispatch(id: string, data: {
    vehicleId: string;
    driverId: string;
    actualShipDate?: string;
    trackingNumber?: string;
  }): Promise<Shipment> {
    const response = await apiClient.post(`/logistics/shipments/${id}/dispatch`, data);
    return response.data;
  },

  async markInTransit(id: string, location?: string): Promise<Shipment> {
    const response = await apiClient.post(`/logistics/shipments/${id}/in-transit`, { location });
    return response.data;
  },

  async markDelivered(id: string, data: {
    actualDeliveryDate: string;
    receiverName: string;
    remarks?: string;
  }): Promise<Shipment> {
    const response = await apiClient.post(`/logistics/shipments/${id}/deliver`, data);
    return response.data;
  },

  async cancel(id: string, reason: string): Promise<Shipment> {
    const response = await apiClient.post(`/logistics/shipments/${id}/cancel`, { reason });
    return response.data;
  },

  async getTracking(id: string): Promise<TrackingEvent[]> {
    const response = await apiClient.get(`/logistics/shipments/${id}/tracking`);
    return response.data;
  },

  async addTrackingEvent(id: string, event: {
    eventType: string;
    location: string;
    description: string;
    latitude?: number;
    longitude?: number;
  }): Promise<TrackingEvent> {
    const response = await apiClient.post(`/logistics/shipments/${id}/tracking`, event);
    return response.data;
  },
};

// ============================================
// DELIVERY NOTE API
// ============================================

export const deliveryNoteApi = {
  async getAll(filters?: {
    status?: string;
    customerId?: string;
    fromDate?: string;
    toDate?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: DeliveryNote[]; total: number }> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }
    const response = await apiClient.get(`/logistics/delivery-notes?${params.toString()}`);
    return response.data;
  },

  async getById(id: string): Promise<DeliveryNote> {
    const response = await apiClient.get(`/logistics/delivery-notes/${id}`);
    return response.data;
  },

  async createFromShipment(shipmentId: string): Promise<DeliveryNote> {
    const response = await apiClient.post(`/logistics/delivery-notes/from-shipment/${shipmentId}`);
    return response.data;
  },

  async print(id: string): Promise<{ pdfUrl: string }> {
    const response = await apiClient.post(`/logistics/delivery-notes/${id}/print`);
    return response.data;
  },

  async confirmDelivery(id: string, data: {
    receiverName: string;
    receiverSignature?: string;
    receivedDate: string;
    remarks?: string;
    itemsReceived?: { itemId: string; receivedQuantity: number }[];
  }): Promise<DeliveryNote> {
    const response = await apiClient.post(`/logistics/delivery-notes/${id}/confirm`, data);
    return response.data;
  },
};

// ============================================
// VEHICLE API
// ============================================

export const vehicleApi = {
  async getAll(filters?: {
    status?: string;
    vehicleType?: string;
  }): Promise<Vehicle[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }
    const response = await apiClient.get(`/logistics/vehicles?${params.toString()}`);
    return response.data;
  },

  async getById(id: string): Promise<Vehicle> {
    const response = await apiClient.get(`/logistics/vehicles/${id}`);
    return response.data;
  },

  async create(data: Partial<Vehicle>): Promise<Vehicle> {
    const response = await apiClient.post('/logistics/vehicles', data);
    return response.data;
  },

  async update(id: string, data: Partial<Vehicle>): Promise<Vehicle> {
    const response = await apiClient.put(`/logistics/vehicles/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/logistics/vehicles/${id}`);
  },

  async getAvailable(date?: string): Promise<Vehicle[]> {
    const params = date ? `?date=${date}` : '';
    const response = await apiClient.get(`/logistics/vehicles/available${params}`);
    return response.data;
  },

  async assignDriver(id: string, driverId: string): Promise<Vehicle> {
    const response = await apiClient.post(`/logistics/vehicles/${id}/assign-driver`, { driverId });
    return response.data;
  },

  async setMaintenance(id: string, data: {
    maintenanceType: string;
    startDate: string;
    endDate?: string;
    notes?: string;
  }): Promise<Vehicle> {
    const response = await apiClient.post(`/logistics/vehicles/${id}/maintenance`, data);
    return response.data;
  },
};

// ============================================
// DRIVER API
// ============================================

export const driverApi = {
  async getAll(filters?: {
    status?: string;
  }): Promise<Driver[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }
    const response = await apiClient.get(`/logistics/drivers?${params.toString()}`);
    return response.data;
  },

  async getById(id: string): Promise<Driver> {
    const response = await apiClient.get(`/logistics/drivers/${id}`);
    return response.data;
  },

  async create(data: Partial<Driver>): Promise<Driver> {
    const response = await apiClient.post('/logistics/drivers', data);
    return response.data;
  },

  async update(id: string, data: Partial<Driver>): Promise<Driver> {
    const response = await apiClient.put(`/logistics/drivers/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/logistics/drivers/${id}`);
  },

  async getAvailable(date?: string): Promise<Driver[]> {
    const params = date ? `?date=${date}` : '';
    const response = await apiClient.get(`/logistics/drivers/available${params}`);
    return response.data;
  },
};

// ============================================
// ROUTE API
// ============================================

export const routeApi = {
  async getAll(filters?: {
    isActive?: boolean;
  }): Promise<Route[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }
    const response = await apiClient.get(`/logistics/routes?${params.toString()}`);
    return response.data;
  },

  async getById(id: string): Promise<Route> {
    const response = await apiClient.get(`/logistics/routes/${id}`);
    return response.data;
  },

  async create(data: Partial<Route>): Promise<Route> {
    const response = await apiClient.post('/logistics/routes', data);
    return response.data;
  },

  async update(id: string, data: Partial<Route>): Promise<Route> {
    const response = await apiClient.put(`/logistics/routes/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/logistics/routes/${id}`);
  },
};

// ============================================
// TRIP API
// ============================================

export const tripApi = {
  async getAll(filters?: {
    status?: string;
    vehicleId?: string;
    driverId?: string;
    fromDate?: string;
    toDate?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: Trip[]; total: number }> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }
    const response = await apiClient.get(`/logistics/trips?${params.toString()}`);
    return response.data;
  },

  async getById(id: string): Promise<Trip> {
    const response = await apiClient.get(`/logistics/trips/${id}`);
    return response.data;
  },

  async create(data: {
    vehicleId: string;
    driverId: string;
    routeId?: string;
    startLocation: string;
    endLocation: string;
    plannedStartTime: string;
    plannedEndTime: string;
    shipmentIds: string[];
    remarks?: string;
  }): Promise<Trip> {
    const response = await apiClient.post('/logistics/trips', data);
    return response.data;
  },

  async start(id: string): Promise<Trip> {
    const response = await apiClient.post(`/logistics/trips/${id}/start`);
    return response.data;
  },

  async complete(id: string, data: {
    distanceActual?: number;
    fuelConsumed?: number;
    tollCharges?: number;
    otherExpenses?: number;
    remarks?: string;
  }): Promise<Trip> {
    const response = await apiClient.post(`/logistics/trips/${id}/complete`, data);
    return response.data;
  },

  async cancel(id: string, reason: string): Promise<Trip> {
    const response = await apiClient.post(`/logistics/trips/${id}/cancel`, { reason });
    return response.data;
  },
};

// ============================================
// FREIGHT CHARGE API
// ============================================

export const freightChargeApi = {
  async getAll(): Promise<FreightCharge[]> {
    const response = await apiClient.get('/logistics/freight-charges');
    return response.data;
  },

  async getById(id: string): Promise<FreightCharge> {
    const response = await apiClient.get(`/logistics/freight-charges/${id}`);
    return response.data;
  },

  async create(data: Partial<FreightCharge>): Promise<FreightCharge> {
    const response = await apiClient.post('/logistics/freight-charges', data);
    return response.data;
  },

  async update(id: string, data: Partial<FreightCharge>): Promise<FreightCharge> {
    const response = await apiClient.put(`/logistics/freight-charges/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/logistics/freight-charges/${id}`);
  },

  async calculate(data: {
    originId: string;
    destinationId: string;
    carrierId?: string;
    weight: number;
    volume?: number;
    itemCount?: number;
  }): Promise<{
    charges: { chargeCode: string; chargeName: string; amount: number }[];
    totalAmount: number;
    currency: string;
  }> {
    const response = await apiClient.post('/logistics/freight-charges/calculate', data);
    return response.data;
  },
};

// Export all APIs as a single object
export const logisticsService = {
  shipments: shipmentApi,
  deliveryNotes: deliveryNoteApi,
  vehicles: vehicleApi,
  drivers: driverApi,
  routes: routeApi,
  trips: tripApi,
  freightCharges: freightChargeApi,
};

export default logisticsService;
