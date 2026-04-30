'use server';

import { FundNewFormValues } from '~/src/zodSchema/fund-new-schema';

import { getUserDb } from '~/src/lib/db';
import { responseType, statusEnum } from '~/src/types/helper';

import { ORMError, ORMErrorReason } from '@zenstackhq/orm';

const addGeneralFund = async (
  fundType: string,
  fund: FundNewFormValues,

  userId: string,
  orgId: string,
): Promise<responseType> => {
  const userDb = getUserDb(userId, orgId);
  const payload = {
    data: {
      fundName: fund.name,

      donarName: fund.donar,
      fundType: fundType,
      objective: fund.objective,
      reviewDate: fund.reviewDate,
      managedById: userId,
      organizationId: orgId,
      // balance: new Decimal(0),
    },
  };
  try {
    console.log(`payload ${JSON.stringify(payload, null, 2)}`);
    const funds = await userDb.generalFund.findMany();
    console.log(`funds in add ${JSON.stringify(funds, null, 2)}`);
    try {
      const resp = await userDb.generalFund.create(payload);
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
  const userDb = getUserDb(userId, orgId);
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
      designateMeeting: fund.designatedMeeting,
      projectEndDate: fund.projectEndDate ? fund.projectEndDate : new Date(),
      designationCreatedById: userId,
      designatedById: userId,
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

const incomeFund = async (
  fundType: string,
  fund: FundNewFormValues,

  userId: string,
  orgId: string,
): Promise<responseType> => {
  const userDb = getUserDb(userId, orgId);

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
  const userDb = getUserDb(userId, orgId);
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
  const userDb = getUserDb(userId, orgId);
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
    },
  };
  try {
    await userDb.endownmentPermanent.create(payload);
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
