import { PaginationResponse } from "@pawfect/models";
import { UpcomingOrderViewModel } from "./upcoming-order.vm";


export interface GetUpcomingOrdersResponse extends PaginationResponse<UpcomingOrderViewModel> {
}
