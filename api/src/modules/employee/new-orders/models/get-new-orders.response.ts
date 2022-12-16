import { PaginationResponse } from "@pawfect/models";
import { NewOrderViewModel } from "./new-order.vm";


export interface GetNewOrdersResponse extends PaginationResponse<NewOrderViewModel> { }
