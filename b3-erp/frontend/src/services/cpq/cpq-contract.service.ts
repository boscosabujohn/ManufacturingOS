import { apiClient } from '../api/client';

// ==================== TypeScript Interfaces ====================

export type ContractStatus =
  | 'draft'
  | 'pending_approval'
  | 'approved'
  | 'pending_signature'
  | 'partially_signed'
  | 'executed'
  | 'active'
  | 'expired'
  | 'terminated'
  | 'renewed';

export interface Contract {
  id: string;
  companyId: string;
  contractNumber: string;
  proposalId?: string;
  quoteId?: string;
  customerId: string;
  customerName: string;
  contractType: 'sales' | 'service' | 'maintenance' | 'subscription' | 'framework';
  title: string;
  status: ContractStatus;
  version: number;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  renewalTermMonths?: number;
  totalValue: number;
  currency: string;
  paymentTerms?: string;
  paymentSchedule?: { dueDate: string; amount: number; description: string }[];
  clauses: { clauseId: string; title: string; content: string; isNegotiable: boolean }[];
  signatories: {
    name: string;
    email: string;
    role: string;
    signedAt?: string;
    signatureData?: string;
    ipAddress?: string;
  }[];
  attachments?: { name: string; url: string; type: string }[];
  notes?: string;
  createdBy: string;
  approvedBy?: string;
  approvedAt?: string;
  executedAt?: string;
  terminatedAt?: string;
  terminationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContractTemplate {
  id: string;
  companyId: string;
  templateName: string;
  description?: string;
  contractType: 'sales' | 'service' | 'maintenance' | 'subscription' | 'framework';
  defaultDurationMonths: number;
  clauses: {
    clauseId: string;
    title: string;
    defaultContent: string;
    isRequired: boolean;
    isNegotiable: boolean;
    displayOrder: number;
  }[];
  defaultPaymentTerms?: string;
  isActive: boolean;
  createdAt: string;
}

export interface ContractClause {
  id: string;
  companyId: string;
  clauseType: 'standard' | 'optional' | 'custom';
  category: string;
  title: string;
  content: string;
  language: string;
  isActive: boolean;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

// ==================== Mock Data ====================

const MOCK_CONTRACTS: Contract[] = [
  {
    id: 'contract-001',
    companyId: 'company-001',
    contractNumber: 'CON-2025-0001',
    quoteId: 'quote-003',
    customerId: 'cust-003',
    customerName: 'Precision Parts Co',
    contractType: 'sales',
    title: 'CNC Lathe Package - Sales Agreement',
    status: 'active',
    version: 1,
    startDate: '2025-02-01',
    endDate: '2026-02-01',
    autoRenew: false,
    totalValue: 96455,
    currency: 'USD',
    paymentTerms: 'Net 30',
    paymentSchedule: [
      { dueDate: '2025-02-15', amount: 28936.5, description: '30% Advance Payment' },
      { dueDate: '2025-03-15', amount: 38582, description: '40% On Delivery' },
      { dueDate: '2025-04-15', amount: 28936.5, description: '30% Final Payment' },
    ],
    clauses: [
      { clauseId: 'c1', title: 'Delivery Terms', content: 'Equipment shall be delivered within 45 days...', isNegotiable: false },
      { clauseId: 'c2', title: 'Warranty', content: '12-month comprehensive warranty...', isNegotiable: true },
      { clauseId: 'c3', title: 'Installation', content: 'Installation and training included...', isNegotiable: false },
    ],
    signatories: [
      { name: 'John Doe', email: 'john@precisionparts.com', role: 'Procurement Manager', signedAt: '2025-02-01T10:00:00Z' },
      { name: 'Jane Smith', email: 'jane@company.com', role: 'Sales Director', signedAt: '2025-02-01T11:00:00Z' },
    ],
    createdBy: 'sales-002',
    approvedBy: 'manager-001',
    approvedAt: '2025-01-30T15:00:00Z',
    executedAt: '2025-02-01T11:00:00Z',
    createdAt: '2025-01-25T09:00:00Z',
    updatedAt: '2025-02-01T11:00:00Z',
  },
  {
    id: 'contract-002',
    companyId: 'company-001',
    contractNumber: 'CON-2025-0002',
    customerId: 'cust-001',
    customerName: 'Acme Manufacturing',
    contractType: 'service',
    title: 'Annual Maintenance Agreement - CNC Equipment',
    status: 'pending_signature',
    version: 1,
    startDate: '2025-03-01',
    endDate: '2026-03-01',
    autoRenew: true,
    renewalTermMonths: 12,
    totalValue: 24000,
    currency: 'USD',
    paymentTerms: 'Quarterly in advance',
    clauses: [
      { clauseId: 'c1', title: 'Service Coverage', content: 'Preventive maintenance visits...', isNegotiable: true },
      { clauseId: 'c2', title: 'Response Time', content: '4-hour response time for critical issues...', isNegotiable: true },
    ],
    signatories: [
      { name: 'Mike Johnson', email: 'mike@acme.com', role: 'Operations Manager' },
      { name: 'Sarah Williams', email: 'sarah@company.com', role: 'Service Manager' },
    ],
    createdBy: 'sales-001',
    approvedBy: 'manager-001',
    approvedAt: '2025-02-08T10:00:00Z',
    createdAt: '2025-02-05T14:00:00Z',
    updatedAt: '2025-02-08T10:00:00Z',
  },
];

const MOCK_TEMPLATES: ContractTemplate[] = [
  {
    id: 'ct-001',
    companyId: 'company-001',
    templateName: 'Standard Sales Contract',
    description: 'Standard template for equipment sales',
    contractType: 'sales',
    defaultDurationMonths: 12,
    clauses: [
      { clauseId: 'tc1', title: 'Delivery Terms', defaultContent: 'Equipment shall be delivered...', isRequired: true, isNegotiable: false, displayOrder: 1 },
      { clauseId: 'tc2', title: 'Payment Terms', defaultContent: 'Payment shall be made...', isRequired: true, isNegotiable: true, displayOrder: 2 },
      { clauseId: 'tc3', title: 'Warranty', defaultContent: 'Standard 12-month warranty...', isRequired: true, isNegotiable: true, displayOrder: 3 },
      { clauseId: 'tc4', title: 'Liability', defaultContent: 'Liability is limited to...', isRequired: true, isNegotiable: false, displayOrder: 4 },
    ],
    defaultPaymentTerms: 'Net 30',
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'ct-002',
    companyId: 'company-001',
    templateName: 'Annual Maintenance Agreement',
    description: 'Template for service and maintenance contracts',
    contractType: 'maintenance',
    defaultDurationMonths: 12,
    clauses: [
      { clauseId: 'tc1', title: 'Service Coverage', defaultContent: 'This agreement covers...', isRequired: true, isNegotiable: true, displayOrder: 1 },
      { clauseId: 'tc2', title: 'Response Times', defaultContent: 'Response time SLAs...', isRequired: true, isNegotiable: true, displayOrder: 2 },
      { clauseId: 'tc3', title: 'Exclusions', defaultContent: 'This agreement does not cover...', isRequired: true, isNegotiable: false, displayOrder: 3 },
    ],
    defaultPaymentTerms: 'Quarterly in advance',
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z',
  },
];

const MOCK_CLAUSES: ContractClause[] = [
  {
    id: 'clause-001',
    companyId: 'company-001',
    clauseType: 'standard',
    category: 'Warranty',
    title: 'Standard 12-Month Warranty',
    content: 'The seller warrants that the equipment will be free from defects in materials and workmanship for a period of twelve (12) months from the date of delivery...',
    language: 'en',
    isActive: true,
    usageCount: 45,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'clause-002',
    companyId: 'company-001',
    clauseType: 'standard',
    category: 'Liability',
    title: 'Limitation of Liability',
    content: 'In no event shall either party be liable for any indirect, incidental, special, consequential, or punitive damages...',
    language: 'en',
    isActive: true,
    usageCount: 52,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
];

// ==================== Service Class ====================

class CPQContractService {
  private baseUrl = '/cpq/contracts';

  // Contracts
  async createContract(data: Partial<Contract>): Promise<Contract> {
    try {
      const response = await apiClient.post<Contract>(this.baseUrl, data);
      return response.data;
    } catch (error) {
      console.error('API Error creating contract, using mock data:', error);
      const newContract: Contract = {
        id: `contract-${Date.now()}`,
        companyId: 'company-001',
        contractNumber: `CON-2025-${String(MOCK_CONTRACTS.length + 1).padStart(4, '0')}`,
        customerId: data.customerId || '',
        customerName: data.customerName || 'Customer',
        contractType: data.contractType || 'sales',
        title: data.title || 'New Contract',
        status: 'draft',
        version: 1,
        startDate: data.startDate || new Date().toISOString().split('T')[0],
        endDate: data.endDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        autoRenew: data.autoRenew || false,
        totalValue: data.totalValue || 0,
        currency: data.currency || 'USD',
        clauses: data.clauses || [],
        signatories: data.signatories || [],
        createdBy: data.createdBy || 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...data,
      } as Contract;
      MOCK_CONTRACTS.push(newContract);
      return newContract;
    }
  }

  async findAllContracts(filters?: {
    status?: ContractStatus;
    customerId?: string;
    contractType?: string;
    fromDate?: string;
    toDate?: string;
  }): Promise<Contract[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.customerId) params.append('customerId', filters.customerId);
      if (filters?.contractType) params.append('contractType', filters.contractType);
      if (filters?.fromDate) params.append('fromDate', filters.fromDate);
      if (filters?.toDate) params.append('toDate', filters.toDate);
      const response = await apiClient.get<Contract[]>(`${this.baseUrl}?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('API Error fetching contracts, using mock data:', error);
      let result = [...MOCK_CONTRACTS];
      if (filters?.status) result = result.filter((c) => c.status === filters.status);
      if (filters?.customerId) result = result.filter((c) => c.customerId === filters.customerId);
      if (filters?.contractType) result = result.filter((c) => c.contractType === filters.contractType);
      return result;
    }
  }

  async findContractById(id: string): Promise<Contract> {
    try {
      const response = await apiClient.get<Contract>(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error('API Error fetching contract, using mock data:', error);
      const contract = MOCK_CONTRACTS.find((c) => c.id === id);
      if (!contract) throw new Error(`Contract with ID ${id} not found`);
      return contract;
    }
  }

  async updateContract(id: string, data: Partial<Contract>): Promise<Contract> {
    try {
      const response = await apiClient.patch<Contract>(`${this.baseUrl}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('API Error updating contract, using mock data:', error);
      const index = MOCK_CONTRACTS.findIndex((c) => c.id === id);
      if (index === -1) throw new Error(`Contract with ID ${id} not found`);
      MOCK_CONTRACTS[index] = { ...MOCK_CONTRACTS[index], ...data, updatedAt: new Date().toISOString() };
      return MOCK_CONTRACTS[index];
    }
  }

  async deleteContract(id: string): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error('API Error deleting contract, using mock data:', error);
      const index = MOCK_CONTRACTS.findIndex((c) => c.id === id);
      if (index !== -1) MOCK_CONTRACTS.splice(index, 1);
    }
  }

