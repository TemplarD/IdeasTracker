import { IsString, IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ example: 'Отличная идея!' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({ example: 'uuid', description: 'ID родительского комментария' })
  @IsString()
  @IsOptional()
  parentId?: string;
}

export class UpdateCommentDto {
  @ApiPropertyOptional({ example: 'Обновленный текст комментария' })
  @IsString()
  @IsOptional()
  content?: string;
}

export class VoteCommentDto {
  @ApiProperty({ example: 1, description: '1 like, -1 dislike' })
  @IsInt()
  @Min(-1)
  @IsNotEmpty()
  value: number;
}

export class CommentResponseDto {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: 'Отличная идея!' })
  content: string;

  @ApiProperty({ example: 'uuid' })
  authorId: string;

  @ApiPropertyOptional({ example: 'uuid' })
  parentId?: string;

  @ApiProperty({ example: 0 })
  likesCount: number;

  @ApiProperty({ example: 0 })
  dislikesCount: number;

  @ApiProperty({ example: '2024-01-01T00:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00Z' })
  updatedAt: Date;

  @ApiProperty({ type: [CommentResponseDto], required: false })
  children?: CommentResponseDto[];
}
