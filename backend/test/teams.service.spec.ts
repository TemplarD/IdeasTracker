import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeamsService } from './teams.service';
import { Team, TeamStatus } from './team.entity';
import { CreateTeamDto } from './team.dto';

describe('TeamsService', () => {
  let service: TeamsService;
  let repository: Repository<Team>;

  const mockTeam: Partial<Team> = {
    id: 'test-uuid',
    name: 'Test Team',
    description: 'Test Description',
    status: TeamStatus.ACTIVE,
    ideaId: 'idea-uuid',
    leaderId: 'user-uuid',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamsService,
        {
          provide: getRepositoryToken(Team),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TeamsService>(TeamsService);
    repository = module.get<Repository<Team>>(getRepositoryToken(Team));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new team', async () => {
      const createTeamDto: CreateTeamDto = {
        name: 'New Team',
        description: 'Description',
        ideaId: 'idea-uuid',
      };

      mockRepository.create.mockReturnValue({ ...mockTeam, ...createTeamDto });
      mockRepository.save.mockResolvedValue({ ...mockTeam, ...createTeamDto });

      const result = await service.create(createTeamDto, 'user-uuid');

      expect(repository.create).toHaveBeenCalledWith({
        ...createTeamDto,
        leaderId: 'user-uuid',
      });
      expect(repository.save).toHaveBeenCalled();
      expect(result.name).toBe(createTeamDto.name);
    });
  });

  describe('findByIdea', () => {
    it('should return teams for an idea', async () => {
      mockRepository.find.mockResolvedValue([mockTeam]);

      const result = await service.findByIdea('idea-uuid');

      expect(repository.find).toHaveBeenCalledWith({
        where: { ideaId: 'idea-uuid' },
        relations: ['leader', 'members', 'members.user'],
      });
      expect(result).toHaveLength(1);
    });
  });
});
