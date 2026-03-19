# WoM Comprehensive Game Depth Review — Design Spec

**Date:** 2026-03-18
**Status:** Draft
**Scope:** Full vision review — gameplay, world, progression, connective tissue, medical content integration
**Out of scope:** Combat engine (handled separately), instanced dungeon/raid systems

---

## Vision Statement

WoM should feel like logging into Classic WoW for the first time — a world that exists with or without you, that rewards curiosity, that makes you care about your character's place in it, and that happens to teach you medicine along the way. Game experience comes first. Medical content is the unique differentiator, not the primary obligation.

## Core Problem Diagnosis

WoM has *systems* but not *a game*. Five root causes:

1. **No sense of journey.** 468 quests exist, but they're tasks, not stories. Quest objectives are mechanical (6 types: answer_correct, defeat_npc, reach_level, etc.) with no narrative wrapper making players care *why*.

2. **Zones are backgrounds, not places.** 36 zones is substantial, but if every zone is "tile map + enemies + quest givers," they're differently-themed combat arenas. Zone identity comes from *what happens there*, not what it looks like.

3. **Systems don't feed each other.** Combat, quizzes, quests, gear, and progression exist in parallel lanes. In Classic WoW, every system was a node in a web. WoM's systems are more like a list.

4. **No aspirational endgame.** Hitting level 80 should be the beginning, not the end. WoM has PvP with ELO but lacks structured endgame progression loops that create long-term retention.

5. **No "I wonder what's over there."** The world is deterministic and readable at a glance. No surprises, no secrets, no emergent discovery.

---

## Section 1: The First Hour (Level 1-10)

The new player experience. This is where WoM lives or dies.

### Class-Specific Starting Experiences

Not 8 separate starting zones (too much content), but 2-3 starting zones with class-specific quest chains woven in.

- A Guardian's first 10 levels should feel different from a Shade's
- The Guardian gets a quest from a drill sergeant NPC to hold the line against waves — teaching them they're a tank
- The Shade gets a quest to eliminate a target with burst damage — teaching them they're about precision and timing
- Same zone, different story

### Mentor NPC

Each class gets a recurring NPC mentor — a historical medical figure who practiced medicine in a way that maps to the class fantasy.

- Gives you your first abilities
- Sends you on your class quest chain
- Reappears at key milestones throughout the game (levels 10, 20, 30, 40, 60, 80)
- They're *your* connection to the world

### Breadcrumb to the Wider World

By level 10, a quest physically leads you to the border of your starting zone and points you toward the next one. Not a menu. Not a world map teleport. A quest: "take this message to Dr. [someone] in [next zone]" — and when you arrive, that NPC has a quest chain waiting.

### Teach Through Play

- First combat encounter: unloseable, teaches auto-attacks
- Second encounter: teaches your first ability
- First quiz encounter: framed as a patient presenting symptoms to your mentor — not an abstract multiple-choice screen
- By level 10, the player should understand combat, quizzes, gear, and quests without a single tooltip wall

### The "Moment"

Every starting experience needs one — the moment a player realizes they're in a bigger world.

- A vista, a reveal, a boss fight that's actually hard
- Something at level 8-10 that makes the player think "oh, this is a real game"
- WoM's equivalent of Classic WoW's Stormwind gates or seeing Teldrassil below you

---

## Section 2: The Journey (Level 10-40)

The bulk of the game. Where habits form, class identity deepens, and the world proves it has substance.

### Zone Central Conflicts

Every zone needs a medical-historical conflict that drives its quest chain:

- A plague zone where you're racing to identify the pathogen before it spreads (epidemiology)
- A warfront where battlefield surgery techniques are being discovered under fire
- A port city where competing medical traditions (humoral, herbal, surgical) clash
- A cursed temple where ancient anatomical knowledge was sealed away

The medical content isn't bolted on — it *is* the story.

### Zone Quest Chain Arcs

Every zone quest chain follows a 3-act structure:

1. **Arrive & discover** — Learn what's wrong here (2-3 intro quests)
2. **Investigate & escalate** — The problem is worse than it seemed (3-4 quests, introducing zone elite enemies)
3. **Climax** — A zone-ending boss or event that resolves the story and breadcrumbs you to the next zone

