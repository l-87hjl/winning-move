# Agent Documentation Standards — Winning Move

This file directs AI agents (Claude Code and any future automation) on how to
document changes to this project. Following these standards keeps the
repository audit-able and maintainable across multiple automated sessions.

---

## 1. Always update these files when you make changes

### `docs/CHANGELOG.md`
Every PR / agent session that modifies source files **must** add an entry.

Format:
```
## [PR #N] — YYYY-MM-DD
### Added
- Bullet-point list of new files, features, or capabilities.
### Changed
- What existing behaviour was altered and why.
### Fixed
- Bugs that were corrected, with a brief explanation of the root cause.
### Known Issues
- Any issues you discovered but did not fix; include enough detail for a
  future agent to reproduce and resolve them.
```

### `docs/game-features.md`
When you implement something from the **Desired / Next** list, move it to
**Implemented** with a one-line description. When you identify new desired
features during audit, add them to the **Desired / Next** list.

### `docs/PERSISTENT_ISSUES.md`
If you discover a recurring bug or design tension that you cannot fully
resolve in one session, add a dated entry with:
- Symptom observed
- Root-cause analysis (even if partial)
- Steps to reproduce
- Suggested fix or investigation path

### `README.md`
Update the version badge and feature summary whenever:
- A new game mode or era is added
- A major mechanic changes (win condition, economy, nuclear model)
- New data or engine modules are created

---

## 2. Module and file conventions

### Source organisation
```
src/
  data/          Canonical static data (eras, resources, game modes).
                 Modules attach to window.GameData.
  engine/        Stateless logic operating on the game state object.
                 Modules attach to window.GameEngine.
  game.js        UI orchestrator and main turn loop.
                 Consumes window.GameData and window.GameEngine.
  styles.css     All visual styles.
docs/
  CHANGELOG.md           PR/session history.
  game-features.md       Feature tracking (implemented vs. desired).
  PERSISTENT_ISSUES.md   Known bugs and design tensions.
  game-log-spec.md       Log format reference.
CLAUDE.md                This file — agent documentation standards.
README.md                User-facing project overview.
```

### Adding a new engine module
1. Create `src/engine/<name>.js` using the IIFE pattern:
   ```javascript
   (function init<Name>Module(global) {
     const engine = (global.GameEngine = global.GameEngine || {});
     // ... pure functions that accept state as a parameter ...
     engine.myFunction = myFunction;
   })(window);
   ```
2. Add a `<script src="src/engine/<name>.js">` tag to `index.html` **before**
   `src/game.js`.
3. Document the module's public API in `docs/game-features.md`.

### Adding a new data module
1. Create `src/data/<name>.js` using the IIFE pattern:
   ```javascript
   (function init<Name>Module(global) {
     const data = (global.GameData = global.GameData || {});
     // ... constant tables and pure helper functions ...
     data.MY_TABLE = MY_TABLE;
   })(window);
   ```
2. Add the script tag in `index.html` **before** engine and game scripts.
3. If the new data supersedes something already defined inline in `game.js`,
   update `game.js` to reference `window.GameData.<key>` with a fallback to
   the old inline value so nothing breaks.

---

## 3. Era, game mode, and scenario type discipline

- **Era** (`src/data/eras.js`): defines world-condition multipliers (tech boost,
  diplomacy boost, nuclear norm, doctrine label) and the region map layout.
  Do not hard-code era-specific values in `game.js`; always read from
  `window.GameData.ERA_PRESETS[state.era]`.

- **Game Mode** (`src/data/game-modes.js`): defines a named overlay of
  `SCENARIO_SETTINGS` values. A game mode must never contain region or
  faction data — it only adjusts simulation parameters.

- **Scenario Type** (`src/data/game-modes.js → SCENARIO_TYPES`): a
  higher-level narrative preset that bundles an era + game mode + optional
  setting overrides. When adding a new narrative scenario, add it here,
  not as a branch inside `game.js`.

- **Execution Mode** (observer / interactive / aiOnly / batch): controls
  rendering speed and human-player availability. Do not conflate this with
  game mode or scenario type.

---

## 4. Resource type discipline

Resource data lives in `src/data/resources.js` (attached to `window.GameData`).
When adding or changing a resource type:
1. Add/update its entry in `RESOURCE_TYPES` with all required fields
   (`label`, `icon`, `color`, `harvestType`, `regenRate`, `yieldMult`, `desc`).
2. Update `REGION_RESOURCES` if the new type should be assigned to regions.
3. Verify that `computeRegionYieldMult` and `computeTileRegenRate` return
   sensible values for the new type.
4. Document the harvest-type semantics (renewable / annual / conditional /
   one-time) in `docs/game-features.md`.

---

## 5. Victory and game-ending conditions

Victory condition logic lives in `src/engine/victory.js`. When touching it:
- Keep `MIN_TURNS_MUTUAL_COLLAPSE` ≥ 10 and `MIN_TURNS_STALEMATE` ≥ 15 to
  prevent sub-10-turn endings.
- `MIN_TURNS_BEFORE_VICTORY_CHECK` in `game.js` must be ≥ 8.
- Territory victory threshold (default 0.55) should not be lowered below 0.5
  without documenting the rationale.
- Continent victory requires **3 or more** controlled continents so small
  two-region continents (Middle East, Oceania) cannot be trivially captured
  for an instant win.

---

## 6. Commit message conventions

```
<type>(<scope>): <short summary>

<optional body: what changed and why>
```

Types: `feat`, `fix`, `refactor`, `docs`, `chore`, `test`
Scope examples: `victory`, `economy`, `map`, `eras`, `resources`, `ttt`, `ui`

Example:
```
fix(victory): add turn guards to stalemate and mutualCollapse endings

Stalemate now requires turn >= 15 and stability < 0.22 (was 0.28).
MutualCollapse requires turn >= 10. This prevents sub-8-turn game
endings caused by early nuclear exchanges or brief stability dips.
```

---

## 7. Audit checklist

When performing a code audit, check each of the following and note findings
in `docs/PERSISTENT_ISSUES.md`:

- [ ] No data constants duplicated between `src/data/` modules and `game.js`.
- [ ] All new functions reference `window.GameData` / `window.GameEngine`
      rather than hard-coding values.
- [ ] Victory check minimum turns are enforced.
- [ ] `MIN_TURNS_BEFORE_VICTORY_CHECK` ≥ 8 in `game.js`.
- [ ] Continent win requires ≥ 3 continents in `victory.js`.
- [ ] Stalemate threshold ≤ 0.22 and minimum turn ≥ 12 in `paradigm.js`.
- [ ] `maxResourceValue` is set on all regions at game start.
- [ ] Resource regeneration runs per turn without compounding errors.
- [ ] No script tag in `index.html` references a file that does not exist.
- [ ] All IIFE modules end with `})(window);`.
