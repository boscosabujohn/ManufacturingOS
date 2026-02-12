import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AIInsightService } from '../services/ai-insight.service';
import { AIInsight } from '../entities/ai-insight.entity';

@ApiTags('Production - Smart AI')
@Controller('production/ai-insights')
export class AIInsightController {
  constructor(private readonly aiInsightService: AIInsightService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new AI insight' })
  @ApiResponse({ status: HttpStatus.CREATED })
  async create(@Body() createDto: Partial<AIInsight>): Promise<AIInsight> {
    return this.aiInsightService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all AI insights' })
  @ApiQuery({ name: 'insightType', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'priority', required: false })
  async findAll(
    @Query('insightType') insightType?: any,
    @Query('status') status?: any,
    @Query('priority') priority?: any,
  ): Promise<AIInsight[]> {
    return this.aiInsightService.findAll({ insightType, status, priority });
  }

  @Get('dashboard')
  @ApiOperation({ summary: 'Get AI insights dashboard' })
  @ApiQuery({ name: 'companyId', required: true })
  async getDashboard(@Query('companyId') companyId: string): Promise<any> {
    return this.aiInsightService.getDashboard(companyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get AI insight by ID' })
  @ApiParam({ name: 'id' })
  async findOne(@Param('id') id: string): Promise<AIInsight> {
    return this.aiInsightService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update AI insight' })
  @ApiParam({ name: 'id' })
  async update(@Param('id') id: string, @Body() updateDto: Partial<AIInsight>): Promise<AIInsight> {
    return this.aiInsightService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete AI insight' })
  @ApiParam({ name: 'id' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.aiInsightService.remove(id);
  }

  @Post(':id/acknowledge')
  @ApiOperation({ summary: 'Acknowledge insight' })
  @ApiParam({ name: 'id' })
  async acknowledge(@Param('id') id: string, @Body('acknowledgedBy') acknowledgedBy: string): Promise<AIInsight> {
    return this.aiInsightService.acknowledge(id, acknowledgedBy);
  }

  @Post(':id/act')
  @ApiOperation({ summary: 'Act upon insight' })
  @ApiParam({ name: 'id' })
  async actUpon(
    @Param('id') id: string,
    @Body('actionTaken') actionTaken: string,
    @Body('actionBy') actionBy: string,
  ): Promise<AIInsight> {
    return this.aiInsightService.actUpon(id, actionTaken, actionBy);
  }

  @Post(':id/dismiss')
  @ApiOperation({ summary: 'Dismiss insight' })
  @ApiParam({ name: 'id' })
  async dismiss(@Param('id') id: string): Promise<AIInsight> {
    return this.aiInsightService.dismiss(id);
  }

  @Post(':id/feedback')
  @ApiOperation({ summary: 'Submit feedback' })
  @ApiParam({ name: 'id' })
  async submitFeedback(@Param('id') id: string, @Body() feedback: any): Promise<AIInsight> {
    return this.aiInsightService.submitFeedback(id, feedback);
  }
}
