import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Unique,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Idea } from '../ideas/idea.entity';

@Entity('ratings')
@Unique(['user', 'idea'])
export class Rating {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  interest: number;

  @Column()
  benefit: number;

  @Column()
  profitability: number;

  @Column({ type: 'decimal', precision: 3, scale: 2 })
  averageRating: number;

  @ManyToOne(() => User, (user) => user.ratings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => Idea, (idea) => idea.ratings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idea_id' })
  idea: Idea;

  @Column({ name: 'idea_id' })
  ideaId: string;

  @CreateDateColumn()
  createdAt: Date;
}
