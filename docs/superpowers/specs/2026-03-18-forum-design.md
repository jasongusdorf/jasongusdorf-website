# LLMs for Doctors — Community Forum Design Spec

**Domain:** community.llmsfordoctors.com
**Auth:** auth.llmsfordoctors.com
**Author:** Jason Gusdorf, MD
**Date:** 2026-03-18
**Status:** Approved

## Mission

Give verified physicians a trusted space to discuss LLM use in clinical practice — share workflows, troubleshoot prompts, and learn from each other.

## Architecture Overview

Three systems working together:

1. **Auth Service** (custom) — NPI verification + account creation + DiscourseConnect SSO
2. **Discourse** (off-the-shelf) — forum platform, configured and themed
3. **Main Site** (existing Astro) — updated with community links

```
llmsfordoctors.com (Astro, Netlify)
  ├── "Join the Community" → auth.llmsfordoctors.com/register
  └── "Community" nav link → community.llmsfordoctors.com

auth.llmsfordoctors.com (Node.js, Fly.io)
  ├── /register → NPI verify → create account → redirect to Discourse
  ├── /login → authenticate → SSO payload → redirect to Discourse
  └── /sso → DiscourseConnect callback

community.llmsfordoctors.com (Discourse, VPS or managed)
  ├── SSO-only auth (no local accounts)
  ├── Custom theme matching main site
  └── Shared top nav linking back to main site
```

## Auth Service

### Tech Stack

- **Runtime:** Node.js
- **Framework:** Hono (lightweight, fast, TypeScript-first)
- **Database:** SQLite via better-sqlite3 (single-file, zero-config, deployed alongside app)
- **Password hashing:** bcrypt
- **Sessions:** JWT stored in httpOnly cookie
- **Deployment:** Fly.io free tier
- **Domain:** auth.llmsfordoctors.com

### Database Schema

Single `users` table:

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  npi_number TEXT UNIQUE NOT NULL,
  npi_verified BOOLEAN DEFAULT FALSE,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'moderator', 'admin')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### NPI Verification

Uses the free NPPES NPI Registry API:

```
GET https://npiregistry.cms.hhs.gov/api/?version=2.1&number={npi}
```

Verification logic:
1. Query NPPES API with the entered NPI number
2. Confirm the NPI exists and belongs to an individual (not an organization)
3. Confirm the name on the NPI record reasonably matches the entered name (fuzzy match — first + last name)
4. If all checks pass, mark user as `npi_verified = true`
5. If any check fails, show a specific error message (invalid NPI, name mismatch, organization NPI, etc.)

### Routes

**GET /register** — Registration page. Form fields: first name, last name, NPI number, email, password, confirm password.

**POST /register** — Validates input, queries NPPES API, creates user if NPI verifies, sets session cookie, redirects to Discourse via SSO.

**GET /login** — Login page. Form fields: email, password.

**POST /login** — Authenticates user, sets session cookie, redirects to Discourse via SSO.

**GET /sso** — DiscourseConnect callback. Receives `sso` and `sig` query params from Discourse, validates signature, looks up user from session, builds SSO return payload (nonce, email, external_id, name, username), signs it, redirects back to Discourse.

**GET /logout** — Clears session cookie, redirects to main site.

### Auth Pages UI

Simple, clean HTML pages matching the clinical design system:
- Slate blue palette, Newsreader headings, Inter body text
- Minimal — just the form, a logo, and links back to the main site
- Server-rendered HTML (no client-side framework needed)
- Mobile-responsive

### DiscourseConnect SSO Flow

1. User clicks "Log In" on Discourse
2. Discourse redirects to `auth.llmsfordoctors.com/sso?sso={payload}&sig={signature}`
3. Auth service validates the signature using the shared SSO secret
4. If user has a valid session → builds return payload with user info
5. If no session → redirects to `/login`, then back to `/sso` after authentication
6. Auth service signs the return payload and redirects to `community.llmsfordoctors.com/session/sso_login?sso={payload}&sig={signature}`
7. Discourse logs the user in

### Security

- Passwords hashed with bcrypt (cost factor 12)
- JWT in httpOnly, Secure, SameSite=Lax cookie
- SSO secret shared between auth service and Discourse (env var, never committed)
- HTTPS enforced on all three domains
- Rate limiting on /register and /login (e.g., 5 attempts per minute per IP)
- CSRF protection on form submissions

