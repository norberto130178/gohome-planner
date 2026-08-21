// Per-date active trip counts for the Veszprém local GTFS feed.
// Goal: find the empirical cutoff date where the school-term (workday) schedule
// switches to the summer-break (schoolholiday) schedule.
const path = require('path');
const { parseCsv } = require('./lib/csv');

const DIR = path.join(__dirname, 'veszprem');

const calDates = parseCsv(path.join(DIR, 'calendar_dates.txt'));

// service_id -> Set(dates) considering exception_type 1=added, 2=removed
const serviceDates = new Map();
for (const row of calDates) {
  const sid = row.service_id;
  if (!serviceDates.has(sid)) serviceDates.set(sid, new Set());
  const set = serviceDates.get(sid);
  if (row.exception_type === '1') set.add(row.date);
  else if (row.exception_type === '2') set.delete(row.date);
}

const trips = parseCsv(path.join(DIR, 'trips.txt'));

// date -> trip count, split weekday vs weekend
const dateCounts = new Map();
for (const trip of trips) {
  const dates = serviceDates.get(trip.service_id);
  if (!dates) continue;
  for (const d of dates) {
    dateCounts.set(d, (dateCounts.get(d) || 0) + 1);
  }
}

function dow(dateStr) {
  const y = +dateStr.slice(0, 4), m = +dateStr.slice(4, 6) - 1, d = +dateStr.slice(6, 8);
  return new Date(Date.UTC(y, m, d)).getUTCDay(); // 0=Sun..6=Sat
}

const sorted = [...dateCounts.keys()].sort();
for (const d of sorted) {
  const w = dow(d);
  const label = w === 0 ? 'Vas' : w === 6 ? 'Szo' : 'Hét';
  console.log(d, label, dateCounts.get(d));
}
