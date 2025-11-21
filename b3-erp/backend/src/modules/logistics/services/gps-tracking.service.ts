import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export type VehicleStatus = 'idle' | 'in_transit' | 'loading' | 'unloading' | 'maintenance' | 'offline';
export type AlertType = 'geofence_entry' | 'geofence_exit' | 'speed_violation' | 'route_deviation' | 'idle_time' | 'sos' | 'low_battery';

export interface Vehicle {
  id: string;
  vehicleNumber: string;
  vehicleType: string;
  driverId: string;
  driverName: string;
  driverPhone: string;
  status: VehicleStatus;
  currentLocation: GPSLocation;
  lastUpdated: string;
  speed: number;
  heading: number;
  fuelLevel?: number;
  odometer: number;
  assignedRoute?: string;
  isActive: boolean;
}

export interface GPSLocation {
  latitude: number;
  longitude: number;
  altitude?: number;
  accuracy?: number;
  address?: string;
  timestamp: string;
}

export interface Geofence {
  id: string;
  name: string;
  type: 'circle' | 'polygon';
  center?: { latitude: number; longitude: number };
  radius?: number; // meters
  polygon?: { latitude: number; longitude: number }[];
  category: 'warehouse' | 'customer' | 'restricted' | 'delivery_zone' | 'custom';
  alertOnEntry: boolean;
  alertOnExit: boolean;
  dwellTimeAlert?: number; // minutes
  isActive: boolean;
  createdAt: string;
}

export interface TrackingEvent {
  id: string;
  vehicleId: string;
  vehicleNumber: string;
  eventType: 'location_update' | 'status_change' | 'alert' | 'geofence_event';
  location: GPSLocation;
  previousStatus?: VehicleStatus;
  newStatus?: VehicleStatus;
  alertType?: AlertType;
  geofenceId?: string;
  geofenceName?: string;
  details?: string;
  timestamp: string;
}

export interface DeliveryTracking {
  id: string;
  deliveryId: string;
  deliveryNumber: string;
  vehicleId: string;
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  status: 'scheduled' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'failed';
  origin: GPSLocation;
  destination: GPSLocation;
  currentLocation?: GPSLocation;
  estimatedArrival: string;
  actualArrival?: string;
  distanceRemaining?: number;
  timeRemaining?: number;
  route: GPSLocation[];
  checkpoints: DeliveryCheckpoint[];
  customerNotified: boolean;
}

export interface DeliveryCheckpoint {
  id: string;
  name: string;
  location: GPSLocation;
  expectedTime: string;
  actualTime?: string;
  status: 'pending' | 'reached' | 'skipped';
}

export interface Alert {
  id: string;
  vehicleId: string;
  vehicleNumber: string;
  driverId: string;
  driverName: string;
  alertType: AlertType;
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: GPSLocation;
  message: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  resolved: boolean;
  resolvedAt?: string;
  createdAt: string;
}

export interface FleetAnalytics {
  totalVehicles: number;
  activeVehicles: number;
  inTransit: number;
  idle: number;
  avgSpeed: number;
  totalDistance: number;
  fuelEfficiency: number;
  onTimeDeliveryRate: number;
  alertCount: number;
  geofenceViolations: number;
}

@Injectable()
export class GPSTrackingService {
  private vehicles: Vehicle[] = [];
  private geofences: Geofence[] = [];
  private events: TrackingEvent[] = [];
  private deliveryTrackings: DeliveryTracking[] = [];
  private alerts: Alert[] = [];

  constructor() {
    this.seedMockData();
  }

  async updateVehicleLocation(
    vehicleId: string,
    location: GPSLocation,
    speed: number,
    heading: number
  ): Promise<Vehicle> {
    const vehicle = this.vehicles.find(v => v.id === vehicleId);
    if (!vehicle) throw new Error(`Vehicle ${vehicleId} not found`);

    vehicle.currentLocation = location;
    vehicle.speed = speed;
    vehicle.heading = heading;
    vehicle.lastUpdated = new Date().toISOString();

    // Log event
    const event: TrackingEvent = {
      id: uuidv4(),
      vehicleId,
      vehicleNumber: vehicle.vehicleNumber,
      eventType: 'location_update',
      location,
      timestamp: new Date().toISOString(),
    };
    this.events.push(event);

    // Check geofences
    await this.checkGeofences(vehicle, location);

    // Check speed violations
    if (speed > 80) {
      await this.createAlert(vehicle, 'speed_violation', 'high', `Speed ${speed} km/h exceeds limit`, location);
    }

    return vehicle;
  }

