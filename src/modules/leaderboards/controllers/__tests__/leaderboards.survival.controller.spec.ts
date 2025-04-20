import { Test, TestingModule } from '@nestjs/testing';
import { LeaderboardsControllerSurvival } from '../leaderboards.survival.controller';
import { LeaderBoardsServiceSurvival } from '../../services/leaderboard.survival.service';
import { ResponseService } from '@/shared/response/response.service';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { GetLeaderboardSurvivalDto } from '../../dto/get-leaderboard.dto';
import { StatsTypeSurvival } from '@/shared/interfaces/stats-type.interface';
import { Decimal } from '@prisma/client/runtime/library';
import { LeaderboardEntry } from '../../dto/leaderboard-entry.interface';

describe('LeaderboardsControllerSurvival', () => {
  let controller: LeaderboardsControllerSurvival;
  let leaderBoardsService: LeaderBoardsServiceSurvival;
  let cacheManager: any;
  let responseService: ResponseService;

  const mockLeaderboardData: LeaderboardEntry[] = [
    {
      rank: 1,
      userProfile: {
        uuid: '72442e30864337d2a4f55b3c94a704a8',
        lastNickname: 'Vendimia',
        lastServer: null,
        lastSeen: new Date('2025-03-11T00:55:53.000Z'),
        firstSeen: new Date('2025-02-02T17:38:50.000Z'),
        premiumId: 'cf11286ad43e4f7cbbd51b4f653392c7',
        primaryGroup: 'default',
        skinUUID: 'cf11286a-d43e-4f7c-bbd5-1b4f653392c7',
      },
      value: new Decimal(100) as any,
      dailyDelta: new Decimal(10) as any,
      dailyLastTotal: new Decimal(90) as any,
      dailyTimestamp: new Decimal(1650000000) as any,
    },
    {
      rank: 2,
      userProfile: {
        uuid: '72442e30864337d2a4f55b3c94a704a2',
        lastNickname: 'Vendimiad',
        lastServer: null,
        lastSeen: new Date('2025-03-11T00:55:53.000Z'),
        firstSeen: new Date('2025-02-02T17:38:50.000Z'),
        premiumId: 'cf11286ad43e4f7cbbd51b4f653392c7',
        primaryGroup: 'default',
        skinUUID: 'cf11286a-d43e-4f7c-bbd5-1b4f653392c7',
      },
      value: new Decimal(80) as any,
      dailyDelta: new Decimal(5) as any,
      dailyLastTotal: new Decimal(75) as any,
      dailyTimestamp: new Decimal(1650000000) as any,
    },
  ];

  const mockSuccessResponse = {
    status: 'success',
    data: mockLeaderboardData,
  };

  const mockResponseObject = {
    json: jest.fn().mockReturnThis(),
    setHeader: jest.fn().mockReturnThis(),
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue(60),
  };

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
  };

  const mockLeaderBoardsService = {
    getLeaderboardByType: jest.fn().mockResolvedValue(mockLeaderboardData),
  };

  const mockResponseService = {
    success: jest
      .fn()
      .mockImplementation((data) => ({ status: 'success', data })),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeaderboardsControllerSurvival],
      providers: [
        {
          provide: LeaderBoardsServiceSurvival,
          useValue: mockLeaderBoardsService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
        {
          provide: ResponseService,
          useValue: mockResponseService,
        },
      ],
    }).compile();

    controller = module.get<LeaderboardsControllerSurvival>(
      LeaderboardsControllerSurvival,
    );
    leaderBoardsService = module.get<LeaderBoardsServiceSurvival>(
      LeaderBoardsServiceSurvival,
    );
    cacheManager = module.get(CACHE_MANAGER);
    responseService = module.get<ResponseService>(ResponseService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getLeaderboard', () => {
    const query: GetLeaderboardSurvivalDto = {
      type: StatsTypeSurvival.KILLS,
      limit: 10,
      offset: 0,
    };

    it('should return cached data if available', async () => {
      cacheManager.get.mockResolvedValueOnce(mockLeaderboardData);

      await controller.getLeaderboard(query, mockResponseObject as any);

      expect(cacheManager.get).toHaveBeenCalledWith(
        `LeaderBoardSurvival:${query.type}:limit=${query.limit}:offset=${query.offset}`,
      );
      expect(mockResponseObject.setHeader).toHaveBeenCalledWith(
        'X-Cache-Status',
        'HIT',
      );
      expect(responseService.success).toHaveBeenCalledWith(mockLeaderboardData);
      expect(mockResponseObject.json).toHaveBeenCalledWith(mockSuccessResponse);
      expect(leaderBoardsService.getLeaderboardByType).not.toHaveBeenCalled();
    });

    it('should fetch data from service when no cache available', async () => {
      cacheManager.get.mockResolvedValueOnce(null);

      await controller.getLeaderboard(query, mockResponseObject as any);

      expect(cacheManager.get).toHaveBeenCalledWith(
        `LeaderBoardSurvival:${query.type}:limit=${query.limit}:offset=${query.offset}`,
      );
      expect(leaderBoardsService.getLeaderboardByType).toHaveBeenCalledWith(
        query.type,
        { limit: query.limit, offset: query.offset },
      );
      expect(cacheManager.set).toHaveBeenCalledWith(
        `LeaderBoardSurvival:${query.type}:limit=${query.limit}:offset=${query.offset}`,
        mockLeaderboardData,
        60,
      );
      expect(mockResponseObject.setHeader).toHaveBeenCalledWith(
        'X-Cache-Status',
        'MISS',
      );
      expect(responseService.success).toHaveBeenCalledWith(mockLeaderboardData);
      expect(mockResponseObject.json).toHaveBeenCalledWith(mockSuccessResponse);
    });

    it('should use default values for limit and offset if not provided', async () => {
      const partialQuery: Partial<GetLeaderboardSurvivalDto> = {
        type: StatsTypeSurvival.KILLS,
      };
      cacheManager.get.mockResolvedValueOnce(null);

      await controller.getLeaderboard(
        partialQuery as GetLeaderboardSurvivalDto,
        mockResponseObject as any,
      );

      expect(cacheManager.get).toHaveBeenCalledWith(
        `LeaderBoardSurvival:${partialQuery.type}:limit=150:offset=0`,
      );
      expect(leaderBoardsService.getLeaderboardByType).toHaveBeenCalledWith(
        partialQuery.type,
        { limit: 150, offset: 0 },
      );
    });
  });
});
