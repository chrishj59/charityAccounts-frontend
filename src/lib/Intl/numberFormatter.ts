type NumberFormatKey = string;
const cache = new Map<NumberFormatKey, Intl.NumberFormat>();

export function getNumberFormatter(
  locale: string,
  options: Intl.NumberFormatOptions = {},
): Intl.NumberFormat {
  const key = JSON.stringify([locale, options]);

  let formatter = cache.get(key);

  if (!formatter) {
    formatter = new Intl.NumberFormat(locale, options);
    cache.set(key, formatter);
  }

  return formatter;
}

export const getGbpFormatter = () =>
  getNumberFormatter('en-GB', {
    style: 'currency',
    currency: 'GBP',
  });
