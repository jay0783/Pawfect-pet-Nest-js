import { PaginationResponse } from '@pawfect/models';
import { ExtraServiceViewModel } from './extra-service.vm';

export interface GetPetExtraServiceResponse
  extends PaginationResponse<ExtraServiceViewModel> {}
