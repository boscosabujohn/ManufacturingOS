import { apiClient } from '../api/client';

// ==================== TypeScript Interfaces ====================

export interface CPQSettings {
  id: string;
  companyId: string;
  quoteNumberPrefix: string;
  quoteNumberSequence: number;
  defaultValidityDays: number;
  defaultCurrency: string;
  taxSettings: { taxName: string; rate: number; isDefault: boolean }[];
  discountApprovalRequired: boolean;
  discountApprovalThreshold: number;
  quoteApprovalRequired: boolean;
  quoteApprovalThreshold: number;
  autoExpireQuotes: boolean;
  enableVersioning: boolean;
  enableESignature: boolean;
  emailNotifications: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CPQUserPermission {
  id: string;
  companyId: string;
  userId: string;
  userName?: string;
  role: 'admin' | 'manager' | 'sales_rep' | 'viewer';
  permissions: {
    canCreateQuote: boolean;
    canEditQuote: boolean;
    canDeleteQuote: boolean;
    canApproveQuote: boolean;
    canSendQuote: boolean;
    canViewAllQuotes: boolean;
    canManagePricing: boolean;
    canManageTemplates: boolean;
    canManageSettings: boolean;
  };
  maxDiscountPercentage?: number;
  maxApprovalAmount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CPQApprovalWorkflow {
  id: string;
  companyId: string;
  workflowName: string;
  workflowType: 'quote' | 'discount' | 'proposal' | 'contract';
  isActive: boolean;
  isDefault: boolean;
  steps: {
    stepNumber: number;
    stepName: string;
    approverType: 'user' | 'role' | 'manager';
    approverId?: string;
    approverRole?: string;
    isRequired: boolean;
    canSkip: boolean;
    timeoutHours?: number;
    escalationUserId?: string;
  }[];
  conditions?: { field: string; operator: string; value: unknown }[];
  thresholdAmount?: number;
  thresholdDiscountPercentage?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CPQApprovalRequest {
  id: string;
  companyId: string;
  workflowId: string;
  entityType: 'quote' | 'discount' | 'proposal' | 'contract';
  entityId: string;
  entityNumber?: string;
  status: 'pending' | 'approved' | 'rejected' | 'escalated' | 'cancelled';
  currentStep: number;
  approvalHistory: {
    stepNumber: number;
    approverId: string;
    approverName: string;
    action: 'approved' | 'rejected' | 'escalated';
    actionAt: string;
    comments?: string;
  }[];
  requestedBy: string;
  requestNotes?: string;
  requestedAmount?: number;
  requestedDiscountPercentage?: number;
  finalApproverId?: string;
  completedAt?: string;
  finalComments?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CPQNotificationSetting {
  id: string;
  companyId: string;
  userId: string;
  notificationType: string;
  emailEnabled: boolean;
  inAppEnabled: boolean;
  pushEnabled: boolean;
}

export interface CPQIntegration {
  id: string;
  companyId: string;
  name: string;
  integrationType: 'crm' | 'erp' | 'cad' | 'ecommerce' | 'esignature';
  provider: string;
  isActive: boolean;
  connectionStatus: 'connected' | 'disconnected' | 'error';
  lastSyncAt?: string;
  lastSyncStatus?: 'success' | 'failed' | 'in_progress' | 'never';
  createdAt: string;
  updatedAt: string;
}

// ==================== Mock Data ====================

const MOCK_SETTINGS: CPQSettings = {
  id: 'settings-001',
  companyId: 'company-001',
  quoteNumberPrefix: 'QT',
  quoteNumberSequence: 100,
  defaultValidityDays: 30,
  defaultCurrency: 'USD',
  taxSettings: [
    { taxName: 'Sales Tax', rate: 8.25, isDefault: true },
    { taxName: 'State Tax', rate: 6, isDefault: false },
  ],
  discountApprovalRequired: true,
  discountApprovalThreshold: 10,
  quoteApprovalRequired: true,
  quoteApprovalThreshold: 100000,
  autoExpireQuotes: true,
  enableVersioning: true,
  enableESignature: true,
  emailNotifications: true,
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-15T00:00:00Z',
};

const MOCK_PERMISSIONS: CPQUserPermission[] = [
  {
    id: 'perm-001',
    companyId: 'company-001',
    userId: 'user-001',
    userName: 'Sarah Johnson',
    role: 'sales_rep',
    permissions: {
      canCreateQuote: true,
      canEditQuote: true,
      canDeleteQuote: false,
      canApproveQuote: false,
      canSendQuote: true,
      canViewAllQuotes: false,
      canManagePricing: false,
      canManageTemplates: false,
      canManageSettings: false,
    },
    maxDiscountPercentage: 10,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'perm-002',
    companyId: 'company-001',
    userId: 'user-002',
    userName: 'Mike Wilson',
    role: 'manager',
    permissions: {
      canCreateQuote: true,
      canEditQuote: true,
      canDeleteQuote: true,
      canApproveQuote: true,
      canSendQuote: true,
      canViewAllQuotes: true,
      canManagePricing: true,
      canManageTemplates: true,
      canManageSettings: false,
    },
    maxDiscountPercentage: 20,
    maxApprovalAmount: 500000,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
];

const MOCK_WORKFLOWS: CPQApprovalWorkflow[] = [
  {
    id: 'wf-001',
    companyId: 'company-001',
    workflowName: 'Standard Quote Approval',
    workflowType: 'quote',
    isActive: true,
    isDefault: true,
    steps: [
      { stepNumber: 1, stepName: 'Manager Approval', approverType: 'manager', isRequired: true, canSkip: false },
      { stepNumber: 2, stepName: 'Director Approval', approverType: 'role', approverRole: 'director', isRequired: false, canSkip: true },
    ],
    thresholdAmount: 100000,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'wf-002',
    companyId: 'company-001',
    workflowName: 'High Discount Approval',
    workflowType: 'discount',
    isActive: true,
    isDefault: false,
    steps: [
      { stepNumber: 1, stepName: 'Sales Manager', approverType: 'role', approverRole: 'sales_manager', isRequired: true, canSkip: false },
      { stepNumber: 2, stepName: 'Finance Approval', approverType: 'role', approverRole: 'finance', isRequired: true, canSkip: false },
    ],
    thresholdDiscountPercentage: 15,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
];

const MOCK_INTEGRATIONS: CPQIntegration[] = [
  {
    id: 'int-001',
    companyId: 'company-001',
    name: 'Salesforce CRM',
    integrationType: 'crm',
    provider: 'salesforce',
    isActive: true,
    connectionStatus: 'connected',
    lastSyncAt: '2025-02-10T08:00:00Z',
    lastSyncStatus: 'success',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-02-10T08:00:00Z',
  },
  {
    id: 'int-002',
    companyId: 'company-001',
    name: 'DocuSign',
    integrationType: 'esignature',
    provider: 'docusign',
    isActive: true,
    connectionStatus: 'connected',
    lastSyncAt: '2025-02-09T14:30:00Z',
    lastSyncStatus: 'success',
    createdAt: '2025-01-05T00:00:00Z',
    updatedAt: '2025-02-09T14:30:00Z',
  },
];

// ==================== Service Class ====================

class CPQSettingsService {
  private baseUrl = '/cpq/settings';

  // General Settings
  async getSettings(): Promise<CPQSettings> {
    try {
      const response = await apiClient.get<CPQSettings>(this.baseUrl);
      return response.data;
    } catch (error) {
      console.error('API Error fetching settings, using mock data:', error);
      return { ...MOCK_SETTINGS };
    }
  }

  async updateSettings(data: Partial<CPQSettings>): Promise<CPQSettings> {
    try {
      const response = await apiClient.patch<CPQSettings>(this.baseUrl, data);
      return response.data;
    } catch (error) {
      console.error('API Error updating settings, using mock data:', error);
      Object.assign(MOCK_SETTINGS, data, { updatedAt: new Date().toISOString() });
      return { ...MOCK_SETTINGS };
    }
  }

  // User Permissions
  async getAllUserPermissions(): Promise<CPQUserPermission[]> {
    try {
      const response = await apiClient.get<CPQUserPermission[]>(`${this.baseUrl}/permissions`);
      return response.data;
    } catch (error) {
      console.error('API Error fetching permissions, using mock data:', error);
      return [...MOCK_PERMISSIONS];
    }
  }

  async getUserPermissions(userId: string): Promise<CPQUserPermission | null> {
    try {
      const response = await apiClient.get<CPQUserPermission>(`${this.baseUrl}/permissions/${userId}`);
      return response.data;
    } catch (error) {
      console.error('API Error fetching user permissions, using mock data:', error);
      return MOCK_PERMISSIONS.find((p) => p.userId === userId) || null;
    }
  }

  async setUserPermissions(userId: string, data: Partial<CPQUserPermission>): Promise<CPQUserPermission> {
    try {
      const response = await apiClient.post<CPQUserPermission>(`${this.baseUrl}/permissions/${userId}`, data);
      return response.data;
    } catch (error) {
      console.error('API Error setting permissions, using mock data:', error);
      const existing = MOCK_PERMISSIONS.find((p) => p.userId === userId);
      if (existing) {
        Object.assign(existing, data, { updatedAt: new Date().toISOString() });
        return existing;
      }
      const newPerm: CPQUserPermission = {
        id: `perm-${Date.now()}`,
        companyId: 'company-001',
        userId,
        role: data.role || 'viewer',
        permissions: data.permissions || {
          canCreateQuote: false,
          canEditQuote: false,
          canDeleteQuote: false,
          canApproveQuote: false,
          canSendQuote: false,
          canViewAllQuotes: false,
          canManagePricing: false,
          canManageTemplates: false,
          canManageSettings: false,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...data,
      } as CPQUserPermission;
      MOCK_PERMISSIONS.push(newPerm);
      return newPerm;
    }
  }

  async canApproveQuote(userId: string, quoteValue: number): Promise<boolean> {
    try {
      const response = await apiClient.get<boolean>(`${this.baseUrl}/permissions/${userId}/can-approve-quote?value=${quoteValue}`);
      return response.data;
    } catch (error) {
      console.error('API Error checking approval permission, using mock data:', error);
      const perm = MOCK_PERMISSIONS.find((p) => p.userId === userId);
      if (!perm) return false;
      return perm.permissions.canApproveQuote && (!perm.maxApprovalAmount || quoteValue <= perm.maxApprovalAmount);
    }
  }

  async canApplyDiscount(userId: string, discountPercentage: number): Promise<boolean> {
    try {
      const response = await apiClient.get<boolean>(`${this.baseUrl}/permissions/${userId}/can-apply-discount?percentage=${discountPercentage}`);
      return response.data;
    } catch (error) {
      console.error('API Error checking discount permission, using mock data:', error);
      const perm = MOCK_PERMISSIONS.find((p) => p.userId === userId);
      if (!perm) return false;
      return !perm.maxDiscountPercentage || discountPercentage <= perm.maxDiscountPercentage;
    }
  }

  // Approval Workflows
  async findAllWorkflows(filters?: { workflowType?: string; isActive?: boolean }): Promise<CPQApprovalWorkflow[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.workflowType) params.append('workflowType', filters.workflowType);
      if (filters?.isActive !== undefined) params.append('isActive', String(filters.isActive));
      const response = await apiClient.get<CPQApprovalWorkflow[]>(`${this.baseUrl}/workflows?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('API Error fetching workflows, using mock data:', error);
      let result = [...MOCK_WORKFLOWS];
      if (filters?.workflowType) result = result.filter((w) => w.workflowType === filters.workflowType);
      if (filters?.isActive !== undefined) result = result.filter((w) => w.isActive === filters.isActive);
      return result;
    }
  }

  async findWorkflowById(id: string): Promise<CPQApprovalWorkflow> {
    try {
      const response = await apiClient.get<CPQApprovalWorkflow>(`${this.baseUrl}/workflows/${id}`);
      return response.data;
    } catch (error) {
      console.error('API Error fetching workflow, using mock data:', error);
      const workflow = MOCK_WORKFLOWS.find((w) => w.id === id);
      if (!workflow) throw new Error(`Workflow with ID ${id} not found`);
      return workflow;
    }
  }

  async createWorkflow(data: Partial<CPQApprovalWorkflow>): Promise<CPQApprovalWorkflow> {
    try {
      const response = await apiClient.post<CPQApprovalWorkflow>(`${this.baseUrl}/workflows`, data);
      return response.data;
    } catch (error) {
      console.error('API Error creating workflow, using mock data:', error);
      const newWorkflow: CPQApprovalWorkflow = {
        id: `wf-${Date.now()}`,
        companyId: 'company-001',
        workflowName: data.workflowName || 'New Workflow',
        workflowType: data.workflowType || 'quote',
        isActive: true,
        isDefault: false,
        steps: data.steps || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...data,
      } as CPQApprovalWorkflow;
      MOCK_WORKFLOWS.push(newWorkflow);
      return newWorkflow;
    }
  }

  async updateWorkflow(id: string, data: Partial<CPQApprovalWorkflow>): Promise<CPQApprovalWorkflow> {
    try {
      const response = await apiClient.patch<CPQApprovalWorkflow>(`${this.baseUrl}/workflows/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('API Error updating workflow, using mock data:', error);
      const index = MOCK_WORKFLOWS.findIndex((w) => w.id === id);
      if (index === -1) throw new Error(`Workflow with ID ${id} not found`);
      MOCK_WORKFLOWS[index] = { ...MOCK_WORKFLOWS[index], ...data, updatedAt: new Date().toISOString() };
      return MOCK_WORKFLOWS[index];
    }
  }

  async deleteWorkflow(id: string): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/workflows/${id}`);
    } catch (error) {
      console.error('API Error deleting workflow, using mock data:', error);
      const index = MOCK_WORKFLOWS.findIndex((w) => w.id === id);
      if (index !== -1) MOCK_WORKFLOWS.splice(index, 1);
    }
  }

  // Integrations
  async findAllIntegrations(filters?: { integrationType?: string; isActive?: boolean }): Promise<CPQIntegration[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.integrationType) params.append('integrationType', filters.integrationType);
      if (filters?.isActive !== undefined) params.append('isActive', String(filters.isActive));
      const response = await apiClient.get<CPQIntegration[]>(`${this.baseUrl}/integrations?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('API Error fetching integrations, using mock data:', error);
      let result = [...MOCK_INTEGRATIONS];
      if (filters?.integrationType) result = result.filter((i) => i.integrationType === filters.integrationType);
      if (filters?.isActive !== undefined) result = result.filter((i) => i.isActive === filters.isActive);
      return result;
    }
  }

  async testIntegration(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.post<{ success: boolean; message: string }>(`${this.baseUrl}/integrations/${id}/test`, {});
      return response.data;
    } catch (error) {
      console.error('API Error testing integration, using mock data:', error);
      const integration = MOCK_INTEGRATIONS.find((i) => i.id === id);
      return {
        success: integration?.connectionStatus === 'connected',
        message: integration?.connectionStatus === 'connected' ? 'Connection successful' : 'Connection failed',
      };
    }
  }

  async updateIntegration(id: string, data: Partial<CPQIntegration>): Promise<CPQIntegration> {
    try {
      const response = await apiClient.patch<CPQIntegration>(`${this.baseUrl}/integrations/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('API Error updating integration, using mock data:', error);
      const index = MOCK_INTEGRATIONS.findIndex((i) => i.id === id);
      if (index === -1) throw new Error(`Integration with ID ${id} not found`);
      MOCK_INTEGRATIONS[index] = { ...MOCK_INTEGRATIONS[index], ...data, updatedAt: new Date().toISOString() };
      return MOCK_INTEGRATIONS[index];
    }
  }
}

export const cpqSettingsService = new CPQSettingsService();
