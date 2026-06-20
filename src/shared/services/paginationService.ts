// shared/services/paginationService.ts
export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  pageCount: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export class PaginationService {
  static paginate<T>(
    items: T[],
    page: number,
    pageSize: number
  ): PaginatedResult<T> {
    const total = items.length;
    const pageCount = Math.ceil(total / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, total);

    return {
      data: items.slice(startIndex, endIndex),
      total,
      pageCount,
      currentPage: page,
      hasNextPage: page < pageCount,
      hasPreviousPage: page > 1,
    };
  }

  static calculateOffset(page: number, pageSize: number): number {
    return (page - 1) * pageSize;
  }
}