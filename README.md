# Winning Move

A browser-based world strategy sandbox where 1 human (or 0 in observer mode) and 4 AI factions compete across dynamically generated era-specific global maps.

## Core Engine Model

The simulation now runs on an expanded strategic engine featuring:

- **Era-Specific Regional Maps**  
  Each era (2026, 1984, 1939) has its own geopolitical layout with 12–15 regions reflecting historical or modern power blocs.

- **Five Competing Factions**  
  Optional human player + AI factions with asymmetric objectives (dominance, peace, economy).

- **Revolution Engine (Multi-Turn)**  
  - Instigate Revolution action
  - Contested zones tracked across turns
  - Support values for attacker vs defender
  - Intelligence and technology modifiers
  - High-stakes Tic-Tac-Toe showdown resolution when support converges
  - Neutral/merged governance outcomes (cat’s-game scenarios)

- **High-Stakes Tic-Tac-Toe Perk System**  
  Winning stake rounds can grant:
  - Double Turn (skip next AI cycle)
  - Intel Surge (boost next revolution attempt)
  - Stability Shield (+stability buffer)

- **Nuclear Strategy Layer**  
  - Extensive named strike catalog
  - MAD-style retaliation probability
  - Political legitimacy collapse effects
  - Hidden stockpiles and triad deployment

- **Systemic Political Drift**  
  - Democracy and corporatism fluctuate each turn
  - Volatile leadership emergence
  - Stability degradation under institutional decay

- **Dynamic Win & Deadlock Detection**  
  Game ends when:
  - A faction controls ~55% of regions, OR
  - Strategic deadlock emerges (neutral/fragmented zones), OR
  - Turn limit reached.

- **Downloadable Strategic Report**  
  JSON export includes:
  - Faction metrics
  - Contested zones
  - Neutral regions
  - Pending systemic effects
  - Full strategic log

## Run locally
Open `index.html` directly, or use a local server:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.
