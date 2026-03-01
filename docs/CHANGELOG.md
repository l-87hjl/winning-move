# Changelog

All notable changes to this project are documented here.

## [PR #5] — 2026-03-01
### Added
- `README_AI.md` — general AI agent documentation standards (migrated from
  `CLAUDE.md`); covers changelog/feature/issue obligations, module conventions,
  era/resource/tile-development/rebellion discipline, and audit checklist.
- `docs/graphics-spec.md` — asset specification: file structure under
  `graphics/`, tile dimensions (14×14 px), resource icon format (SVG preferred),
  background textures (WebP, ≤80 KB), naming conventions, colour palette, and
  tile development badge spec.
- **8 new eras** in `src/data/eras.js` and `src/game.js`:
  - 1936 — Pre-WW2: Rearmament & Appeasement (quarterly turns)
  - 1939 — Early WW2: Blitzkrieg & Fall of France (monthly)
  - 1942 — Middle WW2: Global Turning Point (monthly)
  - 1944 — Late WW2: Liberation Drives (monthly)
  - 1946 — Post-War Reconstruction (quarterly)
  - 1950 — Korean War / Cold War Onset (monthly)
  - 1984 — Cold War (quarterly, pre-existing, now with `timeScale`)
  - 2026 — Multipolar (monthly, pre-existing, now with `timeScale`)
  Each era has `timeScale`, `startYear`, and `startMonth` fields.
- `<optgroup>` era picker in `index.html` grouping eras by Modern / Cold War
  / WW2 / Post-War.
- **Max Turns** number input in setup panel (range 20–300, default 60).
- **Simulated date display** in the turn-info bar: month/year (or Q/year for
  quarterly eras, year for annual eras); advances each turn via
  `advanceSimulatedDate()`.
- **Tile development system**: each region has a `development` level (0–3:
  Undeveloped / Basic / Developed / Industrial). Higher levels apply a yield
  multiplier (×1.00 / ×1.20 / ×1.45 / ×1.75). Development badge (`▪ ■ ◆`)
  shown on the first tile of upgraded regions.
- **"Upgrade Region"** action: controlling faction spends resources to raise
  a region's development level; contested regions cannot be upgraded.
- **"Convert Land Use"** action: converts a region's primary resource type
  (e.g., Forest → Grain) with a redevelopment penalty (development drops one
  tier, instability spikes, resource yield temporarily reduced by 30%).
- **Rebellion resource diversion**: contested regions divert 40 % of their
  yield (scaled by rebellion intensity) away from the controlling faction and
  credit the revolution instigator instead.
- `DEV_LEVEL_LABELS`, `DEV_YIELD_MULT`, `DEV_UPGRADE_COST_MULT` constants in
  `game.js` for tile development logic.
- `applyRebellionResourceDiversion()` helper in `game.js`.
- CSS classes `.tile-dev-1/2/3` and `.tile-dev-badge` for development badges.
- Semi-transparent log panel (`rgba(17,24,39,0.72)`) with `backdrop-filter: blur`
  so the map remains partially visible behind the Strategic Log.

### Changed
- `CLAUDE.md` updated to be Claude Code–specific (branch/git discipline,
  parallel tool-call conventions, per-era checklist, guardrail table); general
  standards moved to `README_AI.md`.
- `detectDeadlock()`: hard-deadlock turn threshold raised from 18→30 and
  region fraction from 40%→65%; added a governance warning at turn 20 / 50%
  without ending the game, preventing premature terminations.
- `endTurnChecks()` now passes `state.maxTurns` to `checkVictory` instead of
  the static `MAX_TURNS` constant, respecting user-set turn limits.
- `refreshFactionTechState()` now gates nuclear unlock at era ≥ 1950 (not 1984)
  since Korean War–era scenarios include atomic weapons.
- `ERA_PRESETS` in both `eras.js` and `game.js` extended with `timeScale`,
  `startYear`, `startMonth` for date simulation.
- Era-derived region maps now include 1936, 1942, 1944, 1946, 1950 with
  era-appropriate name substitutions, resource value scaling, and instability.
- App version bumped to `v1.05`.

### Fixed
- Games ending at turn 18–25 due to over-aggressive `detectDeadlock` threshold.
- Turn count display now shows `state.maxTurns` (user-chosen) not hard-coded 60.

### Known Issues
- `src/engine/economy.js` still not called by `game.js`; inline version used.
- `window.GameData.computeRegionYieldMult` does not yet accept a second
  argument for resource-type override; the `convertLandUse` override is read
  locally in `game.js` but not reflected in the data module helper.
- AI never selects "Upgrade Region" or "Convert Land Use" optimally because
  the utility score doesn't model long-term return on investment.

## [PR #4] - 2026-03-01
### Added
- `CLAUDE.md` — agent documentation standards file directing AI sessions how
  to maintain changelogs, feature lists, persistent issues, and README.
- `docs/PERSISTENT_ISSUES.md` — ongoing bug/design-tension tracker.
- `src/data/eras.js` — canonical ERA_PRESETS, ERA_REGION_MAPS, CONTINENT_MASKS,
  TECH_TREE_TEMPLATE, ERA_DOCTRINES, and MAP_TILE/MAP_PITCH exported as
  `window.GameData` for module consumers.
