import { FiscalPeriodRule } from '~/zenstack/models';

import { getLoggedInSession } from '~/src/utils/helper';
import { authDb } from '~/src/lib/db';
import FiscPeriodRule from '~/src/components/client/company/fiscalPeriodRule';
import { fiscalPeriodRuleIF } from '~/src/interface/ficalPeriodRule.interface';

export default async function FisPeriod() {
  const session = getLoggedInSession();

  const rules: FiscalPeriodRule[] = await authDb.fiscalPeriodRule.findMany();
  const rulesUI: fiscalPeriodRuleIF[] = [];
  rules.forEach((rule) => {
    const _rule: fiscalPeriodRuleIF = {
      id: rule.id,
      name: rule.name,
      monthNum: rule.monthNum,
      day: rule.day,
      fiscPeriod: rule.fiscPeriod,
      organisationId: rule.organizationId,
      yearShift: rule.yearShift,
      calendarBased: rule.calendarBased,
    };
    rulesUI.push(_rule);
  });
  console.log(`rules returned 2 ${JSON.stringify(rules)}`);
  console.log(` UI rules returned 2 ${JSON.stringify(rulesUI)}`);

  <div>Fiscal-year-period Page</div>;
  // return <FiscPeriodRule fiscRules={rulesUI} />;
}
