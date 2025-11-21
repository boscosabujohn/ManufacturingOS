import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export type PutawayStrategy = 'fixed' | 'random' | 'closest' | 'consolidate' | 'class_based' | 'zone_based';
export type PutawayStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface PutawayRule {
  id: string;
  name: string;
  priority: number;
  strategy: PutawayStrategy;
  conditions: PutawayCondition[];
  locationCriteria: LocationCriteria;
  isActive: boolean;
  createdAt: string;
}

export interface PutawayCondition {
  field: 'item_category' | 'item_class' | 'vendor' | 'weight' | 'volume' | 'hazmat' | 'temperature';
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'in' | 'not_in';
  value: string | number | string[];
}

export interface LocationCriteria {
  storeTypes?: string[];
  zones?: string[];
  storageConditions?: string[];
  minCapacity?: number;
  preferEmpty?: boolean;
  consolidateWithSameItem?: boolean;
  maxDistance?: number;
}

export interface PutawayTask {
  id: string;
  taskNumber: string;
  receiptId: string;
  receiptLineId: string;
  itemId: string;
  itemCode: string;
  itemName: string;
  quantity: number;
  unit: string;
  weight: number;
  volume: number;
  lotNumber?: string;
  serialNumber?: string;
  sourceLocation: string;
  suggestedLocation: string;
  actualLocation?: string;
  ruleApplied: string;
  strategy: PutawayStrategy;
  status: PutawayStatus;
  assignedTo?: string;
  startedAt?: string;
  completedAt?: string;
  notes?: string;
  createdAt: string;
}

export interface PutawayOptimization {
  taskId: string;
  originalLocation: string;
  optimizedLocation: string;
  reason: string;
  savingsMetric: {
    distanceSaved?: number;
    timeSaved?: number;
    consolidationBenefit?: number;
  };
}

export interface PutawayPerformance {
  totalTasks: number;
  completedTasks: number;
  averageCompletionTime: number;
  accuracyRate: number;
  utilizationImprovement: number;
  tasksByStrategy: Record<string, number>;
  tasksByStatus: Record<string, number>;
}

@Injectable()
export class PutawayStrategyService {
  private rules: PutawayRule[] = [];
  private tasks: PutawayTask[] = [];
  private taskCounter = 1000;

  constructor() {
    this.seedMockData();
  }

  async createRule(rule: Omit<PutawayRule, 'id' | 'createdAt'>): Promise<PutawayRule> {
    const newRule: PutawayRule = {
      ...rule,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };

    this.rules.push(newRule);
    this.rules.sort((a, b) => b.priority - a.priority);

    return newRule;
  }

