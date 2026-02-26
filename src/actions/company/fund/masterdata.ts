'use server';

import { auth } from '~/src/lib/auth';
import { FundNewFormValues } from '~/src/zodSchema/fund-new-schema';
import { FundType, GeneralFund } from '~/zenstack/models';
import { authDb } from '~/src/lib/db';
import { responseType, statusEnum } from '~/src/types/helper';

const generalFund = async (
  fundType: string,
  fund: FundNewFormValues,

  userId: string,
  orgId: string,
): Promise<responseType> => {
  const payload = {
    data: {
      fundName: fund.name,

      donarName: fund.donar,
      fundType: fundType,
      objective: fund.objective,
      reviewDate: fund.reviewDate,
      managedById: userId,
      organisationId: orgId,
    },
  };
  try {
    const resp = await authDb.generalFund.create(payload);

    return {
      status: statusEnum.SUCCESS,
      message: `Created General fund ${payload.data.fundName}`,
    };
  } catch (error) {
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
  const payload = {
    data: {
      fundName: fund.name,

      donarName: fund.donar,
      fundType: fund.fundType,
      objective: fund.objective,
      reviewDate: fund.reviewDate,
      managedById: userId,
      organisationId: orgId,
      designatedDate: fund.designatedDate ? fund.designatedDate : new Date(),
      designateMeeting: fund.designatedMeeting,
      projectEndDate: fund.projectEndDate ? fund.projectEndDate : new Date(),
      designationCreatedById: userId,
      designatedById: userId,
    },
  };
  try {
    await authDb.designatedFund.create(payload);
    return {
      status: statusEnum.SUCCESS,
      message: `Created Designated fund ${payload.data.fundName}`,
    };
  } catch (error) {
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
  const payload = {
    data: {
      fundName: fund.name,

      donarName: fund.donar,
      fundType: fund.fundType,
      objective: fund.objective,
      reviewDate: fund.reviewDate,
      managedById: userId,
      organisationId: orgId,
      designatedDate: fund.designatedDate ? fund.designatedDate : new Date(),
      designateMeeting: fund.designatedMeeting,
      projectEndDate: fund.projectEndDate ? fund.projectEndDate : new Date(),
      designationCreatedById: userId,
      designatedById: userId,
    },
  };
  try {
    await authDb.designatedFund.create(payload);
    return {
      status: statusEnum.SUCCESS,
      message: `Created Designated fund ${payload.data.fundName}`,
    };
  } catch (error) {
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
  const payload = {
    data: {
      fundName: fund.name,

      donarName: fund.donar,
      fundType: fund.fundType,
      objective: fund.objective,
      reviewDate: fund.reviewDate,
      managedById: userId,
      organisationId: orgId,
      designatedDate: fund.designatedDate ? fund.designatedDate : new Date(),
      designateMeeting: fund.designatedMeeting,
      projectEndDate: fund.projectEndDate ? fund.projectEndDate : new Date(),
      designationCreatedById: userId,
      designatedById: userId,
    },
  };
  try {
    await authDb.endownmentExpendable.create(payload);
    return {
      status: statusEnum.SUCCESS,
      message: `Created Designated fund ${payload.data.fundName}`,
    };
  } catch (error) {
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
  const payload = {
    data: {
      fundName: fund.name,

      donarName: fund.donar,
      fundType: fund.fundType,
      objective: fund.objective,
      reviewDate: fund.reviewDate,
      managedById: userId,
      organisationId: orgId,
      designatedDate: fund.designatedDate ? fund.designatedDate : new Date(),
      designateMeeting: fund.designatedMeeting,
      projectEndDate: fund.projectEndDate ? fund.projectEndDate : new Date(),
      designationCreatedById: userId,
      designatedById: userId,
    },
  };
  try {
    await authDb.endownmentPermanent.create(payload);
    return {
      status: statusEnum.SUCCESS,
      message: `Created Designated fund ${payload.data.fundName}`,
    };
  } catch (error) {
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
      return generalFund(fundType, fund, userId, orgId);

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
