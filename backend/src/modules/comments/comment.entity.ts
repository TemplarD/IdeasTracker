import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Tree,
  TreeChildren,
  TreeParent,
  DeleteDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Idea } from '../ideas/idea.entity';

@Entity('comments')
@Tree('closure-table')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => User, (user) => user.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author_id' })
  author: User;

  @Column({ name: 'author_id' })
  authorId: string;

  @ManyToOne(() => Idea, (idea) => idea.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idea_id' })
  idea: Idea;

  @Column({ name: 'idea_id' })
  ideaId: string;

  @TreeParent()
  parent: Comment | null;

  @Column({ nullable: true })
  parentId: string;

  @TreeChildren()
  children: Comment[];

  @Column({ default: 0 })
  likesCount: number;

  @Column({ default: 0 })
  dislikesCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
