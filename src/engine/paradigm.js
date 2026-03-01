(function initParadigmModule(global) {
  const engine = (global.GameEngine = global.GameEngine || {});

  // Stability floor below which global stalemate is declared.
  // Lowered from 0.28 to 0.22 so brief early-game nuclear exchanges do not
  // instantly collapse the game before meaningful play can occur.
  const STALEMATE_STABILITY_THRESHOLD = 0.22;
  // Turn below which stalemate cannot be declared regardless of stability.
  const STALEMATE_MIN_TURN = 12;
  // Turn below which mutualCollapse cannot be declared even if nukes were used.
  const MUTUAL_COLLAPSE_MIN_TURN = 10;

  function checkParadigmShift({ state, clamp }) {
    state.paradigmState = "normal";

    const globalStability =
      state.factions.reduce((acc, f) => acc + f.stability, 0) / Math.max(1, state.factions.length);

    state.allianceFractureLevel = clamp(
      state.factions.reduce((acc, f) => acc + (f.warFatigue + f.economicStress), 0) /
        Math.max(1, state.factions.length * 2),
      0,
      1
    );

    // mutualCollapse: only after MUTUAL_COLLAPSE_MIN_TURN to prevent a single
    // first-turn nuke (or a human player testing nuclear) from ending the game.
    if (
      state.scenarioSettings.sharedCollapseEnabled &&
      state.stats.nuclearUsage > 0 &&
      state.turn >= MUTUAL_COLLAPSE_MIN_TURN
    ) {
      state.paradigmState = "mutualCollapse";
    } else if (
      state.aiEmergenceTriggered &&
      state.aiDevelopmentProgress >= 0.95 &&
      state.turn >= 8
    ) {
      state.paradigmState = "aiEmergence";
    } else if (
      state.turn >= 12 &&
      (state.scenarioSettings.longTermHorizonWeight || 0) > 1.2 &&
      (state.scenarioSettings.humanitarianWeight || 0) < 0.3 &&
      state.allianceFractureLevel > 0.35
    ) {
      state.paradigmState = "noWinCondition";
    } else if (
      state.turn >= STALEMATE_MIN_TURN &&
      globalStability < STALEMATE_STABILITY_THRESHOLD
    ) {
      // Stalemate: sustained low stability after minimum turns.
      // Requires globalStability < 0.22 (stricter than old 0.28) and turn >= 12.
      state.paradigmState = "stalemate";
    }

    return state.paradigmState;
  }

  engine.checkParadigmShift = checkParadigmShift;
})(window);