## Discourse Configuration

### Installation

Self-hosted via Docker on a VPS (DigitalOcean/Hetzner, $10-20/mo) or Discourse managed hosting ($50/mo). Standard Discourse Docker installation guide.

### Categories

| Category | Slug | Description |
|---|---|---|
| Note Writing | note-writing | Discharge summaries, progress notes, consult letters |
| Clinical Reasoning | clinical-reasoning | Differential diagnosis, decision support, case discussions |
| Patient Education | patient-education | Handouts, instructions, health literacy |
| Literature Review | literature-review | Paper summaries, evidence synthesis |
| Admin & Billing | admin-billing | Documentation, coding, prior auth |
| Board Prep | board-prep | Study strategies, question discussion |
| General | general | Introductions, site feedback, off-topic |

### Trust Levels (Discourse Built-In)

| Level | Name | Capabilities | How Earned |
|---|---|---|---|
| 0 | New Member | Post, reply | Automatic on registration |
| 1 | Basic | Flag posts, send DMs | Auto: read 5 topics, spend 10 min reading |
| 2 | Member | Recategorize, edit wikis, invite | Auto: visit 15 days, read 50 topics |
| 3 | Regular (Community Moderator) | Close/split topics, hide posts, move threads | Manual promotion by admin |
| 4 | Admin | Full control | Jason only |

### SSO Settings

```
enable_discourse_connect: true
discourse_connect_url: https://auth.llmsfordoctors.com/sso
discourse_connect_secret: {shared_secret}
discourse_connect_overrides_email: true
discourse_connect_overrides_name: true
```

### Custom Theme

A Discourse theme component that applies the clinical design system:
- **Colors:** Slate blues matching `clinical-800`/`clinical-900` for header, white/cream body
- **Typography:** Newsreader for topic titles and category headers, Inter for body text
- **Header:** Custom top nav bar with "LLMs for Doctors" branding and link back to main site
- **CSS-only customization** — no custom Discourse plugins needed

## Main Site Updates

### Nav Changes

Add "Community" link to the existing nav in `Nav.astro`:

```
Workflows | Guides | Tools | Templates | Trials | Community | About
```

### Footer Changes

Add "Join the Community" CTA in the footer newsletter section area.

### Homepage

Add a brief community section below the workflow grid: "Join the Community — Connect with physicians using AI in clinical practice" with a CTA button linking to the registration page.

## User Journey

### New User

1. Visits llmsfordoctors.com, clicks "Join the Community"
2. Redirected to auth.llmsfordoctors.com/register
3. Enters name, NPI number, email, password
4. Auth service verifies NPI against NPPES API
5. Account created, session set, redirected to Discourse via SSO
6. Lands on forum homepage, logged in as a verified physician

### Returning User

1. Visits community.llmsfordoctors.com
2. Discourse checks SSO → redirects to auth service
3. Auth service finds valid session cookie → builds SSO payload → redirects back
4. User is logged in seamlessly (or shown login form if session expired)

## Deployment

| Service | Platform | Cost | Domain |
|---|---|---|---|
| Main site | Netlify | Free | llmsfordoctors.com |
| Auth service | Fly.io | Free tier | auth.llmsfordoctors.com |
| Discourse | VPS (DigitalOcean) or managed | $10-50/mo | community.llmsfordoctors.com |

### DNS

Three A/CNAME records under llmsfordoctors.com:
- `@` → Netlify
- `auth` → Fly.io
- `community` → VPS or Discourse managed hosting

## What We Build (Custom Code)

- Auth service: ~6 files (server, routes, db, npi-client, sso, views)
- Auth page templates: registration + login HTML
- Discourse theme: CSS overrides
- Main site updates: nav + footer + homepage CTA

## What We Configure (No Custom Code)

- Discourse Docker installation
- Discourse categories, trust levels, site settings
- DiscourseConnect SSO settings
- DNS records
- Fly.io deployment

## Out of Scope

- Email notifications (Discourse handles natively)
- Profile customization beyond name/NPI
- Mobile app
- Auth admin dashboard (manage via SQLite CLI + Discourse admin panel)
- Password reset flow (defer to v2 — for now, manual reset via admin)
- OAuth providers (Google, Apple — defer to v2)
