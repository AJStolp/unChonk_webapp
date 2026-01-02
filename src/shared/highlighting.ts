/**
 * CLEAN CSS Custom Highlight API Implementation
 * Used by both Chrome extension and embeddable script
 * Uses AWS Polly speech marks directly - no complex processing
 */

export interface SpeechMark {
  time: number; // in seconds
  type: "word" | "sentence";
  start: number;
  end: number;
  value: string;
  duration?: number;
}

export interface WordMarkRange {
  charStart: number;
  charEnd: number;
  speechMark: SpeechMark;
  applied?: boolean;
}

export interface SentenceMarkRange {
  charStart: number;
  charEnd: number;
  speechMark: SpeechMark;
  applied?: boolean;
}

export interface TextNodeOffset {
  node: Text;
  offset: number;
}

export interface HighlightingConfig {
  userTier: "free" | "light" | "premium" | "pro";
  enableNativeHighlighting: boolean;
  enableSentenceHighlighting: boolean;
  enableWordHighlighting: boolean;
  container?: HTMLElement;
}

export interface HighlightingState {
  isInitialized: boolean;
  cssHighlightSupported: boolean;
  currentWordMarkRange: WordMarkRange | undefined;
  currentSentenceMarkRange: SentenceMarkRange | undefined;
  activeSession: string | undefined;
  highlightingMethod: "backend" | "webspeech" | "none";
  config: HighlightingConfig | undefined;
  extractedText: string | undefined;
}

// Global CSS Custom Highlight API objects
let wordHighlight: Highlight;
let sentenceHighlight: Highlight;
let highlightingState: HighlightingState;
let textNodes: Text[] = [];
let extractedText = "";

/**
 * Check if CSS Custom Highlight API is supported (replaces Rangy check)
 */
export function isRangyAvailable(): boolean {
  return "highlights" in CSS && typeof Highlight !== "undefined";
}

/**
 * Initialize CSS Custom Highlight API highlighting system
 */
export function initializeHighlighting(config: HighlightingConfig): boolean {
  try {
    const supported = isRangyAvailable();

    if (supported) {
      wordHighlight = new Highlight();
      sentenceHighlight = new Highlight();

      CSS.highlights.set("tts-word", wordHighlight);
      CSS.highlights.set("tts-sentence", sentenceHighlight);
    } else {
    }

    highlightingState = {
      isInitialized: true,
      cssHighlightSupported: supported,
      currentWordMarkRange: undefined,
      currentSentenceMarkRange: undefined,
      activeSession: undefined,
      highlightingMethod: "none",
      config: config,
      extractedText: undefined,
    };

    return true;
  } catch (error) {
    console.error("[Highlighting] ❌ Initialization failed:", error);
    return false;
  }
}

/**
 * Set active highlighting session
 */
export function setHighlightingSession(sessionId: string): void {
  if (highlightingState) {
    highlightingState.activeSession = sessionId;
  }
}

/**
 * Set extracted text for highlighting
 */
export function setExtractedText(text: string): void {
  extractedText = text;
}

interface BackendHighlightData {
  speech_marks?: unknown[];
  highlighting_map?: {
    total_duration?: number;
  };
}

/**
 * SIMPLIFIED: Extract AWS Polly speech marks directly
 * Replaces complex convertBackendHighlightMap processing
 */
export function convertBackendHighlightMap(data: unknown): {
  speechMarks: SpeechMark[];
  estimatedDurationSeconds: number;
} {
  const typedData = data as BackendHighlightData;
  if (typedData.speech_marks && Array.isArray(typedData.speech_marks)) {
    const speechMarks: SpeechMark[] = typedData.speech_marks.map((mark: unknown) => {
      const typedMark = mark as { time?: number; type?: string; start?: number; end?: number; value?: string };
      return {
        time: typedMark.time || 0, // Use AWS Polly time directly
        type: (typedMark.type as "word" | "sentence") || "word",
        start: typedMark.start || 0, // Use AWS Polly positions directly
        end: typedMark.end || 0, // Use AWS Polly positions directly
        value: typedMark.value || "",
      };
    });

    const estimatedDurationSeconds = typedData.highlighting_map?.total_duration || 0;

    return { speechMarks, estimatedDurationSeconds };
  }

  return { speechMarks: [], estimatedDurationSeconds: 0 };
}

/**
 * Setup highlighting for backend (premium) using CSS Custom Highlight API
 */
