import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationPreference } from '../entities/notification-preference.entity';
import { CreateNotificationPreferenceDto } from '../dto/create-notification-preference.dto';
import { UpdateNotificationPreferenceDto } from '../dto/update-notification-preference.dto';

@Injectable()
export class NotificationPreferenceService {
  constructor(
    @InjectRepository(NotificationPreference)
    private readonly repository: Repository<NotificationPreference>,
  ) {}

  async create(
    createDto: CreateNotificationPreferenceDto,
    createdBy?: string,
  ): Promise<NotificationPreference> {
    // Check if preference already exists
    const existing = await this.repository.findOne({
      where: { userId: createDto.userId, category: createDto.category },
    });

    if (existing) {
      throw new ConflictException(
        `Preference for category ${createDto.category} already exists`,
      );
    }

    const preference = this.repository.create({
      ...createDto,
      createdBy,
    });

    return await this.repository.save(preference);
  }

  async findAll(userId: string): Promise<NotificationPreference[]> {
    return await this.repository.find({
      where: { userId },
      order: { category: 'ASC' },
    });
  }

  async findOne(userId: string, category: string): Promise<NotificationPreference> {
    const preference = await this.repository.findOne({
      where: { userId, category },
    });

    if (!preference) {
      throw new NotFoundException(
        `Preference for category ${category} not found`,
      );
    }

    return preference;
  }

  async update(
    userId: string,
    category: string,
    updateDto: UpdateNotificationPreferenceDto,
    updatedBy?: string,
  ): Promise<NotificationPreference> {
    const preference = await this.findOne(userId, category);

    Object.assign(preference, updateDto, { updatedBy });

    return await this.repository.save(preference);
  }

  async upsert(
    userId: string,
    category: string,
    data: UpdateNotificationPreferenceDto,
    updatedBy?: string,
  ): Promise<NotificationPreference> {
    try {
      return await this.update(userId, category, data, updatedBy);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return await this.create(
          { userId, category, ...data } as CreateNotificationPreferenceDto,
          updatedBy,
        );
      }
      throw error;
    }
  }

  async isEnabled(
    userId: string,
    category: string,
  ): Promise<boolean> {
    try {
      const preference = await this.findOne(userId, category);
      return preference.enabled;
    } catch (error) {
      // If no preference found, return true (enabled by default)
      return true;
    }
  }

  async remove(userId: string, category: string): Promise<void> {
    const preference = await this.findOne(userId, category);
    await this.repository.remove(preference);
  }
}
