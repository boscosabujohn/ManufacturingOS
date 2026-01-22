import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApprovalChain } from '../entities/approval-chain.entity';
import { ApprovalLevel } from '../entities/approval-level.entity';
import {
  DEFAULT_APPROVAL_CHAINS,
  DefaultApprovalChain,
} from '../data/default-approval-chains.data';

@Injectable()
export class ApprovalsSeederService implements OnModuleInit {
  private readonly logger = new Logger(ApprovalsSeederService.name);

  constructor(
    @InjectRepository(ApprovalChain)
    private readonly approvalChainRepository: Repository<ApprovalChain>,
    @InjectRepository(ApprovalLevel)
    private readonly approvalLevelRepository: Repository<ApprovalLevel>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seedAll();
  }

  async seedAll(): Promise<{
    chains: { created: number; skipped: number; errors: number };
    levels: { created: number; skipped: number; errors: number };
  }> {
    this.logger.log('Starting Approvals module seeding...');

    const result = await this.seedApprovalChains();

    this.logger.log('Approvals module seeding completed');

    return result;
  }

  async seedApprovalChains(): Promise<{
    chains: { created: number; skipped: number; errors: number };
    levels: { created: number; skipped: number; errors: number };
  }> {
    this.logger.log('Seeding approval chains...');

    const chainResult = { created: 0, skipped: 0, errors: 0 };
    const levelResult = { created: 0, skipped: 0, errors: 0 };

    for (const defaultChain of DEFAULT_APPROVAL_CHAINS) {
      try {
        // Check if chain already exists by name and entity type
        const existing = await this.approvalChainRepository.findOne({
          where: {
            name: defaultChain.name,
            entityType: defaultChain.entityType,
          },
          relations: ['levels'],
        });

        if (existing) {
          chainResult.skipped++;
          levelResult.skipped += defaultChain.levels.length;
          continue;
        }

        // Create the approval chain
        const chain = this.approvalChainRepository.create({
          name: defaultChain.name,
          entityType: defaultChain.entityType,
          description: defaultChain.description,
          isActive: defaultChain.isActive,
        });

        const savedChain = await this.approvalChainRepository.save(chain);
        chainResult.created++;

        // Create the approval levels
        for (const defaultLevel of defaultChain.levels) {
          try {
            const level = this.approvalLevelRepository.create({
              chainId: savedChain.id,
              sequence: defaultLevel.sequence,
              approverType: defaultLevel.approverType,
              approverIds: defaultLevel.approverIds,
              requiredCount: defaultLevel.requiredCount,
              slaHours: defaultLevel.slaHours,
              conditions: defaultLevel.conditions,
              escalationRules: defaultLevel.escalationRules,
            });

            await this.approvalLevelRepository.save(level);
            levelResult.created++;
          } catch (levelError) {
            this.logger.error(
              `Error creating level ${defaultLevel.sequence} for chain ${defaultChain.name}: ${levelError.message}`,
            );
            levelResult.errors++;
          }
        }

        this.logger.debug(`Created approval chain: ${defaultChain.name}`);
      } catch (error) {
        this.logger.error(
          `Error creating approval chain ${defaultChain.name}: ${error.message}`,
        );
        chainResult.errors++;
        levelResult.errors += defaultChain.levels.length;
      }
    }

    this.logger.log(
      `Approval chains seeding completed. Chains - Created: ${chainResult.created}, Skipped: ${chainResult.skipped}, Errors: ${chainResult.errors}`,
    );
    this.logger.log(
      `Approval levels seeding completed. Levels - Created: ${levelResult.created}, Skipped: ${levelResult.skipped}, Errors: ${levelResult.errors}`,
    );

    return {
      chains: chainResult,
      levels: levelResult,
    };
  }

  async seedMissing(): Promise<{
    chains: { created: number; skipped: number; errors: number };
    levels: { created: number; skipped: number; errors: number };
  }> {
    return this.seedAll();
  }

  getStats(): {
    totalChains: number;
    totalLevels: number;
    byEntityType: Record<string, number>;
  } {
    const stats = {
      totalChains: DEFAULT_APPROVAL_CHAINS.length,
      totalLevels: 0,
      byEntityType: {} as Record<string, number>,
    };

    for (const chain of DEFAULT_APPROVAL_CHAINS) {
      stats.totalLevels += chain.levels.length;
      stats.byEntityType[chain.entityType] =
        (stats.byEntityType[chain.entityType] || 0) + 1;
    }

    return stats;
  }
}
