import { apiClient } from '../api/client';

// ==================== TypeScript Interfaces ====================

export type MetricPeriod = 'hourly' | 'daily' | 'weekly' | 'monthly';
export type MetricType = 'labor' | 'machine' | 'material' | 'overall';

export interface OEERecord {
  id: string;
  companyId: string;
  recordDate: string;
  periodType: MetricPeriod;
  workCenterId?: string;
  workCenterName?: string;
  productionLineId?: string;
  productionLineName?: string;
  shiftId?: string;
  shiftName?: string;
  availability: number;
  performance: number;
  quality: number;
  oee: number;
  plannedProductionTime: number;
  actualRunTime: number;
  downtime: number;
  idealCycleTime: number;
  actualCycleTime: number;
  totalCount: number;
  goodCount: number;
  rejectCount: number;
  losses: {
    lossType: string;
    lossCategory: 'availability' | 'performance' | 'quality';
    duration: number;
    percentage: number;
  }[];
  recordedBy: string;
  createdAt: string;
}

export interface ProductivityMetric {
  id: string;
  companyId: string;
  metricDate: string;
  periodType: MetricPeriod;
  metricType: MetricType;
  workCenterId?: string;
  productionLineId?: string;
  shiftId?: string;
  operatorId?: string;
  plannedOutput: number;
  actualOutput: number;
  outputVariance: number;
  outputVariancePercentage: number;
  outputUom: string;
  plannedHours: number;
  actualHours: number;
  productiveHours: number;
  nonProductiveHours: number;
  efficiencyPercentage: number;
  utilizationPercentage: number;
  outputPerHour: number;
  outputPerLaborHour?: number;
  laborMetrics?: {
    totalLaborHours: number;
    directLaborHours: number;
    indirectLaborHours: number;
    overtimeHours: number;
    laborCost: number;
    costPerUnit: number;
  };
  qualityMetrics?: {
    totalProduced: number;
    goodUnits: number;
    defectiveUnits: number;
    reworkUnits: number;
    scrapUnits: number;
    firstPassYield: number;
  };
  costMetrics?: {
    laborCost: number;
    materialCost: number;
    overheadCost: number;
    totalCost: number;
    costPerUnit: number;
  };
  currency: string;
  recordedBy: string;
  createdAt: string;
}

