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

export enum CycleCountStatus {
    SCHEDULED = 'Scheduled',
    IN_PROGRESS = 'In Progress',
    COMPLETED = 'Completed',
    CANCELLED = 'Cancelled',
}

@Entity('cycle_count_plans')
export class CycleCountPlan {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, length: 50 })
    planNumber: string;

    @Column({ length: 255 })
    title: string;

    @Column({
        type: 'enum',
        enum: CycleCountStatus,
        default: CycleCountStatus.SCHEDULED,
    })
    status: CycleCountStatus;

    @Column({ type: 'date' })
    scheduledDate: Date;

    @Column({ type: 'varchar', nullable: true })
    warehouseId: string;

    @Column({ length: 255, nullable: true })
    warehouseName: string;

    @Column({ type: 'varchar', nullable: true })
    locationId: string;

    @Column({ length: 10, nullable: true })
    abcClass: string; // A, B, C scope

    @Column({ type: 'json', nullable: true })
    itemGroups: string[];

    @Column({ type: 'text', nullable: true })
    remarks: string;

    @Column({ type: 'varchar', nullable: true })
    assignedTo: string;

    @Column({ type: 'varchar', nullable: true })
    adjustmentId: string; // Reference to the StockAdjustment created

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => CycleCountItem, (item) => item.plan, { cascade: true })
    items: CycleCountItem[];
}

@Entity('cycle_count_items')
export class CycleCountItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    planId: string;

    @Column()
    itemId: string;

    @Column({ length: 100 })
    itemCode: string;

    @Column({ length: 255 })
    itemName: string;

    @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
    systemQuantity: number;

    @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true })
    actualQuantity: number;

    @Column({ type: 'timestamp', nullable: true })
    countedAt: Date;

    @Column({ default: false })
    isCounted: boolean;

    @Column({ type: 'text', nullable: true })
    remarks: string;

    @ManyToOne(() => CycleCountPlan, (plan) => plan.items)
    @JoinColumn({ name: 'planId' })
    plan: CycleCountPlan;
}
