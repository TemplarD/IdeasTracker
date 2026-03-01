import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Idea } from '../ideas/idea.entity';
import { Team } from '../teams/team.entity';

export enum InvestmentStatus {
  PROPOSED = 'proposed',
  DISCUSSION = 'discussion',
  AGREED = 'agreed',
  COMPLETED = 'completed',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}

@Entity('investments')
export class Investment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  sharePercent: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  authorPercent: number;

  @Column({ type: 'text', nullable: true })
  terms: string;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @Column({ type: 'enum', enum: InvestmentStatus, default: InvestmentStatus.PROPOSED })
  status: InvestmentStatus;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'investor_id' })
  investor: User;

  @Column({ name: 'investor_id' })
  investorId: string;

  @ManyToOne(() => Idea, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idea_id' })
  idea: Idea;

  @Column({ name: 'idea_id', nullable: true })
  ideaId: string;

  @ManyToOne(() => Team, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'team_id' })
  team: Team;

  @Column({ name: 'team_id', nullable: true })
  teamId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
