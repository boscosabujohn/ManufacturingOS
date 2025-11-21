import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export type RoutingStrategy = 'round_robin' | 'least_loaded' | 'skill_based' | 'priority_based' | 'availability' | 'hybrid';
export type AgentStatus = 'available' | 'busy' | 'away' | 'offline';

export interface RoutingRule {
  id: string;
  name: string;
  priority: number;
  strategy: RoutingStrategy;
  conditions: RoutingCondition[];
  targetPool: string[];
  fallbackPool?: string[];
  config: RoutingConfig;
  isActive: boolean;
  createdAt: string;
}

export interface RoutingCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'in' | 'not_in' | 'greater_than' | 'less_than' | 'contains';
  value: string | number | string[];
}

export interface RoutingConfig {
  maxAssignments?: number;
  timeoutSeconds?: number;
  redistributeOnTimeout?: boolean;
  considerWorkload?: boolean;
  considerSkills?: boolean;
  weightByExperience?: boolean;
  respectShifts?: boolean;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  status: AgentStatus;
  skills: AgentSkill[];
  teams: string[];
  shift?: ShiftSchedule;
  currentWorkload: number;
  maxWorkload: number;
  totalAssigned: number;
  avgHandlingTime: number;
  lastAssignedAt?: string;
  isOnline: boolean;
}

export interface AgentSkill {
  skillId: string;
  skillName: string;
  proficiency: number; // 1-5
}

export interface ShiftSchedule {
  timezone: string;
  schedule: {
    day: number;
    start: string;
    end: string;
  }[];
}

export interface RoutingRequest {
  id: string;
  itemType: string;
  itemId: string;
  attributes: Record<string, string | number>;
  priority: number;
  requiredSkills?: string[];
  preferredAgent?: string;
  excludeAgents?: string[];
  createdAt: string;
}

export interface RoutingDecision {
  requestId: string;
  assignedAgentId: string;
  assignedAgentName: string;
  ruleApplied: string;
  strategy: RoutingStrategy;
  score: number;
  reason: string;
  alternatives: { agentId: string; agentName: string; score: number }[];
  decidedAt: string;
}

export interface RoutingMetrics {
  totalRoutings: number;
  avgRoutingTime: number;
  routingsByStrategy: Record<string, number>;
  agentUtilization: { agentId: string; name: string; utilization: number; assigned: number }[];
  overflowCount: number;
  timeoutCount: number;
}

@Injectable()
export class IntelligentRoutingService {
  private rules: RoutingRule[] = [];
  private agents: Agent[] = [];
  private decisions: RoutingDecision[] = [];
  private roundRobinIndex: Map<string, number> = new Map();

  constructor() {
    this.seedMockData();
  }

  async createRule(rule: Omit<RoutingRule, 'id' | 'createdAt'>): Promise<RoutingRule> {
    const newRule: RoutingRule = {
      ...rule,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };

    this.rules.push(newRule);
    this.rules.sort((a, b) => b.priority - a.priority);

    return newRule;
  }

  async route(request: RoutingRequest): Promise<RoutingDecision> {
    // Find matching rule
    const rule = await this.findMatchingRule(request);
    if (!rule) {
      throw new Error('No matching routing rule found');
    }

    // Get available agents from pool
    let candidateAgents = this.agents.filter(a =>
      rule.targetPool.includes(a.id) &&
      a.isOnline &&
      a.status === 'available' &&
      a.currentWorkload < a.maxWorkload
    );

    // Apply exclusions
    if (request.excludeAgents) {
      candidateAgents = candidateAgents.filter(a => !request.excludeAgents!.includes(a.id));
    }

    // Check preferred agent
    if (request.preferredAgent) {
      const preferred = candidateAgents.find(a => a.id === request.preferredAgent);
      if (preferred) {
        return this.createDecision(request, preferred, rule, 100, 'Preferred agent available');
      }
    }

    // Apply routing strategy
    let selectedAgent: Agent | null = null;
    let score = 0;
    let reason = '';

    switch (rule.strategy) {
      case 'round_robin':
        selectedAgent = this.roundRobinSelect(candidateAgents, rule.id);
        score = 80;
        reason = 'Round robin assignment';
        break;

      case 'least_loaded':
        selectedAgent = this.leastLoadedSelect(candidateAgents);
        score = 85;
        reason = 'Agent with lowest current workload';
        break;

      case 'skill_based':
        if (request.requiredSkills) {
          const result = this.skillBasedSelect(candidateAgents, request.requiredSkills);
          selectedAgent = result.agent;
          score = result.score;
          reason = `Best skill match (${Math.round(score)}% match)`;
        }
        break;

      case 'priority_based':
        selectedAgent = this.priorityBasedSelect(candidateAgents, request.priority);
        score = 90;
        reason = 'High priority routing to senior agent';
        break;

      case 'availability':
        selectedAgent = this.availabilitySelect(candidateAgents);
        score = 75;
        reason = 'Based on shift availability';
        break;

      case 'hybrid':
        const hybridResult = this.hybridSelect(candidateAgents, request, rule.config);
        selectedAgent = hybridResult.agent;
        score = hybridResult.score;
        reason = 'Hybrid scoring (workload + skills + experience)';
        break;
    }

    if (!selectedAgent) {
      // Try fallback pool
      if (rule.fallbackPool) {
        candidateAgents = this.agents.filter(a =>
          rule.fallbackPool!.includes(a.id) && a.isOnline && a.status === 'available'
        );
        selectedAgent = candidateAgents[0];
        score = 50;
        reason = 'Fallback pool assignment';
      }

      if (!selectedAgent) {
        throw new Error('No available agents for routing');
      }
    }

    const decision = this.createDecision(request, selectedAgent, rule, score, reason);

    // Update agent workload
    selectedAgent.currentWorkload++;
    selectedAgent.totalAssigned++;
    selectedAgent.lastAssignedAt = new Date().toISOString();

    this.decisions.push(decision);
    return decision;
  }

