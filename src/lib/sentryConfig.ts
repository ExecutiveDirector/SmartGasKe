// Shared Sentry options. A Sentry DSN only lets clients send events (it is
// not a secret). Override with NEXT_PUBLIC_SENTRY_DSN; set it to "off" to
// disable. No personal data, replays or performance traces are sent.
const DEFAULT_DSN =
  'https://140b851a0b9901e6a9674273921fa5e5@o4512316675588096.ingest.de.sentry.io/4512317082566736';

export function sentryOptions(runtime: 'browser' | 'server') {
  const configured = (process.env.NEXT_PUBLIC_SENTRY_DSN || '').trim();
  return {
    dsn: configured === 'off' ? undefined : configured || DEFAULT_DSN,
    enabled: process.env.NODE_ENV === 'production' && configured !== 'off',
    environment: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    sendDefaultPii: false,
    tracesSampleRate: 0,
    initialScope: { tags: { app: 'website', runtime } },
  };
}
