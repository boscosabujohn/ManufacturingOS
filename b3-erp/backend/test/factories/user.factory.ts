import { DataSource } from 'typeorm';
import { User, UserStatus, UserType } from '../../src/modules/it-admin/entities/user.entity';
export { UserStatus, UserType };


export class UserFactory {
  private static counter = 0;

  static create(overrides: Partial<User> = {}): User {
    this.counter++;
    const firstName = overrides.firstName || `TestFirst${this.counter}`;
    const lastName = overrides.lastName || `TestLast${this.counter}`;

    const user = new User();
    user.username = overrides.username || `testuser${this.counter}`;
    user.email = overrides.email || `testuser${this.counter}@example.com`;
    user.passwordHash = overrides.passwordHash || '$2b$10$hashedpassword123456789012345678901234567890';
    user.firstName = firstName;
    user.lastName = lastName;
    user.fullName = `${firstName} ${lastName}`;
    user.userType = overrides.userType || UserType.INTERNAL;
    user.status = overrides.status || UserStatus.ACTIVE;
    user.department = overrides.department || 'IT';
    user.designation = overrides.designation || 'Developer';
    user.phoneNumber = overrides.phoneNumber || '123-456-7890';
    user.employeeId = overrides.employeeId || `EMP${this.counter.toString().padStart(4, '0')}`;
    user.isSystemAdmin = overrides.isSystemAdmin || false;
    user.mustChangePassword = overrides.mustChangePassword || false;
    user.isEmailVerified = overrides.isEmailVerified || true;
    user.twoFactorEnabled = overrides.twoFactorEnabled || false;

    return Object.assign(user, overrides);
  }

  static createDto(overrides: any = {}): any {
    this.counter++;
    return {
      username: overrides.username || `newuser${this.counter}`,
      email: overrides.email || `newuser${this.counter}@example.com`,
      password: overrides.password || 'SecurePassword123!',
      firstName: overrides.firstName || `NewFirst${this.counter}`,
      lastName: overrides.lastName || `NewLast${this.counter}`,
      userType: UserType.INTERNAL,
      department: 'Sales',
      designation: 'Manager',
      ...overrides,
    };
  }

  static createMany(count: number, overrides: Partial<User> = {}): User[] {
    return Array.from({ length: count }, () => this.create(overrides));
  }

  static createAdmin(overrides: Partial<User> = {}): User {
    return this.create({
      username: 'admin',
      email: 'admin@example.com',
      userType: UserType.INTERNAL,
      isSystemAdmin: true,
      ...overrides,
    });
  }

  static createInactive(overrides: Partial<User> = {}): User {
    return this.create({
      status: UserStatus.INACTIVE,
      ...overrides,
    });
  }

  static createLocked(overrides: Partial<User> = {}): User {
    const lockedUntil = new Date();
    lockedUntil.setMinutes(lockedUntil.getMinutes() + 30);
    return this.create({
      status: UserStatus.LOCKED,
      failedLoginAttempts: 5,
      lockedUntil,
      ...overrides,
    });
  }

  static async persist(dataSource: DataSource, overrides: Partial<User> = {}): Promise<User> {
    const user = this.create(overrides);
    const repository = dataSource.getRepository(User);
    return await repository.save(user);
  }

  static async persistMany(dataSource: DataSource, count: number, overrides: Partial<User> = {}): Promise<User[]> {
    const users = Array.from({ length: count }, () => this.create(overrides));
    const repository = dataSource.getRepository(User);
    return await repository.save(users);
  }

  static resetCounter(): void {
    this.counter = 0;
  }
}
