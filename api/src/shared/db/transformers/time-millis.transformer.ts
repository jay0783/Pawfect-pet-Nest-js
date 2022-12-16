import { ValueTransformer } from "typeorm";
import { DateTime } from "luxon";


export class TimeMillisTransformer implements ValueTransformer {
  from(value: string): any {
    if (!value) {
      return value;
    }

    const [hours = 0, minutes = 0, seconds = 0] = value.split(":");
    const timeMillis: number = ((((+hours * 60) + +minutes) * 60) + +seconds) * 1000;
    return timeMillis;
  }


  to(value: number): any {
    return DateTime.fromMillis(value).toFormat("HH:mm:ss");
  }
}
