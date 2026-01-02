/**
 * RuntimeDetection - Utility for detecting and handling different runtime contexts
 * Handles Chrome extension, webapp, and standalone Vue contexts
 */

export interface RuntimeContext {
  isExtension: boolean;
  isWebApp: boolean;
  isStandalone: boolean;
  hasChrome: boolean;
  hasLocalStorage: boolean;
}

export class RuntimeDetection {
  private static context: RuntimeContext | null = null;

  /**
   * Detect the current runtime context
   */
  static detect(): RuntimeContext {
    if (this.context) {
      return this.context;
    }

    const hasChrome = typeof chrome !== "undefined";
    const hasRuntime = hasChrome && !!chrome.runtime;
    const hasLocalStorage = typeof localStorage !== "undefined";

    // Check for extension context hints in global variables (set by content script)
    // This includes both direct window properties and event-based detection for isolated contexts
    const hasExtensionHint =
      typeof window !== "undefined" &&
      ((window as any).ttsSuperuserExtensionContext === true ||
        (window as any).ttsExtensionId !== undefined ||
        document.querySelector('script[src*="chrome-extension://"]') !== null ||
        // Check for manifest.json indicator (extension pages)
        window.location.protocol === "chrome-extension:" ||
        // Check for injected content script indicators
        document.documentElement.hasAttribute("data-tts-extension-injected"));


    // Extension context: has chrome object and can communicate with extension
    // OR has extension context hints (for isolated Vue contexts)
    const isExtension =
      (hasChrome &&
        hasRuntime &&
        (chrome.runtime.id !== undefined || // Extension pages have ID
          (typeof window !== "undefined" &&
            window.location.protocol === "chrome-extension:") || // Extension pages
          typeof chrome.runtime.sendMessage === "function")) || // Content script with message passing capability
      hasExtensionHint; // OR extension context was hinted

    // Webapp context: no extension context but has localStorage (running in browser)
    const isWebApp =
      !isExtension && hasLocalStorage && typeof window !== "undefined";

    // Standalone context: neither extension nor webapp (Node.js, tests, etc.)
    const isStandalone = !isExtension && !isWebApp;

    this.context = {
      isExtension,
      isWebApp,
      isStandalone,
      hasChrome,
      hasLocalStorage,
    };

    return this.context;
  }

  /**
   * Get the current runtime context (cached)
   */
  static getContext(): RuntimeContext {
    return this.detect();
  }

  /**
   * Check if we're running in Chrome extension context
   */
  static isExtensionContext(): boolean {
    return this.detect().isExtension;
  }

  /**
   * Check if we're running in webapp context
   */
  static isWebAppContext(): boolean {
    return this.detect().isWebApp;
  }

  /**
   * Check if we're running in standalone context
   */
  static isStandaloneContext(): boolean {
    return this.detect().isStandalone;
  }

  /**
   * Reset the cached context (useful for testing)
   */
  static reset(): void {
    this.context = null;
  }
}

/**
 * Storage abstraction that works across different runtime contexts
 * Uses standardized keys consistent with useStorage composable and extension background
 */
export class CrossPlatformStorage {
  private static readonly AUTH_TOKEN_KEY = "auth_token";
  private static readonly REFRESH_TOKEN_KEY = "refresh_token";
  private static readonly USER_PREFERENCES_KEY = "user_preferences";

  /**
   * Get authentication token from appropriate storage
   */
  static async getAuthToken(): Promise<string | null> {
    const context = RuntimeDetection.getContext();

    if (context.isExtension) {
      try {
        const response = await chrome.runtime.sendMessage({
          action: "getAuthToken",
        });
        return response?.token || null;
      } catch (error) {
        console.warn("[CrossPlatformStorage] Chrome storage failed:", error);
        return null;
      }
    }

    if (context.isWebApp && context.hasLocalStorage) {
      try {
        return localStorage.getItem(this.AUTH_TOKEN_KEY);
      } catch (error) {
        console.warn("[CrossPlatformStorage] localStorage failed:", error);
        return null;
      }
    }

    console.warn("[CrossPlatformStorage] No storage mechanism available");
    return null;
  }

