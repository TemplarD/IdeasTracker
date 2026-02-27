import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Idea, IdeaStatus } from './idea.entity';
import { CreateIdeaDto, UpdateIdeaDto, IdeaResponseDto } from './idea.dto';

@Injectable()
export class IdeasService {
  constructor(
    @InjectRepository(Idea)
    private ideasRepository: Repository<Idea>,
  ) {}

  async create(
    createIdeaDto: CreateIdeaDto,
    userId: string,
  ): Promise<IdeaResponseDto> {
    const idea = this.ideasRepository.create({
      ...createIdeaDto,
      authorId: userId,
    });
    await this.ideasRepository.save(idea);
    return this.toResponse(idea);
  }

  async findAll(
    page = 1,
    limit = 10,
    filters?: {
      status?: IdeaStatus;
      category?: string;
      tags?: string[];
      sortBy?: string;
      sortOrder?: 'ASC' | 'DESC';
    },
  ): Promise<{ data: IdeaResponseDto[]; total: number; page: number; limit: number }> {
    const where: FindOptionsWhere<Idea> = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.category) {
      where.category = filters.category;
    }

    const [ideas, total] = await this.ideasRepository.findAndCount({
      where,
      relations: ['author', 'ratings'],
      skip: (page - 1) * limit,
      take: limit,
      order: {
        [filters?.sortBy || 'createdAt']: filters?.sortOrder || 'DESC',
      },
    });

    return {
      data: ideas.map((idea) => this.toResponse(idea)),
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<IdeaResponseDto> {
    const idea = await this.ideasRepository.findOne({
      where: { id },
      relations: ['author', 'ratings', 'comments'],
    });

    if (!idea) {
      throw new NotFoundException('Идея не найдена');
    }

    // Увеличиваем счетчик просмотров
    idea.viewsCount += 1;
    await this.ideasRepository.save(idea);

    return this.toResponse(idea);
  }

  async update(
    id: string,
    updateIdeaDto: UpdateIdeaDto,
    userId: string,
  ): Promise<IdeaResponseDto> {
    const idea = await this.ideasRepository.findOne({ where: { id } });

    if (!idea) {
      throw new NotFoundException('Идея не найдена');
    }

    if (idea.authorId !== userId) {
      throw new ForbiddenException('Только автор может редактировать идею');
    }

    Object.assign(idea, updateIdeaDto);
    await this.ideasRepository.save(idea);

    return this.toResponse(idea);
  }

  async remove(id: string, userId: string): Promise<void> {
    const idea = await this.ideasRepository.findOne({ where: { id } });

    if (!idea) {
      throw new NotFoundException('Идея не найдена');
    }

    if (idea.authorId !== userId) {
      throw new ForbiddenException('Только автор может удалять идею');
    }

    await this.ideasRepository.softDelete(id);
  }

  async updateRating(id: string, averageRating: number): Promise<void> {
    await this.ideasRepository.update(id, { averageRating });
  }

  async findByAuthor(
    authorId: string,
    page = 1,
    limit = 10,
  ): Promise<{ data: IdeaResponseDto[]; total: number; page: number; limit: number }> {
    const [ideas, total] = await this.ideasRepository.findAndCount({
      where: { authorId },
      relations: ['author', 'ratings'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: ideas.map((idea) => this.toResponse(idea)),
      total,
      page,
      limit,
    };
  }

  private toResponse(idea: Idea): IdeaResponseDto {
    const {
      id,
      title,
      description,
      presentationUrl,
      attachments,
      tags,
      category,
      status,
      viewsCount,
      averageRating,
      authorId,
      createdAt,
      updatedAt,
    } = idea;

    return {
      id,
      title,
      description,
      presentationUrl,
      attachments,
      tags,
      category,
      status,
      viewsCount,
      averageRating,
      authorId,
      createdAt,
      updatedAt,
    };
  }
}
