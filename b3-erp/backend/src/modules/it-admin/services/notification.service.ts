import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Notification, NotificationStatus } from '../entities/notification.entity';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { NotificationQueryDto } from '../dto/notification-query.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly repository: Repository<Notification>,
  ) {}

  async create(
    createDto: CreateNotificationDto,
    createdBy?: string,
  ): Promise<Notification[]> {
    const notifications: Notification[] = [];

    for (const userId of createDto.userIds) {
      const notification = this.repository.create({
        ...createDto,
        userId,
        createdBy,
        sentAt: new Date(),
      });

      const saved = await this.repository.save(notification);
      notifications.push(saved);
    }

    return notifications;
  }

  async findAll(
    userId: string,
    query: NotificationQueryDto,
  ): Promise<{
    data: Notification[];
    total: number;
    unread: number;
    page: number;
    limit: number;
    pages: number;
  }> {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const queryBuilder = this.repository
      .createQueryBuilder('notification')
      .where('notification.userId = :userId', { userId });

    if (query.type) {
      queryBuilder.andWhere('notification.type = :type', { type: query.type });
    }

    if (query.priority) {
      queryBuilder.andWhere('notification.priority = :priority', {
        priority: query.priority,
      });
    }

    if (query.status) {
      queryBuilder.andWhere('notification.status = :status', {
        status: query.status,
      });
    }

    if (query.category) {
      queryBuilder.andWhere('notification.category = :category', {
        category: query.category,
      });
    }

    if (query.module) {
      queryBuilder.andWhere('notification.module = :module', {
        module: query.module,
      });
    }

    if (query.isRead !== undefined) {
      queryBuilder.andWhere('notification.isRead = :isRead', {
        isRead: query.isRead,
      });
    }

    const [data, total] = await queryBuilder
      .orderBy('notification.isPinned', 'DESC')
      .addOrderBy('notification.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    const unread = await this.repository.count({
      where: { userId, isRead: false },
    });

    return {
      data,
      total,
      unread,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string, userId: string): Promise<Notification> {
    const notification = await this.repository.findOne({
      where: { id, userId },
    });

    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }

    return notification;
  }

  async markAsRead(id: string, userId: string): Promise<Notification> {
    const notification = await this.findOne(id, userId);

    notification.isRead = true;
    notification.readAt = new Date();
    notification.status = NotificationStatus.READ;

    return await this.repository.save(notification);
  }

  async markAsUnread(id: string, userId: string): Promise<Notification> {
    const notification = await this.findOne(id, userId);

    notification.isRead = false;
    notification.readAt = null as unknown as Date;
    notification.status = NotificationStatus.UNREAD;

    return await this.repository.save(notification);
  }

  async markAllAsRead(userId: string): Promise<{ affected: number }> {
    const result = await this.repository.update(
      { userId, isRead: false },
      {
        isRead: true,
        readAt: new Date(),
        status: NotificationStatus.READ,
      },
    );

    return { affected: result.affected || 0 };
  }

  async archive(id: string, userId: string): Promise<Notification> {
    const notification = await this.findOne(id, userId);

    notification.isArchived = true;
    notification.archivedAt = new Date();
    notification.status = NotificationStatus.ARCHIVED;

    return await this.repository.save(notification);
  }

  async unarchive(id: string, userId: string): Promise<Notification> {
    const notification = await this.findOne(id, userId);

    notification.isArchived = false;
    notification.archivedAt = null as unknown as Date;
    notification.status = notification.isRead
      ? NotificationStatus.READ
      : NotificationStatus.UNREAD;

    return await this.repository.save(notification);
  }

  async pin(id: string, userId: string): Promise<Notification> {
    const notification = await this.findOne(id, userId);
    notification.isPinned = true;
    return await this.repository.save(notification);
  }

  async unpin(id: string, userId: string): Promise<Notification> {
    const notification = await this.findOne(id, userId);
    notification.isPinned = false;
    return await this.repository.save(notification);
  }

  async bulkDelete(ids: string[], userId: string): Promise<{ affected: number }> {
    const result = await this.repository.update(
      { id: In(ids), userId },
      { status: NotificationStatus.DELETED },
    );

    return { affected: result.affected || 0 };
  }

  async getUnreadCount(userId: string): Promise<number> {
    return await this.repository.count({
      where: { userId, isRead: false },
    });
  }

  async deleteOld(userId: string, days: number = 90): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const result = await this.repository.delete({
      userId,
      createdAt: In([cutoffDate]),
      isRead: true,
      isArchived: true,
    });

    return result.affected || 0;
  }

  async remove(id: string, userId: string): Promise<void> {
    const notification = await this.findOne(id, userId);
    await this.repository.remove(notification);
  }
}
