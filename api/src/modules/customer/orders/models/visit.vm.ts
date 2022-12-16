import { MainOrderVisitEnum } from '@pawfect/db/entities/enums';
import { MainOrderVisitEntity } from '@pawfect/db/entities';

export interface VisitViewModel {
  type: MainOrderVisitEnum;
  timeFrom: number;
  timeTo: number;
}

export function makeVisitViewModel(
  visitModel: MainOrderVisitEntity,
): VisitViewModel {
  return {
    timeFrom: visitModel.timeFrom.getTime(),
    timeTo: visitModel.timeTo.getTime(),
    type: visitModel.type,
  };
}

export function makeVisitViewModelMany(
  visitsModels: Array<MainOrderVisitEntity>,
): Array<VisitViewModel> {
  return visitsModels.map((item) => makeVisitViewModel(item));
}
