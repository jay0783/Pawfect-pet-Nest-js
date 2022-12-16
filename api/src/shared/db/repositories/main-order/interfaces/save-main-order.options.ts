import { DateTime } from "luxon";
import { CustomerEntity, ServiceEntity } from "@pawfect/db/entities";


export interface SaveMainOrderOptions {
  startedDate: DateTime;
  endedDate: DateTime;
  comment?: string;
  totalAmountSafe: number;
}


export interface SaveMainOrderRelations {
  customer: CustomerEntity;
  service: ServiceEntity;
}
