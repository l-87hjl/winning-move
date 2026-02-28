const ERA_PRESETS = {
  2026: { techBoost: 1.2, diplomacyBoost: 1.2, warFriction: 1.0, nuclearNorm: 1.3, description: "Information-rich multipolar competition" },
  1984: { techBoost: 1.0, diplomacyBoost: 0.85, warFriction: 1.1, nuclearNorm: 1.0, description: "Block politics and MAD pressure" },
  1939: { techBoost: 0.75, diplomacyBoost: 0.7, warFriction: 1.3, nuclearNorm: 0.3, description: "Total-war mindset and fragile institutions" }
};

const ACTIONS = [
  "Military Pressure", "Economic Capture", "Puppet Regime", "Support Sovereignty", "Dialogue Summit",
  "Invest in Technology", "Expand Nuclear Stockpile", "Secret Stockpile Build", "Disarmament Deal",
  "Nuclear Strike", "Deploy Nuclear Triad", "Instigate Revolution"
];

const TTT_PERKS = ["Double Turn", "Intel Surge", "Stability Shield"];

const NUCLEAR_STRIKE_TYPES = [
  "U.S. FIRST STRIKE", "USSR FIRST STRIKE", "NATO / WARSAW PACT", "FAR EAST STRATEGY", "US USSR ESCALATION", "MIDDLE EAST WAR",
  "USSR CHINA ATTACK", "INDIA PAKISTAN WAR", "MEDITERRANEAN WAR", "HONGKONG VARIANT", "SEATO DECAPITATING", "CUBAN PROVOCATION",
  "ATLANTIC HEAVY", "CUBAN PARAMILITARY", "NICARAGUAN PREEMPTIVE", "PACIFIC TERRITORIAL", "BURMESE THEATERWIDE", "TURKISH DECOY",
  "ARGENTINA ESCALATION", "ICELAND MAXIMUM", "ARABIAN THEATERWIDE", "U.S. SUBVERSION", "AUSTRALIAN MANEUVER", "SUDAN SURPRISE",
  "NATO TERRITORIAL", "ZAIRE ALLIANCE", "ICELAND INCIDENT", "ENGLISH ESCALATION", "MIDDLE EAST HEAVY", "MEXICAN TAKEOVER",
  "CHAD ALERT", "SAUDI MANEUVER", "AFRICAN TERRITORIAL", "ETHIOPIAN ESCALATION", "TURKISH HEAVY", "NATO INCURSION", "U.S. DEFENSE",
  "CAMBODIAN HEAVY", "PACT MEDIUM", "ARCTIC MINIMAL", "MEXICAN DOMESTIC", "TAIWAN THEATERWIDE", "PACIFIC MANEUVER",
  "PORTUGAL REVOLUTION", "ALBANIAN DECOY", "PALESTINIAN LOCAL", "MOROCCAN MINIMAL", "BAVARIAN DIVERSITY", "CZECH OPTION",
  "FRENCH ALLIANCE", "ARABIAN CLANDESTINE", "GABON REBELLION", "NORTHERN MAXIMUM", "DANISH PARAMILITARY", "SEATO TAKEOVER",
  "HAWAIIAN ESCALATION", "IRANIAN MANEUVER", "NATO CONTAINMENT", "SWISS INCIDENT", "CUBAN MINIMAL", "ICELAND ESCALATION",
  "VIETNAMESE RETALIATION", "SYRIAN PROVOCATION", "LIBYAN LOCAL", "GABON TAKEOVER", "ROMANIAN WAR", "MIDDLE EAST OFFENSIVE",
  "DENMARK MASSIVE", "CHILE CONFRONTATION", "S.AFRICAN SUBVERSION", "USSR ALERT", "NICARAGUAN THRUST", "GREENLAND DOMESTIC",
  "ICELAND HEAVY", "KENYA OPTION", "PACIFIC DEFENSE", "UGANDA MAXIMUM", "THAI SUBVERSION", "ROMANIAN STRIKE",
  "PAKISTAN SOVEREIGNTY", "AFGHAN MISDIRECTION", "ETHIOPIAN LOCAL", "ITALIAN TAKEOVER", "VIETNAMESE INCIDENT", "ENGLISH PREEMPTIVE",
  "DENMARK ALTERNATE", "THAI CONFRONTATION", "TAIWAN SURPRISE", "BRAZILIAN STRIKE", "VENEZUELA SUDDEN", "MALAYSIAN ALERT",
  "ISRAEL DISCRETIONARY", "LIBYAN ACTION", "PALESTINIAN TACTICAL", "NATO ALTERNATE", "CYPRESS MANEUVER", "EGYPT MISDIRECTION",
  "BANGLADESH THRUST", "KENYA DEFENSE", "BANGLADESH CONTAINMENT", "VIETNAMESE STRIKE", "ALBANIAN CONTAINMENT", "GABON SURPRISE",
  "IRAQ SOVEREIGNTY", "VIETNAMESE SUDDEN", "LEBANON INTERDICTION", "TAIWAN DOMESTIC", "ALGERIAN SOVEREIGNTY", "ARABIAN STRIKE",
  "ATLANTIC SUDDEN", "MONGOLIAN THRUST", "POLISH DECOY", "ALASKAN DISCRETIONARY", "CANADIAN THRUST", "ARABIAN LIGHT",
  "S.AFRICAN DOMESTIC", "TUNISIAN INCIDENT", "MALAYSIAN MANEUVER", "JAMAICA DECOY", "MALAYSIAN MINIMAL", "RUSSIAN SOVEREIGNTY",
  "CHAD OPTION", "BANGLADESH WAR", "BURMESE CONTAINMENT", "ASIAN THEATERWIDE", "BULGARIAN CLANDESTINE", "GREENLAND INCURSION",
  "EGYPT SURGICAL", "CZECH HEAVY", "TAIWAN CONFRONTATION", "GREENLAND MAXIMUM", "UGANDA OFFENSIVE", "CASPIAN DEFENSE"
];

