# MediQuest MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a playable browser-based text RPG where players explore Ancient Greece, learn from historical medical figures, fight turn-based combat, and answer board-style medical questions.

**Architecture:** Single-page game shell (React + Next.js App Router) with a persistent sidebar and swappable main panel. Zustand for client state, Supabase (PostgreSQL) for persistence, NextAuth for authentication. Grid-based NESW navigation with fog-of-war.

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript, Zustand, Supabase, NextAuth.js, Tailwind CSS 4, Vitest

**Spec:** `docs/superpowers/specs/2026-03-19-mediquest-game-design.md`

---

## File Structure

```
mediquest/
├── src/
│   ├── app/
│   │   ├── layout.tsx                    # Root layout (Tailwind, providers)
│   │   ├── page.tsx                      # Landing page (login/register)
│   │   ├── play/
│   │   │   └── page.tsx                  # Game shell entry point
│   │   ├── create/
│   │   │   └── page.tsx                  # Character creation flow
│   │   └── api/
│   │       ├── auth/[...nextauth]/route.ts
│   │       ├── character/route.ts        # Character CRUD
│   │       ├── save/route.ts             # Game state save
│   │       └── questions/route.ts        # Question fetching
│   ├── components/
│   │   ├── game-shell/
│   │   │   ├── GameShell.tsx             # Sidebar + MainPanel layout
│   │   │   ├── Sidebar.tsx               # Character info, map, compass
│   │   │   └── MainPanel.tsx             # Scene type switcher
│   │   ├── scenes/
│   │   │   ├── ExplorationScene.tsx      # Room description, actions
│   │   │   ├── DialogueScene.tsx         # NPC conversation UI
│   │   │   ├── CombatScene.tsx           # Turn-based combat UI
│   │   │   ├── QuestionScene.tsx         # Medical question UI
│   │   │   ├── PatientEncounterScene.tsx # Narrative question sequence
│   │   │   ├── VendorScene.tsx           # Buy/sell interface
│   │   │   └── StudyHallScene.tsx        # Question grinder mode
│   │   ├── sidebar/
│   │   │   ├── CharacterPanel.tsx        # Portrait, name, level, stats
│   │   │   ├── MiniMap.tsx               # Grid fog-of-war map
│   │   │   ├── Compass.tsx               # NESW movement buttons
│   │   │   ├── EquipmentSummary.tsx      # Equipped gear display
│   │   │   └── CurrencyDisplay.tsx       # Copper/silver/gold
│   │   ├── character-creation/
│   │   │   ├── NameStep.tsx
│   │   │   ├── PortraitStep.tsx
│   │   │   ├── ExamTrackStep.tsx
│   │   │   └── StatAllocationStep.tsx
│   │   └── ui/
│   │       ├── ProgressBar.tsx           # Reusable HP/Mana/XP bar
│   │       └── ActionButton.tsx          # Styled game action button
│   ├── stores/
│   │   ├── gameStore.ts                  # Character, position, inventory, quests
│   │   └── combatStore.ts               # Active combat state
│   ├── lib/
│   │   ├── supabase.ts                   # Supabase client init
│   │   ├── auth.ts                       # NextAuth config
│   │   ├── stats.ts                      # Derived stat calculations
│   │   ├── currency.ts                   # Copper/silver/gold math
│   │   ├── navigation.ts                 # Grid movement, room lookup
│   │   ├── combat-engine.ts              # Combat turn resolution
│   │   ├── dialogue-engine.ts            # Dialogue tree traversal
│   │   ├── question-engine.ts            # Question filtering, scoring
│   │   └── save.ts                       # Save/load game state
│   ├── data/
│   │   ├── zones/
│   │   │   └── ancient-greece.ts         # Grid layout, room definitions
│   │   ├── npcs/
│   │   │   ├── hippocrates.ts            # Data + dialogue tree
│   │   │   ├── herophilus.ts
│   │   │   ├── asclepius-priest.ts
│   │   │   └── registrar.ts
│   │   ├── enemies/
│   │   │   └── ancient-greece-enemies.ts
│   │   ├── items/
│   │   │   └── ancient-greece-items.ts
│   │   ├── questions/
│   │   │   └── seed-questions.ts         # 50 curated questions
│   │   └── quests/
│   │       └── ancient-greece-quests.ts
│   └── types/
│       ├── character.ts
│       ├── zone.ts
│       ├── combat.ts
│       ├── dialogue.ts
│       ├── question.ts
│       └── item.ts
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql
├── __tests__/
│   ├── lib/
│   │   ├── stats.test.ts
│   │   ├── currency.test.ts
│   │   ├── navigation.test.ts
│   │   ├── combat-engine.test.ts
│   │   ├── dialogue-engine.test.ts
│   │   └── question-engine.test.ts
│   └── components/
│       └── (component tests added as needed per task)
├── vitest.config.ts
├── tailwind.config.ts
├── next.config.ts
├── package.json
├── tsconfig.json
└── .env.local
```

---

## Task 1: Project Scaffolding

**Files:**
- Create: `mediquest/` (entire project scaffold)
- Create: `mediquest/package.json`
- Create: `mediquest/vitest.config.ts`
- Create: `mediquest/.env.local.example`

- [ ] **Step 1: Create Next.js project**

```bash
cd /Users/jasongusdorf/CodingProjects/Claude
npx create-next-app@latest mediquest --typescript --tailwind --eslint --app --src-dir --no-import-alias
```

Accept defaults. This creates the project with App Router, TypeScript, Tailwind CSS, and ESLint.

- [ ] **Step 2: Install dependencies**

```bash
cd mediquest
npm install zustand @supabase/supabase-js next-auth@4 next-auth
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom
```

- [ ] **Step 3: Configure Vitest**

Create `mediquest/vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

Add to `package.json` scripts:
```json
"test": "vitest",
"test:run": "vitest run"
```

- [ ] **Step 3b: Create test setup file**

Create `mediquest/src/test/setup.ts`:
```typescript
import '@testing-library/jest-dom'
```

- [ ] **Step 4: Create env example file**

Create `mediquest/.env.local.example`:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
```

- [ ] **Step 5: Verify setup**

```bash
cd mediquest && npm run build && npm run test:run
```

Expected: Build succeeds, test runner starts with no tests found.

- [ ] **Step 6: Commit**

```bash
git add mediquest/
git commit -m "feat: scaffold MediQuest Next.js project with Zustand, Supabase, Vitest"
```

---

## Task 2: Type Definitions

**Files:**
- Create: `src/types/character.ts`
- Create: `src/types/zone.ts`
- Create: `src/types/combat.ts`
- Create: `src/types/dialogue.ts`
- Create: `src/types/question.ts`
- Create: `src/types/item.ts`

These types are the contract for the entire codebase. Every other task depends on them.

- [ ] **Step 1: Define character types**

Create `src/types/character.ts`:

```typescript
export type CoreStat = 'str' | 'int' | 'vit' | 'wis' | 'spd' | 'lck'

export interface CoreStats {
  str: number
  int: number
  vit: number
  wis: number
  spd: number
  lck: number
}

export interface DerivedStats {
  atk: number   // STR + weapon bonus
  def: number   // VIT + armor bonus
  maxHp: number // 20 + VIT * 5
  maxMana: number // 10 + WIS * 3
}

export type ExamTrack =
  | 'usmle_step1'
  | 'usmle_step2ck'
  | 'usmle_step3'
  | 'comlex_level1'
  | 'comlex_level2'
  | 'comlex_level3'
  | 'shelf_medicine'
  | 'shelf_surgery'
  | 'shelf_peds'
  | 'shelf_obgyn'
  | 'shelf_psych'
  | 'board_certification'
  | 'just_exploring'

export type Specialty = 'surgery' // MVP only, more post-MVP

export interface Currency {
  copper: number
  silver: number
  gold: number
}

export interface Character {
  id: string
  userId: string
  name: string
  portrait: string       // portrait ID from preset list
  level: number
  xp: number
  xpToNextLevel: number
  stats: CoreStats
  currentHp: number
  currentMana: number
  currency: Currency
  examTrack: ExamTrack
  specialty: Specialty | null
  currentZoneId: string
  currentX: number
  currentY: number
  unallocatedStatPoints: number
}

export type EquipSlot = 'weapon' | 'armor' | 'accessory'

export interface EquippedGear {
  weapon: string | null  // item ID
  armor: string | null
  accessory: string | null
}
```

- [ ] **Step 2: Define zone and room types**

Create `src/types/zone.ts`:

```typescript
export interface Zone {
  id: string
  name: string
  era: string
  description: string
  gridWidth: number
  gridHeight: number
  startX: number
  startY: number
  rooms: Room[]
}

export interface Interactable {
  id: string
  name: string
  description: string
  action: 'examine' | 'search' | 'take'
  result: string           // text shown to player
  itemReward?: string      // item ID if action gives an item
  questFlag?: string       // quest flag set on interaction
}

export interface Room {
  x: number
  y: number
  name: string
  description: string
  exits: {
    north: boolean
    east: boolean
    south: boolean
    west: boolean
  }
  npcIds: string[]
  encounterChance: number  // 0-1, probability of random combat on entry
  encounterEnemyIds: string[]
  interactables: Interactable[]
  isHub: boolean
}
```

- [ ] **Step 3: Define combat types**

Create `src/types/combat.ts`:

```typescript
export type CombatAction = 'attack' | 'diagnose' | 'heal' | 'flee' | string // string for specialty abilities

export interface Enemy {
  id: string
  name: string
  description: string
  level: number
  type: string             // e.g., 'undead', 'spirit'
  maxHp: number
  currentHp: number
  str: number
  def: number
  spd: number
  xpReward: number
  copperReward: number
  lootTable: LootEntry[]
  abilities: EnemyAbility[]
  imageUrl?: string        // still image path
  isBoss: boolean          // boss enemies have special mechanics
  bossImmune: boolean      // if true, takes reduced damage until Diagnose weakens
}

export interface LootEntry {
  itemId: string
  dropChance: number       // 0-1
}

export interface EnemyAbility {
  name: string
  damage: number
  manaCost: number
  description: string
}

export interface CombatState {
  active: boolean
  enemy: Enemy | null
  turnOrder: 'player' | 'enemy'
  log: CombatLogEntry[]
  playerBuffs: Buff[]
  enemyDebuffs: Debuff[]
  questionActive: boolean  // true when Diagnose triggers a question
  result: 'ongoing' | 'victory' | 'defeat' | 'fled'
}

export interface CombatLogEntry {
  text: string
  type: 'player_action' | 'enemy_action' | 'system' | 'medical'
}

export interface Buff {
  name: string
  effect: string           // e.g., 'damage_multiplier'
  value: number
  turnsRemaining: number
}

export type Debuff = Buff
```

- [ ] **Step 4: Define dialogue types**

Create `src/types/dialogue.ts`:

