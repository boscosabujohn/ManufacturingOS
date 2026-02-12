import {
  Controller,
  Get,
  Query,
  Param,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  AuditTrailService,
  AuditTrailFilter,
} from '../services/audit-trail.service';
import { AuditEntityType, AuditAction } from '../entities/audit-trail.entity';

@Controller('procurement/audit-trail')
export class AuditTrailController {
  constructor(private readonly auditTrailService: AuditTrailService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAuditTrail(
    @Query('companyId') companyId: string,
    @Query('entityType') entityType?: AuditEntityType,
    @Query('entityId') entityId?: string,
    @Query('action') action?: AuditAction,
    @Query('userId') userId?: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const filter: AuditTrailFilter = {
      companyId,
      entityType,
      entityId,
      action,
      userId,
      fromDate: fromDate ? new Date(fromDate) : undefined,
      toDate: toDate ? new Date(toDate) : undefined,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 50,
    };

    return this.auditTrailService.getAuditTrail(filter);
  }

  @Get('entity/:entityType/:entityId')
  @HttpCode(HttpStatus.OK)
  async getEntityHistory(
    @Param('entityType') entityType: AuditEntityType,
    @Param('entityId') entityId: string,
    @Query('companyId') companyId: string,
  ) {
    return this.auditTrailService.getEntityHistory(companyId, entityType, entityId);
  }

  @Get('user/:userId')
  @HttpCode(HttpStatus.OK)
  async getUserActivity(
    @Param('userId') userId: string,
    @Query('companyId') companyId: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
  ) {
    return this.auditTrailService.getUserActivity(
      companyId,
      userId,
      fromDate ? new Date(fromDate) : undefined,
      toDate ? new Date(toDate) : undefined,
    );
  }

  @Get('summary')
  @HttpCode(HttpStatus.OK)
  async getAuditSummary(
    @Query('companyId') companyId: string,
    @Query('fromDate') fromDate: string,
    @Query('toDate') toDate: string,
  ) {
    return this.auditTrailService.getAuditSummary(
      companyId,
      new Date(fromDate),
      new Date(toDate),
    );
  }
}
