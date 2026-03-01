# Winning Move  ·  v1.05

Winning Move is a browser-based geopolitical strategy simulation with optional
human control and multi-faction AI behaviour across multiple historical eras.

## Features

- **8 historical eras**: Pre-WW2 (1936), Early WW2 (1939), Middle WW2 (1942),
  Late WW2 (1944), Post-War (1946), Korean War onset (1950), Cold War (1984),
  and Modern Multipolar (2026).
- **Simulated date display**: each turn advances month/quarter/year based on
  the era's time scale (monthly for WW2/modern, quarterly for build-up eras).
- **Customisable game length**: set max turns (20–300) in the setup panel.
- **Tile development system**: upgrade regions through 4 tiers (Undeveloped →
  Basic → Developed → Industrial) for increasing resource yield. Convert
  resource types with a redevelopment penalty.
- **Rebellion resource diversion**: contested regions withhold 40% of yield
  from the controlling faction and redirect it to the revolution instigator.
- **Semi-transparent strategic log**: log panel blends with the map background
  so faction positions remain visible during play.
- 5 factions, 12+ actions, escalation ladder, DEFCON tracking, TTT showdowns,
  and paradigm-shift endings.

## Project structure

```
src/
  game.js          – simulation engine, AI, escalation, reporting, UI
  styles.css       – all visual styles
  data/
    eras.js        – era presets, region maps, continent masks
    resources.js   – resource types and yield helpers
    game-modes.js  – game modes, scenario types
  engine/
    victory.js     – victory condition logic
    escalation.js  – escalation ladder
    paradigm.js    – paradigm shift detection
    economy.js     – economy and domestic pressure (reference module)
docs/
  CHANGELOG.md         – PR/session history
  game-features.md     – implemented features and roadmap
  PERSISTENT_ISSUES.md – known bugs and design tensions
  game-log-spec.md     – log format reference
  graphics-spec.md     – asset dimensions, formats, file structure
README_AI.md       – AI agent documentation standards
CLAUDE.md          – Claude Code–specific agent instructions
```

## Run locally

Open the file directly:

```
file:///workspace/winning-move/index.html
```

Or run a local server:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Simulation outputs

- Downloaded reports include both `log` (human-readable) and `debugLog`
  (structured diagnostics).
- Turn logs carry DEFCON/escalation/tone/paradigm metadata for debugging.
- AI emergence is one-shot, gated by threshold and minimum turn count.
