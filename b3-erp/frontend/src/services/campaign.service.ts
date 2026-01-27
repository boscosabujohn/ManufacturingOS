import { apiClient } from './api/client';

// ============== Interfaces ==============

export interface CampaignMember {
  id: string;
  leadId?: string;
  contactId?: string;
  memberName: string;
  memberEmail: string;
  memberType: 'Lead' | 'Contact';
  status: 'Sent' | 'Opened' | 'Clicked' | 'Responded' | 'Converted' | 'Unsubscribed' | 'Bounced';
  addedDate: string;
  lastResponseDate?: string;
}

export interface Campaign {
  id: string;
  campaignNumber: string;
  name: string;
  type: 'Email' | 'Trade Show' | 'Webinar' | 'Advertisement' | 'Referral Program' | 'Social Media' | 'Direct Mail' | 'Other';
  status: 'Draft' | 'Scheduled' | 'Active' | 'Paused' | 'Completed' | 'Cancelled';
  startDate: string;
  endDate: string;
  description?: string;
  objective?: string;
  targetAudience?: string;
  budget: number;
  actualCost: number;
  expectedRevenue: number;
  actualRevenue: number;
  currency: string;
  totalLeads: number;
  convertedLeads: number;
  totalOpportunities: number;
  wonOpportunities: number;
  members?: CampaignMember[];
  assignedTo?: string;
  assignedToName?: string;
  parentCampaignId?: string;
  parentCampaignName?: string;
  tags?: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignStats {
  roi: number;
  costPerLead: number;
  costPerOpportunity: number;
  leadConversionRate: number;
  opportunityWinRate: number;
  responseRate: number;
  clickRate: number;
  openRate: number;
}

export interface CreateCampaignDto {
  name: string;
  type: Campaign['type'];
  status?: Campaign['status'];
  startDate: string;
  endDate: string;
  description?: string;
  objective?: string;
  targetAudience?: string;
  budget: number;
  expectedRevenue?: number;
  assignedTo?: string;
  parentCampaignId?: string;
  tags?: string[];
  notes?: string;
}

export interface UpdateCampaignDto extends Partial<CreateCampaignDto> {
  actualCost?: number;
  actualRevenue?: number;
}

export interface CampaignFilters {
  search?: string;
  status?: Campaign['status'];
  type?: Campaign['type'];
  assignedTo?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ============== Mock Data ==============

const USE_MOCK_DATA = true;

export const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: 'camp-001',
    campaignNumber: 'CMP-2024-0001',
    name: 'Q1 2024 Digital Marketing Campaign',
    type: 'Email',
    status: 'Active',
    startDate: '2024-01-01',
    endDate: '2024-03-31',
    description: 'Multi-channel digital marketing campaign targeting manufacturing prospects',
    objective: 'Generate 50 qualified leads and 10 opportunities',
    targetAudience: 'Manufacturing companies with 100+ employees',
    budget: 25000,
    actualCost: 12500,
    expectedRevenue: 500000,
    actualRevenue: 250000,
    currency: 'USD',
    totalLeads: 35,
    convertedLeads: 8,
    totalOpportunities: 12,
    wonOpportunities: 2,
    members: [
      { id: 'mem-1', leadId: 'lead-001', memberName: 'James Anderson', memberEmail: 'james.anderson@techstartup.io', memberType: 'Lead', status: 'Responded', addedDate: '2024-01-15', lastResponseDate: '2024-01-28' },
    ],
    assignedTo: 'user-001',
    assignedToName: 'John Smith',
    tags: ['digital', 'q1-2024', 'manufacturing'],
    notes: 'Strong performance in first month',
    createdAt: '2023-12-15T10:00:00Z',
    updatedAt: '2024-01-30T11:00:00Z',
  },
  {
    id: 'camp-002',
    campaignNumber: 'CMP-2024-0002',
    name: 'Auto Industry Trade Show 2024',
    type: 'Trade Show',
    status: 'Completed',
    startDate: '2024-01-15',
    endDate: '2024-01-18',
    description: 'Participation in annual automotive industry trade show',
    objective: 'Generate awareness and capture 30 leads',
    targetAudience: 'Automotive OEMs and Tier 1 suppliers',
    budget: 45000,
    actualCost: 42000,
    expectedRevenue: 300000,
    actualRevenue: 180000,
    currency: 'USD',
    totalLeads: 28,
    convertedLeads: 5,
    totalOpportunities: 8,
    wonOpportunities: 1,
    members: [
      { id: 'mem-2', leadId: 'lead-002', memberName: 'Sarah Mitchell', memberEmail: 'sarah.mitchell@automotivesupplier.com', memberType: 'Lead', status: 'Converted', addedDate: '2024-01-18', lastResponseDate: '2024-01-25' },
    ],
    assignedTo: 'user-002',
    assignedToName: 'Sarah Johnson',
    tags: ['trade-show', 'automotive', 'events'],
    notes: 'Successful event - good lead quality',
    createdAt: '2023-11-20T09:00:00Z',
    updatedAt: '2024-01-25T16:00:00Z',
  },
  {
    id: 'camp-003',
    campaignNumber: 'CMP-2024-0003',
    name: 'Medical Industry Email Campaign',
    type: 'Email',
    status: 'Active',
    startDate: '2024-01-10',
    endDate: '2024-02-28',
    description: 'Targeted email campaign for medical device manufacturers',
    objective: 'Promote ISO 13485 capabilities to medical sector',
    targetAudience: 'Medical device manufacturers',
    budget: 8000,
    actualCost: 3500,
    expectedRevenue: 200000,
    actualRevenue: 85000,
    currency: 'USD',
    totalLeads: 15,
    convertedLeads: 3,
    totalOpportunities: 4,
    wonOpportunities: 0,
    members: [
      { id: 'mem-3', leadId: 'lead-004', memberName: 'Emily Rodriguez', memberEmail: 'emily.r@medicaldevicesolutions.com', memberType: 'Lead', status: 'Responded', addedDate: '2024-01-20', lastResponseDate: '2024-01-27' },
    ],
    assignedTo: 'user-002',
    assignedToName: 'Sarah Johnson',
    parentCampaignId: 'camp-001',
    parentCampaignName: 'Q1 2024 Digital Marketing Campaign',
    tags: ['email', 'medical', 'iso-13485'],
    createdAt: '2024-01-05T14:00:00Z',
    updatedAt: '2024-01-28T10:00:00Z',
  },
  {
    id: 'camp-004',
    campaignNumber: 'CMP-2024-0004',
    name: 'Google Ads Q1 2024',
    type: 'Advertisement',
    status: 'Active',
    startDate: '2024-01-01',
    endDate: '2024-03-31',
    description: 'Google Ads campaign targeting manufacturing keywords',
    objective: 'Drive website traffic and generate leads',
    targetAudience: 'Manufacturing decision makers searching for suppliers',
    budget: 15000,
    actualCost: 6800,
    expectedRevenue: 150000,
    actualRevenue: 60000,
    currency: 'USD',
    totalLeads: 22,
    convertedLeads: 4,
    totalOpportunities: 5,
    wonOpportunities: 1,
    members: [
      { id: 'mem-4', leadId: 'lead-008', memberName: 'Lisa Park', memberEmail: 'lisa.park@electronicsmanufacturing.com', memberType: 'Lead', status: 'Clicked', addedDate: '2024-01-12', lastResponseDate: '2024-01-12' },
    ],
    assignedTo: 'user-001',
    assignedToName: 'John Smith',
    parentCampaignId: 'camp-001',
    parentCampaignName: 'Q1 2024 Digital Marketing Campaign',
    tags: ['google-ads', 'ppc', 'digital'],
    createdAt: '2023-12-20T11:00:00Z',
    updatedAt: '2024-01-29T15:00:00Z',
  },
  {
    id: 'camp-005',
    campaignNumber: 'CMP-2024-0005',
    name: 'Food Industry Expo 2024',
    type: 'Trade Show',
    status: 'Completed',
    startDate: '2024-01-28',
    endDate: '2024-01-31',
    description: 'Food processing equipment trade show participation',
    objective: 'Expand into food processing industry',
    targetAudience: 'Food processing equipment manufacturers',
    budget: 35000,
    actualCost: 32000,
    expectedRevenue: 200000,
    actualRevenue: 55000,
    currency: 'USD',
    totalLeads: 18,
    convertedLeads: 2,
    totalOpportunities: 3,
    wonOpportunities: 0,
    members: [
      { id: 'mem-5', leadId: 'lead-010', memberName: 'Amanda Brown', memberEmail: 'amanda.brown@foodprocessing.com', memberType: 'Lead', status: 'Responded', addedDate: '2024-01-31', lastResponseDate: '2024-01-31' },
    ],
    assignedTo: 'user-003',
    assignedToName: 'Mike Davis',
    tags: ['trade-show', 'food-industry', 'events'],
    notes: 'New market exploration',
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-02-01T09:00:00Z',
  },
  {
    id: 'camp-006',
    campaignNumber: 'CMP-2024-0006',
    name: 'Industrial Equipment Expo 2024',
    type: 'Trade Show',
    status: 'Scheduled',
    startDate: '2024-03-15',
    endDate: '2024-03-18',
    description: 'Major industrial equipment trade show',
    objective: 'Generate 40 qualified leads',
    targetAudience: 'Industrial equipment manufacturers',
    budget: 55000,
    actualCost: 0,
    expectedRevenue: 400000,
    actualRevenue: 0,
    currency: 'USD',
    totalLeads: 0,
    convertedLeads: 0,
    totalOpportunities: 0,
    wonOpportunities: 0,
    assignedTo: 'user-001',
    assignedToName: 'John Smith',
    tags: ['trade-show', 'industrial', 'events', 'scheduled'],
    notes: 'Planning in progress',
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-30T14:00:00Z',
  },
  {
    id: 'camp-007',
    campaignNumber: 'CMP-2024-0007',
    name: 'LinkedIn Lead Generation',
    type: 'Social Media',
    status: 'Active',
    startDate: '2024-01-15',
    endDate: '2024-04-15',
    description: 'LinkedIn advertising and organic content campaign',
    objective: 'Build brand awareness and generate qualified leads',
    targetAudience: 'Manufacturing executives and procurement managers',
    budget: 12000,
    actualCost: 4200,
    expectedRevenue: 180000,
    actualRevenue: 95000,
    currency: 'USD',
    totalLeads: 16,
    convertedLeads: 3,
    totalOpportunities: 5,
    wonOpportunities: 1,
    assignedTo: 'user-002',
    assignedToName: 'Sarah Johnson',
    parentCampaignId: 'camp-001',
    parentCampaignName: 'Q1 2024 Digital Marketing Campaign',
    tags: ['linkedin', 'social-media', 'digital'],
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-31T11:00:00Z',
  },
  {
    id: 'camp-008',
    campaignNumber: 'CMP-2024-0008',
    name: 'Customer Referral Program Q1',
    type: 'Referral Program',
    status: 'Active',
    startDate: '2024-01-01',
    endDate: '2024-03-31',
    description: 'Incentivized customer referral program',
    objective: 'Generate high-quality leads from existing customers',
    targetAudience: 'Existing customers',
    budget: 10000,
    actualCost: 3500,
    expectedRevenue: 250000,
    actualRevenue: 150000,
    currency: 'USD',
    totalLeads: 8,
    convertedLeads: 4,
    totalOpportunities: 6,
    wonOpportunities: 2,
    members: [
      { id: 'mem-6', leadId: 'lead-003', memberName: 'Michael Chen', memberEmail: 'mchen@aerospacedynamics.com', memberType: 'Lead', status: 'Converted', addedDate: '2024-01-30', lastResponseDate: '2024-01-30' },
      { id: 'mem-7', leadId: 'lead-009', memberName: 'William Johnson', memberEmail: 'wjohnson@constructionmachinery.com', memberType: 'Lead', status: 'Responded', addedDate: '2024-01-25', lastResponseDate: '2024-01-29' },
    ],
    assignedTo: 'user-003',
    assignedToName: 'Mike Davis',
    tags: ['referral', 'customer-program', 'high-quality'],
    notes: 'Excellent lead quality from referrals',
    createdAt: '2023-12-28T14:00:00Z',
    updatedAt: '2024-01-31T10:00:00Z',
  },
  {
    id: 'camp-009',
    campaignNumber: 'CMP-2024-0009',
    name: 'Aerospace Industry Webinar Series',
    type: 'Webinar',
    status: 'Draft',
    startDate: '2024-02-15',
    endDate: '2024-05-15',
    description: 'Monthly webinar series for aerospace industry',
    objective: 'Position as thought leader in aerospace manufacturing',
    targetAudience: 'Aerospace engineers and procurement professionals',
    budget: 8000,
    actualCost: 0,
    expectedRevenue: 300000,
    actualRevenue: 0,
    currency: 'USD',
    totalLeads: 0,
    convertedLeads: 0,
    totalOpportunities: 0,
    wonOpportunities: 0,
    assignedTo: 'user-002',
    assignedToName: 'Sarah Johnson',
    tags: ['webinar', 'aerospace', 'thought-leadership'],
    notes: 'Content development in progress',
    createdAt: '2024-01-25T11:00:00Z',
    updatedAt: '2024-01-28T16:00:00Z',
  },
  {
    id: 'camp-010',
    campaignNumber: 'CMP-2024-0010',
    name: 'Direct Mail - Heavy Industry',
    type: 'Direct Mail',
    status: 'Paused',
    startDate: '2024-01-20',
    endDate: '2024-02-20',
    description: 'Targeted direct mail campaign for heavy industry',
    objective: 'Reach decision makers not active online',
    targetAudience: 'Heavy industry and construction companies',
    budget: 18000,
    actualCost: 9500,
    expectedRevenue: 150000,
    actualRevenue: 45000,
    currency: 'USD',
    totalLeads: 12,
    convertedLeads: 2,
    totalOpportunities: 3,
    wonOpportunities: 0,
    assignedTo: 'user-003',
    assignedToName: 'Mike Davis',
    tags: ['direct-mail', 'heavy-industry', 'offline'],
    notes: 'Paused for budget review',
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-30T10:00:00Z',
  },
];

