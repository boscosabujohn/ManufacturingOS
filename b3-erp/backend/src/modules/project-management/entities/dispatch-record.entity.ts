import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Project } from '../../project/entities/project.entity';

export enum DispatchStatus {
    LOADING = 'loading',
    DISPATCHED = 'dispatched',
    IN_TRANSIT = 'in_transit',
    DELIVERED = 'delivered',
}

@Entity('dispatch_records')
export class DispatchRecord {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'project_id' })
    projectId: string;

    @ManyToOne(() => Project)
    @JoinColumn({ name: 'project_id' })
    project: Project;

    @Column({ name: 'vehicle_no' })
    vehicleNo: string;

    @Column({ name: 'driver_name' })
    driverName: string;

    @Column({ name: 'driver_phone', nullable: true })
    driverPhone: string;

    @Column({
        type: 'enum',
        enum: DispatchStatus,
        default: DispatchStatus.LOADING,
    })
    status: DispatchStatus;

    @Column({ name: 'loading_photos', type: 'jsonb', nullable: true })
    loadingPhotos: string[];

    @Column({ name: 'dispatch_at', type: 'timestamp', nullable: true })
    dispatchedAt: Date;

    @Column({ name: 'delivered_at', type: 'timestamp', nullable: true })
    deliveredAt: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
