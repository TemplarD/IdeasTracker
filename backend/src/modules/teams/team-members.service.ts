import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeamMember, MemberStatus } from './team-member.entity';
import { JoinTeamDto, UpdateMemberStatusDto, TeamMemberResponseDto } from './team-member.dto';
import { Team } from './team.entity';

@Injectable()
export class TeamMembersService {
  constructor(
    @InjectRepository(TeamMember)
    private membersRepository: Repository<TeamMember>,
    @InjectRepository(Team)
    private teamsRepository: Repository<Team>,
  ) {}

  async joinTeam(
    teamId: string,
    userId: string,
    joinTeamDto: JoinTeamDto,
  ): Promise<TeamMemberResponseDto> {
    const team = await this.teamsRepository.findOne({
      where: { id: teamId },
      relations: ['members'],
    });

    if (!team) {
      throw new NotFoundException('Команда не найдена');
    }

    const existingMember = await this.membersRepository.findOne({
      where: { teamId, userId },
    });

    if (existingMember) {
      throw new BadRequestException('Вы уже состоите в этой команде');
    }

    const member = this.membersRepository.create({
      teamId,
      userId,
      ...joinTeamDto,
      status: MemberStatus.PENDING,
    });

    await this.membersRepository.save(member);
    return this.toResponse(member);
  }

  async updateStatus(
    teamId: string,
    memberId: string,
    updateDto: UpdateMemberStatusDto,
    userId: string,
  ): Promise<TeamMemberResponseDto> {
    const team = await this.teamsRepository.findOne({ where: { id: teamId } });

    if (!team) {
      throw new NotFoundException('Команда не найдена');
    }

    if (team.leaderId !== userId) {
      throw new ForbiddenException('Только лидер может управлять участниками');
    }

    const member = await this.membersRepository.findOne({
      where: { id: memberId, teamId },
    });

    if (!member) {
      throw new NotFoundException('Участник не найден');
    }

    member.status = updateDto.status;
    await this.membersRepository.save(member);

    return this.toResponse(member);
  }

  async leaveTeam(teamId: string, userId: string): Promise<void> {
    const member = await this.membersRepository.findOne({
      where: { teamId, userId },
    });

    if (!member) {
      throw new NotFoundException('Вы не состоите в этой команде');
    }

    member.status = MemberStatus.LEFT;
    await this.membersRepository.save(member);
  }

  async findByTeam(teamId: string): Promise<TeamMemberResponseDto[]> {
    const members = await this.membersRepository.find({
      where: { teamId },
      relations: ['user'],
    });

    return members.map((m) => this.toResponse(m));
  }

  async findActiveByTeam(teamId: string): Promise<TeamMemberResponseDto[]> {
    const members = await this.membersRepository.find({
      where: { teamId, status: MemberStatus.ACTIVE },
      relations: ['user'],
    });

    return members.map((m) => this.toResponse(m));
  }

  private toResponse(member: TeamMember): TeamMemberResponseDto {
    const { id, teamId, userId, role, bio, status, joinedAt } = member;
    return { id, teamId, userId, role, bio, status, joinedAt };
  }
}
