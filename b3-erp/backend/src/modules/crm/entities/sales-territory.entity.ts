import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('crm_sales_territories')
export class SalesTerritory {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    country: string;

    @Column({ nullable: true })
    state: string;

    @Column({ nullable: true })
    city: string;

    @Column({ nullable: true })
    assignedUserId: string;

    @Column({ nullable: true })
    assignedTeamId: string;

    @Column({ default: 0 })
    priority: number;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
