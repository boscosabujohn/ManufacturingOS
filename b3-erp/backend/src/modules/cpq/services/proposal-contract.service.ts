import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import {
  ContentLibraryItem,
  Contract,
  ContractClause,
  ContractStatus,
  ContractTemplate,
  Proposal,
  ProposalStatus,
  ProposalTemplate,
} from '../entities/proposal-contract.entity';

@Injectable()
export class ProposalContractService {
  constructor(
    @InjectRepository(Proposal)
    private proposalRepository: Repository<Proposal>,
    @InjectRepository(ProposalTemplate)
    private proposalTemplateRepository: Repository<ProposalTemplate>,
    @InjectRepository(ContentLibraryItem)
    private contentLibraryRepository: Repository<ContentLibraryItem>,
    @InjectRepository(Contract)
    private contractRepository: Repository<Contract>,
    @InjectRepository(ContractTemplate)
    private contractTemplateRepository: Repository<ContractTemplate>,
    @InjectRepository(ContractClause)
    private clauseRepository: Repository<ContractClause>,
  ) {}

  // Proposals
  async createProposal(
    companyId: string,
    data: Partial<Proposal>,
  ): Promise<Proposal> {
    const proposalNumber = await this.generateProposalNumber(companyId);
    const proposal = this.proposalRepository.create({
      ...data,
      companyId,
      proposalNumber,
      proposalDate: data.proposalDate || new Date(),
    });
    return this.proposalRepository.save(proposal);
  }

  async findAllProposals(
    companyId: string,
    filters?: {
      status?: ProposalStatus;
      customerId?: string;
      fromDate?: string;
      toDate?: string;
    },
  ): Promise<Proposal[]> {
    const query = this.proposalRepository
      .createQueryBuilder('proposal')
      .where('proposal.companyId = :companyId', { companyId })
      .orderBy('proposal.createdAt', 'DESC');

    if (filters?.status) {
      query.andWhere('proposal.status = :status', { status: filters.status });
    }
    if (filters?.customerId) {
      query.andWhere('proposal.customerId = :customerId', {
        customerId: filters.customerId,
      });
    }
    if (filters?.fromDate) {
      query.andWhere('proposal.proposalDate >= :fromDate', {
        fromDate: filters.fromDate,
      });
    }
    if (filters?.toDate) {
      query.andWhere('proposal.proposalDate <= :toDate', {
        toDate: filters.toDate,
      });
    }

    return query.getMany();
  }

  async findProposalById(companyId: string, id: string): Promise<Proposal> {
    const proposal = await this.proposalRepository.findOne({
      where: { id, companyId },
    });
    if (!proposal) {
      throw new NotFoundException(`Proposal with ID ${id} not found`);
    }
    return proposal;
  }

  async updateProposal(
    companyId: string,
    id: string,
    data: Partial<Proposal>,
  ): Promise<Proposal> {
    const proposal = await this.findProposalById(companyId, id);
    Object.assign(proposal, data);
    return this.proposalRepository.save(proposal);
  }

  async deleteProposal(companyId: string, id: string): Promise<void> {
    const proposal = await this.findProposalById(companyId, id);
    await this.proposalRepository.remove(proposal);
  }

  // Proposal Workflow
  async submitProposalForApproval(
    companyId: string,
    id: string,
  ): Promise<Proposal> {
    const proposal = await this.findProposalById(companyId, id);
    proposal.status = ProposalStatus.IN_REVIEW;
    return this.proposalRepository.save(proposal);
  }

  async approveProposal(
    companyId: string,
    id: string,
    approvedBy: string,
  ): Promise<Proposal> {
    const proposal = await this.findProposalById(companyId, id);
    proposal.status = ProposalStatus.APPROVED;
    proposal.approvedBy = approvedBy;
    proposal.approvedAt = new Date();
    return this.proposalRepository.save(proposal);
  }

  async sendProposal(
    companyId: string,
    id: string,
    sentBy: string,
  ): Promise<Proposal> {
    const proposal = await this.findProposalById(companyId, id);
    proposal.status = ProposalStatus.SENT;
    proposal.sentAt = new Date();
    proposal.sentBy = sentBy;
    return this.proposalRepository.save(proposal);
  }

  async recordProposalView(companyId: string, id: string): Promise<void> {
    await this.proposalRepository.update(
      { id, companyId },
      {
        viewCount: () => 'viewCount + 1',
        lastViewedAt: new Date(),
        status: ProposalStatus.VIEWED,
      },
    );
  }

