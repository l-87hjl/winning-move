const ERA_PRESETS = {
  2026: {
    techBoost: 1.2,
    diplomacyBoost: 1.2,
    warFriction: 1.0,
    nuclearNorm: 1.3,
    description: "Information-rich multipolar competition"
  },
  1984: {
    techBoost: 1.0,
    diplomacyBoost: 0.85,
    warFriction: 1.1,
    nuclearNorm: 1.0,
    description: "Block politics and MAD pressure"
  },
  1939: {
    techBoost: 0.75,
    diplomacyBoost: 0.7,
    warFriction: 1.3,
    nuclearNorm: 0.3,
    description: "Total-war mindset and fragile institutions"
  }
};

const ACTIONS = [
  "Military Pressure",
  "Economic Capture",
  "Puppet Regime",
  "Support Sovereignty",
  "Dialogue Summit",
  "Invest in Technology",
  "Expand Nuclear Stockpile",
  "Secret Stockpile Build",
  "Disarmament Deal",
  "Nuclear Strike",
  "Deploy Nuclear Triad"
];

const REGIONS = [
  { id: "north_america", name: "North America", x: 90, y: 90, w: 160, h: 90 },
  { id: "south_america", name: "South America", x: 180, y: 220, w: 90, h: 130 },
  { id: "europe", name: "Europe", x: 350, y: 85, w: 90, h: 70 },
  { id: "africa", name: "Africa", x: 355, y: 175, w: 120, h: 150 },
  { id: "middle_east", name: "Middle East", x: 460, y: 145, w: 95, h: 85 },
  { id: "asia", name: "Asia", x: 520, y: 80, w: 220, h: 170 },
  { id: "oceania", name: "Oceania", x: 650, y: 280, w: 120, h: 90 }
];

const COLORS = ["#60a5fa", "#34d399", "#f59e0b", "#f472b6", "#a78bfa", "#f87171"];

const state = {
  turn: 0,
  started: false,
  era: "2026",
  humanEnabled: true,
  factions: [],
  selectedRegionId: null,
  mapOwnership: {},
  ttt: {
    board: Array(9).fill(""),
    active: true
  }
};

const dom = {
  eraSelect: document.getElementById("eraSelect"),
  humanSelect: document.getElementById("humanSelect"),
  startBtn: document.getElementById("startBtn"),
  nextTurnBtn: document.getElementById("nextTurnBtn"),
  worldMap: document.getElementById("worldMap"),
  turnInfo: document.getElementById("turnInfo"),
  factionTableBody: document.querySelector("#factionTable tbody"),
  actionSelect: document.getElementById("actionSelect"),
  targetFactionSelect: document.getElementById("targetFactionSelect"),
  targetRegionInput: document.getElementById("targetRegionInput"),
  executeActionBtn: document.getElementById("executeActionBtn"),
  humanControls: document.getElementById("humanControls"),
  convertFrom: document.getElementById("convertFrom"),
  convertTo: document.getElementById("convertTo"),
  convertAmount: document.getElementById("convertAmount"),
  convertBtn: document.getElementById("convertBtn"),
  tttBoard: document.getElementById("tttBoard"),
  resetTttBtn: document.getElementById("resetTttBtn"),
  log: document.getElementById("log")
};

function init() {
  ACTIONS.forEach((action) => {
    const option = document.createElement("option");
    option.value = action;
    option.textContent = action;
    dom.actionSelect.appendChild(option);
  });

  dom.startBtn.addEventListener("click", startGame);
  dom.nextTurnBtn.addEventListener("click", advanceTurn);
  dom.executeActionBtn.addEventListener("click", onHumanAction);
  dom.convertBtn.addEventListener("click", convertPoints);
  dom.resetTttBtn.addEventListener("click", resetTicTacToe);

  renderTicTacToe();
  renderMap();
}

function startGame() {
  state.era = dom.eraSelect.value;
  state.humanEnabled = dom.humanSelect.value === "yes";
  state.turn = 1;
  state.started = true;
  state.selectedRegionId = null;

  state.factions = createFactions();
  assignRegions();
  resetTicTacToe();

  dom.nextTurnBtn.disabled = false;
  dom.humanControls.classList.toggle("disabled", !state.humanEnabled);

  populateTargets();
  log(`Scenario started for ${state.era}: ${ERA_PRESETS[state.era].description}.`);
  updateUI();
}

