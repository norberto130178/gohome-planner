// ============================================================
// GoHome Planner — Algoritmusok & segédfüggvények
// ============================================================
// A menetrendi adatok (SCHEDULES, LOCAL_BUSES) a schedules.js-ben vannak.
// Ez a fájl csak az útvonaltervező logikát tartalmazza.
// ============================================================

window.APP_VERSION = "2.0";

// ============================================================
// Segédfüggvények
// ============================================================

window.BUS_UTILS = {
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

  // Nap típusa a dátumból
  dayType(date) {
    const d = date.getDay(); // 0=vas, 6=szo
    if (d === 0 || d === 6) return "weekend";
    return "workday";
  },

  // Egy busz departures objektumából → abszolút indulási idők [minutes[]]
  getDepartures(bus, dayType) {
    const dep = bus.departures[dayType] || {};
    const out = [];
    for (const hStr of Object.keys(dep)) {
      const h = Number(hStr);
      for (const m of dep[hStr]) {
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
  now, walkMin, minTransfer, maxResults,
  allowedTransfers,  // opcionális: string[] az átszálláspont id-kból; ha nincs, mindet figyeli
  homeStop,           // opcionális: custom leszállási megálló; ha null/undefined → "Csererdő"
}) {
  const U = window.BUS_UTILS;
  const dayType = U.dayType(now);  // "workday" | "weekend"
  const nowMins = now.getHours() * 60 + now.getMinutes();
  const earliestBoard = nowMins + walkMin;

  const helykozi = window.SCHEDULES.helykozi;
  const destinations = helykozi.destinations.filter((d) =>
    !allowedTransfers || allowedTransfers.length === 0 || allowedTransfers.includes(d.id)
  );

  // Ha homeStop be van állítva → CITY_BUSES-ból keresünk, különben LOCAL_BUSES
  const targetStop = homeStop || "Csererdő";
  const busPool = homeStop ? (window.CITY_BUSES || []) : window.LOCAL_BUSES;

  const routes = [];
  const seen = new Set();

  for (const dest of destinations) {
    const trips = dest.trips.filter((tr) => {
      if (tr.days === "both") return true;
      if (tr.days === "school") return dayType === "workday"; // tanítási nap ≈ munkanap
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
      const mustBoardBy = arrivalAtTransfer + minTransfer;

      for (const bus of busPool) {
        if (bus.morning) continue; // csak délutáni buszok
        if (!U.busVisits(bus, dest.localStopName)) continue;
        if (!U.busVisits(bus, targetStop)) continue;
        const transferOffset = U.stopOffset(bus, dest.localStopName);
        const targetOffset = U.stopOffset(bus, targetStop);
        if (targetOffset <= transferOffset) continue;

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
            waitAtTransfer: localAtTransfer - arrivalAtTransfer,
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
      if (bus.morning) return false;
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
  now, walkMin, minTransfer, maxResults, schoolStartMin,
  allowedTransfers,  // opcionális: melyik átszállópontokat használja (komakut, buszall, szinhaz_walk)
}) {
  const U = window.BUS_UTILS;
  const dayType = U.dayType(now);
  const nowMins = now.getHours() * 60 + now.getMinutes();
  const earliestBoard = nowMins + walkMin;  // mikor tud a gyerek Csererdő-megállónál lenni

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
      minTransfer: 0,
    },
    {
      id: "buszall",
      label: "Veszprém, autóbusz-állomás",
      short: "Autóbusz-áll.",
      originId: "buszall",
      localStopName: "Veszprém, autóbusz-állomás",
      walkAfterBus: 0,
      minTransfer: 3,
    },
    {
      id: "szinhaz_walk",
      label: "Petőfi Színház → Komakút (5 p gyalog)",
      short: "Színház→Komakút",
      originId: "komakut",
      localStopName: "Petőfi Színház",
      walkAfterBus: 5,
      minTransfer: 0,
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
        if (tr.days === "school") return dayType === "workday";
        return tr.days === dayType;
      })
      .map((tr) => ({
        ...tr,
        depMins: U.toMinutes(tr.dep),
        arrMins: U.toMinutes(tr.arr),
      }))
      .sort((a, b) => a.depMins - b.depMins);

    // Helyi buszok amik Csererdőről → tp.localStopName-re mennek
    for (const bus of window.LOCAL_BUSES) {
      if (!bus.morning) continue; // csak reggeli fordított-irányú buszok
      if (!U.busVisits(bus, "Csererdő")) continue;
      if (!U.busVisits(bus, tp.localStopName)) continue;
      const csererdoOffset = U.stopOffset(bus, "Csererdő");
      const targetOffset = U.stopOffset(bus, tp.localStopName);
      if (targetOffset <= csererdoOffset) continue;  // helyes irány

      const localDeps = U.getDepartures(bus, dayType);
      for (const localDep of localDeps) {
        if (localDep < earliestBoard) continue;  // már nem tudja elérni
        const localAtTarget = localDep + (targetOffset - csererdoOffset) * 1; // offset diff, a stopOffset már abszolút kezdettől
        // helyesebb: U.stopOffset-ek különbsége = menetidő
        const travelMin = targetOffset - csererdoOffset;
        const arriveAtTransfer = localDep + travelMin;
        const arriveReadyForHelykozi = arriveAtTransfer + tp.walkAfterBus;  // gyaloglás után
        const mustBoardBy = arriveReadyForHelykozi + (tp.minTransfer ?? minTransfer);

        // Első elérhető helyközi
        const hk = helykoziTrips.find((tr) => tr.depMins >= mustBoardBy);
        if (!hk) continue;
        if (schoolStartMin != null && hk.arrMins > schoolStartMin) continue; // későbbi mint a becsengetés

        // Autóbusz-pályaudvari indulás keresése (ha nem buszáll. az átszállópont)
        let depBuszallMins = hk.depMins;
        if (tp.originId !== "buszall") {
          const buszallOrigin = helykozi.origins.find(o => o.id === "buszall");
          if (buszallOrigin) {
            const match = buszallOrigin.trips.find(tr => tr.line === hk.line && tr.arr === hk.arr);
            if (match) depBuszallMins = U.toMinutes(match.dep);
          }
        }

        const key = `${tp.id}-${bus.id}-${bus.direction}-${localDep}-${hk.depMins}`;
        if (seen.has(key)) continue;
        seen.add(key);

        routes.push({
          departLeaveHome: localDep - walkMin,
          localBus: bus,
          localBoardAt: localDep,
          localArriveAtTransfer: arriveAtTransfer,
          walkAfterBus: tp.walkAfterBus,
          transferReadyAt: arriveReadyForHelykozi,
          waitAtTransfer: hk.depMins - arriveReadyForHelykozi,
          helykoziDep: hk.depMins,
          helykoziArrive: hk.arrMins,
          helykoziLine: hk.line,
          helykoziDepBuszall: depBuszallMins,
          transferStop: tp.label,
          transferStopShort: tp.short,
          transferStopId: tp.id,
          walkToSchool: 10,
          arriveSchool: hk.arrMins + 10,
          totalDuration: (hk.arrMins + 10) - (localDep - walkMin),
        });
      }
    }
  }

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
