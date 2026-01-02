/**
 * Quality thresholds and scoring constants for ML and algorithms
 */

/**
 * LexRank summarization algorithm parameters
 */
export const LEXRANK_PARAMS = {
  /** Damping factor for PageRank calculation (0-1) */
  DAMPING_FACTOR: 0.85,
  /** Convergence threshold for PageRank iteration */
  CONVERGENCE_THRESHOLD: 0.0001,
  /** Minimum similarity threshold for sentence connections */
  SIMILARITY_THRESHOLD: 0.1,
} as const;

/**
 * Text quality thresholds
 */
export const QUALITY_THRESHOLDS = {
  /** Minimum similarity score to consider sentences related */
  MIN_SIMILARITY: 0.3,
  /** High quality threshold for content */
  HIGH_QUALITY: 0.6,
  /** Near-duplicate detection threshold */
  DUPLICATE_THRESHOLD: 0.85,
  /** DOM extraction quality score */
  DOM_EXTRACTION_QUALITY: 0.7,
  /** DOM extraction confidence score */
  DOM_EXTRACTION_CONFIDENCE: 0.8,
} as const;

/**
 * Quality adjustment factors for scoring
 */
export const QUALITY_ADJUSTMENTS = {
  /** Position weight decay factor */
  POSITION_DECAY: 0.5,
  /** Length normalization factor */
  LENGTH_FACTOR: 0.3,
  /** Keywords bonus weight */
  KEYWORDS_BONUS: 0.2,
  /** Similarity bonus threshold */
  SIMILARITY_BONUS_THRESHOLD: 0.6,
  /** Similarity bonus amount */
  SIMILARITY_BONUS: 0.4,
  /** High similarity threshold */
  HIGH_SIMILARITY: 0.7,
  /** High similarity bonus */
  HIGH_SIMILARITY_BONUS: 0.3,
  /** Length bonus weight */
  LENGTH_BONUS: 0.5,
  /** Position bonus threshold */
  POSITION_BONUS_THRESHOLD: 0.8,
  /** Position bonus weight */
  POSITION_BONUS: 0.6,
  /** Information density threshold */
  INFO_DENSITY_THRESHOLD: 0.7,
} as const;

/**
 * UI highlighting opacity values
 */
export const HIGHLIGHTING_OPACITY = {
  /** Word highlight opacity */
  WORD: 0.4,
  /** Sentence highlight opacity */
  SENTENCE: 0.2,
} as const;