export interface DowntimeRecord {
  id: string;
  companyId: string;
  downtimeNumber: string;
  workCenterId?: string;
  workCenterName?: string;
  machineId?: string;
  machineName?: string;
  productionLineId?: string;
  startTime: string;
  endTime?: string;
  durationMinutes: number;
  category: 'breakdown' | 'setup' | 'changeover' | 'maintenance' | 'material_shortage' | 'quality_issue' | 'operator_unavailable' | 'other';
  isPlanned: boolean;
  description: string;
  rootCause?: string;
  correctiveAction?: string;
  impactedWorkOrders?: {
    workOrderId: string;
    workOrderNumber: string;
    delayMinutes: number;
  }[];
  costImpact?: number;
  currency: string;
  reportedBy: string;
  resolvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

// ==================== Mock Data ====================

const MOCK_OEE_RECORDS: OEERecord[] = [
  {
    id: 'oee-001',
    companyId: 'company-001',
    recordDate: '2025-01-15',
    periodType: 'daily',
    workCenterId: 'wc-001',
    workCenterName: 'CNC Machining Center',
    shiftId: 'shift-001',
    shiftName: 'Day Shift',
    availability: 92.5,
    performance: 88.3,
    quality: 98.5,
    oee: 80.4,
    plannedProductionTime: 480,
    actualRunTime: 444,
    downtime: 36,
    idealCycleTime: 2.5,
    actualCycleTime: 2.83,
    totalCount: 157,
    goodCount: 155,
    rejectCount: 2,
    losses: [
      { lossType: 'Equipment Failure', lossCategory: 'availability', duration: 20, percentage: 4.2 },
      { lossType: 'Setup/Changeover', lossCategory: 'availability', duration: 16, percentage: 3.3 },
      { lossType: 'Minor Stops', lossCategory: 'performance', duration: 25, percentage: 5.2 },
      { lossType: 'Defects', lossCategory: 'quality', duration: 5, percentage: 1.5 },
    ],
    recordedBy: 'user-001',
    createdAt: '2025-01-15T18:00:00Z',
  },
  {
    id: 'oee-002',
    companyId: 'company-001',
    recordDate: '2025-01-14',
    periodType: 'daily',
    workCenterId: 'wc-001',
    workCenterName: 'CNC Machining Center',
    shiftId: 'shift-001',
    shiftName: 'Day Shift',
    availability: 95.0,
    performance: 90.5,
    quality: 99.0,
    oee: 85.1,
    plannedProductionTime: 480,
    actualRunTime: 456,
    downtime: 24,
    idealCycleTime: 2.5,
    actualCycleTime: 2.76,
    totalCount: 165,
    goodCount: 163,
    rejectCount: 2,
    losses: [
      { lossType: 'Setup/Changeover', lossCategory: 'availability', duration: 24, percentage: 5.0 },
      { lossType: 'Reduced Speed', lossCategory: 'performance', duration: 18, percentage: 3.8 },
    ],
    recordedBy: 'user-001',
    createdAt: '2025-01-14T18:00:00Z',
  },
];

const MOCK_PRODUCTIVITY: ProductivityMetric[] = [
  {
    id: 'prod-001',
    companyId: 'company-001',
    metricDate: '2025-01-15',
    periodType: 'daily',
    metricType: 'overall',
    workCenterId: 'wc-001',
    plannedOutput: 160,
    actualOutput: 155,
    outputVariance: -5,
    outputVariancePercentage: -3.1,
    outputUom: 'PCS',
    plannedHours: 8,
    actualHours: 8,
    productiveHours: 7.4,
    nonProductiveHours: 0.6,
    efficiencyPercentage: 92.5,
    utilizationPercentage: 96.9,
    outputPerHour: 19.4,
    laborMetrics: {
      totalLaborHours: 16,
      directLaborHours: 14,
      indirectLaborHours: 2,
      overtimeHours: 0,
      laborCost: 720,
      costPerUnit: 4.65,
    },
    qualityMetrics: {
      totalProduced: 157,
      goodUnits: 155,
      defectiveUnits: 2,
      reworkUnits: 1,
      scrapUnits: 1,
      firstPassYield: 98.7,
    },
    costMetrics: {
      laborCost: 720,
      materialCost: 3100,
      overheadCost: 450,
      totalCost: 4270,
      costPerUnit: 27.55,
    },
    currency: 'USD',
    recordedBy: 'user-001',
    createdAt: '2025-01-15T18:30:00Z',
  },
];

const MOCK_DOWNTIME: DowntimeRecord[] = [
  {
    id: 'dt-001',
    companyId: 'company-001',
    downtimeNumber: 'DT-2025-001',
    workCenterId: 'wc-001',
    workCenterName: 'CNC Machining Center',
    machineId: 'mach-001',
    machineName: 'CNC Mill #1',
    startTime: '2025-01-15T10:30:00Z',
    endTime: '2025-01-15T10:50:00Z',
    durationMinutes: 20,
    category: 'breakdown',
    isPlanned: false,
    description: 'Spindle overheat alarm - emergency stop triggered',
    rootCause: 'Coolant flow sensor malfunction',
    correctiveAction: 'Replaced coolant flow sensor and reset system',
    impactedWorkOrders: [
      { workOrderId: 'wo-001', workOrderNumber: 'WO-2025-001', delayMinutes: 25 },
    ],
    costImpact: 450,
    currency: 'USD',
    reportedBy: 'user-002',
    resolvedBy: 'user-003',
    createdAt: '2025-01-15T10:32:00Z',
    updatedAt: '2025-01-15T10:55:00Z',
  },
  {
    id: 'dt-002',
    companyId: 'company-001',
    downtimeNumber: 'DT-2025-002',
    workCenterId: 'wc-001',
    workCenterName: 'CNC Machining Center',
    machineId: 'mach-001',
    machineName: 'CNC Mill #1',
    startTime: '2025-01-15T08:00:00Z',
    endTime: '2025-01-15T08:16:00Z',
    durationMinutes: 16,
    category: 'setup',
    isPlanned: true,
    description: 'Tool changeover for new work order',
    reportedBy: 'user-002',
    costImpact: 100,
    currency: 'USD',
    createdAt: '2025-01-15T08:00:00Z',
    updatedAt: '2025-01-15T08:16:00Z',
  },
];

// ==================== Service Class ====================

class ProductionAnalyticsService {
  private baseUrl = '/production';

