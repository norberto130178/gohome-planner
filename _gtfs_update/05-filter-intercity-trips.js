// Filters the national VOLÁNBUSZ GTFS down to the routes relevant to this project's
// Nemesvámos <-> Veszprém corridor, and dumps distinct service_id day-type descriptions.
const fs = require('fs');
const path = require('path');
const { parseCsv } = require('./lib/csv');

const DIR = path.join(__dirname, 'volanbusz');
const WANTED_LINES = ['1625', '7360', '7361', '7363', '7364', '7366', '7367', '7370', '7376'];

const routes = parseCsv(path.join(DIR, 'routes.txt'));
const wantedRouteIds = new Set(routes.filter(r => WANTED_LINES.includes(r.route_short_name)).map(r => r.route_id));
console.log('Matched route_ids:', wantedRouteIds.size);

const trips = parseCsv(path.join(DIR, 'trips.txt'));
const filteredTrips = trips.filter(t => wantedRouteIds.has(t.route_id));
console.log('Filtered trips:', filteredTrips.length, '/', trips.length);

fs.writeFileSync(path.join(__dirname, 'intercity-filtered-trips.json'), JSON.stringify(filteredTrips));

const serviceIds = new Set(filteredTrips.map(t => t.service_id));
console.log('Distinct service_ids used:', serviceIds.size);

const calendar = parseCsv(path.join(DIR, 'calendar.txt'));
const calById = new Map(calendar.map(c => [c.service_id, c]));

for (const sid of [...serviceIds].sort()) {
  const c = calById.get(sid);
  console.log(sid, '|', c ? c.service_desc : '(no calendar.txt row)', '|', c ? `${c.start_date}-${c.end_date}` : '');
}
