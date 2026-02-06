/**
 * Umami Analytics Utility
 * Self-hosted analytics tracking for unChonk
 */

const UMAMI_SCRIPT_URL = 'https://analytics.logantaylorandkitties.com/script.js'
const UMAMI_WEBSITE_ID = '867ccb2f-0c4a-4389-8082-8f8daa4b6ef0'

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

Chonk Heads | unchonk.it
We love animals, please report any bugs committing crimes.
GG's
  `);
};

/**
 * Dynamically load the Umami analytics script
 */
export const loadUmamiScript = () => {
  if (typeof window === 'undefined') return

  // Print Easter egg to console
  printEasterEgg();

  const script = document.createElement('script')
  script.defer = true
  script.src = UMAMI_SCRIPT_URL
  script.setAttribute('data-website-id', UMAMI_WEBSITE_ID)
  document.head.appendChild(script)
}

export interface UmamiEventData {
  [key: string]: string | number | boolean;
}

/**
 * Track a custom event in Umami
 * @param eventName - The name of the event to track
 * @param eventData - Optional data to attach to the event
 */
export const trackEvent = (eventName: string, eventData?: UmamiEventData) => {
  try {
    // Check if umami is available
    if (typeof window !== 'undefined' && (window as any).umami) {
      (window as any).umami.track(eventName, eventData);
      console.log('[Analytics] Event tracked:', eventName, eventData);
    } else {
      console.warn('[Analytics] Umami not loaded, event not tracked:', eventName);
    }
  } catch (error) {
    console.error('[Analytics] Error tracking event:', error);
  }
};

/**
 * Track page view (automatically handled by Umami script, but can be called manually if needed)
 */
export const trackPageView = () => {
  try {
    if (typeof window !== 'undefined' && (window as any).umami) {
      (window as any).umami.track();
    }
  } catch (error) {
    console.error('[Analytics] Error tracking page view:', error);
  }
};

// Common event names for consistency
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