```typescript
export interface DialogueTree {
  id: string
  npcId: string
  rootNodeId: string
  nodes: Record<string, DialogueNode>
}

export interface DialogueNode {
  id: string
  npcText: string
  teachingContent?: string    // educational content highlighted
  responses: DialogueResponse[]
  onEnter?: DialogueEffect[]  // effects triggered when reaching this node
}

export interface DialogueResponse {
  text: string
  nextNodeId: string | null   // null = end conversation
  condition?: DialogueCondition
}

export interface DialogueCondition {
  type: 'quest_complete' | 'quest_active' | 'has_item' | 'level_min' | 'specialty'
  value: string
}

export interface DialogueEffect {
  type: 'start_quest' | 'complete_quest' | 'give_item' | 'give_xp' | 'give_currency' | 'unlock_specialty' | 'start_combat' | 'start_patient_encounter' | 'change_exam_track'
  value: string | number
}

export interface NPC {
  id: string
  name: string
  title: string
  description: string
  role: 'mentor' | 'vendor' | 'registrar' | 'quest_giver'
  isHistoricalFigure: boolean
  dialogueTreeId: string
  vendorInventory?: string[]  // item IDs (only for vendors)
  imageUrl?: string
}
```

- [ ] **Step 5: Define question types**

Create `src/types/question.ts`:

```typescript
import type { ExamTrack } from './character'

export interface Question {
  id: string
  examTracks: ExamTrack[]
  category: string         // e.g., 'cardiology', 'anatomy'
  subcategory: string
  difficulty: 1 | 2 | 3 | 4 | 5
  vignette: string         // clinical scenario text
  stem: string             // the actual question
  choices: QuestionChoice[]
  correctChoiceId: string
  explanation: string      // full explanation shown after answering
  source: 'curated' | 'ai_generated'
  verified: boolean
}

export interface QuestionChoice {
  id: string
  text: string
  explanation: string      // why this choice is right/wrong
}

export interface QuestionResult {
  questionId: string
  selectedChoiceId: string
  correct: boolean
  timestamp: number
}

export interface PatientEncounter {
  id: string
  npcId: string
  narrative: string        // intro text for the patient case
  questionIds: string[]    // 1-3 questions in sequence
  passThreshold: number    // how many correct to pass
  xpReward: number
  copperReward: number
  questFlag?: string       // quest flag set on completion
}
```

- [ ] **Step 6: Define item types**

Create `src/types/item.ts`:

```typescript
import type { EquipSlot } from './character'

export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic'

export interface Item {
  id: string
  name: string
  description: string
  type: EquipSlot | 'consumable'
  rarity: ItemRarity
  levelRequirement: number
  statBonuses: Partial<Record<'str' | 'int' | 'vit' | 'wis' | 'spd' | 'lck' | 'atk' | 'def', number>>
  buyPrice: number         // in copper
  sellPrice: number        // in copper
  consumableEffect?: {
    type: 'heal_hp' | 'heal_mana' | 'buff'
    value: number
  }
}

export interface InventoryItem {
  itemId: string
  quantity: number
}
```

- [ ] **Step 7: Commit**

```bash
git add src/types/
git commit -m "feat: define core type system for character, zone, combat, dialogue, question, item"
```

---

## Task 3: Core Game Logic — Stats & Currency

**Files:**
- Create: `src/lib/stats.ts`
- Create: `src/lib/currency.ts`
- Create: `__tests__/lib/stats.test.ts`
- Create: `__tests__/lib/currency.test.ts`

Pure functions, no dependencies. TDD.

- [ ] **Step 1: Write stats tests**

Create `__tests__/lib/stats.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { calcDerivedStats, calcXpForLevel, calcLevelUp } from '@/lib/stats'

describe('calcDerivedStats', () => {
  it('calculates ATK from STR + weapon bonus', () => {
    const result = calcDerivedStats(
      { str: 10, int: 5, vit: 8, wis: 6, spd: 7, lck: 4 },
      { atk: 5 } // weapon bonus
    )
    expect(result.atk).toBe(15) // 10 + 5
  })

  it('calculates DEF from VIT + armor bonus', () => {
    const result = calcDerivedStats(
      { str: 10, int: 5, vit: 8, wis: 6, spd: 7, lck: 4 },
      { def: 3 } // armor bonus
    )
    expect(result.def).toBe(11) // 8 + 3
  })

  it('calculates maxHp as 20 + VIT * 5', () => {
    const result = calcDerivedStats(
      { str: 10, int: 5, vit: 8, wis: 6, spd: 7, lck: 4 },
      {}
    )
    expect(result.maxHp).toBe(60) // 20 + 8*5
  })

  it('calculates maxMana as 10 + WIS * 3', () => {
    const result = calcDerivedStats(
      { str: 10, int: 5, vit: 8, wis: 6, spd: 7, lck: 4 },
      {}
    )
    expect(result.maxMana).toBe(28) // 10 + 6*3
  })

  it('handles zero stats', () => {
    const result = calcDerivedStats(
      { str: 0, int: 0, vit: 0, wis: 0, spd: 0, lck: 0 },
      {}
    )
    expect(result.maxHp).toBe(20)
    expect(result.maxMana).toBe(10)
    expect(result.atk).toBe(0)
    expect(result.def).toBe(0)
  })
})

describe('calcXpForLevel', () => {
  it('returns XP needed for level 2', () => {
    expect(calcXpForLevel(2)).toBe(100)
  })

  it('scales with level', () => {
    expect(calcXpForLevel(10)).toBeGreaterThan(calcXpForLevel(5))
  })

  it('returns 0 for level 1', () => {
    expect(calcXpForLevel(1)).toBe(0)
  })
})

describe('calcLevelUp', () => {
  it('returns null if not enough XP', () => {
    expect(calcLevelUp(1, 50, 100)).toBeNull()
  })

  it('returns new level and remaining XP when enough', () => {
    const result = calcLevelUp(1, 150, 100)
    expect(result).toEqual({ newLevel: 2, remainingXp: 50 })
  })

  it('does not exceed max level 60', () => {
    const result = calcLevelUp(60, 9999, 100)
    expect(result).toBeNull()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd mediquest && npx vitest run __tests__/lib/stats.test.ts
```

Expected: FAIL — modules not found.

- [ ] **Step 3: Implement stats.ts**

Create `src/lib/stats.ts`:

```typescript
import type { CoreStats, DerivedStats } from '@/types/character'

export function calcDerivedStats(
  core: CoreStats,
  gearBonuses: Partial<Record<'atk' | 'def', number>>
): DerivedStats {
  return {
    atk: core.str + (gearBonuses.atk ?? 0),
    def: core.vit + (gearBonuses.def ?? 0),
    maxHp: 20 + core.vit * 5,
    maxMana: 10 + core.wis * 3,
  }
}

const MAX_LEVEL = 60

/** XP required to reach a given level (cumulative). Level 1 = 0. */
export function calcXpForLevel(level: number): number {
  if (level <= 1) return 0
  // Quadratic scaling: 100 * (level - 1)^1.5
  return Math.floor(100 * Math.pow(level - 1, 1.5))
}

/** Check if character has enough XP to level up. Returns null if not. */
export function calcLevelUp(
  currentLevel: number,
  currentXp: number,
  xpToNextLevel: number
): { newLevel: number; remainingXp: number } | null {
  if (currentLevel >= MAX_LEVEL) return null
  if (currentXp < xpToNextLevel) return null
  return {
    newLevel: currentLevel + 1,
    remainingXp: currentXp - xpToNextLevel,
  }
}
```

- [ ] **Step 4: Run stats tests**

```bash
cd mediquest && npx vitest run __tests__/lib/stats.test.ts
```

Expected: All pass.

- [ ] **Step 5: Write currency tests**

Create `__tests__/lib/currency.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { toCopper, fromCopper, addCurrency, subtractCurrency, canAfford, formatCurrency } from '@/lib/currency'

describe('toCopper', () => {
  it('converts gold/silver/copper to total copper', () => {
    expect(toCopper({ gold: 1, silver: 2, copper: 50 })).toBe(10250)
  })

  it('handles zero', () => {
    expect(toCopper({ gold: 0, silver: 0, copper: 0 })).toBe(0)
  })
})

describe('fromCopper', () => {
  it('converts copper to gold/silver/copper', () => {
    expect(fromCopper(10250)).toEqual({ gold: 1, silver: 2, copper: 50 })
  })

  it('handles sub-silver amounts', () => {
    expect(fromCopper(75)).toEqual({ gold: 0, silver: 0, copper: 75 })
  })
})

describe('addCurrency', () => {
  it('adds copper amounts and normalizes', () => {
    const result = addCurrency(
      { gold: 0, silver: 0, copper: 80 },
      30
    )
    expect(result).toEqual({ gold: 0, silver: 1, copper: 10 })
  })
})

describe('subtractCurrency', () => {
  it('subtracts and normalizes', () => {
    const result = subtractCurrency(
      { gold: 0, silver: 1, copper: 10 },
      30
    )
    expect(result).toEqual({ gold: 0, silver: 0, copper: 80 })
  })

  it('returns null if cannot afford', () => {
    const result = subtractCurrency(
      { gold: 0, silver: 0, copper: 10 },
      50
    )
    expect(result).toBeNull()
  })
})

describe('canAfford', () => {
  it('returns true if enough', () => {
    expect(canAfford({ gold: 0, silver: 1, copper: 0 }, 50)).toBe(true)
  })

  it('returns false if not enough', () => {
    expect(canAfford({ gold: 0, silver: 0, copper: 10 }, 50)).toBe(false)
  })
})

describe('formatCurrency', () => {
  it('formats with gold silver copper', () => {
    expect(formatCurrency({ gold: 2, silver: 5, copper: 30 })).toBe('2g 5s 30c')
  })

  it('omits zero denominations', () => {
    expect(formatCurrency({ gold: 0, silver: 0, copper: 50 })).toBe('50c')
  })

  it('omits zero copper when gold/silver present', () => {
    expect(formatCurrency({ gold: 1, silver: 0, copper: 0 })).toBe('1g')
  })
})
```

- [ ] **Step 6: Run currency tests to verify they fail**

```bash
cd mediquest && npx vitest run __tests__/lib/currency.test.ts
```

- [ ] **Step 7: Implement currency.ts**

Create `src/lib/currency.ts`:

```typescript
import type { Currency } from '@/types/character'

const COPPER_PER_SILVER = 100
const SILVER_PER_GOLD = 100
const COPPER_PER_GOLD = COPPER_PER_SILVER * SILVER_PER_GOLD

export function toCopper(c: Currency): number {
  return c.gold * COPPER_PER_GOLD + c.silver * COPPER_PER_SILVER + c.copper
}

export function fromCopper(total: number): Currency {
  const gold = Math.floor(total / COPPER_PER_GOLD)
  const remaining = total % COPPER_PER_GOLD
  const silver = Math.floor(remaining / COPPER_PER_SILVER)
  const copper = remaining % COPPER_PER_SILVER
  return { gold, silver, copper }
}

export function addCurrency(current: Currency, copperAmount: number): Currency {
  return fromCopper(toCopper(current) + copperAmount)
}

export function subtractCurrency(current: Currency, copperAmount: number): Currency | null {
  const total = toCopper(current) - copperAmount
  if (total < 0) return null
  return fromCopper(total)
}

export function canAfford(current: Currency, copperCost: number): boolean {
  return toCopper(current) >= copperCost
}

export function formatCurrency(c: Currency): string {
  const parts: string[] = []
  if (c.gold > 0) parts.push(`${c.gold}g`)
  if (c.silver > 0) parts.push(`${c.silver}s`)
  if (c.copper > 0 || parts.length === 0) parts.push(`${c.copper}c`)
  return parts.join(' ')
}
```

