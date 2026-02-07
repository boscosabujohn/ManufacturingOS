import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { UserService } from '../../modules/it-admin/services/user.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private userService: UserService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredPermissions) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();
        if (!user) {
            return false;
        }

        // Fetch user with roles and permissions
        const userWithPermissions = await this.userService.findOne(user.id);
        if (!userWithPermissions) {
            return false;
        }

        // Extract all permission codes from user roles
        const userPermissions = new Set<string>();
        if (userWithPermissions.userRoles) {
            userWithPermissions.userRoles.forEach((userRole: any) => {
                if (userRole.role && userRole.role.rolePermissions) {
                    userRole.role.rolePermissions.forEach((rolePermission: any) => {
                        if (rolePermission.permission) {
                            userPermissions.add(rolePermission.permission.code);
                        }
                    });
                }
            });
        }

        // Super Admin or System Admin check
        const isSuperAdmin = Array.from(userPermissions).some(p => p === 'SUPER_ADMIN' || p === '*');
        if (isSuperAdmin || userWithPermissions.isSystemAdmin) {
            return true;
        }

        const hasPermission = requiredPermissions.every((permission) => userPermissions.has(permission));

        if (!hasPermission) {
            throw new ForbiddenException('Insufficient permissions');
        }

        return true;
    }
}
