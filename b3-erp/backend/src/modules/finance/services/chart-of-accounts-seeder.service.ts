import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChartOfAccounts } from '../entities/chart-of-accounts.entity';
import {
  DEFAULT_CHART_OF_ACCOUNTS,
  DefaultAccount,
} from '../data/default-chart-of-accounts.data';

@Injectable()
export class ChartOfAccountsSeederService {
  private readonly logger = new Logger(ChartOfAccountsSeederService.name);

  constructor(
    @InjectRepository(ChartOfAccounts)
    private readonly chartOfAccountsRepository: Repository<ChartOfAccounts>,
  ) {}

  /**
   * Seeds the database with the default chart of accounts
   * This method is idempotent - it will only create accounts that don't exist
   * @param overwrite - If true, will delete existing accounts and recreate them
   */
  async seed(overwrite: boolean = false): Promise<{
    created: number;
    skipped: number;
    errors: number;
  }> {
    this.logger.log('Starting Chart of Accounts seeding process...');

    const result = {
      created: 0,
      skipped: 0,
      errors: 0,
    };

    try {
      // Check if accounts already exist
      const existingCount = await this.chartOfAccountsRepository.count();

      if (existingCount > 0 && !overwrite) {
        this.logger.warn(
          `Chart of Accounts already has ${existingCount} accounts. Skipping seed. Use overwrite=true to recreate.`,
        );
        result.skipped = DEFAULT_CHART_OF_ACCOUNTS.length;
        return result;
      }

      if (existingCount > 0 && overwrite) {
        this.logger.warn('Overwrite mode enabled. Deleting existing accounts...');
        // Delete all non-system accounts first
        await this.chartOfAccountsRepository
          .createQueryBuilder()
          .delete()
          .where('isSystemAccount = :isSystem', { isSystem: false })
          .execute();

        // Then delete system accounts
        await this.chartOfAccountsRepository
          .createQueryBuilder()
          .delete()
          .where('isSystemAccount = :isSystem', { isSystem: true })
          .execute();

        this.logger.log('Existing accounts deleted.');
      }

      // Create a map to store account codes and their IDs for parent-child relationships
      const accountCodeToIdMap = new Map<string, string>();

      // Sort accounts by level to ensure parents are created before children
      const sortedAccounts = [...DEFAULT_CHART_OF_ACCOUNTS].sort(
        (a, b) => a.level - b.level,
      );

      // First pass: Create all accounts
      for (const defaultAccount of sortedAccounts) {
        try {
          // Check if account already exists
          const existing = await this.chartOfAccountsRepository.findOne({
            where: { accountCode: defaultAccount.accountCode },
          });

          if (existing) {
            accountCodeToIdMap.set(defaultAccount.accountCode, existing.id);
            result.skipped++;
            continue;
          }

          // Resolve parent account ID if parentAccountCode is provided
          let parentAccountId: string | undefined;
          if (defaultAccount.parentAccountCode) {
            parentAccountId = accountCodeToIdMap.get(
              defaultAccount.parentAccountCode,
            );

            if (!parentAccountId) {
              this.logger.error(
                `Parent account ${defaultAccount.parentAccountCode} not found for account ${defaultAccount.accountCode}`,
              );
              result.errors++;
              continue;
            }
          }

          // Create the account
          const account = this.chartOfAccountsRepository.create({
            accountCode: defaultAccount.accountCode,
            accountName: defaultAccount.accountName,
            accountType: defaultAccount.accountType,
            accountSubType: defaultAccount.accountSubType,
            normalBalance: defaultAccount.normalBalance,
            description: defaultAccount.description,
            parentAccountId: parentAccountId,
            level: defaultAccount.level,
            isActive: true,
            allowPosting: defaultAccount.allowPosting,
            isSystemAccount: defaultAccount.isSystemAccount,
            isTaxAccount: defaultAccount.isTaxAccount || false,
            taxType: defaultAccount.taxType,
            requiresReconciliation: defaultAccount.requiresReconciliation || false,
            openingBalance: 0,
            currentBalance: 0,
            debitTotal: 0,
            creditTotal: 0,
            currency: 'INR',
            allowMultiCurrency: false,
          });

          const savedAccount =
            await this.chartOfAccountsRepository.save(account);
          accountCodeToIdMap.set(defaultAccount.accountCode, savedAccount.id);
          result.created++;

          this.logger.debug(
            `Created account: ${defaultAccount.accountCode} - ${defaultAccount.accountName}`,
          );
        } catch (error) {
          this.logger.error(
            `Error creating account ${defaultAccount.accountCode}: ${error.message}`,
          );
          result.errors++;
        }
      }

      this.logger.log(
        `Chart of Accounts seeding completed. Created: ${result.created}, Skipped: ${result.skipped}, Errors: ${result.errors}`,
      );
    } catch (error) {
      this.logger.error(`Chart of Accounts seeding failed: ${error.message}`);
      throw error;
    }

    return result;
  }

