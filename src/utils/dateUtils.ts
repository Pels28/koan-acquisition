/* eslint-disable @typescript-eslint/no-explicit-any */
import { parseDate } from '@internationalized/date';

// Convert API date string to CalendarDate object
export const toCalendarDate = (dateStr: string | null | undefined) => {
  if (!dateStr) return null;
  return parseDate(dateStr);
};

// Convert CalendarDate object to API date string
export const toApiDate = (dateObj: any | null | undefined) => {
  if (!dateObj) return null;
  return `${dateObj.year}-${String(dateObj.month).padStart(2, '0')}-${String(dateObj.day).padStart(2, '0')}`;
};