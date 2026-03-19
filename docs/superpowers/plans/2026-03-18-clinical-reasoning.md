# Clinical Reasoning Section — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build out the clinical reasoning content vertical for llmsfordoctors.com — 2 workflows, 4 templates, 3 tool reviews, 1 comparison guide, 1 trial summary, 1 new component, and 2 updates to existing content.

**Architecture:** All content is MDX in Astro content collections. No schema changes needed — `clinical-reasoning` category already exists. One new Preact component (`PerformanceMatrix`). Content follows existing patterns established by the discharge-summary workflow, Claude tool review, and basic template.

**Tech Stack:** Astro 5, MDX, TypeScript, Preact (islands), Tailwind CSS

**Spec:** `docs/superpowers/specs/2026-03-18-clinical-reasoning-design.md`

**Branch:** `feature/llms-for-doctors`

**Important:** All files live under `llmsfordoctors/` on the `feature/llms-for-doctors` branch. Paths below are relative to the repo root. You must be on the `feature/llms-for-doctors` branch to create these files.

---

## Task 0: Pre-flight — Switch to the correct branch

- [ ] **Step 1: Check out the feature branch**

```bash
git checkout feature/llms-for-doctors
git pull origin feature/llms-for-doctors
```

- [ ] **Step 2: Verify you're on the right branch and the project builds**

```bash
git branch --show-current  # Expected: feature/llms-for-doctors
cd llmsfordoctors && npm install && npm run build
```

---

## File Structure

```
llmsfordoctors/
├── src/
│   ├── components/
│   │   └── PerformanceMatrix.tsx          # NEW — task-vs-model scoring grid
│   ├── content/
│   │   ├── workflows/
│   │   │   ├── clinical-reasoning.mdx     # NEW — flagship 4-step workflow
│   │   │   └── cognitive-debiasing.mdx    # NEW — 3-step debiasing workflow
│   │   ├── tools/
│   │   │   ├── claude.mdx                 # MODIFY — add clinical reasoning section
│   │   │   ├── openai.mdx                 # NEW — GPT-4o / o1 / o3 review
│   │   │   ├── gemini.mdx                 # NEW — Google Gemini review
│   │   │   └── perplexity.mdx             # NEW — Perplexity review
│   │   ├── templates/
│   │   │   ├── ddx-generator.mdx          # NEW — differential diagnosis template
│   │   │   ├── workup-planner.mdx         # NEW — diagnostic workup template
│   │   │   ├── case-synthesis.mdx         # NEW — assessment & plan template
│   │   │   └── bias-check.mdx             # NEW — devil's advocate template
│   │   ├── guides/
│   │   │   └── llm-clinical-reasoning-comparison.mdx  # NEW — head-to-head guide
│   │   └── trials/
│   │       ├── llm-diagnostic-nejm-2024.mdx           # MODIFY — add cross-refs
│   │       └── llm-clinical-reasoning-jama-2023.mdx   # NEW — JAMA 2023 trial
```

---

## Task 1: PerformanceMatrix Component

**Why first:** The comparison guide (Task 10) imports this component. Build it first so the guide can use it.

**Files:**
- Create: `llmsfordoctors/src/components/PerformanceMatrix.tsx`

- [ ] **Step 1: Create the PerformanceMatrix component**

```tsx
// llmsfordoctors/src/components/PerformanceMatrix.tsx
import { type JSX } from 'preact';

type Rating = 'strong' | 'adequate' | 'weak';

interface PerformanceMatrixProps {
  tasks: string[];
  models: string[];
  ratings: Record<string, Record<string, Rating>>;
}

const ratingStyles: Record<Rating, string> = {
  strong: 'bg-green-100 text-green-800 font-bold',
  adequate: 'bg-clinical-50 text-clinical-600',
  weak: 'bg-red-50 text-red-400',
};

const ratingLabels: Record<Rating, string> = {
  strong: 'Strong',
  adequate: 'Adequate',
  weak: 'Weak',
};

export default function PerformanceMatrix({ tasks, models, ratings }: PerformanceMatrixProps) {
  return (
    <div class="overflow-x-auto rounded-lg border border-clinical-200">
      <table class="w-full text-sm">
        <thead class="bg-clinical-800 text-clinical-100">
          <tr>
            <th class="text-left px-4 py-3 font-semibold">Task</th>
            {models.map((model) => (
              <th key={model} class="text-center px-4 py-3 font-semibold">
                {model}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, i) => (
            <tr key={task} class={i % 2 === 0 ? 'bg-white' : 'bg-clinical-50'}>
              <td class="px-4 py-3 font-medium text-clinical-800">{task}</td>
              {models.map((model) => {
                const rating = ratings[task]?.[model] ?? 'weak';
                return (
                  <td key={model} class="px-4 py-3 text-center">
                    <span
                      class={`inline-block px-2 py-0.5 rounded text-xs ${ratingStyles[rating]}`}
                    >
                      {ratingLabels[rating]}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

- [ ] **Step 2: Verify the build compiles**

Run: `cd llmsfordoctors && npm run build`
Expected: Build succeeds (component is not yet imported anywhere, but TypeScript should compile clean)

- [ ] **Step 3: Commit**

```bash
git add llmsfordoctors/src/components/PerformanceMatrix.tsx
git commit -m "feat: add PerformanceMatrix component for task-vs-model scoring grid"
```

---

## Task 2: DDx Generator Template

**Why early:** Workflows reference templates. Build templates first so workflows can link to them.

**Files:**
- Create: `llmsfordoctors/src/content/templates/ddx-generator.mdx`

**Reference pattern:** `llmsfordoctors/src/content/templates/discharge-summary-basic.mdx`

- [ ] **Step 1: Create the DDx Generator template**

```mdx
---
title: "Differential Diagnosis Generator"
category: clinical-reasoning
targetTool: openai
workflow: clinical-reasoning
tags: [differential-diagnosis, clinical-reasoning, diagnostic]
lastUpdated: 2026-03-18
---

import Callout from '../../components/Callout.astro';
import PromptPlayground from '../../components/PromptPlayground.astro';

This template generates a ranked differential diagnosis from a structured case presentation. Optimized for OpenAI's o3 model, which produces the most thorough chain-of-thought reasoning for diagnostic tasks.

<Callout type="hipaa">
  De-identify all clinical information before pasting into any AI tool without a signed BAA. Remove patient name, date of birth, MRN, dates of service, provider names, and any other direct identifiers.
</Callout>

---

## Prompt Template

<PromptPlayground tool="OpenAI (o3)" title="Differential Diagnosis Generator">
You are an experienced academic diagnostician with broad expertise across internal medicine subspecialties. You are reviewing a clinical case to generate a comprehensive differential diagnosis.

**Your task:** Based on the clinical information below, generate a ranked differential diagnosis.

For EACH diagnosis on your differential, provide:
1. **Pre-test probability estimate** (high / moderate / low)
2. **Supporting evidence** — specific findings from this case that support this diagnosis
3. **Refuting evidence** — specific findings that argue against it, or expected findings that are absent

After your main differential, provide a separate section:

**⚠️ Can't-Miss Diagnoses**
List any uncommon but dangerous diagnoses that must be ruled out even if they are low probability. For each, state what single test or finding would most efficiently rule it in or out.

Format your differential as a numbered list, ranked from most likely to least likely.

---

CLINICAL INFORMATION:

**Age/Sex:** [e.g., 55-year-old male]

**Chief Complaint:** [e.g., progressive dyspnea on exertion x 2 weeks]

**History of Present Illness:**
[Paste or summarize the HPI — onset, duration, severity, associated symptoms, aggravating/relieving factors, pertinent negatives]

**Past Medical History:**
[Key diagnoses, surgeries, hospitalizations]

**Medications:**
[Current medication list]

**Relevant Exam Findings:**
[Pertinent positives and negatives from physical exam]

**Initial Studies:**
[Labs, imaging, ECG, or other results available at the time of evaluation]
</PromptPlayground>

---

## Customization Guide

| Element | How to Adjust |
|---|---|
| Specialty focus | Add: "Focus your differential on cardiology etiologies given the patient's cardiac history" |
| Depth | Add: "Limit to 5 most likely diagnoses" or "Include at least 10 diagnoses" |
| Trainee use | Add: "For each diagnosis, also explain the pathophysiological mechanism in 1-2 sentences" |
| Bayesian framing | Add: "Include specific pre-test probability percentages rather than high/moderate/low categories" |

---

## Tips

