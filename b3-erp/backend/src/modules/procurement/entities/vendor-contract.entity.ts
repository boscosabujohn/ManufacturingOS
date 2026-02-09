import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

export enum ContractStatus {
    DRAFT = 'draft',
    PENDING_APPROVAL = 'pending_approval',
    ACTIVE = 'active',
    EXPIRED = 'expired',
    TERMINATED = 'terminated',
    SUSPENDED = 'suspended',
    RENEWED = 'renewed',
}

export enum ContractType {
    FRAMEWORK = 'framework',
    RATE = 'rate',
    QUANTITY = 'quantity',
    VALUE = 'value',
    SERVICE = 'service',
    MAINTENANCE = 'maintenance',
}

@Entity('vendor_contracts')
export class VendorContract {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, length: 50 })
    contractNumber: string;

    @Column({ length: 255 })
    title: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({
        type: 'enum',
        enum: ContractType,
        default: ContractType.FRAMEWORK,
    })
    contractType: ContractType;

    @Column({
        type: 'enum',
        enum: ContractStatus,
        default: ContractStatus.DRAFT,
    })
    status: ContractStatus;

    // Vendor Information
    @Column()
    vendorId: string;

    @Column({ length: 255 })
    vendorName: string;

    @Column({ length: 50, nullable: true })
    vendorCode: string;

    // Contract Period
    @Column({ type: 'timestamp' })
    startDate: Date;

    @Column({ type: 'timestamp' })
    endDate: Date;

    @Column({ type: 'timestamp', nullable: true })
    effectiveDate: Date;

    @Column({ type: 'timestamp', nullable: true })
    terminationDate: Date;

    // Financial Terms
    @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
    totalValue: number;

    @Column({ default: 'INR', length: 3 })
    currency: string;

    @Column({ length: 100, nullable: true })
    paymentTerms: string;

    @Column({ type: 'json', nullable: true })
    items: any[];

    @Column({ type: 'json', nullable: true })
    slaTerms: any[];

    @Column({ type: 'json', nullable: true })
    priceRevisionHistory: any[];

    // Renewal
    @Column({ default: false })
    autoRenewal: boolean;

    @Column({ type: 'int', default: 30 })
    renewalNoticeDays: number;

    @Column({ type: 'text', nullable: true })
    renewalTerms: string;

    // Utilization
    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    totalOrdered: number;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    totalDelivered: number;

    @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
    utilizationPercentage: number;

    // Approval
    @Column({ nullable: true, length: 100 })
    approvedBy: string;

    @Column({ type: 'timestamp', nullable: true })
    approvedAt: Date;

    @Column({ type: 'text', nullable: true })
    approvalNotes: string;

    // Metadata
    @Column({ nullable: true, length: 100 })
    createdBy: string;

    @Column({ nullable: true, length: 100 })
    updatedBy: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
