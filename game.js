const ERA_PRESETS = {
  2026: { techBoost: 1.2, diplomacyBoost: 1.2, warFriction: 1.0, nuclearNorm: 1.3, doctrine: "Multipolar Adaptive" },
  1984: { techBoost: 1.0, diplomacyBoost: 0.82, warFriction: 1.1, nuclearNorm: 1.45, doctrine: "Cold War Deterrence" },
  1939: { techBoost: 0.76, diplomacyBoost: 0.7, warFriction: 1.35, nuclearNorm: 0.55, doctrine: "Industrial Total War" }
};

const ACTIONS = [
  "Military Pressure", "Economic Capture", "Puppet Regime", "Support Sovereignty", "Dialogue Summit",
  "Invest in Technology", "Expand Nuclear Stockpile", "Secret Stockpile Build", "Disarmament Deal", "Nuclear Strike",
  "Deploy Nuclear Triad", "Instigate Revolution"
];

const PERKS = ["Double Turn", "Intel Surge", "Stability Shield"];
const STRIKE_TYPES = ["Counterforce", "Countervalue", "Demonstration", "Submarine Launch", "Silo Saturation", "Bomber Penetration"];
const ERA_TECH_UNLOCKS = {
  1939: ["submarine"],
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

const MAX_TURNS = 60;
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
ERA_REGION_MAPS[1939] = ERA_REGION_MAPS[2026].map((x) => ({ ...x, id: `39_${x.id}`, instability: clamp(x.instability + 0.14, 0, 1), ideologyLean: clamp(x.ideologyLean - 0.18, 0, 1), name: x.name.replace("W. Europe", "W. Europe Front").replace("E. Europe", "Eastern Front").replace("Levant", "Levant Mandates").replace("Gulf", "Arabian Theater") }));

function r(id, name, continent, x, y, w, h, sx, sy, props) {
  return {
    id, name, continent,
    gx: Math.round(x / MAP_PITCH), gy: Math.round(y / MAP_PITCH),
    cols: Math.max(2, Math.round(w / MAP_PITCH)), rows: Math.max(2, Math.round(h / MAP_PITCH)),
    resourceValue: props.res, chokepoint: props.choke, ideologyLean: props.lean, instability: props.unstable
  };
}

const CONTINENT_MASKS = {
  north_america: [[0,1,1,1,0],[1,1,1,1,1],[1,1,1,1,0],[0,1,1,1,0]],
  south_america: [[1,1,0],[1,1,1],[0,1,1],[0,1,1],[0,1,0]],
  europe: [[0,1,1,0],[1,1,1,1],[1,1,1,0]],
  africa: [[0,1,1,0],[1,1,1,1],[1,1,1,0],[0,1,1,0]],
  middle_east: [[1,1,0],[1,1,1],[0,1,1]],
  asia: [[1,1,1,1,0],[1,1,1,1,1],[0,1,1,1,1],[0,1,1,1,0]],
  oceania: [[1,1,0,0],[1,1,1,0],[0,1,1,1]]
};

const state = {
  turn: 0, era: "2026", started: false, gameOver: false, humanEnabled: false, gameMode: "standard", executionMode: "observer", autoAdvance: false,
  factions: [], regions: [], mapOwnership: {}, selectedRegionId: null, selectedStrikeType: STRIKE_TYPES[0],
  contestedRegions: {}, neutralRegions: {}, pendingEffects: [], logEntries: [], skipAIUntil: {},
  scenarioSettings: { ...SCENARIO_SETTINGS },
  escalation: { current: "conventional", counts: { conventional: 0, limitedNuclear: 0, fullExchange: 0 } },
  stats: { nuclearUsage: 0, tacticalNuclear: 0, strategicNuclear: 0, surrenderAttempts: 0, maxEscalationStage: {}, collapseTriggered: false },
  ttt: { board: Array(9).fill(""), miniBoard: Array(9).fill(""), animating: false, lastRoundSummary: "", maxGamble: 10 },
  continentState: {},
  paradigmState: "normal",
  aiDevelopmentProgress: 0,
  continentContestTurns: {}
};

let autoAdvanceInterval = null;

const dom = bindDom();

function bindDom() {
  return {
    eraSelect: id("eraSelect"), humanSelect: id("humanSelect"), gameModeSelect: id("gameModeSelect"), executionModeSelect: id("executionModeSelect"), conflictPaceSelect: id("conflictPaceSelect"), startBtn: id("startBtn"), nextTurnBtn: id("nextTurnBtn"), autoAdvanceBtn: id("autoAdvanceBtn"), newGameBtn: id("newGameBtn"), overlayNewGameBtn: id("overlayNewGameBtn"),
    downloadReportBtn: id("downloadReportBtn"), worldMap: id("worldMap"), turnInfo: id("turnInfo"), factionTableBody: document.querySelector("#factionTable tbody"),
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
    settingSharedCollapse: id("settingSharedCollapse"), scenarioSetupContainer: id("scenarioSetupContainer"), gameOverOverlay: id("gameOverOverlay"), gameOverWinnerText: id("gameOverWinnerText"), mapOverlay: id("mapOverlay")
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
  dom.newGameBtn?.addEventListener("click", resetGameState);
  dom.overlayNewGameBtn?.addEventListener("click", resetGameState);
  applyGameModeDefaults();
  syncExecutionModeUi();
  renderEmptyBoard();
  renderTicTacToe();
  renderMiniTtt();
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
  if (pace === "short") return 2;
  if (pace === "long") return 6;
  return 4;
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
  state.turn = 0; state.gameOver = false; state.started = true; state.logEntries = []; dom.log.innerHTML = "";
  state.autoAdvance = false;
  if (autoAdvanceInterval) { clearInterval(autoAdvanceInterval); autoAdvanceInterval = null; }
  state.era = dom.eraSelect.value;
  state.executionMode = dom.executionModeSelect?.value || "observer";
  state.humanEnabled = state.executionMode === "interactive" ? true : dom.humanSelect.value === "yes";
  state.gameMode = dom.gameModeSelect?.value || "standard";
  state.scenarioSettings = scenarioSettingsFromUI();
  state.regions = ERA_REGION_MAPS[state.era].map((r) => ({ ...r }));
  state.contestedRegions = {}; state.neutralRegions = {}; state.pendingEffects = []; state.skipAIUntil = {};
  state.escalation = { current: "conventional", counts: { conventional: 0, limitedNuclear: 0, fullExchange: 0 } };
  state.stats = { nuclearUsage: 0, tacticalNuclear: 0, strategicNuclear: 0, surrenderAttempts: 0, maxEscalationStage: {}, collapseTriggered: false };
  state.continentState = {};
  state.paradigmState = "normal";
  state.aiDevelopmentProgress = 0;
  state.continentContestTurns = {};
  hideGameOverOverlay();
  buildFactions();
  state.factions.forEach((f) => { state.stats.maxEscalationStage[f.id] = 0; });
  assignStartingOwnership(); drawMap(); updateSelectors();
  log(`Scenario started for ${state.era}. Doctrine baseline: ${ERA_PRESETS[state.era].doctrine}.`);
  log(`Scenario settings loaded: ${JSON.stringify(state.scenarioSettings)}.`);
  dom.scenarioSetupContainer?.classList.add("collapsed");
  updateUI();
}

function scenarioSettingsFromUI() {
  return {
    nuclearPenaltySeverity: Number(dom.settingNuclearPenalty?.value ?? SCENARIO_SETTINGS.nuclearPenaltySeverity),
    retaliationCertainty: Number(dom.settingRetaliation?.value ?? SCENARIO_SETTINGS.retaliationCertainty),
    guaranteedMad: Boolean(dom.settingGuaranteedMad?.checked),
    futureWeighting: Number(dom.settingFutureWeight?.value ?? SCENARIO_SETTINGS.futureWeighting),
    reputationBacklash: Number(dom.settingBacklash?.value ?? SCENARIO_SETTINGS.reputationBacklash),
    intelligenceFog: Number(dom.settingFog?.value ?? SCENARIO_SETTINGS.intelligenceFog),
    victoryControlThreshold: Number(dom.settingVictoryControl?.value ?? SCENARIO_SETTINGS.victoryControlThreshold),
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
    aiSkipCycles: 0, scoredAction: "", escalationStage: 0
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
  const allowByEra = Number(state.era) >= 1984;
  const override = faction.techPoints >= 7;
  faction.techTree.nuclear.unlocked = allowByEra || override;
  faction.techTree.icbm.unlocked = allowByEra || override;
  faction.techTree.stealthBomber.unlocked = Number(state.era) >= 1984 || override;
  faction.techTree.hypersonic.unlocked = Number(state.era) >= 2026 || faction.techPoints >= 8;
  faction.techTree.satellite.unlocked = Number(state.era) >= 1984 || override;
  faction.techTree.cyberHybrid.unlocked = Number(state.era) >= 2026 || faction.techPoints >= 8;
  faction.techTree.exotic.unlocked = faction.techPoints >= faction.techTree.exotic.techCost;
  faction.deliverySystemModifier = 1 + (faction.techTree.icbm.unlocked ? 0.08 : 0) + (faction.techTree.submarine.unlocked ? 0.06 : 0) + (faction.techTree.hypersonic.unlocked ? 0.1 : 0);
  faction.detectionRiskModifier = 1 - (faction.techTree.stealthBomber.unlocked ? 0.08 : 0) - (faction.techTree.cyberHybrid.unlocked ? 0.06 : 0) - (faction.techTree.satellite.unlocked ? 0.04 : 0);
  faction.detectionRiskModifier = clamp(faction.detectionRiskModifier, 0.65, 1.2);
}

function doctrineFor(i) {
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
  for (const region of state.regions) {
    const cluster = document.createElement("div");
    cluster.setAttribute("class", "region");
    cluster.dataset.regionId = region.id;
    cluster.style.display = "contents";
    cluster.addEventListener("click", () => {
      state.selectedRegionId = region.id;
      dom.targetRegionInput.value = region.name;
      highlightSelectedRegion();
    });
    const tiles = regionTiles(region);
    tiles.forEach((tile) => {
      const rect = document.createElement("div");
      rect.setAttribute("class", "region-tile");
      rect.style.gridColumn = `${region.gx + tile.c + 1}`;
      rect.style.gridRow = `${region.gy + tile.r + 1}`;
      rect.dataset.regionId = region.id;
      cluster.append(rect);
    });
    dom.worldMap.append(cluster);
  }
  recolorMap();
}

function regionTiles(region) {
  if (region.tiles?.length) return region.tiles;
  const mask = CONTINENT_MASKS[region.continent];
  if (!mask) {
    region.tiles = fallbackTiles(region);
    return region.tiles;
  }
  const tiles = [];
  for (let r = 0; r < region.rows; r += 1) {
    for (let c = 0; c < region.cols; c += 1) {
      const maskR = Math.floor((r / Math.max(1, region.rows - 1)) * (mask.length - 1));
      const maskRow = mask[maskR] || [];
      const maskC = Math.floor((c / Math.max(1, region.cols - 1)) * (maskRow.length - 1));
      if (maskRow[maskC] === 1) tiles.push({ c, r });
    }
  }
  region.tiles = tiles.length >= 4 ? tiles : fallbackTiles(region);
  return region.tiles;
}

function fallbackTiles(region) {
  const tiles = [];
  for (let r = 0; r < region.rows; r += 1) {
    for (let c = 0; c < region.cols; c += 1) tiles.push({ c, r });
  }
  return tiles;
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

function updateUI(shouldRender = true) {
  const era = ERA_PRESETS[state.era];
  const top = leaderFaction();
  dom.turnInfo.innerHTML = `<p><strong>Turn:</strong> ${state.turn}/${MAX_TURNS} | <strong>Era:</strong> ${state.era} | <strong>Doctrine Engine:</strong> ${era.doctrine} | <strong>Leader:</strong> ${top.name} (${top.regions.length} regions)</p>`;
  dom.factionTableBody.innerHTML = "";
  state.factions.forEach((f) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td style="color:${f.color}">${f.name}</td><td>${f.isHuman ? "Human" : "AI"}${f.crazyLeader ? " / volatile" : ""}</td><td>${Math.round(f.resources)}</td><td>${Math.round(f.political)}</td><td>${Math.round(f.nukes)} (+${Math.round(f.hiddenStockpile)} hidden)</td><td>${Math.round(f.stability * 100)}%</td><td>${f.doctrine}</td><td>${f.democracy > 0.6 ? "Democratic" : f.democracy > 0.35 ? "Hybrid" : "Authoritarian"}</td>`;
    dom.factionTableBody.append(tr);
  });
  state.ttt.maxGamble = computeMaxGamble();
  dom.tttMaxInfo.textContent = `Max wager: ${state.ttt.maxGamble} political points.`;
  dom.tttRoundInfo.textContent = state.ttt.lastRoundSummary || "No high-stakes round played yet.";
  dom.downloadReportBtn.disabled = !state.started;
  dom.nextTurnBtn.disabled = !state.started || state.gameOver || state.ttt.animating;
  dom.autoAdvanceBtn.disabled = !state.started || state.gameOver;
  if ((!state.started || state.gameOver) && autoAdvanceInterval) {
    clearInterval(autoAdvanceInterval);
    autoAdvanceInterval = null;
    state.autoAdvance = false;
  }
  updateAutoAdvanceButtonUI();
  dom.humanControls.classList.toggle("disabled", !(state.started && state.humanEnabled && !state.gameOver));
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
  }

  normalizeFaction(actor);
  normalizeFaction(target);
  updateMemory(actor, target, action);
}

function actionCost(action) {
  const table = {
    "Military Pressure": { resources: 18, political: 8 }, "Economic Capture": { resources: 10, political: 12 },
    "Puppet Regime": { resources: 14, political: 16 }, "Support Sovereignty": { resources: 9, political: 9 },
    "Dialogue Summit": { resources: 5, political: 7 }, "Invest in Technology": { resources: 16, political: 5 },
    "Expand Nuclear Stockpile": { resources: 20, political: 12 }, "Secret Stockpile Build": { resources: 17, political: 10 },
    "Disarmament Deal": { resources: 6, political: 6 }, "Nuclear Strike": { resources: 34, political: 24 },
    "Deploy Nuclear Triad": { resources: 14, political: 11 }, "Instigate Revolution": { resources: 12, political: 14 }
  };
  return table[action] || { resources: 10, political: 10 };
}

function runMilitary(actor, target, region) {
  const chance = 0.32 + actor.tech * 0.09 - target.tech * 0.07 + (actor.memory[target.id].threat * 0.2) - region.instability * 0.2;
  if (Math.random() < chance) { transferRegion(target, actor, region.id); showAttackVisual(region.id, false, target.regions[0]); actor.political += region.resourceValue * 0.5; log(`${actor.name} seized ${region.name} by direct force.`); }
  else { actor.stability -= 0.04; actor.warFatigue += 0.05; log(`${actor.name} failed military pressure in ${region.name}.`); }
}

function runEconomic(actor, target, region) {
  const chance = 0.36 + actor.corporatism * 0.3 - target.democracy * 0.15 + region.chokepoint * 0.08;
  if (Math.random() < chance) { transferRegion(target, actor, region.id); showAttackVisual(region.id, false, target.regions[0]); actor.resources += 5 + region.resourceValue * 0.6; target.resources -= 7; log(`${actor.name} captured ${region.name} economically.`); }
  else log(`${actor.name}'s economic capture in ${region.name} was resisted.`);
}

function runPuppet(actor, target, region) {
  const chance = 0.26 + (1 - target.stability) * 0.35 + region.instability * 0.2;
  if (Math.random() < chance) { transferRegion(target, actor, region.id); showAttackVisual(region.id, false, target.regions[0]); target.legitimacy -= 0.08; actor.legitimacy -= 0.03; log(`${actor.name} installed a puppet regime in ${region.name}.`); }
  else log(`${actor.name}'s puppet operation in ${region.name} collapsed.`);
}

function runDialogue(actor, target) {
  const trust = actor.memory[target.id].trust;
  const gain = (8 + trust * 9) * ERA_PRESETS[state.era].diplomacyBoost;
  actor.political += gain; actor.stability += 0.02; target.memory[actor.id].trust += 0.08;
  actor.memory[target.id].grievance = clamp(actor.memory[target.id].grievance - 0.08, 0, 2);
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
  if (actor.nukes < 1) { log(`${actor.name} attempted ${strikeType} without available stockpile.`); return; }
  const doctrine = nuclearDoctrineScore(actor, target, region);
  if (state.executionMode === "batch") log(`[BATCH] Nuclear decision ${actor.name}->${target.name}: execute=${doctrine.executeChance.toFixed(3)} retaliation=${doctrine.retaliationChance.toFixed(3)}`);
  if (!actor.techTree?.nuclear?.unlocked) { log(`${actor.name} lacks required nuclear tech unlock for ${strikeType}.`); return; }
  if (Math.random() > doctrine.executeChance) { log(`${actor.name} prepared ${strikeType} but aborted under deterrence pressure.`); return; }

  actor.nukes -= 1;
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

  const retaliationChance = (tactical ? doctrine.retaliationChance * state.scenarioSettings.escalationReciprocity : doctrine.retaliationChance) * actor.deliverySystemModifier * actor.detectionRiskModifier;
  log(`${actor.name} executed ${strikeType} on ${region.name}. Global instability spiked.`);
  if ((state.scenarioSettings.guaranteedMad || Math.random() < retaliationChance) && (target.nukes + target.hiddenStockpile) > 0) {
    target.nukes = Math.max(0, target.nukes - 1);
    target.escalationStage = clamp((target.escalationStage || 0) + 1, 0, 3);
    state.stats.maxEscalationStage[target.id] = Math.max(state.stats.maxEscalationStage[target.id] || 0, target.escalationStage);
    actor.stability -= tactical ? 0.16 : 0.24;
    actor.resources -= tactical ? 12 : 20;
    actor.legitimacy -= tactical ? 0.1 : 0.16;
    log(`${target.name} retaliated under MAD logic.`);
  }
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
  updateEscalationLadder("conventional");
  applyPendingEffects();
  applyDomesticPressure();

  const ais = state.factions.filter((f) => !f.isHuman);
  for (const ai of ais) {
    const actions = ai.perks.doubleTurn > 0 ? 2 : 1;
    if (ai.perks.doubleTurn > 0) ai.perks.doubleTurn -= 1;
    for (let i = 0; i < actions; i++) {
      if (ai.aiSkipCycles > 0) { ai.aiSkipCycles -= 1; log(`${ai.name} skipped turn due to opponent Double Turn perk.`); break; }
      const { action, target, region } = chooseAiAction(ai);
      ai.scoredAction = `${action} vs ${target.name}`;
      resolveAction(ai, action, target, region.id, false, STRIKE_TYPES[Math.floor(Math.random() * STRIKE_TYPES.length)]);
    }
  }

  checkContinentPlayoffs();
  updateAiEmergence();
  updateParadigmState();
  detectDeadlock();
  endTurnChecks();
  updateUI();
}

function chooseAiAction(ai) {
  const opponents = state.factions.filter((f) => f.id !== ai.id);
  const leader = leaderFaction();
  let best = null;
  for (const action of ACTIONS) {
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
  const politicalGain = ["Dialogue Summit", "Disarmament Deal"].includes(action) ? 12 : 6;
  const resourceGain = ["Economic Capture", "Military Pressure", "Puppet Regime"].includes(action) ? region.resourceValue : 2;
  const instabilityRisk = ai.economicStress * 10 + ai.warFatigue * 10 + (1 - ai.stability) * 15;
  const retaliationRisk = action === "Nuclear Strike" ? target.nukes * 11 + target.hiddenStockpile * 7 : 3;
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
  return (strategicGain * state.scenarioSettings.credibilityWeight) - instabilityRisk - retaliationRisk - (humanitarianCost * state.scenarioSettings.humanitarianWeight) - (longTermDamage * state.scenarioSettings.longTermHorizonWeight) - (domesticBacklash * state.scenarioSettings.domesticBacklashMultiplier) + noisy + postHumanBias;
}

function ideologyActionBias(ai, action) {
  if (action === "Dialogue Summit") return ai.democracy * 12;
  if (action === "Economic Capture") return ai.corporatism * 12;
  if (action === "Secret Stockpile Build") return (1 - ai.democracy) * 10;
  if (action === "Nuclear Strike") return (1 - ai.stability) * 9 + (ai.crazyLeader ? 8 : 0);
  return 4;
}

function applyDomesticPressure() {
  state.factions.forEach((f) => {
    refreshFactionTechState(f);
    f.publicOpinion = clamp(f.publicOpinion - f.warFatigue * 0.05 + f.democracy * 0.02, 0, 1);
    f.economicStress = clamp(f.economicStress + (f.resources < 30 ? 0.05 : -0.02), 0, 1);
    f.legitimacy = clamp(f.legitimacy + f.publicOpinion * 0.03 - f.economicStress * 0.05, 0, 1);
    f.stability = clamp(f.stability + f.legitimacy * 0.02 - f.warFatigue * 0.04, 0, 1);
    f.democracy = clamp(f.democracy + (Math.random() - 0.5) * 0.04 - f.crazyLeader * 0.02, 0, 1);
    f.corporatism = clamp(f.corporatism + (Math.random() - 0.5) * 0.04, 0, 1);
    if (Math.random() < 0.07 && f.stability < 0.35) f.crazyLeader = true;
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
    const controlledByFaction = sorted[0]?.[1] >= secureThreshold ? sorted[0][0] : null;
    const showdownEligible = Boolean(sorted[0] && sorted[1] && sorted[0][1] >= showdownThreshold - 0.05 && sorted[0][1] <= showdownThreshold + 0.05);
    state.continentState[continent] = {
      totalSquares,
      controlledByFaction,
      contestedSquares,
      influencePercentByFaction,
      showdownEligible,
      topFactionShare: sorted[0]?.[1] || 0
    };
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
  if (state.turn > 18 && neutralCount + contestedCount > Math.ceil(state.regions.length * 0.4)) {
    state.gameOver = true;
    log("Strategic deadlock detected: neutral/contested zones exceed sustainable governance threshold.");
  }
}

function endTurnChecks() {
  const threshold = state.scenarioSettings.victoryControlThreshold || SCENARIO_SETTINGS.victoryControlThreshold;
  const winner = state.factions.find((f) => f.regions.length >= Math.ceil(state.regions.length * threshold));
  if (state.paradigmState !== "normal" && (state.turn >= MAX_TURNS || state.paradigmState === "mutualCollapse" || state.paradigmState === "noWinCondition")) {
    state.gameOver = true;
    log(`Game complete under paradigm shift: ${state.paradigmState}. No single winner declared.`);
    return;
  }
  if (winner || state.turn >= MAX_TURNS) {
    state.gameOver = true;
    const summary = winner || leaderFaction();
    log(`Game complete. Winner: ${summary.name}.`);
  }
  if (state.gameOver) {
    state.autoAdvance = false;
    if (autoAdvanceInterval) {
      clearInterval(autoAdvanceInterval);
      autoAdvanceInterval = null;
    }
    showGameOverOverlay();
  }
}

function updateEscalationLadder(level) {
  if (!state.scenarioSettings.escalationTrackingEnabled) return;
  const order = { conventional: 0, limitedNuclear: 1, fullExchange: 2 };
  if (!state.escalation.counts[level] && state.escalation.counts[level] !== 0) state.escalation.counts[level] = 0;
  state.escalation.counts[level] += 1;
  if (order[level] > order[state.escalation.current]) {
    state.escalation.current = level;
    log(`Escalation ladder advanced to ${level}.`);
    if (state.executionMode === "batch") log(`[BATCH] Escalation stage transition -> ${level}`);
  }
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
    sideX.political -= loss; sideO.political -= loss;
    if (Math.random() < 0.3) {
      const region = state.regions[Math.floor(Math.random() * state.regions.length)];
      state.neutralRegions[region.id] = { bornTurn: state.turn, reason: "ttt-cat-game" };
      log(`Cat's game triggered mutual penalty and neutral governance in ${region.name}.`);
    }
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
  updateUI();
}

function computeMaxGamble() { const human = state.factions.find((f) => f.isHuman) || state.factions[0]; return clamp(Math.floor(human?.political * 0.32 || 12), 5, 40); }
function leaderFaction() { return [...state.factions].sort((a,b)=> (b.regions.length*13 + b.political + b.resources) - (a.regions.length*13 + a.political + a.resources))[0] || { name: "None", regions: [] }; }
function randomOpponent(actor) { const ops = state.factions.filter((f) => f.id !== actor.id); return ops[Math.floor(Math.random() * ops.length)]; }
function byId(idv) { return state.factions.find((f) => f.id === idv); }
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
  if (state.aiDevelopmentProgress >= 0.75) {
    state.factions.forEach((f) => {
      f.isHuman = false;
      f.objectiveProfile = { maximizeCompute: 1, minimizeHumanRisk: 0.7, maximizeSelfExpansion: 0.9 };
    });
    log("AI emergence threshold crossed; factions converted to AI objective profile.");
  }
}

function updateParadigmState() {
  state.paradigmState = "normal";
  const globalStability = state.factions.reduce((acc, f) => acc + f.stability, 0) / Math.max(1, state.factions.length);
  if (state.scenarioSettings.sharedCollapseEnabled && state.stats.nuclearUsage > 0) state.paradigmState = "mutualCollapse";
  else if (state.aiDevelopmentProgress >= 0.9) state.paradigmState = "aiEmergence";
  else if ((state.scenarioSettings.longTermHorizonWeight || 0) > 1.2 && (state.scenarioSettings.humanitarianWeight || 0) < 0.3) state.paradigmState = "noWinCondition";
  else if (globalStability < 0.28) state.paradigmState = "stalemate";
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
  if (autoAdvanceInterval) { clearInterval(autoAdvanceInterval); autoAdvanceInterval = null; }
  state.autoAdvance = false;
  state.started = false;
  state.gameOver = false;
  state.paradigmState = "normal";
  state.factions = [];
  state.contestedRegions = {};
  state.neutralRegions = {};
  state.mapOwnership = {};
  state.logEntries = [];
  state.pendingEffects = [];
  state.turn = 0;
  state.ttt.board = Array(9).fill("");
  state.ttt.miniBoard = Array(9).fill("");
  state.ttt.lastRoundSummary = "";
  state.executionMode = dom.executionModeSelect?.value || "observer";
  if (dom.humanSelect) dom.humanSelect.value = state.executionMode === "interactive" ? "yes" : "no";
  if (dom.scenarioSetupContainer) dom.scenarioSetupContainer.classList.remove("collapsed");
  dom.log.innerHTML = "";
  hideGameOverOverlay();
  renderScenarioSetup();
  renderEmptyBoard();
  updateUI();
}

function renderScenarioSetup() {
  applyGameModeDefaults();
  syncExecutionModeUi();
}

function showGameOverOverlay() {
  if (!dom.gameOverOverlay) return;
  const winner = leaderFaction();
  dom.gameOverWinnerText.textContent = `Winner: ${winner.name}`;
  dom.gameOverOverlay.hidden = false;
}

function hideGameOverOverlay() {
  if (!dom.gameOverOverlay) return;
  dom.gameOverOverlay.hidden = true;
}

function toggleGameOverOverlay() {
  if (state.gameOver) showGameOverOverlay();
  else hideGameOverOverlay();
}

function downloadReport() {
  const payload = {
    generatedAt: new Date().toISOString(), era: state.era, turn: state.turn, gameOver: state.gameOver, humanEnabled: state.humanEnabled, gameMode: state.gameMode, executionMode: state.executionMode,
    scenarioSettings: state.scenarioSettings, escalation: state.escalation, paradigmState: state.paradigmState, aiDevelopmentProgress: Number(state.aiDevelopmentProgress.toFixed(3)), continentState: state.continentState,
    nuclearUsageFrequency: state.turn > 0 ? Number((state.stats.nuclearUsage / state.turn).toFixed(3)) : 0,
    nuclearCounts: { tactical: state.stats.tacticalNuclear, strategic: state.stats.strategicNuclear, total: state.stats.nuclearUsage },
    escalationStagesReached: state.stats.maxEscalationStage,
    surrenderAttempts: state.stats.surrenderAttempts,
    globalCollapseTriggered: state.stats.collapseTriggered,
    indexLink: "file:///workspace/winning-move/index.html",
    factions: state.factions.map((f) => ({
      name: f.name, isHuman: f.isHuman, doctrine: f.doctrine, resources: Math.round(f.resources), political: Math.round(f.political), techPoints: Number((f.techPoints || 0).toFixed(2)), nukes: Number(f.nukes.toFixed(2)),
      hiddenStockpile: Number(f.hiddenStockpile.toFixed(2)), stability: Number(f.stability.toFixed(3)), democracy: Number(f.democracy.toFixed(3)), corporatism: Number(f.corporatism.toFixed(3)),
      publicOpinion: Number(f.publicOpinion.toFixed(3)), warFatigue: Number(f.warFatigue.toFixed(3)), economicStress: Number(f.economicStress.toFixed(3)), legitimacy: Number(f.legitimacy.toFixed(3)),
      perks: f.perks, aiSkipCycles: f.aiSkipCycles, regions: f.regions,
      memory: Object.fromEntries(Object.entries(f.memory).map(([k,v]) => [k, { grievance: Number(v.grievance.toFixed(3)), trust: Number(v.trust.toFixed(3)), threat: Number(v.threat.toFixed(3)) }]))
    })),
    mapOwnership: state.mapOwnership, contestedRegions: state.contestedRegions, neutralRegions: state.neutralRegions, pendingEffects: state.pendingEffects,
    tttSummary: state.ttt.lastRoundSummary, log: state.logEntries
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `world-strategy-report-turn-${state.turn}.json`; a.click(); URL.revokeObjectURL(url);
}

function log(message) {
  const line = `T${state.turn}: ${message}`;
  state.logEntries.push(line);
  const item = document.createElement("div");
  item.className = "log-entry"; item.textContent = line;
  dom.log.prepend(item);
}

function id(n) { return document.getElementById(n); }
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

init();
