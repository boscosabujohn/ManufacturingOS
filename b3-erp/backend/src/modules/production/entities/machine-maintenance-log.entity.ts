import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { WorkCenter } from './work-center.entity';

export enum MaintenanceType {
    PREVENTIVE = 'Preventive',
    BREAKDOWN = 'Breakdown',
    CORRECTIVE = 'Corrective',
    PREDICTIVE = 'Predictive',
    CALIBRATION = 'Calibration',
}

export enum MaintenanceStatus {
    SCHEDULED = 'Scheduled',
    IN_PROGRESS = 'In Progress',
    COMPLETED = 'Completed',
    CANCELLED = 'Cancelled',
    OVERDUE = 'Overdue',
}

@Entity('machine_maintenance_logs')
export class MachineMaintenanceLog {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    workCenterId: string;

    @ManyToOne(() => WorkCenter, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'workCenterId' })
    workCenter: WorkCenter;

    @Column({ length: 100 })
    equipmentCode: string;

    @Column({ length: 255 })
    equipmentName: string;

    @Column({ type: 'enum', enum: MaintenanceType, default: MaintenanceType.PREVENTIVE })
    maintenanceType: MaintenanceType;

    @Column({ type: 'enum', enum: MaintenanceStatus, default: MaintenanceStatus.SCHEDULED })
    status: MaintenanceStatus;

    @Column({ type: 'text' })
    description: string;

    @Column({ type: 'text', nullable: true })
    actionTaken: string;

    @Column({ type: 'timestamp' })
    scheduledDate: Date;

    @Column({ type: 'timestamp', nullable: true })
    startDate: Date;

    @Column({ type: 'timestamp', nullable: true })
    endDate: Date;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    durationHours: number;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    cost: number;

    @Column({ length: 100, nullable: true })
    performedBy: string;

    @Column({ length: 255, nullable: true })
    technicianNotes: string;

    @Column({ type: 'json', nullable: true })
    partsReplaced: {
        itemId: string;
        itemCode: string;
        itemName: string;
        quantity: number;
        unitCost: number;
    }[];

    @Column({ type: 'json', nullable: true })
    customFields: Record<string, any>;

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