  async recordProposalResponse(
    companyId: string,
    id: string,
    accepted: boolean,
    feedback?: string,
  ): Promise<Proposal> {
    const proposal = await this.findProposalById(companyId, id);
    proposal.status = accepted ? ProposalStatus.ACCEPTED : ProposalStatus.REJECTED;
    proposal.customerResponseAt = new Date();
    if (feedback !== undefined) proposal.customerFeedback = feedback;
    return this.proposalRepository.save(proposal);
  }

  // Proposal Templates
  async createProposalTemplate(
    companyId: string,
    data: Partial<ProposalTemplate>,
  ): Promise<ProposalTemplate> {
    if (data.isDefault) {
      await this.proposalTemplateRepository.update(
        { companyId, isDefault: true },
        { isDefault: false },
      );
    }
    const template = this.proposalTemplateRepository.create({
      ...data,
      companyId,
    });
    return this.proposalTemplateRepository.save(template);
  }

  async findAllProposalTemplates(
    companyId: string,
    filters?: { category?: string; isActive?: boolean },
  ): Promise<ProposalTemplate[]> {
    const query = this.proposalTemplateRepository
      .createQueryBuilder('template')
      .where('template.companyId = :companyId', { companyId })
      .orderBy('template.isDefault', 'DESC')
      .addOrderBy('template.name', 'ASC');

    if (filters?.category) {
      query.andWhere('template.category = :category', { category: filters.category });
    }
    if (filters?.isActive !== undefined) {
      query.andWhere('template.isActive = :isActive', { isActive: filters.isActive });
    }

    return query.getMany();
  }

  async createProposalFromTemplate(
    companyId: string,
    templateId: string,
    data: Partial<Proposal>,
  ): Promise<Proposal> {
    const template = await this.proposalTemplateRepository.findOne({
      where: { id: templateId, companyId },
    });
    if (!template) {
      throw new NotFoundException(`Template with ID ${templateId} not found`);
    }

    await this.proposalTemplateRepository.update(
      { id: templateId },
      { usageCount: () => 'usageCount + 1' },
    );

    return this.createProposal(companyId, {
      ...data,
      templateId,
      sections: template.sections.map((s) => ({
        sectionId: s.sectionId,
        title: s.title,
        content: s.defaultContent,
        order: s.order,
        isVisible: true,
      })),
      coverLetter: data.coverLetter || template.defaultCoverLetter,
    });
  }

  // Content Library
  async createContentLibraryItem(
    companyId: string,
    data: Partial<ContentLibraryItem>,
  ): Promise<ContentLibraryItem> {
    const item = this.contentLibraryRepository.create({
      ...data,
      companyId,
    });
    return this.contentLibraryRepository.save(item);
  }

  async findAllContentLibraryItems(
    companyId: string,
    filters?: {
      contentType?: string;
      category?: string;
      tags?: string[];
      isActive?: boolean;
    },
  ): Promise<ContentLibraryItem[]> {
    const query = this.contentLibraryRepository
      .createQueryBuilder('item')
      .where('item.companyId = :companyId', { companyId })
      .orderBy('item.name', 'ASC');

    if (filters?.contentType) {
      query.andWhere('item.contentType = :contentType', {
        contentType: filters.contentType,
      });
    }
    if (filters?.category) {
      query.andWhere('item.category = :category', { category: filters.category });
    }
    if (filters?.isActive !== undefined) {
      query.andWhere('item.isActive = :isActive', { isActive: filters.isActive });
    }

    return query.getMany();
  }

  async updateContentLibraryItem(
    companyId: string,
    id: string,
    data: Partial<ContentLibraryItem>,
  ): Promise<ContentLibraryItem> {
    const item = await this.contentLibraryRepository.findOne({
      where: { id, companyId },
    });
    if (!item) {
      throw new NotFoundException(`Content item with ID ${id} not found`);
    }
    Object.assign(item, data);
    return this.contentLibraryRepository.save(item);
  }

  async deleteContentLibraryItem(companyId: string, id: string): Promise<void> {
    const item = await this.contentLibraryRepository.findOne({
      where: { id, companyId },
    });
    if (!item) {
      throw new NotFoundException(`Content item with ID ${id} not found`);
    }
    await this.contentLibraryRepository.remove(item);
  }

  // Contracts
  async createContract(
    companyId: string,
    data: Partial<Contract>,
  ): Promise<Contract> {
    const contractNumber = await this.generateContractNumber(companyId);
    const contract = this.contractRepository.create({
      ...data,
      companyId,
      contractNumber,
    });
    return this.contractRepository.save(contract);
  }

