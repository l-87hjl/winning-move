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

---

## [2026-03-01] Premature game endings at turns 18–25 (detectDeadlock)

**Symptom:** Under aggressive revolution or puppet strategies, regions rapidly
transition to neutral/contested, triggering `detectDeadlock` at turn 18 with
only 40% ungoverned regions — ending games well before the 60-turn limit.

**Root cause:** `detectDeadlock()` used turn > 18 and fraction > 0.40, which
was reachable in normal play through `instigateRevolution` chains.

**Fix applied (PR #5):** Threshold raised to turn ≥ 30 and fraction > 0.65.
Added a governance warning at turn ≥ 20 / fraction > 0.50 without ending the
game. This prevents premature termination while still logging a visible warning.

**Residual risk:** Very aggressive AI or human play in fast-paced WW2 eras
(high instability, low stability starting values) could still hit 65% by turn
30. If this occurs, consider making the deadlock trigger configurable or tying
it to the era's characteristic instability level.

---

## [2026-03-01] convertLandUse resource override not reflected in data module

**Symptom:** `convertLandUse()` sets `region.resourceTypeOverride.primary` to
a new resource type, but `window.GameData.computeRegionYieldMult(regionId)` only
reads from the canonical `REGION_RESOURCES` table and ignores the override.

**Root cause:** `computeRegionYieldMult` in `src/data/resources.js` does not
accept a second argument for the override; the override is only used in the
inline `regenerateFactionEconomies` in `game.js`.

**Steps to reproduce:** Start a game, select a region, execute "Convert Land
Use", observe that the tooltip still shows the old resource type.

**Suggested fix:** Modify `computeRegionYieldMult(regionId, overrideType)` in
`src/data/resources.js` to use `overrideType` when provided:
```javascript
function computeRegionYieldMult(regionId, overrideType) {
  const primary = overrideType || getPrimaryResource(regionId);
  return RESOURCE_TYPES[primary]?.yieldMult ?? 1.0;
}
```

---

## [2026-03-01] AI does not optimally value Upgrade Region / Convert Land Use

**Symptom:** AI rarely selects "Upgrade Region" or "Convert Land Use" because
the `utility()` function only adds a flat ideology-bias score for these actions
(8–10 points), which is consistently outweighed by military/economic actions.

**Root cause:** AI utility scoring is single-turn; it does not model the
compounding benefit of higher development yield over future turns (ROI).

**Suggested fix:** Add a long-term development bonus to the utility score for
regions the AI already owns, weighted by `state.scenarioSettings.futureWeighting`:
```javascript
if (action === "Upgrade Region") {
  const ownedDev = ai.regions.map(id => state.regions.find(r => r.id === id))
    .filter(Boolean)
    .reduce((acc, r) => acc + (3 - (r.development || 0)), 0);
  return baseScore + ownedDev * 2.5 * state.scenarioSettings.futureWeighting;
}
```
