# SEO Rules & Implementation Guide — ttsAudify

This document defines the SEO standards for the ttsAudify webapp. Every page must follow these rules. This is a living document — update it as search engine guidelines evolve.

---

## Table of Contents

1. [Meta Title Tags](#1-meta-title-tags)
2. [Meta Description Tags](#2-meta-description-tags)
3. [Open Graph Tags](#3-open-graph-tags)
4. [Twitter/X Card Tags](#4-twitterx-card-tags)
5. [Canonical Tags](#5-canonical-tags)
6. [Structured Data (JSON-LD)](#6-structured-data-json-ld)
7. [Heading Hierarchy](#7-heading-hierarchy)
8. [Semantic HTML](#8-semantic-html)
9. [robots.txt](#9-robotstxt)
10. [Sitemap](#10-sitemap)
11. [Image SEO](#11-image-seo)
12. [Performance & Core Web Vitals](#12-performance--core-web-vitals)
13. [URL Structure](#13-url-structure)
14. [Keyword Strategy](#14-keyword-strategy)
15. [Page-Specific SEO Map](#15-page-specific-seo-map)
16. [Pages to Exclude from Indexing](#16-pages-to-exclude-from-indexing)
17. [Checklist](#17-checklist)

---

## 1. Meta Title Tags

| Rule | Spec |
|------|------|
| **Length** | 50–60 characters (under 600px rendered width) |
| **Format** | `Primary Keyword - Secondary Context \| Brand` |
| **Uniqueness** | Every page MUST have a unique title |
| **Keyword placement** | Primary keyword within the first 3 words |
| **Brand suffix** | Always end with `\| ttsAudify` |
| **No duplicates** | Never reuse a title across pages |
| **No keyword stuffing** | Max 1–2 keywords per title |

### Title Formula

```
[Action/Benefit Keyword] [Descriptive Phrase] | ttsAudify
```

**Examples:**
- `Text to Speech Chrome Extension - AI Voices | ttsAudify`
- `Pricing & Credits - Affordable TTS Plans | ttsAudify`
- `TTS Use Cases - Students, Pros & More | ttsAudify`

---

## 2. Meta Description Tags

| Rule | Spec |
|------|------|
| **Length** | 140–160 characters |
| **Uniqueness** | Every page MUST have a unique description |
| **Structure** | Lead with value proposition, include a CTA |
| **Keywords** | Include 1–2 target keywords naturally (bolded in SERPs when matched) |
| **No duplicates** | Never reuse a description across pages |
| **Accuracy** | Must truthfully reflect the page content |

### Description Formula

```
[Value proposition with primary keyword]. [Supporting detail]. [CTA].
```

**Examples:**
- `Transform any text into natural speech with premium AI voices. Highlight words in real time as they're read. Try ttsAudify free.` (138 chars)
- `Choose a TTS plan that fits your needs. Pay per credit with no subscriptions. Get started with ttsAudify today.` (112 chars)

---

## 3. Open Graph Tags

Every indexable page MUST include these OG tags in `<head>`:

```html
<meta property="og:title" content="[Same as or variation of meta title, max 60 chars]" />
<meta property="og:description" content="[Same as or variation of meta description, max 200 chars]" />
<meta property="og:type" content="website" />
<meta property="og:url" content="[Canonical URL of the page]" />
<meta property="og:image" content="[Absolute URL to OG image]" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="[Descriptive alt text for the image]" />
<meta property="og:site_name" content="ttsAudify" />
<meta property="og:locale" content="en_US" />
```

### OG Image Rules

| Rule | Spec |
|------|------|
| **Dimensions** | 1200 x 630px (1.91:1 aspect ratio) |
| **Format** | PNG or JPEG |
| **File size** | Under 300KB (aim for under 100KB) |
| **Text on image** | Minimal — keep readable if cropped |
| **URL** | Must be an absolute URL (https://) |
| **Alt text** | Always provide `og:image:alt` |

---

## 4. Twitter/X Card Tags

Every indexable page MUST include:

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="[Same as og:title]" />
<meta name="twitter:description" content="[Same as og:description]" />
<meta name="twitter:image" content="[Same as og:image]" />
<meta name="twitter:image:alt" content="[Same as og:image:alt]" />
```

Optional (if applicable):
```html
<meta name="twitter:site" content="@ttsaudify" />
<meta name="twitter:creator" content="@handle" />
```

---

## 5. Canonical Tags

Every page MUST include a canonical tag:

```html
<link rel="canonical" href="https://ttsaudify.com/[path]" />
```

| Rule | Spec |
|------|------|
| **Format** | Full absolute URL with protocol |
| **Trailing slashes** | Be consistent — pick one pattern and stick with it |
| **Self-referencing** | Every page should canonical to itself |
| **No query params** | Canonical URLs must not include query parameters |

---

## 6. Structured Data (JSON-LD)

Use JSON-LD format exclusively. Place in `<head>` or end of `<body>`.

### Required: Organization Schema (Landing Page)

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "ttsAudify",
  "url": "https://ttsaudify.com",
  "logo": "https://ttsaudify.com/logo.png",
  "description": "Text-to-speech Chrome extension with premium AI voices.",
  "sameAs": []
}
```

### Required: WebApplication Schema (Landing Page)

```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "ttsAudify",
  "url": "https://ttsaudify.com",
  "applicationCategory": "BrowserApplication",
  "operatingSystem": "Chrome",
  "description": "Transform any text into natural-sounding speech with premium AI voices.",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "description": "Free tier available"
  },
  "browserRequirements": "Requires Google Chrome"
}
```

### Required: FAQPage Schema (Demo / Use Cases Page)

If there is FAQ-style content, wrap it:

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What can I use ttsAudify for?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "..."
      }
    }
  ]
}
```

### Rules

| Rule | Spec |
|------|------|
| **Format** | JSON-LD only (not Microdata, not RDFa) |
| **Validation** | Test with Google Rich Results Test before deploying |
| **Accuracy** | Schema must match visible page content |
| **No cloaking** | Never put data in schema that isn't on the page |

---

## 7. Heading Hierarchy

| Rule | Spec |
|------|------|
| **One `<h1>` per page** | Mandatory. Contains the primary keyword. |
| **Hierarchy** | `h1 > h2 > h3` — never skip levels (no `h1` then `h3`) |
| **Keywords in headings** | Use target keywords naturally in `h1` and `h2` tags |
| **No styling-only headings** | Don't use heading tags for visual sizing — use CSS |
| **Descriptive** | Headings should describe the content beneath them |

### Per-Page H1 Examples

| Page | H1 |
|------|-----|
| Landing | `Transform Text Into Natural Speech` |
| Subscription | `Choose Your ttsAudify Plan` |
| Demo | `See ttsAudify in Action` |
| Privacy | `Privacy Policy` |

---

## 8. Semantic HTML

Every page MUST use semantic elements:

```html
<header>  <!-- Site header / nav -->
<nav>     <!-- Navigation links -->
<main>    <!-- Primary page content (one per page) -->
<section> <!-- Thematic grouping of content -->
<article> <!-- Self-contained content block -->
<aside>   <!-- Sidebar / supplementary content -->
<footer>  <!-- Site footer -->
```

| Rule | Spec |
|------|------|
| **`<main>`** | Exactly one per page |
| **`<nav>`** | Wrap all navigation elements |
| **`<section>`** | Use for distinct content groups, each with a heading |
| **Landmark roles** | Semantic elements provide implicit ARIA roles — don't duplicate |
| **Skip links** | Consider adding a "Skip to content" link for accessibility |

---

## 9. robots.txt

Place at the public root (`/public/robots.txt`):

```
User-agent: *
Allow: /
Disallow: /success
Disallow: /email-verification

Sitemap: https://ttsaudify.com/sitemap.xml
```

| Rule | Spec |
|------|------|
| **Allow indexable pages** | `/`, `/subscription`, `/demo`, `/privacy` |
| **Block transactional pages** | `/success`, `/email-verification` |
| **Reference sitemap** | Always include `Sitemap:` directive |

---

## 10. Sitemap

Place at the public root (`/public/sitemap.xml`):

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://ttsaudify.com/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://ttsaudify.com/subscription</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://ttsaudify.com/demo</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://ttsaudify.com/privacy</loc>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
</urlset>
```

| Rule | Spec |
|------|------|
| **Only indexable pages** | Never include `/success` or `/email-verification` |
| **Absolute URLs** | Always use full `https://` URLs |
| **Keep updated** | Update when pages are added or removed |
| **Priority** | Homepage = 1.0, key pages = 0.8, secondary = 0.3–0.5 |

---

## 11. Image SEO

| Rule | Spec |
|------|------|
| **Alt text** | Every `<img>` must have descriptive `alt` text |
| **File names** | Use descriptive, hyphenated names: `tts-audify-voice-settings.png` |
| **Format** | Use WebP with JPEG/PNG fallback |
| **Lazy loading** | Add `loading="lazy"` to below-the-fold images |
| **Dimensions** | Always set `width` and `height` attributes to prevent CLS |
| **Compression** | Keep images under 100KB where possible |

---

## 12. Performance & Core Web Vitals

Google uses Core Web Vitals as a ranking signal. Target these thresholds:

| Metric | Target | What It Measures |
|--------|--------|-----------------|
| **LCP** (Largest Contentful Paint) | < 2.5s | Loading performance |
| **INP** (Interaction to Next Paint) | < 200ms | Interactivity |
| **CLS** (Cumulative Layout Shift) | < 0.1 | Visual stability |

### Rules

- Minimize JavaScript bundle size — use code splitting per page (already done via MPA)
- Preload critical fonts and above-the-fold images
- Use `font-display: swap` for web fonts
- Defer non-critical scripts (analytics, etc.)
- Avoid layout shifts caused by dynamically loaded content
- Set explicit dimensions on images, embeds, and iframes
- Test with Lighthouse and PageSpeed Insights before every release

---

## 13. URL Structure

| Rule | Spec |
|------|------|
| **Lowercase** | All URLs must be lowercase |
| **Hyphens** | Use hyphens to separate words: `/use-cases` not `/useCases` |
| **Short** | Keep paths concise and descriptive |
| **No trailing slashes** | Be consistent (pick one) |
| **No file extensions** | `/subscription` not `/subscription.html` |
| **Semantic** | URL should hint at page content |

Current routes are clean: `/`, `/subscription`, `/demo`, `/privacy` — maintain this pattern.

---

## 14. Keyword Strategy

> Data sourced from searchvolume.io — January 2026

### Tier 1: High Volume (use in titles, H1s, descriptions)

| Keyword | Monthly Volume | Intent | Target Page | Notes |
|---------|---------------|--------|-------------|-------|
| `text to speech` | **301,000** | Informational | Landing | Head term — weave naturally into copy but don't try to rank directly. Too competitive. |
| `free text to speech` | **18,100** | Transactional | Landing | Use if free tier exists. "Try ttsAudify free" in descriptions. |
| `text to speech app` | **12,100** | Transactional | Landing | Strong target — include in title and H1. |
| `text to speech online` | **6,600** | Informational | Landing / Demo | Good secondary keyword for landing page. |

### Tier 2: Medium Volume (use in titles, H2s, descriptions)

| Keyword | Monthly Volume | Intent | Target Page | Notes |
|---------|---------------|--------|-------------|-------|
| `read aloud chrome extension` | **4,400** | Transactional | Landing | Highly relevant — matches product exactly. |
| `ai voice reader` | **2,400** | Transactional | Landing | Use in subheadings and feature descriptions. |
| `ai text reader` | **1,900** | Transactional | Landing / Demo | Variant of above — use in body copy. |
| `text to audio converter` | **1,600** | Transactional | Landing | People search this but our product reads aloud, not exports. Use carefully — don't misrepresent the product. |
| `text to speech chrome extension` | **1,600** | Transactional | Landing | Most product-relevant keyword. Must be in title. |

### Tier 3: Low Volume / High Intent (use in body copy, H2s)

| Keyword | Monthly Volume | Intent | Target Page | Notes |
|---------|---------------|--------|-------------|-------|
| `text to speech pricing` | **260** | Commercial | Subscription | Low volume but visitors are ready to buy. |
| `tts chrome extension` | **110** | Transactional | Landing | Abbreviation — low search demand. Use sparingly. |
| `text to speech for students` | **90** | Informational | Demo | Niche — use in use-case copy on demo page. |
| `best text to speech extension` | **30** | Commercial | Landing | Low volume but high purchase intent. |

### Dropped Keywords (0 monthly searches — do not target)

These keywords have zero verified search volume. Do not waste title or description space on them. They can appear naturally in body copy but should not be prioritized:

- ~~text to speech for dyslexia~~
- ~~tts accessibility tool~~
- ~~word highlighting text to speech~~
- ~~read any webpage aloud~~
- ~~screen reader alternative~~
- ~~browser read aloud extension~~
- ~~natural sounding tts~~

### Keyword Rules

| Rule | Spec |
|------|------|
| **Density** | 1–2% keyword density in body content (natural usage) |
| **No stuffing** | Never force keywords where they don't fit |
| **LSI keywords** | Use semantically related terms throughout content |
| **One primary keyword per page** | Don't cannibalize — each page targets different intent |
| **Prioritize by volume** | Tier 1 > Tier 2 > Tier 3 when choosing what to put in titles/H1s |
| **Intent match** | Commercial-intent keywords go on conversion pages (subscription), informational on content pages (demo) |

---

## 15. Page-Specific SEO Map

### Landing Page (`/`)

```
Title:       Text to Speech App & Chrome Extension | ttsAudify  (51 chars)
Description: Transform any text into natural speech with premium AI voices.
             Read aloud any webpage with real-time highlighting. Try free.  (141 chars)
H1:          Text to Speech App With Premium AI Voices
Schema:      Organization + WebApplication
Keywords:    text to speech app (12.1K), text to speech chrome extension (1.6K),
             read aloud chrome extension (4.4K), ai voice reader (2.4K),
             free text to speech (18.1K)
OG Image:    Hero/product screenshot showing the extension in action
Index:       YES
```

**Keyword coverage rationale:** Title targets "text to speech app" (12.1K) as the
primary rankable keyword. "Chrome extension" in title captures 1.6K. Description
weaves in "read aloud" (4.4K) and "try free" to capture free-intent traffic (18.1K).
Body copy should include "ai voice reader" (2.4K) and "ai text reader" (1.9K) in
feature headings.

### Subscription Page (`/subscription`)

```
Title:       Text to Speech Pricing - Pay As You Go | ttsAudify  (51 chars)
Description: Affordable text to speech credits with no subscriptions required.
             Choose a plan that fits your reading needs. Get started today.  (140 chars)
H1:          Text to Speech Pricing & Plans
Schema:      Product or Offer
Keywords:    text to speech pricing (260), text to speech app (12.1K — supporting)
OG Image:    Pricing/credits visual
Index:       YES
```

**Keyword coverage rationale:** "text to speech pricing" (260) is low volume but
these visitors have high purchase intent. Including "text to speech" naturally
in the title provides semantic relevance to the 301K head term without trying
to rank for it directly.

### Demo Page (`/demo`)

```
Title:       Text to Speech Online - Use Cases & Demo | ttsAudify  (52 chars)
Description: See how ttsAudify reads any webpage aloud for students,
             professionals, and accessibility users. AI voice reader demo.  (140 chars)
H1:          Text to Speech Online — See It in Action
Schema:      FAQPage (if FAQ-style content exists)
Keywords:    text to speech online (6.6K), ai text reader (1.9K),
             text to speech for students (90)
OG Image:    Use case illustrations or product demo screenshot
Index:       YES
```

**Keyword coverage rationale:** "text to speech online" (6.6K) is the highest-volume
keyword that naturally fits a demo/use-cases page. "ai text reader" (1.9K) should
appear in subheadings. Avoid "converter" language — the product reads text on
webpages, it does not export or convert to audio files.

### Privacy Policy (`/privacy`)

```
Title:       Privacy Policy | ttsAudify  (27 chars)
Description: Read how ttsAudify collects, uses, and protects your data.
             Your privacy matters to us.  (95 chars)
H1:          Privacy Policy
Schema:      None required
Keywords:    None — informational page, no keyword targeting needed
OG Image:    Default site OG image
Index:       YES (required for Chrome Web Store compliance)
```

### Success Page (`/success`)

```
Index:       NO — add <meta name="robots" content="noindex, nofollow" />
No SEO needed — transactional confirmation page.
```

### Email Verification Page (`/email-verification`)

```
Index:       NO — add <meta name="robots" content="noindex, nofollow" />
No SEO needed — transactional flow page.
```

---

## 16. Pages to Exclude from Indexing

These pages must have the `noindex` meta tag AND be excluded from the sitemap:

```html
<meta name="robots" content="noindex, nofollow" />
```

| Page | Reason |
|------|--------|
| `/success` | Transactional — no search value |
| `/email-verification` | Transactional — no search value |

---

## 17. Checklist

Use this checklist for every page before deploying:

### Required Meta Tags
- [ ] `<title>` — unique, 50–60 chars, keyword-first, ends with `| ttsAudify`
- [ ] `<meta name="description">` — unique, 140–160 chars, includes CTA
- [ ] `<link rel="canonical">` — self-referencing absolute URL
- [ ] `<meta name="robots">` — `index, follow` or `noindex, nofollow`

### Open Graph
- [ ] `og:title`
- [ ] `og:description`
- [ ] `og:type`
- [ ] `og:url`
- [ ] `og:image` (1200x630, absolute URL)
- [ ] `og:image:alt`
- [ ] `og:site_name`

### Twitter Cards
- [ ] `twitter:card`
- [ ] `twitter:title`
- [ ] `twitter:description`
- [ ] `twitter:image`
- [ ] `twitter:image:alt`

### Structured Data
- [ ] JSON-LD schema present (where applicable)
- [ ] Validated with Google Rich Results Test
- [ ] Schema matches visible page content

### Content
- [ ] Single `<h1>` with primary keyword
- [ ] Heading hierarchy respected (no skipped levels)
- [ ] Semantic HTML elements used (`<main>`, `<nav>`, `<section>`, etc.)
- [ ] All images have `alt` text
- [ ] All images have `width` and `height` set

### Technical
- [ ] `robots.txt` is valid and accessible
- [ ] `sitemap.xml` is valid and accessible
- [ ] Page is in sitemap (if indexable)
- [ ] No broken internal links
- [ ] Core Web Vitals passing (Lighthouse score > 90)
- [ ] `lang="en"` set on `<html>` element

### Social Preview
- [ ] Tested with Facebook Sharing Debugger
- [ ] Tested with Twitter Card Validator
- [ ] OG image renders correctly at 1200x630

---

## Additional Notes

### MPA Advantage
This app uses a multi-page architecture (separate HTML entry points per page). This is advantageous for SEO because each page serves its own complete HTML document — no client-side routing means search engines receive full content without needing to execute JavaScript for navigation.

### What This App Does NOT Need
- **SSR/Nuxt migration** — The MPA architecture with static HTML entry points already serves crawlable content per page. SSR would add unnecessary complexity.
- **hreflang tags** — Single-language (English) app. Add only if internationalization is implemented.
- **Blog/content hub** — Not in scope currently. Consider in the future for organic traffic growth.

### Monitoring
- Submit sitemap to Google Search Console
- Monitor indexing status weekly for the first month
- Track keyword rankings for primary keywords listed above
- Review Core Web Vitals report in Search Console monthly

---

*Last updated: January 2026*
