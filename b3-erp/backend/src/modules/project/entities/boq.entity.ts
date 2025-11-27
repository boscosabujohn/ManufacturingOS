
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Project } from './project.entity';
import { BOQItem } from './boq-item.entity';

@Entity('boqs')
export class BOQ {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    projectId: string;

    @ManyToOne(() => Project)
    @JoinColumn({ name: 'projectId' })
    project: Project;

    @Column({ nullable: true })
    name: string;

    @Column({ default: 'draft' })
    status: string; // draft, pending_approval, approved, rejected

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    totalAmount: number;

    @OneToMany(() => BOQItem, item => item.boq, { cascade: true })
    items: BOQItem[];

    @Column({ nullable: true })
    createdBy: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
