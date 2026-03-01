import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { CreateCommentDto, UpdateCommentDto, CommentResponseDto } from './comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
  ) {}

  async create(
    ideaId: string,
    userId: string,
    createCommentDto: CreateCommentDto,
  ): Promise<CommentResponseDto> {
    // Проверяем существование родительского комментария если есть
    if (createCommentDto.parentId) {
      const parentComment = await this.commentsRepository.findOne({
        where: { id: createCommentDto.parentId },
      });

      if (!parentComment) {
        throw new NotFoundException('Родительский комментарий не найден');
      }

      if (parentComment.ideaId !== ideaId) {
        throw new BadRequestException('Нельзя ответить на комментарий к другой идее');
      }
    }

    const comment = this.commentsRepository.create({
      ...createCommentDto,
      ideaId,
      authorId: userId,
    });

    await this.commentsRepository.save(comment);

    return this.toResponse(comment);
  }

  async findByIdea(ideaId: string): Promise<CommentResponseDto[]> {
    const comments = await this.commentsRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.author', 'author')
      .where('comment.ideaId = :ideaId', { ideaId })
      .andWhere('comment.deletedAt IS NULL')
      .orderBy('comment.createdAt', 'ASC')
      .getMany();

    return this.buildTree(comments);
  }

  async update(
    commentId: string,
    userId: string,
    updateCommentDto: UpdateCommentDto,
  ): Promise<CommentResponseDto> {
    const comment = await this.commentsRepository.findOne({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Комментарий не найден');
    }

    if (comment.authorId !== userId) {
      throw new ForbiddenException('Только автор может редактировать комментарий');
    }

    Object.assign(comment, updateCommentDto);
    await this.commentsRepository.save(comment);

    return this.toResponse(comment);
  }

  async remove(commentId: string, userId: string): Promise<void> {
    const comment = await this.commentsRepository.findOne({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Комментарий не найден');
    }

    if (comment.authorId !== userId) {
      throw new ForbiddenException('Только автор может удалять комментарий');
    }

    await this.commentsRepository.softDelete(commentId);
  }

  async vote(commentId: string, userId: string, value: number): Promise<void> {
    const comment = await this.commentsRepository.findOne({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Комментарий не найден');
    }

    // Упрощенная логика голосования
    if (value > 0) {
      comment.likesCount += 1;
    } else {
      comment.dislikesCount += 1;
    }

    await this.commentsRepository.save(comment);
  }

  private buildTree(comments: Comment[]): CommentResponseDto[] {
    const commentMap = new Map<string, CommentResponseDto & { children: CommentResponseDto[] }>();
    const rootComments: CommentResponseDto[] = [];

    comments.forEach((comment) => {
      const commentDto = this.toResponse(comment);
      commentMap.set(comment.id, { ...commentDto, children: [] });
    });

    comments.forEach((comment) => {
      const current = commentMap.get(comment.id)!;
      if (comment.parentId) {
        const parent = commentMap.get(comment.parentId);
        if (parent) {
          parent.children.push(current);
        }
      } else {
        rootComments.push(current);
      }
    });

    return rootComments;
  }

  private toResponse(comment: Comment): CommentResponseDto {
    const { id, content, authorId, parentId, likesCount, dislikesCount, createdAt, updatedAt } = comment;
    return { id, content, authorId, parentId, likesCount, dislikesCount, createdAt, updatedAt };
  }
}