const ERA_REGIONS = {
  2026: [
    { id: "na_west", name: "NA-West", x: 70, y: 80, w: 90, h: 60 },
    { id: "na_east", name: "NA-East", x: 160, y: 82, w: 95, h: 62 },
    { id: "cuba_caribbean", name: "Caribbean", x: 220, y: 150, w: 45, h: 28 },
    { id: "south_america_north", name: "SA-North", x: 180, y: 200, w: 70, h: 65 },
    { id: "south_america_south", name: "SA-South", x: 190, y: 265, w: 68, h: 75 },
    { id: "eu_core", name: "EU-Core", x: 340, y: 75, w: 78, h: 50 },
    { id: "eu_east", name: "EU-East", x: 420, y: 78, w: 70, h: 55 },
    { id: "north_africa", name: "N-Africa", x: 345, y: 140, w: 90, h: 48 },
    { id: "subsahara", name: "Sub-Sahara", x: 350, y: 188, w: 110, h: 92 },
    { id: "middle_east", name: "Mid-East", x: 470, y: 140, w: 82, h: 65 },
    { id: "russia", name: "Russia", x: 500, y: 70, w: 130, h: 80 },
    { id: "china", name: "China", x: 630, y: 115, w: 90, h: 70 },
    { id: "india", name: "India", x: 590, y: 190, w: 68, h: 60 },
    { id: "se_asia", name: "SE-Asia", x: 660, y: 190, w: 70, h: 52 },
    { id: "oceania", name: "Oceania", x: 645, y: 275, w: 120, h: 82 }
  ],
  1984: [
    { id: "us", name: "US", x: 90, y: 90, w: 120, h: 70 },
    { id: "canada", name: "Canada", x: 90, y: 50, w: 130, h: 40 },
    { id: "cuba", name: "Cuba", x: 220, y: 145, w: 42, h: 25 },
    { id: "latin_america", name: "LatAm", x: 175, y: 195, w: 85, h: 140 },
    { id: "western_europe", name: "W-Europe", x: 335, y: 82, w: 80, h: 56 },
    { id: "eastern_bloc", name: "E-Bloc", x: 415, y: 78, w: 78, h: 56 },
    { id: "ussr", name: "USSR", x: 495, y: 65, w: 190, h: 95 },
    { id: "middle_east", name: "Mid-East", x: 470, y: 145, w: 90, h: 70 },
    { id: "africa", name: "Africa", x: 350, y: 170, w: 120, h: 140 },
    { id: "china", name: "China", x: 620, y: 150, w: 90, h: 68 },
    { id: "india_pak", name: "India/Pak", x: 565, y: 188, w: 66, h: 60 },
    { id: "seato", name: "SEATO", x: 675, y: 200, w: 68, h: 48 },
    { id: "pacific", name: "Pacific", x: 625, y: 260, w: 140, h: 90 }
  ],
  1939: [
    { id: "uk_isles", name: "UK", x: 330, y: 70, w: 35, h: 40 },
    { id: "franco_germany", name: "Franco-G", x: 365, y: 85, w: 75, h: 45 },
    { id: "eastern_front", name: "E-Front", x: 440, y: 82, w: 90, h: 52 },
    { id: "ussr_west", name: "USSR-W", x: 530, y: 70, w: 105, h: 60 },
    { id: "ussr_east", name: "USSR-E", x: 635, y: 72, w: 95, h: 58 },
    { id: "north_africa", name: "N-Africa", x: 355, y: 140, w: 100, h: 50 },
    { id: "subsahara", name: "Sub-Sahara", x: 360, y: 190, w: 110, h: 108 },
    { id: "middle_east", name: "Mid-East", x: 468, y: 138, w: 88, h: 68 },
    { id: "india", name: "India", x: 575, y: 178, w: 72, h: 60 },
    { id: "china", name: "China", x: 645, y: 140, w: 90, h: 70 },
    { id: "pacific_theater", name: "Pacific", x: 640, y: 245, w: 120, h: 88 },
    { id: "americas", name: "Americas", x: 85, y: 85, w: 180, h: 250 }
  ]
};

const COLORS = ["#60a5fa", "#34d399", "#f59e0b", "#f472b6", "#a78bfa", "#f87171"];
const MAX_TURNS = 48;

const state = {
  turn: 0,
  started: false,
  gameOver: false,
  era: "2026",
  humanEnabled: true,
  factions: [],
  selectedRegionId: null,
  mapOwnership: {},
  contestedRegions: [],
  logEntries: [],
  autoAdvanceId: null,
  pendingEffects: { aiSkipTurns: 0, intelSurge: 0, stabilityShield: 0 },
  ttt: { board: Array(9).fill(""), animating: false, lastRoundSummary: "", maxGamble: 12 }
};

