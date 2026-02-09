import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('after_sales_spare_parts')
export class SparePart {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, length: 50 })
    partNumber: string;

    @Column({ length: 255 })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ length: 100, nullable: true })
    category: string;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    price: number;

    @Column({ type: 'int', default: 0 })
    stockLevel: number;

    @Column({ nullable: true })
    imageUrl: string;

    @Column({ type: 'simple-array', nullable: true })
    compatibility: string[];

    @Column({ type: 'int', default: 0 })
    leadTimeDays: number;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
