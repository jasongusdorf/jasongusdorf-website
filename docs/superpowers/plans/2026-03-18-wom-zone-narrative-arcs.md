# WoM Phase 1: Zone Narrative & Quest Arcs — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform quests from mechanical checklists into narrative 3-act zone arcs with richer dialogue, zone story progression, and breadcrumb transitions between zones.

**Architecture:** Extend the existing quest definition model with zone arc metadata (act number, arc grouping, narrative text). Build a richer dialogue presentation layer on top of the existing NPC dialogue component. Add zone arc progress tracking to the quest log. Author one reference zone arc (Mediterranean) to validate the system. All changes are additive — existing quests continue to work without narrative fields.

**Tech Stack:** TypeScript, React, Zustand, Prisma, Socket.IO (all existing)

**Spec:** `docs/superpowers/specs/2026-03-18-wom-game-depth-design.md`

---

## File Map

### Shared (types + constants)
- Modify: `packages/shared/src/types/quests.ts` — Add ZoneArc interface, extend QuestDefinition with narrative fields
- Create: `packages/shared/src/constants/zoneArcs.ts` — Zone arc definitions (3-act structure per zone)
- Modify: `packages/shared/src/constants/quests.ts` — Rewrite Mediterranean quests as a 3-act arc
- Modify: `packages/shared/src/types/worldMap.ts` — Add `zoneArcId` field to `WorldMapZone` interface
- Modify: `packages/shared/src/constants/worldMap.ts` — Set `zoneArcId` on Mediterranean zone

### Server (services + routes)
- Modify: `packages/server/src/services/questService.ts` — Zone arc progress queries, breadcrumb quest logic
- Modify: `packages/server/src/routes/quests.ts` — Add zone arc progress endpoint
- Create: `packages/server/src/__tests__/zoneArcQuests.test.ts` — Tests for arc-aware quest logic

### Client (views + components)
- Modify: `packages/client/src/components/map/NpcDialogue.tsx` — Multi-page narrative dialogue, act intro/outro screens
- Modify: `packages/client/src/views/QuestLogView.tsx` — Zone arc grouping, act progress indicators
- Modify: `packages/client/src/stores/questStore.ts` — Zone arc progress state

### Database
- Modify: `packages/server/src/prisma/schema.prisma` — Add narrative fields to QuestDefinition model

---

## Task 1: Extend Quest Types with Narrative Fields

**Files:**
- Modify: `packages/shared/src/types/quests.ts`

- [ ] **Step 1: Read the existing quest types file**

Read `packages/shared/src/types/quests.ts` to understand the current interface structure.

- [ ] **Step 2: Add ZoneArc interface and extend QuestDefinition**

Add the following to `packages/shared/src/types/quests.ts`:

```typescript
// --- Zone Narrative Arc ---

export interface ZoneArc {
  id: string;
  zoneId: string;
  name: string;
  description: string;
  actNames: [string, string, string];
  actDescriptions: [string, string, string];
}

// Add to QuestObjective or QuestDefinitionPublic (extend existing):
// These fields are OPTIONAL so existing quests continue to work.
```

Extend `QuestDefinitionPublic` (or whichever interface the quest constants use) with:

```typescript
  zoneArcId?: string;
  actNumber?: 1 | 2 | 3;
  narrativeIntro?: string;
  narrativeOutro?: string;
  breadcrumbZoneId?: string;
```

Also extend `QuestDefinitionData` (the constant-side type) with the same optional fields.

- [ ] **Step 3: Add ZoneArcProgress interface**

Add to the same file:

```typescript
export interface ZoneArcProgress {
  arcId: string;
  arcName: string;
  zoneId: string;
  currentAct: 0 | 1 | 2 | 3;  // 0 = not started
  totalQuestsInAct: number;
  completedQuestsInAct: number;
  isComplete: boolean;
}
```

- [ ] **Step 4: Export new types from shared barrel**

Ensure the new types are exported from the shared package's barrel export file.

- [ ] **Step 5: Commit**

```bash
git add packages/shared/src/types/quests.ts packages/shared/src/index.ts
git commit -m "feat(shared): add zone arc and narrative quest types"
```

---

## Task 2: Create Zone Arc Constants

**Files:**
- Create: `packages/shared/src/constants/zoneArcs.ts`

- [ ] **Step 1: Create the zone arcs constant file**

Create `packages/shared/src/constants/zoneArcs.ts` with the Mediterranean arc as the first entry:

