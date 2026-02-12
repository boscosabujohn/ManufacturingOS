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
  BOQTemplate,
  CostCategory,
  EstimateApprovalWorkflow,
  EstimateTemplate,
  EstimateVersion,
  TemplateType,
} from '../entities/estimate-template.entity';
import { EstimateTemplateService } from '../services/estimate-template.service';

@Controller('estimation/templates')
export class EstimateTemplateController {
  constructor(
    private readonly estimateTemplateService: EstimateTemplateService,
  ) {}

  // Estimate Templates
  @Post()
  createTemplate(
    @Headers('x-company-id') companyId: string,
    @Body() data: Partial<EstimateTemplate>,
  ): Promise<EstimateTemplate> {
    return this.estimateTemplateService.createTemplate(companyId, data);
  }

  @Get()
  findAllTemplates(
    @Headers('x-company-id') companyId: string,
    @Query('templateType') templateType?: TemplateType,
    @Query('category') category?: string,
    @Query('isActive') isActive?: string,
  ): Promise<EstimateTemplate[]> {
    return this.estimateTemplateService.findAllTemplates(companyId, {
      templateType,
      category,
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
    });
  }

  @Get(':id')
  findTemplateById(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
  ): Promise<EstimateTemplate> {
    return this.estimateTemplateService.findTemplateById(companyId, id);
  }

  @Patch(':id')
  updateTemplate(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
    @Body() data: Partial<EstimateTemplate>,
  ): Promise<EstimateTemplate> {
    return this.estimateTemplateService.updateTemplate(companyId, id, data);
  }

  @Delete(':id')
  deleteTemplate(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
  ): Promise<void> {
    return this.estimateTemplateService.deleteTemplate(companyId, id);
  }

  // BOQ Templates
  @Post('boq')
  createBOQTemplate(
    @Headers('x-company-id') companyId: string,
    @Body() data: Partial<BOQTemplate>,
  ): Promise<BOQTemplate> {
    return this.estimateTemplateService.createBOQTemplate(companyId, data);
  }

  @Get('boq/all')
  findAllBOQTemplates(
    @Headers('x-company-id') companyId: string,
    @Query('category') category?: string,
    @Query('isActive') isActive?: string,
  ): Promise<BOQTemplate[]> {
    return this.estimateTemplateService.findAllBOQTemplates(companyId, {
      category,
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
    });
  }

  @Get('boq/:id')
  findBOQTemplateById(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
  ): Promise<BOQTemplate> {
    return this.estimateTemplateService.findBOQTemplateById(companyId, id);
  }

  @Patch('boq/:id')
  updateBOQTemplate(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
    @Body() data: Partial<BOQTemplate>,
  ): Promise<BOQTemplate> {
    return this.estimateTemplateService.updateBOQTemplate(companyId, id, data);
  }

  @Delete('boq/:id')
  deleteBOQTemplate(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
  ): Promise<void> {
    return this.estimateTemplateService.deleteBOQTemplate(companyId, id);
  }

  // Cost Categories
  @Post('cost-categories')
  createCostCategory(
    @Headers('x-company-id') companyId: string,
    @Body() data: Partial<CostCategory>,
  ): Promise<CostCategory> {
    return this.estimateTemplateService.createCostCategory(companyId, data);
  }

  @Get('cost-categories/all')
  findAllCostCategories(
    @Headers('x-company-id') companyId: string,
    @Query('costType') costType?: string,
    @Query('parentCategoryId') parentCategoryId?: string,
    @Query('isActive') isActive?: string,
  ): Promise<CostCategory[]> {
    return this.estimateTemplateService.findAllCostCategories(companyId, {
      costType,
      parentCategoryId,
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
    });
  }

  @Get('cost-categories/tree')
  getCostCategoryTree(
    @Headers('x-company-id') companyId: string,
  ): Promise<CostCategory[]> {
    return this.estimateTemplateService.getCostCategoryTree(companyId);
  }

  @Get('cost-categories/:id')
  findCostCategoryById(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
  ): Promise<CostCategory> {
    return this.estimateTemplateService.findCostCategoryById(companyId, id);
  }

  @Patch('cost-categories/:id')
  updateCostCategory(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
    @Body() data: Partial<CostCategory>,
  ): Promise<CostCategory> {
    return this.estimateTemplateService.updateCostCategory(companyId, id, data);
  }

  @Delete('cost-categories/:id')
  deleteCostCategory(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
  ): Promise<void> {
    return this.estimateTemplateService.deleteCostCategory(companyId, id);
  }

  // Approval Workflows
  @Post('workflows')
  createWorkflow(
    @Headers('x-company-id') companyId: string,
    @Body() data: Partial<EstimateApprovalWorkflow>,
  ): Promise<EstimateApprovalWorkflow> {
    return this.estimateTemplateService.createWorkflow(companyId, data);
  }

  @Get('workflows/all')
  findAllWorkflows(
    @Headers('x-company-id') companyId: string,
    @Query('entityType') entityType?: string,
    @Query('isActive') isActive?: string,
  ): Promise<EstimateApprovalWorkflow[]> {
    return this.estimateTemplateService.findAllWorkflows(companyId, {
      entityType,
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
    });
  }

  @Get('workflows/applicable')
  getApplicableWorkflow(
    @Headers('x-company-id') companyId: string,
    @Query('entityType') entityType: string,
    @Query('amount') amount?: string,
  ): Promise<EstimateApprovalWorkflow | null> {
    return this.estimateTemplateService.getApplicableWorkflow(
      companyId,
      entityType,
      amount ? parseFloat(amount) : undefined,
    );
  }

  @Get('workflows/:id')
  findWorkflowById(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
  ): Promise<EstimateApprovalWorkflow> {
    return this.estimateTemplateService.findWorkflowById(companyId, id);
  }

  @Patch('workflows/:id')
  updateWorkflow(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
    @Body() data: Partial<EstimateApprovalWorkflow>,
  ): Promise<EstimateApprovalWorkflow> {
    return this.estimateTemplateService.updateWorkflow(companyId, id, data);
  }

  @Delete('workflows/:id')
  deleteWorkflow(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
  ): Promise<void> {
    return this.estimateTemplateService.deleteWorkflow(companyId, id);
  }

  // Estimate Versions
  @Post('versions')
  createVersion(
    @Headers('x-company-id') companyId: string,
    @Body() data: Partial<EstimateVersion>,
  ): Promise<EstimateVersion> {
    return this.estimateTemplateService.createVersion(companyId, data);
  }

  @Get('versions/by-estimate')
  findVersionsByEstimate(
    @Headers('x-company-id') companyId: string,
    @Query('estimateId') estimateId: string,
    @Query('estimateType') estimateType: 'BOQ' | 'CostEstimate' | 'Pricing',
  ): Promise<EstimateVersion[]> {
    return this.estimateTemplateService.findVersionsByEstimate(
      companyId,
      estimateId,
      estimateType,
    );
  }

  @Get('versions/:id')
  findVersionById(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
  ): Promise<EstimateVersion> {
    return this.estimateTemplateService.findVersionById(companyId, id);
  }

  @Get('versions/compare/:versionId1/:versionId2')
  compareVersions(
    @Headers('x-company-id') companyId: string,
    @Param('versionId1') versionId1: string,
    @Param('versionId2') versionId2: string,
  ) {
    return this.estimateTemplateService.compareVersions(
      companyId,
      versionId1,
      versionId2,
    );
  }
}
