# LLMs for Doctors — Site Design Spec

**Domain:** llmsfordoctors.com
**Author:** Jason Gusdorf, MD
**Date:** 2026-03-18
**Status:** Approved

## Mission

Help doctors make their lives easier with AI. A practical, workflow-first resource for clinicians across the LLM adoption spectrum — from curious beginners to experienced experimenters.

## Audience

Practicing physicians and clinicians:
- **Newcomers:** Curious about LLMs but haven't started using them. Need clear on-ramps, HIPAA guidance, and low-friction first steps.
- **Experimenters:** Already using LLMs and want best practices, deeper workflows, honest tool reviews, and a community of peers.

## Site Purpose (Three Pillars)

1. **Educational resource** — teach clinicians how to use LLMs effectively
2. **Curated toolkit** — workflow-organized tool reviews and comparisons
3. **Personal platform** — establish Jason Gusdorf, MD as a thought leader at the medicine-AI intersection

## Information Architecture

### Primary Content Collections

| Collection | Purpose | Example Entry |
|---|---|---|
| **Workflows** | Clinical task-first guides. The core of the site. | "Writing a Discharge Summary with AI" |
| **Guides** | Long-form educational articles and tutorials | "Prompting 101 for Clinicians" |
| **Tools** | Individual LLM tool reviews + comparison tables | "Claude for Clinical Practice — Full Review" |
| **Templates** | Copy-paste prompt template library | "Discharge Summary — Basic Template" |
| **Trials** | Summaries of major LLM-in-medicine studies | "LLMs Match Physicians on Dx Reasoning — NEJM 2024" |
| **Courses** | Structured sequential learning paths (Phase 2 — scaffolded in Phase 1, content deferred) | "Your First 30 Days with Clinical AI" |

### Navigation

Top nav: **Workflows** | **Guides** | **Tools** | **Templates** | **Trials** | **About**

Mobile (< 640px): hamburger menu with full nav. Sidebar on homepage stacks below the workflow grid.

### Content Relationships

All content declares relationships via frontmatter cross-references:

```yaml
# Example workflow frontmatter
title: "Writing a Discharge Summary"
category: note-writing
tools: [claude, gpt-4]
templates: [discharge-summary-basic, discharge-summary-complex]
trials: [llm-diagnostic-nejm-2024]
tags: [discharge, inpatient, documentation]
timeToRead: 5
lastUpdated: 2026-03-18
```

Astro resolves these at build time into bidirectional links:
- Workflow pages show recommended tools, related templates, and supporting trials
- Tool pages show "Used in N workflows"
- Template pages link to their parent workflow
- Trial pages link to guides that cite them
- Tag taxonomy pages enable cross-collection discovery

### Content Schemas

**Workflows:**
```yaml
title: string (required)
category: enum [note-writing, clinical-reasoning, patient-education, literature-review, admin-billing, board-prep] (required)
tools: string[] (required) # slugs referencing tool entries
templates: string[] (optional)
trials: string[] (optional)
tags: string[] (required)
timeToRead: number (required) # minutes
lastUpdated: date (required)
specialty: string[] (optional) # e.g., [cardiology, general-medicine]
```

**Guides:**
```yaml
title: string (required)
description: string (required)
tags: string[] (required)
lastUpdated: date (required)
featured: boolean (optional, default false)
```

**Tools:**
```yaml
title: string (required)
slug: string (required)
vendor: string (required)
rating: number (required) # 1-5
verdict: string (required) # one-line summary
pricing: string (required) # e.g., "Free tier + $20/mo Pro"
hasBaa: boolean (required) # HIPAA Business Associate Agreement
categories: enum[] [note-writing, clinical-reasoning, patient-education, literature-review, admin-billing, general]
lastUpdated: date (required)
```

**Templates:**
```yaml
title: string (required)
category: enum [same as workflows] (required)
targetTool: string (required) # slug referencing a tool entry
workflow: string (optional) # slug referencing parent workflow
tags: string[] (required)
lastUpdated: date (required)
```

