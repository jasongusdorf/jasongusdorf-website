# MediQuest — Game Design Spec

## Overview

MediQuest is a browser-based, text-driven RPG set in the world of medicine. Players explore historical eras, interact with famous figures from the history of medicine, learn about their discoveries, fight enemies in turn-based combat, and answer medical board-style questions to level up. The game is a choose-your-own-adventure experience with full RPG mechanics — no graphical world, only narrative text and still images.

## Target Audience

Medical professionals across the full spectrum: medical students studying for USMLE/COMLEX/Shelf exams through practicing attendings. The game scales difficulty via exam track selection.

## Core Gameplay Loop

1. **Explore** — navigate zones using NESW arrow keys on a grid-based map
2. **Learn** — encounter famous medical figures who teach about their discoveries through extensive branching dialogue
3. **Prove** — answer medical questions (narrative-integrated or board-style) to demonstrate knowledge
4. **Progress** — gain XP, currency, gear, and unlock specialty combat abilities

## Architecture

### Approach: Single-Page Game Shell

One main game route with a scene engine that swaps content panels — exploration text, dialogue UI, combat screen, inventory, character sheet — within a persistent shell. URL updates via shallow routing for bookmarkability.

### Game Shell Layout: Sidebar + Main Panel

- **Left sidebar (fixed ~200px):** Character portrait, name, level, specialty. HP/Mana/XP bars. Currency display (copper/silver/gold). Equipped gear summary. Current zone/location. Mini-map (grid with fog-of-war). Compass/movement controls (clickable, also responds to arrow keys).
- **Main panel (fluid):** Swappable content area for all scene types.

### Scene Types

1. **Character Creation** — pre-game flow: name entry, portrait selection (from a set of ~8-10 pre-made portraits), exam track selection, stat point allocation (10 free points across STR/INT/VIT/WIS/SPD/LCK). On completion, creates the Character record and drops the player into the starting room (Temple of Asclepius hub, grid position 0,0).
2. **Exploration** — narrative text describing the current room, visible NPCs and enemies, interactive elements, and available actions (talk, fight, examine). Exits shown as available directions.
3. **Dialogue** — NPC conversation UI. NPC speech displayed with player response options below. Extensive branching trees — players can ask questions, explore topics, and deeply learn about the historical figure.
4. **Combat** — turn-based combat UI with enemy info, combat log, and action bar.
5. **Question** — medical question screen (narrative-integrated or board-style from the Study Hall grinder).
6. **Patient Encounter** — a narrative-framed question sequence. An NPC presents a patient case, the player answers 1-3 questions about diagnosis/treatment. Correct answers advance the quest and reward XP/currency. Incorrect answers provide teaching feedback and allow retry. Used for quest step "treat patients at the Temple."
7. **Vendor** — buy/sell interface with specific vendor NPCs (not a generic shop).

## Navigation System

### Grid-Based Room Navigation

Each zone is a 2D grid of rooms. Arrow keys (or clicking the compass in the sidebar) move the player N/E/S/W.

- Each room is a self-contained data object: description text, exits (N/E/S/W booleans), NPC list, enemy encounter chance, interactable objects.
- Not every grid cell is accessible — impassable cells (walls, water, cliffs) create organic zone shapes.
- **Fog-of-war mini-map:** only rooms the player has visited are revealed. Provides a sense of exploration and discovery.
- **Random encounters:** each room has an encounter chance that can trigger enemy combat on entry.
- **Interactive elements within rooms:** examine objects, search areas, discover hidden items — adds depth within a single room.

## Combat System

### Turn-Based Combat

Player acts, then enemy acts. Speed stat determines who goes first each round.

### Core Stats

| Stat | Abbr | Effect |
|------|------|--------|
| Strength | STR | Physical damage |
| Intelligence | INT | Ability power |
| Vitality | VIT | Max HP |
| Wisdom | WIS | Max Mana |
| Speed | SPD | Turn order / initiative |
| Luck | LCK | Critical hit chance |

**Derived Stats:**
- **Attack Power (ATK)** — derived from STR + weapon bonus. Used for physical damage calculations.
- **Defense (DEF)** — derived from VIT + armor bonus. Reduces incoming physical damage.
- **Max HP** — derived from VIT (base 20 + VIT × 5).
- **Max Mana** — derived from WIS (base 10 + WIS × 3).

### Combat Actions

