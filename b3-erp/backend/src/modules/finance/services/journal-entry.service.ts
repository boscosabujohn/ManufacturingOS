import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import {
  JournalEntry,
  JournalEntryLine,
  JournalStatus,
} from '../entities/journal-entry.entity';
import { GeneralLedger, TransactionType } from '../entities/general-ledger.entity';
import {
  CreateJournalEntryDto,
  UpdateJournalEntryDto,
  JournalEntryResponseDto,
} from '../dto';

@Injectable()
export class JournalEntryService {
  constructor(
    @InjectRepository(JournalEntry)
    private readonly journalEntryRepository: Repository<JournalEntry>,
    @InjectRepository(JournalEntryLine)
    private readonly journalEntryLineRepository: Repository<JournalEntryLine>,
    @InjectRepository(GeneralLedger)
    private readonly generalLedgerRepository: Repository<GeneralLedger>,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    createDto: CreateJournalEntryDto,
  ): Promise<JournalEntryResponseDto> {
    // Validate that the entry is balanced
    const totalDebit = createDto.lines.reduce(
      (sum, line) => sum + line.debitAmount,
      0,
    );
    const totalCredit = createDto.lines.reduce(
      (sum, line) => sum + line.creditAmount,
      0,
    );

    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      throw new BadRequestException(
        `Journal entry is not balanced. Debit: ${totalDebit}, Credit: ${totalCredit}`,
      );
    }

