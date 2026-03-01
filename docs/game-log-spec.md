# Game Log Specification

## Purpose

The game now keeps two complementary logs:

1. `log`: human-readable lines shown in UI and exported in reports.
2. `debugLog`: structured machine-friendly events for debugging and simulation analysis.

## `log` line format

Example:

`T12: Aegis Pact captured Levant economically. [dbg {"defcon":4,"escalation":"limitedNuclear","tone":"tense","paradigm":"normal"}]`

Contains:
- Turn-prefixed message.
- Embedded debug metadata snapshot.

## `debugLog` object format

Each entry includes:
- `turn`
- `message`
- `defcon`
- `escalation`
- `tone`
- `paradigm`
- Optional additional fields from context payloads (e.g., `avgResources`, `avgThreat`).

## Turn snapshots

Engine emits debug snapshots at:
- `turn-start`
- `turn-end`

Snapshot fields include:
- `avgResources`
- `avgPolitical`
- `avgStability`
- `avgThreat`
- `contestedRegions`
- `neutralRegions`

These snapshots are intended for diagnosing:
- economic stall patterns,
- emergence timing bugs,
- escalation dormancy,
- and stability lock behavior.
