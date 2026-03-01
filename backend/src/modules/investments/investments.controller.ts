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
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { InvestmentsService } from './investments.service';
import { CreateInvestmentDto, UpdateInvestmentDto } from './investment.dto';
import { InvestmentStatus } from './investment.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('investments')
@Controller('investments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class InvestmentsController {
  constructor(private readonly investmentsService: InvestmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Создать заявку на инвестирование' })
  async create(@Request() req: any, @Body() createDto: CreateInvestmentDto) {
    return this.investmentsService.create(req.user.userId, createDto);
  }

  @Get('my')
  @ApiOperation({ summary: 'Получить мои инвестиции' })
  async findMyInvestments(@Request() req: any) {
    return this.investmentsService.findByInvestor(req.user.userId);
  }

  @Get('idea/:ideaId')
  @ApiOperation({ summary: 'Получить инвестиции идеи' })
  async findByIdea(@Param('ideaId') ideaId: string) {
    return this.investmentsService.findByIdea(ideaId);
  }

  @Get('team/:teamId')
  @ApiOperation({ summary: 'Получить инвестиции команды' })
  async findByTeam(@Param('teamId') teamId: string) {
    return this.investmentsService.findByTeam(teamId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить инвестицию по ID' })
  async findOne(@Param('id') id: string) {
    return this.investmentsService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить инвестицию' })
  async update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updateDto: UpdateInvestmentDto,
  ) {
    return this.investmentsService.update(id, updateDto, req.user.userId);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Обновить статус инвестиции' })
  @ApiQuery({ name: 'status', enum: InvestmentStatus })
  async updateStatus(
    @Request() req: any,
    @Param('id') id: string,
    @Query('status') status: InvestmentStatus,
  ) {
    return this.investmentsService.updateStatus(id, status, req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить инвестицию' })
  async remove(@Request() req: any, @Param('id') id: string) {
    await this.investmentsService.remove(id, req.user.userId);
    return { message: 'Инвестиция удалена' };
  }
}
