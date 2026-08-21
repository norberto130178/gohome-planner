// Független ellenőrzés: KÖZVETLENÜL a nyers GTFS-ből (trips.txt, calendar.txt +
// intercity-filtered-stop-times.json, ami a nagy stop_times.txt route-ra szűrt, de egyébként
// nyers kivonata) építi fel, mely percekben indul busz minden app-beli platformról (spId)
// napszakonként — és ezt veti össze azzal, amit az app (data.js + intercity-data.js)
// ténylegesen visszaadna a StopTimetableModal "Helyközi" nézetében. Nem használja a pipeline
// saját extract/regenerate lépéseinek levezetett kimenetét — a nyers sorokból dolgozik újra.
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { parseCsv } = require('./lib/csv');

const DIR = path.join(__dirname, 'volanbusz');
const ROOT = path.join(__dirname, '..');

const trips = parseCsv(path.join(DIR, 'trips.txt'));
const tripById = new Map(trips.map(t => [t.trip_id, t]));
const calendar = parseCsv(path.join(DIR, 'calendar.txt'));
const calById = new Map(calendar.map(c => [c.service_id, c]));

function classifyService(desc) {
  const d = (desc || '').toLowerCase();
  if (d === 'naponta') return ['workday', 'schoolholiday', 'weekend'];
  if (d.startsWith('naponta, kivéve')) return ['workday', 'schoolholiday', 'weekend'];
  if (d.includes('tanszünet')) return ['schoolholiday'];
  if (d.includes('iskolai előadási') || d.includes('tanítási')) return ['workday'];
  if (d.includes('szabadnap') || d.includes('munkaszüneti')) return ['weekend'];
  if (d.includes('munkanap')) return ['workday', 'schoolholiday'];
  return [];
}

function toMinutes(hms) {
  const [h, m] = hms.split(':').map(Number);
  return h * 60 + m;
}

const rawStopTimes = JSON.parse(fs.readFileSync(path.join(__dirname, 'intercity-filtered-stop-times.json'), 'utf8'));
const byTripRaw = new Map();
for (const st of rawStopTimes) {
  if (!byTripRaw.has(st.trip_id)) byTripRaw.set(st.trip_id, []);
  byTripRaw.get(st.trip_id).push(st);
}
for (const rows of byTripRaw.values()) rows.sort((a, b) => Number(a.stop_sequence) - Number(b.stop_sequence));

// --- App oldal betöltése (data.js + intercity-data.js), sandboxban ---
const ctx = { window: { addEventListener: () => {} }, localStorage: { getItem: () => null, setItem: () => {} }, console };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'data.js'), 'utf8'), ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'intercity-data.js'), 'utf8'), ctx);

const platforms = ctx.window._intercityPlatforms();
console.log('Ellenorzendo platformok:', platforms.length);
console.log();

let totalChecks = 0, mismatchCount = 0;
const mismatchDetails = [];

for (const p of platforms) {
  const rawStopId = p.spId.replace(/^VOLAN_/, '');

  // Igazság: minden nyers trip, ami ezt a stop_id-t érinti ÉS van utána még megálló ugyanabban
  // a trip-ben (más stop_id-vel) -- ez felel meg az app "van-e tovább" szűrésének.
  const trueByDayType = { workday: new Map(), schoolholiday: new Map(), weekend: new Map() };
  for (const [tripId, rows] of byTripRaw) {
    const idx = rows.findIndex(r => r.stop_id === rawStopId);
    if (idx < 0) continue;
    const hasFurther = rows.slice(idx + 1).some(r => r.stop_id !== rawStopId);
    if (!hasFurther) continue;
    const trip = tripById.get(tripId);
    if (!trip) continue;
    const cal = calById.get(trip.service_id);
    const buckets = classifyService(cal ? cal.service_desc : '');
    const mins = toMinutes(rows[idx].departure_time);
    for (const b of buckets) trueByDayType[b].set(mins, (trueByDayType[b].get(mins) || 0) + 1);
  }

  for (const dt of ['workday', 'schoolholiday', 'weekend']) {
    totalChecks++;
    const appDeps = ctx.window.getIntercityDeparturesForPlatformLabel(p.label, dt);
    const appMultiset = new Map();
    for (const d of appDeps) appMultiset.set(d.mins, (appMultiset.get(d.mins) || 0) + 1);

    const trueMultiset = trueByDayType[dt];

    // Multihalmaz-összevetés
    const allMins = new Set([...appMultiset.keys(), ...trueMultiset.keys()]);
    const diffs = [];
    for (const m of allMins) {
      const a = appMultiset.get(m) || 0;
      const t = trueMultiset.get(m) || 0;
      if (a !== t) diffs.push(`${String(Math.floor(m/60)).padStart(2,'0')}:${String(m%60).padStart(2,'0')} (app:${a} nyers:${t})`);
    }
    if (diffs.length) {
      mismatchCount++;
      mismatchDetails.push({ label: p.label, dt, diffs });
    }
  }
}

console.log('Osszes (platform x napszak) ellenorzes:', totalChecks);
console.log('Eltero:', mismatchCount);
console.log();
for (const m of mismatchDetails) {
  console.log('ELTERES:', m.label, '|', m.dt);
  console.log('  ', m.diffs.join(', '));
}
