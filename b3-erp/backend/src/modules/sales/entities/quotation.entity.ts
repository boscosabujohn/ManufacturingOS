import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    ManyToOne,
    JoinColumn,
} from 'typeorm';

export enum QuotationStatus {
    DRAFT = 'draft',
    SENT = 'sent',
    UNDER_REVIEW = 'under_review',
    ACCEPTED = 'accepted',
    REJECTED = 'rejected',
    EXPIRED = 'expired',
    CONVERTED = 'converted',
}

export enum MarginStatus {
    HEALTHY = 'healthy',
    WARNING = 'warning',
    CRITICAL = 'critical',
}

@Entity('sales_quotations')
export class Quotation {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    quotationNumber: string;

    @Column({ nullable: true })
    customerId: string;

    @Column()
    customerName: string;

    @Column({ nullable: true })
    contactPerson: string;

    @Column({ type: 'date' })
    quotationDate: Date;

    @Column({ type: 'date' })
    validUntil: Date;

    @Column({
        type: 'enum',
        enum: QuotationStatus,
        default: QuotationStatus.DRAFT,
    })
    status: QuotationStatus;

    @Column({ default: 1 })
    revision: number;

    @Column()
    currency: string;

    @Column({ type: 'decimal', precision: 10, scale: 4, default: 1 })
    exchangeRate: number;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    subtotal: number;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    taxAmount: number;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    discountAmount: number;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    totalAmount: number;

    @Column({
        type: 'enum',
        enum: MarginStatus,
        default: MarginStatus.HEALTHY,
    })
    marginStatus: MarginStatus;

    @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
    overallMarginPercentage: number;

    @Column({ nullable: true })
    paymentTerms: string;

    @Column({ nullable: true })
    deliveryTerms: string;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @Column({ nullable: true })
    assignedUserId: string;

    @Column({ nullable: true })
    convertedToOrderId: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => QuotationItem, (item) => item.quotation, { cascade: true })
    items: QuotationItem[];
}

@Entity('sales_quotation_items')
export class QuotationItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Quotation, (quotation) => quotation.items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'quotationId' })
    quotation: Quotation;

    @Column()
    quotationId: string;

    @Column()
    productId: string;

    @Column()
    productCode: string;

    @Column()
    productName: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'decimal', precision: 15, scale: 4 })
    quantity: number;

    @Column({ type: 'decimal', precision: 15, scale: 2 })
    unitPrice: number;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    unitCost: number;

    @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
    discountPercentage: number;

    @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
    taxRate: number;

    @Column({ type: 'decimal', precision: 15, scale: 2 })
    totalAmount: number;

    @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
    marginPercentage: number;
}
