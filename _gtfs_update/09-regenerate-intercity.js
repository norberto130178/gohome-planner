// Regenerates INTERCITY_BUSES_FULL's `trips` arrays from the fresh GTFS extraction,
// keeping the app's own `stops` list (curated names/coords/citySpId) untouched.
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
  const m = String(spId).match(/(\d+)(?:_\d+)?$/);
  return m ? m[1] : spId;
}
function norm(s) { return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, ''); }

const bucketToDayType = { workday: 'munkanap', schoolholiday: 'tanszunet', weekend: 'szabadnap' };

const summary = [];

for (const bus of appBuses) {
  const nemesvamosStop = bus.stops.find(s => ['557858', '557862'].includes(normBaseId(s.spId)));
  if (!nemesvamosStop) { summary.push({ id: bus.id, dir: bus.dir, skipped: 'nincs Nemesvámos megálló' }); continue; }
  const nemesvamosIdx = bus.stops.indexOf(nemesvamosStop);
  const veszpremAnchor = nemesvamosIdx === 0 ? bus.stops[bus.stops.length - 1] : bus.stops[0];
  const veszpremAnchorBaseId = normBaseId(veszpremAnchor.spId);
  const nemesvamosBaseId = normBaseId(nemesvamosStop.spId);

  const candidates = extracted.filter(e => e.id === bus.id);
  let best = null, bestScore = -1;
  for (const cand of candidates) {
    const nIdx = cand.stops.findIndex(s => normBaseId(s.stop_id) === nemesvamosBaseId);
    const vIdx = cand.stops.findIndex(s => normBaseId(s.stop_id) === veszpremAnchorBaseId);
    if (nIdx === -1 || vIdx === -1) continue;
    const expectNemesvamosAfter = nemesvamosIdx !== 0;
    const orderOk = expectNemesvamosAfter ? nIdx > vIdx : nIdx < vIdx;
    let score = orderOk ? 2 : 0;
    score += 1 / cand.stops.length;
    if (score > bestScore) { bestScore = score; best = cand; }
  }
  if (!best || bestScore <= 0) { summary.push({ id: bus.id, dir: bus.dir, skipped: 'nincs egyertelmu GTFS iranypar' }); continue; }

  // For each app stop, find the matching GTFS stop index. Elsődlegesen a TELJES spId-t (a valódi
  // GTFS stop_id-t, pl. "557862_2") próbáljuk pontosan megfeleltetni -- ez determinisztikus és
  // helyes akkor is, ha egy hurkos szakaszon egy trip TÖBBSZÖR érinti ugyanazt az alap-azonosítót
  // más-más suffixummal (pl. 557862_1 ÉS 557862_2 is egy trip-en belül), mert nem a sorrendi
  // előfordulásra, hanem a tényleges peronra hagyatkozik.
  // Ha a pontos spId nem található a referencia struktúrában (nem várt eset), tartalék: alap-
  // azonosító + sorszám szerinti párosítás (a korábbi, kevésbé megbízható módszer).
  const baseOccurrenceCount = new Map();
  const appStopGtfsIndices = bus.stops.map(s => {
    const rawStopId = s.spId.replace(/^VOLAN_/, '');
    const exactIdx = best.stops.findIndex(gs => gs.stop_id === rawStopId);
    if (exactIdx !== -1) return [exactIdx];
    const base = normBaseId(s.spId);
    const allMatches = best.stops.map((gs, i) => normBaseId(gs.stop_id) === base ? i : -1).filter(i => i >= 0);
    const occurrence = baseOccurrenceCount.get(base) || 0;
    baseOccurrenceCount.set(base, occurrence + 1);
    return allMatches.length > occurrence ? [allMatches[occurrence]] : allMatches;
  });

  // Az app-kurált lista UTOLSÓ megállójának valódi GTFS stop_id-je -- ennek segítségével
  // tudjuk trip-enként eldönteni, hogy a busz a mi modellezett szakaszunk határa UTÁN a
  // valóságban folytatja-e az útját (pl. Veszprémfajsz/Hidegkút felé), vagy ott a konkrét
  // trip ténylegesen véget ér. Ez trip-enként ELTÉRŐ lehet ugyanazon (route,dir) belül is
  // (pl. néhány 7361-es trip a fordulónál valóban megfordul, mások továbbmennek Fajszig).
  const lastCuratedMatches = appStopGtfsIndices[appStopGtfsIndices.length - 1];
  const lastCuratedStopId = lastCuratedMatches.length ? best.stops[lastCuratedMatches[0]].stop_id : null;

  const newTrips = [];
  for (const t of best.trips) {
    if (t.buckets.length === 0) continue; // one-off exception-date services excluded from the regular timetable
    const deps = appStopGtfsIndices.map(idxList => {
      for (const i of idxList) { if (t.deps[i] !== null && t.deps[i] !== undefined) return t.deps[i]; }
      return null;
    });
    if (deps.every(d => d === null)) continue; // trip doesn't touch this app-modeled segment at all
    let continuesBeyondModel = false;
    if (lastCuratedStopId && t.seqStopIds) {
      const posInTrip = t.seqStopIds.indexOf(lastCuratedStopId);
      continuesBeyondModel = posInTrip !== -1 && posInTrip < t.seqStopIds.length - 1;
    }
    newTrips.push({ dayTypes: t.buckets.map(b => bucketToDayType[b]), deps, origin: t.originStopName || null, terminus: t.terminusStopName || null, continuesBeyondModel });
  }
  // sort by the Nemesvámos-stop time for readability, matching the original file's convention
  newTrips.sort((a, b) => (a.deps[nemesvamosIdx] ?? 1e9) - (b.deps[nemesvamosIdx] ?? 1e9));

  summary.push({
    id: bus.id, dir: bus.dir, direction: bus.direction,
    oldTripCount: bus.trips.length, newTripCount: newTrips.length,
    newTrips,
  });
}

fs.writeFileSync(path.join(__dirname, 'intercity-regenerated.json'), JSON.stringify(summary, null, 2));
for (const s of summary) {
  if (s.skipped) console.log(s.id, s.dir, '| KIHAGYVA:', s.skipped);
  else console.log(s.id, s.dir, '| régi trip szám:', s.oldTripCount, '| új trip szám:', s.newTripCount);
}
