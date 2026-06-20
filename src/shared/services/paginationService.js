export class PaginationService {
    static paginate(items, page, pageSize) {
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
    static calculateOffset(page, pageSize) {
        return (page - 1) * pageSize;
    }
}