### Class Quests Every 10 Levels

| Level | Class Quest |
|-------|-------------|
| 10 | First signature ability (earned through narrative, not just unlocked) |
| 20 | A trial that tests role understanding (tank a gauntlet, heal an escort, burst a fleeing target) |
| 30 | A quest that spans multiple zones and requires group play |
| 40 | Specialization quest — choose your spec through narrative choice, not a menu |

### Elite Quests and Group Signals

By level 15-20, some quests should clearly require a group:

- Elite NPCs guarding quest objectives
- Caves with enemy density too high to solo
- Teaches players that grouping is part of the game
- Gives purpose to the existing party system

### Gear Gates

Predictable difficulty spikes around levels 15, 25, 35 where enemies are noticeably harder. The solution: equip the rewards earned or seek upgrades. Makes the gear system *feel* meaningful rather than just stat bumps.

### Zone Gameplay Variety

Some zones should change how you play:

- A zone with environmental hazards (poison clouds, collapsing terrain) forcing movement
- A zone where you're the healer, keeping NPC allies alive through a campaign
- A zone with a reputation faction whose quests unlock a unique vendor
- A zone with a mystery — clues scattered across the map, no quest markers, just investigation

---

## Section 3: The Crucible (Level 40-80)

Where the game earns its depth. Casual players become invested players.

### Spec Identity

After the level 40 spec quest, three specs per class should play *dramatically* differently:

- Different rotations, different strengths, different roles in group content
- A Guardian tank spec: unkillable but slow
- A Guardian DPS spec: hits hard but needs a healer
- The 168 talents (7 tiers × 3 specs × 8 classes) must deliver on build diversity

### Zone Difficulty Forces Engagement

Level 40-60 zones should punish autopilot:

- Enemies use abilities requiring player response — interrupts, dispels, kiting, cooldown management
- If a player has been mashing the same 3 buttons since level 10, a level 45 zone should break that habit
- World design must *demand* combat mastery

### Reputation Factions

4-6 factions tied to medical traditions or organizations:

- **Home zone** with daily quests
- **Reputation track:** Neutral → Friendly → Honored → Revered → Exalted
- **Tiered rewards:** cosmetics (Friendly), gear (Honored), recipes/abilities (Revered), title (Exalted)
- **Competing philosophies** (e.g., evidence-based vs. traditional medicine). Players can eventually max all factions but not simultaneously — time-gated, not mutually exclusive. Creates prioritization choices, not permanent lockouts

### World Events

Periodic zone-wide events that change zone state temporarily:

- A plague outbreak adding infected NPCs and emergency quests for 48 hours
- A medical conference where rare vendors and quest givers appear in a hub city
- A PvP territory war where factions contest a zone, changing vendor/path control

These make the world feel alive — things happen whether you're logged in or not.

### The Level 60 Gate

A capstone quest chain testing everything learned — combat, medical knowledge, class mastery. Completing it unlocks final-tier zones (60-80) and signals readiness for endgame.

### Death Penalty Scaling

| Level Range | Penalty |
|-------------|---------|
| 1-20 | Respawn at zone entrance, no penalty (learning phase) |
| 20-40 | Respawn at zone entrance, minor copper loss (5% carried) |
| 40-60 | Corpse run, gear durability damage |
| 60-80 | Corpse run, durability damage, temporary stat debuff (2 min) |

---

## Section 4: Endgame (Level 80)

### PvP Seasons

- Seasons last 8-12 weeks
- End-of-season rewards based on rating brackets (gear, titles, cosmetics)
- Seasonal arena with rotating rulesets (no healing, restricted abilities, class-specific bans)
- Ranked and unranked queues

### Endgame Progression Loop

- Reputation factions provide daily quest content at max level
- World events provide periodic engagement hooks
- PvP seasons provide competitive long-term goals
- World bosses (rare, outdoor, contestable) provide aspirational PvE targets
- Weekly and daily reset cadences create login reasons

---

## Section 5: Making the World Feel Alive

