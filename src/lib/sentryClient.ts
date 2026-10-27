import * as Sentry from '@sentry/nextjs';
import { sentryOptions } from './sentryConfig';

if (typeof window !== 'undefined') {
  try {
    Sentry.init(sentryOptions('browser'));
  } catch (e) {
    console.warn('[Sentry] init failed (non-fatal)', e);
  }
}
