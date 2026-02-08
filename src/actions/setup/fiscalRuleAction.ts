'use server';

import { ORMError } from '@zenstackhq/orm';
import { authDb } from '~/src/lib/db';
import { DB_ERROR } from '~/src/types/helper';
import { FiscalPeriodRule } from '~/zenstack/models';
export async function fiscalRuleAddAction(
  rule: FiscalPeriodRule,
): Promise<FiscalPeriodRule> {
  console.log(`called fiscalRuleAdd with ${JSON.stringify(rule)}`);

  const payload = {
    data: {
      name: rule.name,
      monthNum: rule.monthNum,
      day: rule.day,
      fiscPeriod: rule.fiscPeriod,
      yearShift: rule.yearShift,
      calendarBased: rule.calendarBased,
    },
  };

  const updated = await authDb.fiscalPeriodRule.create(payload);

  return updated;
}

export async function fiscalRuleUpdateAction(
  rule: FiscalPeriodRule,
): Promise<FiscalPeriodRule | unknown> {
  console.log(`called fiscalRuleAdd with ${JSON.stringify(rule)}`);

  const payload = {
    where: { id: rule.id },
    data: {
      name: rule.name,
      monthNum: rule.monthNum,
      day: rule.day,
      fiscPeriod: rule.fiscPeriod,
      yearShift: rule.yearShift,
      calendarBased: rule.calendarBased,
    },
  };

  const data = {
    name: rule.name,
    monthNum: rule.monthNum,
    day: rule.day,
    fiscPeriod: rule.fiscPeriod,
    yearShift: rule.yearShift,
    calendarBased: rule.calendarBased,
  };
  console.log(`payload ${JSON.stringify(payload)}`);
  console.log(`data ${JSON.stringify(data)}`);

  try {
    const updated = await authDb.fiscalPeriodRule.update({
      where: { id: rule.id },
      data: data,
    });
    console.log(`updates ${JSON.stringify(updated)}`);
    return updated;
  } catch (error) {
    console.log(`error ${JSON.stringify(error)}`);

    return error;
  }
}
