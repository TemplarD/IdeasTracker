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
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.usersService.create(createUserDto);
  }

  @Get('me')
  @ApiOperation({ summary: 'Получить текущий профиль' })
  async getProfile(@Request() req): Promise<UserResponseDto> {
    return this.usersService.findById(req.user.userId);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Обновить профиль' })
  async updateProfile(
    @Request() req,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.update(req.user.userId, updateUserDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить профиль пользователя по ID' })
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    return this.usersService.findById(id);
  }
}
