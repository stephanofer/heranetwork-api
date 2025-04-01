import { Injectable } from '@nestjs/common';
import {
  ApiResponse,
  // PaginatedResponse,
} from '../interfaces/reponse.interface';

@Injectable()
export class ResponseService {
  success<T>(data: T): ApiResponse<T> {
    return {
      success: true,
      data,
      count: Array.isArray(data) ? data.length : undefined,
      timestamp: new Date().toISOString(),
    };
  }

  // paginated<T>(
  //   data: T[],
  //   page: number,
  //   limit: number,
  //   totalItems: number,
  //   message?: string,
  // ): PaginatedResponse<T[]> {
  //   const totalPages = Math.ceil(totalItems / limit);

  //   return {
  //     success: true,
  //     data,
  //     count: data.length,
  //     message,
  //     timestamp: new Date().toISOString(),
  //     pagination: {
  //       page,
  //       limit,
  //       totalPages,
  //       totalItems,
  //     },
  //   };
  // }

  // error(message: string, errorCode: string): ApiResponse<null> {
  //   return {
  //     success: false,
  //     data: null,
  //     message,
  //     timestamp: new Date().toISOString(),
  //   };
  // }
}
