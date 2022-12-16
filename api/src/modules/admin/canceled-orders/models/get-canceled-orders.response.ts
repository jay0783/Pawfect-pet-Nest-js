import { PaginationResponse } from '@pawfect/models';
import { CanceledOrderViewModel } from './canceled-order.vm';


export interface GetCanceledOrdersResponse extends PaginationResponse<CanceledOrderViewModel>{
}
