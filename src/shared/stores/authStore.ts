import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useAuthStorage } from "../composables/useStorage";
import { getApiUrl } from "../config/environment";
import { TIER_LIMITS } from "../constants";
import { trackEvent, ANALYTICS_EVENTS } from "../utils/analytics";

export interface UserProfile {
  id: string;
  email: string;
  username?: string;
  tier: "free" | "light" | "premium" | "pro";
  subscriptionStatus?: "active" | "cancelled" | "expired";
  billingCycle?: "monthly" | "yearly";

  // Legacy fields (keep for backward compatibility)
  charactersUsed: number;
  charactersLimit: number;

  // New backend fields
  monthly_usage?: number;
  monthly_cap?: number;
  usage_percentage?: number;
  usage_reset_date?: string;
  is_near_limit?: boolean;

  // Credit expiration fields
  days_until_expiration?: number;  // Days remaining until credits expire
  next_expiration?: string;         // ISO date of next expiration

  createdAt?: string;
}

export interface UserPreferences {
  autoInject: boolean;
  voiceId: string;
  engine: "neural" | "standard";
  playbackRate: number;
  volume: number;
  highlightMode: "word" | "segment";
  shortcutsEnabled: boolean;
  defaultLanguage: string;
}

export interface UsageStats {
  charactersProcessed: number;
  sessionsStarted: number;
  lastUsed: string;
  favoriteVoice: string;
  totalPlaybackTime: number;
}

