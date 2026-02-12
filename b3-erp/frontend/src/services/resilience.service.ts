import { apiClient } from './api/client';

// ============================================================================
// TYPES - Supply Chain Risk
// ============================================================================

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type RiskCategory = 'supply' | 'demand' | 'operational' | 'financial' | 'geopolitical' | 'environmental' | 'cyber';
export type SourceType = 'single' | 'dual' | 'multi';

export interface SupplyChainRisk {
  id: string;
  companyId: string;
  riskName: string;
  category: RiskCategory;
  riskLevel: RiskLevel;
  probabilityScore: number;
  impactScore: number;
  overallRiskScore: number;
  supplierId?: string;
  supplierName?: string;
  sourceType?: SourceType;
  affectedItems?: any[];
  alternateSuppliers?: any[];
  mitigationActions?: any[];
  description?: string;
  identifiedDate?: Date;
  reviewDate?: Date;
  status: 'open' | 'monitoring' | 'mitigated' | 'closed';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// TYPES - Scenario Planning
// ============================================================================

export type DisruptionType = 'supply_shortage' | 'demand_surge' | 'equipment_failure' | 'natural_disaster' | 'market_change' | 'regulatory' | 'cyber_attack' | 'pandemic' | 'other';
export type ScenarioStatus = 'draft' | 'analyzing' | 'analyzed' | 'approved' | 'archived';

export interface ScenarioPlanning {
  id: string;
  companyId: string;
  scenarioName: string;
  description: string;
  disruptionType: DisruptionType;
  triggerConditions: string;
  status: ScenarioStatus;
  probability: number;
  severityLevel: RiskLevel;
  affectedAreas?: any[];
  impactAnalysis?: any;
  mitigationStrategies?: any[];
  resourceRequirements?: any[];
  estimatedRecoveryTime?: number;
  financialImpact?: any;
  createdBy: string;
  approvedBy?: string;
  approvedAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// TYPES - Capacity Flexibility
// ============================================================================

export type CapacityResourceType = 'machine' | 'labor' | 'facility' | 'storage' | 'logistics';
export type CapacityStatus = 'underutilized' | 'optimal' | 'strained' | 'overloaded';

export interface CapacityFlexibility {
  id: string;
  companyId: string;
  resourceId: string;
  resourceName: string;
  resourceType: CapacityResourceType;
  currentCapacity: number;
  maxCapacity: number;
  surgeCapacity?: number;
  currentDemand: number;
  utilizationRate: number;
  status: CapacityStatus;
  recordDate: Date;
  flexibilityOptions?: any[];
  bottlenecks?: any[];
  notes?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// TYPES - Business Continuity
// ============================================================================

export type ProcessCategory = 'production' | 'supply_chain' | 'it_systems' | 'facilities' | 'workforce' | 'logistics' | 'finance' | 'customer_service';
export type BCPHealthStatus = 'healthy' | 'warning' | 'critical' | 'down';
export type RecoveryPriority = 'critical' | 'high' | 'medium' | 'low';

export interface BusinessContinuity {
  id: string;
  companyId: string;
  processName: string;
  category: ProcessCategory;
  currentStatus: BCPHealthStatus;
  priority: RecoveryPriority;
  healthScore: number;
  rto: number;
  rpo: number;
  mtpd?: number;
  dependencies?: any[];
  recoveryProcedures?: any[];
  backupSystems?: any[];
  contactList?: any[];
  drillHistory?: any[];
  incidentHistory?: any[];
  lastReviewDate?: Date;
  nextReviewDate?: Date;
  lastDrillDate?: Date;
  nextDrillDate?: Date;
  planOwner?: string;
  notes?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// SERVICE CLASS
// ============================================================================

class ResilienceService {
  // Supply Chain Risk
  async getSupplyChainRisks(filters?: { companyId?: string; riskLevel?: RiskLevel; category?: RiskCategory; status?: string }): Promise<SupplyChainRisk[]> {
    const params = new URLSearchParams();
    if (filters?.companyId) params.append('companyId', filters.companyId);
    if (filters?.riskLevel) params.append('riskLevel', filters.riskLevel);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.status) params.append('status', filters.status);
    const response = await apiClient.get<SupplyChainRisk[]>(`/production/resilience/supply-chain-risks?${params.toString()}`);
    return response.data;
  }

  async getSupplyChainRiskById(id: string): Promise<SupplyChainRisk> {
    const response = await apiClient.get<SupplyChainRisk>(`/production/resilience/supply-chain-risks/${id}`);
    return response.data;
  }

  async createSupplyChainRisk(data: Partial<SupplyChainRisk>): Promise<SupplyChainRisk> {
    const response = await apiClient.post<SupplyChainRisk>('/production/resilience/supply-chain-risks', data);
    return response.data;
  }

