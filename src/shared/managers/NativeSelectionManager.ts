interface SavedSelection {
  startContainer: Node;
  startOffset: number;
  endContainer: Node;
  endOffset: number;
  collapsed: boolean;
  commonAncestorContainer: Node;
}

interface NativeSelectionInfo {
  text: string;
  savedSelection: SavedSelection | null;
  rangeCount: number;
  isMultiNode: boolean;
  boundingRect: DOMRect | null;
  isValid: boolean;
}

type SelectionChangeCallback = (
  selectedText: string,
  selectionInfo: NativeSelectionInfo | null
) => void;

export class NativeSelectionManager {
  private selectionChangeCallbacks: SelectionChangeCallback[] = [];
  private lastSelectedText: string = "";
  private lastSavedSelection: SavedSelection | null = null;
  private selectionTimeout: number | null = null;

  constructor() {
    // Bind methods to maintain context
    this.handleSelectionChange = this.handleSelectionChange.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  async initialize(): Promise<void> {
    try {
      // Add selection change listeners
      document.addEventListener("selectionchange", this.handleSelectionChange);
      document.addEventListener("mouseup", this.handleMouseUp);
      document.addEventListener("keyup", this.handleKeyUp);

    } catch (error) {
      console.error("❌ Failed to initialize Native Selection Manager:", error);
      throw error;
    }
  }

  private handleSelectionChange(): void {
    // CRITICAL FIX: Always capture selection immediately to prevent loss
    const selection = window.getSelection();
    const hasSelection = selection && selection.toString().trim().length > 0;
    
    if (hasSelection) {
      // Always save the most recent selection immediately
      this.lastSavedSelection = this.saveNativeSelection(selection);
      this.lastSelectedText = selection.toString().trim();
    }

    // Debounce selection changes to avoid excessive calls
    if (this.selectionTimeout) {
      clearTimeout(this.selectionTimeout);
    }

    this.selectionTimeout = window.setTimeout(() => {
      this.processSelectionChange();
    }, 50); // 50ms debounce
  }

  private handleMouseUp(): void {
    // Trigger immediate selection check on mouse up
    setTimeout(() => this.processSelectionChange(), 10);
  }

  private handleKeyUp(event: KeyboardEvent): void {
    // Only process on certain key combinations that might change selection
    if (
      event.key === "ArrowLeft" ||
      event.key === "ArrowRight" ||
      event.key === "ArrowUp" ||
      event.key === "ArrowDown" ||
      event.key === "Home" ||
      event.key === "End" ||
      (event.ctrlKey && (event.key === "a" || event.key === "A"))
    ) {
      setTimeout(() => this.processSelectionChange(), 10);
    }
  }

  private processSelectionChange(): void {
    try {
      const selection = window.getSelection();

      // Use saved selection if current selection is empty but we have a saved one
      if ((!selection || selection.rangeCount === 0 || selection.toString().trim().length === 0) && this.lastSavedSelection) {
        // Use the saved selection for processing
        const selectionInfo = this.createNativeSelectionInfo(null, this.lastSavedSelection);
        this.notifySelectionChange(this.lastSelectedText, selectionInfo);
        return;
      }

      if (!selection || selection.rangeCount === 0) {
        this.handleEmptySelection();
        return;
      }

      const selectedText = selection.toString().trim();

      // Only notify if selection actually changed
      if (selectedText === this.lastSelectedText) {
        return;
      }

      this.lastSelectedText = selectedText;

      if (selectedText.length === 0) {
        // Check if we have a saved selection to fall back to
        if (this.lastSavedSelection) {
          const selectionInfo = this.createNativeSelectionInfo(null, this.lastSavedSelection);
          this.notifySelectionChange(this.lastSelectedText, selectionInfo);
          return;
        }
        this.handleEmptySelection();
        return;
      }

      // Save the current selection using native APIs
      const savedSelection = this.saveNativeSelection(selection);
      this.lastSavedSelection = savedSelection;

      // Create detailed selection info
      const selectionInfo = this.createNativeSelectionInfo(
        selection,
        savedSelection
      );

      this.notifySelectionChange(selectedText, selectionInfo);
    } catch (error) {
      console.error("❌ Error processing native selection change:", error);
      this.handleEmptySelection();
    }
  }

  private handleEmptySelection(): void {
    this.lastSelectedText = "";
    this.lastSavedSelection = null;
    this.notifySelectionChange("", null);
  }

  private saveNativeSelection(selection: Selection): SavedSelection | null {
    if (selection.rangeCount === 0) return null;

    try {
      const range = selection.getRangeAt(0);
      return {
        startContainer: range.startContainer,
        startOffset: range.startOffset,
        endContainer: range.endContainer,
        endOffset: range.endOffset,
        collapsed: range.collapsed,
        commonAncestorContainer: range.commonAncestorContainer,
      };
    } catch (error) {
      console.error("Error saving native selection:", error);
      return null;
    }
  }

  private createNativeSelectionInfo(
    selection: Selection | null,
    savedSelection: SavedSelection | null
  ): NativeSelectionInfo {
    try {
      const text = selection ? selection.toString() : this.lastSelectedText;
      const rangeCount = selection ? selection.rangeCount : (savedSelection ? 1 : 0);

      // Check if selection spans multiple nodes
      let isMultiNode = false;
      let boundingRect: DOMRect | null = null;

      if (rangeCount > 0) {
        try {
          if (selection) {
            const firstRange = selection.getRangeAt(0);

            // Check if start and end containers are different
            isMultiNode =
              rangeCount > 1 ||
              firstRange.startContainer !== firstRange.endContainer ||
              this.spansMultipleElements(firstRange);

            // Get bounding rect for the selection
            boundingRect = firstRange.getBoundingClientRect();
          } else if (savedSelection) {
            // For saved selection, we can't easily determine multi-node or rect
            isMultiNode = false;
            boundingRect = null;
          }
        } catch (error) {
          console.debug("Could not analyze native selection details:", error);
        }
      }

      return {
        text,
        savedSelection,
        rangeCount,
        isMultiNode,
        boundingRect,
        isValid: text.length > 0 && savedSelection !== null,
      };
    } catch (error) {
      console.error("Error creating native selection info:", error);
      return {
        text: "",
        savedSelection: null,
        rangeCount: 0,
        isMultiNode: false,
        boundingRect: null,
        isValid: false,
      };
    }
  }

  private spansMultipleElements(range: Range): boolean {
    try {
      // Walk through the range and check if it contains multiple elements
      const walker = document.createTreeWalker(
        range.commonAncestorContainer,
        NodeFilter.SHOW_ELEMENT,
        {
          acceptNode: (node) => {
            return range.intersectsNode(node)
              ? NodeFilter.FILTER_ACCEPT
              : NodeFilter.FILTER_REJECT;
          },
        }
      );

      let elementCount = 0;
      while (walker.nextNode() && elementCount < 2) {
        elementCount++;
      }

      return elementCount > 1;
    } catch (error) {
      return false;
    }
  }

  private isNotifying: boolean = false;

  private notifySelectionChange(
    text: string,
    selectionInfo: NativeSelectionInfo | null
  ): void {
    // Prevent recursive calls
    if (this.isNotifying) {
      return;
    }

    this.isNotifying = true;
    try {
      this.selectionChangeCallbacks.forEach((callback) => {
        try {
          callback(text, selectionInfo);
        } catch (error) {
          console.error("Error in native selection change callback:", error);
        }
      });
    } finally {
      this.isNotifying = false;
    }
  }

  // Public API methods using native APIs

  getSelectedText(): string {
    try {
      const selection = window.getSelection();
      return selection ? selection.toString().trim() : "";
    } catch (error) {
      console.error("Error getting native selected text:", error);
      return "";
    }
  }

  getSelectionInfo(): NativeSelectionInfo | null {
    try {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) {
        return null;
      }

      const savedSelection = this.saveNativeSelection(selection);
      return this.createNativeSelectionInfo(selection, savedSelection);
    } catch (error) {
      console.error("Error getting native selection info:", error);
      return null;
    }
  }

