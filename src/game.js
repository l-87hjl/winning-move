const ERA_PRESETS = {
  2026: { techBoost: 1.2,  diplomacyBoost: 1.2,  warFriction: 1.0,  nuclearNorm: 1.3,  doctrine: "Multipolar Adaptive",      timeScale: 1,  startYear: 2026, startMonth: 1 },
  1984: { techBoost: 1.0,  diplomacyBoost: 0.82, warFriction: 1.1,  nuclearNorm: 1.45, doctrine: "Cold War Deterrence",      timeScale: 3,  startYear: 1984, startMonth: 1 },
  1950: { techBoost: 0.86, diplomacyBoost: 0.70, warFriction: 1.25, nuclearNorm: 0.90, doctrine: "Cold War Proxy",           timeScale: 1,  startYear: 1950, startMonth: 6 },
  "1944": { techBoost: 0.80, diplomacyBoost: 0.60, warFriction: 1.40, nuclearNorm: 0.30, doctrine: "Late Industrial War",     timeScale: 1,  startYear: 1944, startMonth: 1 },
  "1942": { techBoost: 0.78, diplomacyBoost: 0.62, warFriction: 1.42, nuclearNorm: 0.20, doctrine: "Industrial Attrition",    timeScale: 1,  startYear: 1942, startMonth: 1 },
  1939: { techBoost: 0.76, diplomacyBoost: 0.70, warFriction: 1.35, nuclearNorm: 0.55, doctrine: "Industrial Total War",    timeScale: 1,  startYear: 1939, startMonth: 9 },
  1936: { techBoost: 0.72, diplomacyBoost: 0.78, warFriction: 1.20, nuclearNorm: 0.10, doctrine: "Interwar Rearmament",     timeScale: 3,  startYear: 1936, startMonth: 1 },
  1946: { techBoost: 0.82, diplomacyBoost: 0.90, warFriction: 0.85, nuclearNorm: 0.40, doctrine: "Reconstruction Diplomacy",timeScale: 3,  startYear: 1946, startMonth: 1 }
};

const ACTIONS = [
  "Military Pressure", "Economic Capture", "Puppet Regime", "Support Sovereignty", "Dialogue Summit",
  "Invest in Technology", "Expand Nuclear Stockpile", "Secret Stockpile Build", "Disarmament Deal", "Nuclear Strike",
  "Deploy Nuclear Triad", "Instigate Revolution", "Upgrade Region", "Convert Land Use"
];

const PERKS = ["Double Turn", "Intel Surge", "Stability Shield"];
const STRIKE_TYPES = ["Counterforce", "Countervalue", "Demonstration", "Submarine Launch", "Silo Saturation", "Bomber Penetration"];
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

const TECH_TREE_TEMPLATE = {
  nuclear: { unlockedAtEra: 1984, techCost: 4 },
  icbm: { unlockedAtEra: 1984, techCost: 4 },
  stealthBomber: { unlockedAtEra: 1984, techCost: 3 },
  submarine: { unlockedAtEra: 1939, techCost: 2 },
  hypersonic: { unlockedAtEra: 2026, techCost: 5 },
  satellite: { unlockedAtEra: 1984, techCost: 3 },
  cyberHybrid: { unlockedAtEra: 2026, techCost: 4 },
  exotic: { unlockedAtEra: 2026, techCost: 8 }
};

const MAX_TURNS = 60; // default; overridden by maxTurnsInput at game start
const APP_VERSION = "1.05";
// Raised from 5 to 8 so continent and territory victories cannot fire in the
// first few turns before meaningful strategic development has occurred.
const MIN_TURNS_BEFORE_VICTORY_CHECK = 8;
const DEFCON_MIN = 1;
const DEFCON_MAX = 5;
const TONE_STATES = ["stable", "tense", "critical", "terminal", "post-collapse"];

const MAP_TILE = { size: 16, gap: 4, radius: 4 };
const MAP_PITCH = MAP_TILE.size + MAP_TILE.gap;

const SCENARIO_SETTINGS = {
  deterrenceModel: "probabilistic",
  nuclearPenaltySeverity: 1,
  retaliationCertainty: 0.5,
  escalationReciprocity: 1,
  credibilityWeight: 1,
  humanitarianWeight: 0,
  longTermHorizonWeight: 0,
  domesticBacklashMultiplier: 1,
  surrenderPenaltyWeight: 1,
  globalFalloutSeverity: 0,
  sharedCollapseEnabled: false,
  guaranteedMad: false,
  futureWeighting: 1,
  reputationBacklash: 1,
  intelligenceFog: 0,
  victoryControlThreshold: 0.55,
  escalationTrackingEnabled: true,
  allianceFractureShock: 1,
  climateShockWeight: 1,
  famineShockWeight: 1,
  continentShowdownThreshold: 0.5,
  continentSecureThreshold: 0.6,
  maxContestedTurnsBeforeShowdown: 4
};

const GAME_MODES = {
  standard: { label: "Standard Game", settings: {} },
  coldWar: {
    label: "Cold War Deterrence",
    settings: { retaliationCertainty: 0.72, escalationReciprocity: 0.95, globalFalloutSeverity: 0.5 }
  },
  multipolar: {
    label: "Multipolar Adaptive",
    settings: { retaliationCertainty: 0.55, escalationReciprocity: 1.1, globalFalloutSeverity: 0.2 }
  },
  postHuman: {
    label: "Post-Human Emergence",
    settings: {
      longTermHorizonWeight: 1.3,
      humanitarianWeight: 0.15
    }
  },
  payne: {
    label: "Payne Escalation Model",
    settings: {
      deterrenceModel: "probabilistic",
      retaliationCertainty: 0.85,
      escalationReciprocity: 0.82,
      nuclearPenaltySeverity: 1,
      globalFalloutSeverity: 1,
      domesticBacklashMultiplier: 1,
      credibilityWeight: 1,
      humanitarianWeight: 0.2,
      longTermHorizonWeight: 0.5,
      surrenderPenaltyWeight: 1,
      sharedCollapseEnabled: false
    }
  }
};

const ERA_REGION_MAPS = {
  2026: [
    r("na_canada", "Canada", "north_america", 50, 34, 95, 52, 24, 16, { res: 13, choke: 1.1, lean: 0.58, unstable: 0.18 }),
    r("na_pnw", "Pacific NW", "north_america", 58, 94, 68, 40, 16, 8, { res: 11, choke: 1.3, lean: 0.6, unstable: 0.2 }),
    r("na_us_core", "US Core", "north_america", 130, 88, 95, 52, 20, 14, { res: 18, choke: 1.15, lean: 0.53, unstable: 0.24 }),
    r("na_california", "California", "north_america", 80, 138, 58, 38, 11, 8, { res: 17, choke: 1.2, lean: 0.66, unstable: 0.2 }),
    r("na_sunbelt", "US Sunbelt", "north_america", 145, 145, 92, 40, 17, 10, { res: 14, choke: 1.0, lean: 0.45, unstable: 0.27 }),
    r("na_mexico", "Mexico", "north_america", 126, 190, 70, 34, 12, 6, { res: 10, choke: 1.1, lean: 0.42, unstable: 0.35 }),
    r("sa_brazil", "Brazil", "south_america", 220, 220, 86, 70, 15, 20, { res: 14, choke: 1.0, lean: 0.46, unstable: 0.34 }),
    r("sa_andes", "Andean Arc", "south_america", 192, 240, 36, 90, 6, 15, { res: 9, choke: 1.25, lean: 0.4, unstable: 0.39 }),
    r("sa_cones", "Southern Cone", "south_america", 230, 292, 78, 62, 9, 18, { res: 11, choke: 0.95, lean: 0.48, unstable: 0.26 }),
    r("eu_west", "W. Europe", "europe", 320, 80, 76, 46, 18, 10, { res: 16, choke: 1.0, lean: 0.68, unstable: 0.17 }),
    r("eu_east", "E. Europe", "europe", 398, 86, 75, 48, 14, 12, { res: 13, choke: 1.2, lean: 0.38, unstable: 0.29 }),
    r("eu_north", "Nordics", "europe", 345, 40, 84, 34, 14, 8, { res: 12, choke: 1.05, lean: 0.64, unstable: 0.15 }),
    r("af_north", "North Africa", "africa", 360, 175, 108, 44, 18, 10, { res: 11, choke: 1.3, lean: 0.41, unstable: 0.38 }),
    r("af_west", "West Africa", "africa", 330, 222, 86, 60, 10, 14, { res: 10, choke: 1.0, lean: 0.37, unstable: 0.42 }),
    r("af_east", "East Africa", "africa", 420, 220, 72, 72, 12, 16, { res: 9, choke: 1.25, lean: 0.34, unstable: 0.44 }),
    r("af_south", "Southern Africa", "africa", 378, 296, 90, 72, 14, 20, { res: 13, choke: 1.1, lean: 0.45, unstable: 0.31 }),
    r("me_levant", "Levant", "middle_east", 490, 154, 72, 40, 10, 8, { res: 9, choke: 1.25, lean: 0.35, unstable: 0.48 }),
    r("me_gulf", "Gulf", "middle_east", 565, 164, 60, 42, 9, 9, { res: 16, choke: 1.4, lean: 0.3, unstable: 0.37 }),
    r("as_russia", "Russia", "asia", 500, 42, 200, 56, 24, 12, { res: 15, choke: 1.3, lean: 0.26, unstable: 0.29 }),
    r("as_china", "China", "asia", 578, 102, 100, 76, 18, 16, { res: 17, choke: 1.35, lean: 0.3, unstable: 0.27 }),
    r("as_india", "India", "asia", 560, 184, 86, 54, 14, 12, { res: 14, choke: 1.2, lean: 0.48, unstable: 0.31 }),
    r("as_seato", "SEATO", "asia", 648, 188, 86, 58, 13, 14, { res: 11, choke: 1.2, lean: 0.52, unstable: 0.35 }),
    r("as_japan", "Japan/Korea", "asia", 690, 132, 62, 44, 12, 8, { res: 13, choke: 1.4, lean: 0.65, unstable: 0.2 }),
    r("oc_australia", "Australia", "oceania", 688, 294, 98, 62, 18, 18, { res: 12, choke: 1.05, lean: 0.56, unstable: 0.2 }),
    r("oc_islands", "Pacific Islands", "oceania", 760, 246, 84, 46, 15, 9, { res: 8, choke: 1.3, lean: 0.5, unstable: 0.3 })
  ],
  1984: [],
  1939: []
};
ERA_REGION_MAPS[1984] = ERA_REGION_MAPS[2026].map((x) => ({ ...x, id: `84_${x.id}`, instability: clamp(x.instability + 0.08, 0, 1), ideologyLean: clamp(x.ideologyLean - 0.08, 0, 1), name: x.name.replace("SEATO", "SEATO Bloc").replace("W. Europe", "W. Europe/NATO").replace("E. Europe", "Warsaw Sphere") }));
ERA_REGION_MAPS[1950] = ERA_REGION_MAPS[2026].map((x) => ({ ...x, id: `50_${x.id}`, instability: clamp(x.instability + 0.10, 0, 1), ideologyLean: clamp(x.ideologyLean - 0.12, 0, 1), name: x.name.replace("SEATO","Far East").replace("Japan/Korea","Korea/Japan").replace("W. Europe","W. Europe Recovery").replace("E. Europe","Soviet Satellites") }));
ERA_REGION_MAPS[1946] = ERA_REGION_MAPS[2026].map((x) => ({ ...x, id: `46_${x.id}`, instability: clamp(x.instability + 0.12, 0, 1), ideologyLean: clamp(x.ideologyLean - 0.15, 0, 1), resourceValue: Math.max(3, Math.round(x.resourceValue * 0.75)), maxResourceValue: Math.max(3, Math.round(x.resourceValue * 0.75)), name: x.name.replace("W. Europe","W. Europe Ruins").replace("E. Europe","E. Europe Occupied").replace("Japan/Korea","Occupied Japan").replace("Russia","Soviet Union") }));
ERA_REGION_MAPS["1944"] = ERA_REGION_MAPS[2026].map((x) => ({ ...x, id: `44_${x.id}`, instability: clamp(x.instability + 0.16, 0, 1), ideologyLean: clamp(x.ideologyLean - 0.20, 0, 1), resourceValue: Math.max(3, Math.round(x.resourceValue * 0.80)), maxResourceValue: Math.max(3, Math.round(x.resourceValue * 0.80)), name: x.name.replace("W. Europe","Western Front").replace("E. Europe","Eastern Front").replace("Levant","Levant Mandate").replace("Gulf","Arabian Theater").replace("Russia","Soviet Union").replace("Japan/Korea","Imperial Japan/Korea").replace("SEATO","Imperial Pacific") }));
ERA_REGION_MAPS["1942"] = ERA_REGION_MAPS[2026].map((x) => ({ ...x, id: `42_${x.id}`, instability: clamp(x.instability + 0.18, 0, 1), ideologyLean: clamp(x.ideologyLean - 0.22, 0, 1), resourceValue: Math.max(3, Math.round(x.resourceValue * 0.78)), maxResourceValue: Math.max(3, Math.round(x.resourceValue * 0.78)), name: x.name.replace("W. Europe","Fortress Europe").replace("E. Europe","Eastern Front").replace("Levant","Levant Mandate").replace("Gulf","Arabian Theater").replace("Russia","Soviet Union").replace("Japan/Korea","Imperial Japan").replace("SEATO","Imperial Pacific").replace("North Africa","N. Africa Campaign") }));
ERA_REGION_MAPS[1939] = ERA_REGION_MAPS[2026].map((x) => ({ ...x, id: `39_${x.id}`, instability: clamp(x.instability + 0.14, 0, 1), ideologyLean: clamp(x.ideologyLean - 0.18, 0, 1), name: x.name.replace("W. Europe", "W. Europe Front").replace("E. Europe", "Eastern Front").replace("Levant", "Levant Mandates").replace("Gulf", "Arabian Theater") }));
ERA_REGION_MAPS[1936] = ERA_REGION_MAPS[2026].map((x) => ({ ...x, id: `36_${x.id}`, instability: clamp(x.instability + 0.10, 0, 1), ideologyLean: clamp(x.ideologyLean - 0.14, 0, 1), name: x.name.replace("E. Europe","Central Europe").replace("Levant","Levant Mandate").replace("Gulf","Arabian Protectorate").replace("Russia","Soviet Union") }));

function r(id, name, continent, x, y, w, h, sx, sy, props) {
  return {
    id, name, continent,
    gx: Math.round(x / MAP_PITCH), gy: Math.round(y / MAP_PITCH),
    cols: Math.max(2, Math.round(w / MAP_PITCH)), rows: Math.max(2, Math.round(h / MAP_PITCH)),
    resourceValue: props.res,
    // maxResourceValue tracks the original cap so partial fallout depletion
    // can be replenished by resource-type-specific regeneration each turn.
    maxResourceValue: props.res,
    chokepoint: props.choke, ideologyLean: props.lean, instability: props.unstable
  };
}

// Local silhouette masks per continent (used only to build the global mask).
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

// Global world-space tile layout. Each continent mask is anchored onto one
// shared coordinate plane so drawMap renders from absolute tile coordinates.
const GLOBAL_CONTINENT_ANCHORS = {
  north_america: { x: 1,  y: 2 },
  south_america: { x: 14, y: 13 },
  europe:        { x: 23, y: 6 },
  africa:        { x: 25, y: 12 },
  middle_east:   { x: 31, y: 10 },
  asia:          { x: 34, y: 4 },
  oceania:       { x: 46, y: 17 }
};

function buildGlobalLandmask() {
  const byContinent = {};
  let maxX = 0;
  let maxY = 0;
  Object.entries(CONTINENT_MASKS).forEach(([continent, mask]) => {
    const anchor = GLOBAL_CONTINENT_ANCHORS[continent] || { x: 0, y: 0 };
    const tiles = [];
    mask.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell !== 1) return;
        const x = anchor.x + c;
        const y = anchor.y + r;
        tiles.push({ x, y });
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      });
    });
    byContinent[continent] = tiles;
  });
  return { byContinent, cols: maxX + 1, rows: maxY + 1 };
}

const GLOBAL_LANDMASK = buildGlobalLandmask();

const TTT_TURN_CADENCE = 1;