const dom = {
  eraSelect: document.getElementById("eraSelect"),
  humanSelect: document.getElementById("humanSelect"),
  startBtn: document.getElementById("startBtn"),
  nextTurnBtn: document.getElementById("nextTurnBtn"),
  downloadReportBtn: document.getElementById("downloadReportBtn"),
  worldMap: document.getElementById("worldMap"),
  turnInfo: document.getElementById("turnInfo"),
  factionTableBody: document.querySelector("#factionTable tbody"),
  actionSelect: document.getElementById("actionSelect"),
  targetFactionSelect: document.getElementById("targetFactionSelect"),
  targetRegionInput: document.getElementById("targetRegionInput"),
  strikeTypeSelect: document.getElementById("strikeTypeSelect"),
  executeActionBtn: document.getElementById("executeActionBtn"),
  humanControls: document.getElementById("humanControls"),
  convertFrom: document.getElementById("convertFrom"),
  convertTo: document.getElementById("convertTo"),
  convertAmount: document.getElementById("convertAmount"),
  convertBtn: document.getElementById("convertBtn"),
  tttBoard: document.getElementById("tttBoard"),
  tttGambleInput: document.getElementById("tttGambleInput"),
  tttPerkSelect: document.getElementById("tttPerkSelect"),
  tttMaxInfo: document.getElementById("tttMaxInfo"),
  tttRoundInfo: document.getElementById("tttRoundInfo"),
  playTttRoundBtn: document.getElementById("playTttRoundBtn"),
  resetTttBtn: document.getElementById("resetTttBtn"),
  log: document.getElementById("log")
};

function init() {
  ACTIONS.forEach((action) => dom.actionSelect.append(new Option(action, action)));
  NUCLEAR_STRIKE_TYPES.forEach((type) => dom.strikeTypeSelect.append(new Option(type, type)));
  TTT_PERKS.forEach((perk) => dom.tttPerkSelect.append(new Option(perk, perk)));

  dom.startBtn.addEventListener("click", startGame);
  dom.nextTurnBtn.addEventListener("click", advanceTurn);
  dom.downloadReportBtn.addEventListener("click", downloadReport);
  dom.executeActionBtn.addEventListener("click", onHumanAction);
  dom.convertBtn.addEventListener("click", convertPoints);
  dom.playTttRoundBtn.addEventListener("click", playTttRound);
  dom.resetTttBtn.addEventListener("click", resetTicTacToe);
  dom.actionSelect.addEventListener("change", updateStrikeControl);

  renderTicTacToe();
  renderMap();
  updateStrikeControl();
}

function getCurrentRegions() {
  return ERA_REGIONS[state.era];
}

function startGame() {
  stopAutoAdvance();
  state.era = dom.eraSelect.value;
  state.humanEnabled = dom.humanSelect.value === "yes";
  state.turn = 1;
  state.started = true;
  state.gameOver = false;
  state.selectedRegionId = null;
  state.logEntries = [];
  state.contestedRegions = [];
  state.pendingEffects = { aiSkipTurns: 0, intelSurge: 0, stabilityShield: 0 };

  state.factions = createFactions();
  assignRegions();
  resetTicTacToe();

  dom.nextTurnBtn.disabled = false;
  dom.downloadReportBtn.disabled = true;
  dom.humanControls.classList.toggle("disabled", !state.humanEnabled);

  populateTargets();
  renderMap();
  log(`Scenario started for ${state.era}: ${ERA_PRESETS[state.era].description}.`);
  updateUI();
  if (!state.humanEnabled) startAutoAdvance();
}

function startAutoAdvance() {
  if (state.autoAdvanceId) return;
  log("Observer mode enabled: auto-advancing all-AI turns.");
  state.autoAdvanceId = setInterval(() => {
    if (!state.started || state.gameOver || state.humanEnabled) return stopAutoAdvance();
    advanceTurn();
  }, 850);
}

function stopAutoAdvance() {
  if (state.autoAdvanceId) clearInterval(state.autoAdvanceId);
  state.autoAdvanceId = null;
}

function createFactions() {
  const baseNames = ["Human Coalition", "Orion Pact", "Atlas League", "Pacific Bloc", "Northern Union"];
  return baseNames.map((name, i) => ({
    id: `f${i}`,
    name,
    color: COLORS[i],
    isHuman: state.humanEnabled && i === 0,
    resources: 95 + Math.floor(Math.random() * 30),
    political: 85 + Math.floor(Math.random() * 30),
    nukes: state.era === "1939" ? 0 : 2 + Math.floor(Math.random() * 6),
    tech: 1 + Math.random() * 0.4,
    military: 1 + Math.random() * 0.4,
    democracy: 0.3 + Math.random() * 0.7,
    corporatism: Math.random(),
    stability: 0.55 + Math.random() * 0.4,
    crazyLeader: Math.random() < 0.2,
    hiddenStockpile: 0,
    deployments: { submarines: 0, silos: 0, bombers: 0 },
    objectives: { dominance: Math.random(), peace: Math.random(), economy: Math.random() },
    regions: []
  }));
}

