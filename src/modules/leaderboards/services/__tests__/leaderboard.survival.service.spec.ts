import { Test, TestingModule } from '@nestjs/testing';
import { LeaderBoardsServiceSurvival } from '../leaderboard.survival.service';
import { SurvivalPrismaService } from '@/databases/survival/survival-prisma.service';
import { PlayersService } from '@/modules/players/services/players.service';
import { StatsTypeSurvival } from '@/shared/interfaces/stats-type.interface';
import {
  LeaderboardDataException,
  InvalidLeaderboardTypeException,
} from '../../exceptions/leaderboard.exceptions';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { LeaderboardOptions } from '../../dto/leaderboard-options.interface';
import { Decimal } from '@prisma/client/runtime/library';

// Mock data
const mockUserProfilesMap = {
  uuid1: { uuid: 'uuid1', username: 'player1', displayName: 'Player 1' },
  uuid2: { uuid: 'uuid2', username: 'player2', displayName: 'Player 2' },
};

const mockRankingData = [
  {
    uuid: 'uuid1',
    value: new Decimal(100),
    dailyDelta: new Decimal(10),
    dailyLastTotal: new Decimal(90),
    dailyTimestamp: new Decimal(1650000000),
  },
  {
    uuid: 'uuid2',
    value: new Decimal(80),
    dailyDelta: new Decimal(5),
    dailyLastTotal: new Decimal(75),
    dailyTimestamp: new Decimal(1650000000),
  },
];

// Mock repository functions for Prisma
const mockSurvivalPrismaService = {
  rankingKill: {
    findMany: jest.fn().mockResolvedValue(mockRankingData),
  },
  rankingDeath: {
    findMany: jest.fn().mockResolvedValue(mockRankingData),
  },
  rankingKD: {
    findMany: jest.fn().mockResolvedValue(mockRankingData),
  },
  rankingMaxStreak: {
    findMany: jest.fn().mockResolvedValue(mockRankingData),
  },
  rankingElo: {
    findMany: jest.fn().mockResolvedValue(mockRankingData),
  },
  rankingKoth: {
    findMany: jest.fn().mockResolvedValue(mockRankingData),
  },
};

// Mock PlayersService
const mockPlayersService = {
  fetchAccountDetailsBatch: jest.fn().mockResolvedValue(mockUserProfilesMap),
};

