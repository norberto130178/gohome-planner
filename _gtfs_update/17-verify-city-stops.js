// Ellenőrzés: a city-data.js minden irányának megállósora (peron-ID / spId szinten)
// egyezik-e a városi GTFS legjobban illeszkedő menetváltozatával, és a megállónevek
// egyeznek-e a GTFS stops.txt-vel.
//
// Miért kell: a menetrend-ablak a megállókat a GTFS shape-re szűri (stopsOnShape),
// ezért egy rossz megállósor (pl. a PDF-ből örökölt Dugovics-kerülő a 16/28/43-on)
// vagy rossz oldali peron (pl. Tölgyfa utca 01 helyett 02) a felületen NEM látszik,
// csak a tervezőben / megálló-nézőben okoz hibát. 2026-11-04-én ez a script találta
// meg a 9 irányt érintő peron-felcserélést.
//
// Módszer: minden app-irányhoz a vonal GTFS-menetváltozatai közül az, amelyikkel a
// legtöbb közös spId-je van (holtversenynél a több menetet számláló). Csak az app
// első..utolsó megállója közötti GTFS-szakaszt hasonlítjuk (a rövidebb app-modell
// nem hiba). Más peron-ID = más megálló, akkor is, ha pár méterre van -- itt nincs
// név- vagy közelség-alapú egyeztetés.
//
// Futtatás: node _gtfs_update/17-verify-city-stops.js [gtfs-mappa]
//   (alapértelmezés: _gtfs_update/veszprem). Kilépési kód 1, ha van eltérés.
const fs = require('fs');
const path = require('path');

const GTFS_DIR = process.argv[2] || path.join(__dirname, 'veszprem');
const CITY_DATA = path.join(__dirname, '..', 'city-data.js');

function readCsv(file) {
  const lines = fs.readFileSync(path.join(GTFS_DIR, file), 'utf8').trim().split(/\r?\n/);
  const header = lines[0].split(',');
  return lines.slice(1).map(line => {
    const vals = line.match(/("([^"]*)"|[^,]*)(,|$)/g).map(x => x.replace(/,$/, '').replace(/^"|"$/g, ''));
    const o = {};
    header.forEach((k, i) => { o[k] = vals[i]; });
    return o;
  });
}

global.window = {};
require(CITY_DATA);

const stops = {};
for (const s of readCsv('stops.txt')) stops[s.stop_id] = s;
const routeName = {};
for (const r of readCsv('routes.txt')) routeName[r.route_id] = r.route_short_name;
const stopTimes = {};
for (const st of readCsv('stop_times.txt')) (stopTimes[st.trip_id] = stopTimes[st.trip_id] || []).push(st);

// Vonalanként a különböző megállósorok és a menetszámuk
const patternCount = {};
for (const t of readCsv('trips.txt')) {
  const seq = stopTimes[t.trip_id].sort((a, b) => a.stop_sequence - b.stop_sequence).map(x => x.stop_id);
  const key = routeName[t.route_id] + '|' + seq.join(',');
  patternCount[key] = (patternCount[key] || 0) + 1;
}
const patternsByLine = {};
for (const [key, n] of Object.entries(patternCount)) {
  const [line, seq] = key.split('|');
  (patternsByLine[line] = patternsByLine[line] || []).push({ seq: seq.split(','), n });
}

let problems = 0;
const nameIssues = new Map();
for (const bus of window.CITY_BUSES_FULL) {
  const app = bus.stops.map(s => s.spId.replace(/^VBUSZ_/, ''));
  for (const s of bus.stops) {
    const g = stops[s.spId.replace(/^VBUSZ_/, '')];
    if (!g) nameIssues.set(s.spId, `NINCS A GTFS-BEN: "${s.name}"`);
    else if (g.stop_name.trim() !== s.name) nameIssues.set(s.spId, `"${s.name}" → GTFS: "${g.stop_name.trim()}"`);
  }
  const candidates = patternsByLine[bus.id] || [];
  if (!candidates.length) { console.log(`!! ${bus.id}: nincs ilyen vonal a GTFS-ben`); problems++; continue; }
  let best = null;
  for (const c of candidates) {
    const set = new Set(c.seq);
    const score = app.filter(x => set.has(x)).length * 1000 + c.n - c.seq.length;
    if (!best || score > best.score) best = { ...c, score };
  }
  const gtfsSet = new Set(best.seq), appSet = new Set(app);
  const first = best.seq.indexOf(app.find(x => gtfsSet.has(x)));
  const last = best.seq.lastIndexOf([...app].reverse().find(x => gtfsSet.has(x)));
  const segment = best.seq.slice(first, last + 1);
  const extra = app.filter(x => !gtfsSet.has(x));
  const missing = segment.filter(x => !appSet.has(x));
  if (extra.length || missing.length) {
    problems++;
    const fmt = ids => ids.map(x => `${x} ${stops[x] ? stops[x].stop_name.trim() : '?'}`).join('; ') || '-';
    console.log(`${bus.id} | ${bus.direction}  [GTFS-minta: ${best.n} menet]`);
    console.log(`   app-ban van, GTFS-ben nincs: ${fmt(extra)}`);
    console.log(`   GTFS-ben van, app-ban nincs: ${fmt(missing)}`);
  }
}
for (const [spId, msg] of nameIssues) { console.log(`NÉV: ${spId} ${msg}`); problems++; }

console.log(problems ? `\n${problems} eltérés.` : `\nOK: ${window.CITY_BUSES_FULL.length} irány, nincs eltérés.`);
process.exit(problems ? 1 : 0);
