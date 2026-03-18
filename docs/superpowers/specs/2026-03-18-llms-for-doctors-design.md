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
| **Courses** | Structured sequential learning paths (Phase 2) | "Your First 30 Days with Clinical AI" |

### Navigation

Top nav: **Workflows** | **Guides** | **Tools** | **Templates** | **Trials** | **About**

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
```

Astro resolves these at build time into bidirectional links:
- Workflow pages show recommended tools, related templates, and supporting trials
- Tool pages show "Used in N workflows"
- Template pages link to their parent workflow
- Trial pages link to guides that cite them
- Tag taxonomy pages enable cross-collection discovery

## Page Designs

### Homepage — Hybrid Layout

Compact hero with mission statement and credentials (no photo), immediately into:
- **Main area:** Workflow category grid with icons and counts
- **Sidebar:** Latest guides and tool reviews
- **Search bar:** "What are you trying to do?" funnels into workflows

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

## Interactive Components (MDX)

| Component | Description |
|---|---|
| `<PromptPlayground>` | Copyable prompt template with highlighted placeholder tags, tool badge, and "Customize" toggle for specialty context |
| `<OutputComparison>` | Tabbed panels showing different LLM responses to the same prompt, with model name, date tested, and commentary |
| `<Callout type>` | Four types: `hipaa` (red), `pitfall` (amber), `tip` (blue), `evidence` (green) |
| `<ToolCard>` | Inline tool recommendation with star rating, one-line verdict, link to full review |
| `<ComparisonTable>` | Sortable, filterable tool matrix with category tabs and sticky headers |
| `<TrialSummary>` | Compact trial card with citation, key finding, takeaway, and link to full entry |
| `<TemplateCard>` | Prompt template preview with copy button and link to parent workflow |

## Design System

### Visual Identity

- **Aesthetic:** Professional and clinical — clean, trustworthy, institutional
- **Typography:**
  - Headings: **Newsreader** (editorial authority)
  - Body: **Inter** (clean, medical-journal readability)
- **Color palette:**
  - Primary: Slate blues
  - Semantic: Red (HIPAA), amber (pitfall), blue (tip), green (evidence)
  - High-contrast for accessibility
- **Dark mode:** Built-in toggle, respects system preference
- **Print styles:** Workflow pages and templates render cleanly when printed
- **Accessibility:** WCAG 2.1 AA — proper heading hierarchy, focus indicators, sufficient contrast

### Spacing & Readability

Spacing and sizing scale tuned for readability on screens at arm's length (clinic workstations, tablets, phones).

## Technical Architecture

### Framework

- **Astro** — static site generator, content-first
- **MDX** — Markdown with embedded interactive components
- **TypeScript** — for all component logic
- **Tailwind CSS** — utility-first styling with custom `clinical` theme
- **Shiki** — build-time syntax highlighting for prompt examples (zero runtime cost)

### Content Authoring

- MDX files in `src/content/` organized by collection
- Astro Content Collections with strict schema validation per type
- **Decap CMS** (optional) — open-source, git-based web UI for editing without code. Runs on Netlify with zero backend. Enables future guest contributions.

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
- **Netlify Forms** — contact form and newsletter signup (no backend)
- **Netlify Analytics** — privacy-first, server-side, no cookies, no GDPR banner
- **Branch deploys** — staging branch for reviewing content batches
- Custom domain: **llmsfordoctors.com** with automatic HTTPS
- **Netlify redirects** for clean URL management

## Phasing

### Phase 1 — Launch (This Spec)

- Workflows, Guides, Tools, Templates, Trials collections
- All interactive MDX components
- Homepage with hybrid layout
- Search via Pagefind
- Netlify deployment with custom domain
- RSS feed, SEO, OG images

### Phase 2 — Courses

- Structured sequential learning paths
- Module progress tracking (client-side localStorage or lightweight auth)

### Phase 3 — Community Forum

- Separate app at `community.llmsfordoctors.com`
- Shared nav and design tokens with main site
- Physician authentication / verification
- Moderated discussion space

### Phase 2.5 — Newsletter

- Start collecting emails via Netlify Forms from day one
- Integrate Buttondown or Resend when ready to send

## Out of Scope

- Live LLM API connections (all demos use pre-generated static content)
- User accounts or authentication (until forum phase)
- E-commerce or paid content
- Quizzes or knowledge checks
