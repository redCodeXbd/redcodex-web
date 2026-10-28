import { isDevMode } from '@angular/core';

/** The backend's GraphQL endpoint. A host can override it without rebuilding by setting `window.RCX_API_URL`. */
export const apiUrl = (): string => (window as unknown as { RCX_API_URL?: string }).RCX_API_URL || (isDevMode() ? 'http://localhost:8080/graphql' : '/graphql');
/** Where "Sign in" leads: the ERP app. */
export const appUrl = (): string => (window as unknown as { RCX_APP_URL?: string }).RCX_APP_URL || (isDevMode() ? 'http://localhost:4200' : 'https://app.redcodex.net');
