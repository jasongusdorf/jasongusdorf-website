# Forum Auth Service Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the NPI-verified auth service for llmsfordoctors.com community forum, with DiscourseConnect SSO integration.

**Architecture:** A Hono (TypeScript) server with SQLite (better-sqlite3) for user accounts, sessions, and email tokens. Handles NPI verification via the NPPES API, password hashing with bcrypt, and DiscourseConnect SSO handoff. Server-rendered HTML pages for registration, login, forgot/reset password. Deployed to Fly.io.

**Tech Stack:** Node.js, Hono, TypeScript, better-sqlite3, bcrypt, hCaptcha, Nodemailer (for email), Fly.io

**Spec:** `docs/superpowers/specs/2026-03-18-forum-design.md`

---

## File Structure

```
forum-auth/
├── package.json
├── tsconfig.json
├── Dockerfile
├── fly.toml
├── .env.example
├── DISCOURSE_SETUP.md
├── src/
│   ├── index.ts              # Hono app entry point, middleware, route mounting
│   ├── config.ts             # Environment variable loading and validation
│   ├── db.ts                 # SQLite initialization, schema creation, query helpers
│   ├── routes/
│   │   ├── register.ts       # GET/POST /register
│   │   ├── login.ts          # GET/POST /login
│   │   ├── sso.ts            # GET /sso (DiscourseConnect callback)
│   │   ├── forgot-password.ts # GET/POST /forgot-password
│   │   ├── reset-password.ts # GET/POST /reset-password
│   │   ├── verify-email.ts   # GET /verify-email?token=xxx
│   │   └── logout.ts         # GET /logout
│   ├── services/
│   │   ├── npi.ts            # NPPES API client + name matching logic
│   │   ├── session.ts        # Session token generation
│   │   ├── email.ts          # Email sending via Nodemailer (SMTP)
│   │   └── sso-payload.ts    # DiscourseConnect payload build/sign/verify
│   ├── middleware/
│   │   ├── csrf.ts           # Double-submit cookie CSRF protection
│   │   ├── rate-limit.ts     # IP-based rate limiting
│   │   └── auth.ts           # Session cookie validation middleware
│   └── views/
│       ├── layout.ts         # Base HTML layout (head, clinical styles, footer)
│       ├── register.ts       # Registration form HTML
│       ├── login.ts          # Login form HTML
│       ├── forgot-password.ts # Forgot password form HTML
│       ├── reset-password.ts # Reset password form HTML
│       ├── verify-email.ts   # Email verification result page HTML
│       └── message.ts        # Generic success/error message page HTML
├── tests/
│   ├── npi.test.ts           # NPI verification + name matching tests
│   ├── sso-payload.test.ts   # SSO payload build/sign/verify tests
│   ├── session.test.ts       # Session token generation tests
│   └── db.test.ts            # Database schema + query tests
```

---

## Task 1: Project Scaffolding

**Files:**
- Create: `forum-auth/package.json`
- Create: `forum-auth/tsconfig.json`
- Create: `forum-auth/.env.example`
- Create: `forum-auth/src/config.ts`

- [ ] **Step 1:** Create project directory, run `npm init -y`, install dependencies: `hono @hono/node-server better-sqlite3 bcryptjs nodemailer` and dev deps: `typescript @types/node @types/better-sqlite3 @types/bcryptjs @types/nodemailer vitest tsx`

- [ ] **Step 2:** Write `tsconfig.json` with target ES2022, module ESNext, strict mode

- [ ] **Step 3:** Write `.env.example` with all required env vars: PORT, DATABASE_PATH, SSO_SECRET, DISCOURSE_URL, AUTH_URL, MAIN_SITE_URL, HCAPTCHA_SECRET/SITEKEY, SMTP_HOST/PORT/USER/PASS, FROM_EMAIL, SESSION_MAX_AGE_DAYS