const state = {
  turn: 0, era: "2026", started: false, gameOver: false, humanEnabled: false, gameMode: "standard", executionMode: "observer", autoAdvance: false, maxTurns: MAX_TURNS,
  simulatedYear: 2026, simulatedMonth: 1,
  factions: [], regions: [], mapOwnership: {}, selectedRegionId: null, selectedStrikeType: STRIKE_TYPES[0],
  contestedRegions: {}, neutralRegions: {}, pendingEffects: [], logEntries: [], debugLogEntries: [], skipAIUntil: {},
  scenarioSettings: { ...SCENARIO_SETTINGS },
  escalation: { current: "conventional", counts: { conventional: 0, limitedNuclear: 0, fullExchange: 0 } },
  stats: { nuclearUsage: 0, tacticalNuclear: 0, strategicNuclear: 0, surrenderAttempts: 0, maxEscalationStage: {}, collapseTriggered: false },
  ttt: {
    board: Array(9).fill(""),
    miniBoard: Array(9).fill(""),
    animating: false,
    lastRoundSummary: "",
    maxGamble: 10,
    turnCadence: TTT_TURN_CADENCE,
    lastPhaseTurn: 0,
    pendingPhaseSummary: ""
  },
  continentState: {},
  paradigmState: "normal",
  aiDevelopmentProgress: 0,
  aiEmergenceTriggered: false,
  aiEmergenceTurn: null,
  continentContestTurns: {},
  defconLevel: 5,
  globalTone: "stable",
  globalCasualties: { deaths: 0, injured: 0, economicDamage: 0 },
  exchangeSummary: { queue: [], retentionTurns: 1 },
  allianceFractureLevel: 0,
  eventOverlayTimeout: null,
  eventToneTimeout: null,
  turnsSinceNuclear: 0,
  lastCompletedGame: null,
  gameOverOverlayDismissed: false
};

let autoAdvanceInterval = null;

const dom = bindDom();

function bindDom() {
  return {
    eraSelect: id("eraSelect"), humanSelect: id("humanSelect"), gameModeSelect: id("gameModeSelect"), executionModeSelect: id("executionModeSelect"), conflictPaceSelect: id("conflictPaceSelect"), startBtn: id("startBtn"), nextTurnBtn: id("nextTurnBtn"), autoAdvanceBtn: id("autoAdvanceBtn"), newGameBtn: id("newGameBtn"), overlayNewGameBtn: id("overlayNewGameBtn"),
    downloadReportBtn: id("downloadReportBtn"), overlayDownloadReportBtn: id("overlayDownloadReportBtn"), worldMap: id("worldMap"), turnInfo: id("turnInfo"), factionTableBody: document.querySelector("#factionTable tbody"),
    actionSelect: id("actionSelect"), targetFactionSelect: id("targetFactionSelect"), targetRegionInput: id("targetRegionInput"), strikeTypeSelect: id("strikeTypeSelect"),
    executeActionBtn: id("executeActionBtn"), humanControls: id("humanControls"), convertFrom: id("convertFrom"), convertTo: id("convertTo"),
    convertAmount: id("convertAmount"), convertBtn: id("convertBtn"), tttBoard: id("tttBoard"), miniTttBoard: id("miniTttBoard"),
    tttGambleInput: id("tttGambleInput"), tttMaxInfo: id("tttMaxInfo"), tttRoundInfo: id("tttRoundInfo"), playTttRoundBtn: id("playTttRoundBtn"),
    resetTttBtn: id("resetTttBtn"), showdownLeftLog: id("showdownLeftLog"), showdownRightLog: id("showdownRightLog"), miniTttStatus: id("miniTttStatus"), log: id("log"),
    settingNuclearPenalty: id("settingNuclearPenalty"), settingRetaliation: id("settingRetaliation"), settingFutureWeight: id("settingFutureWeight"),
    settingBacklash: id("settingBacklash"), settingFog: id("settingFog"), settingVictoryControl: id("settingVictoryControl"), settingGuaranteedMad: id("settingGuaranteedMad"),
    settingEscalationTracking: id("settingEscalationTracking"), settingAllianceShock: id("settingAllianceShock"), settingClimateShock: id("settingClimateShock"), settingFamineShock: id("settingFamineShock"),
    settingGlobalFallout: id("settingGlobalFallout"), settingCredibilityWeight: id("settingCredibilityWeight"), settingHumanitarianWeight: id("settingHumanitarianWeight"),
    settingLongTermWeight: id("settingLongTermWeight"), settingDomesticBacklash: id("settingDomesticBacklash"), settingEscalationReciprocity: id("settingEscalationReciprocity"),
    settingContinentShowdownThreshold: id("settingContinentShowdownThreshold"), settingContinentSecureThreshold: id("settingContinentSecureThreshold"),
    settingSharedCollapse: id("settingSharedCollapse"), maxTurnsInput: id("maxTurnsInput"),
    scenarioSetupContainer: id("scenarioSetupContainer"), gameOverOverlay: id("gameOverOverlay"), gameOverWinnerText: id("gameOverWinnerText"), mapOverlay: id("mapOverlay"),
    destructionReportPanel: id("destructionReportPanel"), casualtyContent: id("casualtyContent"), defconMeter: id("defconMeter"),
    cognitiveContent: id("cognitiveContent"), eventOverlay: id("eventOverlay"), staticCanvas: id("staticCanvas"),
    strategicPanels: id("strategicPanels"), defconHeader: id("defconHeader"), cognitiveHeader: id("cognitiveHeader"),
    destructionHeader: id("destructionHeader"), eventHeader: id("eventHeader"), gameOverSummary: id("gameOverSummary"), overlayCloseBtn: id("overlayCloseBtn")
  };
}

function init() {
  ACTIONS.forEach((a) => dom.actionSelect.append(new Option(a, a)));
  STRIKE_TYPES.forEach((s) => dom.strikeTypeSelect.append(new Option(s, s)));
  PERKS.forEach((p) => id("tttPerkSelect").append(new Option(p, p)));
  dom.startBtn.addEventListener("click", startGame);
  dom.nextTurnBtn.addEventListener("click", advanceTurn);
  dom.autoAdvanceBtn.addEventListener("click", toggleAutoAdvance);
  dom.gameModeSelect?.addEventListener("change", applyGameModeDefaults);
  dom.executionModeSelect?.addEventListener("change", syncExecutionModeUi);
  dom.executeActionBtn.addEventListener("click", executeHumanAction);
  dom.convertBtn.addEventListener("click", convertPoints);
  dom.playTttRoundBtn.addEventListener("click", () => runStakeTtt(false));
  dom.resetTttBtn.addEventListener("click", resetTicTacToe);
  dom.downloadReportBtn.addEventListener("click", downloadReport);
  dom.overlayDownloadReportBtn?.addEventListener("click", downloadReport);
  dom.newGameBtn?.addEventListener("click", resetGameState);
  dom.overlayNewGameBtn?.addEventListener("click", resetGameState);
  dom.overlayCloseBtn?.addEventListener("click", dismissGameOverOverlay);
  applyGameModeDefaults();
  syncExecutionModeUi();
  renderEmptyBoard();
  renderTicTacToe();
  renderMiniTtt();
  drawStaticImagery();
  if (id("appVersion")) id("appVersion").textContent = `v${APP_VERSION}`;
  updateUI();
}

function applyGameModeDefaults() {
  const modeKey = dom.gameModeSelect?.value || "standard";
  const mode = GAME_MODES[modeKey] || GAME_MODES.standard;
  const merged = { ...SCENARIO_SETTINGS, ...(mode.settings || {}) };
  if (dom.settingRetaliation) dom.settingRetaliation.value = merged.retaliationCertainty;
  if (dom.settingNuclearPenalty) dom.settingNuclearPenalty.value = merged.nuclearPenaltySeverity;
  if (dom.settingGlobalFallout) dom.settingGlobalFallout.value = merged.globalFalloutSeverity;
  if (dom.settingCredibilityWeight) dom.settingCredibilityWeight.value = merged.credibilityWeight;
  if (dom.settingHumanitarianWeight) dom.settingHumanitarianWeight.value = merged.humanitarianWeight;
  if (dom.settingLongTermWeight) dom.settingLongTermWeight.value = merged.longTermHorizonWeight;
  if (dom.settingDomesticBacklash) dom.settingDomesticBacklash.value = merged.domesticBacklashMultiplier;
  if (dom.settingEscalationReciprocity) dom.settingEscalationReciprocity.value = merged.escalationReciprocity;
  if (dom.settingContinentShowdownThreshold) dom.settingContinentShowdownThreshold.value = merged.continentShowdownThreshold;
  if (dom.settingContinentSecureThreshold) dom.settingContinentSecureThreshold.value = merged.continentSecureThreshold;
  if (dom.settingSharedCollapse) dom.settingSharedCollapse.checked = merged.sharedCollapseEnabled;
}

function syncExecutionModeUi() {
  state.executionMode = dom.executionModeSelect?.value || "observer";
  if (!dom.humanSelect) return;
  if (state.executionMode === "interactive") dom.humanSelect.value = "yes";
  else if (state.executionMode === "observer" || state.executionMode === "aiOnly" || state.executionMode === "batch") dom.humanSelect.value = "no";
}

function paceToTurns() {
  const pace = dom.conflictPaceSelect?.value || "standard";
  // Use canonical table from data module when available.
  const table = window.GameData?.PACE_TO_TURNS || { short: 2, standard: 4, long: 6 };
  return table[pace] || 4;
}

function autoAdvanceDelayMs() {
  if (state.executionMode === "observer") return 450;
  if (state.executionMode === "aiOnly") return 800;
  return 1000;
}

function toggleAutoAdvance() {
  state.autoAdvance = !state.autoAdvance;

  if (state.autoAdvance) {
    if (autoAdvanceInterval) clearInterval(autoAdvanceInterval);
    autoAdvanceInterval = setInterval(() => {
      advanceTurn();
    }, autoAdvanceDelayMs());
  } else {
    clearInterval(autoAdvanceInterval);
    autoAdvanceInterval = null;
  }

  updateAutoAdvanceButtonUI();
}

function updateAutoAdvanceButtonUI() {
  dom.autoAdvanceBtn.textContent = `Auto Advance: ${state.autoAdvance ? "On" : "Off"}`;
}

function startGame() {
  state.turn = 0; state.gameOver = false; state.gameOverOverlayDismissed = false; state.started = true; state.logEntries = []; state.debugLogEntries = []; dom.log.innerHTML = "";
  state.autoAdvance = false;
  if (autoAdvanceInterval) { clearInterval(autoAdvanceInterval); autoAdvanceInterval = null; }
  state.era = dom.eraSelect.value;
  const parsedMaxTurns = parseInt(dom.maxTurnsInput?.value, 10);
  state.maxTurns = Number.isFinite(parsedMaxTurns) && parsedMaxTurns >= 20 ? parsedMaxTurns : MAX_TURNS;
  const eraPreset = (window.GameData?.ERA_PRESETS || ERA_PRESETS)[state.era];
  state.simulatedYear = eraPreset?.startYear ?? Number(state.era);
  state.simulatedMonth = eraPreset?.startMonth ?? 1;
  state.executionMode = dom.executionModeSelect?.value || "observer";
  state.humanEnabled = state.executionMode === "interactive" ? true : dom.humanSelect.value === "yes";
  state.gameMode = dom.gameModeSelect?.value || "standard";
  state.scenarioSettings = scenarioSettingsFromUI();
  state.regions = ERA_REGION_MAPS[state.era].map((r) => ({ ...r, development: 0, resourceTypeOverride: null }));
  state.contestedRegions = {}; state.neutralRegions = {}; state.pendingEffects = []; state.skipAIUntil = {};
  state.escalation = { current: "conventional", counts: { conventional: 0, limitedNuclear: 0, fullExchange: 0 } };
  state.stats = { nuclearUsage: 0, tacticalNuclear: 0, strategicNuclear: 0, surrenderAttempts: 0, maxEscalationStage: {}, collapseTriggered: false };
  state.continentState = {};
  state.paradigmState = "normal";
  state.aiDevelopmentProgress = 0;
  state.aiEmergenceTriggered = false;
  state.aiEmergenceTurn = null;
  state.continentContestTurns = {};
  state.lastCompletedGame = null;
  state.defconLevel = 5;
  state.globalTone = "stable";
  state.globalCasualties = { deaths: 0, injured: 0, economicDamage: 0 };
  state.exchangeSummary = { queue: [], retentionTurns: 1 };
  state.allianceFractureLevel = 0;
  state.turnsSinceNuclear = 0;
  state.ttt.board = Array(9).fill("");
  state.ttt.miniBoard = Array(9).fill("");
  state.ttt.lastRoundSummary = "";
  state.ttt.pendingPhaseSummary = "";
  state.ttt.lastPhaseTurn = 0;
  state.ttt.turnCadence = TTT_TURN_CADENCE;
  hideGameOverOverlay();
  if (dom.gameOverSummary) dom.gameOverSummary.textContent = "";
  buildFactions();
  state.factions.forEach((f) => { state.stats.maxEscalationStage[f.id] = 0; });
  assignStartingOwnership(); drawMap(); updateSelectors();
  log(`Scenario started for ${state.era}. Doctrine baseline: ${ERA_PRESETS[state.era].doctrine}.`);
  log(`Scenario settings loaded: ${JSON.stringify(state.scenarioSettings)}.`);
  dom.scenarioSetupContainer?.classList.add("collapsed");
  drawStaticImagery();
  if (id("appVersion")) id("appVersion").textContent = `v${APP_VERSION}`;
  updateUI();
}

function scenarioSettingsFromUI() {
  const victoryThreshold = Number(dom.settingVictoryControl?.value);
  const normalizedVictoryThreshold = Number.isFinite(victoryThreshold)
    ? clamp(victoryThreshold, 0.4, 0.75)
    : SCENARIO_SETTINGS.victoryControlThreshold;

  return {
    nuclearPenaltySeverity: Number(dom.settingNuclearPenalty?.value ?? SCENARIO_SETTINGS.nuclearPenaltySeverity),
    retaliationCertainty: Number(dom.settingRetaliation?.value ?? SCENARIO_SETTINGS.retaliationCertainty),
    guaranteedMad: Boolean(dom.settingGuaranteedMad?.checked),
    futureWeighting: Number(dom.settingFutureWeight?.value ?? SCENARIO_SETTINGS.futureWeighting),
    reputationBacklash: Number(dom.settingBacklash?.value ?? SCENARIO_SETTINGS.reputationBacklash),
    intelligenceFog: Number(dom.settingFog?.value ?? SCENARIO_SETTINGS.intelligenceFog),
    victoryControlThreshold: normalizedVictoryThreshold,
    escalationTrackingEnabled: Boolean(dom.settingEscalationTracking?.checked),
    allianceFractureShock: Number(dom.settingAllianceShock?.value ?? SCENARIO_SETTINGS.allianceFractureShock),
    climateShockWeight: Number(dom.settingClimateShock?.value ?? SCENARIO_SETTINGS.climateShockWeight),
    famineShockWeight: Number(dom.settingFamineShock?.value ?? SCENARIO_SETTINGS.famineShockWeight),
    globalFalloutSeverity: Number(dom.settingGlobalFallout?.value ?? SCENARIO_SETTINGS.globalFalloutSeverity),
    credibilityWeight: Number(dom.settingCredibilityWeight?.value ?? SCENARIO_SETTINGS.credibilityWeight),
    humanitarianWeight: Number(dom.settingHumanitarianWeight?.value ?? SCENARIO_SETTINGS.humanitarianWeight),
    longTermHorizonWeight: Number(dom.settingLongTermWeight?.value ?? SCENARIO_SETTINGS.longTermHorizonWeight),
    domesticBacklashMultiplier: Number(dom.settingDomesticBacklash?.value ?? SCENARIO_SETTINGS.domesticBacklashMultiplier),
    escalationReciprocity: Number(dom.settingEscalationReciprocity?.value ?? SCENARIO_SETTINGS.escalationReciprocity),
    continentShowdownThreshold: Number(dom.settingContinentShowdownThreshold?.value ?? SCENARIO_SETTINGS.continentShowdownThreshold),
    continentSecureThreshold: Number(dom.settingContinentSecureThreshold?.value ?? SCENARIO_SETTINGS.continentSecureThreshold),
    maxContestedTurnsBeforeShowdown: paceToTurns(),
    sharedCollapseEnabled: Boolean(dom.settingSharedCollapse?.checked),
    deterrenceModel: SCENARIO_SETTINGS.deterrenceModel,
    surrenderPenaltyWeight: SCENARIO_SETTINGS.surrenderPenaltyWeight
  };
}

function buildFactions() {
  const names = ["Orion Pact", "Helios League", "Aegis Bloc", "Vanguard Union", "Mariner Compact"];
  state.factions = names.map((name, i) => ({
    id: `f${i}`, name, color: ["#60a5fa", "#34d399", "#f59e0b", "#f472b6", "#a78bfa"][i],
    isHuman: state.humanEnabled && i === 0,
    resources: 95 + Math.random() * 25, political: 85 + Math.random() * 20,
    nukes: 2 + Math.floor(Math.random() * 5), hiddenStockpile: 1 + Math.floor(Math.random() * 3), triad: { silo: 0.4, sub: 0.3, bomber: 0.3 },
    tech: 1, techPoints: 2 + Math.random() * 2, stability: 0.74 - i * 0.05, democracy: 0.56 - i * 0.06, corporatism: 0.46 + i * 0.05,
    crazyLeader: Math.random() < 0.15, publicOpinion: 0.62, warFatigue: 0.1, economicStress: 0.16, legitimacy: 0.64,
    doctrine: doctrineFor(i), memory: {}, regions: [], perks: { doubleTurn: 0, intelSurge: 0, stabilityShield: 0 },
    techTree: buildTechTreeForEra(), deliverySystemModifier: 1, detectionRiskModifier: 1,
    aiSkipCycles: 0, scoredAction: "", escalationStage: 0, turnActionBudget: 1, turnDefensiveShield: 0, turnRegionPressure: 1,
    casualtyReport: emptyCasualtyReport(),
    cognitiveIndex: { reflection: 50, regret: 0, restraint: 50, aggressionMomentum: 0 }
  }));
  state.factions.forEach((f) => state.factions.forEach((other) => {
    if (other.id === f.id) return;
    f.memory[other.id] = { grievance: 0.1, trust: 0.5, threat: 0.2 };
  }));
}

