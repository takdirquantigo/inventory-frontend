import { clsx } from 'clsx';
import { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { format, parseISO } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler); // cleanup
  }, [value, delay]);

  return debouncedValue;
}



  const BD_TIMEZONE = 'Asia/Dhaka';

  export const formatToBDTime = (dateString) => {
    if (!dateString) return null;

    const utcDate = parseISO(dateString);
    if (isNaN(utcDate)) return null;

    const bdDate = toZonedTime(utcDate, BD_TIMEZONE);

    return format(bdDate, 'PPpp'); // example: Apr 11, 2026 11:18 PM
  };