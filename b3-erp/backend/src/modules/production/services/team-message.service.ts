import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeamMessage, ChannelType, MessageType, MessageStatus } from '../entities/team-message.entity';

@Injectable()
export class TeamMessageService {
  constructor(
    @InjectRepository(TeamMessage)
    private readonly teamMessageRepository: Repository<TeamMessage>,
  ) {}

  async create(createDto: Partial<TeamMessage>): Promise<TeamMessage> {
    const record = this.teamMessageRepository.create(createDto);
    record.status = 'sent';
    return this.teamMessageRepository.save(record);
  }

  async findAll(filters?: {
    companyId?: string;
    channelId?: string;
    channelType?: ChannelType;
    senderId?: string;
    threadId?: string;
    limit?: number;
    before?: Date;
    after?: Date;
  }): Promise<TeamMessage[]> {
    const query = this.teamMessageRepository.createQueryBuilder('message')
      .where('message.isDeleted = :isDeleted', { isDeleted: false });

    if (filters?.companyId) {
      query.andWhere('message.companyId = :companyId', { companyId: filters.companyId });
    }
    if (filters?.channelId) {
      query.andWhere('message.channelId = :channelId', { channelId: filters.channelId });
    }
    if (filters?.channelType) {
      query.andWhere('message.channelType = :channelType', { channelType: filters.channelType });
    }
    if (filters?.senderId) {
      query.andWhere('message.senderId = :senderId', { senderId: filters.senderId });
    }
    if (filters?.threadId) {
      query.andWhere('message.threadId = :threadId', { threadId: filters.threadId });
    }
    if (filters?.before) {
      query.andWhere('message.createdAt < :before', { before: filters.before });
    }
    if (filters?.after) {
      query.andWhere('message.createdAt > :after', { after: filters.after });
    }

    query.orderBy('message.createdAt', 'DESC');
    if (filters?.limit) {
      query.take(filters.limit);
    }
    return query.getMany();
  }

  async findOne(id: string): Promise<TeamMessage> {
    const record = await this.teamMessageRepository.findOne({ where: { id, isDeleted: false } });
    if (!record) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }
    return record;
  }

  async update(id: string, updateDto: Partial<TeamMessage>, userId: string): Promise<TeamMessage> {
    const record = await this.findOne(id);
    if (record.senderId !== userId) {
      throw new BadRequestException('Cannot edit messages from other users');
    }
    Object.assign(record, updateDto);
    record.isEdited = true;
    record.editedAt = new Date();
    return this.teamMessageRepository.save(record);
  }

  async remove(id: string, userId: string): Promise<void> {
    const record = await this.findOne(id);
    if (record.senderId !== userId) {
      throw new BadRequestException('Cannot delete messages from other users');
    }
    record.isDeleted = true;
    record.deletedAt = new Date();
    await this.teamMessageRepository.save(record);
  }

  async getChannelMessages(channelId: string, options?: {
    limit?: number;
    before?: Date;
    after?: Date;
  }): Promise<TeamMessage[]> {
    return this.findAll({
      channelId,
      limit: options?.limit || 50,
      before: options?.before,
      after: options?.after,
    });
  }

  async markAsRead(messageId: string, userId: string): Promise<TeamMessage> {
    const record = await this.findOne(messageId);
    if (!record.readBy) {
      record.readBy = [];
    }
    if (!record.readBy.find(r => r.userId === userId)) {
      record.readBy.push({ userId, readAt: new Date() });
      record.status = 'read';
    }
    return this.teamMessageRepository.save(record);
  }

  async addReaction(messageId: string, userId: string, userName: string, emoji: string): Promise<TeamMessage> {
    const record = await this.findOne(messageId);
    if (!record.reactions) {
      record.reactions = [];
    }
    const existing = record.reactions.findIndex(r => r.userId === userId && r.emoji === emoji);
    if (existing === -1) {
      record.reactions.push({ emoji, userId, userName, reactedAt: new Date() });
    }
    return this.teamMessageRepository.save(record);
  }

  async removeReaction(messageId: string, userId: string, emoji: string): Promise<TeamMessage> {
    const record = await this.findOne(messageId);
    if (record.reactions) {
      record.reactions = record.reactions.filter(r => !(r.userId === userId && r.emoji === emoji));
    }
    return this.teamMessageRepository.save(record);
  }

  async pinMessage(messageId: string): Promise<TeamMessage> {
    const record = await this.findOne(messageId);
    record.isPinned = true;
    return this.teamMessageRepository.save(record);
  }

  async unpinMessage(messageId: string): Promise<TeamMessage> {
    const record = await this.findOne(messageId);
    record.isPinned = false;
    return this.teamMessageRepository.save(record);
  }

  async getThreadMessages(threadId: string, limit: number = 50): Promise<TeamMessage[]> {
    return this.findAll({ threadId, limit });
  }

  async createReply(parentId: string, replyDto: Partial<TeamMessage>): Promise<TeamMessage> {
    const parent = await this.findOne(parentId);
    const threadId = parent.threadId || parent.id;

    const reply = await this.create({
      ...replyDto,
      replyToId: parentId,
      threadId,
    });

    parent.replyCount = (parent.replyCount || 0) + 1;
    await this.teamMessageRepository.save(parent);

    return reply;
  }

  async getUnreadCount(channelId: string, userId: string, since: Date): Promise<number> {
    return this.teamMessageRepository
      .createQueryBuilder('message')
      .where('message.channelId = :channelId', { channelId })
      .andWhere('message.createdAt > :since', { since })
      .andWhere('message.senderId != :userId', { userId })
      .andWhere('message.isDeleted = :isDeleted', { isDeleted: false })
      .andWhere(`NOT EXISTS (
        SELECT 1 FROM jsonb_array_elements(message."readBy") AS r
        WHERE r->>'userId' = :userId
      )`, { userId })
      .getCount();
  }
}
