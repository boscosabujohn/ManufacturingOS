import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  VendorMessage,
  MessageType,
  MessageStatus,
  MessagePriority,
} from '../entities/vendor-message.entity';

export interface CreateMessageDto {
  companyId: string;
  rfqId: string;
  rfqNumber: string;
  quotationId?: string;
  vendorId: string;
  vendorName: string;
  vendorEmail?: string;
  vendorContactPerson?: string;
  messageType: MessageType;
  priority?: MessagePriority;
  subject: string;
  message: string;
  isOutbound: boolean;
  parentMessageId?: string;
  threadId?: string;
  attachments?: {
    fileName: string;
    fileUrl: string;
    fileSize: number;
    fileType: string;
    uploadedAt: Date;
  }[];
  requiresResponse?: boolean;
  responseDeadline?: Date;
  createdBy: string;
  createdByName: string;
}

export interface MessageFilter {
  companyId: string;
  rfqId?: string;
  vendorId?: string;
  messageType?: MessageType;
  status?: MessageStatus;
  isOutbound?: boolean;
  requiresResponse?: boolean;
  fromDate?: Date;
  toDate?: Date;
  page?: number;
  limit?: number;
}

@Injectable()
export class VendorCollaborationService {
  constructor(
    @InjectRepository(VendorMessage)
    private readonly messageRepo: Repository<VendorMessage>,
  ) {}

  async createMessage(dto: CreateMessageDto): Promise<VendorMessage> {
    const message = this.messageRepo.create({
      ...dto,
      status: MessageStatus.DRAFT,
      priority: dto.priority || MessagePriority.NORMAL,
    });

    // If this is a reply, set the thread ID
    if (dto.parentMessageId && !dto.threadId) {
      const parentMessage = await this.messageRepo.findOne({
        where: { id: dto.parentMessageId },
      });
      if (parentMessage) {
        message.threadId = parentMessage.threadId || parentMessage.id;
      }
    }

    return this.messageRepo.save(message);
  }

  async sendMessage(id: string): Promise<VendorMessage> {
    const message = await this.messageRepo.findOne({ where: { id } });
    if (!message) {
      throw new NotFoundException('Message not found');
    }

    message.status = MessageStatus.SENT;
    message.sentAt = new Date();

    return this.messageRepo.save(message);
  }

  async markAsDelivered(id: string): Promise<VendorMessage> {
    const message = await this.messageRepo.findOne({ where: { id } });
    if (!message) {
      throw new NotFoundException('Message not found');
    }

    message.status = MessageStatus.DELIVERED;
    message.deliveredAt = new Date();

    return this.messageRepo.save(message);
  }

  async markAsRead(id: string): Promise<VendorMessage> {
    const message = await this.messageRepo.findOne({ where: { id } });
    if (!message) {
      throw new NotFoundException('Message not found');
    }

    message.status = MessageStatus.READ;
    message.readAt = new Date();

    return this.messageRepo.save(message);
  }

  async replyToMessage(
    parentMessageId: string,
    replyDto: Omit<CreateMessageDto, 'parentMessageId' | 'threadId' | 'rfqId' | 'rfqNumber' | 'vendorId' | 'vendorName'>,
  ): Promise<VendorMessage> {
    const parentMessage = await this.messageRepo.findOne({
      where: { id: parentMessageId },
    });
    if (!parentMessage) {
      throw new NotFoundException('Parent message not found');
    }

    const reply = await this.createMessage({
      ...replyDto,
      rfqId: parentMessage.rfqId,
      rfqNumber: parentMessage.rfqNumber,
      vendorId: parentMessage.vendorId,
      vendorName: parentMessage.vendorName,
      vendorEmail: parentMessage.vendorEmail,
      parentMessageId,
      threadId: parentMessage.threadId || parentMessage.id,
    });

    // Update parent message status
    parentMessage.status = MessageStatus.REPLIED;
    parentMessage.repliedAt = new Date();
    parentMessage.isResponded = true;
    await this.messageRepo.save(parentMessage);

    return reply;
  }

  async getMessages(filter: MessageFilter): Promise<{
    data: VendorMessage[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { companyId, rfqId, vendorId, messageType, status, isOutbound, requiresResponse, fromDate, toDate, page = 1, limit = 50 } = filter;

    const queryBuilder = this.messageRepo
      .createQueryBuilder('msg')
      .where('msg.companyId = :companyId', { companyId });

    if (rfqId) {
      queryBuilder.andWhere('msg.rfqId = :rfqId', { rfqId });
    }

    if (vendorId) {
      queryBuilder.andWhere('msg.vendorId = :vendorId', { vendorId });
    }

    if (messageType) {
      queryBuilder.andWhere('msg.messageType = :messageType', { messageType });
    }

    if (status) {
      queryBuilder.andWhere('msg.status = :status', { status });
    }

    if (isOutbound !== undefined) {
      queryBuilder.andWhere('msg.isOutbound = :isOutbound', { isOutbound });
    }

    if (requiresResponse !== undefined) {
      queryBuilder.andWhere('msg.requiresResponse = :requiresResponse', { requiresResponse });
    }

    if (fromDate && toDate) {
      queryBuilder.andWhere('msg.createdAt BETWEEN :fromDate AND :toDate', {
        fromDate,
        toDate,
      });
    }

    queryBuilder
      .orderBy('msg.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total, page, limit };
  }

  async getMessageById(id: string): Promise<VendorMessage> {
    const message = await this.messageRepo.findOne({ where: { id } });
    if (!message) {
      throw new NotFoundException('Message not found');
    }
    return message;
  }

  async getThread(threadId: string): Promise<VendorMessage[]> {
    return this.messageRepo.find({
      where: [{ threadId }, { id: threadId }],
      order: { createdAt: 'ASC' },
    });
  }

  async getRfqMessages(rfqId: string): Promise<VendorMessage[]> {
    return this.messageRepo.find({
      where: { rfqId },
      order: { createdAt: 'DESC' },
    });
  }

  async getVendorMessages(vendorId: string, companyId: string): Promise<VendorMessage[]> {
    return this.messageRepo.find({
      where: { vendorId, companyId },
      order: { createdAt: 'DESC' },
    });
  }

  async getPendingResponses(companyId: string): Promise<VendorMessage[]> {
    return this.messageRepo.find({
      where: {
        companyId,
        requiresResponse: true,
        isResponded: false,
      },
      order: { responseDeadline: 'ASC' },
    });
  }

  async getUnreadMessages(companyId: string, isOutbound: boolean): Promise<number> {
    return this.messageRepo.count({
      where: {
        companyId,
        isOutbound,
        status: MessageStatus.SENT,
      },
    });
  }

  async archiveMessage(id: string): Promise<VendorMessage> {
    const message = await this.messageRepo.findOne({ where: { id } });
    if (!message) {
      throw new NotFoundException('Message not found');
    }

    message.status = MessageStatus.ARCHIVED;
    return this.messageRepo.save(message);
  }

  async deleteMessage(id: string): Promise<void> {
    const message = await this.messageRepo.findOne({ where: { id } });
    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.status !== MessageStatus.DRAFT) {
      throw new Error('Only draft messages can be deleted');
    }

    await this.messageRepo.remove(message);
  }
}
