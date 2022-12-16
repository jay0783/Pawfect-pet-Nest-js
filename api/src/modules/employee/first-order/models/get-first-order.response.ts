import { PaginationResponse } from '@pawfect/models';
import { FirstOrderViewModel } from './new-order.vm';

export interface GetFirstOrdersResponse
  extends PaginationResponse<FirstOrderViewModel> {}
