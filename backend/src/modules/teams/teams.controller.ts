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
import { TeamsService } from './teams.service';
import { CreateTeamDto, UpdateTeamDto } from './team.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('teams')
@Controller('teams')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  @ApiOperation({ summary: 'Создать новую команду' })
  async create(@Request() req: any, @Body() createTeamDto: CreateTeamDto) {
    return this.teamsService.create(createTeamDto, req.user.userId);
  }

  @Get('idea/:ideaId')
  @ApiOperation({ summary: 'Получить все команды идеи' })
  async findByIdea(@Param('ideaId') ideaId: string) {
    return this.teamsService.findByIdea(ideaId);
  }

  @Get('my')
  @ApiOperation({ summary: 'Получить мои команды' })
  async findMyTeams(@Request() req: any) {
    return this.teamsService.findByUser(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить команду по ID' })
  async findOne(@Param('id') id: string) {
    return this.teamsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить команду' })
  async update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updateTeamDto: UpdateTeamDto,
  ) {
    return this.teamsService.update(id, updateTeamDto, req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить команду' })
  async remove(@Request() req: any, @Param('id') id: string) {
    await this.teamsService.remove(id, req.user.userId);
    return { message: 'Команда успешно удалена' };
  }
}
