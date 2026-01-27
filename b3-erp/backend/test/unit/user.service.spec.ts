import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UserService } from '../../src/modules/it-admin/services/user.service';
import { User } from '../../src/modules/it-admin/entities/user.entity';
import { PasswordHistoryService } from '../../src/modules/it-admin/services/password-history.service';
import { AuditLogService } from '../../src/modules/it-admin/services/audit-log.service';
import { UserRoleService } from '../../src/modules/it-admin/services/user-role.service';
import { createMockRepository, createMockService } from '../utils/test-setup';
import { UserFactory, UserStatus } from '../factories/user.factory';
import { AuditLog } from '../../src/modules/it-admin/entities/audit-log.entity';
import { PasswordHistory } from '../../src/modules/it-admin/entities/password-history.entity';
import { UserRole } from '../../src/modules/it-admin/entities/user-role.entity';

describe('UserService', () => {
  let service: UserService;
  let mockRepository: ReturnType<typeof createMockRepository>;
  let mockPasswordHistoryService: jest.Mocked<PasswordHistoryService>;
  let mockAuditLogService: jest.Mocked<AuditLogService>;
  let mockUserRoleService: jest.Mocked<UserRoleService>;

  beforeEach(async () => {
    mockRepository = createMockRepository<User>();
    mockPasswordHistoryService = createMockService<PasswordHistoryService>([
      'createHistory',
      'canUsePassword',
    ]);
    mockAuditLogService = createMockService<AuditLogService>(['log']);
    mockUserRoleService = createMockService<UserRoleService>(['assignRoles']);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
        {
          provide: PasswordHistoryService,
          useValue: mockPasswordHistoryService,
        },
        {
          provide: AuditLogService,
          useValue: mockAuditLogService,
        },
        {
          provide: UserRoleService,
          useValue: mockUserRoleService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    UserFactory.resetCounter();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user successfully', async () => {
      const createDto = UserFactory.createDto();
      const expectedUser = UserFactory.create({
        username: createDto.username,
        email: createDto.email,
      });

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(expectedUser as any);
      mockRepository.save.mockResolvedValue(expectedUser as any);
      mockPasswordHistoryService.createHistory.mockResolvedValue({} as PasswordHistory);
      mockAuditLogService.log.mockResolvedValue({} as AuditLog);

      const result = await service.create(createDto as any);

      expect(mockRepository.findOne).toHaveBeenCalled();
      expect(mockRepository.create).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalled();
      expect(mockPasswordHistoryService.createHistory).toHaveBeenCalled();
      expect(mockAuditLogService.log).toHaveBeenCalled();
      expect(result).toEqual(expectedUser);
    });

    it('should throw ConflictException if username already exists', async () => {
      const createDto = UserFactory.createDto();
      const existingUser = UserFactory.create({ username: createDto.username });

      mockRepository.findOne.mockResolvedValue(existingUser as any);

      await expect(service.create(createDto as any)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.create(createDto as any)).rejects.toThrow(
        'Username already exists',
      );
    });

    it('should throw ConflictException if email already exists', async () => {
      const createDto = UserFactory.createDto();
      const existingUser = UserFactory.create({
        username: 'different',
        email: createDto.email,
      });

      mockRepository.findOne.mockResolvedValue(existingUser as any);

      await expect(service.create(createDto as any)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should assign roles if roleIds provided', async () => {
      const createDto = UserFactory.createDto({ roleIds: ['role-1', 'role-2'] });
      const expectedUser = UserFactory.create();

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(expectedUser as any);
      mockRepository.save.mockResolvedValue(expectedUser as any);
      mockPasswordHistoryService.createHistory.mockResolvedValue({} as PasswordHistory);
      mockUserRoleService.assignRoles.mockResolvedValue([] as UserRole[]);
      mockAuditLogService.log.mockResolvedValue({} as AuditLog);

      await service.create(createDto as any);

      expect(mockUserRoleService.assignRoles).toHaveBeenCalledWith(
        expectedUser.id,
        createDto.roleIds,
        undefined,
      );
    });
  });

  describe('findAll', () => {
    it('should return all users without filters', async () => {
      const users = UserFactory.createMany(3);
      const mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(users),
      };
      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder as any);

      const result = await service.findAll();

      expect(result).toEqual(users);
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('user.fullName', 'ASC');
    });

    it('should filter users by status', async () => {
      const activeUsers = UserFactory.createMany(2, { status: UserStatus.ACTIVE });
      const mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(activeUsers),
      };
      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder as any);

      const result = await service.findAll({ status: UserStatus.ACTIVE });

      expect(result).toEqual(activeUsers);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'user.status = :status',
        { status: UserStatus.ACTIVE },
      );
    });

    it('should filter users by search term', async () => {
      const users = [UserFactory.create({ fullName: 'John Doe' })];
      const mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(users),
      };
      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder as any);

      const result = await service.findAll({ search: 'John' });

      expect(result).toEqual(users);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const user = UserFactory.create();
      mockRepository.findOne.mockResolvedValue(user as any);

      const result = await service.findOne(user.id);

      expect(result).toEqual(user);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: user.id },
        relations: ['userRoles', 'userRoles.role'],
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByUsername', () => {
    it('should return a user by username', async () => {
      const user = UserFactory.create();
      const mockQueryBuilder = {
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(user),
      };
      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder as any);

      const result = await service.findByUsername(user.username);

      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if username not found', async () => {
      const mockQueryBuilder = {
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      };
      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder as any);

      await expect(service.findByUsername('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a user successfully', async () => {
      const user = UserFactory.create();
      const updateDto = { firstName: 'Updated', lastName: 'Name' };
      const updatedUser = { ...user, ...updateDto, fullName: 'Updated Name' };

      mockRepository.findOne.mockResolvedValue(user as any);
      mockRepository.save.mockResolvedValue(updatedUser as any);
      mockAuditLogService.log.mockResolvedValue({} as AuditLog);

      const result = await service.update(user.id, updateDto as any);

      expect(result.firstName).toBe('Updated');
      expect(mockRepository.save).toHaveBeenCalled();
      expect(mockAuditLogService.log).toHaveBeenCalled();
    });

    it('should throw ConflictException if email already exists', async () => {
      const user = UserFactory.create({ email: 'original@example.com' });
      const existingUser = UserFactory.create({ email: 'taken@example.com' });
      const updateDto = { email: 'taken@example.com' };

      mockRepository.findOne
        .mockResolvedValueOnce(user as any)
        .mockResolvedValueOnce(existingUser as any);

      await expect(service.update(user.id, updateDto as any)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('activate', () => {
    it('should activate a user', async () => {
      const user = UserFactory.createInactive();
      const activatedUser = { ...user, status: UserStatus.ACTIVE };

      mockRepository.findOne.mockResolvedValue(user as any);
      mockRepository.save.mockResolvedValue(activatedUser as any);
      mockAuditLogService.log.mockResolvedValue({} as AuditLog);

      const result = await service.activate(user.id, 'admin');

      expect(result.status).toBe(UserStatus.ACTIVE);
      expect(mockAuditLogService.log).toHaveBeenCalled();
    });
  });

  describe('deactivate', () => {
    it('should deactivate a user with reason', async () => {
      const user = UserFactory.create();
      const reason = 'User resigned';
      const deactivatedUser = {
        ...user,
        status: UserStatus.INACTIVE,
        deactivationReason: reason,
      };

      mockRepository.findOne.mockResolvedValue(user as any);
      mockRepository.save.mockResolvedValue(deactivatedUser as any);
      mockAuditLogService.log.mockResolvedValue({} as AuditLog);

      const result = await service.deactivate(user.id, reason, 'admin');

      expect(result.status).toBe(UserStatus.INACTIVE);
      expect(result.deactivationReason).toBe(reason);
    });
  });

  describe('unlock', () => {
    it('should unlock a locked user', async () => {
      const user = UserFactory.createLocked();
      const unlockedUser = {
        ...user,
        status: UserStatus.ACTIVE,
        failedLoginAttempts: 0,
        lockedUntil: null,
      };

      mockRepository.findOne.mockResolvedValue(user as any);
      mockRepository.save.mockResolvedValue(unlockedUser as any);
      mockAuditLogService.log.mockResolvedValue({} as AuditLog);

      const result = await service.unlock(user.id, 'admin');

      expect(result.status).toBe(UserStatus.ACTIVE);
      expect(result.failedLoginAttempts).toBe(0);
      expect(result.lockedUntil).toBeNull();
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const user = UserFactory.create();
      mockRepository.findOne.mockResolvedValue(user as any);
      mockRepository.remove.mockResolvedValue(user as any);

      await service.remove(user.id);

      expect(mockRepository.remove).toHaveBeenCalledWith(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
