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
import { TeamMembersService } from './team-members.service';
import { JoinTeamDto, UpdateMemberStatusDto } from './team-member.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('teams')
@Controller('teams/:teamId/members')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TeamMembersController {
  constructor(private readonly membersService: TeamMembersService) {}

  @Post()
  @ApiOperation({ summary: 'Подать заявку на вступление в команду' })
  async joinTeam(
    @Request() req,
    @Param('teamId') teamId: string,
    @Body() joinTeamDto: JoinTeamDto,
  ) {
    return this.membersService.joinTeam(teamId, req.user.userId, joinTeamDto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить всех участников команды' })
  async findByTeam(@Param('teamId') teamId: string) {
    return this.membersService.findByTeam(teamId);
  }

  @Get('active')
  @ApiOperation({ summary: 'Получить активных участников' })
  async findActiveByTeam(@Param('teamId') teamId: string) {
    return this.membersService.findActiveByTeam(teamId);
  }

  @Patch(':memberId/status')
  @ApiOperation({ summary: 'Обновить статус участника (лидер)' })
  async updateStatus(
    @Request() req,
    @Param('teamId') teamId: string,
    @Param('memberId') memberId: string,
    @Body() updateDto: UpdateMemberStatusDto,
  ) {
    return this.membersService.updateStatus(
      teamId,
      memberId,
      updateDto,
      req.user.userId,
    );
  }

  @Delete('leave')
  @ApiOperation({ summary: 'Покинуть команду' })
  async leaveTeam(@Request() req, @Param('teamId') teamId: string) {
    await this.membersService.leaveTeam(teamId, req.user.userId);
    return { message: 'Вы покинули команду' };
  }
}
