import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  SourcingIntegrationService,
  CreateSourcingRuleDto,
  SourcingContext,
} from '../services/sourcing-integration.service';
import { SourcingRuleStatus } from '../entities/sourcing-rule.entity';

@Controller('procurement/sourcing')
export class SourcingIntegrationController {
  constructor(private readonly sourcingService: SourcingIntegrationService) {}

  @Post('rules')
  @HttpCode(HttpStatus.CREATED)
  async createRule(@Body() dto: CreateSourcingRuleDto) {
    return this.sourcingService.createRule(dto);
  }

  @Get('rules')
  @HttpCode(HttpStatus.OK)
  async getRules(
    @Query('companyId') companyId: string,
    @Query('status') status?: SourcingRuleStatus,
  ) {
    return this.sourcingService.getRules(companyId, status);
  }

  @Get('rules/active')
  @HttpCode(HttpStatus.OK)
  async getActiveRules(@Query('companyId') companyId: string) {
    return this.sourcingService.getActiveRules(companyId);
  }

  @Get('rules/:id')
  @HttpCode(HttpStatus.OK)
  async getRuleById(@Param('id') id: string) {
    return this.sourcingService.getRuleById(id);
  }

  @Put('rules/:id')
  @HttpCode(HttpStatus.OK)
  async updateRule(
    @Param('id') id: string,
    @Body() dto: Partial<CreateSourcingRuleDto>,
  ) {
    return this.sourcingService.updateRule(id, dto);
  }

  @Post('rules/:id/activate')
  @HttpCode(HttpStatus.OK)
  async activateRule(
    @Param('id') id: string,
    @Body('approvedBy') approvedBy: string,
  ) {
    return this.sourcingService.activateRule(id, approvedBy);
  }

  @Post('rules/:id/deactivate')
  @HttpCode(HttpStatus.OK)
  async deactivateRule(@Param('id') id: string) {
    return this.sourcingService.deactivateRule(id);
  }

  @Delete('rules/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteRule(@Param('id') id: string) {
    await this.sourcingService.deleteRule(id);
  }

  @Post('recommendation')
  @HttpCode(HttpStatus.OK)
  async getSourcingRecommendation(@Body() context: SourcingContext) {
    const recommendation = await this.sourcingService.getSourcingRecommendation(context);
    return recommendation || { message: 'No matching sourcing rule found' };
  }

  @Post('validate')
  @HttpCode(HttpStatus.OK)
  async validateSourcingDecision(
    @Body() dto: {
      companyId: string;
      amount: number;
      vendorCount: number;
      ruleId?: string;
    },
  ) {
    return this.sourcingService.validateSourcingDecision(
      dto.companyId,
      dto.amount,
      dto.vendorCount,
      dto.ruleId,
    );
  }
}
