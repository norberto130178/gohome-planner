// ============================================================
// GoHome Planner — Algoritmusok & segédfüggvények
// ============================================================
// A menetrendi adatok (SCHEDULES) a schedules.js-ben vannak.
// Ez a fájl csak az útvonaltervező logikát tartalmazza.
// ============================================================

// APP_VERSION az index.html-ben van definiálva (ott állítja be a cache bustert is)

// Helyi buszok amik Csererdőt érintik (hazaút + iskolába tervező)
const HOME_BUS_IDS = ["3", "8", "8Y", "28"];

function _haversineM(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const φ1 = lat1 * Math.PI / 180, φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180, Δλ = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(Δφ/2)**2 + Math.cos(φ1)*Math.cos(φ2)*Math.sin(Δλ/2)**2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
}

// GTFS shape segédfüggvény — mindkét nézetben elérhető (index.html + city.html)
window.nearestShapeIdx = function(shape, lat, lon) {
  let best = 0, bestD = Infinity;
  for (let i = 0; i < shape.length; i++) {
    const d = (shape[i][0]-lat)**2 + (shape[i][1]-lon)**2;
    if (d < bestD) { bestD = d; best = i; }
  }
  return best;
};

// ============================================================
// Segédfüggvények
// ============================================================

// Legjobb GTFS shape kiválasztása két koordináta között (ti-fi span alapján)
// Kezeli az új { coords, headsign, dir } formátumot és a régi [[lat,lon]] formátumot is
window.BUS_UTILS = {
  bestShape(shapes, fromLat, fromLon, toLat, toLon) {
    let best = null, bestScore = -Infinity;
    for (const entry of shapes) {
      const s = entry.coords || entry;
      const fi = window.nearestShapeIdx(s, fromLat, fromLon);
      const ti = window.nearestShapeIdx(s, toLat, toLon);
      if (ti > fi && ti - fi > bestScore) { bestScore = ti - fi; best = { s, fi, ti }; }
    }
    return best;
  },

  // Óra:perc → percek hajnaltól
  toMinutes(hm) {
    const [h, m] = hm.split(":").map(Number);
    return h * 60 + m;
  },

  // percek → "HH:MM" formátum
  fmtTime(totalMins) {
    const h = Math.floor(totalMins / 60) % 24;
    const m = totalMins % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  },

  // Nap típusa a dátumból; schoolHoliday=true esetén tanszüneti menetrend munkanapokon
  dayType(date, schoolHoliday = false) {
    const d = date.getDay(); // 0=vas, 6=szo
    if (d === 0 || d === 6) return "weekend";
    if (schoolHoliday) return "schoolholiday";
    return "workday";
  },

  // Egy busz departures objektumából → abszolút indulási idők [minutes[]]
  getDepartures(bus, dayType) {
    let dep = bus.departures[dayType] || {};
    const out = [];
    for (const hStr of Object.keys(dep)) {
      const h = Number(hStr);
      for (const rawM of dep[hStr]) {
        const m = typeof rawM === "object" ? rawM.t : rawM;
        out.push(h * 60 + m);
      }
    }
    return out.sort((a, b) => a - b);
  },

  // Egy buszon belül két megálló közötti menetidő (percben)
  travelTime(bus, fromStop, toStop) {
    const a = bus.stops.find((s) => s.name === fromStop);
    const b = bus.stops.find((s) => s.name === toStop);
    if (!a || !b) return null;
    return b.offset - a.offset;
  },

  // Egy busz egy megállójának offsetje (a kezdőponttól)
  stopOffset(bus, stopName) {
    const s = bus.stops.find((x) => x.name === stopName);
    return s ? s.offset : null;
  },

  // Megálló-e a buszon?
  busVisits(bus, stopName) {
    return bus.stops.some((s) => s.name === stopName);
  },
};

// ============================================================
// Útvonaltervező — két szakasz: helyközi + helyi
// Több átszálláspontot (destination-t) figyelembe vesz.
// ============================================================

