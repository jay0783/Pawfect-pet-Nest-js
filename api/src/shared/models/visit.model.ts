import { MainOrderVisitEnum } from '@pawfect/db/entities/enums';

export interface VisitModel {
  time: number;
  type: MainOrderVisitEnum;
}
