// Diffs the app's city-data.js (CITY_BUSES_FULL) against the freshly extracted GTFS departures.
// Anchors each comparison at the app's own first-stop stop_id (not "whatever GTFS lists first"),
// since some GTFS trips include a lead-in stop before the app's nominal starting point.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'city-data.js'), 'utf8'), ctx);
const appBuses = ctx.window.CITY_BUSES_FULL;

const extracted = JSON.parse(fs.readFileSync(path.join(__dirname, 'veszprem-extracted.json'), 'utf8'));

function norm(s) {
  return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');
}
function gtfsStopId(spId) {
  // app spId is "VBUSZ_SP1751" -> GTFS stop_id "SP1751"
  const m = String(spId).match(/^VBUSZ_(.+)$/);
  return m ? m[1] : spId;
}
function minuteOf(raw) { return typeof raw === 'object' ? raw.t : raw; }
function noteOf(raw) { return typeof raw === 'object' ? raw.n : null; }

const extractedById = new Map();
for (const e of extracted) {
  if (!extractedById.has(e.id)) extractedById.set(e.id, []);
  extractedById.get(e.id).push(e);
}

const BUCKETS = ['workday', 'schoolholiday', 'weekend'];

const report = { matched: [], appOnlyRoutes: [], gtfsOnlyRoutes: [], unmatchedDirections: [] };
const usedExtracted = new Set();

for (const bus of appBuses) {
  const candidates = extractedById.get(bus.id);
  if (!candidates || candidates.length === 0) {
    report.appOnlyRoutes.push({ id: bus.id, direction: bus.direction });
    continue;
  }
  const appFirst = norm(bus.stops[0]?.name);
  const appLast = norm(bus.stops[bus.stops.length - 1]?.name);

  let best = null, bestScore = -1;
  for (const cand of candidates) {
    let score = 0;
    if (norm(cand.firstStopName) === appFirst) score += 2;
    if (norm(cand.lastStopName) === appLast) score += 2;
    if (score > bestScore) { bestScore = score; best = cand; }
  }
  if (!best || bestScore === 0) {
    report.unmatchedDirections.push({
      id: bus.id, appDirection: bus.direction,
      appFirst: bus.stops[0]?.name, appLast: bus.stops[bus.stops.length - 1]?.name,
      candidates: candidates.map(c => `${c.firstStopName} -> ${c.lastStopName}`),
    });
    continue;
  }
  usedExtracted.add(best);

  // Anchor at the stop whose offset is 0 — that's the stop the `departures` clock times
  // actually refer to (stops[0] isn't reliable: a stop with a negative offset, like a
  // real lead-in stop discovered via GTFS, can sit before it in the array).
  const zeroOffsetStop = bus.stops.find(s => s.offset === 0) || bus.stops[0];
  const anchorStopId = gtfsStopId(zeroOffsetStop.spId);
  const anchorFallbackStop = bus.stops[bus.stops.indexOf(zeroOffsetStop) + 1];
  const anchorFallback = anchorFallbackStop ? gtfsStopId(anchorFallbackStop.spId) : null;

  const gtfsAgg = { workday: {}, schoolholiday: {}, weekend: {} };
  let noAnchorCount = 0;
  for (const t of best.trips) {
    let val = t.stopTimes[anchorStopId];
    if (val === undefined && anchorFallback) val = t.stopTimes[anchorFallback];
    if (val === undefined) { noAnchorCount++; continue; }
    const hour = String(Math.floor(val / 60) % 24), min = val % 60;
    if (!gtfsAgg[t.bucket][hour]) gtfsAgg[t.bucket][hour] = new Set();
    gtfsAgg[t.bucket][hour].add(min);
  }

  const diffs = [];
  for (const bucket of BUCKETS) {
    const a = bus.departures?.[bucket] || {};
    const g = gtfsAgg[bucket] || {};
    const hours = new Set([...Object.keys(a), ...Object.keys(g)]);
    for (const h of [...hours].sort((x, y) => +x - +y)) {
      const aRaw = (a[h] || []).slice().sort((x, y) => minuteOf(x) - minuteOf(y));
      const gv = [...(g[h] || [])].sort((x, y) => x - y);
      const av = aRaw.map(minuteOf);
      if (JSON.stringify(av) !== JSON.stringify(gv)) {
        diffs.push({
          bucket, hour: h,
          app: aRaw.map(r => { const n = noteOf(r); return n ? `${minuteOf(r)}(${n})` : `${minuteOf(r)}`; }),
          gtfs: gv,
        });
      }
    }
  }

  report.matched.push({
    id: bus.id,
    direction: bus.direction,
    gtfsDirection: `${best.firstStopName} -> ${best.lastStopName}`,
    anchorStopName: zeroOffsetStop.name,
    noAnchorCount,
    matchScore: bestScore,
    diffCount: diffs.length,
    diffs,
  });
}

