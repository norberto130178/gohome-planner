// ============================================================
// GoHome Planner — Algoritmusok & segédfüggvények
// ============================================================
// A menetrendi adatok (SCHEDULES) a schedules.js-ben vannak.
// Ez a fájl csak az útvonaltervező logikát tartalmazza.
// ============================================================

// APP_VERSION az index.html-ben van definiálva (ott állítja be a cache bustert is)

// Valós gyalogos útvonal lekérése az OSRM ingyenes demo szerveréről (kulcs nélkül).
// Visszaad egy [lat,lon] koordinátatömböt Leafletnek, vagy null-t ha a lekérés
// sikertelen/időtúllépés (ilyenkor a hívó fél essen vissza légvonalra).
async function _osrmFoot(lat1, lon1, lat2, lon2) {
  try {
    const url = `https://router.project-osrm.org/route/v1/foot/${lon1},${lat1};${lon2},${lat2}?overview=full&geometries=geojson`;
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return null;
    const data = await res.json();
    const route = data?.routes?.[0];
    const coords = route?.geometry?.coordinates;
    if (!coords || coords.length < 2) return null;
    return { distance: route.distance, coords: coords.map(([lon, lat]) => [lat, lon]) };
  } catch (e) {
    return null;
  }
}

// Az OSRM gyalogos útvonala nem mindig szimmetrikus (pl. irányított gyalogút-jelölés
// miatt A→B és B→A eltérő hosszú utat adhat — valós, megfigyelt eset egy veszprémi
// park ösvényénél). Mivel a térképen csak megjelenítjük a vonalat (nem navigálunk),
// mindkét irányt lekérjük párhuzamosan, és a rövidebbet rajzoljuk ki.
window.fetchWalkingRoute = async function (lat1, lon1, lat2, lon2) {
  const [fwd, rev] = await Promise.all([
    _osrmFoot(lat1, lon1, lat2, lon2),
    _osrmFoot(lat2, lon2, lat1, lon1),
  ]);
  if (!fwd && !rev) return null;
  if (!rev || (fwd && fwd.distance <= rev.distance)) return fwd.coords;
  return rev.coords.slice().reverse();
};

// Helyi buszok amik Csererdőt érintik (hazaút + iskolába tervező)
const HOME_BUS_IDS = ["3", "8", "8Y", "28"];

function _haversineM(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const φ1 = lat1 * Math.PI / 180, φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180, Δλ = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(Δφ/2)**2 + Math.cos(φ1)*Math.cos(φ2)*Math.sin(Δλ/2)**2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
}

// Nyári szünet dátumtartomány + "Automatikus / Mindig / Soha" mód kezelése.
// Megosztott a két app között (mindkettő betölti a data.js-t), mert ugyanaz a
// valós iskolai naptár — a mód (auto/on/off) viszont app-onként külön van elmentve,
// mert a kézi felülbírálás apponként eltérő lehet.
window.SchoolHolidayUtil = {
  getRange() {
    return {
      start: localStorage.getItem('schoolholiday.range.start') || '',
      end: localStorage.getItem('schoolholiday.range.end') || '',
    };
  },
  setRange(start, end) {
    if (start) localStorage.setItem('schoolholiday.range.start', start);
    else localStorage.removeItem('schoolholiday.range.start');
    if (end) localStorage.setItem('schoolholiday.range.end', end);
    else localStorage.removeItem('schoolholiday.range.end');
  },
  isInRange(date) {
    const { start, end } = this.getRange();
    if (!start || !end) return false;
    const d = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    return d >= start && d <= end;
  },
  // mode: 'auto' | 'on' | 'off'; date: a tervezéshez használt dátum (pl. `now`, ami a dayOffset-tel már el van tolva)
  resolve(mode, date) {
    if (mode === 'on') return true;
    if (mode === 'off') return false;
    return this.isInRange(date);
  },
};

// Busz megjelenítendő címkéje nyelvfüggően. A city-data.js `label` mezője csak
// magyarul létezik (pl. "1-es busz"); angol módban a tiszta `id`-ra esünk vissza
// ("Bus 1"), mert a magyar sorszám-toldalék ("-es"/"-os"/"-as") nem parse-olható
// megbízhatóan vissza angolra.
window.busLabel = function (bus, t) {
  if (!bus) return "";
  if (t && t._lang === "en") return "Bus " + bus.id;
  return bus.label;
};

