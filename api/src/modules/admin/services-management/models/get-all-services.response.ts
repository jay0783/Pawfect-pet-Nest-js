import { PaginationResponse } from '@pawfect/models';
import { CategoryServiceViewModel } from './category-service.vm';

export interface GetAllServicesResponse
  extends PaginationResponse<CategoryViewModel> {}

export interface CategoryViewModel {
  id: string;
  name: string;
  imageUrl: string | null;
  services: CategoryServiceViewModel[];
}
