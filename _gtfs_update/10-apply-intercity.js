const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const filePath = path.join(ROOT, 'intercity-data.js');
const raw = fs.readFileSync(filePath, 'utf8');

const startIdx = raw.indexOf('[');
const endIdx = raw.lastIndexOf('];');
const header = raw.slice(0, startIdx);
const jsonPart = raw.slice(startIdx, endIdx + 1);
const buses = JSON.parse(jsonPart);

const regenerated = JSON.parse(fs.readFileSync(path.join(__dirname, 'intercity-regenerated.json'), 'utf8'));
const byKey = new Map(regenerated.filter(r => !r.skipped).map(r => [r.id + '||' + r.dir, r]));

let applied = 0;
for (const bus of buses) {
  const key = bus.id + '||' + bus.dir;
  const r = byKey.get(key);
  if (!r) continue;
  bus.trips = r.newTrips;
  applied++;
}
console.log('Frissített (route,dir) csoportok:', applied, '/', buses.length);

const newHeader = header
  .replace(/\/\/ Forrás:.*\n/, '// Forrás: gtfs.menetbrand.com/download/volanbusz/ (VOLÁNBUSZ hivatalos GTFS-tükör)\n')
  .replace(/\/\/ Frissítés:.*\n/, '// Frissítés: _gtfs_update/ scriptek (09-regenerate-intercity.js + 10-apply-intercity.js)\n')
  .replace(/\/\/ Generálva:.*\n/, `// Generálva: ${new Date().toISOString().slice(0, 10)}\n`);

const newJson = JSON.stringify(buses, null, 2);
fs.writeFileSync(filePath, newHeader + newJson + ';\n');
console.log('Kiírva:', filePath);
