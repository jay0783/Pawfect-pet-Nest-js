import { PaginationResponse } from '@pawfect/models';
import { GetOrderDetailsResponse } from './get-history.response';

export interface GetMainOrdersResponse
  extends PaginationResponse<GetOrderDetailsResponse> {}