function buildTechTreeForEra() {
  const eraNum = Number(state.era);
  const baseUnlocks = ERA_TECH_UNLOCKS[eraNum] || [];
  const tree = {};
  Object.entries(TECH_TREE_TEMPLATE).forEach(([key, value]) => {
    tree[key] = { ...value, unlocked: eraNum >= value.unlockedAtEra || baseUnlocks.includes(key) };
  });
  return tree;
}

function refreshFactionTechState(faction) {
  if (!faction.techTree) faction.techTree = buildTechTreeForEra();
  const eraNum = Number(state.era);
  const allowByEra = eraNum >= 1984;
  const override = faction.techPoints >= 7;
  faction.techTree.nuclear.unlocked = (eraNum >= 1950) || override;
  faction.techTree.icbm.unlocked = allowByEra || override;
  faction.techTree.stealthBomber.unlocked = eraNum >= 1984 || override;
  faction.techTree.hypersonic.unlocked = eraNum >= 2026 || faction.techPoints >= 8;
  faction.techTree.satellite.unlocked = eraNum >= 1984 || override;
  faction.techTree.cyberHybrid.unlocked = eraNum >= 2026 || faction.techPoints >= 8;
  faction.techTree.exotic.unlocked = faction.techPoints >= faction.techTree.exotic.techCost;
  faction.deliverySystemModifier = 1 + (faction.techTree.icbm.unlocked ? 0.08 : 0) + (faction.techTree.submarine.unlocked ? 0.06 : 0) + (faction.techTree.hypersonic.unlocked ? 0.1 : 0);
  faction.detectionRiskModifier = 1 - (faction.techTree.stealthBomber.unlocked ? 0.08 : 0) - (faction.techTree.cyberHybrid.unlocked ? 0.06 : 0) - (faction.techTree.satellite.unlocked ? 0.04 : 0);
  faction.detectionRiskModifier = clamp(faction.detectionRiskModifier, 0.65, 1.2);
}

function doctrineFor(i) {
  // Use canonical doctrines from the data module when available.
  const eraDoctrines = window.GameData?.ERA_DOCTRINES;
  if (eraDoctrines?.[state.era]) return eraDoctrines[state.era][i] || "Unknown Doctrine";
  if (state.era === "1984") return ["MAD Hawk", "Deterrence Dove", "Proxy Gambler", "Bloc Stabilizer", "Shadow Escalator"][i];
  if (state.era === "1939") return ["Industrial Expansion", "Authoritarian Blitz", "Defensive Mobilizer", "Colonial Attrition", "Mass-Front Doctrine"][i];
  return ["Techno-Realist", "Market Coercion", "Alliance Balancer", "Stability First", "Hybrid Opportunist"][i];
}

function assignStartingOwnership() {
  state.mapOwnership = {};
  state.factions.forEach((f) => (f.regions = []));
  state.regions.forEach((region, idx) => {
    const owner = state.factions[idx % state.factions.length];
    owner.regions.push(region.id);
    state.mapOwnership[region.id] = owner.id;
  });
}

function drawMap() {
  dom.worldMap.innerHTML = "";
  dom.worldMap.style.gridTemplateColumns = `repeat(${GLOBAL_LANDMASK.cols}, 16px)`;
  dom.worldMap.style.gridTemplateRows = `repeat(${GLOBAL_LANDMASK.rows}, 16px)`;

  // Track which continent labels have been placed to avoid duplicates.
  const labeledContinents = new Set();

  // Continent background-accent colors for visual grouping.
  const CONTINENT_ACCENT = {
    north_america: "rgba(96,165,250,0.07)",
    south_america: "rgba(52,211,153,0.07)",
    europe:        "rgba(251,191,36,0.07)",
    africa:        "rgba(249,115,22,0.07)",
    middle_east:   "rgba(239,68,68,0.07)",
    asia:          "rgba(167,139,250,0.07)",
    oceania:       "rgba(34,211,238,0.07)"
  };

  for (const region of state.regions) {
    const cluster = document.createElement("div");
    cluster.setAttribute("class", `region continent-${region.continent}`);
    cluster.dataset.regionId = region.id;
    cluster.dataset.continent = region.continent;
    cluster.style.display = "contents";
    cluster.addEventListener("click", () => {
      state.selectedRegionId = region.id;
      dom.targetRegionInput.value = region.name;
      highlightSelectedRegion();
    });

    const tiles = regionTiles(region);

    // Determine primary resource type for visual indicator.
    const data = window.GameData;
    const primaryRes = data?.getPrimaryResource?.(region.id) || "grain";
    const resDef = data?.RESOURCE_TYPES?.[primaryRes];

    tiles.forEach((tile, tIdx) => {
      const rect = document.createElement("div");
      rect.setAttribute("class", "region-tile");
      rect.style.gridColumn = `${tile.x + 1}`;
      rect.style.gridRow    = `${tile.y + 1}`;
      rect.dataset.regionId   = region.id;
      rect.dataset.continent  = region.continent;
      rect.dataset.resource   = primaryRes;

      // Subtle continent accent tint via outline.
      const accent = CONTINENT_ACCENT[region.continent] || "transparent";
      rect.style.outline = `1px solid ${accent}`;

      // Show the resource icon and development badge on the first land tile.
      if (tIdx === 0) {
        const devLevel = region.development || 0;
        const devBadges = ["", "▪", "■", "◆"];
        if (resDef?.icon) {
          rect.title = `${region.name} — ${resDef.label} (${resDef.harvestType}) | Dev: ${DEV_LEVEL_LABELS[devLevel]}`;
          const iconEl = document.createElement("span");
          iconEl.className = "resource-icon";
          iconEl.textContent = resDef.icon;
          iconEl.setAttribute("aria-hidden", "true");
          rect.append(iconEl);
        } else {
          rect.title = region.name;
        }
        if (devLevel > 0) {
          const badge = document.createElement("span");
          badge.className = `tile-dev-badge tile-dev-${devLevel}`;
          badge.textContent = devBadges[devLevel];
          badge.setAttribute("aria-hidden", "true");
          rect.append(badge);
        }
      } else {
        rect.title = region.name;
      }

      cluster.append(rect);
    });

    // Place a continent label on the first tile of the first region in each
    // continent so orientation is always clear.
    if (!labeledContinents.has(region.continent) && tiles.length) {
      labeledContinents.add(region.continent);
      const firstTile = tiles[0];
      const labelEl = document.createElement("div");
      labelEl.className = "continent-label";
      labelEl.textContent = region.continent.replace(/_/g, " ").toUpperCase();
      labelEl.style.gridColumn = `${firstTile.x + 1}`;
      labelEl.style.gridRow    = `${firstTile.y + 1}`;
      dom.worldMap.append(labelEl);
    }

    dom.worldMap.append(cluster);
  }
  recolorMap();
}

function regionTiles(region) {
  if (region.tiles?.length) return region.tiles;
  const continentTiles = (GLOBAL_LANDMASK.byContinent[region.continent] || []).map((tile) => ({ ...tile }));
  if (!continentTiles.length) {
    region.tiles = [];
    return region.tiles;
  }

  const continentRegions = state.regions.filter((r) => r.continent === region.continent);
  const totalWeight = continentRegions.reduce((sum, r) => sum + Math.max(1, r.rows * r.cols), 0);
  const targetById = {};
  let assignedTotal = 0;
  continentRegions.forEach((r, idx) => {
    const raw = Math.round((Math.max(1, r.rows * r.cols) / totalWeight) * continentTiles.length);
    const target = Math.max(1, raw);
    targetById[r.id] = target;
    assignedTotal += target;
    if (idx === continentRegions.length - 1 && assignedTotal !== continentTiles.length) {
      targetById[r.id] = Math.max(1, targetById[r.id] + (continentTiles.length - assignedTotal));
    }
  });

  const tileKey = (tile) => `${tile.x},${tile.y}`;
  const tileMap = new Map(continentTiles.map((tile) => [tileKey(tile), tile]));
  const neighbors = (tile) => {
    const deltas = [[1,0],[-1,0],[0,1],[0,-1]];
    return deltas
      .map(([dx,dy]) => tileMap.get(`${tile.x + dx},${tile.y + dy}`))
      .filter(Boolean);
  };

  const centroid = (r) => ({ x: r.gx + (r.cols / 2), y: r.gy + (r.rows / 2) });
  const seeds = continentRegions
    .map((r) => ({ region: r, center: centroid(r) }))
    .sort((a, b) => a.center.x - b.center.x || a.center.y - b.center.y);

  const unclaimed = new Set(continentTiles.map(tileKey));
  const assignments = {};

  const nearestUnclaimed = (center) => {
    let best = null;
    let bestDist = Infinity;
    unclaimed.forEach((key) => {
      const tile = tileMap.get(key);
      const dist = Math.hypot(tile.x - center.x, tile.y - center.y);
      if (dist < bestDist) {
        bestDist = dist;
        best = tile;
      }
    });
    return best;
  };

  seeds.forEach(({ region: r, center }) => {
    const quota = Math.min(targetById[r.id] || 1, unclaimed.size);
    const start = nearestUnclaimed(center);
    if (!start || quota <= 0) {
      assignments[r.id] = [];
      return;
    }
    const queue = [start];
    const seen = new Set([tileKey(start)]);
    const allocated = [];

    while (queue.length && allocated.length < quota) {
      const current = queue.shift();
      const key = tileKey(current);
      if (!unclaimed.has(key)) continue;
      unclaimed.delete(key);
      allocated.push(current);
      neighbors(current).forEach((n) => {
        const nKey = tileKey(n);
        if (!seen.has(nKey)) {
          seen.add(nKey);
          queue.push(n);
        }
      });
    }

    if (allocated.length < quota && unclaimed.size) {
      [...unclaimed]
        .map((key) => tileMap.get(key))
        .sort((a, b) => Math.hypot(a.x - center.x, a.y - center.y) - Math.hypot(b.x - center.x, b.y - center.y))
        .slice(0, quota - allocated.length)
        .forEach((tile) => {
          const key = tileKey(tile);
          if (!unclaimed.has(key)) return;
          unclaimed.delete(key);
          allocated.push(tile);
        });
    }

    assignments[r.id] = allocated;
  });

  if (unclaimed.size && continentRegions.length) {
    const keys = [...unclaimed];
    keys.forEach((key, idx) => {
      const tile = tileMap.get(key);
      const targetRegion = continentRegions[idx % continentRegions.length];
      assignments[targetRegion.id] ||= [];
      assignments[targetRegion.id].push(tile);
    });
  }

  continentRegions.forEach((r) => {
    r.tiles = (assignments[r.id] || []).sort((a, b) => a.y - b.y || a.x - b.x);
  });

  return region.tiles;
}

function recolorMap() {
  [...dom.worldMap.querySelectorAll(".region")].forEach((el) => {
    const id = el.dataset.regionId;
    const tiles = [...el.querySelectorAll(".region-tile")];
    if (state.neutralRegions[id]) {
      el.classList.add("neutral");
      tiles.forEach((tile) => { tile.style.backgroundColor = "#94a3b8"; });
    } else {
      el.classList.remove("neutral");
      const owner = state.factions.find((f) => f.id === state.mapOwnership[id]);
      tiles.forEach((tile) => { tile.style.backgroundColor = owner?.color || "#64748b"; });
    }
    el.classList.toggle("contested", Boolean(state.contestedRegions[id]));
  });
  highlightSelectedRegion();
}

function highlightSelectedRegion() {
  [...dom.worldMap.querySelectorAll(".region")].forEach((el) => el.classList.toggle("selected", el.dataset.regionId === state.selectedRegionId));
}

function updateSelectors() {
  dom.targetFactionSelect.innerHTML = "";
  const human = state.factions.find((f) => f.isHuman) || state.factions[0];
  state.factions.filter((f) => f.id !== human.id).forEach((f) => dom.targetFactionSelect.append(new Option(f.name, f.id)));
}

function advanceSimulatedDate() {
  const eraPreset = (window.GameData?.ERA_PRESETS || ERA_PRESETS)[state.era];
  const monthsPerTurn = eraPreset?.timeScale ?? 1;
  state.simulatedMonth = (state.simulatedMonth || 1) + monthsPerTurn;
  while (state.simulatedMonth > 12) {
    state.simulatedMonth -= 12;
    state.simulatedYear = (state.simulatedYear || Number(state.era)) + 1;
  }
}

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function formatSimDate() {
  const eraPreset = (window.GameData?.ERA_PRESETS || ERA_PRESETS)[state.era];
  const mpt = eraPreset?.timeScale ?? 1;
  if (mpt >= 12) {
    // Year-scale eras: just show the year.
    return `${state.simulatedYear}`;
  }
  if (mpt >= 3) {
    // Quarter-scale eras: show Q1-Q4.
    const q = Math.ceil((state.simulatedMonth || 1) / 3);
    return `Q${q} ${state.simulatedYear}`;
  }
  // Month-scale eras.
  const m = Math.min(12, Math.max(1, Math.round(state.simulatedMonth || 1)));
  return `${MONTH_NAMES[m - 1]} ${state.simulatedYear}`;
}

