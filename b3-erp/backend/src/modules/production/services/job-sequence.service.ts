import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobSequence, SequenceStatus, SequencingRule } from '../entities/job-sequence.entity';

@Injectable()
export class JobSequenceService {
  constructor(
    @InjectRepository(JobSequence)
    private readonly jobSequenceRepository: Repository<JobSequence>,
  ) {}

  async create(createDto: Partial<JobSequence>): Promise<JobSequence> {
    const sequence = this.jobSequenceRepository.create(createDto);
    return this.jobSequenceRepository.save(sequence);
  }

  async findAll(filters?: {
    companyId?: string;
    status?: SequenceStatus;
    workCenterId?: string;
  }): Promise<JobSequence[]> {
    const query = this.jobSequenceRepository.createQueryBuilder('sequence');

    if (filters?.companyId) {
      query.andWhere('sequence.companyId = :companyId', { companyId: filters.companyId });
    }

    if (filters?.status) {
      query.andWhere('sequence.status = :status', { status: filters.status });
    }

    if (filters?.workCenterId) {
      query.andWhere('sequence.workCenterId = :workCenterId', { workCenterId: filters.workCenterId });
    }

    query.orderBy('sequence.createdAt', 'DESC');
    return query.getMany();
  }

  async findOne(id: string): Promise<JobSequence> {
    const sequence = await this.jobSequenceRepository.findOne({ where: { id } });
    if (!sequence) {
      throw new NotFoundException(`Job Sequence with ID ${id} not found`);
    }
    return sequence;
  }

  async update(id: string, updateDto: Partial<JobSequence>): Promise<JobSequence> {
    const sequence = await this.findOne(id);
    Object.assign(sequence, updateDto);
    return this.jobSequenceRepository.save(sequence);
  }

  async remove(id: string): Promise<void> {
    const sequence = await this.findOne(id);
    if (sequence.status !== 'pending') {
      throw new BadRequestException('Only pending sequences can be deleted');
    }
    await this.jobSequenceRepository.remove(sequence);
  }

  async optimize(id: string, rule: SequencingRule): Promise<JobSequence> {
    const sequence = await this.findOne(id);

    if (!sequence.jobs || sequence.jobs.length === 0) {
      throw new BadRequestException('No jobs to sequence');
    }

    // Sort jobs based on sequencing rule
    const sortedJobs = [...sequence.jobs];

    switch (rule) {
      case 'spt':
        sortedJobs.sort((a, b) => a.processingTime - b.processingTime);
        break;
      case 'edd':
        sortedJobs.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
        break;
      case 'fifo':
        sortedJobs.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
        break;
      case 'critical_ratio':
        sortedJobs.sort((a, b) => a.criticalRatio - b.criticalRatio);
        break;
      case 'slack':
        sortedJobs.sort((a, b) => a.slack - b.slack);
        break;
      case 'priority':
        sortedJobs.sort((a, b) => b.priority - a.priority);
        break;
    }

    // Update sequence numbers
    sortedJobs.forEach((job, index) => {
      job.sequenceNumber = index + 1;
    });

    sequence.jobs = sortedJobs;
    sequence.sequencingRule = rule;

    // Calculate metrics
    let currentTime = 0;
    let totalFlowTime = 0;
    let totalLateness = 0;
    let jobsOnTime = 0;
    let jobsLate = 0;

    sortedJobs.forEach((job) => {
      currentTime += job.processingTime + job.setupTime;
      totalFlowTime += currentTime;
      const dueTime = new Date(job.dueDate).getTime();
      const lateness = currentTime * 60 * 1000 - dueTime + Date.now();
      if (lateness > 0) {
        jobsLate++;
        totalLateness += lateness / (60 * 1000); // Convert to minutes
      } else {
        jobsOnTime++;
      }
    });

    sequence.makespan = currentTime;
    sequence.averageFlowTime = sortedJobs.length > 0 ? totalFlowTime / sortedJobs.length : 0;
    sequence.averageLateness = sortedJobs.length > 0 ? totalLateness / sortedJobs.length : 0;
    sequence.jobsOnTime = jobsOnTime;
    sequence.jobsLate = jobsLate;

    return this.jobSequenceRepository.save(sequence);
  }
}
