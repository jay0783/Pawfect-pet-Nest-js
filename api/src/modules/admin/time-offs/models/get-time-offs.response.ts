import { PaginationResponse } from '@pawfect/models';
import { TimeOffShortViewModel } from './time-off-short.vm';


export interface GetTimeOffsResponse extends PaginationResponse<TimeOffShortViewModel> {
}