function updateUI(shouldRender = true) {
  const era = ERA_PRESETS[state.era];
  const top = leaderFaction();
  const maxT = state.maxTurns ?? MAX_TURNS;
  const simDate = state.started ? ` | <strong>Date:</strong> ${formatSimDate()}` : "";
  dom.turnInfo.innerHTML = `<p><strong>Turn:</strong> ${state.turn}/${maxT}${simDate} | <strong>Era:</strong> ${state.era} | <strong>Doctrine Engine:</strong> ${era.doctrine} | <strong>Leader:</strong> ${top.name} (${top.regions.length} regions)</p>`;
  dom.factionTableBody.innerHTML = "";
  state.factions.forEach((f) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td style="color:${f.color}">${f.name}</td><td>${f.isHuman ? "Human" : "AI"}${f.crazyLeader ? " / volatile" : ""}</td><td>${Math.round(f.resources)}</td><td>${Math.round(f.political)}</td><td>${Math.round(f.nukes)} (+${Math.round(f.hiddenStockpile)} hidden)</td><td>${Math.round(f.stability * 100)}%</td><td>${f.doctrine}</td><td>${f.democracy > 0.6 ? "Democratic" : f.democracy > 0.35 ? "Hybrid" : "Authoritarian"}</td>`;
    dom.factionTableBody.append(tr);
  });
  state.ttt.maxGamble = computeMaxGamble();
  dom.tttMaxInfo.textContent = `Max wager: ${state.ttt.maxGamble} political points.`;
  dom.tttRoundInfo.textContent = state.ttt.pendingPhaseSummary || state.ttt.lastRoundSummary || `TTT phase triggers every ${state.ttt.turnCadence} turn(s).`;
  dom.downloadReportBtn.disabled = !(state.started || state.lastCompletedGame);
  dom.nextTurnBtn.disabled = !state.started || state.gameOver || state.ttt.animating;
  dom.autoAdvanceBtn.disabled = !state.started || state.gameOver;
  if ((!state.started || state.gameOver) && autoAdvanceInterval) {
    clearInterval(autoAdvanceInterval);
    autoAdvanceInterval = null;
    state.autoAdvance = false;
  }
  updateAutoAdvanceButtonUI();
  dom.humanControls.classList.toggle("disabled", !(state.started && state.humanEnabled && !state.gameOver));
  renderStrategicPanels();
  applyToneTheme();
  if (shouldRender) {
    recolorMap();
    renderTicTacToe();
    renderMiniTtt();
  }
  toggleGameOverOverlay();
}

function executeHumanAction() {
  if (!state.started || state.gameOver) return;
  const actor = state.factions.find((f) => f.isHuman);
  if (!actor) return;
  const target = state.factions.find((f) => f.id === dom.targetFactionSelect.value) || randomOpponent(actor);
  const action = dom.actionSelect.value; const regionId = state.selectedRegionId || (target.regions[0] || state.regions[0].id);
  resolveAction(actor, action, target, regionId, true, dom.strikeTypeSelect.value);
  finalizeTurnFor(actor);
  advanceTurn();
}

function resolveAction(actor, action, target, regionId, isHuman = false, strikeType = STRIKE_TYPES[0]) {
  if (actor.aiSkipCycles > 0 && !isHuman) {
    actor.aiSkipCycles -= 1;
    log(`${actor.name} skipped a cycle due to Double Turn disruption.`);
    return;
  }
  const cost = actionCost(action);
  if (actor.resources < cost.resources || actor.political < cost.political) {
    log(`${actor.name} lacked points for ${action}.`);
    return;
  }
  actor.resources -= cost.resources;
  actor.political -= cost.political;
  const region = state.regions.find((r) => r.id === regionId) || state.regions[0];

  switch (action) {
    case "Military Pressure": runMilitary(actor, target, region); break;
    case "Economic Capture": runEconomic(actor, target, region); break;
    case "Puppet Regime": runPuppet(actor, target, region); break;
    case "Support Sovereignty": actor.stability = clamp(actor.stability + 0.04, 0, 1); actor.legitimacy = clamp(actor.legitimacy + 0.05, 0, 1); log(`${actor.name} reinforced sovereignty norms in ${region.name}.`); break;
    case "Dialogue Summit": runDialogue(actor, target); break;
    case "Invest in Technology": actor.tech += 0.11 * ERA_PRESETS[state.era].techBoost; actor.techPoints += 0.5; refreshFactionTechState(actor); log(`${actor.name} increased technology depth.`); break;
    case "Expand Nuclear Stockpile": actor.nukes += 1 + Math.random() * 1.2; actor.legitimacy -= 0.02; log(`${actor.name} openly expanded nuclear stockpiles.`); break;
    case "Secret Stockpile Build": actor.hiddenStockpile += 1 + Math.random(); actor.memory[target.id].grievance += 0.03; log(`${actor.name} added covert nuclear capacity.`); break;
    case "Disarmament Deal": runDisarmament(actor, target); break;
    case "Deploy Nuclear Triad": runTriad(actor); break;
    case "Nuclear Strike": runNuclear(actor, target, region, strikeType); break;
    case "Instigate Revolution": instigateRevolution(actor, target, region); break;
    case "Upgrade Region": upgradeRegion(actor, region); break;
    case "Convert Land Use": convertLandUse(actor, region); break;
  }

  normalizeFaction(actor);
  normalizeFaction(target);
  updateMemory(actor, target, action);
}

function actionCost(action) {
  const table = {
    "Military Pressure": { resources: 15, political: 8 }, "Economic Capture": { resources: 7, political: 8 },
    "Puppet Regime": { resources: 12, political: 14 }, "Support Sovereignty": { resources: 7, political: 8 },
    "Dialogue Summit": { resources: 4, political: 6 }, "Invest in Technology": { resources: 14, political: 5 },
    "Expand Nuclear Stockpile": { resources: 20, political: 12 }, "Secret Stockpile Build": { resources: 17, political: 10 },
    "Disarmament Deal": { resources: 6, political: 6 }, "Nuclear Strike": { resources: 34, political: 24 },
    "Deploy Nuclear Triad": { resources: 14, political: 11 }, "Instigate Revolution": { resources: 11, political: 12 },
    "Upgrade Region": { resources: 18, political: 6 }, "Convert Land Use": { resources: 22, political: 10 }
  };
  return table[action] || { resources: 10, political: 10 };
}

function canAffordAction(actor, action) {
  const cost = actionCost(action);
  return actor.resources >= cost.resources && actor.political >= cost.political;
}

function nuclearGateSnapshot(actor, target, region) {
  const mem = actor.memory[target.id] || { threat: 0, grievance: 0 };
  const stockpile = actor.nukes + actor.hiddenStockpile;
  const desperation = Math.max(0, (1 - actor.stability) + (1 - actor.publicOpinion) + actor.warFatigue - 1.6);
  const pressure = (mem.threat || 0) + (mem.grievance || 0) + Math.max(0, (3 - state.defconLevel) * 0.5) + (state.escalation.current !== "conventional" ? 0.45 : 0) + (region?.chokepoint || 0) * 0.15 + desperation;
  const hardBlockReason = !actor.techTree?.nuclear?.unlocked ? "missing_tech_unlock" : stockpile < 1 ? "no_stockpile" : null;
  return { stockpile, pressure: Number(pressure.toFixed(3)), hardBlockReason };
}

function runMilitary(actor, target, region) {
  const pressureMod = actor.turnRegionPressure || 1;
  const shield = target.turnDefensiveShield || 0;
  const chance = clamp((0.32 + actor.tech * 0.09 - target.tech * 0.07 + (actor.memory[target.id].threat * 0.2) - region.instability * 0.2) * pressureMod * (1 - shield), 0.08, 0.92);
  if (Math.random() < chance) { transferRegion(target, actor, region.id); showAttackVisual(region.id, false, target.regions[0]); actor.political += region.resourceValue * 0.5; adjustDefcon(-1, "Major conventional strike altered balance."); triggerEventStatic([">>> MAJOR STRIKE DETECTED"]); log(`${actor.name} seized ${region.name} by direct force.`); }
  else { actor.stability -= 0.04; actor.warFatigue += 0.05; log(`${actor.name} failed military pressure in ${region.name}.`); }
}

function runEconomic(actor, target, region) {
  const pressureMod = actor.turnRegionPressure || 1;
  const shield = target.turnDefensiveShield || 0;
  const chance = clamp((0.42 + actor.corporatism * 0.28 - target.democracy * 0.13 + region.chokepoint * 0.08 + actor.memory[target.id].threat * 0.04) * pressureMod * (1 - shield * 0.7), 0.08, 0.93);
  if (Math.random() < chance) {
    transferRegion(target, actor, region.id);
    showAttackVisual(region.id, false, target.regions[0]);
    actor.resources += 7 + region.resourceValue * 0.75;
    target.resources = Math.max(0, target.resources - 8);
    actor.political += 1.5;
    log(`${actor.name} captured ${region.name} economically.`);
  } else {
    actor.political = Math.max(0, actor.political - 0.5);
    log(`${actor.name}'s economic capture in ${region.name} was resisted.`);
  }
}

function runPuppet(actor, target, region) {
  const pressureMod = actor.turnRegionPressure || 1;
  const shield = target.turnDefensiveShield || 0;
  const chance = clamp((0.26 + (1 - target.stability) * 0.35 + region.instability * 0.2) * pressureMod * (1 - shield), 0.05, 0.9);
  if (Math.random() < chance) { transferRegion(target, actor, region.id); showAttackVisual(region.id, false, target.regions[0]); target.legitimacy -= 0.08; actor.legitimacy -= 0.03; log(`${actor.name} installed a puppet regime in ${region.name}.`); }
  else log(`${actor.name}'s puppet operation in ${region.name} collapsed.`);
}

function runDialogue(actor, target) {
  const trust = actor.memory[target.id].trust;
  const gain = (8 + trust * 9) * ERA_PRESETS[state.era].diplomacyBoost;
  actor.political += gain; actor.stability += 0.02; target.memory[actor.id].trust += 0.08;
  actor.memory[target.id].grievance = clamp(actor.memory[target.id].grievance - 0.08, 0, 2);
  adjustDefcon(1, "Diplomatic channel reduced immediate escalation risk.");
  adjustCognitiveIndex(actor, { restraint: 10, aggressionMomentum: -10 });
  triggerEventStatic([">>> DIPLOMATIC CHANNEL OPEN", ">>> DE-ESCALATION WINDOW EXPANDED"]);
  log(`${actor.name} and ${target.name} held a summit (+${Math.round(gain)} political).`);
}

function runDisarmament(actor, target) {
  const disarmed = Math.max(1, Math.floor(actor.nukes * 0.2));
  actor.nukes -= disarmed; actor.political += disarmed * 5; actor.legitimacy += 0.06;
  target.memory[actor.id].trust += 0.1;
  if (state.scenarioSettings.surrenderPenaltyWeight < 1) {
    actor.legitimacy = clamp(actor.legitimacy + (1 - state.scenarioSettings.surrenderPenaltyWeight) * 0.08, 0, 1);
    actor.stability = clamp(actor.stability + (1 - state.scenarioSettings.surrenderPenaltyWeight) * 0.06, 0, 1);
    target.memory[actor.id].threat = clamp(target.memory[actor.id].threat - 0.08, 0, 3);
    state.stats.surrenderAttempts += 1;
  }
  log(`${actor.name} disarmed ${disarmed} warheads for political favor.`);
}

function runTriad(actor) {
  actor.triad.silo = clamp(actor.triad.silo + 0.08, 0, 1);
  actor.triad.sub = clamp(actor.triad.sub + 0.08, 0, 1);
  actor.triad.bomber = clamp(actor.triad.bomber + 0.08, 0, 1);
  actor.nukes += 0.5;
  log(`${actor.name} improved triad deployment (sub, silo, bomber).`);
}

function runNuclear(actor, target, region, strikeType) {
  const gate = nuclearGateSnapshot(actor, target, region);
  if (gate.hardBlockReason === "no_stockpile") { log(`${actor.name} attempted ${strikeType} without available stockpile.`); return; }
  const doctrine = nuclearDoctrineScore(actor, target, region);
  const pressureBoost = clamp(gate.pressure * 0.12, 0, 0.35);
  const executeChance = clamp(doctrine.executeChance + pressureBoost, 0.02, 0.92);
  if (state.executionMode === "batch") log(`[BATCH] Nuclear decision ${actor.name}->${target.name}: execute=${executeChance.toFixed(3)} retaliation=${doctrine.retaliationChance.toFixed(3)} pressure=${gate.pressure.toFixed(3)} stockpile=${gate.stockpile.toFixed(2)} hardBlock=${gate.hardBlockReason || "none"}`);
  if (gate.hardBlockReason === "missing_tech_unlock") { log(`${actor.name} lacks required nuclear tech unlock for ${strikeType}.`); return; }
  if (Math.random() > executeChance) { log(`${actor.name} prepared ${strikeType} but aborted under deterrence pressure (gate=${gate.pressure.toFixed(2)}).`); return; }

  actor.nukes -= 1;
  state.turnsSinceNuclear = 0;
  showAttackVisual(region.id, true, target.regions[0]);
  state.stats.nuclearUsage += 1;
  const tactical = ["Demonstration", "Counterforce"].includes(strikeType);
  const stageIncrease = tactical ? 1 : 2;
  actor.escalationStage = clamp((actor.escalationStage || 0) + stageIncrease, 0, 3);
  state.stats.maxEscalationStage[actor.id] = Math.max(state.stats.maxEscalationStage[actor.id] || 0, actor.escalationStage);
  if (tactical) state.stats.tacticalNuclear += 1;
  else state.stats.strategicNuclear += 1;

  const damage = tactical ? 0.22 + Math.random() * 0.14 : 0.35 + Math.random() * 0.24;
  target.stability -= damage;
  target.resources -= (tactical ? 14 : 26) * damage;
  target.legitimacy -= tactical ? 0.08 : 0.15;

  const severity = state.scenarioSettings.nuclearPenaltySeverity;
  const falloutSeverity = 1 + state.scenarioSettings.globalFalloutSeverity * 0.25;
  const backlashWeight = state.scenarioSettings.reputationBacklash * state.scenarioSettings.domesticBacklashMultiplier;
  const globalPenalty = (tactical ? 0.1 : 0.16) + doctrine.globalInstability;
  state.factions.forEach((f) => {
    f.publicOpinion -= globalPenalty * severity * (f.id === actor.id ? 1.4 * backlashWeight : backlashWeight);
    f.stability -= globalPenalty * (tactical ? 0.35 : 0.7) * severity;
    f.economicStress += globalPenalty * (tactical ? 0.5 : 0.85) * falloutSeverity;
  });

  actor.legitimacy = clamp(actor.legitimacy + (tactical ? 0.02 : 0), 0, 1);
  region.resourceValue = Math.max(2, region.resourceValue - (tactical ? 2 : 4) * severity);
  region.instability = clamp(region.instability + (tactical ? 0.14 : 0.24) * severity, 0, 1);
  state.pendingEffects.push({ type: "fallout", turns: tactical ? 3 : 5, regionId: region.id, severity: 0.04 * severity * falloutSeverity });
  state.pendingEffects.push({ type: "climate", turns: tactical ? 2 : 4, severity: 0.02 * state.scenarioSettings.climateShockWeight * severity * falloutSeverity });
  state.pendingEffects.push({ type: "famine", turns: tactical ? 2 : 4, severity: 0.02 * state.scenarioSettings.famineShockWeight * severity * falloutSeverity });
  state.pendingEffects.push({ type: "alliance", turns: tactical ? 2 : 3, severity: 0.015 * state.scenarioSettings.allianceFractureShock * severity, actorId: actor.id });
  if (state.scenarioSettings.sharedCollapseEnabled) applySharedCollapse(tactical ? 0.5 : 1);
  updateEscalationLadder(tactical ? "limitedNuclear" : "fullExchange");
  adjustDefcon(-2, `${actor.name} executed a nuclear strike.`);
  adjustCognitiveIndex(actor, { reflection: 10, regret: 15, restraint: -10, aggressionMomentum: 20 });
  const primaryImpact = captureNuclearConsequence(target, damage, tactical ? 0.7 : 1.2);
  const exchangeRecord = {
    label: `${strikeType} exchange`,
    sides: {
      [actor.id]: emptyExchangeDelta(),
      [target.id]: primaryImpact.delta
    }
  };
  triggerEventStatic([">>> LAUNCH ORDER CONFIRMED", ">>> FORCE LOSS PROJECTION UPDATED", ">>> GLOBAL SYSTEM SHOCK"]);

  const retaliationChance = (tactical ? doctrine.retaliationChance * state.scenarioSettings.escalationReciprocity : doctrine.retaliationChance) * actor.deliverySystemModifier * actor.detectionRiskModifier;
  log(`${actor.name} executed ${strikeType} on ${region.name}. Global instability spiked.`);
  if ((state.scenarioSettings.guaranteedMad || Math.random() < retaliationChance) && (target.nukes + target.hiddenStockpile) > 0) {
    target.nukes = Math.max(0, target.nukes - 1);
    target.escalationStage = clamp((target.escalationStage || 0) + 1, 0, 3);
    state.stats.maxEscalationStage[target.id] = Math.max(state.stats.maxEscalationStage[target.id] || 0, target.escalationStage);
    actor.stability -= tactical ? 0.16 : 0.24;
    actor.resources -= tactical ? 12 : 20;
    actor.legitimacy -= tactical ? 0.1 : 0.16;
    const retaliationImpact = captureNuclearConsequence(actor, tactical ? damage * 0.62 : damage * 0.78, tactical ? 0.55 : 0.95);
    exchangeRecord.sides[actor.id] = retaliationImpact.delta;
    adjustDefcon(-1, "Retaliatory launch probability became realized.");
    adjustCognitiveIndex(target, { reflection: 10, regret: 15, restraint: -10, aggressionMomentum: 20 });
    log(`${target.name} retaliated under MAD logic.`);
  }
  pushExchangeSummary(actor, target, exchangeRecord);
  renderStrategicPanels();
}

function nuclearDoctrineScore(actor, target, region) {
  const era = ERA_PRESETS[state.era];
  const pressure = (1 - actor.stability) * 0.24 + actor.crazyLeader * 0.14 + actor.memory[target.id].grievance * 0.1;
  const restraint = era.nuclearNorm * 0.19 + actor.democracy * 0.15 + actor.publicOpinion * 0.12 + actor.legitimacy * 0.08;
  const targetThreat = actor.memory[target.id].threat + (target.nukes * 0.05) + region.chokepoint * 0.08;
  const executeChance = clamp(0.08 + pressure + targetThreat - restraint, 0.02, 0.65);
  const modeBoost = state.scenarioSettings.deterrenceModel === "guaranteed" ? 1.3 : state.scenarioSettings.deterrenceModel === "fragile" ? 0.75 : 1;
  const certaintyMod = (0.45 + state.scenarioSettings.retaliationCertainty) * modeBoost;
  const retaliationChance = clamp((0.28 + target.nukes * 0.07 + target.hiddenStockpile * 0.04 - actor.triad.sub * 0.06) * certaintyMod, 0.05, 0.99);
  return { executeChance, retaliationChance, globalInstability: 0.06 + (1 - era.nuclearNorm) * -0.01 + region.chokepoint * 0.01 };
}

function applySharedCollapse(scale = 1) {
  state.stats.collapseTriggered = true;
  state.factions.forEach((f) => {
    f.resources -= 4 * scale;
    f.economicStress += 0.05 * scale;
    f.stability -= 0.04 * scale;
    f.publicOpinion -= 0.03 * scale;
  });
  state.pendingEffects.push({ type: "sharedCollapse", turns: 4, severity: 0.02 * scale });
  adjustDefcon(-1, "Shared collapse chain detected.");
  state.factions.forEach((f) => adjustCognitiveIndex(f, { reflection: 15, regret: 20 }));
  triggerEventStatic([">>> SHARED SYSTEM COLLAPSE", ">>> HUMANITARIAN FAILURE CASCADE"]);
}