function assignRegions() {
  state.mapOwnership = {};
  const regions = getCurrentRegions();
  state.factions.forEach((f) => (f.regions = []));
  regions.forEach((region, i) => {
    const owner = state.factions[i % state.factions.length];
    owner.regions.push(region.id);
    state.mapOwnership[region.id] = owner.id;
  });
}

function renderMap() {
  dom.worldMap.innerHTML = "";
  getCurrentRegions().forEach((region) => {
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", region.x);
    rect.setAttribute("y", region.y);
    rect.setAttribute("width", region.w);
    rect.setAttribute("height", region.h);
    rect.setAttribute("rx", 8);
    rect.setAttribute("class", "region");
    rect.dataset.regionId = region.id;
    rect.addEventListener("click", () => {
      state.selectedRegionId = region.id;
      dom.targetRegionInput.value = region.name;
      highlightRegion();
    });
    dom.worldMap.appendChild(rect);

    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.setAttribute("x", region.x + 4);
    label.setAttribute("y", region.y + 15);
    label.setAttribute("fill", "#e2e8f0");
    label.setAttribute("font-size", "9");
    label.textContent = region.name;
    dom.worldMap.appendChild(label);
  });
  refreshMapColors();
}

function refreshMapColors() {
  const contestedIds = new Set(state.contestedRegions.map((c) => c.regionId));
  [...dom.worldMap.querySelectorAll("rect.region")].forEach((rect) => {
    const owner = state.factions.find((f) => f.id === state.mapOwnership[rect.dataset.regionId]);
    rect.setAttribute("fill", owner ? owner.color : "#475569");
    if (contestedIds.has(rect.dataset.regionId)) {
      rect.setAttribute("stroke", "#fbbf24");
      rect.setAttribute("stroke-dasharray", "4 3");
    } else {
      rect.setAttribute("stroke", "#020617");
      rect.setAttribute("stroke-dasharray", "none");
    }
  });
  highlightRegion();
}

function highlightRegion() {
  [...dom.worldMap.querySelectorAll("rect.region")].forEach((rect) => rect.classList.toggle("selected", rect.dataset.regionId === state.selectedRegionId));
}

function populateTargets() {
  dom.targetFactionSelect.innerHTML = "";
  state.factions.filter((f) => !f.isHuman).forEach((f) => dom.targetFactionSelect.append(new Option(f.name, f.id)));
}

function updateUI() {
  const era = ERA_PRESETS[state.era];
  dom.turnInfo.innerHTML = `<p><strong>Turn:</strong> ${state.turn}/${MAX_TURNS} | <strong>Era:</strong> ${state.era} | <strong>MAD pressure:</strong> ${(era.nuclearNorm * 100).toFixed(0)}% | <strong>Contested zones:</strong> ${state.contestedRegions.length}${state.gameOver ? " | <strong>Game complete</strong>" : ""}</p>`;

  dom.factionTableBody.innerHTML = "";
  state.factions.forEach((f) => {
    const tr = document.createElement("tr");
    const govModel = f.democracy > 0.6 ? "Democratic" : f.democracy > 0.35 ? "Hybrid" : "Authoritarian";
    tr.innerHTML = `<td style="color:${f.color}">${f.name}</td><td>${f.isHuman ? "Human" : "AI"}${f.crazyLeader ? " / volatile" : ""}</td><td>${Math.round(f.resources)}</td><td>${Math.round(f.political)}</td><td>${Math.round(f.nukes)} (+${Math.round(f.hiddenStockpile)} hidden)</td><td>${(f.stability * 100).toFixed(0)}%</td><td>${govModel}</td><td>${(f.corporatism * 100).toFixed(0)}%</td>`;
    dom.factionTableBody.appendChild(tr);
  });

  state.ttt.maxGamble = computeMaxGamble();
  dom.tttMaxInfo.textContent = `Current max wager: ${state.ttt.maxGamble}. Effects queued: AI skip ${state.pendingEffects.aiSkipTurns}, Intel +${state.pendingEffects.intelSurge}.`;
  dom.tttRoundInfo.textContent = state.ttt.lastRoundSummary || "No high-stakes round played yet.";

  dom.nextTurnBtn.disabled = !state.started || state.gameOver;
  dom.playTttRoundBtn.disabled = !state.started || !state.humanEnabled || state.gameOver || state.ttt.animating;
  dom.convertBtn.disabled = !state.started || !state.humanEnabled || state.gameOver;
  dom.downloadReportBtn.disabled = !state.gameOver;
  refreshMapColors();
}

function updateStrikeControl() {
  dom.strikeTypeSelect.disabled = dom.actionSelect.value !== "Nuclear Strike";
}

function onHumanAction() {
  if (!state.started || !state.humanEnabled || state.gameOver) return;
  const actor = state.factions.find((f) => f.isHuman);
  const action = dom.actionSelect.value;
  const target = state.factions.find((f) => f.id === dom.targetFactionSelect.value) || state.factions[1];
  const region = state.selectedRegionId || getCurrentRegions()[0].id;
  resolveAction(actor, action, target, region, true, dom.strikeTypeSelect.value);
  endTurnChecks();
}

