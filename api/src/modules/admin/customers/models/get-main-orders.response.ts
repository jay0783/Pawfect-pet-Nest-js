import { PaginationResponse } from '@pawfect/models';
import { MainOrderViewModel } from './main-order.vm';

export interface GetMainOrdersResponse
  extends PaginationResponse<MainOrderViewModel> {}