  // Contract Workflow
  async submitForApproval(id: string): Promise<Contract> {
    try {
      const response = await apiClient.post<Contract>(`${this.baseUrl}/${id}/submit`, {});
      return response.data;
    } catch (error) {
      console.error('API Error submitting contract:', error);
      return this.updateContract(id, { status: 'pending_approval' });
    }
  }

  async approveContract(id: string, approvedBy: string, notes?: string): Promise<Contract> {
    try {
      const response = await apiClient.post<Contract>(`${this.baseUrl}/${id}/approve`, { approvedBy, notes });
      return response.data;
    } catch (error) {
      console.error('API Error approving contract:', error);
      return this.updateContract(id, { status: 'approved', approvedBy, approvedAt: new Date().toISOString() });
    }
  }

  async sendForSignature(id: string): Promise<Contract> {
    try {
      const response = await apiClient.post<Contract>(`${this.baseUrl}/${id}/send-for-signature`, {});
      return response.data;
    } catch (error) {
      console.error('API Error sending for signature:', error);
      return this.updateContract(id, { status: 'pending_signature' });
    }
  }

  async recordSignature(id: string, signatoryEmail: string, signatureData: string): Promise<Contract> {
    try {
      const response = await apiClient.post<Contract>(`${this.baseUrl}/${id}/sign`, { signatoryEmail, signatureData });
      return response.data;
    } catch (error) {
      console.error('API Error recording signature:', error);
      const contract = MOCK_CONTRACTS.find((c) => c.id === id);
      if (contract) {
        const signatory = contract.signatories.find((s) => s.email === signatoryEmail);
        if (signatory) {
          signatory.signedAt = new Date().toISOString();
          signatory.signatureData = signatureData;
        }
        const allSigned = contract.signatories.every((s) => s.signedAt);
        if (allSigned) contract.status = 'executed';
        else contract.status = 'partially_signed';
      }
      return contract!;
    }
  }