```typescript
import { ZoneArc } from '../types/quests';

export const ZONE_ARCS: Record<string, ZoneArc> = {
  mediterranean_corruption: {
    id: 'mediterranean_corruption',
    zoneId: 'mediterranean',
    name: 'The Corruption of the Asklepion',
    description: 'A mysterious illness spreads through the sacred healing temple. The ancient remedies fail. Something darker than disease festers beneath the marble halls.',
    actNames: [
      'The Sick Temple',
      'Roots of the Plague',
      'The Asklepion Restored',
    ],
    actDescriptions: [
      'Patients flood the Asklepion with symptoms no healer recognizes. You must learn the basics of diagnosis to understand what you face.',
      'The illness is not natural. A corrupted water source deep beneath the temple poisons everything it touches. The path down is guarded.',
      'Armed with knowledge and steel, confront the source of corruption and restore the Asklepion to its former glory.',
    ],
  },
};
```

- [ ] **Step 2: Export from shared constants barrel**

Add the export to the shared constants index.

- [ ] **Step 3: Commit**

```bash
git add packages/shared/src/constants/zoneArcs.ts packages/shared/src/constants/index.ts
git commit -m "feat(shared): add zone arc constants with Mediterranean arc"
```

---

## Task 3: Rewrite Mediterranean Quests as 3-Act Arc

**Files:**
- Modify: `packages/shared/src/constants/quests.ts`

- [ ] **Step 1: Read the existing Mediterranean quest definitions**

Read the Mediterranean section of `packages/shared/src/constants/quests.ts` to understand the current quests, their chains, NPCs, and rewards.

- [ ] **Step 2: Design the 3-act quest structure**

Plan the Mediterranean arc before writing code. The arc should follow:

**Act 1 — The Sick Temple (Level 1-3, ~4 quests)**
- Quest 1: Arrive at Asklepion, meet Themis (mentor figure). She asks you to examine patients. (answer_correct — basic diagnosis questions). Teaches: quizzes exist, medical knowledge matters.
- Quest 2: Leonidas reports creatures behaving strangely near the temple. Investigate. (defeat_npc — training dummies/plague rats). Teaches: combat.
- Quest 3: Themis asks you to study the symptoms more carefully. (answer_in_category — Pathology). Teaches: categories matter. Reward: first real gear piece.
- Quest 4: A patient worsens. Themis sends you to find herbs outside the temple walls. (visit_zone — edge of Mediterranean + defeat_npc). Ends with: "The herbs aren't working. Something is wrong with the water." → Breadcrumb to Act 2.

**Act 2 — Roots of the Plague (Level 3-6, ~4 quests)**
- Quest 5: Investigate the water source. Encounter tougher enemies guarding the path. (defeat_npc — feral wolves/bandits). Teaches: difficulty ramp.
- Quest 6: Find a corrupted spring. Analyze the contamination. (answer_in_category — Microbiology/Infectious Disease). Reward: uncommon weapon.
- Quest 7: A wounded scholar blocks the way deeper. Treat his injuries. (answer_correct — anatomy/surgery questions). Teaches: medical knowledge as non-combat interaction.
- Quest 8: The corruption leads underground. Prepare for the descent. (reach_level 5 + equip_item). Gate: ensures player is ready. → Breadcrumb to Act 3.

**Act 3 — The Asklepion Restored (Level 5-8, ~3 quests)**
- Quest 9: Descend into the corrupted undercrypt. Fight through shadow creatures. (defeat_npc — shadow stalkers, multiple). Teaches: sustained combat, resource management.
- Quest 10: Reach the source — a corrupted ancient artifact. Answer the riddle of the plague. (answer_in_category — Pharmacology, higher difficulty). Teaches: knowledge is the weapon.
- Quest 11 (Zone Finale): Destroy/purify the artifact. Boss fight + final diagnosis. (defeat_npc — zone boss). Reward: rare item, significant XP. narrativeOutro: "The Asklepion heals. Themis tells you the world needs you. A message arrives from [next zone] — they've heard of your deeds." → Breadcrumb to next zone.

- [ ] **Step 3: Write the Act 1 quest definitions**

Replace or modify the existing Mediterranean starter quests in `quests.ts` with the new Act 1 quests. Each quest should include:
- `zoneArcId: 'mediterranean_corruption'`
- `actNumber: 1`
- `narrativeIntro` on the first quest of the act (shown when act begins)
- `narrativeOutro` on the last quest of the act (shown when act ends)
- Rich `dialogueAccept`, `dialogueProgress`, `dialogueComplete` text that tells a story
- Proper `chainNextKey`/`chainPrevKey` linking within the arc

