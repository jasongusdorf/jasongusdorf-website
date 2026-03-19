# Clinical Reasoning Section — Design Spec

**Site:** llmsfordoctors.com
**Author:** Jason Gusdorf, MD
**Date:** 2026-03-18
**Status:** Approved
**Parent Spec:** `docs/superpowers/specs/2026-03-18-llms-for-doctors-design.md`

## Purpose

Build out the clinical reasoning section of llmsfordoctors.com with opinionated, evidence-backed LLM recommendations and practical how-to content. This is the second content vertical after note-writing.

## Audience

- **Attendings/experienced clinicians** — want LLMs as a rapid sounding board and bias-check
- **Residents/trainees** — want LLMs as a teaching tool and safety net for building reasoning skills

Content is written for the attending use case with trainee callouts where appropriate.

## Editorial Stance

**Opinionated with receipts.** Every tool recommendation names a winner and backs it up with concrete output comparisons. No "it depends" without showing why.

## LLMs in Scope

| Model | Vendor | Why Included |
|---|---|---|
| Claude (Opus/Sonnet) | Anthropic | Best for case synthesis, narrative integration, debiasing |
| GPT-4o / o1 / o3 | OpenAI | o-series reasoning models excel at structured diagnostic thinking |
| Gemini (Pro/Advanced) | Google | 1M+ token context for long case histories |
| Perplexity | Perplexity AI | Real-time literature-grounded reasoning with citations |

Medical-specific models (Med-PaLM, open-source) are excluded — not practically accessible to clinicians.

## Content Architecture

### Approach: Layered (Workflow + Guide)

Workflows embed opinionated tool recommendations at point-of-use (brief justification + output snippet). A standalone comparison guide provides the full deep-dive analysis. Cross-linked bidirectionally.

- **Fast path (attendings):** Read the workflow, use the templates, trust the tool recs
- **Deep path (residents/curious):** Follow links to the comparison guide for full evidence

## Content Inventory

| Type | Count | Items |
|---|---|---|
| Workflows | 2 | Clinical Reasoning with AI, Cognitive Debiasing with AI |
| Tool Reviews | 3 new + 1 update | OpenAI, Gemini, Perplexity, Claude (update) |
| Templates | 4 | DDx Generator, Workup Planner, Case Synthesis, Bias Check |
| Guide | 1 | Which LLM for Clinical Reasoning? |
| Trials | 1 new + 1 update | JAMA 2023 study, NEJM 2024 (update links) |

**Total: 11 new content pieces + 2 updates.**

---

## Workflow 1: Clinical Reasoning with AI

**File:** `src/content/workflows/clinical-reasoning.mdx`
**Category:** `clinical-reasoning`
**Format:** Linear 4-step workflow (same structure as discharge-summary workflow)

### Step 1: Present the Case

- Prompt the LLM with a structured case presentation (HPI, exam, initial labs/imaging)
- Embedded template: structured input format for consistent, complete information
- **Recommended model:** Claude or GPT-4o — both handle structured clinical input well
- HIPAA callout: de-identification reminder

### Step 2: Generate the Differential

- Use the DDx Generator template
- Asks for ranked differential with pre-test probabilities and supporting/refuting evidence per diagnosis
- **Recommended model: o3** — chain-of-thought reasoning produces the most thorough, well-justified differentials
- Brief prose excerpt (2-3 sentences per model) comparing o3 vs Claude vs GPT-4o output, showing why o3 wins. Not a full `<OutputComparison>` component — keep the workflow page lightweight. The full tabbed comparison lives in the guide.
- Tip callout: ask for "uncommon but dangerous" diagnoses explicitly — LLMs tend toward common diagnoses unless pushed
- Trainee callout: "Before you look at the AI's DDx, write your own first. Then compare. This is where the learning happens."

### Step 3: Plan the Workup

- Use the Workup Planner template
- "Given this DDx, what tests narrow it down most efficiently"
- **Recommended model: o3 or Claude** — both reason well about test characteristics and Bayesian narrowing
- Pitfall callout: LLMs may recommend tests that aren't available at your institution or aren't cost-appropriate. Always filter through your clinical context.

### Step 4: Synthesize and Decide

