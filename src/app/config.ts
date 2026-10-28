import { isDevMode } from '@angular/core';

const override = (k: 'RCX_API_URL' | 'RCX_APP_URL'): string | undefined => (window as unknown as Record<string, string | undefined>)[k];

/** The ERP backend's GraphQL endpoint (the same one the ERP app talks to). A host can override it without rebuilding by setting `window.RCX_API_URL`. */
export const apiUrl = (): string => override('RCX_API_URL') || (isDevMode() ? 'http://localhost:8080/graphql' : 'https://erpx.redcodex.net/graphql');
/** Where "Sign in" leads: the ERP app. */
export const appUrl = (): string => override('RCX_APP_URL') || 'https://erpx.redcodex.net';