- [ ] **Step 4: Write the Act 2 quest definitions**

Same pattern as Act 1, but with `actNumber: 2`, escalated difficulty, and the narrativeIntro/outro bridging acts.

- [ ] **Step 5: Write the Act 3 quest definitions**

Same pattern. The final quest should have:
- `narrativeOutro`: A conclusive scene + breadcrumb to the next zone
- `breadcrumbZoneId`: The ID of the next zone the player should visit

- [ ] **Step 6: Verify quest chain integrity**

Manually verify every `chainNextKey`/`chainPrevKey` link is correct across all 11 quests. Verify all `questGiverNpcId` values reference valid NPCs. Verify level requirements form a reasonable progression.

- [ ] **Step 7: Commit**

```bash
git add packages/shared/src/constants/quests.ts
git commit -m "feat(quests): rewrite Mediterranean quests as 3-act narrative arc"
```

---

## Task 4: Extend Database Schema

**Files:**
- Modify: `packages/server/src/prisma/schema.prisma`

- [ ] **Step 1: Read the current QuestDefinition model**

Read the Prisma schema to understand the current QuestDefinition model fields.

- [ ] **Step 2: Add narrative fields to QuestDefinition**

Add to the `QuestDefinition` model:

```prisma
  zoneArcId        String?
  actNumber        Int?
  narrativeIntro   String?
  narrativeOutro   String?
  breadcrumbZoneId String?

  @@index([zoneArcId])
  @@index([zoneArcId, actNumber])
```

- [ ] **Step 3: Generate Prisma migration**

```bash
cd packages/server && npx prisma migrate dev --name add_quest_narrative_fields
```

Note: Do NOT update the seed script here — that happens in Task 11 after the quest constants are rewritten in Task 3.

- [ ] **Step 4: Commit**

```bash
git add packages/server/src/prisma/
git commit -m "feat(db): add narrative fields to QuestDefinition schema"
```

---

## Task 5: Add Zone Arc Progress to Quest Service

**Files:**
- Modify: `packages/server/src/services/questService.ts`
- Modify: `packages/server/src/routes/quests.ts`
- Create: `packages/server/src/__tests__/zoneArcQuests.test.ts`

Note: For test setup patterns (creating sessions, managing quest state), reference existing tests in `packages/server/src/__tests__/` — especially `questService.test.ts` or `pveQuests.test.ts` for helper functions and fixtures.

- [ ] **Step 1: Write failing test for getZoneArcProgress**

Create `packages/server/src/__tests__/zoneArcQuests.test.ts`:

```typescript
import { getZoneArcProgress } from '../services/questService';

describe('getZoneArcProgress', () => {
  it('returns act 0 with no quests started', async () => {
    const progress = await getZoneArcProgress('test-session', 'mediterranean_corruption');
    expect(progress.currentAct).toBe(0);
    expect(progress.isComplete).toBe(false);
  });

  it('returns act 1 progress when act 1 quests are in progress', async () => {
    // Setup: accept first quest in arc
    // Assert: currentAct = 1, completedQuestsInAct = 0
  });

  it('advances to act 2 when all act 1 quests are turned in', async () => {
    // Setup: complete all act 1 quests
    // Assert: currentAct = 2, completedQuestsInAct = 0
  });

  it('returns isComplete when all act 3 quests are turned in', async () => {
    // Setup: complete all quests in arc
    // Assert: isComplete = true
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd packages/server && npx vitest run src/__tests__/zoneArcQuests.test.ts
```

Expected: FAIL (getZoneArcProgress not defined)

- [ ] **Step 3: Implement getZoneArcProgress**

Read `packages/server/src/services/questService.ts`. Add the function:

```typescript
export async function getZoneArcProgress(
  sessionId: string,
  zoneArcId: string
): Promise<ZoneArcProgress> {
  // 1. Find all QuestDefinitions with this zoneArcId, grouped by actNumber
  // 2. Find all PlayerQuests for this session matching those definitions
  // 3. Calculate current act (highest act with any activity, or 0)
  // 4. Calculate completed quests in current act
  // 5. Return ZoneArcProgress
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
cd packages/server && npx vitest run src/__tests__/zoneArcQuests.test.ts
```

