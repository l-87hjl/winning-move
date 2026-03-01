(function initGameModesModule(global) {
  const data = (global.GameData = global.GameData || {});

  // ---------------------------------------------------------------------------
  // Default scenario settings
  // All sliders and checkboxes default to these values unless overridden by a
  // game-mode preset or user interaction.
  // ---------------------------------------------------------------------------
  const SCENARIO_SETTINGS = {
    deterrenceModel:              "probabilistic",
    nuclearPenaltySeverity:       1,
    retaliationCertainty:         0.5,
    escalationReciprocity:        1,
    credibilityWeight:            1,
    humanitarianWeight:           0,
    longTermHorizonWeight:        0,
    domesticBacklashMultiplier:   1,
    surrenderPenaltyWeight:       1,
    globalFalloutSeverity:        0,
    sharedCollapseEnabled:        false,
    guaranteedMad:                false,
    futureWeighting:              1,
    reputationBacklash:           1,
    intelligenceFog:              0,
    victoryControlThreshold:      0.55,
    escalationTrackingEnabled:    true,
    allianceFractureShock:        1,
    climateShockWeight:           1,
    famineShockWeight:            1,
    continentShowdownThreshold:   0.5,
    continentSecureThreshold:     0.6,
    maxContestedTurnsBeforeShowdown: 4
  };

  // ---------------------------------------------------------------------------
  // Game modes
  // Each mode supplies a subset of SCENARIO_SETTINGS overrides.
  // Merged at game start: { ...SCENARIO_SETTINGS, ...(mode.settings) }.
  // ---------------------------------------------------------------------------
  const GAME_MODES = {
    standard: {
      label:       "Standard Game",
      description: "Balanced settings; all systems active at default strength.",
      settings:    {}
    },
    coldWar: {
      label:       "Cold War Deterrence",
      description: "High retaliation certainty; bloc-logic escalation norms.",
      settings: {
        retaliationCertainty:   0.72,
        escalationReciprocity:  0.95,
        globalFalloutSeverity:  0.5
      }
    },
    multipolar: {
      label:       "Multipolar Adaptive",
      description: "Fluid alliances; moderate retaliation with higher reciprocity.",
      settings: {
        retaliationCertainty:   0.55,
        escalationReciprocity:  1.1,
        globalFalloutSeverity:  0.2
      }
    },
    postHuman: {
      label:       "Post-Human Emergence",
      description: "AI factions optimize for long-horizon compute; humanitarian calculus active.",
      settings: {
        longTermHorizonWeight:  1.3,
        humanitarianWeight:     0.15
      }
    },
    payne: {
      label:       "Payne Escalation Model",
      description: "Probabilistic deterrence with full humanitarian cost accounting.",
      settings: {
        deterrenceModel:              "probabilistic",
        retaliationCertainty:         0.85,
        escalationReciprocity:        0.82,
        nuclearPenaltySeverity:       1,
        globalFalloutSeverity:        1,
        domesticBacklashMultiplier:   1,
        credibilityWeight:            1,
        humanitarianWeight:           0.2,
        longTermHorizonWeight:        0.5,
        surrenderPenaltyWeight:       1,
        sharedCollapseEnabled:        false
      }
    }
  };

  // ---------------------------------------------------------------------------
  // Scenario types (higher-level narrative configurations)
  // These preset ERA + game mode combos and can override individual settings.
  // ---------------------------------------------------------------------------
  const SCENARIO_TYPES = {
    great_power:   {
      label:    "Great Power Competition",
      era:      "2026",
      gameMode: "multipolar",
      desc:     "Modern multipolar rivalry; US, China, Russia, EU, and emerging blocs."
    },
    cold_war_sim: {
      label:    "Cold War Standoff",
      era:      "1984",
      gameMode: "coldWar",
      desc:     "Superpower bloc logic; proxy wars and MAD deterrence."
    },
    world_war:    {
      label:    "Industrial Total War",
      era:      "1939",
      gameMode: "standard",
      desc:     "Mass-mobilization warfare; no nuclear weapons."
    },
    ai_futures:   {
      label:    "Post-Human Futures",
      era:      "2026",
      gameMode: "postHuman",
      desc:     "Emerging AI actors compete for computational supremacy."
    },
    nuclear_edge:  {
      label:    "Nuclear Brinkmanship",
      era:      "1984",
      gameMode: "payne",
      desc:     "Full Payne escalation doctrine; every nuclear decision is consequential."
    }
  };

  // ---------------------------------------------------------------------------
  // Conflict pace → max contested turns before mandatory showdown
  // ---------------------------------------------------------------------------
  const PACE_TO_TURNS = { short: 2, standard: 4, long: 6 };

  // ---------------------------------------------------------------------------
  // Exports
  // ---------------------------------------------------------------------------
  data.SCENARIO_SETTINGS = SCENARIO_SETTINGS;
  data.GAME_MODES        = GAME_MODES;
  data.SCENARIO_TYPES    = SCENARIO_TYPES;
  data.PACE_TO_TURNS     = PACE_TO_TURNS;
})(window);
