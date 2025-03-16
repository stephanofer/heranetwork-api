export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  message?: string;
  timestamp: string;
  //   pagination?: {
  //     page: number;
  //     limit: number;
  //     totalPages: number;
  //     totalItems: number;
  //   };
}

// export interface PaginatedResponse<T> extends ApiResponse<T> {
//   pagination: {
//     page: number;
//     limit: number;
//     totalPages: number;
//     totalItems: number;
//   };
// }
