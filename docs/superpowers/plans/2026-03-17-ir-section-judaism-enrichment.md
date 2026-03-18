# International Affairs Section & Judaism Enrichment — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a new "International Affairs" section to Jason's personal website and enrich the existing Judaism section with family heritage content.

**Architecture:** Single-file changes to `index.html`. The new section reuses existing `.medicine-card` and `.medicine-grid` CSS classes. Background colors for existing sections are re-alternated to maintain the visual rhythm. No new CSS classes, no new JS.

**Tech Stack:** Static HTML/CSS (single `index.html` file with inline styles)

**Spec:** `docs/superpowers/specs/2026-03-17-ir-section-judaism-enrichment-design.md`

---

### Task 1: Add nav link for International Affairs

**Files:**
- Modify: `index.html:279-280` (nav `<ul>`)

- [ ] **Step 1: Add the nav link**

Insert a new `<li>` between the "About" and "Medicine" nav links. Find this block at line 279-280:

```html
    <li><a href="#about">About</a></li>
    <li><a href="#medicine">Medicine</a></li>
```

Replace with:

```html
    <li><a href="#about">About</a></li>
    <li><a href="#intl-affairs">Int'l Affairs</a></li>
    <li><a href="#medicine">Medicine</a></li>
```

- [ ] **Step 2: Verify in browser**

Open `index.html` in a browser. Confirm "Int'l Affairs" appears in the nav bar between "About" and "Medicine". The link won't scroll anywhere yet — that's expected.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "Add Int'l Affairs nav link"
```

---

### Task 2: Re-alternate section background colors

**Files:**
- Modify: `index.html:93` (`#medicine` background)
- Modify: `index.html:104` (`#research` background)
- Modify: `index.html:138` (`#teaching` background)

The new Int'l Affairs section will use `var(--warm)`. To maintain the alternating pattern, flip the three sections that follow:

| Section | Current | New |
|---------|---------|-----|
| About | `--cream` | `--cream` (unchanged) |
| Int'l Affairs | *(new)* | `--warm` |
| Medicine | `--warm` | `--cream` |
| Research | `--cream` | `--warm` |
| Teaching | `--warm` | `--cream` |
| Music | navy gradient | unchanged |
| Judaism | `--cream` | unchanged |
| Contact | navy | unchanged |

- [ ] **Step 1: Change Medicine background**

At line 93, find:

```css
    #medicine { background: var(--warm); }
```

Replace with:

```css
    #medicine { background: var(--cream); }
```

- [ ] **Step 2: Change Research background**

At line 104, find:

```css
    #research { background: var(--cream); }
```

Replace with:

```css
    #research { background: var(--warm); }
```

- [ ] **Step 3: Change Teaching background**

At line 138, find:

```css
    #teaching { background: var(--warm); }
```

Replace with:

```css
    #teaching { background: var(--cream); }
```

- [ ] **Step 4: Verify in browser**

Open `index.html`. Scroll through all sections and confirm the cream/warm alternation looks correct. Medicine should now be cream, Research warm, Teaching cream.

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "Re-alternate section backgrounds for new Int'l Affairs section"
```

---

### Task 3: Add the International Affairs section CSS

**Files:**
- Modify: `index.html` — add CSS block after the `/* ── ABOUT ── */` section (after line 90)

- [ ] **Step 1: Add section background CSS**

After line 90 (the `.honor-badge` rule, the last line of the ABOUT CSS block), insert:

```css

    /* ── INTERNATIONAL AFFAIRS ── */
    #intl-affairs { background: var(--warm); }
```

This is the only new CSS needed. The section reuses `.medicine-grid`, `.medicine-card`, `.medicine-icon`, and shared section classes (`.container`, `.section-label`, `.section-title`, `.divider`, `.section-sub`).

- [ ] **Step 2: Commit**

```bash
git add index.html
git commit -m "Add Int'l Affairs section background CSS"
```

---

### Task 4: Add the International Affairs section HTML

**Files:**
- Modify: `index.html` — insert new section between the closing `</section>` of About (line 355) and the `<!-- MEDICINE -->` comment (line 357)

- [ ] **Step 1: Insert the section HTML**

Find this block at lines 355-358:

```html
</section>

