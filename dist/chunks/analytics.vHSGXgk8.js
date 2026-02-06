const s="https://analytics.logantaylorandkitties.com/script.js",c="867ccb2f-0c4a-4389-8082-8f8daa4b6ef0",i=()=>{console.log(`
  / \\__
 (    @\\___
 /         O
/   (_____/
/_____/   U

Chonk Heads | unchonk.it
We love animals, please report any bugs committing crimes.
GG's
  `)},a=()=>{if(typeof window>"u")return;i();const e=document.createElement("script");e.defer=!0,e.src=s,e.setAttribute("data-website-id",c),document.head.appendChild(e)},n=(e,t)=>{try{typeof window<"u"&&window.umami?(window.umami.track(e,t),console.log("[Analytics] Event tracked:",e,t)):console.warn("[Analytics] Umami not loaded, event not tracked:",e)}catch(_){console.error("[Analytics] Error tracking event:",_)}},o={LANDING_PAGE_VIEW:"landing_page_view",LOGIN_SUCCESS:"login_success",LOGIN_FAILED:"login_failed",LOGOUT:"logout",REGISTER_SUCCESS:"register_success",REGISTER_FAILED:"register_failed",SUBSCRIPTION_VIEW:"subscription_page_view",CREDIT_PURCHASE_INITIATED:"credit_purchase_initiated",CREDIT_PURCHASE_SUCCESS:"credit_purchase_success",CREDIT_PURCHASE_FAILED:"credit_purchase_failed",TIER_SELECTED:"tier_selected",PACKAGE_SELECTED:"package_selected",TTS_STARTED:"tts_started",TTS_COMPLETED:"tts_completed",VOICE_CHANGED:"voice_changed",SUMMARIZE_USED:"summarize_used",HIGHLIGHT_MODE_CHANGED:"highlight_mode_changed"};export{o as A,a as l,n as t};