  // OEE Records
  async findAllOEERecords(filters?: {
    periodType?: MetricPeriod;
    workCenterId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<OEERecord[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.periodType) params.append('periodType', filters.periodType);
      if (filters?.workCenterId) params.append('workCenterId', filters.workCenterId);
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);
      const response = await apiClient.get<OEERecord[]>(`${this.baseUrl}/oee-records?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('API Error fetching OEE records, using mock data:', error);
      let result = [...MOCK_OEE_RECORDS];
      if (filters?.workCenterId) result = result.filter((r) => r.workCenterId === filters.workCenterId);
      if (filters?.periodType) result = result.filter((r) => r.periodType === filters.periodType);
      return result;
    }
  }

  async getOEETrend(workCenterId: string, days: number = 30): Promise<{ date: string; oee: number; availability: number; performance: number; quality: number }[]> {
    try {
      const response = await apiClient.get<{ date: string; oee: number; availability: number; performance: number; quality: number }[]>(
        `${this.baseUrl}/oee-records/trend/${workCenterId}?days=${days}`
      );
      return response.data;
    } catch (error) {
      console.error('API Error fetching OEE trend, using mock data:', error);
      return MOCK_OEE_RECORDS.filter((r) => r.workCenterId === workCenterId).map((r) => ({
        date: r.recordDate,
        oee: r.oee,
        availability: r.availability,
        performance: r.performance,
        quality: r.quality,
      }));
    }
  }

  async getOEESummary(workCenterId: string): Promise<{
    averageOEE: number;
    averageAvailability: number;
    averagePerformance: number;
    averageQuality: number;
    topLosses: { lossType: string; totalDuration: number; percentage: number }[];
  }> {
    try {
      const response = await apiClient.get<{
        averageOEE: number;
        averageAvailability: number;
        averagePerformance: number;
        averageQuality: number;
        topLosses: { lossType: string; totalDuration: number; percentage: number }[];
      }>(`${this.baseUrl}/oee-records/summary/${workCenterId}`);
      return response.data;
    } catch (error) {
      console.error('API Error fetching OEE summary, using mock data:', error);
      const records = MOCK_OEE_RECORDS.filter((r) => r.workCenterId === workCenterId);
      const avgOEE = records.reduce((sum, r) => sum + r.oee, 0) / records.length;
      return {
        averageOEE: avgOEE,
        averageAvailability: records.reduce((sum, r) => sum + r.availability, 0) / records.length,
        averagePerformance: records.reduce((sum, r) => sum + r.performance, 0) / records.length,
        averageQuality: records.reduce((sum, r) => sum + r.quality, 0) / records.length,
        topLosses: [
          { lossType: 'Equipment Failure', totalDuration: 20, percentage: 4.2 },
          { lossType: 'Minor Stops', totalDuration: 25, percentage: 5.2 },
        ],
      };
    }
  }

  // Productivity Metrics
  async findAllProductivityMetrics(filters?: { metricType?: MetricType; workCenterId?: string }): Promise<ProductivityMetric[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.metricType) params.append('metricType', filters.metricType);
      if (filters?.workCenterId) params.append('workCenterId', filters.workCenterId);
      const response = await apiClient.get<ProductivityMetric[]>(`${this.baseUrl}/productivity-metrics?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('API Error fetching productivity metrics, using mock data:', error);
      let result = [...MOCK_PRODUCTIVITY];
      if (filters?.metricType) result = result.filter((m) => m.metricType === filters.metricType);
      if (filters?.workCenterId) result = result.filter((m) => m.workCenterId === filters.workCenterId);
      return result;
    }
  }