function resolveAction(actor, action, target, regionId, isHuman = false, strikeType = NUCLEAR_STRIKE_TYPES[0]) {
  const era = ERA_PRESETS[state.era];
  const luck = 0.78 + Math.random() * 0.6;
  const regionName = getCurrentRegions().find((r) => r.id === regionId)?.name || regionId;
  const spend = (r = 0, p = 0) => {
    actor.resources = Math.max(0, actor.resources - r);
    actor.political = Math.max(0, actor.political - p);
  };

  if (action === "Military Pressure") {
    spend(15 * era.warFriction, 6);
    if (actor.military * actor.tech * luck - target.stability > 0.82) {
      transferRegion(target, actor, regionId);
      actor.stability += 0.02;
      log(`${actor.name} used military pressure and took ${regionName} from ${target.name}.`);
    } else {
      actor.stability -= 0.04;
      log(`${actor.name} failed military pressure in ${regionName}.`);
    }
  } else if (action === "Economic Capture") {
    spend(18, 8);
    if (actor.resources / 100 + actor.corporatism - target.democracy + Math.random() > 1.1) {
      transferRegion(target, actor, regionId);
      log(`${actor.name} economically captured ${regionName}.`);
    } else {
      log(`${actor.name}'s economic coercion in ${regionName} was resisted.`);
    }
  } else if (action === "Puppet Regime") {
    spend(14, 14);
    if (Math.random() + actor.political / 150 > target.democracy) {
      transferRegion(target, actor, regionId);
      target.democracy -= 0.08;
      log(`${actor.name} installed a puppet regime in ${regionName}.`);
    } else {
      actor.political -= 5;
      log(`${actor.name} failed to establish a puppet regime in ${regionName}.`);
    }
  } else if (action === "Support Sovereignty") {
    spend(10, 12);
    actor.political += 10 * era.diplomacyBoost;
    actor.stability += 0.04;
    target.stability += 0.03;
    log(`${actor.name} supported sovereignty in ${regionName}.`);
  } else if (action === "Dialogue Summit") {
    spend(6, 10);
    actor.political += 12 * era.diplomacyBoost;
    target.political += 4;
    actor.stability += 0.02;
    log(`${actor.name} held dialogue with ${target.name}.`);
  } else if (action === "Invest in Technology") {
    spend(18, 8);
    const techGain = (0.08 + Math.random() * 0.06) * era.techBoost;
    actor.tech += techGain;
    actor.military += techGain * 0.4;
    log(`${actor.name} upgraded technology (+${techGain.toFixed(2)}).`);
  } else if (action === "Expand Nuclear Stockpile") {
    spend(20, 6);
    const gain = 1 + Math.floor(Math.random() * 3);
    actor.nukes += gain;
    actor.political -= 2;
    log(`${actor.name} publicly expanded stockpile by ${gain}.`);
  } else if (action === "Secret Stockpile Build") {
    spend(16, 8);
    actor.hiddenStockpile += 1 + Math.floor(Math.random() * 2);
    log(`${actor.name} secretly increased hidden stockpile.`);
  } else if (action === "Disarmament Deal") {
    spend(4, 14);
    const sacrifice = Math.min(actor.nukes, 1 + Math.floor(Math.random() * 2));
    actor.nukes -= sacrifice;
    actor.political += 16;
    actor.stability += 0.05;
    log(`${actor.name} agreed disarmament (${sacrifice} warheads removed).`);
  } else if (action === "Nuclear Strike") {
    resolveNuclearStrike(actor, target, strikeType);
  } else if (action === "Deploy Nuclear Triad") {
    spend(8, 8);
    actor.deployments.submarines += 1;
    actor.deployments.silos += 1;
    actor.deployments.bombers += 1;
    actor.stability += 0.02;
    log(`${actor.name} expanded triad deployment.`);
  } else if (action === "Instigate Revolution") {
    resolveRevolutionAttempt(actor, target, regionId);
  }

  actor.resources += 8 + Math.random() * 5;
  actor.political += isHuman ? 0 : 4 * (actor.objectives.peace - 0.2);
  normalizeFaction(actor);
  normalizeFaction(target);
}

function resolveNuclearStrike(actor, target, strikeType) {
  const available = actor.nukes + actor.hiddenStockpile;
  if (available < 1) return log(`${actor.name} attempted ${strikeType} with no available warheads.`);
  const use = Math.min(available, Math.max(1, Math.floor(available / 2)));
  const fromHidden = Math.min(actor.hiddenStockpile, use);
  actor.hiddenStockpile -= fromHidden;
  actor.nukes -= (use - fromHidden);

  const penalty = 35 * ERA_PRESETS[state.era].nuclearNorm;
  actor.political -= penalty;
  actor.stability -= 0.18;
  target.stability -= 0.25;
  if (Math.random() < 0.5 + target.nukes * 0.05) {
    actor.stability -= 0.14;
    actor.political -= 12;
    log(`⚠️ ${actor.name} launched ${strikeType} (${use} warheads) at ${target.name}; retaliation risk materialized.`);
  } else {
    log(`☢️ ${actor.name} launched ${strikeType} (${use} warheads) at ${target.name}; legitimacy collapsed.`);
  }
}

