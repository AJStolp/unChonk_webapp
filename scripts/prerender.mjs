/**
 * Post-build SEO prerender.
 *
 * The app is a Vite multi-page SPA: every dist/pages/*.html ships an empty
 * <div id="app"></div> and Vue client-renders the H1 + body. Crawlers (and AI
 * answer engines) see an empty shell, so Ahrefs flags "H1 missing" / "low word
 * count" and the pages can't rank.
 *
 * This script serves the built dist/ with Vite's preview server, opens each
 * marketing route in headless Chrome, waits for Vue to render, and writes the
 * rendered markup back into the built HTML as a SIBLING <div id="seo-prerender">
 * placed before the (still empty) <div id="app">. The Vue entries remove
 * #seo-prerender right before they mount, so users never see duplicate content
 * and there is no hydration mismatch (mount stays non-hydrating, into #app).
 *
 * /api/* requests are blocked during the snapshot so live pricing / authed UI
 * never freezes into the static HTML — crawlers get the anonymous marketing
 * copy, real users still get live client-rendered data.
 *
 * Browser: locally we use full `puppeteer` (its bundled Chrome). On Vercel/CI
 * the build image lacks Chromium's system libraries (libnspr4.so, ...), so we
 * use `puppeteer-core` + `@sparticuz/chromium`, which bundles them.
 */

import { readFile, writeFile } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { preview } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const PORT = 4173
const isServerless = !!process.env.VERCEL || !!process.env.CI

// Marketing pages only. Auth-gated / live-data / noindex pages (status, report,
// sign-in, success, email-verification, admin) are intentionally excluded and
// keep shipping as empty shells.
const ROUTES = [
  'index',
  'demo',
  'subscription',
  'privacy',
  'roadmap',
  'text-to-speech-no-subscription',
  'speechify-alternative',
  'unchonk-vs-speechify',
  'text-to-speech-for-dyslexia',
  'text-to-speech-for-students',
]

const distFile = (name) => resolve(ROOT, 'dist', 'pages', `${name}.html`)

async function launchBrowser() {
  if (isServerless) {
    const chromium = (await import('@sparticuz/chromium')).default
    const puppeteer = (await import('puppeteer-core')).default
    return puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    })
  }
  const puppeteer = (await import('puppeteer')).default
  return puppeteer.launch({ headless: true, args: ['--no-sandbox'] })
}

async function main() {
  // Vite's preview server (JS API) — open:false avoids the CLI's xdg-open call,
  // which throws on headless build machines.
  const server = await preview({ preview: { port: PORT, strictPort: true, open: false } })
  const origin = server.resolvedUrls?.local?.[0]?.replace(/\/$/, '') || `http://localhost:${PORT}`

  let browser
  try {
    browser = await launchBrowser()

    for (const name of ROUTES) {
      const page = await browser.newPage()
      await page.setRequestInterception(true)
      page.on('request', (req) => {
        const reqUrl = req.url()
        // Snapshot only the app's own content. Block backend data (pricing,
        // auth) AND every third-party request (Ahrefs / gtag / umami analytics):
        // their long-lived connections kept networkidle from settling and timed
        // out the Vercel build. Same-origin assets + data: URIs still load.
        if (reqUrl.includes('/api/')) return req.abort()
        if (!reqUrl.startsWith(origin) && !reqUrl.startsWith('data:')) return req.abort()
        req.continue()
      })

      // domcontentloaded, NOT networkidle0 — prerender must not depend on the
      // network going quiet (external analytics never settle on the build host).
      // waitForSelector('#app h1') below is the real "Vue has rendered" gate.
      await page.goto(`${origin}/pages/${name}.html`, { waitUntil: 'domcontentloaded', timeout: 30000 })
      // Capture only after Vue has rendered real content (not the empty shell).
      await page.waitForSelector('#app h1', { timeout: 15000 })

      const appHTML = await page.$eval('#app', (el) => el.innerHTML)
      await page.close()

      const shellPath = distFile(name)
      const shell = await readFile(shellPath, 'utf8')
      if (!shell.includes('<div id="app"></div>')) {
        throw new Error(`${name}.html has no <div id="app"></div> to inject into`)
      }
      const seoBlock = `<div id="seo-prerender">${appHTML}</div>\n    <div id="app"></div>`
      await writeFile(shellPath, shell.replace('<div id="app"></div>', seoBlock), 'utf8')
      console.log(`prerendered /${name === 'index' ? '' : name}`)
    }
  } finally {
    if (browser) await browser.close()
    await new Promise((res) => server.httpServer.close(res))
  }
}

main().catch((err) => {
  console.error('\nPrerender failed:', err.message)
  process.exit(1)
})
