# Design: International Affairs Section & Judaism Enrichment

**Date:** 2026-03-17
**Status:** Approved
**Scope:** Two changes to `index.html` — a new standalone section and additions to an existing section.

---

## 1. New Section: International Affairs

### Placement
- Between the **About** and **Medicine** sections in the page
- New nav link: "Int'l Affairs" pointing to `#intl-affairs`
- Section id: `intl-affairs`

### Visual Treatment
- Background: `var(--warm)` (alternating with About's `var(--cream)`)
- Section label: "International Affairs"
- Section title: "Foreign Policy & Global Security"
- Reuses existing `.medicine-card` styling (cards with icon, heading, description)

### Content

**Intro paragraph:** Frames Jason's SFS years — studied Science, Technology & International Affairs at Georgetown's School of Foreign Service, with undergraduate work centered on nuclear strategy, European security, and the intersection of science and ideology.

**4 cards:**

1. **Center for European Policy Analysis (CEPA)**
   - Icon: globe/policy-related emoji
   - Full-time internship, Dupont Circle, Washington, DC, 2014
   - Helped organize an international conference with European heads of state and military officials to discuss Russia's invasion of Crimea
   - Researched Eastern European policy

2. **Research with Matthew Kroenig**
   - Icon: research-related emoji
   - Research assistant in international relations at Georgetown
   - Acknowledged in three publications:
     - "Facing Reality: Getting NATO Ready for a New Cold War" — *Survival*, Vol 57, No 1, 2015 ([link](https://www.tandfonline.com/doi/abs/10.1080/00396338.2015.1008295))
     - "Pugnacious Presidents: Democratic Constitutional Systems and International Conflict" — SSRN, 2016 ([link](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=2806696))
     - Nuclear strategy paper ([link](https://uva.theopenscholar.com/files/todd-sechser/files/the_case_for_8.pdf))

3. **Honors Thesis**
   - Icon: book/academic-related emoji
   - *Identity and Ideology: Racial Empiricism in the Third Reich*
   - Mentored by Dr. Kathryn Olesko, Ph.D.
   - Awarded Honors in STIA, Georgetown SFS, Spring 2016
   - Dedicated to Walter Gusdorf

4. **Georgetown Voice**
   - Icon: newspaper-related emoji
   - Wrote on international affairs topics for the Georgetown campus newspaper

---

## 2. Judaism Section Enrichment

### Narrative Additions

Two new paragraphs appended after the existing three paragraphs in `.faith-text`:

1. **Family heritage:** Jason's grandfather Walter Gusdorf escaped the Holocaust from Worms, Germany. Jason is a descendant of the Maharal of Prague. This family history is foundational to his Jewish identity and directly motivated his academic work on racial science in the Third Reich.

2. **Berlin:** In 2014, Jason lived in Berlin studying German at the Goethe Institut, retracing his family's steps through Germany. This experience deepened his connection to his heritage and the weight of European Jewish history.

### Timeline Additions

Two new milestones inserted into the existing timeline. New order:

1. **St. Louis — OSRUI** *(existing)*
2. **Georgetown — Music Leader** *(existing)*
3. **Berlin — Goethe Institut (2014)** *(new)* — Studied German at the Goethe Institut in Berlin, retracing family history in Germany.
4. **Family Heritage — Worms & Prague** *(new)* — Grandfather Walter Gusdorf escaped the Holocaust from Worms; descendant of the Maharal of Prague.
5. **Pardes Institute, Jerusalem — Funded Fellow** *(existing)*
6. **"After the Seventh" Album** *(existing)*
7. **Writing on Faith & Medicine** *(existing)*

---

## 3. What Does NOT Change

- No changes to Hero, About (beyond the new section appearing after it), Medicine, Research, Teaching, Music, or Contact sections
- No new CSS beyond what's needed to reuse existing card/section patterns for the new section
- No new JavaScript
- No changes to the site's color scheme, typography, or layout system

---

## 4. Implementation Notes

- The new section reuses `.medicine-grid` and `.medicine-card` CSS classes — no new card styles needed
- Nav link added to the `<nav>` element's `<ul>`
- Publication links in the Kroenig card open in new tabs (`target="_blank"`)
- The Judaism section's existing HTML structure (`.faith-text` for narrative, `.faith-milestones` for timeline) is preserved; new content is inserted at the specified positions
