import { NextRequest, NextResponse } from 'next/server';
import { db } from '~/src/lib/db';
import { FiscPeriodRuleFormValues } from '~/src/zodSchema/fisYearPeriod';

export async function POST(req: NextRequest) {
  const body: FiscPeriodRuleFormValues = await req.json();

  try {
    const resp = await db.fiscalPeriodRule.create({
      data: body,
      // {
      //   id: 1,

      //   name: 'fred',
      //   monthNum: 1,
      //   day: 1,
      //   fiscPeriod: 1,
      //   yearShift: false,
      // },
    });
    return NextResponse.json(resp);
  } catch (err) {
    const _err = JSON.stringify(err);
    console.error(`error thrown ${_err}`);

    return NextResponse.json(_err);
  }
  return NextResponse.json(body);
}
