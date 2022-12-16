import { DateTime } from 'luxon';

export class DatesManager {
  private _dates: DateTime[] = [];

  constructor(datesInMs: number[] = []) {
    // console.log('111111', datesInMs);
    this.fromMillis(datesInMs);
  }

  set dates(value: DateTime[]) {
    this._dates = value;
  }

  get dates() {
    return this._dates;
  }

  private loadDatesFromMillis(datesMs: number[]): void {
    this.dates = datesMs.map((dateMs) => DateTime.fromMillis(dateMs));
  }

  toJSDates(): Date[] {
    return this.dates.map((date) => date.toJSDate());
  }

  toMillis(): number[] {
    return this.dates.map((date) => date.toMillis());
  }

  fromMillis(dates: number[]): DatesManager {
    // console.log('2222222', dates);
    this.loadDatesFromMillis(dates);
    return this;
  }

  setDateTimesToZero(): DatesManager {
    // this.convertUtcToLocal();
    this.dates = this.dates.map((date) =>
      date.set({
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
      }),
    );

    return this;
  }

  removeDuplicates(): DatesManager {
    const datesInMs = this.dates.map((date) => date.toMillis());
    // console.log('----datesInMs----', datesInMs);
    const datesWithoutDuplicates = [...new Set(datesInMs)];
    // console.log('[-][-][-]', datesWithoutDuplicates);
    this.loadDatesFromMillis(datesWithoutDuplicates);
    return this;
  }

  minDate(): DateTime {
    return DateTime.min(...this.dates);
  }

  maxDate(): DateTime {
    return DateTime.max(...this.dates);
  }

  containsDates(dates: Date[]): boolean {
    const datesInMs = this.dates.map((date) => date.toMillis());

    return dates.some((day) => datesInMs.includes(+day));
  }

  get hasOnlyFutureDates(): boolean {
    const now = DateTime.utc()
      .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
      .toMillis();
    return this.dates.every((date) => date.toMillis() >= now);
  }
}
