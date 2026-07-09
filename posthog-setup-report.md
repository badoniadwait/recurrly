# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into **Recurrly**, your Expo-based subscription management app. The integration adds user identification via Clerk authentication, event tracking for key user actions, screen tracking via Expo Router, and autocapture for touch events. A PostHog client is configured using `expo-constants` to read secrets from `app.config.js` extras rather than bundling them directly.

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signed in with email and password via Clerk. | `app/(auth)/sign-in.tsx` |
| `user_sign_in_failed` | User sign-in attempt failed due to invalid credentials or an error. | `app/(auth)/sign-in.tsx` |
| `user_signed_up` | New user completed registration and email verification. | `app/(auth)/sign-up.tsx` |
| `email_verification_submitted` | User submitted an email verification code during sign-up. | `app/(auth)/sign-up.tsx` |
| `user_sign_up_failed` | User sign-up attempt failed due to invalid input or an error. | `app/(auth)/sign-up.tsx` |
| `subscription_card_expanded` | User tapped a subscription card to expand its details on the home screen. | `app/(tabs)/index.tsx` |
| `subscription_details_viewed` | User navigated to the detail page for a specific subscription. | `app/subscriptions/[id].tsx` |
| `user_signed_out` | User tapped the Sign Out button in the settings screen. | `app/(tabs)/settings.tsx` |

## Files created

- `src/config/posthog.ts` — PostHog client singleton, reads token/host from `Constants.expoConfig.extra`
- `app.config.js` — Expo config shim that passes `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` env vars as extras
- `.env` — Contains `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` (gitignored)

## Files modified

- `app/_layout.tsx` — Added `PostHogProvider` wrapping the Stack, plus `useEffect` for manual screen tracking with Expo Router
- `app/(auth)/sign-in.tsx` — Added `posthog.identify()` and `posthog.capture("user_signed_in")` on success; `user_sign_in_failed` on error
- `app/(auth)/sign-up.tsx` — Added `posthog.identify()` and `posthog.capture("user_signed_up")` on verification success; `email_verification_submitted` before verification; `user_sign_up_failed` on error
- `app/(tabs)/settings.tsx` — Added `posthog.capture("user_signed_out")` and `posthog.reset()` before sign-out
- `app/(tabs)/index.tsx` — Added `posthog.capture("subscription_card_expanded")` with subscription id/name when a card is expanded
- `app/subscriptions/[id].tsx` — Added `posthog.capture("subscription_details_viewed")` with subscription id on mount

## Next steps

We've built a dashboard and insights for you to monitor user behavior:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/504304/dashboard/1821237)
- [Daily sign-ins and sign-ups](https://us.posthog.com/project/504304/insights/c8k0voAv)
- [Email verification conversion funnel](https://us.posthog.com/project/504304/insights/0mjJQqJd)
- [Sign-in failures vs successes](https://us.posthog.com/project/504304/insights/OwgXq1tl)
- [Subscription engagement](https://us.posthog.com/project/504304/insights/3gKIw81o)
- [User sign-outs (churn signal)](https://us.posthog.com/project/504304/insights/Y1RDChhq)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any onboarding scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — currently `identify` is only called on fresh login/signup. If Clerk restores a session silently (e.g. via `useAuth` on app resume), add an `identify` call there too so returning sessions are not left on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
