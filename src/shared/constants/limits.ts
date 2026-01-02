/**
 * Centralized limit constants for the TTS Reader application
 */

/**
 * Text length limits
 */
export const TEXT_LIMITS = {
  /** Maximum text length for processing (100k characters) */
  MAX_LENGTH: 100000,
  /** Minimum text length for extraction to be considered valid */
  MIN_VALID_LENGTH: 50,
  /** Minimum substring length for matching (20 chars) */
  MIN_SUBSTRING_MATCH: 20,
  /** Text preview length (100 chars) */
  PREVIEW_LENGTH: 100,
  /** Character estimation for usage tracking */
  USAGE_ESTIMATION: 1000,
} as const;

/**
 * User tier character limits
 */
export const TIER_LIMITS = {
  free: {
    characters: 10000,
    label: 'Free Tier',
  },
  light: {
    characters: 50000,
    label: 'Light Tier',
  },
  premium: {
    characters: 100000,
    label: 'Premium Tier',
  },
  pro: {
    characters: Infinity,
    label: 'Pro Tier',
  },
} as const;

/**
 * Retry attempt limits
 */
export const RETRY_LIMITS = {
  /** Maximum retry attempts for API calls */
  API_CALLS: 3,
  /** Maximum retry attempts for container finding */
  CONTAINER_FIND: 10,
  /** Maximum retry attempts for selection operations */
  SELECTION_OPS: 10,
} as const;

/**
 * Buffer and cache size limits
 */
export const BUFFER_LIMITS = {
  /** Maximum stored log entries */
  MAX_STORED_LOGS: 1000,
  /** Recent logs to persist (last N entries) */
  PERSIST_LOG_COUNT: 100,
  /** Maximum sentence limit for summarization performance */
  SUMMARIZATION_SENTENCES: 30,
} as const;

/**
 * Security limits
 */
export const SECURITY_LIMITS = {
  /** Maximum key length for security configs */
  MAX_KEY_LENGTH: 128,
  /** Maximum substring length in logs */
  LOG_SUBSTRING_LIMIT: 1000,
} as const;