  async generatePutawayTasks(
    receiptId: string,
    items: {
      receiptLineId: string;
      itemId: string;
      itemCode: string;
      itemName: string;
      quantity: number;
      unit: string;
      weight: number;
      volume: number;
      category: string;
      itemClass?: string;
      lotNumber?: string;
      serialNumber?: string;
    }[],
    sourceLocation: string
  ): Promise<PutawayTask[]> {
    const tasks: PutawayTask[] = [];

    for (const item of items) {
      const { rule, location } = await this.determinePutawayLocation(item);

      const task: PutawayTask = {
        id: uuidv4(),
        taskNumber: `PUT-${++this.taskCounter}`,
        receiptId,
        receiptLineId: item.receiptLineId,
        itemId: item.itemId,
        itemCode: item.itemCode,
        itemName: item.itemName,
        quantity: item.quantity,
        unit: item.unit,
        weight: item.weight,
        volume: item.volume,
        lotNumber: item.lotNumber,
        serialNumber: item.serialNumber,
        sourceLocation,
        suggestedLocation: location,
        ruleApplied: rule.name,
        strategy: rule.strategy,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      tasks.push(task);
      this.tasks.push(task);
    }

    return tasks;
  }

  private async determinePutawayLocation(item: {
    itemId: string;
    itemCode: string;
    category: string;
    itemClass?: string;
    weight: number;
    volume: number;
  }): Promise<{ rule: PutawayRule; location: string }> {
    // Find matching rule based on conditions
    for (const rule of this.rules) {
      if (!rule.isActive) continue;

      const matches = this.evaluateConditions(rule.conditions, item);
      if (matches) {
        const location = await this.findLocationByStrategy(rule, item);
        return { rule, location };
      }
    }

    // Default rule
    const defaultRule = this.rules.find(r => r.name === 'Default Putaway') || this.rules[0];
    const location = await this.findLocationByStrategy(defaultRule, item);
    return { rule: defaultRule, location };
  }

  private evaluateConditions(
    conditions: PutawayCondition[],
    item: { category: string; itemClass?: string; weight: number; volume: number }
  ): boolean {
    for (const condition of conditions) {
      let itemValue: string | number | undefined;

      switch (condition.field) {
        case 'item_category':
          itemValue = item.category;
          break;
        case 'item_class':
          itemValue = item.itemClass;
          break;
        case 'weight':
          itemValue = item.weight;
          break;
        case 'volume':
          itemValue = item.volume;
          break;
        default:
          continue;
      }

      if (!this.evaluateCondition(condition, itemValue)) {
        return false;
      }
    }

    return true;
  }

  private evaluateCondition(condition: PutawayCondition, value: string | number | undefined): boolean {
    if (value === undefined) return false;

    switch (condition.operator) {
      case 'equals':
        return value === condition.value;
      case 'not_equals':
        return value !== condition.value;
      case 'greater_than':
        return typeof value === 'number' && value > (condition.value as number);
      case 'less_than':
        return typeof value === 'number' && value < (condition.value as number);
      case 'in':
        return Array.isArray(condition.value) && condition.value.includes(value as string);
      case 'not_in':
        return Array.isArray(condition.value) && !condition.value.includes(value as string);
      default:
        return false;
    }
  }

  private async findLocationByStrategy(
    rule: PutawayRule,
    item: { itemId: string; weight: number; volume: number }
  ): Promise<string> {
    // Mock location determination based on strategy
    switch (rule.strategy) {
      case 'fixed':
        return this.getFixedLocation(item.itemId);
      case 'random':
        return this.getRandomLocation(rule.locationCriteria);
      case 'closest':
        return this.getClosestLocation(rule.locationCriteria);
      case 'consolidate':
        return this.getConsolidationLocation(item.itemId, rule.locationCriteria);
      case 'class_based':
        return this.getClassBasedLocation(rule.locationCriteria);
      case 'zone_based':
        return this.getZoneBasedLocation(rule.locationCriteria);
      default:
        return 'RM-01-001';
    }
  }

  private getFixedLocation(itemId: string): string {
    // Return fixed location for item (would lookup from item master)
    const fixedLocations: Record<string, string> = {
      'item-001': 'RM-01-001',
      'item-002': 'CP-01-002',
      'item-003': 'FG-01-001',
    };
    return fixedLocations[itemId] || 'RM-01-001';
  }

  private getRandomLocation(criteria: LocationCriteria): string {
    // Return random available location matching criteria
    const zones = criteria.zones || ['ZONE-01'];
    const zone = zones[Math.floor(Math.random() * zones.length)];
    return `${zone.substring(5)}-${String(Math.floor(Math.random() * 10) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 100) + 1).padStart(3, '0')}`;
  }

  private getClosestLocation(criteria: LocationCriteria): string {
    // Return closest available location to receiving area
    return criteria.zones?.[0] ? `${criteria.zones[0].substring(5)}-01-001` : 'RM-01-001';
  }

  private getConsolidationLocation(itemId: string, criteria: LocationCriteria): string {
    // Find location with same item already stored
    // Mock implementation
    if (criteria.consolidateWithSameItem) {
      return `RM-01-${String(Math.floor(Math.random() * 10) + 1).padStart(3, '0')}`;
    }
    return this.getRandomLocation(criteria);
  }

  private getClassBasedLocation(criteria: LocationCriteria): string {
    // Return location based on ABC class
    const zones = criteria.zones || ['ZONE-01'];
    return `${zones[0].substring(5)}-01-001`;
  }

  private getZoneBasedLocation(criteria: LocationCriteria): string {
    // Return location in specified zone
    const zones = criteria.zones || ['ZONE-01'];
    return `${zones[0].substring(5)}-01-001`;
  }

  async assignTask(taskId: string, userId: string): Promise<PutawayTask> {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) throw new Error(`Task ${taskId} not found`);

    task.assignedTo = userId;
    task.status = 'in_progress';
    task.startedAt = new Date().toISOString();

    return task;
  }

  async completeTask(
    taskId: string,
    actualLocation: string,
    notes?: string
  ): Promise<PutawayTask> {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) throw new Error(`Task ${taskId} not found`);

    task.actualLocation = actualLocation;
    task.status = 'completed';
    task.completedAt = new Date().toISOString();
    task.notes = notes;

