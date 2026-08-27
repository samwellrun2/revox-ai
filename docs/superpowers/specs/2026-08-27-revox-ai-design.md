# Revox AI — Video Translation Platform Design Spec

## Overview

Revox AI is a SaaS video translation platform that lets users paste a video link or upload a file and get it translated into 50+ languages — with AI voice cloning that preserves the original speaker's voice. Revenue comes from a freemium subscription model with four tiers.

**Domain:** revoxai.com

## User Flow

1. User visits landing page → sees value proposition
2. Signs up (required) via email/password or Google OAuth
3. Lands on dashboard → pastes a video URL or uploads a file
4. Selects target language(s) from 50+ options
5. Hits "Translate" → sees real-time progress
6. Gets translated video with cloned voice → downloads it
7. Hits free tier limit → paywall → Stripe checkout → continues

## Pages

| Route | Purpose |
|---|---|
| `/` | Landing page — hero, how it works, pricing, social proof |
| `/auth` | Sign up / login (Supabase Auth) |
| `/dashboard` | Upload area, paste link, recent translations, usage meter |
| `/dashboard/[id]` | Translation progress, preview, download |
| `/pricing` | 4 tiers with Stripe checkout |
| `/settings` | Account, billing, manage subscription |

## Pricing Tiers

| | Free | Pro | Business | Enterprise |
|---|---|---|---|---|
| Price | $0 | $15/mo | $49/mo | $99/mo |
| Minutes/month | 3 min | 30 min | 120 min | 500 min |
| Max video length | 2 min | 15 min | 60 min | Unlimited |
| Languages | 5 | 50+ | 50+ | 50+ |
| Voice cloning quality | Standard | HD | HD | Ultra HD |
| Downloads | Watermarked | Clean | Clean | Clean |
| Priority processing | No | No | Yes | Yes |
| API access | No | No | No | Yes |

## Tech Stack

### Frontend
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + custom design system (no component libraries)
- Framer Motion for animations
- Stripe Elements for payment UI

### Backend (Next.js API Routes)
- Supabase: auth, PostgreSQL database, file storage
- Stripe: subscriptions + webhooks
- Upstash Redis: rate limiting per tier

### Video Processing Pipeline
1. **Upload/fetch** — accept file upload or download from URL
2. **Transcribe** — OpenAI Whisper API extracts speech
3. **Translate** — GPT-4 or DeepL translates transcript
4. **Voice clone + dub** — ElevenLabs API clones speaker voice, generates target language speech
5. **Merge** — FFmpeg combines new audio with original video
6. **Deliver** — store in Supabase Storage, serve download link

### Infrastructure
- Vercel for hosting
- Supabase for data layer
- Inngest or Vercel serverless for background job queue
- Upstash Redis for rate limiting

### Key 3rd-Party APIs
- ElevenLabs — voice cloning + multilingual speech synthesis
- OpenAI Whisper — transcription
- GPT-4 or DeepL — translation
- FFmpeg — video/audio merging (server-side)

## Visual Design

### Direction
Light, clean, premium. Stripe meets Linear. Not templated. Not AI-looking.

### Typography
- Font: Inter or Satoshi — geometric, modern
- Large bold headlines with tight letter-spacing
- Lighter weights for body text

### Colors
- Background: `#FAFAFA` (warm off-white)
- Text: `#0A0A0A` (near-black)
- Primary accent: `#4F46E5` (deep indigo)
- Secondary: `#8B5CF6` (soft violet)
- Subtle gray borders/dividers

### Design Principles
- Generous whitespace
- Subtle shadows instead of harsh borders
- Micro-animations on hover/interactions
- No stock photos — abstract gradients, icons, real UI
- Cards with 16px border-radius
- Glass-morphism on key elements (upload area)

### Landing Page
- Hero headline: "Your voice. Any language."
- Animated demo of translation in action
- Scroll-triggered fade-in sections
- Tactile pricing cards
- Trust signals: "Trusted by 10,000+ creators"

## Database Schema (Supabase/PostgreSQL)

### users (managed by Supabase Auth)
- id, email, name, avatar_url, created_at

### subscriptions
- id, user_id, stripe_customer_id, stripe_subscription_id, tier (free/pro/business/enterprise), status, current_period_start, current_period_end

### translations
- id, user_id, status (pending/processing/completed/failed), source_url, source_file_path, source_language, target_language, duration_seconds, output_file_path, created_at, completed_at

### usage
- id, user_id, month (YYYY-MM), minutes_used, translations_count

## API Routes

| Method | Route | Purpose |
|---|---|---|
| POST | `/api/auth/signup` | Create account |
| POST | `/api/auth/login` | Login |
| POST | `/api/translate` | Start a translation job |
| GET | `/api/translate/[id]` | Get translation status |
| GET | `/api/translations` | List user's translations |
| POST | `/api/stripe/checkout` | Create Stripe checkout session |
| POST | `/api/stripe/webhook` | Handle Stripe events |
| GET | `/api/usage` | Get current usage stats |

## Error Handling

- Invalid URL or unsupported format → clear error message with supported formats list
- Video too long for tier → show upgrade prompt with tier comparison
- Usage limit reached → paywall modal with one-click upgrade
- Processing failure → automatic retry (1x), then notify user with option to retry
- Payment failure → Stripe handles retry logic, downgrade after grace period

## Security

- All API routes authenticated via Supabase JWT
- Rate limiting via Upstash Redis per user tier
- File uploads validated for type and size
- Stripe webhook signature verification
- No secrets in client-side code