  private async findMatchingRule(request: RoutingRequest): Promise<RoutingRule | null> {
    for (const rule of this.rules) {
      if (!rule.isActive) continue;

      const matches = rule.conditions.every(cond => {
        const value = request.attributes[cond.field];
        if (value === undefined) return false;

        switch (cond.operator) {
          case 'equals': return value === cond.value;
          case 'not_equals': return value !== cond.value;
          case 'in': return (cond.value as string[]).includes(String(value));
          case 'not_in': return !(cond.value as string[]).includes(String(value));
          case 'greater_than': return Number(value) > Number(cond.value);
          case 'less_than': return Number(value) < Number(cond.value);
          case 'contains': return String(value).includes(String(cond.value));
          default: return false;
        }
      });

      if (matches || rule.conditions.length === 0) {
        return rule;
      }
    }

    return null;
  }

  private roundRobinSelect(agents: Agent[], ruleId: string): Agent | null {
    if (agents.length === 0) return null;

    let index = this.roundRobinIndex.get(ruleId) || 0;
    if (index >= agents.length) index = 0;

    const selected = agents[index];
    this.roundRobinIndex.set(ruleId, index + 1);

    return selected;
  }

  private leastLoadedSelect(agents: Agent[]): Agent | null {
    if (agents.length === 0) return null;

    return agents.reduce((min, agent) =>
      (agent.currentWorkload / agent.maxWorkload) < (min.currentWorkload / min.maxWorkload) ? agent : min
    );
  }

  private skillBasedSelect(agents: Agent[], requiredSkills: string[]): { agent: Agent | null; score: number } {
    if (agents.length === 0) return { agent: null, score: 0 };

    let bestAgent: Agent | null = null;
    let bestScore = 0;

    for (const agent of agents) {
      let matchScore = 0;
      let totalProficiency = 0;

      for (const skill of requiredSkills) {
        const agentSkill = agent.skills.find(s => s.skillId === skill || s.skillName === skill);
        if (agentSkill) {
          matchScore++;
          totalProficiency += agentSkill.proficiency;
        }
      }

      const coverage = matchScore / requiredSkills.length;
      const proficiencyAvg = matchScore > 0 ? totalProficiency / matchScore / 5 : 0;
      const score = (coverage * 0.6 + proficiencyAvg * 0.4) * 100;

      if (score > bestScore) {
        bestScore = score;
        bestAgent = agent;
      }
    }

    return { agent: bestAgent, score: bestScore };
  }

  private priorityBasedSelect(agents: Agent[], priority: number): Agent | null {
    if (agents.length === 0) return null;

    // Sort by experience (total assigned) for high priority
    if (priority >= 8) {
      return agents.sort((a, b) => b.totalAssigned - a.totalAssigned)[0];
    }

    // For lower priority, prefer least loaded
    return this.leastLoadedSelect(agents);
  }

  private availabilitySelect(agents: Agent[]): Agent | null {
    if (agents.length === 0) return null;

    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = now.toTimeString().slice(0, 5);

    // Filter agents currently in their shift
    const inShift = agents.filter(agent => {
      if (!agent.shift) return true;

      const todaySchedule = agent.shift.schedule.find(s => s.day === currentDay);
      if (!todaySchedule) return false;

      return currentTime >= todaySchedule.start && currentTime <= todaySchedule.end;
    });

    return inShift[0] || agents[0];
  }

  private hybridSelect(
    agents: Agent[],
    request: RoutingRequest,
    config: RoutingConfig
  ): { agent: Agent | null; score: number } {
    if (agents.length === 0) return { agent: null, score: 0 };

    let bestAgent: Agent | null = null;
    let bestScore = 0;

    for (const agent of agents) {
      let score = 0;

      // Workload score (lower is better)
      if (config.considerWorkload) {
        const workloadRatio = agent.currentWorkload / agent.maxWorkload;
        score += (1 - workloadRatio) * 30;
      }

      // Skill score
      if (config.considerSkills && request.requiredSkills) {
        const skillResult = this.skillBasedSelect([agent], request.requiredSkills);
        score += skillResult.score * 0.4;
      }

      // Experience score
      if (config.weightByExperience) {
        const expScore = Math.min(agent.totalAssigned / 100, 1) * 20;
        score += expScore;
      }

      // Handling time score (faster is better)
      if (agent.avgHandlingTime > 0) {
        const timeScore = Math.max(0, 10 - agent.avgHandlingTime / 10);
        score += timeScore;
      }

      if (score > bestScore) {
        bestScore = score;
        bestAgent = agent;
      }
    }

    return { agent: bestAgent, score: bestScore };
  }

