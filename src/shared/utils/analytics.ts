/**
 * Analytics utility.
 *
 * Umami was removed 2026-06-29 (no longer used). `trackEvent` / `trackPageView`
 * are kept as inert no-ops so existing call sites (authStore, SubscriptionPage,
 * SuccessPage, LandingPage) still compile without change. Remove those call
 * sites in a follow-up to drop these entirely.
 */

/**
 * Console Easter egg
 */
const printEasterEgg = () => {
  console.log(`
  / \\__
 (    @\\___
 /         O
/   (_____/
/_____/   U

Chonky Heads | unchonk.it
We love animals, please report any bugs committing crimes.
GG's
  `);
};

if (typeof window !== 'undefined') {
  printEasterEgg();
}

export interface AnalyticsEventData {
  [key: string]: string | number | boolean;
}

/**
 * No-op since umami was removed. Kept so existing call sites compile.
 */
export const trackEvent = (_eventName: string, _eventData?: AnalyticsEventData) => {};

/**
 * No-op since umami was removed.
 */
export const trackPageView = () => {};

// Common event names for consistency (still referenced by call sites)
export const ANALYTICS_EVENTS = {
  // Page views
  LANDING_PAGE_VIEW: 'landing_page_view',

  // Authentication events
  LOGIN_SUCCESS: 'login_success',
  LOGIN_FAILED: 'login_failed',
  LOGOUT: 'logout',
  REGISTER_SUCCESS: 'register_success',
  REGISTER_FAILED: 'register_failed',

  // Subscription events
  SUBSCRIPTION_VIEW: 'subscription_page_view',
  CREDIT_PURCHASE_INITIATED: 'credit_purchase_initiated',
  CREDIT_PURCHASE_SUCCESS: 'credit_purchase_success',
  CREDIT_PURCHASE_FAILED: 'credit_purchase_failed',
  TIER_SELECTED: 'tier_selected',
  PACKAGE_SELECTED: 'package_selected',

  // Usage events
  TTS_STARTED: 'tts_started',
  TTS_COMPLETED: 'tts_completed',
  VOICE_CHANGED: 'voice_changed',

  // Feature usage
  SUMMARIZE_USED: 'summarize_used',
  HIGHLIGHT_MODE_CHANGED: 'highlight_mode_changed',
} as const;
