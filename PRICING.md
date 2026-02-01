# unChonk Pricing & Cost Analysis

**Last Updated:** January 2026
**Version:** 1.0

---

## Current Pricing Structure

### Credit System
| Metric | Value |
|--------|-------|
| 1 Credit | 1,000 characters |
| Rate | $0.012 per credit |
| Effective Rate | **$12.00 per 1 million characters** |

### Predefined Packages

| Package | Credits | Characters | Price | Tier |
|---------|---------|------------|-------|------|
| Starter | 500 | 500,000 | $6.00 | Light |
| Light | 1,000 | 1,000,000 | $12.00 | Light |
| Regular | 2,000 | 2,000,000 | $24.00 | Premium |
| Popular | 5,000 | 5,000,000 | $60.00 | Premium |
| Pro | 10,000 | 10,000,000 | $120.00 | Pro |
| Heavy | 25,000 | 25,000,000 | $300.00 | Pro |
| Enterprise | 50,000 | 50,000,000 | $600.00 | Pro |

### Tier Thresholds
- **Light Tier:** 500 - 1,999 credits
- **Premium Tier:** 2,000 - 9,999 credits
- **Pro Tier:** 10,000+ credits

*Note: Currently all tiers use the same rate ($0.01/credit). Tiers are for feature differentiation, not volume discounts.*

---

## Infrastructure Costs

### Fixed Monthly Costs

| Service | Plan | Monthly Cost | Notes |
|---------|------|--------------|-------|
| AWS EC2 | t3.medium | ~$30.37 | 2 vCPUs, 4GB RAM, us-east-1 |
| Supabase | Pro | $25.00 | Database & Auth |
| Vercel | Hobby | $0.00 | Frontend hosting (free tier) |
| **Total Fixed** | | **~$55.37/month** | |

### Variable Costs (AWS Polly)

| Voice Type | Cost per 1M Characters | Notes |
|------------|------------------------|-------|
| **Standard** | $4.80 | Currently using |
| Neural | $19.20 | 4x more expensive |
| Long-Form | $100.00 | Premium quality |

**Free Tier:** 5 million characters/month for Standard voices (new accounts)

---

## Margin Analysis

### Per-Character Margin

| Metric | Amount |
|--------|--------|
| Revenue per 1M chars | $12.00 |
| AWS Polly cost per 1M chars | $4.80 |
| **Gross Margin** | **$7.20 (60%)** |

### Per-Package Margin (Variable Costs Only)

| Package | Price | Polly Cost | Gross Profit | Margin % |
|---------|-------|------------|--------------|----------|
| 500 credits | $6.00 | $2.40 | $3.60 | 60% |
| 1,000 credits | $12.00 | $4.80 | $7.20 | 60% |
| 2,000 credits | $24.00 | $9.60 | $14.40 | 60% |
| 5,000 credits | $60.00 | $24.00 | $36.00 | 60% |
| 10,000 credits | $120.00 | $48.00 | $72.00 | 60% |
| 25,000 credits | $300.00 | $120.00 | $180.00 | 60% |
| 50,000 credits | $600.00 | $240.00 | $360.00 | 60% |

### Break-Even Analysis

**To cover fixed costs (~$55/month):**

- Need **~7.6 million characters** of usage per month
- Or approximately:
  - 15 x $6 packages, OR
  - 8 x $12 packages, OR
  - 4 x $24 packages, OR
  - 1 x $60 package

---

## Scaling Considerations

### Current Capacity
- EC2 t3.medium handles **100 concurrent users** at 2,000 requests easily
- Comfortable up to **~500 users** before needing to scale

### Upgrade Triggers
| Metric | Current Limit | Upgrade Path |
|--------|---------------|--------------|
| Concurrent users | ~500 | t3.large (~$60/mo) |
| Database connections | Supabase Pro limits | Supabase Team ($599/mo) |
| Frontend bandwidth | Vercel free limits | Vercel Pro ($20/mo) |

### Cost at Scale (Projected)

| Monthly Users | Est. Characters | Polly Cost | Fixed | Total Cost | Revenue Needed |
|---------------|-----------------|------------|-------|------------|----------------|
| 50 | 5M | $24 | $55 | ~$80 | $100+ |
| 200 | 20M | $96 | $55 | ~$150 | $200+ |
| 500 | 50M | $240 | $100* | ~$340 | $500+ |

*Fixed costs increase with scaling

---

## Future-Proof Pricing Strategy

