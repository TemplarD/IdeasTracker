import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

export enum NotificationType {
  INVESTMENT_PROPOSED = 'investment_proposed',
  INVESTMENT_ACCEPTED = 'investment_accepted',
  INVESTMENT_REJECTED = 'investment_rejected',
  TEAM_JOIN_REQUEST = 'team_join_request',
  TEAM_JOIN_ACCEPTED = 'team_join_accepted',
  PROGRESS_UPDATE = 'progress_update',
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: NotificationType })
  type: NotificationType;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ nullable: true })
  referenceId: string; // ID инвестиции, команды и т.д.

  @Column({ default: false })
  isRead: boolean;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'recipient_id' })
  recipient: User;

  @Column({ name: 'recipient_id' })
  recipientId: string;

  @CreateDateColumn()
  createdAt: Date;
}