- [ ] **Step 8: Run currency tests**

```bash
cd mediquest && npx vitest run __tests__/lib/currency.test.ts
```

Expected: All pass.

- [ ] **Step 9: Commit**

```bash
git add src/lib/stats.ts src/lib/currency.ts __tests__/lib/
git commit -m "feat: add stats and currency calculation libraries with tests"
```

---

## Task 4: Core Game Logic — Navigation

**Files:**
- Create: `src/lib/navigation.ts`
- Create: `__tests__/lib/navigation.test.ts`

- [ ] **Step 1: Write navigation tests**

Create `__tests__/lib/navigation.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { movePlayer, getRoom, getAvailableExits } from '@/lib/navigation'
import type { Zone } from '@/types/zone'

const testZone: Zone = {
  id: 'test-zone',
  name: 'Test Zone',
  era: 'Test',
  description: 'A test zone',
  gridWidth: 3,
  gridHeight: 3,
  startX: 1,
  startY: 1,
  rooms: [
    {
      x: 1, y: 0, name: 'North Room', description: 'North',
      exits: { north: false, east: false, south: true, west: false },
      npcIds: [], encounterChance: 0, encounterEnemyIds: [], interactables: [], isHub: false,
    },
    {
      x: 0, y: 1, name: 'West Room', description: 'West',
      exits: { north: false, east: true, south: false, west: false },
      npcIds: [], encounterChance: 0, encounterEnemyIds: [], interactables: [], isHub: false,
    },
    {
      x: 1, y: 1, name: 'Center Room', description: 'Center',
      exits: { north: true, east: true, south: true, west: true },
      npcIds: [], encounterChance: 0, encounterEnemyIds: [], interactables: [], isHub: true,
    },
    {
      x: 2, y: 1, name: 'East Room', description: 'East',
      exits: { north: false, east: false, south: false, west: true },
      npcIds: [], encounterChance: 0, encounterEnemyIds: [], interactables: [], isHub: false,
    },
    {
      x: 1, y: 2, name: 'South Room', description: 'South',
      exits: { north: true, east: false, south: false, west: false },
      npcIds: [], encounterChance: 0, encounterEnemyIds: [], interactables: [], isHub: false,
    },
  ],
}

describe('getRoom', () => {
  it('returns room at coordinates', () => {
    const room = getRoom(testZone, 1, 1)
    expect(room?.name).toBe('Center Room')
  })

  it('returns null for empty cell', () => {
    expect(getRoom(testZone, 0, 0)).toBeNull()
  })
})

describe('getAvailableExits', () => {
  it('returns all exits for center room', () => {
    const exits = getAvailableExits(testZone, 1, 1)
    expect(exits).toEqual(['north', 'east', 'south', 'west'])
  })

  it('returns only valid exits', () => {
    const exits = getAvailableExits(testZone, 1, 0)
    expect(exits).toEqual(['south'])
  })
})

describe('movePlayer', () => {
  it('moves north successfully', () => {
    const result = movePlayer(testZone, 1, 1, 'north')
    expect(result?.x).toBe(1)
    expect(result?.y).toBe(0)
    expect(result?.room.name).toBe('North Room')
  })

  it('moves east successfully', () => {
    const result = movePlayer(testZone, 1, 1, 'east')
    expect(result?.x).toBe(2)
    expect(result?.y).toBe(1)
    expect(result?.room.name).toBe('East Room')
  })

  it('returns null if exit not available', () => {
    const result = movePlayer(testZone, 1, 0, 'north')
    expect(result).toBeNull()
  })

  it('returns null if no room in that direction', () => {
    const result = movePlayer(testZone, 0, 0, 'north')
    expect(result).toBeNull()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd mediquest && npx vitest run __tests__/lib/navigation.test.ts
```

- [ ] **Step 3: Implement navigation.ts**

Create `src/lib/navigation.ts`:

```typescript
import type { Zone, Room } from '@/types/zone'

type Direction = 'north' | 'east' | 'south' | 'west'

const DIRECTION_OFFSETS: Record<Direction, { dx: number; dy: number }> = {
  north: { dx: 0, dy: -1 },
  east:  { dx: 1, dy: 0 },
  south: { dx: 0, dy: 1 },
  west:  { dx: -1, dy: 0 },
}

export function getRoom(zone: Zone, x: number, y: number): Room | null {
  return zone.rooms.find(r => r.x === x && r.y === y) ?? null
}

export function getAvailableExits(zone: Zone, x: number, y: number): Direction[] {
  const room = getRoom(zone, x, y)
  if (!room) return []

  const directions: Direction[] = ['north', 'east', 'south', 'west']
  return directions.filter(dir => {
    if (!room.exits[dir]) return false
    const { dx, dy } = DIRECTION_OFFSETS[dir]
    return getRoom(zone, x + dx, y + dy) !== null
  })
}

export function movePlayer(
  zone: Zone,
  currentX: number,
  currentY: number,
  direction: Direction
): { x: number; y: number; room: Room } | null {
  const currentRoom = getRoom(zone, currentX, currentY)
  if (!currentRoom || !currentRoom.exits[direction]) return null

  const { dx, dy } = DIRECTION_OFFSETS[direction]
  const newX = currentX + dx
  const newY = currentY + dy
  const newRoom = getRoom(zone, newX, newY)

  if (!newRoom) return null
  return { x: newX, y: newY, room: newRoom }
}
```

- [ ] **Step 4: Run navigation tests**

```bash
cd mediquest && npx vitest run __tests__/lib/navigation.test.ts
```

Expected: All pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/navigation.ts __tests__/lib/navigation.test.ts
git commit -m "feat: add grid-based navigation system with tests"
```

---

## Task 5: Core Game Logic — Combat Engine

**Files:**
- Create: `src/lib/combat-engine.ts`
- Create: `__tests__/lib/combat-engine.test.ts`

- [ ] **Step 1: Write combat engine tests**

Create `__tests__/lib/combat-engine.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import {
  determineTurnOrder,
  calcAttackDamage,
  calcHeal,
  calcFleeChance,
  resolvePlayerAttack,
  resolveEnemyTurn,
  applyDiagnoseResult,
} from '@/lib/combat-engine'
import type { Enemy } from '@/types/combat'
import type { DerivedStats } from '@/types/character'

const mockEnemy: Enemy = {
  id: 'enemy1', name: 'Plague Spirit', description: '', level: 3,
  type: 'spirit', maxHp: 40, currentHp: 40, str: 8, def: 4, spd: 5,
  xpReward: 50, copperReward: 25, lootTable: [], abilities: [
    { name: 'Miasma Touch', damage: 8, manaCost: 0, description: '' }
  ],
}

const mockPlayerStats: DerivedStats = { atk: 12, def: 6, maxHp: 60, maxMana: 28 }

describe('determineTurnOrder', () => {
  it('player goes first if higher SPD', () => {
    expect(determineTurnOrder(10, 5)).toBe('player')
  })

  it('enemy goes first if higher SPD', () => {
    expect(determineTurnOrder(3, 8)).toBe('enemy')
  })

  it('player goes first on tie', () => {
    expect(determineTurnOrder(5, 5)).toBe('player')
  })
})

describe('calcAttackDamage', () => {
  it('deals ATK minus enemy DEF, minimum 1', () => {
    expect(calcAttackDamage(12, 4)).toBe(8)
  })

  it('deals minimum 1 if DEF exceeds ATK', () => {
    expect(calcAttackDamage(3, 10)).toBe(1)
  })
})

describe('calcHeal', () => {
  it('heals based on INT, capped at maxHp', () => {
    const healed = calcHeal(30, 60, 10) // currentHp, maxHp, int
    expect(healed).toBe(50) // 30 + 10*2 = 50
  })

  it('caps at maxHp', () => {
    const healed = calcHeal(55, 60, 10)
    expect(healed).toBe(60)
  })
})

describe('calcFleeChance', () => {
  it('higher player SPD = higher chance', () => {
    const fast = calcFleeChance(15, 5)
    const slow = calcFleeChance(5, 15)
    expect(fast).toBeGreaterThan(slow)
  })

  it('returns between 0 and 1', () => {
    expect(calcFleeChance(10, 10)).toBeGreaterThanOrEqual(0)
    expect(calcFleeChance(10, 10)).toBeLessThanOrEqual(1)
  })
})

describe('resolvePlayerAttack', () => {
  it('reduces enemy HP', () => {
    const result = resolvePlayerAttack(mockEnemy, mockPlayerStats, [])
    expect(result.enemy.currentHp).toBeLessThan(40)
    expect(result.log.type).toBe('player_action')
  })

  it('applies damage buff', () => {
    const noBuff = resolvePlayerAttack(mockEnemy, mockPlayerStats, [])
    const withBuff = resolvePlayerAttack(mockEnemy, mockPlayerStats, [
      { name: 'Diagnose Boost', effect: 'damage_multiplier', value: 1.5, turnsRemaining: 1 }
    ])
    expect(withBuff.enemy.currentHp).toBeLessThan(noBuff.enemy.currentHp)
  })
})

describe('resolveEnemyTurn', () => {
  it('deals damage to player', () => {
    const result = resolveEnemyTurn(mockEnemy, 60, mockPlayerStats)
    expect(result.newPlayerHp).toBeLessThan(60)
  })
})