### Why Bake In Future Costs?
Rather than raising prices every time infrastructure scales, set pricing that accounts for eventual upgrades. This provides:
- Stable pricing for customers
- Predictable revenue model
- Room to absorb growth costs

### Projected Infrastructure at Scale (~500-1000 users)

| Service | Current | Scaled | Monthly Cost |
|---------|---------|--------|--------------|
| AWS EC2 | t3.medium | t3.large or t3.xlarge | ~$60-120 |
| Supabase | Pro ($25) | Pro or Team | $25-99 |
| Vercel | Free | Pro | $20 |
| Stripe fees | ~2.9% + $0.30 | Same | Variable |
| Domain/SSL | Included | Same | ~$0 |
| **Total Fixed** | **~$55** | **~$150-250** |

### Cost Model at Scale

Assuming **scaled infrastructure** ($150/mo fixed) and moderate usage:

| Monthly Volume | Polly Cost | Fixed | Total Cost | Break-Even Revenue |
|----------------|------------|-------|------------|-------------------|
| 25M chars | $120 | $150 | $270 | Need $270+ |
| 50M chars | $240 | $150 | $390 | Need $390+ |
| 100M chars | $480 | $150 | $630 | Need $630+ |

### Recommended Pricing (Future-Proofed)

**Target: 60% gross margin after Polly, then cover fixed costs**

| Rate | Revenue/1M | Polly Cost | Net Margin | Margin % |
|------|-----------|------------|------------|----------|
| Current: $0.01 | $10.00 | $4.80 | $5.20 | 52% |
| **Recommended: $0.012** | **$12.00** | **$4.80** | **$7.20** | **60%** |
| Aggressive: $0.015 | $15.00 | $4.80 | $10.20 | 68% |

### Recommended Package Pricing

With **$0.012/credit** (60% margin, future-proofed):

| Package | Credits | Characters | Current | Recommended | Difference |
|---------|---------|------------|---------|-------------|------------|
| Starter | 500 | 500K | $5.00 | **$6.00** | +$1.00 |
| Light | 1,000 | 1M | $10.00 | **$12.00** | +$2.00 |
| Regular | 2,000 | 2M | $20.00 | **$24.00** | +$4.00 |
| Popular | 5,000 | 5M | $50.00 | **$60.00** | +$10.00 |
| Pro | 10,000 | 10M | $100.00 | **$120.00** | +$20.00 |
| Heavy | 25,000 | 25M | $250.00 | **$300.00** | +$50.00 |
| Enterprise | 50,000 | 50M | $500.00 | **$600.00** | +$100.00 |

### Break-Even at Recommended Pricing

With $0.012/credit and $150/mo scaled infrastructure:
- Need **~21 million characters/month** to break even
- Or ~17 x $12 packages, or ~7 x $24 packages

### Market Comparison

| Service | Price per 1M chars | Notes |
|---------|-------------------|-------|
| AWS Polly Direct | $4.80 | No app, raw API |
| Speechify API | $10.00 | Developer API only |
| Speechify Consumer | $139/year | "Unlimited" but throttled |
| Google Cloud TTS | $4.00-16.00 | Standard to WaveNet |
| ElevenLabs | $22.00+ | Premium AI voices |
| Play.ht | $15.00-30.00 | AI voices |
| **unChonk** | **$12.00** | Competitive, no throttling |

**Competitive advantage:** At $12/1M, a user would need to use 11.5M+ characters/year to exceed Speechify's $139/year. Most users pay significantly less with pay-as-you-go, and we don't throttle.

---

## Future Considerations

### Potential Add-ons
- **Neural voices:** Could add at $0.025/credit ($25/1M chars) for premium quality
- **Volume discounts:** Could offer 10-20% off for Pro tier if needed competitively
- **Annual plans:** Pre-paid credits at discount for committed users

---

## Configuration Locations

### Backend (Pricing Config)
```
/tts-reader-be/tts-reader-aws-backend/app/config.py
```
- `CreditConfig` class (lines 501-640)
- `CHARACTERS_PER_CREDIT`, `CREDIT_PACKAGES`, rates

### Frontend (Subscription Page)
```
/unchonk-webapp/src/components/SubscriptionPage.vue
```
- Fetches from `/api/credit-packages`
- Displays tiers and pricing

---

## Sources

- [AWS EC2 t3.medium Pricing](https://instances.vantage.sh/aws/ec2/t3.medium) - ~$30.37/month
- [AWS Polly Pricing](https://aws.amazon.com/polly/pricing/) - $4.80/1M chars (Standard)
- [Supabase Pricing](https://supabase.com/pricing) - $25/month Pro tier
