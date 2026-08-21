// Group dates by the exact set of active service_ids (day-type signature),
// so we bucket dates by ACTUAL service pattern, not just weekday/weekend guesswork.
const path = require('path');
const crypto = require('crypto');
const { parseCsv } = require('./lib/csv');

const DIR = path.join(__dirname, 'veszprem');
const calDates = parseCsv(path.join(DIR, 'calendar_dates.txt'));

const serviceDates = new Map();
for (const row of calDates) {
  const sid = row.service_id;
  if (!serviceDates.has(sid)) serviceDates.set(sid, new Set());
  const set = serviceDates.get(sid);
  if (row.exception_type === '1') set.add(row.date);
  else if (row.exception_type === '2') set.delete(row.date);
}

const dateServices = new Map(); // date -> Set(service_id)
for (const [sid, dates] of serviceDates) {
  for (const d of dates) {
    if (!dateServices.has(d)) dateServices.set(d, new Set());
    dateServices.get(d).add(sid);
  }
}

function dow(dateStr) {
  const y = +dateStr.slice(0, 4), m = +dateStr.slice(4, 6) - 1, d = +dateStr.slice(6, 8);
  return new Date(Date.UTC(y, m, d)).getUTCDay();
}
function sig(set) {
  return crypto.createHash('md5').update([...set].sort().join(',')).digest('hex').slice(0, 8);
}

const sigGroups = new Map(); // sig -> {dates:[], count}
const dateSig = new Map();
for (const [d, services] of dateServices) {
  const s = sig(services);
  dateSig.set(d, s);
  if (!sigGroups.has(s)) sigGroups.set(s, { dates: [], count: services.size });
  sigGroups.get(s).dates.push(d);
}

const sorted = [...sigGroups.entries()].sort((a, b) => b[1].dates.length - a[1].dates.length);
console.log('Distinct day-signatures:', sorted.length);
for (const [s, info] of sorted) {
  info.dates.sort();
  const doWs = info.dates.map(dow);
  const allWeekday = doWs.every(w => w !== 0 && w !== 6);
  const allWeekend = doWs.every(w => w === 0 || w === 6);
  console.log(`${s} | services=${info.count} | days=${info.dates.length} | ${allWeekday ? 'WEEKDAY' : allWeekend ? 'WEEKEND' : 'MIXED'} | first=${info.dates[0]} last=${info.dates[info.dates.length - 1]} | e.g. ${info.dates.slice(0, 3).join(',')}`);
}

module.exports = { dateSig, sigGroups, dow };
