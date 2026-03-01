(function initVictoryModule(global) {
  const engine = (global.GameEngine = global.GameEngine || {});

  function checkVictory({ state, constants, byId, leaderFaction }) {
    const threshold = state.scenarioSettings.victoryControlThreshold || constants.defaultVictoryControlThreshold;
    const canDeclareTerritoryWin = state.turn >= constants.minTurnsBeforeVictoryCheck;
    const territoryWinner = canDeclareTerritoryWin
      ? state.factions.find((f) => f.regions.length >= Math.ceil(state.regions.length * threshold))
      : null;

    const controlledContinentsByFaction = {};
    Object.values(state.continentState || {}).forEach((entry) => {
      if (!entry?.controlledByFaction) return;
      controlledContinentsByFaction[entry.controlledByFaction] = (controlledContinentsByFaction[entry.controlledByFaction] || 0) + 1;
    });

    const continentWinnerId = Object.entries(controlledContinentsByFaction).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
    const canDeclareContinentWin = state.turn >= constants.minTurnsBeforeVictoryCheck;
    const continentWinner = canDeclareContinentWin && continentWinnerId && controlledContinentsByFaction[continentWinnerId] >= 2
      ? byId(continentWinnerId)
      : null;
    const winner = territoryWinner || continentWinner;

    if (winner) {
      return { gameOver: true, winner, victoryType: winner === continentWinner && !territoryWinner ? "continent" : "territory" };
    }

    if (
      state.paradigmState !== "normal"
      && (state.turn >= constants.maxTurns || state.paradigmState === "mutualCollapse" || state.paradigmState === "stalemate")
    ) {
      return { gameOver: true, victoryType: "paradigm", paradigmState: state.paradigmState };
    }

    if (state.turn >= constants.maxTurns) {
      return { gameOver: true, victoryType: "timeout", winner: leaderFaction() };
    }

    return { gameOver: false };
  }

  engine.checkVictory = checkVictory;
})(window);
