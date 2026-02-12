import { apiClient } from './api/client';

// ==================== TypeScript Interfaces ====================

export type CostEstimateStatus =
  | 'Draft'
  | 'Pending Approval'
  | 'Approved'
  | 'Rejected'
  | 'Converted to Order';

export type CostEstimateType = 'Preliminary' | 'Detailed' | 'Final' | 'Revised';

export interface CostEstimate {
  id: string;
  companyId: string;
  estimateNumber: string;
  title: string;
  description?: string;
  boqId?: string;
  projectId?: string;
  customerId?: string;
  customerName?: string;
  estimateType: CostEstimateType;
  status: CostEstimateStatus;
  version: number;
  currency: string;
  materialCost: number;
  laborCost: number;
  overheadCost: number;
  equipmentCost: number;
  subcontractorCost: number;
  directCost: number;
  indirectCost: number;
  contingency: number;
  contingencyPercentage: number;
  totalCost: number;
  estimateDate?: string;
  validUntil?: string;
  submittedBy?: string;
  submittedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  approvalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CostEstimateItem {
  id: string;
  costEstimateId: string;
  itemNumber: string;
  description: string;
  category: string;
  costType: 'Material' | 'Labor' | 'Equipment' | 'Overhead' | 'Subcontractor';
  unit: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  notes?: string;
}

export interface CostBreakdown {
  materialCost: number;
  laborCost: number;
  equipmentCost: number;
  overheadCost: number;
  subcontractorCost: number;
  directCost: number;
  indirectCost: number;
  contingency: number;
  totalCost: number;
  breakdown: { category: string; amount: number; percentage: number }[];
}

// ==================== Mock Data ====================

const MOCK_COST_ESTIMATES: CostEstimate[] = [
  {
    id: 'est-001',
    companyId: 'company-001',
    estimateNumber: 'EST-2025-00001',
    title: 'Office Building Cost Estimate',
    description: 'Detailed cost estimate for ABC Corporation office building',
    customerId: 'cust-001',
    customerName: 'ABC Corporation',
    estimateType: 'Detailed',
    status: 'Approved',
    version: 1,
    currency: 'USD',
    materialCost: 1200000,
    laborCost: 650000,
    overheadCost: 185000,
    equipmentCost: 180000,
    subcontractorCost: 150000,
    directCost: 2180000,
    indirectCost: 185000,
    contingency: 118250,
    contingencyPercentage: 5,
    totalCost: 2483250,
    estimateDate: '2025-01-15',
    validUntil: '2025-04-15',
    approvedBy: 'user-002',
    approvedAt: '2025-01-20T14:30:00Z',
    createdAt: '2025-01-10T09:00:00Z',
    updatedAt: '2025-01-20T14:30:00Z',
  },
  {
    id: 'est-002',
    companyId: 'company-001',
    estimateNumber: 'EST-2025-00002',
    title: 'Warehouse Renovation Estimate',
    description: 'Cost estimate for XYZ Logistics warehouse renovation',
    customerId: 'cust-002',
    customerName: 'XYZ Logistics',
    estimateType: 'Preliminary',
    status: 'Pending Approval',
    version: 1,
    currency: 'USD',
    materialCost: 380000,
    laborCost: 220000,
    overheadCost: 60000,
    equipmentCost: 95000,
    subcontractorCost: 45000,
    directCost: 740000,
    indirectCost: 60000,
    contingency: 56000,
    contingencyPercentage: 7,
    totalCost: 856000,
    estimateDate: '2025-01-28',
    validUntil: '2025-03-28',
    submittedBy: 'user-001',
    submittedAt: '2025-01-30T10:00:00Z',
    createdAt: '2025-01-25T08:00:00Z',
    updatedAt: '2025-01-30T10:00:00Z',
  },
  {
    id: 'est-003',
    companyId: 'company-001',
    estimateNumber: 'EST-2025-00003',
    title: 'Shopping Mall Interior Estimate',
    description: 'Detailed estimate for Retail Partners mall interior project',
    customerId: 'cust-003',
    customerName: 'Retail Partners Inc',
    estimateType: 'Detailed',
    status: 'Draft',
    version: 1,
    currency: 'USD',
    materialCost: 2100000,
    laborCost: 980000,
    overheadCost: 308000,
    equipmentCost: 420000,
    subcontractorCost: 280000,
    directCost: 3780000,
    indirectCost: 308000,
    contingency: 204400,
    contingencyPercentage: 5,
    totalCost: 4292400,
    estimateDate: '2025-02-05',
    validUntil: '2025-05-05',
    createdAt: '2025-02-01T08:00:00Z',
    updatedAt: '2025-02-05T16:00:00Z',
  },
];

// ==================== Service Class ====================

class CostEstimateService {
  private baseUrl = '/estimation/cost-estimates';

