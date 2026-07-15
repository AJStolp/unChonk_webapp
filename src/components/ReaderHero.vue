<template>
  <section class="reader-hero">
    <div class="inner">
      <div class="col-text">
      <div class="eyebrow"><span class="dot"></span> Live demo · real voice</div>
      <h1>Text to speech that highlights every word.</h1>
      <p class="sub">
        Highlight any passage on a page and unChonk reads just that part aloud,
        lighting up each word as it speaks so your eyes and ears stay together.
      </p>

      <div class="langbar">
        <span class="langbar-label">Read it in your language</span>
        <div class="seg lang" role="group" aria-label="Language">
          <button type="button" :aria-pressed="lang === 'en'" @click="setLang('en')">English</button>
          <button type="button" :aria-pressed="lang === 'es'" @click="setLang('es')">Español</button>
        </div>
      </div>

      <div class="cta">
        <a href="/subscription">Start reading free</a>
        <span class="note">No subscription. Pay only for what you read.</span>
      </div>
      </div><!-- /col-text -->

      <div class="col-demo">
      <div class="card">
        <div class="toolbar">
          <button class="play" type="button" :aria-label="playing ? 'Pause' : 'Play'" @click="toggle">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path v-if="!playing" d="M8 5v14l11-7z" />
              <path v-else d="M7 5h4v14H7zM13 5h4v14h-4z" />
            </svg>
            <span>{{ playLabel }}</span>
          </button>
          <button class="iconbtn" type="button" aria-label="Restart" @click="restart">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v4h4" />
            </svg>
          </button>

          <div class="spacer"></div>

          <div class="seg" role="group" aria-label="Playback speed">
            <button v-for="r in speeds" :key="r" type="button" :aria-pressed="rate === r" @click="setRate(r)">{{ r }}×</button>
          </div>

          <div class="seg" role="group" aria-label="Highlight mode">
            <button type="button" :aria-pressed="!sentenceMode" @click="setMode(false)">Word</button>
            <button type="button" :aria-pressed="sentenceMode" @click="setMode(true)">Sentence</button>
          </div>

          <div class="swatches" role="group" aria-label="Highlight color">
            <button
              v-for="s in swatches"
              :key="s.name"
              class="swatch"
              type="button"
              :style="{ background: s.css }"
              :aria-pressed="colorName === s.name"
              :aria-label="s.name + ' highlight'"
              @click="setColor(s)"
            ></button>
          </div>
        </div>

        <p ref="readingEl" class="reading">{{ text }}</p>

        <div ref="trackEl" class="track" @click="scrub">
          <div class="fill" :style="{ width: progress + '%' }"></div>
        </div>
        <div class="cardfoot">
          <span>{{ footnote }}</span>
          <span class="time">{{ tCur }} / {{ tTot }}</span>
        </div>
      </div>
      </div><!-- /col-demo -->
    </div>

    <audio ref="audioEl" preload="auto"></audio>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Mark { time: number; type: 'word' | 'sentence'; start: number; end: number; value: string }

const readingEl = ref<HTMLElement | null>(null)
const trackEl = ref<HTMLElement | null>(null)
const audioEl = ref<HTMLAudioElement | null>(null)

const text = ref('')
const playing = ref(false)
const progress = ref(0)
const tCur = ref('0:00')
const tTot = ref('0:00')
const rate = ref(1)
const sentenceMode = ref(false)
const colorName = ref('green')
const lang = ref<'en' | 'es'>('en')

const TRACKS: Record<'en' | 'es', { audio: string; marks: string }> = {
  en: { audio: '/demo/demo-en-audio.mp3', marks: '/demo/demo-en-marks.json' },
  es: { audio: '/demo/demo-es-audio.mp3', marks: '/demo/demo-es-marks.json' },
}

const speeds = [0.85, 1, 1.25]
const swatches = [
  { name: 'green', css: '#4aaf6e', word: 'rgba(74,175,110,0.55)', sentence: 'rgba(74,175,110,0.20)' },
  { name: 'amber', css: '#f5b43c', word: 'rgba(245,180,60,0.60)', sentence: 'rgba(245,180,60,0.22)' },
  { name: 'pink', css: '#f078a0', word: 'rgba(240,120,160,0.55)', sentence: 'rgba(240,120,160,0.20)' },
  { name: 'blue', css: '#4696eb', word: 'rgba(70,150,235,0.50)', sentence: 'rgba(70,150,235,0.20)' },
]
let wordColor = swatches[0].word
let sentenceColor = swatches[0].sentence

const playLabel = computed(() => (playing.value ? 'Pause' : (progress.value >= 100 ? 'Replay' : (progress.value > 0 ? 'Resume' : 'Play'))))
const footnote = computed(() => `Reading aloud with ${sentenceMode.value ? 'sentence' : 'word'} highlighting`)

