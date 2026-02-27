import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RatingsService } from './ratings.service';
import { CreateRatingDto, UpdateRatingDto } from './rating.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('ratings')
@Controller('ideas/:ideaId/ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Оценить идею' })
  async create(
    @Request() req,
    @Param('ideaId') ideaId: string,
    @Body() createRatingDto: CreateRatingDto,
  ) {
    return this.ratingsService.create(ideaId, req.user.userId, createRatingDto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить все оценки идеи' })
  async findByIdea(@Param('ideaId') ideaId: string) {
    return this.ratingsService.findByIdea(ideaId);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить мою оценку идеи' })
  async findMyRating(@Request() req, @Param('ideaId') ideaId: string) {
    return this.ratingsService.findByUserAndIdea(req.user.userId, ideaId);
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить оценку идеи' })
  async update(
    @Request() req,
    @Param('ideaId') ideaId: string,
    @Body() updateRatingDto: UpdateRatingDto,
  ) {
    return this.ratingsService.update(ideaId, req.user.userId, updateRatingDto);
  }
}
