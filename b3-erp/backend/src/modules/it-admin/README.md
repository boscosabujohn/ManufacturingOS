# IT Admin Module

Comprehensive IT Administration module for the Manufacturing ERP system, providing user management, role-based access control (RBAC), audit logging, session management, and system configuration.

## Overview

The IT Admin module is a production-ready, enterprise-grade system administration module that provides:

- **User Management**: Complete user lifecycle management with authentication and authorization
- **Role-Based Access Control (RBAC)**: Hierarchical roles with granular permissions
- **Audit Trail**: Comprehensive logging of all system activities
- **Session Management**: Active session tracking with force logout capabilities
- **Password Security**: Password history, policy enforcement, and secure hashing
- **System Configuration**: Dynamic system settings management
- **Notifications**: User notification system with preferences
- **Security Features**: 2FA support, account locking, password reset, IP tracking

## Module Structure

```
it-admin/
├── entities/              # 11 TypeORM entities
│   ├── user.entity.ts
│   ├── role.entity.ts
│   ├── permission.entity.ts
│   ├── role-permission.entity.ts
│   ├── user-role.entity.ts
│   ├── audit-log.entity.ts
│   ├── user-session.entity.ts
│   ├── password-history.entity.ts
│   ├── system-config.entity.ts
│   ├── notification.entity.ts
│   └── notification-preference.entity.ts
├── dto/                   # 16 DTOs with validation
├── services/              # 11 business logic services
├── controllers/           # 9 REST API controllers
└── it-admin.module.ts     # Module configuration
```

## Entities

### 1. User
**Purpose**: System users with authentication details

**Key Features**:
- Unique username and email
- Password hashing with bcrypt
- User types (Internal, External, System, API)
- Status management (Active, Inactive, Suspended, Locked, Pending)
- Failed login tracking
- Account locking mechanism
- Password expiry and mandatory change
- Email verification
- 2FA support with backup codes
- Last login tracking

**Status Flow**:
```
Pending Activation → Active ↔ Suspended
                            ↓
                        Inactive
                            ↓
                         Locked
```

### 2. Role
**Purpose**: User roles with hierarchical structure

**Key Features**:
- Hierarchical role structure (parent-child relationships)
- Role types (System, Custom, Department, Project)
- Hierarchy levels for role precedence
- Data access restrictions
- Time-based access control
- IP whitelisting
- Session timeout per role

**Role Types**:
- **System**: Built-in roles (cannot be modified)
- **Custom**: User-defined roles
- **Department**: Department-specific roles
- **Project**: Project-specific roles

### 3. Permission
**Purpose**: System permissions (module.action format)

**Key Features**:
- Module-based organization (e.g., 'inventory.view', 'sales.create')
- Actions: view, create, update, delete, approve, export, etc.
- Permission types (System, Custom, Module, API)
- Permission dependencies
- Conflict detection
- API endpoint mapping
- Data scope constraints (all, department, own)

**Permission Format**: `{module}.{action}`
- Examples: `inventory.view`, `sales.create`, `hr.approve`, `reports.export`

### 4. RolePermission
**Purpose**: Mapping between roles and permissions

**Key Features**:
- Grant/revoke tracking
- Expiration dates
- Time-based restrictions
- Constraint overrides
- Audit trail

### 5. UserRole
**Purpose**: Multiple role assignment per user

**Key Features**:
- Multiple roles per user
- Primary role designation
- Effective date ranges
- Role status (Active, Inactive, Suspended, Expired)
- Assignment and revocation tracking
- Approval workflow support

### 6. AuditLog
**Purpose**: Comprehensive audit trail for all system activities

**Key Features**:
- All user actions logged
- Module and action tracking
- Entity change tracking (before/after values)
- IP address and user agent logging
- Request/response tracking
- Error logging
- Severity levels (Low, Medium, High, Critical)
- Geolocation support

**Audit Actions**:
- Create, Update, Delete, View
- Login, Logout, Login Failed
- Password Change, Password Reset
- Activate, Deactivate, Suspend, Unlock
- Export, Import, Approve, Reject, Submit, Cancel

### 7. UserSession
**Purpose**: Active user session management

**Key Features**:
- Session token management
- Refresh token support
- Session expiry
- Device and browser tracking
- IP address logging
- Geolocation tracking
- Activity tracking
- Force logout capability
- Session statistics

**Session Status**:
- Active, Expired, Terminated, Logged Out

