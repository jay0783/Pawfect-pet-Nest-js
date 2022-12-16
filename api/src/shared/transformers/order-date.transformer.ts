/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { DateTime } from "luxon";
import { TransformationType } from "class-transformer/enums";


export function createOrderDateTransformer({ dateProperty, visitProperty }: { dateProperty: string; visitProperty: string; }) {
  return (value: any, obj: any, transformationType: TransformationType): Array<{ dateFrom: DateTime; }> | undefined => {
    const dates: Array<number> = obj[dateProperty];
    const visits: Array<{ time: number; }> = obj[visitProperty];

    const visitsDateTime = visits.map((item) => DateTime.fromMillis(item.time));

    const visitByDate: Array<{ dateFrom: DateTime; }> = [];

    for (const date of dates) {
      for (const visit of visitsDateTime) {
        const dateFrom = DateTime.fromMillis(date).set({
          hour: visit.hour, minute: visit.minute, second: visit.second, millisecond: 0
        });

        visitByDate.push({ dateFrom });
      }
    }

    return visitByDate;
  };
}
