import { HighlightingConfig } from "../../extension/widget/types/TTSTypes";
import { globalContentFilter } from "../../extension/widget/highlighting/core/ContentFilters";
import { CrossPlatformStorage } from "../utils/RuntimeDetection";
import { CACHE_TTL, TEXT_LIMITS, READING_SPEED } from "../constants";

interface HighlightingMap {
  [key: string]: unknown;
}

interface ContentExtractionResult {
  success: boolean;
  text: string;
  method_used: "textract" | "dom" | "fallback";
  textract_used: boolean;
  speech_marks?: string;
  highlighting_map?: HighlightingMap;
  extraction_metrics: {
    processing_time: number;
    text_quality_score: number;
    method_confidence: number;
  };
}

interface BackendExtractionRequest {
  url: string;
  prefer_textract?: boolean;
  include_speech_marks?: boolean;
  quality_analysis?: boolean;
  include_metadata?: boolean;
}

interface BackendExtractionResponse {
  text?: string;
  method_used?: string;
  textract_used?: boolean;
  speech_marks?: string;
  highlighting_map?: HighlightingMap;
  extraction_metrics?: {
    processing_time: number;
    text_quality_score: number;
    method_confidence: number;
  };
}

interface MLPrediction {
  id: number;
  text: string;
  prediction: number;
  recommended: boolean;
  visualZone?: string;
}

interface MLFilteredContent {
  success: boolean;
  originalText: string;
  filteredText: string;
  recommendations: MLPrediction[];
  filteringStats: {
    totalBlocks: number;
    recommendedBlocks: number;
    filteredCharacters: number;
    originalCharacters: number;
    confidenceScore: number;
  };
}

interface ExtractionStatus {
  backend_connected: boolean;
  textract_available: boolean;
  dom_extraction_available: boolean;
  user_tier: string;
  extraction_methods: {
    textract: boolean;
    dom_fallback: boolean;
    hybrid_approach: boolean;
  };
  capabilities: {
    speech_marks: boolean;
    quality_analysis: boolean;
    content_optimization: boolean;
  };
}

interface ExtractionTestResult {
  success: boolean;
  test_url: string;
  method_used?: string;
  textract_used?: boolean;
  text_length?: number;
  processing_time_ms: number;
  quality_metrics?: {
    processing_time: number;
    text_quality_score: number;
    method_confidence: number;
  };
  error?: string;
  timestamp: string;
}

export class BackendContentManager {
  private apiBaseUrl: string;
  private config: HighlightingConfig = {
    userTier: "free", // Default to free tier - will be set by setUserTier() after auth
    enableNativeHighlighting: true,
    enableSentenceHighlighting: true,
    enableWordHighlighting: true,
    container: document.body,
  };
  // Cache ML extraction result to prevent repeated API calls
  private mlExtractionCache: Map<string, MLFilteredContent> = new Map();
  private cacheTimeout: number = CACHE_TTL.ML_EXTRACTION;
  // Removed: User preferences - BackendIntegrationManager handles voice/engine preferences

  constructor(apiBaseUrl: string) {
    this.apiBaseUrl = apiBaseUrl;
    // User preferences are now handled by BackendIntegrationManager for synthesis
  }

  // Removed: User preferences loading - BackendIntegrationManager handles this

  /**
   * Set user tier configuration
   */
  setUserTier(tier: "free" | "light" | "premium" | "pro"): void {
    this.config.userTier = tier;
  }

