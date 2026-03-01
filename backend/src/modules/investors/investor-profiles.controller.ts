import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { InvestorProfilesService } from './investor-profiles.service';
import { CreateInvestorProfileDto, UpdateInvestorProfileDto } from './investor-profile.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('investors')
@Controller('investors')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class InvestorProfilesController {
  constructor(private readonly profilesService: InvestorProfilesService) {}

  @Post()
  @ApiOperation({ summary: 'Создать профиль инвестора' })
  async create(@Request() req: any, @Body() createDto: CreateInvestorProfileDto) {
    return this.profilesService.create(req.user.userId, createDto);
  }

  @Get('me')
  @ApiOperation({ summary: 'Получить мой профиль инвестора' })
  async getMyProfile(@Request() req: any) {
    return this.profilesService.findByUser(req.user.userId);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Обновить профиль инвестора' })
  async updateProfile(@Request() req: any, @Body() updateDto: UpdateInvestorProfileDto) {
    return this.profilesService.update(req.user.userId, updateDto);
  }
}
