/**
 * GSC health monitor for unchonk.com (Search Console API via service account).
 *
 * Prints current organic-search health: properties, Performance (3mo + 28d),
 * sitemap submission status, and per-URL index/coverage status. Designed to be
 * run on a schedule (monthly) and the output compared against the baseline
 * recorded when it was first run (see memory: project_gsc_monitoring).
 *
 * Manual Actions and "Request Indexing" have NO API (Google keeps them UI-only),
 * so those stay manual checks in the GSC web UI.
 *
 * Auth: a service account (id-gsc-monitor@unchonk.iam.gserviceaccount.com) added
 * as a Full user on the sc-domain:unchonk.com property. The JSON key is local and
 * gitignored — never commit it.
 *
 *   Key path: $GSC_KEY_FILE, else ./unchonk-f2354c17936e.json (repo root)
 *   Run:      node scripts/gsc-audit.mjs
 */
import { google } from 'googleapis'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(__dirname, '..')
const KEY = process.env.GSC_KEY_FILE || resolve(REPO_ROOT, 'unchonk-f2354c17936e.json')

// Pages we care about. New landing pages (read-pdf-aloud, read-your-writing-aloud,
// read-aloud-chrome-extension) join this list once PR #62 is deployed.
const PAGES = [
  'https://www.unchonk.com/',
  'https://www.unchonk.com/subscription',
  'https://www.unchonk.com/speechify-alternative',
  'https://www.unchonk.com/unchonk-vs-speechify',
  'https://www.unchonk.com/text-to-speech-no-subscription',
  'https://www.unchonk.com/text-to-speech-for-students',
  'https://www.unchonk.com/text-to-speech-for-dyslexia',
  'https://www.unchonk.com/demo',
  'https://www.unchonk.com/roadmap',
  'https://www.unchonk.com/privacy',
]

const fmt = (d) => d.toISOString().slice(0, 10)
const daysAgo = (n) => { const d = new Date(); d.setDate(d.getDate() - n); return d }

async function main() {
  const auth = new google.auth.GoogleAuth({
    keyFile: KEY,
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  })
  const wm = google.webmasters({ version: 'v3', auth })
  const sc = google.searchconsole({ version: 'v1', auth })

  console.log(`# GSC health — ${fmt(new Date())}\n`)

  // 1. Properties
  const sites = (await wm.sites.list()).data.siteEntry || []
  const unchonk = sites.filter((s) => /unchonk/i.test(s.siteUrl))
  const site =
    unchonk.find((s) => s.siteUrl.startsWith('sc-domain:'))?.siteUrl ||
    unchonk.find((s) => /www\.unchonk\.com/.test(s.siteUrl))?.siteUrl ||
    unchonk[0]?.siteUrl
  if (!site) { console.log('No unchonk property visible to this service account.'); return }
  console.log(`Property: ${site}\n`)

  // 2. Performance
  for (const [label, start] of [['3 MONTHS', daysAgo(90)], ['28 DAYS', daysAgo(28)]]) {
    const range = { startDate: fmt(start), endDate: fmt(daysAgo(2)) }
    try {
      const t = (await wm.searchanalytics.query({ siteUrl: site, requestBody: { ...range } })).data.rows?.[0]
      console.log(`## Performance ${label} (${range.startDate} → ${range.endDate})`)
      console.log(t
        ? `  clicks=${t.clicks}  impressions=${t.impressions}  ctr=${(t.ctr * 100).toFixed(2)}%  avgPos=${t.position.toFixed(1)}`
        : '  (no data)')
      const q = (await wm.searchanalytics.query({ siteUrl: site, requestBody: { ...range, dimensions: ['query'], rowLimit: 20 } })).data.rows || []
      console.log(`  top queries: ${q.length ? '' : '(none — below GSC privacy threshold)'}`)
      for (const r of q) console.log(`    "${r.keys[0]}"  impr=${r.impressions} clicks=${r.clicks} pos=${r.position.toFixed(1)}`)
      const p = (await wm.searchanalytics.query({ siteUrl: site, requestBody: { ...range, dimensions: ['page'], rowLimit: 20 } })).data.rows || []
      console.log(`  top pages:`)
      for (const r of p) console.log(`    ${r.keys[0]}  impr=${r.impressions} clicks=${r.clicks} pos=${r.position.toFixed(1)}`)
      console.log('')
    } catch (e) { console.log(`  ${label} error: ${e.message}\n`) }
  }

  // 3. Sitemaps
  console.log('## Sitemaps')
  try {
    const sm = (await wm.sitemaps.list({ siteUrl: site })).data.sitemap || []
    if (!sm.length) console.log('  ⚠️  NO sitemap submitted')
    for (const s of sm) {
      console.log(`  ${s.path}  submitted=${(s.lastSubmitted || '').slice(0, 10)} downloaded=${(s.lastDownloaded || 'NEVER').slice(0, 10)} pending=${s.isPending} errors=${s.errors || 0} warnings=${s.warnings || 0}`)
      for (const c of s.contents || []) console.log(`    ${c.type}: submitted=${c.submitted} indexed=${c.indexed}`)
    }
  } catch (e) { console.log(`  error: ${e.message}`) }
  console.log('')

  // 4. Index status (URL Inspection — quota-limited, a handful is fine)
  console.log('## Index status')
  let indexed = 0, notIndexed = 0
  for (const url of PAGES) {
    try {
      const idx = (await sc.urlInspection.index.inspect({ requestBody: { inspectionUrl: url, siteUrl: site } }))
        .data.inspectionResult?.indexStatusResult || {}
      const ok = idx.verdict === 'PASS'
      ok ? indexed++ : notIndexed++
      console.log(`  ${ok ? '✅' : '❌'} ${url.replace('https://www.unchonk.com', '') || '/'}  ${idx.coverageState || '?'}`)
    } catch (e) { console.log(`  ?  ${url}  inspect error: ${e.message}`) }
  }
  console.log(`\nSummary: ${indexed} indexed / ${notIndexed} not indexed of ${PAGES.length} checked.`)
  console.log('Reminder: check Manual Actions in the GSC UI (no API).')
}

main().catch((e) => { console.error('FATAL:', e.message); process.exit(1) })
