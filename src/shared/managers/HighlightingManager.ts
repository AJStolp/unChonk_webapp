import { HighlightingEngine } from "../../extension/widget/highlighting/core/HighlightingEngine";
import { HighlightingConfig, SpeechMark } from "../../extension/widget/types/TTSTypes";

interface HighlightingSetupData {
  speechMarks?: SpeechMark[];
  totalDurationInSeconds?: number;
  type?: string;
  text?: string;
  containerNode?: HTMLElement;
  message?: string;
}

interface EngineState {
  activeSession?: string;
  highlightingMethod?: string;
  usingPaintAPI?: boolean;
  highlightTechnology?: string;
  isInitialized?: boolean;
}

interface HighlightingDebugInfo {
  isInitialized: boolean;
  sessionId: string;
  paintAPISupported: boolean;
  highlightingEngine: string;
  storeConnected: boolean;
}

export interface HighlightingManagerConfig {
  onHighlightingSetup?: (data: HighlightingSetupData) => void;
  onHighlightingStart?: () => void;
  onHighlightingStop?: () => void;
  onError?: (error: unknown, context: string) => void;
}

// Interface for Vue store integration - pure business logic doesn't manage state
export interface HighlightingStoreInterface {
  setEngineState: (state: Partial<EngineState>) => void;
  setTimingState: (time: number, duration?: number) => void;
  startTimingLoop: () => void;
  stopTimingLoop: () => void;
  readonly isInitialized: boolean;
  readonly activeSession: string | undefined;
}

export class HighlightingManager {
  private highlightingEngine: HighlightingEngine;
  private config: HighlightingManagerConfig;
  private store: HighlightingStoreInterface | null = null;

  constructor(config: HighlightingManagerConfig = {}) {
    this.config = config;
    this.highlightingEngine = new HighlightingEngine();
  }

  // Connect to Vue store for state management
  public connectStore(store: HighlightingStoreInterface): void {
    this.store = store;
  }

  public async initialize(
    userTier: "free" | "premium",
    sessionId: string
  ): Promise<boolean> {
    try {
      // Update store state instead of local state
      if (this.store) {
        this.store.setEngineState({
          activeSession: sessionId,
          highlightingMethod: 'backend',
          usingPaintAPI: true,
          highlightTechnology: 'paint-api'
        });
      }

      const config: HighlightingConfig = {
        userTier,
        enableNativeHighlighting: true,
        enableSentenceHighlighting: userTier === "premium",
        enableWordHighlighting: true,
        container: document.body,
      };

      const initialized = await this.highlightingEngine.initialize(config);
      if (initialized) {
        // Notify store of initialization success
        if (this.store) {
          this.store.setEngineState({ isInitialized: true });
        }
        this.highlightingEngine.setActiveSession(sessionId);

        document.body.setAttribute("data-tts-tier", userTier);
        document.body.setAttribute("data-tts-session", sessionId);
      }

      return initialized;
    } catch (error) {
      if (this.config.onError) {
        this.config.onError(error, "Highlighting initialization");
      }
      return false;
    }
  }

  public isHighlightingInitialized(): boolean {
    return this.store?.isInitialized ?? false;
  }

  public setAudioElement(audioElement: HTMLAudioElement): void {
    if (this.store?.isInitialized) {
      this.highlightingEngine.setAudioElement(audioElement);
    }
  }

  public setupBackendHighlighting(
    speechMarkData: SpeechMark[],
    text: string,
    containerNode: HTMLElement,
    selectionRange?: Range
  ): { speechMarks: SpeechMark[]; totalDurationInSeconds: number } | null {
    if (!this.store?.isInitialized || !speechMarkData || !text || !containerNode) {
      return null;
    }

    try {
      const highlightSetup =
        this.highlightingEngine.setupBackendHighlightingWithPaintAPI(
          speechMarkData,
          text,
          containerNode,
          selectionRange
        );

      if (this.config.onHighlightingSetup) {
        this.config.onHighlightingSetup(highlightSetup);
      }

      return highlightSetup;
    } catch (error) {
      if (this.config.onError) {
        this.config.onError(error, "Backend highlighting setup");
      }
      return null;
    }
  }

