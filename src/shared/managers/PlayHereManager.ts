import { globalContentFilter } from "../../extension/widget/highlighting/core/ContentFilters";

/**
 * PlayHereManager - Adds individual play buttons next to main content elements
 * Provides granular control for users to play specific sections
 */
export class PlayHereManager {
  private playButtons: Map<Element, HTMLElement> = new Map();
  private isEnabled: boolean = false;
  private onPlayCallback?: (element: Element, text: string) => void;
  private currentPlayingButton?: HTMLElement;

  constructor() {
    this.setupStyles();
  }

  /**
   * Enable Play Here mode - inject buttons next to content elements
   */
  enable(onPlayCallback: (element: Element, text: string) => void): void {
    this.onPlayCallback = onPlayCallback;
    this.isEnabled = true;
    this.injectPlayButtons();
  }

  /**
   * Disable Play Here mode - remove all play buttons
   */
  disable(): void {
    this.isEnabled = false;
    this.removeAllPlayButtons();
    this.currentPlayingButton = undefined;
  }

  /**
   * Toggle Play Here mode
   */
  toggle(onPlayCallback?: (element: Element, text: string) => void): boolean {
    if (this.isEnabled) {
      this.disable();
      return false;
    } else {
      if (onPlayCallback) {
        this.enable(onPlayCallback);
      }
      return true;
    }
  }

  /**
   * Update button state when audio starts playing
   */
  setPlaying(element: Element, isPlaying: boolean): void {
    const button = this.playButtons.get(element);
    if (button) {
      const icon = button.querySelector(".play-here-icon") as HTMLElement;
      if (icon) {
        if (isPlaying) {
          icon.innerHTML = this.getPauseIconSVG();
          button.classList.add("playing");
          this.currentPlayingButton = button;
        } else {
          icon.innerHTML = this.getPlayIconSVG();
          button.classList.remove("playing");
          if (this.currentPlayingButton === button) {
            this.currentPlayingButton = undefined;
          }
        }
      }
    }
  }

  /**
   * Stop all playing indicators
   */
  stopAll(): void {
    this.playButtons.forEach((button) => {
      const icon = button.querySelector(".play-here-icon") as HTMLElement;
      if (icon) {
        icon.innerHTML = this.getPlayIconSVG();
        button.classList.remove("playing");
      }
    });
    this.currentPlayingButton = undefined;
  }

  /**
   * Get the currently playing element
   */
  getCurrentPlayingElement(): Element | undefined {
    if (this.currentPlayingButton) {
      for (const [element, button] of this.playButtons.entries()) {
        if (button === this.currentPlayingButton) {
          return element;
        }
      }
    }
    return undefined;
  }

  private setupStyles(): void {
    // Styles are now handled by the main CSS bundle
    // No need to inject styles dynamically
  }

  private injectPlayButtons(): void {
    // FIXED: Use the exact same method that text extraction uses
    const readableElements = globalContentFilter.getReadableElements(
      document.body
    );

    readableElements.forEach((element) => {
      if (this.shouldAddPlayButton(element)) {
        this.addPlayButton(element);
      }
    });
  }

  private shouldAddPlayButton(element: Element): boolean {
    // ContentFilters gives us the base set, trust it for element selection
    const tagName = element.tagName.toLowerCase();

    // IMPORTANT: Only add buttons to individual content blocks, not container elements
    // Skip container elements (section, article, main) that typically wrap multiple content blocks
    const isContainerElement = ['section', 'article', 'main'].includes(tagName);
    if (isContainerElement) {
      return false;
    }

    if (this.playButtons.has(element)) {
      return false;
    }

    // Only prevent nested buttons
    for (const existingElement of this.playButtons.keys()) {
      if (
        existingElement.contains(element) ||
        element.contains(existingElement)
      ) {
        return false;
      }
    }

    // Skip invisible or very small elements
    const rect = element.getBoundingClientRect();
    if (rect.width < 50 || rect.height < 10) {
      return false;
    }

    // Ensure element has meaningful text content
    const text = this.getCleanText(element);
    if (!text || text.trim().length === 0) {
      return false;
    }

    return true;
  }

  private addPlayButton(element: Element): void {
    const tagName = element.tagName.toLowerCase();


    // Make element a container
    element.classList.add("play-here-container");

    // Create play button
    const button = document.createElement("button");
    button.className = "play-here-btn";
    button.innerHTML = `<span class="play-here-icon">${this.getPlayIconSVG()}</span>`;
    button.title = "Play this section";

    // Add click handler
    button.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.handlePlayClick(element, button);
    });

    // Position the button
    element.appendChild(button);

    // Store reference
    this.playButtons.set(element, button);
  }

  private handlePlayClick(element: Element, button: HTMLElement): void {
    const text = this.getCleanText(element);
    if (text && this.onPlayCallback) {
      // Trigger callback - let the callback handle state management
      this.onPlayCallback(element, text);
    }
  }

  private getCleanText(element: Element): string {
    // Clone element to avoid modifying original
    const clone = element.cloneNode(true) as Element;

    // Remove play button from clone
    const playBtn = clone.querySelector(".play-here-btn");
    if (playBtn) playBtn.remove();

    // getCleanedTextContent already normalizes (includes all optimizations)
    // No need for additional optimizeTextForTts call (would be redundant)
    return globalContentFilter.getCleanedTextContent(clone);
  }

  private removeAllPlayButtons(): void {
    this.playButtons.forEach((button, element) => {
      element.classList.remove("play-here-container");
      button.remove();
    });
    this.playButtons.clear();
  }

  /**
   * Refresh play buttons (useful when page content changes)
   */
  refresh(): void {
    if (this.isEnabled) {
      this.removeAllPlayButtons();
      this.injectPlayButtons();
    }
  }

  /**
   * Get stats about current play buttons
   */
  getStats(): { total: number; playing: boolean } {
    return {
      total: this.playButtons.size,
      playing: !!this.currentPlayingButton,
    };
  }

  /**
   * Generate Play icon SVG (Google Material Icon)
   */
  private getPlayIconSVG(): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor" width="16" height="16">
      <path d="M320-203v-560l440 280-440 280Zm60-280Zm0 171 269-171-269-171v342Z"/>
    </svg>`;
  }

  /**
   * Generate Pause icon SVG (Google Material Icon)
   */
  private getPauseIconSVG(): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor" width="16" height="16">
      <path d="M525-200v-560h235v560H525Zm-325 0v-560h235v560H200Zm385-60h115v-440H585v440Zm-325 0h115v-440H260v440Zm0-440v440-440Zm325 0v440-440Z"/>
    </svg>`;
  }
}
