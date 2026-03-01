# Changelog

All notable changes to this project are documented here.

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