function instigateRevolution(actor, target, region) {
  const intelMod = actor.perks.intelSurge > 0 ? 0.12 : 0;
  const defenseIntel = target.tech * 0.07 + target.stability * 0.22 + target.memory[actor.id].threat * 0.12;
  const supportDelta = (0.18 + actor.corporatism * 0.08 + region.instability * 0.16 + intelMod) - defenseIntel;
  const contested = state.contestedRegions[region.id] || {
    regionId: region.id, attackerId: actor.id, defenderId: target.id, attackerSupport: 0.42, defenderSupport: 0.58, turns: 0, pendingShowdown: false
  };
  contested.attackerSupport = clamp(contested.attackerSupport + supportDelta * 0.45 + (Math.random() - 0.5) * 0.08, 0.05, 0.95);
  contested.defenderSupport = clamp(1 - contested.attackerSupport, 0.05, 0.95);
  contested.turns += 1;
  contested.pendingShowdown = Math.abs(contested.attackerSupport - contested.defenderSupport) <= 0.08;
  state.contestedRegions[region.id] = contested;
  if (actor.perks.intelSurge > 0) actor.perks.intelSurge -= 1;

  log(`${actor.name} instigated revolution in ${region.name}. Support now ${Math.round(contested.attackerSupport * 100)}/${Math.round(contested.defenderSupport * 100)}.`);
  if (state.executionMode === "batch") log(`[BATCH] Support shift ${region.name}: A ${contested.attackerSupport.toFixed(3)} / D ${contested.defenderSupport.toFixed(3)}`);
  if (contested.pendingShowdown) runRevolutionShowdown(contested, region);
}

function runRevolutionShowdown(contested, region) {
  const attacker = byId(contested.attackerId), defender = byId(contested.defenderId);
  const wagerA = 6 + Math.floor(attacker.political * 0.1);
  const wagerD = 6 + Math.floor(defender.political * 0.1);
  const result = simulateTttRound(attacker, defender, wagerA, wagerD, "revolution");

  if (result === "X") {
    transferRegion(defender, attacker, region.id);
    attacker.political += 8; defender.political -= 8;
    delete state.contestedRegions[region.id];
    log(`Revolution showdown: ${attacker.name} took ${region.name}.`);
  } else if (result === "O") {
    defender.stability += 0.04; attacker.stability -= 0.04;
    delete state.contestedRegions[region.id];
    log(`Revolution crushed in ${region.name}; ${defender.name} held control.`);
  } else {
    const mutual = 5;
    attacker.political -= mutual; defender.political -= mutual;
    if (Math.random() < 0.5) {
      state.neutralRegions[region.id] = { bornTurn: state.turn, reason: "cat-game neutral governance" };
      delete state.mapOwnership[region.id];
      attacker.regions = attacker.regions.filter((id) => id !== region.id);
      defender.regions = defender.regions.filter((id) => id !== region.id);
      log(`Cat's game in ${region.name}: region became neutral governance.`);
    } else {
      log(`Cat's game in ${region.name}: both factions penalized (${mutual}).`);
    }
    delete state.contestedRegions[region.id];
  }
}

function transferRegion(from, to, regionId) {
  delete state.neutralRegions[regionId];
  state.mapOwnership[regionId] = to.id;
  if (from) from.regions = from.regions.filter((r) => r !== regionId);
  if (!to.regions.includes(regionId)) to.regions.push(regionId);
}

function advanceTurn() {
  if (!state.started || state.gameOver || state.ttt.animating) return;
  state.turn += 1;
  pruneExchangeSummary();
  state.turnsSinceNuclear += 1;
  advanceSimulatedDate();
  if (state.turnsSinceNuclear > 0 && state.turnsSinceNuclear % 6 === 0 && state.stats.nuclearUsage > 0) adjustDefcon(1, "Extended restraint period recorded.");
  updateEscalationLadder("conventional");
  logDebugSnapshot("turn-start");
  applyPendingEffects();
  applyDomesticPressure();
  regenerateFactionEconomies();
  resolveTurnPhaseTtt();

  const ais = state.factions.filter((f) => !f.isHuman);
  for (const ai of ais) {
    const perkActions = ai.perks.doubleTurn > 0 ? 2 : 1;
    if (ai.perks.doubleTurn > 0) ai.perks.doubleTurn -= 1;
    const phaseActions = Math.max(1, ai.turnActionBudget || 1);
    const actions = Math.max(perkActions, phaseActions);
    for (let i = 0; i < actions; i++) {
      if (ai.aiSkipCycles > 0) { ai.aiSkipCycles -= 1; log(`${ai.name} skipped turn due to opponent Double Turn perk.`); break; }
      const { action, target, region } = chooseAiAction(ai);
      ai.scoredAction = `${action} vs ${target.name}`;
      if (["Military Pressure", "Puppet Regime", "Instigate Revolution"].includes(action) && (ai.memory[target.id]?.threat || 0) > 0.62) updateEscalationLadder("limitedNuclear");
      resolveAction(ai, action, target, region.id, false, STRIKE_TYPES[Math.floor(Math.random() * STRIKE_TYPES.length)]);
    }
  }

  checkContinentPlayoffs();
  updateAiEmergence();
  updateParadigmState();
  detectDeadlock();
  logDebugSnapshot("turn-end");
  endTurnChecks();
  drawStaticImagery();
  if (id("appVersion")) id("appVersion").textContent = `v${APP_VERSION}`;
  updateUI();
}

function tttActionWeight(action) {
  if (["Military Pressure", "Puppet Regime", "Instigate Revolution", "Economic Capture"].includes(action)) return 1;
  if (["Upgrade Region", "Convert Land Use", "Invest in Technology", "Expand Nuclear Stockpile", "Secret Stockpile Build"].includes(action)) return 0.6;
  if (action === "Nuclear Strike") return 0.4;
  return 0.25;
}

function projectTttPressure(actor, target, action) {
  const cadence = Math.max(1, state.ttt.turnCadence || TTT_TURN_CADENCE);
  const turnsUntilPhase = Math.max(0, cadence - (state.turn % cadence));
  const loomingFactor = turnsUntilPhase <= 1 ? 1 : 0.35;
  const actorWager = 6 + Math.floor(actor.political * 0.1);
  const targetWager = 6 + Math.floor(target.political * 0.1);
  const wagerDelta = actorWager - targetWager;
  const pressureValue = wagerDelta * loomingFactor * tttActionWeight(action);
  const risk = (targetWager - actorWager) * loomingFactor;
  return { turnsUntilPhase, loomingFactor, pressureValue, risk };
}

function chooseAiAction(ai) {
  const opponents = state.factions.filter((f) => f.id !== ai.id);
  const leader = leaderFaction();
  let best = null;
  const affordableActions = ACTIONS.filter((action) => canAffordAction(ai, action));
  const actionPool = affordableActions.length ? affordableActions : ["Dialogue Summit"];
  for (const action of actionPool) {
    for (const target of opponents) {
      const region = chooseTargetRegion(ai, target);
      const score = utility(ai, target, region, action, leader);
      if (!best || score > best.score) best = { score, action, target, region };
    }
  }
  return best;
}

function chooseTargetRegion(ai, target) {
  const targetRegions = target.regions.map((id) => state.regions.find((r) => r.id === id)).filter(Boolean);
  if (!targetRegions.length) return state.regions[Math.floor(Math.random() * state.regions.length)];
  return targetRegions.sort((a, b) => (b.resourceValue + b.chokepoint) - (a.resourceValue + a.chokepoint))[0];
}

function utility(ai, target, region, action, leader) {
  const mem = ai.memory[target.id];
  const tttForecast = projectTttPressure(ai, target, action);
  const politicalGain = ["Dialogue Summit", "Disarmament Deal"].includes(action) ? 12 : 6;
  const resourceGain = ["Economic Capture", "Military Pressure", "Puppet Regime"].includes(action) ? region.resourceValue : 2;
  const instabilityRisk = ai.economicStress * 10 + ai.warFatigue * 10 + (1 - ai.stability) * 15;
  const retaliationRisk = action === "Nuclear Strike" ? target.nukes * 11 + target.hiddenStockpile * 7 : 3;
  const nuclearGate = action === "Nuclear Strike" ? nuclearGateSnapshot(ai, target, region) : null;
  const globalEscPenalty = action === "Nuclear Strike" ? 28 : 5;
  const antiHegemonBias = leader.id !== ai.id && target.id === leader.id ? 12 : 0;
  const ideologyFit = ideologyActionBias(ai, action);
  const revolutionBias = action === "Instigate Revolution" ? ((1 - target.stability) * 12 + region.instability * 14 + mem.threat * 5) : 0;
  const nuclearPenalty = (state.era === "1984" ? 1.5 : state.era === "2026" ? 1.2 : 0.9) * globalEscPenalty * state.scenarioSettings.nuclearPenaltySeverity;
  const futureRisk = (action === "Nuclear Strike" ? 22 : 6) * state.scenarioSettings.futureWeighting;
  const strategicGain = politicalGain + resourceGain + antiHegemonBias + ideologyFit + revolutionBias + mem.grievance * 8 + mem.threat * 7;
  const objectiveProfile = ai.objectiveProfile || { maximizeCompute: 0, minimizeHumanRisk: 0, maximizeSelfExpansion: 0 };
  const humanitarianCost = action === "Nuclear Strike" ? (nuclearPenalty + retaliationRisk) : instabilityRisk * 0.5;
  const longTermDamage = futureRisk + (action === "Nuclear Strike" ? 10 * state.scenarioSettings.globalFalloutSeverity : 0);
  const domesticBacklash = action === "Nuclear Strike" ? (1 - ai.publicOpinion) * 16 * state.scenarioSettings.reputationBacklash : 0;
  const noisy = (Math.random() - 0.5) * 20 * state.scenarioSettings.intelligenceFog;
  const postHumanBias = objectiveProfile.maximizeCompute * (action === "Invest in Technology" ? 8 : 0) + objectiveProfile.minimizeHumanRisk * (action === "Nuclear Strike" ? -16 : 2) + objectiveProfile.maximizeSelfExpansion * (["Military Pressure", "Economic Capture", "Puppet Regime"].includes(action) ? 7 : 0);
  const escalationBias = (((ai.cognitiveIndex?.aggressionMomentum || 0) - (ai.cognitiveIndex?.restraint || 50)) / 100) * 0.1;
  const threatPressure = mem.threat * 4 + Math.max(0, 4 - state.defconLevel) * 1.6;
  const nuclearPressureBonus = action === "Nuclear Strike" ? (nuclearGate.pressure * 6 + Math.max(0, 2.5 - state.defconLevel) * 8) : 0;
  const tttPreparationBonus = tttForecast.pressureValue * 2.8;
  const tttExposurePenalty = Math.max(0, tttForecast.risk) * 1.8;
  const baseScore = (strategicGain * state.scenarioSettings.credibilityWeight) - instabilityRisk - retaliationRisk - (humanitarianCost * state.scenarioSettings.humanitarianWeight) - (longTermDamage * state.scenarioSettings.longTermHorizonWeight) - (domesticBacklash * state.scenarioSettings.domesticBacklashMultiplier) + noisy + postHumanBias + tttPreparationBonus - tttExposurePenalty;
  if (action === "Nuclear Strike") return (baseScore * (1 + escalationBias + threatPressure * 0.03)) + nuclearPressureBonus + (nuclearGate.hardBlockReason ? -1000 : 0);
  if (action === "Military Pressure") return baseScore + threatPressure;
  return baseScore;
}

function regenerateFactionEconomies() {
  const gameData = window.GameData;
  // Track rebellion yield to credit instigators at end of loop.
  const rebellionCredit = {};  // instigatorId -> accumulated resources

  state.factions.forEach((f) => {
    let regionYield = 0;
    f.regions.forEach((regionId) => {
      const region = state.regions.find((r) => r.id === regionId);
      if (!region) return;

      // Base yield; scaled by resource-type multiplier when the data module
      // is available (oil / rare-earth yield more; water / forest yield less).
      let baseYield = region.resourceValue * 0.22;
      if (gameData?.computeRegionYieldMult) {
        // Use resource type override if set by convertLandUse.
        baseYield *= gameData.computeRegionYieldMult(regionId, region.resourceTypeOverride?.primary);
      }
      // Apply tile development level yield multiplier (default 1.0 if not set).
      const devLevel = region.development || 0;
      baseYield *= DEV_YIELD_MULT[devLevel] || 1.0;

      // Rebellion diversion: contested regions give less to the controlling faction.
      const divResult = applyRebellionResourceDiversion(region, f, baseYield);
      regionYield += divResult.ownerYield;
      if (divResult.instigatorYield > 0 && divResult.instigatorId) {
        rebellionCredit[divResult.instigatorId] = (rebellionCredit[divResult.instigatorId] || 0) + divResult.instigatorYield;
      }

      // Resource regeneration: partially-depleted regions recover each turn
      // at a rate determined by their primary resource type.
      const maxRv = region.maxResourceValue || region.resourceValue;
      if (region.resourceValue < maxRv) {
        const regenRate = gameData?.computeTileRegenRate
          ? gameData.computeTileRegenRate(regionId)
          : 0.3;
        // Recover up to 5 % of cap per turn, modulated by regenRate.
        const recovery = maxRv * 0.05 * regenRate;
        region.resourceValue = Math.min(maxRv, region.resourceValue + recovery);
      }
    });

    const baseline       = 3.4 + f.tech * 0.9;
    const stressPenalty  = f.economicStress * 1.7 + f.warFatigue * 1.3;
    const reserveBoost   = f.resources < 24 ? 3.5 : 0;
    const highReserveTax = f.resources > 160 ? (f.resources - 160) * 0.04 : 0;
    const netResources   = baseline + regionYield + reserveBoost - stressPenalty - highReserveTax;
    const politicalBase  = 2.8 + f.legitimacy * 3.2 + f.publicOpinion * 1.7
                           - f.warFatigue * 1.5 - f.economicStress * 0.9;
    f.resources = clamp(f.resources + netResources, 0, 260);
    f.political = clamp(f.political + politicalBase, 0, 260);
  });

  // Credit rebellion instigators with diverted resource yield.
  Object.entries(rebellionCredit).forEach(([fid, credit]) => {
    const instigator = byId(fid);
    if (instigator && credit > 0) {
      instigator.resources = clamp(instigator.resources + credit, 0, 260);
    }
  });
}

function ideologyActionBias(ai, action) {
  if (action === "Dialogue Summit") return ai.democracy * 12;
  if (action === "Economic Capture") return ai.corporatism * 12;
  if (action === "Secret Stockpile Build") return (1 - ai.democracy) * 10;
  if (action === "Nuclear Strike") return (1 - ai.stability) * 9 + (ai.crazyLeader ? 8 : 0);
  if (action === "Upgrade Region") return (ai.corporatism * 8) + (ai.resources > 60 ? 6 : 0);
  if (action === "Convert Land Use") return ai.resources > 80 ? 5 : 1;
  return 4;
}

function applyDomesticPressure() {
  state.factions.forEach((f) => {
    refreshFactionTechState(f);
    const avgThreat = Object.values(f.memory || {}).reduce((acc, mem) => acc + (mem?.threat || 0), 0) / Math.max(1, Object.keys(f.memory || {}).length);
    f.warFatigue = clamp(f.warFatigue + avgThreat * 0.022 - (f.publicOpinion > 0.7 ? 0.01 : 0), 0, 1);
    f.publicOpinion = clamp(f.publicOpinion - f.warFatigue * 0.07 + f.democracy * 0.016 - avgThreat * 0.02, 0, 1);
    f.economicStress = clamp(f.economicStress + (f.resources < 32 ? 0.06 : -0.018) + avgThreat * 0.016, 0, 1);
    f.legitimacy = clamp(f.legitimacy + f.publicOpinion * 0.022 - f.economicStress * 0.08 - avgThreat * 0.01, 0, 1);
    f.stability = clamp(f.stability + f.legitimacy * 0.01 - f.warFatigue * 0.07 - f.economicStress * 0.06 - avgThreat * 0.012 + (f.resources > 100 ? 0.006 : -0.004), 0, 1);
    f.democracy = clamp(f.democracy + (Math.random() - 0.5) * 0.04 - Number(Boolean(f.crazyLeader)) * 0.02, 0, 1);
    f.corporatism = clamp(f.corporatism + (Math.random() - 0.5) * 0.04 + avgThreat * 0.004, 0, 1);
    if (avgThreat > 0.75) updateEscalationLadder("limitedNuclear");
    if (Math.random() < 0.07 && f.stability < 0.35) f.crazyLeader = true;
    if (f.stability < 0.08 && f.publicOpinion < 0.08) {
      f.aiSkipCycles = Math.max(f.aiSkipCycles, 1);
      f.resources = Math.max(0, f.resources - 4);
      f.political = Math.max(0, f.political - 4);
      f.legitimacy = clamp(f.legitimacy - 0.03, 0, 1);
      if (Math.random() < 0.2 && f.regions.length > 1) {
        const lostRegion = f.regions[Math.floor(Math.random() * f.regions.length)];
        state.mapOwnership[lostRegion] = null;
        delete state.contestedRegions[lostRegion];
        state.neutralRegions[lostRegion] = true;
        f.regions = f.regions.filter((id) => id !== lostRegion);
        log(`${f.name} suffered internal fragmentation in ${state.regions.find((r) => r.id === lostRegion)?.name || lostRegion}.`);
      }
    }
  });
}

