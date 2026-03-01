# Game Features Tracker

## Implemented

### Core simulation
- Multi-faction geopolitical turn simulation.
- Era presets (1939, 1984, 2026) with region variants.
- Human interactive mode and AI-only/observer modes.

### Action system
- Military, economic, puppet, sovereignty, dialogue, technology, nuclear, triad, and revolution actions.
- Action affordability and AI utility scoring.
- Rebalanced economy loops to avoid turn-8+ stalling.

### Escalation & paradigm
- Escalation ladder (`conventional`, `limitedNuclear`, `fullExchange`) with event counters.
- DEFCON tracking and global tone changes.
- Post-human emergence pipeline with one-time conversion and paradigm-state transitions.

### Political and domestic systems
- Public opinion, economic stress, legitimacy, war fatigue, democracy/corporatism drift.
- Threat/grievance/trust memory between factions.

### Territory systems
- Region ownership and transfer.
- Contested and neutral governance handling.
- Continent influence and ownership determination.
- Continent playoffs via Tic-Tac-Toe showdown.

### Reporting & debugging
- JSON report export with scenario/game stats.
- Human-readable strategic log plus structured debug log.
- Turn snapshots for resources, stability, threat, and contested/neutral counts.

## Desired / Next

1. **Escalation branch depth**
   - Add explicit retaliation doctrines, limited exchange targeting, surrender offer/accept flow, and collapse branch outcomes.
2. **Economic model richness**
   - Add upkeep/supply lines, sanctions, and infrastructure repair/aid loops.
3. **Victory clarity**
   - Add explicit continent-victory and mixed-victory summaries in endgame report.
4. **Tone model refinement**
   - Weight tone by casualties, infrastructure damage, and escalation recency windows.
5. **Internal politics events**
   - Add coups, elections, protests, and elite fragmentation events triggered by domestic metrics.
6. **AI strategic branching**
   - Expand threat memory effect into broader action-priority shifts, alliance behavior, and deterrence policy switching.