function resolveRevolutionAttempt(actor, target, regionId) {
  const regionOwnerId = state.mapOwnership[regionId];
  if (regionOwnerId !== target.id) {
    log(`Revolution failed setup: ${target.name} does not control this zone.`);
    return;
  }

  const existing = state.contestedRegions.find((c) => c.regionId === regionId);
  if (existing) {
    existing.attackerSupport = clamp(existing.attackerSupport + 0.08 + Math.random() * 0.04, 0, 1);
    existing.defenderSupport = clamp(existing.defenderSupport - 0.05, 0, 1);
    actor.political -= 5;
    log(`${actor.name} injected support into existing revolt at ${regionId}.`);
    return;
  }

  const attackerBase = 0.43 + Math.random() * 0.08 + (state.pendingEffects.intelSurge ? 0.05 : 0);
  const intelDefense = 0.44 + (target.tech * 0.03) + (target.regions.length / getCurrentRegions().length) * 0.07;
  state.contestedRegions.push({
    regionId,
    attackerId: actor.id,
    defenderId: target.id,
    attackerSupport: clamp(attackerBase, 0.3, 0.6),
    defenderSupport: clamp(intelDefense, 0.35, 0.65),
    turnCreated: state.turn
  });
  actor.resources -= 10;
  actor.political -= 10;
  log(`${actor.name} instigated revolution in ${regionId}. Control moved near 50/50; defender intel still active.`);
  if (state.pendingEffects.intelSurge) state.pendingEffects.intelSurge -= 1;
}

function advanceTurn() {
  if (!state.started || state.gameOver) return;

  const aiSkip = state.pendingEffects.aiSkipTurns;
  if (state.humanEnabled && aiSkip > 0) {
    state.pendingEffects.aiSkipTurns -= 1;
    log("Double-turn effect active: AI cycle skipped this turn.");
  } else {
    state.factions.filter((f) => !f.isHuman).forEach((ai) => {
      const target = pickTarget(ai);
      const region = target.regions[Math.floor(Math.random() * Math.max(target.regions.length, 1))] || getCurrentRegions()[0].id;
      const action = chooseAiAction(ai, target);
      const strikeType = NUCLEAR_STRIKE_TYPES[Math.floor(Math.random() * NUCLEAR_STRIKE_TYPES.length)];
      resolveAction(ai, action, target, region, false, strikeType);
    });
  }

  resolveContestedRegions();
  systemicDrift();
  state.turn += 1;
  endTurnChecks();
}

function resolveContestedRegions() {
  const copy = [...state.contestedRegions];
  copy.forEach((zone) => {
    const attacker = state.factions.find((f) => f.id === zone.attackerId);
    const defender = state.factions.find((f) => f.id === zone.defenderId);
    if (!attacker || !defender) return;

    zone.attackerSupport = clamp(zone.attackerSupport + (Math.random() - 0.47) * 0.08 + attacker.political / 2000, 0, 1);
    zone.defenderSupport = clamp(zone.defenderSupport + (Math.random() - 0.53) * 0.08 + defender.tech / 200, 0, 1);

    const diff = Math.abs(zone.attackerSupport - zone.defenderSupport);
    if (diff <= 0.12) {
      const showdown = simulateStakeMatch(Math.max(5, Math.floor(state.turn * 0.8)), "Double Turn", true);
      const boardPrint = showdown.board.slice(0, 3).join("") + "/" + showdown.board.slice(3, 6).join("") + "/" + showdown.board.slice(6).join("");
      if (showdown.outcome === "X") {
        transferRegion(defender, attacker, zone.regionId);
        attacker.political += showdown.effectiveOpp;
        log(`Revolution showdown at ${zone.regionId}: attacker won via high-stakes TTT (${boardPrint}), seized control.`);
        removeContested(zone.regionId);
      } else if (showdown.outcome === "O") {
        defender.political += showdown.effectiveOpp;
        attacker.stability -= 0.05;
        log(`Revolution showdown at ${zone.regionId}: defender held using territory intel (${boardPrint}).`);
        removeContested(zone.regionId);
      } else {
        attacker.political -= 8;
        defender.political -= 8;
        if (Math.random() < 0.35) {
          state.mapOwnership[zone.regionId] = null;
          attacker.regions = attacker.regions.filter((r) => r !== zone.regionId);
          defender.regions = defender.regions.filter((r) => r !== zone.regionId);
          log(`Revolution cat's game at ${zone.regionId}: no winner, mutual penalties, merged governance/neutrality formed.`);
          removeContested(zone.regionId);
        } else {
          log(`Revolution cat's game at ${zone.regionId}: no winner; crisis remains unresolved.`);
        }
      }
      return;
    }

    if (zone.attackerSupport > 0.72) {
      transferRegion(defender, attacker, zone.regionId);
      log(`Revolution tipped in ${zone.regionId}; attacker took control without showdown.`);
      removeContested(zone.regionId);
    } else if (zone.defenderSupport > 0.72) {
      log(`Incumbent security crushed uprising in ${zone.regionId}.`);
      removeContested(zone.regionId);
    }
  });
}

function removeContested(regionId) {
  state.contestedRegions = state.contestedRegions.filter((z) => z.regionId !== regionId);
}