- Use the Case Synthesis template
- Feed back workup results, ask for updated assessment and plan
- **Recommended model: Claude** — best at integrating large amounts of clinical data into a coherent narrative with appropriate hedging
- Link to Cognitive Debiasing workflow: "Before you commit to your plan, consider running a bias check →"

**Footer:** Related content links (all 4 templates, tool reviews, comparison guide, relevant trials)

---

## Workflow 2: Cognitive Debiasing with AI

**File:** `src/content/workflows/cognitive-debiasing.mdx`
**Category:** `clinical-reasoning`
**Format:** 3-step workflow (shorter, focused)

**Premise:** Even experienced clinicians are vulnerable to cognitive biases — anchoring, premature closure, availability heuristic. LLMs are useful because they have no ego investment in your working diagnosis.

### Step 1: State Your Current Thinking

- Tell the LLM your working diagnosis and the evidence supporting it
- Be honest about confidence level and what's driving it

### Step 2: Run the Devil's Advocate

- Use the Bias Check template
- Instructs the LLM to argue *against* your working diagnosis
- Asks: "What diagnoses am I anchoring on? What am I missing? What evidence contradicts my leading diagnosis?"
- **Recommended model: Claude** — tendency toward nuance and hedging is a *strength* here; less likely to rubber-stamp your reasoning
- Trainee callout: "This is the AI equivalent of your attending asking 'what else could it be?' Practice using it on cases you're confident about — you'll be surprised how often it surfaces something useful."

### Step 3: Evaluate and Adjust

- Review the LLM's counterarguments critically — not everything it raises will be relevant
- Ask: does any of this change my workup or management?
- Pitfall callout: The goal is not to second-guess every decision. Use this for cases where you feel uncertain, where the stakes are high, or where the presentation is atypical.

---

## Tool Reviews

All follow the existing Claude review format (overview, clinical strengths, weaknesses, HIPAA/BAA, pricing, categories, related workflows).

### OpenAI (GPT-4o / o1 / o3)

**File:** `src/content/tools/openai.mdx`

| Field | Value |
|---|---|
| Rating | 4/5 |
| Verdict | "The o-series reasoning models are the best available for structured diagnostic thinking" |
| Pricing | "Free tier + $20/mo Plus + $200/mo Pro" |
| BAA | Yes (enterprise/API tier) |
| Categories | clinical-reasoning, note-writing, general |

**Clinical strengths:** o3's chain-of-thought is genuinely superior for DDx generation; GPT-4o is fast and solid for routine tasks; strong ecosystem (API, custom GPTs).

**Weaknesses:** Confusing model lineup (which model do I pick?); o-series models are slower; BAA is enterprise-only; consumer ChatGPT is not HIPAA-compliant.

### Google Gemini

**File:** `src/content/tools/gemini.mdx`

| Field | Value |
|---|---|
| Rating | 3/5 |
| Verdict | "Massive context window is a real advantage for complex cases with extensive records, but reasoning depth trails Claude and o3" |
| Pricing | "Free tier + $20/mo Advanced" |
| BAA | Available through Google Cloud/Vertex AI |
| Categories | clinical-reasoning, literature-review, general |

**Clinical strengths:** 1M+ token context window for pasting entire charts; good at summarization; integrated with Google ecosystem.

**Weaknesses:** Reasoning output is less structured and less clinically precise than Claude or o3; BAA situation is murkier (requires Vertex AI, not consumer Gemini); tends to be more verbose and less actionable.

### Perplexity

**File:** `src/content/tools/perplexity.mdx`

| Field | Value |
|---|---|
| Rating | 3/5 |
| Verdict | "The only major LLM that cites real sources in real-time — valuable for evidence-grounded reasoning, unreliable for structured clinical tasks" |
| Pricing | "Free tier + $20/mo Pro" |
| BAA | No |
| Categories | literature-review, clinical-reasoning |

**Clinical strengths:** Real-time literature search integrated into reasoning; citations you can verify; good for "is there evidence for X" questions.

**Weaknesses:** Not designed for structured clinical workflows; can't follow complex multi-part prompts as well; no BAA — cannot be used with patient data.

### Claude (Update)

**File:** `src/content/tools/claude.mdx` (existing — add section)