Expected: PASS

- [ ] **Step 5: Write failing test for breadcrumb quest availability**

Add test to the same file:

```typescript
describe('breadcrumb quests', () => {
  it('makes breadcrumb quest available when arc is complete', async () => {
    // Setup: complete all quests in Mediterranean arc
    // The final quest has breadcrumbZoneId set
    // Assert: a "travel to next zone" quest appears in available quests
  });
});
```

- [ ] **Step 6: Run test to verify it fails**

Expected: FAIL

- [ ] **Step 7: Implement breadcrumb awareness in getAvailableQuests**

Modify `getAvailableQuests` in questService.ts to surface quests with `breadcrumbZoneId` when the prerequisite quest is turned in. Breadcrumb quests use the existing `chainNextKey`/`chainPrevKey` mechanism — the final quest of an arc chains to a breadcrumb quest whose `breadcrumbZoneId` indicates where the player should go next. The breadcrumb quest's `dialogueComplete` should direct the player to the next zone.

- [ ] **Step 8: Run test to verify it passes**

Expected: PASS

- [ ] **Step 9: Add zone arc progress route**

Modify `packages/server/src/routes/quests.ts` to add:

```typescript
router.get('/quests/arc-progress/:zoneArcId', async (req, res) => {
  const { zoneArcId } = req.params;
  const sessionId = req.session.id;
  const progress = await getZoneArcProgress(sessionId, zoneArcId);
  res.json(progress);
});
```

- [ ] **Step 10: Commit**

```bash
git add packages/server/src/services/questService.ts packages/server/src/routes/quests.ts packages/server/src/__tests__/zoneArcQuests.test.ts
git commit -m "feat(server): add zone arc progress tracking and breadcrumb quest logic"
```

---

## Task 6: Enhance NPC Dialogue for Narrative

**Files:**
- Modify: `packages/client/src/components/map/NpcDialogue.tsx`

- [ ] **Step 1: Read the current NpcDialogue component**

Read `packages/client/src/components/map/NpcDialogue.tsx` to understand the existing dialogue rendering, typewriter effect, and action button logic.

- [ ] **Step 2: Add narrative intro/outro display**

When a quest has `narrativeIntro`, display it as a full-width narrative text panel BEFORE the regular NPC dialogue. Style it differently from NPC speech — italic, centered, like a story narrator. The player clicks to dismiss it and proceed to NPC dialogue.

```tsx
// Narrative intro overlay (shown before NPC dialogue when starting a new act)
{showNarrativeIntro && (
  <div className="narrative-overlay">
    <p className="narrative-text">{currentQuest.narrativeIntro}</p>
    <button onClick={() => setShowNarrativeIntro(false)}>Continue</button>
  </div>
)}
```

- [ ] **Step 3: Add narrative outro on quest turn-in**

When turning in a quest that has `narrativeOutro`, display the outro text after rewards are shown. Same narrative panel style.

- [ ] **Step 4: Enhance dialogue text for multi-paragraph support**

Update the typewriter effect to handle multi-paragraph dialogue (split on `\n\n`). Each paragraph types out separately. Player advances between paragraphs.

- [ ] **Step 5: Manually test the dialogue flow**

Start the dev server, create a character, interact with the Mediterranean starter NPC. Verify:
- Narrative intro shows before first act quest dialogue
- Multi-paragraph dialogue types out correctly
- Narrative outro shows after turning in act-ending quests

- [ ] **Step 6: Commit**

```bash
git add packages/client/src/components/map/NpcDialogue.tsx
git commit -m "feat(client): add narrative intro/outro and multi-paragraph dialogue support"
```

---

## Task 7: Update Quest Log with Zone Arc Progress

**Files:**
- Modify: `packages/client/src/views/QuestLogView.tsx`
- Modify: `packages/client/src/stores/questStore.ts`

- [ ] **Step 1: Read the current QuestLogView and questStore**

Read both files to understand the current quest log rendering and state management.

- [ ] **Step 2: Add zone arc progress state to questStore**

Add to the quest store:

```typescript
// State
zoneArcProgress: Record<string, ZoneArcProgress>;  // arcId -> progress

// Actions
fetchZoneArcProgress: (zoneArcId: string) => Promise<void>;
```

The fetch action calls `GET /quests/arc-progress/:zoneArcId` and stores the result.

- [ ] **Step 3: Add zone arc section to QuestLogView**

