import { NextRequest, NextResponse } from 'next/server';
import { currency4217RowIF } from '../../../../interface/currency4217.interface';
import { ISO4217Currency } from '~/zenstack/models';
import { authDb } from '~/src/lib/db';
import { ORMError } from '@zenstackhq/orm';

export async function POST(req: NextRequest) {
  try {
    const data: currency4217RowIF[] = await req.json();
    console.log(`number of records ${data.length}`);

    // const validRows = data.filter((row) => {
    //   console.log(`filter row ${JSON.stringify(row, null, 2)}`);
    //   row.entity && row.currency;
    //   console.log(`Number of valid rows ${validRows.length}`);
    //   if (validRows.length < 1) {
    //     return NextResponse.json(
    //       { error: `No valid rows ${JSON.stringify(data[0], null, 2)}` },
    //       { status: 500 },
    //     );
    //   }
    // });
    const validRows = data.filter(
      (row) =>
        // console.log(`filter row ${JSON.stringify(row, null, 2)}`);
        row.entity && row.currency,
    );
    console.log(`Valid rows ${validRows.length}`);
    for (const row of validRows) {
      const payload: currency4217RowIF = {
        entity: row.entity,
        currency: row.currency,
        alphabeticCode: row.alphabeticCode,
        numericCode: row.numericCode,
        minorUnit: row.minorUnit,
        withdrawalDate: row.withdrawalDate,
      };
      try {
        await authDb.iSO4217Currency.create({
          data: payload,
        });
      } catch (err) {
        if (err instanceof ORMError) {
          console.log(`Error cause ${JSON.stringify(err, null, 2)}`);
          console.error(
            `Permissions error ${JSON.stringify(err.rejectedByPolicyReason, null, 2)}`,
          );
          console.error(`db error ${JSON.stringify(err.dbErrorCode)}`);
          console.error(`Reason ${JSON.stringify(err.reason)}`);
        } else {
          console.log(`Error cause ${JSON.stringify(err, null, 2)}`);
        }
        return NextResponse.json(
          { error: JSON.stringify(err, null, 2) || 'Server error' },
          { status: 500 },
        );
      }
    }
    return NextResponse.json({ success: true, count: data.length });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Server error' },
      { status: 500 },
    );
  }
}