export function setupBackendHighlighting(
  backendData: SpeechMark[] | BackendHighlightData,
  text: string,
  container: HTMLElement = document.body,
  selectionRange?: Range
): {
  speechMarks: SpeechMark[];
  totalDurationInSeconds: number;
  estimatedDurationSeconds: number;
} {
  const processedData = convertBackendHighlightMap(backendData);

  if (isRangyAvailable()) {
    setupHighlightingNodes(text, container, selectionRange);
  } else {
  }

  highlightingState.highlightingMethod = "backend";
  highlightingState.extractedText = text;

  return {
    speechMarks: processedData.speechMarks,
    totalDurationInSeconds: processedData.estimatedDurationSeconds,
    estimatedDurationSeconds: processedData.estimatedDurationSeconds,
  };
}

/**
 * Setup highlighting for Web Speech API (free tier)
 */
export function setupWebSpeechHighlighting(
  text: string,
  utterance: SpeechSynthesisUtterance,
  container: HTMLElement = document.body
): void {
  highlightingState.highlightingMethod = "webspeech";
  highlightingState.extractedText = text;

  setupHighlightingNodes(text, container);
}

/**
 * Setup text nodes for CSS Custom Highlight API
 */
function setupHighlightingNodes(
  text: string,
  container: HTMLElement,
  selectionRange?: Range
): void {
  extractedText = text;

  if (selectionRange) {
    textNodes = findTextNodesFromSelection(selectionRange);
  } else {
    textNodes = findTextNodesInContainer(container);
  }
}

/**
 * Find text nodes in container
 */
function findTextNodesInContainer(container: HTMLElement): Text[] {
  const textNodes: Text[] = [];

  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) => {
      if (!node.parentElement) return NodeFilter.FILTER_REJECT;

      const tagName = node.parentElement.tagName.toLowerCase();
      if (
        ["script", "style", "noscript"].includes(tagName) ||
        node.parentElement.closest("#tts-widget, .tts-widget")
      ) {
        return NodeFilter.FILTER_REJECT;
      }

      const style = window.getComputedStyle(node.parentElement);
      if (style.display === "none" || style.visibility === "hidden") {
        return NodeFilter.FILTER_REJECT;
      }

      const text = node.textContent || "";
      if (text.trim()) return NodeFilter.FILTER_ACCEPT;
      return NodeFilter.FILTER_SKIP;
    },
  });

  let node = walker.nextNode();
  while (node) {
    const nodeText = node.textContent || "";
    if (nodeText.trim()) {
      textNodes.push(node as Text);
    }
    node = walker.nextNode();
  }

  return textNodes;
}

/**
 * Find text nodes from selection range
 */
function findTextNodesFromSelection(selectionRange: Range): Text[] {
  const textNodes: Text[] = [];

  if (selectionRange.commonAncestorContainer.nodeType === Node.TEXT_NODE) {
    textNodes.push(selectionRange.commonAncestorContainer as Text);
  } else {
    const walker = document.createTreeWalker(
      selectionRange.commonAncestorContainer,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          if (selectionRange.intersectsNode(node)) {
            return NodeFilter.FILTER_ACCEPT;
          }
          return NodeFilter.FILTER_SKIP;
        },
      }
    );

    let node = walker.nextNode();
    while (node) {
      textNodes.push(node as Text);
      node = walker.nextNode();
    }
  }

  return textNodes;
}

/**
 * Highlight current word using CSS Custom Highlight API
 */
export function highlightCurrentWord(
  currentTime: number,
  speechMarks: SpeechMark[]
): void {
  if (!isRangyAvailable()) {
    highlightCurrentWordFallback(currentTime, speechMarks);
    return;
  }

  clearAllHighlights();

  const words = speechMarks.filter((mark) => mark.type === "word");
  const sentences = speechMarks.filter((mark) => mark.type === "sentence");

  // Find current word
  for (const mark of words) {
    if (
      mark.time <= currentTime &&
      currentTime < mark.time + (mark.duration || 0.5)
    ) {
      const range = createRangeFromSpeechMark(mark.start, mark.end);
      if (range) {
        wordHighlight.add(range);
      }
      break;
    }
  }

  // Find current sentence
  for (const mark of sentences) {
    if (
      mark.time <= currentTime &&
      currentTime < mark.time + (mark.duration || 2.0)
    ) {
      const range = createRangeFromSpeechMark(mark.start, mark.end);
      if (range) {
        sentenceHighlight.add(range);
      }
      break;
    }
  }
}

/**
 * Create Range using AWS Polly speech mark positions directly
 */
