import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    Index,
    OneToMany,
} from 'typeorm';
import { QualityGateItem } from './quality-gate-item.entity';
import { Defect } from './defect.entity';

@Entity('quality_gates')
@Index(['projectId', 'phase'])
@Index(['status'])
export class QualityGate {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @Index()
    projectId: string;

    @Column({ type: 'int' })
    phase: number; // Which phase this gate belongs to

    @Column()
    gateType: 'material_qa' | 'production_qc' | 'final_qc' | 'installation_review';

    @Column({ nullable: true })
    checklistTemplateId: string;

    @Column({ nullable: true })
    inspectorId: string;

    @Column({ default: 'pending' })
    @Index()
    status: 'pending' | 'in_progress' | 'passed' | 'failed';

    @Column({ type: 'timestamp', nullable: true })
    inspectionDate: Date;

    @Column({ nullable: true })
    passed: boolean;

    @Column({ type: 'text', nullable: true })
    comments: string;

    @Column({ type: 'jsonb', nullable: true })
    metadata: Record<string, any>;

    @OneToMany(() => QualityGateItem, (item) => item.qualityGate, { eager: true })
    items: QualityGateItem[];

    @OneToMany(() => Defect, (defect) => defect.qualityGate)
    defects: Defect[];

    @CreateDateColumn()
    createdAt: Date;
}
