
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('notification_preferences')
@Index(['userId', 'channel'], { unique: true })
export class NotificationPreference {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string;

    @Column()
    channel: 'email' | 'sms' | 'push' | 'in_app';

    @Column({ default: true })
    enabled: boolean;

    @Column({ type: 'jsonb', nullable: true })
    settings: Record<string, any>; // e.g., specific types to mute

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