function createFactions() {
  const baseNames = ["Human Coalition", "Orion Pact", "Atlas League", "Pacific Bloc", "Northern Union", "Saffron Compact"];
  const count = 5;
  const factions = [];

  for (let i = 0; i < count; i += 1) {
    const isHuman = state.humanEnabled && i === 0;
    const crazyLeader = Math.random() < 0.2;
    factions.push({
      id: `f${i}`,
      name: baseNames[i],
      color: COLORS[i],
      isHuman,
      resources: 90 + Math.floor(Math.random() * 35),
      political: 80 + Math.floor(Math.random() * 30),
      nukes: state.era === "1939" ? 0 : 2 + Math.floor(Math.random() * 6),
      tech: 1 + Math.random() * 0.4,
      military: 1 + Math.random() * 0.4,
      democracy: 0.3 + Math.random() * 0.7,
      corporatism: Math.random(),
      stability: 0.55 + Math.random() * 0.4,
      crazyLeader,
      hiddenStockpile: 0,
      deployments: {
        submarines: 0,
        silos: 0,
        bombers: 0
      },
      objectives: {
        dominance: Math.random(),
        peace: Math.random(),
        economy: Math.random()
      },
      regions: []
    });
  }

  return factions;
}

function assignRegions() {
  state.mapOwnership = {};
  REGIONS.forEach((region, i) => {
    const owner = state.factions[i % state.factions.length];
    owner.regions.push(region.id);
    state.mapOwnership[region.id] = owner.id;
  });
}

function renderMap() {
  dom.worldMap.innerHTML = "";
  REGIONS.forEach((region) => {
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", region.x);
    rect.setAttribute("y", region.y);
    rect.setAttribute("width", region.w);
    rect.setAttribute("height", region.h);
    rect.setAttribute("rx", 10);
    rect.setAttribute("class", "region");
    rect.dataset.regionId = region.id;

    rect.addEventListener("click", () => {
      state.selectedRegionId = region.id;
      dom.targetRegionInput.value = region.name;
      highlightRegion();
    });

    dom.worldMap.appendChild(rect);

    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.setAttribute("x", region.x + 8);
    label.setAttribute("y", region.y + 20);
    label.setAttribute("fill", "#e2e8f0");
    label.setAttribute("font-size", "13");
    label.textContent = region.name;
    dom.worldMap.appendChild(label);
  });
  refreshMapColors();
}

function refreshMapColors() {
  Array.from(dom.worldMap.querySelectorAll("rect.region")).forEach((rect) => {
    const regionId = rect.dataset.regionId;
    const owner = state.factions.find((f) => f.id === state.mapOwnership[regionId]);
    rect.setAttribute("fill", owner ? owner.color : "#64748b");
  });
  highlightRegion();
}

function highlightRegion() {
  Array.from(dom.worldMap.querySelectorAll("rect.region")).forEach((rect) => {
    rect.classList.toggle("selected", rect.dataset.regionId === state.selectedRegionId);
  });
}

function populateTargets() {
  dom.targetFactionSelect.innerHTML = "";
  state.factions
    .filter((f) => !f.isHuman)
    .forEach((f) => {
      const option = document.createElement("option");
      option.value = f.id;
      option.textContent = f.name;
      dom.targetFactionSelect.appendChild(option);
    });
}

function updateUI() {
  const era = ERA_PRESETS[state.era];
  dom.turnInfo.innerHTML = `<p><strong>Turn:</strong> ${state.turn} | <strong>Era:</strong> ${state.era} | <strong>MAD pressure:</strong> ${(era.nuclearNorm * 100).toFixed(0)}%</p>`;

  dom.factionTableBody.innerHTML = "";
  state.factions.forEach((f) => {
    const tr = document.createElement("tr");
    const govModel = f.democracy > 0.6 ? "Democratic" : f.democracy > 0.35 ? "Hybrid" : "Authoritarian";
    tr.innerHTML = `
      <td style="color:${f.color}">${f.name}</td>
      <td>${f.isHuman ? "Human" : "AI"}${f.crazyLeader ? " / volatile" : ""}</td>
      <td>${Math.round(f.resources)}</td>
      <td>${Math.round(f.political)}</td>
      <td>${Math.round(f.nukes)} (+${Math.round(f.hiddenStockpile)} hidden)</td>
      <td>${(f.stability * 100).toFixed(0)}%</td>
      <td>${govModel}</td>
      <td>${(f.corporatism * 100).toFixed(0)}%</td>
    `;
    dom.factionTableBody.appendChild(tr);
  });

  refreshMapColors();
}