window.planRoutes = function planRoutes({
  now, walkMin, maxResults,
  allowedTransfers,  // opcionális: string[] az átszálláspont id-kból; ha nincs, mindet figyeli
  homeStop,           // opcionális: custom leszállási megálló; ha null/undefined → "Csererdő"
  schoolHoliday,      // opcionális: true → tanszüneti menetrend munkanapokon
}) {
  const U = window.BUS_UTILS;
  const dayType = U.dayType(now, schoolHoliday);  // "workday" | "schoolholiday" | "weekend"
  const nowMins = now.getHours() * 60 + now.getMinutes();
  const earliestBoard = nowMins + walkMin;

  const helykozi = window.SCHEDULES.helykozi;
  const destinations = helykozi.destinations.filter((d) =>
    !allowedTransfers || allowedTransfers.length === 0 || allowedTransfers.includes(d.id)
  );

  const targetStop = homeStop || "Csererdő";
  const busPool = (window.CITY_BUSES_FULL || []).filter(bus =>
    (homeStop || HOME_BUS_IDS.includes(bus.id)) && U.busVisits(bus, targetStop)
  );

  const routes = [];
  const seen = new Set();

  for (const dest of destinations) {
    const trips = dest.trips.filter((tr) => {
      if (tr.days === "both") return true;
      if (tr.days === "school") return dayType === "workday" || dayType === "schoolholiday";
      if (tr.days === "workday") return dayType === "workday" || dayType === "schoolholiday";
      return tr.days === dayType;
    });

    const availableTrips = trips
      .map((tr) => ({
        ...tr,
        depMins: U.toMinutes(tr.dep),
        arrMins: U.toMinutes(tr.arr),
      }))
      .filter((tr) => tr.depMins >= earliestBoard)
      .sort((a, b) => a.depMins - b.depMins);

    for (const tr of availableTrips) {
      const arrivalAtTransfer = tr.arrMins;

      for (const bus of busPool) {
        if (bus.stops[0]?.name === "Csererdő") continue; // csak délutáni buszok
        if (!U.busVisits(bus, dest.localStopName)) continue;
        if (!U.busVisits(bus, targetStop)) continue;
        const transferOffset = U.stopOffset(bus, dest.localStopName);
        const targetOffset = U.stopOffset(bus, targetStop);
        if (targetOffset <= transferOffset) continue;

        const busStopAtTransfer = bus.stops.find(s => s.name === dest.localStopName);
        let walkAtTransfer = null;
        if (busStopAtTransfer?.lat != null && dest.lat != null) {
          const distM = _haversineM(dest.lat, dest.lon, busStopAtTransfer.lat, busStopAtTransfer.lon);
          if (distM >= 10) walkAtTransfer = { distM, walkMin: Math.ceil(distM / 80) };
        }
        const mustBoardBy = arrivalAtTransfer + (walkAtTransfer?.walkMin ?? 0);

        const localDeps = U.getDepartures(bus, dayType);
        for (const localDep of localDeps) {
          const localAtTransfer = localDep + transferOffset;
          if (localAtTransfer < mustBoardBy) continue;
          const localAtTarget = localDep + targetOffset;

          const key = `${dest.id}-${tr.depMins}-${bus.id}-${bus.direction}-${localDep}`;
          if (seen.has(key)) continue;
          seen.add(key);

          routes.push({
            departLeaveHome: tr.depMins - walkMin,
            helykoziDep: tr.depMins,
            helykoziArrive: arrivalAtTransfer,
            helykoziLine: tr.line,
            transferStop: dest.label,
            transferStopShort: dest.short,
            transferStopId: dest.id,
            transferLocalStop: dest.localStopName,
            transferLat: dest.lat,
            transferLon: dest.lon,
            waitAtTransfer: localAtTransfer - arrivalAtTransfer,
            ...(walkAtTransfer ? { walkAtTransfer } : {}),
            localBus: bus,
            localBoardAt: localAtTransfer,
            localArriveCsererdo: localAtTarget,
            homeStop: targetStop,
            totalDuration: localAtTarget - (tr.depMins - walkMin),
          });
        }
      }
    }
  }

  // Rendezés: hazaérkezési idő szerint
  routes.sort((a, b) => a.localArriveCsererdo - b.localArriveCsererdo);

  // Dedup: ugyanaz a helyközi indulás + ugyanaz a helyi busz (más átszálláspontnál
  // is előfordulhat ugyanaz a kombó — hagyjuk meg azt amelyik hamarabb ér haza)
  const filtered = [];
  const seenKey = new Set();
  for (const r of routes) {
    const k = `${r.helykoziDep}-${r.localBus.id}-${r.localBus.direction}-${r.localBoardAt}`;
    if (seenKey.has(k)) continue;
    seenKey.add(k);
    filtered.push(r);
  }

  const result = filtered.slice(0, maxResults);

  // Ha homeStop van és nincs találat, megnézzük a másik napra lenne-e busz
  if (homeStop && result.length === 0) {
    const otherDay = dayType === "workday" ? "weekend" : "workday";
    const hasOtherDay = busPool.some(bus => {
      if (bus.stops[0]?.name === "Csererdő") return false;
      if (!U.busVisits(bus, targetStop)) return false;
      const deps = U.getDepartures(bus, otherDay);
      return deps.length > 0;
    });
    if (hasOtherDay) {
      result.hint = otherDay === "weekend" ? "weekendOnly" : "workdayOnly";
    }
  }

  return result;
};

