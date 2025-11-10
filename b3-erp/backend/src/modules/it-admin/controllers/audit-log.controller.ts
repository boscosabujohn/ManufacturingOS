import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { AuditLogService } from '../services/audit-log.service';
import { CreateAuditLogDto } from '../dto/create-audit-log.dto';
import { AuditLogQueryDto } from '../dto/audit-log-query.dto';

@ApiTags('IT Admin - Audit Logs')
@Controller('it-admin/audit-logs')
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Post()
  @ApiOperation({ summary: 'Create audit log entry' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Audit log created successfully',
  })
  async create(@Body() createDto: CreateAuditLogDto): Promise<any> {
    return this.auditLogService.log(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get audit logs with filters' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of audit logs',
  })
  async findAll(@Query() query: AuditLogQueryDto): Promise<any> {
    return this.auditLogService.findAll(query);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get user activity' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiQuery({ name: 'days', required: false, type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User activity logs',
  })
  async getUserActivity(
    @Param('userId') userId: string,
    @Query('days') days?: number,
  ): Promise<any[]> {
    return this.auditLogService.getUserActivity(userId, days ? +days : 30);
  }

  @Get('user/:userId/logins')
  @ApiOperation({ summary: 'Get user login history' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login history',
  })
  async getLoginHistory(
    @Param('userId') userId: string,
    @Query('limit') limit?: number,
  ): Promise<any[]> {
    return this.auditLogService.getLoginHistory(userId, limit ? +limit : 20);
  }

  @Get('module/:module')
  @ApiOperation({ summary: 'Get module activity' })
  @ApiParam({ name: 'module', description: 'Module name' })
  @ApiQuery({ name: 'days', required: false, type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Module activity logs',
  })
  async getModuleActivity(
    @Param('module') module: string,
    @Query('days') days?: number,
  ): Promise<any[]> {
    return this.auditLogService.getModuleActivity(module, days ? +days : 7);
  }

  @Get('entity/:entityType/:entityId')
  @ApiOperation({ summary: 'Get entity history' })
  @ApiParam({ name: 'entityType', description: 'Entity type' })
  @ApiParam({ name: 'entityId', description: 'Entity ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Entity history',
  })
  async getEntityHistory(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
  ): Promise<any[]> {
    return this.auditLogService.getEntityHistory(entityType, entityId);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get audit log statistics' })
  @ApiQuery({ name: 'days', required: false, type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Audit statistics',
  })
  async getStatistics(@Query('days') days?: number): Promise<any> {
    return this.auditLogService.getStatistics(days ? +days : 30);
  }
}