// Marks
let words: Mark[] = []
let sentences: Mark[] = []
let wordSentence: number[] = []   // sentence index per word
let raf = 0
let curWord = -1
let curSent = -1
let dirty = false

// Rendering mode: 'paint' (Houdini) | 'highlight' (CSS Custom Highlight API) | 'none'
let renderMode: 'paint' | 'highlight' | 'none' = 'none'
let wordHL: any = null
let sentHL: any = null

function fmt(sec: number): string {
  sec = Math.max(0, Math.floor(sec || 0))
  return Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0')
}

function sentenceForWord(start: number): number {
  for (let i = 0; i < sentences.length; i++) {
    if (start >= sentences[i].start && start < sentences[i].end) return i
  }
  return -1
}

function activeWordIndex(t: number): number {
  const ms = t * 1000
  let idx = -1
  for (let i = 0; i < words.length; i++) { if (words[i].time <= ms) idx = i; else break }
  return idx
}

function rangeFor(mark: Mark): Range | null {
  const el = readingEl.value
  const node = el && el.firstChild
  if (!node) return null
  const len = (node.textContent || '').length
  if (mark.start < 0 || mark.end > len) return null
  const r = document.createRange()
  try { r.setStart(node, mark.start); r.setEnd(node, mark.end); return r } catch { return null }
}

function relativeRects(range: Range): string | null {
  const el = readingEl.value
  if (!el) return null
  const c = el.getBoundingClientRect()
  const rects = Array.from(range.getClientRects()).filter(r => r.width > 0 && r.height > 0)
  if (!rects.length) return null
  return rects.map(r => `${r.left - c.left} ${r.top - c.top} ${r.width} ${r.height}`).join(',')
}

function paint(wi: number, si: number) {
  const el = readingEl.value
  if (!el) return

  if (renderMode === 'highlight') {
    wordHL.clear(); sentHL.clear()
    if (wi >= 0) { const r = rangeFor(words[wi]); if (r) wordHL.add(r) }
    if (sentenceMode.value && si >= 0) { const r = rangeFor(sentences[si]); if (r) sentHL.add(r) }
    el.style.setProperty('--w-color', wordColor)
    el.style.setProperty('--s-color', sentenceColor)
    return
  }
  if (renderMode !== 'paint') return

  el.style.backgroundImage = 'paint(tts-highlight)'
  el.style.backgroundSize = '100% 100%'
  el.style.setProperty('--tts-padding-x', '4')
  el.style.setProperty('--tts-padding-y', '3')
  el.style.setProperty('--tts-border-radius', '5')

  // word layer
  if (wi >= 0) {
    const r = rangeFor(words[wi])
    const rects = r && relativeRects(r)
    if (rects) {
      el.style.setProperty('--tts-word-rects', rects)
      el.style.setProperty('--tts-word-active', 'true')
      el.style.setProperty('--tts-word-color', wordColor)
    } else {
      el.style.setProperty('--tts-word-active', 'false')
    }
  } else {
    el.style.setProperty('--tts-word-active', 'false')
    el.style.removeProperty('--tts-word-rects')
  }

  // sentence layer
  if (sentenceMode.value && si >= 0) {
    const r = rangeFor(sentences[si])
    const rects = r && relativeRects(r)
    if (rects) {
      el.style.setProperty('--tts-sentence-rects', rects)
      el.style.setProperty('--tts-sentence-active', 'true')
      el.style.setProperty('--tts-sentence-color', sentenceColor)
    } else {
      el.style.setProperty('--tts-sentence-active', 'false')
    }
  } else {
    el.style.setProperty('--tts-sentence-active', 'false')
    el.style.removeProperty('--tts-sentence-rects')
  }
}

function frame() {
  const a = audioEl.value
  if (!a) return
  const t = a.currentTime
  const wi = activeWordIndex(t)
  const si = wi >= 0 ? wordSentence[wi] : -1
  if (wi !== curWord || si !== curSent || dirty) { paint(wi, si); curWord = wi; curSent = si; dirty = false }
  progress.value = a.duration ? Math.min(100, (t / a.duration) * 100) : 0
  tCur.value = fmt(t)
  if (!a.paused && !a.ended) raf = requestAnimationFrame(frame)
}

