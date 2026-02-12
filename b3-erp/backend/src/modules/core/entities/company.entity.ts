import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('core_companies')
export class Company {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, length: 255 })
    name: string;

    @Column({ unique: true, length: 50 })
    taxId: string; // GSTIN or similar

    @Column({ length: 50, nullable: true })
    registrationNumber: string;

    @Column({ default: 'INR', length: 3 })
    baseCurrency: string;

    @Column({ type: 'date', nullable: true })
    fiscalYearStart: Date | null;

    @Column({ length: 255, nullable: true })
    logoUrl: string;

    @Column({ type: 'text', nullable: true })
    address: string;

    @Column({ length: 100, nullable: true })
    email: string;

    @Column({ length: 20, nullable: true })
    phone: string;

    @Column({ default: true })
    isActive: boolean;

    @Column({ default: false })
    isEliminationEntity: boolean; // For inter-company consolidation

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
