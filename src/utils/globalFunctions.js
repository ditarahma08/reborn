import * as Sentry from '@sentry/nextjs';
import { isBrowser } from '@utils/isBrowser';

export const sentryBreadcrumb = (location) => {
  Sentry.addBreadcrumb({
    category: location,
    message: `Rendering index page (${isBrowser() ? 'browser' : 'server'})`,
    level: Sentry.Severity.Debug
  });
};
