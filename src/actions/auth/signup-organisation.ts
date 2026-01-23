'use server';

import { orgInputValues } from '~/src/zodSchema/signupOrg-schema';
import { userInputValues } from '~/src/zodSchema/signupUser-schema';

import { auth } from '~/src/lib/auth';

import { OrgIdentificationType, OrgPlanType } from '~/zenstack/models';
import { Organization, UserWithRole } from 'better-auth/plugins';
import {
  responseType,
  statusEnum,
  userCreateResponse,
} from '~/src/types/helper';
import { db } from '~/src/lib/db';

export async function userEmailExist(email: string): Promise<boolean> {
  const userExists = await db.user.findFirst({ where: { email } });

  return !userExists ? true : false;
}

export async function signUpUserOrgAction(
  user: userInputValues,
  org: orgInputValues,

  adminEmail: string,
): Promise<userCreateResponse> {
  const idType = Object.keys(OrgIdentificationType)[org.idType];
  const orgPlan = Object.keys(OrgPlanType)[org.accountType];
  const generatedSlug = org.tradingName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-');

  // if (existingUser) {
  const role = user.email === adminEmail ? 'admin' : 'user';

  // Create User
  const newUser = await auth.api.createUser({
    body: {
      email: user.email, // required
      password: user.password, // required
      name: user.displayName, // required
      role,
      data: {
        displayName: user.displayName,
        firstName: user.familyName,
        familyName: user.familyName,
      },
    },
  });

  if (!newUser) {
    const resp: responseType = {
      status: statusEnum.ERROR,
      message: 'Could not create User ',
    };
    return resp;
  }
  const userRet = newUser.user;
  const userId = userRet.id;
  if (role !== 'admin') {
    try {
      await auth.api.checkOrganizationSlug({
        body: {
          slug: generatedSlug,
        },
      });
    } catch (err) {
      const user = newUser.user;
      return {
        status: statusEnum.ERROR,
        message: 'Organsiation already exists',
        data: { user },
      };
    }

    const newOrg: Organization | null = await auth.api.createOrganization({
      body: {
        name: org.tradingName,
        tradingName: org.tradingName,
        slug: generatedSlug,
        legalForm: org.legalForm,
        legalName: org.legalName,
        idType: idType,
        identification: org.identification,
        accountType: orgPlan,
        taxRef: org.taxRef,
        companyNumber: org.companyNumber,
        companyName: org.companyName,
        userId: userId,
      },
    });

    const user = newUser.user;
    if (newOrg) {
      return {
        status: statusEnum.SUCCESS,
        message: 'Created user and organisation',
        data: { user, org: newOrg },
      };
    } else {
      return {
        status: statusEnum.ERROR,
        message: 'Could not create the organisation',
      };
    }
  } else {
    const user = newUser.user;
    return {
      status: statusEnum.SUCCESS,
      message: 'Created admin user',
      data: { user },
    };
  }
}