### Environmental Effects

- Swamp zone: slow debuff unless countered with gear/consumable
- Mountain zone: thin air reduces stamina regen
- Plague zone: poison ticks in certain areas
- Not punishments — the zone *being* something

### Zone-Specific Enemy Behavior

- Forest wolves hunt in packs (pulling one aggros nearby)
- Port city bandits flee at low health and bring reinforcements
- Plague zone undead never flee
- Enemy behavior tells you where you are without checking the zone name

### Ambient Life

NPCs that aren't quest givers or enemies:
- Merchants walking trade routes
- Students arguing about medical theories
- A surgeon practicing on a cadaver
- Background characters making the world feel populated

### Discovery and Secrets

- **Hidden areas.** Caves behind waterfalls, locked chests requiring keys from other zones, rare NPCs appearing at certain times
- **Rare spawns.** Named elites with infrequent spawns, unique loot, and their own lore. Finding one should feel like an event
- **Environmental storytelling.** Destroyed camps with journals, trails of bloodstains leading to hidden bosses, locked doors that can't open until 30 levels later
- **Zone mail.** After completing a zone storyline, receive a letter days later from an NPC you helped — update on what happened, sometimes a follow-up quest

### World State and Consequence

- **Quest consequences.** Curing a plague clears the clouds. Driving out bandits opens a trade route and spawns a new vendor
- **Reputation visibility.** Revered faction NPCs greet you differently. Guards salute. Vendors give discounts. Hostile factions attack on sight
- **Other players' presence.** Guild tags, titles, gear visible. High-level players in low-level zones tell a story about endgame

---

## Section 6: Connective Tissue

### Quest-Gear-Progression Web

- **Quests unlock quests.** Zone A's finale gives a letter of introduction to Zone B. Zone B reveals a clue sending you back to a hidden area in Zone A
- **Gear unlocks exploration.** Fire-resist cloak → volcanic zone inner area. Plague mask → quarantine district without poison ticks. Gear as *keys* to the world
- **Medical knowledge unlocks content.** High pharmacology accuracy → craft antidotes. Anatomy knowledge → dialogue option that skips a combat encounter

### Economy Loop

- **Repair costs.** Gear degrades. Higher-tier = more expensive repairs. Steady copper drain
- **Trainer costs.** Key abilities at levels 20, 40, 60 cost meaningful copper. Creates saving goals
- **Consumables.** Potions, food buffs, antidotes, resistance elixirs. Meaningful for hard content
- **Professions connection.** Medical specialty professions (the existing specialization tracking system) serve as the professions system. Gathering medical knowledge in zones → craft consumables/gear based on specialty mastery → sell or use. Specialty-gated crafting in dangerous areas = risk/reward

### Ability Acquisition as Adventure

- **Discoverable abilities** require quests — a chain, a hidden trainer in a remote zone, a drop from a rare spawn. Getting your best ability should be a story
- **Talent respec cost.** Increasing copper cost per respec. Makes spec choice meaningful

### Social-Progression Loop

- **Guild perks.** Group content together → guild XP → guild levels → shared perks (bonus XP, reduced repairs, guild vendor)
- **Mentorship.** High-level players mentor low-level. Mentor gets daily bonus; mentee gets stat buff while grouped. Solves level range matching, gives endgame reason to revisit content
- **Leaderboard variety.** Zone completion, quiz accuracy by category, rare spawn kills, collection completion. Different player types get something to chase

---

## Section 7: Medical Content Integration

### Core Principle

