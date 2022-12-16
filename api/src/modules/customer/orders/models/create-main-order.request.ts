import { DateTime } from 'luxon';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  IsNumber,
} from 'class-validator';

import { VisitModel } from '@pawfect/models';
import { IsAppNotEmptyArray, IsAppVisitMany } from '@pawfect/validators';
import { MainOrderVisitEnum } from '@pawfect/db/entities/enums';
import Decimal from 'decimal.js';

export class CreateMainOrderRequest {
  @IsNotEmpty()
  @IsUUID()
  readonly serviceId!: string;

  @IsString({ each: true })
  @IsAppNotEmptyArray()
  readonly petIds!: Array<string>;

  @IsArray()
  @IsAppNotEmptyArray() // TODO 23.03.21: add validation day > today
  @ArrayMinSize(1)
  @ArrayMaxSize(30)
  readonly dates!: Array<number>;

  @IsOptional()
  @IsNotEmpty()
  readonly comment?: string;

  @IsOptional()
  @IsUUID(undefined, { each: true })
  @IsString({ each: true })
  readonly extraIds: Array<string> = new Array<string>();

  @IsAppVisitMany()
  readonly visits!: Array<VisitModel>;

  @IsNotEmpty()
  @IsNumber()
  amount!: number;

  getOrderDates(
    serviceInfo: { sumDuration: number },
    priceWithExtrasPerOrder: Decimal,
    holidayFeePercent: number,
    holidaySet: Set<number>,
  ): { dates: Array<MainOrderVisitModel> } {
    const allVisits: Array<MainOrderVisitModel> = new Array<MainOrderVisitModel>();
    const holidayFee: Decimal = new Decimal(priceWithExtrasPerOrder)
      .mul(holidayFeePercent)
      .div(100);
    const visitsDateTime = this.visits.map((item) =>
      DateTime.fromMillis(item.time),
    );

    for (const date of this.dates) {
      const dateDateTime = DateTime.fromMillis(date).set({
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
      });
      const isHoliday = holidaySet.has(dateDateTime.toMillis());

      for (const visit of visitsDateTime) {
        const dateFrom = DateTime.fromMillis(date).set({
          hour: visit.hour,
          minute: visit.minute,
          second: visit.second,
          millisecond: 0,
        });
        const dateTo = dateFrom.plus({ minutes: serviceInfo.sumDuration });

        const amountDecimal: Decimal =
          isHoliday && holidayFeePercent
            ? priceWithExtrasPerOrder.plus(holidayFee)
            : priceWithExtrasPerOrder;

        const amount: number = +amountDecimal.toFixed(2);
        allVisits.push({
          dateFrom,
          dateTo,
          isHoliday,
          amount,
        });
      }
    }

    return { dates: allVisits };
  }

  getMainOrderVisits(serviceInfo: {
    sumDuration: number;
  }): Array<{
    timeFrom: DateTime;
    timeTo: DateTime;
    type: MainOrderVisitEnum;
    // amount: number
  }> {
    const visitModels = [];
    for (const plainVisit of this.visits) {
      const timeFrom = DateTime.fromMillis(plainVisit.time);
      const timeTo = timeFrom.plus({ minute: serviceInfo.sumDuration });
      visitModels.push({ timeFrom, timeTo, type: plainVisit.type });
    }
    return visitModels;
  }
}

interface MainOrderVisitModel {
  dateFrom: DateTime;
  dateTo: DateTime;
  amount: number;
  isHoliday: boolean;
}
