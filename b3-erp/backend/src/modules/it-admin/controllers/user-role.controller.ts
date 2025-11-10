import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { UserRoleService } from '../services/user-role.service';
import { AssignRoleDto } from '../dto/assign-permission.dto';

@ApiTags('IT Admin - User Roles')
@Controller('it-admin/user-roles')
export class UserRoleController {
  constructor(private readonly userRoleService: UserRoleService) {}

  @Post('assign')
  @ApiOperation({ summary: 'Assign roles to user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Roles assigned successfully',
  })
  async assignRoles(@Body() assignRoleDto: AssignRoleDto): Promise<any> {
    return this.userRoleService.assignRoles(
      assignRoleDto.userId,
      assignRoleDto.roleIds,
      undefined,
      assignRoleDto.primaryRoleId,
    );
  }

  @Post('revoke')
  @ApiOperation({ summary: 'Revoke roles from user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Roles revoked successfully',
  })
  async revokeRoles(
    @Body() body: { userId: string; roleIds: string[]; reason?: string },
  ): Promise<any> {
    await this.userRoleService.revokeRoles(body.userId, body.roleIds, undefined, body.reason);
    return { message: 'Roles revoked successfully' };
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get roles by user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of user roles',
  })
  async getRolesByUser(@Param('userId') userId: string): Promise<any[]> {
    return this.userRoleService.getRolesByUser(userId);
  }

  @Get('user/:userId/primary')
  @ApiOperation({ summary: 'Get primary role for user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Primary role',
  })
  async getPrimaryRole(@Param('userId') userId: string): Promise<any> {
    return this.userRoleService.getPrimaryRole(userId);
  }

  @Get('role/:roleId')
  @ApiOperation({ summary: 'Get users by role' })
  @ApiParam({ name: 'roleId', description: 'Role ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of users',
  })
  async getUsersByRole(@Param('roleId') roleId: string): Promise<any[]> {
    return this.userRoleService.getUsersByRole(roleId);
  }

  @Get('check/:userId/:roleId')
  @ApiOperation({ summary: 'Check if user has role' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiParam({ name: 'roleId', description: 'Role ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Role check result',
  })
  async hasRole(
    @Param('userId') userId: string,
    @Param('roleId') roleId: string,
  ): Promise<{ hasRole: boolean }> {
    const hasRole = await this.userRoleService.hasRole(userId, roleId);
    return { hasRole };
  }
}
