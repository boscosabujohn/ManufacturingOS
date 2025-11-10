import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

export enum CategoryType {
  ITEM = 'Item',
  CUSTOMER = 'Customer',
  VENDOR = 'Vendor',
  ASSET = 'Asset',
  EXPENSE = 'Expense',
}

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  categoryCode: string;

  @Column({ length: 255 })
  categoryName: string;

  @Column({
    type: 'enum',
    enum: CategoryType,
  })
  categoryType: CategoryType;

  @Column({ nullable: true })
  parentCategoryId: string;

  @ManyToOne(() => Category, (category) => category.children, {
    nullable: true,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'parentCategoryId' })
  parentCategory: Category;

  @OneToMany(() => Category, (category) => category.parentCategory)
  children: Category[];

  @Column({ type: 'int', default: 0 })
  level: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'text', nullable: true })
  description: string;

  // Image
  @Column({ length: 500, nullable: true })
  imageUrl: string;

  // Sorting
  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  // Metadata
  @Column({ nullable: true, length: 100 })
  createdBy: string;

  @Column({ nullable: true, length: 100 })
  updatedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Virtual fields
  fullPath?: string;
  itemCount?: number;
}
