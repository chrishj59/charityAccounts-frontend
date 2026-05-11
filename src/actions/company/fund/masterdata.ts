'use server';

import { FundNewFormValues } from '~/src/zodSchema/fund-new-schema';

import { getUserDb } from '~/src/lib/db';
import { responseType, statusEnum } from '~/src/types/helper';

import { ORMError, ORMErrorReason } from '@zenstackhq/orm';
import { ISO4217Currency } from '~/zenstack/models';
// TODO: Add currencyb param from UI when other currencies support
const getCurrency = async (
  currcode: string,
  userId: string,
  orgId: string,
): Promise<ISO4217Currency> => {
  const userDb = await getUserDb(userId, orgId);
  try {
    const _currency = await userDb.iSO4217Currency.findFirst({
      where: { alphabeticCode: 'GBP' },
    });

    if (!_currency) {
      throw Error(`no Currency found `);
    }

    return _currency;
  } catch (err) {
    if (err instanceof ORMError) {
      console.error(`Permission issue ${err.rejectedByPolicyReason}`);
      console.error(`db error ${err.dbErrorCode} ${err.dbErrorMessage}`);
      console.error(`reason ${err.reason} ${err.cause}`);
      if (err.dbErrorCode) {
        console.error(`sql ${err.sql} params ${err.sqlParams}`);
      }
    }
    throw Error(`No Currency found other error `);
  }
};
const addGeneralFund = async (
  fundType: string,
  fund: FundNewFormValues,

  userId: string,
  orgId: string,
): Promise<responseType> => {
  const userDb = getUserDb(userId, orgId);
  const _currency = await getCurrency('GBP', userId, orgId);
  const payload = {
    data: {
      fundName: fund.name,

      donarName: fund.donar,
      fundType: fundType,
      objective: fund.objective,
      reviewDate: fund.reviewDate,
      managedById: userId,
      organizationId: orgId,
      balance: 0,
      curcyCode: _currency.alphabeticCode,
      currencyId: _currency.id,
    },
  };
  try {
    console.log(`payload ${JSON.stringify(payload, null, 2)}`);
    const funds = await (await userDb).generalFund.findMany();

    console.log(`funds in add ${JSON.stringify(funds, null, 2)}`);
    try {
      await (await userDb).generalFund.create(payload);
    } catch (err) {
      if (err instanceof ORMError) {
        console.log(`Error reason ${err.reason}`);
        console.log(`Model with issue ${err.model}`);
        console.log(`Permission error ${err.rejectedByPolicyReason}`);
        console.log(`Cause ${err.cause}`);
      }
    }

    return {
      status: statusEnum.SUCCESS,
      message: `Created General fund ${payload.data.fundName}`,
    };
  } catch (error) {
    if (error instanceof ORMError) {
      console.log(
        `Permission error ${JSON.stringify(error.rejectedByPolicyReason)}`,
      );
      console.log(`error cause ${JSON.stringify(error.cause)}`);
    }
    console.error(`Error from create General Fund ${JSON.stringify(error)}`);
    return {
      status: statusEnum.ERROR,
      message: `Could not create General Fund ${payload.data.fundName}`,
      errMessage: `Update error ${JSON.stringify(error)}`,
    };
  }
};

const designatedFund = async (
  fundType: string,
  fund: FundNewFormValues,

  userId: string,
  orgId: string,
): Promise<responseType> => {
  const userDb = await getUserDb(userId, orgId);
  const _currency = await getCurrency('GBP', userId, orgId);

  const payload = {
    data: {
      fundName: fund.name,

      donarName: fund.donar,
      fundType: fund.fundType,
      objective: fund.objective,
      reviewDate: fund.reviewDate,
      managedById: userId,
      organizationId: orgId,
      designatedDate: fund.designatedDate ? fund.designatedDate : new Date(),
      designatedMeeting: fund.designatedMeeting,
      projectEndDate: fund.projectEndDate ? fund.projectEndDate : new Date(),
      designationCreatedById: userId,
      designatedById: userId,
      curcyCode: _currency.alphabeticCode,
      currencyId: _currency.id,
    },
  };
  try {
    await (await userDb).designatedFund.create(payload);
    return {
      status: statusEnum.SUCCESS,
      message: `Created Designated fund ${payload.data.fundName}`,
    };
  } catch (error) {
    if (error instanceof ORMError) {
      console.log(
        `Permission error ${JSON.stringify(error.rejectedByPolicyReason)}`,
      );
      console.log(`error cause ${JSON.stringify(error.cause)}`);
    }

    return {
      status: statusEnum.ERROR,
      message: `Could not create Designated Fund ${payload.data.fundName}`,
      errMessage: `Update error ${JSON.stringify(error)}`,
    };
  }
};

