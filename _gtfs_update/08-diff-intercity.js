// Diffs INTERCITY_BUSES_FULL (the live intercity data) against the freshly extracted
// national GTFS, anchored at the Nemesvámos stop (the one stop every one of these
// route segments shares — the actual point of interest for the school run).
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'intercity-data.js'), 'utf8'), ctx);
const appBuses = ctx.window.INTERCITY_BUSES_FULL;

const extracted = JSON.parse(fs.readFileSync(path.join(__dirname, 'intercity-extracted.json'), 'utf8'));

function normBaseId(spId) {
  // "VOLAN_hkir_557858_3" / "hkir_557858_3" -> "557858"
  const m = String(spId).match(/(\d+)(?:_\d+)?$/);
  return m ? m[1] : spId;
}
function norm(s) { return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, ''); }

const BUCKETS = ['workday', 'schoolholiday', 'weekend'];

const report = { routes: [] };

for (const bus of appBuses) {
  // Anchor strictly at the terminus-type Nemesvámos stop named in bus.direction
  // ("autóbusz-váróterem" / "autóbusz-forduló") — several routes also pass through
  // other Nemesvámos-area stops (ABC, Köfém, Haribo, Vilmapusztai elágazás, ...),
  // which are NOT the intended reference point and must not be picked up here.
  const nemesvamosStop = bus.stops.find(s => ['557858', '557862'].includes(normBaseId(s.spId)));
  if (!nemesvamosStop) {
    report.routes.push({ id: bus.id, dir: bus.dir, direction: bus.direction, error: 'Nincs Nemesvámos-i megálló ebben a stops listában' });
    continue;
  }
  const nemesvamosIdx = bus.stops.indexOf(nemesvamosStop);
  const nemesvamosBaseId = normBaseId(nemesvamosStop.spId);

  const candidates = extracted.filter(e => e.id === bus.id);
  if (candidates.length === 0) {
    report.routes.push({ id: bus.id, dir: bus.dir, direction: bus.direction, error: 'A GTFS-ben nincs ilyen route ID a szűrt exportban' });
    continue;
  }

  // The long regional routes (7360/7370/...) have branching trip patterns, so the
  // group's overall first/last stop isn't reliable. Instead: require the candidate's
  // stop set to contain BOTH the Nemesvámos stop and the Veszprém-side anchor stop,
  // in the order implied by iskola (Veszprém -> Nemesvámos) / haza (Nemesvámos -> Veszprém).
  const veszpremAnchor = nemesvamosIdx === 0 ? bus.stops[bus.stops.length - 1] : bus.stops[0];
  const veszpremAnchorBaseId = normBaseId(veszpremAnchor.spId);
  let best = null, bestScore = -1;
  for (const cand of candidates) {
    const nIdx = cand.stops.findIndex(s => normBaseId(s.stop_id) === nemesvamosBaseId);
    const vIdx = cand.stops.findIndex(s => normBaseId(s.stop_id) === veszpremAnchorBaseId);
    if (nIdx === -1 || vIdx === -1) continue;
    const expectNemesvamosAfter = nemesvamosIdx !== 0; // app dir "iskola": Nemesvámos is last -> should come after anchor in GTFS order too
    const orderOk = expectNemesvamosAfter ? nIdx > vIdx : nIdx < vIdx;
    let score = orderOk ? 2 : 0;
    score += 1 / cand.stops.length; // prefer the more specific (shorter) pattern on ties
    if (score > bestScore) { bestScore = score; best = cand; }
  }
  if (!best || bestScore <= 0) {
    report.routes.push({
      id: bus.id, dir: bus.dir, direction: bus.direction,
      error: 'Nem sikerult egyertelmuen parositani az iranyt',
      candidates: candidates.map(c => `dir_id=${c.direction_id}: ${c.stops[0]?.name} -> ${c.stops[c.stops.length - 1]?.name}`),
    });
    continue;
  }

  const gtfsNemesvamosStopId = best.stops.find(s => normBaseId(s.stop_id) === nemesvamosBaseId)?.stop_id;
  if (!gtfsNemesvamosStopId) {
    report.routes.push({ id: bus.id, dir: bus.dir, direction: bus.direction, error: 'GTFS oldalon nincs egyezo Nemesvamos megallo ebben az iranyban' });
    continue;
  }
  const gtfsIdx = best.stops.findIndex(s => s.stop_id === gtfsNemesvamosStopId);

  // App side: aggregate {bucket: {hour: Set(minute)}} from bus.trips[].deps[nemesvamosIdx]
  const appAgg = { workday: {}, schoolholiday: {}, weekend: {} };
  for (const t of bus.trips) {
    const val = t.deps[nemesvamosIdx];
    if (val === null || val === undefined) continue;
    const hour = Math.floor(val / 60), min = val % 60;
    for (const dt of t.dayTypes) {
      const bucket = dt === 'munkanap' ? 'workday' : dt === 'tanszunet' ? 'schoolholiday' : dt === 'szabadnap' ? 'weekend' : null;
      if (!bucket) continue;
      if (!appAgg[bucket][hour]) appAgg[bucket][hour] = new Set();
      appAgg[bucket][hour].add(min);
    }
  }

  // GTFS side
  const gtfsAgg = { workday: {}, schoolholiday: {}, weekend: {} };
  for (const t of best.trips) {
    const val = t.deps[gtfsIdx];
    if (val === null || val === undefined) continue;
    const hour = Math.floor(val / 60), min = val % 60;
    for (const bucket of t.buckets) {
      if (!gtfsAgg[bucket][hour]) gtfsAgg[bucket][hour] = new Set();
      gtfsAgg[bucket][hour].add(min);
    }
  }

  const diffs = [];
  for (const bucket of BUCKETS) {
    const hours = new Set([...Object.keys(appAgg[bucket]), ...Object.keys(gtfsAgg[bucket])]);
    for (const h of [...hours].sort((a, b) => +a - +b)) {
      const av = [...(appAgg[bucket][h] || [])].sort((a, b) => a - b);
      const gv = [...(gtfsAgg[bucket][h] || [])].sort((a, b) => a - b);
      if (JSON.stringify(av) !== JSON.stringify(gv)) {
        diffs.push({ bucket, hour: h, app: av, gtfs: gv });
      }
    }
  }

  report.routes.push({
    id: bus.id, dir: bus.dir, direction: bus.direction,
    matchedGtfsDirection: `dir_id=${best.direction_id}: ${best.stops[0]?.name} -> ${best.stops[best.stops.length - 1]?.name}`,
    nemesvamosStopName: nemesvamosStop.name,
    diffCount: diffs.length,
    diffs,
  });
}

fs.writeFileSync(path.join(__dirname, 'intercity-diff.json'), JSON.stringify(report, null, 2));

console.log('=== ÖSSZEFOGLALÓ (helyközi, Nemesvámos-i időpontok) ===');
for (const r of report.routes) {
  if (r.error) { console.log(r.id, r.dir, '|', r.direction, '| HIBA:', r.error, r.candidates ? JSON.stringify(r.candidates) : ''); continue; }
  console.log(r.id, r.dir, '|', r.direction, '| diffCount:', r.diffCount, '| gtfs irany:', r.matchedGtfsDirection);
}
