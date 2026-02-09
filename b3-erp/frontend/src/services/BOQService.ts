
import axiosInstance from '@/lib/api-client';

export interface BOQItem {
    id: string;
    description: string;
    quantity: number;
    unit: string;
    rate: number;
    amount: number;
    category?: string;
    specifications?: string;
    itemId?: string;
    itemCode?: string;
    itemName?: string;
}

export interface BOQ {
    id: string;
    projectId: string;
    name: string;
    status: 'draft' | 'pending_approval' | 'approved' | 'rejected';
    totalAmount: number;
    items: BOQItem[];
    createdAt: string;
    updatedAt: string;
}

class BOQService {
    async create(data: Partial<BOQ>): Promise<BOQ> {
        const response = await axiosInstance.post('/api/boq', data);
        return response.data;
    }

    async getProjectBOQs(projectId: string): Promise<BOQ[]> {
        const response = await axiosInstance.get(`/api/boq/project/${projectId}`);
        return response.data;
    }

    async getBOQ(id: string): Promise<BOQ> {
        const response = await axiosInstance.get(`/api/boq/${id}`);
        return response.data;
    }

    async addItem(boqId: string, item: Partial<BOQItem>): Promise<BOQItem> {
        const response = await axiosInstance.post(`/api/boq/${boqId}/items`, item);
        return response.data;
    }

    async updateItem(itemId: string, item: Partial<BOQItem>): Promise<BOQItem> {
        const response = await axiosInstance.put(`/api/boq/items/${itemId}`, item);
        return response.data;
    }

    async removeItem(itemId: string): Promise<void> {
        await axiosInstance.delete(`/api/boq/items/${itemId}`);
    }

    async syncWithInventory(boqId: string): Promise<BOQItem[]> {
        const response = await axiosInstance.post(`/api/boq/${boqId}/sync-inventory`);
        return response.data;
    }

    async bulkCreateItems(boqId: string, items: Partial<BOQItem>[]): Promise<BOQItem[]> {
        const response = await axiosInstance.post(`/api/boq/${boqId}/bulk-items`, items);
        return response.data;
    }

    async parseBOQFile(file: File): Promise<Partial<BOQItem>[]> {
        const formData = new FormData();
        formData.append('file', file);
        const response = await axiosInstance.post('/api/boq/parse', formData, {
            headers: { 'Content-Type': 'multipart/form-data ' }
        });
        return response.data;
    }
}

export const boqService = new BOQService();
