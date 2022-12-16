import { ServiceCheckViewModel } from './service-check.vm';
import { PetSpeciesEnum } from '@pawfect/db/entities/pet/enums';

export interface GetServiceDetailsResponse {
  id: string;
  title: string;
  price: number;
  duration?: number;
  forSpeciesTypes: PetSpeciesEnum[];
  description: string;
  checklist: ServiceCheckViewModel[];
}
