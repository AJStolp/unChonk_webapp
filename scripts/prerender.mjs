/**
 * Post-build SEO prerender.
 *
 * The app is a Vite multi-page SPA: every dist/pages/*.html ships an empty
 * <div id="app"></div> and Vue client-renders the H1 + body. Crawlers (and AI
 * answer engines) see an empty shell, so Ahrefs flags "H1 missing" / "low word
 * count" and the pages can't rank.
 *
 * This script serves the built dist/ with `vite preview`, opens each marketing
 * route in headless Chrome, waits for Vue to render, and writes the rendered
 * markup back into the built HTML as a SIBLING <div id="seo-prerender"> placed
 * before the (still empty) <div id="app">. The Vue entries remove
 * #seo-prerender right before they mount, so users never see duplicate content
 * and there is no hydration mismatch (mount stays non-hydrating, into #app).
 *
 * /api/* requests are blocked during the snapshot so live pricing / authed UI
 * never freezes into the static HTML — crawlers get the anonymous marketing
 * copy, real users still get live client-rendered data.
 */

import { spawn } from 'node:child_process'
import { readFile, writeFile } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const PORT = 4173

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

async function waitForServer(url, attempts = 60) {
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url)
      if (res.ok || res.status === 404) return
    } catch {
      // not up yet
    }
    await new Promise((r) => setTimeout(r, 250))
  }
  throw new Error(`vite preview did not start at ${url}`)
}

async function main() {
  const server = spawn('bunx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
    cwd: ROOT,
    stdio: 'inherit',
  })

  let browser
  try {
    await waitForServer(`http://localhost:${PORT}/`)
    browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] })

    for (const name of ROUTES) {
      const page = await browser.newPage()
      await page.setRequestInterception(true)
      page.on('request', (req) => {
        // Never let backend data (pricing, auth) enter the static snapshot.
        if (req.url().includes('/api/')) return req.abort()
        req.continue()
      })

      const url = `http://localhost:${PORT}/pages/${name}.html`
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 })
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
    server.kill()
  }
}

main().catch((err) => {
  console.error('\nPrerender failed:', err.message)
  process.exit(1)
})
