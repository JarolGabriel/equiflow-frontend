# EquiFlow — Frontend

EquiFlow is a mobile-first web app for tracking investments across **crypto, stocks, and forex**. It lets you browse a public market catalog, build real or watch-only portfolios, register buy/sell transactions with live profit & loss, keep a favorites watchlist, export PDF reports, and upgrade to a PRO plan via Stripe.

This repository contains the **Next.js frontend**. It talks to the EquiFlow Django REST backend: [`JarolGabriel/equiflow`](https://github.com/JarolGabriel/equiflow).

> Dark theme only. Financial data is rendered with tabular figures and green/red semantics for gains/losses.

---

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Architecture](#architecture)
- [Routes](#routes)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Available scripts](#available-scripts)
- [Project structure](#project-structure)
- [Backend contract notes](#backend-contract-notes)
- [Deployment](#deployment)
- [Roadmap](#roadmap)
- [License](#license)

---

## Features

- **Authentication** — email/password login & registration, JWT access/refresh with a single-flight token refresh interceptor, forgot/reset password, and change password.
- **Public browsing without login** — the market dashboard, asset explorer, and asset detail pages are all public. Login is only required for the protected areas.
- **Home dashboard** — grouped market summary (crypto / stocks / forex) plus live market status.
- **Explore** — search and filter the full asset catalog by type.
- **Asset detail** — large price header, price history chart (area/line), and a favorite toggle.
- **Portfolios** — create **Real** portfolios (track buy/sell with P&L) or **Tracking** portfolios (watch-only). Add holdings, view positions and transactions, and export a PDF report.
- **Watchlist / favorites** — one-tap favorite toggle with optimistic updates.
- **PRO upgrade** — one-time checkout with Stripe Payment Element.
- **Polished UX** — loading skeletons, empty states, recoverable error states, and toasts throughout.

## Tech stack

| Concern | Choice |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org) (App Router, Turbopack) |
| Language | TypeScript |
| UI | [Tailwind CSS 3](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) (Radix primitives) |
| Data fetching | [TanStack Query](https://tanstack.com/query) |
| Global state | [Zustand](https://zustand-demo.pmnd.rs) (with `persist`) |
| HTTP client | [Axios](https://axios-http.com) (interceptors for auth + refresh) |
| Charts | [Recharts](https://recharts.org) |
| Forms & validation | React Hook Form + Zod |
| Payments | [Stripe.js](https://stripe.com/docs/js) + `@stripe/react-stripe-js` |
| Notifications | [Sonner](https://sonner.emilkowal.ski) |
| Icons | [lucide-react](https://lucide.dev) |

## Architecture

- **App Router with route groups.** `(auth)` holds the authentication screens, `(dashboard)` holds the app shell (sidebar, header, bottom tab bar). Route groups do **not** change the URL — e.g. `/portfolios` stays `/portfolios`.
- **Public vs protected.** The dashboard shell renders for everyone. A nested `(protected)` group wraps only the routes that require a session in a client-side `AuthGuard`, which redirects unauthenticated users to `/login?next=<path>`.
- **Auth store.** Tokens live in `localStorage` via a Zustand `persist` store. A dedicated hydration component flips a `hasHydrated` flag after mount so SSR and the first client render match (no hydration mismatch, no infinite spinner).
- **Data layer.** All API calls live in `src/lib/api/*` (typed against the backend contract). React Query hooks in `src/hooks/*` wrap them with centralized query keys and cache invalidation. Queries that need a session are gated with `enabled: isAuthenticated` so guests never trigger 401s.
- **Axios interceptors.** Requests attach the `Bearer` access token; a 401 triggers a single-flight refresh, retries the original request, and on failure clears auth and redirects to login.

## Routes

**Public** (no session required):

| Route | Description |
| --- | --- |
| `/` | Redirects to `/dashboard` |
| `/dashboard` | Home — market summary + status |
| `/explore` | Search / filter the asset catalog |
| `/assets/[id]` | Asset detail (chart + favorite) |
| `/watchlist` | Favorites |
| `/login`, `/register` | Authentication |
| `/forgot-password`, `/reset-password` | Password recovery |

**Protected** (redirect to `/login?next=…`):

| Route | Description |
| --- | --- |
| `/portfolios` | Portfolio list |
| `/portfolios/[id]` | Portfolio detail (holdings, transactions, PDF export) |
| `/upgrade` | Upgrade to PRO (Stripe) |
| `/settings` | Profile, change password, plan |
| `/alerts` | Price alerts (placeholder, Phase 3) |

## Getting started

### Prerequisites

- **Node.js 20+**
- **npm** (or your preferred package manager)

### Installation

```bash
# 1. Clone
git clone https://github.com/JarolGabriel/equiflow-frontend.git
cd equiflow-frontend

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local
# then edit .env.local (see the table below)

# 4. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Only `NEXT_PUBLIC_*` variables are exposed to the browser. Copy `.env.example` to `.env.local` and adjust:

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | Yes | Base URL of the REST API, including the `/api` prefix and no trailing slash. Example: `http://localhost:8000/api` |
| `NEXT_PUBLIC_WS_URL` | No | Base URL for the alerts WebSocket (Phase 3). Use `ws://` locally, `wss://` in production. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | No | Stripe publishable key (`pk_test_…` / `pk_live_…`). If empty, the PRO checkout UI shows a "not configured" notice instead of the payment form. |

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server (http://localhost:3000) |
| `npm run build` | Create an optimized production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Project structure

```
src/
├── app/
│   ├── (auth)/                 # login, register, forgot/reset password
│   ├── (dashboard)/            # app shell (sidebar, header, bottom tab bar)
│   │   ├── dashboard/          # home (public)
│   │   ├── explore/            # asset search (public)
│   │   ├── assets/[id]/        # asset detail (public)
│   │   ├── watchlist/          # favorites (public)
│   │   └── (protected)/        # AuthGuard-wrapped routes
│   │       ├── portfolios/     # list + [id] detail
│   │       ├── settings/       # profile, password, plan
│   │       ├── upgrade/        # PRO checkout (Stripe)
│   │       └── alerts/         # placeholder
│   ├── layout.tsx              # root layout + providers
│   ├── providers.tsx           # TanStack Query provider
│   └── page.tsx                # redirects to /dashboard
├── components/
│   ├── ui/                     # shadcn/ui primitives
│   ├── nav/                    # sidebar, bottom tab bar, header
│   ├── market/                 # asset rows, charts, price cards, buy/sell
│   └── portfolios/             # create/add dialogs, portfolio card
├── hooks/                      # React Query hooks + query keys
└── lib/
    ├── api/                    # typed API client, endpoints, config, errors
    ├── store/                  # Zustand auth store
    ├── format.ts               # currency / percent / date helpers
    └── utils.ts

docs/                           # PRD, TRD, UI/UX, backend reference, plan
```

## Backend contract notes

- **Portfolio type (`portfolio_type`).** The frontend sends `"REAL" | "TRACKING"` when creating a portfolio and reads it back to switch UI behavior. This requires a `portfolio_type` field on the backend `Portfolio` model/serializer (default `"REAL"`). Until it exists, DRF safely ignores the unknown write field and the frontend treats a missing value as `"REAL"`.
- **Adding holdings.** The backend only creates holdings through a `Transaction` (quantity + price required). For Tracking portfolios, "add asset" opens a minimal form (quantity + market price, editable) recorded as a `BUY` behind the scenes.
- **Payments.** `POST /payments/create-intent/` returns `{ clientSecret, paymentIntentId }` (camelCase). The Stripe webhook flips the user to PRO asynchronously after a successful payment.
- **Password reset email.** The reset link should point to the frontend at `/reset-password?uid=<uid>&token=<token>`.

## Deployment

The app is a standard Next.js project and deploys cleanly to [Vercel](https://vercel.com) or any Node host:

1. Set the environment variables from the table above in your hosting provider.
2. Build with `npm run build` and serve with `npm run start` (or use the provider's Next.js integration).

## Roadmap

- Real-time price alerts over WebSocket (Phase 3) with an unread badge.
- Social login (Google / GitHub) — supported by the backend, UI pending.
- Automatic profile refresh after a successful PRO payment.
- Multiple named watchlists (requires a backend model).

## License

This project is currently unlicensed / private. Add a `LICENSE` file if you intend to open-source it.
