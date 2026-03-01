# Changelog

All notable changes to this project are documented here.

## [Unreleased]

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