describe('LeaderBoardsServiceSurvival', () => {
  let service: LeaderBoardsServiceSurvival;
  let survivalPrismaService: SurvivalPrismaService;
  let playersService: PlayersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeaderBoardsServiceSurvival,
        {
          provide: SurvivalPrismaService,
          useValue: mockSurvivalPrismaService,
        },
        {
          provide: PlayersService,
          useValue: mockPlayersService,
        },
      ],
    }).compile();

    service = module.get<LeaderBoardsServiceSurvival>(
      LeaderBoardsServiceSurvival,
    );
    survivalPrismaService = module.get<SurvivalPrismaService>(
      SurvivalPrismaService,
    );
    playersService = module.get<PlayersService>(PlayersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getLeaderboardByType', () => {
    const options: LeaderboardOptions = { limit: 10, offset: 0 };

    it('should return leaderboard data for KILLS type', async () => {
      const result = await service.getLeaderboardByType(
        StatsTypeSurvival.KILLS,
        options,
      );

      expect(survivalPrismaService.rankingKill.findMany).toHaveBeenCalled();
      expect(playersService.fetchAccountDetailsBatch).toHaveBeenCalledWith([
        'uuid1',
        'uuid2',
      ]);
      expect(result).toHaveLength(2);
      expect(result[0].rank).toBe(1);
      expect(result[0].userProfile).toEqual(mockUserProfilesMap['uuid1']);
      expect(result[0].value).toEqual(mockRankingData[0].value);
    });

    it('should return leaderboard data for DEATHS type', async () => {
      const result = await service.getLeaderboardByType(
        StatsTypeSurvival.DEATHS,
        options,
      );

      expect(survivalPrismaService.rankingDeath.findMany).toHaveBeenCalled();
      expect(result).toHaveLength(2);
    });

    it('should return leaderboard data for KD type', async () => {
      const result = await service.getLeaderboardByType(
        StatsTypeSurvival.KD,
        options,
      );

      expect(survivalPrismaService.rankingKD.findMany).toHaveBeenCalled();
      expect(result).toHaveLength(2);
    });

    it('should return leaderboard data for MAX_STREAK type', async () => {
      const result = await service.getLeaderboardByType(
        StatsTypeSurvival.MAX_STREAK,
        options,
      );

      expect(
        survivalPrismaService.rankingMaxStreak.findMany,
      ).toHaveBeenCalled();
      expect(result).toHaveLength(2);
    });

    it('should return leaderboard data for ELO type', async () => {
      const result = await service.getLeaderboardByType(
        StatsTypeSurvival.ELO,
        options,
      );

      expect(survivalPrismaService.rankingElo.findMany).toHaveBeenCalled();
      expect(result).toHaveLength(2);
    });

    it('should return leaderboard data for KOTH type', async () => {
      const result = await service.getLeaderboardByType(
        StatsTypeSurvival.KOTH,
        options,
      );

      expect(survivalPrismaService.rankingKoth.findMany).toHaveBeenCalled();
      expect(result).toHaveLength(2);
    });

    it('should throw InvalidLeaderboardTypeException for invalid type', async () => {
      const invalidType = 'invalid' as StatsTypeSurvival;

      await expect(
        service.getLeaderboardByType(invalidType, options),
      ).rejects.toThrow(InvalidLeaderboardTypeException);
    });

    it('should pass through InvalidLeaderboardTypeException', async () => {
      jest.spyOn(service, 'fetchLeaderboardByType').mockImplementation(() => {
        throw new InvalidLeaderboardTypeException(StatsTypeSurvival.KILLS);
      });

      await expect(
        service.getLeaderboardByType(StatsTypeSurvival.KILLS),
      ).rejects.toThrow(InvalidLeaderboardTypeException);
    });

    it('should handle PrismaClientKnownRequestError', async () => {
      jest.spyOn(service, 'fetchLeaderboardByType').mockImplementation(() => {
        throw new PrismaClientKnownRequestError('Error message', {
          code: 'P2002',
          clientVersion: '4.0.0',
        });
      });

      await expect(
        service.getLeaderboardByType(StatsTypeSurvival.KILLS),
      ).rejects.toThrow(LeaderboardDataException);
    });

    it('should handle PrismaClientValidationError', async () => {
      jest.spyOn(service, 'fetchLeaderboardByType').mockImplementation(() => {
        throw new PrismaClientValidationError('Validation error message', {
          clientVersion: '4.0.0',
        });
      });

      await expect(
        service.getLeaderboardByType(StatsTypeSurvival.KILLS),
      ).rejects.toThrow(LeaderboardDataException);
    });

    it('should handle generic errors', async () => {
      jest.spyOn(service, 'fetchLeaderboardByType').mockImplementation(() => {
        throw new Error('Generic error');
      });

      await expect(
        service.getLeaderboardByType(StatsTypeSurvival.KILLS),
      ).rejects.toThrow(LeaderboardDataException);
    });
  });

  describe('fetchLeaderboardByType', () => {
    const options: LeaderboardOptions = { limit: 10, offset: 5 };

    it('should correctly set rank based on offset', async () => {
      const result = await service.fetchLeaderboardByType(
        StatsTypeSurvival.KILLS,
        options,
      );

      expect(result[0].rank).toBe(6); // offset + index + 1
      expect(result[1].rank).toBe(7);
    });

    it('should use default values for limit and offset if not provided', async () => {
      await service.fetchLeaderboardByType(StatsTypeSurvival.KILLS, {});

      expect(survivalPrismaService.rankingKill.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 150,
          skip: 0,
        }),
      );
    });

    it('should map entries to LeaderboardEntry format', async () => {
      const result = await service.fetchLeaderboardByType(
        StatsTypeSurvival.KILLS,
        options,
      );

      expect(result).toEqual([
        {
          rank: 6,
          userProfile: mockUserProfilesMap['uuid1'],
          value: mockRankingData[0].value,
          dailyDelta: mockRankingData[0].dailyDelta,
          dailyLastTotal: mockRankingData[0].dailyLastTotal,
          dailyTimestamp: mockRankingData[0].dailyTimestamp,
        },
        {
          rank: 7,
          userProfile: mockUserProfilesMap['uuid2'],
          value: mockRankingData[1].value,
          dailyDelta: mockRankingData[1].dailyDelta,
          dailyLastTotal: mockRankingData[1].dailyLastTotal,
          dailyTimestamp: mockRankingData[1].dailyTimestamp,
        },
      ]);
    });
  });
});
