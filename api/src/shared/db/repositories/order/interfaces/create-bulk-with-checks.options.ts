import { ServiceCheckEntity } from '@pawfect/db/entities';
import { VisitModel } from './visit.model';

export interface CreateBulkWithChecksOptions {
  dates: Array<VisitModel>;
  serviceChecks: Array<ServiceCheckEntity>;
  priceWithExtras: number;
  holidayFee: number;
  comment?: string;
}
