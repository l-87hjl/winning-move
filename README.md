# Winning Move

Winning Move is a browser-based geopolitical strategy simulation with optional human control and multi-faction AI behavior.

## Project structure

- `index.html` – main app shell and UI layout.
- `src/game.js` – simulation engine, AI logic, escalation model, reporting, and debug logging.
- `src/styles.css` – UI styling and tone themes.
- `docs/CHANGELOG.md` – change history organized by PR.
- `docs/game-features.md` – implemented features and roadmap tracking.
- `docs/game-log-spec.md` – game/debug log schema and usage notes.

## Run locally

Open the file directly:

- `file:///workspace/winning-move/index.html`

Or run a local server:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Notes on simulation outputs

- Downloaded reports now include both `log` (human-readable) and `debugLog` (structured diagnostics).
- Turn logs include DEFCON/escalation/tone/paradigm metadata useful for debugging conditional failures.
- AI emergence is now one-shot and gated by both threshold and minimum turn count to avoid premature/duplicate triggers.
