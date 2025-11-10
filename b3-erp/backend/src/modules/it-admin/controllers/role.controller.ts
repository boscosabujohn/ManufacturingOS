import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { RoleService } from '../services/role.service';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';

@ApiTags('IT Admin - Roles')
@Controller('it-admin/roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Role created successfully',
  })
  async create(@Body() createDto: CreateRoleDto): Promise<any> {
    return this.roleService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all roles' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'roleType', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of roles',
  })
  async findAll(@Query() filters: any): Promise<any[]> {
    return this.roleService.findAll(filters);
  }

  @Get('hierarchy')
  @ApiOperation({ summary: 'Get role hierarchy' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Role hierarchy',
  })
  async getHierarchy(): Promise<any[]> {
    return this.roleService.getHierarchy();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get role by ID' })
  @ApiParam({ name: 'id', description: 'Role ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Role details',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Role not found' })
  async findOne(@Param('id') id: string): Promise<any> {
    return this.roleService.findOne(id);
  }

  @Get('code/:code')
  @ApiOperation({ summary: 'Get role by code' })
  @ApiParam({ name: 'code', description: 'Role code' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Role details',
  })
  async findByCode(@Param('code') code: string): Promise<any> {
    return this.roleService.findByCode(code);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update role' })
  @ApiParam({ name: 'id', description: 'Role ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Role updated successfully',
  })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateRoleDto,
  ): Promise<any> {
    return this.roleService.update(id, updateDto);
  }

  @Patch(':id/assign-permissions')
  @ApiOperation({ summary: 'Assign permissions to role' })
  @ApiParam({ name: 'id', description: 'Role ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Permissions assigned successfully',
  })
  async assignPermissions(
    @Param('id') id: string,
    @Body() body: { permissionIds: string[] },
  ): Promise<any> {
    return this.roleService.assignPermissions(id, body.permissionIds);
  }

  @Patch(':id/revoke-permissions')
  @ApiOperation({ summary: 'Revoke permissions from role' })
  @ApiParam({ name: 'id', description: 'Role ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Permissions revoked successfully',
  })
  async revokePermissions(
    @Param('id') id: string,
    @Body() body: { permissionIds: string[] },
  ): Promise<any> {
    return this.roleService.revokePermissions(id, body.permissionIds);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete role' })
  @ApiParam({ name: 'id', description: 'Role ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Role deleted successfully',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.roleService.remove(id);
  }
}
