import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Param,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { Permissions } from '../../../common/decorators/permissions.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { PermissionService } from '../services/permission.service';
import { CreatePermissionDto } from '../dto/create-permission.dto';
import { UpdatePermissionDto } from '../dto/update-permission.dto';

@ApiTags('IT Admin - Permissions')
@Controller('it-admin/permissions')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) { }

  @Post()
  @Permissions('PERMISSION_CREATE')
  @ApiOperation({ summary: 'Create a new permission' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Permission created successfully',
  })
  async create(@Body() createDto: CreatePermissionDto): Promise<any> {
    return this.permissionService.create(createDto);
  }

  @Post('bulk')
  @Permissions('PERMISSION_CREATE')
  @ApiOperation({ summary: 'Bulk create permissions' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Permissions created successfully',
  })
  async bulkCreate(@Body() body: { permissions: CreatePermissionDto[] }): Promise<any> {
    return this.permissionService.bulkCreate(body.permissions);
  }

  @Get()
  @Permissions('PERMISSION_VIEW')
  @ApiOperation({ summary: 'Get all permissions' })
  @ApiQuery({ name: 'module', required: false })
  @ApiQuery({ name: 'action', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of permissions',
  })
  async findAll(@Query() filters: any): Promise<any[]> {
    return this.permissionService.findAll(filters);
  }

  @Get('modules')
  @ApiOperation({ summary: 'Get all modules' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of modules',
  })
  async getModules(): Promise<string[]> {
    return this.permissionService.getModules();
  }

  @Get('actions')
  @ApiOperation({ summary: 'Get all actions' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of actions',
  })
  async getActions(): Promise<string[]> {
    return this.permissionService.getActions();
  }

  @Get('module/:module')
  @ApiOperation({ summary: 'Get permissions by module' })
  @ApiParam({ name: 'module', description: 'Module name' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of permissions',
  })
  async findByModule(@Param('module') module: string): Promise<any[]> {
    return this.permissionService.findByModule(module);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get permission by ID' })
  @ApiParam({ name: 'id', description: 'Permission ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Permission details',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Permission not found',
  })
  async findOne(@Param('id') id: string): Promise<any> {
    return this.permissionService.findOne(id);
  }

  @Get('code/:code')
  @ApiOperation({ summary: 'Get permission by code' })
  @ApiParam({ name: 'code', description: 'Permission code' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Permission details',
  })
  async findByCode(@Param('code') code: string): Promise<any> {
    return this.permissionService.findByCode(code);
  }

  @Put(':id')
  @Permissions('PERMISSION_UPDATE')
  @ApiOperation({ summary: 'Update permission' })
  @ApiParam({ name: 'id', description: 'Permission ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Permission updated successfully',
  })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdatePermissionDto,
  ): Promise<any> {
    return this.permissionService.update(id, updateDto);
  }

  @Delete(':id')
  @Permissions('PERMISSION_DELETE')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete permission' })
  @ApiParam({ name: 'id', description: 'Permission ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Permission deleted successfully',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.permissionService.remove(id);
  }
}
