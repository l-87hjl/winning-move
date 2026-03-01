# Winning Move

World Strategy Sandbox is a browser-based geopolitical strategy simulation with one optional human player and four AI factions.

## Quick open link
- Repository-local index file: `file:///workspace/winning-move/index.html`

## Implemented scope
- Era-specific region maps for **2026 / 1984 / 1939** with subdivided continental blocks.
- Optional human mode or observer mode (all AI).
- Region control via military, economic, puppet, sovereignty support, dialogue, nuclear posture, and **Instigate Revolution**.
- Multi-turn revolution engine with `state.contestedRegions`, support values, intelligence-based defense, and showdown resolution.
- High-stakes Tic-Tac-Toe showdown system for revolution contests and continent-control playoffs.
- TTT perks: **Double Turn**, **Intel Surge**, **Stability Shield**.
- AI skip-cycle behavior and perk-aware revolution intelligence modifiers.
- Cat’s-game outcomes with mutual penalties and optional neutral governance creation.
- Neutral zone and strategic deadlock detection.
- Expanded JSON report output including contested zones, neutral zones, and pending systemic effects.
- Nuclear deterrence model with triad deployment, hidden stockpiles, retaliation risk, global instability penalties, and long-term fallout effects.
- Doctrine-aware AI with strategic memory (grievance/trust/threat), anti-hegemon balancing, and ideology-shaped decision bias.
- Domestic pressure systems: public opinion, war fatigue, economic stress, legitimacy drift.

## Run
Open `index.html` directly, or run a local server:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.