function toggle() {
  const a = audioEl.value; if (!a) return
  if (a.paused) { if (a.ended || progress.value >= 100) a.currentTime = 0; a.play() } else a.pause()
}
function restart() {
  const a = audioEl.value; if (!a) return
  const wasPlaying = !a.paused
  a.currentTime = 0; curWord = -1; curSent = -1; paint(-1, -1)
  progress.value = 0; tCur.value = '0:00'
  if (wasPlaying) a.play()
}
function setRate(r: number) {
  rate.value = r
  const a = audioEl.value; if (!a) return
  a.playbackRate = r
  if ('preservesPitch' in a) (a as any).preservesPitch = true
}
function setMode(sentence: boolean) { sentenceMode.value = sentence; dirty = true }
function setColor(s: typeof swatches[number]) { colorName.value = s.name; wordColor = s.word; sentenceColor = s.sentence; dirty = true }
function scrub(e: MouseEvent) {
  const a = audioEl.value, tr = trackEl.value
  if (!a || !tr || !a.duration) return
  const rect = tr.getBoundingClientRect()
  const p = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width))
  a.currentTime = p * a.duration; curWord = -1; frame()
}

// Load a language track: its cached marks + audio (all one Ava multilingual voice).
async function loadTrack(l: 'en' | 'es') {
  try {
    const res = await fetch(TRACKS[l].marks)
    const data = await res.json()
    text.value = data.text
    const marks: Mark[] = data.marks
    words = marks.filter(m => m.type === 'word').sort((a, b) => a.time - b.time)
    sentences = marks.filter(m => m.type === 'sentence').sort((a, b) => a.time - b.time)
    wordSentence = words.map(w => sentenceForWord(w.start))
  } catch { text.value = ''; words = []; sentences = []; wordSentence = [] }
  curWord = -1; curSent = -1; progress.value = 0; tCur.value = '0:00'
  const a = audioEl.value
  if (a) { a.src = TRACKS[l].audio; a.load(); a.playbackRate = rate.value }
  paint(-1, -1)
}

function setLang(l: 'en' | 'es') {
  if (l === lang.value) return
  lang.value = l
  const a = audioEl.value
  const wasPlaying = !!a && !a.paused
  if (a) a.pause()
  loadTrack(l).then(() => { if (wasPlaying) audioEl.value?.play() })
}

onMounted(async () => {
  // Pick renderer: real Paint API worklet -> CSS Custom Highlight API -> none.
  const css: any = window.CSS
  if (css && 'paintWorklet' in css) {
    try { await css.paintWorklet.addModule('/tts-highlight.js'); renderMode = 'paint' } catch { renderMode = 'none' }
  }
  if (renderMode === 'none' && typeof (window as any).Highlight === 'function' && css?.highlights) {
    wordHL = new (window as any).Highlight(); sentHL = new (window as any).Highlight()
    css.highlights.set('tts-sentence', sentHL); css.highlights.set('tts-word', wordHL)
    renderMode = 'highlight'
  }

  const a = audioEl.value
  if (a) {
    a.addEventListener('loadedmetadata', () => { tTot.value = fmt(a.duration) })
    a.addEventListener('play', () => { playing.value = true; cancelAnimationFrame(raf); raf = requestAnimationFrame(frame) })
    a.addEventListener('pause', () => { playing.value = false; cancelAnimationFrame(raf); frame() })
    a.addEventListener('ended', () => { playing.value = false; cancelAnimationFrame(raf); progress.value = 100; tCur.value = fmt(a.duration) })
  }

  // Load the default track (also sets audio src + first paragraph text).
  await loadTrack(lang.value)
})

onUnmounted(() => { cancelAnimationFrame(raf); const a = audioEl.value; if (a) a.pause() })
</script>

