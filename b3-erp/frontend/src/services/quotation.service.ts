import { apiClient } from './api/client';

// ============== Interfaces ==============

export interface QuotationItem {
  id: string;
  productId: string;
  productCode: string;
  productName: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  unitCost: number;
  discount: number;
  tax: number;
  totalPrice: number;
  uom: string;
  leadTime?: number;
  notes?: string;
  marginPercentage?: number;
}

export interface Quotation {
  id: string;
  quotationNumber: string;
  customerId: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  contactPerson?: string;
  rfqId?: string;
  rfqNumber?: string;
  quotationDate: string;
  validUntil: string;
  status: 'Draft' | 'Sent' | 'Under Review' | 'Accepted' | 'Rejected' | 'Expired' | 'Converted';
  marginStatus: 'Healthy' | 'Warning' | 'Critical';
  revision: number;
  items: QuotationItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  currency: string;
  exchangeRate: number;
  paymentTerms: string;
  deliveryTerms: string;
  warranty?: string;
  salesPersonId?: string;
  salesPersonName?: string;
  approvedBy?: string;
  approvedAt?: string;
  convertedToOrderId?: string;
  convertedToOrderNumber?: string;
  notes?: string;
  termsAndConditions?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateQuotationDto {
  customerId: string;
  customerName: string;
  rfqId?: string;
  quotationDate: string;
  validUntil: string;
  status: Quotation['status'];
  currency: string;
  exchangeRate: number;
  items: {
    productId: string;
    productCode: string;
    productName: string;
    description?: string;
    quantity: number;
    unitPrice: number;
    discountPercentage: number;
    taxRate: number;
  }[];
  paymentTerms: string;
  deliveryTerms: string;
  warranty?: string;
  notes?: string;
  termsAndConditions?: string;
  salesPersonId?: string;
}

export interface UpdateQuotationDto extends Partial<CreateQuotationDto> {
  status?: Quotation['status'];
}

export interface QuotationFilters {
  search?: string;
  status?: Quotation['status'];
  customerId?: string;
  salesPersonId?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ============== Mock Data ==============

// ============== Mock Data ==============

const USE_MOCK_DATA = false;

// ... (MOCK_QUOTATIONS remains for reference if needed, but not used)

// ============== Service Class ==============

class QuotationService {
  private buildQueryParams(filters?: QuotationFilters): string {
    if (!filters) return '';
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.status) params.append('status', filters.status);
    if (filters.customerId) params.append('customerId', filters.customerId);
    if (filters.salesPersonId) params.append('salesPersonId', filters.salesPersonId);
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    return params.toString();
  }

  async getAllQuotations(filters?: QuotationFilters): Promise<{ data: Quotation[]; total: number }> {
    if (USE_MOCK_DATA) {
      // ... mock implementation
      return { data: [], total: 0 };
    }

    const queryString = this.buildQueryParams(filters);
    const response = await apiClient.get<Quotation[]>(
      `/sales/quotations${queryString ? `?${queryString}` : ''}`
    );
    return { data: response.data, total: response.data.length };
  }

  async getQuotationById(id: string): Promise<Quotation> {
    if (USE_MOCK_DATA) {
      // ... mock implementation
      throw new Error('Mock not implemented');
    }

    const response = await apiClient.get<Quotation>(`/sales/quotations/${id}`);
    return response.data;
  }

  async createQuotation(data: CreateQuotationDto): Promise<Quotation> {
    if (USE_MOCK_DATA) {
      // ... mock implementation
      throw new Error('Mock not implemented');
    }

    const response = await apiClient.post<Quotation>('/sales/quotations', data);
    return response.data;
  }

  async updateQuotation(id: string, data: UpdateQuotationDto): Promise<Quotation> {
    if (USE_MOCK_DATA) {
      // ... mock implementation
      throw new Error('Mock not implemented');
    }

    const response = await apiClient.put<Quotation>(`/sales/quotations/${id}`, data);
    return response.data;
  }

  async sendQuotation(id: string): Promise<Quotation> {
    if (USE_MOCK_DATA) {
      // ... mock implementation
      throw new Error('Mock not implemented');
    }

    const response = await apiClient.post<Quotation>(`/sales/quotations/${id}/send`, {});
    return response.data;
  }

  async convertToOrder(id: string): Promise<{ quotation: Quotation; orderId: string }> {
    if (USE_MOCK_DATA) {
      // ... mock implementation
      throw new Error('Mock not implemented');
    }

    const response = await apiClient.post<{ quotation: Quotation; orderId: string }>(
      `/sales/quotations/${id}/convert`,
      {}
    );
    return response.data;
  }

  async duplicateQuotation(id: string): Promise<Quotation> {
    if (USE_MOCK_DATA) {
      // ... mock implementation
      throw new Error('Mock not implemented');
    }

    const response = await apiClient.post<Quotation>(`/sales/quotations/${id}/duplicate`, {});
    return response.data;
  }
}

export const quotationService = new QuotationService();
