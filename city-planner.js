// ============================================================
// GoHome Planner — City Mode Route Planner
// Requires: data.js (BUS_UTILS), city-data.js (CITY_BUSES_FULL)
// ============================================================

function _haversineM(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const φ1 = lat1 * Math.PI / 180, φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180, Δλ = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(Δφ/2)**2 + Math.cos(φ1)*Math.cos(φ2)*Math.sin(Δλ/2)**2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
}

// window.getCityStops most a data.js-ben van (platform-/spId-alapú, ld.
// _cityPlatforms() -- néhány körjáratos megálló, pl. 47-es "Hotel", két
// külön fizikai ponton áll, ezt a puszta névre-Set-elő verzió elveszítette).

// Plan direct and 1-transfer city routes between any two stops
window.planCityRoutes = function planCityRoutes({
  now,          // Date object
  fromStop,     // string: origin stop name
  toStop,       // string: destination stop name
  walkMin,      // minutes walk to origin stop
  maxResults,   // max results to return
  schoolHoliday, // bool
}) {
  const U = window.BUS_UTILS;
  const dayType = U.dayType(now, schoolHoliday);
  const nowMins = now.getHours() * 60 + now.getMinutes();
  const earliestBoard = nowMins + walkMin;

  const buses = window.CITY_BUSES_FULL;
  const results = [];
  const seen = new Set();
  // Csak azonos spId-jű megállónál valóban közvetlen (nem gyalogos) átszállás
  const trueDirectSeen = new Set();
  // Minden gyaloglást igénylő átszállás-jelölt (akár az azonos-nevű-de-más-platformos
  // 1-átszállásos ágból, akár a lentebbi walk-graph-os ágból) ide gyűlik -- a végén EGY
  // közös csoportosítási lépés dönti el, melyik marad meg a results-ban (ld. lentebb).
  const walkTransferCandidates = [];

  // ── DIRECT ROUTES ──────────────────────────────────────────
  // Ha a fromStop/toStop NÉV többször is szerepel EGYETLEN busz megállólistájában (pl.
  // körjáratnál a végállomás neve az induláskor ÉS a kör végén is, más spId-vel -- ld.
  // "Veszprém autóbusz-állomás" a 12-es buszon), egyetlen U.stopOffset hívás mindig csak
  // az ELSŐ előfordulást adná vissza -- ez körjáratoknál teljesen elrejthet valós,
  // működő útvonalakat (pl. ha a cél épp a MÁSODIK előfordulás lenne). Ehelyett minden
  // (induló előfordulás, célzó előfordulás) PÁRT megvizsgálunk, és csak azokat tartjuk
  // meg, ahol a cél ténylegesen később van az útvonalon, mint az indulás.
  for (const bus of buses) {
    const fromOccs = bus.stops.filter(s => s.name === fromStop);
    const toOccs = bus.stops.filter(s => s.name === toStop);
    if (fromOccs.length === 0 || toOccs.length === 0) continue;

    for (const fromS of fromOccs) {
      for (const toS of toOccs) {
        if (toS.offset <= fromS.offset) continue;
        const fromOff = fromS.offset, toOff = toS.offset;

        for (const dep of U.getDepartures(bus, dayType)) {
          const boardAt  = dep + fromOff;
          if (boardAt < earliestBoard) continue;
          const arriveAt = dep + toOff;

          const key = `D|${bus.id}|${bus.direction}|${dep}|${fromS.spId}|${toS.spId}`;
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
    }
  }

  // ── 1-TRANSFER ROUTES ──────────────────────────────────────
  // bus1: fromStop → transferStop
  // bus2: transferStop → toStop
  for (const bus1 of buses) {
    // Ld. a DIRECT ROUTES-nál lévő indoklást: a fromStop név többször is szerepelhet
    // bus1-en (pl. körjáratnál a végállomás), ezért minden előfordulást kipróbálunk.
    const fromOccs1 = bus1.stops.filter(s => s.name === fromStop);
    if (fromOccs1.length === 0) continue;
    const deps1 = U.getDepartures(bus1, dayType);
    if (deps1.length === 0) continue;
    const toOccs1 = bus1.stops.filter(s => s.name === toStop);

    for (const fromS1 of fromOccs1) {
      const fromOff1 = fromS1.offset;

      // collect stops reachable after fromStop on bus1 (ehhez a KONKRÉT fromS1
      // előforduláshoz képest -- körjáratnál más-más megállók érhetők el aszerint,
      // hogy melyik előfordulásból indulunk)
      const forwardStops = bus1.stops.filter(s => s.offset > fromOff1);
      // "maradjunk bus1-en" védelem: a toStop LEGKORÁBBAN elérhető előfordulása
      // bus1-en, ebből a fromS1-ből nézve (ha van ilyen egyáltalán)
      const reachableToOffs1 = toOccs1.filter(s => s.offset > fromOff1).map(s => s.offset);
      const bestToOff1 = reachableToOffs1.length ? Math.min(...reachableToOffs1) : null;

      for (const ts of forwardStops) {
        for (const bus2 of buses) {
          if (bus2.id === bus1.id && bus2.direction === bus1.direction) continue;

          // Ha a "ts.name" megállónév TÖBBSZÖR szerepel bus2 megállólistájában (pl. "Petőfi
          // Színház" a 42-esnél, két külön fizikai ponton), az U.stopOffset/bus2.stops.find
          // (első előfordulásra) rossz platformot választhatna -- ehelyett az azonos spId-jű
          // (fizikailag ugyanaz a pont, ha van ilyen), különben a ts-hez legközelebbi
          // előfordulást választjuk.
          const stop2Candidates = bus2.stops.filter(s => s.name === ts.name);
          if (stop2Candidates.length === 0) continue;
          let stop2AtTs = stop2Candidates.find(s => s.spId === ts.spId);
          if (!stop2AtTs) {
            stop2AtTs = stop2Candidates.reduce((best, s) => {
              if (s.lat == null) return best;
              if (!best || best.lat == null) return s;
              if (ts.lat == null) return best;
              return _haversineM(ts.lat, ts.lon, s.lat, s.lon) < _haversineM(ts.lat, ts.lon, best.lat, best.lon) ? s : best;
            }, null) || stop2Candidates[0];
          }
          const tsOff2  = stop2AtTs.offset;

          // Ld. a DIRECT ROUTES-nál lévő indoklást: a toStop is többször szerepelhet
          // bus2-n -- minden előfordulást kipróbálunk.
          const toOccs2 = bus2.stops.filter(s => s.name === toStop);
          if (toOccs2.length === 0) continue;

          for (const toS2 of toOccs2) {
            const toOff2 = toS2.offset;
            if (toOff2 <= tsOff2) continue;

            // Skip if bus2 serves fromStop anywhere before toStop (boarding bus2 at
            // fromStop directly would give the same or better result) -- MINDEN fromStop
            // előfordulást megnézünk bus2-n, nem csak az elsőt.
            const fromOccs2 = bus2.stops.filter(s => s.name === fromStop);
            if (fromOccs2.some(s => s.offset < toOff2)) continue;

            const deps2 = U.getDepartures(bus2, dayType);
            if (deps2.length === 0) continue;

            // Megálló fizikai azonosság: ha bus1 és bus2 megállója eltérő spId-jű,
            // gyalogos átkelés szükséges (pl. Hotel SP1660 ↔ SP1661)
            const samePhysical = ts.spId && stop2AtTs?.spId && ts.spId === stop2AtTs.spId;
            let transferWalk = null;
            if (!samePhysical && ts.spId && stop2AtTs?.spId && ts.lat != null && stop2AtTs?.lat != null) {
              const distM = _haversineM(ts.lat, ts.lon, stop2AtTs.lat, stop2AtTs.lon);
              if (distM >= 10) transferWalk = { distM, walkMin: Math.ceil(distM / 80) };
            }
            const transferWalkMin = transferWalk ? transferWalk.walkMin : 0;

            for (const dep1 of deps1) {
              const boardAt1   = dep1 + fromOff1;
              if (boardAt1 < earliestBoard) continue;
              const arriveAtTs = dep1 + ts.offset;

              for (const dep2 of deps2) {
                const boardAt2 = dep2 + tsOff2;
                if (boardAt2 < arriveAtTs + transferWalkMin) continue;

                const arriveAt = dep2 + toOff2;

                // Skip if staying on bus1 would reach toStop at least as early
                if (bestToOff1 !== null && dep1 + bestToOff1 <= arriveAt) continue;

                const key = `T|${bus1.id}|${bus1.direction}|${dep1}|${bus2.id}|${bus2.direction}|${dep2}|${ts.name}|${fromS1.spId}|${toS2.spId}`;
                if (seen.has(key)) continue;
                seen.add(key);

                if (samePhysical) {
                  trueDirectSeen.add(`SD|${bus1.id}|${bus1.direction}|${dep1}|${bus2.id}|${bus2.direction}|${dep2}`);
                }

                const entry = {
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
                  ...(transferWalk ? { walkTransfer: transferWalk, walkToStop: ts.name, walkTransferSameStop: true } : {}),
                };
                // A gyaloglást igénylő (transferWalk) jelöltek nem kerülnek rögtön a
                // results-ba -- ld. a walkTransferCandidates-hez fűzött indoklást lentebb.
                if (transferWalk) walkTransferCandidates.push(entry);
                else results.push(entry);
              }
            }
          }
        }
      }
    }
  }

  // ── WALK-TRANSFER ROUTES ───────────────────────────────────
  // bus1: fromStop → walkFromStop, gyalog → walkToStop, bus2: walkToStop → toStop
  const walkGraph = window.WALK_GRAPH || {};
  // Csoportonként (bus1+dep1+ts+bus2+dep2) csak a legrövidebb gyalogos útvonalat tartjuk
  const bestWalkMap = new Map();

  for (const bus1 of buses) {
    // Ld. a DIRECT ROUTES-nál lévő indoklást: a fromStop név többször is szerepelhet
    // bus1-en -- minden előfordulást kipróbálunk.
    const fromOccs1 = bus1.stops.filter(s => s.name === fromStop);
    if (fromOccs1.length === 0) continue;
    const deps1 = U.getDepartures(bus1, dayType);
    if (deps1.length === 0) continue;
    const toOccs1 = bus1.stops.filter(s => s.name === toStop);

    for (const fromS1 of fromOccs1) {
      const fromOff1 = fromS1.offset;
      const forwardStops = bus1.stops.filter(s => s.offset > fromOff1);
      const reachableToOffs1 = toOccs1.filter(s => s.offset > fromOff1).map(s => s.offset);
      const bestToOff1 = reachableToOffs1.length ? Math.min(...reachableToOffs1) : null;

    for (const ts of forwardStops) {
      const neighbors = walkGraph[ts.spId] || [];
      for (const { name: walkToStop, spId: walkToSpId, distM, walkMin: wMin } of neighbors) {
        if (distM < 100) continue; // ugyanaz a fizikai megálló, kihagyjuk

        for (const bus2 of buses) {
          if (bus2.id === bus1.id && bus2.direction === bus1.direction) continue;
          // Ld. az 1-TRANSFER ágnál lévő indoklást: a walkToStop NÉV többször is
          // szerepelhet bus2-n -- itt viszont pontosan ismerjük a keresett pont
          // spId-jét (walkToSpId, a walkGraph éléből), ezért azzal keresünk.
          const walkStop2 = walkToSpId
            ? bus2.stops.find(s => s.spId === walkToSpId)
            : bus2.stops.find(s => s.name === walkToStop);
          if (!walkStop2) continue;
          const tsOff2 = walkStop2.offset;

          // Ld. a DIRECT ROUTES-nál lévő indoklást: a toStop is többször szerepelhet
          // bus2-n -- minden előfordulást kipróbálunk.
          const toOccs2 = bus2.stops.filter(s => s.name === toStop);
          if (toOccs2.length === 0) continue;

          for (const toS2 of toOccs2) {
          const toOff2 = toS2.offset;
          if (toOff2 <= tsOff2) continue;

          // Skip if bus2 serves fromStop anywhere before toStop (boarding bus2 at
          // fromStop directly would give the same or better result) -- ugyanaz a
          // védelem, mint a fenti azonos-fizikai-megállós átszállásnál; itt hiányzott,
          // ezért engedett át felesleges gyalogos kerülőt olyan busz2-re, ami amúgy is
          // közvetlenül indul fromStop-ból. Minden fromStop előfordulást megnézünk.
          const fromOccs2 = bus2.stops.filter(s => s.name === fromStop);
          if (fromOccs2.some(s => s.offset < toOff2)) continue;

          const deps2 = U.getDepartures(bus2, dayType);
          if (deps2.length === 0) continue;

          for (const dep1 of deps1) {
            const boardAt1 = dep1 + fromOff1;
            if (boardAt1 < earliestBoard) continue;
            const arriveAtTs = dep1 + ts.offset;

            for (const dep2 of deps2) {
              const boardAt2 = dep2 + tsOff2;
              if (boardAt2 < arriveAtTs + wMin) continue;

              // Ha erre a dep2-re már van azonos fizikai megállós közvetlen átszállás, a gyalogos felesleges
              const sdKey = `SD|${bus1.id}|${bus1.direction}|${dep1}|${bus2.id}|${bus2.direction}|${dep2}`;
              if (trueDirectSeen.has(sdKey)) continue;

              const arriveAt = dep2 + toOff2;

              // Skip if staying on bus1 would reach toStop at least as early (same guard as the
              // same-physical-stop transfer loop above — this one was missing it entirely).
              if (bestToOff1 !== null && dep1 + bestToOff1 <= arriveAt) continue;

              // Azonos csoporton belül csak a legrövidebb gyalogos marad (toS2.spId is a
              // kulcs része, mert a toStop is többször szerepelhet bus2-n)
              const groupKey = `WTG|${bus1.id}|${bus1.direction}|${dep1}|${ts.name}|${bus2.id}|${bus2.direction}|${dep2}|${toS2.spId}`;
              const prev = bestWalkMap.get(groupKey);
              if (prev && prev.walkTransfer.distM <= distM) continue;

              bestWalkMap.set(groupKey, {
                type: "transfer",
                walkTransfer: { distM, walkMin: wMin },
                departLeaveOrigin: boardAt1 - walkMin,
                boardAt: boardAt1,
                bus1,
                transferStopName: ts.name,
                walkToStop,
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
    }
    }
  }

  // A gyaloglást igénylő átszállás-jelöltek (akár az azonos-nevű-más-platformos
  // 1-átszállásos ágból, akár a lenti walk-graph-os ágból származnak) csoportosítása:
  // ha UGYANAZ a bus1-járat ÉS UGYANAZ a bus2-járat több lehetséges leszállási/gyalogos
  // ponton keresztül is elérhető, az valójában EGY döntés (csak más leszállóhellyel),
  // nem több külön alternatíva -- korábban ez 3-8 majdnem-egyforma kártyát is
  // elfoglalt a (limitált) eredménylistából, kiszorítva más, ténylegesen eltérő
  // kombinációkat. Csak a két szélsőértéket tartjuk meg: a legrövidebb gyaloglásút
  // és a leghosszabb bus1-es utazást (legkésőbbi leszállás bus1-ről) -- a köztes
  // variánsok (amik sem nem a legkevesebb gyaloglást, sem a legtöbb buszon-ülést nem
  // adják) kiesnek.
  const allWalkCandidates = [...walkTransferCandidates, ...bestWalkMap.values()];
  const tripGroups = new Map();
  for (const r of allWalkCandidates) {
    const tripKey = `${r.bus1.id}|${r.bus1.direction}|${r.boardAt}|${r.bus2.id}|${r.bus2.direction}|${r.arriveAt}`;
    if (!tripGroups.has(tripKey)) tripGroups.set(tripKey, []);
    tripGroups.get(tripKey).push(r);
  }
  for (const group of tripGroups.values()) {
    if (group.length === 1) {
      results.push(group[0]);
      continue;
    }
    const shortestWalk = group.reduce((best, r) => r.walkTransfer.distM < best.walkTransfer.distM ? r : best);
    const longestRide = group.reduce((best, r) => r.arriveAtTransfer > best.arriveAtTransfer ? r : best);
    results.push(shortestWalk);
    if (longestRide !== shortestWalk) results.push(longestRide);
  }

  // Sort by arrival time, then total duration, then walk distance (prefer shorter walk)
  results.sort((a, b) =>
    a.arriveAt - b.arriveAt ||
    a.totalDuration - b.totalDuration ||
    (a.walkTransfer?.distM ?? 0) - (b.walkTransfer?.distM ?? 0)
  );

  // Dedup: same bus1+dep AND bus2+dep combination (different transfer stops can give same ride)
  const deduped = [];
  const seenRide = new Set();
  for (const r of results) {
    const k = r.type === "direct"
      ? `D|${r.bus1.id}|${r.bus1.direction}|${r.boardAt}`
      : (r.walkTransfer && !r.walkTransferSameStop)
        ? `WT|${r.bus1.id}|${r.bus1.direction}|${r.boardAt}|${r.bus2.id}|${r.bus2.direction}|${r.walkToStop}`
        : `T|${r.bus1.id}|${r.bus1.direction}|${r.boardAt}|${r.bus2.id}|${r.bus2.direction}|${r.transferStopName}`;
    if (seenRide.has(k)) continue;
    seenRide.add(k);
    deduped.push(r);
  }

  // Pareto filter: WT| walk-transfer kiszűrése ha egy sameStop (T|) vagy másik WT| route
  // rövidebb sétával ÉS korábbi/egyenlő bus2 felszállással dominálja.
  // Pl. Őrház→Őrház (17m, 07:42) kiszorítja Őrház→Fecske (399m, 07:43)-at.
  // De Petőfi→Petőfi (106m, 07:28) NEM szorítja ki Petőfi→Megyhaz (174m, 07:26)-ot,
  // mert Megyhaz korábban száll fel bus2-re.
  const final = deduped.filter(r => {
    if (!r.walkTransfer || r.walkTransferSameStop) return true;
    return !deduped.some(other =>
      other !== r &&
      other.bus2 &&
      other.bus1.id === r.bus1.id &&
      other.bus1.direction === r.bus1.direction &&
      other.boardAt === r.boardAt &&
      other.bus2.id === r.bus2.id &&
      other.bus2.direction === r.bus2.direction &&
      other.arriveAt <= r.arriveAt &&
      other.arriveAtTransfer === r.arriveAtTransfer &&
      (other.walkTransfer ? other.walkTransfer.distM < r.walkTransfer.distM : true)
    );
  });

  return final.slice(0, maxResults);
};
