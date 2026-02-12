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
  CPQApprovalRequest,
  CPQApprovalWorkflow,
  CPQIntegration,
  CPQNotificationSetting,
  CPQSettings,
  CPQUserPermission,
} from '../entities/cpq-settings.entity';
import { CPQSettingsService } from '../services/cpq-settings.service';

@Controller('cpq/settings')
export class CPQSettingsController {
  constructor(private readonly cpqSettingsService: CPQSettingsService) {}

  // General Settings
  @Get()
  getSettings(
    @Headers('x-company-id') companyId: string,
  ): Promise<CPQSettings> {
    return this.cpqSettingsService.getSettings(companyId);
  }

  @Patch()
  updateSettings(
    @Headers('x-company-id') companyId: string,
    @Body() data: Partial<CPQSettings>,
  ): Promise<CPQSettings> {
    return this.cpqSettingsService.updateSettings(companyId, data);
  }

  // User Permissions
  @Get('permissions')
  getAllUserPermissions(
    @Headers('x-company-id') companyId: string,
  ): Promise<CPQUserPermission[]> {
    return this.cpqSettingsService.getAllUserPermissions(companyId);
  }

  @Get('permissions/:userId')
  getUserPermissions(
    @Headers('x-company-id') companyId: string,
    @Param('userId') userId: string,
  ): Promise<CPQUserPermission | null> {
    return this.cpqSettingsService.getUserPermissions(companyId, userId);
  }

  @Post('permissions/:userId')
  setUserPermissions(
    @Headers('x-company-id') companyId: string,
    @Param('userId') userId: string,
    @Body() data: Partial<CPQUserPermission>,
  ): Promise<CPQUserPermission> {
    return this.cpqSettingsService.setUserPermissions(companyId, userId, data);
  }

  @Delete('permissions/:userId')
  deleteUserPermissions(
    @Headers('x-company-id') companyId: string,
    @Param('userId') userId: string,
  ): Promise<void> {
    return this.cpqSettingsService.deleteUserPermissions(companyId, userId);
  }

  // Permission Checks
  @Get('permissions/:userId/can-approve-quote')
  canApproveQuote(
    @Headers('x-company-id') companyId: string,
    @Param('userId') userId: string,
    @Query('value') quoteValue: string,
  ): Promise<boolean> {
    return this.cpqSettingsService.canApproveQuote(
      companyId,
      userId,
      parseFloat(quoteValue),
    );
  }

  @Get('permissions/:userId/can-apply-discount')
  canApplyDiscount(
    @Headers('x-company-id') companyId: string,
    @Param('userId') userId: string,
    @Query('percentage') discountPercentage: string,
  ): Promise<boolean> {
    return this.cpqSettingsService.canApplyDiscount(
      companyId,
      userId,
      parseFloat(discountPercentage),
    );
  }

  // Approval Workflows
  @Post('workflows')
  createWorkflow(
    @Headers('x-company-id') companyId: string,
    @Body() data: Partial<CPQApprovalWorkflow>,
  ): Promise<CPQApprovalWorkflow> {
    return this.cpqSettingsService.createWorkflow(companyId, data);
  }

  @Get('workflows')
  findAllWorkflows(
    @Headers('x-company-id') companyId: string,
    @Query('workflowType') workflowType?: string,
    @Query('isActive') isActive?: string,
  ): Promise<CPQApprovalWorkflow[]> {
    return this.cpqSettingsService.findAllWorkflows(companyId, {
      workflowType,
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
    });
  }

  @Get('workflows/:id')
  findWorkflowById(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
  ): Promise<CPQApprovalWorkflow> {
    return this.cpqSettingsService.findWorkflowById(companyId, id);
  }

  @Get('workflows/applicable')
  getApplicableWorkflow(
    @Headers('x-company-id') companyId: string,
    @Query('workflowType')
    workflowType: 'quote' | 'discount' | 'proposal' | 'contract',
    @Query('amount') amount?: string,
    @Query('discountPercentage') discountPercentage?: string,
  ): Promise<CPQApprovalWorkflow | null> {
    return this.cpqSettingsService.getApplicableWorkflow(
      companyId,
      workflowType,
      amount ? parseFloat(amount) : undefined,
      discountPercentage ? parseFloat(discountPercentage) : undefined,
    );
  }

  @Patch('workflows/:id')
  updateWorkflow(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
    @Body() data: Partial<CPQApprovalWorkflow>,
  ): Promise<CPQApprovalWorkflow> {
    return this.cpqSettingsService.updateWorkflow(companyId, id, data);
  }

