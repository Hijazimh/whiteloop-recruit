# Whiteloop Recruit

## Overview

Whiteloop Recruit is a research-recruitment platform that connects researchers with verified participants for moderated research sessions. The platform manages the complete research lifecycle: creating studies, screening participants through weighted criteria, scheduling sessions via Cal.com, conducting live interviews on LiveKit, and extracting insights from transcripts.

The application is built as a Next.js 16 app using the App Router pattern with React Server Components, backed by Supabase for authentication, database, and storage. It integrates with Stripe for payments, LiveKit for video sessions, Cal.com for scheduling, and Resend for email notifications.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: Next.js 16 with App Router and React Server Components (RSC)
- **Rationale**: RSC enables server-side data fetching and rendering by default, reducing client bundle size and improving initial page load performance
- **Routing**: File-based routing under `src/app/` with separate routes for participants (`/participant`), researchers (`/researcher`), and authentication (`/auth`)
- **Component Library**: shadcn/ui primitives with Tailwind CSS v4 for consistent, accessible UI components
- **State Management**: React Server Actions for mutations, eliminating need for separate API client libraries on the frontend

**Styling**: Tailwind CSS v4 with CSS variables for theming
- **Rationale**: Utility-first CSS with component variants via `class-variance-authority` enables rapid development while maintaining design consistency
- **Theme System**: CSS custom properties defined in `globals.css` support light/dark modes and are consumable by both Tailwind and shadcn/ui

### Backend Architecture

**Runtime**: Next.js server-side runtime with Server Actions and Route Handlers
- **Server Actions**: Form mutations (sign-up, sign-in, project creation) use progressive enhancement via `useFormState` and `useFormStatus`
- **API Routes**: RESTful endpoints under `/api` for programmatic integrations (webhooks, external services)
- **Rationale**: Server Actions reduce boilerplate for simple mutations while API routes provide standard HTTP endpoints for third-party integrations

**Authentication & Authorization**: Supabase Auth with middleware-based session management
- **Session Handling**: Edge middleware (`middleware.ts`) validates sessions for protected routes (`/participant`, `/researcher`)
- **Role-Based Access**: Users have roles (`participant`, `researcher`, `admin`) stored in `users` table; `requireRole()` helper enforces access in Server Components and Actions
- **Rationale**: Supabase Auth provides email/password authentication with magic links, reducing custom auth implementation complexity

**Data Access Pattern**: Direct database queries via Drizzle ORM with Supabase service role client
- **Service Role Client**: Server-side code uses `SUPABASE_SERVICE_ROLE_KEY` to bypass Row Level Security (RLS) for trusted operations
- **Application-Level Authorization**: Functions in `src/lib/data/` perform role checks before database operations
- **Rationale**: This pattern simplifies data access while maintaining security through explicit permission checks in application code

### Data Storage

**Primary Database**: PostgreSQL via Supabase
- **ORM**: Drizzle ORM with type-safe schema definitions in `src/lib/db/schema.ts`
- **Schema Management**: Migrations generated via `drizzle-kit` and stored in `/drizzle` directory
- **Connection Pooling**: `pg` Pool instance with SSL configuration for Supabase connections
- **Rationale**: Drizzle provides TypeScript-first ORM experience with minimal runtime overhead and SQL-like query builder

**Database Schema Design**:
- **Users & Profiles**: `users` table contains core identity; separate `participant_profiles` and `researcher_profiles` tables for role-specific data (one-to-one relationship)
- **Projects & Studies**: Researchers create `projects`, which contain multiple `studies`; each study has screening criteria via optional `screener_id`
- **Application Flow**: Participants submit `applications` to studies; approved applications create `matches` which track scheduling and session details
- **Insights**: `transcripts` capture session recordings; `insight_units` store extracted themes and quotes for analysis
- **Rationale**: Normalized schema separates concerns and enables flexible querying while maintaining referential integrity

**File Storage**: Supabase Storage for avatars, session recordings, and consent forms
- **Access Pattern**: Presigned URLs generated server-side for secure temporary access
- **Rationale**: Integrated with Supabase authentication for automatic access control

### External Dependencies

**Supabase** (Authentication, Database, Storage)
- **Services Used**: Auth for user management, PostgreSQL database, Storage buckets
- **Integration**: Three client types - browser client (client components), server client (Server Components with cookies), service role client (admin operations)
- **Environment Variables**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_DB_URL`

**Stripe** (Payments)
- **Use Case**: Researcher subscription billing, participant payouts via Stripe Connect
- **Integration**: Server-side SDK for payment processing, webhooks for payment events
- **Environment Variables**: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_CONNECT_CLIENT_ID`

**LiveKit** (Video Sessions)
- **Use Case**: HD video interviews with recording and real-time transcription
- **Integration**: `@livekit/components-react` for client UI, `livekit-server-sdk` for token generation and room management
- **Environment Variables**: `LIVEKIT_URL`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`

**Cal.com** (Scheduling)
- **Use Case**: Automated booking for matched participant-researcher sessions
- **Integration**: Embed SDK (`@calcom/embed-react`) for booking UI, API for programmatic scheduling
- **Environment Variables**: `CALCOM_API_KEY`

**Resend** (Email)
- **Use Case**: Transactional emails (welcome, session reminders, payment notifications)
- **Integration**: Server-side SDK for email delivery
- **Environment Variables**: `RESEND_API_KEY`

**OpenAI** (Optional - Insights)
- **Use Case**: LLM-powered extraction of themes, quotes, and sentiment from session transcripts
- **Integration**: Server-side API calls to generate insight units from raw transcript text
- **Environment Variables**: `OPENAI_API_KEY`
- **Fallback**: Basic heuristic extraction when API key not configured

### Matching Engine

**Algorithm**: Weighted scoring system in `src/lib/matching.ts`
- **Rules**: Support operators (`in`, `includesAny`, `eq`, `gte`, `lte`) for profile and answer fields
- **Scoring**: Each rule has a weight; total score compared against threshold to determine eligibility
- **Must Rules**: Optional strict requirements that override weighted scoring
- **Rationale**: Flexible criteria definition allows researchers to balance strict requirements with nice-to-have attributes

### Testing Strategy

**Unit Tests**: Vitest with React Testing Library
- **Setup**: `vitest.config.ts` with jsdom environment for React component testing
- **Location**: `tests/unit/` and co-located `.test.ts` files

**End-to-End Tests**: Playwright
- **Configuration**: Multi-browser testing (Chromium, Firefox, WebKit) defined in `playwright.config.ts`
- **Location**: `tests/e2e/`
- **Web Server**: Automated dev server startup for CI/CD environments

**Environment Validation**: Zod schemas in `src/lib/env.ts` and `src/lib/env.server.ts`
- **Rationale**: Type-safe environment variable validation prevents runtime errors from missing or invalid configuration
- **Behavior**: Strict validation in production; warnings in development with fallback values