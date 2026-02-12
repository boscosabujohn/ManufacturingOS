import { apiClient } from '../api/client';

// ==================== TypeScript Interfaces ====================

export type ProposalStatus = 'draft' | 'pending_approval' | 'approved' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired';

export interface Proposal {
  id: string;
  companyId: string;
  proposalNumber: string;
  quoteId?: string;
  customerId: string;
  customerName: string;
  opportunityId?: string;
  title: string;
  status: ProposalStatus;
  version: number;
  sections: {
    sectionId: string;
    title: string;
    content: string;
    displayOrder: number;
    isIncluded: boolean;
  }[];
  coverPageContent?: string;
  executiveSummary?: string;
  pricingSummary?: Record<string, unknown>;
  termsAndConditions?: string;
  totalValue: number;
  currency: string;
  validUntil: string;
  viewCount: number;
  lastViewedAt?: string;
  sentAt?: string;
  acceptedAt?: string;
  signedAt?: string;
  createdBy: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProposalTemplate {
  id: string;
  companyId: string;
  templateName: string;
  description?: string;
  category?: string;
  sections: {
    sectionId: string;
    title: string;
    defaultContent: string;
    displayOrder: number;
    isRequired: boolean;
    placeholders?: string[];
  }[];
  defaultCoverPage?: string;
  defaultTermsAndConditions?: string;
  styling?: Record<string, unknown>;
  isActive: boolean;
  usageCount: number;
  createdAt: string;
}

export interface ContentLibraryItem {
  id: string;
  companyId: string;
  contentType: 'text' | 'image' | 'table' | 'clause';
  category: string;
  name: string;
  content: string;
  metadata?: Record<string, unknown>;
  tags?: string[];
  usageCount: number;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// ==================== Mock Data ====================

const MOCK_PROPOSALS: Proposal[] = [
  {
    id: 'prop-001',
    companyId: 'company-001',
    proposalNumber: 'PROP-2025-0001',
    quoteId: 'quote-001',
    customerId: 'cust-001',
    customerName: 'Acme Manufacturing',
    title: '5-Axis CNC Machining Center - Complete Solution Proposal',
    status: 'sent',
    version: 1,
    sections: [
      { sectionId: 's1', title: 'Executive Summary', content: 'We are pleased to present...', displayOrder: 1, isIncluded: true },
      { sectionId: 's2', title: 'Proposed Solution', content: 'Based on your requirements...', displayOrder: 2, isIncluded: true },
      { sectionId: 's3', title: 'Pricing & Investment', content: 'Total investment: $298,096.88', displayOrder: 3, isIncluded: true },
      { sectionId: 's4', title: 'Implementation Timeline', content: 'Phase 1: Delivery...', displayOrder: 4, isIncluded: true },
    ],
    executiveSummary: 'We are pleased to present this comprehensive proposal...',
    totalValue: 298096.88,
    currency: 'USD',
    validUntil: '2025-03-15',
    viewCount: 5,
    lastViewedAt: '2025-02-08T14:30:00Z',
    sentAt: '2025-02-05T10:00:00Z',
    createdBy: 'sales-001',
    createdAt: '2025-02-04T09:00:00Z',
    updatedAt: '2025-02-05T10:00:00Z',
  },
  {
    id: 'prop-002',
    companyId: 'company-001',
    proposalNumber: 'PROP-2025-0002',
    customerId: 'cust-002',
    customerName: 'Global Industries',
    title: 'Robotic Welding Cell - Turnkey Solution',
    status: 'pending_approval',
    version: 1,
    sections: [
      { sectionId: 's1', title: 'Executive Summary', content: 'Proposed automation solution...', displayOrder: 1, isIncluded: true },
      { sectionId: 's2', title: 'Technical Specifications', content: 'Robot specifications...', displayOrder: 2, isIncluded: true },
    ],
    totalValue: 413355,
    currency: 'USD',
    validUntil: '2025-03-20',
    viewCount: 0,
    createdBy: 'sales-001',
    createdAt: '2025-02-06T11:00:00Z',
    updatedAt: '2025-02-06T11:00:00Z',
  },
];

const MOCK_TEMPLATES: ProposalTemplate[] = [
  {
    id: 'pt-001',
    companyId: 'company-001',
    templateName: 'Standard Machine Proposal',
    description: 'Standard template for machine sales proposals',
    category: 'Machines',
    sections: [
      { sectionId: 't1', title: 'Executive Summary', defaultContent: 'Dear {{customerName}}...', displayOrder: 1, isRequired: true, placeholders: ['customerName', 'projectName'] },
      { sectionId: 't2', title: 'Proposed Solution', defaultContent: 'Based on your requirements...', displayOrder: 2, isRequired: true },
      { sectionId: 't3', title: 'Pricing & Investment', defaultContent: '', displayOrder: 3, isRequired: true },
      { sectionId: 't4', title: 'Implementation Timeline', defaultContent: '', displayOrder: 4, isRequired: false },
      { sectionId: 't5', title: 'Terms & Conditions', defaultContent: 'Standard terms apply...', displayOrder: 5, isRequired: true },
    ],
    isActive: true,
    usageCount: 24,
    createdAt: '2025-01-01T00:00:00Z',
  },
];

const MOCK_CONTENT_LIBRARY: ContentLibraryItem[] = [
  {
    id: 'cl-001',
    companyId: 'company-001',
    contentType: 'text',
    category: 'About Us',
    name: 'Company Introduction',
    content: 'With over 25 years of experience in industrial manufacturing...',
    tags: ['about', 'introduction'],
    usageCount: 45,
    isActive: true,
    createdBy: 'admin',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'cl-002',
    companyId: 'company-001',
    contentType: 'clause',
    category: 'Warranty',
    name: 'Standard Warranty Clause',
    content: 'Equipment is covered by a comprehensive 12-month warranty...',
    tags: ['warranty', 'terms'],
    usageCount: 38,
    isActive: true,
    createdBy: 'admin',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
];

// ==================== Service Class ====================

class CPQProposalService {
  private baseUrl = '/cpq/proposals';

  // Proposals
  async createProposal(data: Partial<Proposal>): Promise<Proposal> {
    try {
      const response = await apiClient.post<Proposal>(this.baseUrl, data);
      return response.data;
    } catch (error) {
      console.error('API Error creating proposal, using mock data:', error);
      const newProposal: Proposal = {
        id: `prop-${Date.now()}`,
        companyId: 'company-001',
        proposalNumber: `PROP-2025-${String(MOCK_PROPOSALS.length + 1).padStart(4, '0')}`,
        customerId: data.customerId || '',
        customerName: data.customerName || 'Customer',
        title: data.title || 'New Proposal',
        status: 'draft',
        version: 1,
        sections: data.sections || [],
        totalValue: data.totalValue || 0,
        currency: data.currency || 'USD',
        validUntil: data.validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        viewCount: 0,
        createdBy: data.createdBy || 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...data,
      } as Proposal;
      MOCK_PROPOSALS.push(newProposal);
      return newProposal;
    }
  }

  async findAllProposals(filters?: {
    status?: ProposalStatus;
    customerId?: string;
    fromDate?: string;
    toDate?: string;
  }): Promise<Proposal[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.customerId) params.append('customerId', filters.customerId);
      if (filters?.fromDate) params.append('fromDate', filters.fromDate);
      if (filters?.toDate) params.append('toDate', filters.toDate);
      const response = await apiClient.get<Proposal[]>(`${this.baseUrl}?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('API Error fetching proposals, using mock data:', error);
      let result = [...MOCK_PROPOSALS];
      if (filters?.status) result = result.filter((p) => p.status === filters.status);
      if (filters?.customerId) result = result.filter((p) => p.customerId === filters.customerId);
      return result;
    }
  }

  async findProposalById(id: string): Promise<Proposal> {
    try {
      const response = await apiClient.get<Proposal>(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error('API Error fetching proposal, using mock data:', error);
      const proposal = MOCK_PROPOSALS.find((p) => p.id === id);
      if (!proposal) throw new Error(`Proposal with ID ${id} not found`);
      return proposal;
    }
  }

  async updateProposal(id: string, data: Partial<Proposal>): Promise<Proposal> {
    try {
      const response = await apiClient.patch<Proposal>(`${this.baseUrl}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('API Error updating proposal, using mock data:', error);
      const index = MOCK_PROPOSALS.findIndex((p) => p.id === id);
      if (index === -1) throw new Error(`Proposal with ID ${id} not found`);
      MOCK_PROPOSALS[index] = { ...MOCK_PROPOSALS[index], ...data, updatedAt: new Date().toISOString() };
      return MOCK_PROPOSALS[index];
    }
  }

  async deleteProposal(id: string): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error('API Error deleting proposal, using mock data:', error);
      const index = MOCK_PROPOSALS.findIndex((p) => p.id === id);
      if (index !== -1) MOCK_PROPOSALS.splice(index, 1);
    }
  }

