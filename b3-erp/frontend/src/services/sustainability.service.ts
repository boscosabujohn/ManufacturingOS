import { apiClient } from './api/client';

// ============================================================================
// TYPES - Carbon Footprint
// ============================================================================

export type EmissionScope = 'scope1' | 'scope2' | 'scope3';
export type EmissionSource = 'electricity' | 'natural_gas' | 'diesel' | 'gasoline' | 'waste' | 'water' | 'transportation' | 'raw_materials' | 'other';

export interface CarbonFootprint {
  id: string;
  companyId: string;
  recordDate: Date;
  periodType: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  scope: EmissionScope;
  source: EmissionSource;
  activityData: number;
  activityUnit: string;
  emissionFactor: number;
  emissionFactorUnit: string;
  totalEmissions: number;
  productionLineId?: string;
  productionLineName?: string;
  productId?: string;
  productName?: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// TYPES - Energy Consumption
// ============================================================================

export type EnergyType = 'electricity' | 'natural_gas' | 'diesel' | 'lpg' | 'solar' | 'wind' | 'other';

export interface EnergyConsumption {
  id: string;
  companyId: string;
  recordDate: Date;
  energyType: EnergyType;
  consumption: number;
  unit: string;
  cost: number;
  currency: string;
  zoneId?: string;
  zoneName?: string;
  equipmentId?: string;
  equipmentName?: string;
  isRenewable: boolean;
  peakDemand?: number;
  powerFactor?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// TYPES - Waste Record
// ============================================================================

export type WasteCategory = 'hazardous' | 'non_hazardous' | 'recyclable' | 'organic' | 'e_waste' | 'metal' | 'plastic' | 'paper' | 'other';
export type DisposalMethod = 'recycling' | 'landfill' | 'incineration' | 'composting' | 'reuse' | 'treatment' | 'other';

export interface WasteRecord {
  id: string;
  companyId: string;
  recordDate: Date;
  wasteType: string;
  category: WasteCategory;
  quantity: number;
  unit: string;
  disposalMethod: DisposalMethod;
  disposalVendorId?: string;
  disposalVendorName?: string;
  disposalCost: number;
  currency: string;
  sourceProcessId?: string;
  sourceProcessName?: string;
  recyclablePercentage?: number;
  manifestNumber?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// TYPES - Water Usage
// ============================================================================

export type WaterSource = 'municipal' | 'groundwater' | 'surface' | 'rainwater' | 'recycled' | 'other';

export interface WaterUsage {
  id: string;
  companyId: string;
  recordDate: Date;
  waterSource: WaterSource;
  consumption: number;
  unit: string;
  cost: number;
  currency: string;
  zoneId?: string;
  zoneName?: string;
  processId?: string;
  processName?: string;
  recycledAmount?: number;
  dischargeAmount?: number;
  dischargeQuality?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// TYPES - ESG Score
// ============================================================================

export interface ESGScore {
  id: string;
  companyId: string;
  reportingPeriod: string;
  environmentalScore: number;
  socialScore: number;
  governanceScore: number;
  overallScore: number;
  rating: 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D' | 'F';
  environmentalMetrics?: any;
  socialMetrics?: any;
  governanceMetrics?: any;
  benchmarkComparison?: any;
  improvementAreas?: string[];
  sdgAlignments?: any[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// TYPES - Green Supplier
// ============================================================================

export type GreenCertification = 'iso14001' | 'iso50001' | 'leed' | 'b_corp' | 'fsc' | 'fair_trade' | 'organic' | 'other';

export interface GreenSupplier {
  id: string;
  companyId: string;
  supplierId: string;
  supplierName: string;
  greenScore: number;
  certifications?: { type: GreenCertification; name: string; validUntil: Date; verificationStatus: string }[];
  sustainabilityPractices?: { practice: string; description: string; implemented: boolean; evidence?: string }[];
  carbonDisclosure?: any;
  environmentalAudits?: any[];
  complianceStatus: 'compliant' | 'non_compliant' | 'under_review' | 'pending';
  preferredStatus: boolean;
  lastAssessmentDate?: Date;
  nextAssessmentDate?: Date;
  notes?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// SERVICE CLASS
// ============================================================================

class SustainabilityService {
  // Carbon Footprint
  async getCarbonFootprints(filters?: { companyId?: string; scope?: EmissionScope; source?: EmissionSource }): Promise<CarbonFootprint[]> {
    const params = new URLSearchParams();
    if (filters?.companyId) params.append('companyId', filters.companyId);
    if (filters?.scope) params.append('scope', filters.scope);
    if (filters?.source) params.append('source', filters.source);
    const response = await apiClient.get<CarbonFootprint[]>(`/production/sustainability/carbon-footprint?${params.toString()}`);
    return response.data;
  }

  async getCarbonFootprintById(id: string): Promise<CarbonFootprint> {
    const response = await apiClient.get<CarbonFootprint>(`/production/sustainability/carbon-footprint/${id}`);
    return response.data;
  }

  async createCarbonFootprint(data: Partial<CarbonFootprint>): Promise<CarbonFootprint> {
    const response = await apiClient.post<CarbonFootprint>('/production/sustainability/carbon-footprint', data);
    return response.data;
  }

  async updateCarbonFootprint(id: string, data: Partial<CarbonFootprint>): Promise<CarbonFootprint> {
    const response = await apiClient.put<CarbonFootprint>(`/production/sustainability/carbon-footprint/${id}`, data);
    return response.data;
  }

  async deleteCarbonFootprint(id: string): Promise<void> {
    await apiClient.delete(`/production/sustainability/carbon-footprint/${id}`);
  }

  async getCarbonSummary(companyId: string, startDate: string, endDate: string): Promise<any> {
    const response = await apiClient.get<any>(`/production/sustainability/carbon-footprint/summary?companyId=${companyId}&startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  }

  // Energy Consumption
  async getEnergyConsumptions(filters?: { companyId?: string; energyType?: EnergyType; zoneId?: string }): Promise<EnergyConsumption[]> {
    const params = new URLSearchParams();
    if (filters?.companyId) params.append('companyId', filters.companyId);
    if (filters?.energyType) params.append('energyType', filters.energyType);
    if (filters?.zoneId) params.append('zoneId', filters.zoneId);
    const response = await apiClient.get<EnergyConsumption[]>(`/production/sustainability/energy-consumption?${params.toString()}`);
    return response.data;
  }

  async getEnergyConsumptionById(id: string): Promise<EnergyConsumption> {
    const response = await apiClient.get<EnergyConsumption>(`/production/sustainability/energy-consumption/${id}`);
    return response.data;
  }

  async createEnergyConsumption(data: Partial<EnergyConsumption>): Promise<EnergyConsumption> {
    const response = await apiClient.post<EnergyConsumption>('/production/sustainability/energy-consumption', data);
    return response.data;
  }

  async updateEnergyConsumption(id: string, data: Partial<EnergyConsumption>): Promise<EnergyConsumption> {
    const response = await apiClient.put<EnergyConsumption>(`/production/sustainability/energy-consumption/${id}`, data);
    return response.data;
  }

  async deleteEnergyConsumption(id: string): Promise<void> {
    await apiClient.delete(`/production/sustainability/energy-consumption/${id}`);
  }

  async getEnergySummary(companyId: string, startDate: string, endDate: string): Promise<any> {
    const response = await apiClient.get<any>(`/production/sustainability/energy-consumption/summary?companyId=${companyId}&startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  }

  // Waste Records
  async getWasteRecords(filters?: { companyId?: string; category?: WasteCategory; disposalMethod?: DisposalMethod }): Promise<WasteRecord[]> {
    const params = new URLSearchParams();
    if (filters?.companyId) params.append('companyId', filters.companyId);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.disposalMethod) params.append('disposalMethod', filters.disposalMethod);
    const response = await apiClient.get<WasteRecord[]>(`/production/sustainability/waste-records?${params.toString()}`);
    return response.data;
  }

  async getWasteRecordById(id: string): Promise<WasteRecord> {
    const response = await apiClient.get<WasteRecord>(`/production/sustainability/waste-records/${id}`);
    return response.data;
  }

  async createWasteRecord(data: Partial<WasteRecord>): Promise<WasteRecord> {
    const response = await apiClient.post<WasteRecord>('/production/sustainability/waste-records', data);
    return response.data;
  }

  async updateWasteRecord(id: string, data: Partial<WasteRecord>): Promise<WasteRecord> {
    const response = await apiClient.put<WasteRecord>(`/production/sustainability/waste-records/${id}`, data);
    return response.data;
  }

  async deleteWasteRecord(id: string): Promise<void> {
    await apiClient.delete(`/production/sustainability/waste-records/${id}`);
  }

  async getWasteSummary(companyId: string, startDate: string, endDate: string): Promise<any> {
    const response = await apiClient.get<any>(`/production/sustainability/waste-records/summary?companyId=${companyId}&startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  }

  // Water Usage
  async getWaterUsages(filters?: { companyId?: string; waterSource?: WaterSource; zoneId?: string }): Promise<WaterUsage[]> {
    const params = new URLSearchParams();
    if (filters?.companyId) params.append('companyId', filters.companyId);
    if (filters?.waterSource) params.append('waterSource', filters.waterSource);
    if (filters?.zoneId) params.append('zoneId', filters.zoneId);
    const response = await apiClient.get<WaterUsage[]>(`/production/sustainability/water-usage?${params.toString()}`);
    return response.data;
  }

  async getWaterUsageById(id: string): Promise<WaterUsage> {
    const response = await apiClient.get<WaterUsage>(`/production/sustainability/water-usage/${id}`);
    return response.data;
  }

  async createWaterUsage(data: Partial<WaterUsage>): Promise<WaterUsage> {
    const response = await apiClient.post<WaterUsage>('/production/sustainability/water-usage', data);
    return response.data;
  }

  async updateWaterUsage(id: string, data: Partial<WaterUsage>): Promise<WaterUsage> {
    const response = await apiClient.put<WaterUsage>(`/production/sustainability/water-usage/${id}`, data);
    return response.data;
  }

  async deleteWaterUsage(id: string): Promise<void> {
    await apiClient.delete(`/production/sustainability/water-usage/${id}`);
  }

  async getWaterSummary(companyId: string, startDate: string, endDate: string): Promise<any> {
    const response = await apiClient.get<any>(`/production/sustainability/water-usage/summary?companyId=${companyId}&startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  }

  // ESG Scores
  async getESGScores(filters?: { companyId?: string; reportingPeriod?: string }): Promise<ESGScore[]> {
    const params = new URLSearchParams();
    if (filters?.companyId) params.append('companyId', filters.companyId);
    if (filters?.reportingPeriod) params.append('reportingPeriod', filters.reportingPeriod);
    const response = await apiClient.get<ESGScore[]>(`/production/sustainability/esg-scores?${params.toString()}`);
    return response.data;
  }

  async getESGScoreById(id: string): Promise<ESGScore> {
    const response = await apiClient.get<ESGScore>(`/production/sustainability/esg-scores/${id}`);
    return response.data;
  }

  async createESGScore(data: Partial<ESGScore>): Promise<ESGScore> {
    const response = await apiClient.post<ESGScore>('/production/sustainability/esg-scores', data);
    return response.data;
  }

  async updateESGScore(id: string, data: Partial<ESGScore>): Promise<ESGScore> {
    const response = await apiClient.put<ESGScore>(`/production/sustainability/esg-scores/${id}`, data);
    return response.data;
  }

  async deleteESGScore(id: string): Promise<void> {
    await apiClient.delete(`/production/sustainability/esg-scores/${id}`);
  }

  async getLatestESGScore(companyId: string): Promise<ESGScore> {
    const response = await apiClient.get<ESGScore>(`/production/sustainability/esg-scores/latest?companyId=${companyId}`);
    return response.data;
  }

  // Green Suppliers
  async getGreenSuppliers(filters?: { companyId?: string; complianceStatus?: string; preferredOnly?: boolean }): Promise<GreenSupplier[]> {
    const params = new URLSearchParams();
    if (filters?.companyId) params.append('companyId', filters.companyId);
    if (filters?.complianceStatus) params.append('complianceStatus', filters.complianceStatus);
    if (filters?.preferredOnly) params.append('preferredOnly', 'true');
    const response = await apiClient.get<GreenSupplier[]>(`/production/sustainability/green-suppliers?${params.toString()}`);
    return response.data;
  }

  async getGreenSupplierById(id: string): Promise<GreenSupplier> {
    const response = await apiClient.get<GreenSupplier>(`/production/sustainability/green-suppliers/${id}`);
    return response.data;
  }

  async createGreenSupplier(data: Partial<GreenSupplier>): Promise<GreenSupplier> {
    const response = await apiClient.post<GreenSupplier>('/production/sustainability/green-suppliers', data);
    return response.data;
  }

  async updateGreenSupplier(id: string, data: Partial<GreenSupplier>): Promise<GreenSupplier> {
    const response = await apiClient.put<GreenSupplier>(`/production/sustainability/green-suppliers/${id}`, data);
    return response.data;
  }

  async deleteGreenSupplier(id: string): Promise<void> {
    await apiClient.delete(`/production/sustainability/green-suppliers/${id}`);
  }

  async addCertification(id: string, certification: any): Promise<GreenSupplier> {
    const response = await apiClient.post<GreenSupplier>(`/production/sustainability/green-suppliers/${id}/certification`, certification);
    return response.data;
  }

  async conductAssessment(id: string, assessment: any): Promise<GreenSupplier> {
    const response = await apiClient.post<GreenSupplier>(`/production/sustainability/green-suppliers/${id}/assessment`, assessment);
    return response.data;
  }
}

export const sustainabilityService = new SustainabilityService();