    return task;
  }

  async optimizePutaway(taskIds: string[]): Promise<PutawayOptimization[]> {
    const optimizations: PutawayOptimization[] = [];

    for (const taskId of taskIds) {
      const task = this.tasks.find(t => t.id === taskId);
      if (!task || task.status !== 'pending') continue;

      // Mock optimization logic
      const optimizedLocation = task.suggestedLocation; // Would calculate better location
      const distanceSaved = Math.floor(Math.random() * 50);

      if (distanceSaved > 10) {
        optimizations.push({
          taskId,
          originalLocation: task.suggestedLocation,
          optimizedLocation,
          reason: 'Reduced travel distance by grouping nearby items',
          savingsMetric: {
            distanceSaved,
            timeSaved: Math.round(distanceSaved * 0.5),
          },
        });

        task.suggestedLocation = optimizedLocation;
      }
    }

    return optimizations;
  }

  async getPendingTasks(assignedTo?: string): Promise<PutawayTask[]> {
    let tasks = this.tasks.filter(t => t.status === 'pending' || t.status === 'in_progress');
    if (assignedTo) {
      tasks = tasks.filter(t => t.assignedTo === assignedTo);
    }
    return tasks;
  }

  async getPerformanceMetrics(dateFrom?: string, dateTo?: string): Promise<PutawayPerformance> {
    let filteredTasks = this.tasks;

    if (dateFrom) {
      filteredTasks = filteredTasks.filter(t => t.createdAt >= dateFrom);
    }
    if (dateTo) {
      filteredTasks = filteredTasks.filter(t => t.createdAt <= dateTo);
    }

    const completedTasks = filteredTasks.filter(t => t.status === 'completed');
    const tasksByStrategy: Record<string, number> = {};
    const tasksByStatus: Record<string, number> = {};

    let totalTime = 0;
    let accurateCount = 0;

    for (const task of filteredTasks) {
      tasksByStrategy[task.strategy] = (tasksByStrategy[task.strategy] || 0) + 1;
      tasksByStatus[task.status] = (tasksByStatus[task.status] || 0) + 1;

      if (task.status === 'completed' && task.startedAt && task.completedAt) {
        const duration = new Date(task.completedAt).getTime() - new Date(task.startedAt).getTime();
        totalTime += duration;

        if (task.actualLocation === task.suggestedLocation) {
          accurateCount++;
        }
      }
    }

    return {
      totalTasks: filteredTasks.length,
      completedTasks: completedTasks.length,
      averageCompletionTime: completedTasks.length > 0
        ? Math.round(totalTime / completedTasks.length / 60000)
        : 0,
      accuracyRate: completedTasks.length > 0
        ? Math.round((accurateCount / completedTasks.length) * 100)
        : 0,
      utilizationImprovement: 15, // Mock value
      tasksByStrategy,
      tasksByStatus,
    };
  }

  async getRuleEffectiveness(): Promise<{
    rule: string;
    tasksApplied: number;
    avgCompletionTime: number;
    accuracyRate: number;
  }[]> {
    const ruleStats: Map<string, {
      tasks: number;
      totalTime: number;
      accurate: number;
      completed: number;
    }> = new Map();

    for (const task of this.tasks) {
      if (!ruleStats.has(task.ruleApplied)) {
        ruleStats.set(task.ruleApplied, { tasks: 0, totalTime: 0, accurate: 0, completed: 0 });
      }

      const stats = ruleStats.get(task.ruleApplied)!;
      stats.tasks++;

      if (task.status === 'completed') {
        stats.completed++;
        if (task.actualLocation === task.suggestedLocation) {
          stats.accurate++;
        }
        if (task.startedAt && task.completedAt) {
          stats.totalTime += new Date(task.completedAt).getTime() - new Date(task.startedAt).getTime();
        }
      }
    }

    return Array.from(ruleStats.entries()).map(([rule, stats]) => ({
      rule,
      tasksApplied: stats.tasks,
      avgCompletionTime: stats.completed > 0 ? Math.round(stats.totalTime / stats.completed / 60000) : 0,
      accuracyRate: stats.completed > 0 ? Math.round((stats.accurate / stats.completed) * 100) : 0,
    }));
  }

  private seedMockData(): void {
    // Create default putaway rules
    this.rules = [
      {
        id: uuidv4(),
        name: 'High Value Items',
        priority: 100,
        strategy: 'fixed',
        conditions: [
          { field: 'item_class', operator: 'equals', value: 'A' },
        ],
        locationCriteria: {
          zones: ['ZONE-01'],
          storageConditions: ['controlled'],
          consolidateWithSameItem: true,
        },
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        name: 'Heavy Items',
        priority: 90,
        strategy: 'zone_based',
        conditions: [
          { field: 'weight', operator: 'greater_than', value: 50 },
        ],
        locationCriteria: {
          zones: ['ZONE-02'],
          preferEmpty: true,
        },
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        name: 'Fast Moving Items',
        priority: 80,
        strategy: 'closest',
        conditions: [
          { field: 'item_category', operator: 'in', value: ['Raw Materials', 'Components'] },
        ],
        locationCriteria: {
          zones: ['ZONE-01', 'ZONE-03'],
          maxDistance: 100,
        },
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        name: 'Default Putaway',
        priority: 1,
        strategy: 'random',
        conditions: [],
        locationCriteria: {
          preferEmpty: true,
        },
        isActive: true,
        createdAt: new Date().toISOString(),
      },
    ];
  }
}
