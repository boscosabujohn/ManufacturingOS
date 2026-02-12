import { apiClient } from './api/client';

// ==================== TypeScript Interfaces ====================

export type AuditAction =
  | 'create'
  | 'update'
  | 'delete'
  | 'status_change'
  | 'approval'
  | 'rejection'
  | 'submit'
  | 'send'
  | 'receive'
  | 'evaluate'
  | 'award'
  | 'cancel'
  | 'comment'
  | 'attachment'
  | 'view'
  | 'export'
  | 'print';

export type AuditEntityType =
  | 'rfq'
  | 'vendor_quotation'
  | 'purchase_order'
  | 'purchase_requisition'
  | 'goods_receipt'
  | 'purchase_invoice'
  | 'purchase_return'
  | 'vendor_evaluation'
  | 'vendor_contract'
  | 'vendor_message'
  | 'sourcing_rule';

export interface AuditTrailEntry {
  id: string;
  companyId: string;
  entityType: AuditEntityType;
  entityId: string;
  entityNumber?: string;
  action: AuditAction;
  actionDescription: string;
  userId: string;
  userName: string;
  userEmail?: string;
  userRole?: string;
  previousValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
  changedFields?: string[];
  previousStatus?: string;
  newStatus?: string;
  comments?: string;
  metadata?: {
    ipAddress?: string;
    userAgent?: string;
    sessionId?: string;
    source?: string;
    relatedEntityType?: string;
    relatedEntityId?: string;
    relatedEntityNumber?: string;
  };
  createdAt: string;
}

export interface AuditTrailFilter {
  companyId: string;
  entityType?: AuditEntityType;
  entityId?: string;
  action?: AuditAction;
  userId?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
}

export interface AuditTrailResponse {
  data: AuditTrailEntry[];
  total: number;
  page: number;
  limit: number;
}

export interface AuditSummary {
  totalActions: number;
  byAction: Record<string, number>;
  byEntityType: Record<string, number>;
  byUser: { userId: string; userName: string; count: number }[];
}

// ==================== Mock Data ====================

const MOCK_AUDIT_ENTRIES: AuditTrailEntry[] = [
  {
    id: 'audit-001',
    companyId: 'company-001',
    entityType: 'rfq',
    entityId: 'rfq-001',
    entityNumber: 'RFQ-2025-0001',
    action: 'create',
    actionDescription: 'Created RFQ RFQ-2025-0001',
    userId: 'user-001',
    userName: 'John Smith',
    userEmail: 'john.smith@company.com',
    userRole: 'Procurement Manager',
    newValues: { title: 'Office Supplies Procurement', status: 'Draft' },
    createdAt: '2025-02-01T09:00:00Z',
  },
  {
    id: 'audit-002',
    companyId: 'company-001',
    entityType: 'rfq',
    entityId: 'rfq-001',
    entityNumber: 'RFQ-2025-0001',
    action: 'send',
    actionDescription: 'Sent RFQ to 3 vendors',
    userId: 'user-001',
    userName: 'John Smith',
    previousStatus: 'Draft',
    newStatus: 'Sent',
    createdAt: '2025-02-01T10:30:00Z',
  },
  {
    id: 'audit-003',
    companyId: 'company-001',
    entityType: 'vendor_quotation',
    entityId: 'quote-001',
    entityNumber: 'QT-2025-0001',
    action: 'receive',
    actionDescription: 'Received quotation from ABC Supplies',
    userId: 'system',
    userName: 'System',
    newValues: { vendorName: 'ABC Supplies', totalAmount: 15000 },
    createdAt: '2025-02-03T14:00:00Z',
  },
  {
    id: 'audit-004',
    companyId: 'company-001',
    entityType: 'vendor_quotation',
    entityId: 'quote-001',
    entityNumber: 'QT-2025-0001',
    action: 'evaluate',
    actionDescription: 'Evaluated quotation QT-2025-0001 with score 85',
    userId: 'user-002',
    userName: 'Sarah Johnson',
    newValues: { evaluationScore: 85 },
    createdAt: '2025-02-05T11:00:00Z',
  },
  {
    id: 'audit-005',
    companyId: 'company-001',
    entityType: 'rfq',
    entityId: 'rfq-001',
    entityNumber: 'RFQ-2025-0001',
    action: 'award',
    actionDescription: 'Awarded RFQ-2025-0001 to ABC Supplies for $15,000',
    userId: 'user-003',
    userName: 'Michael Brown',
    userRole: 'Procurement Director',
    previousStatus: 'Under Evaluation',
    newStatus: 'Awarded',
    newValues: { awardedVendor: 'ABC Supplies', awardedAmount: 15000 },
    comments: 'Best value for money with good delivery terms',
    createdAt: '2025-02-06T16:00:00Z',
  },
];