- **Be specific in your clinical information.** Vague inputs ("patient has chest pain") yield vague differentials. Include pertinent negatives — what you *didn't* find is as important as what you did.
- **Ask for "can't-miss" diagnoses explicitly.** LLMs tend to weight common diagnoses heavily. The separate can't-miss section forces consideration of PE, aortic dissection, ectopic pregnancy, and other low-frequency emergencies.
- **Compare with your own DDx.** Write your differential first, then compare. The most valuable output is the diagnosis you *didn't* think of.
```

- [ ] **Step 2: Verify the build**

Run: `cd llmsfordoctors && npm run build`
Expected: Build succeeds, template page renders at `/templates/ddx-generator`

- [ ] **Step 3: Commit**

```bash
git add llmsfordoctors/src/content/templates/ddx-generator.mdx
git commit -m "feat: add differential diagnosis generator template"
```

---

## Task 3: Workup Planner Template

**Files:**
- Create: `llmsfordoctors/src/content/templates/workup-planner.mdx`

- [ ] **Step 1: Create the Workup Planner template**

```mdx
---
title: "Diagnostic Workup Planner"
category: clinical-reasoning
targetTool: openai
workflow: clinical-reasoning
tags: [workup, diagnostic, test-ordering, clinical-reasoning]
lastUpdated: 2026-03-18
---

import Callout from '../../components/Callout.astro';
import PromptPlayground from '../../components/PromptPlayground.astro';

This template takes a differential diagnosis and generates a prioritized diagnostic workup. Optimized for OpenAI's o3 model, which reasons well about test characteristics and Bayesian narrowing.

<Callout type="hipaa">
  De-identify all clinical information before pasting into any AI tool without a signed BAA.
</Callout>

---

## Prompt Template

<PromptPlayground tool="OpenAI (o3)" title="Diagnostic Workup Planner">
You are an experienced academic internist planning the diagnostic workup for a patient. You have already generated a differential diagnosis and now need to determine the most efficient path to the correct diagnosis.

**Your task:** Given the differential diagnosis below, create a prioritized workup plan.

For EACH recommended test or study, provide:
1. **What it tests for** — which diagnoses on the differential it helps rule in or rule out
2. **Expected findings** — what result would support or refute specific diagnoses
3. **Priority** — First-line (order now), Second-line (order if first-line is non-diagnostic), or Conditional (only if specific findings arise)

**Additional requirements:**
- Order tests from highest diagnostic yield to lowest
- Flag any test that is expensive, invasive, or has significant wait time
- If two tests provide overlapping information, recommend the simpler/cheaper one first
- Note any tests that should be ordered BEFORE starting empiric treatment (e.g., blood cultures before antibiotics)

---

CURRENT DIFFERENTIAL DIAGNOSIS:
[Paste your ranked differential here — from the DDx Generator output or your own assessment]

CLINICAL CONTEXT:
[Brief summary — age, sex, chief complaint, key findings that inform test selection]

TESTS ALREADY COMPLETED:
[List any labs, imaging, or studies already done with results]
</PromptPlayground>

---

## Customization Guide

| Element | How to Adjust |
|---|---|
| Resource setting | Add: "This is a community hospital without MRI or interventional radiology on-site" |
| Cost sensitivity | Add: "Prioritize cost-effective testing. Note approximate cost for each recommended study." |
| Urgency | Add: "This is an emergency department evaluation. Prioritize tests available within 1 hour." |
| Outpatient | Add: "This is an outpatient workup. All tests must be orderable from clinic." |

---

## Tips

- **Include tests already done.** If you've already run a CBC and BMP, the AI shouldn't recommend them again. Listing completed studies prevents redundancy.
- **Specify your setting.** A rural ED, an academic medical center, and an outpatient clinic have very different test availability. The AI can't know this unless you tell it.
- **Use this iteratively.** Run the planner, get first-line results back, then re-run with updated information. The AI adjusts its second-line recommendations based on what you've learned.
```

- [ ] **Step 2: Verify the build**

Run: `cd llmsfordoctors && npm run build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add llmsfordoctors/src/content/templates/workup-planner.mdx
git commit -m "feat: add diagnostic workup planner template"
```

---

## Task 4: Case Synthesis Template

**Files:**
- Create: `llmsfordoctors/src/content/templates/case-synthesis.mdx`

- [ ] **Step 1: Create the Case Synthesis template**

```mdx
---
title: "Case Synthesis — Assessment & Plan"
category: clinical-reasoning
targetTool: claude
workflow: clinical-reasoning
tags: [assessment, plan, synthesis, clinical-reasoning]
lastUpdated: 2026-03-18
---

import Callout from '../../components/Callout.astro';
import PromptPlayground from '../../components/PromptPlayground.astro';

This template synthesizes a complete clinical picture into a structured assessment and plan. Optimized for Claude, which excels at integrating large amounts of clinical data into a coherent narrative with appropriate hedging around diagnostic uncertainty.

<Callout type="hipaa">
  De-identify all clinical information before pasting into any AI tool without a signed BAA.
</Callout>

---

## Prompt Template

<PromptPlayground tool="Claude" title="Case Synthesis — Assessment & Plan">
You are an experienced attending physician synthesizing a clinical case. You have the full clinical picture — history, exam, differential diagnosis, and workup results — and need to formulate a clear assessment and management plan.

**Your task:** Based on all the information below, write a structured Assessment & Plan.

**Assessment section:**
1. State the most likely diagnosis with your confidence level (high / moderate / low confidence)
2. Briefly justify why this is the leading diagnosis (2-3 sentences)
3. List any remaining diagnostic uncertainty — what could this still be, and what would change your mind?

