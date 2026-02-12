import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SimulationScenario, SimulationStatus, SimulationType } from '../entities/simulation-scenario.entity';

@Injectable()
export class SimulationScenarioService {
  constructor(
    @InjectRepository(SimulationScenario)
    private readonly simulationScenarioRepository: Repository<SimulationScenario>,
  ) {}

  async create(createDto: Partial<SimulationScenario>): Promise<SimulationScenario> {
    const existing = await this.simulationScenarioRepository.findOne({
      where: { scenarioNumber: createDto.scenarioNumber },
    });

    if (existing) {
      throw new BadRequestException(`Simulation Scenario ${createDto.scenarioNumber} already exists`);
    }

    const scenario = this.simulationScenarioRepository.create(createDto);
    return this.simulationScenarioRepository.save(scenario);
  }

  async findAll(filters?: {
    companyId?: string;
    status?: SimulationStatus;
    simulationType?: SimulationType;
  }): Promise<SimulationScenario[]> {
    const query = this.simulationScenarioRepository.createQueryBuilder('scenario');

    if (filters?.companyId) {
      query.andWhere('scenario.companyId = :companyId', { companyId: filters.companyId });
    }

    if (filters?.status) {
      query.andWhere('scenario.status = :status', { status: filters.status });
    }

    if (filters?.simulationType) {
      query.andWhere('scenario.simulationType = :simulationType', { simulationType: filters.simulationType });
    }

    query.orderBy('scenario.createdAt', 'DESC');
    return query.getMany();
  }

  async findOne(id: string): Promise<SimulationScenario> {
    const scenario = await this.simulationScenarioRepository.findOne({ where: { id } });
    if (!scenario) {
      throw new NotFoundException(`Simulation Scenario with ID ${id} not found`);
    }
    return scenario;
  }

  async update(id: string, updateDto: Partial<SimulationScenario>): Promise<SimulationScenario> {
    const scenario = await this.findOne(id);
    Object.assign(scenario, updateDto);
    return this.simulationScenarioRepository.save(scenario);
  }

  async remove(id: string): Promise<void> {
    const scenario = await this.findOne(id);
    if (scenario.status === 'running') {
      throw new BadRequestException('Cannot delete running simulation');
    }
    await this.simulationScenarioRepository.remove(scenario);
  }

  async runSimulation(id: string, runBy: string): Promise<SimulationScenario> {
    const scenario = await this.findOne(id);

    if (scenario.status === 'running') {
      throw new BadRequestException('Simulation is already running');
    }

    scenario.status = 'running';
    scenario.simulationStart = new Date();
    scenario.runBy = runBy;
    scenario.runAt = new Date();
    await this.simulationScenarioRepository.save(scenario);

    // Mock simulation execution
    scenario.simulationResults = {
      kpis: {
        throughput: 1000 + Math.random() * 200,
        leadTime: 24 + Math.random() * 8,
        utilization: 75 + Math.random() * 15,
        onTimeDelivery: 85 + Math.random() * 10,
        inventoryTurns: 8 + Math.random() * 4,
        totalCost: 100000 + Math.random() * 50000,
      },
      bottlenecks: [],
      resourceUtilization: [],
      inventoryProjections: [],
      costBreakdown: [],
    };

    scenario.status = 'completed';
    scenario.simulationEnd = new Date();

    return this.simulationScenarioRepository.save(scenario);
  }

  async compareScenarios(scenarioIds: string[]): Promise<any> {
    const scenarios = await Promise.all(
      scenarioIds.map(id => this.findOne(id))
    );

    return {
      scenarios: scenarios.map(s => ({
        id: s.id,
        name: s.name,
        simulationType: s.simulationType,
        results: s.simulationResults,
      })),
      comparison: scenarios[0]?.comparisonWithBaseline || [],
    };
  }
}