- [ ] **Step 4:** Write `src/config.ts` — loads and validates all env vars, throws on missing required vars

- [ ] **Step 5:** Add scripts to package.json: dev (tsx watch), build (tsc), start, test (vitest run)

- [ ] **Step 6:** Commit: `"feat: scaffold forum auth service"`

---

## Task 2: Database Layer

**Files:**
- Create: `forum-auth/src/db.ts`
- Create: `forum-auth/tests/db.test.ts`

- [ ] **Step 1:** Write tests for: table creation, user CRUD, unique email/NPI constraints, email verification activates user, session lifecycle, email token lifecycle

- [ ] **Step 2:** Run tests — expect FAIL

- [ ] **Step 3:** Implement `db.ts` — `createDb(path)` returns a Database interface with methods: createUser, getUserByEmail, getUserById, getUserByNpi, verifyEmail, updatePassword, disableUser, createSession, getSession, deleteSession, deleteUserSessions, createEmailToken, getEmailToken, useEmailToken. Uses WAL mode and foreign keys.

- [ ] **Step 4:** Run tests — expect PASS

- [ ] **Step 5:** Commit: `"feat: add database layer with users, sessions, email_tokens"`

---

## Task 3: NPI Verification Service

**Files:**
- Create: `forum-auth/src/services/npi.ts`
- Create: `forum-auth/tests/npi.test.ts`