// ==================== Service Class ====================

class ProcurementAuditTrailService {
  private baseUrl = '/procurement/audit-trail';

  async getAuditTrail(filter: AuditTrailFilter): Promise<AuditTrailResponse> {
    try {
      const params = new URLSearchParams();
      params.append('companyId', filter.companyId);
      if (filter.entityType) params.append('entityType', filter.entityType);
      if (filter.entityId) params.append('entityId', filter.entityId);
      if (filter.action) params.append('action', filter.action);
      if (filter.userId) params.append('userId', filter.userId);
      if (filter.fromDate) params.append('fromDate', filter.fromDate);
      if (filter.toDate) params.append('toDate', filter.toDate);
      if (filter.page) params.append('page', filter.page.toString());
      if (filter.limit) params.append('limit', filter.limit.toString());

      const response = await apiClient.get<AuditTrailResponse>(
        `${this.baseUrl}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      console.error('API Error fetching audit trail, using mock data:', error);

      let filteredEntries = [...MOCK_AUDIT_ENTRIES];

      if (filter.entityType) {
        filteredEntries = filteredEntries.filter((e) => e.entityType === filter.entityType);
      }
      if (filter.entityId) {
        filteredEntries = filteredEntries.filter((e) => e.entityId === filter.entityId);
      }
      if (filter.action) {
        filteredEntries = filteredEntries.filter((e) => e.action === filter.action);
      }
      if (filter.userId) {
        filteredEntries = filteredEntries.filter((e) => e.userId === filter.userId);
      }

      return {
        data: filteredEntries,
        total: filteredEntries.length,
        page: filter.page || 1,
        limit: filter.limit || 50,
      };
    }
  }

  async getEntityHistory(
    companyId: string,
    entityType: AuditEntityType,
    entityId: string
  ): Promise<AuditTrailEntry[]> {
    try {
      const response = await apiClient.get<AuditTrailEntry[]>(
        `${this.baseUrl}/entity/${entityType}/${entityId}?companyId=${companyId}`
      );
      return response.data;
    } catch (error) {
      console.error('API Error fetching entity history, using mock data:', error);
      return MOCK_AUDIT_ENTRIES.filter(
        (e) => e.entityType === entityType && e.entityId === entityId
      );
    }
  }

  async getUserActivity(
    companyId: string,
    userId: string,
    fromDate?: string,
    toDate?: string
  ): Promise<AuditTrailEntry[]> {
    try {
      const params = new URLSearchParams({ companyId });
      if (fromDate) params.append('fromDate', fromDate);
      if (toDate) params.append('toDate', toDate);

      const response = await apiClient.get<AuditTrailEntry[]>(
        `${this.baseUrl}/user/${userId}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      console.error('API Error fetching user activity, using mock data:', error);
      return MOCK_AUDIT_ENTRIES.filter((e) => e.userId === userId);
    }
  }

  async getAuditSummary(
    companyId: string,
    fromDate: string,
    toDate: string
  ): Promise<AuditSummary> {
    try {
      const params = new URLSearchParams({ companyId, fromDate, toDate });
      const response = await apiClient.get<AuditSummary>(
        `${this.baseUrl}/summary?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      console.error('API Error fetching audit summary, using mock data:', error);

      const byAction: Record<string, number> = {};
      const byEntityType: Record<string, number> = {};
      const userMap: Map<string, { userName: string; count: number }> = new Map();

      MOCK_AUDIT_ENTRIES.forEach((entry) => {
        byAction[entry.action] = (byAction[entry.action] || 0) + 1;
        byEntityType[entry.entityType] = (byEntityType[entry.entityType] || 0) + 1;

        const userData = userMap.get(entry.userId) || { userName: entry.userName, count: 0 };
        userData.count++;
        userMap.set(entry.userId, userData);
      });

      return {
        totalActions: MOCK_AUDIT_ENTRIES.length,
        byAction,
        byEntityType,
        byUser: Array.from(userMap.entries()).map(([userId, data]) => ({
          userId,
          userName: data.userName,
          count: data.count,
        })),
      };
    }
  }
}

export const procurementAuditTrailService = new ProcurementAuditTrailService();
