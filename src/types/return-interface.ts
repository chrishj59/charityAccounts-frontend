import { Organization, Team, UserWithRole } from 'better-auth/plugins';
import { User } from '~/zenstack/models';

export interface NEW_USER {
  user: UserWithRole;
  org: Organization;
  company: Team;
}