  async updateVehicleStatus(vehicleId: string, status: VehicleStatus): Promise<Vehicle> {
    const vehicle = this.vehicles.find(v => v.id === vehicleId);
    if (!vehicle) throw new Error(`Vehicle ${vehicleId} not found`);

    const previousStatus = vehicle.status;
    vehicle.status = status;
    vehicle.lastUpdated = new Date().toISOString();

    // Log event
    const event: TrackingEvent = {
      id: uuidv4(),
      vehicleId,
      vehicleNumber: vehicle.vehicleNumber,
      eventType: 'status_change',
      location: vehicle.currentLocation,
      previousStatus,
      newStatus: status,
      timestamp: new Date().toISOString(),
    };
    this.events.push(event);

    return vehicle;
  }

  async createGeofence(geofence: Omit<Geofence, 'id' | 'createdAt'>): Promise<Geofence> {
    const newGeofence: Geofence = {
      ...geofence,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };

    this.geofences.push(newGeofence);
    return newGeofence;
  }

  private async checkGeofences(vehicle: Vehicle, location: GPSLocation): Promise<void> {
    for (const geofence of this.geofences) {
      if (!geofence.isActive) continue;

      const isInside = this.isInsideGeofence(location, geofence);

      // Would need to track previous state to detect entry/exit
      // Simplified: just create events for demo
      if (isInside && geofence.alertOnEntry) {
        const event: TrackingEvent = {
          id: uuidv4(),
          vehicleId: vehicle.id,
          vehicleNumber: vehicle.vehicleNumber,
          eventType: 'geofence_event',
          location,
          geofenceId: geofence.id,
          geofenceName: geofence.name,
          details: `Entered ${geofence.name}`,
          timestamp: new Date().toISOString(),
        };
        this.events.push(event);
      }
    }
  }

