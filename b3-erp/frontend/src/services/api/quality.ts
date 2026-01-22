/**
 * Quality API Service
 * Wires frontend to backend Quality module APIs
 */

import apiClient from '@/lib/api-client';

// ============================================
// TYPES
// ============================================

export interface Inspection {
  id: string;
  inspectionNumber: string;
  inspectionType: 'incoming' | 'in_process' | 'final' | 'periodic' | 'customer_return';
  sourceType: 'purchase_order' | 'work_order' | 'stock' | 'customer_return';
  sourceId?: string;
  sourceNumber?: string;
  itemId: string;
  itemCode: string;
  itemName: string;
  quantity: number;
  uom: string;
  sampleSize: number;
  status: 'draft' | 'scheduled' | 'in_progress' | 'completed' | 'approved' | 'rejected';
  result?: 'pass' | 'fail' | 'conditional_pass';
  inspectionDate?: string;
  inspectorId?: string;
  inspectorName?: string;
  workCenterId?: string;
  workCenterName?: string;
  templateId?: string;
  templateName?: string;
  parameters: InspectionParameter[];
  defectsFound: InspectionDefect[];
  passedQuantity?: number;
  rejectedQuantity?: number;
  remarks?: string;
  attachments?: { fileName: string; fileUrl: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface InspectionParameter {
  id: string;
  parameterName: string;
  parameterType: 'numeric' | 'boolean' | 'text' | 'visual';
  specification?: string;
  minValue?: number;
  maxValue?: number;
  targetValue?: number;
  actualValue?: string | number | boolean;
  result?: 'pass' | 'fail' | 'not_tested';
  remarks?: string;
}

export interface InspectionDefect {
  id: string;
  defectCode: string;
  defectName: string;
  severity: 'critical' | 'major' | 'minor';
  quantity: number;
  description?: string;
}

export interface InspectionTemplate {
  id: string;
  templateCode: string;
  templateName: string;
  description?: string;
  itemId?: string;
  itemCode?: string;
  categoryId?: string;
  categoryName?: string;
  inspectionType: 'incoming' | 'in_process' | 'final' | 'periodic';
  parameters: {
    parameterName: string;
    parameterType: 'numeric' | 'boolean' | 'text' | 'visual';
    specification?: string;
    minValue?: number;
    maxValue?: number;
    targetValue?: number;
    isMandatory: boolean;
    sequenceNumber: number;
  }[];
  sampleSizePercent?: number;
  sampleSizeQuantity?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NCR {
  id: string;
  ncrNumber: string;
  ncrType: 'internal' | 'supplier' | 'customer';
  status: 'draft' | 'open' | 'under_investigation' | 'root_cause_identified' | 'corrective_action_pending' | 'closed' | 'cancelled';
  severity: 'critical' | 'major' | 'minor';
  sourceType?: 'inspection' | 'customer_complaint' | 'internal_audit' | 'production';
  sourceId?: string;
  sourceNumber?: string;
  itemId?: string;
  itemCode?: string;
  itemName?: string;
  affectedQuantity?: number;
  uom?: string;
  workOrderId?: string;
  workOrderNumber?: string;
  vendorId?: string;
  vendorName?: string;
  customerId?: string;
  customerName?: string;
  description: string;
  rootCause?: string;
  immediateAction?: string;
  disposition?: 'use_as_is' | 'rework' | 'scrap' | 'return_to_vendor' | 'sort_and_use';
  dispositionQuantity?: number;
  capaRequired: boolean;
  capaId?: string;
  capaNumber?: string;
  reportedBy: string;
  reportedDate: string;
  investigatedBy?: string;
  investigationDate?: string;
  closedBy?: string;
  closedDate?: string;
  attachments?: { fileName: string; fileUrl: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface CAPA {
  id: string;
  capaNumber: string;
  capaType: 'corrective' | 'preventive' | 'both';
  status: 'draft' | 'submitted' | 'approved' | 'in_progress' | 'verification_pending' | 'verified' | 'closed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  sourceType?: 'ncr' | 'audit' | 'customer_complaint' | 'management_review';
  sourceId?: string;
  sourceNumber?: string;
  ncrId?: string;
  ncrNumber?: string;
  title: string;
  description: string;
  rootCauseAnalysis?: string;
  correctiveAction?: string;
  preventiveAction?: string;
  responsiblePersonId: string;
  responsiblePersonName: string;
  targetCompletionDate: string;
  actualCompletionDate?: string;
  verificationMethod?: string;
  verificationResult?: string;
  verifiedBy?: string;
  verifiedDate?: string;
  effectivenessRating?: number;
  attachments?: { fileName: string; fileUrl: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface AuditPlan {
  id: string;
  auditNumber: string;
  auditType: 'internal' | 'external' | 'supplier' | 'customer';
  auditName: string;
  description?: string;
  status: 'planned' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  plannedStartDate: string;
  plannedEndDate: string;
  actualStartDate?: string;
  actualEndDate?: string;
  leadAuditorId: string;
  leadAuditorName: string;
  auditTeam: { auditorId: string; auditorName: string; role: string }[];
  scope: string;
  objectives: string[];
  checklist?: AuditChecklistItem[];
  departmentId?: string;
  departmentName?: string;
  vendorId?: string;
  vendorName?: string;
  findings?: AuditFinding[];
  createdAt: string;
  updatedAt: string;
}

export interface AuditChecklistItem {
  id: string;
  question: string;
  standardReference?: string;
  response?: 'conforming' | 'non_conforming' | 'observation' | 'not_applicable';
  evidence?: string;
  remarks?: string;
}

export interface AuditFinding {
  id: string;
  findingNumber: string;
  findingType: 'non_conformance' | 'observation' | 'opportunity_for_improvement';
  severity: 'critical' | 'major' | 'minor';
  description: string;
  standardReference?: string;
  evidence?: string;
  capaRequired: boolean;
  capaId?: string;
  status: 'open' | 'capa_raised' | 'closed';
}

// ============================================
// INSPECTION API
// ============================================

export const inspectionApi = {
  async getAll(filters?: {
    status?: string;
    inspectionType?: string;
    itemId?: string;
    fromDate?: string;
    toDate?: string;
    result?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: Inspection[]; total: number }> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }
    const response = await apiClient.get(`/quality/inspection?${params.toString()}`);
    return response.data;
  },

  async getById(id: string): Promise<Inspection> {
    const response = await apiClient.get(`/quality/inspection/${id}`);
    return response.data;
  },

  async create(data: {
    inspectionType: string;
    sourceType?: string;
    sourceId?: string;
    itemId: string;
    quantity: number;
    sampleSize?: number;
    templateId?: string;
    inspectionDate?: string;
    inspectorId?: string;
    workCenterId?: string;
  }): Promise<Inspection> {
    const response = await apiClient.post('/quality/inspection', data);
    return response.data;
  },

  async update(id: string, data: Partial<Inspection>): Promise<Inspection> {
    const response = await apiClient.put(`/quality/inspection/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/quality/inspection/${id}`);
  },

  async start(id: string): Promise<Inspection> {
    const response = await apiClient.post(`/quality/inspection/${id}/start`);
    return response.data;
  },

  async recordResults(id: string, data: {
    parameters: { parameterId: string; actualValue: string | number | boolean; result?: string; remarks?: string }[];
    defects?: { defectCode: string; quantity: number; description?: string }[];
    passedQuantity: number;
    rejectedQuantity: number;
    remarks?: string;
  }): Promise<Inspection> {
    const response = await apiClient.post(`/quality/inspection/${id}/record-results`, data);
    return response.data;
  },

  async submit(id: string): Promise<Inspection> {
    const response = await apiClient.post(`/quality/inspection/${id}/submit`);
    return response.data;
  },

  async approve(id: string, result: 'pass' | 'fail' | 'conditional_pass', remarks?: string): Promise<Inspection> {
    const response = await apiClient.post(`/quality/inspection/${id}/approve`, { result, remarks });
    return response.data;
  },

  async reject(id: string, remarks: string): Promise<Inspection> {
    const response = await apiClient.post(`/quality/inspection/${id}/reject`, { remarks });
    return response.data;
  },

  async getStatistics(filters?: {
    fromDate?: string;
    toDate?: string;
    inspectionType?: string;
  }): Promise<{
    total: number;
    passed: number;
    failed: number;
    passRate: number;
    byType: { type: string; count: number; passRate: number }[];
    topDefects: { defectCode: string; defectName: string; count: number }[];
  }> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }
    const response = await apiClient.get(`/quality/inspection/statistics?${params.toString()}`);
    return response.data;
  },

  async exportReport(id: string): Promise<{ pdfUrl: string }> {
    const response = await apiClient.post(`/quality/inspection/${id}/export`);
    return response.data;
  },
};

// ============================================
// INSPECTION TEMPLATE API
// ============================================

export const inspectionTemplateApi = {
  async getAll(filters?: {
    inspectionType?: string;
    itemId?: string;
    categoryId?: string;
    isActive?: boolean;
  }): Promise<InspectionTemplate[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }
    const response = await apiClient.get(`/quality/inspection-templates?${params.toString()}`);
    return response.data;
  },

  async getById(id: string): Promise<InspectionTemplate> {
    const response = await apiClient.get(`/quality/inspection-templates/${id}`);
    return response.data;
  },

  async create(data: Partial<InspectionTemplate>): Promise<InspectionTemplate> {
    const response = await apiClient.post('/quality/inspection-templates', data);
    return response.data;
  },

  async update(id: string, data: Partial<InspectionTemplate>): Promise<InspectionTemplate> {
    const response = await apiClient.put(`/quality/inspection-templates/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/quality/inspection-templates/${id}`);
  },
};

// ============================================
// NCR API
// ============================================

export const ncrApi = {
  async getAll(filters?: {
    status?: string;
    ncrType?: string;
    severity?: string;
    fromDate?: string;
    toDate?: string;
    vendorId?: string;
    customerId?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: NCR[]; total: number }> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }
    const response = await apiClient.get(`/quality/ncr?${params.toString()}`);
    return response.data;
  },

  async getById(id: string): Promise<NCR> {
    const response = await apiClient.get(`/quality/ncr/${id}`);
    return response.data;
  },

  async create(data: {
    ncrType: string;
    severity: string;
    sourceType?: string;
    sourceId?: string;
    itemId?: string;
    affectedQuantity?: number;
    workOrderId?: string;
    vendorId?: string;
    customerId?: string;
    description: string;
    immediateAction?: string;
  }): Promise<NCR> {
    const response = await apiClient.post('/quality/ncr', data);
    return response.data;
  },

  async update(id: string, data: Partial<NCR>): Promise<NCR> {
    const response = await apiClient.put(`/quality/ncr/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/quality/ncr/${id}`);
  },

  async investigate(id: string, data: {
    rootCause: string;
    investigatedBy: string;
  }): Promise<NCR> {
    const response = await apiClient.post(`/quality/ncr/${id}/investigate`, data);
    return response.data;
  },

  async setDisposition(id: string, data: {
    disposition: string;
    dispositionQuantity: number;
    remarks?: string;
  }): Promise<NCR> {
    const response = await apiClient.post(`/quality/ncr/${id}/disposition`, data);
    return response.data;
  },

  async raiseCapa(id: string): Promise<{ ncr: NCR; capa: CAPA }> {
    const response = await apiClient.post(`/quality/ncr/${id}/raise-capa`);
    return response.data;
  },

  async close(id: string, remarks?: string): Promise<NCR> {
    const response = await apiClient.post(`/quality/ncr/${id}/close`, { remarks });
    return response.data;
  },
};

// ============================================
// CAPA API
// ============================================

export const capaApi = {
  async getAll(filters?: {
    status?: string;
    capaType?: string;
    priority?: string;
    responsiblePersonId?: string;
    fromDate?: string;
    toDate?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: CAPA[]; total: number }> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }
    const response = await apiClient.get(`/quality/corrective-actions?${params.toString()}`);
    return response.data;
  },

  async getById(id: string): Promise<CAPA> {
    const response = await apiClient.get(`/quality/corrective-actions/${id}`);
    return response.data;
  },

  async create(data: {
    capaType: string;
    priority: string;
    sourceType?: string;
    sourceId?: string;
    ncrId?: string;
    title: string;
    description: string;
    rootCauseAnalysis?: string;
    correctiveAction?: string;
    preventiveAction?: string;
    responsiblePersonId: string;
    targetCompletionDate: string;
  }): Promise<CAPA> {
    const response = await apiClient.post('/quality/corrective-actions', data);
    return response.data;
  },

  async update(id: string, data: Partial<CAPA>): Promise<CAPA> {
    const response = await apiClient.put(`/quality/corrective-actions/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/quality/corrective-actions/${id}`);
  },

  async submit(id: string): Promise<CAPA> {
    const response = await apiClient.post(`/quality/corrective-actions/${id}/submit`);
    return response.data;
  },

  async approve(id: string): Promise<CAPA> {
    const response = await apiClient.post(`/quality/corrective-actions/${id}/approve`);
    return response.data;
  },

  async implement(id: string, data: {
    actualCompletionDate: string;
    implementationNotes?: string;
  }): Promise<CAPA> {
    const response = await apiClient.post(`/quality/corrective-actions/${id}/implement`, data);
    return response.data;
  },

  async verify(id: string, data: {
    verificationResult: string;
    effectivenessRating: number;
    verifiedBy: string;
    remarks?: string;
  }): Promise<CAPA> {
    const response = await apiClient.post(`/quality/corrective-actions/${id}/verify`, data);
    return response.data;
  },

  async close(id: string): Promise<CAPA> {
    const response = await apiClient.post(`/quality/corrective-actions/${id}/close`);
    return response.data;
  },
};

// ============================================
// AUDIT API
// ============================================

export const auditApi = {
  async getPlans(filters?: {
    status?: string;
    auditType?: string;
    fromDate?: string;
    toDate?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: AuditPlan[]; total: number }> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }
    const response = await apiClient.get(`/quality/audit-plans?${params.toString()}`);
    return response.data;
  },