  async findAllContracts(
    companyId: string,
    filters?: {
      status?: ContractStatus;
      customerId?: string;
      contractType?: string;
      fromDate?: string;
      toDate?: string;
    },
  ): Promise<Contract[]> {
    const query = this.contractRepository
      .createQueryBuilder('contract')
      .where('contract.companyId = :companyId', { companyId })
      .orderBy('contract.createdAt', 'DESC');

    if (filters?.status) {
      query.andWhere('contract.status = :status', { status: filters.status });
    }
    if (filters?.customerId) {
      query.andWhere('contract.customerId = :customerId', {
        customerId: filters.customerId,
      });
    }
    if (filters?.contractType) {
      query.andWhere('contract.contractType = :contractType', {
        contractType: filters.contractType,
      });
    }
    if (filters?.fromDate) {
      query.andWhere('contract.startDate >= :fromDate', {
        fromDate: filters.fromDate,
      });
    }
    if (filters?.toDate) {
      query.andWhere('contract.endDate <= :toDate', { toDate: filters.toDate });
    }

    return query.getMany();
  }

  async findContractById(companyId: string, id: string): Promise<Contract> {
    const contract = await this.contractRepository.findOne({
      where: { id, companyId },
    });
    if (!contract) {
      throw new NotFoundException(`Contract with ID ${id} not found`);
    }
    return contract;
  }

  async updateContract(
    companyId: string,
    id: string,
    data: Partial<Contract>,
  ): Promise<Contract> {
    const contract = await this.findContractById(companyId, id);
    Object.assign(contract, data);
    return this.contractRepository.save(contract);
  }

  async deleteContract(companyId: string, id: string): Promise<void> {
    const contract = await this.findContractById(companyId, id);
    await this.contractRepository.remove(contract);
  }

  // Contract Workflow
  async submitContractForApproval(
    companyId: string,
    id: string,
  ): Promise<Contract> {
    const contract = await this.findContractById(companyId, id);
    contract.status = ContractStatus.PENDING_APPROVAL;
    return this.contractRepository.save(contract);
  }

  async approveContract(
    companyId: string,
    id: string,
    approvedBy: string,
    notes?: string,
  ): Promise<Contract> {
    const contract = await this.findContractById(companyId, id);
    contract.status = ContractStatus.APPROVED;
    contract.approvedBy = approvedBy;
    contract.approvedAt = new Date();
    if (notes !== undefined) contract.approvalNotes = notes;
    return this.contractRepository.save(contract);
  }

  async sendContractForSignature(companyId: string, id: string): Promise<Contract> {
    const contract = await this.findContractById(companyId, id);
    contract.status = ContractStatus.SENT;
    return this.contractRepository.save(contract);
  }

  async recordSignature(
    companyId: string,
    id: string,
    signatoryEmail: string,
    signatureData: string,
  ): Promise<Contract> {
    const contract = await this.findContractById(companyId, id);

    if (contract.signatories) {
      const signatoryIndex = contract.signatories.findIndex(
        (s) => s.email === signatoryEmail,
      );
      if (signatoryIndex >= 0) {
        contract.signatories[signatoryIndex].signedAt = new Date();
        contract.signatories[signatoryIndex].signatureData = signatureData;
        contract.signatories[signatoryIndex].signatureStatus = 'signed';
      }

      const allSigned = contract.signatories.every(
        (s) => s.signatureStatus === 'signed',
      );
      if (allSigned) {
        contract.status = ContractStatus.FULLY_SIGNED;
      } else {
        contract.status = ContractStatus.PARTIALLY_SIGNED;
      }
    }

    return this.contractRepository.save(contract);
  }

  async activateContract(companyId: string, id: string): Promise<Contract> {
    const contract = await this.findContractById(companyId, id);
    contract.status = ContractStatus.ACTIVE;
    return this.contractRepository.save(contract);
  }

  async getExpiringContracts(
    companyId: string,
    daysUntilExpiration: number,
  ): Promise<Contract[]> {
    const today = new Date();
    const expirationDate = new Date();
    expirationDate.setDate(today.getDate() + daysUntilExpiration);

    return this.contractRepository.find({
      where: {
        companyId,
        status: ContractStatus.ACTIVE,
        endDate: LessThanOrEqual(expirationDate),
      },
      order: { endDate: 'ASC' },
    });
  }

  async renewContract(
    companyId: string,
    id: string,
    newEndDate: Date,
    createdBy: string,
  ): Promise<Contract> {
    const original = await this.findContractById(companyId, id);

    // Update original contract status
    original.status = ContractStatus.RENEWED;
    await this.contractRepository.save(original);

    // Create renewal
    const { id: _, contractNumber, version, ...contractData } = original;
    return this.createContract(companyId, {
      ...contractData,
      parentContractId: id,
      version: version + 1,
      startDate: original.endDate,
      endDate: newEndDate,
      status: ContractStatus.DRAFT,
      contractType: 'renewal',
      createdBy,
    });
  }

