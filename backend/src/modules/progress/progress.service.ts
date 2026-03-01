import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Progress } from './progress.entity';
import { CreateProgressDto, ProgressResponseDto } from './progress.dto';
import { Team } from '../teams/team.entity';

@Injectable()
export class ProgressService {
  constructor(
    @InjectRepository(Progress)
    private progressRepository: Repository<Progress>,
    @InjectRepository(Team)
    private teamsRepository: Repository<Team>,
  ) {}

  async create(
    teamId: string,
    userId: string,
    createProgressDto: CreateProgressDto,
  ): Promise<ProgressResponseDto> {
    const team = await this.teamsRepository.findOne({
      where: { id: teamId },
      relations: ['members'],
    });

    if (!team) {
      throw new NotFoundException('Команда не найдена');
    }

    const progress = this.progressRepository.create({
      ...createProgressDto,
      teamId,
      authorId: userId,
    });

    await this.progressRepository.save(progress);
    return this.toResponse(progress);
  }

  async findByTeam(teamId: string): Promise<ProgressResponseDto[]> {
    const progress = await this.progressRepository.find({
      where: { teamId },
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });

    return progress.map((p) => this.toResponse(p));
  }

  async remove(id: string, userId: string): Promise<void> {
    const progress = await this.progressRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!progress) {
      throw new NotFoundException('Запись не найдена');
    }

    if (progress.authorId !== userId) {
      throw new ForbiddenException('Только автор может удалять запись');
    }

    await this.progressRepository.delete(id);
  }

  private toResponse(progress: Progress): ProgressResponseDto {
    const { id, content, teamId, authorId, createdAt } = progress;
    return { id, content, teamId, authorId, createdAt };
  }
}
