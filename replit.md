# Moha International Shopping

An Arabic-first ordering site that helps customers purchase products from international stores and arrange delivery in Algeria.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/moha-shopping/src/App.tsx` — single-page Moha customer experience, estimate calculator, FAQ, and WhatsApp handoff
- `artifacts/moha-shopping/src/index.css` — Moha visual system, responsive layout, motion, and component styling
- `artifacts/moha-shopping/.replit-artifact/artifact.toml` — artifact routing and web workflow configuration
- `artifacts/api-server` — shared API scaffold; not required by the current calculator-first site

## Architecture decisions

- The first release is frontend-only because price estimation and WhatsApp handoff do not require server-side persistence.
- Pricing is calculated locally from the USD input using the fixed 256 DZD exchange rate and tiered commission minimums supplied for Moha.
- WhatsApp is the only contact path; the CTA builds a prefilled Arabic order message with the product link, notes, and estimate.

## Product

- Arabic-first responsive landing page for Moha / موحا
- Multi-service WhatsApp ordering flow for online shopping, games, subscriptions, top-ups, and custom requests
- Optional product price calculator that returns only the approximate DZD total
- Direct structured WhatsApp ordering flow for +213 666 848 816
- Shopping delivery form with all 58 Algerian Wilayas, dependent communes, manual commune entry, and postal code
- How-it-works, trust messaging, and FAQ content including 18–45 day delivery expectations

## User preferences

- Keep customer-facing copy Arabic-first and do not expose email contact paths.

## Gotchas

- Keep the calculator’s tier boundaries and fee minimums aligned with the approved Moha pricing brief.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
