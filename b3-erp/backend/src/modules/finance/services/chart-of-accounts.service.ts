import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChartOfAccounts } from '../entities/chart-of-accounts.entity';
import {
  CreateChartOfAccountsDto,
  UpdateChartOfAccountsDto,
  ChartOfAccountsResponseDto,
} from '../dto';

@Injectable()
export class ChartOfAccountsService {
  constructor(
    @InjectRepository(ChartOfAccounts)
    private readonly chartOfAccountsRepository: Repository<ChartOfAccounts>,
  ) {}

  async create(
    createDto: CreateChartOfAccountsDto,
  ): Promise<ChartOfAccountsResponseDto> {
    // Check if account code already exists
    const existing = await this.chartOfAccountsRepository.findOne({
      where: { accountCode: createDto.accountCode },
    });

    if (existing) {
      throw new BadRequestException(
        `Account code ${createDto.accountCode} already exists`,
      );
    }

    // Validate parent account if provided
    if (createDto.parentAccountId) {
      const parent = await this.chartOfAccountsRepository.findOne({
        where: { id: createDto.parentAccountId },
      });

      if (!parent) {
        throw new NotFoundException('Parent account not found');
      }

      // Set level based on parent
      createDto.level = (parent.level || 0) + 1;
    }

    const account = this.chartOfAccountsRepository.create({
      ...createDto,
      currentBalance: createDto.openingBalance || 0,
      debitTotal: 0,
      creditTotal: 0,
    });

    const savedAccount = await this.chartOfAccountsRepository.save(account);
    return this.mapToResponseDto(savedAccount);
  }

  async findAll(filters?: {
    accountType?: string;
    isActive?: boolean;
    parentId?: string;
  }): Promise<ChartOfAccountsResponseDto[]> {
    const query = this.chartOfAccountsRepository.createQueryBuilder('account');

    if (filters?.accountType) {
      query.andWhere('account.accountType = :accountType', {
        accountType: filters.accountType,
      });
    }

    if (filters?.isActive !== undefined) {
      query.andWhere('account.isActive = :isActive', {
        isActive: filters.isActive,
      });
    }

    if (filters?.parentId) {
      query.andWhere('account.parentAccountId = :parentId', {
        parentId: filters.parentId,
      });
    }

    query.orderBy('account.accountCode', 'ASC');

    const accounts = await query.getMany();
    return accounts.map((account) => this.mapToResponseDto(account));
  }

  async getHierarchy(): Promise<any[]> {
    const accounts = await this.chartOfAccountsRepository.find({
      where: { isActive: true },
      order: { accountCode: 'ASC' },
    });

    const buildTree = (
      parentId: string | null,
      level: number = 0,
    ): any[] => {
      return accounts
        .filter((account) => account.parentAccountId === parentId)
        .map((account) => ({
          ...this.mapToResponseDto(account),
          children: buildTree(account.id, level + 1),
        }));
    };

    return buildTree(null);
  }

  async getByType(accountType: string): Promise<ChartOfAccountsResponseDto[]> {
    const accounts = await this.chartOfAccountsRepository.find({
      where: { accountType: accountType as any, isActive: true },
      order: { accountCode: 'ASC' },
    });

    return accounts.map((account) => this.mapToResponseDto(account));
  }

  async findOne(id: string): Promise<ChartOfAccountsResponseDto> {
    const account = await this.chartOfAccountsRepository.findOne({
      where: { id },
      relations: ['parentAccount', 'children'],
    });

    if (!account) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }

