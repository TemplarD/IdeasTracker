import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvestorProfile } from './investor-profile.entity';
import { CreateInvestorProfileDto, UpdateInvestorProfileDto, InvestorProfileResponseDto } from './investor-profile.dto';

@Injectable()
export class InvestorProfilesService {
  constructor(
    @InjectRepository(InvestorProfile)
    private profilesRepository: Repository<InvestorProfile>,
  ) {}

  async create(userId: string, createDto: CreateInvestorProfileDto): Promise<InvestorProfileResponseDto> {
    const existing = await this.profilesRepository.findOne({
      where: { userId },
    });

    if (existing) {
      throw new NotFoundException('Профиль инвестора уже существует');
    }

    const profile = this.profilesRepository.create({
      ...createDto,
      userId,
    });

    await this.profilesRepository.save(profile);
    return this.toResponse(profile);
  }

  async findByUser(userId: string): Promise<InvestorProfileResponseDto | null> {
    const profile = await this.profilesRepository.findOne({
      where: { userId },
      relations: ['investments'],
    });

    return profile ? this.toResponse(profile) : null;
  }

  async update(
    userId: string,
    updateDto: UpdateInvestorProfileDto,
  ): Promise<InvestorProfileResponseDto> {
    let profile = await this.profilesRepository.findOne({
      where: { userId },
    });

    if (!profile) {
      profile = this.profilesRepository.create({ userId });
    }

    Object.assign(profile, updateDto);
    await this.profilesRepository.save(profile);

    return this.toResponse(profile);
  }

  async incrementInvestment(userId: string, amount: number): Promise<void> {
    const profile = await this.profilesRepository.findOne({ where: { userId } });
    if (profile) {
      profile.totalInvestments += 1;
      profile.investedAmount += amount;
      await this.profilesRepository.save(profile);
    }
  }

  private toResponse(profile: InvestorProfile): InvestorProfileResponseDto {
    const { id, userId, budget, bio, interests, preferredCategories, totalInvestments, investedAmount, createdAt, updatedAt } = profile;
    return { id, userId, budget, bio, interests, preferredCategories, totalInvestments, investedAmount, createdAt, updatedAt };
  }
}
