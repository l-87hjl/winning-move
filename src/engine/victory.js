(function initVictoryModule(global) {
  const engine = (global.GameEngine = global.GameEngine || {});

  // Minimum turns before paradigm-driven endings can fire.
  // This prevents ultra-early collapses from nukes in turn 1-3.
  const MIN_TURNS_MUTUAL_COLLAPSE = 10;
  const MIN_TURNS_STALEMATE      = 15;
  // Minimum continents controlled before a continent-control win is valid.
  const MIN_CONTINENTS_FOR_VICTORY = 3;

  function checkVictory({ state, constants, byId, leaderFaction }) {
    const threshold = state.scenarioSettings.victoryControlThreshold || constants.defaultVictoryControlThreshold;

    // --- Territory victory ---
    const canDeclareTerritoryWin = state.turn >= constants.minTurnsBeforeVictoryCheck;
    const territoryWinner = canDeclareTerritoryWin
      ? state.factions.find((f) => f.regions.length >= Math.ceil(state.regions.length * threshold))
      : null;

    // --- Continent victory ---
    // Require MIN_CONTINENTS_FOR_VICTORY (3) continents to prevent tiny-continent
    // speed-wins in turns 5-8 via Middle East (2 regions) + Oceania (2 regions).
    const controlledContinentsByFaction = {};
    Object.values(state.continentState || {}).forEach((entry) => {
      if (!entry?.controlledByFaction) return;
      controlledContinentsByFaction[entry.controlledByFaction] =
        (controlledContinentsByFaction[entry.controlledByFaction] || 0) + 1;
    });

    const continentWinnerId =
      Object.entries(controlledContinentsByFaction).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
    const canDeclareContinentWin = state.turn >= constants.minTurnsBeforeVictoryCheck;
    const continentWinner =
      canDeclareContinentWin &&
      continentWinnerId &&
      controlledContinentsByFaction[continentWinnerId] >= MIN_CONTINENTS_FOR_VICTORY
        ? byId(continentWinnerId)
        : null;

    const winner = territoryWinner || continentWinner;
    if (winner) {
      return {
        gameOver: true,
        winner,
        victoryType: winner === continentWinner && !territoryWinner ? "continent" : "territory"
      };
    }

    // --- Paradigm endings — require minimum turns so a single early nuke
    //     or a brief stability dip cannot terminate the game in turns 1-9.
    if (state.paradigmState !== "normal") {
      const isMaxTurns = state.turn >= constants.maxTurns;
      const isMutualCollapse =
        state.paradigmState === "mutualCollapse" && state.turn >= MIN_TURNS_MUTUAL_COLLAPSE;
      const isStalemate =
        state.paradigmState === "stalemate" && state.turn >= MIN_TURNS_STALEMATE;
      const isOtherParadigm =
        state.paradigmState !== "mutualCollapse" &&
        state.paradigmState !== "stalemate" &&
        state.turn >= constants.maxTurns;

      if (isMaxTurns || isMutualCollapse || isStalemate || isOtherParadigm) {
        return { gameOver: true, victoryType: "paradigm", paradigmState: state.paradigmState };
      }
    }

    // --- Timeout ---
    if (state.turn >= constants.maxTurns) {
      return { gameOver: true, victoryType: "timeout", winner: leaderFaction() };
    }

    return { gameOver: false };
  }

  engine.checkVictory = checkVictory;
})(window);
