import { PaginationResponse } from "@pawfect/models";
import { OrderViewModel } from "./order.vm";

export interface GetOrdersResponse extends PaginationResponse<OrderViewModel> { }