const incomeFund = async (
  fundType: string,
  fund: FundNewFormValues,

  userId: string,
  orgId: string,
): Promise<responseType> => {
  const userDb = await getUserDb(userId, orgId);
  const _currency = await getCurrency('GBP', userId, orgId);
  const payload = {
    data: {
      fundName: fund.name,

      donarName: fund.donar,
      fundType: fund.fundType,
      objective: fund.objective,
      reviewDate: fund.reviewDate,
      managedById: userId,
      organizationId: orgId,
      projectEndDate: fund.projectEndDate ? fund.projectEndDate : new Date(),

      nextDonarReviewDate: fund.nextDonarReviewDate,

      returnSurplus: fund.returnSurplus,
      curcyCode: _currency.alphabeticCode,
      currencyId: _currency.id,
    },
  };
  try {
    await userDb.incomeFund.create(payload);
    return {
      status: statusEnum.SUCCESS,
      message: `Created Designated fund ${payload.data.fundName}`,
    };
  } catch (error) {
    if (error instanceof ORMError) {
      console.log(
        `Permission error ${JSON.stringify(error.rejectedByPolicyReason)}`,
      );
      console.log(`error cause ${JSON.stringify(error.cause)}`);
    }
    return {
      status: statusEnum.ERROR,
      message: `Could not create Designated Fund ${payload.data.fundName}`,
      errMessage: `Update error ${JSON.stringify(error)}`,
    };
  }
};

const expendableFund = async (
  fundType: string,
  fund: FundNewFormValues,

  userId: string,
  orgId: string,
): Promise<responseType> => {
  const userDb = await getUserDb(userId, orgId);
  const _currency = await getCurrency('GBP', userId, orgId);
  const payload = {
    data: {
      fundName: fund.name,

      donarName: fund.donar,
      fundType: fund.fundType,
      objective: fund.objective,
      reviewDate: fund.reviewDate,
      managedById: userId,
      organizationId: orgId,
      nextDonarReviewDate: fund.nextDonarReviewDate
        ? fund.nextDonarReviewDate
        : new Date(),
      projectEndDate: fund.projectEndDate ? fund.projectEndDate : new Date(),
      // returnSurplus: fund.returnSurplus,
      curcyCode: _currency.alphabeticCode,
      currencyId: _currency.id,
    },
  };
  try {
    await userDb.endownmentExpendable.create(payload);
    return {
      status: statusEnum.SUCCESS,
      message: `Created Expendable Endownmentfund: ${payload.data.fundName}`,
    };
  } catch (error) {
    if (error instanceof ORMError) {
      console.log(
        `Permission error ${JSON.stringify(error.rejectedByPolicyReason)}`,
      );
      console.log(`error cause ${JSON.stringify(error.cause)}`);
    }
    return {
      status: statusEnum.ERROR,
      message: `Could not create Designated Fund ${payload.data.fundName}`,
      errMessage: `Update error ${JSON.stringify(error)}`,
    };
  }
};

const permanentFund = async (
  fundType: string,
  fund: FundNewFormValues,

  userId: string,
  orgId: string,
): Promise<responseType> => {
  const userDb = await getUserDb(userId, orgId);
  const _currency = await getCurrency('GBP', userId, orgId);
  const payload = {
    data: {
      fundName: fund.name,

      donarName: fund.donar,
      fundType: fund.fundType,
      objective: fund.objective,
      reviewDate: fund.reviewDate,
      managedById: userId,
      organizationId: orgId,
      nextDonarReviewDate: fund.nextDonarReviewDate
        ? fund.nextDonarReviewDate
        : new Date(),
      projectEndDate: fund.projectEndDate ? fund.projectEndDate : new Date(),
      returnSurplus: fund.returnSurplus,
      curcyCode: _currency.alphabeticCode,
      currencyId: _currency.id,
    },
  };
  try {
    console.log(`create permanentFund`);
    const res = await userDb.endownmentPermanent.create(payload);
    console.log(
      `result of userDb.endownmentPermanent.create ${JSON.stringify(res, null, 2)}`,
    );
    return {
      status: statusEnum.SUCCESS,
      message: `Created Permanent Endownment fund:  ${payload.data.fundName}`,
    };
  } catch (error) {
    if (error instanceof ORMError) {
      console.log(
        `Permission error ${JSON.stringify(error.rejectedByPolicyReason)}`,
      );
      console.log(`error cause ${JSON.stringify(error.cause)}`);
    }
    return {
      status: statusEnum.ERROR,
      message: `Could not create Designated Fund ${payload.data.fundName}`,
      errMessage: `Update error ${JSON.stringify(error)}`,
    };
  }
};

export async function fundAddAction(
  fund: FundNewFormValues,
  userId: string,
  orgId: string,
): Promise<responseType> {
  const fundType = fund.fundType;
  switch (fundType) {
    case 'General':
      return addGeneralFund(fundType, fund, userId, orgId);

    case 'Designated':
      return designatedFund(fundType, fund, userId, orgId);
    case 'Income':
      return incomeFund(fundType, fund, userId, orgId);
    case 'Expendable':
      return expendableFund(fundType, fund, userId, orgId);
    case 'Permanent':
      return permanentFund(fundType, fund, userId, orgId);
  }
  return {
    status: statusEnum.ERROR,
    message: `Fund type  ${fundType} is not known`,
    errMessage: `Invalid fund type ${fundType}`,
  };
}
