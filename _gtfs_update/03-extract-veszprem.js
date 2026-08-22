// Extracts per-route/direction departures from the Veszprém local GTFS feed,
// bucketed into workday / schoolholiday / weekend to match CITY_BUSES_FULL's shape.
//
// IMPORTANT: some GTFS trips include a lead-in stop before the app's nominal "first
// stop" of a direction (e.g. bus 2 reverse direction has a GTFS-only stop before
// "Endrődi Sándor lakótelep"). Anchoring on "the first stop_sequence row" therefore
// silently picks up the wrong time. Instead we keep each trip's FULL stop_id->minutes
// map, and 04-diff-veszprem.js looks up times at the app's actual stop_id per hop.
const fs = require('fs');
const path = require('path');
const { parseCsv } = require('./lib/csv');

const DIR = path.join(__dirname, 'veszprem');
const WORKDAY_CUTOFF = '20260619'; // last day of the school-term "_HP" service block (inclusive)

const calDates = parseCsv(path.join(DIR, 'calendar_dates.txt'));
const serviceDates = new Map();
for (const row of calDates) {
  const sid = row.service_id;
  if (!serviceDates.has(sid)) serviceDates.set(sid, new Set());
  const set = serviceDates.get(sid);
  if (row.exception_type === '1') set.add(row.date);
  else if (row.exception_type === '2') set.delete(row.date);
}

function bucketForService(sid) {
  if (sid.endsWith('_SZ') || sid.endsWith('_VV')) return 'weekend';
  const dates = serviceDates.get(sid) || new Set();
  const minDate = [...dates].sort()[0];
  return minDate && minDate <= WORKDAY_CUTOFF ? 'workday' : 'schoolholiday';
}

const routes = parseCsv(path.join(DIR, 'routes.txt'));
const routeById = new Map(routes.map(r => [r.route_id, r]));

const trips = parseCsv(path.join(DIR, 'trips.txt'));

const stopTimesRaw = fs.readFileSync(path.join(DIR, 'stop_times.txt'), 'utf8').split(/\r?\n/);
const stHeader = stopTimesRaw[0].split(',').map(h => h.replace(/"/g, ''));
const idx = Object.fromEntries(stHeader.map((h, i) => [h, i]));

const tripStopTimes = new Map(); // trip_id -> [{seq, stop_id, time}]
for (let i = 1; i < stopTimesRaw.length; i++) {
  const line = stopTimesRaw[i];
  if (!line) continue;
  const fields = line.split(',').map(f => f.replace(/^"|"$/g, ''));
  const tripId = fields[idx.trip_id];
  if (!tripStopTimes.has(tripId)) tripStopTimes.set(tripId, []);
  tripStopTimes.get(tripId).push({
    seq: +fields[idx.stop_sequence],
    stop_id: fields[idx.stop_id],
    time: fields[idx.departure_time],
  });
}
for (const arr of tripStopTimes.values()) arr.sort((a, b) => a.seq - b.seq);

const stops = parseCsv(path.join(DIR, 'stops.txt'));
const stopById = new Map(stops.map(s => [s.stop_id, s]));

function toMinutesOfDay(hms) {
  const [h, m] = hms.split(':').map(Number);
  return h * 60 + m;
}

// route_short_name -> direction_id -> group
const result = new Map();

for (const trip of trips) {
  const route = routeById.get(trip.route_id);
  if (!route) continue;
  const seq = tripStopTimes.get(trip.trip_id);
  if (!seq || seq.length === 0) continue;

  const shortName = route.route_short_name;
  const dirKey = shortName + '||' + trip.direction_id;
  if (!result.has(dirKey)) {
    result.set(dirKey, {
      id: shortName,
      direction_id: trip.direction_id,
      firstStopName: stopById.get(seq[0].stop_id)?.stop_name,
      lastStopName: stopById.get(seq[seq.length - 1].stop_id)?.stop_name,
      trips: [], // { bucket, stopTimes: {stop_id: minutesOfDay} }
    });
  }
  const entry = result.get(dirKey);
  const bucket = bucketForService(trip.service_id);
  const stopTimes = {};
  for (const s of seq) stopTimes[s.stop_id] = toMinutesOfDay(s.time);
  entry.trips.push({ bucket, stopTimes, shapeId: trip.shape_id || null, tripId: trip.trip_id });
}

const out = [...result.values()];
fs.writeFileSync(path.join(__dirname, 'veszprem-extracted.json'), JSON.stringify(out, null, 2));
console.log('Extracted', out.length, 'route/direction combos ->', path.join(__dirname, 'veszprem-extracted.json'));
