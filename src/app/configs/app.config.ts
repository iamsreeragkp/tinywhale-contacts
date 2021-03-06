import { InjectionToken } from '@angular/core';

export let APP_CONFIG = new InjectionToken('app.config');

export const AppConfig: any = {
  defaultStartPage: 1,
  defaultPageLimit: 10,
  sentryDSN: 'https://www.tinywhale.com/errorlogs',
  cspDirectives: {
    defaultSrc: [
      "'self'",
      'data:',
      'http://*.google-analytics.com',
      'http://www.googletagmanager.com',
      'https://*.google.com',
      'https://*.google-analytics.com',
      'https://*.googletagmanager.com',
      'https://*.gstatic.com',
      'https://*.googleapis.com',
      'https://authedmine.com',
      'https://az743702.vo.msecnd.net',
      'https://sentry.io',
      'ws://localhost:4200',
    ],
    frameAncestors: ["'self'"],
    upgradeInsecureRequests: true,
    styleSrc: ["'self'", "'unsafe-inline'", 'https://*.googleapis.com'],
    scriptSrc: [
      "'self'",
      "'unsafe-inline'",
      'http://*.googletagmanager.com',
      'https://*.google-analytics.com',
    ],
  },
};

export type AppConfigType = typeof AppConfig;
