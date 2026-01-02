import { CrossPlatformStorage, RuntimeDetection } from '../utils/RuntimeDetection';
import { SpeechMark } from '../../extension/widget/types/TTSTypes';
import { INIT_DELAYS } from '../constants';

interface BackendStatus {
  available: boolean;
  authenticated: boolean;
  responseTime: number;
  lastChecked: Date;
  charactersRemaining: number;
  method: "polly" | "web_speech" | "unknown";
}

interface SynthesizeOptions {
  voice_id?: string;
  engine?: string;
  include_speech_marks?: boolean;
}

interface SynthesizeResult {
  success: boolean;
  audioUrl?: string;
  speechMarks?: SpeechMark[];
  charactersUsed?: number;
  remainingChars?: number;
  error?: string;
}

interface UserPreferences {
  voice_id: string;
  engine: string;
}

type StatusChangeCallback = (status: BackendStatus) => void;

export class BackendIntegrationManager {
  private apiBaseUrl: string;
  private status: BackendStatus;
  private statusCallbacks: StatusChangeCallback[] = [];
  private authToken: string | null = null;
  private isInitialized: boolean = false;
  private cachedPreferences: UserPreferences | null = null;
  private preferencesLastFetched: Date | null = null;

  constructor(apiBaseUrl: string) {
    this.apiBaseUrl = apiBaseUrl.replace(/\/$/, ""); // Remove trailing slash
    this.status = {
      available: false,
      authenticated: false,
      responseTime: 0,
      lastChecked: new Date(),
      charactersRemaining: 0,
      method: "unknown",
    };
  }

  async initialize(): Promise<void> {
    try {
      // Try to get stored auth token with retry
      this.authToken = await this.getStoredAuthToken();

      // If no token initially, try again after a brief delay (for extension startup timing)
      if (!this.authToken) {
        await new Promise((resolve) => setTimeout(resolve, INIT_DELAYS.AUTH_RETRY));
        this.authToken = await this.getStoredAuthToken();
      }

      // Set initial status based on token availability
      this.status = {
        available: !!this.authToken,
        authenticated: !!this.authToken,
        responseTime: 0,
        lastChecked: new Date(),
        charactersRemaining: 0,
        method: "polly",
      };

      this.isInitialized = true;

      if (this.authToken) {
      } else {
      }
    } catch (error) {
      console.error(
        "❌ Failed to initialize Backend Integration Manager:",
        error
      );
      // Set safe defaults
      this.status = {
        available: false,
        authenticated: false,
        responseTime: 0,
        lastChecked: new Date(),
        charactersRemaining: 0,
        method: "unknown",
      };
      this.isInitialized = true; // Still mark as initialized to allow fallback
    }
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (this.authToken) {
      headers["Authorization"] = `Bearer ${this.authToken}`;
    }

    return headers;
  }

  private async getStoredAuthToken(): Promise<string | null> {
    try {
      // Use cross-platform storage that handles extension vs webapp contexts
      return await CrossPlatformStorage.getAuthToken();
    } catch (error) {
      console.debug("Could not access storage:", error);
      return null;
    }
  }

