import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { SimulationScenarioService } from '../services/simulation-scenario.service';
import { SimulationScenario } from '../entities/simulation-scenario.entity';

@ApiTags('Production - Industry 4.0')
@Controller('production/simulation-scenarios')
export class SimulationScenarioController {
  constructor(private readonly simulationScenarioService: SimulationScenarioService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new simulation scenario' })
  @ApiResponse({ status: HttpStatus.CREATED })
  async create(@Body() createDto: Partial<SimulationScenario>): Promise<SimulationScenario> {
    return this.simulationScenarioService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all simulation scenarios' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'simulationType', required: false })
  async findAll(
    @Query('status') status?: any,
    @Query('simulationType') simulationType?: any,
  ): Promise<SimulationScenario[]> {
    return this.simulationScenarioService.findAll({ status, simulationType });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get simulation scenario by ID' })
  @ApiParam({ name: 'id' })
  async findOne(@Param('id') id: string): Promise<SimulationScenario> {
    return this.simulationScenarioService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update simulation scenario' })
  @ApiParam({ name: 'id' })
  async update(@Param('id') id: string, @Body() updateDto: Partial<SimulationScenario>): Promise<SimulationScenario> {
    return this.simulationScenarioService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete simulation scenario' })
  @ApiParam({ name: 'id' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.simulationScenarioService.remove(id);
  }

  @Post(':id/run')
  @ApiOperation({ summary: 'Run simulation' })
  @ApiParam({ name: 'id' })
  async runSimulation(@Param('id') id: string, @Body('runBy') runBy: string): Promise<SimulationScenario> {
    return this.simulationScenarioService.runSimulation(id, runBy);
  }

  @Post('compare')
  @ApiOperation({ summary: 'Compare scenarios' })
  async compareScenarios(@Body('scenarioIds') scenarioIds: string[]): Promise<any> {
    return this.simulationScenarioService.compareScenarios(scenarioIds);
  }
}
