import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProgressService } from './progress.service';
import { CreateProgressDto } from './progress.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('progress')
@Controller('teams/:teamId/progress')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Post()
  @ApiOperation({ summary: 'Добавить запись о прогрессе' })
  async create(
    @Request() req: any,
    @Param('teamId') teamId: string,
    @Body() createProgressDto: CreateProgressDto,
  ) {
    return this.progressService.create(teamId, req.user.userId, createProgressDto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить весь прогресс команды' })
  async findByTeam(@Param('teamId') teamId: string) {
    return this.progressService.findByTeam(teamId);
  }

  @Delete(':progressId')
  @ApiOperation({ summary: 'Удалить запись о прогрессе' })
  async remove(
    @Request() req: any,
    @Param('teamId') teamId: string,
    @Param('progressId') progressId: string,
  ) {
    await this.progressService.remove(progressId, req.user.userId);
    return { message: 'Запись удалена' };
  }
}