// A city-data.js `direction` mezője szabad szöveg ("A ▸ B felé", néha "körjárat" vagy
// "(X-en át)" zárójeles kiegészítéssel) — csak magyarul létezik. Angol módban a
// domináns mintákat ("felé", "körjárat") lecseréljük; a ritka zárójeles útvonal-
// kiegészítők (pl. "(Sportuszodán át)") magyarul maradnak, mert szabad szöveges
// fordításuk megbízhatóan nem automatizálható.
window.busDirection = function (bus, t) {
  if (!bus) return "";
  if (!(t && t._lang === "en")) return bus.direction;
  return (bus.direction || "")
    .replace(/\s*felé\b/g, "")
    .replace(/körjárat/g, "circular route");
};

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
// GTFS intercity ↔ city-data megálló névleképezések
// ============================================================

// GTFS megállónév → city-data.js megállónév (átszállási kereséshez)
const _GTFS_CITY_STOP = {
  "Veszprém, autóbusz-állomás":     "Veszprém autóbusz-állomás",
  "Veszprém, Komakút tér":          "Komakút tér / Pannon Egyetem",
  "Veszprém, Színház":              "Petőfi Színház",
  "Veszprém, Jutasi úti lakótelep": "Jutasi úti lakótelep",
  "Veszprém, vasútállomás":         "Veszprém vasútállomás",
};

// GTFS stop rövid megjelenítési neve (kártyán)
const _TRANSFER_SHORT = {
  "Veszprém, autóbusz-állomás": "Autóbusz-áll.",
  "Veszprém, Komakút tér":      "Komakút tér",
  "Veszprém, Színház":          "Petőfi Színház",
};

function _dayTypeCat(dayType) {
  return { workday: 'munkanap', schoolholiday: 'tanszunet', weekend: 'szabadnap' }[dayType] || 'munkanap';
}

// ============================================================
// Útvonaltervező — haza irány: Nemesvámos → Veszprém → hazafelé
// ============================================================

