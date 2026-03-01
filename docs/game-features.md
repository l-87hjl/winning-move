# Game Features Tracker

## Implemented

### Core simulation
- Multi-faction geopolitical turn simulation (5 factions, AI or human).
- Era presets (1939, 1984, 2026) with region variants and era-specific doctrines.
  Canonical data in `src/data/eras.js` (`window.GameData.ERA_PRESETS`).
- Human interactive mode and AI-only/observer/batch modes.

### Game modes and scenario types
- 5 game modes (Standard, Cold War Deterrence, Multipolar Adaptive,
  Post-Human Emergence, Payne Escalation Model) with per-mode setting overlays.
- 5 scenario type presets bundling era + game mode for narrative convenience.
  Canonical data in `src/data/game-modes.js`.

### Action system
- 12 actions: Military Pressure, Economic Capture, Puppet Regime, Support
  Sovereignty, Dialogue Summit, Invest in Technology, Expand Nuclear Stockpile,
  Secret Stockpile Build, Disarmament Deal, Deploy Nuclear Triad, Nuclear
  Strike, Instigate Revolution.
- Action affordability checks and AI utility scoring with 15+ weighted factors.
- Rebalanced economy loops to avoid early-game resource deadlocks.

### Resource type system (new v1.04)
- 8 resource types per region: Oil, Grain, Minerals, Water, Tech Hub,
  Rare Earth, Forest, Maritime.
- Three harvest/regeneration behaviours:
  - **Renewable** (water, maritime): recovers to full each turn.
  - **Annual / conditional** (grain, forest, tech, oil): partial recovery;
    requires investment/replanting logic for full restoration.
  - **One-time** (minerals, rare earth): near-zero regeneration; extracted
    value is essentially permanent.
- Per-region resource assignments in `src/data/resources.js`.
- Resource-type yield multipliers applied to economy regeneration each turn.
- Resource icons displayed on the first tile of each map region.
- `maxResourceValue` field enables region recovery after fallout depletion.

### Escalation & paradigm
- Escalation ladder (`conventional`, `limitedNuclear`, `fullExchange`).
- DEFCON 1–5 tracking and global tone changes.
- Post-human AI emergence pipeline.
- Paradigm endings: mutualCollapse (≥ turn 10), stalemate (≥ turn 12,
  stability < 0.22), noWinCondition, aiEmergence.

### Political and domestic systems
- Public opinion, economic stress, legitimacy, war fatigue, democracy/
  corporatism drift.
- Threat/grievance/trust memory between factions.
- Cognitive index (reflection, regret, restraint, aggression momentum).

### Territory systems
- Region ownership and transfer.
- Contested and neutral governance handling.
- Continent influence calculated by grid-square count.
- Continent playoffs via Tic-Tac-Toe showdown.
- Victory requires controlling ≥ 3 continents OR ≥ 55 % of all regions.

### Tic-Tac-Toe (TTT) showdown and gambling
- Human-facing TTT board with wagerable political points.
- 3 perks: Double Turn, Intel Surge, Stability Shield.
- Automated revolution and continent showdowns for AI vs AI.
- Gamble interface: input wager, choose perk, play stake round.
- Mini live-feed board in the "Live Showdown Feed" panel.

### Map and continent grid
- 7 continents × 25 regions (era-specific naming variants).
- Larger, geographically-shaped continent masks (8×10 for NA, 10×5 for SA,
  8×10 for Asia, etc.).
- Per-continent inset accent borders for visual grouping.
- Resource type icons on the first tile of each region.
- Continent name labels in the map grid.
- Strike arc SVG overlay for attack visualisations.
- Map overlay recolouring by faction colour, contested (amber), neutral (slate).

### Reporting & debugging
- JSON report export with scenario/game stats and full log.
- Structured debug log with turn-by-turn snapshots.

### Documentation
- `CLAUDE.md` — agent session standards (changelog, features, issues, README).
- `docs/PERSISTENT_ISSUES.md` — ongoing bug/design-tension tracker.
- `docs/CHANGELOG.md` — PR/session history.
- `docs/game-log-spec.md` — log format reference.

## Desired / Next

1. **Resource depletion UI indicator**
   - Show depleted (grey-tinted) tiles when resourceValue < 50 % of max.
   - Tooltip should indicate remaining %, regenRate, and turns to full recovery.

2. **Escalation branch depth**
   - Explicit retaliation doctrines, limited-exchange targeting, surrender
     offer/accept flow, collapse branch outcomes.

3. **Economic model richness**
   - Upkeep/supply lines, sanctions, infrastructure repair/aid loops.
   - Resource-type-specific trade actions (e.g., oil embargo, grain blockade).

4. **Victory clarity**
   - Continent-victory and mixed-victory summaries in the endgame report.
   - Show which continents are controlled per faction in the faction table.

5. **Tone model refinement**
   - Weight global tone by cumulative casualties, infrastructure damage, and
     escalation recency (e.g., recent nuke = maintain "critical" for 3 turns).

6. **Internal politics events**
   - Coups, elections, protests, and elite fragmentation triggered by domestic
     metrics crossing thresholds.

7. **AI strategic branching**
   - Threat memory effects on alliance behavior and deterrence policy switching.
   - Faction-specific strategic archetypes beyond the current ideology bias.

8. **Full module migration**
   - Replace `game.js` inline `regenerateFactionEconomies` and
     `applyDomesticPressure` with calls to `window.GameEngine.*`.
   - Replace inline ERA_PRESETS / GAME_MODES / SCENARIO_SETTINGS in `game.js`
     with reads from `window.GameData.*`.

9. **Scenario type selector in UI**
   - Surface `SCENARIO_TYPES` from `game-modes.js` as a dropdown that
     auto-populates era and game-mode selectors.