<style scoped>
.reader-hero {
  position: relative;
  background:
    radial-gradient(900px 460px at 82% 0%, rgba(45,90,63,.07), transparent 60%),
    linear-gradient(180deg, #ffffff 0%, #f4f7f4 100%);
  color: #14231b;
  padding: clamp(32px, 5vw, 64px) 20px clamp(40px, 6vw, 72px);
}
.inner {
  max-width: 1180px; margin: 0 auto;
  display: grid; grid-template-columns: minmax(0, 0.82fr) minmax(0, 1.18fr);
  gap: clamp(28px, 4vw, 60px); align-items: center;
}
.col-text { min-width: 0; }
.col-demo { min-width: 0; }
@media (max-width: 880px) {
  .inner { grid-template-columns: 1fr; gap: 28px; }
}

.eyebrow { display: inline-flex; align-items: center; gap: 8px; font-size: .72rem; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; color: #2d5a3f; margin-bottom: 16px; }
.eyebrow .dot { width: 7px; height: 7px; border-radius: 50%; background: #2d5a3f; }
@media (prefers-reduced-motion: no-preference) { .eyebrow .dot { animation: ping 2s ease-out infinite; } }
@keyframes ping { 0% { box-shadow: 0 0 0 0 rgba(45,90,63,.45); } 70%,100% { box-shadow: 0 0 0 9px transparent; } }

h1 { font-size: clamp(1.9rem, 3.4vw, 2.9rem); line-height: 1.06; letter-spacing: -.025em; font-weight: 700; margin: 0 0 14px; text-wrap: balance; max-width: 18ch; color: #14231b; }
.sub { font-size: clamp(1rem, 1.6vw, 1.12rem); color: #4f5b52; margin: 0 0 clamp(18px, 3vw, 26px); max-width: 44ch; line-height: 1.55; }

.langbar { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin: 0 0 clamp(20px, 3vw, 28px); }
.langbar-label { font-size: .7rem; text-transform: uppercase; letter-spacing: .12em; color: #2d5a3f; font-weight: 600; }
.seg.lang { background: #e7ece7; }
.seg.lang button { color: #4f5b52; }
.seg.lang button[aria-pressed="true"] { background: #2d5a3f; color: #fff; box-shadow: none; }

.card { background: #ffffff; border: 1px solid #e2e9e2; border-radius: 18px; box-shadow: 0 1px 2px rgba(20,40,28,.04), 0 22px 44px -26px rgba(20,40,28,.30); overflow: hidden; }
.toolbar { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; padding: 13px 15px; border-bottom: 1px solid #eef1ec; background: #f6f8f5; }

.play { display: inline-flex; align-items: center; gap: 9px; font: inherit; font-weight: 600; font-size: .95rem; color: #fff; background: #2d5a3f; border: none; padding: 9px 18px 9px 15px; border-radius: 999px; cursor: pointer; transition: background .15s; min-width: 112px; }
.play:hover { background: #1e4530; }
.play svg { width: 16px; height: 16px; }
.iconbtn { display: inline-flex; align-items: center; justify-content: center; width: 38px; height: 38px; border-radius: 999px; background: transparent; border: 1px solid #dde3dd; color: #40483f; cursor: pointer; transition: border-color .15s, color .15s; }
.iconbtn:hover { border-color: #2d5a3f; color: #2d5a3f; }
.iconbtn svg { width: 16px; height: 16px; }
.spacer { flex: 1 1 auto; }
.ctrl-label { font-size: .68rem; text-transform: uppercase; letter-spacing: .1em; color: #8a968c; }

.seg { display: inline-flex; background: #eef1ec; border-radius: 999px; padding: 3px; gap: 2px; }
.seg button { font: inherit; font-size: .82rem; font-weight: 500; color: #566159; background: transparent; border: none; padding: 5px 12px; border-radius: 999px; cursor: pointer; transition: color .15s, background .15s; }
.seg button[aria-pressed="true"] { background: #fff; color: #1c2a22; box-shadow: 0 1px 2px rgba(0,0,0,.12); }

.swatches { display: inline-flex; gap: 7px; align-items: center; }
.swatch { width: 24px; height: 24px; border-radius: 50%; cursor: pointer; padding: 0; border: 2px solid transparent; box-shadow: inset 0 0 0 1px rgba(0,0,0,.12); transition: transform .1s, border-color .15s; }
.swatch:hover { transform: scale(1.12); }
.swatch[aria-pressed="true"] { border-color: #1c2a22; }

.reading {
  font-family: "Iowan Old Style", "Palatino Linotype", "Charter", Georgia, Cambria, serif;
  font-size: clamp(1.1rem, 1.5vw, 1.34rem); line-height: 1.72; color: #1c2a22;
  padding: clamp(22px, 3vw, 34px) clamp(22px, 3vw, 38px) clamp(16px, 2vw, 26px);
  letter-spacing: .003em; margin: 0;
}
/* CSS Custom Highlight API fallback styling (non-Chromium) */
::highlight(tts-sentence) { background-color: var(--s-color, rgba(74,175,110,.2)); }
::highlight(tts-word) { background-color: var(--w-color, rgba(74,175,110,.55)); }

.track { position: relative; height: 4px; background: #eceee9; cursor: pointer; }
.fill { position: absolute; left: 0; top: 0; bottom: 0; width: 0%; background: linear-gradient(90deg, #2d5a3f, #4aaf6e); }
.cardfoot { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 11px 16px; font-size: .8rem; color: #6a746a; }
.time { font-variant-numeric: tabular-nums; letter-spacing: .02em; }

.cta { display: flex; align-items: center; justify-content: flex-start; gap: 16px; flex-wrap: wrap; margin-top: 4px; }
.cta a { display: inline-flex; align-items: center; text-decoration: none; font-weight: 600; color: #fff; background: #2d5a3f; padding: 12px 24px; border-radius: 999px; transition: background .15s; }
.cta a:hover { background: #1e4530; }
.cta .note { color: #566159; font-size: .88rem; }

.reading:focus-visible, .play:focus-visible, .iconbtn:focus-visible, .seg button:focus-visible, .swatch:focus-visible, .track:focus-visible, .cta a:focus-visible { outline: 2px solid #2d5a3f; outline-offset: 2px; border-radius: 6px; }
</style>
