import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type ChannelType = 'direct' | 'group' | 'department' | 'project' | 'shift' | 'broadcast';
export type MessageType = 'text' | 'file' | 'image' | 'voice' | 'system' | 'alert';
export type MessageStatus = 'sent' | 'delivered' | 'read';

@Entity('team_messages')
export class TeamMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyId: string;

  @Column()
  channelId: string;

  @Column({ type: 'varchar', length: 50 })
  channelType: ChannelType;

  @Column({ type: 'varchar', nullable: true })
  channelName: string;

  @Column()
  senderId: string;

  @Column()
  senderName: string;

  @Column({ type: 'varchar', nullable: true })
  senderAvatar: string;

  @Column({ type: 'varchar', length: 20 })
  messageType: MessageType;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'jsonb', nullable: true })
  attachments: {
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
  }[];

  @Column({ type: 'jsonb', nullable: true })
  mentions: {
    userId: string;
    userName: string;
    position: number;
  }[];

  @Column({ type: 'jsonb', nullable: true })
  reactions: {
    emoji: string;
    userId: string;
    userName: string;
    reactedAt: Date;
  }[];

  @Column({ type: 'varchar', nullable: true })
  replyToId: string;

  @Column({ type: 'varchar', nullable: true })
  threadId: string;

  @Column({ type: 'int', default: 0 })
  replyCount: number;

  @Column({ type: 'varchar', length: 20, default: 'sent' })
  status: MessageStatus;

  @Column({ type: 'jsonb', nullable: true })
  readBy: {
    userId: string;
    readAt: Date;
  }[];

  @Column({ type: 'boolean', default: false })
  isPinned: boolean;

  @Column({ type: 'boolean', default: false })
  isEdited: boolean;

  @Column({ type: 'timestamp', nullable: true })
  editedAt: Date;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date;

  @Column({ type: 'jsonb', nullable: true })
  metadata: {
    priority?: 'normal' | 'urgent';
    expiresAt?: Date;
    tags?: string[];
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