### 8. PasswordHistory
**Purpose**: Password change history for security

**Key Features**:
- Historical password storage
- Password reuse prevention (last N passwords)
- Change reason tracking
- IP address logging
- Temporary password support

**Change Reasons**:
- User Initiated, Admin Reset
- Password Expired, Security Policy
- Compromised, First Login

### 9. SystemConfig
**Purpose**: Dynamic system configuration parameters

**Key Features**:
- Category-based organization
- Data type validation (String, Number, Boolean, JSON, Array, Date, Encrypted)
- Default values
- Validation rules (regex, allowed values)
- Edit protection for critical configs
- Restart requirement flags
- Environment-specific settings

**Categories**:
- System, Security, Email, Notification
- Authentication, API, Integration
- Feature Flag, Business Rule, Custom

### 10. Notification
**Purpose**: User notifications system

**Key Features**:
- Notification types (Info, Success, Warning, Error, Alert, Reminder, System)
- Priority levels (Low, Medium, High, Urgent)
- Multiple delivery channels (In-App, Email, SMS, Push, Webhook)
- Read/unread tracking
- Archive functionality
- Pin important notifications
- Action URLs and buttons
- Scheduled notifications
- Expiry dates
- Acknowledgment tracking

### 11. NotificationPreference
**Purpose**: User notification preferences per category

**Key Features**:
- Per-category preferences
- Channel selection
- Frequency control (Realtime, Hourly, Daily, Weekly, Custom)
- Quiet hours
- Muted types
- Priority filtering
- Digest settings
- Sound and vibration settings

## API Endpoints

### User Management
```
POST   /it-admin/users                    # Create user
GET    /it-admin/users                    # List all users
GET    /it-admin/users/:id                # Get user by ID
GET    /it-admin/users/username/:username # Get user by username
GET    /it-admin/users/email/:email       # Get user by email
PUT    /it-admin/users/:id                # Update user
PATCH  /it-admin/users/:id/change-password # Change password
PATCH  /it-admin/users/:id/reset-password  # Reset password (Admin)
PATCH  /it-admin/users/:id/activate       # Activate user
PATCH  /it-admin/users/:id/deactivate     # Deactivate user
PATCH  /it-admin/users/:id/suspend        # Suspend user
PATCH  /it-admin/users/:id/unlock         # Unlock user account
DELETE /it-admin/users/:id                # Delete user
```

### Role Management
```
POST   /it-admin/roles                         # Create role
GET    /it-admin/roles                         # List all roles
GET    /it-admin/roles/hierarchy               # Get role hierarchy
GET    /it-admin/roles/:id                     # Get role by ID
GET    /it-admin/roles/code/:code              # Get role by code
PUT    /it-admin/roles/:id                     # Update role
PATCH  /it-admin/roles/:id/assign-permissions  # Assign permissions
PATCH  /it-admin/roles/:id/revoke-permissions  # Revoke permissions
DELETE /it-admin/roles/:id                     # Delete role
```

### Permission Management
```
POST   /it-admin/permissions                 # Create permission
POST   /it-admin/permissions/bulk            # Bulk create permissions
GET    /it-admin/permissions                 # List all permissions
GET    /it-admin/permissions/modules         # Get all modules
GET    /it-admin/permissions/actions         # Get all actions
GET    /it-admin/permissions/module/:module  # Get permissions by module
GET    /it-admin/permissions/:id             # Get permission by ID
GET    /it-admin/permissions/code/:code      # Get permission by code
PUT    /it-admin/permissions/:id             # Update permission
DELETE /it-admin/permissions/:id             # Delete permission
```

### User-Role Assignment
```
POST /it-admin/user-roles/assign              # Assign roles to user
POST /it-admin/user-roles/revoke              # Revoke roles from user
GET  /it-admin/user-roles/user/:userId        # Get user's roles
GET  /it-admin/user-roles/user/:userId/primary # Get primary role
GET  /it-admin/user-roles/role/:roleId        # Get users by role
GET  /it-admin/user-roles/check/:userId/:roleId # Check if user has role
```

### Audit Logs
```
POST /it-admin/audit-logs                           # Create audit log
GET  /it-admin/audit-logs                           # Get audit logs (filtered)
GET  /it-admin/audit-logs/user/:userId              # Get user activity
GET  /it-admin/audit-logs/user/:userId/logins       # Get login history
GET  /it-admin/audit-logs/module/:module            # Get module activity
GET  /it-admin/audit-logs/entity/:type/:id          # Get entity history
GET  /it-admin/audit-logs/statistics                # Get audit statistics
```