Above the existing quest sections, add a "Zone Story" section when the player is in a zone with an active arc:

```tsx
{currentZoneArc && (
  <div className="zone-arc-section">
    <h3>{currentZoneArc.arcName}</h3>
    <div className="act-indicator">
      Act {currentZoneArc.currentAct}: {arcDefinition.actNames[currentZoneArc.currentAct - 1]}
    </div>
    <p className="act-description">
      {arcDefinition.actDescriptions[currentZoneArc.currentAct - 1]}
    </p>
    <div className="act-progress-bar">
      {currentZoneArc.completedQuestsInAct} / {currentZoneArc.totalQuestsInAct}
    </div>
    <div className="act-dots">
      {[1, 2, 3].map(act => (
        <span key={act} className={act <= currentZoneArc.currentAct ? 'act-complete' : 'act-pending'} />
      ))}
    </div>
  </div>
)}
```

- [ ] **Step 4: Group active quests by zone arc**

In the active quests list, group quests that belong to a zone arc under a collapsible arc header. Non-arc quests (daily, weekly, standalone) display as before.

- [ ] **Step 5: Fetch arc progress on zone enter**

When the player enters a zone that has a `zoneArcId`, automatically fetch the arc progress. Hook into the map store's zone change to trigger this.

- [ ] **Step 6: Manually test the quest log**

Verify:
- Zone arc section appears when in Mediterranean
- Act progress bar updates as quests are completed
- Act dots show progression through acts 1-2-3
- Non-arc quests still display normally

- [ ] **Step 7: Commit**

```bash
git add packages/client/src/views/QuestLogView.tsx packages/client/src/stores/questStore.ts
git commit -m "feat(client): add zone arc progress to quest log"
```

---

## Task 8: Wire Narrative Events Through Sockets

**Files:**
- Modify: `packages/server/src/services/questProgressEmitter.ts`

- [ ] **Step 1: Read the quest progress emitter**

Read `packages/server/src/services/questProgressEmitter.ts` to understand how quest events are emitted.

- [ ] **Step 2: Add act transition events**

When a quest turn-in completes an entire act (all quests in that act are turned_in), emit an additional socket event:

```typescript
socket.emit('quest:act_completed', {
  zoneArcId: questDef.zoneArcId,
  actNumber: questDef.actNumber,
  narrativeOutro: questDef.narrativeOutro,
  nextActNumber: questDef.actNumber < 3 ? questDef.actNumber + 1 : null,
  nextActIntro: nextActFirstQuest?.narrativeIntro ?? null,
});
```

When the entire arc is complete (act 3 final quest turned in), emit:

```typescript
socket.emit('quest:arc_completed', {
  zoneArcId: questDef.zoneArcId,
  breadcrumbZoneId: questDef.breadcrumbZoneId,
});
```

- [ ] **Step 3: Handle act transition on client**

In the quest store or a dedicated listener, handle `quest:act_completed` to:
1. Show the narrative outro (if present)
2. Update the zone arc progress state
3. Show the next act's narrative intro (if present)

Handle `quest:arc_completed` to:
1. Show a "Zone Story Complete" celebration
2. Hint at the next zone (if breadcrumbZoneId is set)

- [ ] **Step 4: Manually test act transitions**

Complete all Act 1 quests. Verify:
- `quest:act_completed` fires
- Narrative outro displays
- Act 2 narrative intro displays
- Zone arc progress updates to Act 2

- [ ] **Step 5: Commit**

```bash
git add packages/server/src/services/questProgressEmitter.ts packages/client/src/stores/questStore.ts
git commit -m "feat: wire narrative act transition events through socket system"
```

---

## Task 9: Add Zone Arc Reference to World Map

**Files:**
- Modify: `packages/shared/src/types/worldMap.ts` — Add optional `zoneArcId` field to `WorldMapZone` interface
- Modify: `packages/shared/src/constants/worldMap.ts` — Set `zoneArcId` on the Mediterranean zone

Note: Zone definitions with per-zone properties (description, levelRange, connections, etc.) live in `worldMap.ts`, NOT `worldHierarchy.ts`. The hierarchy file only groups zones into macro-regions by ID.

- [ ] **Step 1: Read the world map types and constants**

Read `packages/shared/src/types/worldMap.ts` to see the `WorldMapZone` interface, then read `packages/shared/src/constants/worldMap.ts` to see the Mediterranean zone definition.

- [ ] **Step 2: Add zoneArcId to WorldMapZone interface**

