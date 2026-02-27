import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { CreateCommentDto, UpdateCommentDto, VoteCommentDto } from './comment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('comments')
@Controller('ideas/:ideaId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Добавить комментарий к идее' })
  async create(
    @Request() req,
    @Param('ideaId') ideaId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentsService.create(ideaId, req.user.userId, createCommentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить все комментарии идеи' })
  async findByIdea(@Param('ideaId') ideaId: string) {
    return this.commentsService.findByIdea(ideaId);
  }

  @Patch(':commentId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить комментарий' })
  async update(
    @Request() req,
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentsService.update(commentId, req.user.userId, updateCommentDto);
  }

  @Delete(':commentId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удалить комментарий' })
  async remove(@Request() req, @Param('commentId') commentId: string) {
    await this.commentsService.remove(commentId, req.user.userId);
    return { message: 'Комментарий успешно удален' };
  }

  @Post(':commentId/vote')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Проголосовать за комментарий' })
  async vote(
    @Request() req,
    @Param('commentId') commentId: string,
    @Body() voteCommentDto: VoteCommentDto,
  ) {
    await this.commentsService.vote(commentId, req.user.userId, voteCommentDto.value);
    return { message: 'Голос учтен' };
  }
}