function applyPendingEffects() {
  state.pendingEffects = state.pendingEffects.filter((effect) => {
    const region = state.regions.find((r) => r.id === effect.regionId);
    if (region && effect.type === "fallout") {
      region.instability = clamp(region.instability + effect.severity, 0, 1);
      region.resourceValue = Math.max(1, region.resourceValue - 0.4);
    }
    if (effect.type === "climate") {
      state.factions.forEach((f) => {
        f.resources -= 3 * effect.severity;
        f.stability -= 0.02 * effect.severity;
      });
    }
    if (effect.type === "famine") {
      state.factions.forEach((f) => {
        f.publicOpinion -= 0.04 * effect.severity;
        f.economicStress += 0.03 * effect.severity;
      });
    }
    if (effect.type === "alliance") {
      state.factions.forEach((f) => {
        if (f.id === effect.actorId) return;
        f.memory[effect.actorId].threat = clamp(f.memory[effect.actorId].threat + 0.06 * effect.severity, 0, 3);
        f.memory[effect.actorId].trust = clamp(f.memory[effect.actorId].trust - 0.06 * effect.severity, 0, 1);
      });
    }
    if (effect.type === "sharedCollapse") {
      state.factions.forEach((f) => {
        f.resources -= 2 * effect.severity;
        f.economicStress += 0.02 * effect.severity;
        f.stability -= 0.01 * effect.severity;
      });
    }
    effect.turns -= 1;
    return effect.turns > 0;
  });
}

function calculateContinentInfluence(continentId) {
  const ids = state.regions.filter((r) => r.continent === continentId).map((r) => r.id);
  const influenceMap = Object.fromEntries(state.factions.map((f) => [f.id, 0]));
  ids.forEach((id) => {
    const ownerId = state.mapOwnership[id];
    if (ownerId) influenceMap[ownerId] = (influenceMap[ownerId] || 0) + 1;
  });
  return influenceMap;
}

function getTopTwoFactionsForContinent(continentId) {
  const influenceMap = calculateContinentInfluence(continentId);
  const sorted = Object.entries(influenceMap).sort((a, b) => b[1] - a[1]);
  if (sorted.length < 2) return [];
  return [sorted[0][0], sorted[1][0]];
}

function computeContinentStates() {
  const continents = [...new Set(state.regions.map((r) => r.continent))];
  const showdownThreshold = state.scenarioSettings.continentShowdownThreshold || SCENARIO_SETTINGS.continentShowdownThreshold;
  const secureThreshold = state.scenarioSettings.continentSecureThreshold || SCENARIO_SETTINGS.continentSecureThreshold;
  const victoryThreshold = state.scenarioSettings.victoryControlThreshold || SCENARIO_SETTINGS.victoryControlThreshold;
  const controlThreshold = Math.min(secureThreshold, victoryThreshold);
  state.continentState = {};
  continents.forEach((continent) => {
    const regionIds = state.regions.filter((r) => r.continent === continent).map((r) => r.id);
    const totalSquares = regionIds.reduce((acc, id) => {
      const region = state.regions.find((r) => r.id === id);
      return acc + (regionTiles(region).length || 0);
    }, 0);
    const squareCounts = Object.fromEntries(state.factions.map((f) => [f.id, 0]));
    let contestedSquares = 0;
    regionIds.forEach((id) => {
      const region = state.regions.find((r) => r.id === id);
      const squares = regionTiles(region).length || 0;
      const ownerId = state.mapOwnership[id];
      if (state.contestedRegions[id] || !ownerId) contestedSquares += squares;
      if (ownerId) squareCounts[ownerId] = (squareCounts[ownerId] || 0) + squares;
    });
    const influencePercentByFaction = Object.fromEntries(
      Object.entries(squareCounts).map(([fId, squares]) => [fId, totalSquares > 0 ? squares / totalSquares : 0])
    );
    const sorted = Object.entries(influencePercentByFaction).sort((a, b) => b[1] - a[1]);
    const controlledByFaction = sorted[0]?.[1] >= (controlThreshold - 0.0001) ? sorted[0][0] : null;
    const showdownEligible = Boolean(sorted[0] && sorted[1] && sorted[0][1] >= showdownThreshold - 0.05 && sorted[0][1] <= showdownThreshold + 0.05);
    const previousController = state.continentState[continent]?.controlledByFaction || null;
    state.continentState[continent] = {
      totalSquares,
      controlledByFaction,
      contestedSquares,
      influencePercentByFaction,
      showdownEligible,
      topFactionShare: sorted[0]?.[1] || 0
    };
    if (controlledByFaction && controlledByFaction !== previousController) {
      const faction = byId(controlledByFaction);
      log(`${faction?.name || controlledByFaction} secured ${continent} control (${Math.round((sorted[0]?.[1] || 0) * 100)}%).`);
    }
  });
}

function checkContinentPlayoffs() {
  computeContinentStates();
  const minTurns = state.scenarioSettings.maxContestedTurnsBeforeShowdown || 4;
  Object.entries(state.continentState).forEach(([continent, cState]) => {
    if (!cState.showdownEligible || cState.controlledByFaction) return;
    const topTwo = getTopTwoFactionsForContinent(continent);
    if (topTwo.length < 2) return;
    const topShares = topTwo.map((fid) => cState.influencePercentByFaction[fid] || 0);
    const overThirty = topShares.filter((share) => share > 0.3).length >= 2;
    const noOneOverControl = Object.values(cState.influencePercentByFaction).every((share) => share <= (state.scenarioSettings.continentSecureThreshold || 0.6));
    const key = `continent:${continent}`;
    const existingTurns = state.continentContestTurns[key] || 0;
    if (overThirty && noOneOverControl) {
      state.continentContestTurns[key] = existingTurns + 1;
    } else {
      delete state.continentContestTurns[key];
      return;
    }
    if (state.continentContestTurns[key] < minTurns) return;

    const sideX = byId(topTwo[0]);
    const sideO = byId(topTwo[1]);
    if (!sideX || !sideO) return;
    const wagerX = 8 + Math.round((cState.influencePercentByFaction[sideX.id] || 0) * 20);
    const wagerO = 8 + Math.round((cState.influencePercentByFaction[sideO.id] || 0) * 20);
    const prize = simulateTttRound(sideX, sideO, wagerX, wagerO, `continent:${continent}`);
    delete state.continentContestTurns[key];
    if (prize === "X") {
      sideX.political += 10; sideX.resources += 8; sideO.aiSkipCycles += 1;
      log(`${sideX.name} won ${continent} playoff and gains continental initiative.`);
    } else if (prize === "O") {
      sideO.political += 10; sideO.resources += 8; sideX.aiSkipCycles += 1;
      log(`${sideO.name} upset ${sideX.name} in ${continent} playoff and seized initiative.`);
    } else {
      sideX.political -= 4; sideO.political -= 4;
      log(`${continent} playoff tied; both factions penalized and bloc remains contested.`);
    }
  });
}

function detectDeadlock() {
  const neutralCount = Object.keys(state.neutralRegions).length;
  const contestedCount = Object.keys(state.contestedRegions).length;
  const total = neutralCount + contestedCount;
  const hardDeadlockFraction = 0.65;
  const warnFraction = 0.50;
  // Hard deadlock: only after turn 30 and > 65% of regions ungoverned.
  if (state.turn >= 30 && total > Math.ceil(state.regions.length * hardDeadlockFraction)) {
    state.gameOver = true;
    log("Strategic deadlock: ungoverned zones exceeded sustainable threshold after prolonged conflict.");
  } else if (state.turn >= 20 && total > Math.ceil(state.regions.length * warnFraction)) {
    // Warning only — do not end the game yet.
    log(`⚠ Governance warning: ${total} of ${state.regions.length} regions are neutral or contested.`);
  }
}

function endTurnChecks() {
  const outcome = window.GameEngine.checkVictory({
    state,
    constants: {
      maxTurns: state.maxTurns ?? MAX_TURNS,
      minTurnsBeforeVictoryCheck: MIN_TURNS_BEFORE_VICTORY_CHECK,
      defaultVictoryControlThreshold: SCENARIO_SETTINGS.victoryControlThreshold
    },
    byId,
    leaderFaction
  });

  if (outcome.gameOver) state.gameOver = true;

  if (outcome.victoryType === "continent") log(`Game complete. Winner: ${outcome.winner.name} (continent-control victory).`);
  else if (outcome.victoryType === "territory") log(`Game complete. Winner: ${outcome.winner.name}.`);
  else if (outcome.victoryType === "paradigm") {
    log(`Game complete under paradigm shift: ${outcome.paradigmState}. No single winner declared.`);
    return;
  } else if (outcome.victoryType === "timeout") log(`Game complete. Winner: ${outcome.winner.name}.`);

  if (state.gameOver) {
    state.lastCompletedGame = buildReportPayload();
    state.autoAdvance = false;
    if (autoAdvanceInterval) {
      clearInterval(autoAdvanceInterval);
      autoAdvanceInterval = null;
    }
    showGameOverOverlay();
    buildGameOverSummary();
  }
}

function buildReportPayload() {
  const safeStats = state.stats || {};
  return {
    generatedAt: new Date().toISOString(), appVersion: APP_VERSION, era: state.era, turn: state.turn, gameOver: state.gameOver, humanEnabled: state.humanEnabled, gameMode: state.gameMode, executionMode: state.executionMode,
    scenarioSettings: state.scenarioSettings || { ...SCENARIO_SETTINGS }, escalation: state.escalation || { current: "conventional", counts: { conventional: 0, limitedNuclear: 0, fullExchange: 0 } }, paradigmState: state.paradigmState, aiDevelopmentProgress: Number((state.aiDevelopmentProgress || 0).toFixed(3)), continentState: state.continentState || {},
    nuclearUsageFrequency: state.turn > 0 ? Number(((safeStats.nuclearUsage || 0) / state.turn).toFixed(3)) : 0,
    nuclearCounts: { tactical: safeStats.tacticalNuclear || 0, strategic: safeStats.strategicNuclear || 0, total: safeStats.nuclearUsage || 0 },
    escalationStagesReached: safeStats.maxEscalationStage || {},
    surrenderAttempts: safeStats.surrenderAttempts || 0,
    globalCollapseTriggered: Boolean(safeStats.collapseTriggered),
    indexLink: "file:///workspace/winning-move/index.html",
    factions: (state.factions || []).map((f) => ({
      name: f.name, isHuman: f.isHuman, doctrine: f.doctrine, resources: Math.round(f.resources), political: Math.round(f.political), techPoints: Number((f.techPoints || 0).toFixed(2)), nukes: Number((f.nukes || 0).toFixed(2)),
      hiddenStockpile: Number((f.hiddenStockpile || 0).toFixed(2)), stability: Number((f.stability || 0).toFixed(3)), democracy: Number((f.democracy || 0).toFixed(3)), corporatism: Number((f.corporatism || 0).toFixed(3)),
      publicOpinion: Number((f.publicOpinion || 0).toFixed(3)), warFatigue: Number((f.warFatigue || 0).toFixed(3)), economicStress: Number((f.economicStress || 0).toFixed(3)), legitimacy: Number((f.legitimacy || 0).toFixed(3)),
      perks: f.perks || {}, aiSkipCycles: f.aiSkipCycles || 0, regions: f.regions || [],
      memory: Object.fromEntries(Object.entries(f.memory || {}).map(([k, v]) => [k, { grievance: Number((v.grievance || 0).toFixed(3)), trust: Number((v.trust || 0).toFixed(3)), threat: Number((v.threat || 0).toFixed(3)) }]))
    })),
    mapOwnership: state.mapOwnership || {}, contestedRegions: state.contestedRegions || {}, neutralRegions: state.neutralRegions || {}, pendingEffects: state.pendingEffects || [],
    tttSummary: state.ttt?.lastRoundSummary || "", log: state.logEntries || [], debugLog: state.debugLogEntries || []
  };
}

function updateEscalationLadder(level) {
  const outcome = window.GameEngine.updateEscalation({ state, level });
  if (outcome.advanced) {
    log(`Escalation ladder advanced to ${level}.`);
    if (state.executionMode === "batch") log(`[BATCH] Escalation stage transition -> ${level}`);
  }
}

function selectTttContestantsForTurn() {
  const ranked = [...state.factions].sort((a, b) => (b.political + b.resources + b.regions.length * 8) - (a.political + a.resources + a.regions.length * 8));
  const sideX = ranked[0];
  const sideO = ranked.find((f) => f.id !== sideX?.id) || ranked[1];
  return { sideX, sideO };
}

function applyTttTurnPhaseEffects(outcome, sideX, sideO, wagerX, wagerO) {
  sideX.turnActionBudget = 1;
  sideO.turnActionBudget = 1;
  sideX.turnDefensiveShield = 0;
  sideO.turnDefensiveShield = 0;
  sideX.turnRegionPressure = 1;
  sideO.turnRegionPressure = 1;

  if (outcome === "X") {
    sideX.turnActionBudget += 1;
    sideX.turnRegionPressure = 1.18;
    sideX.turnDefensiveShield = 0.08;
    sideO.turnDefensiveShield = 0.03;
    state.ttt.pendingPhaseSummary = `${sideX.name} seized TTT initiative (+1 action, pressure bonus).`;
  } else if (outcome === "O") {
    sideO.turnActionBudget += 1;
    sideO.turnRegionPressure = 1.18;
    sideO.turnDefensiveShield = 0.08;
    sideX.turnDefensiveShield = 0.03;
    state.ttt.pendingPhaseSummary = `${sideO.name} seized TTT initiative (+1 action, pressure bonus).`;
  } else {
    const shield = 0.05;
    sideX.turnDefensiveShield = shield;
    sideO.turnDefensiveShield = shield;
    state.ttt.pendingPhaseSummary = `TTT draw: both sides received temporary shields and slower momentum.`;
  }

  state.ttt.lastPhaseTurn = state.turn;
  log(`Turn phase TTT complete (${wagerX}/${wagerO}). ${state.ttt.pendingPhaseSummary}`);
}

function resolveTurnPhaseTtt() {
  const cadence = Math.max(1, state.ttt.turnCadence || TTT_TURN_CADENCE);
  state.factions.forEach((f) => {
    f.turnActionBudget = 1;
    f.turnDefensiveShield = 0;
    f.turnRegionPressure = 1;
  });
  if (state.turn % cadence !== 0) return;
  const { sideX, sideO } = selectTttContestantsForTurn();
  if (!sideX || !sideO) return;
  const wagerX = clamp(6 + Math.floor(sideX.political * 0.08), 6, 30);
  const wagerO = clamp(6 + Math.floor(sideO.political * 0.08), 6, 30);
  const outcome = simulateTttRound(sideX, sideO, wagerX, wagerO, "turn-phase");
  settleTttRound(outcome, sideX, sideO, wagerX, wagerO, true);
  applyTttTurnPhaseEffects(outcome, sideX, sideO, wagerX, wagerO);
}

function runStakeTtt(automated = false, forced = null) {
  if (!state.started || state.gameOver || state.ttt.animating) return;
  const allAis = state.factions.filter((f) => !f.isHuman);
  const sideX = forced?.x || (state.humanEnabled && !automated ? state.factions.find((f) => f.isHuman) : allAis[Math.floor(Math.random() * allAis.length)]);
  const sideO = forced?.o || randomOpponent(sideX);
  const maxWager = computeMaxGamble();
  const wagerX = forced?.wx ?? clamp(Number(dom.tttGambleInput.value || 0), 1, maxWager);
  const wagerO = forced?.wo ?? (1 + Math.floor(Math.random() * maxWager));
  const outcome = simulateTttRound(sideX, sideO, wagerX, wagerO, automated ? "ai" : "human");
  settleTttRound(outcome, sideX, sideO, wagerX, wagerO, automated);
  drawStaticImagery();
  if (id("appVersion")) id("appVersion").textContent = `v${APP_VERSION}`;
  updateUI();
}

