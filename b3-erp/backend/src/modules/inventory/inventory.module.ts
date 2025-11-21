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
  ],
})
export class InventoryModule {}
