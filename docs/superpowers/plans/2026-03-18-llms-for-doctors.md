# LLMs for Doctors — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build llmsfordoctors.com — a workflow-first resource site helping physicians use LLMs in clinical practice.

**Architecture:** Astro static site with MDX content collections, Tailwind CSS design system, Pagefind search, and Netlify deployment. Content organized into 6 collections (workflows, guides, tools, templates, trials, courses) with cross-referencing frontmatter that builds into bidirectional links at compile time.

**Tech Stack:** Astro 5, MDX, TypeScript, Tailwind CSS 4, Pagefind, Satori (OG images), Shiki, Lucide icons, Netlify

**Spec:** `docs/superpowers/specs/2026-03-18-llms-for-doctors-design.md`

---

## File Structure

```
llmsfordoctors/
├── astro.config.ts                  # Astro config: MDX, Tailwind, sitemap, Pagefind
├── tailwind.config.ts               # Clinical theme: colors, typography, spacing
├── tsconfig.json
├── package.json
├── netlify.toml                     # Build command, redirects, headers
├── public/
│   └── fonts/                       # Newsreader + Inter (self-hosted)
├── src/
│   ├── content/
│   │   ├── config.ts                # All collection schemas (Zod)
│   │   ├── workflows/               # .mdx files
│   │   ├── guides/                  # .mdx files
│   │   ├── tools/                   # .mdx files
│   │   ├── templates/               # .mdx files
│   │   ├── trials/                  # .mdx files
│   │   └── courses/                 # scaffolded empty
│   ├── components/
│   │   ├── Nav.astro                # Top nav + mobile hamburger
│   │   ├── Footer.astro             # Footer + newsletter signup
│   │   ├── Hero.astro               # Homepage hero
│   │   ├── WorkflowGrid.astro       # Homepage workflow category grid
│   │   ├── Sidebar.astro            # Homepage sidebar (latest guides/tools)
│   │   ├── Breadcrumb.astro         # Breadcrumb nav for content pages
│   │   ├── RelatedContent.astro     # Cross-referenced related content section
│   │   ├── TagList.astro            # Tag pills linking to taxonomy pages
│   │   ├── SearchBar.astro          # Pagefind search input
│   │   ├── DarkModeToggle.astro     # Dark mode toggle button
│   │   ├── PromptPlayground.astro   # Copyable prompt with placeholders
│   │   ├── OutputComparison.tsx     # Tabbed LLM output comparison (island)
│   │   ├── Callout.astro            # hipaa/pitfall/tip/evidence callouts
│   │   ├── ToolCard.astro           # Inline tool recommendation card
│   │   ├── ComparisonTable.tsx      # Sortable/filterable tool table (island)
│   │   ├── TrialSummary.astro       # Compact trial citation card
│   │   └── TemplateCard.astro       # Template preview with copy button
│   ├── layouts/
│   │   ├── BaseLayout.astro         # HTML shell, head, fonts, dark mode
│   │   ├── ContentLayout.astro      # Single-column article layout (guides, workflows, trials)
│   │   └── ToolLayout.astro         # Tool review page layout
│   ├── pages/
│   │   ├── index.astro              # Homepage
│   │   ├── about.astro              # About page
│   │   ├── 404.astro                # 404 page
│   │   ├── workflows/
│   │   │   ├── index.astro          # Workflow category landing
│   │   │   └── [...slug].astro      # Dynamic workflow pages
│   │   ├── guides/
│   │   │   ├── index.astro          # Guides listing
│   │   │   └── [...slug].astro      # Dynamic guide pages
│   │   ├── tools/
│   │   │   ├── index.astro          # Tools listing + comparison table
│   │   │   └── [...slug].astro      # Dynamic tool pages
│   │   ├── templates/
│   │   │   ├── index.astro          # Templates library
│   │   │   └── [...slug].astro      # Dynamic template pages
│   │   ├── trials/
│   │   │   ├── index.astro          # Trials listing
│   │   │   └── [...slug].astro      # Dynamic trial pages
│   │   ├── tags/
│   │   │   └── [...tag].astro       # Tag taxonomy pages
│   │   └── rss.xml.ts               # RSS feed endpoint
│   ├── styles/
│   │   └── global.css               # Tailwind directives, font-face, print styles
│   └── utils/
│       ├── collections.ts           # Helper functions for querying/cross-referencing collections
│       └── og.ts                    # Satori OG image generation
```

---

## Task 1: Project Scaffolding & Astro Setup

**Files:**
- Create: `llmsfordoctors/package.json`
- Create: `llmsfordoctors/astro.config.ts`
- Create: `llmsfordoctors/tsconfig.json`
- Create: `llmsfordoctors/tailwind.config.ts`
- Create: `llmsfordoctors/netlify.toml`
- Create: `llmsfordoctors/src/styles/global.css`

- [ ] **Step 1: Create project directory**

```bash
mkdir -p llmsfordoctors
cd llmsfordoctors
```

- [ ] **Step 2: Initialize Astro project**

```bash
npm create astro@latest . -- --template minimal --typescript strict --install --git
```

Expected: Astro project scaffolded with `package.json`, `tsconfig.json`, base files.

- [ ] **Step 3: Install dependencies**

```bash
npm install @astrojs/mdx @astrojs/sitemap @astrojs/tailwind @astrojs/netlify astro-pagefind
npm install tailwindcss @tailwindcss/typography lucide-astro
npm install -D @types/node
```

- [ ] **Step 4: Configure Astro**

Write `astro.config.ts`:

```typescript
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import pagefind from 'astro-pagefind';

export default defineConfig({
  site: 'https://llmsfordoctors.com',
  output: 'static',
  integrations: [
    mdx(),
    sitemap(),
    tailwind(),
    pagefind(),
  ],
  markdown: {
    shikiConfig: {
      theme: 'github-light',
      wrap: true,
    },
  },
});
```

- [ ] **Step 5: Configure Tailwind with clinical theme**

Write `tailwind.config.ts`:

```typescript
import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        heading: ['Newsreader', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        clinical: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        callout: {
          hipaa: { bg: '#fef2f2', border: '#ef4444', text: '#991b1b' },
          pitfall: { bg: '#fffbeb', border: '#f59e0b', text: '#92400e' },
          tip: { bg: '#eff6ff', border: '#3b82f6', text: '#1e40af' },
          evidence: { bg: '#f0fdf4', border: '#22c55e', text: '#166534' },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '72ch',
            lineHeight: '1.7',
            fontFamily: 'Inter, system-ui, sans-serif',
            h1: { fontFamily: 'Newsreader, Georgia, serif' },
            h2: { fontFamily: 'Newsreader, Georgia, serif' },
            h3: { fontFamily: 'Newsreader, Georgia, serif' },
          },
        },
      },
    },
  },
  plugins: [typography],
} satisfies Config;
```

- [ ] **Step 6: Write global CSS**

Write `src/styles/global.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  @font-face {
    font-family: 'Newsreader';
    src: url('/fonts/Newsreader-Variable.woff2') format('woff2');
    font-weight: 300 700;
    font-display: swap;
  }
  @font-face {
    font-family: 'Inter';
    src: url('/fonts/Inter-Variable.woff2') format('woff2');
    font-weight: 300 700;
    font-display: swap;
  }
}

@media print {
  nav, footer, .no-print, .dark-mode-toggle { display: none !important; }
  body { font-size: 12pt; line-height: 1.5; color: #000; background: #fff; }
  a { color: #000; text-decoration: underline; }
  a[href]::after { content: ' (' attr(href) ')'; font-size: 0.8em; }
}
```

- [ ] **Step 7: Configure Netlify**

Write `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[headers]]
  for = "/fonts/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

# Trailing slash normalization
[[redirects]]
  from = "/*/"
  to = "/:splat"
  status = 301
```

- [ ] **Step 8: Download fonts to public/fonts/**

```bash
mkdir -p public/fonts
curl -L -o public/fonts/Inter-Variable.woff2 "https://fonts.gstatic.com/s/inter/v18/UcCo3FwrK3iLTcviYwY.woff2"
curl -L -o public/fonts/Newsreader-Variable.woff2 "https://fonts.gstatic.com/s/newsreader/v21/0FlTVPGal19CXHEU.woff2"
```

If the Google Fonts URLs have changed, download the latest variable woff2 files from https://fonts.google.com for Inter and Newsreader and place in `public/fonts/`.

- [ ] **Step 8b: Add robots.txt**

Write `public/robots.txt`:

```
User-agent: *
Allow: /

Sitemap: https://llmsfordoctors.com/sitemap-index.xml
```

- [ ] **Step 9: Verify build**

```bash
npm run build
```

Expected: Clean build with no errors.

- [ ] **Step 10: Commit**

```bash
git add .
git commit -m "feat: scaffold Astro project with Tailwind, MDX, Pagefind, Netlify"
```

---

## Task 2: Content Collection Schemas

**Files:**
- Create: `llmsfordoctors/src/content/config.ts`

- [ ] **Step 1: Write content collection schemas**

Write `src/content/config.ts`:

```typescript
import { defineCollection, z } from 'astro:content';

const workflowCategories = [
  'note-writing',
  'clinical-reasoning',
  'patient-education',
  'literature-review',
  'admin-billing',
  'board-prep',
] as const;

const toolCategories = [
  ...workflowCategories,
  'general',
] as const;

const workflows = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    category: z.enum(workflowCategories),
    tools: z.array(z.string()),
    templates: z.array(z.string()).optional(),
    trials: z.array(z.string()).optional(),
    tags: z.array(z.string()),
    timeToRead: z.number(),
    lastUpdated: z.date(),
    specialty: z.array(z.string()).optional(),
  }),
});

const guides = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    lastUpdated: z.date(),
    featured: z.boolean().default(false),
  }),
});

const tools = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    vendor: z.string(),
    rating: z.number().min(1).max(5),
    verdict: z.string(),
    pricing: z.string(),
    hasBaa: z.boolean(),
    categories: z.array(z.enum(toolCategories)),
    lastUpdated: z.date(),
  }),
});

const templates = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    category: z.enum(workflowCategories),
    targetTool: z.string(),
    workflow: z.string().optional(),
    tags: z.array(z.string()),
    lastUpdated: z.date(),
  }),
});

const trials = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    journal: z.string(),
    year: z.number(),
    doi: z.string(),
    keyFinding: z.string(),
    lastUpdated: z.date(),
    tags: z.array(z.string()),
  }),
});

const courses = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number(),
    lastUpdated: z.date(),
  }),
});

export const collections = {
  workflows,
  guides,
  tools,
  templates,
  trials,
  courses,
};
```

- [ ] **Step 2: Create empty collection directories**

```bash
mkdir -p src/content/{workflows,guides,tools,templates,trials,courses}
```

- [ ] **Step 3: Verify build with empty collections**

```bash
npm run build
```

Expected: Clean build, no schema errors.

- [ ] **Step 4: Commit**

```bash
git add src/content/config.ts
git commit -m "feat: define content collection schemas for all 6 collections"
```

---

## Task 3: Base Layout & Navigation

**Files:**
- Create: `llmsfordoctors/src/layouts/BaseLayout.astro`
- Create: `llmsfordoctors/src/components/Nav.astro`
- Create: `llmsfordoctors/src/components/Footer.astro`
- Create: `llmsfordoctors/src/components/DarkModeToggle.astro`

- [ ] **Step 1: Write BaseLayout**

Write `src/layouts/BaseLayout.astro`:

```astro
---
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';
import '../styles/global.css';

interface Props {
  title: string;
  description?: string;
}

const { title, description = 'Practical AI workflows for clinical practice — by a physician, for physicians.' } = Astro.props;
const canonicalUrl = new URL(Astro.url.pathname, Astro.site);
---
<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{title} | LLMs for Doctors</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={canonicalUrl} />
  <meta property="og:title" content={`${title} | LLMs for Doctors`} />
  <meta property="og:description" content={description} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={canonicalUrl} />
  <script is:inline>
    if (localStorage.getItem('theme') === 'dark' ||
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    }
  </script>
</head>
<body class="font-body text-clinical-800 bg-clinical-50 dark:bg-clinical-900 dark:text-clinical-100 min-h-screen flex flex-col">
  <Nav />
  <main class="flex-1 pt-16">
    <slot />
  </main>
  <Footer />
</body>
</html>
```

- [ ] **Step 2: Write Nav component**

Write `src/components/Nav.astro`:

```astro
---
import DarkModeToggle from './DarkModeToggle.astro';

const navLinks = [
  { href: '/workflows', label: 'Workflows' },
  { href: '/guides', label: 'Guides' },
  { href: '/tools', label: 'Tools' },
  { href: '/templates', label: 'Templates' },
  { href: '/trials', label: 'Trials' },
  { href: '/about', label: 'About' },
];
const currentPath = Astro.url.pathname;
---
<nav class="fixed top-0 left-0 right-0 z-50 bg-clinical-900/97 backdrop-blur-sm">
  <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
    <a href="/" class="font-heading text-lg text-clinical-200 hover:text-white transition-colors">
      LLMs for Doctors
    </a>

    {/* Desktop nav */}
    <div class="hidden sm:flex items-center gap-6">
      {navLinks.map(link => (
        <a
          href={link.href}
          class:list={[
            'text-sm font-medium tracking-wide uppercase transition-colors',
            currentPath.startsWith(link.href)
              ? 'text-white'
              : 'text-clinical-400 hover:text-clinical-200',
          ]}
        >
          {link.label}
        </a>
      ))}
      <DarkModeToggle />
    </div>

    {/* Mobile hamburger */}
    <button
      id="mobile-menu-btn"
      class="sm:hidden text-clinical-400 hover:text-white"
      aria-label="Open menu"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  </div>

  {/* Mobile menu */}
  <div id="mobile-menu" class="hidden sm:hidden bg-clinical-900 border-t border-clinical-800 px-6 pb-4">
    {navLinks.map(link => (
      <a
        href={link.href}
        class:list={[
          'block py-2 text-sm font-medium tracking-wide uppercase transition-colors',
          currentPath.startsWith(link.href)
            ? 'text-white'
            : 'text-clinical-400 hover:text-clinical-200',
        ]}
      >
        {link.label}
      </a>
    ))}
    <div class="pt-2">
      <DarkModeToggle />
    </div>
  </div>