### Session Management
```
POST   /it-admin/sessions                         # Create session
GET    /it-admin/sessions/token/:token            # Get session by token
GET    /it-admin/sessions/user/:userId            # Get active sessions
PATCH  /it-admin/sessions/:id/activity            # Update activity
POST   /it-admin/sessions/logout                  # Logout by token
DELETE /it-admin/sessions/:id                     # Logout session
POST   /it-admin/sessions/:id/terminate           # Terminate session (force)
POST   /it-admin/sessions/user/:userId/terminate-all # Terminate all user sessions
POST   /it-admin/sessions/cleanup                 # Clean expired sessions
GET    /it-admin/sessions/statistics/:userId?     # Session statistics
```

### System Configuration
```
POST  /it-admin/system-config                    # Create config
GET   /it-admin/system-config                    # List all configs
GET   /it-admin/system-config/category/:category # Get by category
GET   /it-admin/system-config/module/:module     # Get by module
GET   /it-admin/system-config/:id                # Get config by ID
GET   /it-admin/system-config/key/:key           # Get config by key
GET   /it-admin/system-config/value/:key         # Get config value
PATCH /it-admin/system-config/value/:key         # Set config value
PUT   /it-admin/system-config/:id                # Update config
DELETE /it-admin/system-config/:id               # Delete config
```

### Notifications
```
POST   /it-admin/notifications                          # Create notification(s)
GET    /it-admin/notifications/user/:userId             # Get user notifications
GET    /it-admin/notifications/:id/user/:userId         # Get notification by ID
PATCH  /it-admin/notifications/:id/read                 # Mark as read
PATCH  /it-admin/notifications/:id/unread               # Mark as unread
PATCH  /it-admin/notifications/user/:userId/read-all    # Mark all as read
PATCH  /it-admin/notifications/:id/archive              # Archive notification
PATCH  /it-admin/notifications/:id/unarchive            # Unarchive notification
PATCH  /it-admin/notifications/:id/pin                  # Pin notification
PATCH  /it-admin/notifications/:id/unpin                # Unpin notification
POST   /it-admin/notifications/bulk-delete              # Bulk delete
GET    /it-admin/notifications/user/:userId/unread-count # Get unread count
DELETE /it-admin/notifications/:id/user/:userId         # Delete notification
```

### Notification Preferences
```
POST   /it-admin/notification-preferences                      # Create preference
GET    /it-admin/notification-preferences/user/:userId         # Get all preferences
GET    /it-admin/notification-preferences/user/:userId/category/:category # Get by category
PUT    /it-admin/notification-preferences/user/:userId/category/:category # Update preference
POST   /it-admin/notification-preferences/user/:userId/category/:category/upsert # Upsert
GET    /it-admin/notification-preferences/user/:userId/category/:category/enabled # Check enabled
DELETE /it-admin/notification-preferences/user/:userId/category/:category # Delete preference
```

## Security Features

### Password Security
- **Hashing**: bcrypt with salt rounds
- **History**: Prevents reuse of last N passwords (configurable)
- **Policy Enforcement**:
  - Minimum length
  - Complexity requirements (uppercase, lowercase, numbers, special chars)
  - Expiry period
  - Mandatory change on first login

### Account Security
- **Failed Login Tracking**: Automatic account locking after N failed attempts
- **Session Management**: Token-based sessions with expiry
- **2FA Support**: Two-factor authentication with backup codes
- **IP Tracking**: Login IP address logging
- **Geolocation**: Optional location tracking

### Access Control
- **RBAC**: Role-Based Access Control with hierarchical roles
- **Granular Permissions**: Module.action based permissions
- **Data Scoping**: Restrict data access (all, department, own)
- **Time-Based Access**: Schedule access windows
- **IP Whitelisting**: Restrict access by IP address

### Audit & Compliance
- **Comprehensive Logging**: All actions logged with before/after values
- **Searchable Audit Trail**: Query by user, module, action, entity, date range
- **Severity Levels**: Categorize events by severity
- **Retention Policies**: Configurable log retention

## Usage Examples

