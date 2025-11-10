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
  ],
})
export class LogisticsModule {}
