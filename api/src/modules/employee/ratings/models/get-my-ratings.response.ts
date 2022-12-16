import { PaginationResponse } from '@pawfect/models';
import { RatingViewModel } from './rating.vm';


export interface GetMyRatingsResponse extends PaginationResponse<RatingViewModel> { }