**Trials:**
```yaml
title: string (required)
journal: string (required)
year: number (required)
doi: string (required)
keyFinding: string (required) # one-sentence summary
lastUpdated: date (required)
tags: string[] (required)
```

## Page Designs

### Homepage — Hybrid Layout

Compact hero with mission statement and credentials (no photo), immediately into:
- **Main area:** Workflow category grid with icons and counts
- **Sidebar:** 3 most recent guides + 3 most recent tool reviews, auto-populated by publish date. Sticky on desktop (sticks to viewport on scroll). Stacks below workflow grid on mobile (< 640px).
- **Search bar:** "What are you trying to do?" funnels into workflows
- **Newsletter signup:** email capture form (Netlify Forms) in the footer area

### Workflow Pages — Linear Scroll

Single-column, top-to-bottom:
1. Breadcrumb (Workflow → Category)
2. Title, time-to-read, recommended tools badges
3. "The Problem" — clinical context
4. Numbered steps with embedded prompt templates
5. Pitfalls callout
6. Related content (templates, tools, trials)

### Tool Pages

- Overview and your verdict
- Clinical strengths and weaknesses
- BAA / HIPAA compliance status (prominent)
- Pricing and access
- Star rating
- Workflows it's best for (auto-linked)
- Comparison link to category peers

### Template Pages

- Prompt text with highlighted `[PLACEHOLDER]` tags
- Copy-to-clipboard button
- Tool badge (optimized for which LLM)
- Link to parent workflow for context

### Trial Pages

- Citation (journal, year, DOI)
- Key findings summary
- Clinical implications
- Your takeaway
- Links to related guides and workflows

### Guide Pages — Article Layout

Single-column reading layout:
1. Title, description, author, `lastUpdated` date
2. Table of contents (auto-generated from headings)
3. Article body (MDX with embedded components)
4. Related content (workflows, tools, trials referenced in the article)

### About Page

- Mission statement
- Jason's credentials, training, and clinical background
- Why this site exists — the personal story
- Contact form (Netlify Forms)
- Links to personal site and social profiles

### 404 Page

- Friendly message with search bar
- Links to top workflow categories
- "Popular pages" section (manually curated, updated periodically based on analytics)

### Search Results Page

- Grouped by content type (Workflows first, then Guides, Tools, Templates, Trials)
- Empty state: "No results for [query]. Try browsing by category:" with links to workflow categories

## Interactive Components (MDX)

| Component | Description |
|---|---|
| `<PromptPlayground>` | Copyable prompt template with highlighted placeholder tags, tool badge, and "Customize" toggle for specialty context |
| `<OutputComparison>` | Tabbed panels showing different LLM responses to the same prompt, with model name, date tested, and commentary |
| `<Callout type>` | Four types: `hipaa` (red), `pitfall` (amber), `tip` (blue), `evidence` (green) |
| `<ToolCard>` | Inline tool recommendation with star rating, one-line verdict, link to full review |
| `<ComparisonTable>` | See detailed spec below |
| `<TrialSummary>` | Compact trial card with citation, key finding, takeaway, and link to full entry |
| `<TemplateCard>` | Prompt template preview with copy button and link to parent workflow |

### `<ComparisonTable>` Detailed Spec

Columns: Tool Name, Rating (1-5 stars), BAA Available (yes/no), Pricing, Verdict (one-line). Rows are tool entries filtered by category.

- **Category tabs** across the top filter which tools are shown (e.g., "Note Writing", "Clinical Reasoning", "All")
- **Sortable** by clicking column headers (rating, pricing, name)
- **Sticky header row** so column labels remain visible when scrolling long tables
- Data sourced from Tool collection frontmatter at build time

## Design System

### Visual Identity

- **Aesthetic:** Professional and clinical — clean, trustworthy, institutional
- **Typography:**
  - Headings: **Newsreader** (editorial authority)
  - Body: **Inter** (clean, medical-journal readability)
- **Color palette:**
  - Primary: Slate blues (`slate-700` through `slate-900`)
  - Semantic: Red (HIPAA), amber (pitfall), blue (tip), green (evidence)
  - High-contrast for accessibility