export const useAuthStore = defineStore("auth", () => {
  // ===== AUTH STATE =====
  const isAuthenticated = ref(false);
  const isLoading = ref(false);
  const authToken = ref<string | null>(null);
  const refreshToken = ref<string | null>(null);

  // Singleton guard for initialization
  let initializationPromise: Promise<void> | null = null;

  // ===== USER DATA =====
  const user = ref<UserProfile | null>(null);
  const preferences = ref<UserPreferences>({
    autoInject: true,
    voiceId: "Joanna",
    engine: "standard",
    playbackRate: 1.0,
    volume: 1.0,
    highlightMode: "word",
    shortcutsEnabled: true,
    defaultLanguage: "en-US",
  });

  const usageStats = ref<UsageStats>({
    charactersProcessed: 0,
    sessionsStarted: 0,
    lastUsed: new Date().toISOString(),
    favoriteVoice: "Joanna",
    totalPlaybackTime: 0,
  });

  // ===== COMPUTED =====
  const isPremium = computed(() => user.value?.tier === "premium");
  const isPro = computed(() => user.value?.tier === "pro");
  const isLight = computed(() => user.value?.tier === "light");
  const isPaidTier = computed(() => isLight.value || isPremium.value || isPro.value);
  const canUseFeature = computed(
    () => isAuthenticated.value && isPaidTier.value
  );

  const charactersRemaining = computed(() => {
    if (!user.value) return 0;
    // Prefer new backend fields
    const cap = user.value.monthly_cap ?? user.value.charactersLimit;
    const used = user.value.monthly_usage ?? user.value.charactersUsed;
    return Math.max(0, cap - used);
  });

  const usagePercentage = computed(() => {
    if (!user.value) return 0;
    // Use backend-calculated percentage if available
    if (user.value.usage_percentage !== undefined) {
      return user.value.usage_percentage;
    }
    // Fallback to calculation
    const cap = user.value.monthly_cap ?? user.value.charactersLimit;
    if (cap === 0) return 0;
    const used = user.value.monthly_usage ?? user.value.charactersUsed;
    return (used / cap) * 100;
  });

  const nextResetDate = computed(() => {
    if (!user.value?.usage_reset_date) return null;
    return new Date(user.value.usage_reset_date).toLocaleDateString();
  });

  // ===== ACTIONS =====

  // Initialize auth from storage
  const initializeAuth = async () => {
    // Return existing initialization promise if already in progress
    if (initializationPromise) {
      return initializationPromise;
    }

    // Create new initialization promise
    initializationPromise = (async () => {
      // Set loading state synchronously before any await
      isLoading.value = true;

      try {
        // Get tokens from Chrome storage or localStorage
        const tokens = await getStoredTokens();

        if (tokens.authToken) {
          authToken.value = tokens.authToken;
          refreshToken.value = tokens.refreshToken;

          // Validate token and get user data
          const userData = await validateToken(tokens.authToken);
          if (userData) {
            user.value = userData;
            isAuthenticated.value = true;
          }
        }

        // Load preferences and usage stats
        await loadUserPreferences();
        await loadUsageStats();
      } catch (error) {
        console.error("[Auth Store] ❌ Auth initialization failed:", error);
        await logout();
      } finally {
        isLoading.value = false;
        initializationPromise = null; // Clear promise when done
      }
    })();

    return initializationPromise;
  };

  // Login with credentials
  const login = async (username: string, password: string) => {
    isLoading.value = true;

    try {
      // This will integrate with your existing AuthService
      const response = await fetch(getApiUrl("/api/login"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Content-Type-Options": "nosniff",
          "X-Frame-Options": "DENY",
          "X-XSS-Protection": "1; mode=block",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error(`Login failed: ${response.statusText}`);
      }

      const data = await response.json();

      // Store tokens (backend returns access_token, not token)
      authToken.value = data.access_token;
      refreshToken.value = data.refresh_token;

      // Create a basic user object since backend doesn't return user data in login response
      user.value = {
        id: username, // Use username as temp ID until we can fetch user profile
        email: "", // Will be populated when we fetch user profile
        username: username,
        tier: "free", // Default tier
        charactersUsed: 0,
        charactersLimit: TIER_LIMITS.free.characters,
      };
      isAuthenticated.value = true;

      // Persist to storage
      await storeTokens(data.access_token, data.refresh_token);
      await storeUserData(user.value);

      // Track successful login
      trackEvent(ANALYTICS_EVENTS.LOGIN_SUCCESS, {
        username: username,
        tier: user.value.tier,
      });

      return true;
    } catch (error) {
      console.error("[Auth Store] ❌ Login failed:", error);

      // Track failed login
      trackEvent(ANALYTICS_EVENTS.LOGIN_FAILED, {
        username: username,
        error: error instanceof Error ? error.message : "Unknown error",
      });

      return false;
    } finally {
      isLoading.value = false;
    }
  };

  // Logout and clear state
  const logout = async () => {
    try {
      // Call logout endpoint if authenticated
      if (authToken.value) {
        await fetch(getApiUrl("/api/logout"), {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken.value}`,
            "Content-Type": "application/json",
          },
        }).catch(() => {
          // Logout endpoint might fail, that's ok
        });
      }
    } catch (error) {
      console.warn("[Auth Store] ⚠️ Logout endpoint failed:", error);
    }

    // Track logout before clearing state
    trackEvent(ANALYTICS_EVENTS.LOGOUT, {
      username: user.value?.username || "unknown",
    });

    // Clear state
    isAuthenticated.value = false;
    authToken.value = null;
    refreshToken.value = null;
    user.value = null;

    // Clear storage
    await clearStoredAuth();
  };

  // Refresh auth token
  const refreshAuth = async () => {
    if (!refreshToken.value) return false;

    try {
      const response = await fetch(getApiUrl("/api/refresh"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${refreshToken.value}`,
        },
      });

      if (!response.ok) throw new Error("Refresh failed");

      const data = await response.json();
      authToken.value = data.token;
      await storeTokens(data.token, refreshToken.value);

      return true;
    } catch (error) {
      console.error("[Auth Store] ❌ Token refresh failed:", error);
      await logout();
      return false;
    }
  };

  // Update user preferences
  const updatePreferences = async (
    newPreferences: Partial<UserPreferences>
  ) => {
    preferences.value = { ...preferences.value, ...newPreferences };

    try {
      // Persist to backend
      if (isAuthenticated.value && authToken.value) {
        await fetch(getApiUrl("/user/preferences"), {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken.value}`,
          },
          body: JSON.stringify(preferences.value),
        });
      }

      // Persist locally
      await storeUserPreferences(preferences.value);
    } catch (error) {
      console.error("[Auth Store] ❌ Failed to update preferences:", error);
    }
  };

  // Track usage
  const trackUsage = async (characters: number) => {
    usageStats.value.charactersProcessed += characters;
    usageStats.value.lastUsed = new Date().toISOString();

    if (user.value) {
      user.value.charactersUsed += characters;
    }

    // Persist usage stats
    await storeUsageStats(usageStats.value);
  };

  // ===== STORAGE HELPERS =====

  const getStoredTokens = async (): Promise<{
    authToken: string | null;
    refreshToken: string | null;
  }> => {
    const storage = useAuthStorage();
    return {
      authToken: await storage.getAuthToken(),
      refreshToken: await storage.getRefreshToken(),
    };
  };

  const storeTokens = async (auth: string, refresh?: string) => {
    const storage = useAuthStorage();
    await storage.setAuthToken(auth);
    if (refresh) {
      await storage.setRefreshToken(refresh);
    }
  };

  const storeUserData = async (userData: UserProfile) => {
    const storage = useAuthStorage();
    await storage.setUserProfile(userData);
  };

  const storeUserPreferences = async (prefs: UserPreferences) => {
    const storage = useAuthStorage();
    await storage.setUserPreferences(prefs);
  };

  const storeUsageStats = async (stats: UsageStats) => {
    const storage = useAuthStorage();
    await storage.setItem("usage_stats", stats);
  };

  const loadUserPreferences = async () => {
    try {
      const storage = useAuthStorage();
      const stored = await storage.getUserPreferences();

      if (stored) {
        preferences.value = { ...preferences.value, ...stored };
      }
    } catch (error) {
      console.warn("[Auth Store] ⚠️ Failed to load preferences:", error);
    }
  };

  const loadUsageStats = async () => {
    try {
      const storage = useAuthStorage();
      const stored = await storage.getItem<UsageStats>("usage_stats");

      if (stored && typeof stored === "object") {
        usageStats.value = { ...usageStats.value, ...stored };
      }
    } catch (error) {
      console.warn("[Auth Store] ⚠️ Failed to load usage stats:", error);
    }
  };

  const clearStoredAuth = async () => {
    const storage = useAuthStorage();
    await storage.clearAllAuth();
  };

  const validateToken = async (token: string): Promise<UserProfile | null> => {
    try {
      const response = await fetch(getApiUrl("/api/validate-token"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });

      if (!response.ok) return null;
      const data = await response.json();
      return data.userData || null;
    } catch (error) {
      console.error("[Auth Store] ❌ Token validation failed:", error);
      return null;
    }
  };

  return {
    // ===== STATE =====
    isAuthenticated,
    isLoading,
    authToken,
    user,
    preferences,
    usageStats,

    // ===== COMPUTED =====
    isPremium,
    isPro,
    isLight,
    isPaidTier,
    canUseFeature,
    charactersRemaining,
    usagePercentage,
    nextResetDate,

    // ===== ACTIONS =====
    initializeAuth,
    login,
    logout,
    refreshAuth,
    updatePreferences,
    trackUsage,
  };
});
