import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { RolePermission } from './entities/role-permission.entity';
import { UserRole } from './entities/user-role.entity';
import { AuditLog } from './entities/audit-log.entity';
import { UserSession } from './entities/user-session.entity';
import { PasswordHistory } from './entities/password-history.entity';
import { SystemConfig } from './entities/system-config.entity';
import { Notification } from './entities/notification.entity';
import { NotificationPreference } from './entities/notification-preference.entity';

// Services
import { UserService } from './services/user.service';
import { RoleService } from './services/role.service';
import { PermissionService } from './services/permission.service';
import { RolePermissionService } from './services/role-permission.service';
import { UserRoleService } from './services/user-role.service';
import { AuditLogService } from './services/audit-log.service';
import { UserSessionService } from './services/user-session.service';
import { PasswordHistoryService } from './services/password-history.service';
import { SystemConfigService } from './services/system-config.service';
import { NotificationService } from './services/notification.service';
import { NotificationPreferenceService } from './services/notification-preference.service';

// Controllers
import { UserController } from './controllers/user.controller';
import { RoleController } from './controllers/role.controller';
import { PermissionController } from './controllers/permission.controller';
import { UserRoleController } from './controllers/user-role.controller';
import { AuditLogController } from './controllers/audit-log.controller';
import { UserSessionController } from './controllers/user-session.controller';
import { SystemConfigController } from './controllers/system-config.controller';
import { NotificationController } from './controllers/notification.controller';
import { NotificationPreferenceController } from './controllers/notification-preference.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Role,
      Permission,
      RolePermission,
      UserRole,
      AuditLog,
      UserSession,
      PasswordHistory,
      SystemConfig,
      Notification,
      NotificationPreference,
    ]),
  ],
  controllers: [
    UserController,
    RoleController,
    PermissionController,
    UserRoleController,
    AuditLogController,
    UserSessionController,
    SystemConfigController,
    NotificationController,
    NotificationPreferenceController,
  ],
  providers: [
    UserService,
    RoleService,
    PermissionService,
    RolePermissionService,
    UserRoleService,
    AuditLogService,
    UserSessionService,
    PasswordHistoryService,
    SystemConfigService,
    NotificationService,
    NotificationPreferenceService,
  ],
  exports: [
    UserService,
    RoleService,
    PermissionService,
    RolePermissionService,
    UserRoleService,
    AuditLogService,
    UserSessionService,
    PasswordHistoryService,
    SystemConfigService,
    NotificationService,
    NotificationPreferenceService,
  ],
})
export class ItAdminModule {}