  /**
   * Set authentication token in appropriate storage
   */
  static async setAuthToken(token: string): Promise<boolean> {
    const context = RuntimeDetection.getContext();

    if (context.isExtension) {
      try {
        await chrome.runtime.sendMessage({
          action: "setAuthToken",
          token,
        });
        return true;
      } catch (error) {
        console.warn("[CrossPlatformStorage] Chrome storage failed:", error);
        return false;
      }
    }

    if (context.isWebApp && context.hasLocalStorage) {
      try {
        localStorage.setItem(this.AUTH_TOKEN_KEY, token);
        return true;
      } catch (error) {
        console.warn("[CrossPlatformStorage] localStorage failed:", error);
        return false;
      }
    }

    console.warn("[CrossPlatformStorage] No storage mechanism available");
    return false;
  }

  /**
   * Clear authentication token from appropriate storage
   */
  static async clearAuthToken(): Promise<boolean> {
    const context = RuntimeDetection.getContext();

    if (context.isExtension) {
      try {
        await chrome.runtime.sendMessage({
          action: "clearAuthToken",
        });
        return true;
      } catch (error) {
        console.warn("[CrossPlatformStorage] Chrome storage failed:", error);
        return false;
      }
    }

    if (context.isWebApp && context.hasLocalStorage) {
      try {
        localStorage.removeItem(this.AUTH_TOKEN_KEY);
        return true;
      } catch (error) {
        console.warn("[CrossPlatformStorage] localStorage failed:", error);
        return false;
      }
    }

    console.warn("[CrossPlatformStorage] No storage mechanism available");
    return false;
  }

  /**
   * Get refresh token from appropriate storage
   */
  static async getRefreshToken(): Promise<string | null> {
    const context = RuntimeDetection.getContext();

    if (context.isExtension) {
      try {
        const response = await chrome.runtime.sendMessage({
          action: "getRefreshToken",
        });
        return response?.refreshToken || null;
      } catch (error) {
        console.warn("[CrossPlatformStorage] Chrome storage failed:", error);
        return null;
      }
    }

    if (context.isWebApp && context.hasLocalStorage) {
      try {
        return localStorage.getItem(this.REFRESH_TOKEN_KEY);
      } catch (error) {
        console.warn("[CrossPlatformStorage] localStorage failed:", error);
        return null;
      }
    }

    console.warn("[CrossPlatformStorage] No storage mechanism available");
    return null;
  }

  /**
   * Set refresh token in appropriate storage
   */
  static async setRefreshToken(token: string): Promise<boolean> {
    const context = RuntimeDetection.getContext();

    if (context.isExtension) {
      try {
        await chrome.runtime.sendMessage({
          action: "setRefreshToken",
          refreshToken: token,
        });
        return true;
      } catch (error) {
        console.warn("[CrossPlatformStorage] Chrome storage failed:", error);
        return false;
      }
    }

    if (context.isWebApp && context.hasLocalStorage) {
      try {
        localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
        return true;
      } catch (error) {
        console.warn("[CrossPlatformStorage] localStorage failed:", error);
        return false;
      }
    }

    console.warn("[CrossPlatformStorage] No storage mechanism available");
    return false;
  }

  /**
   * Clear refresh token from appropriate storage
   */
  static async clearRefreshToken(): Promise<boolean> {
    const context = RuntimeDetection.getContext();

    if (context.isExtension) {
      try {
        await chrome.runtime.sendMessage({
          action: "clearRefreshToken",
        });
        return true;
      } catch (error) {
        console.warn("[CrossPlatformStorage] Chrome storage failed:", error);
        return false;
      }
    }

    if (context.isWebApp && context.hasLocalStorage) {
      try {
        localStorage.removeItem(this.REFRESH_TOKEN_KEY);
        return true;
      } catch (error) {
        console.warn("[CrossPlatformStorage] localStorage failed:", error);
        return false;
      }
    }

    console.warn("[CrossPlatformStorage] No storage mechanism available");
    return false;
  }

  /**
   * Get user preferences from appropriate storage
   */
  static async getUserPreferences(): Promise<any | null> {
    const context = RuntimeDetection.getContext();

    if (context.isExtension) {
      try {
        const response = await chrome.runtime.sendMessage({
          action: "getPreferences",
        });
        return response?.preferences || null;
      } catch (error) {
        console.warn("[CrossPlatformStorage] Chrome storage failed:", error);
        return null;
      }
    }

    if (context.isWebApp && context.hasLocalStorage) {
      try {
        const stored = localStorage.getItem(this.USER_PREFERENCES_KEY);
        return stored ? JSON.parse(stored) : null;
      } catch (error) {
        console.warn("[CrossPlatformStorage] localStorage failed:", error);
        return null;
      }
    }

    console.warn("[CrossPlatformStorage] No storage mechanism available");
    return null;
  }

