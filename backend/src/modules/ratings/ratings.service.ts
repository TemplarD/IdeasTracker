import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from './rating.entity';
import { CreateRatingDto, UpdateRatingDto, RatingResponseDto } from './rating.dto';
import { IdeasService } from '../ideas/ideas.service';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating)
    private ratingsRepository: Repository<Rating>,
    private ideasService: IdeasService,
  ) {}

  async create(
    ideaId: string,
    userId: string,
    createRatingDto: CreateRatingDto,
  ): Promise<RatingResponseDto> {
    const existingRating = await this.ratingsRepository.findOne({
      where: { ideaId, userId },
    });

    if (existingRating) {
      throw new BadRequestException('Вы уже оценили эту идею');
    }

    const averageRating = this.calculateAverage(
      createRatingDto.interest,
      createRatingDto.benefit,
      createRatingDto.profitability,
    );

    const rating = this.ratingsRepository.create({
      ...createRatingDto,
      averageRating,
      ideaId,
      userId,
    });

    await this.ratingsRepository.save(rating);

    // Обновляем средний рейтинг идеи
    await this.updateIdeaRating(ideaId);

    return this.toResponse(rating);
  }

  async update(
    ideaId: string,
    userId: string,
    updateRatingDto: UpdateRatingDto,
  ): Promise<RatingResponseDto> {
    const rating = await this.ratingsRepository.findOne({
      where: { ideaId, userId },
    });

    if (!rating) {
      throw new NotFoundException('Оценка не найдена');
    }

    Object.assign(rating, updateRatingDto);
    rating.averageRating = this.calculateAverage(
      updateRatingDto.interest ?? rating.interest,
      updateRatingDto.benefit ?? rating.benefit,
      updateRatingDto.profitability ?? rating.profitability,
    );

    await this.ratingsRepository.save(rating);

    // Обновляем средний рейтинг идеи
    await this.updateIdeaRating(ideaId);

    return this.toResponse(rating);
  }

  async findByUserAndIdea(
    userId: string,
    ideaId: string,
  ): Promise<RatingResponseDto | null> {
    const rating = await this.ratingsRepository.findOne({
      where: { userId, ideaId },
    });

    return rating ? this.toResponse(rating) : null;
  }

  async findByIdea(ideaId: string): Promise<RatingResponseDto[]> {
    const ratings = await this.ratingsRepository.find({
      where: { ideaId },
      relations: ['user'],
    });

    return ratings.map((r) => this.toResponse(r));
  }

  private calculateAverage(interest: number, benefit: number, profitability: number): number {
    return Number(((interest + benefit + profitability) / 3).toFixed(2));
  }

  private async updateIdeaRating(ideaId: string): Promise<void> {
    const ratings = await this.ratingsRepository.find({
      where: { ideaId },
    });

    if (ratings.length === 0) {
      await this.ideasService.updateRating(ideaId, 0);
      return;
    }

    const totalRating = ratings.reduce((sum, r) => sum + r.averageRating, 0);
    const averageRating = Number((totalRating / ratings.length).toFixed(2));

    await this.ideasService.updateRating(ideaId, averageRating);
  }

  private toResponse(rating: Rating): RatingResponseDto {
    const { id, interest, benefit, profitability, averageRating, userId, ideaId, createdAt } = rating;
    return { id, interest, benefit, profitability, averageRating, userId, ideaId, createdAt };
  }
}