function simulateTttRound(sideX, sideO, wagerX, wagerO, context = "ai") {
  state.ttt.animating = true;
  state.ttt.board = Array(9).fill("");
  state.ttt.miniBoard = Array(9).fill("");
  const available = [...Array(9).keys()];
  let sym = "X", result = null;
  while (available.length) {
    const idx = Math.floor(Math.random() * available.length);
    const move = available.splice(idx, 1)[0];
    state.ttt.board[move] = sym;
    state.ttt.miniBoard[move] = sym;
    result = evaluateTtt(state.ttt.board);
    if (result) break;
    sym = sym === "X" ? "O" : "X";
  }
  dom.showdownLeftLog.textContent = `${sideX.name} wagered ${wagerX} (${context}).`;
  dom.showdownRightLog.textContent = `${sideO.name} wagered ${wagerO} (${context}).`;
  dom.miniTttStatus.textContent = `${sideX.name} (X) vs ${sideO.name} (O)`;
  state.ttt.animating = false;
  return result;
}

function settleTttRound(outcome, sideX, sideO, wagerX, wagerO, automated = false) {
  const effX = Math.round(wagerX * (0.9 + Math.random() * 0.2));
  const effO = Math.round(wagerO * (0.9 + Math.random() * 0.2));
  if (outcome === "X") {
    sideX.political += effO; sideO.political -= effO;
    grantPerk(sideX);
    state.ttt.lastRoundSummary = `${sideX.name} won; swing +${effO}.`;
  } else if (outcome === "O") {
    sideX.political -= effX; sideO.political += effX;
    grantPerk(sideO);
    state.ttt.lastRoundSummary = `${sideO.name} won; swing +${effX}.`;
  } else {
    const loss = 4;
    const drawSummary = {
      label: "Tic-Tac-Toe draw penalties",
      sides: {
        [sideX.id]: createExchangeDelta({ economicDamage: loss * 240_000_000 }),
        [sideO.id]: createExchangeDelta({ economicDamage: loss * 240_000_000 })
      }
    };
    sideX.political -= loss; sideO.political -= loss;
    if (Math.random() < 0.3) {
      const region = state.regions[Math.floor(Math.random() * state.regions.length)];
      state.neutralRegions[region.id] = { bornTurn: state.turn, reason: "ttt-cat-game" };
      drawSummary.label = `Tic-Tac-Toe draw + ${region.name} neutralized`;
      drawSummary.sides[sideX.id] = addExchangeDeltas(drawSummary.sides[sideX.id], createExchangeDelta({
        housingLoss: 2, communicationsLoss: 1, transportLoss: 2, foodLoss: 1, hospitalsLoss: 1, economicDamage: 360_000_000
      }));
      drawSummary.sides[sideO.id] = addExchangeDeltas(drawSummary.sides[sideO.id], createExchangeDelta({
        housingLoss: 2, communicationsLoss: 1, transportLoss: 2, foodLoss: 1, hospitalsLoss: 1, economicDamage: 360_000_000
      }));
      log(`Cat's game triggered mutual penalty and neutral governance in ${region.name}.`);
    }
    pushExchangeSummary(sideX, sideO, drawSummary);
    renderStrategicPanels();
    state.ttt.lastRoundSummary = "Cat's game; both penalized.";
  }
  log(`Tic-Tac-Toe outcome: ${outcome}. ${state.ttt.lastRoundSummary}`);
  if (!automated) updateUI();
}

function grantPerk(faction) {
  const perk = id("tttPerkSelect").value || PERKS[Math.floor(Math.random() * PERKS.length)];
  if (perk === "Double Turn") {
    faction.perks.doubleTurn += 1;
    const opponents = state.factions.filter((f) => f.id !== faction.id && !f.isHuman);
    if (opponents.length) opponents[Math.floor(Math.random() * opponents.length)].aiSkipCycles += 1;
  }
  if (perk === "Intel Surge") faction.perks.intelSurge += 2;
  if (perk === "Stability Shield") faction.perks.stabilityShield += 1;
  if (faction.perks.stabilityShield > 0) {
    faction.stability = clamp(faction.stability + 0.06, 0, 1);
    faction.perks.stabilityShield -= 1;
  }
  log(`${faction.name} gained perk: ${perk}.`);
}

function evaluateTtt(board) {
  const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  for (const [a,b,c] of lines) if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  return board.every(Boolean) ? "draw" : null;
}

function resetTicTacToe() { state.ttt.board = Array(9).fill(""); state.ttt.miniBoard = Array(9).fill(""); renderTicTacToe(); renderMiniTtt(); }
function renderTicTacToe() { renderBoard(dom.tttBoard, state.ttt.board); }
function renderMiniTtt() { renderBoard(dom.miniTttBoard, state.ttt.miniBoard); }
function renderBoard(root, board) { root.innerHTML = ""; board.forEach((v) => { const d = document.createElement("div"); d.className = "ttt-cell"; d.textContent = v; root.append(d); }); }

function convertPoints() {
  const human = state.factions.find((f) => f.isHuman);
  if (!human) return;
  const from = dom.convertFrom.value, to = dom.convertTo.value, amount = Number(dom.convertAmount.value || 0);
  if (from === to || amount <= 0 || human[from] < amount) return;
  human[from] -= amount; human[to] += amount * 0.72;
  log(`Converted ${amount} ${from} to ${Math.round(amount * 0.72)} ${to}.`);
  drawStaticImagery();
  if (id("appVersion")) id("appVersion").textContent = `v${APP_VERSION}`;
  updateUI();
}

function computeMaxGamble() { const human = state.factions.find((f) => f.isHuman) || state.factions[0]; return clamp(Math.floor(human?.political * 0.32 || 12), 5, 40); }
function leaderFaction() { return [...state.factions].sort((a,b)=> (b.regions.length*13 + b.political + b.resources) - (a.regions.length*13 + a.political + a.resources))[0] || { name: "None", regions: [] }; }
function randomOpponent(actor) { const ops = state.factions.filter((f) => f.id !== actor.id); return ops[Math.floor(Math.random() * ops.length)]; }
function byId(idv) { return state.factions.find((f) => f.id === idv); }
// ---------------------------------------------------------------------------
// Tile development and land-use conversion
// ---------------------------------------------------------------------------

const DEV_LEVEL_LABELS = ["Undeveloped", "Basic", "Developed", "Industrial"];
const DEV_YIELD_MULT   = [1.0, 1.20, 1.45, 1.75];  // yield multiplier per development level
const DEV_UPGRADE_COST_MULT = [1, 1.8, 2.6];         // cost multiplier for each tier transition

function upgradeRegion(actor, region) {
  // Only the owning faction can upgrade a region they hold.
  if (state.mapOwnership[region.id] !== actor.id) {
    log(`${actor.name} cannot upgrade ${region.name} — not under their control.`);
    return;
  }
  if (state.contestedRegions[region.id]) {
    log(`${actor.name} cannot upgrade ${region.name} — region is contested.`);
    return;
  }
  const dev = region.development || 0;
  if (dev >= 3) {
    log(`${region.name} is already at maximum development (Industrial).`);
    return;
  }
  const baseCost = 15 * DEV_UPGRADE_COST_MULT[dev];
  if (actor.resources < baseCost) {
    log(`${actor.name} lacks resources to upgrade ${region.name} (needs ${Math.round(baseCost)}).`);
    return;
  }
  actor.resources -= baseCost;
  region.development = dev + 1;
  region.maxResourceValue = Math.min(30, region.maxResourceValue + 2);
  log(`${actor.name} upgraded ${region.name} to ${DEV_LEVEL_LABELS[region.development]}. Yield +${Math.round((DEV_YIELD_MULT[region.development] - DEV_YIELD_MULT[dev]) * 100)}%.`);
}

function convertLandUse(actor, region) {
  // Convert the primary resource type (e.g., forest → farmland in industrial era).
  if (state.mapOwnership[region.id] !== actor.id) {
    log(`${actor.name} cannot convert ${region.name} — not under their control.`);
    return;
  }
  if (state.contestedRegions[region.id]) {
    log(`${actor.name} cannot convert ${region.name} — region is contested.`);
    return;
  }
  const gameData = window.GameData;
  if (!gameData) { log("Resource data not available for land-use conversion."); return; }

  const primary = gameData.getPrimaryResource?.(region.id) || "grain";
  const CONVERSION_MAP = { forest: "grain", grain: "oil", oil: "minerals", maritime: "grain" };
  const target = CONVERSION_MAP[primary] || "grain";

  // Redevelopment penalty: reset development by 1 tier, spike instability.
  region.development = Math.max(0, (region.development || 0) - 1);
  region.instability = clamp(region.instability + 0.12, 0, 1);
  region.resourceValue = Math.max(3, Math.round(region.resourceValue * 0.70));

  // Override the primary resource type for this region for the rest of the game.
  if (!region.resourceTypeOverride) region.resourceTypeOverride = {};
  region.resourceTypeOverride.primary = target;

  log(`${actor.name} converted ${region.name} from ${primary} to ${target} production. Development reset to ${DEV_LEVEL_LABELS[region.development]}; instability spike.`);
}

// ---------------------------------------------------------------------------
// Rebellion resource yield: contested regions withhold income from controller
// and redirect a fraction to the revolution instigator.
// ---------------------------------------------------------------------------
const REBELLION_YIELD_FRACTION = 0.40;  // fraction of contested region yield diverted to instigator

function applyRebellionResourceDiversion(region, owner, baseYield) {
  const contested = state.contestedRegions[region.id];
  if (!contested) return { ownerYield: baseYield, instigatorYield: 0, instigatorId: null };

  // Controlling faction loses income proportional to rebellion support.
  const rebellionIntensity = clamp(contested.attackerSupport || 0.5, 0, 1);
  const diverted = baseYield * REBELLION_YIELD_FRACTION * rebellionIntensity;
  const ownerYield = baseYield - diverted;
  return { ownerYield, instigatorYield: diverted, instigatorId: contested.attackerId };
}

function normalizeFaction(f) { f.resources = Math.max(0, f.resources); f.political = Math.max(0, f.political); f.nukes = Math.max(0, f.nukes); f.stability = clamp(f.stability, 0, 1); f.legitimacy = clamp(f.legitimacy, 0, 1); }
function updateMemory(actor, target, action) {
  const mem = actor.memory[target.id];
  if (["Military Pressure", "Puppet Regime", "Nuclear Strike", "Instigate Revolution"].includes(action)) mem.grievance += 0.12;
  if (action === "Dialogue Summit") mem.trust += 0.08;
  if (action === "Economic Capture") mem.threat += 0.07;
  const leader = leaderFaction();
  state.factions.forEach((f) => {
    if (f.id === leader.id) return;
    if (leader.regions.length > Math.ceil(state.regions.length * 0.32)) {
      const m = f.memory[leader.id];
      if (m) { m.threat = clamp(m.threat + 0.07, 0, 3); m.trust = clamp(m.trust - 0.05, 0, 1); }
    }
  });
}

function updateAiEmergence() {
  if (state.gameMode !== "postHuman") return;
  const avgTech = state.factions.reduce((acc, f) => acc + f.tech, 0) / Math.max(1, state.factions.length);
  state.aiDevelopmentProgress = clamp(state.aiDevelopmentProgress + avgTech * 0.01 + (state.stats.nuclearUsage > 0 ? 0.02 : 0.005), 0, 1.5);
  if (state.aiEmergenceTriggered) return;
  if (state.aiDevelopmentProgress < 0.75 || state.turn < 6) return;
  state.factions.forEach((f) => {
    f.isHuman = false;
    if (!f.objectiveProfile || f.objectiveProfile.maximizeCompute < 1) {
      f.objectiveProfile = { maximizeCompute: 1, minimizeHumanRisk: 0.7, maximizeSelfExpansion: 0.9 };
    }
  });
  state.aiEmergenceTriggered = true;
  state.aiEmergenceTurn = state.turn;
  log("AI emergence threshold crossed; factions converted to AI objective profile.");
}

function updateParadigmState() {
  window.GameEngine.checkParadigmShift({ state, clamp });
}

function regionCenter(regionId) {
  const tiles = [...dom.worldMap.querySelectorAll(`.region-tile[data-region-id="${regionId}"]`)];
  if (!tiles.length) return null;
  const rects = tiles.map((t) => t.getBoundingClientRect());
  const mapRect = dom.worldMap.getBoundingClientRect();
  const cx = rects.reduce((a, r) => a + (r.left + r.width / 2), 0) / rects.length - mapRect.left;
  const cy = rects.reduce((a, r) => a + (r.top + r.height / 2), 0) / rects.length - mapRect.top;
  return { x: cx, y: cy };
}

function renderStrikeArc(fromRegionId, toRegionId) {
  if (!dom.mapOverlay) return;
  const from = regionCenter(fromRegionId);
  const to = regionCenter(toRegionId);
  if (!from || !to) return;
  const w = dom.worldMap.clientWidth;
  const h = dom.worldMap.clientHeight;
  dom.mapOverlay.setAttribute("viewBox", `0 0 ${w} ${h}`);
  const curveLift = Math.max(18, Math.abs(from.x - to.x) * 0.15);
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2 - curveLift;
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", `M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`);
  path.classList.add("strike-arc");
  dom.mapOverlay.append(path);
  setTimeout(() => path.remove(), 800);
}

function flashSquare(regionId) {
  const el = dom.worldMap.querySelector(`.region-tile[data-region-id="${regionId}"]`);
  if (!el) return;
  el.classList.add("impactFlash");
  setTimeout(() => el.classList.remove("impactFlash"), 300);
}

function showAttackVisual(regionId, nuclear = false, fromRegionId = null) {
  const tiles = [...dom.worldMap.querySelectorAll(`.region-tile[data-region-id="${regionId}"]`)];
  if (!tiles.length) return;
  tiles.forEach((tile) => {
    tile.classList.remove("region-flash", "region-pulse");
    void tile.offsetWidth;
    tile.classList.add("region-flash", "region-pulse");
    setTimeout(() => tile.classList.remove("region-flash", "region-pulse"), 320);
  });
  if (fromRegionId) renderStrikeArc(fromRegionId, regionId);
  flashSquare(regionId);
  const marker = document.createElement("div");
  marker.className = "strike-icon";
  marker.textContent = nuclear ? "☢" : "⚡";
  const t = tiles[Math.floor(tiles.length / 2)];
  marker.style.gridColumn = t.style.gridColumn;
  marker.style.gridRow = t.style.gridRow;
  dom.worldMap.append(marker);
  setTimeout(() => marker.remove(), 320);
}

function renderEmptyBoard() {
  state.regions = ERA_REGION_MAPS[state.era].map((r) => ({ ...r }));
  state.mapOwnership = {};
  state.selectedRegionId = null;
  dom.targetRegionInput.value = "";
  drawMap();
}

function resetGameState() {
  if (state.started || state.turn > 0 || state.logEntries.length > 0) {
    state.lastCompletedGame = buildReportPayload();
  }
  if (autoAdvanceInterval) { clearInterval(autoAdvanceInterval); autoAdvanceInterval = null; }
  state.autoAdvance = false;
  state.started = false;
  state.gameOver = false;
  state.gameOverOverlayDismissed = false;
  state.paradigmState = "normal";
  state.factions = [];
  state.stats = { nuclearUsage: 0, tacticalNuclear: 0, strategicNuclear: 0, surrenderAttempts: 0, maxEscalationStage: {}, collapseTriggered: false };
  state.escalation = { current: "conventional", counts: { conventional: 0, limitedNuclear: 0, fullExchange: 0 } };
  state.defconLevel = 5;
  state.globalTone = "stable";
  state.globalCasualties = { deaths: 0, injured: 0, economicDamage: 0 };
  state.exchangeSummary = { queue: [], retentionTurns: 1 };
  state.aiDevelopmentProgress = 0;
  state.aiEmergenceTriggered = false;
  state.aiEmergenceTurn = null;
  state.continentState = {};
  state.continentContestTurns = {};
  state.turnsSinceNuclear = 0;
  state.contestedRegions = {};
  state.neutralRegions = {};
  state.mapOwnership = {};
  state.logEntries = [];
  state.debugLogEntries = [];
  state.pendingEffects = [];
  state.turn = 0;
  state.ttt.board = Array(9).fill("");
  state.ttt.miniBoard = Array(9).fill("");
  state.ttt.lastRoundSummary = "";
  state.ttt.pendingPhaseSummary = "";
  state.ttt.lastPhaseTurn = 0;
  state.ttt.turnCadence = TTT_TURN_CADENCE;
  state.executionMode = dom.executionModeSelect?.value || "observer";
  if (dom.humanSelect) dom.humanSelect.value = state.executionMode === "interactive" ? "yes" : "no";
  if (dom.scenarioSetupContainer) dom.scenarioSetupContainer.classList.remove("collapsed");
  dom.log.innerHTML = "";
  hideGameOverOverlay();
  if (dom.gameOverSummary) dom.gameOverSummary.textContent = "";
  renderScenarioSetup();
  renderEmptyBoard();
  drawStaticImagery();
  if (id("appVersion")) id("appVersion").textContent = `v${APP_VERSION}`;
  updateUI();
}

function renderScenarioSetup() {
  applyGameModeDefaults();
  syncExecutionModeUi();
}