- **Attack** — basic physical attack based on STR and weapon.
- **Diagnose** — costs mana, triggers a medical question. Correct answer = powerful buff (e.g., +50% damage next attack) or enemy debuff. Wrong answer = wasted turn + mana.
- **Heal** — costs mana, restores HP.
- **Flee** — chance-based escape (affected by SPD).
- **Specialty Abilities** — unlocked via specialty skill trees. Unique combat skills tied to medical subspecialties.

### Medical Knowledge Integration

The "Diagnose" ability is the bridge between medical learning and combat. Answering correctly provides tangible combat advantages, making studying directly rewarding in gameplay.

## Character Progression

### Leveling

- Max level: 60
- XP earned from: answering questions, combat victories, quest completion
- Each level grants stat points to allocate

### Specialty System

1. Player starts as **Medical Student** (generic class, basic abilities)
2. Explore the world and encounter **mentor NPCs** representing different specialties
3. Complete a mentor's quest chain and prove medical knowledge to **unlock the specialty**
4. Specializing grants a **skill tree** with unique combat abilities and passive bonuses
5. At **level 40**, player can learn a **second specialty** from a different mentor (post-MVP)

#### Example Specialties

**Cardiology** (Mentor: William Harvey)
- Combat abilities: "Cardiac Arrest" (stun), "Defibrillate" (burst damage), "Hemodynamic Stabilization" (heal over time)
- Passive: +15% damage against undead

**Orthopedic Surgery** (Mentor: Hugh Owen Thomas)
- Combat abilities: "Fracture Strike" (armor break), "Bone Set" (self-heal + defense buff), "Surgical Precision" (guaranteed crit)
- Passive: +15% physical defense

### Gear

- Equipment slots: weapon, armor, accessory
- Gear provides stat bonuses (e.g., Bronze Scalpel: +5 ATK)
- Acquired from vendor NPCs or enemy drops
- Gear has: name, type, stat bonuses, buy/sell price, rarity, level requirement

### Currency

Three-tier system (WoW-style):
- **Copper** — base currency
- **Silver** — 100 copper = 1 silver
- **Gold** — 100 silver = 1 gold

Earned from: combat victories, answering questions, selling items, quest rewards.

## Question System

### Exam Track Selection

During character creation, the player selects their exam track. All questions throughout the game are filtered to that track:

- USMLE Step 1
- USMLE Step 2 CK
- USMLE Step 3
- COMLEX Level 1 / 2 / 3
- Shelf Exams (sub-selection: Medicine, Surgery, Peds, OB/GYN, Psych, etc.)
- Board Certification (with specialty selection)
- "Just Exploring" (mixed difficulty, no specific exam focus)

Players can change their exam track by visiting **The Registrar** NPC (present in every major zone hub).

### Narrative-Integrated Questions

- Triggered during gameplay: combat (Diagnose), NPC encounters, quest objectives
- Framed in narrative context (e.g., "Hippocrates presents a patient with fever and joint pain...")
- Difficulty scales to player level and zone
- Rewards: combat buffs, quest progression, XP, currency

### Question Grinder (Study Hall)

- Dedicated menu — pure board-prep mode
- UWorld-style: clinical vignette → stem question → 5 answer choices
- Full explanation after answering (correct answer reasoning + distractor explanations)
- Rewards: XP and copper
- Filterable by: topic, difficulty
- Tracks stats: accuracy by topic, streak, total answered

### Question Data

- Seeded with curated, verified questions
- Supplemented with AI-generated questions (post-MVP), flagged for review
- Each question: category, subcategory, exam track tags, difficulty, vignette, stem, choices, correct answer, explanation, source flag

## NPC System

### NPC Roles

- **Mentor** — teaches medical knowledge, provides specialty quest chains, unlocks abilities
- **Vendor** — specific characters who sell gear/items for currency
- **The Registrar** — exam track selection/change (present in every zone hub)
- **Quest-Giver** — assigns quests and rewards completion

### Dialogue System

Extensive branching dialogue trees stored as structured JSON. Each dialogue node contains:
- NPC text
- Player response options
- Branch conditions (e.g., "only show if quest X is complete")
- Teaching content woven into natural conversation

Players should feel like they're having a real conversation with a historical figure — able to ask about their life, experiments, discoveries, and why their work mattered. This is educational-first dialogue, not just quest delivery.

## MVP Scope: Ancient Greece Zone

### What Ships First

**Character Creation:**
- Name, portrait selection, exam track, stat allocation

