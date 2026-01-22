// API Client
export { apiClient } from './client';

// Legacy APIs
export { projectFinancialsApi } from './projectFinancials';
export { taSettlementApi } from './taSettlement';
export { emergencySparesApi } from './emergencySpares';
export { diesToolsApi } from './diesTools';
export { gatePassApi } from './gatePass';

// Finance Module
export {
  invoiceService,
  paymentService,
  journalEntryService,
  chartOfAccountsService,
  financialReportsService,
} from './finance';

// HR Module
export {
  employeeService,
  departmentService,
  designationService,
  leaveTypeService,
  leaveApplicationService,
  leaveBalanceService,
  attendanceService,
  shiftService,
  payrollService,
} from './hr';

// Production Module
export {
  workCenterService,
  operationService,
  bomService,
  routingService,
  productionPlanService,
  workOrderService,
  productionEntryService,
  shopFloorService,
} from './production';

// Logistics Module
export {
  shipmentService,
  deliveryNoteService,
  vehicleService,
  driverService,
  routeService,
  tripService,
  freightChargeService,
} from './logistics';

// Quality Module
export {
  inspectionService,
  inspectionTemplateService,
  ncrService,
  capaService,
  auditService,
} from './quality';

// Procurement Module
export {
  purchaseOrderService,
  purchaseRequisitionService,
  goodsReceiptService,
  purchaseInvoiceService,
  purchaseReturnService,
} from './procurement';

// Inventory Module
export {
  stockService,
  stockMovementService,
  warehouseService,
  locationService,
  stockTransferService,
  stockAdjustmentService,
  cycleCountService,
  inventoryReportsService,
} from './inventory';

// Legacy Types
export type { IoEData } from './projectFinancials';
export type { TAClaim } from './taSettlement';
export type { EmergencySpareRequest } from './emergencySpares';
export type { DiesTool } from './diesTools';
export type { GatePass } from './gatePass';
