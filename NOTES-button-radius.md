# Notes — Button radius cohesion sweep

**Status:** ✅ **DONE — merged 2026-07-16**
**Started:** 2026-07-14
**Goal:** One consistent border-radius across every button in the app, then PR it.
**PR:** [#70](https://github.com/AJStolp/unChonk_webapp/pull/70) — merged as `4ffafec` (merge commit `2b0ad7e`)
**Branch:** `chore/button-radius-cohesion` — merged and deleted (local + remote)

---

## Key decisions

| Decision | Choice | Rationale |
|---|---|---|
| Target radius | **`rounded`** (0.25rem / 4px) | AJ's call. Sharper than the incumbent `rounded-xl`. |
| ReaderHero scope | **CTA only** | `.cta a` ("Start reading free") → 4px. Player controls stay pills. |
| Toggle switch | **Excluded** | `role="switch"` track needs a pill for the knob to read correctly. |
| Content cards | **Excluded** | Not buttons. |
| Checkbox | **Excluded** | Not a button. |

## Verified facts (checked, not assumed)

- Tailwind **4.1.18**. Bare `rounded` **is** valid in v4 → compiles to `.rounded{border-radius:.25rem}`.
  Confirmed by grepping built `dist/assets/globals.css`. (v4 renamed parts of the scale, so this was worth verifying.)
- **`tailwind.config.ts` is dead code.** `globals.css` is only `@import "tailwindcss";` — no `@config`
  directive, and v4 dropped auto-detection of JS configs. Its `borderRadius` values coincidentally match
  v4 defaults, so there's no visual impact. **Not touching it** — separate cleanup, flagged to AJ.
- `rounded-full` compiles to `3.40282e38px` in v4 (not `9999px`).

## Baseline inventory (before changes)

Buttons / CTAs by radius:

| Radius | Count | Where |
|---|---|---|
| `rounded-xl` | 48 | All marketing CTAs — landing + SEO pages, SignIn, Subscription plans |
| `rounded-lg` | 7 | Admin/utility: AdminDashboard ×3, Subscription ×3, EmailVerification ×1 |
| `rounded-full` | 1 | Subscription toggle switch — **excluded** |
| scoped CSS `999px` | 6 types | ReaderHero — only `.cta a` in scope |

Deliberately **excluded** (not buttons):
- `LandingPage.vue:202/206/210` — `rounded-2xl` `<a>` content cards
- `SubscriptionPage.vue:227` — bare `rounded` checkbox

---

## Progress

- [x] Inventory every button + radius across the app
- [x] Verify `rounded` is valid in Tailwind v4 (empirically, via dist CSS)
- [x] Confirm scope decisions with AJ
- [x] Verify each of the 55 targets is genuinely a button (not nav/card)
- [x] Apply changes — **55 elements across 17 files**
- [x] Typecheck (no new errors) + build (passes, prerender OK)
- [x] Visual + computed-style check in browser
- [x] Commit + PR (#70)
- [x] **Merged to `main`** — verified post-merge: 55 buttons at `rounded`, 3 cards + toggle intact
- [x] Branch deleted (local + remote)

## How the change was applied

A naive find-replace would have been **wrong**: `rounded-xl`/`rounded-lg` appear 102× total but only
55 are on buttons — the other 47 are cards, inputs, and alert containers that must keep their radius.

Used a tag-aware replacer (`scratchpad/apply.mjs`) that parses `<button>`/`<a>`/`<router-link>` opening
tags with proper quote handling (Vue `:class` bindings can contain `>`, which naive regex truncates),
and rewrites `rounded-xl|rounded-lg` → `rounded` only inside those tags.

## Verification results

- **55/55** buttons now report `4px` computed radius.
- Preserved as intended: 3 content cards (`rounded-2xl`), toggle switch (pill), checkbox, 47 non-button
  `rounded-lg`/`rounded-xl` on inputs/containers, all 6 ReaderHero player-control types.
- Built CSS emits `.rounded{border-radius:.25rem}`; ReaderHero CTA compiled to `border-radius:4px`.
- Browser computed-style audit on `/` and `/subscription` confirmed live values.
- Typecheck: 45 errors on branch vs 45 on main — **zero new**. (Baseline first read 44 because
  `git stash -u` hid an untracked file; see below.)

## Open questions / blockers

- None blocking.

## Flagged to AJ (not fixed — out of scope)

1. **`tailwind.config.ts` is inert.** No `@config` directive in `globals.css`, and v4 dropped JS-config
   auto-detection. Its custom `charcoal`/`success`/`warning`/`error` palettes and font stacks do nothing.
   No visual impact today (its `borderRadius` matches v4 defaults), but it's misleading. Worth its own PR.
2. **Stray untracked file** `src/vue-entries/read-aloud-chrome-extension 2.ts` — a Finder-duplicate
   artifact that fails typecheck (`loadUmamiScript` no longer exported). Not committed. Probably delete.
3. **ReaderHero focus ring** (line 393) sets `border-radius: 6px` on `:focus-visible` for all controls,
   so the CTA is 4px at rest and 6px focused. Pre-existing quirk (was 999px→6px before, a bigger jump).
   Left alone deliberately — changing it would alter the pills' focus behavior too.

## Ideas / follow-ups (open — nothing blocking)

Ranked by value. None were folded into #70 (kept surgical).

1. **Wire up or delete `tailwind.config.ts`.** Needs an `@config` directive in `globals.css`, or migrate
   to v4's CSS-first `@theme`. Today it's inert: `charcoal`/`success`/`warning`/`error` palettes and the
   Inter/JetBrains font stacks do nothing. No visual bug — its `borderRadius` matches v4 defaults, which
   is why it went unnoticed — but it actively misleads anyone reading it. **Best next PR.**
2. **Delete `src/vue-entries/read-aloud-chrome-extension 2.ts`.** Finder-duplicate artifact, untracked,
   fails typecheck (`loadUmamiScript` no longer exported from `../shared/utils/analytics`).
3. **Input radius sweep.** Buttons are now 4px but inputs are still `rounded-lg` (8px), so
   button-next-to-input pairs on AdminDashboard + EmailVerification no longer agree. If "cohesive"
   extends to form controls, inputs are the natural follow-on. **AJ's call — not obviously wanted.**
4. **Pre-existing typecheck debt:** 45 errors on `main`, mostly missing `chrome` globals in
   `RuntimeDetection.ts` (needs `@types/chrome`).

## Post-merge verification (2026-07-16)

Pulled `main` @ `2b0ad7e` and re-ran the inventory scan:

```
### rounded      (55)   ← all buttons
### rounded-2xl   (3)   ← content cards, correctly untouched
### rounded-full  (1)   ← toggle switch, correctly untouched
```

Matches the pre-merge state exactly. Nothing regressed in review.

## Reusable artifacts

Scratchpad scripts (session-tmp — recreate from this doc if needed):
- `scan.mjs` — inventories every `<button>`/`<a>`/`<router-link>` by radius. Useful for re-auditing.
- `apply.mjs` — tag-aware class replacer with quote handling. **The reusable idea:** parse tags and
  rewrite only inside opening tags; never global find-replace on Tailwind classes, since the same class
  means different things on a button vs a card vs an input.

## This file

Left **untracked** on purpose so it stayed out of the PR diff. It persists on disk as the memory anchor.
Commit it, move it, or delete it — AJ's call.
