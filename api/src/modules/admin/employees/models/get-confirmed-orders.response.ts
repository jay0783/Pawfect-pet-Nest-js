import { PaginationResponse } from "@pawfect/models";
import { ConfirmedOrderViewModel } from "./confirmed-order.vm";


export interface GetConfirmedOrdersResponse extends PaginationResponse<ConfirmedOrderViewModel> { }
