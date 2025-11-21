'use server';

import { revalidatePath } from 'next/cache';
import { getUserDb } from '~/server/db';

export async function createList(title: string) {
  const db = await getUserDb();
  await db.list.create({ data: { title } });
  revalidatePath('/');
}
