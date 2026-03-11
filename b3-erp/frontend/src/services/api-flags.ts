/**
 * api-flags.ts  — Sprint 4.1
 *
 * Single source of truth for the live-vs-mock toggle.
 *
 * Usage in every service file:
 *   import { USE_LIVE_API } from './api-flags';
 *   ...
 *   if (!USE_LIVE_API) { return MOCK_DATA; }
 *   return apiClient.get('/...');
 *
 * Set NEXT_PUBLIC_USE_LIVE_API=true in your .env.local to enable live API.
 * Leave unset (or set to false) to keep mock data during UI-only development.
 */
export const USE_LIVE_API =
    process.env.NEXT_PUBLIC_USE_LIVE_API === 'true';