  /**
   * Extract content using backend Textract and create highlighting map
   */
  async extractWithTextract(
    url: string,
    options: Partial<BackendExtractionRequest> = {}
  ): Promise<ContentExtractionResult> {
    try {
      const token = await this.getAuthToken();
      const requestBody: BackendExtractionRequest = {
        url,
        prefer_textract: true,
        include_speech_marks: true,
        quality_analysis: true,
        include_metadata: true,
        ...options, // Allow overrides
      };

      const response = await fetch(`${this.apiBaseUrl}/api/extract/enhanced`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(
          `Textract extraction failed: ${response.status} ${response.statusText}`
        );
      }

      const data: BackendExtractionResponse = await response.json();

      return {
        success: true,
        text: data.text || "",
        method_used:
          (data.method_used as "textract" | "dom" | "fallback") || "unknown",
        textract_used: data.textract_used || false,
        speech_marks: data.speech_marks,
        highlighting_map: data.highlighting_map,
        extraction_metrics: data.extraction_metrics || {
          processing_time: 0,
          text_quality_score: 0,
          method_confidence: 0,
        },
      };
    } catch (error) {
      console.error(
        "❌ BackendContentManager: Textract extraction failed:",
        error
      );
      return {
        success: false,
        text: "",
        method_used: "fallback",
        textract_used: false,
        extraction_metrics: {
          processing_time: 0,
          text_quality_score: 0,
          method_confidence: 0,
        },
      };
    }
  }

  extractFromCurrentPage(): { text: string } {
    // FIXED: Use the exact same method as PlayHereManager and ContentExtractor
    const readableElements = globalContentFilter.getReadableElements(
      document.body
    );

    // Extract text from the same elements that PlayHere targets and synthesis uses
    // getCleanedTextContent already returns normalized text - no double normalization needed
    const textSegments: string[] = [];
    readableElements.forEach((element) => {
      const text = globalContentFilter.getCleanedTextContent(element);
      if (text.trim()) {
        textSegments.push(text);
        // Removed excessive logging for performance
      }
    });

    // Text is already normalized from getCleanedTextContent, just join segments
    const normalizedText = textSegments.join(" ");
    return { text: normalizedText }; // Return only text - AWS Polly will provide speech marks
  }

  /**
   * Extract content with automatic fallback strategy
   * Tries backend first, then DOM extraction if backend fails
   */
  async extractWithFallback(url?: string): Promise<ContentExtractionResult> {
    const targetUrl = url || window.location.href;

    try {
      // First, try backend extraction if we have premium tier
      if (this.config.userTier !== "free") {
        const backendResult = await this.extractWithTextract(targetUrl);

        if (backendResult.success && backendResult.text.length > TEXT_LIMITS.MIN_VALID_LENGTH) {
          return backendResult;
        } else {
          console.warn(
            "⚠️ BackendContentManager: Backend extraction failed or returned insufficient content"
          );
        }
      }
      const domResult = this.extractFromCurrentPage();

      if (domResult.text && domResult.text.length > TEXT_LIMITS.MIN_VALID_LENGTH) {
        return {
          success: true,
          text: domResult.text,
          method_used: "dom",
          textract_used: false,
          extraction_metrics: {
            processing_time: 0,
            text_quality_score: 0.7, // DOM extraction is decent quality
            method_confidence: 0.8,
          },
        };
      }

      throw new Error(
        "Both backend and DOM extraction failed to produce sufficient content"
      );
    } catch (error) {
      console.error(
        "❌ BackendContentManager: All extraction methods failed:",
        error
      );
      return {
        success: false,
        text: "",
        method_used: "fallback",
        textract_used: false,
        extraction_metrics: {
          processing_time: 0,
          text_quality_score: 0,
          method_confidence: 0,
        },
      };
    }
  }

  // REMOVED: processHighlightingMap - use AWS Polly speech marks directly

