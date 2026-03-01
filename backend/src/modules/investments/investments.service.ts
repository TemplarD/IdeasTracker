import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Investment, InvestmentStatus } from './investment.entity';
import { CreateInvestmentDto, UpdateInvestmentDto, InvestmentResponseDto } from './investment.dto';
import { InvestorProfilesService } from '../investors/investor-profiles.service';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../notifications/notification.entity';
import { Idea } from '../ideas/idea.entity';
import { User } from '../users/user.entity';

@Injectable()
export class InvestmentsService {
  constructor(
    @InjectRepository(Investment)
    private investmentsRepository: Repository<Investment>,
    @InjectRepository(Idea)
    private ideasRepository: Repository<Idea>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private investorProfilesService: InvestorProfilesService,
    private notificationsService: NotificationsService,
  ) {}

  async create(
    userId: string,
    createDto: CreateInvestmentDto,
  ): Promise<InvestmentResponseDto> {
    if (!createDto.ideaId && !createDto.teamId) {
      throw new BadRequestException('Укажите ideaId или teamId');
    }

    const investment = this.investmentsRepository.create({
      ...createDto,
      investorId: userId,
    });

    await this.investmentsRepository.save(investment);

    // Создаём уведомление для автора идеи
    if (createDto.ideaId) {
      const idea = await this.ideasRepository.findOne({
        where: { id: createDto.ideaId },
        relations: ['author'],
      });

      if (idea && idea.author) {
        await this.notificationsService.create(
          idea.author.id,
          NotificationType.INVESTMENT_PROPOSED,
          'Новая заявка на инвестирование',
          `Инвестор предложил $${createDto.amount} для вашей идеи "${idea.title}"`,
          investment.id,
        );
      }
    }

    return this.toResponse(investment);
  }

  async findById(id: string): Promise<InvestmentResponseDto> {
    const investment = await this.investmentsRepository.findOne({
      where: { id },
      relations: ['investor', 'idea', 'team'],
    });

    if (!investment) {
      throw new NotFoundException('Инвестиция не найдена');
    }

    return this.toResponse(investment);
  }

  async findByInvestor(userId: string): Promise<InvestmentResponseDto[]> {
    const investments = await this.investmentsRepository.find({
      where: { investorId: userId },
      relations: ['idea', 'team'],
      order: { createdAt: 'DESC' },
    });

    return investments.map((i) => this.toResponse(i));
  }

  async findByIdea(ideaId: string): Promise<InvestmentResponseDto[]> {
    const investments = await this.investmentsRepository.find({
      where: { ideaId },
      relations: ['investor'],
      order: { createdAt: 'DESC' },
    });

    return investments.map((i) => this.toResponse(i));
  }

  async findByTeam(teamId: string): Promise<InvestmentResponseDto[]> {
    const investments = await this.investmentsRepository.find({
      where: { teamId },
      relations: ['investor'],
      order: { createdAt: 'DESC' },
    });

    return investments.map((i) => this.toResponse(i));
  }

  async updateStatus(
    id: string,
    status: InvestmentStatus,
    userId: string,
  ): Promise<InvestmentResponseDto> {
    const investment = await this.investmentsRepository.findOne({
      where: { id },
    });

    if (!investment) {
      throw new NotFoundException('Инвестиция не найдена');
    }

    // Только инвестор может менять статус
    if (investment.investorId !== userId) {
      throw new ForbiddenException('Только инвестор может менять статус');
    }

    investment.status = status;
    await this.investmentsRepository.save(investment);

    // Если инвестиция завершена, обновляем профиль инвестора
    if (status === InvestmentStatus.COMPLETED) {
      await this.investorProfilesService.incrementInvestment(
        investment.investorId,
        investment.amount,
      );
    }

    return this.toResponse(investment);
  }

  async update(
    id: string,
    updateDto: UpdateInvestmentDto,
    userId: string,
  ): Promise<InvestmentResponseDto> {
    const investment = await this.investmentsRepository.findOne({
      where: { id },
    });

    if (!investment) {
      throw new NotFoundException('Инвестиция не найдена');
    }

    if (investment.investorId !== userId) {
      throw new ForbiddenException('Только инвестор может редактировать');
    }

    Object.assign(investment, updateDto);
    await this.investmentsRepository.save(investment);

    return this.toResponse(investment);
  }

  async remove(id: string, userId: string): Promise<void> {
    const investment = await this.investmentsRepository.findOne({
      where: { id },
    });

    if (!investment) {
      throw new NotFoundException('Инвестиция не найдена');
    }

    if (investment.investorId !== userId) {
      throw new ForbiddenException('Только инвестор может удалять');
    }

    await this.investmentsRepository.delete(id);
  }

  private toResponse(investment: Investment): InvestmentResponseDto {
    const { id, amount, sharePercent, authorPercent, terms, comment, status, investorId, ideaId, teamId, createdAt, updatedAt } = investment;
    return { id, amount, sharePercent, authorPercent, terms, comment, status, investorId, ideaId, teamId, createdAt, updatedAt };
  }
}