  private isInsideGeofence(location: GPSLocation, geofence: Geofence): boolean {
    if (geofence.type === 'circle' && geofence.center && geofence.radius) {
      const distance = this.calculateDistance(
        location.latitude,
        location.longitude,
        geofence.center.latitude,
        geofence.center.longitude
      );
      return distance <= geofence.radius;
    }
    // Polygon check would be more complex
    return false;
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371000; // Earth radius in meters
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  private async createAlert(
    vehicle: Vehicle,
    alertType: AlertType,
    severity: Alert['severity'],
    message: string,
    location: GPSLocation
  ): Promise<Alert> {
    const alert: Alert = {
      id: uuidv4(),
      vehicleId: vehicle.id,
      vehicleNumber: vehicle.vehicleNumber,
      driverId: vehicle.driverId,
      driverName: vehicle.driverName,
      alertType,
      severity,
      location,
      message,
      acknowledged: false,
      resolved: false,
      createdAt: new Date().toISOString(),
    };

    this.alerts.push(alert);
    return alert;
  }

  async acknowledgeAlert(alertId: string, acknowledgedBy: string): Promise<Alert> {
    const alert = this.alerts.find(a => a.id === alertId);
    if (!alert) throw new Error(`Alert ${alertId} not found`);

    alert.acknowledged = true;
    alert.acknowledgedBy = acknowledgedBy;
    alert.acknowledgedAt = new Date().toISOString();

    return alert;
  }

  async resolveAlert(alertId: string): Promise<Alert> {
    const alert = this.alerts.find(a => a.id === alertId);
    if (!alert) throw new Error(`Alert ${alertId} not found`);

    alert.resolved = true;
    alert.resolvedAt = new Date().toISOString();

    return alert;
  }

  async trackDelivery(deliveryId: string): Promise<DeliveryTracking | undefined> {
    return this.deliveryTrackings.find(d => d.deliveryId === deliveryId);
  }

  async getVehicleLocation(vehicleId: string): Promise<Vehicle | undefined> {
    return this.vehicles.find(v => v.id === vehicleId);
  }

  async getFleetStatus(): Promise<Vehicle[]> {
    return this.vehicles;
  }

  async getVehicleHistory(vehicleId: string, hours: number = 24): Promise<TrackingEvent[]> {
    const cutoff = new Date();
    cutoff.setHours(cutoff.getHours() - hours);

    return this.events.filter(e =>
      e.vehicleId === vehicleId && new Date(e.timestamp) >= cutoff
    );
  }

  async getActiveAlerts(): Promise<Alert[]> {
    return this.alerts.filter(a => !a.resolved);
  }

  async getFleetAnalytics(): Promise<FleetAnalytics> {
    const activeVehicles = this.vehicles.filter(v => v.isActive);
    const inTransit = this.vehicles.filter(v => v.status === 'in_transit').length;
    const idle = this.vehicles.filter(v => v.status === 'idle').length;

    const speeds = this.vehicles.filter(v => v.speed > 0).map(v => v.speed);
    const avgSpeed = speeds.length > 0 ? speeds.reduce((a, b) => a + b, 0) / speeds.length : 0;

    const totalDistance = this.vehicles.reduce((sum, v) => sum + v.odometer, 0);

    return {
      totalVehicles: this.vehicles.length,
      activeVehicles: activeVehicles.length,
      inTransit,
      idle,
      avgSpeed: Math.round(avgSpeed),
      totalDistance,
      fuelEfficiency: 8.5, // km/l
      onTimeDeliveryRate: 94,
      alertCount: this.alerts.filter(a => !a.resolved).length,
      geofenceViolations: this.events.filter(e => e.eventType === 'geofence_event').length,
    };
  }

  async getDeliveryETA(deliveryId: string): Promise<{
    estimatedArrival: string;
    distanceRemaining: number;
    timeRemaining: number;
    currentStatus: string;
  } | null> {
    const tracking = this.deliveryTrackings.find(d => d.deliveryId === deliveryId);
    if (!tracking) return null;

    return {
      estimatedArrival: tracking.estimatedArrival,
      distanceRemaining: tracking.distanceRemaining || 0,
      timeRemaining: tracking.timeRemaining || 0,
      currentStatus: tracking.status,
    };
  }

  async getGeofenceReport(): Promise<{
    totalGeofences: number;
    byCategory: Record<string, number>;
    recentEvents: TrackingEvent[];
  }> {
    const byCategory: Record<string, number> = {};
    for (const gf of this.geofences) {
      byCategory[gf.category] = (byCategory[gf.category] || 0) + 1;
    }

    const recentEvents = this.events
      .filter(e => e.eventType === 'geofence_event')
      .slice(-10);

    return {
      totalGeofences: this.geofences.length,
      byCategory,
      recentEvents,
    };
  }

  private seedMockData(): void {
    // Sample vehicles
    for (let i = 1; i <= 5; i++) {
      this.vehicles.push({
        id: uuidv4(),
        vehicleNumber: `VH-${1000 + i}`,
        vehicleType: i <= 2 ? 'Van' : i <= 4 ? 'Truck' : 'Heavy Truck',
        driverId: `driver-${i}`,
        driverName: `Driver ${i}`,
        driverPhone: `+1234567890${i}`,
        status: i % 3 === 0 ? 'idle' : 'in_transit',
        currentLocation: {
          latitude: 28.6139 + (Math.random() * 0.1),
          longitude: 77.2090 + (Math.random() * 0.1),
          timestamp: new Date().toISOString(),
        },
        lastUpdated: new Date().toISOString(),
        speed: i % 3 === 0 ? 0 : 40 + Math.random() * 20,
        heading: Math.random() * 360,
        fuelLevel: 50 + Math.random() * 50,
        odometer: 10000 + i * 5000,
        isActive: true,
      });
    }

    // Sample geofences
    this.geofences = [
      {
        id: uuidv4(),
        name: 'Main Warehouse',
        type: 'circle',
        center: { latitude: 28.6139, longitude: 77.2090 },
        radius: 500,
        category: 'warehouse',
        alertOnEntry: true,
        alertOnExit: true,
        dwellTimeAlert: 30,
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        name: 'Delivery Zone North',
        type: 'circle',
        center: { latitude: 28.7041, longitude: 77.1025 },
        radius: 5000,
        category: 'delivery_zone',
        alertOnEntry: true,
        alertOnExit: false,
        isActive: true,
        createdAt: new Date().toISOString(),
      },
    ];
  }
}
