'use server';

import { FundNewFormValues } from '~/src/zodSchema/fund-new-schema';

import { getUserDb } from '~/src/lib/db';
import { responseType, statusEnum } from '~/src/types/helper';

import { ORMError, ORMErrorReason } from '@zenstackhq/orm';
import { Fund, ISO4217Currency } from '~/zenstack/models';
import { FundUI } from '~/src/types/ui-types/fund';
import { FundEditFormValues } from '~/src/zodSchema/fund-edit-schema';
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

const generalFundUpdate = async (
  fundType: string,
  fund: FundEditFormValues,

  userId: string,
  orgId: string,
): Promise<responseType> => {
  const userDb = await getUserDb(userId, orgId);
  const _currency = await getCurrency('GBP', userId, orgId);

  const payload = {
    where: { id: fund.id },
    data: {
      fundName: fund.name,

      donarName: fund.donar,
      fundType: fundType,
      objective: fund.objective,
      reviewDate: fund.reviewDate,
      managedById: userId,
      organizationId: orgId,

      curcyCode: _currency.alphabeticCode,
      currencyId: _currency.id,
    },
  };
  try {
    await userDb.generalFund.update(payload);

    return {
      status: statusEnum.SUCCESS,
      message: `Updated General fund ${payload.data.fundName}`,
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
      message: `Could not update General Fund ${payload.data.fundName}`,
      errMessage: `Update error ${JSON.stringify(error)}`,
    };
  }
};

