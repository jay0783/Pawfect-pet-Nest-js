import { plainToClass } from 'class-transformer';
import { DateTime } from 'luxon';
import { EntityRepository, Repository } from 'typeorm';
import { HolidayEntity } from '../entities';

@EntityRepository(HolidayEntity)
export class HolidayRepository extends Repository<HolidayEntity> {
  async findByRange(
    dateFrom: DateTime,
    dateTo: DateTime,
  ): Promise<Array<HolidayEntity>> {
    dateFrom = dateFrom.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    dateTo = dateTo.set({ hour: 23, minute: 59, second: 59, millisecond: 59 });

    const query = this.manager.connection
      .createQueryBuilder()
      .from(
        (qb) =>
          qb
            .subQuery()
            .select('*')
            .addSelect(
              "make_timestamp(date_part('year', current_date)::int, Holidays.month, Holidays.day, 0, 0, 0.0)",
              'holiday',
            )
            .from('Holidays', 'Holidays'),
        'ExtendedHolidays',
      )
      .where(
        '("ExtendedHolidays"."holiday" >= :dateFrom::timestamp and "ExtendedHolidays"."holiday" <= :dateTo::timestamp)',
        {
          dateFrom: dateFrom.toJSDate(),
          dateTo: dateTo.toJSDate(),
        },
      );

    const rawEntities: Array<any> = await query.getRawMany();

    const holidayEntities: Array<HolidayEntity> = rawEntities.map((item) =>
      plainToClass(HolidayEntity, item),
    );

    return holidayEntities;
  }

  async toggleHoliday(
    day: number,
    month: number,
  ): Promise<HolidayEntity | undefined> {
    let holidayEntity = await this.findOne({ where: { day, month } });

    if (holidayEntity) {
      await this.remove(holidayEntity);
      return;
    }

    holidayEntity = new HolidayEntity();
    holidayEntity.day = day;
    holidayEntity.month = month;
    await this.save(holidayEntity);
    return holidayEntity;
  }

  async getSetByDateRange(date: {
    dateFrom: DateTime;
    dateTo: DateTime;
  }): Promise<Set<number>> {
    const query = this.manager.connection
      .createQueryBuilder()
      .from(
        (qb) =>
          qb
            .subQuery()
            .select('*')
            .addSelect(
              "make_timestamp(date_part('year', current_date)::int, Holidays.month, Holidays.day, 0, 0, 0.0)",
              'holiday',
            )
            .from('Holidays', 'Holidays'),
        'ExtendedHolidays',
      )
      .where(
        '("ExtendedHolidays"."holiday" >= :dateFrom::timestamp and "ExtendedHolidays"."holiday" <= :dateTo::timestamp)',
        {
          dateFrom: date.dateFrom.set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          }),
          dateTo: date.dateTo.set({
            hour: 23,
            minute: 59,
            second: 59,
            millisecond: 59,
          }),
        },
      );
    // console.log('query:=====>>> ', query.getQuery());

    const rawEntities: Array<any> = await query.getRawMany();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const holidayTimestamps = rawEntities.map((item) =>
      new Date(item.holiday).getTime(),
    );
    const holidayTimestampSet = new Set<number>(holidayTimestamps);
    return holidayTimestampSet;
  }
}
