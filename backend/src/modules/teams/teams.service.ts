import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team, TeamStatus } from './team.entity';
import { CreateTeamDto, UpdateTeamDto, TeamResponseDto } from './team.dto';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private teamsRepository: Repository<Team>,
  ) {}

  async create(
    createTeamDto: CreateTeamDto,
    userId: string,
  ): Promise<TeamResponseDto> {
    const team = this.teamsRepository.create({
      ...createTeamDto,
      leaderId: userId,
    });
    await this.teamsRepository.save(team);
    return this.toResponse(team);
  }

  async findByIdea(ideaId: string): Promise<TeamResponseDto[]> {
    const teams = await this.teamsRepository.find({
      where: { ideaId },
      relations: ['leader', 'members', 'members.user'],
    });
    return teams.map((t) => this.toResponse(t));
  }

  async findOne(id: string): Promise<TeamResponseDto> {
    const team = await this.teamsRepository.findOne({
      where: { id },
      relations: ['leader', 'members', 'members.user', 'progresses'],
    });

    if (!team) {
      throw new NotFoundException('Команда не найдена');
    }

    return this.toResponse(team);
  }

  async update(
    id: string,
    updateTeamDto: UpdateTeamDto,
    userId: string,
  ): Promise<TeamResponseDto> {
    const team = await this.teamsRepository.findOne({ where: { id } });

    if (!team) {
      throw new NotFoundException('Команда не найдена');
    }

    if (team.leaderId !== userId) {
      throw new ForbiddenException('Только лидер может редактировать команду');
    }

    Object.assign(team, updateTeamDto);
    await this.teamsRepository.save(team);

    return this.toResponse(team);
  }

  async remove(id: string, userId: string): Promise<void> {
    const team = await this.teamsRepository.findOne({ where: { id } });

    if (!team) {
      throw new NotFoundException('Команда не найдена');
    }

    if (team.leaderId !== userId) {
      throw new ForbiddenException('Только лидер может удалять команду');
    }

    await this.teamsRepository.delete(id);
  }

  async findByUser(userId: string): Promise<TeamResponseDto[]> {
    const teams = await this.teamsRepository
      .createQueryBuilder('team')
      .leftJoinAndSelect('team.members', 'members')
      .leftJoinAndSelect('team.leader', 'leader')
      .where('team.leaderId = :userId', { userId })
      .orWhere('members.userId = :userId', { userId })
      .getMany();

    return teams.map((t) => this.toResponse(t));
  }

  private toResponse(team: Team): TeamResponseDto {
    const { id, name, description, status, ideaId, leaderId, createdAt, updatedAt } = team;
    return { id, name, description, status, ideaId, leaderId, createdAt, updatedAt };
  }
}
