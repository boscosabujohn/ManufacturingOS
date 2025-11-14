import {
  Controller,
  Post,
  Get,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ChartOfAccountsSeederService } from '../services/chart-of-accounts-seeder.service';

@Controller('finance/chart-of-accounts/seed')
export class ChartOfAccountsSeederController {
  constructor(
    private readonly seederService: ChartOfAccountsSeederService,
  ) {}

  /**
   * POST /finance/chart-of-accounts/seed
   * Seeds the database with the default chart of accounts
   * Query params:
   *   - overwrite: boolean (default: false) - If true, deletes existing accounts and recreates them
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async seedAccounts(
    @Query('overwrite') overwrite?: string,
  ): Promise<{
    success: boolean;
    message: string;
    data: {
      created: number;
      skipped: number;
      errors: number;
    };
  }> {
    const shouldOverwrite = overwrite === 'true';

    try {
      const result = await this.seederService.seed(shouldOverwrite);

      return {
        success: true,
        message: shouldOverwrite
          ? 'Chart of Accounts recreated successfully'
          : 'Chart of Accounts seeded successfully',
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to seed Chart of Accounts: ${error.message}`,
        data: {
          created: 0,
          skipped: 0,
          errors: 1,
        },
      };
    }
  }

  /**
   * POST /finance/chart-of-accounts/seed/missing
   * Seeds only missing accounts from the default chart of accounts
   */
  @Post('missing')
  @HttpCode(HttpStatus.CREATED)
  async seedMissingAccounts(): Promise<{
    success: boolean;
    message: string;
    data: {
      created: number;
      skipped: number;
      errors: number;
    };
  }> {
    try {
      const result = await this.seederService.seedMissing();

      return {
        success: true,
        message: 'Missing accounts seeded successfully',
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to seed missing accounts: ${error.message}`,
        data: {
          created: 0,
          skipped: 0,
          errors: 1,
        },
      };
    }
  }

  /**
   * GET /finance/chart-of-accounts/seed/stats
   * Gets statistics about the default chart of accounts
   */
  @Get('stats')
  getDefaultAccountsStats() {
    return {
      success: true,
      data: this.seederService.getDefaultAccountsStats(),
    };
  }

  /**
   * GET /finance/chart-of-accounts/seed/validate
   * Validates the default chart of accounts data
   */
  @Get('validate')
  validateDefaultAccounts() {
    const validation = this.seederService.validateDefaultAccounts();

    return {
      success: validation.isValid,
      message: validation.isValid
        ? 'Default chart of accounts is valid'
        : 'Default chart of accounts has validation errors',
      data: validation,
    };
  }
}
