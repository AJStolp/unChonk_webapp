# unChonk - Next Release Updates

**Created:** January 19, 2026
**Target:** v2 (after Chrome Web Store approval)

---

## Priority: Switch to activeTab Permission

### Why
- Current manifest uses broad host permissions (`<all_urls>` or `*://*/*`)
- Chrome Web Store flagged this for "in-depth review" (slower approval)
- `activeTab` is more privacy-friendly and gets faster reviews

### What activeTab Does
- Only grants page access when user **explicitly clicks** the extension icon
- Perfect for TTS since users manually trigger text-to-speech anyway
- No loss of functionality

### How to Update

**In the extension's `manifest.json`:**

```json
// BEFORE (broad permissions)
{
  "permissions": ["storage"],
  "host_permissions": ["<all_urls>"]
}

// AFTER (activeTab)
{
  "permissions": ["activeTab", "storage"]
}
```

Remove `host_permissions` entirely and add `activeTab` to `permissions`.

### Testing Checklist
- [ ] Extension still reads page content when user clicks icon
- [ ] TTS playback works on various sites (news, docs, blogs)
- [ ] No permission prompts appear unexpectedly
- [ ] Works on sites with strict CSP headers

### Benefits After Update
- Faster Chrome Web Store reviews
- Better user trust (less scary permission prompt)
- Aligns with privacy policy ("processes in real-time when you choose")

---

## Other Potential Updates

### Add Privacy Page Link to Footer
Currently the privacy page exists at `/pages/privacy.html` but isn't linked from other pages.

**Files to update:**
- `src/components/ComingSoonPage.vue`
- `src/components/SubscriptionPage.vue`
- `src/components/SuccessPage.vue`
- `src/components/LandingPage.vue`

Add to footer:
```html
<a href="/pages/privacy.html" class="text-gray-500 hover:text-gray-700">Privacy Policy</a>
```

---

## Notes
- v1 submitted to Chrome Web Store on Jan 19, 2026
- Review may take longer due to broad permissions flag
- Apply activeTab change immediately after v1 approval