    return await this.dataSource.transaction(async (manager) => {
      // Generate journal number
      const journalNumber = await this.generateJournalNumber();

      const journalEntry = manager.create(JournalEntry, {
        ...createDto,
        journalNumber,
        totalDebit,
        totalCredit,
        isBalanced: true,
        status: JournalStatus.DRAFT,
      });

      const savedJournal = await manager.save(JournalEntry, journalEntry);

      // Create journal entry lines
      const lines = createDto.lines.map((lineDto, index) => {
        return manager.create(JournalEntryLine, {
          ...lineDto,
          journalEntryId: savedJournal.id,
        });
      });

      await manager.save(JournalEntryLine, lines);

      return this.findOne(savedJournal.id);
    });
  }

  async findAll(filters?: {
    status?: string;
    journalType?: string;
    periodId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<JournalEntryResponseDto[]> {
    const query =
      this.journalEntryRepository.createQueryBuilder('journalEntry');

    if (filters?.status) {
      query.andWhere('journalEntry.status = :status', {
        status: filters.status,
      });
    }

    if (filters?.journalType) {
      query.andWhere('journalEntry.journalType = :journalType', {
        journalType: filters.journalType,
      });
    }

    if (filters?.periodId) {
      query.andWhere('journalEntry.periodId = :periodId', {
        periodId: filters.periodId,
      });
    }

    if (filters?.startDate) {
      query.andWhere('journalEntry.journalDate >= :startDate', {
        startDate: filters.startDate,
      });
    }

    if (filters?.endDate) {
      query.andWhere('journalEntry.journalDate <= :endDate', {
        endDate: filters.endDate,
      });
    }

    query.orderBy('journalEntry.journalDate', 'DESC');
    query.addOrderBy('journalEntry.journalNumber', 'DESC');

    const journals = await query.getMany();
    return Promise.all(journals.map((j) => this.findOne(j.id)));
  }

  async getTemplates(): Promise<JournalEntryResponseDto[]> {
    const templates = await this.journalEntryRepository.find({
      where: { isTemplate: true },
      order: { templateName: 'ASC' },
    });

    return Promise.all(templates.map((t) => this.findOne(t.id)));
  }

  async getRecurring(): Promise<JournalEntryResponseDto[]> {
    const recurring = await this.journalEntryRepository.find({
      where: { isRecurring: true },
      order: { nextRecurrenceDate: 'ASC' },
    });

    return Promise.all(recurring.map((r) => this.findOne(r.id)));
  }

  async findOne(id: string): Promise<JournalEntryResponseDto> {
    const journalEntry = await this.journalEntryRepository.findOne({
      where: { id },
      relations: ['lines'],
    });

    if (!journalEntry) {
      throw new NotFoundException(`Journal Entry with ID ${id} not found`);
    }

    return this.mapToResponseDto(journalEntry);
  }

  async update(
    id: string,
    updateDto: UpdateJournalEntryDto,
  ): Promise<JournalEntryResponseDto> {
    const journalEntry = await this.journalEntryRepository.findOne({
      where: { id },
      relations: ['lines'],
    });

    if (!journalEntry) {
      throw new NotFoundException(`Journal Entry with ID ${id} not found`);
    }

    if (journalEntry.status === JournalStatus.POSTED) {
      throw new BadRequestException('Cannot update posted journal entry');
    }

    return await this.dataSource.transaction(async (manager) => {
      // If lines are being updated, delete old lines and create new ones
      if (updateDto.lines) {
        // Validate balance
        const totalDebit = updateDto.lines.reduce(
          (sum, line) => sum + line.debitAmount,
          0,
        );
        const totalCredit = updateDto.lines.reduce(
          (sum, line) => sum + line.creditAmount,
          0,
        );

        if (Math.abs(totalDebit - totalCredit) > 0.01) {
          throw new BadRequestException('Journal entry is not balanced');
        }

        // Delete old lines
        await manager.delete(JournalEntryLine, { journalEntryId: id });

        // Create new lines
        const lines = updateDto.lines.map((lineDto) => {
          return manager.create(JournalEntryLine, {
            ...lineDto,
            journalEntryId: id,
          });
        });

        await manager.save(JournalEntryLine, lines);

        updateDto.totalDebit = totalDebit;
        updateDto.totalCredit = totalCredit;
        updateDto.isBalanced = true;
      }

      Object.assign(journalEntry, updateDto);
      await manager.save(JournalEntry, journalEntry);

      return this.findOne(id);
    });
  }

  async remove(id: string): Promise<void> {
    const journalEntry = await this.journalEntryRepository.findOne({
      where: { id },
    });

    if (!journalEntry) {
      throw new NotFoundException(`Journal Entry with ID ${id} not found`);
    }

    if (journalEntry.status === JournalStatus.POSTED) {
      throw new BadRequestException('Cannot delete posted journal entry');
    }

    await this.dataSource.transaction(async (manager) => {
      await manager.delete(JournalEntryLine, { journalEntryId: id });
      await manager.delete(JournalEntry, { id });
    });
  }

  async submit(id: string): Promise<JournalEntryResponseDto> {
    const journalEntry = await this.journalEntryRepository.findOne({
      where: { id },
    });

    if (!journalEntry) {
      throw new NotFoundException(`Journal Entry with ID ${id} not found`);
    }

    if (journalEntry.status !== JournalStatus.DRAFT) {
      throw new BadRequestException('Can only submit draft journal entries');
    }

    if (!journalEntry.isBalanced) {
      throw new BadRequestException('Cannot submit unbalanced journal entry');
    }

    journalEntry.status = JournalStatus.PENDING_APPROVAL;
    journalEntry.submittedAt = new Date();

    await this.journalEntryRepository.save(journalEntry);
    return this.findOne(id);
  }

  async approve(id: string, approvedBy: string): Promise<JournalEntryResponseDto> {
    const journalEntry = await this.journalEntryRepository.findOne({
      where: { id },
    });

    if (!journalEntry) {
      throw new NotFoundException(`Journal Entry with ID ${id} not found`);
    }

    if (journalEntry.status !== JournalStatus.PENDING_APPROVAL) {
      throw new BadRequestException(
        'Can only approve journal entries pending approval',
      );
    }

    journalEntry.status = JournalStatus.APPROVED;
    journalEntry.approvedBy = approvedBy;
    journalEntry.approvedAt = new Date();

    await this.journalEntryRepository.save(journalEntry);
    return this.findOne(id);
  }

  async reject(
    id: string,
    rejectedBy: string,
    reason: string,
  ): Promise<JournalEntryResponseDto> {
    const journalEntry = await this.journalEntryRepository.findOne({
      where: { id },
    });

    if (!journalEntry) {
      throw new NotFoundException(`Journal Entry with ID ${id} not found`);
    }

    if (journalEntry.status !== JournalStatus.PENDING_APPROVAL) {
      throw new BadRequestException(
        'Can only reject journal entries pending approval',
      );
    }

    journalEntry.status = JournalStatus.REJECTED;
    journalEntry.rejectedBy = rejectedBy;
    journalEntry.rejectedAt = new Date();
    journalEntry.rejectionReason = reason;

    await this.journalEntryRepository.save(journalEntry);
    return this.findOne(id);
  }

  async post(id: string, postedBy: string): Promise<JournalEntryResponseDto> {
    const journalEntry = await this.journalEntryRepository.findOne({
      where: { id },
      relations: ['lines'],
    });

    if (!journalEntry) {
      throw new NotFoundException(`Journal Entry with ID ${id} not found`);
    }

    if (journalEntry.status === JournalStatus.POSTED) {
      throw new BadRequestException('Journal entry already posted');
    }

    if (journalEntry.status !== JournalStatus.APPROVED) {
      throw new BadRequestException('Can only post approved journal entries');
    }

    return await this.dataSource.transaction(async (manager) => {
      // Create general ledger entries for each line
      for (const line of journalEntry.lines) {
        const glEntry = manager.create(GeneralLedger, {
          accountId: line.accountId,
          periodId: journalEntry.periodId,
          transactionNumber: await this.generateTransactionNumber(),
          transactionType: TransactionType.JOURNAL_ENTRY,
          postingDate: journalEntry.postingDate,
          transactionDate: journalEntry.journalDate,
          debitAmount: line.debitAmount,
          creditAmount: line.creditAmount,
          netAmount: line.debitAmount - line.creditAmount,
          description: line.description,
          referenceNumber: journalEntry.journalNumber,
          referenceType: 'Journal Entry',
          referenceId: journalEntry.id,
          costCenter: line.costCenter,
          department: line.department,
          project: line.project,
          location: line.location,
          partyId: line.partyId,
          partyName: line.partyName,
          partyType: line.partyType,
          status: 'Posted' as any,
          postedBy: postedBy,
          postedAt: new Date(),
          journalEntryId: journalEntry.id,
          lineNumber: line.lineNumber,
        });

        const savedGLEntry = await manager.save(GeneralLedger, glEntry);

        // Update journal entry line with GL entry reference
        line.generalLedgerId = savedGLEntry.id;
        await manager.save(JournalEntryLine, line);
      }

      // Update journal entry status
      journalEntry.status = JournalStatus.POSTED;
      journalEntry.postedBy = postedBy;
      journalEntry.postedAt = new Date();

      await manager.save(JournalEntry, journalEntry);

      return this.findOne(id);
    });
  }

  async reverse(
    id: string,
    reverseData: {
      reversedBy: string;
      reversalDate: string;
      reason?: string;
    },
  ): Promise<JournalEntryResponseDto> {
    const journalEntry = await this.journalEntryRepository.findOne({
      where: { id },
      relations: ['lines'],
    });

    if (!journalEntry) {
      throw new NotFoundException(`Journal Entry with ID ${id} not found`);
    }

    if (journalEntry.status !== JournalStatus.POSTED) {
      throw new BadRequestException('Can only reverse posted journal entries');
    }

    if (journalEntry.isReversed) {
      throw new BadRequestException('Journal entry already reversed');
    }

    return await this.dataSource.transaction(async (manager) => {
      // Create reversal journal entry
      const reversalJournal = manager.create(JournalEntry, {
        journalNumber: await this.generateJournalNumber(),
        journalType: 'REVERSING' as any,
        periodId: journalEntry.periodId,
        journalDate: new Date(reverseData.reversalDate),
        postingDate: new Date(reverseData.reversalDate),
        description: `Reversal of ${journalEntry.journalNumber}. ${reverseData.reason || ''}`,
        referenceNumber: journalEntry.journalNumber,
        status: JournalStatus.APPROVED,
        totalDebit: journalEntry.totalCredit, // Flip debit and credit
        totalCredit: journalEntry.totalDebit,
        isBalanced: true,
      });

      const savedReversalJournal = await manager.save(
        JournalEntry,
        reversalJournal,
      );

      // Create reversal lines (flip debit and credit)
      for (const line of journalEntry.lines) {
        const reversalLine = manager.create(JournalEntryLine, {
          journalEntryId: savedReversalJournal.id,
          lineNumber: line.lineNumber,
          accountId: line.accountId,
          description: `Reversal: ${line.description}`,
          debitAmount: line.creditAmount, // Flip
          creditAmount: line.debitAmount, // Flip
          costCenter: line.costCenter,
          department: line.department,
          project: line.project,
          location: line.location,
          partyId: line.partyId,
          partyName: line.partyName,
          partyType: line.partyType,
        });

        await manager.save(JournalEntryLine, reversalLine);
      }

      // Post the reversal journal automatically
      await this.post(savedReversalJournal.id, reverseData.reversedBy);

      // Mark original journal as reversed
      journalEntry.isReversed = true;
      journalEntry.reversedBy = reverseData.reversedBy;
      journalEntry.reversedAt = new Date();
      journalEntry.reversalJournalId = savedReversalJournal.id;

      await manager.save(JournalEntry, journalEntry);

      return this.findOne(id);
    });
  }

  async generateRecurring(id: string): Promise<JournalEntryResponseDto> {
    const template = await this.journalEntryRepository.findOne({
      where: { id },
      relations: ['lines'],
    });

    if (!template) {
      throw new NotFoundException(`Recurring journal entry with ID ${id} not found`);
    }

    if (!template.isRecurring) {
      throw new BadRequestException('Journal entry is not recurring');
    }

    // Generate new journal entry based on template
    const newEntry = {
      journalType: template.journalType,
      periodId: template.periodId,
      journalDate: new Date().toISOString().split('T')[0],
      postingDate: new Date().toISOString().split('T')[0],
      description: `${template.description} (Auto-generated)`,
      lines: template.lines.map((line) => ({
        lineNumber: line.lineNumber,
        accountId: line.accountId,
        description: line.description,
        debitAmount: line.debitAmount,
        creditAmount: line.creditAmount,
        costCenter: line.costCenter,
        department: line.department,
        project: line.project,
        location: line.location,
      })),
    };

    return this.create(newEntry as any);
  }

  private async generateJournalNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.journalEntryRepository.count({
      where: { journalNumber: `JE-${year}-%` as any },
    });
    return `JE-${year}-${String(count + 1).padStart(6, '0')}`;
  }

  private async generateTransactionNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.generalLedgerRepository.count();
    return `TXN-${year}-${String(count + 1).padStart(8, '0')}`;
  }

  private mapToResponseDto(
    journalEntry: JournalEntry,
  ): JournalEntryResponseDto {
    return {
      id: journalEntry.id,
      journalNumber: journalEntry.journalNumber,
      journalType: journalEntry.journalType,
      periodId: journalEntry.periodId,
      journalDate: journalEntry.journalDate,
      postingDate: journalEntry.postingDate,
      description: journalEntry.description,
      referenceNumber: journalEntry.referenceNumber,
      status: journalEntry.status,
      totalDebit: journalEntry.totalDebit,
      totalCredit: journalEntry.totalCredit,
      isBalanced: journalEntry.isBalanced,
      isRecurring: journalEntry.isRecurring,
      recurrencePattern: journalEntry.recurrencePattern,
      recurrenceStartDate: journalEntry.recurrenceStartDate,
      recurrenceEndDate: journalEntry.recurrenceEndDate,
      recurrenceCount: journalEntry.recurrenceCount,
      nextRecurrenceDate: journalEntry.nextRecurrenceDate,
      isTemplate: journalEntry.isTemplate,
      templateName: journalEntry.templateName,
      submittedBy: journalEntry.submittedBy,
      submittedAt: journalEntry.submittedAt,
      approvedBy: journalEntry.approvedBy,
      approvedAt: journalEntry.approvedAt,
      postedBy: journalEntry.postedBy,
      postedAt: journalEntry.postedAt,
      isReversed: journalEntry.isReversed,
      reversedBy: journalEntry.reversedBy,
      reversedAt: journalEntry.reversedAt,
      reversalJournalId: journalEntry.reversalJournalId,
      notes: journalEntry.notes,
      createdBy: journalEntry.createdBy,
      updatedBy: journalEntry.updatedBy,
      createdAt: journalEntry.createdAt,
      updatedAt: journalEntry.updatedAt,
      lines: journalEntry.lines
        ? journalEntry.lines.map((line) => ({
            id: line.id,
            journalEntryId: line.journalEntryId,
            lineNumber: line.lineNumber,
            accountId: line.accountId,
            description: line.description,
            debitAmount: line.debitAmount,
            creditAmount: line.creditAmount,
            costCenter: line.costCenter,
            department: line.department,
            project: line.project,
            location: line.location,
            partyId: line.partyId,
            partyName: line.partyName,
            partyType: line.partyType,
            generalLedgerId: line.generalLedgerId,
            createdAt: line.createdAt,
            updatedAt: line.updatedAt,
          }))
        : [],
    };
  }
}