  // NOTE: Web Speech highlighting is now handled by Paint API through WebSpeechToPaintAPIAdapter
  // This method is deprecated and replaced by the unified Paint API system
  public setupWebSpeechHighlighting(
    text: string,
    containerNode: HTMLElement
  ): boolean {
    console.warn('[HighlightingManager] setupWebSpeechHighlighting is deprecated. Use Paint API system instead.');
    
    if (this.config.onHighlightingSetup) {
      this.config.onHighlightingSetup({
        type: "web-speech-deprecated",
        text,
        containerNode,
        message: "Web Speech highlighting now uses Paint API"
      });
    }
    
    return true;
  }

  public startHighlighting(): void {
    if (this.store?.isInitialized) {
      this.highlightingEngine.startHighlighting();
      if (this.config.onHighlightingStart) {
        this.config.onHighlightingStart();
      }
    }
  }

  public stopHighlighting(): void {
    if (this.store?.isInitialized) {
      this.highlightingEngine.clearAllHighlights();
      if (this.config.onHighlightingStop) {
        this.config.onHighlightingStop();
      }
    }
  }

  public clearAllHighlights(): void {
    if (this.store?.isInitialized) {
      this.highlightingEngine.clearAllHighlights();
    }
  }

  public setupBackendHighlightingWithPaintAPI(
    backendData: SpeechMark[],
    backendText: string,
    container: HTMLElement = document.body,
    selectionRange?: Range
  ): { speechMarks: SpeechMark[]; totalDurationInSeconds: number } | null {
    if (this.store?.isInitialized) {
      return this.highlightingEngine.setupBackendHighlightingWithPaintAPI(
        backendData,
        backendText,
        container,
        selectionRange
      );
    }
    return null;
  }

  public getAudioElement(): HTMLAudioElement | null {
    if (this.store?.isInitialized) {
      return this.highlightingEngine.getAudioElement();
    }
    return null;
  }

  public prepareForModeTransition(): void {
    // Ensure clean state before switching modes
    if (this.store?.isInitialized) {
      this.highlightingEngine.clearAllHighlights();
      // Force a brief pause to ensure DOM updates complete
      setTimeout(() => {
      }, 10);
    }
  }

  public getNativeSelection(): Selection | null {
    return this.highlightingEngine.getNativeSelection();
  }

  public getPaintAPIInfo(): { supported: boolean } {
    return this.highlightingEngine.getPaintAPIInfo();
  }

  public cleanup(): void {
    if (this.store?.isInitialized) {
      this.highlightingEngine.cleanup();
      // Reset store state instead of local state
      if (this.store) {
        this.store.setEngineState({ isInitialized: false });
      }
    }
  }

  // Update speech marks incrementally without resetting state (for Web Speech API)
  public updateSpeechMarksIncrementally(speechMarks: SpeechMark[]): void {
    if (!this.store?.isInitialized) return;

    this.highlightingEngine.updateSpeechMarksIncrementally(speechMarks);
  }

  // Update highlighting at a specific time (for offscreen audio sync)
  public updateHighlightingAtTime(currentTime: number): void {
    if (!this.store?.isInitialized) return;

    // Direct highlighting update - bypasses audio element complexity for offscreen audio
    this.highlightingEngine.updateHighlightingDirectly(currentTime);
  }

  public getDebugInfo(): HighlightingDebugInfo {
    return {
      isInitialized: this.store?.isInitialized ?? false,
      sessionId: this.store?.activeSession ?? 'none',
      paintAPISupported: this.getPaintAPIInfo().supported,
      highlightingEngine: this.store?.isInitialized ? "ready" : "not initialized",
      storeConnected: !!this.store,
    };
  }

  public updateProviderSettings(settings: any): void {
    if (this.store?.isInitialized) {
      this.highlightingEngine.updateProviderSettings(settings);
    }
  }

  public resetToDefaultColors(): void {
    if (this.store?.isInitialized) {
      this.highlightingEngine.resetToDefaultColors();
    }
  }
}