  async create(
    companyId: string,
    data: Partial<CostEstimate>,
    items?: Partial<CostEstimateItem>[]
  ): Promise<CostEstimate> {
    try {
      const response = await apiClient.post<CostEstimate>(this.baseUrl, {
        estimate: data,
        items,
      });
      return response.data;
    } catch (error) {
      console.error('API Error creating cost estimate, using mock data:', error);
      const newEstimate: CostEstimate = {
        id: `est-${Date.now()}`,
        companyId,
        estimateNumber: `EST-2025-${String(MOCK_COST_ESTIMATES.length + 1).padStart(5, '0')}`,
        title: data.title || 'New Cost Estimate',
        estimateType: data.estimateType || 'Preliminary',
        status: 'Draft',
        version: 1,
        currency: data.currency || 'USD',
        materialCost: 0,
        laborCost: 0,
        overheadCost: 0,
        equipmentCost: 0,
        subcontractorCost: 0,
        directCost: 0,
        indirectCost: 0,
        contingency: 0,
        contingencyPercentage: 5,
        totalCost: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...data,
      };
      MOCK_COST_ESTIMATES.push(newEstimate);
      return newEstimate;
    }
  }

  async findAll(
    companyId: string,
    filters?: {
      status?: CostEstimateStatus;
      customerId?: string;
      fromDate?: string;
      toDate?: string;
    }
  ): Promise<CostEstimate[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.customerId) params.append('customerId', filters.customerId);
      if (filters?.fromDate) params.append('fromDate', filters.fromDate);
      if (filters?.toDate) params.append('toDate', filters.toDate);

      const response = await apiClient.get<CostEstimate[]>(
        `${this.baseUrl}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      console.error('API Error fetching cost estimates, using mock data:', error);
      let result = MOCK_COST_ESTIMATES.filter((e) => e.companyId === companyId);
      if (filters?.status) {
        result = result.filter((e) => e.status === filters.status);
      }
      if (filters?.customerId) {
        result = result.filter((e) => e.customerId === filters.customerId);
      }
      return result;
    }
  }

  async findOne(companyId: string, id: string): Promise<CostEstimate> {
    try {
      const response = await apiClient.get<CostEstimate>(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error('API Error fetching cost estimate, using mock data:', error);
      const estimate = MOCK_COST_ESTIMATES.find((e) => e.id === id);
      if (!estimate) throw new Error(`Cost Estimate with ID ${id} not found`);
      return estimate;
    }
  }

  async getCostBreakdown(companyId: string, id: string): Promise<CostBreakdown> {
    try {
      const response = await apiClient.get<CostBreakdown>(
        `${this.baseUrl}/${id}/cost-breakdown`
      );
      return response.data;
    } catch (error) {
      console.error('API Error fetching cost breakdown, using mock data:', error);
      const estimate = MOCK_COST_ESTIMATES.find((e) => e.id === id);
      if (!estimate) throw new Error(`Cost Estimate with ID ${id} not found`);

      const totalCost = estimate.totalCost || 1;
      return {
        materialCost: estimate.materialCost,
        laborCost: estimate.laborCost,
        equipmentCost: estimate.equipmentCost,
        overheadCost: estimate.overheadCost,
        subcontractorCost: estimate.subcontractorCost,
        directCost: estimate.directCost,
        indirectCost: estimate.indirectCost,
        contingency: estimate.contingency,
        totalCost: estimate.totalCost,
        breakdown: [
          {
            category: 'Material',
            amount: estimate.materialCost,
            percentage: (estimate.materialCost / totalCost) * 100,
          },
          {
            category: 'Labor',
            amount: estimate.laborCost,
            percentage: (estimate.laborCost / totalCost) * 100,
          },
          {
            category: 'Equipment',
            amount: estimate.equipmentCost,
            percentage: (estimate.equipmentCost / totalCost) * 100,
          },
          {
            category: 'Overhead',
            amount: estimate.overheadCost,
            percentage: (estimate.overheadCost / totalCost) * 100,
          },
          {
            category: 'Subcontractor',
            amount: estimate.subcontractorCost,
            percentage: (estimate.subcontractorCost / totalCost) * 100,
          },
          {
            category: 'Contingency',
            amount: estimate.contingency,
            percentage: (estimate.contingency / totalCost) * 100,
          },
        ],
      };
    }
  }

  async update(
    companyId: string,
    id: string,
    data: Partial<CostEstimate>
  ): Promise<CostEstimate> {
    try {
      const response = await apiClient.patch<CostEstimate>(`${this.baseUrl}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('API Error updating cost estimate, using mock data:', error);
      const index = MOCK_COST_ESTIMATES.findIndex((e) => e.id === id);
      if (index === -1) throw new Error(`Cost Estimate with ID ${id} not found`);
      MOCK_COST_ESTIMATES[index] = {
        ...MOCK_COST_ESTIMATES[index],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      return MOCK_COST_ESTIMATES[index];
    }
  }