// ============== Service Class ==============

class CampaignService {
  private buildQueryParams(filters?: CampaignFilters): string {
    if (!filters) return '';
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.status) params.append('status', filters.status);
    if (filters.type) params.append('type', filters.type);
    if (filters.assignedTo) params.append('assignedTo', filters.assignedTo);
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    return params.toString();
  }

  async getAllCampaigns(filters?: CampaignFilters): Promise<{ data: Campaign[]; total: number }> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      let filteredCampaigns = [...MOCK_CAMPAIGNS];

      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        filteredCampaigns = filteredCampaigns.filter(
          (c) =>
            c.name.toLowerCase().includes(searchLower) ||
            c.campaignNumber.toLowerCase().includes(searchLower) ||
            (c.description && c.description.toLowerCase().includes(searchLower))
        );
      }
      if (filters?.status) {
        filteredCampaigns = filteredCampaigns.filter((c) => c.status === filters.status);
      }
      if (filters?.type) {
        filteredCampaigns = filteredCampaigns.filter((c) => c.type === filters.type);
      }
      if (filters?.assignedTo) {
        filteredCampaigns = filteredCampaigns.filter((c) => c.assignedTo === filters.assignedTo);
      }

      return { data: filteredCampaigns, total: filteredCampaigns.length };
    }

    const queryString = this.buildQueryParams(filters);
    const response = await apiClient.get<{ data: Campaign[]; total: number }>(
      `/crm/campaigns${queryString ? `?${queryString}` : ''}`
    );
    return response.data;
  }

  async getCampaignById(id: string): Promise<Campaign> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const campaign = MOCK_CAMPAIGNS.find((c) => c.id === id);
      if (!campaign) throw new Error('Campaign not found');
      return campaign;
    }

    const response = await apiClient.get<Campaign>(`/crm/campaigns/${id}`);
    return response.data;
  }

  async createCampaign(data: CreateCampaignDto): Promise<Campaign> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const campaignNumber = `CMP-2024-${String(MOCK_CAMPAIGNS.length + 1).padStart(4, '0')}`;
      const newCampaign: Campaign = {
        id: `camp-${Date.now()}`,
        campaignNumber,
        name: data.name,
        type: data.type,
        status: data.status || 'Draft',
        startDate: data.startDate,
        endDate: data.endDate,
        description: data.description,
        objective: data.objective,
        targetAudience: data.targetAudience,
        budget: data.budget,
        actualCost: 0,
        expectedRevenue: data.expectedRevenue || 0,
        actualRevenue: 0,
        currency: 'USD',
        totalLeads: 0,
        convertedLeads: 0,
        totalOpportunities: 0,
        wonOpportunities: 0,
        assignedTo: data.assignedTo,
        parentCampaignId: data.parentCampaignId,
        tags: data.tags,
        notes: data.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      MOCK_CAMPAIGNS.push(newCampaign);
      return newCampaign;
    }

    const response = await apiClient.post<Campaign>('/crm/campaigns', data);
    return response.data;
  }

  async updateCampaign(id: string, data: UpdateCampaignDto): Promise<Campaign> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const index = MOCK_CAMPAIGNS.findIndex((c) => c.id === id);
      if (index === -1) throw new Error('Campaign not found');

      MOCK_CAMPAIGNS[index] = {
        ...MOCK_CAMPAIGNS[index],
        ...data,
        updatedAt: new Date().toISOString(),
      } as Campaign;
      return MOCK_CAMPAIGNS[index];
    }

    const response = await apiClient.put<Campaign>(`/crm/campaigns/${id}`, data);
    return response.data;
  }

  async getCampaignStats(id: string): Promise<CampaignStats> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const campaign = MOCK_CAMPAIGNS.find((c) => c.id === id);
      if (!campaign) throw new Error('Campaign not found');

      const roi = campaign.actualCost > 0
        ? ((campaign.actualRevenue - campaign.actualCost) / campaign.actualCost) * 100
        : 0;

      const costPerLead = campaign.totalLeads > 0
        ? campaign.actualCost / campaign.totalLeads
        : 0;

      const costPerOpportunity = campaign.totalOpportunities > 0
        ? campaign.actualCost / campaign.totalOpportunities
        : 0;

      const leadConversionRate = campaign.totalLeads > 0
        ? (campaign.convertedLeads / campaign.totalLeads) * 100
        : 0;

      const opportunityWinRate = campaign.totalOpportunities > 0
        ? (campaign.wonOpportunities / campaign.totalOpportunities) * 100
        : 0;

      // Mock email stats
      const totalMembers = campaign.members?.length || 0;
      const responded = campaign.members?.filter(m => ['Responded', 'Converted'].includes(m.status)).length || 0;
      const clicked = campaign.members?.filter(m => ['Clicked', 'Responded', 'Converted'].includes(m.status)).length || 0;
      const opened = campaign.members?.filter(m => !['Bounced', 'Sent'].includes(m.status)).length || 0;

      return {
        roi,
        costPerLead,
        costPerOpportunity,
        leadConversionRate,
        opportunityWinRate,
        responseRate: totalMembers > 0 ? (responded / totalMembers) * 100 : 0,
        clickRate: totalMembers > 0 ? (clicked / totalMembers) * 100 : 0,
        openRate: totalMembers > 0 ? (opened / totalMembers) * 100 : 0,
      };
    }

    const response = await apiClient.get<CampaignStats>(`/crm/campaigns/${id}/stats`);
    return response.data;
  }

  async addMember(campaignId: string, member: Omit<CampaignMember, 'id' | 'addedDate'>): Promise<Campaign> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const index = MOCK_CAMPAIGNS.findIndex((c) => c.id === campaignId);
      if (index === -1) throw new Error('Campaign not found');

      const newMember: CampaignMember = {
        ...member,
        id: `mem-${Date.now()}`,
        addedDate: new Date().toISOString().split('T')[0],
      };

      MOCK_CAMPAIGNS[index] = {
        ...MOCK_CAMPAIGNS[index],
        members: [...(MOCK_CAMPAIGNS[index].members || []), newMember],
        totalLeads: MOCK_CAMPAIGNS[index].totalLeads + (member.memberType === 'Lead' ? 1 : 0),
        updatedAt: new Date().toISOString(),
      };
      return MOCK_CAMPAIGNS[index];
    }

    const response = await apiClient.post<Campaign>(`/crm/campaigns/${campaignId}/members`, member);
    return response.data;
  }

  async updateMemberStatus(campaignId: string, memberId: string, status: CampaignMember['status']): Promise<Campaign> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const campaignIndex = MOCK_CAMPAIGNS.findIndex((c) => c.id === campaignId);
      if (campaignIndex === -1) throw new Error('Campaign not found');

      const members = MOCK_CAMPAIGNS[campaignIndex].members || [];
      const memberIndex = members.findIndex((m) => m.id === memberId);
      if (memberIndex === -1) throw new Error('Member not found');

      const previousStatus = members[memberIndex].status;
      members[memberIndex] = {
        ...members[memberIndex],
        status,
        lastResponseDate: ['Responded', 'Converted'].includes(status)
          ? new Date().toISOString().split('T')[0]
          : members[memberIndex].lastResponseDate,
      };

      let convertedLeads = MOCK_CAMPAIGNS[campaignIndex].convertedLeads;
      if (status === 'Converted' && previousStatus !== 'Converted') {
        convertedLeads++;
      } else if (previousStatus === 'Converted' && status !== 'Converted') {
        convertedLeads--;
      }

      MOCK_CAMPAIGNS[campaignIndex] = {
        ...MOCK_CAMPAIGNS[campaignIndex],
        members,
        convertedLeads,
        updatedAt: new Date().toISOString(),
      };
      return MOCK_CAMPAIGNS[campaignIndex];
    }

    const response = await apiClient.post<Campaign>(`/crm/campaigns/${campaignId}/members/${memberId}/status`, { status });
    return response.data;
  }

  async deleteCampaign(id: string): Promise<void> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const index = MOCK_CAMPAIGNS.findIndex((c) => c.id === id);
      if (index === -1) throw new Error('Campaign not found');
      MOCK_CAMPAIGNS.splice(index, 1);
      return;
    }

    await apiClient.delete(`/crm/campaigns/${id}`);
  }

  async getOverallStats(): Promise<{
    totalCampaigns: number;
    activeCampaigns: number;
    totalBudget: number;
    totalSpent: number;
    totalRevenue: number;
    overallROI: number;
    totalLeads: number;
    totalConversions: number;
  }> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));

      const totalBudget = MOCK_CAMPAIGNS.reduce((sum, c) => sum + c.budget, 0);
      const totalSpent = MOCK_CAMPAIGNS.reduce((sum, c) => sum + c.actualCost, 0);
      const totalRevenue = MOCK_CAMPAIGNS.reduce((sum, c) => sum + c.actualRevenue, 0);

      return {
        totalCampaigns: MOCK_CAMPAIGNS.length,
        activeCampaigns: MOCK_CAMPAIGNS.filter(c => c.status === 'Active').length,
        totalBudget,
        totalSpent,
        totalRevenue,
        overallROI: totalSpent > 0 ? ((totalRevenue - totalSpent) / totalSpent) * 100 : 0,
        totalLeads: MOCK_CAMPAIGNS.reduce((sum, c) => sum + c.totalLeads, 0),
        totalConversions: MOCK_CAMPAIGNS.reduce((sum, c) => sum + c.convertedLeads, 0),
      };
    }

    const response = await apiClient.get<{
      totalCampaigns: number;
      activeCampaigns: number;
      totalBudget: number;
      totalSpent: number;
      totalRevenue: number;
      overallROI: number;
      totalLeads: number;
      totalConversions: number;
    }>('/crm/campaigns/stats');
    return response.data;
  }
}

export const campaignService = new CampaignService();