  getSavedSelection(): SavedSelection | null {
    return this.lastSavedSelection;
  }

  hasSelection(): boolean {
    return this.getSelectedText().length > 0;
  }

  clearSelection(): void {
    try {
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
      }

      this.lastSelectedText = "";
      this.lastSavedSelection = null;
      this.notifySelectionChange("", null);
    } catch (error) {
      console.error("Error clearing native selection:", error);
    }
  }

  restoreSelection(savedSelection: SavedSelection | null): boolean {
    if (!savedSelection) return false;

    try {
      const range = document.createRange();
      range.setStart(savedSelection.startContainer, savedSelection.startOffset);
      range.setEnd(savedSelection.endContainer, savedSelection.endOffset);

      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }

      return true;
    } catch (error) {
      console.error("❌ Error restoring native selection:", error);
      return false;
    }
  }

  selectText(
    startNode: Node,
    startOffset: number,
    endNode: Node,
    endOffset: number
  ): boolean {
    try {
      const range = document.createRange();
      range.setStart(startNode, startOffset);
      range.setEnd(endNode, endOffset);

      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }

      this.processSelectionChange();
      return true;
    } catch (error) {
      console.error("Error selecting text with native APIs:", error);
      return false;
    }
  }

  selectElement(element: Element): boolean {
    try {
      const range = document.createRange();
      range.selectNodeContents(element);

      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }

      this.processSelectionChange();
      return true;
    } catch (error) {
      console.error("Error selecting element with native APIs:", error);
      return false;
    }
  }

  // Advanced native selection operations

  expandSelectionToWord(): boolean {
    try {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) {
        return false;
      }

      const range = selection.getRangeAt(0);
      this.expandRangeToWordBoundaries(range);

      selection.removeAllRanges();
      selection.addRange(range);
      this.processSelectionChange();
      return true;
    } catch (error) {
      console.error("Error expanding native selection to word:", error);
      return false;
    }
  }

  expandSelectionToSentence(): boolean {
    try {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) {
        return false;
      }

      const range = selection.getRangeAt(0);
      const expandedRange = this.findSentenceBoundariesWithNative(range);

      if (expandedRange) {
        selection.removeAllRanges();
        selection.addRange(expandedRange);
        this.processSelectionChange();
        return true;
      }
    } catch (error) {
      console.error("Error expanding native selection to sentence:", error);
    }
    return false;
  }

  private findSentenceBoundariesWithNative(range: Range): Range | null {
    try {
      const fullText = range.commonAncestorContainer.textContent || "";
      const selectedText = range.toString();
      const startIndex = fullText.indexOf(selectedText);

      if (startIndex === -1) return null;

      // Find sentence start
      let sentenceStart = startIndex;
      while (sentenceStart > 0) {
        if (
          /[.!?]\s/.test(fullText.substring(sentenceStart - 2, sentenceStart))
        ) {
          break;
        }
        sentenceStart--;
      }

      // Find sentence end
      let sentenceEnd = startIndex + selectedText.length;
      while (sentenceEnd < fullText.length) {
        if (/[.!?]/.test(fullText[sentenceEnd])) {
          sentenceEnd++;
          break;
        }
        sentenceEnd++;
      }

      // Create new range for the sentence using native APIs
      const sentenceRange = document.createRange();
      const textNodes = this.getTextNodesInContainer(
        range.commonAncestorContainer
      );

      // Find the correct text nodes and offsets for the sentence boundaries
      const startPos = this.findTextNodePosition(textNodes, sentenceStart);
      const endPos = this.findTextNodePosition(textNodes, sentenceEnd);

      if (startPos && endPos) {
        sentenceRange.setStart(startPos.node, startPos.offset);
        sentenceRange.setEnd(endPos.node, endPos.offset);
        return sentenceRange;
      }

      return null;
    } catch (error) {
      console.error(
        "Error finding sentence boundaries with native APIs:",
        error
      );
      return null;
    }
  }

  private expandRangeToWordBoundaries(range: Range): void {
    try {
      const startContainer = range.startContainer;
      const endContainer = range.endContainer;

      if (
        startContainer.nodeType === Node.TEXT_NODE &&
        endContainer.nodeType === Node.TEXT_NODE
      ) {
        const startText = startContainer.textContent || "";
        const endText = endContainer.textContent || "";

        let newStartOffset = range.startOffset;
        let newEndOffset = range.endOffset;

        // Expand to word boundaries
        while (newStartOffset > 0 && /\w/.test(startText[newStartOffset - 1])) {
          newStartOffset--;
        }

        while (
          newEndOffset < endText.length &&
          /\w/.test(endText[newEndOffset])
        ) {
          newEndOffset++;
        }

        range.setStart(startContainer, newStartOffset);
        range.setEnd(endContainer, newEndOffset);
      }
    } catch (error) {
      console.error("Error expanding range to word boundaries:", error);
    }
  }

  private getTextNodesInContainer(container: Node): Text[] {
    const textNodes: Text[] = [];
    const walker = document.createTreeWalker(
      container,
      NodeFilter.SHOW_TEXT,
      null
    );

    let node = walker.nextNode();
    while (node) {
      textNodes.push(node as Text);
      node = walker.nextNode();
    }

    return textNodes;
  }

  private findTextNodePosition(
    textNodes: Text[],
    targetOffset: number
  ): { node: Text; offset: number } | null {
    let currentOffset = 0;

    for (const textNode of textNodes) {
      const nodeLength = textNode.textContent?.length || 0;

      if (currentOffset + nodeLength > targetOffset) {
        return {
          node: textNode,
          offset: targetOffset - currentOffset,
        };
      }

      currentOffset += nodeLength;
    }

    return null;
  }

  // Event management
  onSelectionChange(callback: SelectionChangeCallback): void {
    this.selectionChangeCallbacks.push(callback);
  }

  removeSelectionChangeListener(callback: SelectionChangeCallback): void {
    const index = this.selectionChangeCallbacks.indexOf(callback);
    if (index > -1) {
      this.selectionChangeCallbacks.splice(index, 1);
    }
  }

  // Utility methods
  getCurrentRange(): Range | null {
    try {
      const selection = window.getSelection();
      return selection && selection.rangeCount > 0
        ? selection.getRangeAt(0)
        : null;
    } catch (error) {
      console.error("Error getting current native range:", error);
      return null;
    }
  }

  getSelectionDirection(): "forward" | "backward" | "none" {
    try {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) {
        return "none";
      }

      const range = selection.getRangeAt(0);
      const compare = range.startContainer.compareDocumentPosition(
        range.endContainer
      );

      if (compare & Node.DOCUMENT_POSITION_FOLLOWING) {
        return "forward";
      } else if (compare & Node.DOCUMENT_POSITION_PRECEDING) {
        return "backward";
      } else {
        return range.startOffset < range.endOffset ? "forward" : "backward";
      }
    } catch (error) {
      console.error("Error determining native selection direction:", error);
      return "none";
    }
  }

  cleanup(): void {
    try {
      // Remove event listeners
      document.removeEventListener(
        "selectionchange",
        this.handleSelectionChange
      );
      document.removeEventListener("mouseup", this.handleMouseUp);
      document.removeEventListener("keyup", this.handleKeyUp);

      // Clear timeout
      if (this.selectionTimeout) {
        clearTimeout(this.selectionTimeout);
        this.selectionTimeout = null;
      }

      // Clear callbacks
      this.selectionChangeCallbacks = [];

      // Clear selection and state
      this.clearSelection();
      this.lastSelectedText = "";
      this.lastSavedSelection = null;

    } catch (error) {
      console.error("Error during native selection cleanup:", error);
    }
  }
}
