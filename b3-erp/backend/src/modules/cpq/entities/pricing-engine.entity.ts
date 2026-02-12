import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

// Pricing Rules
@Entity('cpq_pricing_rules')
export class PricingRule {
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
    enum: ['markup', 'markdown', 'fixed_price', 'formula', 'tiered'],
    default: 'markup',
  })
  ruleType: 'markup' | 'markdown' | 'fixed_price' | 'formula' | 'tiered';

  @Column({
    type: 'enum',
    enum: ['product', 'category', 'customer', 'channel', 'global'],
    default: 'product',
  })
  applyTo: 'product' | 'category' | 'customer' | 'channel' | 'global';

  @Column({ type: 'varchar', nullable: true })
  targetId: string;

  @Column({ type: 'json', nullable: true })
  conditions: {
    field: string;
    operator: string;
    value: unknown;
  }[];

  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true })
  value: number;

  @Column({
    type: 'enum',
    enum: ['fixed', 'percentage'],
    default: 'percentage',
  })
  valueType: 'fixed' | 'percentage';

  @Column({ type: 'text', nullable: true })
  formula: string;

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

// Volume Discounts
@Entity('cpq_volume_discounts')
export class VolumeDiscount {
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
    enum: ['quantity', 'value', 'weight'],
    default: 'quantity',
  })
  discountBasis: 'quantity' | 'value' | 'weight';

  @Column({ type: 'varchar', nullable: true })
  productId: string;

  @Column({ type: 'varchar', nullable: true })
  productCategory: string;

  @Column({ type: 'json' })
  tiers: {
    minQuantity: number;
    maxQuantity?: number;
    discountPercentage?: number;
    discountAmount?: number;
    unitPrice?: number;
  }[];

  @Column({ default: false })
  isCumulative: boolean;

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

// Customer-Specific Pricing
@Entity('cpq_customer_pricing')
export class CustomerPricing {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyId: string;

  @Column()
  customerId: string;

  @Column({ type: 'varchar', nullable: true })
  customerName: string;

  @Column({ type: 'varchar', nullable: true })
  productId: string;

  @Column({ type: 'varchar', nullable: true })
  productCategory: string;

  @Column({
    type: 'enum',
    enum: ['fixed_price', 'discount_percentage', 'cost_plus'],
    default: 'discount_percentage',
  })
  pricingType: 'fixed_price' | 'discount_percentage' | 'cost_plus';

  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true })
  value: number;

  @Column({ default: 'USD' })
  currency: string;

  @Column({ type: 'int', default: 0 })
  priority: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', nullable: true })
  effectiveFrom: Date;

  @Column({ type: 'timestamp', nullable: true })
  effectiveUntil: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'varchar', nullable: true })
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// Contract Pricing
@Entity('cpq_contract_pricing')
export class ContractPricing {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyId: string;

  @Column()
  contractId: string;

  @Column({ type: 'varchar', nullable: true })
  contractNumber: string;

  @Column()
  customerId: string;

  @Column({ type: 'varchar', nullable: true })
  productId: string;

  @Column({ type: 'varchar', nullable: true })
  productCategory: string;

  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true })
  contractPrice: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  discountPercentage: number;

  @Column({ default: 'USD' })
  currency: string;

  @Column({ type: 'int', nullable: true })
  minimumQuantity: number;

  @Column({ type: 'int', nullable: true })
  maximumQuantity: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  committedVolume: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  utilizedVolume: number;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp' })
  endDate: Date;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'varchar', nullable: true })
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// Promotional Pricing
@Entity('cpq_promotional_pricing')
export class PromotionalPricing {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyId: string;

  @Column()
  promoCode: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ['percentage', 'fixed_amount', 'buy_x_get_y', 'bundle_discount'],
    default: 'percentage',
  })
  promotionType: 'percentage' | 'fixed_amount' | 'buy_x_get_y' | 'bundle_discount';

  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true })
  discountValue: number;

  @Column({ type: 'varchar', nullable: true })
  productId: string;

  @Column({ type: 'varchar', nullable: true })
  productCategory: string;

  @Column({ type: 'varchar', nullable: true })
  bundleId: string;

  @Column({ type: 'json', nullable: true })
  buyXGetY: {
    buyQuantity: number;
    getQuantity: number;
    getProductId?: string;
    discountOnGet: number;
  };

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  minimumOrderValue: number;

  @Column({ type: 'int', nullable: true })
  minimumQuantity: number;

  @Column({ type: 'int', nullable: true })
  maxUsageCount: number;

  @Column({ type: 'int', default: 0 })
  currentUsageCount: number;

  @Column({ type: 'int', nullable: true })
  maxUsagePerCustomer: number;

  @Column({ type: 'json', nullable: true })
  eligibleCustomerIds: string[];

  @Column({ type: 'json', nullable: true })
  eligibleChannels: string[];

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp' })
  endDate: Date;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isStackable: boolean;

  @Column({ type: 'varchar', nullable: true })
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// Dynamic Pricing Rules
@Entity('cpq_dynamic_pricing')
export class DynamicPricingRule {
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
    enum: ['demand_based', 'time_based', 'inventory_based', 'competitor_based', 'custom'],
    default: 'demand_based',
  })
  pricingStrategy: 'demand_based' | 'time_based' | 'inventory_based' | 'competitor_based' | 'custom';

  @Column({ type: 'varchar', nullable: true })
  productId: string;

  @Column({ type: 'varchar', nullable: true })
  productCategory: string;

  @Column({ type: 'json' })
  rules: {
    condition: string;
    operator: string;
    value: unknown;
    adjustment: number;
    adjustmentType: 'percentage' | 'fixed';
  }[];

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  minPriceFloor: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  maxPriceCeiling: number;

  @Column({ type: 'int', nullable: true })
  updateFrequencyMinutes: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastExecutedAt: Date;

  @Column({ type: 'varchar', nullable: true })
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
