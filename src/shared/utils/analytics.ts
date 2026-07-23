/**
 * Console Easter egg. (The old umami-era trackEvent/trackPageView no-op
 * stubs and their call sites were removed 2026-07-23 — GA4 rides the
 * Google tag directly where needed.)
 */
const printEasterEgg = () => {
  console.log(`
  / \\__
 (    @\\___
 /         O
/   (_____/
/_____/   U

Chonky Heads | unchonk.it
We love animals, please report any bugs committing crimes.
GG's
  `);
};

if (typeof window !== 'undefined') {
  printEasterEgg();
}
