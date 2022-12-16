import { PaginationResponse } from "@pawfect/models";
import { TimeOffViewModel } from "./time-off.vm";


export interface GetTimeOffsResponse extends PaginationResponse<TimeOffViewModel> {
}
