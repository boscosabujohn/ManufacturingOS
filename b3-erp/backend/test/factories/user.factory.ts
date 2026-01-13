import { generateTestId } from '../utils/test-setup';

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  LOCKED = 'locked',
  PENDING = 'pending',
}

export enum UserType {
  INTERNAL = 'internal',
  EXTERNAL = 'external',
  SYSTEM = 'system',
}

export interface MockUser {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  fullName: string;
  userType: UserType;
  status: UserStatus;
  department?: string;
  designation?: string;
  phone?: string;
  mobile?: string;
  employeeId?: string;
  profileImageUrl?: string;
  mustChangePassword: boolean;
  passwordChangedAt: Date;
  failedLoginAttempts: number;
  lockedUntil: Date | null;
  lastLoginAt: Date | null;
  activatedAt: Date | null;
  activatedBy: string | null;
  deactivatedAt: Date | null;
  deactivatedBy: string | null;
  deactivationReason: string | null;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string | null;
  updatedBy: string | null;
}

export interface CreateUserDtoMock {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  userType?: UserType;
  department?: string;
  designation?: string;
  phone?: string;
  mobile?: string;
  employeeId?: string;
  roleIds?: string[];
}

/**
 * Factory for creating mock User objects
 */
export class UserFactory {
  private static counter = 0;

  /**
   * Create a mock user with default values
   */
  static create(overrides: Partial<MockUser> = {}): MockUser {
    this.counter++;
    const id = overrides.id || generateTestId();
    const firstName = overrides.firstName || `TestFirst${this.counter}`;
    const lastName = overrides.lastName || `TestLast${this.counter}`;

    return {
      id,
      username: `testuser${this.counter}`,
      email: `testuser${this.counter}@example.com`,
      passwordHash: '$2b$10$hashedpassword123456789012345678901234567890',
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      userType: UserType.INTERNAL,
      status: UserStatus.ACTIVE,
      department: 'IT',
      designation: 'Developer',
      phone: '123-456-7890',
      mobile: '098-765-4321',
      employeeId: `EMP${this.counter.toString().padStart(4, '0')}`,
      profileImageUrl: null,
      mustChangePassword: false,
      passwordChangedAt: new Date(),
      failedLoginAttempts: 0,
      lockedUntil: null,
      lastLoginAt: null,
      activatedAt: new Date(),
      activatedBy: 'system',
      deactivatedAt: null,
      deactivatedBy: null,
      deactivationReason: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'system',
      updatedBy: null,
      ...overrides,
    };
  }

  /**
   * Create a mock CreateUserDto
   */
  static createDto(overrides: Partial<CreateUserDtoMock> = {}): CreateUserDtoMock {
    this.counter++;
    return {
      username: `newuser${this.counter}`,
      email: `newuser${this.counter}@example.com`,
      password: 'SecurePassword123!',
      firstName: `NewFirst${this.counter}`,
      lastName: `NewLast${this.counter}`,
      userType: UserType.INTERNAL,
      department: 'Sales',
      designation: 'Manager',
      ...overrides,
    };
  }

  /**
   * Create multiple mock users
   */
  static createMany(count: number, overrides: Partial<MockUser> = {}): MockUser[] {
    return Array.from({ length: count }, () => this.create(overrides));
  }

  /**
   * Create an admin user
   */
  static createAdmin(overrides: Partial<MockUser> = {}): MockUser {
    return this.create({
      username: 'admin',
      email: 'admin@example.com',
      userType: UserType.INTERNAL,
      department: 'Administration',
      designation: 'System Administrator',
      ...overrides,
    });
  }

  /**
   * Create an inactive user
   */
  static createInactive(overrides: Partial<MockUser> = {}): MockUser {
    return this.create({
      status: UserStatus.INACTIVE,
      deactivatedAt: new Date(),
      deactivatedBy: 'admin',
      deactivationReason: 'Account no longer needed',
      ...overrides,
    });
  }

  /**
   * Create a locked user
   */
  static createLocked(overrides: Partial<MockUser> = {}): MockUser {
    const lockedUntil = new Date();
    lockedUntil.setMinutes(lockedUntil.getMinutes() + 30);

    return this.create({
      status: UserStatus.LOCKED,
      failedLoginAttempts: 5,
      lockedUntil,
      ...overrides,
    });
  }

  /**
   * Reset the counter (useful for test isolation)
   */
  static resetCounter(): void {
    this.counter = 0;
  }
}