Add a "Clinical Reasoning" section covering:
- Recommended for case synthesis and cognitive debiasing
- Nuanced, hedged output is a feature for reasoning tasks
- Reference the comparison guide for head-to-head evidence
- Cross-link to clinical reasoning and debiasing workflows

---

## Templates

All follow existing template format: copy-paste prompt with `[PLACEHOLDER]` tags, tool badge, copy-to-clipboard button, link to parent workflow.

### Template 1: Differential Diagnosis Generator

**File:** `src/content/templates/ddx-generator.mdx`

| Field | Value |
|---|---|
| Category | clinical-reasoning |
| Target tool | openai |
| Parent workflow | clinical-reasoning |
| Tags | differential-diagnosis, clinical-reasoning, diagnostic |

**Prompt design:** Role (experienced diagnostician), structured case input section, asks for:
1. Ranked differential with pre-test probability estimates
2. Supporting evidence per diagnosis
3. Refuting evidence per diagnosis
4. Separate "can't-miss diagnoses" section (uncommon but dangerous)

### Template 2: Diagnostic Workup Planner

**File:** `src/content/templates/workup-planner.mdx`

| Field | Value |
|---|---|
| Category | clinical-reasoning |
| Target tool | openai |
| Parent workflow | clinical-reasoning |
| Tags | workup, diagnostic, test-ordering, clinical-reasoning |

**Prompt design:** Takes DDx output as input, asks for:
1. Prioritized test ordering with rationale
2. What each test rules in/out
3. Cost-consciousness note
4. Suggested sequence (what to order first vs. hold pending initial results)

### Template 3: Case Synthesis / Assessment & Plan

**File:** `src/content/templates/case-synthesis.mdx`

| Field | Value |
|---|---|
| Category | clinical-reasoning |
| Target tool | claude |
| Parent workflow | clinical-reasoning |
| Tags | assessment, plan, synthesis, clinical-reasoning |

**Prompt design:** Takes full case data (HPI + DDx + workup results), asks for:
1. Integrated assessment
2. Most likely diagnosis with confidence level
3. Management plan organized by problem
4. Explicit documentation of diagnostic uncertainty

### Template 4: Devil's Advocate / Bias Check

**File:** `src/content/templates/bias-check.mdx`

| Field | Value |
|---|---|
| Category | clinical-reasoning |
| Target tool | claude |
| Parent workflow | cognitive-debiasing |
| Tags | debiasing, cognitive-bias, second-opinion, clinical-reasoning |

**Prompt design:** Takes clinician's working diagnosis and supporting reasoning, instructs the LLM to:
1. Argue against the working diagnosis
2. Find contradicting evidence
3. Suggest overlooked diagnoses
4. Identify which cognitive biases might be at play (anchoring, availability, premature closure)
5. Suggest one test or question that would most change the picture

---

## Guide: "Which LLM for Clinical Reasoning?"

**File:** `src/content/guides/llm-clinical-reasoning-comparison.mdx`

| Field | Value |
|---|---|
| Title | "Which LLM for Clinical Reasoning? A Head-to-Head Comparison" |
| Description | "We ran the same clinical case through Claude, GPT-4o, o3, Gemini, and Perplexity. Here's which model wins at each reasoning task — with receipts." |
| Tags | clinical-reasoning, comparison, tools, differential-diagnosis |
| Last Updated | 2026-03-18 |
| Featured | true |

**Structure:**

### 1. The Test Case
A moderately complex clinical vignette (e.g., 55M with chest pain, dyspnea, and an unexpected lab finding). Same case, same prompt, fed to all 4 models.

### 2. Head-to-Head Comparisons
Using `<OutputComparison>` component for each task:
- **DDx Generation** — Winner: o3
- **Workup Planning** — Winner: o3 (slight edge over Claude)
- **Case Synthesis** — Winner: Claude
- **Debiasing / Devil's Advocate** — Winner: Claude
- **Literature-Grounded Reasoning** — Winner: Perplexity

### 3. Summary Scoring Table
**New component: `<PerformanceMatrix>`** — a task-vs-model grid with strong/adequate/weak ratings per cell. This is distinct from the existing `<ComparisonTable>` (which is a tool-vs-tool table driven by frontmatter). Tasks as rows, models as columns.