Add `zoneArcId?: string;` to the `WorldMapZone` interface in `packages/shared/src/types/worldMap.ts`.

- [ ] **Step 3: Set zoneArcId on Mediterranean zone**

In `packages/shared/src/constants/worldMap.ts`, add `zoneArcId: 'mediterranean_corruption'` to the Mediterranean zone entry.

- [ ] **Step 4: Verify no type errors**

```bash
cd packages/shared && npx tsc --noEmit
```

- [ ] **Step 5: Commit**

```bash
git add packages/shared/src/types/worldMap.ts packages/shared/src/constants/worldMap.ts
git commit -m "feat(shared): link Mediterranean zone to its narrative arc"
```

---

## Task 10: Integration Test — Full Arc Playthrough

**Files:**
- Create: `packages/server/src/__tests__/zoneArcIntegration.test.ts`

- [ ] **Step 1: Write integration test for full Mediterranean arc**

```typescript
describe('Mediterranean Zone Arc — Full Playthrough', () => {
  it('progresses through all 3 acts to arc completion', async () => {
    // 1. Create a test session/player
    // 2. Verify arc progress starts at act 0
    // 3. Accept and complete all Act 1 quests in order
    // 4. Verify arc progress shows act 1 complete, current act 2
    // 5. Accept and complete all Act 2 quests
    // 6. Verify arc progress shows act 2 complete, current act 3
    // 7. Accept and complete all Act 3 quests
    // 8. Verify arc is complete (isComplete = true)
    // 9. Verify breadcrumb quest to next zone is now available
  });

  it('returns correct narrative text at act boundaries', async () => {
    // Verify narrativeIntro on first quest of each act
    // Verify narrativeOutro on last quest of each act
  });

  it('handles quest chain integrity across acts', async () => {
    // Verify chainNextKey/chainPrevKey links work across act boundaries
    // Verify you cannot accept Act 2 quests before completing Act 1
  });
});
```

- [ ] **Step 2: Run integration test**

```bash
cd packages/server && npx vitest run src/__tests__/zoneArcIntegration.test.ts
```

Expected: PASS

- [ ] **Step 3: Fix any failures**

If tests fail, debug and fix. Re-run until all pass.

- [ ] **Step 4: Commit**

```bash
git add packages/server/src/__tests__/zoneArcIntegration.test.ts
git commit -m "test: add integration tests for full zone arc playthrough"
```

---

## Task 11: Update Quest Seeding

**Files:**
- Modify: The seed script (find via `packages/server/src/prisma/seed.ts` or similar)

- [ ] **Step 1: Read the current seed script**

Find and read the quest seeding logic to understand how quest constants are written to the database.

- [ ] **Step 2: Add narrative fields to seed upsert**

Ensure the seed script passes `zoneArcId`, `actNumber`, `narrativeIntro`, `narrativeOutro`, and `breadcrumbZoneId` when seeding quest definitions. These should be read from the quest constants.

- [ ] **Step 3: Run seed and verify**

```bash
cd packages/server && npx prisma db seed
```

Verify Mediterranean quests have narrative fields populated:

```bash
cd packages/server && npx prisma studio
```

Check the QuestDefinition table for Mediterranean quests — verify `zoneArcId`, `actNumber`, and narrative fields are present.

- [ ] **Step 4: Commit**

```bash
git add packages/server/src/prisma/
git commit -m "feat(seed): include narrative fields in quest seeding"
```

---

## Done Criteria

When all tasks are complete:
- [ ] Mediterranean zone has an 11-quest, 3-act narrative arc with story dialogue
- [ ] Zone arc progress is tracked and queryable per player
- [ ] Quest log shows zone story progress with act indicators
- [ ] NPC dialogue supports narrative intro/outro screens and multi-paragraph text
- [ ] Act transitions fire socket events with narrative text
- [ ] Arc completion surfaces a breadcrumb to the next zone
- [ ] All existing non-arc quests continue to work unchanged
- [ ] Integration tests verify full arc playthrough
- [ ] TypeScript compiles with no errors across all packages

## What This Enables

After Phase 1, authoring new zone arcs is a content task, not a code task:
1. Add a `ZoneArc` entry to `zoneArcs.ts`
2. Write quests with `zoneArcId`, `actNumber`, and narrative text
3. Link the zone in `worldHierarchy.ts`
4. Seed the database

The system handles progression, act transitions, narrative display, and breadcrumbing automatically.