  private createDecision(
    request: RoutingRequest,
    agent: Agent,
    rule: RoutingRule,
    score: number,
    reason: string
  ): RoutingDecision {
    return {
      requestId: request.id,
      assignedAgentId: agent.id,
      assignedAgentName: agent.name,
      ruleApplied: rule.name,
      strategy: rule.strategy,
      score,
      reason,
      alternatives: [],
      decidedAt: new Date().toISOString(),
    };
  }

  async updateAgentStatus(agentId: string, status: AgentStatus): Promise<Agent> {
    const agent = this.agents.find(a => a.id === agentId);
    if (!agent) throw new Error(`Agent ${agentId} not found`);

    agent.status = status;
    agent.isOnline = status !== 'offline';

    return agent;
  }

  async completeAssignment(agentId: string, handlingTimeMinutes: number): Promise<void> {
    const agent = this.agents.find(a => a.id === agentId);
    if (!agent) return;

    agent.currentWorkload = Math.max(0, agent.currentWorkload - 1);

    // Update average handling time
    const totalTime = agent.avgHandlingTime * (agent.totalAssigned - 1) + handlingTimeMinutes;
    agent.avgHandlingTime = Math.round(totalTime / agent.totalAssigned);
  }

  async getAgentMetrics(): Promise<RoutingMetrics> {
    const routingsByStrategy: Record<string, number> = {};

    for (const decision of this.decisions) {
      routingsByStrategy[decision.strategy] = (routingsByStrategy[decision.strategy] || 0) + 1;
    }

    const agentUtilization = this.agents.map(agent => ({
      agentId: agent.id,
      name: agent.name,
      utilization: Math.round((agent.currentWorkload / agent.maxWorkload) * 100),
      assigned: agent.totalAssigned,
    }));

    return {
      totalRoutings: this.decisions.length,
      avgRoutingTime: 50, // ms
      routingsByStrategy,
      agentUtilization,
      overflowCount: 0,
      timeoutCount: 0,
    };
  }

  async getAvailableAgents(poolId?: string): Promise<Agent[]> {
    let agents = this.agents.filter(a => a.isOnline && a.status === 'available');
    if (poolId) {
      const rule = this.rules.find(r => r.id === poolId);
      if (rule) {
        agents = agents.filter(a => rule.targetPool.includes(a.id));
      }
    }
    return agents;
  }

  private seedMockData(): void {
    // Sample agents
    this.agents = [
      {
        id: uuidv4(),
        name: 'Agent Alice',
        email: 'alice@company.com',
        status: 'available',
        skills: [
          { skillId: 'technical', skillName: 'Technical Support', proficiency: 5 },
          { skillId: 'billing', skillName: 'Billing', proficiency: 3 },
        ],
        teams: ['support-team'],
        currentWorkload: 3,
        maxWorkload: 10,
        totalAssigned: 150,
        avgHandlingTime: 25,
        isOnline: true,
      },
      {
        id: uuidv4(),
        name: 'Agent Bob',
        email: 'bob@company.com',
        status: 'available',
        skills: [
          { skillId: 'billing', skillName: 'Billing', proficiency: 5 },
          { skillId: 'sales', skillName: 'Sales', proficiency: 4 },
        ],
        teams: ['support-team'],
        currentWorkload: 5,
        maxWorkload: 10,
        totalAssigned: 200,
        avgHandlingTime: 20,
        isOnline: true,
      },
      {
        id: uuidv4(),
        name: 'Agent Carol',
        email: 'carol@company.com',
        status: 'available',
        skills: [
          { skillId: 'technical', skillName: 'Technical Support', proficiency: 4 },
          { skillId: 'sales', skillName: 'Sales', proficiency: 3 },
        ],
        teams: ['support-team'],
        currentWorkload: 2,
        maxWorkload: 10,
        totalAssigned: 100,
        avgHandlingTime: 30,
        isOnline: true,
      },
    ];

    // Sample routing rules
    const agentIds = this.agents.map(a => a.id);

    this.rules = [
      {
        id: uuidv4(),
        name: 'Technical Issues',
        priority: 100,
        strategy: 'skill_based',
        conditions: [
          { field: 'category', operator: 'equals', value: 'technical' },
        ],
        targetPool: agentIds,
        config: {
          considerSkills: true,
          considerWorkload: true,
        },
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        name: 'Default Round Robin',
        priority: 1,
        strategy: 'round_robin',
        conditions: [],
        targetPool: agentIds,
        config: {},
        isActive: true,
        createdAt: new Date().toISOString(),
      },
    ];
  }
}