| Task | Claude | o3 | GPT-4o | Gemini | Perplexity |
|---|---|---|---|---|---|
| DDx Generation | adequate | **strong** | adequate | adequate | weak |
| Workup Planning | strong | **strong** | adequate | adequate | weak |
| Case Synthesis | **strong** | adequate | adequate | adequate | weak |
| Debiasing | **strong** | adequate | adequate | weak | weak |
| Literature-Grounded | weak | weak | weak | weak | **strong** |
| Long-Record Ingestion | adequate | adequate | adequate | **strong** | weak |

### 4. The Bottom Line
"If you're picking one model for clinical reasoning, use o3. If you want a second opinion or need to synthesize a complex case, use Claude. If you need to check the literature, use Perplexity. Gemini is worth considering only if your case involves very long records."

### 5. Methodology Note
When comparisons were run, model versions used, caveat that models update frequently and will be re-tested periodically.

---

## Trials

### New: JAMA Internal Medicine 2023

**File:** `src/content/trials/llm-clinical-reasoning-jama-2023.mdx`

| Field | Value |
|---|---|
| Journal | JAMA Internal Medicine |
| Year | 2023 |
| DOI | 10.1001/jamainternmed.2023.3982 |
| Key Finding | LLMs matched or exceeded physician performance on standardized diagnostic reasoning tasks, but with different error patterns |
| Tags | clinical-reasoning, diagnostic-accuracy, AI-comparison |

**Content:** LLMs miss atypical presentations; physicians miss rare diseases. LLMs and physicians are complementary reasoners — supports the argument for using LLMs as a second opinion rather than a replacement.

### Update: NEJM 2024 (existing)

**File:** `src/content/trials/llm-diagnostic-nejm-2024.mdx`

Add cross-references to new clinical reasoning workflow and comparison guide in related content links. No content changes.

---

## Cross-Reference Map

```
clinical-reasoning workflow
  ├── tools: [openai, claude]  # only models recommended at specific steps; gemini/perplexity linked via guide only
  ├── templates: [ddx-generator, workup-planner, case-synthesis]
  ├── trials: [llm-diagnostic-nejm-2024, llm-clinical-reasoning-jama-2023]
  └── links to: cognitive-debiasing workflow, comparison guide

cognitive-debiasing workflow
  ├── tools: [claude]
  ├── templates: [bias-check]
  ├── trials: [llm-clinical-reasoning-jama-2023]
  └── linked from: clinical-reasoning workflow step 4

comparison guide
  ├── references: all 4 tool reviews
  ├── references: both trials
  └── linked from: both workflows, all tool reviews

tool reviews (openai, gemini, perplexity)
  └── link to: comparison guide, relevant workflows

claude review (update)
  └── add: clinical reasoning section, link to comparison guide
```

## Technical Notes

- All new content uses existing Astro content collection schemas — no schema changes needed
- `clinical-reasoning` category already exists in the `workflowCategories` enum
- All interactive components (`<PromptPlayground>`, `<OutputComparison>`, `<Callout>`, `<ToolCard>`, `<ComparisonTable>`, `<TrialSummary>`) already exist
- **One new component required:** `<PerformanceMatrix>` — a task-vs-model grid for the comparison guide's summary table. The existing `<ComparisonTable>` is a tool-vs-tool table driven by frontmatter and cannot represent this data shape.

### `<PerformanceMatrix>` Component Spec

**File:** `src/components/PerformanceMatrix.tsx`

```typescript
type Rating = 'strong' | 'adequate' | 'weak';

interface PerformanceMatrixProps {
  tasks: string[];                    // row labels (e.g., "DDx Generation")
  models: string[];                   // column headers (e.g., "Claude", "o3")
  ratings: Record<string, Record<string, Rating>>; // tasks → models → rating
}
```

- Static display, no interactivity (no sorting/filtering)
- Renders as an HTML table with color-coded cells: green (strong), neutral (adequate), muted (weak)
- Bold text for "strong" ratings to highlight winners
- Data is passed as props from MDX, not fetched from frontmatter
- The `<OutputComparison>` component in the comparison guide will need pre-generated static outputs from each model (no live API calls)

## Out of Scope

- Live LLM API connections (all comparisons use pre-generated static output)
- Specialty-specific reasoning workflows (cardiology, neurology, etc.) — future content
- Integration with clinical decision support tools or EHR systems
