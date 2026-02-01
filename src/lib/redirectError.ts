// Source - https://stackoverflow.com/a/78531257
// Posted by Apptek Studios, modified by community. See post 'Timeline' for change history
// Retrieved 2026-01-27, License - CC BY-SA 4.0

import { isRedirectError } from 'next/dist/client/components/redirect-error';

export function rethrowIfRedirectError(error: unknown) {
  if (isRedirectError(error)) {
    throw error;
  }
}
