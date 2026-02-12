import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CustomerPortalAccessService } from '../services/customer-portal-access.service';
import { CustomerPortalAccess, PortalAccessLevel, ApprovalStatus } from '../entities/customer-portal-access.entity';

@ApiTags('Production - Collaboration - Customer Portal')
@Controller('production/collaboration/customer-portal')
export class CustomerPortalAccessController {
  constructor(private readonly customerPortalAccessService: CustomerPortalAccessService) {}

  @Post()
  @ApiOperation({ summary: 'Create customer portal access' })
  @ApiResponse({ status: HttpStatus.CREATED })
  async create(@Body() createDto: Partial<CustomerPortalAccess>): Promise<CustomerPortalAccess> {
    return this.customerPortalAccessService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all customer portal accesses' })
  @ApiQuery({ name: 'companyId', required: false })
  @ApiQuery({ name: 'customerId', required: false })
  @ApiQuery({ name: 'orderId', required: false })
  @ApiQuery({ name: 'projectId', required: false })
  @ApiQuery({ name: 'accessLevel', required: false })
  @ApiQuery({ name: 'isActive', required: false })
  async findAll(
    @Query('companyId') companyId?: string,
    @Query('customerId') customerId?: string,
    @Query('orderId') orderId?: string,
    @Query('projectId') projectId?: string,
    @Query('accessLevel') accessLevel?: PortalAccessLevel,
    @Query('isActive') isActive?: boolean,
  ): Promise<CustomerPortalAccess[]> {
    return this.customerPortalAccessService.findAll({ companyId, customerId, orderId, projectId, accessLevel, isActive });
  }

  @Get('pending-approvals')
  @ApiOperation({ summary: 'Get pending access approvals' })
  @ApiQuery({ name: 'companyId', required: true })
  async getPendingApprovals(@Query('companyId') companyId: string): Promise<any[]> {
    return this.customerPortalAccessService.getPendingApprovals(companyId);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get portal summary' })
  @ApiQuery({ name: 'companyId', required: true })
  async getPortalSummary(@Query('companyId') companyId: string): Promise<any> {
    return this.customerPortalAccessService.getPortalSummary(companyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get customer portal access by ID' })
  @ApiParam({ name: 'id' })
  async findOne(@Param('id') id: string): Promise<CustomerPortalAccess> {
    return this.customerPortalAccessService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update customer portal access' })
  @ApiParam({ name: 'id' })
  async update(@Param('id') id: string, @Body() updateDto: Partial<CustomerPortalAccess>): Promise<CustomerPortalAccess> {
    return this.customerPortalAccessService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete customer portal access' })
  @ApiParam({ name: 'id' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.customerPortalAccessService.remove(id);
  }

  @Post(':id/log-access')
  @ApiOperation({ summary: 'Log portal access' })
  @ApiParam({ name: 'id' })
  async logAccess(
    @Param('id') id: string,
    @Body() data: { action: string; ipAddress: string; userAgent: string },
  ): Promise<CustomerPortalAccess> {
    return this.customerPortalAccessService.logAccess(id, data.action, data.ipAddress, data.userAgent);
  }

  @Post(':id/document')
  @ApiOperation({ summary: 'Add document to portal' })
  @ApiParam({ name: 'id' })
  async addDocument(@Param('id') id: string, @Body() document: any): Promise<CustomerPortalAccess> {
    return this.customerPortalAccessService.addDocument(id, document);
  }

  @Put(':id/document/:documentId/approval')
  @ApiOperation({ summary: 'Update document approval status' })
  @ApiParam({ name: 'id' })
  @ApiParam({ name: 'documentId' })
  async updateDocumentApproval(
    @Param('id') id: string,
    @Param('documentId') documentId: string,
    @Body() data: { status: ApprovalStatus; approvedBy?: string; comments?: string },
  ): Promise<CustomerPortalAccess> {
    return this.customerPortalAccessService.updateDocumentApproval(id, documentId, data.status, data.approvedBy, data.comments);
  }

  @Post(':id/approval-request')
  @ApiOperation({ summary: 'Add approval request' })
  @ApiParam({ name: 'id' })
  async addApprovalRequest(@Param('id') id: string, @Body() request: any): Promise<CustomerPortalAccess> {
    return this.customerPortalAccessService.addApprovalRequest(id, request);
  }

  @Put(':id/approval/:approvalId/respond')
  @ApiOperation({ summary: 'Respond to approval request' })
  @ApiParam({ name: 'id' })
  @ApiParam({ name: 'approvalId' })
  async respondToApproval(
    @Param('id') id: string,
    @Param('approvalId') approvalId: string,
    @Body('status') status: ApprovalStatus,
  ): Promise<CustomerPortalAccess> {
    return this.customerPortalAccessService.respondToApproval(id, approvalId, status);
  }

  @Post(':id/update')
  @ApiOperation({ summary: 'Add update to portal' })
  @ApiParam({ name: 'id' })
  async addUpdate(@Param('id') id: string, @Body() update: any): Promise<CustomerPortalAccess> {
    return this.customerPortalAccessService.addUpdate(id, update);
  }

  @Put(':id/update/:updateId/read')
  @ApiOperation({ summary: 'Mark update as read' })
  @ApiParam({ name: 'id' })
  @ApiParam({ name: 'updateId' })
  async markUpdateAsRead(
    @Param('id') id: string,
    @Param('updateId') updateId: string,
  ): Promise<CustomerPortalAccess> {
    return this.customerPortalAccessService.markUpdateAsRead(id, updateId);
  }

  @Put(':id/milestone/:milestoneId')
  @ApiOperation({ summary: 'Update milestone' })
  @ApiParam({ name: 'id' })
  @ApiParam({ name: 'milestoneId' })
  async updateMilestone(
    @Param('id') id: string,
    @Param('milestoneId') milestoneId: string,
    @Body() updates: any,
  ): Promise<CustomerPortalAccess> {
    return this.customerPortalAccessService.updateMilestone(id, milestoneId, updates);
  }
}
