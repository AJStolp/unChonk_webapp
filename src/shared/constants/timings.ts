/**
 * Centralized timing constants for the TTS Reader application
 * All values in milliseconds unless otherwise noted
 */

/**
 * API request timeouts
 */
export const API_TIMEOUTS = {
  /** Default timeout for API requests (30s) */
  DEFAULT: 30000,
  /** Timeout for Polly synthesis requests (30s) */
  POLLY_SYNTHESIS: 30000,
  /** Timeout for backend extraction requests (30s) */
  BACKEND_EXTRACTION: 30000,
} as const;

/**
 * Retry configuration
 */
export const RETRY_CONFIG = {
  /** Maximum number of retry attempts */
  MAX_ATTEMPTS: 3,
  /** Base for exponential backoff calculation (attempt^base) */
  EXPONENTIAL_BASE: 2,
  /** Initial retry delay (1s) */
  INITIAL_DELAY: 1000,
  /** Maximum retry delay cap (10s) */
  MAX_DELAY: 10000,
} as const;

/**
 * Cache time-to-live values
 */
export const CACHE_TTL = {
  /** ML extraction result cache duration (30s) */
  ML_EXTRACTION: 30000,
  /** General cache default (5 minutes) */
  DEFAULT: 300000,
} as const;

/**
 * UI debounce and delay timings
 */
export const UI_TIMINGS = {
  /** General debounce for user input (300ms) */
  DEBOUNCE_DEFAULT: 300,
  /** Selection change debounce (50ms) */
  SELECTION_DEBOUNCE: 50,
  /** Quick debounce for frequent events (100ms) */
  DEBOUNCE_QUICK: 100,
  /** Long debounce for expensive operations (500ms) */
  DEBOUNCE_LONG: 500,
  /** CSS loading timeout (2s) */
  CSS_LOAD_TIMEOUT: 2000,
  /** DOM ready check interval (100ms) */
  DOM_READY_INTERVAL: 100,
} as const;

/**
 * Polling and auto-refresh intervals
 */
export const POLLING_INTERVALS = {
  /** Auto-refresh interval for usage dashboard (10s) */
  USAGE_DASHBOARD: 10000,
  /** Side panel sync interval (500ms) */
  SIDE_PANEL_SYNC: 500,
  /** Default polling interval (5s) */
  DEFAULT: 5000,
} as const;

/**
 * User feedback display durations
 */
export const FEEDBACK_DURATIONS = {
  /** Success message display time (3s) */
  SUCCESS_MESSAGE: 3000,
  /** Error message display time (5s) */
  ERROR_MESSAGE: 5000,
  /** Form submission feedback (1.5s) */
  FORM_FEEDBACK: 1500,
  /** Save confirmation display (3s) */
  SAVE_CONFIRMATION: 3000,
} as const;

/**
 * Component initialization and retry delays
 */
export const INIT_DELAYS = {
  /** Auth token fetch retry delay (100ms) */
  AUTH_RETRY: 100,
  /** Container finding retry delay (50ms) */
  CONTAINER_RETRY: 50,
  /** Widget initialization delay (200ms) */
  WIDGET_INIT: 200,
  /** Extension context setup delay (1s) */
  EXTENSION_SETUP: 1000,
} as const;

/**
 * Rate limiting
 */
export const RATE_LIMITS = {
  /** Delay between rate-limited requests (1s) */
  REQUEST_DELAY: 1000,
  /** Maximum API requests per window */
  MAX_REQUESTS_PER_WINDOW: 100,
} as const;
