/**
 * useStorage - Vue composable for cross-platform storage
 * Follows Vue 3 Composition API best practices
 */
import { ref, computed, watch, readonly } from "vue";
import { RuntimeDetection, RuntimeContext } from "../utils/RuntimeDetection";
import type { UserPreferences, UserProfile } from "../stores/authStore";

// Vue now runs in content script context with direct chrome.runtime access

// Use the centralized runtime detection
const getRuntimeContext = (): RuntimeContext => {
  const context = RuntimeDetection.getContext();

  return context;
};

/**
 * Main storage composable
 */
export const useStorage = () => {
  const context = getRuntimeContext();
  const isReady = ref(false);
  const error = ref<string | null>(null);

  // Storage key constants
  const STORAGE_KEYS = {
    AUTH_TOKEN: "auth_token",
    REFRESH_TOKEN: "refresh_token",
    USER_PREFERENCES: "user_preferences",
    USER_PROFILE: "user_profile",
    USAGE_STATS: "usage_stats",
  } as const;

  /**
   * Generic storage getter
   */
  const getItem = async <T = string>(key: string): Promise<T | null> => {
    try {
      error.value = null;

      if (context.isExtension) {

        const response = await chrome.runtime.sendMessage({
          action: "getStorageItem",
          key,
        });

        return response?.value || null;
      }

      if (context.isWebApp) {

        const value = localStorage.getItem(key);
        if (!value) return null;

        // Try to parse JSON, fallback to string
        try {
          return JSON.parse(value) as T;
        } catch {
          return value as T;
        }
      }

      throw new Error("No storage mechanism available");
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Storage error";
      console.warn("[useStorage] getItem failed for key:", key, "error:", err);
      return null;
    }
  };

  /**
   * Generic storage setter
   */
  const setItem = async <T>(key: string, value: T): Promise<boolean> => {
    try {
      error.value = null;

      if (context.isExtension) {
        await chrome.runtime.sendMessage({
          action: "setStorageItem",
          key,
          value,
        });
        return true;
      }

      if (context.isWebApp) {
        const serialized =
          typeof value === "string" ? value : JSON.stringify(value);
        localStorage.setItem(key, serialized);
        return true;
      }

      throw new Error("No storage mechanism available");
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Storage error";
      console.warn("[useStorage] setItem failed:", err);
      return false;
    }
  };

  /**
   * Generic storage remover
   */
  const removeItem = async (key: string): Promise<boolean> => {
    try {
      error.value = null;

      if (context.isExtension) {
        await chrome.runtime.sendMessage({
          action: "removeStorageItem",
          key,
        });
        return true;
      }

      if (context.isWebApp) {
        localStorage.removeItem(key);
        return true;
      }

      throw new Error("No storage mechanism available");
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Storage error";
      console.warn("[useStorage] removeItem failed:", err);
      return false;
    }
  };

  // Mark as ready
  isReady.value = true;

  return {
    // State
    isReady: readonly(isReady),
    error: readonly(error),
    context: readonly(ref(context)),

    // Storage operations
    getItem,
    setItem,
    removeItem,

    // Storage keys
    STORAGE_KEYS,
  };
};

/**
 * Auth-specific storage composable
 */