  @Delete('workflows/:id')
  deleteWorkflow(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
  ): Promise<void> {
    return this.cpqSettingsService.deleteWorkflow(companyId, id);
  }

  // Approval Requests
  @Post('approval-requests')
  createApprovalRequest(
    @Headers('x-company-id') companyId: string,
    @Body() data: Partial<CPQApprovalRequest>,
  ): Promise<CPQApprovalRequest> {
    return this.cpqSettingsService.createApprovalRequest(companyId, data);
  }

  @Get('approval-requests')
  findApprovalRequests(
    @Headers('x-company-id') companyId: string,
    @Query('entityType') entityType?: string,
    @Query('status') status?: string,
    @Query('entityId') entityId?: string,
  ): Promise<CPQApprovalRequest[]> {
    return this.cpqSettingsService.findApprovalRequests(companyId, {
      entityType,
      status,
      entityId,
    });
  }

  @Get('approval-requests/:id')
  findApprovalRequestById(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
  ): Promise<CPQApprovalRequest> {
    return this.cpqSettingsService.findApprovalRequestById(companyId, id);
  }

  @Post('approval-requests/:id/process')
  processApprovalStep(
    @Headers('x-company-id') companyId: string,
    @Param('id') requestId: string,
    @Body()
    body: {
      approverId: string;
      approverName: string;
      action: 'approved' | 'rejected' | 'escalated';
      comments?: string;
    },
  ): Promise<CPQApprovalRequest> {
    return this.cpqSettingsService.processApprovalStep(
      companyId,
      requestId,
      body.approverId,
      body.approverName,
      body.action,
      body.comments,
    );
  }

  @Post('approval-requests/:id/cancel')
  cancelApprovalRequest(
    @Headers('x-company-id') companyId: string,
    @Param('id') requestId: string,
  ): Promise<CPQApprovalRequest> {
    return this.cpqSettingsService.cancelApprovalRequest(companyId, requestId);
  }

  // Notification Settings
  @Get('notifications/:userId')
  getUserNotificationSettings(
    @Headers('x-company-id') companyId: string,
    @Param('userId') userId: string,
  ): Promise<CPQNotificationSetting[]> {
    return this.cpqSettingsService.getUserNotificationSettings(companyId, userId);
  }

  @Patch('notifications/:userId/:notificationType')
  updateNotificationSetting(
    @Headers('x-company-id') companyId: string,
    @Param('userId') userId: string,
    @Param('notificationType') notificationType: string,
    @Body() data: Partial<CPQNotificationSetting>,
  ): Promise<CPQNotificationSetting> {
    return this.cpqSettingsService.updateNotificationSetting(
      companyId,
      userId,
      notificationType,
      data,
    );
  }

  // Integrations
  @Post('integrations')
  createIntegration(
    @Headers('x-company-id') companyId: string,
    @Body() data: Partial<CPQIntegration>,
  ): Promise<CPQIntegration> {
    return this.cpqSettingsService.createIntegration(companyId, data);
  }

  @Get('integrations')
  findAllIntegrations(
    @Headers('x-company-id') companyId: string,
    @Query('integrationType') integrationType?: string,
    @Query('isActive') isActive?: string,
  ): Promise<CPQIntegration[]> {
    return this.cpqSettingsService.findAllIntegrations(companyId, {
      integrationType,
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
    });
  }

  @Get('integrations/:id')
  findIntegrationById(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
  ): Promise<CPQIntegration> {
    return this.cpqSettingsService.findIntegrationById(companyId, id);
  }

  @Patch('integrations/:id')
  updateIntegration(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
    @Body() data: Partial<CPQIntegration>,
  ): Promise<CPQIntegration> {
    return this.cpqSettingsService.updateIntegration(companyId, id, data);
  }

  @Delete('integrations/:id')
  deleteIntegration(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
  ): Promise<void> {
    return this.cpqSettingsService.deleteIntegration(companyId, id);
  }

  @Post('integrations/:id/test')
  testIntegration(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
  ): Promise<{ success: boolean; message: string }> {
    return this.cpqSettingsService.testIntegration(companyId, id);
  }

  @Post('integrations/:id/sync')
  recordIntegrationSync(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
    @Body() body: { status: 'success' | 'failed'; error?: string },
  ): Promise<void> {
    return this.cpqSettingsService.recordIntegrationSync(
      companyId,
      id,
      body.status,
      body.error,
    );
  }
}
