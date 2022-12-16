import { ServiceCheckEntity } from '@pawfect/db/entities';

export interface ServiceCheckViewModel {
  id: string;
  name: string;
  duration: number;
  blocked: boolean;
  numOrder: number;
}

export function makeServiceCheckViewModel(
  checkEntity: ServiceCheckEntity,
): ServiceCheckViewModel {
  return {
    id: checkEntity.id,
    name: checkEntity.name,
    duration: checkEntity.duration,
    blocked: checkEntity.blocked,
    numOrder: checkEntity.numOrder,
  };
}
