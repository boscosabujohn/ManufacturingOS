import { apiClient } from './api/client';

export interface Vendor {
    id: string;
    vendorCode: string;
    vendorName: string;
    contactPerson: string;
    email: string;
    phone: string;
    address: string;
    taxId?: string;
    paymentTerms?: string;
    currency: string;
    status: 'Active' | 'Inactive' | 'Blacklisted';
    vendorType: 'Manufacturer' | 'Distributor' | 'Service Provider';
    category: string;
    isApproved: boolean;
    approvedBy?: string;
    approvedAt?: string;
    qualityRating: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'No Rating';
    deliveryRating: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'No Rating';
    priceRating: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'No Rating';
    overallRating: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'No Rating';
    averageRating: number;
    totalPurchases: number;
    lastPurchaseDate?: string;
    lastPurchaseAmount?: number;
    outstandingPayables: number;
    paymentStatus: 'Clear' | 'Outstanding' | 'Unknown';
}

export interface VendorEvaluation {
    id: string;
    evaluationNumber: string;
    evaluationDate: string;
    vendorName: string;
    evaluationPeriod: string;
    overallScore: number;
    performanceGrade: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D' | 'F';
    status: 'Draft' | 'Submitted' | 'Approved' | 'Rejected';
    isApproved: boolean;
    createdAt: string;
}

export interface CreateVendorDto {
    vendorCode: string;
    vendorName: string;
    contactPerson: string;
    email: string;
    phone: string;
    address: string;
    taxId?: string;
    paymentTerms?: string;
    currency: string;
    vendorType: string;
    category: string;
}

export interface UpdateVendorDto extends Partial<CreateVendorDto> {
    status?: 'Active' | 'Inactive' | 'Blacklisted';
}

export const vendorService = {
    // Vendor Management
    async getVendors(filters?: any): Promise<{ data: Vendor[]; total: number }> {
        const params = new URLSearchParams(filters);
        const response = await apiClient.get<{ data: Vendor[]; total: number }>(`/vendors?${params.toString()}`);
        return response.data;
    },

    async getVendorById(id: string): Promise<Vendor> {
        const response = await apiClient.get<Vendor>(`/vendors/${id}`);
        return response.data;
    },

    async createVendor(data: CreateVendorDto): Promise<Vendor> {
        const response = await apiClient.post<Vendor>('/vendors', data);
        return response.data;
    },

    async updateVendor(id: string, data: UpdateVendorDto): Promise<Vendor> {
        const response = await apiClient.put<Vendor>(`/vendors/${id}`, data);
        return response.data;
    },

    async deleteVendor(id: string): Promise<void> {
        await apiClient.delete(`/vendors/${id}`);
    },

    async approveVendor(id: string): Promise<Vendor> {
        const response = await apiClient.post<Vendor>(`/vendors/${id}/approve`, {});
        return response.data;
    },

    // Vendor Evaluation
    async getEvaluations(filters?: any): Promise<VendorEvaluation[]> {
        const params = new URLSearchParams(filters);
        const response = await apiClient.get<VendorEvaluation[]>(`/vendor-evaluations?${params.toString()}`);
        return response.data;
    },

    async getEvaluationById(id: string): Promise<VendorEvaluation> {
        const response = await apiClient.get<VendorEvaluation>(`/vendor-evaluations/${id}`);
        return response.data;
    },

    async createEvaluation(data: any): Promise<VendorEvaluation> {
        const response = await apiClient.post<VendorEvaluation>('/vendor-evaluations', data);
        return response.data;
    },

    async updateEvaluation(id: string, data: any): Promise<VendorEvaluation> {
        const response = await apiClient.put<VendorEvaluation>(`/vendor-evaluations/${id}`, data);
        return response.data;
    },

    async approveEvaluation(id: string): Promise<VendorEvaluation> {
        const response = await apiClient.post<VendorEvaluation>(`/vendor-evaluations/${id}/approve`, {});
        return response.data;
    },

    async getVendorPerformanceReport(vendorId: string): Promise<any> {
        const response = await apiClient.get<any>(`/vendor-evaluations/report/${vendorId}`);
        return response.data;
    }
};