Medical knowledge is a player skill, like combat. Not "answer questions to earn XP" (that's a study app) — knowledge creates tangible in-world advantages.

### Patient Encounters

Some encounters are medical cases, not combat:

- Injured NPC on the road: diagnose correctly → heal + XP/reputation. Incorrectly → worsens, can retry with diminished reward
- Sick village quest chain: interview NPCs (symptom quizzes), identify source (transmission quiz), prescribe treatment (pharmacology quiz). The whole quest *is* the medical content, but feels like detective work

### Diagnosis as Combat Mechanic

During boss/elite fights, a "diagnosis phase" can appear:

- Boss exhibits symptoms
- Correct identification → party damage buff or revealed weakness
- Wrong answer → fight without the advantage
- Medical content woven into action, not a separate screen

### Medical Specialization Tracks

Track player accuracy by medical category. High scores grant gameplay bonuses:

| Specialty | Gameplay Bonus |
|-----------|---------------|
| Pharmacology | Craft better potions/consumables |
| Anatomy | Improved critical strike chance |
| Pathology | Resistance to disease-type debuffs |
| Surgery | Bonus damage against humanoid enemies |
| Epidemiology | Reduced environmental hazard effects |

### Socratic NPCs

225+ historical medical figures should *teach*, not just dispense quests:

- A surgeon NPC quizzes on surgical topics framed as mentorship
- Correct answers build rapport → deeper dialogue, lore, unique rewards
- Wrong answers trigger explanation + spaced repetition. Game teaches through failure, not gatekeeping

### Quiz Difficulty Scaling

- Tier 1 zones: Step 1 questions
- Tier 3 zones: Step 2 questions
- Endgame content: Step 3 questions
- Difficulty curve mirrors the game's difficulty curve

### The Key Constraint

Medical content should never *block* progress entirely. A player great at combat but weak on quizzes can still advance — they miss bonuses, take harder fights, and lack knowledge advantages. The game rewards knowledge without punishing ignorance.

---

## Section 8: Progression Feel

### Milestone Levels

| Level | Milestone |
|-------|-----------|
| 10 | Class quest → first signature ability, mentor introduction |
| 20 | Class trial, first group-difficulty content |
| 30 | First reputation faction access, meaningful ability unlocks |
| 40 | Specialization quest → choose spec through narrative |
| 50 | Second reputation faction, world events available |
| 60 | Capstone quest chain — the "you've made it" moment |
| 70 | Final tier zones open, endgame prep |
| 80 | Endgame unlocks — PvP seasons, reputation endgame, world bosses |

Between milestones: every 2-3 levels should bring *something* — new ability, talent tier, zone access, gear tier. Never more than 30 minutes of play without a tangible reward.

### Gear Feel

- **Rarity pacing.** Common → Uncommon every few zones. Rare items are zone-climax rewards or lucky drops. Legendary is endgame only
- **Named items with lore.** Not "Uncommon Sword +2" — "Lister's Scalpel: The blade that proved antisepsis." Items tell stories
- **Visual feedback.** Equipping a new weapon changes character appearance. Gear upgrades should be visible

### Session Retention Hooks

- **Quest chain momentum.** Each quest ends with a hook — cliffhanger, revelation, new location. "I'll just do one more quest"
- **Streak bonuses.** Consecutive correct quiz answers build a multiplier for XP, copper, drop rates. Breaking stings. Maintaining feels powerful
- **Collection tracking.** Visible progress bars for zone completion, NPC rapport, rare items, medical specialty mastery
- **Daily login reasons.** Daily mentor quest, rotating rare spawn, reputation daily. Actual content that resets, not a popup

---

## Summary: Design Priorities

Ordered by impact on the "this feels like a real game" factor:

1. **Zone quest chain arcs** — Transform quests from checklists to stories with 3-act structure
2. **Class quest milestones** — Milestone events at levels 10/20/30/40/60 that define class identity
3. **Medical content as gameplay** — Patient encounters, diagnosis mechanics, specialty tracks
4. **World aliveness** — Environmental effects, ambient life, discovery, consequences
5. **Connective tissue** — Systems feeding each other: gear-as-keys, knowledge-as-stat, economy loop
6. **Mentor NPC system** — Recurring class mentor as the player's anchor to the world
7. **Reputation factions** — Long-term progression hooks with meaningful rewards
8. **Progression feel** — Named loot, milestone events, streak bonuses, collection tracking
9. **Death penalty scaling** — Stakes that increase with level
10. **World events** — Periodic state changes that make the world dynamic
11. **Social hooks** — Guild perks, mentorship, leaderboard variety
12. **Endgame loops** — PvP seasons, world bosses, daily/weekly reset cadence
