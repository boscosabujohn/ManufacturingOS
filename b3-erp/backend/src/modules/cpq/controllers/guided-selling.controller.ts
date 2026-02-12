import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  QuestionnaireResponse,
  RecommendationEvent,
  RecommendationRule,
  SalesPlaybook,
  SalesQuestionnaire,
} from '../entities/guided-selling.entity';
import { GuidedSellingService } from '../services/guided-selling.service';

@Controller('cpq/guided-selling')
export class GuidedSellingController {
  constructor(private readonly guidedSellingService: GuidedSellingService) {}

  // Sales Playbooks
  @Post('playbooks')
  createPlaybook(
    @Headers('x-company-id') companyId: string,
    @Body() data: Partial<SalesPlaybook>,
  ): Promise<SalesPlaybook> {
    return this.guidedSellingService.createPlaybook(companyId, data);
  }

  @Get('playbooks')
  findAllPlaybooks(
    @Headers('x-company-id') companyId: string,
    @Query('industry') industry?: string,
    @Query('customerSegment') customerSegment?: string,
    @Query('isActive') isActive?: string,
  ): Promise<SalesPlaybook[]> {
    return this.guidedSellingService.findAllPlaybooks(companyId, {
      industry,
      customerSegment,
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
    });
  }

  @Get('playbooks/:id')
  findPlaybookById(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
  ): Promise<SalesPlaybook> {
    return this.guidedSellingService.findPlaybookById(companyId, id);
  }

  @Patch('playbooks/:id')
  updatePlaybook(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
    @Body() data: Partial<SalesPlaybook>,
  ): Promise<SalesPlaybook> {
    return this.guidedSellingService.updatePlaybook(companyId, id, data);
  }

  @Delete('playbooks/:id')
  deletePlaybook(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
  ): Promise<void> {
    return this.guidedSellingService.deletePlaybook(companyId, id);
  }

  @Post('playbooks/:id/usage')
  recordPlaybookUsage(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
  ): Promise<void> {
    return this.guidedSellingService.recordPlaybookUsage(companyId, id);
  }

  // Recommendation Rules
  @Post('recommendations')
  createRecommendationRule(
    @Headers('x-company-id') companyId: string,
    @Body() data: Partial<RecommendationRule>,
  ): Promise<RecommendationRule> {
    return this.guidedSellingService.createRecommendationRule(companyId, data);
  }

  @Get('recommendations')
  findAllRecommendationRules(
    @Headers('x-company-id') companyId: string,
    @Query('recommendationType') recommendationType?: string,
    @Query('sourceProductId') sourceProductId?: string,
    @Query('isActive') isActive?: string,
  ): Promise<RecommendationRule[]> {
    return this.guidedSellingService.findAllRecommendationRules(companyId, {
      recommendationType,
      sourceProductId,
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
    });
  }

  @Get('recommendations/products/:productId')
  getProductRecommendations(
    @Headers('x-company-id') companyId: string,
    @Param('productId') productId: string,
    @Query('type') recommendationType?: 'cross_sell' | 'up_sell',
  ): Promise<
    {
      productId: string;
      productName: string;
      reason: string;
      priority: number;
      discountOffer?: number;
    }[]
  > {
    return this.guidedSellingService.getProductRecommendations(
      companyId,
      productId,
      recommendationType,
    );
  }

  @Patch('recommendations/:id')
  updateRecommendationRule(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
    @Body() data: Partial<RecommendationRule>,
  ): Promise<RecommendationRule> {
    return this.guidedSellingService.updateRecommendationRule(companyId, id, data);
  }

  @Delete('recommendations/:id')
  deleteRecommendationRule(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
  ): Promise<void> {
    return this.guidedSellingService.deleteRecommendationRule(companyId, id);
  }

  // Sales Questionnaires
  @Post('questionnaires')
  createQuestionnaire(
    @Headers('x-company-id') companyId: string,
    @Body() data: Partial<SalesQuestionnaire>,
  ): Promise<SalesQuestionnaire> {
    return this.guidedSellingService.createQuestionnaire(companyId, data);
  }

  @Get('questionnaires')
  findAllQuestionnaires(
    @Headers('x-company-id') companyId: string,
    @Query('industry') industry?: string,
    @Query('productCategory') productCategory?: string,
    @Query('isActive') isActive?: string,
  ): Promise<SalesQuestionnaire[]> {
    return this.guidedSellingService.findAllQuestionnaires(companyId, {
      industry,
      productCategory,
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
    });
  }

  @Get('questionnaires/:id')
  findQuestionnaireById(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
  ): Promise<SalesQuestionnaire> {
    return this.guidedSellingService.findQuestionnaireById(companyId, id);
  }

  @Patch('questionnaires/:id')
  updateQuestionnaire(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
    @Body() data: Partial<SalesQuestionnaire>,
  ): Promise<SalesQuestionnaire> {
    return this.guidedSellingService.updateQuestionnaire(companyId, id, data);
  }

  @Delete('questionnaires/:id')
  deleteQuestionnaire(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
  ): Promise<void> {
    return this.guidedSellingService.deleteQuestionnaire(companyId, id);
  }

  // Questionnaire Responses
  @Post('questionnaires/responses')
  submitQuestionnaireResponse(
    @Headers('x-company-id') companyId: string,
    @Body() data: Partial<QuestionnaireResponse>,
  ): Promise<QuestionnaireResponse> {
    return this.guidedSellingService.submitQuestionnaireResponse(companyId, data);
  }

  @Get('questionnaires/:id/responses')
  findQuestionnaireResponses(
    @Headers('x-company-id') companyId: string,
    @Param('id') questionnaireId: string,
  ): Promise<QuestionnaireResponse[]> {
    return this.guidedSellingService.findQuestionnaireResponses(
      companyId,
      questionnaireId,
    );
  }

  @Get('questionnaires/responses/:id')
  findResponseById(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
  ): Promise<QuestionnaireResponse> {
    return this.guidedSellingService.findResponseById(companyId, id);
  }

  // Recommendation Events
  @Post('events')
  recordRecommendationEvent(
    @Headers('x-company-id') companyId: string,
    @Body() data: Partial<RecommendationEvent>,
  ): Promise<RecommendationEvent> {
    return this.guidedSellingService.recordRecommendationEvent(companyId, data);
  }

  @Get('metrics')
  getRecommendationMetrics(
    @Headers('x-company-id') companyId: string,
    @Query('recommendationType') recommendationType?: 'cross_sell' | 'up_sell',
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
  ): Promise<{
    totalImpressions: number;
    totalClicks: number;
    totalConversions: number;
    clickThroughRate: number;
    conversionRate: number;
    totalRevenue: number;
  }> {
    return this.guidedSellingService.getRecommendationMetrics(companyId, {
      recommendationType,
      fromDate: fromDate ? new Date(fromDate) : undefined,
      toDate: toDate ? new Date(toDate) : undefined,
    });
  }
}