</nav>

<script>
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  btn?.addEventListener('click', () => menu?.classList.toggle('hidden'));
</script>
```

- [ ] **Step 3: Write Footer component**

Write `src/components/Footer.astro`:

```astro
---
---
<footer class="bg-clinical-900 text-clinical-400 py-12 no-print">
  <div class="max-w-6xl mx-auto px-6">
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
      <div>
        <h3 class="font-heading text-white text-lg mb-3">LLMs for Doctors</h3>
        <p class="text-sm leading-relaxed">
          Practical AI workflows for clinical practice — by a physician, for physicians.
        </p>
      </div>
      <div>
        <h4 class="text-xs font-semibold uppercase tracking-widest text-clinical-500 mb-3">Navigate</h4>
        <ul class="space-y-1.5 text-sm">
          <li><a href="/workflows" class="hover:text-white transition-colors">Workflows</a></li>
          <li><a href="/guides" class="hover:text-white transition-colors">Guides</a></li>
          <li><a href="/tools" class="hover:text-white transition-colors">Tools</a></li>
          <li><a href="/templates" class="hover:text-white transition-colors">Templates</a></li>
          <li><a href="/trials" class="hover:text-white transition-colors">Trials</a></li>
        </ul>
      </div>
      <div>
        <h4 class="text-xs font-semibold uppercase tracking-widest text-clinical-500 mb-3">Stay Updated</h4>
        <form name="newsletter" method="POST" data-netlify="true" class="flex gap-2">
          <input type="hidden" name="form-name" value="newsletter" />
          <input
            type="email"
            name="email"
            placeholder="your@email.com"
            required
            class="flex-1 bg-clinical-800 border border-clinical-700 rounded px-3 py-2 text-sm text-white placeholder-clinical-500 focus:outline-none focus:border-clinical-500"
          />
          <button type="submit" class="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded transition-colors">
            Subscribe
          </button>
        </form>
        <p class="text-xs text-clinical-600 mt-2">No spam. Unsubscribe anytime.</p>
      </div>
    </div>
    <div class="border-t border-clinical-800 pt-6 text-xs text-clinical-600 text-center">
      &copy; {new Date().getFullYear()} Jason Gusdorf, MD. All rights reserved.
    </div>
  </div>
</footer>
```

- [ ] **Step 4: Write DarkModeToggle component**

Write `src/components/DarkModeToggle.astro`:

```astro
---
---
<button
  id="dark-mode-toggle"
  class="dark-mode-toggle text-clinical-400 hover:text-white transition-colors"
  aria-label="Toggle dark mode"
>
  <svg class="w-5 h-5 hidden dark:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
  <svg class="w-5 h-5 block dark:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
</button>

<script>
  document.getElementById('dark-mode-toggle')?.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
</script>
```

- [ ] **Step 5: Verify build**

```bash
npm run build
```

Expected: Clean build.

- [ ] **Step 6: Commit**

```bash
git add src/layouts/BaseLayout.astro src/components/Nav.astro src/components/Footer.astro src/components/DarkModeToggle.astro
git commit -m "feat: add base layout with nav, footer, dark mode, newsletter form"
```

---

## Task 4: MDX Components — Callout, PromptPlayground, ToolCard, TrialSummary, TemplateCard

**Files:**
- Create: `llmsfordoctors/src/components/Callout.astro`
- Create: `llmsfordoctors/src/components/PromptPlayground.astro`
- Create: `llmsfordoctors/src/components/ToolCard.astro`
- Create: `llmsfordoctors/src/components/TrialSummary.astro`
- Create: `llmsfordoctors/src/components/TemplateCard.astro`

- [ ] **Step 1: Write Callout component**

Write `src/components/Callout.astro`:

```astro
---
interface Props {
  type: 'hipaa' | 'pitfall' | 'tip' | 'evidence';
  title?: string;
}

const { type, title } = Astro.props;

const config = {
  hipaa: { bg: 'bg-red-50 dark:bg-red-950', border: 'border-red-500', text: 'text-red-800 dark:text-red-200', icon: '🔒', defaultTitle: 'HIPAA Warning' },
  pitfall: { bg: 'bg-amber-50 dark:bg-amber-950', border: 'border-amber-500', text: 'text-amber-800 dark:text-amber-200', icon: '⚠️', defaultTitle: 'Clinical Pitfall' },
  tip: { bg: 'bg-blue-50 dark:bg-blue-950', border: 'border-blue-500', text: 'text-blue-800 dark:text-blue-200', icon: '💡', defaultTitle: 'Pro Tip' },
  evidence: { bg: 'bg-green-50 dark:bg-green-950', border: 'border-green-500', text: 'text-green-800 dark:text-green-200', icon: '📊', defaultTitle: 'Evidence Note' },
};

const c = config[type];
---
<aside class:list={['rounded-lg border-l-4 p-4 my-6 no-print', c.bg, c.border]}>
  <p class:list={['font-semibold text-sm mb-1', c.text]}>
    {c.icon} {title || c.defaultTitle}
  </p>
  <div class:list={['text-sm leading-relaxed', c.text]}>
    <slot />
  </div>
</aside>
```

- [ ] **Step 2: Write PromptPlayground component**

Write `src/components/PromptPlayground.astro`:

```astro
---
interface Props {
  tool?: string;
  title?: string;
}

const { tool, title = 'Prompt Template' } = Astro.props;
const id = `prompt-${Math.random().toString(36).slice(2, 9)}`;
---
<div class="my-6 rounded-lg border border-clinical-200 dark:border-clinical-700 overflow-hidden">
  <div class="flex items-center justify-between px-4 py-2 bg-clinical-100 dark:bg-clinical-800 border-b border-clinical-200 dark:border-clinical-700">
    <span class="text-sm font-semibold text-clinical-700 dark:text-clinical-300">{title}</span>
    <div class="flex items-center gap-2">
      {tool && (
        <span class="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded font-medium">
          {tool}
        </span>
      )}
      <button
        data-copy-target={id}
        class="text-xs bg-clinical-200 dark:bg-clinical-700 hover:bg-clinical-300 dark:hover:bg-clinical-600 text-clinical-700 dark:text-clinical-300 px-2.5 py-1 rounded transition-colors"
      >
        Copy
      </button>
    </div>
  </div>
  <pre id={id} class="p-4 text-sm leading-relaxed bg-white dark:bg-clinical-900 text-clinical-800 dark:text-clinical-200 whitespace-pre-wrap overflow-x-auto"><slot /></pre>
</div>

<script>
  document.querySelectorAll('[data-copy-target]').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = (btn as HTMLElement).dataset.copyTarget;
      const el = document.getElementById(targetId!);
      if (el) {
        navigator.clipboard.writeText(el.textContent || '');
        btn.textContent = 'Copied!';
        setTimeout(() => btn.textContent = 'Copy', 2000);
      }
    });
  });
</script>
```

- [ ] **Step 3: Write ToolCard component**

Write `src/components/ToolCard.astro`:

```astro
---
interface Props {
  name: string;
  slug: string;
  rating: number;
  verdict: string;
  hasBaa?: boolean;
}

const { name, slug, rating, verdict, hasBaa } = Astro.props;
const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
---
<a href={`/tools/${slug}`} class="block my-4 p-4 rounded-lg border border-clinical-200 dark:border-clinical-700 hover:shadow-md transition-shadow bg-white dark:bg-clinical-800">
  <div class="flex items-center justify-between mb-1">
    <span class="font-heading font-semibold text-clinical-800 dark:text-clinical-100">{name}</span>
    <span class="text-amber-500 text-sm tracking-wider">{stars}</span>
  </div>
  <p class="text-sm text-clinical-500 dark:text-clinical-400">{verdict}</p>
  {hasBaa && (
    <span class="inline-block mt-2 text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-0.5 rounded font-medium">
      BAA Available
    </span>
  )}
</a>
```

- [ ] **Step 4: Write TrialSummary component**

Write `src/components/TrialSummary.astro`:

```astro
---
interface Props {
  title: string;
  slug: string;
  journal: string;
  year: number;
  keyFinding: string;
}

