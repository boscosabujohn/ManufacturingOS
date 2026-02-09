import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

export enum KnowledgeCategory {
    MANUAL = 'Manual',
    FAQ = 'FAQ',
    TROUBLESHOOTING = 'Troubleshooting',
    REPAIR_GUIDE = 'Repair Guide',
    TECHNICAL_SPEC = 'Technical Specification',
}

@Entity('after_sales_knowledge_base')
export class KnowledgeBase {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 255 })
    title: string;

    @Column({ type: 'text' })
    content: string;

    @Column({
        type: 'enum',
        enum: KnowledgeCategory,
        default: KnowledgeCategory.FAQ,
    })
    category: KnowledgeCategory;

    @Column({ type: 'simple-array', nullable: true })
    tags: string[];

    @Column({ nullable: true })
    productModel: string;

    @Column({ nullable: true })
    fileUrl: string;

    @Column({ nullable: true })
    author: string;

    @Column({ type: 'int', default: 0 })
    viewCount: number;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
