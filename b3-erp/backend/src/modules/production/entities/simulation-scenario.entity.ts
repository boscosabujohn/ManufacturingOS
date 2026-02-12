import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type SimulationStatus = 'draft' | 'running' | 'completed' | 'failed' | 'cancelled';
export type SimulationType = 'what_if' | 'capacity' | 'scheduling' | 'resource' | 'demand';

@Entity('production_simulation_scenarios')
export class SimulationScenario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'company_id' })
  companyId: string;

  @Column({ name: 'scenario_number', unique: true })
  scenarioNumber: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'simulation_type', type: 'varchar', length: 20 })
  simulationType: SimulationType;

  @Column({ type: 'varchar', length: 20, default: 'draft' })
  status: SimulationStatus;

  @Column({ name: 'simulation_start', type: 'timestamp', nullable: true })
  simulationStart: Date | null;

  @Column({ name: 'simulation_end', type: 'timestamp', nullable: true })
  simulationEnd: Date | null;

  @Column({ name: 'time_horizon_days', type: 'int', default: 30 })
  timeHorizonDays: number;

  @Column({ type: 'jsonb', nullable: true })
  baselineScenario: {
    demandForecast: { period: string; quantity: number }[];
    capacity: { resourceId: string; availableHours: number }[];
    inventory: { itemId: string; quantity: number }[];
    workforce: { shiftId: string; headcount: number }[];
  } | null;

  @Column({ type: 'jsonb', nullable: true })
  inputParameters: {
    demandChange: number;
    capacityChange: number;
    productMixChange: { itemId: string; changePercent: number }[];
    resourceAdditions: { resourceType: string; quantity: number }[];
    processImprovements: { processId: string; efficiencyGain: number }[];
    costFactors: { factor: string; changePercent: number }[];
  } | null;

  @Column({ type: 'jsonb', nullable: true })
  simulationResults: {
    kpis: {
      throughput: number;
      leadTime: number;
      utilization: number;
      onTimeDelivery: number;
      inventoryTurns: number;
      totalCost: number;
    };
    bottlenecks: {
      resourceId: string;
      resourceName: string;
      utilizationRate: number;
      impactedOrders: number;
    }[];
    resourceUtilization: {
      resourceId: string;
      utilization: number;
      idleTime: number;
      overtimeRequired: number;
    }[];
    inventoryProjections: {
      period: string;
      averageInventory: number;
      stockouts: number;
    }[];
    costBreakdown: {
      category: string;
      baselineCost: number;
      simulatedCost: number;
      variance: number;
    }[];
  } | null;

  @Column({ type: 'jsonb', nullable: true })
  comparisonWithBaseline: {
    metric: string;
    baseline: number;
    simulated: number;
    change: number;
    changePercent: number;
    impact: string;
  }[] | null;

  @Column({ type: 'jsonb', nullable: true })
  recommendations: {
    priority: number;
    area: string;
    recommendation: string;
    expectedBenefit: string;
    implementationCost: number;
    roi: number;
  }[] | null;

  @Column({ type: 'jsonb', nullable: true })
  sensitivityAnalysis: {
    parameter: string;
    lowValue: number;
    baseValue: number;
    highValue: number;
    impactOnKPI: { kpi: string; lowImpact: number; highImpact: number }[];
  }[] | null;

  @Column({ type: 'varchar', length: 3, default: 'USD' })
  currency: string;

  @Column({ name: 'created_by' })
  createdBy: string;

  @Column({ name: 'run_by', type: 'varchar', nullable: true })
  runBy: string | null;

  @Column({ name: 'run_at', type: 'timestamp', nullable: true })
  runAt: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
