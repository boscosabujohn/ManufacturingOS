import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import { Content, ContentStatus, ContentType } from '../entities/content.entity';
import { CreateContentDto } from '../dto/create-content.dto';
import { UpdateContentDto } from '../dto/update-content.dto';

export interface ContentFilters {
  search?: string;
  type?: ContentType;
  status?: ContentStatus;
  tags?: string[];
  authorId?: string;
  categoryId?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(Content)
    private readonly contentRepository: Repository<Content>,
  ) {}

  async findAll(
    filters: ContentFilters = {},
    pagination: PaginationParams = {},
  ): Promise<{ data: Content[]; total: number; page: number; limit: number }> {
    const { search, type, status, authorId, categoryId } = filters;
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC' } = pagination;

    const queryBuilder = this.contentRepository.createQueryBuilder('content');

    if (search) {
      queryBuilder.andWhere(
        '(content.title ILIKE :search OR content.excerpt ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (type) {
      queryBuilder.andWhere('content.type = :type', { type });
    }

    if (status) {
      queryBuilder.andWhere('content.status = :status', { status });
    }

    if (authorId) {
      queryBuilder.andWhere('content.authorId = :authorId', { authorId });
    }

    if (categoryId) {
      queryBuilder.andWhere('content.categoryId = :categoryId', { categoryId });
    }

    queryBuilder.orderBy(`content.${sortBy}`, sortOrder);

    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total, page, limit };
  }

  async findPublished(
    type?: ContentType,
    pagination: PaginationParams = {},
  ): Promise<{ data: Content[]; total: number }> {
    const { page = 1, limit = 10 } = pagination;

    const queryBuilder = this.contentRepository
      .createQueryBuilder('content')
      .where('content.status = :status', { status: ContentStatus.PUBLISHED })
      .andWhere('content.publishedAt <= :now', { now: new Date() });

    if (type) {
      queryBuilder.andWhere('content.type = :type', { type });
    }

    queryBuilder.orderBy('content.publishedAt', 'DESC');
    queryBuilder.skip((page - 1) * limit).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();
    return { data, total };
  }

  async findOne(id: string): Promise<Content> {
    const content = await this.contentRepository.findOne({ where: { id } });
    if (!content) {
      throw new NotFoundException(`Content with ID ${id} not found`);
    }
    return content;
  }

  async findBySlug(slug: string): Promise<Content> {
    const content = await this.contentRepository.findOne({ where: { slug } });
    if (!content) {
      throw new NotFoundException(`Content with slug ${slug} not found`);
    }

    // Increment view count
    await this.contentRepository.increment({ id: content.id }, 'viewCount', 1);
    content.viewCount += 1;

    return content;
  }

  async create(createDto: CreateContentDto): Promise<Content> {
    // Generate slug if not provided
    const slug = createDto.slug || this.generateSlug(createDto.title);

    // Check if slug exists
    const existingContent = await this.contentRepository.findOne({
      where: { slug },
    });
    if (existingContent) {
      throw new ConflictException(`Content with slug "${slug}" already exists`);
    }

    const content = this.contentRepository.create({
      ...createDto,
      slug,
      publishedAt: createDto.status === ContentStatus.PUBLISHED ? new Date() : undefined,
    });

    return this.contentRepository.save(content);
  }

  async update(id: string, updateDto: UpdateContentDto): Promise<Content> {
    const content = await this.findOne(id);

    // Check slug uniqueness if changing
    if (updateDto.slug && updateDto.slug !== content.slug) {
      const existingContent = await this.contentRepository.findOne({
        where: { slug: updateDto.slug },
      });
      if (existingContent) {
        throw new ConflictException(
          `Content with slug "${updateDto.slug}" already exists`,
        );
      }
    }

    // Set publishedAt if publishing for first time
    if (
      updateDto.status === ContentStatus.PUBLISHED &&
      content.status !== ContentStatus.PUBLISHED
    ) {
      updateDto.publishedAt = new Date();
    }

    Object.assign(content, updateDto);
    content.version += 1;

    return this.contentRepository.save(content);
  }

  async publish(id: string): Promise<Content> {
    const content = await this.findOne(id);
    content.status = ContentStatus.PUBLISHED;
    content.publishedAt = new Date();
    return this.contentRepository.save(content);
  }

  async unpublish(id: string): Promise<Content> {
    const content = await this.findOne(id);
    content.status = ContentStatus.DRAFT;
    return this.contentRepository.save(content);
  }

  async archive(id: string): Promise<Content> {
    const content = await this.findOne(id);
    content.status = ContentStatus.ARCHIVED;
    return this.contentRepository.save(content);
  }

  async schedule(id: string, scheduledAt: Date): Promise<Content> {
    const content = await this.findOne(id);
    content.status = ContentStatus.SCHEDULED;
    content.scheduledAt = scheduledAt;
    return this.contentRepository.save(content);
  }

  async remove(id: string): Promise<void> {
    const content = await this.findOne(id);
    await this.contentRepository.remove(content);
  }

  async getByTags(tags: string[], limit: number = 10): Promise<Content[]> {
    return this.contentRepository
      .createQueryBuilder('content')
      .where('content.status = :status', { status: ContentStatus.PUBLISHED })
      .andWhere('content.tags && ARRAY[:...tags]', { tags })
      .orderBy('content.publishedAt', 'DESC')
      .take(limit)
      .getMany();
  }

  async getRelated(id: string, limit: number = 5): Promise<Content[]> {
    const content = await this.findOne(id);

    if (!content.tags || content.tags.length === 0) {
      return [];
    }

    return this.contentRepository
      .createQueryBuilder('content')
      .where('content.id != :id', { id })
      .andWhere('content.status = :status', { status: ContentStatus.PUBLISHED })
      .andWhere('content.type = :type', { type: content.type })
      .andWhere('content.tags && ARRAY[:...tags]', { tags: content.tags })
      .orderBy('content.publishedAt', 'DESC')
      .take(limit)
      .getMany();
  }

  async incrementShareCount(id: string): Promise<void> {
    await this.contentRepository.increment({ id }, 'shareCount', 1);
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 100);
  }
}
