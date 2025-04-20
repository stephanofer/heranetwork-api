import { HttpException, HttpStatus } from '@nestjs/common';
import { StatsType } from '@/shared/interfaces/stats-type.interface';

export class InvalidLeaderboardTypeException extends HttpException {
  constructor(type: StatsType | string) {
    super(`Invalid leaderboard stat type: ${type}`, HttpStatus.BAD_REQUEST);
  }
}

export class LeaderboardDataException extends HttpException {
  constructor(message: string, error?: any) {
    super(
      {
        message: `Error retrieving leaderboard data: ${message}`,
        error: error?.message || error,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
