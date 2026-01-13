import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proposal, ProposalStatus, ProposalType } from '../entities/proposal.entity';
import { CreateProposalDto } from '../dto/create-proposal.dto';
import { UpdateProposalDto } from '../dto/update-proposal.dto';

export interface ProposalFilters {
  search?: string;
  type?: ProposalType;
  status?: ProposalStatus;
  customerId?: string;
  assignedToId?: string;
  createdById?: string;
}

@Injectable()
export class ProposalService {
  constructor(
    @InjectRepository(Proposal)
    private readonly proposalRepository: Repository<Proposal>,
  ) {}

  async findAll(
    filters: ProposalFilters = {},
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: Proposal[]; total: number }> {
    const { search, type, status, customerId, assignedToId, createdById } = filters;

    const queryBuilder = this.proposalRepository.createQueryBuilder('proposal');

    if (search) {
      queryBuilder.andWhere(
        '(proposal.title ILIKE :search OR proposal.proposalNumber ILIKE :search OR proposal.customerName ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (type) queryBuilder.andWhere('proposal.type = :type', { type });
    if (status) queryBuilder.andWhere('proposal.status = :status', { status });
    if (customerId) queryBuilder.andWhere('proposal.customerId = :customerId', { customerId });
    if (assignedToId) queryBuilder.andWhere('proposal.assignedToId = :assignedToId', { assignedToId });
    if (createdById) queryBuilder.andWhere('proposal.createdById = :createdById', { createdById });

    queryBuilder.orderBy('proposal.createdAt', 'DESC');
    queryBuilder.skip((page - 1) * limit).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();
    return { data, total };
  }

  async findOne(id: string): Promise<Proposal> {
    const proposal = await this.proposalRepository.findOne({ where: { id } });
    if (!proposal) {
      throw new NotFoundException(`Proposal with ID ${id} not found`);
    }
    return proposal;
  }

  async create(createDto: CreateProposalDto): Promise<Proposal> {
    const proposalNumber = await this.generateProposalNumber();
    const proposal = this.proposalRepository.create({
      ...createDto,
      proposalNumber,
    });
    return this.proposalRepository.save(proposal);
  }

  async update(id: string, updateDto: UpdateProposalDto): Promise<Proposal> {
    const proposal = await this.findOne(id);

    if (proposal.status === ProposalStatus.SENT) {
      throw new BadRequestException('Cannot update a sent proposal');
    }

    Object.assign(proposal, updateDto);
    proposal.version += 1;

    return this.proposalRepository.save(proposal);
  }

  async submit(id: string): Promise<Proposal> {
    const proposal = await this.findOne(id);
    proposal.status = ProposalStatus.PENDING_REVIEW;
    return this.proposalRepository.save(proposal);
  }

  async approve(id: string): Promise<Proposal> {
    const proposal = await this.findOne(id);
    if (proposal.status !== ProposalStatus.PENDING_REVIEW) {
      throw new BadRequestException('Proposal must be pending review to approve');
    }
    proposal.status = ProposalStatus.APPROVED;
    return this.proposalRepository.save(proposal);
  }

  async send(id: string): Promise<Proposal> {
    const proposal = await this.findOne(id);
    if (proposal.status !== ProposalStatus.APPROVED) {
      throw new BadRequestException('Proposal must be approved before sending');
    }
    proposal.status = ProposalStatus.SENT;
    proposal.sentAt = new Date();
    return this.proposalRepository.save(proposal);
  }

  async markAccepted(id: string): Promise<Proposal> {
    const proposal = await this.findOne(id);
    proposal.status = ProposalStatus.ACCEPTED;
    proposal.respondedAt = new Date();
    return this.proposalRepository.save(proposal);
  }

  async markRejected(id: string): Promise<Proposal> {
    const proposal = await this.findOne(id);
    proposal.status = ProposalStatus.REJECTED;
    proposal.respondedAt = new Date();
    return this.proposalRepository.save(proposal);
  }

  async duplicate(id: string): Promise<Proposal> {
    const original = await this.findOne(id);
    const proposalNumber = await this.generateProposalNumber();

    const duplicate = this.proposalRepository.create({
      ...original,
      id: undefined,
      proposalNumber,
      title: `Copy of ${original.title}`,
      status: ProposalStatus.DRAFT,
      version: 1,
      parentVersionId: original.id,
      sentAt: null,
      respondedAt: null,
      pdfUrl: null,
      createdAt: undefined,
      updatedAt: undefined,
    });

    return this.proposalRepository.save(duplicate);
  }

  async generatePdf(id: string): Promise<string> {
    const proposal = await this.findOne(id);
    // PDF generation logic would go here
    // For now, return a placeholder URL
    const pdfUrl = `/proposals/${proposal.proposalNumber}.pdf`;
    proposal.pdfUrl = pdfUrl;
    await this.proposalRepository.save(proposal);
    return pdfUrl;
  }

  async remove(id: string): Promise<void> {
    const proposal = await this.findOne(id);
    if (proposal.status === ProposalStatus.SENT || proposal.status === ProposalStatus.ACCEPTED) {
      throw new BadRequestException('Cannot delete sent or accepted proposals');
    }
    await this.proposalRepository.remove(proposal);
  }

  async getDashboardStats(): Promise<{
    total: number;
    draft: number;
    pending: number;
    sent: number;
    accepted: number;
    conversionRate: number;
  }> {
    const [total, draft, pending, sent, accepted] = await Promise.all([
      this.proposalRepository.count(),
      this.proposalRepository.count({ where: { status: ProposalStatus.DRAFT } }),
      this.proposalRepository.count({ where: { status: ProposalStatus.PENDING_REVIEW } }),
      this.proposalRepository.count({ where: { status: ProposalStatus.SENT } }),
      this.proposalRepository.count({ where: { status: ProposalStatus.ACCEPTED } }),
    ]);

    const responded = accepted + await this.proposalRepository.count({
      where: { status: ProposalStatus.REJECTED },
    });

    const conversionRate = responded > 0 ? (accepted / responded) * 100 : 0;

    return { total, draft, pending, sent, accepted, conversionRate };
  }

  private async generateProposalNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.proposalRepository.count();
    return `PROP-${year}-${String(count + 1).padStart(5, '0')}`;
  }
}