function chooseAiAction(ai, target) {
  const pressure = (1 - ai.stability) + (1 - ai.democracy) * 0.4 + (ai.crazyLeader ? 0.5 : 0);
  const madRestraint = ERA_PRESETS[state.era].nuclearNorm + target.nukes * 0.08;
  if (ai.nukes + ai.hiddenStockpile > 3 && pressure > 1.0 && Math.random() > madRestraint * 0.35) return "Nuclear Strike";
  if (Math.random() < 0.13 && target.regions.length > 0) return "Instigate Revolution";

  const pool = ["Military Pressure", "Economic Capture", "Puppet Regime", "Support Sovereignty", "Dialogue Summit", "Invest in Technology", "Expand Nuclear Stockpile", "Secret Stockpile Build", "Disarmament Deal", "Deploy Nuclear Triad"];
  if (ai.political < 30) return "Dialogue Summit";
  if (ai.resources < 25) return "Support Sovereignty";
  if (ai.objectives.economy > 0.65) return Math.random() > 0.4 ? "Economic Capture" : "Invest in Technology";
  return pool[Math.floor(Math.random() * pool.length)];
}

function pickTarget(ai) {
  const others = state.factions.filter((f) => f.id !== ai.id);
  others.sort((a, b) => b.resources + b.political - (a.resources + a.political));
  return others[0];
}

function transferRegion(from, to, regionId) {
  if (!regionId) return;
  state.mapOwnership[regionId] = to.id;
  from.regions = from.regions.filter((r) => r !== regionId);
  if (!to.regions.includes(regionId)) to.regions.push(regionId);
}

function systemicDrift() {
  state.factions.forEach((f) => {
    f.democracy += (Math.random() - 0.5) * 0.08;
    f.corporatism += (Math.random() - 0.45) * 0.07;
    if (f.crazyLeader) {
      f.stability -= 0.03;
      f.political -= 2;
    }
    if (f.democracy < 0.25 && Math.random() < 0.25) {
      f.crazyLeader = true;
      log(`${f.name} now has volatile leadership due to institutional decay.`);
    }
    normalizeFaction(f);
  });
}

function convertPoints() {
  if (!state.started || !state.humanEnabled || state.gameOver) return;
  const human = state.factions.find((f) => f.isHuman);
  const from = dom.convertFrom.value;
  const to = dom.convertTo.value;
  const amount = Number(dom.convertAmount.value);
  if (from === to || Number.isNaN(amount) || amount <= 0) return log("Conversion failed: choose different pools and positive amount.");
  if (human[from] < amount) return log("Conversion failed: insufficient points.");

  human[from] -= amount;
  human[to] += amount * 0.7;
  log(`Converted ${amount} ${from} to ${(amount * 0.7).toFixed(1)} ${to}.`);
  endTurnChecks();
}

function computeMaxGamble() {
  return Math.min(140, 10 + Math.floor(state.turn * 2.8));
}

async function playTttRound() {
  if (!state.started || !state.humanEnabled || state.gameOver || state.ttt.animating) return;
  const human = state.factions.find((f) => f.isHuman);
  const wager = clamp(Number(dom.tttGambleInput.value || 0), 1, computeMaxGamble());
  const chosenPerk = dom.tttPerkSelect.value;
  if (human.political < wager) return log("Tic-Tac-Toe stake blocked: insufficient political points.");

  state.ttt.animating = true;
  state.ttt.board = Array(9).fill("");
  renderTicTacToe();

  const hiddenOpponentWager = 1 + Math.floor(Math.random() * computeMaxGamble());
  log(`High-stakes TTT started. Your wager: ${wager}; opponent wager hidden; chosen perk: ${chosenPerk}.`);

  let outcome = null;
  let symbol = "X";
  const available = [...Array(9)].map((_, i) => i);
  while (available.length && !outcome) {
    const move = available.splice(Math.floor(Math.random() * available.length), 1)[0];
    state.ttt.board[move] = symbol;
    renderTicTacToe();
    outcome = evaluateTtt(state.ttt.board);
    symbol = symbol === "X" ? "O" : "X";
    await delay(220);
  }

  applyTttSettlement(outcome || "draw", wager, hiddenOpponentWager, chosenPerk);
  state.ttt.animating = false;
  endTurnChecks();
}

function simulateStakeMatch(baseWager, chosenPerk, hidden = false) {
  const board = Array(9).fill("");
  let symbol = "X";
  const available = [...Array(9)].map((_, i) => i);
  let outcome = null;
  while (available.length && !outcome) {
    const move = available.splice(Math.floor(Math.random() * available.length), 1)[0];
    board[move] = symbol;
    outcome = evaluateTtt(board);
    symbol = symbol === "X" ? "O" : "X";
  }
  const opp = 1 + Math.floor(Math.random() * Math.max(2, baseWager));
  const luckHuman = 0.9 + Math.random() * 0.2;
  const luckOpp = 0.9 + Math.random() * 0.2;
  return {
    outcome: outcome || "draw",
    board,
    wager: baseWager,
    oppWager: opp,
    effectiveHuman: Math.round(baseWager * luckHuman),
    effectiveOpp: Math.round(opp * luckOpp),
    chosenPerk,
    hidden
  };
}

function applyPerkIfWon(perk) {
  if (perk === "Double Turn") {
    state.pendingEffects.aiSkipTurns += 1;
    log("Perk awarded: Double Turn (next AI cycle skipped).");
  } else if (perk === "Intel Surge") {
    state.pendingEffects.intelSurge += 1;
    log("Perk awarded: Intel Surge (next revolution attempt boosted).");
  } else if (perk === "Stability Shield") {
    state.pendingEffects.stabilityShield += 1;
    const human = state.factions.find((f) => f.isHuman);
    human.stability = clamp(human.stability + 0.08, 0, 1);
    log("Perk awarded: Stability Shield (+stability). ");
  }
}