- `src/data/resources.js` — RESOURCE_TYPES (8 types: oil, grain, minerals,
  water, tech, rare_earth, forest, maritime) with harvest-type semantics
  (renewable / annual / conditional / one-time), per-region assignments, and
  yield/regen helper functions.
- `src/data/game-modes.js` — GAME_MODES, SCENARIO_SETTINGS, SCENARIO_TYPES,
  and PACE_TO_TURNS exported as `window.GameData`.
- `src/engine/economy.js` — clean module versions of `regenerateFactionEconomies`
  and `applyDomesticPressure`; consumes `window.GameData` for resource-type
  yield multipliers and regeneration rates.
- Resource-type icons (`🛢🌾⛏💧⚡💎🌲⚓`) displayed on the first tile of each
  map region, with tooltip showing name and harvest type.
- Continent group visual accents: per-continent inset box-shadows differentiate
  North America, South America, Europe, Africa, Middle East, Asia, Oceania.
- Continent name labels rendered as grid items within the world map.
- Improved continent masks — wider, more geographically-shaped binary grids for
  all seven continents.
- `maxResourceValue` field stored on each region to enable fallout depletion
  recovery per resource type's `regenRate`.

### Changed
- `MIN_TURNS_BEFORE_VICTORY_CHECK` raised from 5 to 8 to prevent early-game
  territory or continent victories before meaningful strategy develops.
- Continent victory now requires controlling **3 or more** continents (was 2)
  to prevent fast wins via small two-region continents (Middle East, Oceania).
- Stalemate paradigm: stability threshold lowered from 0.28 to 0.22; minimum
  turn guard of 12 added so early nuclear exchanges cannot collapse the game.
- `mutualCollapse` paradigm: minimum turn 10 added so one first-turn nuke
  with `sharedCollapseEnabled` cannot end the game immediately.
- `victory.js` paradigm endings now use explicit per-type turn constants
  (`MIN_TURNS_MUTUAL_COLLAPSE = 10`, `MIN_TURNS_STALEMATE = 15`).
- `regenerateFactionEconomies` in `game.js` now applies resource-type yield
  multipliers from `window.GameData` and runs per-turn resource regeneration
  for partially-depleted regions.
- `doctrineFor` reads era doctrines from `window.GameData.ERA_DOCTRINES` when
  available, falling back to inline strings.
- `paceToTurns` reads from `window.GameData.PACE_TO_TURNS` when available.
- App version bumped to `v1.04`.
- Script loading order in `index.html` made explicit: data modules → engine
  modules → `game.js`.

### Fixed
- `stalemate` no longer fires in turns 1–11 regardless of stability level.
- `mutualCollapse` no longer fires in turns 1–9 regardless of nuclear usage.
- Games no longer end in turns 1–7 under default settings.
- Region tiles now preserve `maxResourceValue` for correct resource regeneration
  after nuclear fallout depletion.

### Known Issues
- Economy module (`src/engine/economy.js`) exists as clean reference but
  `game.js` still uses its own inline versions (partial migration). See
  `docs/PERSISTENT_ISSUES.md`.
- Continent labels rendered as CSS-grid children may visually overlap tiles
  on narrow screens. Full fix requires SVG overlay positioning.

## [PR #3] - 2026-03-01
### Added
- Visible in-app version label (`v1.03`) in the site header and report payload version metadata for run traceability.
- Nuclear gating diagnostics in batch logs with pressure, stockpile, and hard-block reasons.

### Changed
- Rebalanced nuclear decision gating by incorporating DEFCON/threat pressure into strike execution probability and AI scoring.
- Added domestic-collapse consequences (action disruption, legitimacy/resource penalties, and occasional region fragmentation into neutrality).
- Tightened economy regeneration to reduce runaway late-game resource inflation.
- Updated endgame resolution so continent-control victories can declare a winner before stalemate/paradigm overrides.

## [PR #2] - 2026-03-01
### Added
- `docs/game-features.md` to track shipped and planned gameplay capabilities.
- `docs/game-log-spec.md` to document simulation and debug logging fields.
- Structured `debugLog` output in report payload for turn-by-turn diagnostics.
- Start/end-of-turn debug snapshots including average resources, political capital, stability, threat, and contested/neutral region counts.

### Changed
- Adopted `src/` and `docs/` folders; moved runtime assets to `src/game.js` and `src/styles.css`.
- Rebalanced economic action cost, success behavior, and economy regeneration to reduce early-game resource deadlocks.
- Strengthened domestic pressure dynamics so stability and fatigue drift over time instead of pinning near 1.0.
- Linked threat/aggression signals to escalation ladder progression.
- Hardened AI-emergence gating (single trigger, persisted turn, minimum-turn guard, higher paradigm threshold).
- Refined continent-control promotion with threshold epsilon and explicit control acquisition logging.
- Updated global tone inference to couple tension with escalation state instead of AI-emergence alone.

### Fixed
- Repeated AI-emergence conversion event spam after threshold crossing.
- Cases where continent top share rounded above threshold but control was not promoted due to precision edge cases.

## [PR #1] - 2026-03-01
### Added
- Initial playable world strategy simulation with era maps, AI action system, nuclear model, revolution/TTT modules, and downloadable report.