  /**
   * Generic storage getter for arbitrary keys
   */
  static async getItem<T = string>(key: string): Promise<T | null> {
    const context = RuntimeDetection.getContext();

    if (context.isExtension) {
      try {
        const response = await chrome.runtime.sendMessage({
          action: "getStorageItem",
          key,
        });
        return response?.value || null;
      } catch (error) {
        console.warn("[CrossPlatformStorage] Chrome storage failed:", error);
        return null;
      }
    }

    if (context.isWebApp && context.hasLocalStorage) {
      try {
        const value = localStorage.getItem(key);
        if (!value) return null;

        // Try to parse JSON, fallback to string
        try {
          return JSON.parse(value) as T;
        } catch {
          return value as T;
        }
      } catch (error) {
        console.warn("[CrossPlatformStorage] localStorage failed:", error);
        return null;
      }
    }

    console.warn("[CrossPlatformStorage] No storage mechanism available");
    return null;
  }

  /**
   * Generic storage setter for arbitrary keys
   */
  static async setItem<T>(key: string, value: T): Promise<boolean> {
    const context = RuntimeDetection.getContext();

    if (context.isExtension) {
      try {
        await chrome.runtime.sendMessage({
          action: "setStorageItem",
          key,
          value,
        });
        return true;
      } catch (error) {
        console.warn("[CrossPlatformStorage] Chrome storage failed:", error);
        return false;
      }
    }

    if (context.isWebApp && context.hasLocalStorage) {
      try {
        const serialized =
          typeof value === "string" ? value : JSON.stringify(value);
        localStorage.setItem(key, serialized);
        return true;
      } catch (error) {
        console.warn("[CrossPlatformStorage] localStorage failed:", error);
        return false;
      }
    }

    console.warn("[CrossPlatformStorage] No storage mechanism available");
    return false;
  }

  /**
   * Generic storage remover for arbitrary keys
   */
  static async removeItem(key: string): Promise<boolean> {
    const context = RuntimeDetection.getContext();

    if (context.isExtension) {
      try {
        await chrome.runtime.sendMessage({
          action: "removeStorageItem",
          key,
        });
        return true;
      } catch (error) {
        console.warn("[CrossPlatformStorage] Chrome storage failed:", error);
        return false;
      }
    }

    if (context.isWebApp && context.hasLocalStorage) {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (error) {
        console.warn("[CrossPlatformStorage] localStorage failed:", error);
        return false;
      }
    }

    console.warn("[CrossPlatformStorage] No storage mechanism available");
    return false;
  }
}

/**
 *
 * Chrome Runtime wrapper that provides safe access to chrome.runtime APIs
 */
export class ChromeRuntimeWrapper {
  /**
   * Safe version of chrome.runtime.getURL that works in content script context
   */
  static getURL(path: string): string {
    const context = RuntimeDetection.getContext();

    if (context.isExtension && typeof chrome !== "undefined") {
      try {
        // Try to use chrome.runtime.getURL if available
        if (chrome.runtime && typeof chrome.runtime.getURL === "function") {
          return chrome.runtime.getURL(path);
        }

        // Fallback: send message to background script to get URL
        if (
          chrome.runtime &&
          typeof chrome.runtime.sendMessage === "function"
        ) {
          // For immediate use, we'll construct the URL manually
          // This is a fallback that should work in most cases
          const extensionId = chrome.runtime.id || "unknown";
          return `chrome-extension://${extensionId}/${path}`;
        }
      } catch (error) {
        console.warn(
          "[ChromeRuntimeWrapper] chrome.runtime.getURL failed:",
          error
        );
      }
    }

    // Final fallback - relative path (will likely fail but better than undefined)
    console.warn(
      "[ChromeRuntimeWrapper] No chrome.runtime available, using relative path:",
      path
    );
    return path;
  }

  /**
   * Check if chrome.runtime.getURL is available
   */
  static isGetURLAvailable(): boolean {
    try {
      return (
        typeof chrome !== "undefined" &&
        chrome.runtime &&
        typeof chrome.runtime.getURL === "function"
      );
    } catch {
      return false;
    }
  }
}
