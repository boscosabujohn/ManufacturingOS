import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity('cms_content_categories')
export class ContentCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 100, unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  parentId: string;

  @ManyToOne(() => ContentCategory, (category) => category.children, {
    nullable: true,
  })
  @JoinColumn({ name: 'parentId' })
  parent: ContentCategory;

  @OneToMany(() => ContentCategory, (category) => category.parent)
  children: ContentCategory[];

  @Column({ default: 0 })
  sortOrder: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  icon: string;

  @Column({ nullable: true })
  color: string;

  // SEO
  @Column({ length: 160, nullable: true })
  metaTitle: string;

  @Column({ length: 320, nullable: true })
  metaDescription: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
