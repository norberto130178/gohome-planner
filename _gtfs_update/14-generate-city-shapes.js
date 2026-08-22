// Újragenerálja a city-shapes.js-t a _gtfs_update/veszprem/ GTFS-snapshotból
// (shapes.txt + trips.txt + routes.txt) — UGYANABBÓL a forrásból, amit a
// 03-extract-veszprem.js is használ a city-data.js menetrendjéhez, hogy a
// shape_id-k a két fájl közt garantáltan egyezzenek (ne legyen snapshot-eltérés).
//
// Leváltja a régi, külön _tmp_geocoding/ snapshotot használó
// _temp/generate-city-shapes.js-t (az megmarad történeti referenciának).
//
// Futtatás: node 14-generate-city-shapes.js (a _gtfs_update/ mappából)
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { parseCsv } = require('./lib/csv');

const DIR = path.join(__dirname, 'veszprem');
const ROOT = path.join(__dirname, '..');

// A WANTED lista a city-data.js-ből származik (NEM kézzel karbantartott
// tömb), hogy sose maradjon le róla új busz, ha az app bővül -- egy korábbi
// kézi lista (_temp/generate-city-shapes.js) pl. lemaradt a 23U/24-ről.
const cityDataCtx = { window: {} };
vm.createContext(cityDataCtx);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'city-data.js'), 'utf8'), cityDataCtx);
const WANTED = [...new Set(cityDataCtx.window.CITY_BUSES_FULL.map(b => b.id))];

console.log('Beolvasás...');
const routes = parseCsv(path.join(DIR, 'routes.txt'));
const trips = parseCsv(path.join(DIR, 'trips.txt'));
const shapePts = parseCsv(path.join(DIR, 'shapes.txt'));

// route_id → short_name
const routeMap = {};
routes.forEach(r => routeMap[r.route_id] = r.route_short_name);

// shape_id → [{seq, lat, lon}] (rendezve sequence szerint)
console.log('Shape koordináták feldolgozása...');
const shapeCoords = {};
for (const pt of shapePts) {
  const id = pt.shape_id;
  if (!shapeCoords[id]) shapeCoords[id] = [];
  shapeCoords[id].push({
    seq: parseInt(pt.shape_pt_sequence),
    lat: parseFloat(pt.shape_pt_lat),
    lon: parseFloat(pt.shape_pt_lon),
  });
}
for (const id of Object.keys(shapeCoords)) {
  shapeCoords[id].sort((a, b) => a.seq - b.seq);
}

// Buszokhoz: egyedi shape_id-k direction+headsign metaadattal
console.log('Trip→shape mapping...');
const busShapeMeta = {}; // busId → { shape_id → { dir, headsign, shape_id } }
for (const t of trips) {
  const bus = routeMap[t.route_id];
  if (!bus || !WANTED.includes(bus)) continue;
  if (!t.shape_id) continue;
  if (!busShapeMeta[bus]) busShapeMeta[bus] = {};
  if (!busShapeMeta[bus][t.shape_id]) {
    busShapeMeta[bus][t.shape_id] = {
      dir: parseInt(t.direction_id),
      headsign: t.trip_headsign,
      shape_id: t.shape_id,
    };
  }
}

// Összerakás
console.log('Generálás...');
const result = {};
for (const bus of WANTED) {
  const meta = busShapeMeta[bus];
  if (!meta) { console.warn('  HIÁNYZIK:', bus); continue; }
  result[bus] = Object.values(meta).map(m => ({
    coords: (shapeCoords[m.shape_id] || []).map(p => [p.lat, p.lon]),
    dir: m.dir,
    headsign: m.headsign,
    shape_id: m.shape_id,
  })).filter(e => e.coords.length > 0);
  console.log(' ', bus, '→', result[bus].length, 'shape');
}

const header = `// AUTO-GENERÁLT — _gtfs_update/14-generate-city-shapes.js
// Forrás: _gtfs_update/veszprem/ (shapes.txt + trips.txt + routes.txt) —
// UGYANAZ a snapshot, mint amit a 03-extract-veszprem.js is használ a
// city-data.js menetrendjéhez, hogy a shape_id-k garantáltan egyezzenek.
// Struktúra: CITY_SHAPES[busId] = [{ coords:[[lat,lon],...], dir:0|1, headsign:"...", shape_id:"..." }, ...]

`;

const body = `window.CITY_SHAPES=${JSON.stringify(result)};\n`;

fs.writeFileSync(path.join(ROOT, 'city-shapes.js'), header + body);
console.log('Kész →', path.join(ROOT, 'city-shapes.js'));
