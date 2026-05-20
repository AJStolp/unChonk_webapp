/**
 * Google Ads Attribution Capture & Storage
 *
 * Captures gclid, gbraid, wbraid, and UTM params from URL on landing,
 * stores them in localStorage + first-party cookie for conversion attribution.
 */

const STORAGE_KEY = 'unchonk_attribution'
const COOKIE_NAME = '_unchonk_attr'
const COOKIE_MAX_AGE = 2592000 // 30 days in seconds

const AD_PARAMS = ['gclid', 'gbraid', 'wbraid'] as const
const UTM_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const
const ALL_PARAMS = [...AD_PARAMS, ...UTM_PARAMS] as const

export interface AttributionData {
  gclid?: string
  gbraid?: string
  wbraid?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_content?: string
  utm_term?: string
  captured_at: string
}

/**
 * Capture attribution params from the current URL and persist them.
 * Uses first-touch attribution: only overwrites if new data has a click ID
 * and old data does not, or if no existing data.
 *
 * Call this on every webapp page load.
 */
export function captureAttribution(): void {
  try {
    const params = new URLSearchParams(window.location.search)
    const newData: Partial<AttributionData> = {}
    let hasAdParam = false

    for (const key of ALL_PARAMS) {
      const value = params.get(key)
      if (value) {
        newData[key] = value
        if (AD_PARAMS.includes(key as any)) hasAdParam = true
      }
    }

    // Nothing to capture
    if (Object.keys(newData).length === 0) return

    const existing = getAttribution()

    // First-touch: only overwrite if we have a click ID and existing doesn't,
    // or if there's no existing data
    if (existing) {
      const existingHasClickId = existing.gclid || existing.gbraid || existing.wbraid
      if (existingHasClickId && !hasAdParam) return // keep existing attribution
    }

    const attribution: AttributionData = {
      ...newData,
      captured_at: new Date().toISOString(),
    }

    // Store in localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(attribution))

    // Store in first-party cookie (survives better across sessions)
    const cookieValue = encodeURIComponent(JSON.stringify(attribution))
    document.cookie = `${COOKIE_NAME}=${cookieValue}; max-age=${COOKIE_MAX_AGE}; path=/; SameSite=Lax; Secure`
  } catch {
    // Attribution capture should never break the page
  }
}

/**
 * Retrieve stored attribution data (localStorage first, cookie fallback).
 */
export function getAttribution(): AttributionData | null {
  try {
    // Try localStorage first
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)

    // Fallback to cookie
    const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`))
    if (match) return JSON.parse(decodeURIComponent(match[1]))
  } catch {
    // Safe to ignore
  }
  return null
}

/**
 * Get the active click ID (gclid preferred, then gbraid, then wbraid).
 */
export function getClickId(): string | null {
  const attr = getAttribution()
  if (!attr) return null
  return attr.gclid || attr.gbraid || attr.wbraid || null
}

/**
 * Fire a Google Ads conversion via gtag with proper attribution.
 */
export function fireAttributedConversion(
  conversionLabel: string,
  value?: number,
  currency?: string,
  transactionId?: string,
): void {
  try {
    if (typeof window.gtag !== 'function') return

    const params: Record<string, unknown> = {
      send_to: `AW-17950589439/${conversionLabel}`,
    }
    if (value !== undefined) params.value = value
    if (currency) params.currency = currency
    if (transactionId) params.transaction_id = transactionId

    window.gtag('event', 'conversion', params)
  } catch {
    // Conversion tracking should never break the page
  }
}

/**
 * Conversion labels for all tracked events.
 */
export const CONVERSION_LABELS = {
  SIGN_UP: 'q9CCCI7iqoEcEP-Dwe9C',
  EMAIL_VERIFIED: '_om7CI71oIEcEP-Dwe9C',
  EXTENSION_INSTALLED: 'qAmwCOPQoYEcEP-Dwe9C',
  FIRST_USAGE: 'dvLyCLKNoYEcEP-Dwe9C',
  FIRST_PURCHASE: 'OtLjCOz2q4EcEP-Dwe9C',
} as const
