'use server';

import { ORMError } from '@zenstackhq/orm';
import { json } from 'zod';
import { authDb, db } from '~/src/lib/db';
import { DB_ERROR, statusEnum } from '~/src/types/helper';
import { FiscalPeriodRule } from '~/zenstack/models';
import { fiscPeriodRuleResponse } from '~/src/types/helper';
import { RationesOrganisation } from '~/src/types';
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
): Promise<fiscPeriodRuleResponse> {
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

  try {
    const found = await authDb.fiscalPeriodRule.findFirst({
      where: { id: rule.id },
    });

    const updated = await authDb.fiscalPeriodRule.update({
      where: { id: 1 },
      data: data,
    });
    console.log(`updated rule ${JSON.stringify(updated)}`);
    const resp: fiscPeriodRuleResponse = {
      status: statusEnum.SUCCESS,
      message: `Updated rule`,
      data: { fiscalPeriodRule: updated },
    };
    return resp;
  } catch (error) {
    console.log(`error ${JSON.stringify(error)}`);
    const _error = error as DB_ERROR;
    const errResp: fiscPeriodRuleResponse = {
      status: statusEnum.ERROR,
      message: `Could not update period rule`,
      data: { error: { reason: _error.reason, model: _error.model } },
    };

    return errResp;
  }
}
