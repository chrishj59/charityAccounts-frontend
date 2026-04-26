import { Parameter } from '~/zenstack/models';

import { authDb } from '~/src/lib/db';
import { unstable_cache } from 'next/cache';

async function fetchParameters(name?: string): Promise<Parameter[]> {
  if (name) {
    return await authDb.parameter.findMany({ where: { name } });
  } else {
    return await authDb.parameter.findMany();
  }
}

export function getParameters(name?: string) {
  const key = name ?? 'ALL';
  return unstable_cache(
    async (): Promise<Parameter[]> => {
      return fetchParameters(name);
    },
    ['parameters', key],
    { revalidate: 3600, tags: ['parameters'] },
  )();
}