<!-- MEDICINE -->
<section id="medicine">
```

Insert the new section between `</section>` and `<!-- MEDICINE -->`:

```html
</section>

<!-- INTERNATIONAL AFFAIRS -->
<section id="intl-affairs">
  <div class="container">
    <div class="section-label">International Affairs</div>
    <h2 class="section-title">Foreign Policy & Global Security</h2>
    <div class="divider"></div>
    <p class="section-sub">At Georgetown's School of Foreign Service I studied Science, Technology & International Affairs, with undergraduate work centered on nuclear strategy, European security, and the intersection of science and ideology.</p>
    <div class="medicine-grid">
      <div class="medicine-card">
        <div class="medicine-icon">🌍</div>
        <h3>Center for European Policy Analysis</h3>
        <p>Full-time internship at CEPA in Dupont Circle, Washington, DC (2014). Helped organize an international conference with European heads of state and military officials to discuss Russia's invasion of Crimea. Researched Eastern European policy.</p>
      </div>
      <div class="medicine-card">
        <div class="medicine-icon">🔬</div>
        <h3>Research with Matthew Kroenig</h3>
        <p>Research assistant in international relations at Georgetown, acknowledged in three publications on nuclear strategy, NATO policy, and democratic institutions &amp; conflict.</p>
        <div class="languages">
          <a href="https://www.tandfonline.com/doi/abs/10.1080/00396338.2015.1008295" target="_blank" class="pub-link">↗ Survival</a>
          <a href="https://papers.ssrn.com/sol3/papers.cfm?abstract_id=2806696" target="_blank" class="pub-link">↗ SSRN</a>
          <a href="https://uva.theopenscholar.com/files/todd-sechser/files/the_case_for_8.pdf" target="_blank" class="pub-link">↗ PDF</a>
        </div>
      </div>
      <div class="medicine-card">
        <div class="medicine-icon">📖</div>
        <h3>Honors Thesis</h3>
        <p><em>Identity and Ideology: Racial Empiricism in the Third Reich.</em> Mentored by Dr. Kathryn Olesko, Ph.D. Awarded Honors in STIA, Georgetown SFS, Spring 2016. Dedicated to Walter Gusdorf.</p>
      </div>
      <div class="medicine-card">
        <div class="medicine-icon">📰</div>
        <h3>Georgetown Voice</h3>
        <p>Wrote on international affairs topics for Georgetown's campus newspaper.</p>
      </div>
    </div>
  </div>
</section>

<!-- MEDICINE -->
<section id="medicine">
```

- [ ] **Step 2: Verify in browser**

Open `index.html`. Confirm:
- The Int'l Affairs section appears between About and Medicine
- Background is warm (tan), Medicine below is cream — alternation correct
- 4 cards render with icons, text, and pub links
- The 3 publication links in the Kroenig card open in new tabs
- Nav link scrolls to the section

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "Add International Affairs section with CEPA, Kroenig, thesis, and Voice cards"
```

---

### Task 5: Add narrative paragraphs to Judaism section

**Files:**
- Modify: `index.html:779` (inside `.judaism-text` div, after the third `<p>`)

- [ ] **Step 1: Add two new paragraphs**

Find the closing of the third paragraph and the closing div at lines 779-780:

```html
        <p>Before medical school, I received a funded fellowship to study at the Pardes Institute of Jewish Studies in Jerusalem, returning later for an extended fellowship. That intensive immersion in Jewish text deepened my understanding of the spiritual dimensions of healing—themes that directly inform my clinical practice and academic writing, including a published essay on how Judaism shaped my love of medicine.</p>
      </div>
```

Replace with:

```html
        <p>Before medical school, I received a funded fellowship to study at the Pardes Institute of Jewish Studies in Jerusalem, returning later for an extended fellowship. That intensive immersion in Jewish text deepened my understanding of the spiritual dimensions of healing—themes that directly inform my clinical practice and academic writing, including a published essay on how Judaism shaped my love of medicine.</p>
        <p>My family's history is inseparable from my Jewish identity. My grandfather, Walter Gusdorf, escaped the Holocaust from Worms, Germany, and I am a descendant of the Maharal of Prague. This heritage is foundational to who I am and directly motivated my honors thesis on racial science in the Third Reich.</p>
        <p>In 2014 I lived in Berlin, studying German at the Goethe Institut and retracing my family's steps through Germany. That experience deepened my connection to the weight of European Jewish history and the responsibility of remembrance.</p>
      </div>
```

- [ ] **Step 2: Verify in browser**

Open `index.html`, scroll to the Judaism section. Confirm the two new paragraphs appear after the Pardes paragraph, before the milestone timeline.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "Add family heritage and Berlin paragraphs to Judaism section"
```

---

### Task 6: Add milestones to Judaism timeline

**Files:**
- Modify: `index.html` — inside `.judaism-milestones`, insert two new milestones between the Georgetown milestone (ends line 795) and the Pardes milestone (starts line 796)

- [ ] **Step 1: Insert two new milestones**

Find the Georgetown milestone closing and Pardes milestone opening at lines 794-799:

```html
            <p>Led Kabbalat Shabbat for four years; grew attendance from 20 to 65–80; launched Torah study.</p>
          </div>
        </div>
        <div class="milestone">
          <div class="milestone-dot"></div>
          <div class="milestone-content">
            <h4>Pardes Institute, Jerusalem — Funded Fellow</h4>
```

Replace with:

```html
            <p>Led Kabbalat Shabbat for four years; grew attendance from 20 to 65–80; launched Torah study.</p>
          </div>
        </div>
        <div class="milestone">
          <div class="milestone-dot"></div>
          <div class="milestone-content">
            <h4>Berlin — Goethe Institut (2014)</h4>
            <p>Studied German at the Goethe Institut in Berlin, retracing family history in Germany.</p>
          </div>
        </div>
        <div class="milestone">
          <div class="milestone-dot"></div>
          <div class="milestone-content">
            <h4>Family Heritage — Worms & Prague</h4>
            <p>Grandfather Walter Gusdorf escaped the Holocaust from Worms; descendant of the Maharal of Prague.</p>
          </div>
        </div>
        <div class="milestone">
          <div class="milestone-dot"></div>
          <div class="milestone-content">
            <h4>Pardes Institute, Jerusalem — Funded Fellow</h4>
```

- [ ] **Step 2: Verify in browser**

Open `index.html`, scroll to the Judaism section timeline. Confirm 7 milestones in this order:
1. St. Louis — OSRUI
2. Georgetown — Music Leader
3. Berlin — Goethe Institut (2014)
4. Family Heritage — Worms & Prague
5. Pardes Institute, Jerusalem — Funded Fellow
6. "After the Seventh" Album
7. Writing on Judaism & Medicine

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "Add Berlin and family heritage milestones to Judaism timeline"
```

---

### Task 7: Final verification

- [ ] **Step 1: Full page review in browser**

Open `index.html` and scroll through the entire page. Check:
- Nav: 8 links in correct order (About, Int'l Affairs, Medicine, Research, Teaching, Music, Judaism, Contact)
- Each nav link scrolls to its section
- Background alternation: cream → warm → cream → warm → cream → navy → cream → navy
- Int'l Affairs section: 4 cards with correct icons, text, and working publication links
- Judaism section: 5 paragraphs of narrative text, 7 milestones in timeline
- No visual regressions in any other section

- [ ] **Step 2: Test on mobile viewport**

Resize browser to ~375px width. Verify:
- Nav is usable (or collapses as it does now)
- Int'l Affairs cards stack properly
- Judaism text and milestones are readable

- [ ] **Step 3: Final commit (if any fixes needed)**

If any fixes were made during verification:

```bash
git add index.html
git commit -m "Fix visual issues found during final review"
```
