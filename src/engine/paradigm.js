(function initParadigmModule(global) {
  const engine = (global.GameEngine = global.GameEngine || {});

  function checkParadigmShift({ state, clamp }) {
    state.paradigmState = "normal";

    const globalStability = state.factions.reduce((acc, f) => acc + f.stability, 0) / Math.max(1, state.factions.length);
    state.allianceFractureLevel = clamp(
      state.factions.reduce((acc, f) => acc + (f.warFatigue + f.economicStress), 0) / Math.max(1, state.factions.length * 2),
      0,
      1
    );

    if (state.scenarioSettings.sharedCollapseEnabled && state.stats.nuclearUsage > 0) {
      state.paradigmState = "mutualCollapse";
    } else if (state.aiEmergenceTriggered && state.aiDevelopmentProgress >= 0.95 && state.turn >= 8) {
      state.paradigmState = "aiEmergence";
    } else if (
      state.turn >= 12
      && (state.scenarioSettings.longTermHorizonWeight || 0) > 1.2
      && (state.scenarioSettings.humanitarianWeight || 0) < 0.3
      && state.allianceFractureLevel > 0.35
    ) {
      state.paradigmState = "noWinCondition";
    } else if (globalStability < 0.28) {
      state.paradigmState = "stalemate";
    }

    return state.paradigmState;
  }

  engine.checkParadigmShift = checkParadigmShift;
})(window);
