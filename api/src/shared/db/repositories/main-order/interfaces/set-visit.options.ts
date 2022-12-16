import { DateTime } from "luxon";
import { MainOrderVisitEnum } from "@pawfect/db/entities/enums";


export interface SetVisitOptions {
  timeFrom: DateTime;
  timeTo: DateTime;
  type: MainOrderVisitEnum;
}
