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
  ],
})
export class InventoryModule {}