const { title, slug, journal, year, keyFinding } = Astro.props;
---
<a href={`/trials/${slug}`} class="block my-4 p-4 rounded-lg border border-clinical-200 dark:border-clinical-700 hover:shadow-md transition-shadow bg-white dark:bg-clinical-800">
  <div class="flex items-center gap-2 mb-1">
    <span class="text-xs font-bold text-blue-600 dark:text-blue-400">{year}</span>
    <span class="text-xs italic text-clinical-500">{journal}</span>
  </div>
  <h4 class="font-heading text-sm font-semibold text-clinical-800 dark:text-clinical-100 mb-1">{title}</h4>
  <p class="text-xs text-clinical-500 dark:text-clinical-400">{keyFinding}</p>
</a>
```

- [ ] **Step 5: Write TemplateCard component**

Write `src/components/TemplateCard.astro`:

```astro
---
interface Props {
  title: string;
  slug: string;
  targetTool: string;
  preview: string;
}

const { title, slug, targetTool, preview } = Astro.props;
const cardId = `tpl-${Math.random().toString(36).slice(2, 9)}`;
---
<div class="my-4 p-4 rounded-lg border border-clinical-200 dark:border-clinical-700 bg-white dark:bg-clinical-800">
  <div class="flex items-center justify-between mb-2">
    <a href={`/templates/${slug}`} class="font-heading text-sm font-semibold text-clinical-800 dark:text-clinical-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
      {title}
    </a>
    <div class="flex items-center gap-2">
      <span class="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded font-medium">{targetTool}</span>
      <button data-copy-target={cardId} class="text-xs bg-clinical-200 dark:bg-clinical-700 hover:bg-clinical-300 dark:hover:bg-clinical-600 text-clinical-700 dark:text-clinical-300 px-2.5 py-1 rounded transition-colors">
        Copy
      </button>
    </div>
  </div>
  <pre id={cardId} class="text-xs text-clinical-600 dark:text-clinical-400 whitespace-pre-wrap leading-relaxed">{preview}</pre>
</div>
```

- [ ] **Step 6: Verify build**

```bash
npm run build
```

Expected: Clean build.

- [ ] **Step 7: Commit**

```bash
git add src/components/Callout.astro src/components/PromptPlayground.astro src/components/ToolCard.astro src/components/TrialSummary.astro src/components/TemplateCard.astro
git commit -m "feat: add MDX components — Callout, PromptPlayground, ToolCard, TrialSummary, TemplateCard"
```

---

## Task 5: MDX Components — OutputComparison & ComparisonTable (Islands)

**Files:**
- Create: `llmsfordoctors/src/components/OutputComparison.tsx`
- Create: `llmsfordoctors/src/components/ComparisonTable.tsx`

- [ ] **Step 1: Install Preact for islands**

```bash
npx astro add preact
```

- [ ] **Step 2: Write OutputComparison island**

Write `src/components/OutputComparison.tsx`:

```tsx
import { useState } from 'preact/hooks';

interface Output {
  model: string;
  dateTested: string;
  content: string;
  commentary?: string;
}

interface Props {
  prompt: string;
  outputs: Output[];
}

