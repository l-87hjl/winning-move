# Graphics & Asset Specification — Winning Move

This document defines the expected dimensions, formats, naming conventions,
and placement rules for all visual assets used in the project.

---

## 1. File structure

```
winning-move/
├── graphics/                   ← all raster / vector assets
│   ├── ui/                     ← interface chrome (icons, logos, overlays)
│   │   ├── logo.svg            ← site logo, scalable
│   │   ├── favicon.ico         ← 32×32 multi-size ICO
│   │   └── status-light-*.png  ← optional per-state indicator images
│   ├── map/                    ← world-map tile and region assets
│   │   ├── ocean-bg.webp       ← background texture (see §4)
│   │   ├── tile-contested.png  ← contested-state tile overlay (16×16 px)
│   │   ├── tile-neutral.png    ← neutral-state tile overlay (16×16 px)
│   │   └── resource/
│   │       ├── oil.svg
│   │       ├── grain.svg
│   │       ├── minerals.svg
│   │       ├── water.svg
│   │       ├── tech.svg
│   │       ├── rare_earth.svg
│   │       ├── forest.svg
│   │       └── maritime.svg
│   ├── factions/               ← per-faction flag / emblem assets
│   │   ├── orion_pact.svg
│   │   ├── helios_league.svg
│   │   ├── aegis_bloc.svg
│   │   ├── vanguard_union.svg
│   │   └── mariner_compact.svg
│   └── eras/                   ← era-specific illustrative headers
│       ├── era_2026.webp
│       ├── era_1984.webp
│       ├── era_1950.webp
│       ├── era_1944.webp
│       ├── era_1942.webp
│       ├── era_1939.webp
│       ├── era_1936.webp
│       └── era_1946.webp
└── src/
    └── styles.css              ← references graphics/ via relative URL
```

---

## 2. Map tile dimensions

The world map uses a CSS grid with the following constants (defined in
`src/data/eras.js` and mirrored in `src/game.js`):

| Property | Value | Notes |
|---|---|---|
| `MAP_TILE.size` | **14 px** | Tile width and height. Reduced from 16 px for denser layout. |
| `MAP_TILE.gap` | **3 px** | Gap between adjacent tiles. |
| `MAP_PITCH` | 17 px | `size + gap`; used for grid-column/row positioning. |
| `MAP_TILE.radius` | 3 px | CSS `border-radius` on each tile element. |
| Grid columns | 56 | Total columns declared in `#worldMap`. |

**Raster tile overlays** (e.g., `tile-contested.png`, `tile-neutral.png`):
- Dimensions: **14×14 px** at 1× (`@2×` optional at 28×28 px for retina).
- Format: PNG with alpha transparency.
- Placement: `position: absolute; inset: 0;` within `.region-tile`.

---

## 3. Resource icon format

Resource icons are currently rendered as Unicode emoji (7 px font-size).
When replacing with image assets:

| Attribute | Value |
|---|---|
| Preferred format | SVG (scalable, colour-themeable via `currentColor`) |
| Fallback format | PNG @ 14×14 px |
| Placement | `.resource-icon` span — `position: absolute; top: 1px; left: 1px;` |
| Max rendered size | 8×8 px |
| Colour | Neutral white or transparent-fill; coloured via CSS `filter` |

SVG icons should be **monochrome line art** with a single path, viewBox
`0 0 16 16`, no hard-coded fill colours (use `fill="currentColor"`).

---

## 4. Background textures

| Asset | Dimensions | Format | Max file size |
|---|---|---|---|
| `ocean-bg.webp` | 1024×768 px | WebP | 80 KB |
| Era header images | 960×240 px | WebP | 120 KB each |
| Faction emblems | 128×128 px | SVG preferred, PNG fallback | < 20 KB |

**WebP encoding settings**: quality 80, method 4, lossy.
Use `<picture>` with JPEG fallback for era headers if WebP is not supported.

---

## 5. Naming conventions

- **Lowercase kebab-case** for all filenames: `north-america-mask.svg`
- **No spaces or underscores** in filenames (underscores allowed only in the
  `resource/` subfolder to match JS resource-type keys).
- Suffix raster assets with their logical resolution:
  `icon-oil@2x.png` for the 2× retina version.
- Era assets use the numeric year: `era_1939.webp`, not `era_wwii.webp`.

---

## 6. Colour palette (CSS custom properties)

All graphics should be compatible with the dark UI palette:

| Token | Value | Use |
|---|---|---|
| `--bg` | `#0f172a` | Page background |
| `--panel` | `#111827` | Panel fill |
| `--text` | `#e5e7eb` | Primary text / icon colour |
| `--accent` | `#38bdf8` | Highlights, borders |
| `--warning` | `#f87171` | Alerts, contested state |

SVG icons that use `currentColor` will inherit `--text` automatically.
Avoid embedding hard-coded hex values in image files.

---

## 7. Adding a new asset

1. Place the file in the correct `graphics/` subdirectory (create subdirs
   as needed; do not place assets in `src/`).
2. Reference it from `src/styles.css` using a root-relative path:
   `url("../graphics/map/ocean-bg.webp")`.
3. Add an entry to this file describing dimensions, format, and purpose.
4. Document the addition in `docs/CHANGELOG.md` under **Added**.

---

## 8. Tile upgrade visual cues

When the tile development system is active (see `docs/game-features.md`),
each region tile optionally shows a development badge:

| Level | Badge | CSS class |
|---|---|---|
| 0 — Undeveloped | _(no badge)_ | — |
| 1 — Basic | `▪` 4 px dot | `.tile-dev-1` |
| 2 — Developed | `■` 6 px dot | `.tile-dev-2` |
| 3 — Industrial | `◆` 8 px dot | `.tile-dev-3` |

Badges are rendered as `::after` pseudo-elements in `styles.css`, using
`--accent` colour at levels 2–3 and `#64748b` at level 1. No separate
image asset is required.
