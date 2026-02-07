import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Project } from '../../project/entities/project.entity';

export enum OperationType {
    LASER = 'laser',
    BENDING = 'bending',
    ETCHING = 'etching',
    WELDING = 'welding',
    POWDER_COATING = 'powder_coating',
    ASSEMBLY = 'assembly',
}

@Entity('production_logs')
export class ProductionLog {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'project_id' })
    projectId: string;

    @ManyToOne(() => Project)
    @JoinColumn({ name: 'project_id' })
    project: Project;

    @Column({ name: 'machine_id', nullable: true })
    machineId: string;

    @Column({ name: 'operator_id', nullable: true })
    operatorId: string;

    @Column({
        type: 'enum',
        enum: OperationType,
    })
    operationType: OperationType;

    @Column({ name: 'start_time', type: 'timestamp' })
    startTime: Date;

    @Column({ name: 'end_time', type: 'timestamp', nullable: true })
    endTime: Date;

    @Column({ name: 'yield_count', default: 0 })
    yieldCount: number;

    @Column({ name: 'reject_count', default: 0 })
    rejectCount: number;

    @Column({ name: 'idle_reason', nullable: true })
    idleReason: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