- **Icons:** Lucide icon set (open-source, consistent line style, tree-shakeable) for workflow category icons, nav, and UI elements
- **Dark mode:** Built-in toggle, respects system preference
- **Print styles:** Workflow pages and templates render cleanly when printed (hide nav, sidebar, interactive elements; use print-friendly fonts and colors)
- **Accessibility:** WCAG 2.1 AA — proper heading hierarchy, focus indicators, sufficient contrast

### Responsive Breakpoints

- **Mobile:** < 640px — single column, hamburger nav, stacked layout
- **Tablet:** 640px–1024px — two-column where appropriate, condensed nav
- **Desktop:** > 1024px — full layout with sidebar, expanded nav

### Spacing & Readability

Spacing and sizing scale tuned for readability on screens at arm's length (clinic workstations, tablets, phones). Base font 16px, body line-height 1.7, generous paragraph spacing.

## Technical Architecture

### Framework

- **Astro** — static site generator, content-first
- **MDX** — Markdown with embedded interactive components
- **TypeScript** — for all component logic
- **Tailwind CSS** — utility-first styling with custom `clinical` theme
- **Shiki** — build-time syntax highlighting for prompt examples (zero runtime cost)

### Content Authoring

- MDX files in `src/content/` organized by collection
- Astro Content Collections with strict schema validation per type (schemas defined above)
- **Decap CMS** — deferred to Phase 3 (guest contributions). Not needed for Phase 1 when Jason is the sole author.
- Every content entry includes `lastUpdated` in frontmatter. Pages display "Last reviewed: [date]" to signal currency. Content older than 6 months is flagged in build output for review.

### Search & Discovery

- **Pagefind** — full-text client-side search, builds at compile time, ~5KB bundle
- Homepage search bar funnels into workflows first, then broadens
- Category landing pages with filters by specialty and task type
- Tag taxonomy pages for cross-collection discovery
- Auto-generated "Related content" sections from the content relationship graph

### SEO & Distribution

- Auto-generated **OG images** per page via Satori
- **Schema.org** structured data (`MedicalWebPage`, `Article`, `HowTo` for workflows)
- Auto-generated **sitemap.xml** and **robots.txt**
- **RSS feed** for guides and trials
- Canonical URLs for all pages

### Performance

- Static HTML output — zero client JS by default
- Astro islands: JS loads only for interactive components
- Responsive images with WebP/AVIF via Astro's `<Image>`
- Target: **100/100 Lighthouse** across all categories

### Hosting & Infrastructure

- **Netlify** — auto-deploy on git push to `main`
- **Deploy previews** — every PR gets a preview URL
- **Netlify Forms** — newsletter signup and contact form (no backend)
- **Netlify Analytics** — privacy-first, server-side, no cookies, no GDPR banner
- **Branch deploys** — staging branch for reviewing content batches
- Custom domain: **llmsfordoctors.com** with automatic HTTPS
- **Netlify redirects** for clean URL management

## Phasing

### Phase 1 — Launch (This Spec)

- Workflows, Guides, Tools, Templates, Trials collections (Courses collection scaffolded but empty)
- All interactive MDX components
- Homepage with hybrid layout
- Search via Pagefind
- Netlify deployment with custom domain
- RSS feed, SEO, OG images
- Newsletter email signup form (Netlify Forms)
- 404 page and search empty states

### Phase 2 — Courses

- Structured sequential learning paths
- Module progress tracking (client-side localStorage or lightweight auth)

### Phase 3 — Newsletter Sending + Guest Contributions

- Integrate Buttondown or Resend for newsletter delivery (email collection already live from Phase 1)
- Decap CMS for guest contribution editorial workflow

### Phase 4 — Community Forum

- Separate app at `community.llmsfordoctors.com`
- Shared nav and design tokens with main site
- Physician authentication / verification
- Moderated discussion space

## Out of Scope

- Live LLM API connections (all demos use pre-generated static content)
- User accounts or authentication (until forum phase)
- E-commerce or paid content
- Quizzes or knowledge checks
