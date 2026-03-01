(function initEconomyModule(global) {
  const engine = (global.GameEngine = global.GameEngine || {});

  // ---------------------------------------------------------------------------
  // regenerateFactionEconomies
  // Called once per turn after actions resolve.
  // Resource-type yields from GameData.computeRegionYieldMult are folded in
  // so that oil/rare-earth regions outperform grain/forest regions when intact.
  // ---------------------------------------------------------------------------
  function regenerateFactionEconomies({ state, clamp }) {
    const data = global.GameData;

    state.factions.forEach((f) => {
      let regionYield = 0;
      f.regions.forEach((regionId) => {
        const region = state.regions.find((r) => r.id === regionId);
        if (!region) return;

        // Base yield from region resourceValue (intact or degraded by fallout).
        let baseYield = region.resourceValue * 0.22;

        // Apply resource-type yield multiplier if data module is available.
        if (data?.computeRegionYieldMult) {
          baseYield *= data.computeRegionYieldMult(regionId);
        }

        // Resource regeneration for partially-depleted regions.
        // Renewable/annual types rebuild faster than minerals/rare-earth.
        const maxRv = region.maxResourceValue || region.resourceValue;
        if (region.resourceValue < maxRv) {
          const regenRate = data?.computeTileRegenRate
            ? data.computeTileRegenRate(regionId)
            : 0.3;
          // Regenerate up to 5 % of max per turn at the type's regenRate.
          const recovery = maxRv * 0.05 * regenRate;
          region.resourceValue = Math.min(maxRv, region.resourceValue + recovery);
        }

        regionYield += baseYield;
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
  }

  // ---------------------------------------------------------------------------
  // applyDomesticPressure
  // Called once per turn; drifts faction stats based on internal conditions.
  // Extracted here so the economy module owns both income and pressure logic.
  // ---------------------------------------------------------------------------
  function applyDomesticPressure({ state, clamp, refreshFactionTechState, updateEscalationLadder }) {
    state.factions.forEach((f) => {
      if (refreshFactionTechState) refreshFactionTechState(f);

      const avgThreat =
        Object.values(f.memory || {}).reduce((acc, mem) => acc + (mem?.threat || 0), 0) /
        Math.max(1, Object.keys(f.memory || {}).length);

      f.warFatigue = clamp(
        f.warFatigue + avgThreat * 0.022 - (f.publicOpinion > 0.7 ? 0.01 : 0),
        0, 1
      );
      f.publicOpinion = clamp(
        f.publicOpinion - f.warFatigue * 0.07 + f.democracy * 0.016 - avgThreat * 0.02,
        0, 1
      );
      f.economicStress = clamp(
        f.economicStress + (f.resources < 32 ? 0.06 : -0.018) + avgThreat * 0.016,
        0, 1
      );
      f.legitimacy = clamp(
        f.legitimacy + f.publicOpinion * 0.022 - f.economicStress * 0.08 - avgThreat * 0.01,
        0, 1
      );
      f.stability = clamp(
        f.stability + f.legitimacy * 0.01 - f.warFatigue * 0.07 - f.economicStress * 0.06
          - avgThreat * 0.012 + (f.resources > 100 ? 0.006 : -0.004),
        0, 1
      );
      f.democracy = clamp(
        f.democracy + (Math.random() - 0.5) * 0.04 - Number(Boolean(f.crazyLeader)) * 0.02,
        0, 1
      );
      f.corporatism = clamp(
        f.corporatism + (Math.random() - 0.5) * 0.04 + avgThreat * 0.004,
        0, 1
      );

      if (avgThreat > 0.75 && updateEscalationLadder) {
        updateEscalationLadder("limitedNuclear");
      }

      // 7 % chance of crazy leader when very unstable.
      if (Math.random() < 0.07 && f.stability < 0.35) f.crazyLeader = true;

      // Critical instability: faction seizes up.
      if (f.stability < 0.08 && f.publicOpinion < 0.08) {
        f.aiSkipCycles = Math.max(f.aiSkipCycles, 1);
        f.resources    = Math.max(0, f.resources - 4);
        f.political    = Math.max(0, f.political - 4);
        f.legitimacy   = clamp(f.legitimacy - 0.03, 0, 1);
        if (Math.random() < 0.2 && f.regions.length > 1) {
          const lostRegion = f.regions[Math.floor(Math.random() * f.regions.length)];
          state.mapOwnership[lostRegion] = null;
          delete state.contestedRegions[lostRegion];
          state.neutralRegions[lostRegion] = true;
          f.regions = f.regions.filter((id) => id !== lostRegion);
          const regionObj = state.regions.find((r) => r.id === lostRegion);
          const regionName = regionObj?.name || lostRegion;
          if (state._log) state._log(`${f.name} suffered internal fragmentation in ${regionName}.`);
        }
      }
    });
  }

  engine.regenerateFactionEconomies = regenerateFactionEconomies;
  engine.applyDomesticPressure      = applyDomesticPressure;
})(window);