### Creating a User
```typescript
const user = await userService.create({
  username: 'john.doe',
  email: 'john.doe@company.com',
  password: 'SecureP@ss123',
  firstName: 'John',
  lastName: 'Doe',
  department: 'IT',
  designation: 'Developer',
  roleIds: ['role-id-1', 'role-id-2']
}, 'admin-user-id');
```

### Assigning Permissions to Role
```typescript
await roleService.assignPermissions(
  'role-id',
  ['permission-id-1', 'permission-id-2', 'permission-id-3'],
  'admin-user-id'
);
```

### Logging Audit Trail
```typescript
await auditLogService.log({
  userId: 'user-id',
  username: 'john.doe',
  module: 'inventory',
  action: 'CREATE',
  description: 'Created new product',
  entityType: 'Product',
  entityId: 'product-id',
  entityName: 'Product ABC',
  ipAddress: '192.168.1.1',
  oldValues: null,
  newValues: { name: 'Product ABC', price: 100 }
});
```

### Managing Sessions
```typescript
// Create session on login
const session = await sessionService.createSession(
  userId,
  ipAddress,
  userAgent,
  1440 // 24 hours
);

// Terminate all user sessions (force logout)
await sessionService.terminateAllUserSessions(
  userId,
  'admin-id',
  'Security policy violation'
);
```

### System Configuration
```typescript
// Set a config value
await configService.setValue(
  'password.min_length',
  '12',
  'admin-id'
);

// Get a config value
const minLength = await configService.getValue('password.min_length', 8);
```

### Sending Notifications
```typescript
await notificationService.create({
  userIds: ['user-1', 'user-2', 'user-3'],
  type: NotificationType.INFO,
  priority: NotificationPriority.HIGH,
  title: 'System Maintenance',
  message: 'System will be down for maintenance at 2 AM',
  category: 'system',
  channels: [NotificationChannel.IN_APP, NotificationChannel.EMAIL]
}, 'system');
```

## Database Schema

All entities use UUID primary keys and include:
- `createdAt`: Timestamp
- `updatedAt`: Timestamp
- `createdBy`: User ID
- `updatedBy`: User ID

Indexes are created on:
- Primary keys
- Unique fields (username, email, codes)
- Foreign keys
- Frequently queried fields (status, dates)
- Composite keys for many-to-many relationships

## Best Practices

1. **Password Management**
   - Always hash passwords before storage
   - Enforce strong password policies
   - Implement password history to prevent reuse
   - Require password change on first login

2. **Session Management**
   - Set appropriate session timeouts
   - Clean up expired sessions regularly
   - Track session activity for security monitoring
   - Implement force logout for security incidents

3. **Audit Logging**
   - Log all critical operations
   - Include before/after values for changes
   - Capture IP address and user agent
   - Use appropriate severity levels

4. **Role-Based Access Control**
   - Follow principle of least privilege
   - Use hierarchical roles for inheritance
   - Regular audit of role assignments
   - Document role purposes and permissions

5. **Notification System**
   - Respect user preferences
   - Don't spam users with notifications
   - Use appropriate priority levels
   - Set expiry dates for time-sensitive notifications

## Error Handling

All services use NestJS standard exceptions:
- `NotFoundException`: Entity not found
- `ConflictException`: Duplicate entries
- `BadRequestException`: Invalid input or business rule violation
- `UnauthorizedException`: Authentication failures

## Export & Integration

The module exports all services for use in other modules:
- UserService
- RoleService
- PermissionService
- AuditLogService
- SessionService
- And more...

Import the ItAdminModule in your app module or any feature module to use these services.

## Performance Considerations

1. **Indexing**: All frequently queried fields are indexed
2. **Pagination**: Audit logs and notifications support pagination
3. **Lazy Loading**: Relations are not loaded by default
4. **Query Optimization**: Use QueryBuilder for complex queries
5. **Caching**: Consider implementing Redis caching for sessions and configs

## Future Enhancements

- [ ] OAuth 2.0 / SAML integration
- [ ] Advanced 2FA methods (TOTP, hardware keys)
- [ ] Role templates and cloning
- [ ] Permission groups
- [ ] Advanced reporting dashboard
- [ ] Real-time notifications via WebSocket
- [ ] Email notification templates
- [ ] SMS integration
- [ ] Mobile app support
- [ ] API rate limiting per role
- [ ] Advanced audit analytics

## License

Proprietary - B3 MACBIS ERP System

## Support

For issues or questions, contact the development team.
