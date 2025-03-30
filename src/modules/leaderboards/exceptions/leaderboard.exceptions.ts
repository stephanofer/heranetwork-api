import { HttpException, HttpStatus } from '@nestjs/common';
import { StatType } from '@/shared/interfaces/stats.interface';

export class InvalidLeaderboardTypeException extends HttpException {
  constructor(type: StatType | string) {
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