for (const e of extracted) {
  if (!usedExtracted.has(e)) {
    const anyAppHasId = appBuses.some(b => b.id === e.id);
    if (!anyAppHasId) {
      report.gtfsOnlyRoutes.push({ id: e.id, direction: `${e.firstStopName} -> ${e.lastStopName}` });
    }
  }
}

fs.writeFileSync(path.join(__dirname, 'veszprem-diff.json'), JSON.stringify(report, null, 2));

console.log('=== ÖSSZEFOGLALÓ ===');
console.log('App-ban lévő, GTFS-ben ID szinten nem található járat:', report.appOnlyRoutes.length);
console.log('GTFS-ben lévő, app-ban egyáltalán nem szereplő route ID:', report.gtfsOnlyRoutes.length);
console.log('Párosítatlan irányok:', report.unmatchedDirections.length);
console.log('Párosított irányok:', report.matched.length);
const withDiff = report.matched.filter(m => m.diffCount > 0);
console.log('Ebből eltérő menetrendű:', withDiff.length);
console.log('Egyező (nincs eltérés):', report.matched.length - withDiff.length);

const anchorIssues = report.matched.filter(m => m.noAnchorCount > 0);
if (anchorIssues.length) {
  console.log('\n--- Figyelem: ezeknél néhány GTFS trip nem érintette az anchor megállót (kihagyva) ---');
  for (const m of anchorIssues) console.log(' ', m.id, '|', m.direction, '| kihagyott trip:', m.noAnchorCount);
}

// FONTOS: a matchScore < 4 azt jelenti, hogy a párosítás csak RÉSZLEGES (pl. csak az
// első vagy csak az utolsó megálló neve egyezett) -- ez a diffCount-ot NEM
// befolyásolja (az időpont-összevetés csak az anchor megállónál történik, ami lehet
// hogy pont egyezik, míg a VÉGÁLLOMÁS/megállólista mégis rossz). Ez okozta, hogy a 4A
// busz "vissza" iránya hónapokig hibás (a 4-es busz adatával összekevert) maradt
// észrevétlenül, miközben minden diffCount:0-t mutatott (2026-08-22-én javítva,
// ld. project-pending-issues memória). MINDIG nézd át kézzel ezeket, ne csak a
// diffCount-ra hagyatkozz.
const partialMatches = report.matched.filter(m => m.matchScore < 4);
if (partialMatches.length) {
  console.log('\n!!! FIGYELEM: RÉSZLEGES párosítások (matchScore < 4) -- lehet hogy a megállólista/végállomás rossz, még ha diffCount:0 is !!!');
  for (const m of partialMatches) {
    console.log('  ', m.id, '|', m.direction, '| matchScore:', m.matchScore, '| GTFS szerinti valódi irány:', m.gtfsDirection, '| diffCount:', m.diffCount);
  }
  console.log('  Ellenőrizd kézzel: a fenti "GTFS szerinti valódi irány" végállomása egyezik-e az app irányával, vagy csak egy rövidebb/hosszabb valódi route-variánsról van szó (utóbbi ártalmatlan).');
}

console.log('\n--- Eltérő menetrendek (route id | irány | eltérések száma) ---');
for (const m of withDiff.sort((a, b) => a.id.localeCompare(b.id, 'hu', { numeric: true }))) {
  console.log(' ', m.id, '|', m.direction, '| diffCount:', m.diffCount);
}
console.log('\nRészletes riport: veszprem-diff.json');
