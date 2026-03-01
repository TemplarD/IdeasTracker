import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    const user = this.usersRepository.create(createUserDto);
    await this.usersRepository.save(user);

    return this.toResponse(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'firstName', 'lastName', 'avatar', 'role', 'status'],
    });
  }

  async findById(id: string): Promise<UserResponseDto> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['ideas', 'comments'],
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return this.toResponse(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    Object.assign(user, updateUserDto);
    await this.usersRepository.save(user);

    return this.toResponse(user);
  }

  async updateRefreshToken(userId: string, refreshToken: string | null): Promise<void> {
    await this.usersRepository.update(userId, { refreshToken: refreshToken ?? undefined });
  }

  async findByIdWithoutPassword(id: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { id },
      select: ['id', 'email', 'firstName', 'lastName', 'avatar', 'bio', 'skills', 'reputation', 'role', 'status', 'createdAt'],
    });
  }

  private toResponse(user: User): UserResponseDto {
    const { id, email, firstName, lastName, avatar, bio, skills, reputation, role, createdAt } = user;
    return { id, email, firstName, lastName, avatar, bio, skills, reputation, role, createdAt };
  }
}
