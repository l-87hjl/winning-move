# Winning Move

A browser-based strategy sandbox where 1 human (or 0 in observer mode) and 4 AI factions compete over a simplified world map.

## Quick links
- Open the game file in this repository: [index.html](./index.html)
- Repository-specific GitHub link: <https://github.com/I-87hjl/winning-move/blob/main/index.html>

## Features
- Era presets: 2026, 1984, 1939.
- 5 factions total with optional human control.
- Observer-mode auto-advance when all players are AI.
- Era-specific regional map partitioning (not a single solid continent block).
- Actions for military conquest, economic capture, puppet regimes, sovereignty support, dialogue, technology upgrades, stockpile expansion (public/secret), disarmament deals, nuclear strikes, and revolution instigation.
- Extensive named nuclear strike strategy catalog.
- Nuclear use includes MAD-style retaliation risk and heavy political/stability penalties.
- Revolution system with contested control and 50/50 showdown resolution.
- High-stakes Tic-Tac-Toe with hidden opponent wager, turn-scaling max wager, conservative luck randomizer, visible board play-through, and tactical perks (double turn/intel surge/stability shield).
- Cat-game (tie) outcomes can cause mutual penalties and temporary merger-style effects.
- Game-completion detection (including strategic deadlock states) and downloadable JSON report for post-game analysis.

## Run locally
Open `index.html` directly, or use a local server:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.
