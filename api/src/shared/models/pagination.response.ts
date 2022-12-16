import { IPaginationMeta } from 'nestjs-typeorm-paginate';

export interface PaginationResponse<T> {
  items: Array<T>;
  meta?: IPaginationMeta;
  data?: string;
}