const generalFundNew = async (
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
      fundType: fundType,
      objective: fund.objective ?? '',
      reviewDate: fund.reviewDate,
      createdById: userId,
      managedById: userId,
      organizationId: orgId,
      balance: 0,
      curcyCode: _currency.alphabeticCode,
      currencyId: _currency.id,
    },
  };
  try {
    console.log(`payload ${JSON.stringify(payload, null, 2)}`);
    const funds = await userDb.generalFund.findMany();

    console.log(`funds in add ${JSON.stringify(funds, null, 2)}`);
    try {
      await userDb.generalFund.create(payload);
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

const designatedFundNew = async (
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
      createdById: userId,
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
    await userDb.designatedFund.create(payload);
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

const designatedFundUpdate = async (
  fundType: string,
  fund: FundEditFormValues,

  userId: string,
  orgId: string,
): Promise<responseType> => {
  const userDb = await getUserDb(userId, orgId);
  const _currency = await getCurrency('GBP', userId, orgId);

  const payload = {
    where: {
      id: fund.id,
    },
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
    await userDb.designatedFund.update(payload);
    return {
      status: statusEnum.SUCCESS,
      message: `Updated Designated fund ${payload.data.fundName}`,
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
      message: `Could not update Designated Fund ${payload.data.fundName}`,
      errMessage: `Update error ${JSON.stringify(error)}`,
    };
  }
};

const incomeFundNew = async (
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
      createdById: userId,
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

const incomeFundUpdate = async (
  fundType: string,
  fund: FundEditFormValues,

  userId: string,
  orgId: string,
): Promise<responseType> => {
  const userDb = await getUserDb(userId, orgId);
  const _currency = await getCurrency('GBP', userId, orgId);
  const payload = {
    where: {
      id: fund.id,
    },
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
    await userDb.incomeFund.update(payload);
    return {
      status: statusEnum.SUCCESS,
      message: `Updated Income fund ${payload.data.fundName}`,
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

const expendableFundNew = async (
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
      createdById: userId,
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

const expendableFundUpdate = async (
  fundType: string,
  fund: FundEditFormValues,

  userId: string,
  orgId: string,
): Promise<responseType> => {
  const userDb = await getUserDb(userId, orgId);
  const _currency = await getCurrency('GBP', userId, orgId);
  const payload = {
    where: {
      id: fund.id,
    },
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
    await userDb.endownmentExpendable.update(payload);
    return {
      status: statusEnum.SUCCESS,
      message: `Updated Expendable Endownmentfund: ${payload.data.fundName}`,
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
      message: `Could not update  Designated Fund ${payload.data.fundName}`,
      errMessage: `Update error ${JSON.stringify(error)}`,
    };
  }
};

const permanentFundNew = async (
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
      createdById: userId,
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

const permanentFundUpdate = async (
  fundType: string,
  fund: FundEditFormValues,

  userId: string,
  orgId: string,
): Promise<responseType> => {
  const userDb = await getUserDb(userId, orgId);
  const _currency = await getCurrency('GBP', userId, orgId);
  const payload = {
    where: {
      id: fund.id,
    },
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
    const res = await userDb.endownmentPermanent.update(payload);

    return {
      status: statusEnum.SUCCESS,
      message: `Updated Permanent Endownment fund:  ${payload.data.fundName}`,
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
      message: `Could not update  Permanent Fund ${payload.data.fundName}`,
      errMessage: `Update error ${JSON.stringify(error)}`,
    };
  }
};

export async function getFundById(
  fundId: string,
  userId: string,
  orgId: string,
): Promise<FundUI | responseType> {
  const userDb = await getUserDb(userId, orgId);

  try {
    const fund = await userDb.fund.findFirst({ where: { id: fundId } });
    console.log(`getFundById returns ${JSON.stringify(fund, null, 2)}`);
    if (!fund) {
      return {
        status: statusEnum.ERROR,
        message: `Could not find  Fund by id ${fundId}`,
        // errMessage: `Update error ${JSON.stringify(error)}`,
      };
    } else {
      let _fund: FundUI = {
        id: fund.id,
        fundName: fund.fundName,
        fundType: fund.fundType,
        reviewDate: fund.reviewDate ? fund.reviewDate : undefined,
      };
      _fund.fundName = fund.fundName;
      return _fund;
    }
    // designatedFund;
  } catch (error) {
    if (error instanceof ORMError) {
      return {
        status: statusEnum.ERROR,
        message: error.message,
        errMessage: error.reason,
      };
    }
  }
  return {
    status: statusEnum.ERROR,
    message: `Could not find  Fund by id ${fundId}`,
    // errMessage: `Update error ${JSON.stringify(error)}`,
  };
}
export async function fundUpdateAction(
  fund: FundEditFormValues,
  userId: string,
  orgId: string,
): Promise<responseType> {
  const fundType = fund.fundType;
  switch (fundType) {
    case 'General':
      return generalFundUpdate(fundType, fund, userId, orgId);

    case 'Designated':
      return designatedFundUpdate(fundType, fund, userId, orgId);
    case 'Income':
      return incomeFundUpdate(fundType, fund, userId, orgId);
    case 'Expendable':
      return expendableFundUpdate(fundType, fund, userId, orgId);
    case 'Permanent':
      return permanentFundUpdate(fundType, fund, userId, orgId);
  }
  return {
    status: statusEnum.ERROR,
    message: `Fund type  ${fundType} is not known`,
    errMessage: `Invalid fund type ${fundType}`,
  };
}
export async function fundAddAction(
  fund: FundNewFormValues,
  userId: string,
  orgId: string,
): Promise<responseType> {
  const fundType = fund.fundType;
  switch (fundType) {
    case 'General':
      return generalFundNew(fundType, fund, userId, orgId);

    case 'Designated':
      return designatedFundNew(fundType, fund, userId, orgId);
    case 'Income':
      return incomeFundNew(fundType, fund, userId, orgId);
    case 'Expendable':
      return expendableFundNew(fundType, fund, userId, orgId);
    case 'Permanent':
      return permanentFundNew(fundType, fund, userId, orgId);
  }
  return {
    status: statusEnum.ERROR,
    message: `Fund type  ${fundType} is not known`,
    errMessage: `Invalid fund type ${fundType}`,
  };
}
