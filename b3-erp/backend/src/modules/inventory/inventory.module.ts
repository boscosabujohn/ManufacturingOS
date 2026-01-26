import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkflowModule } from '../workflow/workflow.module';

// Entities
import {
  Warehouse,
  StockLocation,
  StockEntry,
  StockEntryLine,
  StockBalance,
  StockTransfer,
  StockTransferLine,
  StockAdjustment,
  StockAdjustmentLine,
  SerialNumber,
  BatchNumber,
  AdjustmentReason,
} from './entities';

// Controllers
import {
  WarehouseController,
  StockLocationController,
  StockEntryController,
  StockBalanceController,
  StockTransferController,
  StockAdjustmentController,
  SerialNumberController,
  BatchNumberController,
  ReorderManagementController,
} from './controllers';

// Services
import {
  WarehouseService,
  StockLocationService,
  StockEntryService,
  StockBalanceService,
  StockTransferService,
  StockAdjustmentService,
  SerialNumberService,
  BatchNumberService,
  WarehouseSeederService,
  StockLocationSeederService,
  AdjustmentReasonSeederService,
} from './services';
import { ReorderManagementService } from './services/reorder-management.service';
import { StorageLocationService as StorageLocationClassificationService } from './services/storage-location.service';
import { PutawayStrategyService } from './services/putaway-strategy.service';
import { VEDAnalysisService } from './services/ved-analysis.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Warehouse,
      StockLocation,
      StockEntry,
      StockEntryLine,
      StockBalance,
      StockTransfer,
      StockTransferLine,
      StockAdjustment,
      StockAdjustmentLine,
      SerialNumber,
      BatchNumber,
      AdjustmentReason,
    ]),
    WorkflowModule,
  ],
  controllers: [
    WarehouseController,
    StockLocationController,
    StockEntryController,
    StockBalanceController,
    StockTransferController,
    StockAdjustmentController,
    SerialNumberController,
    BatchNumberController,
    ReorderManagementController,
  ],
  providers: [
    WarehouseService,
    StockLocationService,
    StockEntryService,
    StockBalanceService,
    StockTransferService,
    StockAdjustmentService,
    SerialNumberService,
    BatchNumberService,
    ReorderManagementService,
    StorageLocationClassificationService,
    PutawayStrategyService,
    VEDAnalysisService,
    WarehouseSeederService,
    StockLocationSeederService,
    AdjustmentReasonSeederService,
  ],
  exports: [
    WarehouseService,
    StockLocationService,
    StockEntryService,
    StockBalanceService,
    StockTransferService,
    StockAdjustmentService,
    SerialNumberService,
    BatchNumberService,
    ReorderManagementService,
    StorageLocationClassificationService,
    PutawayStrategyService,
    VEDAnalysisService,
    WarehouseSeederService,
    StockLocationSeederService,
    AdjustmentReasonSeederService,
  ],
})
export class InventoryModule { }
