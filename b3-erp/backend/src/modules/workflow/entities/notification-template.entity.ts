
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('notification_templates')
@Index(['code', 'channel'], { unique: true })
export class NotificationTemplate {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    code: string; // e.g., 'APPROVAL_REQUESTED', 'ORDER_CONFIRMED'

    @Column()
    channel: 'email' | 'sms' | 'push' | 'in_app';

    @Column({ nullable: true })
    subjectTemplate: string; // Handlebars or simple string replacement

    @Column({ type: 'text' })
    bodyTemplate: string;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
