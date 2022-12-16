import { BookingRestrictionsEntity } from '@pawfect/db/entities';

export interface bookingRestrictionViewModel {
  [title: string]: {
    id: string;
    months: number;
    days: number;
    hours: number;
    minutes: number;
  };
}

export function makeBookingRestrictionsViewModelMany(
  bookingRestrictionsEntities: Array<BookingRestrictionsEntity>,
): bookingRestrictionViewModel {
  const obj: bookingRestrictionViewModel = {};
  for (const bookingRestriction of bookingRestrictionsEntities) {
    obj[bookingRestriction.title] = {
      id: bookingRestriction.id,
      months: bookingRestriction.months,
      days: bookingRestriction.days,
      hours: bookingRestriction.hours,
      minutes: bookingRestriction.minutes,
    };
  }
  return obj;
}