window.planRoutes = function planRoutes({
  now, walkMin, maxResults,
  homeStop,
  schoolHoliday,
}) {
  const U = window.BUS_UTILS;
  const dayType = U.dayType(now, schoolHoliday);
  const nowMins = now.getHours() * 60 + now.getMinutes();
  const earliestBoard = nowMins + walkMin;

  const targetStop = homeStop || "Csererdő";
  const busPool = (window.CITY_BUSES_FULL || []).filter(bus =>
    (homeStop || HOME_BUS_IDS.includes(bus.id)) && U.busVisits(bus, targetStop)
  );

  const icRoutes = (window.INTERCITY_BUSES_FULL || []).filter(r => r.dir === 'haza');
  const _cat = _dayTypeCat(dayType);
  const walkGraph = window.WALK_GRAPH || {};

  const routes = [];
  const seen = new Set();

  for (const icRoute of icRoutes) {
    // Felszállási megálló Nemesvámoson: autóbusz-váróterem
    const boardStopIdx = icRoute.stops.findIndex(s => s.name === "Nemesvámos, autóbusz-váróterem");
    if (boardStopIdx === -1) continue;

    for (const trip of (icRoute.trips || [])) {
      if (!trip.dayTypes.includes(_cat)) continue;
      const boardAtVaroterem = trip.deps[boardStopIdx];
      if (boardAtVaroterem == null || boardAtVaroterem < earliestBoard) continue;

      // Minden Veszprémi átszállási megálló ebben a járatban
      for (let vi = 0; vi < icRoute.stops.length; vi++) {
        const icVeszpStop = icRoute.stops[vi];
        if (!icVeszpStop.name.startsWith('Veszprém,')) continue;
        const cityStopName = _GTFS_CITY_STOP[icVeszpStop.name];
        if (!cityStopName) continue;

        const icArriveAtVeszp = trip.deps[vi];
        if (icArriveAtVeszp == null) continue;

        for (const bus of busPool) {
          if (bus.stops[0]?.name === "Csererdő") continue;
          if (!U.busVisits(bus, cityStopName)) continue;
          if (!U.busVisits(bus, targetStop)) continue;
          const transferOffset = U.stopOffset(bus, cityStopName);
          const targetOffset = U.stopOffset(bus, targetStop);
          if (targetOffset <= transferOffset) continue;

          let walkAtTransfer = null;
          const busStopAtTransfer = bus.stops.find(s => s.name === cityStopName);
          if (busStopAtTransfer?.spId && icVeszpStop.citySpId && busStopAtTransfer.spId !== icVeszpStop.citySpId) {
            const edge = (walkGraph[icVeszpStop.citySpId] || []).find(n => n.spId === busStopAtTransfer.spId);
            if (edge) walkAtTransfer = { distM: edge.distM, walkMin: edge.walkMin };
          }
          const mustBoardBy = icArriveAtVeszp + (walkAtTransfer?.walkMin ?? 0);

          const localDeps = U.getDepartures(bus, dayType);
          for (const localDep of localDeps) {
            const localBoardAt = localDep + transferOffset;
            if (localBoardAt < mustBoardBy) continue;
            const localArriveHome = localDep + targetOffset;

            const key = `${icRoute.id}-${boardAtVaroterem}-${bus.id}-${bus.direction}-${localDep}`;
            if (seen.has(key)) continue;
            seen.add(key);

            routes.push({
              departLeaveHome: boardAtVaroterem - walkMin,
              helykoziDep: boardAtVaroterem,
              helykoziArrive: icArriveAtVeszp,
              helykoziLine: icRoute.id,
              transferStop: cityStopName,
              transferStopShort: _TRANSFER_SHORT[icVeszpStop.name] || icVeszpStop.name.replace('Veszprém, ', ''),
              transferStopId: icVeszpStop.name,
              transferLocalStop: cityStopName,
              transferLat: icVeszpStop.lat,
              transferLon: icVeszpStop.lon,
              waitAtTransfer: localBoardAt - icArriveAtVeszp,
              ...(walkAtTransfer ? { walkAtTransfer } : {}),
              localBus: bus,
              localBoardAt,
              localArriveCsererdo: localArriveHome,
              homeStop: targetStop,
              totalDuration: localArriveHome - (boardAtVaroterem - walkMin),
            });
          }
        }
      }
    }
  }

  routes.sort((a, b) => a.localArriveCsererdo - b.localArriveCsererdo);

  const filtered = [];
  const seenKey = new Set();
  for (const r of routes) {
    const k = `${r.helykoziDep}-${r.localBus.id}-${r.localBus.direction}-${r.localBoardAt}`;
    if (seenKey.has(k)) continue;
    seenKey.add(k);
    filtered.push(r);
  }

  const result = filtered.slice(0, maxResults);

  if (homeStop && result.length === 0) {
    const otherDay = dayType === "workday" ? "weekend" : "workday";
    const hasOtherDay = busPool.some(bus => {
      if (bus.stops[0]?.name === "Csererdő") return false;
      if (!U.busVisits(bus, targetStop)) return false;
      return U.getDepartures(bus, otherDay).length > 0;
    });
    if (hasOtherDay) result.hint = otherDay === "weekend" ? "weekendOnly" : "workdayOnly";
  }

  return result;
};

// ============================================================
// Reggeli útvonaltervező — Csererdő → Nemesvámos (iskolába)
// 1. Helyi busz fromStop-ról egy Veszprémi átszálláspontra
// 2. Opcionálisan séta a walk-graph alapján egy közeli megállóhoz
// 3. Helyközi busz az átszálláspontról Nemesvámosra
// ============================================================

