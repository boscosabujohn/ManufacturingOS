import {
    StockEntry,
    StockEntryLine,
    StockEntryStatus,
    StockEntryType,
    MovementDirection
} from '../../src/modules/inventory/entities/stock-entry.entity';
import { StockBalance } from '../../src/modules/inventory/entities/stock-balance.entity';

export class InventoryFactory {
    private static entryCounter = 0;
    private static lineCounter = 0;

    static createStockEntry(overrides: Partial<StockEntry> = {}): StockEntry {
        this.entryCounter++;
        const entry = new StockEntry();
        entry.id = overrides.id || `entry-uuid-${this.entryCounter}`;
        entry.entryNumber = overrides.entryNumber || `SE-2026-${this.entryCounter.toString().padStart(6, '0')}`;
        entry.entryType = overrides.entryType || StockEntryType.MATERIAL_RECEIPT;
        entry.status = overrides.status || StockEntryStatus.DRAFT;
        entry.postingDate = overrides.postingDate || new Date();
        entry.isPosted = overrides.isPosted || false;
        entry.totalValue = overrides.totalValue || 0;
        entry.lines = overrides.lines || [];

        return Object.assign(entry, overrides);
    }

    static createStockEntryLine(overrides: Partial<StockEntryLine> = {}): StockEntryLine {
        this.lineCounter++;
        const line = new StockEntryLine();
        line.id = overrides.id || `line-uuid-${this.lineCounter}`;
        line.itemId = overrides.itemId || `item-uuid-${this.lineCounter}`;
        line.itemCode = overrides.itemCode || `ITEM-${this.lineCounter}`;
        line.itemName = overrides.itemName || `Test Item ${this.lineCounter}`;
        line.quantity = overrides.quantity || 10;
        line.rate = overrides.rate || 5;
        line.amount = line.quantity * line.rate;
        line.uom = overrides.uom || 'PCS';

        return Object.assign(line, overrides);
    }

    static createStockBalance(overrides: Partial<StockBalance> = {}): StockBalance {
        const balance = new StockBalance();
        balance.id = overrides.id || `balance-uuid-${Math.random().toString(36).substr(2, 9)}`;
        balance.itemId = overrides.itemId || 'item-uuid-1';
        balance.warehouseId = overrides.warehouseId || 'wh-1';
        balance.availableQuantity = overrides.availableQuantity || 0;
        balance.totalQuantity = overrides.totalQuantity || 0;
        balance.valuationRate = overrides.valuationRate || 0;
        balance.stockValue = balance.availableQuantity * balance.valuationRate;

        return Object.assign(balance, overrides);
    }

    static resetCounters() {
        this.entryCounter = 0;
        this.lineCounter = 0;
    }
}
