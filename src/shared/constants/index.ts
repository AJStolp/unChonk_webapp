/**
 * Centralized constants for the TTS Reader application
 *
 * Import from this barrel file for convenience:
 * ```typescript
 * import { API_TIMEOUTS, RETRY_CONFIG, TEXT_LIMITS } from '@/shared/constants'
 * ```
 */

export * from './timings';
export * from './limits';
export * from './thresholds';

/**
 * Reading speed constants
 */
export const READING_SPEED = {
  /** Average words per minute for reading time estimation */
  DEFAULT_WPM: 200,
  /** Average words per minute for TTS speech */
  TTS_WPM: 160,
} as const;

/**
 * UI display constants
 */
export const UI_CONSTANTS = {
  /** Border radius for highlights (px) */
  HIGHLIGHT_BORDER_RADIUS: 3,
  /** Horizontal padding for highlights (px) */
  HIGHLIGHT_PADDING_X: 2,
  /** Vertical padding for highlights (px) */
  HIGHLIGHT_PADDING_Y: 1,
  /** Font weight for highlights */
  HIGHLIGHT_FONT_WEIGHT: 600,
  /** Welcome countdown initial value (seconds) */
  WELCOME_COUNTDOWN: 15,
} as const;

/**
 * Default values and fallbacks
 */
export const DEFAULTS = {
  /** Default speech mark duration when not provided (seconds) */
  SPEECH_MARK_DURATION: 0.5,
} as const;