export default function OutputComparison({ prompt, outputs }: Props) {
  const [active, setActive] = useState(0);

  return (
    <div class="my-6 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <p class="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">Prompt</p>
        <p class="text-sm text-gray-700 dark:text-gray-300 mt-1">{prompt}</p>
      </div>

      <div class="flex border-b border-gray-200 dark:border-gray-700">
        {outputs.map((o, i) => (
          <button
            key={o.model}
            onClick={() => setActive(i)}
            class={`px-4 py-2 text-sm font-medium transition-colors ${
              i === active
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {o.model}
          </button>
        ))}
      </div>

      <div class="p-4 bg-white dark:bg-gray-900">
        <p class="text-xs text-gray-400 mb-2">Tested: {outputs[active].dateTested}</p>
        <div class="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
          {outputs[active].content}
        </div>
        {outputs[active].commentary && (
          <div class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <p class="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-1">Commentary</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">{outputs[active].commentary}</p>
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Write ComparisonTable island**

Write `src/components/ComparisonTable.tsx`:

```tsx
import { useState, useMemo } from 'preact/hooks';

interface Tool {
  name: string;
  slug: string;
  rating: number;
  hasBaa: boolean;
  pricing: string;
  verdict: string;
  categories: string[];
}

interface Props {
  tools: Tool[];
  categories: string[];
}

type SortKey = 'name' | 'rating' | 'pricing';
type SortDir = 'asc' | 'desc';

export default function ComparisonTable({ tools, categories }: Props) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortKey, setSortKey] = useState<SortKey>('rating');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const filtered = useMemo(() => {
    let result = activeCategory === 'all'
      ? tools
      : tools.filter(t => t.categories.includes(activeCategory));

    result = [...result].sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      if (sortKey === 'name') return dir * a.name.localeCompare(b.name);
      if (sortKey === 'rating') return dir * (a.rating - b.rating);
      return dir * a.pricing.localeCompare(b.pricing);
    });

    return result;
  }, [activeCategory, sortKey, sortDir, tools]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir(key === 'rating' ? 'desc' : 'asc'); }
  };

  const stars = (n: number) => '★'.repeat(n) + '☆'.repeat(5 - n);
  const sortIcon = (key: SortKey) => sortKey === key ? (sortDir === 'asc' ? ' ↑' : ' ↓') : '';

  return (
    <div class="my-6">
      <div class="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setActiveCategory('all')}
          class={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            activeCategory === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            class={`px-3 py-1 rounded text-sm font-medium transition-colors capitalize ${
              activeCategory === cat
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {cat.replace(/-/g, ' ')}
          </button>
        ))}
      </div>

      <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table class="w-full text-sm">
          <thead class="sticky top-0 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th class="text-left px-4 py-3 font-semibold cursor-pointer hover:text-blue-600" onClick={() => toggleSort('name')}>
                Tool{sortIcon('name')}
              </th>
              <th class="text-left px-4 py-3 font-semibold cursor-pointer hover:text-blue-600" onClick={() => toggleSort('rating')}>
                Rating{sortIcon('rating')}
              </th>
              <th class="text-left px-4 py-3 font-semibold">BAA</th>
              <th class="text-left px-4 py-3 font-semibold cursor-pointer hover:text-blue-600" onClick={() => toggleSort('pricing')}>
                Pricing{sortIcon('pricing')}
              </th>
              <th class="text-left px-4 py-3 font-semibold">Verdict</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(tool => (
              <tr key={tool.slug} class="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td class="px-4 py-3">
                  <a href={`/tools/${tool.slug}`} class="font-medium text-blue-600 dark:text-blue-400 hover:underline">
                    {tool.name}
                  </a>
                </td>
                <td class="px-4 py-3 text-amber-500">{stars(tool.rating)}</td>
                <td class="px-4 py-3">
                  {tool.hasBaa
                    ? <span class="text-green-600 dark:text-green-400 font-medium">Yes</span>
                    : <span class="text-red-500 dark:text-red-400">No</span>
                  }
                </td>
                <td class="px-4 py-3 text-gray-600 dark:text-gray-400">{tool.pricing}</td>
                <td class="px-4 py-3 text-gray-600 dark:text-gray-400">{tool.verdict}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Verify build**

```bash
npm run build
```

Expected: Clean build.

- [ ] **Step 5: Commit**

```bash
git add src/components/OutputComparison.tsx src/components/ComparisonTable.tsx
git commit -m "feat: add interactive island components — OutputComparison, ComparisonTable"
```

---

## Task 6: Collection Utilities & Content Layout

**Files:**
- Create: `llmsfordoctors/src/utils/collections.ts`
- Create: `llmsfordoctors/src/layouts/ContentLayout.astro`
- Create: `llmsfordoctors/src/layouts/ToolLayout.astro`
- Create: `llmsfordoctors/src/components/Breadcrumb.astro`
- Create: `llmsfordoctors/src/components/RelatedContent.astro`
- Create: `llmsfordoctors/src/components/TagList.astro`
- Create: `llmsfordoctors/src/components/SearchBar.astro`

- [ ] **Step 1: Write collection utility helpers**

Write `src/utils/collections.ts`:

```typescript
import { getCollection } from 'astro:content';

export async function getToolsBySlug(slugs: string[]) {
  const allTools = await getCollection('tools');
  return allTools.filter(t => slugs.includes(t.data.slug));
}

export async function getWorkflowsForTool(toolSlug: string) {
  const allWorkflows = await getCollection('workflows');
  return allWorkflows.filter(w => w.data.tools.includes(toolSlug));
}

export async function getTemplatesForWorkflow(workflowSlug: string) {
  const allTemplates = await getCollection('templates');
  return allTemplates.filter(t => t.data.workflow === workflowSlug);
}

export async function getTrialsBySlug(slugs: string[]) {
  const allTrials = await getCollection('trials');
  return allTrials.filter(t => slugs.includes(t.slug));
}

export async function getLatestGuides(count: number) {
  const guides = await getCollection('guides');
  return guides
    .sort((a, b) => b.data.lastUpdated.getTime() - a.data.lastUpdated.getTime())
    .slice(0, count);
}

export async function getLatestTools(count: number) {
  const tools = await getCollection('tools');
  return tools
    .sort((a, b) => b.data.lastUpdated.getTime() - a.data.lastUpdated.getTime())
    .slice(0, count);
}

export async function getAllTags() {
  const [workflows, guides, tools, templates, trials] = await Promise.all([
    getCollection('workflows'),
    getCollection('guides'),
    getCollection('tools'),
    getCollection('templates'),
    getCollection('trials'),
  ]);

  const tagCounts = new Map<string, number>();
  const addTags = (tags: string[]) => tags.forEach(t => tagCounts.set(t, (tagCounts.get(t) || 0) + 1));

  workflows.forEach(e => addTags(e.data.tags));
  guides.forEach(e => addTags(e.data.tags));
  templates.forEach(e => addTags(e.data.tags));
  trials.forEach(e => addTags(e.data.tags));

  return tagCounts;
}
```

- [ ] **Step 2: Write Breadcrumb component**

Write `src/components/Breadcrumb.astro`:

```astro
---
interface Crumb {
  label: string;
  href?: string;
}

interface Props {
  crumbs: Crumb[];
}

const { crumbs } = Astro.props;
---
<nav aria-label="Breadcrumb" class="text-sm text-clinical-500 dark:text-clinical-400 mb-4">
  <ol class="flex items-center gap-1.5">
    {crumbs.map((crumb, i) => (
      <li class="flex items-center gap-1.5">
        {i > 0 && <span class="text-clinical-300 dark:text-clinical-600">→</span>}
        {crumb.href ? (
          <a href={crumb.href} class="hover:text-clinical-700 dark:hover:text-clinical-200 transition-colors">
            {crumb.label}
          </a>
        ) : (
          <span class="text-clinical-700 dark:text-clinical-200 font-medium">{crumb.label}</span>
        )}
      </li>
    ))}
  </ol>
</nav>
```

- [ ] **Step 3: Write RelatedContent component**

Write `src/components/RelatedContent.astro`:

```astro
---
interface RelatedItem {
  title: string;
  href: string;
  type: 'workflow' | 'guide' | 'tool' | 'template' | 'trial';
}

interface Props {
  items: RelatedItem[];
}

const { items } = Astro.props;

const typeColors: Record<string, string> = {
  workflow: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
  guide: 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300',
  tool: 'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300',
  template: 'bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300',
  trial: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300',
};
---
{items.length > 0 && (
  <section class="mt-12 pt-8 border-t border-clinical-200 dark:border-clinical-700">
    <h3 class="font-heading text-lg text-clinical-800 dark:text-clinical-100 mb-4">Related Content</h3>
    <div class="grid gap-2">
      {items.map(item => (
        <a href={item.href} class="flex items-center gap-3 p-3 rounded-lg hover:bg-clinical-100 dark:hover:bg-clinical-800 transition-colors">
          <span class:list={['text-xs font-semibold px-2 py-0.5 rounded capitalize', typeColors[item.type]]}>
            {item.type}
          </span>
          <span class="text-sm text-clinical-700 dark:text-clinical-300">{item.title}</span>
        </a>
      ))}
    </div>
  </section>
)}
```

- [ ] **Step 4: Write TagList component**

Write `src/components/TagList.astro`:

```astro
---
interface Props {
  tags: string[];
}

const { tags } = Astro.props;
---
<div class="flex flex-wrap gap-1.5">
  {tags.map(tag => (
    <a
      href={`/tags/${tag}`}
      class="text-xs bg-clinical-100 dark:bg-clinical-800 text-clinical-600 dark:text-clinical-400 px-2 py-0.5 rounded hover:bg-clinical-200 dark:hover:bg-clinical-700 transition-colors"
    >
      {tag}
    </a>
  ))}
</div>
```

- [ ] **Step 5: Write SearchBar component**

Write `src/components/SearchBar.astro`:

```astro
---
interface Props {
  placeholder?: string;
  class?: string;
}

const { placeholder = 'What are you trying to do?', class: className } = Astro.props;
---
<div class:list={['relative', className]} id="search-container">
  <div id="pagefind-search" data-placeholder={placeholder}></div>
</div>

<script>
  import '/pagefind/pagefind-ui.js';
  const container = document.getElementById('pagefind-search');
  if (container) {
    new (window as any).PagefindUI({
      element: container,
      showSubResults: true,
      placeholder: container.dataset.placeholder,
    });
  }
</script>

<link href="/pagefind/pagefind-ui.css" rel="stylesheet" />
```

- [ ] **Step 6: Write ContentLayout**

Write `src/layouts/ContentLayout.astro`:

```astro
---
import BaseLayout from './BaseLayout.astro';
import Breadcrumb from '../components/Breadcrumb.astro';
import TagList from '../components/TagList.astro';
import RelatedContent from '../components/RelatedContent.astro';

interface Props {
  title: string;
  description?: string;
  lastUpdated?: Date;
  tags?: string[];
  timeToRead?: number;
  breadcrumbs: { label: string; href?: string }[];
  relatedItems?: { title: string; href: string; type: 'workflow' | 'guide' | 'tool' | 'template' | 'trial' }[];
}

const { title, description, lastUpdated, tags, timeToRead, breadcrumbs, relatedItems = [] } = Astro.props;
---
<BaseLayout title={title} description={description}>
  <article class="max-w-3xl mx-auto px-6 py-12">
    <Breadcrumb crumbs={breadcrumbs} />

    <header class="mb-8">
      <h1 class="font-heading text-3xl sm:text-4xl font-semibold text-clinical-900 dark:text-white mb-3">
        {title}
      </h1>
      <div class="flex flex-wrap items-center gap-3 text-sm text-clinical-500 dark:text-clinical-400">
        {timeToRead && <span>⏱ {timeToRead} min read</span>}
        {lastUpdated && (
          <span>Last reviewed: {lastUpdated.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
        )}
      </div>
      {tags && tags.length > 0 && (
        <div class="mt-3">
          <TagList tags={tags} />
        </div>
      )}
    </header>

    <div class="prose prose-lg dark:prose-invert max-w-none">
      <slot />
    </div>

    <RelatedContent items={relatedItems} />
  </article>
</BaseLayout>
```

- [ ] **Step 7: Write ToolLayout**

Write `src/layouts/ToolLayout.astro`:

```astro
---
import BaseLayout from './BaseLayout.astro';
import Breadcrumb from '../components/Breadcrumb.astro';
import RelatedContent from '../components/RelatedContent.astro';

interface Props {
  title: string;
  vendor: string;
  rating: number;
  verdict: string;
  pricing: string;
  hasBaa: boolean;
  lastUpdated: Date;
  relatedWorkflows?: { title: string; href: string }[];
}

const { title, vendor, rating, verdict, pricing, hasBaa, lastUpdated, relatedWorkflows = [] } = Astro.props;
const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
---
<BaseLayout title={title} description={verdict}>
  <article class="max-w-3xl mx-auto px-6 py-12">
    <Breadcrumb crumbs={[{ label: 'Tools', href: '/tools' }, { label: title }]} />

    <header class="mb-8">
      <div class="flex items-center gap-2 mb-2">
        <span class="text-xs font-semibold uppercase tracking-wider text-clinical-500">{vendor}</span>
      </div>
      <h1 class="font-heading text-3xl sm:text-4xl font-semibold text-clinical-900 dark:text-white mb-3">
        {title}
      </h1>
      <div class="flex flex-wrap items-center gap-4 text-sm">
        <span class="text-amber-500 text-lg tracking-wider">{stars}</span>
        <span class="text-clinical-500 dark:text-clinical-400">{pricing}</span>
        {hasBaa ? (
          <span class="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-semibold px-2.5 py-1 rounded">BAA Available</span>
        ) : (
          <span class="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 text-xs font-semibold px-2.5 py-1 rounded">No BAA</span>
        )}
      </div>
      <p class="mt-3 text-lg text-clinical-600 dark:text-clinical-300 italic">{verdict}</p>
      <p class="mt-2 text-sm text-clinical-500">Last reviewed: {lastUpdated.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
    </header>

    <div class="prose prose-lg dark:prose-invert max-w-none">
      <slot />
    </div>

    {relatedWorkflows.length > 0 && (
      <RelatedContent items={relatedWorkflows.map(w => ({ ...w, type: 'workflow' as const }))} />
    )}
  </article>
</BaseLayout>
```

- [ ] **Step 8: Verify build**

```bash
npm run build
```

Expected: Clean build.

- [ ] **Step 9: Commit**

```bash
git add src/utils/ src/layouts/ src/components/Breadcrumb.astro src/components/RelatedContent.astro src/components/TagList.astro src/components/SearchBar.astro
git commit -m "feat: add content layouts, collection utils, breadcrumb, tags, search, related content"
```

---

## Task 7: Homepage

**Files:**
- Create: `llmsfordoctors/src/components/Hero.astro`
- Create: `llmsfordoctors/src/components/WorkflowGrid.astro`
- Create: `llmsfordoctors/src/components/Sidebar.astro`
- Create: `llmsfordoctors/src/pages/index.astro`

- [ ] **Step 1: Write Hero component**

Write `src/components/Hero.astro`:

```astro
---
import SearchBar from './SearchBar.astro';
---
<section class="bg-clinical-900 text-white py-12 sm:py-16">
  <div class="max-w-6xl mx-auto px-6 text-center">
    <p class="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400 mb-3">LLMs for Doctors</p>
    <h1 class="font-heading text-3xl sm:text-5xl font-semibold mb-4 leading-tight">
      Make your clinical life easier with AI
    </h1>
    <p class="text-clinical-400 max-w-xl mx-auto mb-8 leading-relaxed">
      Evidence-based AI workflows for clinical practice — by Jason Gusdorf, MD
    </p>
    <div class="max-w-lg mx-auto">
      <SearchBar placeholder="What are you trying to do? (e.g., write a discharge summary)" />
    </div>
  </div>
</section>
```

- [ ] **Step 2: Write WorkflowGrid component**

Write `src/components/WorkflowGrid.astro`:

```astro
---
import { getCollection } from 'astro:content';

const workflows = await getCollection('workflows');

const categories = [
  { slug: 'note-writing', label: 'Note Writing', icon: '📝' },
  { slug: 'clinical-reasoning', label: 'Clinical Reasoning', icon: '🧠' },
  { slug: 'patient-education', label: 'Patient Education', icon: '🗣️' },
  { slug: 'literature-review', label: 'Literature Review', icon: '📚' },
  { slug: 'admin-billing', label: 'Admin & Billing', icon: '📋' },
  { slug: 'board-prep', label: 'Board Prep', icon: '🎓' },
];

const counts = Object.fromEntries(
  categories.map(c => [c.slug, workflows.filter(w => w.data.category === c.slug).length])
);
---
<div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
  {categories.map(cat => (
    <a
      href={`/workflows?category=${cat.slug}`}
      class="flex flex-col items-center p-4 sm:p-6 rounded-lg border border-clinical-200 dark:border-clinical-700 bg-white dark:bg-clinical-800 hover:shadow-md hover:border-clinical-300 dark:hover:border-clinical-600 transition-all text-center"
    >
      <span class="text-2xl mb-2">{cat.icon}</span>
      <span class="font-heading font-semibold text-sm text-clinical-800 dark:text-clinical-100">{cat.label}</span>
      <span class="text-xs text-clinical-500 dark:text-clinical-400 mt-1">{counts[cat.slug]} workflows</span>
    </a>
  ))}
</div>
```

- [ ] **Step 3: Write Sidebar component**

Write `src/components/Sidebar.astro`:

```astro
---
import { getLatestGuides, getLatestTools } from '../utils/collections';

const guides = await getLatestGuides(3);
const tools = await getLatestTools(3);
---
<aside class="lg:sticky lg:top-20 space-y-6">
  <div>
    <h3 class="text-xs font-semibold uppercase tracking-widest text-clinical-500 dark:text-clinical-400 mb-3">Latest Guides</h3>
    <div class="space-y-2">
      {guides.map(guide => (
        <a href={`/guides/${guide.slug}`} class="block p-3 rounded-lg bg-white dark:bg-clinical-800 border border-clinical-200 dark:border-clinical-700 hover:shadow-sm transition-shadow">
          <p class="text-sm font-medium text-clinical-800 dark:text-clinical-100">{guide.data.title}</p>
          <p class="text-xs text-clinical-500 dark:text-clinical-400 mt-0.5">{guide.data.description}</p>
        </a>
      ))}
      {guides.length === 0 && (
        <p class="text-sm text-clinical-400 italic">Coming soon</p>
      )}
    </div>
  </div>

  <div>
    <h3 class="text-xs font-semibold uppercase tracking-widest text-clinical-500 dark:text-clinical-400 mb-3">Latest Tool Reviews</h3>
    <div class="space-y-2">
      {tools.map(tool => (
        <a href={`/tools/${tool.slug}`} class="block p-3 rounded-lg bg-white dark:bg-clinical-800 border border-clinical-200 dark:border-clinical-700 hover:shadow-sm transition-shadow">
          <div class="flex items-center justify-between">
            <p class="text-sm font-medium text-clinical-800 dark:text-clinical-100">{tool.data.title}</p>
            <span class="text-amber-500 text-xs">{'★'.repeat(tool.data.rating)}</span>
          </div>
          <p class="text-xs text-clinical-500 dark:text-clinical-400 mt-0.5">{tool.data.verdict}</p>
        </a>
      ))}
      {tools.length === 0 && (
        <p class="text-sm text-clinical-400 italic">Coming soon</p>
      )}
    </div>
  </div>
</aside>
```

- [ ] **Step 4: Write homepage**

Write `src/pages/index.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Hero from '../components/Hero.astro';
import WorkflowGrid from '../components/WorkflowGrid.astro';
import Sidebar from '../components/Sidebar.astro';
---
<BaseLayout title="Home">
  <Hero />

  <section class="max-w-6xl mx-auto px-6 py-12">
    <div class="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
      <div>
        <h2 class="font-heading text-2xl font-semibold text-clinical-900 dark:text-white mb-6">
          Browse by Workflow
        </h2>
        <WorkflowGrid />
      </div>
      <Sidebar />
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 5: Verify with dev server**

```bash
npm run dev
```

Open `http://localhost:4321` and verify homepage renders with hero, empty workflow grid, and sidebar.

- [ ] **Step 6: Commit**

```bash
git add src/components/Hero.astro src/components/WorkflowGrid.astro src/components/Sidebar.astro src/pages/index.astro
git commit -m "feat: add homepage with hero, workflow grid, and sidebar"
```

---

## Task 8: Dynamic Content Pages

**Files:**
- Create: `llmsfordoctors/src/pages/workflows/index.astro`
- Create: `llmsfordoctors/src/pages/workflows/[...slug].astro`
- Create: `llmsfordoctors/src/pages/guides/index.astro`
- Create: `llmsfordoctors/src/pages/guides/[...slug].astro`
- Create: `llmsfordoctors/src/pages/tools/index.astro`
- Create: `llmsfordoctors/src/pages/tools/[...slug].astro`
- Create: `llmsfordoctors/src/pages/templates/index.astro`
- Create: `llmsfordoctors/src/pages/templates/[...slug].astro`
- Create: `llmsfordoctors/src/pages/trials/index.astro`
- Create: `llmsfordoctors/src/pages/trials/[...slug].astro`
- Create: `llmsfordoctors/src/pages/tags/[...tag].astro`

- [ ] **Step 1: Write workflow listing page**

Write `src/pages/workflows/index.astro`:

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import { getCollection } from 'astro:content';

const workflows = await getCollection('workflows');
const categories = [...new Set(workflows.map(w => w.data.category))].sort();
---
<BaseLayout title="Workflows" description="Clinical AI workflows organized by task">
  <div class="max-w-4xl mx-auto px-6 py-12">
    <h1 class="font-heading text-3xl sm:text-4xl font-semibold text-clinical-900 dark:text-white mb-2">Workflows</h1>
    <p class="text-clinical-500 dark:text-clinical-400 mb-8">Step-by-step guides for using AI in your clinical tasks.</p>

    {categories.map(category => {
      const catWorkflows = workflows.filter(w => w.data.category === category);
      return (
        <section class="mb-8">
          <h2 class="font-heading text-xl font-semibold text-clinical-800 dark:text-clinical-200 mb-3 capitalize">
            {category.replace(/-/g, ' ')}
          </h2>
          <div class="grid gap-2">
            {catWorkflows.map(w => (
              <a href={`/workflows/${w.slug}`} class="flex items-center justify-between p-4 rounded-lg border border-clinical-200 dark:border-clinical-700 bg-white dark:bg-clinical-800 hover:shadow-md transition-shadow">
                <div>
                  <p class="font-medium text-clinical-800 dark:text-clinical-100">{w.data.title}</p>
                  <p class="text-sm text-clinical-500 dark:text-clinical-400">⏱ {w.data.timeToRead} min</p>
                </div>
              </a>
            ))}
          </div>
        </section>
      );
    })}

    {workflows.length === 0 && (
      <p class="text-clinical-400 italic">Workflows coming soon.</p>
    )}
  </div>
</BaseLayout>
```

- [ ] **Step 2: Write dynamic workflow page**

Write `src/pages/workflows/[...slug].astro`:

```astro
---
import { getCollection } from 'astro:content';
import ContentLayout from '../../layouts/ContentLayout.astro';
import { getToolsBySlug, getTemplatesForWorkflow, getTrialsBySlug } from '../../utils/collections';

export async function getStaticPaths() {
  const workflows = await getCollection('workflows');
  return workflows.map(w => ({ params: { slug: w.slug }, props: { entry: w } }));
}

const { entry } = Astro.props;
const { Content } = await entry.render();

const tools = await getToolsBySlug(entry.data.tools);
const templates = await getTemplatesForWorkflow(entry.slug);
const trials = entry.data.trials ? await getTrialsBySlug(entry.data.trials) : [];

const relatedItems = [
  ...tools.map(t => ({ title: t.data.title, href: `/tools/${t.slug}`, type: 'tool' as const })),
  ...templates.map(t => ({ title: t.data.title, href: `/templates/${t.slug}`, type: 'template' as const })),
  ...trials.map(t => ({ title: t.data.title, href: `/trials/${t.slug}`, type: 'trial' as const })),
];
---
<ContentLayout
  title={entry.data.title}
  lastUpdated={entry.data.lastUpdated}
  tags={entry.data.tags}
  timeToRead={entry.data.timeToRead}
  breadcrumbs={[
    { label: 'Workflows', href: '/workflows' },
    { label: entry.data.category.replace(/-/g, ' '), href: `/workflows?category=${entry.data.category}` },
    { label: entry.data.title },
  ]}
  relatedItems={relatedItems}
>
  <Content />
</ContentLayout>
```

- [ ] **Step 3: Write guides listing page**

Write `src/pages/guides/index.astro`:

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import { getCollection } from 'astro:content';

const guides = await getCollection('guides');
const sorted = guides.sort((a, b) => b.data.lastUpdated.getTime() - a.data.lastUpdated.getTime());
---
<BaseLayout title="Guides" description="Educational articles on using AI in clinical practice">
  <div class="max-w-4xl mx-auto px-6 py-12">
    <h1 class="font-heading text-3xl sm:text-4xl font-semibold text-clinical-900 dark:text-white mb-2">Guides</h1>
    <p class="text-clinical-500 dark:text-clinical-400 mb-8">Long-form articles and tutorials on using LLMs in medicine.</p>

    <div class="grid gap-3">
      {sorted.map(g => (
        <a href={`/guides/${g.slug}`} class="block p-5 rounded-lg border border-clinical-200 dark:border-clinical-700 bg-white dark:bg-clinical-800 hover:shadow-md transition-shadow">
          <div class="flex items-center gap-2 mb-1">
            {g.data.featured && <span class="text-xs bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded font-medium">Featured</span>}
            <span class="text-xs text-clinical-400">{g.data.lastUpdated.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
          </div>
          <p class="font-heading font-semibold text-clinical-800 dark:text-clinical-100">{g.data.title}</p>
          <p class="text-sm text-clinical-500 dark:text-clinical-400 mt-1">{g.data.description}</p>
        </a>
      ))}
    </div>

    {guides.length === 0 && <p class="text-clinical-400 italic">Guides coming soon.</p>}
  </div>
</BaseLayout>
```

- [ ] **Step 4: Write guides dynamic page**

Write `src/pages/guides/[...slug].astro`:

```astro
---
import { getCollection } from 'astro:content';
import ContentLayout from '../../layouts/ContentLayout.astro';

export async function getStaticPaths() {
  const guides = await getCollection('guides');
  return guides.map(g => ({ params: { slug: g.slug }, props: { entry: g } }));
}

const { entry } = Astro.props;
const { Content, headings } = await entry.render();
---
<ContentLayout
  title={entry.data.title}
  description={entry.data.description}
  lastUpdated={entry.data.lastUpdated}
  tags={entry.data.tags}
  breadcrumbs={[{ label: 'Guides', href: '/guides' }, { label: entry.data.title }]}
>
  {/* Table of Contents */}
  {headings.length > 0 && (
    <nav class="mb-8 p-4 rounded-lg bg-clinical-100 dark:bg-clinical-800 not-prose">
      <p class="text-xs font-semibold uppercase tracking-widest text-clinical-500 mb-2">On This Page</p>
      <ul class="space-y-1">
        {headings.filter(h => h.depth <= 3).map(h => (
          <li style={`padding-left: ${(h.depth - 2) * 1}rem`}>
            <a href={`#${h.slug}`} class="text-sm text-clinical-600 dark:text-clinical-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )}
  <Content />
</ContentLayout>
```

- [ ] **Step 5: Write tools listing page**

Write `src/pages/tools/index.astro`:

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import { getCollection } from 'astro:content';
import ComparisonTable from '../../components/ComparisonTable.tsx';

const tools = await getCollection('tools');
const toolData = tools.map(t => ({
  name: t.data.title,
  slug: t.data.slug,
  rating: t.data.rating,
  hasBaa: t.data.hasBaa,
  pricing: t.data.pricing,
  verdict: t.data.verdict,
  categories: t.data.categories,
}));
const categories = ['note-writing', 'clinical-reasoning', 'patient-education', 'literature-review', 'admin-billing', 'general'];
---
<BaseLayout title="Tools" description="Honest reviews and comparisons of AI tools for clinicians">
  <div class="max-w-5xl mx-auto px-6 py-12">
    <h1 class="font-heading text-3xl sm:text-4xl font-semibold text-clinical-900 dark:text-white mb-2">Tools</h1>
    <p class="text-clinical-500 dark:text-clinical-400 mb-8">Honest reviews and comparisons of AI tools for clinical practice.</p>

    <ComparisonTable client:load tools={toolData} categories={categories} />

    {tools.length === 0 && <p class="text-clinical-400 italic">Tool reviews coming soon.</p>}
  </div>
</BaseLayout>
```

- [ ] **Step 6: Write tools dynamic page**

Write `src/pages/tools/[...slug].astro`:

```astro
---
import { getCollection } from 'astro:content';
import ToolLayout from '../../layouts/ToolLayout.astro';
import { getWorkflowsForTool } from '../../utils/collections';

export async function getStaticPaths() {
  const tools = await getCollection('tools');
  return tools.map(t => ({ params: { slug: t.slug }, props: { entry: t } }));
}

const { entry } = Astro.props;
const { Content } = await entry.render();
const relatedWorkflows = (await getWorkflowsForTool(entry.data.slug)).map(w => ({
  title: w.data.title,
  href: `/workflows/${w.slug}`,
}));
---
<ToolLayout
  title={entry.data.title}
  vendor={entry.data.vendor}
  rating={entry.data.rating}
  verdict={entry.data.verdict}
  pricing={entry.data.pricing}
  hasBaa={entry.data.hasBaa}
  lastUpdated={entry.data.lastUpdated}
  relatedWorkflows={relatedWorkflows}
>
  <Content />
</ToolLayout>
```

- [ ] **Step 7: Write templates listing page**

Write `src/pages/templates/index.astro`:

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import { getCollection } from 'astro:content';

const templates = await getCollection('templates');
const categories = [...new Set(templates.map(t => t.data.category))].sort();
---
<BaseLayout title="Templates" description="Copy-paste prompt templates for clinical AI workflows">
  <div class="max-w-4xl mx-auto px-6 py-12">
    <h1 class="font-heading text-3xl sm:text-4xl font-semibold text-clinical-900 dark:text-white mb-2">Templates</h1>
    <p class="text-clinical-500 dark:text-clinical-400 mb-8">Ready-to-use prompt templates. Copy, customize, paste.</p>

    {categories.map(category => {
      const catTemplates = templates.filter(t => t.data.category === category);
      return (
        <section class="mb-8">
          <h2 class="font-heading text-xl font-semibold text-clinical-800 dark:text-clinical-200 mb-3 capitalize">
            {category.replace(/-/g, ' ')}
          </h2>
          <div class="grid gap-2">
            {catTemplates.map(t => (
              <a href={`/templates/${t.slug}`} class="flex items-center justify-between p-4 rounded-lg border border-clinical-200 dark:border-clinical-700 bg-white dark:bg-clinical-800 hover:shadow-md transition-shadow">
                <div>
                  <p class="font-medium text-clinical-800 dark:text-clinical-100">{t.data.title}</p>
                  <span class="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded font-medium">{t.data.targetTool}</span>
                </div>
              </a>
            ))}
          </div>
        </section>
      );
    })}

    {templates.length === 0 && <p class="text-clinical-400 italic">Templates coming soon.</p>}
  </div>
</BaseLayout>
```

- [ ] **Step 8: Write templates dynamic page**

Write `src/pages/templates/[...slug].astro`:

```astro
---
import { getCollection } from 'astro:content';
import ContentLayout from '../../layouts/ContentLayout.astro';

export async function getStaticPaths() {
  const templates = await getCollection('templates');
  return templates.map(t => ({ params: { slug: t.slug }, props: { entry: t } }));
}

const { entry } = Astro.props;
const { Content } = await entry.render();
---
<ContentLayout
  title={entry.data.title}
  lastUpdated={entry.data.lastUpdated}
  tags={entry.data.tags}
  breadcrumbs={[
    { label: 'Templates', href: '/templates' },
    { label: entry.data.title },
  ]}
  relatedItems={entry.data.workflow ? [{ title: 'Parent Workflow', href: `/workflows/${entry.data.workflow}`, type: 'workflow' }] : []}
>
  <Content />
</ContentLayout>
```

- [ ] **Step 9: Write trials listing page**

Write `src/pages/trials/index.astro`:

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import { getCollection } from 'astro:content';

const trials = await getCollection('trials');
const sorted = trials.sort((a, b) => b.data.year - a.data.year);
---
<BaseLayout title="Trials" description="Major studies on LLMs in medicine with clinical takeaways">
  <div class="max-w-4xl mx-auto px-6 py-12">
    <h1 class="font-heading text-3xl sm:text-4xl font-semibold text-clinical-900 dark:text-white mb-2">Trials</h1>
    <p class="text-clinical-500 dark:text-clinical-400 mb-8">Summaries of major studies on AI in medicine — what they found and what it means for you.</p>

    <div class="grid gap-3">
      {sorted.map(t => (
        <a href={`/trials/${t.slug}`} class="block p-5 rounded-lg border border-clinical-200 dark:border-clinical-700 bg-white dark:bg-clinical-800 hover:shadow-md transition-shadow">
          <div class="flex items-center gap-2 mb-1">
            <span class="text-xs font-bold text-blue-600 dark:text-blue-400">{t.data.year}</span>
            <span class="text-xs italic text-clinical-500">{t.data.journal}</span>
          </div>
          <p class="font-heading font-semibold text-clinical-800 dark:text-clinical-100">{t.data.title}</p>
          <p class="text-sm text-clinical-500 dark:text-clinical-400 mt-1">{t.data.keyFinding}</p>
        </a>
      ))}
    </div>

    {trials.length === 0 && <p class="text-clinical-400 italic">Trial summaries coming soon.</p>}
  </div>
</BaseLayout>
```

- [ ] **Step 10: Write trials dynamic page**

Write `src/pages/trials/[...slug].astro`:

```astro
---
import { getCollection } from 'astro:content';
import ContentLayout from '../../layouts/ContentLayout.astro';

export async function getStaticPaths() {
  const trials = await getCollection('trials');
  return trials.map(t => ({ params: { slug: t.slug }, props: { entry: t } }));
}

const { entry } = Astro.props;
const { Content } = await entry.render();
---
<ContentLayout
  title={entry.data.title}
  description={entry.data.keyFinding}
  lastUpdated={entry.data.lastUpdated}
  tags={entry.data.tags}
  breadcrumbs={[{ label: 'Trials', href: '/trials' }, { label: entry.data.title }]}
>
  <div class="mb-6 p-4 rounded-lg bg-clinical-100 dark:bg-clinical-800 not-prose">
    <p class="text-sm"><strong>Journal:</strong> {entry.data.journal} ({entry.data.year})</p>
    <p class="text-sm"><strong>DOI:</strong> <a href={`https://doi.org/${entry.data.doi}`} class="text-blue-600 hover:underline" target="_blank" rel="noopener">{entry.data.doi}</a></p>
    <p class="text-sm mt-2"><strong>Key Finding:</strong> {entry.data.keyFinding}</p>
  </div>
  <Content />
</ContentLayout>
```

- [ ] **Step 11: Write tag taxonomy page**

Write `src/pages/tags/[...tag].astro`:

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const [workflows, guides, templates, trials] = await Promise.all([
    getCollection('workflows'),
    getCollection('guides'),
    getCollection('templates'),
    getCollection('trials'),
  ]);

  const allTags = new Set<string>();
  workflows.forEach(e => e.data.tags.forEach(t => allTags.add(t)));
  guides.forEach(e => e.data.tags.forEach(t => allTags.add(t)));
  templates.forEach(e => e.data.tags.forEach(t => allTags.add(t)));
  trials.forEach(e => e.data.tags.forEach(t => allTags.add(t)));

  return [...allTags].map(tag => ({ params: { tag }, props: { tag } }));
}

const { tag } = Astro.props;
const [workflows, guides, templates, trials] = await Promise.all([
  getCollection('workflows'),
  getCollection('guides'),
  getCollection('templates'),
  getCollection('trials'),
]);

const tagged = {
  workflows: workflows.filter(e => e.data.tags.includes(tag)),
  guides: guides.filter(e => e.data.tags.includes(tag)),
  templates: templates.filter(e => e.data.tags.includes(tag)),
  trials: trials.filter(e => e.data.tags.includes(tag)),
};
---
<BaseLayout title={`Tag: ${tag}`}>
  <div class="max-w-4xl mx-auto px-6 py-12">
    <h1 class="font-heading text-3xl font-semibold text-clinical-900 dark:text-white mb-8">
      Tagged: <span class="text-blue-600 dark:text-blue-400">{tag}</span>
    </h1>

    {tagged.workflows.length > 0 && (
      <section class="mb-8">
        <h2 class="font-heading text-xl font-semibold mb-3">Workflows</h2>
        {tagged.workflows.map(w => (
          <a href={`/workflows/${w.slug}`} class="block p-3 mb-2 rounded-lg border border-clinical-200 dark:border-clinical-700 hover:shadow-sm">
            {w.data.title}
          </a>
        ))}
      </section>
    )}

    {tagged.guides.length > 0 && (
      <section class="mb-8">
        <h2 class="font-heading text-xl font-semibold mb-3">Guides</h2>
        {tagged.guides.map(g => (
          <a href={`/guides/${g.slug}`} class="block p-3 mb-2 rounded-lg border border-clinical-200 dark:border-clinical-700 hover:shadow-sm">
            {g.data.title}
          </a>
        ))}
      </section>
    )}

    {tagged.templates.length > 0 && (
      <section class="mb-8">
        <h2 class="font-heading text-xl font-semibold mb-3">Templates</h2>
        {tagged.templates.map(t => (
          <a href={`/templates/${t.slug}`} class="block p-3 mb-2 rounded-lg border border-clinical-200 dark:border-clinical-700 hover:shadow-sm">
            {t.data.title}
          </a>
        ))}
      </section>
    )}

    {tagged.trials.length > 0 && (
      <section class="mb-8">
        <h2 class="font-heading text-xl font-semibold mb-3">Trials</h2>
        {tagged.trials.map(t => (
          <a href={`/trials/${t.slug}`} class="block p-3 mb-2 rounded-lg border border-clinical-200 dark:border-clinical-700 hover:shadow-sm">
            {t.data.title}
          </a>
        ))}
      </section>
    )}
  </div>
</BaseLayout>
```

- [ ] **Step 12: Verify build**

```bash
npm run build
```

Expected: Clean build (pages will be empty until seed content is added).

- [ ] **Step 13: Commit**

```bash
git add src/pages/
git commit -m "feat: add all dynamic content pages — workflows, guides, tools, templates, trials, tags"
```

---

## Task 9: Static Pages — About, 404, RSS

**Files:**
- Create: `llmsfordoctors/src/pages/about.astro`
- Create: `llmsfordoctors/src/pages/404.astro`
- Create: `llmsfordoctors/src/pages/rss.xml.ts`

- [ ] **Step 1: Write About page**

Write `src/pages/about.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="About" description="About Jason Gusdorf, MD and LLMs for Doctors">
  <div class="max-w-3xl mx-auto px-6 py-12">
    <h1 class="font-heading text-3xl sm:text-4xl font-semibold text-clinical-900 dark:text-white mb-6">About</h1>

    <div class="prose prose-lg dark:prose-invert max-w-none">
      <h2>Mission</h2>
      <p>
        LLMs for Doctors exists to help physicians make their clinical lives easier with AI.
        Not hype. Not theory. Practical, tested workflows you can use tomorrow.
      </p>

      <h2>About Me</h2>
      <p>
        I'm Jason Gusdorf, MD — a physician who builds with AI.
        I created this site because I saw a gap between the AI tools available and the physicians who could benefit from them.
        Every workflow, review, and template on this site is something I've tested in practice.
      </p>

      <h2>Contact</h2>
      <form name="contact" method="POST" data-netlify="true" class="not-prose space-y-4">
        <input type="hidden" name="form-name" value="contact" />
        <div>
          <label for="name" class="block text-sm font-medium text-clinical-700 dark:text-clinical-300 mb-1">Name</label>
          <input type="text" id="name" name="name" required class="w-full rounded border border-clinical-300 dark:border-clinical-600 bg-white dark:bg-clinical-800 px-3 py-2 text-sm" />
        </div>
        <div>
          <label for="email" class="block text-sm font-medium text-clinical-700 dark:text-clinical-300 mb-1">Email</label>
          <input type="email" id="email" name="email" required class="w-full rounded border border-clinical-300 dark:border-clinical-600 bg-white dark:bg-clinical-800 px-3 py-2 text-sm" />
        </div>
        <div>
          <label for="message" class="block text-sm font-medium text-clinical-700 dark:text-clinical-300 mb-1">Message</label>
          <textarea id="message" name="message" rows="4" required class="w-full rounded border border-clinical-300 dark:border-clinical-600 bg-white dark:bg-clinical-800 px-3 py-2 text-sm"></textarea>
        </div>
        <button type="submit" class="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-6 py-2 rounded transition-colors">
          Send Message
        </button>
      </form>
    </div>
  </div>
</BaseLayout>
```

- [ ] **Step 2: Write 404 page**

Write `src/pages/404.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import SearchBar from '../components/SearchBar.astro';
---
<BaseLayout title="Page Not Found">
  <div class="max-w-3xl mx-auto px-6 py-20 text-center">
    <h1 class="font-heading text-4xl font-semibold text-clinical-900 dark:text-white mb-4">Page Not Found</h1>
    <p class="text-clinical-500 dark:text-clinical-400 mb-8">The page you're looking for doesn't exist. Try searching or browse by category.</p>

    <div class="max-w-md mx-auto mb-12">
      <SearchBar placeholder="Search for workflows, guides, tools..." />
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg mx-auto mb-12">
      <a href="/workflows" class="p-3 rounded-lg border border-clinical-200 dark:border-clinical-700 hover:shadow-sm text-sm font-medium text-clinical-700 dark:text-clinical-300">Workflows</a>
      <a href="/guides" class="p-3 rounded-lg border border-clinical-200 dark:border-clinical-700 hover:shadow-sm text-sm font-medium text-clinical-700 dark:text-clinical-300">Guides</a>
      <a href="/tools" class="p-3 rounded-lg border border-clinical-200 dark:border-clinical-700 hover:shadow-sm text-sm font-medium text-clinical-700 dark:text-clinical-300">Tools</a>
      <a href="/templates" class="p-3 rounded-lg border border-clinical-200 dark:border-clinical-700 hover:shadow-sm text-sm font-medium text-clinical-700 dark:text-clinical-300">Templates</a>
      <a href="/trials" class="p-3 rounded-lg border border-clinical-200 dark:border-clinical-700 hover:shadow-sm text-sm font-medium text-clinical-700 dark:text-clinical-300">Trials</a>
      <a href="/about" class="p-3 rounded-lg border border-clinical-200 dark:border-clinical-700 hover:shadow-sm text-sm font-medium text-clinical-700 dark:text-clinical-300">About</a>
    </div>

    {/* Manually curated popular pages — update periodically based on analytics */}
    <div class="max-w-lg mx-auto">
      <h2 class="text-sm font-semibold uppercase tracking-widest text-clinical-500 dark:text-clinical-400 mb-3 text-center">Popular Pages</h2>
      <div class="grid gap-2">
        <a href="/workflows/discharge-summary" class="p-3 rounded-lg border border-clinical-200 dark:border-clinical-700 hover:shadow-sm text-sm text-clinical-700 dark:text-clinical-300">Writing a Discharge Summary with AI</a>
        <a href="/guides/prompting-101" class="p-3 rounded-lg border border-clinical-200 dark:border-clinical-700 hover:shadow-sm text-sm text-clinical-700 dark:text-clinical-300">Prompting 101 for Clinicians</a>
        <a href="/tools/claude" class="p-3 rounded-lg border border-clinical-200 dark:border-clinical-700 hover:shadow-sm text-sm text-clinical-700 dark:text-clinical-300">Claude for Clinical Practice</a>
      </div>
    </div>
  </div>
</BaseLayout>
```

- [ ] **Step 3: Install RSS dependency**

```bash
npm install @astrojs/rss
```

- [ ] **Step 4: Write RSS feed**

Write `src/pages/rss.xml.ts`:

```typescript
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const [guides, trials] = await Promise.all([
    getCollection('guides'),
    getCollection('trials'),
  ]);

  const items = [
    ...guides.map(g => ({
      title: g.data.title,
      description: g.data.description,
      pubDate: g.data.lastUpdated,
      link: `/guides/${g.slug}/`,
    })),
    ...trials.map(t => ({
      title: t.data.title,
      description: t.data.keyFinding,
      pubDate: t.data.lastUpdated,
      link: `/trials/${t.slug}/`,
    })),
  ].sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

  return rss({
    title: 'LLMs for Doctors',
    description: 'Practical AI workflows for clinical practice',
    site: context.site!,
    items,
  });
}
```

- [ ] **Step 5: Verify build**

```bash
npm run build
```

Expected: Clean build with RSS feed at `/rss.xml`.

- [ ] **Step 6: Commit**

```bash
git add src/pages/about.astro src/pages/404.astro src/pages/rss.xml.ts
git commit -m "feat: add about page, 404 page, and RSS feed"
```

---

## Task 10: Seed Content

**Files:**
- Create: `llmsfordoctors/src/content/workflows/discharge-summary.mdx`
- Create: `llmsfordoctors/src/content/guides/prompting-101.mdx`
- Create: `llmsfordoctors/src/content/tools/claude.mdx`
- Create: `llmsfordoctors/src/content/templates/discharge-summary-basic.mdx`
- Create: `llmsfordoctors/src/content/trials/llm-diagnostic-nejm-2024.mdx`

- [ ] **Step 1: Write seed workflow**

Write `src/content/workflows/discharge-summary.mdx`:

```mdx
---
title: "Writing a Discharge Summary with AI"
category: note-writing
tools: [claude]
templates: [discharge-summary-basic]
tags: [discharge, inpatient, documentation, note-writing]
timeToRead: 5
lastUpdated: 2026-03-18
specialty: [general-medicine]
---

import Callout from '../../components/Callout.astro';
import PromptPlayground from '../../components/PromptPlayground.astro';
import ToolCard from '../../components/ToolCard.astro';

## The Problem

Discharge summaries take 15-20 minutes per patient. They're repetitive, formulaic, and one of the biggest documentation burdens in inpatient medicine. An LLM can cut this to 3-5 minutes.

<Callout type="hipaa">
Never paste protected health information (PHI) into an LLM that does not have a BAA with your institution. Use only institutionally approved tools for real patient data.
</Callout>

## Step 1: Gather Your Inputs

Before prompting the LLM, collect:
- Admission diagnosis and chief complaint
- Key events during hospitalization
- Procedures performed
- Discharge medications (reconciled)
- Follow-up appointments
- Pending labs or studies

## Step 2: Use This Prompt Template

<PromptPlayground tool="Claude" title="Discharge Summary Prompt">
{`You are a physician writing a discharge summary. Given the following hospital course, write a concise discharge summary in standard format.

Patient: [AGE] year-old [SEX] with [PMH]
Admission Date: [DATE]
Discharge Date: [DATE]
Admitting Diagnosis: [DIAGNOSIS]

Hospital Course:
[PASTE HOSPITAL COURSE NOTES]

Discharge Medications:
[PASTE MED LIST]

Please include:
1. Brief hospital course summary
2. Discharge diagnoses
3. Discharge medications with changes highlighted
4. Follow-up appointments
5. Discharge instructions for the patient`}
</PromptPlayground>

## Step 3: Review and Edit

Always review the output for:
- **Medication accuracy** — verify every med, dose, and frequency
- **Follow-up completeness** — ensure all pending items are captured
- **Clinical accuracy** — confirm the narrative matches what actually happened
- **Patient-appropriate language** in the instructions section

<Callout type="pitfall">
LLMs may hallucinate medication dosages or invent follow-up appointments. Always verify against the actual chart.
</Callout>

## Recommended Tool

<ToolCard name="Claude" slug="claude" rating={5} verdict="Best-in-class for long clinical narratives" hasBaa={true} />
```

- [ ] **Step 2: Write seed guide**

Write `src/content/guides/prompting-101.mdx`:

```mdx
---
title: "Prompting 101 for Clinicians"
description: "A practical introduction to getting useful clinical outputs from LLMs — role-setting, context, specificity, and iteration."
tags: [prompting, beginner, getting-started]
lastUpdated: 2026-03-18
featured: true
---

import Callout from '../../components/Callout.astro';

## Why Prompting Matters

The difference between a useless LLM output and a clinically helpful one usually comes down to how you ask. This guide covers the four fundamentals.

## 1. Set the Role

Tell the LLM who it is. "You are a board-certified internist" produces very different output than a bare question.

<Callout type="tip">
Role-setting is the single highest-leverage prompting technique. Always start with it.
</Callout>

## 2. Provide Context

Include relevant clinical details. The more specific context you give, the more specific the output. Don't make the LLM guess.

**Weak:** "What are the causes of chest pain?"
**Strong:** "I'm evaluating a 55-year-old male with substernal chest pain, HTN, DM2, and a troponin of 0.08. What's my differential and what should I do next?"

## 3. Be Specific About Format

Tell the LLM exactly what format you want: bullet points, a table, a SOAP note, a patient-friendly handout. If you don't specify, you'll get a generic essay.

## 4. Iterate

Your first prompt rarely produces the perfect output. Refine: "Make this more concise," "Add medication dosages," "Write this at a 6th-grade reading level for the patient."

<Callout type="evidence">
Studies show iterative prompting with feedback produces significantly better clinical outputs than single-shot prompts.
</Callout>

## Next Steps

Try these techniques with the workflows on this site. Start with [Writing a Discharge Summary](/workflows/discharge-summary) — it's a great first workflow for prompting practice.
```

- [ ] **Step 3: Write seed tool review**

Write `src/content/tools/claude.mdx`:

```mdx
---
title: "Claude for Clinical Practice"
slug: claude
vendor: Anthropic
rating: 5
verdict: "Best-in-class for long clinical narratives and nuanced reasoning"
pricing: "Free tier + $20/mo Pro"
hasBaa: true
categories: [note-writing, clinical-reasoning, patient-education, literature-review, general]
lastUpdated: 2026-03-18
---

import Callout from '../../components/Callout.astro';

## Overview

Claude (by Anthropic) is currently the strongest general-purpose LLM for clinical work. Its large context window handles full patient charts, and its reasoning is notably careful with medical nuance.

## Clinical Strengths

- **Long context window** — can process entire H&Ps, lab trends, and imaging reports in a single prompt
- **Nuanced reasoning** — less likely to give overconfident diagnoses, acknowledges uncertainty
- **Structured output** — excels at generating formatted notes, summaries, and patient education materials
- **Safety-conscious** — tends to recommend appropriate follow-up and flag serious diagnoses

## Weaknesses

- Can be overly cautious in differential diagnosis (may hedge more than helpful)
- No real-time data access — knowledge has a training cutoff
- Occasional verbosity — may need prompting for conciseness

## HIPAA & Compliance

<Callout type="hipaa">
Anthropic offers a BAA for Claude Team and Enterprise plans. Verify your institution's specific agreement before using with PHI.
</Callout>

## Best For

- Discharge summaries and progress notes
- Differential diagnosis discussions
- Patient education handouts
- Literature synthesis and summaries
```

- [ ] **Step 4: Write seed template**

Write `src/content/templates/discharge-summary-basic.mdx`:

```mdx
---
title: "Discharge Summary — Basic Template"
category: note-writing
targetTool: claude
workflow: discharge-summary
tags: [discharge, inpatient, documentation, note-writing]
lastUpdated: 2026-03-18
---

import PromptPlayground from '../../components/PromptPlayground.astro';
import Callout from '../../components/Callout.astro';

## Template

<PromptPlayground tool="Claude" title="Basic Discharge Summary">
{`You are a physician writing a discharge summary. Given the following hospital course, write a concise discharge summary in standard format.

Patient: [AGE] year-old [SEX] with [PAST MEDICAL HISTORY]
Admission Date: [ADMISSION DATE]
Discharge Date: [DISCHARGE DATE]
Admitting Diagnosis: [DIAGNOSIS]

Hospital Course:
[PASTE HOSPITAL COURSE NOTES HERE]

Discharge Medications:
[PASTE RECONCILED MEDICATION LIST]

Please include:
1. Brief hospital course summary (3-5 sentences)
2. Discharge diagnoses (numbered list)
3. Discharge medications with changes highlighted
4. Follow-up appointments and pending results
5. Discharge instructions for the patient (plain language)`}
</PromptPlayground>

## Placeholder Guide

| Placeholder | What to enter |
|---|---|
| `[AGE]` | Patient age in years |
| `[SEX]` | Patient sex |
| `[PAST MEDICAL HISTORY]` | Relevant PMH, comma-separated |
| `[ADMISSION DATE]` / `[DISCHARGE DATE]` | Actual dates |
| `[DIAGNOSIS]` | Primary admitting diagnosis |
| Hospital Course section | Copy from daily progress notes or H&P |
| Medications section | Copy from reconciled discharge med list |

<Callout type="hipaa">
Only use this template with BAA-covered tools when working with real patient data.
</Callout>
```

- [ ] **Step 5: Write seed trial**

Write `src/content/trials/llm-diagnostic-nejm-2024.mdx`:

```mdx
---
title: "Large Language Models Match Physician Diagnostic Accuracy"
journal: "New England Journal of Medicine"
year: 2024
doi: "10.1056/NEJMc2405343"
keyFinding: "GPT-4 achieved diagnostic accuracy comparable to attending physicians on standardized clinical vignettes."
lastUpdated: 2026-03-18
tags: [diagnosis, accuracy, gpt-4, clinical-reasoning]
---

import Callout from '../../components/Callout.astro';

## Study Design

Researchers presented standardized clinical vignettes to GPT-4 and a panel of attending physicians. Both were asked to generate ranked differential diagnoses.

## Key Findings

- GPT-4's top-1 diagnostic accuracy was comparable to the physician panel
- Performance was strongest on common conditions and classic presentations
- The model struggled more with rare diagnoses and atypical presentations
- When given additional clinical data iteratively, accuracy improved for both humans and AI

## Clinical Implications

This suggests LLMs can serve as a useful **diagnostic thinking partner** — not a replacement for clinical judgment, but a tool for broadening differentials and catching cognitive biases.

<Callout type="evidence">
The study used standardized vignettes, not real patient encounters. Real-world performance may differ due to incomplete data, patient communication nuances, and time pressure.
</Callout>

## My Takeaway

This is one of the strongest pieces of evidence that LLMs belong in clinical reasoning workflows. I use Claude as a "second opinion" on complex cases — not to generate the diagnosis, but to make sure I haven't missed something on the differential.
```

- [ ] **Step 6: Verify full site with dev server**

```bash
npm run dev
```

Navigate through all pages: homepage, workflow listing, individual workflow, guide, tool, template, trial, tags, about, 404. Verify cross-links work, components render correctly, dark mode toggles, mobile nav works.

- [ ] **Step 7: Verify production build**

```bash
npm run build && npx serve dist
```

Check that the static output works correctly, Pagefind search is functional, and all routes resolve.

- [ ] **Step 8: Commit**

```bash
git add src/content/
git commit -m "feat: add seed content — workflow, guide, tool review, template, trial"
```

---

## Task 11: OG Image Generation

**Files:**
- Create: `llmsfordoctors/src/utils/og.ts`
- Create: `llmsfordoctors/src/pages/og/[...slug].png.ts`

- [ ] **Step 1: Install Satori dependencies**

```bash
npm install satori sharp
npm install -D @types/sharp
```

- [ ] **Step 2: Write OG image generator**

Write `src/utils/og.ts`:

```typescript
import satori from 'satori';
import sharp from 'sharp';
import fs from 'node:fs';

const interFont = fs.readFileSync('public/fonts/Inter-Variable.woff2');

export async function generateOgImage(title: string, subtitle?: string): Promise<Buffer> {
  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '60px 80px',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          fontFamily: 'Inter',
        },
        children: [
          {
            type: 'div',
            props: {
              style: { fontSize: '20px', color: '#60a5fa', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '24px' },
              children: 'LLMs for Doctors',
            },
          },
          {
            type: 'div',
            props: {
              style: { fontSize: '48px', color: '#ffffff', fontWeight: 700, lineHeight: 1.2, marginBottom: '16px' },
              children: title,
            },
          },
          ...(subtitle ? [{
            type: 'div',
            props: {
              style: { fontSize: '24px', color: '#94a3b8', lineHeight: 1.4 },
              children: subtitle,
            },
          }] : []),
          {
            type: 'div',
            props: {
              style: { fontSize: '16px', color: '#64748b', marginTop: 'auto' },
              children: 'llmsfordoctors.com — by Jason Gusdorf, MD',
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [{ name: 'Inter', data: interFont, style: 'normal' }],
    }
  );

  return await sharp(Buffer.from(svg)).png().toBuffer();
}
```

- [ ] **Step 3: Write OG image endpoint**

Write `src/pages/og/[...slug].png.ts`:

```typescript
import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { generateOgImage } from '../../utils/og';

export const getStaticPaths: GetStaticPaths = async () => {
  const [workflows, guides, tools, templates, trials] = await Promise.all([
    getCollection('workflows'),
    getCollection('guides'),
    getCollection('tools'),
    getCollection('templates'),
    getCollection('trials'),
  ]);

  return [
    ...workflows.map(e => ({ params: { slug: `workflows/${e.slug}` }, props: { title: e.data.title, subtitle: 'Workflow' } })),
    ...guides.map(e => ({ params: { slug: `guides/${e.slug}` }, props: { title: e.data.title, subtitle: 'Guide' } })),
    ...tools.map(e => ({ params: { slug: `tools/${e.slug}` }, props: { title: e.data.title, subtitle: 'Tool Review' } })),
    ...templates.map(e => ({ params: { slug: `templates/${e.slug}` }, props: { title: e.data.title, subtitle: 'Template' } })),
    ...trials.map(e => ({ params: { slug: `trials/${e.slug}` }, props: { title: e.data.title, subtitle: 'Trial' } })),
  ];
};

export const GET: APIRoute = async ({ props }) => {
  const png = await generateOgImage(props.title, props.subtitle);
  return new Response(png, { headers: { 'Content-Type': 'image/png' } });
};
```

- [ ] **Step 4: Wire OG images into BaseLayout meta tags**

In `src/layouts/BaseLayout.astro`, add after the existing `og:url` meta tag:

```astro
<meta property="og:image" content={new URL(`/og${Astro.url.pathname}.png`, Astro.site)} />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:card" content="summary_large_image" />
```

- [ ] **Step 5: Verify OG image renders**

```bash
npm run build
```

Check that OG images are generated in the build output.

- [ ] **Step 5: Commit**

```bash
git add src/utils/og.ts src/pages/og/ src/layouts/BaseLayout.astro
git commit -m "feat: add Satori-based OG image generation"
```

---

## Task 12: Final Polish & Netlify Deploy

**Files:**
- Modify: `llmsfordoctors/netlify.toml`
- Modify: `llmsfordoctors/package.json`

- [ ] **Step 1: Add Schema.org structured data to BaseLayout**

In `src/layouts/BaseLayout.astro`, add before `</head>`:

```astro
<script type="application/ld+json" set:html={JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'MedicalWebPage',
  name: `${title} | LLMs for Doctors`,
  description: description,
  url: canonicalUrl.toString(),
  author: {
    '@type': 'Person',
    name: 'Jason Gusdorf, MD',
    jobTitle: 'Physician',
  },
  publisher: {
    '@type': 'Organization',
    name: 'LLMs for Doctors',
    url: 'https://llmsfordoctors.com',
  },
})} />
```

For workflow pages specifically, add `HowTo` structured data in the workflow `[...slug].astro` template (pass steps from frontmatter).

- [ ] **Step 1b: Add stale content build warning**

Create `src/integrations/stale-content.ts`:

```typescript
import type { AstroIntegration } from 'astro';
import { getCollection } from 'astro:content';

export default function staleContentChecker(): AstroIntegration {
  return {
    name: 'stale-content-checker',
    hooks: {
      'astro:build:done': async ({ logger }) => {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const collections = ['workflows', 'guides', 'tools', 'templates', 'trials'] as const;
        for (const name of collections) {
          const entries = await getCollection(name);
          for (const entry of entries) {
            if (entry.data.lastUpdated < sixMonthsAgo) {
              logger.warn(`STALE: ${name}/${entry.slug} last updated ${entry.data.lastUpdated.toISOString().slice(0, 10)}`);
            }
          }
        }
      },
    },
  };
}
```

Add to `astro.config.ts` integrations array: `staleContentChecker()`.

- [ ] **Step 2: Verify Lighthouse scores**

```bash
npm run build && npx serve dist
```

Run Lighthouse in Chrome DevTools on homepage, a workflow page, and a tool page. Target: 100/100 across all categories.

- [ ] **Step 3: Test responsive breakpoints**

Verify in browser dev tools:
- Mobile (< 640px): hamburger nav, single column, sidebar stacks
- Tablet (640-1024px): two-column, condensed nav
- Desktop (> 1024px): full layout with sticky sidebar

- [ ] **Step 4: Test dark mode**

Toggle dark mode on every page type. Verify colors, contrast, and readability.

- [ ] **Step 5: Test print styles**

Print a workflow page and a template page. Verify nav/footer hidden, clean layout, readable fonts.

- [ ] **Step 6: Initialize Netlify site** (MANUAL — requires browser auth)

```bash
npx netlify-cli login
npx netlify-cli sites:create --name llmsfordoctors
npx netlify-cli link
```

This requires authenticating with Netlify in a browser. After linking, verify with `npx netlify-cli status`.

- [ ] **Step 7: Deploy**

```bash
npx netlify-cli deploy --prod --dir=dist
```

Expected: Site deployed, URL returned.

- [ ] **Step 8: Configure custom domain** (MANUAL — requires DNS access)

```bash
npx netlify-cli domains:add llmsfordoctors.com
```

Then update DNS records at your registrar as instructed by Netlify. HTTPS will be provisioned automatically after DNS propagation.

- [ ] **Step 9: Verify live site**

Visit `https://llmsfordoctors.com` and verify:
- All pages load
- Search works
- Forms submit (newsletter, contact)
- RSS feed is accessible at `/rss.xml`
- OG images render when sharing links

- [ ] **Step 10: Final commit**

```bash
git add .
git commit -m "feat: finalize site with structured data, polish, and Netlify config"
```