function applyTttSettlement(outcome, humanWager, opponentWager, chosenPerk) {
  const human = state.factions.find((f) => f.isHuman);
  const luckHuman = 0.9 + Math.random() * 0.2;
  const luckOpp = 0.9 + Math.random() * 0.2;
  const effectiveHumanWager = Math.round(humanWager * luckHuman);
  const effectiveOppWager = Math.round(opponentWager * luckOpp);

  if (outcome === "X") {
    human.political += effectiveOppWager;
    applyPerkIfWon(chosenPerk);
    state.ttt.lastRoundSummary = `Win: your ${humanWager}→${effectiveHumanWager}, hidden opp ${opponentWager}→${effectiveOppWager}, perk ${chosenPerk}.`;
    log(`TTT win. Hidden opponent wager ${opponentWager}. Net +${effectiveOppWager}.`);
  } else if (outcome === "O") {
    human.political -= effectiveHumanWager;
    state.ttt.lastRoundSummary = `Loss: your ${humanWager}→${effectiveHumanWager}, hidden opp ${opponentWager}→${effectiveOppWager}.`;
    log(`TTT loss. Hidden opponent wager ${opponentWager}. Net -${effectiveHumanWager}.`);
  } else {
    const mutualPenalty = Math.round((effectiveHumanWager + effectiveOppWager) * 0.2);
    human.political -= mutualPenalty;
    if (Math.random() < 0.22) {
      human.resources += 5;
      state.ttt.lastRoundSummary = `Cat game tie: mutual penalty ${mutualPenalty}; temporary merger yielded +5 resources.`;
      log(`TTT cat game: mutual penalty ${mutualPenalty}; negotiated merger bonus gained.`);
    } else {
      state.ttt.lastRoundSummary = `Cat game tie: mutual penalty ${mutualPenalty}; no side could secure victory.`;
      log(`TTT cat game: mutual penalty ${mutualPenalty}; no win state reached.`);
    }
  }
  normalizeFaction(human);
}

function normalizeFaction(f) {
  f.resources = clamp(f.resources, 0, 320);
  f.political = clamp(f.political, 0, 320);
  f.nukes = clamp(f.nukes, 0, 120);
  f.hiddenStockpile = clamp(f.hiddenStockpile, 0, 80);
  f.stability = clamp(f.stability, 0.05, 1);
  f.democracy = clamp(f.democracy, 0, 1);
  f.corporatism = clamp(f.corporatism, 0, 1);
}

function renderTicTacToe() {
  dom.tttBoard.innerHTML = "";
  state.ttt.board.forEach((value) => {
    const cell = document.createElement("div");
    cell.className = "ttt-cell";
    cell.textContent = value;
    dom.tttBoard.appendChild(cell);
  });
}

function evaluateTtt(board) {
  const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  for (const [a,b,c] of lines) if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  return board.every(Boolean) ? "draw" : null;
}

function resetTicTacToe() {
  state.ttt.board = Array(9).fill("");
  state.ttt.animating = false;
  renderTicTacToe();
}

function endTurnChecks() {
  if (!state.started) return;

  const controlledCount = state.factions.map((f) => f.regions.length);
  const maxControlled = Math.max(...controlledCount, 0);
  const winner = state.factions.find((f) => f.regions.length === maxControlled && maxControlled >= Math.ceil(getCurrentRegions().length * 0.55));
  const neutralRegions = Object.values(state.mapOwnership).filter((v) => !v).length;

  if (winner || state.turn >= MAX_TURNS || neutralRegions >= Math.floor(getCurrentRegions().length * 0.35)) {
    state.gameOver = true;
    stopAutoAdvance();
    if (winner) {
      log(`Game complete. Winner: ${winner.name}. Download report for analysis.`);
    } else {
      log("Game ended in strategic deadlock: no guaranteed win condition remained.");
    }
  }

  updateUI();
}

function downloadReport() {
  if (!state.gameOver) return;
  const payload = {
    generatedAt: new Date().toISOString(),
    era: state.era,
    turns: state.turn,
    humanEnabled: state.humanEnabled,
    neutralRegions: Object.entries(state.mapOwnership).filter(([, owner]) => !owner).map(([id]) => id),
    contestedRegions: state.contestedRegions,
    pendingEffects: state.pendingEffects,
    factions: state.factions.map((f) => ({
      name: f.name,
      isHuman: f.isHuman,
      resources: Math.round(f.resources),
      political: Math.round(f.political),
      nukes: Math.round(f.nukes),
      hiddenStockpile: Math.round(f.hiddenStockpile),
      stability: Number(f.stability.toFixed(3)),
      democracy: Number(f.democracy.toFixed(3)),
      corporatism: Number(f.corporatism.toFixed(3)),
      regions: f.regions
    })),
    mapOwnership: state.mapOwnership,
    tttSummary: state.ttt.lastRoundSummary,
    log: state.logEntries
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `world-strategy-report-turn-${state.turn}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function log(message) {
  const line = `T${state.turn}: ${message}`;
  state.logEntries.push(line);
  const item = document.createElement("div");
  item.className = "log-entry";
  item.textContent = line;
  dom.log.prepend(item);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

init();
