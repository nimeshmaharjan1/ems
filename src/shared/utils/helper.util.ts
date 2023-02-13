import { DateTime } from 'luxon';

export const isObj = <T>(arg: T): boolean => {
  return typeof arg === 'object' && !Array.isArray(arg) && arg !== null;
};

export const getDateWithWeekDay = (date: Date) => {
  const newDate = new Date(date);
  return DateTime.fromJSDate(newDate).toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY);
};

export const formatPrice = (price: string) => {
  return new Intl.NumberFormat('en-IN').format(parseInt(price));
};

export const currency = '&#8377;';
