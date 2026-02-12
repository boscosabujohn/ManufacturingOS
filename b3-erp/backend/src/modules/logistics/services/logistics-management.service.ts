import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class LogisticsManagementService {
  constructor(private prisma: PrismaService) {}

  // ============================================
  // MASTER DATA - TRANSPORTERS
  // ============================================

  async getTransporters(companyId: string, filters?: {
    transporterType?: string;
    status?: string;
    search?: string;
  }) {
    const where: any = { companyId, isActive: true };
    if (filters?.transporterType) where.transporterType = filters.transporterType;
    if (filters?.status) where.status = filters.status;
    if (filters?.search) {
      where.OR = [
        { transporterName: { contains: filters.search, mode: 'insensitive' } },
        { transporterCode: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.transporter.findMany({
      where,
      orderBy: { transporterName: 'asc' },
    });
  }

  async getTransporterById(id: string, companyId: string) {
    return this.prisma.transporter.findFirst({
      where: { id, companyId, isActive: true },
    });
  }

  async createTransporter(data: any) {
    return this.prisma.transporter.create({ data });
  }

  async updateTransporter(id: string, companyId: string, data: any) {
    return this.prisma.transporter.update({
      where: { id },
      data,
    });
  }

  // ============================================
  // MASTER DATA - ROUTES
  // ============================================

  async getLogisticsRoutes(companyId: string, filters?: {
    routeType?: string;
    status?: string;
    originCity?: string;
    destinationCity?: string;
  }) {
    const where: any = { companyId, isActive: true };
    if (filters?.routeType) where.routeType = filters.routeType;
    if (filters?.status) where.status = filters.status;
    if (filters?.originCity) where.originCity = { contains: filters.originCity, mode: 'insensitive' };
    if (filters?.destinationCity) where.destinationCity = { contains: filters.destinationCity, mode: 'insensitive' };

    return this.prisma.logisticsRoute.findMany({
      where,
      orderBy: { routeName: 'asc' },
    });
  }

  async getLogisticsRouteById(id: string, companyId: string) {
    return this.prisma.logisticsRoute.findFirst({
      where: { id, companyId, isActive: true },
    });
  }

  async createLogisticsRoute(data: any) {
    return this.prisma.logisticsRoute.create({ data });
  }

  async updateLogisticsRoute(id: string, companyId: string, data: any) {
    return this.prisma.logisticsRoute.update({
      where: { id },
      data,
    });
  }

  // ============================================
  // MASTER DATA - PACKAGING TYPES
  // ============================================

  async getPackagingTypes(companyId: string, filters?: {
    category?: string;
    materialType?: string;
  }) {
    const where: any = { companyId, isActive: true };
    if (filters?.category) where.category = filters.category;
    if (filters?.materialType) where.materialType = filters.materialType;

    return this.prisma.packagingType.findMany({
      where,
      orderBy: { packagingName: 'asc' },
    });
  }

  async createPackagingType(data: any) {
    return this.prisma.packagingType.create({ data });
  }

  async updatePackagingType(id: string, companyId: string, data: any) {
    return this.prisma.packagingType.update({
      where: { id },
      data,
    });
  }

  // ============================================
  // MASTER DATA - FREIGHT TERMS
  // ============================================

  async getFreightTerms(companyId: string) {
    return this.prisma.freightTerm.findMany({
      where: { companyId, isActive: true },
      orderBy: { termName: 'asc' },
    });
  }

  async createFreightTerm(data: any) {
    return this.prisma.freightTerm.create({ data });
  }

  async updateFreightTerm(id: string, companyId: string, data: any) {
    return this.prisma.freightTerm.update({
      where: { id },
      data,
    });
  }

  // ============================================
  // MASTER DATA - PORTS/TERMINALS
  // ============================================

  async getPorts(companyId: string, filters?: {
    portType?: string;
    country?: string;
    status?: string;
  }) {
    const where: any = { companyId, isActive: true };
    if (filters?.portType) where.portType = filters.portType;
    if (filters?.country) where.country = filters.country;
    if (filters?.status) where.status = filters.status;

    return this.prisma.port.findMany({
      where,
      orderBy: { portName: 'asc' },
    });
  }

  async createPort(data: any) {
    return this.prisma.port.create({ data });
  }

  async updatePort(id: string, companyId: string, data: any) {
    return this.prisma.port.update({
      where: { id },
      data,
    });
  }

  // ============================================
  // FLEET MANAGEMENT - VEHICLES
  // ============================================

  async getVehiclesFleet(companyId: string, filters?: {
    vehicleType?: string;
    status?: string;
    ownershipType?: string;
  }) {
    const where: any = { companyId, isActive: true };
    if (filters?.vehicleType) where.vehicleType = filters.vehicleType;
    if (filters?.status) where.status = filters.status;
    if (filters?.ownershipType) where.ownershipType = filters.ownershipType;

    return this.prisma.vehicle.findMany({
      where,
      include: {
        maintenanceRecords: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
        fuelRecords: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getVehicleById(id: string, companyId: string) {
    return this.prisma.vehicle.findFirst({
      where: { id, companyId, isActive: true },
      include: {
        maintenanceRecords: {
          orderBy: { createdAt: 'desc' },
        },
        fuelRecords: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  async createVehicle(data: any) {
    return this.prisma.vehicle.create({ data });
  }

  async updateVehicle(id: string, companyId: string, data: any) {
    return this.prisma.vehicle.update({
      where: { id },
      data,
    });
  }

  // ============================================
  // FLEET MANAGEMENT - VEHICLE MAINTENANCE
  // ============================================

  async getVehicleMaintenanceRecords(companyId: string, filters?: {
    vehicleId?: string;
    maintenanceType?: string;
    status?: string;
  }) {
    const where: any = { companyId, isActive: true };
    if (filters?.vehicleId) where.vehicleId = filters.vehicleId;
    if (filters?.maintenanceType) where.maintenanceType = filters.maintenanceType;
    if (filters?.status) where.status = filters.status;

    return this.prisma.vehicleMaintenance.findMany({
      where,
      include: {
        vehicle: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createVehicleMaintenance(data: any) {
    return this.prisma.vehicleMaintenance.create({ data });
  }

  async updateVehicleMaintenance(id: string, companyId: string, data: any) {
    return this.prisma.vehicleMaintenance.update({
      where: { id },
      data,
    });
  }

  // ============================================
  // FLEET MANAGEMENT - FUEL RECORDS
  // ============================================

  async getFuelRecords(companyId: string, filters?: {
    vehicleId?: string;
    fuelType?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const where: any = { companyId, isActive: true };
    if (filters?.vehicleId) where.vehicleId = filters.vehicleId;
    if (filters?.fuelType) where.fuelType = filters.fuelType;
    if (filters?.startDate || filters?.endDate) {
      where.fillingDate = {};
      if (filters?.startDate) where.fillingDate.gte = filters.startDate;
      if (filters?.endDate) where.fillingDate.lte = filters.endDate;
    }

    return this.prisma.fuelRecord.findMany({
      where,
      include: {
        vehicle: true,
      },
      orderBy: { fillingDate: 'desc' },
    });
  }

  async createFuelRecord(data: any) {
    return this.prisma.fuelRecord.create({ data });
  }

  // ============================================
  // DRIVER MANAGEMENT
  // ============================================

  async getDrivers(companyId: string, filters?: {
    status?: string;
    driverType?: string;
    search?: string;
  }) {
    const where: any = { companyId, isActive: true };
    if (filters?.status) where.status = filters.status;
    if (filters?.driverType) where.driverType = filters.driverType;
    if (filters?.search) {
      where.OR = [
        { driverName: { contains: filters.search, mode: 'insensitive' } },
        { driverCode: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.driver.findMany({
      where,
      include: {
        assignments: {
          take: 5,
          orderBy: { startDate: 'desc' },
        },
        complianceRecords: true,
      },
      orderBy: { driverName: 'asc' },
    });
  }

  async getDriverById(id: string, companyId: string) {
    return this.prisma.driver.findFirst({
      where: { id, companyId, isActive: true },
      include: {
        assignments: {
          orderBy: { startDate: 'desc' },
        },
        complianceRecords: true,
      },
    });
  }

  async createDriver(data: any) {
    return this.prisma.driver.create({ data });
  }

  async updateDriver(id: string, companyId: string, data: any) {
    return this.prisma.driver.update({
      where: { id },
      data,
    });
  }

  // ============================================
  // DRIVER ASSIGNMENTS
  // ============================================

  async getDriverAssignments(companyId: string, filters?: {
    driverId?: string;
    vehicleId?: string;
    status?: string;
  }) {
    const where: any = { companyId, isActive: true };
    if (filters?.driverId) where.driverId = filters.driverId;
    if (filters?.vehicleId) where.vehicleId = filters.vehicleId;
    if (filters?.status) where.status = filters.status;

    return this.prisma.driverAssignment.findMany({
      where,
      include: {
        driver: true,
      },
      orderBy: { startDate: 'desc' },
    });
  }

  async createDriverAssignment(data: any) {
    return this.prisma.driverAssignment.create({ data });
  }

  async updateDriverAssignment(id: string, companyId: string, data: any) {
    return this.prisma.driverAssignment.update({
      where: { id },
      data,
    });
  }

  // ============================================
  // DRIVER COMPLIANCE
  // ============================================

  async getDriverComplianceRecords(companyId: string, filters?: {
    driverId?: string;
    complianceType?: string;
    status?: string;
  }) {
    const where: any = { companyId, isActive: true };
    if (filters?.driverId) where.driverId = filters.driverId;
    if (filters?.complianceType) where.complianceType = filters.complianceType;
    if (filters?.status) where.verificationStatus = filters.status;

    return this.prisma.driverCompliance.findMany({
      where,
      include: {
        driver: true,
      },
      orderBy: { expiryDate: 'asc' },
    });
  }

  async createDriverCompliance(data: any) {
    return this.prisma.driverCompliance.create({ data });
  }

  async updateDriverCompliance(id: string, companyId: string, data: any) {
    return this.prisma.driverCompliance.update({
      where: { id },
      data,
    });
  }

  // ============================================
  // CARRIER MANAGEMENT
  // ============================================

  async getCarriers(companyId: string, filters?: {
    carrierType?: string;
    status?: string;
    search?: string;
  }) {
    const where: any = { companyId, isActive: true };
    if (filters?.carrierType) where.carrierType = filters.carrierType;
    if (filters?.status) where.status = filters.status;
    if (filters?.search) {
      where.OR = [
        { carrierName: { contains: filters.search, mode: 'insensitive' } },
        { carrierCode: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.carrier.findMany({
      where,
      include: {
        rates: {
          take: 5,
          orderBy: { effectiveFrom: 'desc' },
        },
        contracts: {
          take: 3,
          orderBy: { startDate: 'desc' },
        },
        performanceRecords: {
          take: 5,
          orderBy: { periodEnd: 'desc' },
        },
      },
      orderBy: { carrierName: 'asc' },
    });
  }

  async getCarrierById(id: string, companyId: string) {
    return this.prisma.carrier.findFirst({
      where: { id, companyId, isActive: true },
      include: {
        rates: {
          orderBy: { effectiveFrom: 'desc' },
        },
        contracts: {
          orderBy: { startDate: 'desc' },
        },
        performanceRecords: {
          orderBy: { periodEnd: 'desc' },
        },
      },
    });
  }

  async createCarrier(data: any) {
    return this.prisma.carrier.create({ data });
  }

  async updateCarrier(id: string, companyId: string, data: any) {
    return this.prisma.carrier.update({
      where: { id },
      data,
    });
  }

  // ============================================
  // CARRIER RATES
  // ============================================

  async getCarrierRates(companyId: string, filters?: {
    carrierId?: string;
    rateType?: string;
    status?: string;
  }) {
    const where: any = { companyId, isActive: true };
    if (filters?.carrierId) where.carrierId = filters.carrierId;
    if (filters?.rateType) where.rateType = filters.rateType;
    if (filters?.status) where.status = filters.status;

    return this.prisma.carrierRate.findMany({
      where,
      include: {
        carrier: true,
      },
      orderBy: { effectiveFrom: 'desc' },
    });
  }

  async createCarrierRate(data: any) {
    return this.prisma.carrierRate.create({ data });
  }

  async updateCarrierRate(id: string, companyId: string, data: any) {
    return this.prisma.carrierRate.update({
      where: { id },
      data,
    });
  }

  // ============================================
  // CARRIER CONTRACTS
  // ============================================

  async getCarrierContracts(companyId: string, filters?: {
    carrierId?: string;
    status?: string;
  }) {
    const where: any = { companyId, isActive: true };
    if (filters?.carrierId) where.carrierId = filters.carrierId;
    if (filters?.status) where.status = filters.status;

    return this.prisma.carrierContract.findMany({
      where,
      include: {
        carrier: true,
      },
      orderBy: { startDate: 'desc' },
    });
  }

  async createCarrierContract(data: any) {
    return this.prisma.carrierContract.create({ data });
  }

  async updateCarrierContract(id: string, companyId: string, data: any) {
    return this.prisma.carrierContract.update({
      where: { id },
      data,
    });
  }

  // ============================================
  // CARRIER PERFORMANCE
  // ============================================

  async getCarrierPerformanceRecords(companyId: string, filters?: {
    carrierId?: string;
  }) {
    const where: any = { companyId, isActive: true };
    if (filters?.carrierId) where.carrierId = filters.carrierId;

    return this.prisma.carrierPerformance.findMany({
      where,
      include: {
        carrier: true,
      },
      orderBy: { periodEnd: 'desc' },
    });
  }

  async createCarrierPerformance(data: any) {
    return this.prisma.carrierPerformance.create({ data });
  }

  // ============================================
  // LOGISTICS SHIPMENTS
  // ============================================

  async getLogisticsShipments(companyId: string, filters?: {
    shipmentType?: string;
    shipmentMode?: string;
    status?: string;
    carrierId?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const where: any = { companyId, isActive: true };
    if (filters?.shipmentType) where.shipmentType = filters.shipmentType;
    if (filters?.shipmentMode) where.shipmentMode = filters.shipmentMode;
    if (filters?.status) where.status = filters.status;
    if (filters?.carrierId) where.carrierId = filters.carrierId;
    if (filters?.startDate || filters?.endDate) {
      where.createdAt = {};
      if (filters?.startDate) where.createdAt.gte = filters.startDate;
      if (filters?.endDate) where.createdAt.lte = filters.endDate;
    }

    return this.prisma.logisticsShipment.findMany({
      where,
      include: {
        items: true,
        trackingHistory: {
          take: 5,
          orderBy: { eventDateTime: 'desc' },
        },
        exceptions: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getLogisticsShipmentById(id: string, companyId: string) {
    return this.prisma.logisticsShipment.findFirst({
      where: { id, companyId, isActive: true },
      include: {
        items: true,
        trackingHistory: {
          orderBy: { eventDateTime: 'desc' },
        },
        exceptions: true,
      },
    });
  }

  async createLogisticsShipment(data: any) {
    return this.prisma.logisticsShipment.create({
      data,
      include: {
        items: true,
      },
    });
  }

  async updateLogisticsShipment(id: string, companyId: string, data: any) {
    return this.prisma.logisticsShipment.update({
      where: { id },
      data,
    });
  }

  // ============================================
  // SHIPMENT TRACKING
  // ============================================

  async getShipmentTrackingHistory(shipmentId: string, companyId: string) {
    return this.prisma.logisticsShipmentTracking.findMany({
      where: { shipmentId, companyId, isActive: true },
      orderBy: { eventDateTime: 'desc' },
    });
  }

  async addShipmentTracking(data: any) {
    return this.prisma.logisticsShipmentTracking.create({ data });
  }

  async trackShipmentByCode(trackingCode: string, companyId: string) {
    return this.prisma.logisticsShipmentTracking.findMany({
      where: { trackingCode, companyId, isActive: true },
      include: {
        shipment: true,
      },
      orderBy: { eventDateTime: 'desc' },
    });
  }

  // ============================================
  // DELIVERY EXCEPTIONS
  // ============================================

  async getDeliveryExceptions(companyId: string, filters?: {
    shipmentId?: string;
    exceptionType?: string;
    severity?: string;
    status?: string;
  }) {
    const where: any = { companyId, isActive: true };
    if (filters?.shipmentId) where.shipmentId = filters.shipmentId;
    if (filters?.exceptionType) where.exceptionType = filters.exceptionType;
    if (filters?.severity) where.severity = filters.severity;
    if (filters?.status) where.status = filters.status;

    return this.prisma.logisticsDeliveryException.findMany({
      where,
      include: {
        shipment: true,
      },
      orderBy: { exceptionDateTime: 'desc' },
    });
  }

  async createDeliveryException(data: any) {
    return this.prisma.logisticsDeliveryException.create({ data });
  }

  async updateDeliveryException(id: string, companyId: string, data: any) {
    return this.prisma.logisticsDeliveryException.update({
      where: { id },
      data,
    });
  }

  // ============================================
  // TRIP PLANNING
  // ============================================

  async getTripPlans(companyId: string, filters?: {
    tripType?: string;
    status?: string;
    vehicleId?: string;
    driverId?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const where: any = { companyId, isActive: true };
    if (filters?.tripType) where.tripType = filters.tripType;
    if (filters?.status) where.status = filters.status;
    if (filters?.vehicleId) where.vehicleId = filters.vehicleId;
    if (filters?.driverId) where.driverId = filters.driverId;
    if (filters?.startDate || filters?.endDate) {
      where.tripDate = {};
      if (filters?.startDate) where.tripDate.gte = filters.startDate;
      if (filters?.endDate) where.tripDate.lte = filters.endDate;
    }

    return this.prisma.tripPlan.findMany({
      where,
      orderBy: { tripDate: 'desc' },
    });
  }

  async getTripPlanById(id: string, companyId: string) {
    return this.prisma.tripPlan.findFirst({
      where: { id, companyId, isActive: true },
    });
  }

  async createTripPlan(data: any) {
    return this.prisma.tripPlan.create({ data });
  }

  async updateTripPlan(id: string, companyId: string, data: any) {
    return this.prisma.tripPlan.update({
      where: { id },
      data,
    });
  }

  // ============================================
  // LOAD PLANNING
  // ============================================

  async getLoadPlans(companyId: string, filters?: {
    loadType?: string;
    status?: string;
  }) {
    const where: any = { companyId, isActive: true };
    if (filters?.loadType) where.loadType = filters.loadType;
    if (filters?.status) where.status = filters.status;

    return this.prisma.loadPlan.findMany({
      where,
      orderBy: { planDate: 'desc' },
    });
  }

  async createLoadPlan(data: any) {
    return this.prisma.loadPlan.create({ data });
  }

  async updateLoadPlan(id: string, companyId: string, data: any) {
    return this.prisma.loadPlan.update({
      where: { id },
      data,
    });
  }

  // ============================================
  // DISPATCH BOARD
  // ============================================

  async getDispatchBoard(companyId: string, filters?: {
    status?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const where: any = { companyId, isActive: true };
    if (filters?.status) where.status = filters.status;
    if (filters?.startDate || filters?.endDate) {
      where.dispatchDate = {};
      if (filters?.startDate) where.dispatchDate.gte = filters.startDate;
      if (filters?.endDate) where.dispatchDate.lte = filters.endDate;
    }

    return this.prisma.dispatchBoard.findMany({
      where,
      orderBy: { dispatchDate: 'desc' },
    });
  }

  async createDispatchEntry(data: any) {
    return this.prisma.dispatchBoard.create({ data });
  }

  async updateDispatchEntry(id: string, companyId: string, data: any) {
    return this.prisma.dispatchBoard.update({
      where: { id },
      data,
    });
  }

  // ============================================
  // DOCK SCHEDULING
  // ============================================

  async getDockSchedules(companyId: string, filters?: {
    warehouseId?: string;
    dockType?: string;
    status?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const where: any = { companyId, isActive: true };
    if (filters?.warehouseId) where.warehouseId = filters.warehouseId;
    if (filters?.dockType) where.dockType = filters.dockType;
    if (filters?.status) where.status = filters.status;
    if (filters?.startDate || filters?.endDate) {
      where.scheduleDate = {};
      if (filters?.startDate) where.scheduleDate.gte = filters.startDate;
      if (filters?.endDate) where.scheduleDate.lte = filters.endDate;
    }

    return this.prisma.dockSchedule.findMany({
      where,
      orderBy: { scheduleDate: 'asc' },
    });
  }

  async createDockSchedule(data: any) {
    return this.prisma.dockSchedule.create({ data });
  }

  async updateDockSchedule(id: string, companyId: string, data: any) {
    return this.prisma.dockSchedule.update({
      where: { id },
      data,
    });
  }

  // ============================================
  // YARD MANAGEMENT
  // ============================================

  async getYardManagementRecords(companyId: string, filters?: {
    warehouseId?: string;
    status?: string;
  }) {
    const where: any = { companyId, isActive: true };
    if (filters?.warehouseId) where.warehouseId = filters.warehouseId;
    if (filters?.status) where.status = filters.status;

    return this.prisma.yardManagement.findMany({
      where,
      orderBy: { entryTime: 'desc' },
    });
  }

  async createYardEntry(data: any) {
    return this.prisma.yardManagement.create({ data });
  }

  async updateYardEntry(id: string, companyId: string, data: any) {
    return this.prisma.yardManagement.update({
      where: { id },
      data,
    });
  }

  // ============================================
  // FREIGHT QUOTES
  // ============================================

  async getFreightQuotes(companyId: string, filters?: {
    quoteStatus?: string;
    transportMode?: string;
    carrierId?: string;
  }) {
    const where: any = { companyId, isActive: true };
    if (filters?.quoteStatus) where.quoteStatus = filters.quoteStatus;
    if (filters?.transportMode) where.transportMode = filters.transportMode;
    if (filters?.carrierId) where.carrierId = filters.carrierId;

    return this.prisma.freightQuote.findMany({
      where,
      orderBy: { quoteDate: 'desc' },
    });
  }

  async getFreightQuoteById(id: string, companyId: string) {
    return this.prisma.freightQuote.findFirst({
      where: { id, companyId, isActive: true },
    });
  }

  async createFreightQuote(data: any) {
    return this.prisma.freightQuote.create({ data });
  }

  async updateFreightQuote(id: string, companyId: string, data: any) {
    return this.prisma.freightQuote.update({
      where: { id },
      data,
    });
  }

  // ============================================
  // FREIGHT BOOKINGS
  // ============================================

  async getFreightBookings(companyId: string, filters?: {
    bookingStatus?: string;
    transportMode?: string;
    carrierId?: string;
  }) {
    const where: any = { companyId, isActive: true };
    if (filters?.bookingStatus) where.bookingStatus = filters.bookingStatus;
    if (filters?.transportMode) where.transportMode = filters.transportMode;
    if (filters?.carrierId) where.carrierId = filters.carrierId;

    return this.prisma.freightBooking.findMany({
      where,
      orderBy: { bookingDate: 'desc' },
    });
  }

  async createFreightBooking(data: any) {
    return this.prisma.freightBooking.create({ data });
  }

  async updateFreightBooking(id: string, companyId: string, data: any) {
    return this.prisma.freightBooking.update({
      where: { id },
      data,
    });
  }

  // ============================================
  // FREIGHT INVOICES
  // ============================================

  async getFreightInvoices(companyId: string, filters?: {
    invoiceStatus?: string;
    carrierId?: string;
    invoiceType?: string;
  }) {
    const where: any = { companyId, isActive: true };
    if (filters?.invoiceStatus) where.invoiceStatus = filters.invoiceStatus;
    if (filters?.carrierId) where.carrierId = filters.carrierId;
    if (filters?.invoiceType) where.invoiceType = filters.invoiceType;

    return this.prisma.freightInvoice.findMany({
      where,
      orderBy: { invoiceDate: 'desc' },
    });
  }

  async createFreightInvoice(data: any) {
    return this.prisma.freightInvoice.create({ data });
  }

  async updateFreightInvoice(id: string, companyId: string, data: any) {
    return this.prisma.freightInvoice.update({
      where: { id },
      data,
    });
  }

  // ============================================
  // FREIGHT AUDIT
  // ============================================

  async getFreightAudits(companyId: string, filters?: {
    auditStatus?: string;
    invoiceId?: string;
  }) {
    const where: any = { companyId, isActive: true };
    if (filters?.auditStatus) where.auditStatus = filters.auditStatus;
    if (filters?.invoiceId) where.invoiceId = filters.invoiceId;

    return this.prisma.freightAudit.findMany({
      where,
      orderBy: { auditDate: 'desc' },
    });
  }

  async createFreightAudit(data: any) {
    return this.prisma.freightAudit.create({ data });
  }

  async updateFreightAudit(id: string, companyId: string, data: any) {
    return this.prisma.freightAudit.update({
      where: { id },
      data,
    });
  }

  // ============================================
  // GATE PASS
  // ============================================

  async getGatePasses(companyId: string, filters?: {
    gatePassType?: string;
    status?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const where: any = { companyId, isActive: true };
    if (filters?.gatePassType) where.gatePassType = filters.gatePassType;
    if (filters?.status) where.status = filters.status;
    if (filters?.startDate || filters?.endDate) {
      where.gatePassDate = {};
      if (filters?.startDate) where.gatePassDate.gte = filters.startDate;
      if (filters?.endDate) where.gatePassDate.lte = filters.endDate;
    }

    return this.prisma.gatePass.findMany({
      where,
      include: {
        items: true,
      },
      orderBy: { gatePassDate: 'desc' },
    });
  }

  async getGatePassById(id: string, companyId: string) {
    return this.prisma.gatePass.findFirst({
      where: { id, companyId, isActive: true },
      include: {
        items: true,
      },
    });
  }

  async createGatePass(data: any) {
    return this.prisma.gatePass.create({
      data,
      include: {
        items: true,
      },
    });
  }

  async updateGatePass(id: string, companyId: string, data: any) {
    return this.prisma.gatePass.update({
      where: { id },
      data,
    });
  }

  // ============================================
  // LOGISTICS SETTINGS
  // ============================================

  async getLogisticsSettings(companyId: string) {
    return this.prisma.logisticsSettings.findFirst({
      where: { companyId },
    });
  }

  async createOrUpdateLogisticsSettings(companyId: string, data: any) {
    const existing = await this.prisma.logisticsSettings.findFirst({
      where: { companyId },
    });

    if (existing) {
      return this.prisma.logisticsSettings.update({
        where: { id: existing.id },
        data,
      });
    }

    return this.prisma.logisticsSettings.create({
      data: { ...data, companyId },
    });
  }

  // ============================================
  // DASHBOARD & ANALYTICS
  // ============================================

  async getLogisticsDashboard(companyId: string) {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [
      totalShipments,
      pendingShipments,
      inTransitShipments,
      deliveredShipments,
      activeVehicles,
      activeDrivers,
      activeCarriers,
      openExceptions,
      pendingGatePasses,
    ] = await Promise.all([
      this.prisma.logisticsShipment.count({ where: { companyId, isActive: true } }),
      this.prisma.logisticsShipment.count({ where: { companyId, isActive: true, status: 'created' } }),
      this.prisma.logisticsShipment.count({ where: { companyId, isActive: true, status: 'in_transit' } }),
      this.prisma.logisticsShipment.count({ where: { companyId, isActive: true, status: 'delivered', actualDeliveryDate: { gte: startOfMonth } } }),
      this.prisma.vehicle.count({ where: { companyId, isActive: true, currentStatus: 'available' } }),
      this.prisma.driver.count({ where: { companyId, isActive: true, status: 'available' } }),
      this.prisma.carrier.count({ where: { companyId, isActive: true, status: 'active' } }),
      this.prisma.logisticsDeliveryException.count({ where: { companyId, isActive: true, status: 'open' } }),
      this.prisma.gatePass.count({ where: { companyId, isActive: true, status: 'pending' } }),
    ]);

    return {
      summary: {
        totalShipments,
        pendingShipments,
        inTransitShipments,
        deliveredThisMonth: deliveredShipments,
        activeVehicles,
        activeDrivers,
        activeCarriers,
        openExceptions,
        pendingGatePasses,
      },
    };
  }

  async getDeliveryPerformanceReport(companyId: string, startDate: Date, endDate: Date) {
    const shipments = await this.prisma.logisticsShipment.findMany({
      where: {
        companyId,
        isActive: true,
        actualDeliveryDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        id: true,
        shipmentCode: true,
        scheduledDeliveryDate: true,
        actualDeliveryDate: true,
        hasException: true,
        exceptionRemarks: true,
        carrierId: true,
        carrierName: true,
      },
    });

    const totalDeliveries = shipments.length;
    const onTimeDeliveries = shipments.filter(s => !s.hasException).length;
    const delayedDeliveries = shipments.filter(s => s.hasException).length;
    const onTimePercentage = totalDeliveries > 0 ? (onTimeDeliveries / totalDeliveries) * 100 : 0;

    return {
      period: { startDate, endDate },
      metrics: {
        totalDeliveries,
        onTimeDeliveries,
        delayedDeliveries,
        onTimePercentage: Math.round(onTimePercentage * 100) / 100,
      },
      byCarrier: this.groupBy(shipments, 'carrierName'),
    };
  }

  async getFreightSpendAnalysis(companyId: string, startDate: Date, endDate: Date) {
    const invoices = await this.prisma.freightInvoice.findMany({
      where: {
        companyId,
        isActive: true,
        invoiceDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        totalAmount: true,
        partyId: true,
        partyName: true,
        partyType: true,
      },
    });

    const totalSpend = invoices.reduce((sum, inv) => sum + (Number(inv.totalAmount) || 0), 0);
    const byParty = this.groupBySum(invoices, 'partyName', 'totalAmount');
    const byPartyType = this.groupBySum(invoices, 'partyType', 'totalAmount');

    return {
      period: { startDate, endDate },
      totalSpend,
      byParty,
      byPartyType,
      invoiceCount: invoices.length,
    };
  }

  // Helper functions
  private groupBy(array: any[], key: string) {
    return array.reduce((result, item) => {
      const keyValue = item[key] || 'Unknown';
      result[keyValue] = (result[keyValue] || 0) + 1;
      return result;
    }, {});
  }

  private groupBySum(array: any[], groupKey: string, sumKey: string) {
    return array.reduce((result, item) => {
      const keyValue = item[groupKey] || 'Unknown';
      result[keyValue] = (result[keyValue] || 0) + (Number(item[sumKey]) || 0);
      return result;
    }, {});
  }
}
