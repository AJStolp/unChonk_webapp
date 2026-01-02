/**
 * Environment Configuration
 * Centralized configuration for all environment-specific values
 * Supports development, staging, and production environments
 */

// Type-safe environment configuration
export interface EnvironmentConfig {
  apiBaseUrl: string
  environment: 'development' | 'staging' | 'production'
  isDevelopment: boolean
  isProduction: boolean
}

/**
 * Get API base URL from environment or default
 */
function getApiBaseUrl(): string {
  // Check for Vite environment variable (webapp builds)
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env.VITE_API_URL || 'http://localhost:5000'
  }

  // Fallback for non-Vite contexts (extension background scripts, etc.)
  return 'http://localhost:5000'
}

/**
 * Get environment name
 */
function getEnvironment(): 'development' | 'staging' | 'production' {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    const mode = import.meta.env.MODE
    if (mode === 'production') return 'production'
    if (mode === 'staging') return 'staging'
  }
  return 'development'
}

/**
 * Main environment configuration
 */
export const ENV_CONFIG: EnvironmentConfig = {
  apiBaseUrl: getApiBaseUrl(),
  environment: getEnvironment(),
  isDevelopment: getEnvironment() === 'development',
  isProduction: getEnvironment() === 'production'
}

/**
 * Convenience exports
 */
export const API_BASE_URL = ENV_CONFIG.apiBaseUrl
export const IS_DEVELOPMENT = ENV_CONFIG.isDevelopment
export const IS_PRODUCTION = ENV_CONFIG.isProduction

/**
 * Get full API endpoint URL
 */
export function getApiUrl(endpoint: string): string {
  const baseUrl = ENV_CONFIG.apiBaseUrl
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  return `${baseUrl}${cleanEndpoint}`
}
