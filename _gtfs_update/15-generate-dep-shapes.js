// Legenerálja a city-dep-shapes.js-t: minden egyes városi busz-indulásra
// (busId + irány + napszak + perc) hozzárendeli a GTFS trip valódi shape_id-ját.
// TELJESEN KÜLÖN fájl a city-data.js-től -- a city-data.js kézzel kurált,
// tömör JS-literál formátumú (nem tiszta JSON), gépi visszaírás kockázatos
// lenne rá; ehelyett a BusRouteMap (timetable-modal.jsx) ezt a lookupot
// olvassa ki a heurisztikus shape-választás kiváltásához.
//
// Előfeltétel: 03-extract-veszprem.js már lefutott (shapeId mezővel a
// veszprem-extracted.json trip-jein).
//
// Futtatás: node 15-generate-dep-shapes.js (a _gtfs_update/ mappából)
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
  const m = String(spId).match(/^VBUSZ_(.+)$/);
  return m ? m[1] : spId;
}

const extractedById = new Map();
for (const e of extracted) {
  if (!extractedById.has(e.id)) extractedById.set(e.id, []);
  extractedById.get(e.id).push(e);
}

const result = {}; // "busId|direction" -> { bucket -> { minute -> shapeId } }
const ambiguous = []; // riport: (busId|direction, bucket, minute) -> [shapeId1, shapeId2, ...]
let matchedDirs = 0, unmatchedDirs = 0, assignedDeps = 0, skippedNoShape = 0;

for (const bus of appBuses) {
  const candidates = extractedById.get(bus.id);
  if (!candidates || candidates.length === 0) { unmatchedDirs++; continue; }

  const appFirst = norm(bus.stops[0]?.name);
  const appLast = norm(bus.stops[bus.stops.length - 1]?.name);
  let best = null, bestScore = -1;
  for (const cand of candidates) {
    let score = 0;
    if (norm(cand.firstStopName) === appFirst) score += 2;
    if (norm(cand.lastStopName) === appLast) score += 2;
    if (score > bestScore) { bestScore = score; best = cand; }
  }
  if (!best || bestScore === 0) { unmatchedDirs++; continue; }
  matchedDirs++;

  const zeroOffsetStop = bus.stops.find(s => s.offset === 0) || bus.stops[0];
  const anchorStopId = gtfsStopId(zeroOffsetStop.spId);
  const anchorFallbackStop = bus.stops[bus.stops.indexOf(zeroOffsetStop) + 1];
  const anchorFallback = anchorFallbackStop ? gtfsStopId(anchorFallbackStop.spId) : null;

  const key = bus.id + '|' + bus.direction;
  const byBucket = { workday: {}, schoolholiday: {}, weekend: {} };
  const pending = new Map(); // "bucket|minute" -> Set(shapeId)

  for (const t of best.trips) {
    if (!t.shapeId) { skippedNoShape++; continue; }
    let val = t.stopTimes[anchorStopId];
    if (val === undefined && anchorFallback) val = t.stopTimes[anchorFallback];
    if (val === undefined) continue;
    // GTFS az éjfél utáni indulásokat 24:xx/25:xx-ként jelöli (nem 0:xx-ként), hogy
    // ugyanahhoz a "szolgálati naphoz" tartozzanak -- a city-data.js viszont 0:xx-ként
    // tárolja őket, ezért itt normalizálni kell (%1440), különben nem találná meg a lookup.
    const normVal = ((val % 1440) + 1440) % 1440;
    const pk = t.bucket + '|' + normVal;
    if (!pending.has(pk)) pending.set(pk, new Set());
    pending.get(pk).add(t.shapeId);
  }

  for (const [pk, shapeSet] of pending) {
    const [bucket, minuteStr] = pk.split('|');
    if (shapeSet.size > 1) {
      ambiguous.push({ key, bucket, minute: +minuteStr, shapeIds: [...shapeSet] });
      continue; // kétséges eset -- nem írunk be semmit, a heurisztika marad a fallback
    }
    byBucket[bucket][minuteStr] = [...shapeSet][0];
    assignedDeps++;
  }

  if (Object.values(byBucket).some(b => Object.keys(b).length > 0)) {
    result[key] = byBucket;
  }
}

fs.writeFileSync(
  path.join(ROOT, 'city-dep-shapes.js'),
  `// AUTO-GENERÁLT — _gtfs_update/15-generate-dep-shapes.js
// Induláshoz rendelt GTFS shape_id lookup, hogy a BusRouteMap (timetable-modal.jsx)
// ne heurisztikával találgassa, melyik útvonal-variánst rajzolja ki -- KÜLÖN fájl a
// city-data.js-től (az kézi kurálás, ezt nem érintjük).
// Struktúra: CITY_DEP_SHAPES["busId|irány"][bucket][percOaNapban] = "shapeId"
// Kétséges esetek (egy percen belül több eltérő shapeId) kihagyva -- ilyenkor a
// BusRouteMap a régi heurisztikára esik vissza.

window.CITY_DEP_SHAPES=${JSON.stringify(result)};\n`
);

console.log('Párosított irányok:', matchedDirs, '| párosítatlan:', unmatchedDirs);
console.log('Hozzárendelt indulás-shape:', assignedDeps, '| shape_id nélküli trip (kihagyva):', skippedNoShape);
console.log('Kétséges (több shapeId egy percen belül, kihagyva):', ambiguous.length);
if (ambiguous.length) {
  fs.writeFileSync(path.join(__dirname, 'dep-shapes-ambiguous.json'), JSON.stringify(ambiguous, null, 2));
  console.log('Részletek: dep-shapes-ambiguous.json');
}
console.log('Kiírva: city-dep-shapes.js');