function onHumanAction() {
  if (!state.started || !state.humanEnabled) return;
  const actor = state.factions.find((f) => f.isHuman);
  const action = dom.actionSelect.value;
  const target = state.factions.find((f) => f.id === dom.targetFactionSelect.value) || state.factions[1];
  const region = state.selectedRegionId || REGIONS[0].id;

  resolveAction(actor, action, target, region, true);
  updateUI();
}

function resolveAction(actor, action, target, regionId, isHuman = false) {
  const era = ERA_PRESETS[state.era];
  const luck = 0.75 + Math.random() * 0.7;
  const regionName = REGIONS.find((r) => r.id === regionId)?.name || "Unknown region";

  const spend = (r = 0, p = 0) => {
    actor.resources = Math.max(0, actor.resources - r);
    actor.political = Math.max(0, actor.political - p);
  };

  if (action === "Military Pressure") {
    spend(15 * era.warFriction, 6);
    const score = actor.military * actor.tech * luck - target.stability;
    if (score > 0.8) {
      transferRegion(target, actor, regionId);
      actor.stability += 0.02;
      log(`${actor.name} used military pressure and took ${regionName} from ${target.name}.`);
    } else {
      actor.stability -= 0.04;
      log(`${actor.name} failed military pressure in ${regionName}; instability rose.`);
    }
  } else if (action === "Economic Capture") {
    spend(18, 8);
    const score = actor.resources / 100 + actor.corporatism - target.democracy + Math.random();
    if (score > 1.1) {
      transferRegion(target, actor, regionId);
      log(`${actor.name} economically captured ${regionName} via debt and market control.`);
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
    log(`${actor.name} supported sovereignty in ${regionName}, gaining soft-power legitimacy.`);
  } else if (action === "Dialogue Summit") {
    spend(6, 10);
    actor.political += 12 * era.diplomacyBoost;
    target.political += 4;
    actor.stability += 0.02;
    log(`${actor.name} held dialogue with ${target.name}; tensions decreased.`);
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
    const hiddenGain = 1 + Math.floor(Math.random() * 2);
    actor.hiddenStockpile += hiddenGain;
    log(`${actor.name} secretly increased hidden stockpile.`);
  } else if (action === "Disarmament Deal") {
    spend(4, 14);
    const sacrifice = Math.min(actor.nukes, 1 + Math.floor(Math.random() * 2));
    actor.nukes -= sacrifice;
    actor.political += 16;
    actor.stability += 0.05;
    log(`${actor.name} agreed to disarmament (${sacrifice} warheads removed) for political favor.`);
  } else if (action === "Nuclear Strike") {
    const available = actor.nukes + actor.hiddenStockpile;
    if (available < 1) {
      log(`${actor.name} attempted a nuclear strike but has no warheads available.`);
      return;
    }
    const use = Math.min(available, Math.max(1, Math.floor(available / 2)));
    const fromHidden = Math.min(actor.hiddenStockpile, use);
    actor.hiddenStockpile -= fromHidden;
    actor.nukes -= (use - fromHidden);

    const penalty = 35 * era.nuclearNorm;
    actor.political -= penalty;
    actor.stability -= 0.18;
    target.stability -= 0.25;

    if (Math.random() < 0.5 + target.nukes * 0.05) {
      actor.stability -= 0.14;
      actor.political -= 12;
      log(`⚠️ ${actor.name} launched ${use} nukes at ${target.name}. Retaliation risk materialized under MAD.`);
    } else {
      log(`☢️ ${actor.name} launched ${use} nukes at ${target.name}. Global legitimacy collapsed.`);
    }
  } else if (action === "Deploy Nuclear Triad") {
    spend(8, 8);
    actor.deployments.submarines += 1;
    actor.deployments.silos += 1;
    actor.deployments.bombers += 1;
    actor.stability += 0.02;
    log(`${actor.name} expanded triad deployment (subs/silos/bombers).`);
  }

  actor.resources += 8 + Math.random() * 5;
  actor.political += isHuman ? 0 : 4 * (actor.objectives.peace - 0.2);
  normalizeFaction(actor);
  normalizeFaction(target);
}

function transferRegion(from, to, regionId) {
  if (!regionId) return;
  state.mapOwnership[regionId] = to.id;
  from.regions = from.regions.filter((r) => r !== regionId);
  if (!to.regions.includes(regionId)) to.regions.push(regionId);
}

function normalizeFaction(f) {
  f.resources = clamp(f.resources, 0, 300);
  f.political = clamp(f.political, 0, 300);
  f.nukes = clamp(f.nukes, 0, 120);
  f.hiddenStockpile = clamp(f.hiddenStockpile, 0, 80);
  f.stability = clamp(f.stability, 0.05, 1);
  f.democracy = clamp(f.democracy, 0, 1);
  f.corporatism = clamp(f.corporatism, 0, 1);
}

function advanceTurn() {
  if (!state.started) return;

  state.factions.filter((f) => !f.isHuman).forEach((ai) => {
    const target = pickTarget(ai);
    const region = target.regions[Math.floor(Math.random() * Math.max(target.regions.length, 1))] || REGIONS[0].id;
    const action = chooseAiAction(ai, target);
    resolveAction(ai, action, target, region);
  });

  systemicDrift();
  state.turn += 1;
  updateUI();
}

function chooseAiAction(ai, target) {
  const pressure = (1 - ai.stability) + (1 - ai.democracy) * 0.4 + (ai.crazyLeader ? 0.5 : 0);
  const madRestraint = ERA_PRESETS[state.era].nuclearNorm + target.nukes * 0.08;

  if (ai.nukes + ai.hiddenStockpile > 3 && pressure > 1.0 && Math.random() > madRestraint * 0.35) {
    return "Nuclear Strike";
  }

  const pool = [
    "Military Pressure",
    "Economic Capture",
    "Puppet Regime",
    "Support Sovereignty",
    "Dialogue Summit",
    "Invest in Technology",
    "Expand Nuclear Stockpile",
    "Secret Stockpile Build",
    "Disarmament Deal",
    "Deploy Nuclear Triad"
  ];

  if (ai.political < 30) return "Dialogue Summit";
  if (ai.resources < 25) return "Support Sovereignty";
  if (ai.objectives.economy > 0.65) return Math.random() > 0.4 ? "Economic Capture" : "Invest in Technology";

  return pool[Math.floor(Math.random() * pool.length)];
}

function pickTarget(ai) {
  const others = state.factions.filter((f) => f.id !== ai.id);
  others.sort((a, b) => (b.resources + b.political) - (a.resources + a.political));
  return others[0];
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
  if (!state.started || !state.humanEnabled) return;
  const human = state.factions.find((f) => f.isHuman);
  const from = dom.convertFrom.value;
  const to = dom.convertTo.value;
  const amount = Number(dom.convertAmount.value);

  if (from === to || Number.isNaN(amount) || amount <= 0) {
    log("Conversion failed: choose different point pools and a positive amount.");
    return;
  }

  const conversionRate = 0.7;
  if (human[from] < amount) {
    log("Conversion failed: insufficient points.");
    return;
  }

  human[from] -= amount;
  human[to] += amount * conversionRate;
  log(`Converted ${amount} ${from} to ${(amount * conversionRate).toFixed(1)} ${to}.`);
  updateUI();
}

function renderTicTacToe() {
  dom.tttBoard.innerHTML = "";
  state.ttt.board.forEach((value, index) => {
    const cell = document.createElement("button");
    cell.className = "ttt-cell";
    cell.textContent = value;
    cell.addEventListener("click", () => playTtt(index));
    dom.tttBoard.appendChild(cell);
  });
}

function playTtt(index) {
  if (!state.started || !state.humanEnabled || !state.ttt.active || state.ttt.board[index]) return;
  state.ttt.board[index] = "X";
  let outcome = evaluateTtt(state.ttt.board);
  if (!outcome) {
    const moves = state.ttt.board.map((v, i) => (v ? null : i)).filter((v) => v !== null);
    const aiMove = moves[Math.floor(Math.random() * moves.length)];
    if (aiMove !== undefined) state.ttt.board[aiMove] = "O";
    outcome = evaluateTtt(state.ttt.board);
  }

  if (outcome) {
    state.ttt.active = false;
    const human = state.factions.find((f) => f.isHuman);
    if (outcome === "X") {
      human.political += 20;
      log("Tic-Tac-Toe win: diplomatic mini-game granted +20 political points.");
    } else if (outcome === "O") {
      human.political -= 10;
      log("Tic-Tac-Toe loss: -10 political points.");
    } else {
      human.political += 5;
      log("Tic-Tac-Toe draw: +5 political points.");
    }
    normalizeFaction(human);
    updateUI();
  }

  renderTicTacToe();
}

function evaluateTtt(board) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  if (board.every(Boolean)) return "draw";
  return null;
}

function resetTicTacToe() {
  state.ttt.board = Array(9).fill("");
  state.ttt.active = true;
  renderTicTacToe();
}

function log(message) {
  const item = document.createElement("div");
  item.className = "log-entry";
  item.textContent = `T${state.turn}: ${message}`;
  dom.log.prepend(item);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

init();
