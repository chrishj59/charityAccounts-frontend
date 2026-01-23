import { NextRequest, NextResponse } from 'next/server';
import { db } from '~/src/lib/db';
import { FiscYearVariantFormValues } from '~/src/zodSchema/fisYearVariant';

export async function POST(req: NextRequest) {
  const body: FiscYearVariantFormValues = await req.json();

  try {
    const resp = await db.fiscalYearVariant.create({
      data: {
        id: 1,

        name: 'fred',
        monthNum: 1,
        day: 1,
        fiscPeriod: 1,
        yearShift: false,
      },
    });
    return NextResponse.json(resp);
  } catch (err) {
    const _err = JSON.stringify(err);
    console.error(`error thrown ${_err}`);

    return NextResponse.json(_err);
  }
  return NextResponse.json(body);
}
