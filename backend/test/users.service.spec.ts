import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../src/modules/users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../src/modules/users/user.entity';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  const mockUser: Partial<User> = {
    id: 'test-uuid',
    email: 'test@example.com',
    password: 'hashedPassword',
    firstName: 'Test',
    lastName: 'User',
    reputation: 0,
    role: 'user',
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
    comparePassword: jest.fn().mockResolvedValue(true),
    hashPassword: jest.fn(),
  };

  const mockRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto = {
        email: 'new@example.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User',
      };

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue({ ...mockUser, ...createUserDto });
      mockRepository.save.mockResolvedValue({ ...mockUser, ...createUserDto });

      const result = await service.create(createUserDto);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { email: createUserDto.email },
      });
      expect(repository.create).toHaveBeenCalledWith(createUserDto);
      expect(repository.save).toHaveBeenCalled();
      expect(result.email).toBe(createUserDto.email);
    });

    it('should throw ConflictException if user exists', async () => {
      const createUserDto = {
        email: 'existing@example.com',
        password: 'password123',
      };

      mockRepository.findOne.mockResolvedValue({ ...mockUser, email: createUserDto.email });

      await expect(service.create(createUserDto)).rejects.toThrow('Пользователь с таким email уже существует');
    });
  });

  describe('findByEmail', () => {
    it('should return user by email', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findByEmail('test@example.com');

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
        select: expect.any(Array),
      });
      expect(result?.email).toBe('test@example.com');
    });
  });
});