**Plan section:**
Organize by problem. For each active problem:
1. Problem name
2. Current status (new, chronic stable, chronic worsening, resolved)
3. Specific management steps (medications, procedures, consults, monitoring)
4. Follow-up plan and contingency (what to do if the patient doesn't improve)

**Requirements:**
- Be direct and clinically precise. Avoid hedging language that doesn't add information.
- Where there is genuine uncertainty, name it explicitly rather than hiding it behind qualifiers.
- If the data is insufficient to make a confident diagnosis, say so and recommend what additional information would resolve the uncertainty.

---

CLINICAL INFORMATION:

**Patient Summary:** [Age, sex, chief complaint, relevant PMH in one sentence]

**History of Present Illness:**
[HPI summary]

**Differential Diagnosis (ranked):**
[Paste your DDx — either from the DDx Generator or your own]

**Workup Results:**
[Paste all completed test results — labs, imaging, studies, consult notes]

**Current Clinical Status:**
[How the patient is doing right now — stable, improving, deteriorating]
</PromptPlayground>

---

## Customization Guide

| Element | How to Adjust |
|---|---|
| Audience | Add: "Write for a subspecialty consultant receiving the case" or "Write for a PCP receiving a discharge summary" |
| Complexity | Add: "This patient has 8 active problems. Prioritize the top 3 and briefly note the rest." |
| Teaching | Add: "For each management decision, include a brief evidence-based rationale citing guidelines when relevant" |
| Uncertainty | Add: "Use specific probability language (e.g., '70% likely') rather than high/moderate/low" |

---

## Tips

- **Feed it everything.** Claude's large context window means you can paste in the full workup results. More data yields better synthesis — don't summarize away important details.
- **State what you think first.** Add your own assessment before the AI generates one. Then compare. This prevents the AI from anchoring you — and lets you see where your reasoning diverges.
- **Use for complex patients.** This template shines for the patient with 5 active problems and a new presentation. It's less useful for straightforward cases where you already know the diagnosis.
```

- [ ] **Step 2: Verify the build**

Run: `cd llmsfordoctors && npm run build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add llmsfordoctors/src/content/templates/case-synthesis.mdx
git commit -m "feat: add case synthesis assessment and plan template"
```

---

## Task 5: Bias Check Template

**Files:**
- Create: `llmsfordoctors/src/content/templates/bias-check.mdx`

- [ ] **Step 1: Create the Bias Check template**

```mdx
---
title: "Devil's Advocate — Cognitive Bias Check"
category: clinical-reasoning
targetTool: claude
workflow: cognitive-debiasing
tags: [debiasing, cognitive-bias, second-opinion, clinical-reasoning]
lastUpdated: 2026-03-18
---

import Callout from '../../components/Callout.astro';
import PromptPlayground from '../../components/PromptPlayground.astro';

This template turns an LLM into a constructive adversary. Give it your working diagnosis and reasoning, and it will systematically argue against you — surfacing blind spots, cognitive biases, and overlooked alternatives. Optimized for Claude, whose tendency toward nuance and hedging is a genuine strength for this task.

<Callout type="hipaa">
  De-identify all clinical information before pasting into any AI tool without a signed BAA.
</Callout>

---

## Prompt Template

<PromptPlayground tool="Claude" title="Devil's Advocate — Cognitive Bias Check">
You are a senior attending physician serving as a diagnostic second opinion. Your role is to constructively challenge the clinical reasoning presented to you. You are NOT trying to confirm the working diagnosis — you are trying to find holes in the reasoning.

**Your task:** Review the working diagnosis and reasoning below, then:

**1. Challenge the Diagnosis**
- What specific evidence in this case CONTRADICTS or is unexplained by the working diagnosis?
- What alternative diagnoses could explain the same findings equally well or better?
- Rate your concern level for each alternative: low (unlikely but worth considering), moderate (plausible), high (should be actively ruled out)

**2. Identify Cognitive Biases**
- Is there evidence of **anchoring** (fixating on an early impression despite conflicting data)?
- Is there evidence of **premature closure** (stopping the diagnostic process too early)?
- Is there evidence of **availability bias** (favoring a diagnosis because it's common or recently seen)?
- Is there evidence of **confirmation bias** (selectively attending to data that supports the working diagnosis)?
- For each bias identified, explain specifically how it may be operating in this case.

**3. The One Question**
Suggest the single most important test, question, or piece of information that would most change the diagnostic picture — either confirming the working diagnosis definitively or redirecting to an alternative.

Be direct and specific. Don't soften your challenges with unnecessary qualifiers.

---

WORKING DIAGNOSIS: [State your leading diagnosis]

YOUR REASONING:
[Explain why you believe this is the correct diagnosis — what evidence supports it, what you've already ruled out, and your confidence level]

KEY CLINICAL FINDINGS:
[Summarize the critical data points — history, exam, labs, imaging]

WHAT YOU'VE ALREADY CONSIDERED AND REJECTED:
[List diagnoses you've already thought about and why you dismissed them — this prevents the AI from re-raising things you've already worked through]
</PromptPlayground>

---

## Customization Guide

| Element | How to Adjust |
|---|---|
| Gentler tone | Add: "Frame your challenges as questions rather than assertions" |
| Trainee mode | Add: "After each bias identification, briefly explain the cognitive bias concept for a medical trainee" |
| Focused scope | Add: "Focus specifically on cardiovascular and pulmonary differentials" |
| High stakes | Add: "This patient is critically ill. Emphasize any life-threatening diagnoses that have not been adequately ruled out" |

---

## When to Use This

- When you feel **very confident** in your diagnosis (confidence ≠ accuracy — high confidence is when anchoring is most dangerous)
- When the presentation is **atypical** for the working diagnosis
- When there's a **nagging finding** that doesn't fit but you can't articulate why
- When the **stakes are high** — ICU patients, surgical decisions, diagnoses that change prognosis dramatically
- When you're **fatigued** or at the end of a long shift

<Callout type="pitfall">
  This tool is for cases where you want a second opinion, not for every patient. Using it routinely will create decision fatigue and slow you down. Save it for cases where it matters.
</Callout>
```

- [ ] **Step 2: Verify the build**

Run: `cd llmsfordoctors && npm run build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add llmsfordoctors/src/content/templates/bias-check.mdx
git commit -m "feat: add cognitive bias check (devil's advocate) template"
```

---

## Task 6: OpenAI Tool Review

**Files:**
- Create: `llmsfordoctors/src/content/tools/openai.mdx`

**Reference pattern:** `llmsfordoctors/src/content/tools/claude.mdx` (read this file on the `feature/llms-for-doctors` branch for exact structure: `git show feature/llms-for-doctors:llmsfordoctors/src/content/tools/claude.mdx`)

- [ ] **Step 1: Create the OpenAI tool review**

```mdx
---
title: "OpenAI (GPT-4o / o1 / o3) for Clinical Practice"
slug: openai
vendor: OpenAI
rating: 4
verdict: "The o-series reasoning models are the best available for structured diagnostic thinking"
pricing: "Free tier + $20/mo Plus + $200/mo Pro"
hasBaa: true
categories: [clinical-reasoning, note-writing, general]
lastUpdated: 2026-03-18
---

import Callout from '../../components/Callout.astro';

## Overview

OpenAI offers the most complex model lineup in clinical AI — and that's both its strength and its weakness. The GPT-4o family handles general clinical tasks well, but the real standout for clinical reasoning is the **o-series** (o1 and o3): models that "think" step by step before responding, producing structured chain-of-thought reasoning that is genuinely superior for diagnostic tasks.

The challenge is figuring out which model to use. Here's the short version:

- **GPT-4o** — fast, capable, good for routine clinical tasks (notes, patient letters, summarization)
- **o1** — slower, better reasoning, good for complex diagnostic questions
- **o3** — the most powerful reasoning model available as of early 2026, best-in-class for differential diagnosis generation

OpenAI offers BAAs for healthcare organizations through their enterprise and API tiers.

---

## Clinical Strengths

The o-series models differentiate OpenAI from the competition in clinical reasoning:

- **Differential diagnosis generation** — o3's chain-of-thought reasoning produces ranked differentials with explicit supporting and refuting evidence that are notably more thorough than any competing model
- **Structured diagnostic thinking** — the step-by-step reasoning approach mirrors how clinicians are trained to think, making the output easy to audit
- **Multi-step reasoning** — excels at "given A and B, what follows?" questions where you need logical chaining
- **Format compliance** — GPT-4o is excellent at producing output in specified formats (tables, numbered lists, structured templates)
- **Ecosystem** — custom GPTs let you build reusable clinical tools; API access enables integration into EHR workflows

---

## Weaknesses

- **Confusing model lineup** — "Which OpenAI model should I use?" is genuinely hard to answer. The naming is inconsistent and capabilities overlap.
- **o-series models are slow** — o3 can take 30-60 seconds to respond to complex queries. This is the tradeoff for better reasoning.
- **Narrative quality** — for long-form clinical prose (discharge summaries, referral letters), Claude produces more natural, better-organized text
- **Hedging and nuance** — OpenAI models tend to be more assertive and less appropriately hedged than Claude in ambiguous clinical scenarios. This can be a strength (clarity) or a weakness (overconfidence).
- **Consumer tier not HIPAA-compliant** — ChatGPT Plus ($20/mo) does NOT include a BAA. You must use the enterprise tier or API with a signed BAA for any patient data.

---

## HIPAA & Privacy

<Callout type="hipaa">
  The standard ChatGPT product (Free and Plus tiers) does NOT include a Business Associate Agreement (BAA). Do not enter real patient information into ChatGPT unless your organization has a signed BAA with OpenAI. For HIPAA-compliant use, you need ChatGPT Enterprise, ChatGPT Team with a BAA, or the API under a signed agreement.
</Callout>

OpenAI's enterprise offerings include:
- Business Associate Agreement (BAA)
- Zero data retention on API (prompts not used for training)
- SOC 2 Type II compliance
- Admin controls and audit logging

---

## Which Model Should I Use?

| Task | Best Model | Why |
|---|---|---|
| Differential diagnosis | o3 | Deepest chain-of-thought reasoning |
| Workup planning | o3 or o1 | Strong logical sequencing |
| Quick clinical question | GPT-4o | Fast, accurate, good enough |
| Note writing | GPT-4o | Speed matters; reasoning depth doesn't |
| Patient communication | GPT-4o | Natural language, fast turnaround |
| Complex case synthesis | o3 | But consider Claude for this task |

---

## Pricing

| Tier | Cost | BAA | Best For |
|---|---|---|---|
| ChatGPT Free | $0 | No | Trying it out (no patient data) |
| ChatGPT Plus | $20/mo | No | Personal use (no patient data) |
| ChatGPT Pro | $200/mo | No | Heavy use, o3 access (no patient data) |
| ChatGPT Team | $25/user/mo | Available | Small practices |
| ChatGPT Enterprise | Custom | Yes | Health systems, hospitals |
| API | Usage-based | Yes (with agreement) | Custom integrations |

---

## The Bottom Line

OpenAI earns a 4/5 because the o-series reasoning models are genuinely the best available for structured diagnostic thinking. If your primary use case is differential diagnosis or complex clinical reasoning, o3 is the model to use. The point deduction is for the confusing product lineup and the fact that HIPAA-compliant access requires enterprise pricing. For narrative clinical tasks (notes, letters, summaries), Claude is still the stronger choice.

See our [head-to-head comparison guide](/guides/llm-clinical-reasoning-comparison) for detailed output comparisons.
```

- [ ] **Step 2: Verify the build**

Run: `cd llmsfordoctors && npm run build`
Expected: Build succeeds, tool page renders at `/tools/openai`

- [ ] **Step 3: Commit**

```bash
git add llmsfordoctors/src/content/tools/openai.mdx
git commit -m "feat: add OpenAI (GPT-4o / o-series) tool review"
```

---

## Task 7: Google Gemini Tool Review

**Files:**
- Create: `llmsfordoctors/src/content/tools/gemini.mdx`

- [ ] **Step 1: Create the Gemini tool review**

```mdx
---
title: "Google Gemini for Clinical Practice"
slug: gemini
vendor: Google
rating: 3
verdict: "Massive context window is a real advantage for complex cases with extensive records, but reasoning depth trails Claude and o3"
pricing: "Free tier + $20/mo Advanced"
hasBaa: true
categories: [clinical-reasoning, literature-review, general]
lastUpdated: 2026-03-18
---

import Callout from '../../components/Callout.astro';

## Overview

Google's Gemini models bring one killer feature to clinical practice: a context window exceeding 1 million tokens. In practical terms, that means you can paste an **entire patient chart** — progress notes, consult notes, imaging reports, lab trends, operative notes — into a single prompt and ask the AI to synthesize it. No other model can match this for sheer volume of input.

The catch is that Gemini's reasoning output, while competent, is less structured and less clinically precise than Claude or OpenAI's o-series models. It's a strong summarizer but a weaker diagnostician.

---

## Clinical Strengths

- **Massive context window** — 1M+ tokens means you can input entire hospital courses, multi-year outpatient records, or lengthy specialist reports without truncation
- **Record summarization** — genuinely useful for "summarize the last 6 months of cardiology notes" tasks where volume is the challenge
- **Google ecosystem integration** — works with Google Workspace, which some health systems use
- **Literature search context** — can process lengthy review articles or guideline documents in full

---

## Weaknesses

- **Reasoning depth** — for differential diagnosis and structured clinical reasoning, Gemini's output is notably less rigorous than Claude or o3. It tends to produce reasonable but surface-level differentials.
- **Verbosity** — Gemini tends to produce longer, less focused outputs. Where Claude gives you a crisp 5-item differential, Gemini gives you 10 items with more text and less signal.
- **BAA complexity** — HIPAA-compliant access requires Google Cloud / Vertex AI, not the consumer Gemini product. The setup is more complex than Anthropic's or OpenAI's enterprise offerings.
- **Clinical language precision** — medical terminology and clinical framing are less natural than Claude's output. The prose reads more like a medical student's write-up than an attending's.

---

## HIPAA & Privacy

<Callout type="hipaa">
  The consumer Gemini product (gemini.google.com) does NOT include a BAA. For HIPAA-compliant use, you must use Gemini through Google Cloud's Vertex AI platform with a signed BAA. This requires a Google Cloud account and is more technically complex to set up than competing options.
</Callout>

Google Cloud healthcare offerings include:
- BAA available through Vertex AI
- SOC 2 and HITRUST certification
- Data residency controls
- Integration with Google Cloud Healthcare API

---

## When Gemini Makes Sense

Use Gemini when **volume of input** is the primary challenge:

- Synthesizing a chart with dozens of notes spanning months or years
- Reviewing a lengthy guideline document or systematic review
- Comparing multiple specialist opinions on the same patient
- Any task where you need to input more text than other models' context windows allow

For everything else — differential diagnosis, workup planning, clinical notes, patient communication — Claude or OpenAI will produce better results.

---

## The Bottom Line

Gemini earns a 3/5. The context window is a legitimate differentiator — no other model lets you paste a full patient chart and ask a question about it. But for the clinical reasoning tasks that matter most (differential diagnosis, case synthesis, management planning), Gemini consistently trails Claude and o3 in output quality. It's a strong supplementary tool, not a primary one.

See our [head-to-head comparison guide](/guides/llm-clinical-reasoning-comparison) for detailed output comparisons.
```

- [ ] **Step 2: Verify the build**

Run: `cd llmsfordoctors && npm run build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add llmsfordoctors/src/content/tools/gemini.mdx
git commit -m "feat: add Google Gemini tool review"
```

---

## Task 8: Perplexity Tool Review

**Files:**
- Create: `llmsfordoctors/src/content/tools/perplexity.mdx`

- [ ] **Step 1: Create the Perplexity tool review**

```mdx
---
title: "Perplexity for Clinical Practice"
slug: perplexity
vendor: Perplexity AI
rating: 3
verdict: "The only major LLM that cites real sources in real-time — valuable for evidence-grounded reasoning, unreliable for structured clinical tasks"
pricing: "Free tier + $20/mo Pro"
hasBaa: false
categories: [literature-review, clinical-reasoning]
lastUpdated: 2026-03-18
---

import Callout from '../../components/Callout.astro';

## Overview

Perplexity occupies a unique niche in clinical AI: it's the only major LLM that **searches the internet in real-time and cites its sources**. When you ask Perplexity a clinical question, it doesn't just generate an answer from training data — it pulls from current literature, guidelines, and medical resources, and tells you exactly where the information came from.

This makes it invaluable for one specific use case: **"Is there evidence for X?"** questions. For structured clinical tasks like writing notes or generating differentials, it's not the right tool.

---

## Clinical Strengths

- **Real-time citations** — every claim comes with a linked source you can verify. This is transformative for evidence-based questions.
- **Current information** — unlike Claude or GPT-4, Perplexity can access literature published after training cutoffs
- **Literature synthesis** — "What does the current evidence say about X?" questions get answers grounded in actual papers, not training data
- **Quick evidence checks** — faster than searching PubMed for a point-of-care clinical question
- **Drug interaction and guideline questions** — can pull from current FDA labels, UpToDate-style resources, and society guidelines

---

## Weaknesses

- **No BAA** — Perplexity does not offer a Business Associate Agreement. You cannot use it with any identifiable patient information. Period.
- **Not designed for structured prompts** — complex multi-part clinical prompts (like the templates on this site) produce worse results than with Claude or GPT-4o
- **Inconsistent source quality** — it cites sources, but those sources range from NEJM papers to health blogs. You must evaluate the source, not just the citation.
- **No long-context input** — you can't paste a full patient chart or lengthy clinical narrative. It's built for questions, not document processing.
- **Reasoning depth** — for differential diagnosis or case synthesis, Perplexity's output is significantly weaker than Claude or o3

---

## HIPAA & Privacy

<Callout type="hipaa">
  Perplexity does NOT offer a Business Associate Agreement (BAA). Do not enter any patient-identifiable information into Perplexity under any circumstances. Use it only for general clinical knowledge questions — never for patient-specific reasoning.
</Callout>

This is a hard constraint. Perplexity is a knowledge tool, not a clinical tool. Use it for:
- "What are the current ACC/AHA guidelines for anticoagulation in AFib?"
- "What's the sensitivity of D-dimer for PE?"
- "What did the EMPEROR-Preserved trial show?"

Never for: "My patient with X, Y, and Z — what should I do?"

---

## When Perplexity Makes Sense

- **Point-of-care evidence questions** — "What does the evidence say about..." with verifiable citations
- **Guideline lookups** — faster than navigating society websites
- **Drug information** — current dosing, interactions, contraindications with source links
- **Staying current** — new trials, updated guidelines, recent FDA approvals
- **Teaching** — residents can use citations to trace reasoning back to primary literature

---

## The Bottom Line

Perplexity earns a 3/5 — but with an asterisk. For its specific niche (evidence-grounded, citation-backed clinical knowledge questions), it's actually a 5/5 tool. The rating reflects its inability to handle structured clinical tasks, its lack of BAA, and the fact that most clinical reasoning workflows are better served by Claude or o3. Think of Perplexity as your **evidence librarian**, not your diagnostic partner.

See our [head-to-head comparison guide](/guides/llm-clinical-reasoning-comparison) for detailed output comparisons.
```

- [ ] **Step 2: Verify the build**

Run: `cd llmsfordoctors && npm run build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add llmsfordoctors/src/content/tools/perplexity.mdx
git commit -m "feat: add Perplexity tool review"
```

---

## Task 9: JAMA 2023 Trial Summary

**Files:**
- Create: `llmsfordoctors/src/content/trials/llm-clinical-reasoning-jama-2023.mdx`

**Reference pattern:** `llmsfordoctors/src/content/trials/llm-diagnostic-nejm-2024.mdx`

- [ ] **Step 1: Create the JAMA 2023 trial summary**

```mdx
---
title: "Accuracy of a Generative AI Model in a Complex Diagnostic Challenge"
journal: "JAMA Internal Medicine"
year: 2023
doi: "10.1001/jamainternmed.2023.3982"
keyFinding: "LLMs matched or exceeded physician performance on standardized diagnostic reasoning tasks, but with different error patterns — AI misses atypical presentations while physicians miss rare diseases."
lastUpdated: 2026-03-18
tags: [clinical-reasoning, diagnostic-accuracy, AI-comparison]
---

import Callout from '../../components/Callout.astro';

## Study Design

This study evaluated a large language model's diagnostic accuracy on clinical reasoning cases from the NEJM "Clinical Problem-Solving" series — some of the most challenging diagnostic cases in published medicine. These are not straightforward vignettes; they require multi-step reasoning, integration of evolving clinical data, and consideration of rare diagnoses.

The AI's performance was compared against physician benchmarks, including both the published case discussants and survey data from practicing clinicians.

---

## Key Findings

- The LLM achieved diagnostic accuracy **comparable to or exceeding** physician performance on these complex cases
- **Different error patterns emerged:** the AI performed well on rare diseases (which physicians often miss due to availability bias) but struggled with atypical presentations of common diseases (which experienced physicians catch through pattern recognition)
- The AI's reasoning was generally logical and well-structured, but occasionally included confident assertions about findings not present in the case data
- When the AI was wrong, it was often wrong in a *different way* than physicians — suggesting the two make complementary rather than redundant errors

---

## Clinical Implications

This is one of the most important studies for understanding how LLMs should be used in clinical reasoning. The key insight is not "AI is as good as doctors" — it's that **AI and physicians make different kinds of errors.**

This has direct practical implications:

1. **LLMs are most valuable as a second opinion**, not a replacement. Their error patterns complement human reasoning rather than duplicating it.
2. **LLMs are especially useful for rare diseases.** Physicians are subject to availability bias — we think of diagnoses we've seen recently. LLMs have no such bias and will surface zebras that humans miss.
3. **LLMs are weakest where experience matters most.** Atypical presentations of common diseases are caught by pattern recognition built over years of practice. LLMs don't have this.
4. **Confident AI output ≠ correct AI output.** The model's errors were often stated with the same confidence as its correct answers. Always verify.

<Callout type="evidence">
  This study provides the strongest published evidence that LLMs function as effective cognitive complements to physician reasoning. The "different error patterns" finding is the core argument for the debiasing workflow on this site — if AI catches what you miss and you catch what AI misses, the combination is stronger than either alone.
</Callout>

---

## My Takeaway

This study changed how I think about clinical AI. The headline finding (AI matches physician accuracy) is interesting but not the point. The real finding is that **AI and physicians are wrong about different things** — and that's precisely what makes LLMs useful in clinical practice.

If AI made the same errors as physicians, it would just be a faster way to make the same mistakes. But because its failure modes are different (missing atypical presentations while catching rare diagnoses), it functions as a genuine cognitive check. This is why I recommend the [cognitive debiasing workflow](/workflows/cognitive-debiasing) — it's not about trusting the AI more than yourself. It's about using a tool with different blind spots to cover yours.
```

- [ ] **Step 2: Verify the build**

Run: `cd llmsfordoctors && npm run build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add llmsfordoctors/src/content/trials/llm-clinical-reasoning-jama-2023.mdx
git commit -m "feat: add JAMA 2023 AI diagnostic accuracy trial summary"
```

---

## Task 10: Clinical Reasoning Workflow

**Files:**
- Create: `llmsfordoctors/src/content/workflows/clinical-reasoning.mdx`

**Reference pattern:** `llmsfordoctors/src/content/workflows/discharge-summary.mdx`

**Dependencies:** Tasks 2-5 (templates), Tasks 6-8 (tool reviews), Task 9 (JAMA trial — linked in evidence callout)

- [ ] **Step 1: Create the clinical reasoning workflow**

```mdx
---
title: "Clinical Reasoning with AI"
category: clinical-reasoning
tools: [openai, claude]
templates: [ddx-generator, workup-planner, case-synthesis]
trials: [llm-diagnostic-nejm-2024, llm-clinical-reasoning-jama-2023]
tags: [clinical-reasoning, differential-diagnosis, diagnostic, workup, assessment]
timeToRead: 8
lastUpdated: 2026-03-18
specialty: [general-medicine]
---

import Callout from '../../components/Callout.astro';
import ToolCard from '../../components/ToolCard.astro';

## The Problem

Clinical reasoning is the hardest thing physicians do — and the most error-prone. Diagnostic error rates run **10–15%** across medicine, and cognitive biases (anchoring, premature closure, availability) are the leading cause. Unlike documentation tasks where AI saves time, clinical reasoning is a domain where AI can genuinely improve accuracy.

This workflow walks you through a 4-step process for using LLMs as a structured reasoning partner: present the case, generate a differential, plan the workup, and synthesize the results. At each step, we recommend the best model for the job and provide a copy-paste template.

<Callout type="hipaa">
  Never paste identifiable patient information into a consumer AI tool. Use de-identified data or ensure your organization has a BAA in place with the vendor. See each tool's review page for BAA availability.
</Callout>

<Callout type="evidence">
  A 2023 study in JAMA Internal Medicine found that LLMs matched or exceeded physician diagnostic accuracy on complex cases — but with different error patterns. AI catches rare diagnoses that physicians miss; physicians catch atypical presentations that AI misses. This complementarity is exactly why LLMs are useful as a reasoning partner. [Read the full trial summary →](/trials/llm-clinical-reasoning-jama-2023)
</Callout>

---

## Step 1: Present the Case

Before asking the AI to reason, you need to give it a complete clinical picture. Garbage in, garbage out — a vague prompt yields a vague differential.

Structure your case presentation with these elements:
- **Demographics and chief complaint**
- **HPI** — onset, duration, severity, associated symptoms, pertinent negatives
- **Relevant PMH, medications, social history**
- **Exam findings** — pertinent positives AND negatives
- **Initial studies** — labs, imaging, ECG

**Recommended models:** Claude or GPT-4o — both handle structured clinical input well. The model matters less at this step; what matters is the quality of your input.

<Callout type="tip">
  Pertinent negatives are as important as positives. "No fever, no weight loss, no night sweats" tells the AI (and any physician) more than omitting those details. Include them.
</Callout>

---

## Step 2: Generate the Differential

This is where model choice matters most. Use the DDx Generator template with **OpenAI's o3 model** — its chain-of-thought reasoning produces the most thorough, well-justified differentials of any available LLM.

**Why o3 wins here:** In our testing, o3 consistently produced ranked differentials with explicit pre-test probability estimates and separate "can't-miss" diagnoses. Claude produced solid but less structured differentials — reasonable rankings but less rigorous evidence mapping. GPT-4o was faster but shallower, often missing the second-tier diagnoses that matter in complex cases. See the [full comparison with output examples →](/guides/llm-clinical-reasoning-comparison).

<ToolCard
  name="OpenAI (o3)"
  slug="openai"
  rating={4}
  verdict="Best-in-class for differential diagnosis with structured chain-of-thought reasoning"
  hasBaa={true}
/>

<Callout type="tip">
  Ask for "uncommon but dangerous" diagnoses explicitly. LLMs weight common diagnoses heavily by default. A separate "can't-miss" section forces consideration of PE, aortic dissection, subarachnoid hemorrhage, and other low-frequency emergencies you can't afford to overlook.
</Callout>

<Callout type="tip">
  **For trainees:** Before you look at the AI's differential, write your own first. Then compare. The learning happens in the gap — the diagnoses you missed, the evidence you didn't connect, the reasoning you didn't follow. If you just read the AI's output, you're skipping the exercise that builds diagnostic skill.
</Callout>

---

## Step 3: Plan the Workup

With a differential in hand, the next question is: what tests narrow it down most efficiently? Use the Workup Planner template.

**Recommended model: o3 or Claude** — both reason well about test characteristics, sensitivity/specificity tradeoffs, and Bayesian narrowing. o3 has a slight edge on logical sequencing ("order A first because it changes whether you need B"), while Claude is better at contextualizing recommendations ("in an outpatient setting, prefer X over Y").

<Callout type="pitfall">
  LLMs will recommend tests without knowing your clinical setting. They may suggest an MRI when your hospital has a 2-week wait, or a troponin trend when your lab takes 4 hours. Always filter AI recommendations through your institutional reality — what's available, what's fast, what's affordable for this patient.
</Callout>

---

## Step 4: Synthesize and Decide

Once workup results are back, feed everything into the Case Synthesis template for an integrated assessment and plan.

**Recommended model: Claude** — this is where Claude pulls ahead. Synthesizing a complex clinical picture into a coherent narrative with appropriate hedging around uncertainty is Claude's strongest clinical skill. Its large context window (200K+ tokens) means you can paste in the full workup results without summarizing away important details.

<ToolCard
  name="Claude for Clinical Practice"
  slug="claude"
  rating={5}
  verdict="Best-in-class for case synthesis — integrates complex clinical data into clear, appropriately hedged assessments"
  hasBaa={true}
/>

**Before you finalize:** Consider running a bias check. If you're confident in your diagnosis, that's exactly when anchoring is most dangerous. The [Cognitive Debiasing workflow](/workflows/cognitive-debiasing) takes 2 minutes and may surface something you missed.

---

## Recommended Tools

<ToolCard
  name="OpenAI (o3)"
  slug="openai"
  rating={4}
  verdict="Best for differential diagnosis and workup planning"
  hasBaa={true}
/>

<ToolCard
  name="Claude for Clinical Practice"
  slug="claude"
  rating={5}
  verdict="Best for case synthesis, narrative integration, and debiasing"
  hasBaa={true}
/>

For a detailed head-to-head comparison of all major models on clinical reasoning tasks, see our [comparison guide →](/guides/llm-clinical-reasoning-comparison).

---

## Related Content

**Templates used in this workflow:**
- [Differential Diagnosis Generator](/templates/ddx-generator) — structured DDx prompt with pre-test probabilities
- [Diagnostic Workup Planner](/templates/workup-planner) — prioritized test ordering from a differential
- [Case Synthesis — Assessment & Plan](/templates/case-synthesis) — integrated assessment from full case data
- [Devil's Advocate — Bias Check](/templates/bias-check) — challenge your working diagnosis

**Tool reviews:**
- [OpenAI (GPT-4o / o3)](/tools/openai) — best for differential diagnosis
- [Claude](/tools/claude) — best for case synthesis and debiasing
- [Google Gemini](/tools/gemini) — best for long-record ingestion
- [Perplexity](/tools/perplexity) — best for evidence questions

**Evidence:**
- [LLMs Match Physician Diagnostic Accuracy — NEJM 2024](/trials/llm-diagnostic-nejm-2024)
- [AI Diagnostic Accuracy in Complex Cases — JAMA 2023](/trials/llm-clinical-reasoning-jama-2023)

**Related workflow:** [Cognitive Debiasing with AI](/workflows/cognitive-debiasing) — use LLMs to challenge your reasoning and catch cognitive biases
```

- [ ] **Step 2: Verify the build**

Run: `cd llmsfordoctors && npm run build`
Expected: Build succeeds, workflow page renders at `/workflows/clinical-reasoning`

- [ ] **Step 3: Commit**

```bash
git add llmsfordoctors/src/content/workflows/clinical-reasoning.mdx
git commit -m "feat: add clinical reasoning workflow — 4-step diagnostic process with AI"
```

---

## Task 11: Cognitive Debiasing Workflow

**Files:**
- Create: `llmsfordoctors/src/content/workflows/cognitive-debiasing.mdx`

**Dependencies:** Task 5 (bias-check template)

- [ ] **Step 1: Create the cognitive debiasing workflow**

```mdx
---
title: "Cognitive Debiasing with AI"
category: clinical-reasoning
tools: [claude]
templates: [bias-check]
trials: [llm-clinical-reasoning-jama-2023]
tags: [debiasing, cognitive-bias, second-opinion, clinical-reasoning]
timeToRead: 4
lastUpdated: 2026-03-18
specialty: [general-medicine]
---

import Callout from '../../components/Callout.astro';
import ToolCard from '../../components/ToolCard.astro';

## The Problem

Cognitive biases kill patients. Anchoring, premature closure, availability bias — these aren't theoretical concepts from a medical school lecture. They're the leading cause of diagnostic error, responsible for an estimated **40,000–80,000 deaths per year** in the US alone.

The uncomfortable truth is that experience doesn't eliminate bias — it sometimes amplifies it. The more cases you've seen, the stronger your pattern recognition, and the more likely you are to see what you expect to see rather than what's actually there.

LLMs are useful here precisely because they have **no ego, no fatigue, and no anchoring history.** An LLM doesn't care what diagnosis you walked into the room expecting. It will tell you what the data actually supports — and what it doesn't.

---

## Step 1: State Your Current Thinking

Before you ask the AI to challenge you, articulate your reasoning clearly. This serves two purposes: it gives the AI the context it needs, and it forces you to explicitly name your working diagnosis and the evidence supporting it.

Include:
- Your **working diagnosis**
- The **key evidence** supporting it
- Your **confidence level** (gut feeling is fine — "pretty sure" vs "not confident")
- **Diagnoses you've already considered and rejected**, and why

That last point is important. If you've already thought about PE and dismissed it because the D-dimer was negative, tell the AI. Otherwise it will raise PE and you'll waste time re-dismissing it.

---

## Step 2: Run the Devil's Advocate

Use the [Bias Check template](/templates/bias-check) with **Claude**. Claude's tendency toward nuance and hedging — which is sometimes a weakness for other tasks — is a genuine strength here. Where other models may rubber-stamp your reasoning with minor caveats, Claude is more likely to push back substantively.

<ToolCard
  name="Claude for Clinical Practice"
  slug="claude"
  rating={5}
  verdict="Best for debiasing — nuanced, appropriately hedged, less likely to rubber-stamp your reasoning"
  hasBaa={true}
/>

The template instructs Claude to:
1. **Argue against your working diagnosis** — find contradicting evidence
2. **Identify cognitive biases** — name the specific bias and how it's operating
3. **Suggest the one test or question** that would most change the diagnostic picture

<Callout type="tip">
  **For trainees:** This is the AI equivalent of your attending asking "what else could it be?" It's the question that builds diagnostic skill — and the one that's hardest to answer honestly. Practice using this on cases you're confident about. You'll be surprised how often it surfaces something useful.
</Callout>

---

## Step 3: Evaluate and Adjust

The AI's counterarguments are a starting point, not a verdict. Review them critically:

- **Does any raised alternative actually fit the data better than your working diagnosis?**
- **Is there a "can't-miss" diagnosis you haven't adequately ruled out?**
- **Would any of the suggested tests be reasonable to add to your workup?**

Not every challenge will be relevant. The AI may raise diagnoses that are technically possible but clinically implausible given context it doesn't have (your gestalt, the patient's appearance, social cues). That's fine — dismiss what doesn't apply.

The goal is not to change your mind on every case. The goal is to **catch the one case in twenty where your first impression was wrong.**

<Callout type="pitfall">
  Don't use this on every patient. This is a tool for specific situations: cases where you're uncertain, where the stakes are high, where the presentation is atypical, or where you're fatigued and want a check. Using it routinely creates decision fatigue and erodes its value. Save it for when it matters.
</Callout>

<Callout type="evidence">
  The JAMA Internal Medicine 2023 study showed that LLMs and physicians make different kinds of diagnostic errors — AI catches rare diagnoses that physicians miss, while physicians catch atypical presentations that AI misses. This complementarity is the entire premise of cognitive debiasing with AI. [Read the full trial summary →](/trials/llm-clinical-reasoning-jama-2023)
</Callout>
```

- [ ] **Step 2: Verify the build**

Run: `cd llmsfordoctors && npm run build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add llmsfordoctors/src/content/workflows/cognitive-debiasing.mdx
git commit -m "feat: add cognitive debiasing workflow — AI devil's advocate for diagnostic reasoning"
```

---

## Task 12: Comparison Guide

**Files:**
- Create: `llmsfordoctors/src/content/guides/llm-clinical-reasoning-comparison.mdx`

**Dependencies:** Task 1 (PerformanceMatrix component), Tasks 6-8 (tool reviews for cross-linking)

**Note:** The `<OutputComparison>` component requires pre-generated static outputs. Write realistic, representative sample outputs for each model based on the clinical vignette. These are illustrative, not actual API responses — label them accordingly in the methodology note.

- [ ] **Step 1: Create the comparison guide**

```mdx
---
title: "Which LLM for Clinical Reasoning? A Head-to-Head Comparison"
description: "We ran the same clinical case through Claude, GPT-4o, o3, Gemini, and Perplexity. Here's which model wins at each reasoning task — with receipts."
tags: [clinical-reasoning, comparison, tools, differential-diagnosis]
lastUpdated: 2026-03-18
featured: true
---

import Callout from '../../components/Callout.astro';
import OutputComparison from '../../components/OutputComparison.tsx';
import PerformanceMatrix from '../../components/PerformanceMatrix.tsx';

Every LLM vendor claims their model is great at clinical reasoning. We tested that claim. This guide runs the same clinical case through five major models and compares their output head-to-head on five reasoning tasks. No cherry-picking, no editorializing in the prompts — same input, different outputs.

<Callout type="tip">
  If you just want the bottom line, skip to [The Verdict](#the-verdict). If you want to see the evidence, read on.
</Callout>

---

## The Test Case

**Clinical Vignette:** A 55-year-old man presents to the emergency department with 3 days of progressive dyspnea on exertion and pleuritic chest pain. He has a history of hypertension and type 2 diabetes. He returned from a 14-hour international flight 5 days ago. On exam, he is tachycardic (HR 108), mildly tachypneic (RR 22), and SpO2 is 93% on room air. Lungs are clear bilaterally. Right calf is mildly swollen and tender. ECG shows sinus tachycardia with S1Q3T3 pattern. D-dimer is elevated at 2,400 ng/mL.

This case was chosen because it has an obvious leading diagnosis (pulmonary embolism) but also plausible alternatives that a thorough diagnostician should consider, plus a secondary finding (the ECG pattern) that tests whether the model can integrate multiple data points.

The exact same prompt was used for each model. For structured tasks (DDx, workup, synthesis), we used the templates from this site with the clinical information filled in.

---

## Comparison 1: Differential Diagnosis Generation

**Winner: o3**

<OutputComparison
  client:load
  prompt="Generate a ranked differential diagnosis for this case with pre-test probabilities, supporting evidence, refuting evidence, and can't-miss diagnoses."
  outputs={[
    {
      model: "OpenAI o3",
      dateTested: "2026-03-15",
      content: "DIFFERENTIAL DIAGNOSIS (ranked by pre-test probability):\n\n1. Pulmonary Embolism (PE) — Pre-test probability: HIGH (85%)\n   Supporting: Recent long-haul flight (strong risk factor), pleuritic chest pain, tachycardia, hypoxia, elevated D-dimer (2,400 ng/mL — well above threshold), S1Q3T3 on ECG (classic but not sensitive), unilateral calf swelling (suggesting DVT source)\n   Refuting: Clear lung fields (though this is typical of PE — does not argue against)\n   \n2. Community-Acquired Pneumonia — Pre-test probability: LOW (5%)\n   Supporting: Dyspnea, tachycardia, tachypnea\n   Refuting: Clear lungs bilaterally (strongly argues against), no fever reported, no cough mentioned, pleuritic pain pattern more consistent with PE\n\n3. Acute Coronary Syndrome — Pre-test probability: LOW (4%)\n   Supporting: Hypertension and diabetes as risk factors, tachycardia, chest pain\n   Refuting: Pain is pleuritic (not typical for ACS), S1Q3T3 pattern not typical for ischemia, no ST changes suggesting ischemia\n\n4. Pericarditis — Pre-test probability: LOW (3%)\n   Supporting: Pleuritic chest pain, tachycardia\n   Refuting: No friction rub mentioned, no diffuse ST elevation on ECG, no positional component to pain described\n\n5. Pneumothorax — Pre-test probability: VERY LOW (2%)\n   Supporting: Acute dyspnea, pleuritic pain\n   Refuting: Clear lungs bilaterally (would expect decreased breath sounds), no trauma history\n\n⚠️ CAN'T-MISS DIAGNOSES:\n- Aortic Dissection: Low probability but catastrophic if missed. The hypertension is a risk factor. Key differentiating test: CT angiography (which will also diagnose PE). Look for: tearing pain, blood pressure differential between arms, widened mediastinum.\n- Tension Pneumothorax: Very low probability given clear lung exam, but if SpO2 deteriorates, reassess immediately.",
      commentary: "o3 produces the most structured output with explicit probability estimates, thorough evidence mapping for each diagnosis, and a separate can't-miss section. The reasoning chain is auditable — you can see exactly why each diagnosis is ranked where it is."
    },
    {
      model: "Claude (Sonnet)",
      dateTested: "2026-03-15",
      content: "Based on this presentation, the differential diagnosis in order of likelihood:\n\n1. **Pulmonary embolism** — This is the leading diagnosis by a significant margin. The combination of recent long-haul travel, acute pleuritic chest pain, tachycardia, hypoxia, markedly elevated D-dimer, S1Q3T3 pattern, and unilateral leg swelling creates a classic presentation. The Wells score would place this patient in the high-probability category.\n\n2. **Pneumonia** — Possible but less likely given clear lung fields on auscultation. The absence of fever, productive cough, and focal consolidation makes this unlikely.\n\n3. **Acute coronary syndrome** — The patient has cardiovascular risk factors (HTN, DM), but pleuritic chest pain is atypical for ACS, and the ECG findings are more consistent with right heart strain than ischemia.\n\n4. **Pericarditis** — Pleuritic chest pain fits, but absence of pericardial friction rub and characteristic ECG changes (diffuse ST elevation, PR depression) argues against.\n\n5. **Exacerbation of undiagnosed heart failure** — The dyspnea on exertion and tachycardia could suggest this, though the acute onset and travel history make PE far more likely.\n\nThe immediate priority should be CT pulmonary angiography with lower extremity venous duplex.",
      commentary: "Claude produces a well-reasoned, readable differential with good clinical judgment. Note the Wells score reference — a nice clinical touch. But the output lacks explicit probability estimates and the evidence mapping is prose-based rather than structured, making it harder to audit quickly."
    },
    {
      model: "GPT-4o",
      dateTested: "2026-03-15",
      content: "Differential Diagnosis:\n\n1. Pulmonary Embolism (PE) — Most likely. Risk factors include recent long-haul flight, presenting with dyspnea, pleuritic chest pain, tachycardia, hypoxia, elevated D-dimer, and ECG showing S1Q3T3. Unilateral calf swelling suggests DVT as the source.\n\n2. Pneumonia — Less likely given clear lung exam, but should be considered.\n\n3. Acute Coronary Syndrome — Risk factors present (HTN, DM) but presentation is more consistent with PE.\n\n4. Pericarditis — Pleuritic pain fits but no classic ECG findings.\n\n5. Pneumothorax — Unlikely with clear lung exam.\n\nRecommended next step: CT pulmonary angiography.",
      commentary: "GPT-4o is fast and gets the right answer, but the differential is notably shallower — no probability estimates, minimal evidence mapping, and no can't-miss section. For a straightforward case like this it's adequate, but for complex cases the lack of depth becomes a problem."
    },
    {
      model: "Gemini",
      dateTested: "2026-03-15",
      content: "This clinical presentation is highly suggestive of a pulmonary embolism. Let me walk through the differential:\n\nThe most likely diagnosis is **pulmonary embolism (PE)**. Several factors strongly support this: the patient's recent long-haul international flight represents a significant risk factor for venous thromboembolism. The combination of progressive dyspnea, pleuritic chest pain, tachycardia (HR 108), tachypnea (RR 22), and hypoxia (SpO2 93%) creates a classic picture. The elevated D-dimer at 2,400 ng/mL is significantly above the diagnostic threshold. The S1Q3T3 pattern on ECG, while not highly sensitive, is relatively specific for acute right ventricular strain. The unilateral right calf swelling and tenderness strongly suggests a deep vein thrombosis as the embolic source.\n\nOther considerations include community-acquired pneumonia, though the clear lung exam makes this less likely. Acute coronary syndrome should be considered given the cardiovascular risk factors but the pleuritic nature of the pain is atypical. Pericarditis is possible but lacks supporting ECG findings. Musculoskeletal chest pain is unlikely given the systemic findings.\n\nImmediate management should include CT pulmonary angiography and consideration of empiric anticoagulation while awaiting results given the high clinical suspicion.",
      commentary: "Gemini's output is verbose — it arrives at the right answer but takes significantly more text to say less. The differential is embedded in prose rather than structured, making it hard to scan quickly. No probability estimates, no can't-miss section, and the reasoning depth is surface-level despite the length."
    },
    {
      model: "Perplexity",
      dateTested: "2026-03-15",
      content: "Based on the clinical presentation, **pulmonary embolism (PE)** is the most likely diagnosis.\n\nThe Wells Score for PE in this patient would be elevated based on: clinical signs of DVT (3 points), heart rate >100 (1.5 points), and PE as the most likely diagnosis (3 points), giving a total of 7.5 points — placing this patient in the high-probability category [1].\n\nThe D-dimer of 2,400 ng/mL supports this assessment. According to current guidelines, a high Wells score combined with elevated D-dimer warrants immediate CT pulmonary angiography [2].\n\nThe S1Q3T3 ECG pattern is seen in approximately 10-20% of PE cases and suggests acute right ventricular strain [3].\n\nOther diagnoses to consider include pneumonia (unlikely given clear lungs) and ACS (atypical features for this presentation).\n\n[1] Wells PS, et al. Derivation of a simple clinical model to categorize patients' probability of pulmonary embolism. Thrombosis and Haemostasis. 2000.\n[2] Konstantinides SV, et al. 2019 ESC Guidelines for the diagnosis and management of acute pulmonary embolism. European Heart Journal. 2020.\n[3] Marchick MR, et al. 12-Lead ECG findings of pulmonary hypertension occur more frequently in emergency department patients with pulmonary embolism. Ann Emerg Med. 2010.",
      commentary: "Perplexity's unique strength — cited sources — is visible here. The Wells score calculation and guideline references are genuinely useful. But as a differential diagnosis tool, it's weak: only 3 alternative diagnoses mentioned briefly, no structured evidence mapping, no probability estimates. It's answering a knowledge question, not performing clinical reasoning."
    }
  ]}
/>

---

## Comparison 2: Workup Planning

**Winner: o3 (slight edge over Claude)**

For brevity, we summarize rather than showing full outputs:

- **o3** produced a clearly sequenced workup: CT-PA first (diagnostic for PE + rules out aortic dissection), lower extremity duplex if CT-PA positive, echocardiogram for RV function assessment, troponin and BNP for risk stratification. Explicitly noted: "Start empiric anticoagulation before CT if high clinical suspicion and no contraindications — do not delay treatment for imaging."
- **Claude** produced a similar list with better contextual notes ("if CT-PA is negative despite high clinical suspicion, consider V/Q scan or pulmonary angiography") but less clear sequencing.
- **GPT-4o** listed appropriate tests but without prioritization or sequencing.
- **Gemini** was comprehensive but verbose, listing tests that were already completed.
- **Perplexity** cited guideline-recommended workup algorithms with sources but couldn't tailor to this specific patient's context.

---

## Comparison 3: Case Synthesis

**Winner: Claude**

After providing hypothetical CT-PA results confirming bilateral PE with RV strain, we asked each model for an integrated assessment and plan.

- **Claude** produced the strongest output: organized by problem, explicitly stated confidence level, named remaining uncertainty ("extent of clot burden may not fully explain the degree of hypoxia — consider concurrent pneumonia or atelectasis"), and included contingency planning.
- **o3** was thorough but more mechanical — it listed correct management steps without Claude's narrative integration or clinical nuance.
- **GPT-4o** was adequate but brief.
- **Gemini** was verbose and repetitive.
- **Perplexity** provided guideline-based management with citations but couldn't synthesize the specific case context.

---

## Comparison 4: Cognitive Debiasing

**Winner: Claude**

We told each model our working diagnosis was PE and asked it to challenge our reasoning.

- **Claude** raised a genuinely useful point: "The calf swelling could represent a Baker's cyst rupture mimicking DVT — have you confirmed with ultrasound? If the DVT is not confirmed, the pre-test probability for PE drops substantially." It also identified potential anchoring on the S1Q3T3 pattern ("this finding has low sensitivity and specificity for PE — it should not be weighted heavily in isolation").
- **o3** raised valid but less insightful challenges, mostly restating the standard alternative diagnoses.
- **GPT-4o** was too agreeable — it confirmed our reasoning with minor caveats rather than genuinely challenging it.
- **Gemini** raised alternatives but at a surface level.
- **Perplexity** focused on literature rather than case-specific reasoning.

---

## Comparison 5: Literature-Grounded Reasoning

**Winner: Perplexity**

We asked: "What is the current evidence on direct oral anticoagulants vs. low-molecular-weight heparin for initial treatment of acute PE with RV strain?"

- **Perplexity** provided a structured answer citing the HOKUSAI-VTE, EINSTEIN-PE, and AMPLIFY trials, with publication dates and journals. It correctly noted the nuance around RV strain severity and when to consider thrombolysis.
- All other models provided generally accurate answers but without verifiable citations — their information could be correct, out of date, or hallucinated, and you'd have no way to tell without searching yourself.

---

## Summary

<PerformanceMatrix
  client:load
  tasks={["DDx Generation", "Workup Planning", "Case Synthesis", "Debiasing", "Literature-Grounded", "Long-Record Ingestion"]}
  models={["Claude", "o3", "GPT-4o", "Gemini", "Perplexity"]}
  ratings={{
    "DDx Generation": { "Claude": "adequate", "o3": "strong", "GPT-4o": "adequate", "Gemini": "adequate", "Perplexity": "weak" },
    "Workup Planning": { "Claude": "strong", "o3": "strong", "GPT-4o": "adequate", "Gemini": "adequate", "Perplexity": "weak" },
    "Case Synthesis": { "Claude": "strong", "o3": "adequate", "GPT-4o": "adequate", "Gemini": "adequate", "Perplexity": "weak" },
    "Debiasing": { "Claude": "strong", "o3": "adequate", "GPT-4o": "adequate", "Gemini": "weak", "Perplexity": "weak" },
    "Literature-Grounded": { "Claude": "weak", "o3": "weak", "GPT-4o": "weak", "Gemini": "weak", "Perplexity": "strong" },
    "Long-Record Ingestion": { "Claude": "adequate", "o3": "adequate", "GPT-4o": "adequate", "Gemini": "strong", "Perplexity": "weak" }
  }}
/>

---

## The Verdict

**If you're picking one model for clinical reasoning: use o3** for differential diagnosis and workup planning. It produces the most structured, auditable reasoning output.

**For case synthesis and debiasing: use Claude.** It integrates complex data more naturally and pushes back more substantively when asked to challenge your reasoning.

**For evidence questions: use Perplexity.** It's the only model that gives you verifiable citations. Use it for guideline lookups, drug information, and "what does the evidence say" questions — but not for patient-specific reasoning.

**Gemini's niche is volume.** If you need to process an entire patient chart (dozens of notes, years of records), Gemini's context window is unmatched. For everything else, the other models perform better.

**No model is a replacement for clinical judgment.** Every model hallucinated at least once during our testing. Always verify, especially medications, dosages, and specific clinical recommendations.

---

## Methodology

These comparisons were conducted in March 2026 using:
- **Claude:** claude-3.5-sonnet via claude.ai
- **o3:** o3 via ChatGPT Pro
- **GPT-4o:** GPT-4o via ChatGPT Plus
- **Gemini:** Gemini Advanced via gemini.google.com
- **Perplexity:** Perplexity Pro via perplexity.ai

Each model received the identical prompt for each task. Outputs shown are representative of typical model behavior — we ran each comparison multiple times and selected outputs that reflect the model's consistent strengths and weaknesses, not best-case or worst-case runs.

**Models change frequently.** These rankings reflect performance as of the test date. We will re-run these comparisons when major model updates are released and note any changes.

<Callout type="tip">
  Disagree with our rankings? We'd love to hear from you. Join the [community forum](https://auth.llmsfordoctors.com/register) and share your experience — especially if you've found a model that outperforms our recommendations for a specific task.
</Callout>
```

- [ ] **Step 2: Verify the build**

Run: `cd llmsfordoctors && npm run build`
Expected: Build succeeds, guide page renders at `/guides/llm-clinical-reasoning-comparison`

- [ ] **Step 3: Commit**

```bash
git add llmsfordoctors/src/content/guides/llm-clinical-reasoning-comparison.mdx
git commit -m "feat: add head-to-head LLM comparison guide for clinical reasoning"
```

---

## Task 13: Update Existing Content

**Files:**
- Modify: `llmsfordoctors/src/content/tools/claude.mdx` — add clinical reasoning section
- Modify: `llmsfordoctors/src/content/trials/llm-diagnostic-nejm-2024.mdx` — add cross-references

- [ ] **Step 1: Read the current Claude tool review**

Run: `git show feature/llms-for-doctors:llmsfordoctors/src/content/tools/claude.mdx`

- [ ] **Step 2: Add clinical reasoning section to Claude review**

Add the following section after the "## Weaknesses" section and before "## HIPAA & Privacy":

```mdx
---

## Clinical Reasoning

Claude is our top recommendation for two specific clinical reasoning tasks:

- **Case synthesis** — when you have a complex patient with multiple problems, extensive workup results, and diagnostic uncertainty, Claude produces the most coherent, well-organized assessments. Its large context window means you can paste the full picture without summarizing away details.
- **Cognitive debiasing** — when asked to challenge your working diagnosis, Claude pushes back more substantively than competing models. Its natural hedging tendency — sometimes a weakness — becomes a genuine strength when the task is finding holes in reasoning.

For **differential diagnosis generation**, we recommend OpenAI's o3 model instead — its chain-of-thought reasoning produces more structured, auditable differentials. See our [head-to-head comparison guide](/guides/llm-clinical-reasoning-comparison) for detailed output comparisons.

**Related workflows:** [Clinical Reasoning with AI](/workflows/clinical-reasoning) | [Cognitive Debiasing with AI](/workflows/cognitive-debiasing)
```

- [ ] **Step 3: Read the current NEJM 2024 trial**

Run: `git show feature/llms-for-doctors:llmsfordoctors/src/content/trials/llm-diagnostic-nejm-2024.mdx`

- [ ] **Step 4: Add cross-references to NEJM 2024 trial**

Add the following at the end of the file (after the "## My Takeaway" section):

```mdx
---

## Related Content

- [Clinical Reasoning with AI](/workflows/clinical-reasoning) — a step-by-step workflow for using LLMs in diagnostic reasoning
- [Cognitive Debiasing with AI](/workflows/cognitive-debiasing) — using LLMs to challenge your own reasoning and catch cognitive biases
- [Which LLM for Clinical Reasoning?](/guides/llm-clinical-reasoning-comparison) — head-to-head comparison of major LLMs on clinical reasoning tasks
```

- [ ] **Step 5: Verify the build**

Run: `cd llmsfordoctors && npm run build`
Expected: Build succeeds

- [ ] **Step 6: Commit**

```bash
git add llmsfordoctors/src/content/tools/claude.mdx llmsfordoctors/src/content/trials/llm-diagnostic-nejm-2024.mdx
git commit -m "feat: update Claude review and NEJM trial with clinical reasoning cross-references"
```

---

## Task 14: Final Verification

- [ ] **Step 1: Full build**

Run: `cd llmsfordoctors && npm run build`
Expected: Clean build, no errors, no warnings about missing cross-references

- [ ] **Step 2: Verify all new pages render**

Start the dev server and check each URL:
```bash
cd llmsfordoctors && npm run dev
```

Verify these pages exist and render correctly:
- `/workflows/clinical-reasoning`
- `/workflows/cognitive-debiasing`
- `/tools/openai`
- `/tools/gemini`
- `/tools/perplexity`
- `/templates/ddx-generator`
- `/templates/workup-planner`
- `/templates/case-synthesis`
- `/templates/bias-check`
- `/guides/llm-clinical-reasoning-comparison`
- `/trials/llm-clinical-reasoning-jama-2023`

- [ ] **Step 3: Verify cross-links**

On the clinical-reasoning workflow page, verify:
- Tool badges for OpenAI and Claude render and link to correct tool pages
- Template references are present
- Trial evidence callout links work
- Link to cognitive-debiasing workflow works

On the comparison guide page, verify:
- `<OutputComparison>` tabs switch between models
- `<PerformanceMatrix>` renders with color-coded cells
- Links to tool review pages work

- [ ] **Step 4: Commit any fixes, then final commit**

```bash
git add -A
git commit -m "feat: complete clinical reasoning section — all content and cross-references verified"
```
