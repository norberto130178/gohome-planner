// Builds per-route/direction stop-time tables from the filtered intercity GTFS data,
// classifies each trip's service into workday / schoolholiday / weekend buckets using
// the VOLÁNBUSZ calendar.txt service_desc text (Hungarian, very explicit wording),
// and writes a normalized extraction matching INTERCITY_BUSES_FULL's stop/dep shape.
const fs = require('fs');
const path = require('path');
const { parseCsv } = require('./lib/csv');

const DIR = path.join(__dirname, 'volanbusz');

const trips = JSON.parse(fs.readFileSync(path.join(__dirname, 'intercity-filtered-trips.json'), 'utf8'));
const tripById = new Map(trips.map(t => [t.trip_id, t]));

const routes = parseCsv(path.join(DIR, 'routes.txt'));
const routeById = new Map(routes.map(r => [r.route_id, r]));

const calendar = parseCsv(path.join(DIR, 'calendar.txt'));
const calById = new Map(calendar.map(c => [c.service_id, c]));

const stops = parseCsv(path.join(DIR, 'stops.txt'));
const stopById = new Map(stops.map(s => [s.stop_id, s]));

function classifyService(desc) {
  const d = (desc || '').toLowerCase();
  if (d === 'naponta') return ['workday', 'schoolholiday', 'weekend'];
  if (d.startsWith('naponta, kivéve')) return ['workday', 'schoolholiday', 'weekend']; // daily minus one weekend day — still touches all 3 buckets
  if (d.includes('tanszünet')) return ['schoolholiday'];
  if (d.includes('iskolai előadási') || d.includes('tanítási')) return ['workday'];
  if (d.includes('szabadnap') || d.includes('munkaszüneti')) return ['weekend'];
  if (d.includes('munkanap')) return ['workday', 'schoolholiday']; // generic weekday, term-independent
  return []; // one-off exception dates (e.g. vonatpótlás) — excluded from the regular-timetable comparison
}

const stopTimes = JSON.parse(fs.readFileSync(path.join(__dirname, 'intercity-filtered-stop-times.json'), 'utf8'));
const byTrip = new Map();
for (const st of stopTimes) {
  if (!byTrip.has(st.trip_id)) byTrip.set(st.trip_id, []);
  byTrip.get(st.trip_id).push(st);
}
for (const arr of byTrip.values()) arr.sort((a, b) => a.stop_sequence - b.stop_sequence);

function toMinutes(hms) {
  const [h, m] = hms.split(':').map(Number);
  return h * 60 + m;
}

// key: route_short_name + '||' + direction_id
const groups = new Map();

for (const [tripId, seq] of byTrip) {
  const trip = tripById.get(tripId);
  if (!trip) continue;
  const route = routeById.get(trip.route_id);
  const shortName = route.route_short_name;
  const key = shortName + '||' + trip.direction_id;
  if (!groups.has(key)) {
    groups.set(key, {
      id: shortName,
      direction_id: trip.direction_id,
      headsign: trip.trip_headsign,
      trips: [], // { serviceId, buckets, stopTimes: Map(stop_id -> minutes), seqStopIds: [stop_id,...] ebben a trip-ben, valódi sorrendben }
    });
  }
  const g = groups.get(key);
  const cal = calById.get(trip.service_id);
  const buckets = classifyService(cal ? cal.service_desc : '');

  const stMap = new Map();
  const seqStopIds = [];
  for (const st of seq) {
    stMap.set(st.stop_id, toMinutes(st.departure_time));
    seqStopIds.push(st.stop_id);
  }
  // seq[0] a trip VALÓDI első megállója a teljes (nem app-modellezett) GTFS sorrendben —
  // ez különbözteti meg pl. a teljes útvonalú és a félúttól induló ("rövidített") trip-eket,
  // amik a közös szakaszon percre pontosan egybeeshetnek. A trip_headsign erre NEM jó, mert
  // az a célállomást jelöli, ami a rövidített és teljes trip-eknél gyakran megegyezik.
  const originStopName = stopById.get(seq[0].stop_id)?.stop_name || null;
  const originDepMinutes = toMinutes(seq[0].departure_time);
  // seq[last] a trip VALÓDI végállomása (nem az app-modellezett szakasz vége) -- extra infóként
  // hasznos a UI-ban ("ez a busz valójában hova tart"), ld. route-card.jsx SchoolRouteCard.
  const terminusStopName = stopById.get(seq[seq.length - 1].stop_id)?.stop_name || null;
  g.trips.push({ serviceId: trip.service_id, desc: cal ? cal.service_desc : '(unknown)', buckets, stopTimes: stMap, originStopName, originDepMinutes, terminusStopName, seqStopIds });
}

// A megálló-sorrendet NEM szabad a nyers `stop_sequence` trip-ek közötti összehasonlításával
// építeni — az csak EGY trip-en belül értelmezhető megbízhatóan. Egy rövidebb, félúttól induló
// trip saját, alacsony sorszámozása (pl. "2." az ottani első megállójára) félrevezető, ha egy
// hosszabb, teljes trip-hez képest hasonlítjuk (ahol ugyanaz a megálló ténylegesen később van).
// Ezért a legtöbb megállót érintő ("leghosszabb") trip sorrendjét vesszük referenciának, és a
// többi trip csak abban NEM szereplő megállóit illesztjük be, a saját (rövidebb trip-beli)
// szomszédjuk alapján.
function buildOrderedStopIds(g) {
  let reference = g.trips[0];
  for (const t of g.trips) if (t.seqStopIds.length > reference.seqStopIds.length) reference = t;
  const ordered = [...reference.seqStopIds];
  const seen = new Set(ordered);
  for (const t of g.trips) {
    for (let i = 0; i < t.seqStopIds.length; i++) {
      const sid = t.seqStopIds[i];
      if (seen.has(sid)) continue;
      let insertAfter = -1;
      for (let j = i - 1; j >= 0; j--) {
        const idx = ordered.indexOf(t.seqStopIds[j]);
        if (idx >= 0) { insertAfter = idx; break; }
      }
      ordered.splice(insertAfter + 1, 0, sid);
      seen.add(sid);
    }
  }
  return ordered;
}

const out = [];
for (const g of groups.values()) {
  const orderedStopIds = buildOrderedStopIds(g);
  out.push({
    id: g.id,
    direction_id: g.direction_id,
    headsign: g.headsign,
    stops: orderedStopIds.map(sid => ({ stop_id: sid, name: stopById.get(sid)?.stop_name || '(?)' })),
    trips: g.trips.map(t => ({
      serviceId: t.serviceId, desc: t.desc, buckets: t.buckets,
      deps: orderedStopIds.map(sid => t.stopTimes.has(sid) ? t.stopTimes.get(sid) : null),
      originStopName: t.originStopName,
      originDepMinutes: t.originDepMinutes,
      terminusStopName: t.terminusStopName,
      seqStopIds: t.seqStopIds, // a trip SAJÁT valódi GTFS-sorrendje (nem a csoport-szintű kanonikus) — kell annak eldöntéséhez, hogy egy adott (app-kurált) végmegálló után a trip a valóságban folytatódik-e
    })),
  });
}

fs.writeFileSync(path.join(__dirname, 'intercity-extracted.json'), JSON.stringify(out, null, 2));
console.log('Groups:', out.length);
for (const g of out) {
  console.log('---', g.id, g.direction_id, '|', g.headsign, '| stops:', g.stops.length, '| trips:', g.trips.length);
}