  async submitForApproval(
    companyId: string,
    id: string,
    submittedBy: string
  ): Promise<CostEstimate> {
    try {
      const response = await apiClient.post<CostEstimate>(`${this.baseUrl}/${id}/submit`, {
        submittedBy,
      });
      return response.data;
    } catch (error) {
      console.error('API Error submitting cost estimate for approval:', error);
      return this.update(companyId, id, {
        status: 'Pending Approval',
        submittedBy,
        submittedAt: new Date().toISOString(),
      });
    }
  }

  async approve(
    companyId: string,
    id: string,
    approvedBy: string,
    notes?: string
  ): Promise<CostEstimate> {
    try {
      const response = await apiClient.post<CostEstimate>(`${this.baseUrl}/${id}/approve`, {
        approvedBy,
        notes,
      });
      return response.data;
    } catch (error) {
      console.error('API Error approving cost estimate:', error);
      return this.update(companyId, id, {
        status: 'Approved',
        approvedBy,
        approvedAt: new Date().toISOString(),
        approvalNotes: notes,
      });
    }
  }

  async reject(
    companyId: string,
    id: string,
    rejectedBy: string,
    notes?: string
  ): Promise<CostEstimate> {
    try {
      const response = await apiClient.post<CostEstimate>(`${this.baseUrl}/${id}/reject`, {
        rejectedBy,
        notes,
      });
      return response.data;
    } catch (error) {
      console.error('API Error rejecting cost estimate:', error);
      return this.update(companyId, id, {
        status: 'Rejected',
        approvalNotes: notes,
      });
    }
  }

  async createVersion(
    companyId: string,
    id: string,
    createdBy: string
  ): Promise<CostEstimate> {
    try {
      const response = await apiClient.post<CostEstimate>(
        `${this.baseUrl}/${id}/create-version`,
        { createdBy }
      );
      return response.data;
    } catch (error) {
      console.error('API Error creating cost estimate version:', error);
      const original = MOCK_COST_ESTIMATES.find((e) => e.id === id);
      if (!original) throw new Error(`Cost Estimate with ID ${id} not found`);
      return this.create(companyId, {
        ...original,
        version: original.version + 1,
        status: 'Draft',
      });
    }
  }

  async delete(companyId: string, id: string): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error('API Error deleting cost estimate, using mock data:', error);
      const index = MOCK_COST_ESTIMATES.findIndex((e) => e.id === id);
      if (index !== -1) {
        MOCK_COST_ESTIMATES.splice(index, 1);
      }
    }
  }
}

export const costEstimateService = new CostEstimateService();
