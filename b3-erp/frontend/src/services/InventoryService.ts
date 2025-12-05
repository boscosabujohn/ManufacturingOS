import { apiClient } from './api/client';

export interface StockBalance {
    id: string;
    itemId: string;
    itemCode: string;
    itemName: string;
    warehouseId: string;
    warehouseName: string;
    locationId?: string;
    locationName?: string;
    availableQuantity: number;
    reservedQuantity: number;
    freeQuantity: number;
    uom: string;
    stockValue: number;
    reorderLevel: number;
    reorderQuantity: number;
    belowReorderLevel: boolean;
    lastUpdated: string;
}

export interface RealTimeBalance {
    itemId: string;
    warehouseId: string;
    totalAvailable: number;
    totalReserved: number;
    totalFree: number;
    locations: {
        locationId: string;
        locationName: string;
        available: number;
        reserved: number;
        free: number;
    }[];
}

export interface AgingReport {
    reportDate: string;
    warehouseId?: string;
    agingBuckets: {
        range: string;
        count: number;
        value: number;
    }[];
}

export interface ABCAnalysis {
    reportDate: string;
    warehouseId?: string;
    aClass: { count: number; value: number; percentage: number };
    bClass: { count: number; value: number; percentage: number };
    cClass: { count: number; value: number; percentage: number };
}

export interface ValuationReport {
    reportDate: string;
    warehouseId?: string;
    totalValue: number;
    itemCount: number;
    byCategory: any[];
}

export interface ReorderAnalysis {
    reportDate: string;
    warehouseId?: string;
    itemsBelowReorder: {
        itemId: string;
        itemCode: string;
        itemName: string;
        currentQuantity: number;
        reorderLevel: number;
        reorderQuantity: number;
        shortage: number;
    }[];
}

class InventoryService {
    async getStockBalances(filters?: { itemId?: string; warehouseId?: string; locationId?: string }): Promise<StockBalance[]> {
        const params = new URLSearchParams();
        if (filters?.itemId) params.append('itemId', filters.itemId);
        if (filters?.warehouseId) params.append('warehouseId', filters.warehouseId);
        if (filters?.locationId) params.append('locationId', filters.locationId);

        const response = await apiClient.get<StockBalance[]>(`/inventory/stock-balances?${params.toString()}`);
        return response.data || [];
    }

    async getRealTimeBalance(itemId: string, warehouseId: string): Promise<RealTimeBalance> {
        const params = new URLSearchParams({ itemId, warehouseId });
        const response = await apiClient.get<RealTimeBalance>(`/inventory/stock-balances/real-time?${params.toString()}`);
        return response.data;
    }

    async getAgingReport(warehouseId?: string): Promise<AgingReport> {
        const params = new URLSearchParams();
        if (warehouseId) params.append('warehouseId', warehouseId);
        const response = await apiClient.get<AgingReport>(`/inventory/stock-balances/aging-report?${params.toString()}`);
        return response.data;
    }

    async getABCAnalysis(warehouseId?: string): Promise<ABCAnalysis> {
        const params = new URLSearchParams();
        if (warehouseId) params.append('warehouseId', warehouseId);
        const response = await apiClient.get<ABCAnalysis>(`/inventory/stock-balances/abc-analysis?${params.toString()}`);
        return response.data;
    }

    async getValuationReport(warehouseId?: string, asOfDate?: string): Promise<ValuationReport> {
        const params = new URLSearchParams();
        if (warehouseId) params.append('warehouseId', warehouseId);
        if (asOfDate) params.append('asOfDate', asOfDate);
        const response = await apiClient.get<ValuationReport>(`/inventory/stock-balances/valuation-report?${params.toString()}`);
        return response.data;
    }

    async getReorderAnalysis(warehouseId?: string): Promise<ReorderAnalysis> {
        const params = new URLSearchParams();
        if (warehouseId) params.append('warehouseId', warehouseId);
        const response = await apiClient.get<ReorderAnalysis>(`/inventory/stock-balances/reorder-analysis?${params.toString()}`);
        return response.data;
    }

    async getReorderSuggestions(): Promise<any[]> {
        const response = await apiClient.get<any[]>('/inventory/reorder/suggestions');
        return response.data;
    }

    async approveReorderSuggestion(id: string, approvedBy: string, quantity?: number): Promise<any> {
        const response = await apiClient.post<any>(`/inventory/reorder/suggestions/${id}/approve`, { approvedBy, quantity });
        return response.data;
    }

    async createPurchaseRequisition(suggestionId: string): Promise<{ prId: string }> {
        const response = await apiClient.post<{ prId: string }>(`/inventory/reorder/suggestions/${suggestionId}/create-pr`, {});
        return response.data;
    }
}

export const inventoryService = new InventoryService();