**Zone: Ancient Greece (~500-300 BCE)**
- ~15-20 rooms on a grid
- 5 key locations: Temple of Asclepius (hub), Hippocrates' School on Kos, The Agora (marketplace), The Gymnasium (combat training), The Sacred Grove (harder area, boss)

**NPCs (3-4):**
- Hippocrates — primary mentor/quest-giver, extensive dialogue about observation-based medicine, the Hippocratic Oath, humoralism
- Asclepius Priest — vendor, sells basic potions and gear
- The Registrar — exam track management
- Herophilus — secondary mentor, recently arrived from Alexandria. Teaches systematic dissection and anatomy. Gateway to Surgery specialty. (Historically ~300 BCE Ptolemaic Alexandria; presented as a visiting scholar to acknowledge the timeline overlap.)

**Combat:**
- 4-5 enemy types: Temple Guardians (undead), Plague Spirits, Miasma Wraiths, plus variants
- 1 boss: The Plague of Athens (requires Diagnose ability to weaken)
- Core actions: Attack, Diagnose, Heal, Flee

**Questions:**
- ~50 curated medical questions
- Study Hall (Question Grinder) mode

**Systems:**
- Inventory and gear (5-10 items)
- Copper/silver/gold currency
- Account creation and save (PostgreSQL via Supabase)
- One unlockable specialty as proof of concept

**Quest Line:**
1. Arrive at Temple of Asclepius, meet Hippocrates
2. Hippocrates teaches observation-based medicine vs supernatural belief
3. Treat patients at the Temple (question encounters)
4. Combat encounters in the Gymnasium and Sacred Grove
5. Investigate a mysterious illness in the Agora
6. Face the Plague of Athens boss
7. Completing the zone unlocks travel to next era (future expansion)

### Deferred to Post-MVP

- Additional zones/eras
- AI-generated questions
- Multiple specialties and full skill trees
- Second specialty at level 40
- AI NPC conversations
- Leaderboards, social features
- Mobile optimization

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Next.js (App Router) |
| State Management | Zustand |
| Database | PostgreSQL (Supabase) |
| Auth | NextAuth.js (email/password) |
| Styling | Tailwind CSS |
| Deployment | Vercel |

## Data Models

- **User** — auth credentials, settings, exam track
- **Character** — name, level, stats (STR/INT/VIT/WIS/SPD/LCK), XP, currency, current zone, grid position, specialty, second specialty
- **Inventory** — items owned, equipped slots (weapon, armor, accessory)
- **Item** — name, type, stat bonuses, buy/sell price, rarity, level requirement
- **Zone** — name, era, grid dimensions, description
- **Room** — zone ref, x/y position, description, exits (N/E/S/W), NPC list, encounter chance, interactables, is_hub flag (hub rooms contain The Registrar and serve as zone entry points)
- **NPC** — name, historical figure flag, zone/room location, role, dialogue tree ID
- **DialogueTree** — structured JSON: nodes with text, choices, branches, conditions
- **Enemy** — name, stats, loot table, level, type, zone
- **Question** — exam track tags, category, difficulty, vignette, stem, choices, correct answer, explanation, source, verified flag
- **PlayerQuest** — active/completed quests per character
- **PlayerSkill** — specialty skill trees, unlocked abilities
- **QuestionHistory** — per-player question records (answer, correct/incorrect, timestamp)
- **PlayerRoomVisit** — character ref, room ref, visited_at timestamp. Powers the fog-of-war mini-map persistence across sessions.

## Save System

Game state auto-saves to the database on:
- Room transitions (entering a new room)
- Combat resolution (victory or flee)
- Question answers (both narrative and Study Hall)
- Inventory changes (buy, sell, equip)
- Quest state changes

If a player closes the browser mid-combat, they resume at the last room they entered (combat resets). Mid-dialogue, they resume at the room with the NPC available to talk to again.

## MVP Specialty Unlock

The MVP includes one unlockable specialty: **Surgery**, mentored by Herophilus. Unlock criteria:
1. Complete Hippocrates' main quest chain (steps 1-5)
2. Discover Herophilus in the Sacred Grove
3. Complete Herophilus' teaching dialogue (learn about systematic dissection)
4. Pass a 5-question anatomy assessment (must answer 4/5 correctly)
5. On unlock: gain Surgery skill tree with 2 starter abilities — "Surgical Strike" (high single-target damage, costs mana) and "Triage" (heal + remove one debuff)

## Project Location

`/Users/jasongusdorf/CodingProjects/Claude/mediquest/`

Separate from the WoM project.
