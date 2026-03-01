# Claude Code & Agent Instructions — Winning Move

This file contains **Claude Code–specific** behavioural instructions that
supplement the general AI agent documentation in `README_AI.md`. Read
`README_AI.md` first, then apply the overrides and additions below.

---

## 1. Documentation obligations (same as README_AI.md — enforced here)

Claude Code sessions **must** update `docs/CHANGELOG.md`, `docs/game-features.md`,
`docs/PERSISTENT_ISSUES.md`, and `README.md` as described in `README_AI.md §1`
before pushing any commit. These updates are not optional.

---

## 2. Tool-call conventions for this project

### File reads
- Read `src/game.js` in offset/limit chunks (≤ 300 lines) — the file exceeds
  25 000 tokens and will exceed the single-read limit.
- Always read a file **before** editing it; the Edit tool will error otherwise.

### Parallel tool calls
- Whenever two or more reads / searches are independent, issue them in a
  **single message** with multiple tool-call blocks so they run concurrently.
- Do not batch completions — mark each TodoWrite task complete immediately
  after finishing it.

### Write vs Edit
- Prefer `Edit` for targeted changes to existing files.
- Use `Write` only for new files or complete rewrites.

---

## 3. Branch and git discipline

- All work goes on the branch specified in the task description (pattern:
  `claude/<slug>-<sessionId>`). Never push to `main` or `master`.
- Commit messages must follow the convention in `README_AI.md §7`.
- Push with `git push -u origin <branch-name>`. Retry up to 4× on network
  failure using exponential back-off (2 s → 4 s → 8 s → 16 s).
- Do not amend published commits; create new commits instead.

---

## 4. Module and IIFE pattern (strict)

All `src/data/` and `src/engine/` files **must** follow the IIFE pattern and
end with `})(window);`. Claude Code must verify this in any file it touches.

Script tag load order in `index.html`:
```
src/data/eras.js
src/data/resources.js
src/data/game-modes.js
src/engine/escalation.js
src/engine/paradigm.js
src/engine/victory.js
src/engine/economy.js
src/game.js          ← always last
```
Adding a new module means inserting its `<script>` tag in the correct
position — data modules before engine modules, both before `game.js`.

---

## 5. Era additions — Claude Code checklist

When adding a new era (e.g., a WW2 breakdown era):
1. Add the preset to `ERA_PRESETS` in `src/data/eras.js` with keys:
   `label`, `techBoost`, `diplomacyBoost`, `warFriction`, `nuclearNorm`,
   `doctrine`, `timeScale` (months per turn), `startYear`, `startMonth`.
2. Add a corresponding entry to `ERA_TECH_UNLOCKS` and `ERA_DOCTRINES`.
3. Derive or define the `ERA_REGION_MAPS[<key>]` entry.
4. Fallback copies in `game.js` top-of-file `ERA_PRESETS` must also be
   extended so nothing breaks if the data module fails to load.
5. Add the `<option>` to `#eraSelect` in `index.html`.
6. Update `README.md` version badge and feature summary.

---

## 6. Game-balance guardrails (Claude Code must not violate)

| Constant | File | Minimum value |
|---|---|---|
| `MIN_TURNS_BEFORE_VICTORY_CHECK` | `game.js` | 8 |
| `MIN_TURNS_MUTUAL_COLLAPSE` | `victory.js` | 10 |
| `MIN_TURNS_STALEMATE` | `victory.js` | 15 |
| `MIN_CONTINENTS_FOR_VICTORY` | `victory.js` | 3 |
| `STALEMATE_STABILITY_THRESHOLD` | `paradigm.js` | ≤ 0.22 |
| `STALEMATE_MIN_TURN` | `paradigm.js` | 12 |
| `detectDeadlock` turn threshold | `game.js` | 30 |
| `detectDeadlock` region fraction | `game.js` | > 0.60 |

Any PR that violates a guardrail must include a `docs/PERSISTENT_ISSUES.md`
entry explaining the rationale.

---

## 7. Audit checklist (Claude Code session version)

Before each commit, verify:

- [ ] `README_AI.md §8` audit checklist passes.
- [ ] No `console.log` left in production paths (use the structured `log()`).
- [ ] No inline `setTimeout`/`setInterval` added outside `toggleAutoAdvance`.
- [ ] `src/game.js` still references `window.GameData.*` with fallback for
      every constant that has a canonical data-module equivalent.
- [ ] All new HTML inputs have an `id` referenced in `bindDom()`.
- [ ] TTT board state is reset between rounds (no stale symbols).
- [ ] `state.maxTurns` (when set from UI) is used in `endTurnChecks()` via
      the `constants.maxTurns` argument — not a stale `MAX_TURNS` reference.
- [ ] Tile `development` levels are initialised (default 0) in `startGame()`.
- [ ] Rebellion yield deducts from controlling faction before crediting instigator.
- [ ] Simulated date advances each turn via `advanceSimulatedDate(state)`.
