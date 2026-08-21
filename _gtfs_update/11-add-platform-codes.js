// Hozzáadja a `platformCode` mezőt intercity-data.js minden megállójához, a nyers
// GTFS stops.txt `platform_code` oszlopából (spId -> "VOLAN_" prefix nélküli GTFS stop_id).
// A `stops` lista maga kurált/kézi adat, a 07/09/10 pipeline nem érinti — ezért ez a
// script közvetlenül az intercity-data.js-t olvassa és írja vissza, a 10-es minta szerint.
const fs = require('fs');
const path = require('path');
const { parseCsv } = require('./lib/csv');

const ROOT = path.join(__dirname, '..');
const filePath = path.join(ROOT, 'intercity-data.js');
const raw = fs.readFileSync(filePath, 'utf8');

const startIdx = raw.indexOf('[');
const endIdx = raw.lastIndexOf('];');
const header = raw.slice(0, startIdx);
const jsonPart = raw.slice(startIdx, endIdx + 1);
const buses = JSON.parse(jsonPart);

const stops = parseCsv(path.join(__dirname, 'volanbusz', 'stops.txt'));
const platformByStopId = new Map(stops.map(s => [s.stop_id, s.platform_code || '']));

let updated = 0, missing = 0;
for (const bus of buses) {
  for (const s of bus.stops) {
    const gtfsId = s.spId.replace(/^VOLAN_/, '');
    if (platformByStopId.has(gtfsId)) {
      s.platformCode = platformByStopId.get(gtfsId);
      updated++;
    } else {
      s.platformCode = '';
      missing++;
    }
  }
}
console.log('Frissitett megallo-elofordulasok:', updated, '| nem talalt spId:', missing);

const newJson = JSON.stringify(buses, null, 2);
fs.writeFileSync(filePath, header + newJson + ';\n');
console.log('Kiirva:', filePath);