  /**
   * Seeds only missing accounts from the default chart of accounts
   * Useful for adding new accounts without affecting existing ones
   */
  async seedMissing(): Promise<{
    created: number;
    skipped: number;
    errors: number;
  }> {
    this.logger.log('Seeding missing Chart of Accounts...');

    const result = {
      created: 0,
      skipped: 0,
      errors: 0,
    };

    // Get all existing account codes
    const existingAccounts = await this.chartOfAccountsRepository.find({
      select: ['accountCode', 'id'],
    });

    const existingCodesMap = new Map<string, string>();
    existingAccounts.forEach((acc) => {
      existingCodesMap.set(acc.accountCode, acc.id);
    });

    // Sort accounts by level
    const sortedAccounts = [...DEFAULT_CHART_OF_ACCOUNTS].sort(
      (a, b) => a.level - b.level,
    );

    // Create missing accounts
    for (const defaultAccount of sortedAccounts) {
      try {
        // Skip if account already exists
        if (existingCodesMap.has(defaultAccount.accountCode)) {
          result.skipped++;
          continue;
        }

        // Resolve parent account ID if parentAccountCode is provided
        let parentAccountId: string | undefined;
        if (defaultAccount.parentAccountCode) {
          parentAccountId = existingCodesMap.get(
            defaultAccount.parentAccountCode,
          );

          if (!parentAccountId) {
            this.logger.error(
              `Parent account ${defaultAccount.parentAccountCode} not found for account ${defaultAccount.accountCode}`,
            );
            result.errors++;
            continue;
          }
        }

        // Create the account
        const account = this.chartOfAccountsRepository.create({
          accountCode: defaultAccount.accountCode,
          accountName: defaultAccount.accountName,
          accountType: defaultAccount.accountType,
          accountSubType: defaultAccount.accountSubType,
          normalBalance: defaultAccount.normalBalance,
          description: defaultAccount.description,
          parentAccountId: parentAccountId,
          level: defaultAccount.level,
          isActive: true,
          allowPosting: defaultAccount.allowPosting,
          isSystemAccount: defaultAccount.isSystemAccount,
          isTaxAccount: defaultAccount.isTaxAccount || false,
          taxType: defaultAccount.taxType,
          requiresReconciliation: defaultAccount.requiresReconciliation || false,
          openingBalance: 0,
          currentBalance: 0,
          debitTotal: 0,
          creditTotal: 0,
          currency: 'INR',
          allowMultiCurrency: false,
        });

        const savedAccount = await this.chartOfAccountsRepository.save(account);
        existingCodesMap.set(defaultAccount.accountCode, savedAccount.id);
        result.created++;

        this.logger.debug(
          `Created missing account: ${defaultAccount.accountCode} - ${defaultAccount.accountName}`,
        );
      } catch (error) {
        this.logger.error(
          `Error creating account ${defaultAccount.accountCode}: ${error.message}`,
        );
        result.errors++;
      }
    }

    this.logger.log(
      `Missing accounts seeding completed. Created: ${result.created}, Skipped: ${result.skipped}, Errors: ${result.errors}`,
    );

    return result;
  }

  /**
   * Gets statistics about the default chart of accounts
   */
  getDefaultAccountsStats() {
    const stats = {
      total: DEFAULT_CHART_OF_ACCOUNTS.length,
      byLevel: {} as Record<number, number>,
      byType: {} as Record<string, number>,
      systemAccounts: 0,
      postingAccounts: 0,
      taxAccounts: 0,
    };

    DEFAULT_CHART_OF_ACCOUNTS.forEach((account) => {
      // Count by level
      stats.byLevel[account.level] = (stats.byLevel[account.level] || 0) + 1;

      // Count by type
      stats.byType[account.accountType] =
        (stats.byType[account.accountType] || 0) + 1;

      // Count special accounts
      if (account.isSystemAccount) stats.systemAccounts++;
      if (account.allowPosting) stats.postingAccounts++;
      if (account.isTaxAccount) stats.taxAccounts++;
    });

    return stats;
  }

  /**
   * Validates the default chart of accounts data
   * Checks for consistency, parent-child relationships, etc.
   */
  validateDefaultAccounts(): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const result = {
      isValid: true,
      errors: [] as string[],
      warnings: [] as string[],
    };

    const accountCodes = new Set<string>();

    DEFAULT_CHART_OF_ACCOUNTS.forEach((account, index) => {
      // Check for duplicate account codes
      if (accountCodes.has(account.accountCode)) {
        result.errors.push(
          `Duplicate account code: ${account.accountCode} at index ${index}`,
        );
        result.isValid = false;
      }
      accountCodes.add(account.accountCode);

      // Check if parent exists (for non-root accounts)
      if (account.parentAccountCode) {
        const parentExists = DEFAULT_CHART_OF_ACCOUNTS.some(
          (a) => a.accountCode === account.parentAccountCode,
        );
        if (!parentExists) {
          result.errors.push(
            `Parent account ${account.parentAccountCode} not found for account ${account.accountCode}`,
          );
          result.isValid = false;
        }

        // Check if parent has lower level
        const parent = DEFAULT_CHART_OF_ACCOUNTS.find(
          (a) => a.accountCode === account.parentAccountCode,
        );
        if (parent && parent.level >= account.level) {
          result.warnings.push(
            `Account ${account.accountCode} has level ${account.level} but parent ${account.parentAccountCode} has level ${parent.level}`,
          );
        }
      }

      // Validate account code format
      if (!/^\d{4}$/.test(account.accountCode)) {
        result.warnings.push(
          `Account code ${account.accountCode} does not follow 4-digit format`,
        );
      }
    });

    return result;
  }
}
