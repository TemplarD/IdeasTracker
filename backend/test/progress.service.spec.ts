import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProgressService } from './progress.service';
import { Progress } from './progress.entity';
import { Team } from '../teams/team.entity';
import { CreateProgressDto } from './progress.dto';

describe('ProgressService', () => {
  let service: ProgressService;
  let progressRepository: Repository<Progress>;
  let teamRepository: Repository<Team>;

  const mockProgress: Partial<Progress> = {
    id: 'test-uuid',
    content: 'Test progress content',
    teamId: 'team-uuid',
    authorId: 'user-uuid',
    createdAt: new Date(),
  };

  const mockProgressRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  const mockTeamRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProgressService,
        {
          provide: getRepositoryToken(Progress),
          useValue: mockProgressRepository,
        },
        {
          provide: getRepositoryToken(Team),
          useValue: mockTeamRepository,
        },
      ],
    }).compile();

    service = module.get<ProgressService>(ProgressService);
    progressRepository = module.get<Repository<Progress>>(getRepositoryToken(Progress));
    teamRepository = module.get<Repository<Team>>(getRepositoryToken(Team));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create progress entry', async () => {
      const createProgressDto: CreateProgressDto = {
        content: 'New progress',
      };

      mockTeamRepository.findOne.mockResolvedValue({ id: 'team-uuid' });
      mockProgressRepository.create.mockReturnValue({ ...mockProgress, ...createProgressDto });
      mockProgressRepository.save.mockResolvedValue({ ...mockProgress, ...createProgressDto });

      const result = await service.create('team-uuid', 'user-uuid', createProgressDto);

      expect(progressRepository.create).toHaveBeenCalledWith({
        ...createProgressDto,
        teamId: 'team-uuid',
        authorId: 'user-uuid',
      });
      expect(progressRepository.save).toHaveBeenCalled();
      expect(result.content).toBe(createProgressDto.content);
    });
  });

  describe('findByTeam', () => {
    it('should return progress entries for a team', async () => {
      mockProgressRepository.find.mockResolvedValue([mockProgress]);

      const result = await service.findByTeam('team-uuid');

      expect(progressRepository.find).toHaveBeenCalledWith({
        where: { teamId: 'team-uuid' },
        relations: ['author'],
        order: { createdAt: 'DESC' },
      });
      expect(result).toHaveLength(1);
    });
  });
});
