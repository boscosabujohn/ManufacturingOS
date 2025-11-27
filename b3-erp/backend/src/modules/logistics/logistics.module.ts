import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import {
  Shipment,
  ShipmentItem,
  DeliveryNote,
  Vehicle,
  Driver,
  Route,
  Trip,
  TrackingEvent,
  FreightCharge,
  TransportCompany,
} from './entities';

// Controllers
import {
  ShipmentController,
  DeliveryNoteController,
  VehicleController,
  DriverController,
  RouteController,
  TripController,
  TrackingEventController,
  FreightChargeController,
  TransportCompanyController,
} from './controllers';
import { GatePassController } from './controllers/gate-pass.controller';

// Services
import {
  ShipmentService,
  DeliveryNoteService,
  VehicleService,
  DriverService,
  RouteService,
  TripService,
  TrackingEventService,
  FreightChargeService,
  TransportCompanyService,
} from './services';
import { ConsolidationService } from './services/consolidation.service';
import { ReturnManagementService } from './services/return-management.service';
import { GPSTrackingService } from './services/gps-tracking.service';
import { CustomerNotificationService } from './services/customer-notification.service';
import { GatePassService } from './services/gate-pass.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Shipment,
      ShipmentItem,
      DeliveryNote,
      Vehicle,
      Driver,
      Route,
      Trip,
      TrackingEvent,
      FreightCharge,
      TransportCompany,
    ]),
  ],
  controllers: [
    ShipmentController,
    DeliveryNoteController,
    VehicleController,
    DriverController,
    RouteController,
    TripController,
    TrackingEventController,
    FreightChargeController,
    TransportCompanyController,
    GatePassController,
  ],
  providers: [
    ShipmentService,
    DeliveryNoteService,
    VehicleService,
    DriverService,
    RouteService,
    TripService,
    TrackingEventService,
    FreightChargeService,
    TransportCompanyService,
    ConsolidationService,
    ReturnManagementService,
    GPSTrackingService,
    CustomerNotificationService,
    GatePassService,
  ],
  exports: [
    ShipmentService,
    DeliveryNoteService,
    VehicleService,
    DriverService,
    RouteService,
    TripService,
    TrackingEventService,
    FreightChargeService,
    TransportCompanyService,
    ConsolidationService,
    ReturnManagementService,
    GPSTrackingService,
    CustomerNotificationService,
    GatePassService,
  ],
})
export class LogisticsModule { }
