# Persistent Issues & Design Tensions

Issues identified during audit that require ongoing attention or may resurface.
Each entry includes root-cause analysis and a suggested resolution path.

---

## [2026-03-01] Premature game endings in turns 1–9

**Symptom:** Games would end as early as turn 1 under certain conditions.

**Root causes identified:**
1. `stalemate` paradigm state had no turn minimum — any global stability dip
   below 0.28 (reachable via several nuclear exchanges) triggered immediate
   game over.
2. `mutualCollapse` paradigm triggered the moment any nuclear weapon was fired
   when `sharedCollapseEnabled` was checked — no turn guard.
3. `MIN_TURNS_BEFORE_VICTORY_CHECK = 5` allowed continent victories in turns 5–7
   when a faction rapidly captured two small continents (Middle East + Oceania
   each have only 2 regions).

**Fixes applied (PR #4):**
- `MIN_TURNS_BEFORE_VICTORY_CHECK` raised from 5 to 8.
- Stalemate: threshold lowered to 0.22, minimum turn 12.
- `mutualCollapse`: minimum turn 10.
- Continent victory: now requires ≥ 3 controlled continents (was 2).
- `victory.js`: paradigm endings gated by individual constants
  `MIN_TURNS_MUTUAL_COLLAPSE = 10`, `MIN_TURNS_STALEMATE = 15`.

**Residual risk:** If a player manually enables `sharedCollapseEnabled` AND
fires nukes repeatedly in turns 10–14, mutualCollapse can still trigger before
factions have diversified economically. Consider raising
`MIN_TURNS_MUTUAL_COLLAPSE` further if this remains an issue.

---

## [2026-03-01] Economy module duplication

**Symptom:** `regenerateFactionEconomies` and `applyDomesticPressure` exist
both in `game.js` (original) and `src/engine/economy.js` (new module).

**Status:** Partial. `game.js` still owns the canonical versions (they
reference closured state/log). `economy.js` is a clean reference
implementation for future full migration.

**Resolution path:** When refactoring `game.js` to pass `state` explicitly
rather than via closure, replace the inline versions with calls to
`window.GameEngine.regenerateFactionEconomies({ state, clamp })` and
`window.GameEngine.applyDomesticPressure({ state, clamp, ... })`.

---

## [2026-03-01] Data constants duplicated between game.js and src/data/

**Symptom:** `ERA_PRESETS`, `CONTINENT_MASKS`, `ERA_REGION_MAPS`,
`GAME_MODES`, `SCENARIO_SETTINGS` appear in both `game.js` (original) and
the new `src/data/eras.js` / `src/data/game-modes.js` modules.

**Status:** Partial migration. `game.js` still reads its own inline copies.
New modules export via `window.GameData.*` for future consumers.

**Resolution path:** For each constant, add a fallback in `game.js`:
```javascript
const ERA_PRESETS = window.GameData?.ERA_PRESETS || { /* inline */ };
```
Then remove the inline version once tests confirm the data module is loaded.

---

## [2026-03-01] Continent label overlap with region tiles

**Symptom:** Continent name labels rendered as grid items may visually
overlap with faction-coloured region tiles when many regions are present.

**Status:** Labels use `z-index: 3` and `opacity: 0.45` to remain readable
without obscuring gameplay. Full solution requires a separate SVG overlay.

**Resolution path:** Render continent labels into the existing `#mapOverlay`
SVG rather than as CSS-grid children. Position based on the geometric centre
of each continent's tile cluster.

---

## [2026-03-01] TTT gamble does not deduct from both sides symmetrically

**Symptom:** In `settleTttRound`, the winner gains `effO` (opponent's wager
with ±10 % variance) but the loser loses `effX` (the winner's wager scaled
separately). Because both have independent random jitter, the exchange is
slightly non-zero-sum.

**Status:** Minor; acceptable for gameplay balance.

**Resolution path:** Either (a) compute a single shared `eff` for both sides,
or (b) explicitly document the intentional asymmetry as a house-edge mechanic.

---

## [2026-03-01] Region maxResourceValue not reset on New Game

**Symptom:** When `startGame()` rebuilds regions from `ERA_REGION_MAPS`, the
`maxResourceValue` field IS present (added to `r()` helper). However, if a
region's `resourceValue` was mutated mid-game and then a New Game is started,
the spread `{ ...r }` in `startGame` correctly resets it from the template.

**Status:** Appears correctly handled. Needs regression test.

**Resolution path:** Add a guard in `startGame` to verify
`region.resourceValue === region.maxResourceValue` for all regions after
initialisation and log a warning if not.