  private async refreshAuthToken(): Promise<boolean> {
    try {
      // Get refresh token from cross-platform storage
      const refresh_token = await CrossPlatformStorage.getRefreshToken();

      if (!refresh_token) {
        console.warn("🔄 No refresh token available");
        return false;
      }

      const response = await fetch(`${this.apiBaseUrl}/api/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token }),
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        throw new Error(`Token refresh failed: ${response.status}`);
      }

      const data = await response.json();

      if (data.access_token) {
        // Update stored token in cross-platform storage
        await CrossPlatformStorage.setAuthToken(data.access_token);
        this.authToken = data.access_token;

        // Update refresh token if provided
        if (data.refresh_token) {
          await CrossPlatformStorage.setRefreshToken(data.refresh_token);
        }

        return true;
      }

      throw new Error("No access token in refresh response");
    } catch (error) {
      console.error("❌ Token refresh failed:", error);

      // Clear invalid tokens from cross-platform storage
      await CrossPlatformStorage.clearAuthToken();
      await CrossPlatformStorage.clearRefreshToken();
      this.authToken = null;
      this.status.authenticated = false;

      return false;
    }
  }

  private notifyStatusChange(): void {
    this.statusCallbacks.forEach((callback) => {
      try {
        callback(this.status);
      } catch (error) {
        console.error("Error in status change callback:", error);
      }
    });
  }

  // Public API methods

  async synthesize(
    text: string,
    options: SynthesizeOptions = {}
  ): Promise<SynthesizeResult> {
    if (!this.isAvailable()) {
      return {
        success: false,
        error: "Backend not available",
      };
    }

    // Get user preferences from backend (single source of truth)
    const userPreferences = await this.getUserPreferences();

    // 🚨 FIX: Try synthesis with token refresh fallback
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await fetch(`${this.apiBaseUrl}/api/synthesize`, {
          method: "POST",
          headers: this.getHeaders(),
          body: JSON.stringify({
            text_to_speech: text,
            voice_id: options.voice_id || userPreferences.voice_id,
            engine: options.engine || userPreferences.engine,
            include_speech_marks: options.include_speech_marks || true,
          }),
          signal: AbortSignal.timeout(30000), // 30 second timeout for synthesis
        });

        // 🚨 FIX: Handle 401 with token refresh
        if (response.status === 401 && attempt === 0) {
          console.warn("🔄 Got 401, attempting token refresh...");
          const refreshed = await this.refreshAuthToken();
          if (refreshed) {
            continue; // Retry with new token
          } else {
            console.error("❌ Token refresh failed");
            return {
              success: false,
              error: "Authentication failed - please log in again",
            };
          }
        }

        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ detail: "Unknown error" }));
          throw new Error(
            errorData.detail || `Synthesis failed: ${response.status}`
          );
        }

        const result = await response.json();

        // 🚨 DETAILED SPEECH MARKS LOGGING: Show first few speech marks in detail
        if (result.speech_marks && Array.isArray(result.speech_marks)) {
        } else {
          console.warn(
            "⚠️ [SPEECH MARKS DETAIL] No speech_marks in response or not an array:",
            {
              speechMarks: result.speech_marks,
              type: typeof result.speech_marks,
            }
          );
        }

        // Update character count
        if (result.remaining_chars !== undefined) {
          this.status.charactersRemaining = result.remaining_chars;
          this.notifyStatusChange();
        }

        // Convert speech marks from milliseconds to seconds at source
        const convertedSpeechMarks = result.speech_marks?.map((mark: unknown) => {
          const typedMark = mark as { time: number; type: string; value: string; start?: number; end?: number };
          return {
            ...typedMark,
            time: typedMark.time / 1000, // Convert AWS Polly milliseconds to seconds
          };
        });

        return {
          success: true,
          audioUrl: result.audio_url,
          speechMarks: convertedSpeechMarks,
          charactersUsed: result.characters_used,
          remainingChars: result.remaining_chars,
        };
      } catch (error) {
        console.error(
          `❌ Backend synthesis failed (attempt ${attempt + 1}):`,
          error
        );

        // If this was the last attempt, return error
        if (attempt === 1) {
          return {
            success: false,
            error: error instanceof Error ? error.message : "Synthesis failed",
          };
        }
      }
    }

    // Should never reach here, but just in case
    return {
      success: false,
      error: "Synthesis failed after retries",
    };
  }

  async extractContent(url: string): Promise<string | null> {
    if (!this.isAvailable()) {
      return null;
    }

    try {
      const response = await fetch(`${this.apiBaseUrl}/api/extract/enhanced`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify({
          url,
          prefer_textract: true,
          include_metadata: true,
        }),
        signal: AbortSignal.timeout(15000), // 15 second timeout
      });

      if (!response.ok) {
        throw new Error(`Extraction failed: ${response.status}`);
      }

      const result = await response.json();

      // Update character count if provided
      if (result.remaining_chars !== undefined) {
        this.status.charactersRemaining = result.remaining_chars;
        this.notifyStatusChange();
      }

      return result.text || null;
    } catch (error) {
      console.error("❌ Content extraction failed:", error);
      return null;
    }
  }

  async getUserPreferences(): Promise<UserPreferences> {
    // Return cached preferences if they're fresh (less than 30 seconds old)
    if (this.cachedPreferences && this.preferencesLastFetched) {
      const age = Date.now() - this.preferencesLastFetched.getTime();
      if (age < 30000) {
        // 30 seconds
        return this.cachedPreferences;
      }
    }

    // Default preferences if backend is not available
    const defaultPreferences: UserPreferences = {
      voice_id: "Joanna",
      engine: "standard",
    };

    if (!this.isAvailable()) {
      console.warn("⚠️ Backend not available, using default preferences");
      return defaultPreferences;
    }

    try {
      const response = await fetch(`${this.apiBaseUrl}/api/preferences`, {
        method: "GET",
        headers: this.getHeaders(),
        signal: AbortSignal.timeout(5000),
      });

      if (!response.ok) {
        throw new Error(`Failed to get preferences: ${response.status}`);
      }

      const preferences = await response.json();

      // Cache the preferences
      this.cachedPreferences = {
        voice_id: preferences.voice_id || defaultPreferences.voice_id,
        engine: preferences.engine || defaultPreferences.engine,
      };
      this.preferencesLastFetched = new Date();
      return this.cachedPreferences;
    } catch (error) {
      console.error("❌ Failed to get user preferences:", error);

      // Return cached preferences if available, otherwise defaults
      if (this.cachedPreferences) {
        console.warn("⚠️ Using cached preferences due to backend error");
        return this.cachedPreferences;
      }

      console.warn("⚠️ Using default preferences due to backend error");
      return defaultPreferences;
    }
  }

  // Clear cached preferences (call when user updates preferences)
  clearPreferencesCache(): void {
    this.cachedPreferences = null;
    this.preferencesLastFetched = null;
  }

  async getVoices(): Promise<any[]> {
    if (!this.isAvailable()) {
      return [];
    }

    try {
      const response = await fetch(`${this.apiBaseUrl}/api/voices`, {
        method: "GET",
        headers: this.getHeaders(),
        signal: AbortSignal.timeout(5000),
      });

      if (!response.ok) {
        throw new Error(`Failed to get voices: ${response.status}`);
      }

      const voices = await response.json();

      return voices || [];
    } catch (error) {
      console.error("❌ Failed to get voices:", error);
      return [];
    }
  }

  async authenticateUser(username: string, password: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        throw new Error(`Authentication failed: ${response.status}`);
      }

      const authData = await response.json();

      if (authData.access_token) {
        this.authToken = authData.access_token;

        // Store token in cross-platform storage
        try {
          if (this.authToken) {
            await CrossPlatformStorage.setAuthToken(this.authToken);
          }
        } catch (error) {
          console.warn("Could not store auth token:", error);
        }

        // Store refresh token if provided
        if (authData.refresh_token) {
          try {
            await CrossPlatformStorage.setRefreshToken(authData.refresh_token);
          } catch (error) {
            console.warn("Could not store refresh token:", error);
          }
        }

        // Update status
        this.status.authenticated = true;
        this.notifyStatusChange();

        return true;
      }

      throw new Error("No access token received");
    } catch (error) {
      console.error("❌ Authentication failed:", error);
      this.authToken = null;
      this.status.authenticated = false;
      this.notifyStatusChange();
      return false;
    }
  }

  async logout(): Promise<void> {
    this.authToken = null;
    this.status.authenticated = false;
    this.status.charactersRemaining = 0;

    // Clear stored token from cross-platform storage
    try {
      await CrossPlatformStorage.clearAuthToken();
      await CrossPlatformStorage.clearRefreshToken();
    } catch (error) {
      console.debug("Could not clear stored tokens:", error);
    }

    this.notifyStatusChange();
  }

  // Status and event management

  onStatusChange(callback: StatusChangeCallback): void {
    this.statusCallbacks.push(callback);
  }

  offStatusChange(callback: StatusChangeCallback): void {
    const index = this.statusCallbacks.indexOf(callback);
    if (index > -1) {
      this.statusCallbacks.splice(index, 1);
    }
  }

  getStatus(): BackendStatus {
    return { ...this.status };
  }

  isAvailable(): boolean {
    // Simply check if we have a valid token
    return !!(this.authToken && this.authToken.length > 10);
  }

  isAuthenticated(): boolean {
    // Simply check if we have a valid token
    return !!(this.authToken && this.authToken.length > 10);
  }

  getCharactersRemaining(): number {
    return this.status.charactersRemaining;
  }

  getResponseTime(): number {
    return this.status.responseTime;
  }

  getMethod(): "polly" | "web_speech" | "unknown" {
    return this.status.method;
  }

  // Cleanup

  cleanup(): void {
    // Clear callbacks
    this.statusCallbacks = [];

    // Reset status
    this.status.available = false;
    this.status.authenticated = false;

    this.isInitialized = false;
  }

  // Utility methods for debugging

  async testConnection(): Promise<boolean> {
    // Test connection by trying a quick synthesis call
    try {
      const result = await this.synthesize("test", {});
      return result.success;
    } catch {
      return false;
    }
  }

  async getFullStatus(): Promise<any> {
    return {
      available: this.isAvailable(),
      authenticated: this.isAuthenticated(),
      hasToken: !!this.authToken,
      tokenLength: this.authToken?.length || 0,
      charactersRemaining: this.status.charactersRemaining,
      method: "polly",
      initialized: this.isInitialized,
    };
  }
}
