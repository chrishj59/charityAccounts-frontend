'use server';
import { userCreateResponse, statusEnum } from '~/src/types/helper';
import { userInputValues } from '~/src/zodSchema/signupUser-schema';
import { auth } from '~/src/lib/auth';

export async function signUpAdminUserAction(
  user: userInputValues,

  adminEmail: string,
): Promise<userCreateResponse> {
  // Create User
  const newUser = await auth.api.createUser({
    body: {
      email: user.email, // required
      password: user.password, // required
      name: user.displayName, // required
      role: 'admin',
      data: {
        displayName: user.displayName,
        firstName: user.familyName,
        familyName: user.familyName,
      },
    },
  });
  if (!newUser) {
    return {
      status: statusEnum.ERROR,
      message: 'Could not create User ',
    };
  } else {
    return {
      status: statusEnum.SUCCESS,
      message: `Created user: ${newUser.user.name}`,
    };
  }
}
