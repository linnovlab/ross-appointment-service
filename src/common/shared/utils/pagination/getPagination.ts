import { PaginationDto } from './pagination.dto';

export const getPagination = (paginationDto: PaginationDto): PaginationDto => {
  if (paginationDto) {
    return paginationDto;
  } else {
    const defaultPagination = new PaginationDto();
    defaultPagination.limit = 10;
    defaultPagination.page = 1;
    defaultPagination.pageSize = 1;
    return defaultPagination;
  }
};