  async activateContract(id: string): Promise<Contract> {
    try {
      const response = await apiClient.post<Contract>(`${this.baseUrl}/${id}/activate`, {});
      return response.data;
    } catch (error) {
      console.error('API Error activating contract:', error);
      return this.updateContract(id, { status: 'active' });
    }
  }

  async renewContract(id: string, newEndDate: string, createdBy: string): Promise<Contract> {
    try {
      const response = await apiClient.post<Contract>(`${this.baseUrl}/${id}/renew`, { newEndDate, createdBy });
      return response.data;
    } catch (error) {
      console.error('API Error renewing contract:', error);
      return this.updateContract(id, { status: 'renewed', endDate: newEndDate });
    }
  }

  async getExpiringContracts(days: number): Promise<Contract[]> {
    try {
      const response = await apiClient.get<Contract[]>(`${this.baseUrl}/expiring?days=${days}`);
      return response.data;
    } catch (error) {
      console.error('API Error fetching expiring contracts, using mock data:', error);
      const futureDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
      return MOCK_CONTRACTS.filter((c) => c.status === 'active' && new Date(c.endDate) <= futureDate);
    }
  }

  // Templates
  async findAllTemplates(filters?: { contractType?: string; isActive?: boolean }): Promise<ContractTemplate[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.contractType) params.append('contractType', filters.contractType);
      if (filters?.isActive !== undefined) params.append('isActive', String(filters.isActive));
      const response = await apiClient.get<ContractTemplate[]>(`/cpq/contract-templates?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('API Error fetching templates, using mock data:', error);
      let result = [...MOCK_TEMPLATES];
      if (filters?.contractType) result = result.filter((t) => t.contractType === filters.contractType);
      if (filters?.isActive !== undefined) result = result.filter((t) => t.isActive === filters.isActive);
      return result;
    }
  }

  async createFromTemplate(templateId: string, data: Partial<Contract>): Promise<Contract> {
    try {
      const response = await apiClient.post<Contract>(`/cpq/contract-templates/${templateId}/create-contract`, data);
      return response.data;
    } catch (error) {
      console.error('API Error creating from template:', error);
      const template = MOCK_TEMPLATES.find((t) => t.id === templateId);
      const clauses = template?.clauses.map((c) => ({
        clauseId: c.clauseId,
        title: c.title,
        content: c.defaultContent,
        isNegotiable: c.isNegotiable,
      })) || [];
      return this.createContract({
        ...data,
        contractType: template?.contractType,
        paymentTerms: template?.defaultPaymentTerms,
        clauses,
      });
    }
  }

  // Clauses Library
  async findAllClauses(filters?: { category?: string; clauseType?: string; isActive?: boolean }): Promise<ContractClause[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.category) params.append('category', filters.category);
      if (filters?.clauseType) params.append('clauseType', filters.clauseType);
      if (filters?.isActive !== undefined) params.append('isActive', String(filters.isActive));
      const response = await apiClient.get<ContractClause[]>(`/cpq/clauses?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('API Error fetching clauses, using mock data:', error);
      let result = [...MOCK_CLAUSES];
      if (filters?.category) result = result.filter((c) => c.category === filters.category);
      if (filters?.clauseType) result = result.filter((c) => c.clauseType === filters.clauseType);
      if (filters?.isActive !== undefined) result = result.filter((c) => c.isActive === filters.isActive);
      return result;
    }
  }

  async createClause(data: Partial<ContractClause>): Promise<ContractClause> {
    try {
      const response = await apiClient.post<ContractClause>('/cpq/clauses', data);
      return response.data;
    } catch (error) {
      console.error('API Error creating clause, using mock data:', error);
      const newClause: ContractClause = {
        id: `clause-${Date.now()}`,
        companyId: 'company-001',
        clauseType: data.clauseType || 'custom',
        category: data.category || 'General',
        title: data.title || 'New Clause',
        content: data.content || '',
        language: data.language || 'en',
        isActive: true,
        usageCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...data,
      } as ContractClause;
      MOCK_CLAUSES.push(newClause);
      return newClause;
    }
  }
}

export const cpqContractService = new CPQContractService();
