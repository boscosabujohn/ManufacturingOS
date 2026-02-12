import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

// Product Catalog
@Entity('cpq_products')
export class CPQProduct {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyId: string;

  @Column()
  sku: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  category: string;

  @Column({ type: 'varchar', nullable: true })
  subCategory: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  basePrice: number;

  @Column({ default: 'USD' })
  currency: string;

  @Column({ type: 'varchar', nullable: true })
  unit: string;

  @Column({ default: true })
  isConfigurable: boolean;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'json', nullable: true })
  images: { url: string; isPrimary: boolean; altText: string }[];

  @Column({ type: 'json', nullable: true })
  specifications: { name: string; value: string; unit?: string }[];

  @Column({ type: 'json', nullable: true })
  attributes: Record<string, unknown>;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  weight: number;

  @Column({ type: 'json', nullable: true })
  dimensions: { length: number; width: number; height: number; unit: string };

  @Column({ type: 'varchar', nullable: true })
  manufacturerId: string;

  @Column({ type: 'varchar', nullable: true })
  manufacturerPartNumber: string;

  @Column({ type: 'int', default: 0 })
  leadTimeDays: number;

  @Column({ type: 'varchar', nullable: true })
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// Product Options & Variants
@Entity('cpq_product_options')
export class ProductOption {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyId: string;

  @Column()
  productId: string;

  @ManyToOne(() => CPQProduct)
  @JoinColumn({ name: 'productId' })
  product: CPQProduct;

  @Column()
  optionGroupName: string;

  @Column()
  optionName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ['single', 'multiple', 'dropdown', 'text', 'number'],
    default: 'single',
  })
  selectionType: 'single' | 'multiple' | 'dropdown' | 'text' | 'number';

  @Column({ default: false })
  isRequired: boolean;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  priceAdjustment: number;

  @Column({
    type: 'enum',
    enum: ['fixed', 'percentage'],
    default: 'fixed',
  })
  priceAdjustmentType: 'fixed' | 'percentage';

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'json', nullable: true })
  validationRules: {
    minValue?: number;
    maxValue?: number;
    pattern?: string;
    allowedValues?: string[];
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// Product Bundles
@Entity('cpq_product_bundles')
export class ProductBundle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyId: string;

  @Column()
  bundleCode: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ['fixed', 'configurable', 'dynamic'],
    default: 'fixed',
  })
  bundleType: 'fixed' | 'configurable' | 'dynamic';

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  basePrice: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  discountPercentage: number;

  @Column({ default: 'USD' })
  currency: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', nullable: true })
  validFrom: Date;

  @Column({ type: 'timestamp', nullable: true })
  validUntil: Date;

  @Column({ type: 'json', nullable: true })
  image: { url: string; altText: string };

  @Column({ type: 'varchar', nullable: true })
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('cpq_bundle_items')
export class BundleItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  bundleId: string;

  @ManyToOne(() => ProductBundle)
  @JoinColumn({ name: 'bundleId' })
  bundle: ProductBundle;

  @Column()
  productId: string;

  @ManyToOne(() => CPQProduct)
  @JoinColumn({ name: 'productId' })
  product: CPQProduct;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ type: 'int', nullable: true })
  minQuantity: number;

  @Column({ type: 'int', nullable: true })
  maxQuantity: number;

  @Column({ default: false })
  isOptional: boolean;

  @Column({ default: false })
  allowQuantityChange: boolean;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  itemDiscountPercentage: number;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @CreateDateColumn()
  createdAt: Date;
}

// Configuration Rules
@Entity('cpq_configuration_rules')
export class ConfigurationRule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyId: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ['inclusion', 'exclusion', 'dependency', 'validation', 'pricing'],
    default: 'inclusion',
  })
  ruleType: 'inclusion' | 'exclusion' | 'dependency' | 'validation' | 'pricing';

  @Column({ type: 'varchar', nullable: true })
  productId: string;

  @Column({ type: 'varchar', nullable: true })
  productCategory: string;

  @Column({ type: 'json' })
  conditions: {
    field: string;
    operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'in' | 'not_in';
    value: unknown;
    logicalOperator?: 'AND' | 'OR';
  }[];

  @Column({ type: 'json' })
  actions: {
    actionType: 'require' | 'exclude' | 'include' | 'set_price' | 'apply_discount' | 'show_message';
    targetType: 'product' | 'option' | 'bundle';
    targetId?: string;
    value?: unknown;
    message?: string;
  }[];

  @Column({ type: 'int', default: 0 })
  priority: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', nullable: true })
  effectiveFrom: Date;

  @Column({ type: 'timestamp', nullable: true })
  effectiveUntil: Date;

  @Column({ type: 'varchar', nullable: true })
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// Compatibility Matrix
@Entity('cpq_compatibility_matrix')
export class CompatibilityRule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyId: string;

  @Column()
  sourceProductId: string;

  @ManyToOne(() => CPQProduct)
  @JoinColumn({ name: 'sourceProductId' })
  sourceProduct: CPQProduct;

  @Column()
  targetProductId: string;

  @ManyToOne(() => CPQProduct)
  @JoinColumn({ name: 'targetProductId' })
  targetProduct: CPQProduct;

  @Column({
    type: 'enum',
    enum: ['compatible', 'incompatible', 'required', 'optional_recommended'],
    default: 'compatible',
  })
  compatibilityType: 'compatible' | 'incompatible' | 'required' | 'optional_recommended';

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'varchar', nullable: true })
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// Visual Configurator State
@Entity('cpq_configurations')
export class ProductConfiguration {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyId: string;

  @Column()
  configurationNumber: string;

  @Column({ type: 'varchar', nullable: true })
  name: string;

  @Column()
  productId: string;

  @ManyToOne(() => CPQProduct)
  @JoinColumn({ name: 'productId' })
  product: CPQProduct;

  @Column({ type: 'varchar', nullable: true })
  customerId: string;

  @Column({ type: 'varchar', nullable: true })
  quoteId: string;

  @Column({ type: 'json' })
  selectedOptions: {
    optionId: string;
    optionName: string;
    value: unknown;
    priceAdjustment: number;
  }[];

  @Column({ type: 'json', nullable: true })
  bundleItems: {
    bundleItemId: string;
    productId: string;
    quantity: number;
    price: number;
  }[];

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  basePrice: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  optionsTotal: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalPrice: number;

  @Column({ default: 'USD' })
  currency: string;

  @Column({
    type: 'enum',
    enum: ['draft', 'valid', 'invalid', 'expired'],
    default: 'draft',
  })
  status: 'draft' | 'valid' | 'invalid' | 'expired';

  @Column({ type: 'json', nullable: true })
  validationErrors: { field: string; message: string }[];

  @Column({ type: 'json', nullable: true })
  visualState: Record<string, unknown>;

  @Column({ type: 'varchar', nullable: true })
  createdBy: string;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
