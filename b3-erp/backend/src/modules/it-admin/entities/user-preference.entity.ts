import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('user_preferences')
export class UserPreference {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    userId: string;

    @Column({ default: 'light' }) // light, dark, glass
    theme: string;

    @Column({ default: 'relaxed' }) // compact, relaxed
    density: string;

    @Column({ default: true })
    sidebarOpen: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
