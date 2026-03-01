(function initErasModule(global) {
  const data = (global.GameData = global.GameData || {});

  // ---------------------------------------------------------------------------
  // Era presets
  // Each era modifies game-wide multipliers and doctrine labels.
  // ---------------------------------------------------------------------------
  const ERA_PRESETS = {
    // ── Modern ────────────────────────────────────────────────────────────────
    2026: {
      label:         "2026 — Multipolar, High Information",
      techBoost:     1.2,
      diplomacyBoost:1.2,
      warFriction:   1.0,
      nuclearNorm:   1.3,
      doctrine:      "Multipolar Adaptive",
      timeScale:     1,   // 1 month per turn
      startYear:     2026,
      startMonth:    1
    },
    // ── Cold War ──────────────────────────────────────────────────────────────
    1984: {
      label:         "1984 — Cold War Bloc Logic",
      techBoost:     1.0,
      diplomacyBoost:0.82,
      warFriction:   1.1,
      nuclearNorm:   1.45,
      doctrine:      "Cold War Deterrence",
      timeScale:     3,   // 1 quarter (3 months) per turn
      startYear:     1984,
      startMonth:    1
    },
    1950: {
      label:         "1950 — Korean War / Cold War Onset",
      techBoost:     0.86,
      diplomacyBoost:0.70,
      warFriction:   1.25,
      nuclearNorm:   0.90,
      doctrine:      "Cold War Proxy",
      timeScale:     1,
      startYear:     1950,
      startMonth:    6
    },
    // ── World War II ──────────────────────────────────────────────────────────
    "1944": {
      label:         "1944 — Late WW2: Liberation Drives",
      techBoost:     0.80,
      diplomacyBoost:0.60,
      warFriction:   1.40,
      nuclearNorm:   0.30,
      doctrine:      "Late Industrial War",
      timeScale:     1,
      startYear:     1944,
      startMonth:    1
    },
    "1942": {
      label:         "1942 — Middle WW2: Global Turning Point",
      techBoost:     0.78,
      diplomacyBoost:0.62,
      warFriction:   1.42,
      nuclearNorm:   0.20,
      doctrine:      "Industrial Attrition",
      timeScale:     1,
      startYear:     1942,
      startMonth:    1
    },
    1939: {
      label:         "1939 — Early WW2: Blitzkrieg & Fall of France",
      techBoost:     0.76,
      diplomacyBoost:0.70,
      warFriction:   1.35,
      nuclearNorm:   0.55,
      doctrine:      "Industrial Total War",
      timeScale:     1,
      startYear:     1939,
      startMonth:    9
    },
    1936: {
      label:         "1936 — Pre-WW2: Rearmament & Appeasement",
      techBoost:     0.72,
      diplomacyBoost:0.78,
      warFriction:   1.20,
      nuclearNorm:   0.10,
      doctrine:      "Interwar Rearmament",
      timeScale:     3,   // quarterly — slow build-up
      startYear:     1936,
      startMonth:    1
    },
    // ── Post-war / Reconstruction ─────────────────────────────────────────────
    1946: {
      label:         "1946 — Post-War Reconstruction",
      techBoost:     0.82,
      diplomacyBoost:0.90,
      warFriction:   0.85,
      nuclearNorm:   0.40,
      doctrine:      "Reconstruction Diplomacy",
      timeScale:     3,
      startYear:     1946,
      startMonth:    1
    }
  };

  // ---------------------------------------------------------------------------
  // Tech tree template
  // ---------------------------------------------------------------------------
  const TECH_TREE_TEMPLATE = {
    nuclear:       { unlockedAtEra: 1984, techCost: 4 },
    icbm:          { unlockedAtEra: 1984, techCost: 4 },
    stealthBomber: { unlockedAtEra: 1984, techCost: 3 },
    submarine:     { unlockedAtEra: 1939, techCost: 2 },
    hypersonic:    { unlockedAtEra: 2026, techCost: 5 },
    satellite:     { unlockedAtEra: 1984, techCost: 3 },
    cyberHybrid:   { unlockedAtEra: 2026, techCost: 4 },
    exotic:        { unlockedAtEra: 2026, techCost: 8 }
  };

  const ERA_TECH_UNLOCKS = {
    1936: [],
    1939: ["submarine"],
    "1942": ["submarine"],
    "1944": ["submarine"],
    1946: ["submarine"],
    1950: ["nuclear", "submarine"],
    1984: ["nuclear", "icbm", "submarine", "stealthBomber", "satellite"],
    2026: ["nuclear", "icbm", "stealthBomber", "submarine", "hypersonic", "satellite", "cyberHybrid"]
  };

  // ---------------------------------------------------------------------------
  // Faction doctrines by era
  // ---------------------------------------------------------------------------
  const ERA_DOCTRINES = {
    2026: ["Techno-Realist", "Market Coercion", "Alliance Balancer", "Stability First", "Hybrid Opportunist"],
    1984: ["MAD Hawk", "Deterrence Dove", "Proxy Gambler", "Bloc Stabilizer", "Shadow Escalator"],
    1950: ["Containment Hawk", "Proxy Champion", "Neutral Path", "Ideological Crusader", "Economic Stabilizer"],
    "1944": ["Liberation Crusade", "Total Mobilization", "Defensive Core", "Attrition Grinder", "Strategic Bomber"],
    "1942": ["Total War Expansion", "Eastern Front Grind", "Pacific Island-Hop", "Allied Coalition", "Colonial Resource Hold"],
    1939: ["Industrial Expansion", "Authoritarian Blitz", "Defensive Mobilizer", "Colonial Attrition", "Mass-Front Doctrine"],
    1936: ["Appeasement Broker", "Fascist Rearmer", "Popular Front", "Imperial Holdout", "Revisionist Power"],
    1946: ["Marshall Plan Liberal", "Soviet Sphere", "Decolonial Movement", "Reconstruction Neutral", "Emerging Nationalist"]
  };

  // ---------------------------------------------------------------------------
  // Continent masks
  // Each mask is a 2D binary grid (rows × cols) defining which cells are "land."
  // Larger, more geographically-shaped masks give continents organic outlines.
  // ---------------------------------------------------------------------------
  const CONTINENT_MASKS = {
    north_america: [
      [0,0,0,1,1,1,1,0,0,0],
      [0,0,1,1,1,1,1,1,0,0],
      [0,1,1,1,1,1,1,1,1,0],
      [1,1,1,1,1,1,1,1,1,0],
      [1,1,1,1,1,1,1,1,0,0],
      [0,1,1,1,1,1,1,0,0,0],
      [0,0,1,1,1,1,0,0,0,0],
      [0,0,0,1,1,0,0,0,0,0]
    ],
    south_america: [
      [0,1,1,1,0],
      [0,1,1,1,1],
      [0,1,1,1,0],
      [1,1,1,1,0],
      [0,1,1,1,0],
      [0,1,1,0,0],
      [0,1,1,0,0],
      [0,1,1,0,0],
      [0,1,0,0,0],
      [0,1,0,0,0]
    ],
    europe: [
      [0,0,1,1,1,0],
      [0,1,1,1,1,1],
      [1,1,1,1,1,0],
      [0,1,1,1,0,0],
      [0,0,1,0,0,0]
    ],
    africa: [
      [0,0,1,1,1,0,0],
      [0,1,1,1,1,1,0],
      [1,1,1,1,1,1,0],
      [0,1,1,1,1,1,0],
      [0,1,1,1,1,0,0],
      [0,0,1,1,1,0,0],
      [0,0,1,1,0,0,0],
      [0,0,0,1,0,0,0]
    ],
    middle_east: [
      [1,1,1,1,0],
      [1,1,1,1,1],
      [0,1,1,1,1],
      [0,0,1,1,0]
    ],
    asia: [
      [0,0,1,1,1,1,1,1,1,0],
      [0,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,0],
      [0,1,1,1,1,1,1,1,0,0],
      [0,1,1,1,1,1,1,0,0,0],
      [0,0,1,1,1,1,0,0,0,0],
      [0,0,0,1,1,0,0,0,0,0]
    ],
    oceania: [
      [0,0,1,1,1,0],
      [0,1,1,1,1,1],
      [1,1,1,1,1,1],
      [0,1,1,1,1,0],
      [0,0,0,1,0,0]
    ]
  };

  // ---------------------------------------------------------------------------
  // Region helper — used by ERA_REGION_MAPS below.
  // px/py = pixel centre coords; pw/ph = pixel bounding-box size;
  // sx/sy = spare cols/rows for the continent mask sampling.
  // ---------------------------------------------------------------------------
  const MAP_TILE  = { size: 16, gap: 4 };
  const MAP_PITCH = MAP_TILE.size + MAP_TILE.gap;   // 20px per grid cell

  function r(id, name, continent, px, py, pw, ph, sx, sy, props) {
    return {
      id, name, continent,
      gx:   Math.round(px / MAP_PITCH),
      gy:   Math.round(py / MAP_PITCH),
      cols: Math.max(2, Math.round(pw / MAP_PITCH)),
      rows: Math.max(2, Math.round(ph / MAP_PITCH)),
      resourceValue:    props.res,
      maxResourceValue: props.res,   // tracks the original cap for regeneration
      chokepoint:       props.choke,
      ideologyLean:     props.lean,
      instability:      props.unstable
    };
  }

  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  // ---------------------------------------------------------------------------
  // ERA_REGION_MAPS — canonical 2026 layout; 1984/1939 derived automatically.
  // ---------------------------------------------------------------------------
  const ERA_REGION_MAPS = {
    2026: [
      r("na_canada",    "Canada",          "north_america",  50,  34,  95,  52, 24, 16, { res:13, choke:1.10, lean:0.58, unstable:0.18 }),
      r("na_pnw",       "Pacific NW",      "north_america",  58,  94,  68,  40, 16,  8, { res:11, choke:1.30, lean:0.60, unstable:0.20 }),
      r("na_us_core",   "US Core",         "north_america", 130,  88,  95,  52, 20, 14, { res:18, choke:1.15, lean:0.53, unstable:0.24 }),
      r("na_california","California",      "north_america",  80, 138,  58,  38, 11,  8, { res:17, choke:1.20, lean:0.66, unstable:0.20 }),
      r("na_sunbelt",   "US Sunbelt",      "north_america", 145, 145,  92,  40, 17, 10, { res:14, choke:1.00, lean:0.45, unstable:0.27 }),
      r("na_mexico",    "Mexico",          "north_america", 126, 190,  70,  34, 12,  6, { res:10, choke:1.10, lean:0.42, unstable:0.35 }),

      r("sa_brazil",    "Brazil",          "south_america", 220, 220,  86,  70, 15, 20, { res:14, choke:1.00, lean:0.46, unstable:0.34 }),
      r("sa_andes",     "Andean Arc",      "south_america", 192, 240,  36,  90,  6, 15, { res: 9, choke:1.25, lean:0.40, unstable:0.39 }),
      r("sa_cones",     "Southern Cone",   "south_america", 230, 292,  78,  62,  9, 18, { res:11, choke:0.95, lean:0.48, unstable:0.26 }),

      r("eu_west",      "W. Europe",       "europe",        320,  80,  76,  46, 18, 10, { res:16, choke:1.00, lean:0.68, unstable:0.17 }),
      r("eu_east",      "E. Europe",       "europe",        398,  86,  75,  48, 14, 12, { res:13, choke:1.20, lean:0.38, unstable:0.29 }),
      r("eu_north",     "Nordics",         "europe",        345,  40,  84,  34, 14,  8, { res:12, choke:1.05, lean:0.64, unstable:0.15 }),

      r("af_north",     "North Africa",    "africa",        360, 175, 108,  44, 18, 10, { res:11, choke:1.30, lean:0.41, unstable:0.38 }),
      r("af_west",      "West Africa",     "africa",        330, 222,  86,  60, 10, 14, { res:10, choke:1.00, lean:0.37, unstable:0.42 }),
      r("af_east",      "East Africa",     "africa",        420, 220,  72,  72, 12, 16, { res: 9, choke:1.25, lean:0.34, unstable:0.44 }),
      r("af_south",     "Southern Africa", "africa",        378, 296,  90,  72, 14, 20, { res:13, choke:1.10, lean:0.45, unstable:0.31 }),

      r("me_levant",    "Levant",          "middle_east",   490, 154,  72,  40, 10,  8, { res: 9, choke:1.25, lean:0.35, unstable:0.48 }),
      r("me_gulf",      "Gulf",            "middle_east",   565, 164,  60,  42,  9,  9, { res:16, choke:1.40, lean:0.30, unstable:0.37 }),

      r("as_russia",    "Russia",          "asia",          500,  42, 200,  56, 24, 12, { res:15, choke:1.30, lean:0.26, unstable:0.29 }),
      r("as_china",     "China",           "asia",          578, 102, 100,  76, 18, 16, { res:17, choke:1.35, lean:0.30, unstable:0.27 }),
      r("as_india",     "India",           "asia",          560, 184,  86,  54, 14, 12, { res:14, choke:1.20, lean:0.48, unstable:0.31 }),
      r("as_seato",     "SEATO",           "asia",          648, 188,  86,  58, 13, 14, { res:11, choke:1.20, lean:0.52, unstable:0.35 }),
      r("as_japan",     "Japan/Korea",     "asia",          690, 132,  62,  44, 12,  8, { res:13, choke:1.40, lean:0.65, unstable:0.20 }),

      r("oc_australia", "Australia",       "oceania",       688, 294,  98,  62, 18, 18, { res:12, choke:1.05, lean:0.56, unstable:0.20 }),
      r("oc_islands",   "Pacific Islands", "oceania",       760, 246,  84,  46, 15,  9, { res: 8, choke:1.30, lean:0.50, unstable:0.30 })
    ]
  };

  // ---------------------------------------------------------------------------
  // Derive era maps from the canonical 2026 layout.
  // ---------------------------------------------------------------------------

  // 1984 — Cold War
  ERA_REGION_MAPS[1984] = ERA_REGION_MAPS[2026].map((x) => ({
    ...x,
    id:          `84_${x.id}`,
    instability: clamp(x.instability + 0.08, 0, 1),
    ideologyLean:clamp(x.ideologyLean - 0.08, 0, 1),
    name:        x.name
      .replace("SEATO",    "SEATO Bloc")
      .replace("W. Europe","W. Europe/NATO")
      .replace("E. Europe","Warsaw Sphere")
  }));

  // 1950 — Korean War / Cold War Onset
  ERA_REGION_MAPS[1950] = ERA_REGION_MAPS[2026].map((x) => ({
    ...x,
    id:          `50_${x.id}`,
    instability: clamp(x.instability + 0.10, 0, 1),
    ideologyLean:clamp(x.ideologyLean - 0.12, 0, 1),
    name:        x.name
      .replace("SEATO",    "Far East")
      .replace("Japan/Korea","Korea/Japan")
      .replace("W. Europe","W. Europe Recovery")
      .replace("E. Europe","Soviet Satellites")
  }));

  // 1946 — Post-War Reconstruction
  ERA_REGION_MAPS[1946] = ERA_REGION_MAPS[2026].map((x) => ({
    ...x,
    id:          `46_${x.id}`,
    instability: clamp(x.instability + 0.12, 0, 1),
    ideologyLean:clamp(x.ideologyLean - 0.15, 0, 1),
    resourceValue: Math.max(3, Math.round(x.resourceValue * 0.75)),
    maxResourceValue: Math.max(3, Math.round(x.resourceValue * 0.75)),
    name:        x.name
      .replace("W. Europe","W. Europe Ruins")
      .replace("E. Europe","E. Europe Occupied")
      .replace("Japan/Korea","Occupied Japan")
      .replace("Russia",   "Soviet Union")
  }));

  // 1944 — Late WW2
  ERA_REGION_MAPS["1944"] = ERA_REGION_MAPS[2026].map((x) => ({
    ...x,
    id:          `44_${x.id}`,
    instability: clamp(x.instability + 0.16, 0, 1),
    ideologyLean:clamp(x.ideologyLean - 0.20, 0, 1),
    resourceValue: Math.max(3, Math.round(x.resourceValue * 0.80)),
    maxResourceValue: Math.max(3, Math.round(x.resourceValue * 0.80)),
    name:        x.name
      .replace("W. Europe","Western Front")
      .replace("E. Europe","Eastern Front")
      .replace("Levant",   "Levant Mandate")
      .replace("Gulf",     "Arabian Theater")
      .replace("Russia",   "Soviet Union")
      .replace("Japan/Korea","Imperial Japan/Korea")
      .replace("SEATO",   "Imperial Pacific")
  }));

  // 1942 — Middle WW2
  ERA_REGION_MAPS["1942"] = ERA_REGION_MAPS[2026].map((x) => ({
    ...x,
    id:          `42_${x.id}`,
    instability: clamp(x.instability + 0.18, 0, 1),
    ideologyLean:clamp(x.ideologyLean - 0.22, 0, 1),
    resourceValue: Math.max(3, Math.round(x.resourceValue * 0.78)),
    maxResourceValue: Math.max(3, Math.round(x.resourceValue * 0.78)),
    name:        x.name
      .replace("W. Europe","Fortress Europe")
      .replace("E. Europe","Eastern Front")
      .replace("Levant",   "Levant Mandate")
      .replace("Gulf",     "Arabian Theater")
      .replace("Russia",   "Soviet Union")
      .replace("Japan/Korea","Imperial Japan")
      .replace("SEATO",   "Imperial Pacific")
      .replace("North Africa","N. Africa Campaign")
  }));

  // 1939 — Early WW2
  ERA_REGION_MAPS[1939] = ERA_REGION_MAPS[2026].map((x) => ({
    ...x,
    id:          `39_${x.id}`,
    instability: clamp(x.instability + 0.14, 0, 1),
    ideologyLean:clamp(x.ideologyLean - 0.18, 0, 1),
    name:        x.name
      .replace("W. Europe","W. Europe Front")
      .replace("E. Europe","Eastern Front")
      .replace("Levant",   "Levant Mandates")
      .replace("Gulf",     "Arabian Theater")
  }));

  // 1936 — Pre-WW2 / Rearmament
  ERA_REGION_MAPS[1936] = ERA_REGION_MAPS[2026].map((x) => ({
    ...x,
    id:          `36_${x.id}`,
    instability: clamp(x.instability + 0.10, 0, 1),
    ideologyLean:clamp(x.ideologyLean - 0.14, 0, 1),
    name:        x.name
      .replace("W. Europe","W. Europe")
      .replace("E. Europe","Central Europe")
      .replace("Levant",   "Levant Mandate")
      .replace("Gulf",     "Arabian Protectorate")
      .replace("Russia",   "Soviet Union")
  }));

  // ---------------------------------------------------------------------------
  // Exports
  // ---------------------------------------------------------------------------
  data.ERA_PRESETS        = ERA_PRESETS;
  data.TECH_TREE_TEMPLATE = TECH_TREE_TEMPLATE;
  data.ERA_TECH_UNLOCKS   = ERA_TECH_UNLOCKS;
  data.ERA_DOCTRINES      = ERA_DOCTRINES;
  data.CONTINENT_MASKS    = CONTINENT_MASKS;
  data.ERA_REGION_MAPS    = ERA_REGION_MAPS;
  data.MAP_TILE           = MAP_TILE;
  data.MAP_PITCH          = MAP_PITCH;
})(window);