describe('applyDiagnoseResult', () => {
  it('correct answer grants damage buff', () => {
    const result = applyDiagnoseResult(true)
    expect(result.buff).toBeTruthy()
    expect(result.buff!.effect).toBe('damage_multiplier')
  })

  it('incorrect answer grants no buff', () => {
    const result = applyDiagnoseResult(false)
    expect(result.buff).toBeNull()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd mediquest && npx vitest run __tests__/lib/combat-engine.test.ts
```

- [ ] **Step 3: Implement combat-engine.ts**

Create `src/lib/combat-engine.ts`:

```typescript
import type { Enemy, CombatLogEntry, Buff } from '@/types/combat'
import type { DerivedStats } from '@/types/character'

export function determineTurnOrder(
  playerSpd: number,
  enemySpd: number
): 'player' | 'enemy' {
  return playerSpd >= enemySpd ? 'player' : 'enemy'
}

export function calcAttackDamage(atk: number, def: number): number {
  return Math.max(1, atk - def)
}

export function calcHeal(currentHp: number, maxHp: number, int: number): number {
  const healAmount = int * 2
  return Math.min(currentHp + healAmount, maxHp)
}

export function calcFleeChance(playerSpd: number, enemySpd: number): number {
  // Base 50% + 5% per speed difference, clamped 10%-90%
  const base = 0.5 + (playerSpd - enemySpd) * 0.05
  return Math.max(0.1, Math.min(0.9, base))
}

export function resolvePlayerAttack(
  enemy: Enemy,
  playerStats: DerivedStats,
  buffs: Buff[]
): { enemy: Enemy; log: CombatLogEntry } {
  let damage = calcAttackDamage(playerStats.atk, enemy.def)

  // Boss immunity: reduced damage until weakened by Diagnose
  if (enemy.isBoss && enemy.bossImmune) {
    damage = Math.max(1, Math.floor(damage * 0.25))
  }

  // Apply damage multiplier buffs
  for (const buff of buffs) {
    if (buff.effect === 'damage_multiplier') {
      damage = Math.floor(damage * buff.value)
    }
  }

  const newHp = Math.max(0, enemy.currentHp - damage)
  return {
    enemy: { ...enemy, currentHp: newHp },
    log: {
      text: `You attack ${enemy.name} for ${damage} damage!`,
      type: 'player_action',
    },
  }
}

export function resolveEnemyTurn(
  enemy: Enemy,
  playerHp: number,
  playerStats: DerivedStats
): { newPlayerHp: number; log: CombatLogEntry } {
  // Enemy uses first ability (or basic attack if none)
  const ability = enemy.abilities[0]
  const rawDamage = ability ? ability.damage : enemy.str
  const damage = Math.max(1, rawDamage - playerStats.def)
  const newPlayerHp = Math.max(0, playerHp - damage)

  return {
    newPlayerHp,
    log: {
      text: ability
        ? `${enemy.name} uses ${ability.name}! ${damage} damage.`
        : `${enemy.name} attacks for ${damage} damage.`,
      type: 'enemy_action',
    },
  }
}

const DIAGNOSE_MANA_COST = 10
const DIAGNOSE_BUFF_MULTIPLIER = 1.5
const DIAGNOSE_BUFF_DURATION = 2

export function getDiagnoseManaCost(): number {
  return DIAGNOSE_MANA_COST
}

/** For boss fights: correct Diagnose removes boss immunity */
export function applyDiagnoseToBoss(
  enemy: Enemy,
  correct: boolean
): { enemy: Enemy; log: CombatLogEntry } {
  if (correct && enemy.isBoss && enemy.bossImmune) {
    return {
      enemy: { ...enemy, bossImmune: false },
      log: {
        text: `Your diagnosis reveals ${enemy.name}'s weakness! It is no longer immune.`,
        type: 'medical',
      },
    }
  }
  return {
    enemy,
    log: {
      text: correct
        ? `Correct! But ${enemy.name} has no immunity to break.`
        : 'Incorrect diagnosis.',
      type: 'medical',
    },
  }
}

export function applyDiagnoseResult(
  correct: boolean
): { buff: Buff | null; log: CombatLogEntry } {
  if (correct) {
    return {
      buff: {
        name: 'Diagnose Boost',
        effect: 'damage_multiplier',
        value: DIAGNOSE_BUFF_MULTIPLIER,
        turnsRemaining: DIAGNOSE_BUFF_DURATION,
      },
      log: {
        text: 'Correct diagnosis! Your next attacks deal 50% more damage.',
        type: 'medical',
      },
    }
  }
  return {
    buff: null,
    log: {
      text: 'Incorrect diagnosis. Your turn is wasted.',
      type: 'medical',
    },
  }
}
```

- [ ] **Step 4: Run combat tests**

```bash
cd mediquest && npx vitest run __tests__/lib/combat-engine.test.ts
```

Expected: All pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/combat-engine.ts __tests__/lib/combat-engine.test.ts
git commit -m "feat: add turn-based combat engine with tests"
```

---

## Task 6: Core Game Logic — Dialogue Engine

**Files:**
- Create: `src/lib/dialogue-engine.ts`
- Create: `__tests__/lib/dialogue-engine.test.ts`

- [ ] **Step 1: Write dialogue engine tests**

Create `__tests__/lib/dialogue-engine.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { getNode, getAvailableResponses, advanceDialogue } from '@/lib/dialogue-engine'
import type { DialogueTree } from '@/types/dialogue'

const testTree: DialogueTree = {
  id: 'test-tree',
  npcId: 'hippocrates',
  rootNodeId: 'root',
  nodes: {
    root: {
      id: 'root',
      npcText: 'Welcome, seeker.',
      responses: [
        { text: 'Tell me about humoralism.', nextNodeId: 'humoralism' },
        { text: 'I need a quest.', nextNodeId: 'quest', condition: { type: 'quest_complete', value: 'intro' } },
        { text: 'Goodbye.', nextNodeId: null },
      ],
    },
    humoralism: {
      id: 'humoralism',
      npcText: 'The body is governed by four humors...',
      teachingContent: 'Hippocrates proposed that health depends on the balance of blood, phlegm, yellow bile, and black bile.',
      responses: [
        { text: 'Interesting. Tell me more.', nextNodeId: 'humors_detail' },
        { text: 'Back to the start.', nextNodeId: 'root' },
      ],
    },
    humors_detail: {
      id: 'humors_detail',
      npcText: 'Each humor corresponds to an element...',
      responses: [],
      onEnter: [{ type: 'give_xp', value: 10 }],
    },
    quest: {
      id: 'quest',
      npcText: 'There is a plague spreading...',
      responses: [],
      onEnter: [{ type: 'start_quest', value: 'plague_investigation' }],
    },
  },
}

describe('getNode', () => {
  it('returns root node', () => {
    const node = getNode(testTree, 'root')
    expect(node?.npcText).toBe('Welcome, seeker.')
  })

  it('returns null for invalid id', () => {
    expect(getNode(testTree, 'nonexistent')).toBeNull()
  })
})

describe('getAvailableResponses', () => {
  it('returns all responses without conditions', () => {
    const responses = getAvailableResponses(testTree, 'humoralism', {
      completedQuests: [],
      activeQuests: [],
      inventory: [],
      level: 1,
      specialty: null,
    })
    expect(responses).toHaveLength(2)
  })

  it('filters responses by quest condition', () => {
    const withoutQuest = getAvailableResponses(testTree, 'root', {
      completedQuests: [],
      activeQuests: [],
      inventory: [],
      level: 1,
      specialty: null,
    })
    expect(withoutQuest).toHaveLength(2) // quest option hidden

    const withQuest = getAvailableResponses(testTree, 'root', {
      completedQuests: ['intro'],
      activeQuests: [],
      inventory: [],
      level: 1,
      specialty: null,
    })
    expect(withQuest).toHaveLength(3) // quest option visible
  })
})

describe('advanceDialogue', () => {
  it('returns next node and effects', () => {
    const result = advanceDialogue(testTree, 'root', 'humoralism')
    expect(result?.node.id).toBe('humoralism')
    expect(result?.effects).toEqual([])
  })

  it('returns effects from onEnter', () => {
    const result = advanceDialogue(testTree, 'humoralism', 'humors_detail')
    expect(result?.effects).toEqual([{ type: 'give_xp', value: 10 }])
  })

  it('returns null for end of conversation', () => {
    const result = advanceDialogue(testTree, 'root', null)
    expect(result).toBeNull()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd mediquest && npx vitest run __tests__/lib/dialogue-engine.test.ts
```

- [ ] **Step 3: Implement dialogue-engine.ts**

Create `src/lib/dialogue-engine.ts`:

```typescript
import type { DialogueTree, DialogueNode, DialogueResponse, DialogueEffect, DialogueCondition } from '@/types/dialogue'
import type { Specialty } from '@/types/character'

export interface PlayerContext {
  completedQuests: string[]
  activeQuests: string[]
  inventory: string[]
  level: number
  specialty: Specialty | null
}

export function getNode(tree: DialogueTree, nodeId: string): DialogueNode | null {
  return tree.nodes[nodeId] ?? null
}

function checkCondition(condition: DialogueCondition, ctx: PlayerContext): boolean {
  switch (condition.type) {
    case 'quest_complete':
      return ctx.completedQuests.includes(condition.value)
    case 'quest_active':
      return ctx.activeQuests.includes(condition.value)
    case 'has_item':
      return ctx.inventory.includes(condition.value)
    case 'level_min':
      return ctx.level >= Number(condition.value)
    case 'specialty':
      return ctx.specialty === condition.value
    default:
      return false
  }
}

export function getAvailableResponses(
  tree: DialogueTree,
  nodeId: string,
  ctx: PlayerContext
): DialogueResponse[] {
  const node = getNode(tree, nodeId)
  if (!node) return []

  return node.responses.filter(r => {
    if (!r.condition) return true
    return checkCondition(r.condition, ctx)
  })
}

export function advanceDialogue(
  tree: DialogueTree,
  _currentNodeId: string,
  nextNodeId: string | null
): { node: DialogueNode; effects: DialogueEffect[] } | null {
  if (nextNodeId === null) return null

  const nextNode = getNode(tree, nextNodeId)
  if (!nextNode) return null

  return {
    node: nextNode,
    effects: nextNode.onEnter ?? [],
  }
}
```

- [ ] **Step 4: Run dialogue tests**

```bash
cd mediquest && npx vitest run __tests__/lib/dialogue-engine.test.ts
```

Expected: All pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/dialogue-engine.ts __tests__/lib/dialogue-engine.test.ts
git commit -m "feat: add dialogue tree engine with conditional branching and tests"
```

---

## Task 7: Core Game Logic — Question Engine

**Files:**
- Create: `src/lib/question-engine.ts`
- Create: `__tests__/lib/question-engine.test.ts`

- [ ] **Step 1: Write question engine tests**

Create `__tests__/lib/question-engine.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { filterQuestions, checkAnswer, calcQuestionReward } from '@/lib/question-engine'
import type { Question } from '@/types/question'

const testQuestions: Question[] = [
  {
    id: 'q1', examTracks: ['usmle_step1'], category: 'anatomy',
    subcategory: 'upper_limb', difficulty: 1,
    vignette: 'A patient presents with...', stem: 'Which nerve is affected?',
    choices: [
      { id: 'a', text: 'Radial', explanation: 'Correct because...' },
      { id: 'b', text: 'Ulnar', explanation: 'Incorrect because...' },
    ],
    correctChoiceId: 'a', explanation: 'The radial nerve...',
    source: 'curated', verified: true,
  },
  {
    id: 'q2', examTracks: ['usmle_step2ck'], category: 'cardiology',
    subcategory: 'heart_failure', difficulty: 3,
    vignette: 'A 65-year-old man...', stem: 'What is the next best step?',
    choices: [
      { id: 'a', text: 'Echocardiogram', explanation: '' },
      { id: 'b', text: 'CT chest', explanation: '' },
    ],
    correctChoiceId: 'a', explanation: 'Echo is...',
    source: 'curated', verified: true,
  },
  {
    id: 'q3', examTracks: ['usmle_step1', 'usmle_step2ck'], category: 'anatomy',
    subcategory: 'lower_limb', difficulty: 2,
    vignette: 'A runner presents...', stem: 'Which muscle is injured?',
    choices: [
      { id: 'a', text: 'Gastrocnemius', explanation: '' },
      { id: 'b', text: 'Soleus', explanation: '' },
    ],
    correctChoiceId: 'b', explanation: 'Soleus...',
    source: 'curated', verified: true,
  },
]

describe('filterQuestions', () => {
  it('filters by exam track', () => {
    const result = filterQuestions(testQuestions, { examTrack: 'usmle_step1' })
    expect(result).toHaveLength(2)
    expect(result.map(q => q.id)).toContain('q1')
    expect(result.map(q => q.id)).toContain('q3')
  })

  it('filters by category', () => {
    const result = filterQuestions(testQuestions, { examTrack: 'usmle_step1', category: 'anatomy' })
    expect(result).toHaveLength(2)
  })

  it('filters by difficulty', () => {
    const result = filterQuestions(testQuestions, { examTrack: 'usmle_step2ck', maxDifficulty: 2 })
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('q3')
  })

  it('returns all for just_exploring', () => {
    const result = filterQuestions(testQuestions, { examTrack: 'just_exploring' })
    expect(result).toHaveLength(3)
  })
})

describe('checkAnswer', () => {
  it('returns correct for right answer', () => {
    expect(checkAnswer(testQuestions[0], 'a')).toBe(true)
  })

  it('returns incorrect for wrong answer', () => {
    expect(checkAnswer(testQuestions[0], 'b')).toBe(false)
  })
})

describe('calcQuestionReward', () => {
  it('awards XP and copper for correct answer', () => {
    const reward = calcQuestionReward(true, 2)
    expect(reward.xp).toBeGreaterThan(0)
    expect(reward.copper).toBeGreaterThan(0)
  })

  it('awards less for incorrect answer', () => {
    const correct = calcQuestionReward(true, 2)
    const incorrect = calcQuestionReward(false, 2)
    expect(correct.xp).toBeGreaterThan(incorrect.xp)
  })

  it('scales with difficulty', () => {
    const easy = calcQuestionReward(true, 1)
    const hard = calcQuestionReward(true, 5)
    expect(hard.xp).toBeGreaterThan(easy.xp)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd mediquest && npx vitest run __tests__/lib/question-engine.test.ts
```

- [ ] **Step 3: Implement question-engine.ts**

Create `src/lib/question-engine.ts`:

```typescript
import type { Question } from '@/types/question'
import type { ExamTrack } from '@/types/character'
import type { SupabaseClient } from '@supabase/supabase-js'

interface QuestionFilter {
  examTrack: ExamTrack
  category?: string
  maxDifficulty?: number
  excludeIds?: string[]
}

export function filterQuestions(
  questions: Question[],
  filter: QuestionFilter
): Question[] {
  return questions.filter(q => {
    // "just_exploring" returns all questions
    if (filter.examTrack !== 'just_exploring') {
      if (!q.examTracks.includes(filter.examTrack)) return false
    }
    if (filter.category && q.category !== filter.category) return false
    if (filter.maxDifficulty && q.difficulty > filter.maxDifficulty) return false
    if (filter.excludeIds?.includes(q.id)) return false
    return true
  })
}

export function checkAnswer(question: Question, selectedChoiceId: string): boolean {
  return question.correctChoiceId === selectedChoiceId
}

export function calcQuestionReward(
  correct: boolean,
  difficulty: number
): { xp: number; copper: number } {
  const baseXp = 10 * difficulty
  const baseCopper = 5 * difficulty

  if (correct) {
    return { xp: baseXp, copper: baseCopper }
  }
  // Partial XP for attempting, no copper
  return { xp: Math.floor(baseXp * 0.2), copper: 0 }
}

/** Record a question answer to history (for Study Hall stats) */
export async function recordAnswer(
  supabase: SupabaseClient,
  characterId: string,
  questionId: string,
  selectedChoiceId: string,
  correct: boolean
) {
  await supabase.from('question_history').insert({
    character_id: characterId,
    question_id: questionId,
    selected_choice_id: selectedChoiceId,
    correct,
  })
}

/** Get study stats from question history */
export async function getStudyStats(
  supabase: SupabaseClient,
  characterId: string
): Promise<{ totalAnswered: number; totalCorrect: number; accuracy: number; currentStreak: number }> {
  const { data } = await supabase
    .from('question_history')
    .select('correct, answered_at')
    .eq('character_id', characterId)
    .order('answered_at', { ascending: false })

  if (!data || data.length === 0) {
    return { totalAnswered: 0, totalCorrect: 0, accuracy: 0, currentStreak: 0 }
  }

  const totalAnswered = data.length
  const totalCorrect = data.filter(r => r.correct).length
  const accuracy = Math.round((totalCorrect / totalAnswered) * 100)

  // Current streak: count consecutive correct from most recent
  let currentStreak = 0
  for (const record of data) {
    if (record.correct) currentStreak++
    else break
  }

  return { totalAnswered, totalCorrect, accuracy, currentStreak }
}
```

- [ ] **Step 4: Run question tests**

```bash
cd mediquest && npx vitest run __tests__/lib/question-engine.test.ts
```

Expected: All pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/question-engine.ts __tests__/lib/question-engine.test.ts
git commit -m "feat: add question engine with filtering, scoring, and rewards"
```

---

## Task 8: Database Schema & Supabase Setup

**Files:**
- Create: `supabase/migrations/001_initial_schema.sql`
- Create: `src/lib/supabase.ts`

- [ ] **Step 1: Create Supabase project**

Go to https://supabase.com, create a new project named "mediquest". Copy the URL, anon key, and service role key into `mediquest/.env.local`.

- [ ] **Step 2: Write the migration**

Create `supabase/migrations/001_initial_schema.sql`:

```sql
-- Users are managed by NextAuth, but we need a profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT UNIQUE NOT NULL,  -- NextAuth user ID
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES profiles(user_id),
  name TEXT NOT NULL,
  portrait TEXT NOT NULL,
  level INTEGER NOT NULL DEFAULT 1,
  xp INTEGER NOT NULL DEFAULT 0,
  xp_to_next_level INTEGER NOT NULL DEFAULT 100,
  str INTEGER NOT NULL DEFAULT 5,
  "int" INTEGER NOT NULL DEFAULT 5,
  vit INTEGER NOT NULL DEFAULT 5,
  wis INTEGER NOT NULL DEFAULT 5,
  spd INTEGER NOT NULL DEFAULT 5,
  lck INTEGER NOT NULL DEFAULT 5,
  current_hp INTEGER NOT NULL DEFAULT 45,
  current_mana INTEGER NOT NULL DEFAULT 25,
  copper INTEGER NOT NULL DEFAULT 0,
  silver INTEGER NOT NULL DEFAULT 0,
  gold INTEGER NOT NULL DEFAULT 0,
  exam_track TEXT NOT NULL DEFAULT 'just_exploring',
  specialty TEXT,
  current_zone_id TEXT NOT NULL DEFAULT 'ancient-greece',
  current_x INTEGER NOT NULL DEFAULT 0,
  current_y INTEGER NOT NULL DEFAULT 0,
  unallocated_stat_points INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  item_id TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  UNIQUE(character_id, item_id)
);

CREATE TABLE equipped_gear (
  character_id UUID PRIMARY KEY REFERENCES characters(id) ON DELETE CASCADE,
  weapon TEXT,
  armor TEXT,
  accessory TEXT
);

CREATE TABLE player_quests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  quest_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'completed'
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  UNIQUE(character_id, quest_id)
);

CREATE TABLE player_room_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  zone_id TEXT NOT NULL,
  x INTEGER NOT NULL,
  y INTEGER NOT NULL,
  visited_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(character_id, zone_id, x, y)
);

CREATE TABLE question_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  selected_choice_id TEXT NOT NULL,
  correct BOOLEAN NOT NULL,
  answered_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE player_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  specialty TEXT NOT NULL,
  ability_id TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(character_id, ability_id)
);

-- Indexes for common queries
CREATE INDEX idx_characters_user_id ON characters(user_id);
CREATE INDEX idx_inventory_character ON inventory(character_id);
CREATE INDEX idx_quests_character ON player_quests(character_id);
CREATE INDEX idx_room_visits_character ON player_room_visits(character_id);
CREATE INDEX idx_question_history_character ON question_history(character_id);

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipped_gear ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_room_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_skills ENABLE ROW LEVEL SECURITY;

-- RLS Policies: users can only access their own data
CREATE POLICY "Users manage own profile"
  ON profiles FOR ALL USING (user_id = auth.uid()::text);

CREATE POLICY "Users manage own characters"
  ON characters FOR ALL USING (user_id = auth.uid()::text);

-- Child tables: access via character ownership
CREATE POLICY "Users manage own inventory"
  ON inventory FOR ALL USING (
    character_id IN (SELECT id FROM characters WHERE user_id = auth.uid()::text)
  );

CREATE POLICY "Users manage own gear"
  ON equipped_gear FOR ALL USING (
    character_id IN (SELECT id FROM characters WHERE user_id = auth.uid()::text)
  );

CREATE POLICY "Users manage own quests"
  ON player_quests FOR ALL USING (
    character_id IN (SELECT id FROM characters WHERE user_id = auth.uid()::text)
  );

CREATE POLICY "Users manage own room visits"
  ON player_room_visits FOR ALL USING (
    character_id IN (SELECT id FROM characters WHERE user_id = auth.uid()::text)
  );

CREATE POLICY "Users manage own question history"
  ON question_history FOR ALL USING (
    character_id IN (SELECT id FROM characters WHERE user_id = auth.uid()::text)
  );

CREATE POLICY "Users manage own skills"
  ON player_skills FOR ALL USING (
    character_id IN (SELECT id FROM characters WHERE user_id = auth.uid()::text)
  );
```

- [ ] **Step 3: Create Supabase client**

Create `src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

- [ ] **Step 4: Run migration**

```bash
npx supabase db push
```

Or apply via the Supabase dashboard SQL editor.

- [ ] **Step 5: Commit**

```bash
git add supabase/ src/lib/supabase.ts
git commit -m "feat: add database schema and Supabase client"
```

---

## Task 9: Auth System

**Files:**
- Create: `src/lib/auth.ts`
- Create: `src/app/api/auth/[...nextauth]/route.ts`

- [ ] **Step 1: Configure NextAuth**

Create `src/lib/auth.ts`:

```typescript
import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { supabase } from './supabase'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Email',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const { data, error } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        })

        if (error || !data.user) return null

        return {
          id: data.user.id,
          email: data.user.email,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.userId = user.id
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as Record<string, unknown>).id = token.userId
      }
      return session
    },
  },
  pages: {
    signIn: '/',
  },
}
```

- [ ] **Step 2: Create auth route**

Create `src/app/api/auth/[...nextauth]/route.ts`:

```typescript
import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/auth.ts src/app/api/auth/
git commit -m "feat: add NextAuth authentication with Supabase credentials"
```

---

## Task 10: Game State Store (Zustand)

**Files:**
- Create: `src/stores/gameStore.ts`
- Create: `src/stores/combatStore.ts`

- [ ] **Step 1: Create main game store**

Create `src/stores/gameStore.ts`:

```typescript
import { create } from 'zustand'
import type { Character, EquippedGear, Currency } from '@/types/character'
import type { Room } from '@/types/zone'
import type { InventoryItem } from '@/types/item'
import type { CombatState } from '@/types/combat'
import type { DialogueNode } from '@/types/dialogue'
import { addCurrency as addCurrencyLib } from '@/lib/currency'

type SceneType =
  | 'character_creation'
  | 'exploration'
  | 'dialogue'
  | 'combat'
  | 'question'
  | 'patient_encounter'
  | 'vendor'
  | 'study_hall'

interface GameState {
  // Auth
  userId: string | null
  setUserId: (id: string) => void

  // Character
  character: Character | null
  setCharacter: (c: Character) => void
  updateCharacter: (updates: Partial<Character>) => void

  // Equipment
  equippedGear: EquippedGear
  setEquippedGear: (gear: EquippedGear) => void

  // Inventory
  inventory: InventoryItem[]
  setInventory: (items: InventoryItem[]) => void
  addItem: (itemId: string, quantity?: number) => void
  removeItem: (itemId: string, quantity?: number) => void

  // Scene
  currentScene: SceneType
  setScene: (scene: SceneType) => void

  // Navigation
  currentRoom: Room | null
  setCurrentRoom: (room: Room) => void
  visitedRooms: Set<string> // "zoneId:x:y"
  markRoomVisited: (zoneId: string, x: number, y: number) => void

  // Dialogue
  currentDialogueNodeId: string | null
  setDialogueNode: (nodeId: string | null) => void
  currentNpcId: string | null
  setCurrentNpc: (npcId: string | null) => void

  // Quests
  activeQuests: string[]
  completedQuests: string[]
  startQuest: (questId: string) => void
  completeQuest: (questId: string) => void

  // Exam track
  setExamTrack: (track: ExamTrack) => void

  // Currency helpers
  addCurrency: (copperAmount: number) => void
}

export const useGameStore = create<GameState>((set, get) => ({
  userId: null,
  setUserId: (id) => set({ userId: id }),

  character: null,
  setCharacter: (c) => set({ character: c }),
  updateCharacter: (updates) => set((state) => ({
    character: state.character ? { ...state.character, ...updates } : null,
  })),

  equippedGear: { weapon: null, armor: null, accessory: null },
  setEquippedGear: (gear) => set({ equippedGear: gear }),

  inventory: [],
  setInventory: (items) => set({ inventory: items }),
  addItem: (itemId, quantity = 1) => set((state) => {
    const existing = state.inventory.find(i => i.itemId === itemId)
    if (existing) {
      return {
        inventory: state.inventory.map(i =>
          i.itemId === itemId ? { ...i, quantity: i.quantity + quantity } : i
        ),
      }
    }
    return { inventory: [...state.inventory, { itemId, quantity }] }
  }),
  removeItem: (itemId, quantity = 1) => set((state) => {
    return {
      inventory: state.inventory
        .map(i => i.itemId === itemId ? { ...i, quantity: i.quantity - quantity } : i)
        .filter(i => i.quantity > 0),
    }
  }),

  currentScene: 'character_creation',
  setScene: (scene) => set({ currentScene: scene }),

  currentRoom: null,
  setCurrentRoom: (room) => set({ currentRoom: room }),
  visitedRooms: new Set(),
  markRoomVisited: (zoneId, x, y) => set((state) => {
    const key = `${zoneId}:${x}:${y}`
    const newSet = new Set(state.visitedRooms)
    newSet.add(key)
    return { visitedRooms: newSet }
  }),

  currentDialogueNodeId: null,
  setDialogueNode: (nodeId) => set({ currentDialogueNodeId: nodeId }),
  currentNpcId: null,
  setCurrentNpc: (npcId) => set({ currentNpcId: npcId }),

  activeQuests: [],
  completedQuests: [],
  startQuest: (questId) => set((state) => ({
    activeQuests: [...state.activeQuests, questId],
  })),
  completeQuest: (questId) => set((state) => ({
    activeQuests: state.activeQuests.filter(q => q !== questId),
    completedQuests: [...state.completedQuests, questId],
  })),

  setExamTrack: (track) => set((state) => ({
    character: state.character ? { ...state.character, examTrack: track } : null,
  })),

  addCurrency: (copperAmount) => set((state) => {
    if (!state.character) return {}
    const newCurrency = addCurrencyLib(state.character.currency, copperAmount)
    return {
      character: { ...state.character, currency: newCurrency },
    }
  }),
}))
```

- [ ] **Step 2: Create combat store**

Create `src/stores/combatStore.ts`:

```typescript
import { create } from 'zustand'
import type { CombatState, Enemy, CombatLogEntry, Buff, Debuff } from '@/types/combat'

interface CombatStore extends CombatState {
  startCombat: (enemy: Enemy, playerSpd: number) => void
  addLog: (entry: CombatLogEntry) => void
  setEnemy: (enemy: Enemy) => void
  setTurnOrder: (order: 'player' | 'enemy') => void
  addBuff: (buff: Buff) => void
  tickBuffs: () => void
  setQuestionActive: (active: boolean) => void
  setResult: (result: CombatState['result']) => void
  reset: () => void
}

const initialState: CombatState = {
  active: false,
  enemy: null,
  turnOrder: 'player',
  log: [],
  playerBuffs: [],
  enemyDebuffs: [],
  questionActive: false,
  result: 'ongoing',
}

export const useCombatStore = create<CombatStore>((set) => ({
  ...initialState,

  startCombat: (enemy, playerSpd) => set({
    active: true,
    enemy: { ...enemy },
    turnOrder: playerSpd >= enemy.spd ? 'player' : 'enemy',
    log: [{ text: `A ${enemy.name} appears!`, type: 'system' }],
    playerBuffs: [],
    enemyDebuffs: [],
    questionActive: false,
    result: 'ongoing',
  }),

  addLog: (entry) => set((state) => ({
    log: [...state.log, entry],
  })),

  setEnemy: (enemy) => set({ enemy }),

  setTurnOrder: (order) => set({ turnOrder: order }),

  addBuff: (buff) => set((state) => ({
    playerBuffs: [...state.playerBuffs, buff],
  })),

  tickBuffs: () => set((state) => ({
    playerBuffs: state.playerBuffs
      .map(b => ({ ...b, turnsRemaining: b.turnsRemaining - 1 }))
      .filter(b => b.turnsRemaining > 0),
  })),

  setQuestionActive: (active) => set({ questionActive: active }),

  setResult: (result) => set({ result }),

  reset: () => set(initialState),
}))
```

- [ ] **Step 3: Commit**

```bash
git add src/stores/
git commit -m "feat: add Zustand game state and combat stores"
```

---

## Task 11: Landing Page & Character Creation UI

**Files:**
- Create: `src/app/page.tsx` (modify default)
- Create: `src/app/create/page.tsx`
- Create: `src/components/character-creation/NameStep.tsx`
- Create: `src/components/character-creation/PortraitStep.tsx`
- Create: `src/components/character-creation/ExamTrackStep.tsx`
- Create: `src/components/character-creation/StatAllocationStep.tsx`

- [ ] **Step 1: Create landing page**

Modify `src/app/page.tsx` — login/register form with dark RPG aesthetic. Two forms: sign in and sign up. On successful auth, redirect to `/create` if no character exists, or `/play` if one does.

- [ ] **Step 2: Create character creation page**

Create `src/app/create/page.tsx` — multi-step wizard that renders each step component in sequence: Name → Portrait → Exam Track → Stat Allocation → Confirm & Create.

Use local state to track the current step and accumulated character data. On final step, POST to `/api/character` to create the character, then redirect to `/play`.

- [ ] **Step 3: Build NameStep component**

Create `src/components/character-creation/NameStep.tsx` — text input for character name (3-20 chars, alphanumeric + spaces). Dark theme input with gold accent.

- [ ] **Step 4: Build PortraitStep component**

Create `src/components/character-creation/PortraitStep.tsx` — grid of 8-10 selectable portrait options (use emoji or simple SVG icons as placeholders for MVP: ⚔️🩺🏛️🗡️💊🔬🧬🛡️). Click to select, gold border on selected.

- [ ] **Step 5: Build ExamTrackStep component**

Create `src/components/character-creation/ExamTrackStep.tsx` — list of exam track options from the ExamTrack type. Each is a clickable card with the track name and a brief description. Gold border on selected.

- [ ] **Step 6: Build StatAllocationStep component**

Create `src/components/character-creation/StatAllocationStep.tsx` — shows all 6 core stats at base 5. Player has 10 points to allocate. Each stat has +/- buttons. Show derived stats (HP, Mana, ATK, DEF) updating in real-time. "Points remaining: X" counter.

- [ ] **Step 7: Create character API route**

Create `src/app/api/character/route.ts` — POST handler that validates the request body and inserts a new character + equipped_gear + initial inventory into Supabase. GET handler that returns the current user's character.

- [ ] **Step 8: Commit**

```bash
git add src/app/ src/components/character-creation/
git commit -m "feat: add landing page and character creation wizard"
```

---

## Task 12: Game Shell & Sidebar

**Files:**
- Create: `src/app/play/page.tsx`
- Create: `src/components/game-shell/GameShell.tsx`
- Create: `src/components/game-shell/Sidebar.tsx`
- Create: `src/components/game-shell/MainPanel.tsx`
- Create: `src/components/sidebar/CharacterPanel.tsx`
- Create: `src/components/sidebar/MiniMap.tsx`
- Create: `src/components/sidebar/Compass.tsx`
- Create: `src/components/sidebar/EquipmentSummary.tsx`
- Create: `src/components/sidebar/CurrencyDisplay.tsx`
- Create: `src/components/ui/ProgressBar.tsx`

- [ ] **Step 1: Create ProgressBar component**

Create `src/components/ui/ProgressBar.tsx` — reusable bar with props: current, max, color, label. Renders a colored fill bar with text overlay (e.g., "HP 45/60"). Used for HP (red), Mana (purple), XP (blue).

- [ ] **Step 1b: Create ActionButton component**

Create `src/components/ui/ActionButton.tsx` — reusable styled button for game actions. Props: label, icon (emoji), onClick, disabled, variant ('default' | 'danger' | 'healing' | 'mana'). Dark background with colored border based on variant. Hover/active states. Used throughout combat, dialogue choices, and exploration actions.

- [ ] **Step 2: Create CurrencyDisplay component**

Create `src/components/sidebar/CurrencyDisplay.tsx` — displays copper/silver/gold using the `formatCurrency` function. Shows coin icons (🪙 for gold, ⚪ for silver, 🟤 for copper).

- [ ] **Step 3: Create CharacterPanel component**

Create `src/components/sidebar/CharacterPanel.tsx` — portrait, name, level, specialty label. HP/Mana/XP progress bars. Reads from gameStore.

- [ ] **Step 4: Create MiniMap component**

Create `src/components/sidebar/MiniMap.tsx` — renders the zone grid as a small grid of cells. Visited rooms shown as colored squares, unvisited as dark. Current position highlighted in gold. Hub rooms have a distinct color. Reads from gameStore.visitedRooms.

- [ ] **Step 5: Create Compass component**

Create `src/components/sidebar/Compass.tsx` — NESW directional buttons in a cross layout. Buttons are enabled/disabled based on available exits from current room. onClick calls navigation logic. Also registers arrow key event listeners on the window.

- [ ] **Step 6: Create EquipmentSummary component**

Create `src/components/sidebar/EquipmentSummary.tsx` — shows equipped weapon, armor, accessory names with stat bonuses. Reads from gameStore.equippedGear and item data.

- [ ] **Step 7: Create Sidebar component**

Create `src/components/game-shell/Sidebar.tsx` — composes CharacterPanel, EquipmentSummary, CurrencyDisplay, MiniMap, and Compass into a 200px-wide left panel with dark background and section dividers.

- [ ] **Step 8: Create MainPanel component**

Create `src/components/game-shell/MainPanel.tsx` — reads `currentScene` from gameStore and renders the appropriate scene component. Switch statement mapping scene types to components. Placeholder components for scenes not yet built.

- [ ] **Step 9: Create GameShell component**

Create `src/components/game-shell/GameShell.tsx` — flexbox layout: Sidebar on left, MainPanel fills remaining space. Full viewport height. Dark background (#16213e).

- [ ] **Step 10: Create play page**

Create `src/app/play/page.tsx` — loads character from API on mount, populates gameStore, renders GameShell. Redirects to `/` if not authenticated, to `/create` if no character.

- [ ] **Step 11: Commit**

```bash
git add src/app/play/ src/components/
git commit -m "feat: add game shell with sidebar, mini-map, compass, and scene switcher"
```

---

## Task 13: Exploration Scene

**Files:**
- Create: `src/components/scenes/ExplorationScene.tsx`

- [ ] **Step 1: Build ExplorationScene**

Create `src/components/scenes/ExplorationScene.tsx` — reads current room from gameStore. Displays:
- Zone/location breadcrumb (muted text, uppercase)
- Room name (gold, bold, larger)
- Available exits line (muted: "Exits: North, East, South")
- Room description (narrative text, light gray, generous line-height)
- NPC list (gold-colored names, clickable → sets scene to 'dialogue')
- Enemy indicator (red-colored, clickable → starts combat)
- Interactable objects (muted, clickable → shows result text)
- Action buttons at bottom for each available action

On room entry: check encounterChance, roll for random combat. If triggered, start combat with a random enemy from the room's encounterEnemyIds.

- [ ] **Step 2: Wire up navigation**

When Compass or arrow keys trigger a move:
1. Call `movePlayer()` from navigation lib
2. If successful, update gameStore (currentX, currentY, currentRoom)
3. Mark new room as visited
4. Check for random encounter
5. Auto-save via API

- [ ] **Step 3: Commit**

```bash
git add src/components/scenes/ExplorationScene.tsx
git commit -m "feat: add exploration scene with room display and navigation"
```

---

## Task 14: Dialogue Scene

**Files:**
- Create: `src/components/scenes/DialogueScene.tsx`

- [ ] **Step 1: Build DialogueScene**

Create `src/components/scenes/DialogueScene.tsx` — reads currentNpcId and currentDialogueNodeId from gameStore. Uses dialogue-engine to get the current node and available responses.

Displays:
- NPC name and title (gold header)
- NPC portrait/image placeholder
- NPC speech text (italic, larger)
- Teaching content highlighted in a distinct box (if present on node)
- Player response options as clickable buttons

On response click:
1. Call `advanceDialogue()` to get next node and effects
2. Process effects: give_xp → update character, start_quest → add to activeQuests, give_item → add to inventory, give_currency → add currency, start_combat → switch to combat scene, start_patient_encounter → switch to patient encounter scene, unlock_specialty → update character specialty, change_exam_track → show exam track selection UI (reuse ExamTrackStep from character creation) and call gameStore.setExamTrack()
3. Update currentDialogueNodeId
4. If nextNodeId is null, return to exploration scene

- [ ] **Step 2: Commit**

```bash
git add src/components/scenes/DialogueScene.tsx
git commit -m "feat: add dialogue scene with branching conversation and effects"
```

---

## Task 15: Combat Scene

**Files:**
- Create: `src/components/scenes/CombatScene.tsx`

- [ ] **Step 1: Build CombatScene**

Create `src/components/scenes/CombatScene.tsx` — reads from combatStore. Displays:

**Enemy area (top):**
- Enemy name, level, type
- HP bar
- Image placeholder

**Combat log (middle, scrollable):**
- Round markers
- Color-coded entries (player = white, enemy = red, system = gray, medical = green)

**Action bar (bottom):**
- Grid of 4 action buttons: Attack (⚔️), Diagnose (🩺), Heal (💊), Flee (🏃)
- Diagnose shows mana cost, disabled if not enough mana
- Heal shows mana cost, disabled if not enough mana

**Action handlers:**
- **Attack:** call `resolvePlayerAttack()`, update enemy HP, tick buffs, check for enemy death → victory screen with XP/loot. Then enemy turn.
- **Diagnose:** set questionActive=true, render QuestionScene inline. On answer, call `applyDiagnoseResult()`, add buff if correct. Then enemy turn.
- **Heal:** call `calcHeal()`, update player HP, spend mana. Then enemy turn.
- **Flee:** roll against `calcFleeChance()`. Success → return to exploration. Failure → enemy gets a free turn.

**Enemy turn:** call `resolveEnemyTurn()`, update player HP, check for player death → defeat screen.

**Victory:** show XP gained, copper gained, loot drops. "Continue" button returns to exploration.

**Defeat:** "You have fallen..." message. "Respawn at hub" button resets HP/Mana to half, moves to zone hub room.

- [ ] **Step 2: Commit**

```bash
git add src/components/scenes/CombatScene.tsx
git commit -m "feat: add combat scene with turn-based actions and medical knowledge integration"
```

---

## Task 16: Question Scene & Study Hall

**Files:**
- Create: `src/components/scenes/QuestionScene.tsx`
- Create: `src/components/scenes/StudyHallScene.tsx`

- [ ] **Step 1: Build QuestionScene**

Create `src/components/scenes/QuestionScene.tsx` — receives a Question prop (or fetches one). Displays:
- Clinical vignette (narrative text block)
- Stem question (bold)
- 5 answer choices as clickable cards (A-E labels)
- After selecting: highlight correct (green) and incorrect (red), show explanation text, show "Continue" button
- Returns the QuestionResult to the parent (combat scene, patient encounter, or study hall)

- [ ] **Step 2: Build StudyHallScene**

Create `src/components/scenes/StudyHallScene.tsx` — the question grinder mode.
- Header with stats: total answered, accuracy %, current streak
- Filter controls: exam track (locked to character's track by default, toggle to browse), category dropdown, difficulty slider
- "Next Question" button fetches a filtered question from the question pool
- Renders QuestionScene inline
- After answering, shows XP/copper reward, updates stats, offers "Next Question"
- "Back to Game" button returns to exploration

- [ ] **Step 3: Commit**

```bash
git add src/components/scenes/QuestionScene.tsx src/components/scenes/StudyHallScene.tsx
git commit -m "feat: add question scene and Study Hall grinder mode"
```

---

## Task 17: Patient Encounter & Vendor Scenes

**Files:**
- Create: `src/components/scenes/PatientEncounterScene.tsx`
- Create: `src/components/scenes/VendorScene.tsx`

- [ ] **Step 1: Build PatientEncounterScene**

Create `src/components/scenes/PatientEncounterScene.tsx` — receives a PatientEncounter from quest/dialogue context. Displays:
- NPC-framed narrative intro ("Hippocrates brings you to a patient...")
- Renders questions in sequence (1-3) using QuestionScene
- Progress indicator ("Question 2 of 3")
- Tracks correct count
- On completion: if pass threshold met, show success + rewards + quest flag. If not, show encouragement + offer retry.
- "Continue" returns to dialogue or exploration

- [ ] **Step 2: Build VendorScene**

Create `src/components/scenes/VendorScene.tsx` — reads vendor NPC's inventory from data. Displays:
- NPC name and greeting
- Two-column layout: vendor items (left), player inventory (right)
- Each vendor item shows: name, stats, price, "Buy" button (disabled if can't afford or level too low)
- Each player item shows: name, sell price, "Sell" button
- Currency display updates in real-time
- "Leave" button returns to exploration

- [ ] **Step 3: Commit**

```bash
git add src/components/scenes/PatientEncounterScene.tsx src/components/scenes/VendorScene.tsx
git commit -m "feat: add patient encounter and vendor scenes"
```

---

## Task 18: MVP Content — Ancient Greece Zone Data

**Files:**
- Create: `src/data/zones/ancient-greece.ts`
- Create: `src/data/npcs/hippocrates.ts`
- Create: `src/data/npcs/herophilus.ts`
- Create: `src/data/npcs/asclepius-priest.ts`
- Create: `src/data/npcs/registrar.ts`
- Create: `src/data/enemies/ancient-greece-enemies.ts`
- Create: `src/data/items/ancient-greece-items.ts`
- Create: `src/data/quests/ancient-greece-quests.ts`

- [ ] **Step 1: Create zone grid**

Create `src/data/zones/ancient-greece.ts` — define a 5x4 grid with ~15-20 accessible rooms. Layout:

```
Row 0:       [---] [Temple] [School] [---] [---]
Row 1:  [Path] [Courtyard*] [Agora] [Path] [---]
Row 2:       [---] [Gymnasium] [Path] [---] [---]
Row 3:       [---] [---] [Sacred Grove] [Boss Room] [---]
```

(*) Courtyard is the hub, position (1,1), where the player starts.

Each room has full description text, exit configuration, NPC assignments, encounter chances, and interactables. Write rich, atmospheric descriptions.

- [ ] **Step 2: Create Hippocrates NPC and dialogue tree**

Create `src/data/npcs/hippocrates.ts` — extensive dialogue tree with 20+ nodes covering:
- Introduction and greeting
- Teaching about observation-based medicine (vs superstition)
- The Hippocratic Oath — what it means and why it matters
- Humoralism — the four humors theory
- His approach to patient care
- The quest chain: treating patients, investigating the plague
- Deeper conversation branches for players who want to learn more
- Conditional branches unlocked after quest progress

- [ ] **Step 3: Create Herophilus NPC and dialogue tree**

Create `src/data/npcs/herophilus.ts` — dialogue tree covering:
- Introduction as a visitor from Alexandria
- Teaching about systematic human dissection (first to do it)
- Anatomy discoveries (nervous system, pulse, reproductive system)
- Why his work was revolutionary and controversial
- Surgery specialty unlock quest branch
- The 5-question anatomy assessment (links to PatientEncounter)

- [ ] **Step 4: Create vendor and registrar NPCs**

Create `src/data/npcs/asclepius-priest.ts` — simple dialogue + vendor inventory.
Create `src/data/npcs/registrar.ts` — dialogue that lets player change exam track.

- [ ] **Step 5: Create enemies**

Create `src/data/enemies/ancient-greece-enemies.ts` — define:
- Temple Guardian (level 2, undead, basic melee)
- Plague Spirit (level 3, spirit, disease-themed attacks)
- Miasma Wraith (level 4, spirit, stronger variant)
- Corrupted Healer (level 5, humanoid, uses heal on self)
- **Boss: Plague of Athens** (level 7, spirit, multi-phase, weakened by Diagnose)

- [ ] **Step 6: Create items**

Create `src/data/items/ancient-greece-items.ts` — define 8-10 items:
- Weapons: Wooden Staff (starter), Bronze Scalpel (+5 ATK), Hippocratic Rod (+8 ATK, +2 INT)
- Armor: Linen Robes (starter, +3 DEF), Priest's Vestments (+6 DEF, +2 WIS), Temple Guardian's Shield (+10 DEF)
- Accessories: Herb Pouch (+2 WIS), Asclepius Pendant (+3 LCK)
- Consumables: Minor Healing Potion (heal 20 HP), Mana Tonic (restore 15 Mana)

- [ ] **Step 7: Create quests**

Create `src/data/quests/ancient-greece-quests.ts` — define the MVP quest chain:
1. "The Seeker's Arrival" — meet Hippocrates (auto-complete on first dialogue)
2. "Lessons of the Father" — complete Hippocrates' teaching dialogues
3. "Healer's Trial" — treat 3 patients at the Temple (patient encounter)
4. "Strength of Body" — defeat 5 enemies in the Gymnasium
5. "The Spreading Sickness" — investigate the Agora (talk to NPCs, find clues)
6. "Plague of Athens" — defeat the boss
7. "The Anatomist's Path" (optional) — Herophilus specialty unlock chain

- [ ] **Step 8: Commit**

```bash
git add src/data/
git commit -m "feat: add Ancient Greece zone with NPCs, enemies, items, and quests"
```

---

## Task 19: Seed Questions

**Files:**
- Create: `src/data/questions/seed-questions.ts`

- [ ] **Step 1: Create 50 curated medical questions**

Create `src/data/questions/seed-questions.ts` — 50 board-style questions distributed across:
- Anatomy (10 questions)
- Physiology (10 questions)
- Pathology (10 questions)
- Pharmacology (10 questions)
- Clinical Medicine (10 questions)

Each tagged with appropriate exam tracks and difficulty levels (1-5). Full vignettes, stems, 5 choices each, correct answer, and detailed explanations. These must be medically accurate.

Questions should be in the `Question[]` format from the types.

- [ ] **Step 2: Commit**

```bash
git add src/data/questions/
git commit -m "feat: add 50 curated medical board-style questions"
```

---

## Task 20: Save/Load System

**Files:**
- Create: `src/lib/save.ts`
- Create: `src/app/api/save/route.ts`

- [ ] **Step 1: Implement save function**

Create `src/lib/save.ts`:

```typescript
import { supabase } from './supabase'
import type { Character, EquippedGear } from '@/types/character'
import type { InventoryItem } from '@/types/item'

export async function saveGameState(
  character: Character,
  equippedGear: EquippedGear,
  inventory: InventoryItem[],
  visitedRooms: Set<string>,
  activeQuests: string[],
  completedQuests: string[]
) {
  // Update character
  const { error: charError } = await supabase
    .from('characters')
    .update({
      level: character.level,
      xp: character.xp,
      xp_to_next_level: character.xpToNextLevel,
      str: character.stats.str,
      int: character.stats.int,
      vit: character.stats.vit,
      wis: character.stats.wis,
      spd: character.stats.spd,
      lck: character.stats.lck,
      current_hp: character.currentHp,
      current_mana: character.currentMana,
      copper: character.currency.copper,
      silver: character.currency.silver,
      gold: character.currency.gold,
      current_zone_id: character.currentZoneId,
      current_x: character.currentX,
      current_y: character.currentY,
      specialty: character.specialty,
      updated_at: new Date().toISOString(),
    })
    .eq('id', character.id)

  if (charError) throw charError

  // Upsert equipped gear
  await supabase
    .from('equipped_gear')
    .upsert({
      character_id: character.id,
      weapon: equippedGear.weapon,
      armor: equippedGear.armor,
      accessory: equippedGear.accessory,
    }, { onConflict: 'character_id' })

  // Sync inventory: delete all then re-insert (simple for MVP)
  await supabase
    .from('inventory')
    .delete()
    .eq('character_id', character.id)

  if (inventory.length > 0) {
    await supabase
      .from('inventory')
      .insert(
        inventory.map(i => ({
          character_id: character.id,
          item_id: i.itemId,
          quantity: i.quantity,
        }))
      )
  }

  // Upsert visited rooms
  const roomVisits = Array.from(visitedRooms).map(key => {
    const [zoneId, x, y] = key.split(':')
    return {
      character_id: character.id,
      zone_id: zoneId,
      x: parseInt(x),
      y: parseInt(y),
    }
  })

  if (roomVisits.length > 0) {
    await supabase
      .from('player_room_visits')
      .upsert(roomVisits, { onConflict: 'character_id,zone_id,x,y' })
  }

  // Sync quests
  for (const questId of activeQuests) {
    await supabase
      .from('player_quests')
      .upsert(
        { character_id: character.id, quest_id: questId, status: 'active' },
        { onConflict: 'character_id,quest_id' }
      )
  }
  for (const questId of completedQuests) {
    await supabase
      .from('player_quests')
      .upsert(
        { character_id: character.id, quest_id: questId, status: 'completed', completed_at: new Date().toISOString() },
        { onConflict: 'character_id,quest_id' }
      )
  }
}

export async function loadGameState(characterId: string) {
  const [charResult, gearResult, invResult, visitsResult, questsResult, skillsResult] = await Promise.all([
    supabase.from('characters').select('*').eq('id', characterId).single(),
    supabase.from('equipped_gear').select('*').eq('character_id', characterId).single(),
    supabase.from('inventory').select('*').eq('character_id', characterId),
    supabase.from('player_room_visits').select('*').eq('character_id', characterId),
    supabase.from('player_quests').select('*').eq('character_id', characterId),
    supabase.from('player_skills').select('*').eq('character_id', characterId),
  ])

  return {
    character: charResult.data,
    equippedGear: gearResult.data,
    inventory: invResult.data ?? [],
    visitedRooms: visitsResult.data ?? [],
    quests: questsResult.data ?? [],
    skills: skillsResult.data ?? [],
  }
}
```

- [ ] **Step 2: Create save API route**

Create `src/app/api/save/route.ts` — POST handler that accepts game state and calls `saveGameState()`. Protected by auth.

- [ ] **Step 3: Wire auto-save into game flow**

Add `saveGameState()` calls at the save trigger points defined in the spec:
- After `movePlayer()` succeeds (room transition)
- After combat resolution (victory/flee)
- After question answer
- After inventory change
- After quest state change

These calls should be fire-and-forget (don't block the UI).

- [ ] **Step 4: Wire load on game start**

In `src/app/play/page.tsx`, call `loadGameState()` on mount and populate the gameStore with the returned data. Reconstruct visitedRooms Set from the room visits array.

- [ ] **Step 5: Commit**

```bash
git add src/lib/save.ts src/app/api/save/
git commit -m "feat: add save/load system with auto-save triggers"
```

---

## Task 21: Integration & Polish

**Files:**
- Modify: various components for wiring
- Create: `src/app/layout.tsx` (modify for global styles)

- [ ] **Step 1: Apply dark RPG theme**

Update `src/app/globals.css` and `tailwind.config.ts`:
- Background: deep navy (#16213e), sidebar (#1a1a2e)
- Text: light gray (#ccc), gold accent (#e0c878)
- Enemy/danger: red (#c0392b)
- Medical/healing: green (#2ecc71)
- Mana: purple (#8e44ad)
- XP: blue (#2980b9)
- Font: system monospace or a serif font for the narrative text

- [ ] **Step 2: Add keyboard navigation**

In the GameShell, add a global `useEffect` that listens for arrow key events and dispatches movement when the current scene is 'exploration'. Prevent default scroll behavior.

- [ ] **Step 3: Add Study Hall access**

Add a "Study Hall" button to the sidebar or a top menu that switches the scene to 'study_hall' from anywhere (except combat).

- [ ] **Step 4: Add shallow routing**

Update the URL on scene/room changes using `window.history.replaceState`:
- `/play?zone=ancient-greece&x=1&y=1` for exploration
- `/play?scene=study-hall` for Study Hall
- `/play?scene=combat` during combat

On page load, parse URL params to restore position.

- [ ] **Step 5: End-to-end walkthrough test**

Manually test the full flow:
1. Register account
2. Create character (name, portrait, exam track, stats)
3. Arrive at Temple of Asclepius
4. Talk to Hippocrates (explore full dialogue tree)
5. Navigate to Gymnasium, fight Temple Guardian
6. Use Diagnose in combat, answer a question
7. Visit Agora, buy item from Asclepius Priest
8. Navigate to Sacred Grove, fight harder enemies
9. Open Study Hall, answer 5 questions
10. Close browser, re-open, verify state restored

- [ ] **Step 6: Fix bugs from walkthrough**

Address any issues found during the manual test.

- [ ] **Step 7: Final commit**

```bash
git add .
git commit -m "feat: complete MediQuest MVP integration and polish"
```

---

## Summary

| Task | Description | Dependencies |
|------|-------------|-------------|
| 1 | Project scaffolding | None |
| 2 | Type definitions | Task 1 |
| 3 | Stats & currency logic | Task 2 |
| 4 | Navigation logic | Task 2 |
| 5 | Combat engine | Task 2 |
| 6 | Dialogue engine | Task 2 |
| 7 | Question engine | Task 2 |
| 8 | Database schema | Task 1 |
| 9 | Auth system | Task 8 |
| 10 | Zustand stores | Tasks 2-7 |
| 11 | Landing & character creation | Tasks 9, 10 |
| 12 | Game shell & sidebar | Task 10 |
| 13 | Exploration scene | Tasks 4, 12 |
| 14 | Dialogue scene | Tasks 6, 12 |
| 15 | Combat scene | Tasks 5, 12 |
| 16 | Question & Study Hall scenes | Tasks 7, 12 |
| 17 | Patient encounter & vendor scenes | Tasks 16, 14 |
| 18 | Zone content data | Task 2 |
| 19 | Seed questions | Task 2 |
| 20 | Save/load system | Tasks 8, 10 |
| 21 | Integration & polish | All above |

**Parallelizable:** Tasks 3-7 and Task 8 can all run in parallel (independent, depend only on Tasks 1-2). Tasks 18-19 can run in parallel with UI tasks 11-17.
