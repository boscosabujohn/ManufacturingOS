import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('resource_capacity')
export class ResourceCapacity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'user_id' })
    userId: string;

    @Column({ type: 'date' })
    date: Date;

    @Column({ name: 'available_hours', type: 'decimal', precision: 5, scale: 2, default: 8 })
    availableHours: number;

    @Column({ name: 'allocated_hours', type: 'decimal', precision: 5, scale: 2, default: 0 })
    allocatedHours: number;

    @Column({ name: 'utilization_percentage', type: 'decimal', precision: 5, scale: 2, default: 0 })
    utilizationPercentage: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
