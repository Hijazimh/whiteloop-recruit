## Whiteloop Recruit

Whiteloop is a research-recruitment platform that connects researchers with verified participants, manages scheduling and live sessions, and extracts insights from transcripts.

## Tech Stack

- Next.js 16 (App Router, React Server Components)
- Tailwind CSS v4 with shadcn/ui component primitives
- Supabase (Auth, Postgres, Storage)
- Stripe, LiveKit, Cal.com, Resend integrations
- Drizzle ORM + drizzle-kit migrations
- Vitest, Playwright, Testing Library

## Getting Started

1. Copy the environment template and populate it with your credentials:

   ```bash
   cp env.example .env.local
   ```

2. Install dependencies (already installed if you ran `create-next-app`):

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

   The app will be available at [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` — start the Next.js development server
- `npm run build` — create an optimized production build
- `npm run start` — run the production server
- `npm run lint` — run ESLint
- `npm run test` / `npm run test:watch` / `npm run test:coverage` — run Vitest
- `npm run test:e2e` / `npm run test:e2e:ui` — run Playwright tests
- `npm run db:generate` / `npm run db:migrate` / `npm run db:push` / `npm run db:studio` — manage Drizzle migrations

## Project Structure

- `src/app` — App Router routes, layouts, and global styles
- `src/lib` — shared utilities, environment loaders, Supabase clients
- `drizzle` — generated SQL migrations (after running drizzle commands)
- `env.example` — environment variable template

## Next Steps

- Define database schema in `src/lib/db/schema.ts` and generate migrations with Drizzle.
- Implement authentication flows with Supabase.
- Build researcher, participant, and admin dashboards.
- Integrate third-party services (Stripe, LiveKit, Cal.com, Resend) as features come online.
# whiteloop-recruit
