// Vercel Edge function — server-side validation for the Google Ads
// conversion relay used by the unChonk Chrome extension.
//
// MV3 forbids gtag.js inside extension contexts, so the extension fires
// Enhanced Conversions by loading this URL inside a hidden 1x1 iframe.
// The relay runs gtag.js on the unchonk.com origin where it's permitted.
//
// Because the URL is publicly fetchable, every fetch with the right label
// would mint a conversion if the relay weren't gated. This handler
// rejects every request that isn't an iframe load with an allowlisted
// label — neutralizes the phantom-Purchase risk surface.
//
// Allowlist is INTENTIONALLY tight (SIGN_UP only). Update when extension
// starts firing enhanced conversions for another label.

export const config = {
  runtime: 'edge',
};

const GOOGLE_ADS_CONVERSION_ID = 'AW-17950589439';

const ALLOWED_LABELS = new Set<string>([
  'q9CCCI7iqoEcEP-Dwe9C', // SIGN_UP
]);

const HASH_RX = /^[a-f0-9]{64}$/;
const CURRENCY_RX = /^[A-Z]{3}$/;
const TXN_RX = /^[A-Za-z0-9_-]{1,128}$/;

function notFound(): Response {
  return new Response(null, { status: 404 });
}

export default function handler(request: Request): Response {
  if (request.method !== 'GET') return notFound();

  // Browser-set, omitted by bots/crawlers, never present on top-level
  // navigation. The single load-bearing crawler defense.
  if (request.headers.get('sec-fetch-dest') !== 'iframe') return notFound();

  const url = new URL(request.url);
  const label = url.searchParams.get('label');
  if (!label || !ALLOWED_LABELS.has(label)) return notFound();

  const hashRaw = url.searchParams.get('hash');
  const valueRaw = url.searchParams.get('value');
  const currencyRaw = url.searchParams.get('currency');
  const txnRaw = url.searchParams.get('transaction_id');

  const hash = hashRaw && HASH_RX.test(hashRaw) ? hashRaw : null;
  const valueNum = valueRaw !== null ? parseFloat(valueRaw) : NaN;
  const value = Number.isFinite(valueNum) && valueNum >= 0 ? valueNum : null;
  const currency = currencyRaw && CURRENCY_RX.test(currencyRaw) ? currencyRaw : null;
  const transactionId = txnRaw && TXN_RX.test(txnRaw) ? txnRaw : null;

  const payload = {
    sendTo: `${GOOGLE_ADS_CONVERSION_ID}/${label}`,
    hash,
    value,
    currency,
    transactionId,
  };

  // Defense against </script> injection — every field is already validated
  // by regex above, but escape < anyway so a future field addition can't
  // break out of the inline <script> block.
  const payloadJson = JSON.stringify(payload).replace(/</g, '\\u003c');

  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="robots" content="noindex, nofollow" />
    <title>unChonk</title>
    <script async src="https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_CONVERSION_ID}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GOOGLE_ADS_CONVERSION_ID}');
      (function() {
        var p = ${payloadJson};
        if (p.hash) gtag('set', 'user_data', { sha256_email_address: p.hash });
        var params = { send_to: p.sendTo };
        if (p.value !== null) params.value = p.value;
        if (p.currency) params.currency = p.currency;
        if (p.transactionId) params.transaction_id = p.transactionId;
        gtag('event', 'conversion', params);
      })();
    </script>
  </head>
  <body></body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store',
      'x-robots-tag': 'noindex, nofollow',
    },
  });
}
