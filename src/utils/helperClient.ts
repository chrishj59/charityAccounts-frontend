export function getCurrencyFormatter(
  curcyCode: string,
  locale: string,
): Intl.NumberFormat {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: curcyCode,
  });
}

export function getLongDateFormatter(locale: string): Intl.DateTimeFormat {
  return new Intl.DateTimeFormat(locale, { dateStyle: 'long' });
}

// export function getShortDateFormatter(locale: string): Intl.DateTimeFormat {
//   //TODO: convert to cache
//   const cache = new Map<string, Intl.DateTimeFormat>();
//   return new Intl.DateTimeFormat(locale, { dateStyle: 'short' });
// }

export function getRelativeFormatter(locale: string): Intl.RelativeTimeFormat {
  return new Intl.RelativeTimeFormat(locale, { numeric: 'always' });

  //ex: formatter.format(1, "day")
}

export function nullToUndefined<T extends Record<string, unknown>>(obj: T) {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, v === null ? undefined : v]),
  ) as { [K in keyof T]: Exclude<T[K], null> | undefined };
}
