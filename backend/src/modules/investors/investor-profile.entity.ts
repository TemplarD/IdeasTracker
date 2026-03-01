import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Investment } from '../investments/investment.entity';

@Entity('investor_profiles')
export class InvestorProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  budget: number;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ type: 'simple-array', nullable: true })
  interests: string[];

  @Column({ type: 'simple-array', nullable: true })
  preferredCategories: string[];

  @Column({ default: 0 })
  totalInvestments: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  investedAmount: number;

  @OneToMany(() => Investment, (investment) => investment.investor)
  investments: Investment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
