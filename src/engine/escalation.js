(function initEscalationModule(global) {
  const engine = (global.GameEngine = global.GameEngine || {});

  function updateEscalation({ state, level }) {
    if (!state?.scenarioSettings?.escalationTrackingEnabled) return { advanced: false, level: state?.escalation?.current };

    const order = { conventional: 0, limitedNuclear: 1, fullExchange: 2 };
    if (state.escalation?.counts?.[level] === undefined) state.escalation.counts[level] = 0;

    state.escalation.counts[level] += 1;

    const previousLevel = state.escalation.current;
    const advanced = (order[level] ?? -1) > (order[previousLevel] ?? -1);
    if (advanced) state.escalation.current = level;

    return { advanced, level: state.escalation.current, previousLevel };
  }

  engine.updateEscalation = updateEscalation;
})(window);