// ============================================================
// Reggeli útvonaltervező — Csererdő → Nemesvámos (iskolába)
// 1. Helyi busz Csererdőről valamelyik átszálláspontra
//    (Komakút / Színház / Autóbusz-állomás)
// 2. Opcionálisan 5 perc gyaloglás Színháztól Komakútig (ha a helyi busz csak Színházig megy)
// 3. Helyközi busz az átszálláspontról Nemesvámosra
// ============================================================

window.planSchoolRoutes = function planSchoolRoutes({
  now, walkMin, maxResults, schoolStartMin,
  allowedTransfers,  // opcionális: melyik átszállópontokat használja (komakut, buszall)
  schoolHoliday,
  fromStop,          // opcionális: indulási megálló neve (alapértelmezett: "Csererdő")
  walkToSchool,      // opcionális: gyaloglási idő az iskoláig (alapértelmezett: 10)
  walkToSchoolDist,  // opcionális: távolság méterben (megjelenítéshez)
}) {
  fromStop = fromStop || "Csererdő";
  walkToSchool = walkToSchool != null ? walkToSchool : 10;
  const U = window.BUS_UTILS;
  const dayType = U.dayType(now, schoolHoliday);
  const nowMins = now.getHours() * 60 + now.getMinutes();
  const earliestBoard = nowMins + walkMin;  // mikor tud a gyerek az indulási megállónál lenni

  const helykozi = window.SCHEDULES.helykozi_iskola;

  // Átszálláspont-leírók: mindegyik megadja, hogy melyik helyközi origin-re száll fel,
  // és milyen módon jut oda a helyi buszról.
  const transferPoints = [
    {
      id: "komakut",
      label: "Komakút tér / Pannon Egyetem",
      short: "Komakút tér",
      originId: "komakut",
      localStopName: "Komakút tér / Pannon Egyetem",
      walkAfterBus: 0,
    },
    {
      id: "buszall",
      label: "Veszprém, autóbusz-állomás",
      short: "Autóbusz-áll.",
      originId: "buszall",
      localStopName: "Veszprém autóbusz-állomás",
      walkAfterBus: 0,
    },
  ];

  const activePoints = transferPoints.filter((p) =>
    !allowedTransfers || allowedTransfers.length === 0 || allowedTransfers.includes(p.id)
  );

  const routes = [];
  const seen = new Set();

  for (const tp of activePoints) {
    const origin = helykozi.origins.find((o) => o.id === tp.originId);
    if (!origin) continue;

    // Helyközi járatok erről az origin-ről
    const helykoziTrips = origin.trips
      .filter((tr) => {
        if (tr.days === "both") return true;
        if (tr.days === "school") return dayType === "workday" || dayType === "schoolholiday";
        if (tr.days === "workday") return dayType === "workday" || dayType === "schoolholiday";
        return tr.days === dayType;
      })
      .map((tr) => ({
        ...tr,
        depMins: U.toMinutes(tr.dep),
        arrMins: U.toMinutes(tr.arr),
      }))
      .sort((a, b) => a.depMins - b.depMins);

    // Helyi buszok amik fromStop → tp.localStopName-re mennek
    const schoolBuses = (window.CITY_BUSES_FULL || []).filter(bus =>
      U.busVisits(bus, fromStop)
    );
    for (const bus of schoolBuses) {
      if (!U.busVisits(bus, tp.localStopName)) continue;
      const fromOffset = U.stopOffset(bus, fromStop);
      const targetOffset = U.stopOffset(bus, tp.localStopName);
      if (fromOffset === null || targetOffset === null || targetOffset <= fromOffset) continue;

      const busStopAtTransfer = bus.stops.find(s => s.name === tp.localStopName);
      let walkAtTransfer = null;
      if (busStopAtTransfer?.lat != null && origin.lat != null) {
        const distM = _haversineM(busStopAtTransfer.lat, busStopAtTransfer.lon, origin.lat, origin.lon);
        if (distM >= 10) walkAtTransfer = { distM, walkMin: Math.ceil(distM / 80) };
      }
      const walkAtTransferMin = walkAtTransfer?.walkMin ?? 0;

      const localDeps = U.getDepartures(bus, dayType);
      for (const localDep of localDeps) {
        const boardAt = localDep + fromOffset;
        if (boardAt < earliestBoard) continue;
        const arriveAtTransfer = localDep + targetOffset;
        const arriveReadyForHelykozi = arriveAtTransfer + tp.walkAfterBus;
        const mustBoardBy = arriveReadyForHelykozi + walkAtTransferMin;

        const hk = helykoziTrips.find((tr) => tr.depMins >= mustBoardBy);
        if (!hk) continue;
        if (schoolStartMin != null && hk.arrMins > schoolStartMin) continue;

        let depBuszallMins = hk.depMins;
        if (tp.originId !== "buszall") {
          const buszallOrigin = helykozi.origins.find(o => o.id === "buszall");
          if (buszallOrigin) {
            const match = buszallOrigin.trips.find(tr => tr.line === hk.line && tr.arr === hk.arr);
            if (match) depBuszallMins = U.toMinutes(match.dep);
          }
        }

        const key = `${tp.id}-${bus.id}-${bus.direction}-${boardAt}-${hk.depMins}`;
        if (seen.has(key)) continue;
        seen.add(key);

        routes.push({
          departLeaveHome: boardAt - walkMin,
          boardingStopName: fromStop,
          localBus: bus,
          localBoardAt: boardAt,
          localArriveAtTransfer: arriveAtTransfer,
          walkAfterBus: tp.walkAfterBus,
          walkAfterBusDist: tp.walkAfterBusDist,
          transferReadyAt: arriveReadyForHelykozi,
          waitAtTransfer: hk.depMins - arriveReadyForHelykozi,
          ...(walkAtTransfer ? { walkAtTransfer } : {}),
          helykoziDep: hk.depMins,
          helykoziArrive: hk.arrMins,
          helykoziLine: hk.line,
          helykoziDepBuszall: depBuszallMins,
          transferStop: tp.label,
          transferStopShort: tp.short,
          transferStopId: tp.id,
          transferLocalStop: tp.localStopName,
          transferLat: origin.lat,
          transferLon: origin.lon,
          walkToSchool: walkToSchool,
          walkToSchoolDist: walkToSchoolDist,
          arriveSchool: hk.arrMins + walkToSchool,
          totalDuration: (hk.arrMins + walkToSchool) - (boardAt - walkMin),
        });
      }
    }
  }

  // ── WALK-TRANSFER (WALK_GRAPH) ─────────────────────────────
  // Helyi busz → gyalog → helyközi megálló (pl. Petőfi Színház → Komakút)
  // Azonos (busz, indulás, helyközi) kombinációnál csak a legrövidebb séta marad.
  const walkGraph = window.WALK_GRAPH || {};
  const walkBestMap = new Map();
  for (const [stopName, neighbors] of Object.entries(walkGraph)) {
    for (const tp of activePoints) {
      const walkMatch = neighbors.find(n => n.stop === tp.localStopName && n.distM >= 100);
      if (!walkMatch) continue;

      const origin = helykozi.origins.find((o) => o.id === tp.originId);
      if (!origin) continue;

      const helykoziTrips = origin.trips
        .filter((tr) => {
          if (tr.days === "both") return true;
          if (tr.days === "school") return dayType === "workday" || dayType === "schoolholiday";
          if (tr.days === "workday") return dayType === "workday" || dayType === "schoolholiday";
          return tr.days === dayType;
        })
        .map((tr) => ({ ...tr, depMins: U.toMinutes(tr.dep), arrMins: U.toMinutes(tr.arr) }))
        .sort((a, b) => a.depMins - b.depMins);

      const wMin = walkMatch.walkMin;
      const distM = walkMatch.distM;
      const wMinTotal = wMin;
      const distMTotal = distM;


      const walkBuses = (window.CITY_BUSES_FULL || []).filter(bus => U.busVisits(bus, fromStop));
      for (const bus of walkBuses) {
        if (!U.busVisits(bus, stopName)) continue;
        const fromOffset = U.stopOffset(bus, fromStop);
        const walkOffset = U.stopOffset(bus, stopName);
        if (fromOffset === null || walkOffset === null || walkOffset <= fromOffset) continue;

        // Ha a busz amúgy is megáll a tp.localStopName-ben a séta után,
        // akkor egyenesen odamegy — a sétás változat sosem jobb ennél.
        const directOffset = U.stopOffset(bus, tp.localStopName);
        if (directOffset !== null && directOffset > walkOffset) continue;

        const localDeps = U.getDepartures(bus, dayType);
        for (const localDep of localDeps) {
          const boardAt = localDep + fromOffset;
          if (boardAt < earliestBoard) continue;
          const arriveAtWalkStop = localDep + walkOffset;
          const arriveReadyForHelykozi = arriveAtWalkStop + wMinTotal;
          const mustBoardBy = arriveReadyForHelykozi;

          const hk = helykoziTrips.find((tr) => tr.depMins >= mustBoardBy);
          if (!hk) continue;
          if (schoolStartMin != null && hk.arrMins > schoolStartMin) continue;

          let depBuszallMins = hk.depMins;
          if (tp.originId !== "buszall") {
            const buszallOrigin = helykozi.origins.find(o => o.id === "buszall");
            if (buszallOrigin) {
              const buszallMatch = buszallOrigin.trips.find(tr => tr.line === hk.line && tr.arr === hk.arr);
              if (buszallMatch) depBuszallMins = U.toMinutes(buszallMatch.dep);
            }
          }

          const walkKey = `${tp.id}-${bus.id}-${bus.direction}-${boardAt}-${hk.depMins}`;
          const candidate = {
            departLeaveHome: boardAt - walkMin,
            boardingStopName: fromStop,
            localBus: bus,
            localBoardAt: boardAt,
            localArriveAtTransfer: arriveAtWalkStop,
            walkAfterBus: wMinTotal,
            walkAfterBusDist: distMTotal,
            transferReadyAt: arriveReadyForHelykozi,
            waitAtTransfer: hk.depMins - arriveReadyForHelykozi,
            helykoziDep: hk.depMins,
            helykoziArrive: hk.arrMins,
            helykoziLine: hk.line,
            helykoziDepBuszall: depBuszallMins,
            transferStop: tp.label,
            transferStopShort: tp.short,
            transferStopId: tp.id + "_walk",
            transferLocalStop: stopName,
            transferLat: origin.lat,
            transferLon: origin.lon,
            walkToSchool: walkToSchool,
            walkToSchoolDist: walkToSchoolDist,
            arriveSchool: hk.arrMins + walkToSchool,
            totalDuration: (hk.arrMins + walkToSchool) - (boardAt - walkMin),
          };
          const prev = walkBestMap.get(walkKey);
          if (!prev || distMTotal < prev.walkAfterBusDist) {
            walkBestMap.set(walkKey, candidate);
          }
        }
      }
    }
  }
  for (const r of walkBestMap.values()) routes.push(r);

  // Rendezés: legkorábbi iskolába-érkezés szerint
  routes.sort((a, b) => a.arriveSchool - b.arriveSchool);


  // Dedup: ugyanaz a helyi indulás + helyközi járat
  const filtered = [];
  const seenKey = new Set();
  for (const r of routes) {
    const k = `${r.localBus.id}-${r.localBus.direction}-${r.localBoardAt}-${r.helykoziDep}`;
    if (seenKey.has(k)) continue;
    seenKey.add(k);
    filtered.push(r);
  }

  return filtered.slice(0, maxResults);
};