function createRangeFromSpeechMark(start: number, end: number): Range | null {
  if (textNodes.length === 0) {
    console.warn(
      `[Highlighting] ❌ No text nodes available for range ${start}-${end}`
    );
    return null;
  }

  try {
    const range = new Range();
    let currentPos = 0;
    let startSet = false;
    let endSet = false;

    for (const textNode of textNodes) {
      const nodeText = textNode.textContent || "";
      const nodeLength = nodeText.length;
      const nodeEnd = currentPos + nodeLength;

      // Set start position
      if (!startSet && start >= currentPos && start <= nodeEnd) {
        const offset = start - currentPos;
        range.setStart(textNode, Math.min(offset, nodeLength));
        startSet = true;
      }

      // Set end position
      if (!endSet && end >= currentPos && end <= nodeEnd) {
        const offset = end - currentPos;
        range.setEnd(textNode, Math.min(offset, nodeLength));
        endSet = true;
      }

      if (startSet && endSet) break;
      currentPos = nodeEnd;
    }

    if (startSet && endSet) {
      return range;
    }

    console.warn(
      `[Highlighting] ⚠️ Range creation failed: startSet=${startSet}, endSet=${endSet}`
    );
    return null;
  } catch (error) {
    console.error(
      `[Highlighting] ❌ Error creating range for ${start}-${end}:`,
      error
    );
    return null;
  }
}

/**
 * Fallback highlighting for browsers without CSS Custom Highlight API
 */
function highlightCurrentWordFallback(
  currentTime: number,
  speechMarks: SpeechMark[]
): void {
  clearLegacyHighlights();

  const words = speechMarks.filter((mark) => mark.type === "word");

  for (const mark of words) {
    if (
      mark.time <= currentTime &&
      currentTime < mark.time + (mark.duration || 0.5)
    ) {
      highlightTextBasic(mark.value, "tts-word-highlight");
      break;
    }
  }
}

/**
 * Basic text highlighting for fallback mode
 */
function highlightTextBasic(text: string, className: string): void {
  try {
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;

          if (parent.closest("#tts-widget, .tts-widget, [data-tts-widget]")) {
            return NodeFilter.FILTER_REJECT;
          }

          if (parent.closest(`.${className}`)) {
            return NodeFilter.FILTER_REJECT;
          }

          const nodeText = node.textContent || "";
          return nodeText.toLowerCase().includes(text.toLowerCase())
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_SKIP;
        },
      }
    );

    let node = walker.nextNode();
    while (node) {
      const textNode = node as Text;
      const nodeText = textNode.textContent || "";
      const lowerNodeText = nodeText.toLowerCase();
      const lowerSearchText = text.toLowerCase();
      const index = lowerNodeText.indexOf(lowerSearchText);

      if (index >= 0) {
        const span = document.createElement("span");
        span.className = className;
        span.setAttribute("data-tts-fallback-highlight", "true");

        const beforeText = nodeText.substring(0, index);
        const matchText = nodeText.substring(index, index + text.length);
        const afterText = nodeText.substring(index + text.length);

        const parent = textNode.parentNode;
        if (parent) {
          if (beforeText) {
            parent.insertBefore(document.createTextNode(beforeText), textNode);
          }

          span.textContent = matchText;
          parent.insertBefore(span, textNode);

          if (afterText) {
            parent.insertBefore(document.createTextNode(afterText), textNode);
          }

          parent.removeChild(textNode);
        }

        break;
      }

      node = walker.nextNode();
    }
  } catch (error) {
    console.warn("[Highlighting] ⚠️ Error in basic highlighting:", error);
  }
}

/**
 * Clear all highlights
 */
export function clearAllHighlights(): void {
  if (isRangyAvailable()) {
    wordHighlight?.clear();
    sentenceHighlight?.clear();
  } else {
    clearLegacyHighlights();
  }
}

/**
 * Clear legacy DOM-based highlights
 */
function clearLegacyHighlights(): void {
  const highlights = document.querySelectorAll("[data-tts-fallback-highlight]");
  highlights.forEach((highlight) => {
    const parent = highlight.parentNode;
    if (parent) {
      parent.insertBefore(
        document.createTextNode(highlight.textContent || ""),
        highlight
      );
      parent.removeChild(highlight);
      parent.normalize();
    }
  });
}

/**
 * Cleanup all highlighting
 */
export function cleanupAllHighlighting(): void {
  clearAllHighlights();

  if (isRangyAvailable()) {
    CSS.highlights?.delete("tts-word");
    CSS.highlights?.delete("tts-sentence");
  }

  textNodes = [];
  extractedText = "";

  if (highlightingState) {
    highlightingState.isInitialized = false;
    highlightingState.activeSession = undefined;
  }
}
