import * as Sentry from '@sentry/nextjs';
import { sentryOptions } from './lib/sentryConfig';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs' || process.env.NEXT_RUNTIME === 'edge') {
    try {
      Sentry.init(sentryOptions('server'));
    } catch (e) {
      console.warn('[Sentry] init failed (non-fatal)', e);
    }
  }
}

export const onRequestError = Sentry.captureRequestError;
