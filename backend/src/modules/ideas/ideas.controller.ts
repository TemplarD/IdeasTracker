import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { IdeasService } from './ideas.service';
import { CreateIdeaDto, UpdateIdeaDto } from './idea.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IdeaStatus } from './idea.entity';

@ApiTags('ideas')
@Controller('ideas')
export class IdeasController {
  constructor(private readonly ideasService: IdeasService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создать новую идею' })
  async create(@Request() req: any, @Body() createIdeaDto: CreateIdeaDto) {
    return this.ideasService.create(createIdeaDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Получить список идей' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'status', required: false, enum: IdeaStatus })
  @ApiQuery({ name: 'category', required: false, example: 'сайт' })
  @ApiQuery({ name: 'sortBy', required: false, example: 'createdAt' })
  @ApiQuery({ name: 'sortOrder', required: false, example: 'DESC' })
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('status') status?: IdeaStatus,
    @Query('category') category?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
  ) {
    return this.ideasService.findAll(parseInt(page), parseInt(limit), {
      status,
      category,
      sortBy,
      sortOrder,
    });
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить мои идеи' })
  async findMyIdeas(
    @Request() req: any,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.ideasService.findByAuthor(req.user.userId, parseInt(page), parseInt(limit));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить идею по ID' })
  async findOne(@Param('id') id: string) {
    return this.ideasService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить идею' })
  async update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updateIdeaDto: UpdateIdeaDto,
  ) {
    return this.ideasService.update(id, updateIdeaDto, req.user.userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удалить идею' })
  async remove(@Request() req: any, @Param('id') id: string) {
    await this.ideasService.remove(id, req.user.userId);
    return { message: 'Идея успешно удалена' };
  }
}