  async updateSupplyChainRisk(id: string, data: Partial<SupplyChainRisk>): Promise<SupplyChainRisk> {
    const response = await apiClient.put<SupplyChainRisk>(`/production/resilience/supply-chain-risks/${id}`, data);
    return response.data;
  }

  async deleteSupplyChainRisk(id: string): Promise<void> {
    await apiClient.delete(`/production/resilience/supply-chain-risks/${id}`);
  }

  async getRiskSummary(companyId: string): Promise<any> {
    const response = await apiClient.get<any>(`/production/resilience/supply-chain-risks/summary?companyId=${companyId}`);
    return response.data;
  }

  async getBufferStockAlerts(companyId: string): Promise<any[]> {
    const response = await apiClient.get<any[]>(`/production/resilience/supply-chain-risks/buffer-stock-alerts?companyId=${companyId}`);
    return response.data;
  }

  async addMitigationAction(id: string, action: any): Promise<SupplyChainRisk> {
    const response = await apiClient.post<SupplyChainRisk>(`/production/resilience/supply-chain-risks/${id}/mitigation`, action);
    return response.data;
  }

  async updateMitigationStatus(id: string, actionIndex: number, status: string): Promise<SupplyChainRisk> {
    const response = await apiClient.put<SupplyChainRisk>(`/production/resilience/supply-chain-risks/${id}/mitigation/${actionIndex}/status`, { status });
    return response.data;
  }

  // Scenario Planning
  async getScenarios(filters?: { companyId?: string; disruptionType?: DisruptionType; status?: ScenarioStatus }): Promise<ScenarioPlanning[]> {
    const params = new URLSearchParams();
    if (filters?.companyId) params.append('companyId', filters.companyId);
    if (filters?.disruptionType) params.append('disruptionType', filters.disruptionType);
    if (filters?.status) params.append('status', filters.status);
    const response = await apiClient.get<ScenarioPlanning[]>(`/production/resilience/scenario-planning?${params.toString()}`);
    return response.data;
  }

  async getScenarioById(id: string): Promise<ScenarioPlanning> {
    const response = await apiClient.get<ScenarioPlanning>(`/production/resilience/scenario-planning/${id}`);
    return response.data;
  }

  async createScenario(data: Partial<ScenarioPlanning>): Promise<ScenarioPlanning> {
    const response = await apiClient.post<ScenarioPlanning>('/production/resilience/scenario-planning', data);
    return response.data;
  }

  async updateScenario(id: string, data: Partial<ScenarioPlanning>): Promise<ScenarioPlanning> {
    const response = await apiClient.put<ScenarioPlanning>(`/production/resilience/scenario-planning/${id}`, data);
    return response.data;
  }

  async deleteScenario(id: string): Promise<void> {
    await apiClient.delete(`/production/resilience/scenario-planning/${id}`);
  }

  async analyzeScenario(id: string): Promise<ScenarioPlanning> {
    const response = await apiClient.post<ScenarioPlanning>(`/production/resilience/scenario-planning/${id}/analyze`, {});
    return response.data;
  }

  async approveScenario(id: string, approvedBy: string): Promise<ScenarioPlanning> {
    const response = await apiClient.post<ScenarioPlanning>(`/production/resilience/scenario-planning/${id}/approve`, { approvedBy });
    return response.data;
  }

  async archiveScenario(id: string): Promise<ScenarioPlanning> {
    const response = await apiClient.post<ScenarioPlanning>(`/production/resilience/scenario-planning/${id}/archive`, {});
    return response.data;
  }

  async addMitigationStrategy(id: string, strategy: any): Promise<ScenarioPlanning> {
    const response = await apiClient.post<ScenarioPlanning>(`/production/resilience/scenario-planning/${id}/mitigation`, strategy);
    return response.data;
  }

  async runImpactAnalysis(id: string, parameters: any[]): Promise<any> {
    const response = await apiClient.post<any>(`/production/resilience/scenario-planning/${id}/impact-analysis`, { parameters });
    return response.data;
  }

  async getScenarioSummary(companyId: string): Promise<any> {
    const response = await apiClient.get<any>(`/production/resilience/scenario-planning/summary?companyId=${companyId}`);
    return response.data;
  }

  // Capacity Flexibility
  async getCapacityFlexibilities(filters?: { companyId?: string; resourceType?: CapacityResourceType; status?: CapacityStatus }): Promise<CapacityFlexibility[]> {
    const params = new URLSearchParams();
    if (filters?.companyId) params.append('companyId', filters.companyId);
    if (filters?.resourceType) params.append('resourceType', filters.resourceType);
    if (filters?.status) params.append('status', filters.status);
    const response = await apiClient.get<CapacityFlexibility[]>(`/production/resilience/capacity-flexibility?${params.toString()}`);
    return response.data;
  }

