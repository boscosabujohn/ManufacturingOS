import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

export enum ContentStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
  SCHEDULED = 'scheduled',
}

export enum ContentType {
  BLOG_POST = 'blog_post',
  PAGE = 'page',
  ANNOUNCEMENT = 'announcement',
  CASE_STUDY = 'case_study',
  DOCUMENTATION = 'documentation',
}

@Entity('cms_contents')
export class Content {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ length: 255, unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  excerpt: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'jsonb', nullable: true })
  contentJson: Record<string, unknown>;

  @Column({
    type: 'enum',
    enum: ContentType,
    default: ContentType.BLOG_POST,
  })
  type: ContentType;

  @Column({
    type: 'enum',
    enum: ContentStatus,
    default: ContentStatus.DRAFT,
  })
  status: ContentStatus;

  @Column({ nullable: true })
  featuredImage: string;

  @Column({ type: 'simple-array', nullable: true })
  tags: string[];

  @Column({ nullable: true })
  categoryId: string;

  @Column({ nullable: true })
  authorId: string;

  @Column({ nullable: true })
  authorName: string;

  // SEO Fields
  @Column({ length: 160, nullable: true })
  metaTitle: string;

  @Column({ length: 320, nullable: true })
  metaDescription: string;

  @Column({ type: 'simple-array', nullable: true })
  metaKeywords: string[];

  @Column({ nullable: true })
  canonicalUrl: string;

  @Column({ default: true })
  indexable: boolean;

  // Publishing
  @Column({ type: 'timestamp', nullable: true })
  publishedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  scheduledAt: Date;

  // Analytics
  @Column({ default: 0 })
  viewCount: number;

  @Column({ default: 0 })
  shareCount: number;

  // Versioning
  @Column({ default: 1 })
  version: number;

  @Column({ nullable: true })
  parentVersionId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
