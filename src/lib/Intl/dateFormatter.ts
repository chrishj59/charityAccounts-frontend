type DateFormatKey = string;
const cache = new Map<DateFormatKey, Intl.DateTimeFormat>();

export function getDateFormatter(
  locale: string,
  options: Intl.DateTimeFormatOptions = {},
): Intl.DateTimeFormat {
  const key = JSON.stringify([locale, options]);

  let formatter = cache.get(key);

  if (!formatter) {
    formatter = new Intl.DateTimeFormat(locale, options);
    cache.set(key, formatter);
  }

  return formatter;
}

export const getShortDateFormatter = () =>
  getDateFormatter('en-GB', { dateStyle: 'short' });
export const getMediumDateFormatter = () =>
  getDateFormatter('en-GB', { dateStyle: 'medium' });
export const getLongDateFormatter = () =>
  getDateFormatter('en-GB', { dateStyle: 'long' });