  // Proposal Workflow
  async submitForApproval(id: string): Promise<Proposal> {
    try {
      const response = await apiClient.post<Proposal>(`${this.baseUrl}/${id}/submit`, {});
      return response.data;
    } catch (error) {
      console.error('API Error submitting proposal:', error);
      return this.updateProposal(id, { status: 'pending_approval' });
    }
  }

  async approveProposal(id: string, approvedBy: string): Promise<Proposal> {
    try {
      const response = await apiClient.post<Proposal>(`${this.baseUrl}/${id}/approve`, { approvedBy });
      return response.data;
    } catch (error) {
      console.error('API Error approving proposal:', error);
      return this.updateProposal(id, { status: 'approved', approvedBy });
    }
  }

  async sendProposal(id: string, sentBy: string): Promise<Proposal> {
    try {
      const response = await apiClient.post<Proposal>(`${this.baseUrl}/${id}/send`, { sentBy });
      return response.data;
    } catch (error) {
      console.error('API Error sending proposal:', error);
      return this.updateProposal(id, { status: 'sent', sentAt: new Date().toISOString() });
    }
  }

  async recordProposalView(id: string): Promise<void> {
    try {
      await apiClient.post(`${this.baseUrl}/${id}/view`, {});
    } catch (error) {
      console.error('API Error recording view:', error);
      const proposal = MOCK_PROPOSALS.find((p) => p.id === id);
      if (proposal) {
        proposal.viewCount++;
        proposal.lastViewedAt = new Date().toISOString();
        if (proposal.status === 'sent') proposal.status = 'viewed';
      }
    }
  }

