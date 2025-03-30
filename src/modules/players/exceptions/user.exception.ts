import { HttpException, HttpStatus } from '@nestjs/common';
import { StatType } from '@/shared/interfaces/stats.interface';

export class InvalidStatTypeException extends HttpException {
  constructor(type: StatType | string) {
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
