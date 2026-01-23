import { NextRequest, NextResponse } from 'next/server';
import { db } from '~/src/lib/db';
import { Parameter } from '~/zenstack/models';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get('name');
  if (!query) {
    const paramList: Parameter[] = await db.parameter.findMany();
    return NextResponse.json(paramList);
  } else {
    const param = await db.parameter.findMany({ where: { name: query } });
    return NextResponse.json(param);
  }
}