  async recordProposalResponse(id: string, accepted: boolean, feedback?: string): Promise<Proposal> {
    try {
      const response = await apiClient.post<Proposal>(`${this.baseUrl}/${id}/response`, { accepted, feedback });
      return response.data;
    } catch (error) {
      console.error('API Error recording response:', error);
      return this.updateProposal(id, {
        status: accepted ? 'accepted' : 'rejected',
        acceptedAt: accepted ? new Date().toISOString() : undefined,
      });
    }
  }

  // Templates
  async findAllTemplates(filters?: { category?: string; isActive?: boolean }): Promise<ProposalTemplate[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.category) params.append('category', filters.category);
      if (filters?.isActive !== undefined) params.append('isActive', String(filters.isActive));
      const response = await apiClient.get<ProposalTemplate[]>(`/cpq/proposal-templates?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('API Error fetching templates, using mock data:', error);
      let result = [...MOCK_TEMPLATES];
      if (filters?.category) result = result.filter((t) => t.category === filters.category);
      if (filters?.isActive !== undefined) result = result.filter((t) => t.isActive === filters.isActive);
      return result;
    }
  }

  async createFromTemplate(templateId: string, data: Partial<Proposal>): Promise<Proposal> {
    try {
      const response = await apiClient.post<Proposal>(`/cpq/proposal-templates/${templateId}/create-proposal`, data);
      return response.data;
    } catch (error) {
      console.error('API Error creating from template:', error);
      const template = MOCK_TEMPLATES.find((t) => t.id === templateId);
      const sections = template?.sections.map((s) => ({
        sectionId: s.sectionId,
        title: s.title,
        content: s.defaultContent,
        displayOrder: s.displayOrder,
        isIncluded: true,
      })) || [];
      return this.createProposal({ ...data, sections });
    }
  }

  // Content Library
  async findAllContentLibraryItems(filters?: {
    contentType?: string;
    category?: string;
    isActive?: boolean;
  }): Promise<ContentLibraryItem[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.contentType) params.append('contentType', filters.contentType);
      if (filters?.category) params.append('category', filters.category);
      if (filters?.isActive !== undefined) params.append('isActive', String(filters.isActive));
      const response = await apiClient.get<ContentLibraryItem[]>(`/cpq/content-library?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('API Error fetching content library, using mock data:', error);
      let result = [...MOCK_CONTENT_LIBRARY];
      if (filters?.contentType) result = result.filter((c) => c.contentType === filters.contentType);
      if (filters?.category) result = result.filter((c) => c.category === filters.category);
      if (filters?.isActive !== undefined) result = result.filter((c) => c.isActive === filters.isActive);
      return result;
    }
  }

  async createContentLibraryItem(data: Partial<ContentLibraryItem>): Promise<ContentLibraryItem> {
    try {
      const response = await apiClient.post<ContentLibraryItem>('/cpq/content-library', data);
      return response.data;
    } catch (error) {
      console.error('API Error creating content item, using mock data:', error);
      const newItem: ContentLibraryItem = {
        id: `cl-${Date.now()}`,
        companyId: 'company-001',
        contentType: data.contentType || 'text',
        category: data.category || 'General',
        name: data.name || 'New Content',
        content: data.content || '',
        usageCount: 0,
        isActive: true,
        createdBy: data.createdBy || 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...data,
      } as ContentLibraryItem;
      MOCK_CONTENT_LIBRARY.push(newItem);
      return newItem;
    }
  }
}

export const cpqProposalService = new CPQProposalService();
