// ============================================================
// GoHome Planner — City Mode Route Planner
// Requires: data.js (BUS_UTILS), city-data.js (CITY_BUSES_FULL)
// ============================================================

// Returns sorted array of all unique stop names from CITY_BUSES_FULL
window.getCityStops = function getCityStops() {
  const set = new Set();
  for (const bus of window.CITY_BUSES_FULL) {
    for (const s of bus.stops) set.add(s.name);
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b, "hu"));
};

// Plan direct and 1-transfer city routes between any two stops
window.planCityRoutes = function planCityRoutes({
  now,          // Date object
  fromStop,     // string: origin stop name
  toStop,       // string: destination stop name
  walkMin,      // minutes walk to origin stop
  minTransfer,  // minimum transfer wait minutes
  maxResults,   // max results to return
}) {
  const U = window.BUS_UTILS;
  const dayType = U.dayType(now);
  const nowMins = now.getHours() * 60 + now.getMinutes();
  const earliestBoard = nowMins + walkMin;

  const buses = window.CITY_BUSES_FULL;
  const results = [];
  const seen = new Set();

  // ── DIRECT ROUTES ──────────────────────────────────────────
  for (const bus of buses) {
    if (!U.busVisits(bus, fromStop)) continue;
    if (!U.busVisits(bus, toStop)) continue;
    const fromOff = U.stopOffset(bus, fromStop);
    const toOff   = U.stopOffset(bus, toStop);
    if (toOff <= fromOff) continue;

    for (const dep of U.getDepartures(bus, dayType)) {
      const boardAt  = dep + fromOff;
      if (boardAt < earliestBoard) continue;
      const arriveAt = dep + toOff;

      const key = `D|${bus.id}|${bus.direction}|${dep}`;
      if (seen.has(key)) continue;
      seen.add(key);

      results.push({
        type: "direct",
        departLeaveOrigin: boardAt - walkMin,
        boardAt,
        bus1: bus,
        arriveAt,
        totalDuration: arriveAt - (boardAt - walkMin),
      });
    }
  }

  // ── 1-TRANSFER ROUTES ──────────────────────────────────────
  // bus1: fromStop → transferStop
  // bus2: transferStop → toStop
  for (const bus1 of buses) {
    if (!U.busVisits(bus1, fromStop)) continue;
    const fromOff1 = U.stopOffset(bus1, fromStop);
    const deps1 = U.getDepartures(bus1, dayType);
    if (deps1.length === 0) continue;

    // collect stops reachable after fromStop on bus1
    const forwardStops = bus1.stops.filter(s => s.offset > fromOff1);

    for (const ts of forwardStops) {
      for (const bus2 of buses) {
        if (!U.busVisits(bus2, ts.name)) continue;
        if (!U.busVisits(bus2, toStop)) continue;
        const tsOff2  = U.stopOffset(bus2, ts.name);
        const toOff2  = U.stopOffset(bus2, toStop);
        if (toOff2 <= tsOff2) continue;

        const deps2 = U.getDepartures(bus2, dayType);
        if (deps2.length === 0) continue;

        for (const dep1 of deps1) {
          const boardAt1   = dep1 + fromOff1;
          if (boardAt1 < earliestBoard) continue;
          const arriveAtTs = dep1 + ts.offset;

          for (const dep2 of deps2) {
            const boardAt2 = dep2 + tsOff2;
            if (boardAt2 < arriveAtTs + minTransfer) continue;

            const arriveAt = dep2 + toOff2;

            const key = `T|${bus1.id}|${bus1.direction}|${dep1}|${bus2.id}|${bus2.direction}|${dep2}`;
            if (seen.has(key)) continue;
            seen.add(key);

            results.push({
              type: "transfer",
              departLeaveOrigin: boardAt1 - walkMin,
              boardAt: boardAt1,
              bus1,
              transferStopName: ts.name,
              arriveAtTransfer: arriveAtTs,
              waitAtTransfer: boardAt2 - arriveAtTs,
              bus2,
              boardAt2,
              arriveAt,
              totalDuration: arriveAt - (boardAt1 - walkMin),
            });
          }
        }
      }
    }
  }

  // Sort by arrival time, then total duration
  results.sort((a, b) => a.arriveAt - b.arriveAt || a.totalDuration - b.totalDuration);

  // Dedup: same bus1+dep AND bus2+dep combination (different transfer stops can give same ride)
  const deduped = [];
  const seenRide = new Set();
  for (const r of results) {
    const k = r.type === "direct"
      ? `D|${r.bus1.id}|${r.bus1.direction}|${r.boardAt}`
      : `T|${r.bus1.id}|${r.bus1.direction}|${r.boardAt}|${r.bus2.id}|${r.bus2.direction}|${r.boardAt2}`;
    if (seenRide.has(k)) continue;
    seenRide.add(k);
    deduped.push(r);
  }

  return deduped.slice(0, maxResults);
};