  async getPlanById(id: string): Promise<AuditPlan> {
    const response = await apiClient.get(`/quality/audit-plans/${id}`);
    return response.data;
  },

  async createPlan(data: Partial<AuditPlan>): Promise<AuditPlan> {
    const response = await apiClient.post('/quality/audit-plans', data);
    return response.data;
  },

  async updatePlan(id: string, data: Partial<AuditPlan>): Promise<AuditPlan> {
    const response = await apiClient.put(`/quality/audit-plans/${id}`, data);
    return response.data;
  },

  async deletePlan(id: string): Promise<void> {
    await apiClient.delete(`/quality/audit-plans/${id}`);
  },

  async startAudit(id: string): Promise<AuditPlan> {
    const response = await apiClient.post(`/quality/audit-plans/${id}/start`);
    return response.data;
  },

  async completeAudit(id: string, data: {
    findings: AuditFinding[];
    summary?: string;
  }): Promise<AuditPlan> {
    const response = await apiClient.post(`/quality/audit-plans/${id}/complete`, data);
    return response.data;
  },

  async getFindings(filters?: {
    auditId?: string;
    findingType?: string;
    severity?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: AuditFinding[]; total: number }> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }
    const response = await apiClient.get(`/quality/audit-findings?${params.toString()}`);
    return response.data;
  },

  async raiseCapa(findingId: string): Promise<{ finding: AuditFinding; capa: CAPA }> {
    const response = await apiClient.post(`/quality/audit-findings/${findingId}/raise-capa`);
    return response.data;
  },
};

// Export all APIs as a single object
export const qualityService = {
  inspections: inspectionApi,
  inspectionTemplates: inspectionTemplateApi,
  ncr: ncrApi,
  capa: capaApi,
  audits: auditApi,
};

export default qualityService;