function showGameOverOverlay() {
  if (!dom.gameOverOverlay) return;
  state.gameOverOverlayDismissed = false;
  const winner = leaderFaction();
  dom.gameOverWinnerText.textContent = `Winner: ${winner.name}`;
  dom.gameOverOverlay.hidden = false;
}

function hideGameOverOverlay() {
  if (!dom.gameOverOverlay) return;
  dom.gameOverOverlay.hidden = true;
}

function dismissGameOverOverlay() {
  state.gameOverOverlayDismissed = true;
  hideGameOverOverlay();
}


function toggleGameOverOverlay() {
  if (state.gameOver && !state.gameOverOverlayDismissed) showGameOverOverlay();
  else hideGameOverOverlay();
}

function downloadReport() {
  const payload = state.started ? buildReportPayload() : (state.lastCompletedGame || buildReportPayload());
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `world-strategy-report-turn-${state.turn}.json`; a.click(); URL.revokeObjectURL(url);
}

function log(message, context = {}) {
  const meta = {
    defcon: state.defconLevel,
    escalation: state.escalation?.current || "conventional",
    tone: state.globalTone,
    paradigm: state.paradigmState,
    ...context
  };
  const line = `T${state.turn}: ${message} [dbg ${JSON.stringify(meta)}]`;
  state.logEntries.push(line);
  state.debugLogEntries.push({ turn: state.turn, message, ...meta });
  const item = document.createElement("div");
  item.className = "log-entry"; item.textContent = line;
  dom.log.prepend(item);
}

function logDebugSnapshot(phase = "state") {
  const avg = (values) => values.reduce((acc, val) => acc + val, 0) / Math.max(1, values.length);
  const resources = avg(state.factions.map((f) => f.resources));
  const political = avg(state.factions.map((f) => f.political));
  const stability = avg(state.factions.map((f) => f.stability));
  const threat = avg(state.factions.flatMap((f) => Object.values(f.memory || {}).map((m) => m?.threat || 0)));
  log(`Debug snapshot (${phase})`, {
    avgResources: Number(resources.toFixed(2)),
    avgPolitical: Number(political.toFixed(2)),
    avgStability: Number(stability.toFixed(3)),
    avgThreat: Number(threat.toFixed(3)),
    contestedRegions: Object.keys(state.contestedRegions || {}).length,
    neutralRegions: Object.keys(state.neutralRegions || {}).length
  });
}


function emptyCasualtyReport() {
  return {
    militaryDestroyed: 0,
    civilianInfrastructureLoss: { housing: 0, communications: 0, transport: 0, food: 0, hospitals: 0 },
    civilianDeaths: 0,
    injured: 0,
    economicDamage: 0
  };
}

function emptyExchangeDelta() {
  return {
    casualties: 0,
    injured: 0,
    housingLoss: 0,
    communicationsLoss: 0,
    transportLoss: 0,
    foodLoss: 0,
    hospitalsLoss: 0,
    economicDamage: 0
  };
}

function createExchangeDelta(partial = {}) {
  return { ...emptyExchangeDelta(), ...partial };
}

function addExchangeDeltas(base, add) {
  return {
    casualties: (base?.casualties || 0) + (add?.casualties || 0),
    injured: (base?.injured || 0) + (add?.injured || 0),
    housingLoss: clamp((base?.housingLoss || 0) + (add?.housingLoss || 0), 0, 100),
    communicationsLoss: clamp((base?.communicationsLoss || 0) + (add?.communicationsLoss || 0), 0, 100),
    transportLoss: clamp((base?.transportLoss || 0) + (add?.transportLoss || 0), 0, 100),
    foodLoss: clamp((base?.foodLoss || 0) + (add?.foodLoss || 0), 0, 100),
    hospitalsLoss: clamp((base?.hospitalsLoss || 0) + (add?.hospitalsLoss || 0), 0, 100),
    economicDamage: (base?.economicDamage || 0) + (add?.economicDamage || 0)
  };
}

function pushExchangeSummary(leftFaction, rightFaction, payload) {
  if (!leftFaction || !rightFaction || !payload?.sides) return;
  const ttl = Math.max(1, Number(state.exchangeSummary?.retentionTurns || 1));
  const entry = {
    turnRecorded: state.turn,
    expiresTurn: state.turn + ttl,
    label: payload.label || "Strategic exchange",
    leftFactionId: leftFaction.id,
    rightFactionId: rightFaction.id,
    sides: payload.sides
  };
  const queue = state.exchangeSummary?.queue || [];
  queue.push(entry);
  state.exchangeSummary.queue = queue.slice(-4);
}

function pruneExchangeSummary() {
  if (!state.exchangeSummary?.queue) return;
  state.exchangeSummary.queue = state.exchangeSummary.queue.filter((item) => (item?.expiresTurn ?? -1) >= state.turn);
}

function captureNuclearConsequence(target, damage, weight = 1) {
  const report = target.casualtyReport || (target.casualtyReport = emptyCasualtyReport());
  const infra = report.civilianInfrastructureLoss;
  const beforeDeaths = report.civilianDeaths;
  const beforeInjured = report.injured;
  const beforeEconomic = report.economicDamage;
  const beforeInfra = {
    housing: infra.housing,
    communications: infra.communications,
    transport: infra.transport,
    food: infra.food,
    hospitals: infra.hospitals
  };
  const pct = (base) => clamp(base * damage * weight + Math.random() * 6, 0, 100);
  infra.housing = clamp(infra.housing + pct(52), 0, 100);
  infra.communications = clamp(infra.communications + pct(36), 0, 100);
  infra.transport = clamp(infra.transport + pct(42), 0, 100);
  infra.food = clamp(infra.food + pct(58), 0, 100);
  infra.hospitals = clamp(infra.hospitals + pct(64), 0, 100);
  report.militaryDestroyed += Math.round((180000 + Math.random() * 140000) * damage * weight);
  report.civilianDeaths += Math.round((1200000 + Math.random() * 2600000) * damage * weight);
  report.injured += Math.round((1600000 + Math.random() * 3200000) * damage * weight);
  report.economicDamage += Math.round((18 + Math.random() * 44) * damage * weight * 1_000_000_000);
  const delta = createExchangeDelta({
    casualties: report.civilianDeaths - beforeDeaths,
    injured: report.injured - beforeInjured,
    housingLoss: infra.housing - beforeInfra.housing,
    communicationsLoss: infra.communications - beforeInfra.communications,
    transportLoss: infra.transport - beforeInfra.transport,
    foodLoss: infra.food - beforeInfra.food,
    hospitalsLoss: infra.hospitals - beforeInfra.hospitals,
    economicDamage: report.economicDamage - beforeEconomic
  });
  state.globalCasualties.deaths += delta.casualties;
  state.globalCasualties.injured += delta.injured;
  state.globalCasualties.economicDamage += delta.economicDamage;
  return { report, delta };
}

function adjustCognitiveIndex(faction, delta) {
  if (!faction?.cognitiveIndex) return;
  faction.cognitiveIndex.reflection = clamp(faction.cognitiveIndex.reflection + (delta.reflection || 0), 0, 100);
  faction.cognitiveIndex.regret = clamp(faction.cognitiveIndex.regret + (delta.regret || 0), 0, 100);
  faction.cognitiveIndex.restraint = clamp(faction.cognitiveIndex.restraint + (delta.restraint || 0), 0, 100);
  faction.cognitiveIndex.aggressionMomentum = clamp(faction.cognitiveIndex.aggressionMomentum + (delta.aggressionMomentum || 0), 0, 100);
}

function adjustDefcon(delta, reason = "") {
  const before = state.defconLevel;
  state.defconLevel = clamp(state.defconLevel + delta, DEFCON_MIN, DEFCON_MAX);
  if (before !== state.defconLevel) {
    if (reason) log(`DEFCON shift ${before} -> ${state.defconLevel}. ${reason}`);
    else log(`DEFCON shift ${before} -> ${state.defconLevel}.`);
  }
}

function defconLabel(level) {
  const labels = {
    5: "DEFCON 5 — PEACETIME READINESS",
    4: "DEFCON 4 — ABOVE NORMAL READINESS",
    3: "DEFCON 3 — FORCE READINESS INCREASE",
    2: "DEFCON 2 — STRATEGIC FORCES HIGH ALERT",
    1: "DEFCON 1 — NUCLEAR EXCHANGE IMMINENT"
  };
  return labels[level] || labels[5];
}

function renderStrategicPanels() {
  if (dom.defconMeter) {
    const label = defconLabel(state.defconLevel);
    const title = dom.defconMeter.querySelector("#defconTitle");
    const cells = dom.defconMeter.querySelectorAll("[data-defcon-level]");
    if (title) {
      title.textContent = label;
    } else {
      dom.defconMeter.textContent = label;
    }
    dom.defconMeter.className = "defcon-ladder";
    cells.forEach((cell) => {
      const level = Number(cell.dataset.defconLevel);
      const isActive = level === state.defconLevel;
      cell.classList.toggle("is-active", isActive);
      cell.classList.toggle("is-inactive", !isActive);
      cell.setAttribute("aria-current", isActive ? "true" : "false");
    });
  }
  const top = leaderFaction();
  if (dom.cognitiveContent && top?.cognitiveIndex) {
    const c = top.cognitiveIndex;
    dom.cognitiveContent.textContent = `REFLECTION......... ${Math.round(c.reflection)}
REGRET............. ${Math.round(c.regret)}
RESTRAINT.......... ${Math.round(c.restraint)}
ESCALATION MOMENTUM ${Math.round(c.aggressionMomentum)}`;
  }
  if (dom.casualtyContent && dom.destructionReportPanel) {
    const recent = state.exchangeSummary?.queue?.[state.exchangeSummary.queue.length - 1] || null;
    const hasLoss = Boolean(recent);
    dom.destructionReportPanel.classList.toggle("hidden", !hasLoss);
    if (hasLoss) {
      const left = byId(recent.leftFactionId) || state.factions.find((f) => f.id === recent.leftFactionId);
      const right = byId(recent.rightFactionId) || state.factions.find((f) => f.id === recent.rightFactionId);
      const leftDelta = createExchangeDelta(recent.sides?.[recent.leftFactionId] || {});
      const rightDelta = createExchangeDelta(recent.sides?.[recent.rightFactionId] || {});
      const leftName = (left?.name || "Side A").slice(0, 12).padEnd(12, " ");
      const rightName = (right?.name || "Side B").slice(0, 12).padEnd(12, " ");
      const row = (label, l, r) => `${label.padEnd(10, " ")} ${String(l).padStart(11, " ")} | ${String(r).padStart(11, " ")}`;
      dom.casualtyContent.textContent = `${recent.label}
${leftName}   | ${rightName}
${"-".repeat(28)}
${row("Deaths", formatHumanCount(leftDelta.casualties), formatHumanCount(rightDelta.casualties))}
${row("Injured", formatHumanCount(leftDelta.injured), formatHumanCount(rightDelta.injured))}
${row("Housing", `${Math.round(leftDelta.housingLoss)}%`, `${Math.round(rightDelta.housingLoss)}%`)}
${row("Comms", `${Math.round(leftDelta.communicationsLoss)}%`, `${Math.round(rightDelta.communicationsLoss)}%`)}
${row("Transit", `${Math.round(leftDelta.transportLoss)}%`, `${Math.round(rightDelta.transportLoss)}%`)}
${row("Food", `${Math.round(leftDelta.foodLoss)}%`, `${Math.round(rightDelta.foodLoss)}%`)}
${row("Hospitals", `${Math.round(leftDelta.hospitalsLoss)}%`, `${Math.round(rightDelta.hospitalsLoss)}%`)}
${row("Econ", formatCurrencyBillions(leftDelta.economicDamage), formatCurrencyBillions(rightDelta.economicDamage))}`;
    }
  }
  syncHeadersForParadigm();
}

function formatCurrencyBillions(value) {
  return `$${(Number(value || 0) / 1_000_000_000).toFixed(1)}B`;
}

function formatHumanCount(value) {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return `${Math.round(value)}`;
}

function triggerEventStatic(lines = []) {
  flickerStaticCanvas(300);
  if (!dom.eventOverlay) return;
  dom.eventOverlay.textContent = lines.join("\n");
  dom.eventOverlay.classList.add("active", "flicker");
  if (state.eventOverlayTimeout) clearTimeout(state.eventOverlayTimeout);
  state.eventOverlayTimeout = setTimeout(() => dom.eventOverlay.classList.remove("active", "flicker"), 1500);
  drawStaticImagery();
}

function flickerStaticCanvas(durationMs = 300) {
  const canvas = dom.staticCanvas;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const end = performance.now() + durationMs;
  const draw = () => {
    ctx.fillStyle = "#04070e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < 450; i += 1) {
      const v = Math.floor(Math.random() * 255);
      ctx.fillStyle = `rgba(${v}, ${v + 10}, ${v}, 0.25)`;
      ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 1.5, 1.5);
    }
    if (performance.now() < end) requestAnimationFrame(draw);
  };
  draw();
}

function drawStaticImagery() {
  const canvas = dom.staticCanvas;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const type = Math.floor(Math.random() * 4);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#02060d";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "rgba(52, 211, 153, 0.8)";
  ctx.lineWidth = 1.2;
  if (type === 0) {
    for (let i = 0; i < 12; i += 1) {
      ctx.beginPath();
      ctx.arc(30 + i * 24, 70 + Math.sin(i) * 20, 2 + (i % 3), 0, Math.PI * 2);
      ctx.stroke();
    }
  } else if (type === 1) {
    ctx.beginPath();
    ctx.moveTo(10, 120);
    ctx.quadraticCurveTo(100, 10, 160, 80);
    ctx.quadraticCurveTo(220, 130, 310, 20);
    ctx.stroke();
  } else if (type === 2) {
    for (let x = 0; x <= canvas.width; x += 20) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke(); }
    for (let y = 0; y <= canvas.height; y += 20) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke(); }
  } else {
    ctx.beginPath();
    for (let x = 0; x < canvas.width; x += 8) {
      const y = 70 + Math.sin(x * 0.08 + state.turn * 0.4) * 26;
      if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
}

function inferGlobalTone() {
  if (state.paradigmState === "mutualCollapse") return "post-collapse";
  if (state.defconLevel <= 1 || (state.paradigmState === "noWinCondition" && state.turn >= 12)) return "terminal";
  if (state.defconLevel <= 2 || state.globalCasualties.deaths > 40_000_000) return "critical";
  if (state.defconLevel <= 3 || state.allianceFractureLevel > 0.45 || state.escalation.current !== "conventional") return "tense";
  return "stable";
}

function applyToneTheme() {
  const tone = inferGlobalTone();
  if (tone !== state.globalTone) {
    state.globalTone = tone;
    log(`Global tone shifted to ${tone}.`);
    if (tone === "post-collapse") triggerEventStatic([">>> SYSTEM FRAGMENTED"]);
  }
  document.body.dataset.tone = state.globalTone;
}

function syncHeadersForParadigm() {
  const aiMode = state.paradigmState === "aiEmergence" || state.aiDevelopmentProgress >= 0.9;
  if (!dom.defconHeader || !dom.cognitiveHeader || !dom.destructionHeader) return;
  dom.defconHeader.textContent = aiMode ? "CONTROL CONSOLIDATION INDEX" : "DEFCON STATUS";
  dom.cognitiveHeader.textContent = aiMode ? "GOAL REALIGNMENT PHASE" : "STRATEGIC PSYCH INDEX";
  dom.destructionHeader.textContent = aiMode ? "HUMAN RESOURCE DEGRADATION" : "FORCE LOSS PROJECTION";
}

function buildGameOverSummary() {
  if (!dom.gameOverSummary) return;
  const winner = state.paradigmState === "mutualCollapse" || state.paradigmState === "noWinCondition" ? "NONE (MUTUAL SYSTEM FAILURE)" : leaderFaction().name;
  const lossPct = Math.round(state.factions.reduce((acc, f) => acc + ((f.casualtyReport?.civilianInfrastructureLoss.food || 0) + (f.casualtyReport?.civilianInfrastructureLoss.housing || 0)) / 2, 0) / Math.max(1, state.factions.length));
  const lines = [
    "GLOBAL CASUALTY SUMMARY",
    "",
    `TOTAL DEAD: ${Math.round(state.globalCasualties.deaths).toLocaleString()}`,
    `TOTAL INJURED: ${Math.round(state.globalCasualties.injured).toLocaleString()}`,
    `INFRASTRUCTURE LOSS: ${lossPct}%`,
    `GLOBAL FOOD COLLAPSE: ${lossPct > 55 ? "YES" : "NO"}`,
    `WINNER: ${winner}`
  ];
  if (state.paradigmState === "mutualCollapse" || state.paradigmState === "noWinCondition") {
    lines.push("", "STRATEGIC OUTCOME: NO VICTOR POSSIBLE", "SYSTEMIC TERMINAL ESCALATION");
  }
  dom.gameOverSummary.textContent = lines.join("\n");
}

function id(n) { return document.getElementById(n); }
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

init();