- [ ] **Step 1:** Write tests for: exact name match (case-insensitive), suffix stripping (MD, DO, Jr, III), Levenshtein match within distance 2, rejection beyond distance 2, punctuation handling (O'Brien)

- [ ] **Step 2:** Run tests — expect FAIL

- [ ] **Step 3:** Implement `npi.ts` — exports `stripSuffixes(name)`, `matchName(inputFirst, inputLast, npiFirst, npiLast)`, `verifyNpi(npiNumber, inputFirst, inputLast)`. The `verifyNpi` function calls the NPPES API at `https://npiregistry.cms.hhs.gov/api/?version=2.1&number={npi}`, checks enumeration_type is NPI-1, and runs name matching. Returns `{valid, error?, firstName?, lastName?}`.

- [ ] **Step 4:** Run tests — expect PASS

- [ ] **Step 5:** Commit: `"feat: add NPI verification with NPPES API and name matching"`

---

## Task 4: Session Management and SSO Payload

**Files:**
- Create: `forum-auth/src/services/session.ts`
- Create: `forum-auth/src/services/sso-payload.ts`
- Create: `forum-auth/tests/session.test.ts`
- Create: `forum-auth/tests/sso-payload.test.ts`

- [ ] **Step 1:** Write session tests: generates 64-char hex token, tokens are unique

- [ ] **Step 2:** Write SSO payload tests: validates correctly signed payload and extracts nonce, rejects bad signature, builds return payload with correct fields, includes moderator/admin flags for those roles, excludes flags for regular users

- [ ] **Step 3:** Implement `session.ts` — exports `generateToken()` using `crypto.randomBytes(32).toString('hex')`

- [ ] **Step 4:** Implement `sso-payload.ts` — exports `signPayload(payload, secret)` using HMAC-SHA256, `validateSsoPayload(payload, sig, secret)` returning `{valid, nonce?}`, `buildSsoReturn(params, secret)` building the DiscourseConnect return URL params (nonce, email, external_id, name, username, require_activation=false, moderator/admin flags based on role)

- [ ] **Step 5:** Run tests — expect PASS

- [ ] **Step 6:** Commit: `"feat: add session management and DiscourseConnect SSO payload"`

---

## Task 5: Middleware

**Files:**
- Create: `forum-auth/src/middleware/csrf.ts`
- Create: `forum-auth/src/middleware/rate-limit.ts`
- Create: `forum-auth/src/middleware/auth.ts`

- [ ] **Step 1:** Implement CSRF middleware — `csrfToken` sets a random token in a non-httpOnly cookie and stores in context, `csrfValidate` checks POST body `_csrf` matches cookie

- [ ] **Step 2:** Implement rate limiter — `rateLimit(maxPerMinute)` returns middleware that tracks hits per IP, resets every 60 seconds, returns 429 when exceeded

- [ ] **Step 3:** Implement auth middleware — `requireAuth(db)` reads session cookie, validates against DB, checks user status is not disabled, sets user in context, redirects to login if invalid

- [ ] **Step 4:** Verify TypeScript compiles: `npx tsc --noEmit`

- [ ] **Step 5:** Commit: `"feat: add CSRF, rate limiting, and auth middleware"`

---

## Task 6: Email Service

**Files:**
- Create: `forum-auth/src/services/email.ts`

- [ ] **Step 1:** Implement email service using Nodemailer — exports `sendVerificationEmail(to, token)` and `sendPasswordResetEmail(to, token)`. Both construct a link URL using `config.authUrl` and send HTML emails.

- [ ] **Step 2:** Commit: `"feat: add email service for verification and password reset"`

---

## Task 7: HTML Views

**Files:**
- Create all files in `forum-auth/src/views/`

- [ ] **Step 1:** Implement `layout.ts` — `layout(title, body)` returns full HTML with Google Fonts (Inter, Newsreader), clinical color CSS, centered card container (420px max), header with site name, footer with main site link

- [ ] **Step 2:** Implement form views — `register.ts` (first/last name, NPI, email, password, confirm password, hCaptcha widget, CSRF hidden field), `login.ts` (email, password, forgot-password link, hidden return field), `forgot-password.ts`, `reset-password.ts` (token as hidden field), `verify-email.ts` (success/failure message), `message.ts` (generic page)

- [ ] **Step 3:** Verify TypeScript compiles

- [ ] **Step 4:** Commit: `"feat: add server-rendered HTML views for auth pages"`

---

## Task 8: Route Handlers

**Files:**
- Create all files in `forum-auth/src/routes/`

- [ ] **Step 1:** Implement `register.ts` — GET renders form, POST validates inputs, verifies hCaptcha, calls verifyNpi, checks uniqueness, hashes password (bcrypt cost 12), creates user (status=pending), generates email verification token (24h expiry), sends verification email, shows "check your email to verify your account" page. NOTE: The spec says POST /register "sets session cookie, redirects to Discourse via SSO" but this is incorrect — users cannot SSO until email is verified (spec Security section). The plan intentionally shows the check-your-email page instead. User flow: register → verify email → login → Discourse.

- [ ] **Step 2:** Implement `login.ts` — GET renders form, POST finds user by email, compares password with bcrypt, checks status is active, creates session (30-day expiry), sets session cookie, redirects based on return param (sso or Discourse URL)

- [ ] **Step 3:** Implement `sso.ts` — GET validates sso/sig params, stores nonce in sso_nonce cookie (10min), checks for valid session, if no session redirects to login with return=sso, if session exists builds SSO return payload with role mapping, clears nonce cookie, redirects to Discourse

- [ ] **Step 4:** Implement `forgot-password.ts` — GET renders form, POST looks up email, if found generates reset token (1h expiry) and sends email, always shows same "check your email" message

- [ ] **Step 5:** Implement `reset-password.ts` — GET validates token and renders form, POST validates token, hashes new password, updates user, uses token, deletes all user sessions, redirects to login

- [ ] **Step 6:** Implement `verify-email.ts` — GET validates token, calls db.verifyEmail, uses token, shows success page with login link

- [ ] **Step 7:** Implement `logout.ts` — GET reads session cookie, deletes session, clears cookie, redirects to main site

- [ ] **Step 8:** Verify TypeScript compiles

- [ ] **Step 9:** Commit: `"feat: add all route handlers"`

---

## Task 9: App Entry Point

**Files:**
- Create: `forum-auth/src/index.ts`

- [ ] **Step 1:** Wire everything together — create Hono app, apply global middleware (Hono's built-in `logger()` configured for structured JSON output to stdout, CSRF), mount all routes with rate limiting where needed, add `/health` endpoint, start server with `@hono/node-server`. Ensure structured JSON logging captures: failed login attempts, failed NPI verifications, SSO errors, and rate-limit violations (Fly.io captures stdout automatically).

- [ ] **Step 2:** Test server starts locally and `/health` returns OK

- [ ] **Step 3:** Commit: `"feat: wire app entry point with all routes and middleware"`

---

## Task 10: Docker and Fly.io Config

**Files:**
- Create: `forum-auth/Dockerfile`
- Create: `forum-auth/fly.toml`

- [ ] **Step 1:** Write multi-stage Dockerfile — builder stage compiles TypeScript, production stage copies dist + node_modules, creates /data directory for SQLite, exposes port 3000

- [ ] **Step 2:** Write fly.toml — app name, primary region iad, internal port 3000, force HTTPS, auto-stop/start machines, persistent volume mount at /data for SQLite

- [ ] **Step 3:** Write `scripts/backup.sh` — a simple shell script that runs `sqlite3 /data/auth.db ".backup /data/backup.db"` and uploads to Tigris S3 via `aws s3 cp`. Document in fly.toml how to set up a daily scheduled machine (`fly machine run --schedule daily`) to execute this script.

- [ ] **Step 4:** Commit: `"feat: add Dockerfile, Fly.io config, and backup script"`

---

## Task 11: Main Site Updates

**Files:**
- Modify: `llmsfordoctors/src/components/Nav.astro`
- Modify: `llmsfordoctors/src/components/Footer.astro`
- Modify: `llmsfordoctors/src/pages/index.astro`

- [ ] **Step 1:** Add "Community" link to Nav.astro navLinks array (external link to community.llmsfordoctors.com)

- [ ] **Step 2:** Add "Join the Community" link in Footer.astro

- [ ] **Step 3:** Add community CTA section on homepage below workflow grid — dark card with heading, description, and "Join Now" button linking to auth.llmsfordoctors.com/register

- [ ] **Step 4:** Verify Astro build passes

- [ ] **Step 5:** Commit: `"feat: add community links to nav, footer, and homepage"`

---

## Task 12: Discourse Custom Theme

**Files:**
- Create: `forum-auth/discourse-theme/common/common.scss`
- Create: `forum-auth/discourse-theme/common/header.html`
- Create: `forum-auth/discourse-theme/about.json`

- [ ] **Step 1:** Write `about.json` — Discourse theme metadata (name: "LLMs for Doctors Clinical", about: clinical theme)

- [ ] **Step 2:** Write `common/common.scss` — CSS overrides: import Inter + Newsreader from Google Fonts, set heading font-family to Newsreader, body to Inter, header background to clinical-900 (#0f172a), primary color to slate-600, highlight to blue-600, cream body background

- [ ] **Step 3:** Write `common/header.html` — Custom header HTML with "LLMs for Doctors" branding and navigation links back to main site (Workflows, Guides, Tools, Templates, Trials)

- [ ] **Step 4:** Commit: `"feat: add Discourse custom theme with clinical design system"`

---

## Task 13: Discourse Setup Guide

**Files:**
- Create: `forum-auth/DISCOURSE_SETUP.md`

- [ ] **Step 1:** Write comprehensive guide covering: VPS provisioning, Discourse Docker installation, DiscourseConnect SSO configuration (5 settings), category creation (7 categories), theme installation (upload from discourse-theme/ directory), trust level settings, SMTP config, DNS setup for all three subdomains (@, auth, community)

NOTE: DNS configuration and Discourse installation are manual/interactive operations — they cannot be automated by an agent. This guide is a reference for the human operator.

- [ ] **Step 2:** Commit: `"docs: add Discourse installation and configuration guide"`