export const useAuthStorage = () => {
  const storage = useStorage();

  // Use the exact same keys as the background script
  const getAuthToken = async (): Promise<string | null> => {
    if (storage.context.value.isExtension) {
      try {

        const response = await chrome.runtime.sendMessage({
          action: "getAuthToken",
        });

        return response?.token || null;
      } catch (error) {

        // Fallback to localStorage if chrome.runtime communication fails
        try {
          return localStorage.getItem("auth_token");
        } catch (localStorageError) {
          return null;
        }
      }
    }
    return storage.getItem<string>("auth_token");
  };

  const setAuthToken = async (token: string): Promise<boolean> => {
    if (storage.context.value.isExtension) {
      try {
        await chrome.runtime.sendMessage({
          action: "setAuthToken",
          token,
        });
        return true;
      } catch (error) {
        console.warn("[useAuthStorage] setAuthToken failed:", error);
        return false;
      }
    }
    return storage.setItem("auth_token", token);
  };

  const clearAuthToken = async (): Promise<boolean> => {
    if (storage.context.value.isExtension) {
      try {
        await chrome.runtime.sendMessage({
          action: "clearAuthToken",
        });
        return true;
      } catch (error) {
        console.warn("[useAuthStorage] clearAuthToken failed:", error);
        return false;
      }
    }
    return storage.removeItem("auth_token");
  };

  const getRefreshToken = async (): Promise<string | null> => {
    if (storage.context.value.isExtension) {
      try {
        const response = await chrome.runtime.sendMessage({
          action: "getRefreshToken",
        });
        return response?.refreshToken || null;
      } catch (error) {
        console.warn("[useAuthStorage] getRefreshToken failed, falling back to localStorage:", error);
        // Fallback to localStorage if chrome.runtime communication fails
        try {
          return localStorage.getItem("refresh_token");
        } catch (localStorageError) {
          console.warn("[useAuthStorage] localStorage fallback failed:", localStorageError);
          return null;
        }
      }
    }
    return storage.getItem<string>("refresh_token");
  };

  const setRefreshToken = async (token: string): Promise<boolean> => {
    if (storage.context.value.isExtension) {
      try {
        await chrome.runtime.sendMessage({
          action: "setRefreshToken",
          refreshToken: token,
        });
        return true;
      } catch (error) {
        console.warn("[useAuthStorage] setRefreshToken failed:", error);
        return false;
      }
    }
    return storage.setItem("refresh_token", token);
  };

  const clearRefreshToken = async (): Promise<boolean> => {
    if (storage.context.value.isExtension) {
      try {
        await chrome.runtime.sendMessage({
          action: "clearRefreshToken",
        });
        return true;
      } catch (error) {
        console.warn("[useAuthStorage] clearRefreshToken failed:", error);
        return false;
      }
    }
    return storage.removeItem("refresh_token");
  };

  const getUserPreferences = () =>
    storage.getItem<UserPreferences>(storage.STORAGE_KEYS.USER_PREFERENCES);
  const setUserPreferences = (prefs: UserPreferences) =>
    storage.setItem(storage.STORAGE_KEYS.USER_PREFERENCES, prefs);

  const getUserProfile = () =>
    storage.getItem<UserProfile>(storage.STORAGE_KEYS.USER_PROFILE);
  const setUserProfile = (profile: UserProfile) =>
    storage.setItem(storage.STORAGE_KEYS.USER_PROFILE, profile);

  const clearAllAuth = async () => {
    await Promise.all([
      clearAuthToken(),
      clearRefreshToken(),
      storage.removeItem(storage.STORAGE_KEYS.USER_PROFILE),
    ]);
  };

  return {
    ...storage,

    // Auth-specific methods
    getAuthToken,
    setAuthToken,
    clearAuthToken,

    getRefreshToken,
    setRefreshToken,
    clearRefreshToken,

    getUserPreferences,
    setUserPreferences,

    getUserProfile,
    setUserProfile,

    clearAllAuth,
  };
};

/**
 * Reactive storage hook for a specific key
 */
export const useStorageItem = <T>(
  key: string,
  defaultValue: T | null = null
) => {
  const storage = useStorage();
  const value = ref<T | null>(defaultValue);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Load initial value
  const load = async () => {
    loading.value = true;
    error.value = null;

    try {
      const stored = await storage.getItem<T>(key);
      value.value = stored ?? defaultValue;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Load error";
      value.value = defaultValue;
    } finally {
      loading.value = false;
    }
  };

  // Save value
  const save = async (newValue: T) => {
    loading.value = true;
    error.value = null;

    try {
      const success = await storage.setItem(key, newValue);
      if (success) {
        value.value = newValue;
      } else {
        throw new Error("Failed to save");
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Save error";
    } finally {
      loading.value = false;
    }
  };

  // Remove value
  const remove = async () => {
    loading.value = true;
    error.value = null;

    try {
      const success = await storage.removeItem(key);
      if (success) {
        value.value = defaultValue;
      } else {
        throw new Error("Failed to remove");
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Remove error";
    } finally {
      loading.value = false;
    }
  };

  // Auto-save when value changes (optional)
  const enableAutoSave = () => {
    watch(
      value,
      async (newValue) => {
        if (newValue !== null && newValue !== defaultValue) {
          await save(newValue);
        }
      },
      { deep: true }
    );
  };

  // Load initial value
  load();

  return {
    value,
    loading: readonly(loading),
    error: readonly(error),
    load,
    save,
    remove,
    enableAutoSave,
  };
};