  /**
   * Get comprehensive status about content extraction capabilities
   */
  async getExtractionStatus(): Promise<ExtractionStatus> {
    try {
      const token = await this.getAuthToken();
      const response = await fetch(`${this.apiBaseUrl}/api/textract/status`, {
        method: "GET",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const backendConnected = response.ok;
      let textractAvailable = false;

      if (backendConnected) {
        const data = await response.json();
        textractAvailable = data.textract_available || false;
      }

      return {
        backend_connected: backendConnected,
        textract_available: textractAvailable,
        dom_extraction_available: true,
        user_tier: this.config.userTier,
        extraction_methods: {
          textract: textractAvailable && this.config.userTier !== "free",
          dom_fallback: true,
          hybrid_approach: true,
        },
        capabilities: {
          speech_marks: textractAvailable,
          quality_analysis: textractAvailable,
          content_optimization: textractAvailable,
        },
      };
    } catch (error) {
      console.warn("⚠️ BackendContentManager: Status check failed:", error);
      return {
        backend_connected: false,
        textract_available: false,
        dom_extraction_available: true,
        user_tier: this.config.userTier,
        extraction_methods: {
          textract: false,
          dom_fallback: true,
          hybrid_approach: false,
        },
        capabilities: {
          speech_marks: false,
          quality_analysis: false,
          content_optimization: false,
        },
      };
    }
  }

  /**
   * Test extraction capabilities
   */
  async testExtraction(url?: string): Promise<ExtractionTestResult> {
    const testUrl = url || window.location.href;
    const startTime = Date.now();

    try {
      const result = await this.extractWithFallback(testUrl);
      const processingTime = Date.now() - startTime;

      return {
        success: result.success,
        test_url: testUrl,
        method_used: result.method_used,
        textract_used: result.textract_used,
        text_length: result.text.length,
        processing_time_ms: processingTime,
        quality_metrics: result.extraction_metrics,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        test_url: testUrl,
        error: error instanceof Error ? error.message : "Unknown error",
        processing_time_ms: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Get auth token from storage using CrossPlatformStorage abstraction
   */
  private async getAuthToken(): Promise<string | null> {
    return await CrossPlatformStorage.getAuthToken();
  }

  /**
   * Get current configuration
   */
  getConfig(): HighlightingConfig {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  updateConfig(updates: Partial<HighlightingConfig>): void {
    this.config = { ...this.config, ...updates };
  }

  /**
   * 🤖 ML-POWERED: Extract content with ML filtering for TTS
   * This is the new Speechify-like feature that uses your trained model!
   */
  async extractWithMLFiltering(url?: string): Promise<MLFilteredContent> {
    const targetUrl = url || window.location.href;

    // Check cache first to prevent repeated API calls
    const cacheKey = targetUrl;
    const cached = this.mlExtractionCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      // Use existing excellent filtering, send to ML
      const localExtraction = this.extractFromCurrentPage();

      if (!localExtraction.text || localExtraction.text.length < TEXT_LIMITS.MIN_VALID_LENGTH) {
        throw new Error("Frontend extraction failed or too short");
      }

      // Send filtered content to ML model
      const response = await fetch(`${this.apiBaseUrl}/api/test-model`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: targetUrl,
          content: localExtraction.text,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `ML prediction failed: ${response.status} - ${errorText}`
        );
      }

      const data = await response.json();

      if (!data.success || !data.predictions) {
        throw new Error(
          `ML model returned no predictions: success=${
            data.success
          }, predictions=${!!data.predictions}`
        );
      }

      const predictions: MLPrediction[] = data.predictions;

      // Step 2: Filter content blocks based on ML recommendations
      const recommendedBlocks = predictions.filter((pred) => pred.recommended);
      const filteredText = recommendedBlocks
        .map((block) => block.text)
        .join(" ")
        .trim();

      // Step 2.5: Mark DOM elements that contain recommended content
      this.markMainContentInDOM(recommendedBlocks);

      // Step 3: Calculate filtering statistics
      const originalText = predictions.map((pred) => pred.text).join(" ");
      const avgConfidence =
        predictions.reduce((sum, pred) => sum + pred.prediction, 0) /
        predictions.length;

      const result: MLFilteredContent = {
        success: true,
        originalText,
        filteredText,
        recommendations: predictions,
        filteringStats: {
          totalBlocks: predictions.length,
          recommendedBlocks: recommendedBlocks.length,
          filteredCharacters: filteredText.length,
          originalCharacters: originalText.length,
          confidenceScore: avgConfidence,
        },
      };

      // Cache the result to prevent repeated API calls
      this.mlExtractionCache.set(cacheKey, result);

      // Auto-clear cache after timeout
      setTimeout(() => {
        this.mlExtractionCache.delete(cacheKey);
      }, this.cacheTimeout);

      return result;
    } catch (error) {
      console.error("❌ ML-powered extraction failed:", error);

      try {
        const fallbackResult = await this.extractWithFallback(targetUrl);
        return {
          success: true,
          originalText: fallbackResult.text,
          filteredText: fallbackResult.text, // No filtering applied in fallback
          recommendations: [],
          filteringStats: {
            totalBlocks: 1,
            recommendedBlocks: 1,
            filteredCharacters: fallbackResult.text.length,
            originalCharacters: fallbackResult.text.length,
            confidenceScore: 0.5, // Neutral confidence for fallback
          },
        };
      } catch (fallbackError) {
        console.error("❌ Fallback extraction also failed:", fallbackError);
        return {
          success: false,
          originalText: "",
          filteredText: "",
          recommendations: [],
          filteringStats: {
            totalBlocks: 0,
            recommendedBlocks: 0,
            filteredCharacters: 0,
            originalCharacters: 0,
            confidenceScore: 0,
          },
        };
      }
    }
  }

  /**
   * 📊 Calculate estimated reading time for filtered content
   */
  calculateReadingTime(
    text: string,
    wordsPerMinute: number = READING_SPEED.DEFAULT_WPM
  ): {
    words: number;
    estimatedMinutes: number;
    estimatedSeconds: number;
    formattedTime: string;
  } {
    const words = text.trim().split(/\s+/).length;
    const totalMinutes = words / wordsPerMinute;
    const estimatedMinutes = Math.floor(totalMinutes);
    const estimatedSeconds = Math.round((totalMinutes - estimatedMinutes) * 60);

    const formattedTime =
      estimatedMinutes > 0
        ? `${estimatedMinutes}m ${estimatedSeconds}s`
        : `${estimatedSeconds}s`;

    return {
      words,
      estimatedMinutes,
      estimatedSeconds,
      formattedTime,
    };
  }

  /**
   * Mark DOM elements that contain ML-recommended content
   */
  private markMainContentInDOM(recommendedBlocks: MLPrediction[]): void {
    try {
      // Clear any existing main content markers
      document.querySelectorAll("[data-tts-main-content]").forEach((el) => {
        el.removeAttribute("data-tts-main-content");
        el.removeAttribute("data-tts-confidence");
      });

      let markedElements = 0;

      recommendedBlocks.forEach((block) => {
        // Find DOM elements that contain this block's text
        const blockText = block.text.trim().substring(0, TEXT_LIMITS.PREVIEW_LENGTH);

        if (blockText.length < TEXT_LIMITS.MIN_SUBSTRING_MATCH) return; // Skip very short blocks

        // Search for elements containing this text
        const walker = document.createTreeWalker(
          document.body,
          NodeFilter.SHOW_TEXT,
          null
        );

        let textNode: Text | null;
        while ((textNode = walker.nextNode() as Text)) {
          if (
            textNode.textContent &&
            textNode.textContent.includes(blockText.substring(0, 50))
          ) {
            const parentElement = textNode.parentElement;
            if (
              parentElement &&
              !parentElement.hasAttribute("data-tts-main-content")
            ) {
              parentElement.setAttribute("data-tts-main-content", "true");
              parentElement.setAttribute(
                "data-tts-confidence",
                (block.prediction * 100).toFixed(1)
              );
              parentElement.setAttribute(
                "data-tts-block-id",
                block.id.toString()
              );
              markedElements++;
              break; // Found a match for this block
            }
          }
        }
      });
    } catch (error) {
      console.warn("Failed to mark main content in DOM:", error);
    }
  }

  /**
   * Get all marked main content elements for highlighting
   */
  getMarkedMainContent(): HTMLElement[] {
    return Array.from(
      document.querySelectorAll('[data-tts-main-content="true"]')
    ) as HTMLElement[];
  }

  /**
   * Clear all main content markers
   */
  clearMainContentMarkers(): void {
    document.querySelectorAll("[data-tts-main-content]").forEach((el) => {
      el.removeAttribute("data-tts-main-content");
      el.removeAttribute("data-tts-confidence");
      el.removeAttribute("data-tts-block-id");
    });
  }

  /**
   * Clear ML extraction cache
   */
  clearMLCache(): void {
    this.mlExtractionCache.clear();
  }

  /**
   * Cleanup resources (minimal since this class doesn't manage playbook)
   */
  cleanup(): void {
    this.clearMainContentMarkers();
    this.clearMLCache();
  }
}