    return this.mapToResponseDto(account);
  }

  async getAccountBalance(
    id: string,
    asOfDate?: string,
  ): Promise<any> {
    const account = await this.findOne(id);

    // In production, this would calculate balance from general ledger
    // For now, return current balance
    return {
      accountId: account.id,
      accountCode: account.accountCode,
      accountName: account.accountName,
      openingBalance: account.openingBalance,
      currentBalance: account.currentBalance,
      debitTotal: account.debitTotal,
      creditTotal: account.creditTotal,
      asOfDate: asOfDate || new Date().toISOString().split('T')[0],
    };
  }

  async getTransactions(
    id: string,
    filters?: {
      startDate?: string;
      endDate?: string;
      limit?: number;
    },
  ): Promise<any> {
    const account = await this.findOne(id);

    // In production, this would fetch from general ledger
    // This is a placeholder for the implementation
    return {
      accountId: account.id,
      accountCode: account.accountCode,
      accountName: account.accountName,
      transactions: [],
      summary: {
        totalDebit: account.debitTotal,
        totalCredit: account.creditTotal,
        netBalance: account.currentBalance,
      },
    };
  }

  async update(
    id: string,
    updateDto: UpdateChartOfAccountsDto,
  ): Promise<ChartOfAccountsResponseDto> {
    const account = await this.chartOfAccountsRepository.findOne({
      where: { id },
    });

    if (!account) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }

    // Check if system account
    if (account.isSystemAccount) {
      throw new BadRequestException('Cannot modify system account');
    }

    // If changing account code, check uniqueness
    if (updateDto.accountCode && updateDto.accountCode !== account.accountCode) {
      const existing = await this.chartOfAccountsRepository.findOne({
        where: { accountCode: updateDto.accountCode },
      });

      if (existing) {
        throw new BadRequestException(
          `Account code ${updateDto.accountCode} already exists`,
        );
      }
    }

    // Validate parent account if being changed
    if (
      updateDto.parentAccountId &&
      updateDto.parentAccountId !== account.parentAccountId
    ) {
      if (updateDto.parentAccountId === id) {
        throw new BadRequestException('Account cannot be its own parent');
      }

      const parent = await this.chartOfAccountsRepository.findOne({
        where: { id: updateDto.parentAccountId },
      });

      if (!parent) {
        throw new NotFoundException('Parent account not found');
      }

      updateDto.level = (parent.level || 0) + 1;
    }

    Object.assign(account, updateDto);
    const updatedAccount = await this.chartOfAccountsRepository.save(account);
    return this.mapToResponseDto(updatedAccount);
  }

  async remove(id: string): Promise<void> {
    const account = await this.chartOfAccountsRepository.findOne({
      where: { id },
      relations: ['children'],
    });

    if (!account) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }

    // Check if system account
    if (account.isSystemAccount) {
      throw new BadRequestException('Cannot delete system account');
    }

    // Check if has children
    if (account.children && account.children.length > 0) {
      throw new BadRequestException(
        'Cannot delete account with child accounts',
      );
    }

    // Check if has transactions (debitTotal or creditTotal > 0)
    if (account.debitTotal > 0 || account.creditTotal > 0) {
      throw new BadRequestException(
        'Cannot delete account with transactions',
      );
    }

    await this.chartOfAccountsRepository.remove(account);
  }

  async reconcileAccount(id: string): Promise<any> {
    const account = await this.chartOfAccountsRepository.findOne({
      where: { id },
    });

    if (!account) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }

    account.lastReconciledDate = new Date();
    await this.chartOfAccountsRepository.save(account);

    return {
      accountId: account.id,
      accountCode: account.accountCode,
      accountName: account.accountName,
      reconciledDate: account.lastReconciledDate,
      status: 'reconciled',
    };
  }

  private mapToResponseDto(
    account: ChartOfAccounts,
  ): ChartOfAccountsResponseDto {
    return {
      id: account.id,
      accountCode: account.accountCode,
      accountName: account.accountName,
      accountType: account.accountType,
      accountSubType: account.accountSubType,
      normalBalance: account.normalBalance,
      description: account.description,
      parentAccountId: account.parentAccountId,
      level: account.level,
      isActive: account.isActive,
      allowPosting: account.allowPosting,
      isSystemAccount: account.isSystemAccount,
      costCenter: account.costCenter,
      department: account.department,
      location: account.location,
      isTaxAccount: account.isTaxAccount,
      taxType: account.taxType,
      currency: account.currency,
      allowMultiCurrency: account.allowMultiCurrency,
      openingBalance: account.openingBalance,
      currentBalance: account.currentBalance,
      debitTotal: account.debitTotal,
      creditTotal: account.creditTotal,
      requiresReconciliation: account.requiresReconciliation,
      lastReconciledDate: account.lastReconciledDate,
      createdBy: account.createdBy,
      updatedBy: account.updatedBy,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
      hasChildren: account.children ? account.children.length > 0 : undefined,
    };
  }
}
