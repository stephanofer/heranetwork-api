import { HttpException, HttpStatus } from '@nestjs/common';
import { StatsType } from '@/shared/interfaces/stats-type.interface';

export class InvalidStatTypeException extends HttpException {
  constructor(type: StatsType | string) {
    super(`Invalid stat type: ${type}`, HttpStatus.BAD_REQUEST);
  }
}

export class UserDataException extends HttpException {
  constructor(message: string, error?: any) {
    super(
      {
        message: `Error retrieving user data: ${message}`,
        error: error?.message || error,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

export class UserNotFoundException extends HttpException {
  constructor(uuid?: string) {
    const message = uuid ? `User with ID: ${uuid} not found` : 'User not found';
    super(message, HttpStatus.NOT_FOUND);
  }
}
