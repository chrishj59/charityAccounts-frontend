import { NextRequest, NextResponse } from 'next/server';
import { db } from '~/src/lib/db';

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ name: string }>;
  },
) {
  const { name } = await params;

  const param = await db.parameter.findFirst({ where: { name } });
  return NextResponse.json(param);
}