  async getProductivityTrend(
    workCenterId: string,
    metricType: MetricType,
    days: number = 30
  ): Promise<{ date: string; efficiency: number; actualOutput: number; plannedOutput: number }[]> {
    try {
      const response = await apiClient.get<{ date: string; efficiency: number; actualOutput: number; plannedOutput: number }[]>(
        `${this.baseUrl}/productivity-metrics/trend/${workCenterId}?metricType=${metricType}&days=${days}`
      );
      return response.data;
    } catch (error) {
      console.error('API Error fetching productivity trend, using mock data:', error);
      return MOCK_PRODUCTIVITY.filter((m) => m.workCenterId === workCenterId).map((m) => ({
        date: m.metricDate,
        efficiency: m.efficiencyPercentage,
        actualOutput: m.actualOutput,
        plannedOutput: m.plannedOutput,
      }));
    }
  }

  // Downtime Records
  async findAllDowntimeRecords(filters?: {
    category?: string;
    workCenterId?: string;
    isPlanned?: boolean;
  }): Promise<DowntimeRecord[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.category) params.append('category', filters.category);
      if (filters?.workCenterId) params.append('workCenterId', filters.workCenterId);
      if (filters?.isPlanned !== undefined) params.append('isPlanned', String(filters.isPlanned));
      const response = await apiClient.get<DowntimeRecord[]>(`${this.baseUrl}/downtime-records?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('API Error fetching downtime records, using mock data:', error);
      let result = [...MOCK_DOWNTIME];
      if (filters?.category) result = result.filter((d) => d.category === filters.category);
      if (filters?.workCenterId) result = result.filter((d) => d.workCenterId === filters.workCenterId);
      if (filters?.isPlanned !== undefined) result = result.filter((d) => d.isPlanned === filters.isPlanned);
      return result;
    }
  }

  async createDowntimeRecord(data: Partial<DowntimeRecord>): Promise<DowntimeRecord> {
    try {
      const response = await apiClient.post<DowntimeRecord>(`${this.baseUrl}/downtime-records`, data);
      return response.data;
    } catch (error) {
      console.error('API Error creating downtime record, using mock data:', error);
      const newRecord: DowntimeRecord = {
        id: `dt-${Date.now()}`,
        companyId: 'company-001',
        downtimeNumber: `DT-${Date.now()}`,
        startTime: data.startTime || new Date().toISOString(),
        durationMinutes: data.durationMinutes || 0,
        category: data.category || 'other',
        isPlanned: data.isPlanned || false,
        description: data.description || '',
        currency: 'USD',
        reportedBy: 'user-001',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...data,
      } as DowntimeRecord;
      MOCK_DOWNTIME.push(newRecord);
      return newRecord;
    }
  }

  async getDowntimeAnalysis(workCenterId: string, days: number = 30): Promise<{
    totalDowntimeMinutes: number;
    plannedDowntime: number;
    unplannedDowntime: number;
    categoryBreakdown: { category: string; minutes: number; percentage: number }[];
    topCauses: { cause: string; occurrences: number; totalMinutes: number }[];
  }> {
    try {
      const response = await apiClient.get<{
        totalDowntimeMinutes: number;
        plannedDowntime: number;
        unplannedDowntime: number;
        categoryBreakdown: { category: string; minutes: number; percentage: number }[];
        topCauses: { cause: string; occurrences: number; totalMinutes: number }[];
      }>(`${this.baseUrl}/downtime-records/analysis/${workCenterId}?days=${days}`);
      return response.data;
    } catch (error) {
      console.error('API Error fetching downtime analysis, using mock data:', error);
      const records = MOCK_DOWNTIME.filter((d) => d.workCenterId === workCenterId);
      const total = records.reduce((sum, d) => sum + d.durationMinutes, 0);
      const planned = records.filter((d) => d.isPlanned).reduce((sum, d) => sum + d.durationMinutes, 0);
      return {
        totalDowntimeMinutes: total,
        plannedDowntime: planned,
        unplannedDowntime: total - planned,
        categoryBreakdown: [
          { category: 'breakdown', minutes: 20, percentage: 55.6 },
          { category: 'setup', minutes: 16, percentage: 44.4 },
        ],
        topCauses: [
          { cause: 'Equipment failure', occurrences: 1, totalMinutes: 20 },
          { cause: 'Tool changeover', occurrences: 1, totalMinutes: 16 },
        ],
      };
    }
  }
}

export const productionAnalyticsService = new ProductionAnalyticsService();
