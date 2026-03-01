(function initResourcesModule(global) {
  const data = (global.GameData = global.GameData || {});

  // ---------------------------------------------------------------------------
  // Resource type definitions
  // ---------------------------------------------------------------------------
  // harvestType:
  //   "renewable"   – regenerates each turn at regenRate (e.g., water, maritime)
  //   "annual"      – full harvest once per year-cycle; partial depletion recovers (grain)
  //   "conditional" – recovers only if explicitly invested in (forest, tech hub)
  //   "one-time"    – extracted once then permanently degraded (specific mineral deposits)
  // regenRate: fraction of maxResourceValue recovered per turn (0-1)
  // yieldMult: economic output multiplier applied to region.resourceValue per tile
  // ---------------------------------------------------------------------------
  const RESOURCE_TYPES = {
    oil: {
      label: "Oil Fields",
      icon: "🛢",
      color: "#78350f",           // brown
      harvestType: "conditional", // can deplete; recovers slowly with investment
      regenRate: 0.12,
      yieldMult: 1.45,
      desc: "High-value energy; depletes without reinvestment."
    },
    grain: {
      label: "Agricultural Land",
      icon: "🌾",
      color: "#365314",           // dark green
      harvestType: "annual",
      regenRate: 0.85,
      yieldMult: 1.2,
      desc: "Reliable food yield; replenishes each cycle."
    },
    minerals: {
      label: "Mineral Deposits",
      icon: "⛏",
      color: "#374151",           // slate
      harvestType: "one-time",
      regenRate: 0.05,
      yieldMult: 1.6,
      desc: "One-time extraction; minimal natural recovery."
    },
    water: {
      label: "Fresh Water",
      icon: "💧",
      color: "#0c4a6e",           // blue
      harvestType: "renewable",
      regenRate: 0.95,
      yieldMult: 1.1,
      desc: "Renewable; essential for stability bonuses."
    },
    tech: {
      label: "Tech Hub",
      icon: "⚡",
      color: "#1e1b4b",           // indigo
      harvestType: "conditional",
      regenRate: 0.55,
      yieldMult: 1.7,
      desc: "High yield but requires continuous investment."
    },
    rare_earth: {
      label: "Rare Earth",
      icon: "💎",
      color: "#4c1d95",           // purple
      harvestType: "one-time",
      regenRate: 0.08,
      yieldMult: 1.9,
      desc: "Extremely valuable; effectively one-time extraction."
    },
    forest: {
      label: "Forest / Timber",
      icon: "🌲",
      color: "#14532d",           // green
      harvestType: "conditional",
      regenRate: 0.45,
      yieldMult: 1.15,
      desc: "Partially renewable; requires replanting investment."
    },
    maritime: {
      label: "Maritime Access",
      icon: "⚓",
      color: "#0f3460",           // navy
      harvestType: "renewable",
      regenRate: 0.9,
      yieldMult: 1.25,
      desc: "Trade lanes; fully renewable strategic access."
    }
  };

  // ---------------------------------------------------------------------------
  // Primary resource per region (base ID without era prefix).
  // First entry is the primary resource (determines tile icon/color).
  // Additional entries are secondary resources present in the region.
  // ---------------------------------------------------------------------------
  const REGION_RESOURCES = {
    na_canada:     ["forest",    "minerals",  "water"],
    na_pnw:        ["forest",    "water",     "tech"],
    na_us_core:    ["grain",     "tech",      "minerals"],
    na_california: ["tech",      "grain",     "oil"],
    na_sunbelt:    ["oil",       "grain",     "minerals"],
    na_mexico:     ["oil",       "minerals",  "grain"],

    sa_brazil:     ["grain",     "forest",    "rare_earth"],
    sa_andes:      ["minerals",  "rare_earth","water"],
    sa_cones:      ["grain",     "minerals",  "oil"],

    eu_west:       ["tech",      "maritime",  "grain"],
    eu_east:       ["grain",     "minerals",  "forest"],
    eu_north:      ["water",     "oil",       "forest"],

    af_north:      ["oil",       "minerals",  "rare_earth"],
    af_west:       ["oil",       "forest",    "minerals"],
    af_east:       ["grain",     "rare_earth","minerals"],
    af_south:      ["minerals",  "rare_earth","grain"],

    me_levant:     ["oil",       "water",     "minerals"],
    me_gulf:       ["oil",       "rare_earth","maritime"],

    as_russia:     ["oil",       "forest",    "minerals"],
    as_china:      ["rare_earth","minerals",  "tech"],
    as_india:      ["grain",     "tech",      "minerals"],
    as_seato:      ["maritime",  "grain",     "tech"],
    as_japan:      ["tech",      "maritime",  "minerals"],

    oc_australia:  ["minerals",  "rare_earth","grain"],
    oc_islands:    ["maritime",  "water",     "forest"]
  };

  // Harvest state per region tile (tracked at game state level; this module
  // only defines initial defaults and utility calculations).

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  /** Strip era prefix (84_ / 39_) to get the base region id. */
  function baseId(regionId) {
    return String(regionId).replace(/^(84_|39_)/, "");
  }

  /** Return all resource types for a region (primary first). */
  function getResourcesForRegion(regionId) {
    return REGION_RESOURCES[baseId(regionId)] || ["grain"];
  }

  /** Return the primary (most characteristic) resource type key. */
  function getPrimaryResource(regionId) {
    return getResourcesForRegion(regionId)[0] || "grain";
  }

  /** Return the ResourceType definition for a region's primary resource. */
  function getPrimaryResourceDef(regionId) {
    return RESOURCE_TYPES[getPrimaryResource(regionId)] || RESOURCE_TYPES.grain;
  }

  /**
   * Compute the per-region economic yield multiplier based on its resource mix.
   * Used by the economy regeneration to differentiate high-value vs. low-value
   * regions beyond the raw resourceValue field.
   */
  function computeRegionYieldMult(regionId) {
    const resources = getResourcesForRegion(regionId);
    // Primary resource counts for 60 %; secondaries share the remaining 40 %.
    const [primary, ...rest] = resources;
    const primMult = (RESOURCE_TYPES[primary]?.yieldMult || 1.0) * 0.60;
    const secMult =
      rest.length
        ? rest.reduce((acc, r) => acc + (RESOURCE_TYPES[r]?.yieldMult || 1.0), 0) / rest.length * 0.40
        : 0.40;
    return primMult + secMult;
  }

  /**
   * Compute per-turn resource regeneration fraction for a region tile.
   * Renewable/annual resources recover quickly; one-time resources barely recover.
   * Used by applyPendingEffects / economy to refill resourceValue over time.
   */
  function computeTileRegenRate(regionId) {
    const primary = getPrimaryResource(regionId);
    return RESOURCE_TYPES[primary]?.regenRate || 0.5;
  }

  /**
   * Return a short harvest-type label for display purposes.
   */
  function harvestLabel(regionId) {
    const def = getPrimaryResourceDef(regionId);
    const labels = {
      renewable:   "Renewable",
      annual:      "Annual Crop",
      conditional: "Conditional",
      "one-time":  "One-Time"
    };
    return labels[def.harvestType] || def.harvestType;
  }

  // ---------------------------------------------------------------------------
  // Exports
  // ---------------------------------------------------------------------------
  data.RESOURCE_TYPES = RESOURCE_TYPES;
  data.REGION_RESOURCES = REGION_RESOURCES;
  data.getResourcesForRegion = getResourcesForRegion;
  data.getPrimaryResource = getPrimaryResource;
  data.getPrimaryResourceDef = getPrimaryResourceDef;
  data.computeRegionYieldMult = computeRegionYieldMult;
  data.computeTileRegenRate = computeTileRegenRate;
  data.harvestLabel = harvestLabel;
})(window);
