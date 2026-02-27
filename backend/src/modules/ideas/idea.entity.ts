import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Rating } from '../ratings/rating.entity';
import { Comment } from '../comments/comment.entity';

export enum IdeaStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  IN_PROGRESS = 'in_progress',
  IMPLEMENTED = 'implemented',
  CLOSED = 'closed',
}

@Entity('ideas')
export class Idea {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ nullable: true })
  presentationUrl: string;

  @Column({ type: 'simple-array', nullable: true })
  attachments: string[];

  @Column({ type: 'simple-array', default: [] })
  tags: string[];

  @Column({ nullable: true })
  category: string;

  @Column({ type: 'enum', enum: IdeaStatus, default: IdeaStatus.DRAFT })
  status: IdeaStatus;

  @Column({ default: 0 })
  viewsCount: number;

  @Column({ default: 0 })
  averageRating: number;

  @ManyToOne(() => User, (user) => user.ideas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author_id' })
  author: User;

  @Column({ name: 'author_id' })
  authorId: string;

  @OneToMany(() => Rating, (rating) => rating.idea)
  ratings: Rating[];

  @OneToMany(() => Comment, (comment) => comment.idea)
  comments: Comment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