  // Contract Templates
  async createContractTemplate(
    companyId: string,
    data: Partial<ContractTemplate>,
  ): Promise<ContractTemplate> {
    if (data.isDefault) {
      await this.contractTemplateRepository.update(
        { companyId, contractType: data.contractType, isDefault: true },
        { isDefault: false },
      );
    }
    const template = this.contractTemplateRepository.create({
      ...data,
      companyId,
    });
    return this.contractTemplateRepository.save(template);
  }

  async findAllContractTemplates(
    companyId: string,
    filters?: { contractType?: string; isActive?: boolean },
  ): Promise<ContractTemplate[]> {
    const query = this.contractTemplateRepository
      .createQueryBuilder('template')
      .where('template.companyId = :companyId', { companyId })
      .orderBy('template.isDefault', 'DESC')
      .addOrderBy('template.name', 'ASC');

    if (filters?.contractType) {
      query.andWhere('template.contractType = :contractType', {
        contractType: filters.contractType,
      });
    }
    if (filters?.isActive !== undefined) {
      query.andWhere('template.isActive = :isActive', { isActive: filters.isActive });
    }

    return query.getMany();
  }

  async createContractFromTemplate(
    companyId: string,
    templateId: string,
    data: Partial<Contract>,
  ): Promise<Contract> {
    const template = await this.contractTemplateRepository.findOne({
      where: { id: templateId, companyId },
    });
    if (!template) {
      throw new NotFoundException(`Template with ID ${templateId} not found`);
    }

    await this.contractTemplateRepository.update(
      { id: templateId },
      { usageCount: () => 'usageCount + 1' },
    );

    const startDate = data.startDate || new Date();
    const endDate = data.endDate || new Date();
    if (!data.endDate) {
      endDate.setMonth(endDate.getMonth() + template.defaultTermMonths);
    }

    return this.createContract(companyId, {
      ...data,
      templateId,
      contractType: template.contractType,
      clauses: template.clauses.map((c) => ({
        ...c,
        isModified: false,
      })),
      startDate,
      endDate,
      termMonths: template.defaultTermMonths,
    });
  }

  // Contract Clauses Library
  async createClause(
    companyId: string,
    data: Partial<ContractClause>,
  ): Promise<ContractClause> {
    const clause = this.clauseRepository.create({
      ...data,
      companyId,
    });
    return this.clauseRepository.save(clause);
  }

  async findAllClauses(
    companyId: string,
    filters?: { category?: string; clauseType?: string; isActive?: boolean },
  ): Promise<ContractClause[]> {
    const query = this.clauseRepository
      .createQueryBuilder('clause')
      .where('clause.companyId = :companyId', { companyId })
      .orderBy('clause.name', 'ASC');

    if (filters?.category) {
      query.andWhere('clause.category = :category', { category: filters.category });
    }
    if (filters?.clauseType) {
      query.andWhere('clause.clauseType = :clauseType', {
        clauseType: filters.clauseType,
      });
    }
    if (filters?.isActive !== undefined) {
      query.andWhere('clause.isActive = :isActive', { isActive: filters.isActive });
    }

    return query.getMany();
  }

  async updateClause(
    companyId: string,
    id: string,
    data: Partial<ContractClause>,
  ): Promise<ContractClause> {
    const clause = await this.clauseRepository.findOne({
      where: { id, companyId },
    });
    if (!clause) {
      throw new NotFoundException(`Clause with ID ${id} not found`);
    }
    Object.assign(clause, data);
    return this.clauseRepository.save(clause);
  }

  async deleteClause(companyId: string, id: string): Promise<void> {
    const clause = await this.clauseRepository.findOne({
      where: { id, companyId },
    });
    if (!clause) {
      throw new NotFoundException(`Clause with ID ${id} not found`);
    }
    await this.clauseRepository.remove(clause);
  }

  // Helpers
  private async generateProposalNumber(companyId: string): Promise<string> {
    const count = await this.proposalRepository.count({ where: { companyId } });
    const year = new Date().getFullYear();
    return `PR-${year}-${String(count + 1).padStart(5, '0')}`;
  }

  private async generateContractNumber(companyId: string): Promise<string> {
    const count = await this.contractRepository.count({ where: { companyId } });
    const year = new Date().getFullYear();
    return `CT-${year}-${String(count + 1).padStart(5, '0')}`;
  }
}
