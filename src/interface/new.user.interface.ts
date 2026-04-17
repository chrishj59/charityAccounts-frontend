import { Organization, Team, UserWithRole } from 'better-auth/plugins';

export interface newUserInterface {
  user: UserWithRole;
  org?: Organization;
}