window.planSchoolRoutes = function planSchoolRoutes({
  now, walkMin, maxResults, schoolStartMin,
  schoolHoliday,
  fromStop,
  walkToSchool,
  walkToSchoolDist,
}) {
  fromStop = fromStop || "Csererdő";
  walkToSchool = walkToSchool != null ? walkToSchool : 10;
  const U = window.BUS_UTILS;
  const dayType = U.dayType(now, schoolHoliday);
  const nowMins = now.getHours() * 60 + now.getMinutes();
  const earliestBoard = nowMins + walkMin;

  const icRoutes = (window.INTERCITY_BUSES_FULL || []).filter(r => r.dir === 'iskola');
  const _cat = _dayTypeCat(dayType);
  const walkGraph = window.WALK_GRAPH || {};

  const routes = [];
  const seen = new Set();

  for (const icRoute of icRoutes) {
    const lastStopIdx = icRoute.stops.length - 1;
    const buszallIdx = icRoute.stops.findIndex(s => s.name === "Veszprém, autóbusz-állomás");

    // Veszprémi felszállási megállók indexei (az utolsó/iskolai megálló előtt)
    const veszpremBoardIdxs = icRoute.stops
      .map((s, i) => (i < icRoute.stops.length - 1 && s.name.startsWith('Veszprém,')) ? i : -1)
      .filter(i => i !== -1);

    for (const boardStopIdx of veszpremBoardIdxs) {
      const icBoardStop = icRoute.stops[boardStopIdx];
      const cityStopName = _GTFS_CITY_STOP[icBoardStop.name];
      if (!cityStopName) continue;

      const schoolBuses = (window.CITY_BUSES_FULL || []).filter(bus =>
        U.busVisits(bus, fromStop) && U.busVisits(bus, cityStopName)
      );

      for (const bus of schoolBuses) {
        const fromOffset = U.stopOffset(bus, fromStop);
        const transOffset = U.stopOffset(bus, cityStopName);
        if (fromOffset === null || transOffset === null || transOffset <= fromOffset) continue;

        let walkAtTransfer = null;
        const busStopAtTransfer = bus.stops.find(s => s.name === cityStopName);
        if (busStopAtTransfer?.spId && icBoardStop.citySpId && busStopAtTransfer.spId !== icBoardStop.citySpId) {
          const edge = (walkGraph[icBoardStop.citySpId] || []).find(n => n.spId === busStopAtTransfer.spId);
          if (edge) walkAtTransfer = { distM: edge.distM, walkMin: edge.walkMin };
        }
        const walkAtTransferMin = walkAtTransfer?.walkMin ?? 0;

        const localDeps = U.getDepartures(bus, dayType);
        for (const localDep of localDeps) {
          const boardAt = localDep + fromOffset;
          if (boardAt < earliestBoard) continue;
          const arriveAtTransfer = localDep + transOffset;
          const readyForHelykozi = arriveAtTransfer + walkAtTransferMin;

          const matchingTrip = (icRoute.trips || []).find(trip => {
            if (!trip.dayTypes.includes(_cat)) return false;
            const d = trip.deps[boardStopIdx];
            return d != null && d >= readyForHelykozi;
          });
          if (!matchingTrip) continue;

          const icDepAtStop = matchingTrip.deps[boardStopIdx];
          const icArriveSchool = matchingTrip.deps[lastStopIdx];
          if (icArriveSchool == null) continue;
          if (schoolStartMin != null && icArriveSchool > schoolStartMin) continue;

          const helykoziDepBuszall = buszallIdx !== -1 ? (matchingTrip.deps[buszallIdx] ?? icDepAtStop) : icDepAtStop;

          const key = `${icBoardStop.name}-${bus.id}-${bus.direction}-${boardAt}-${icDepAtStop}`;
          if (seen.has(key)) continue;
          seen.add(key);

          routes.push({
            departLeaveHome: boardAt - walkMin,
            boardingStopName: fromStop,
            localBus: bus,
            localBoardAt: boardAt,
            localArriveAtTransfer: arriveAtTransfer,
            walkAfterBus: 0,
            walkAfterBusDist: null,
            transferReadyAt: readyForHelykozi,
            waitAtTransfer: icDepAtStop - readyForHelykozi,
            ...(walkAtTransfer ? { walkAtTransfer } : {}),
            helykoziDep: icDepAtStop,
            helykoziArrive: icArriveSchool,
            helykoziLine: icRoute.id,
            helykoziDepBuszall,
            transferStop: cityStopName,
            transferStopShort: _TRANSFER_SHORT[icBoardStop.name] || icBoardStop.name.replace('Veszprém, ', ''),
            transferStopId: icBoardStop.name,
            transferLocalStop: cityStopName,
            transferLat: icBoardStop.lat,
            transferLon: icBoardStop.lon,
            walkToSchool,
            walkToSchoolDist,
            arriveSchool: icArriveSchool + walkToSchool,
            totalDuration: (icArriveSchool + walkToSchool) - (boardAt - walkMin),
          });
        }
      }
    }
  }

  // ── WALK-TRANSFER (WALK_GRAPH) ─────────────────────────────
  const walkBestMap = new Map();

  const _walkNodes = window.WALK_GRAPH_NODES || {};
  for (const [walkFromSpId, neighbors] of Object.entries(walkGraph)) {
    const walkFromStop = _walkNodes[walkFromSpId];
    if (!walkFromStop) continue;

    for (const icRoute of icRoutes) {
      const lastStopIdx2 = icRoute.stops.length - 1;
      const buszallIdx2 = icRoute.stops.findIndex(s => s.name === "Veszprém, autóbusz-állomás");

      for (let boardStopIdx2 = 0; boardStopIdx2 < icRoute.stops.length - 1; boardStopIdx2++) {
        const icBoardStop = icRoute.stops[boardStopIdx2];
        if (!icBoardStop.name.startsWith('Veszprém,')) continue;
        const cityStopName = _GTFS_CITY_STOP[icBoardStop.name];
        if (!cityStopName) continue;
        if (!icBoardStop.citySpId) continue;

        const walkMatch = neighbors.find(n => n.spId === icBoardStop.citySpId && n.distM >= 100);
        if (!walkMatch) continue;

        const wMin = walkMatch.walkMin;
        const distM = walkMatch.distM;

        const walkBuses = (window.CITY_BUSES_FULL || []).filter(bus => U.busVisits(bus, fromStop));
        for (const bus of walkBuses) {
          if (!U.busVisits(bus, walkFromStop)) continue;
          const fromOffset = U.stopOffset(bus, fromStop);
          const walkOffset = U.stopOffset(bus, walkFromStop);
          if (fromOffset === null || walkOffset === null || walkOffset <= fromOffset) continue;

          const directOffset = U.stopOffset(bus, cityStopName);
          if (directOffset !== null && directOffset > walkOffset) continue;

          const localDeps = U.getDepartures(bus, dayType);
          for (const localDep of localDeps) {
            const boardAt = localDep + fromOffset;
            if (boardAt < earliestBoard) continue;
            const arriveAtWalkStop = localDep + walkOffset;
            const readyForHelykozi = arriveAtWalkStop + wMin;

            const matchingTrip2 = (icRoute.trips || []).find(trip => {
              if (!trip.dayTypes.includes(_cat)) return false;
              const d = trip.deps[boardStopIdx2];
              return d != null && d >= readyForHelykozi;
            });
            if (!matchingTrip2) continue;

            const icDepAtStop = matchingTrip2.deps[boardStopIdx2];
            const icArriveSchool = matchingTrip2.deps[lastStopIdx2];
            if (icArriveSchool == null) continue;
            if (schoolStartMin != null && icArriveSchool > schoolStartMin) continue;

            const helykoziDepBuszall = buszallIdx2 !== -1 ? (matchingTrip2.deps[buszallIdx2] ?? icDepAtStop) : icDepAtStop;
            const walkKey = `${icBoardStop.name}-${bus.id}-${bus.direction}-${boardAt}-${icDepAtStop}`;
            const candidate = {
              departLeaveHome: boardAt - walkMin,
              boardingStopName: fromStop,
              localBus: bus,
              localBoardAt: boardAt,
              localArriveAtTransfer: arriveAtWalkStop,
              walkAfterBus: wMin,
              walkAfterBusDist: distM,
              transferReadyAt: readyForHelykozi,
              waitAtTransfer: icDepAtStop - readyForHelykozi,
              helykoziDep: icDepAtStop,
              helykoziArrive: icArriveSchool,
              helykoziLine: icRoute.id,
              helykoziDepBuszall,
              transferStop: cityStopName,
              transferStopShort: _TRANSFER_SHORT[icBoardStop.name] || icBoardStop.name.replace('Veszprém, ', ''),
              transferStopId: icBoardStop.name + "_walk",
              transferLocalStop: walkFromStop,
              transferLat: icBoardStop.lat,
              transferLon: icBoardStop.lon,
              walkToSchool,
              walkToSchoolDist,
              arriveSchool: icArriveSchool + walkToSchool,
              totalDuration: (icArriveSchool + walkToSchool) - (boardAt - walkMin),
            };
            const prev = walkBestMap.get(walkKey);
            if (!prev || distM < prev.walkAfterBusDist) walkBestMap.set(walkKey, candidate);
          }
        }
      }
    }
  }
  for (const r of walkBestMap.values()) routes.push(r);

  routes.sort((a, b) => a.arriveSchool - b.arriveSchool);

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
