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
 *
 * When `email` is provided, it is passed to Google's enhanced conversions via
 * `gtag('set', 'user_data', …)` before the conversion event. The Google tag
 * normalizes and SHA-256 hashes it client-side before it leaves the browser —
 * we never send a raw email. This recovers conversions lost to cookie
 * restrictions and improves Smart Bidding signal. Only pass an email on pages
 * where the signed-in/verified user's own address is legitimately available.
 */
export function fireAttributedConversion(
  conversionLabel: string,
  value?: number,
  currency?: string,
  transactionId?: string,
  email?: string,
): void {
  try {
    if (typeof window.gtag !== 'function') return

    // Enhanced conversions: hand the user's own email to the Google tag, which
    // hashes it locally. Normalize (trim + lowercase) per Google's guidance.
    const normalizedEmail = email?.trim().toLowerCase()
    if (normalizedEmail) {
      window.gtag('set', 'user_data', { email: normalizedEmail })
    }

    const params: Record<string, unknown> = {
      send_to: `AW-17950589439/${conversionLabel}`,
    }
    if (value !== undefined) params.value = value
    if (currency) params.currency = currency
    if (transactionId) params.transaction_id = transactionId

    window.gtag('event', 'conversion', params)

    // Mirror to GA4 as a named event. This rides the same Google tag to the
    // connected GA4 property (no separate G- config needed), so the same
    // conversions can be marked as GA4 key events and reported per landing
    // page. The Ads conversion above is unaffected — GA4 ignores send_to.
    const eventName = (Object.keys(CONVERSION_LABELS) as Array<keyof typeof CONVERSION_LABELS>)
      .find((key) => CONVERSION_LABELS[key] === conversionLabel)
      ?.toLowerCase()
    if (eventName) {
      const ga4Params: Record<string, unknown> = {}
      if (value !== undefined) ga4Params.value = value
      if (currency) ga4Params.currency = currency
      if (transactionId) ga4Params.transaction_id = transactionId
      window.gtag('event', eventName, ga4Params)
    }
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
  WEBSTORE_CLICK: 'Bq7KCOGr9b4cEP-Dwe9C',
} as const