  async getCapacityFlexibilityById(id: string): Promise<CapacityFlexibility> {
    const response = await apiClient.get<CapacityFlexibility>(`/production/resilience/capacity-flexibility/${id}`);
    return response.data;
  }

  async createCapacityFlexibility(data: Partial<CapacityFlexibility>): Promise<CapacityFlexibility> {
    const response = await apiClient.post<CapacityFlexibility>('/production/resilience/capacity-flexibility', data);
    return response.data;
  }

  async updateCapacityFlexibility(id: string, data: Partial<CapacityFlexibility>): Promise<CapacityFlexibility> {
    const response = await apiClient.put<CapacityFlexibility>(`/production/resilience/capacity-flexibility/${id}`, data);
    return response.data;
  }

  async deleteCapacityFlexibility(id: string): Promise<void> {
    await apiClient.delete(`/production/resilience/capacity-flexibility/${id}`);
  }

  async getCapacitySummary(companyId: string, recordDate?: string): Promise<any> {
    let url = `/production/resilience/capacity-flexibility/summary?companyId=${companyId}`;
    if (recordDate) url += `&recordDate=${recordDate}`;
    const response = await apiClient.get<any>(url);
    return response.data;
  }

  async getFlexibilityOptions(id: string): Promise<any> {
    const response = await apiClient.get<any>(`/production/resilience/capacity-flexibility/${id}/flexibility-options`);
    return response.data;
  }

  async identifyBottlenecks(companyId: string): Promise<any[]> {
    const response = await apiClient.get<any[]>(`/production/resilience/capacity-flexibility/bottlenecks?companyId=${companyId}`);
    return response.data;
  }

  // Business Continuity
  async getBusinessContinuities(filters?: { companyId?: string; category?: ProcessCategory; currentStatus?: BCPHealthStatus; priority?: RecoveryPriority }): Promise<BusinessContinuity[]> {
    const params = new URLSearchParams();
    if (filters?.companyId) params.append('companyId', filters.companyId);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.currentStatus) params.append('currentStatus', filters.currentStatus);
    if (filters?.priority) params.append('priority', filters.priority);
    const response = await apiClient.get<BusinessContinuity[]>(`/production/resilience/business-continuity?${params.toString()}`);
    return response.data;
  }

  async getBusinessContinuityById(id: string): Promise<BusinessContinuity> {
    const response = await apiClient.get<BusinessContinuity>(`/production/resilience/business-continuity/${id}`);
    return response.data;
  }

  async createBusinessContinuity(data: Partial<BusinessContinuity>): Promise<BusinessContinuity> {
    const response = await apiClient.post<BusinessContinuity>('/production/resilience/business-continuity', data);
    return response.data;
  }

  async updateBusinessContinuity(id: string, data: Partial<BusinessContinuity>): Promise<BusinessContinuity> {
    const response = await apiClient.put<BusinessContinuity>(`/production/resilience/business-continuity/${id}`, data);
    return response.data;
  }

  async deleteBusinessContinuity(id: string): Promise<void> {
    await apiClient.delete(`/production/resilience/business-continuity/${id}`);
  }

  async updateBCPStatus(id: string, status: BCPHealthStatus): Promise<BusinessContinuity> {
    const response = await apiClient.put<BusinessContinuity>(`/production/resilience/business-continuity/${id}/status`, { status });
    return response.data;
  }

  async recordDrill(id: string, drill: any): Promise<BusinessContinuity> {
    const response = await apiClient.post<BusinessContinuity>(`/production/resilience/business-continuity/${id}/drill`, drill);
    return response.data;
  }

  async recordIncident(id: string, incident: any): Promise<BusinessContinuity> {
    const response = await apiClient.post<BusinessContinuity>(`/production/resilience/business-continuity/${id}/incident`, incident);
    return response.data;
  }

  async getBCPSummary(companyId: string): Promise<any> {
    const response = await apiClient.get<any>(`/production/resilience/business-continuity/summary?companyId=${companyId}`);
    return response.data;
  }

  async getUpcomingDrills(companyId: string, daysAhead?: number): Promise<any[]> {
    let url = `/production/resilience/business-continuity/upcoming-drills?companyId=${companyId}`;
    if (daysAhead) url += `&daysAhead=${daysAhead}`;
    const response = await apiClient.get<any[]>(url);
    return response.data;
  }

  async getRecoveryPlan(id: string): Promise<any> {
    const response = await apiClient.get<any>(`/production/resilience/business-continuity/${id}/recovery-plan`);
    return response.data;
  }
}

export const resilienceService = new ResilienceService();
