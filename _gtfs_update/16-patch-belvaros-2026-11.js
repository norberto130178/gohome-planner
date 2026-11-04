// Kézi, egyszeri patch: belvárosi megálló-átszervezés a 2026-11-01-től érvényes városi
// GTFS-ben (feed_version 20261030-1). A Petőfi Színháznál építkezés van (a user szerint
// kb. 1 évig), ezért az Iskola utca (SP1824), a Megyeház tér (SP1664) és a régi
// Petőfi Színház (SP1670) megállót egy járat sem érinti; helyettük az új
// "Megyeház tér (Petőfi Színház)" (SP2185) és a meglévő Petőfi Színház (SP1630) van.
// Ezen felül: 8A a Megyeház tér (Petőfi Színház)-ig rövidült, 16 (hétvége) Csererdőig
// hosszabbodott, 4A a Vámosi úti fordulónál SP1674 helyett SP1857-et, 15A a Kádártai
// úti fordulónál SP1675 helyett SP1882-t használ.
//
// Új megállók offsetje az app (kézi kurált) offset-skáláján interpolálva a két
// szomszédos, változatlan megálló között, a GTFS-beli arányok alapján.
//
// Az építkezés végén (régi stop_id-k visszatérnek a GTFS-ben) a visszaálláshoz a
// régi snapshot: veszprem_old_20260816/ — ld. README.
//
// Futtatás: node _gtfs_update/16-patch-belvaros-2026-11.js  (nem idempotens: ha egy
// irány már patchelve van, hibát dob és nem ír semmit)
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'city-data.js');

const MEGYEHAZ_PSZ = (offset) => ({ name: 'Megyeház tér (Petőfi Színház)', offset, lat: 47.091208, lon: 17.907847, spId: 'VBUSZ_SP2185' });
const PETOFI_1630 = (offset) => ({ name: 'Petőfi Színház', offset, lat: 47.091736, lon: 17.905477, spId: 'VBUSZ_SP1630' });
const VAMOSI_1857 = (offset) => ({ name: 'Vámosi úti forduló', offset, lat: 47.082936, lon: 17.897871, spId: 'VBUSZ_SP1857' });
const CSERERDO_1635 = (offset) => ({ name: 'Csererdő', offset, lat: 47.115033, lon: 17.870271, spId: 'VBUSZ_SP1635' });
const BAKONY_1633 = (offset) => ({ name: 'Bakony Művek', offset, lat: 47.114921, lon: 17.878502, spId: 'VBUSZ_SP1633' });

// Műveletek: replace(spId, [új megállók]) — a régi megálló helyére (0..n darab) új;
// shift(fromSpId, toSpId, delta) — offset-eltolás egy (bezárt) szakaszon;
// prepend/append([megállók]); rename(új irány-név).
const PATCHES = [
  { id: '1', dir: 'Valeo, főporta ▸ Jutasi út / Barátság park - Veszprém vasútállomás felé', ops: [['replace', 'SP1670', [MEGYEHAZ_PSZ(8)]]] },
  { id: '2', dir: 'Endrődi Sándor lakótelep ▸ Veszprém vasútállomás felé', ops: [['replace', 'SP1670', [MEGYEHAZ_PSZ(4)]]] },
  { id: '3', dir: 'Csererdő ▸ Haszkovó forduló felé', ops: [['replace', 'SP1670', [MEGYEHAZ_PSZ(11)]]] },
  { id: '4', dir: 'Jutaspuszta ▸ Vámosi úti forduló felé', ops: [['replace', 'SP1664', [PETOFI_1630(19)]]] },
  { id: '4', dir: 'Vámosi úti forduló ▸ Jutaspuszta felé', ops: [['replace', 'SP1630', [MEGYEHAZ_PSZ(9)]]] },
  { id: '4A', dir: 'Veszprém vasútállomás ▸ Vámosi úti forduló felé', ops: [['replace', 'SP1664', [PETOFI_1630(9)]], ['replace', 'SP1674', [VAMOSI_1857(18)]]] },
  { id: '4A', dir: 'Vámosi úti forduló ▸ Veszprém vasútállomás felé', ops: [['replace', 'SP1670', [MEGYEHAZ_PSZ(8)]]] },
  { id: '5', dir: 'Veszprém vasútállomás ▸ Kádártai úti forduló felé', ops: [['replace', 'SP1670', [MEGYEHAZ_PSZ(13)]]] },
  { id: '6', dir: 'Haszkovó forduló ▸ Vámosi úti forduló felé', ops: [['replace', 'SP1664', [PETOFI_1630(16)]]] },
  { id: '6', dir: 'Vámosi úti forduló ▸ Haszkovó forduló felé', ops: [['replace', 'SP1670', [MEGYEHAZ_PSZ(7)]]] },
  { id: '8', dir: 'Haszkovó forduló ▸ Csererdő felé', ops: [['replace', 'SP1824', [MEGYEHAZ_PSZ(14), PETOFI_1630(14)]]] },
  // A GTFS szerint ebben az irányban a Harmat utca és a Komakút tér között nincs megálló;
  // a Valeo..Harmat utca szakasz 1 perccel később van Csererdőhöz képest, mint eddig.
  { id: '8', dir: 'Csererdő ▸ Haszkovó forduló felé', ops: [['replace', 'SP1670', []], ['replace', 'SP1664', []], ['shift', 'SP1871', 'SP1737', 1]] },
  { id: '8A', dir: 'Haszkovó forduló ▸ Iskola utca felé', ops: [['replace', 'SP1824', [MEGYEHAZ_PSZ(14)]], ['rename', 'Haszkovó forduló ▸ Megyeház tér (Petőfi Színház) felé']] },
  { id: '8A', dir: 'Iskola utca ▸ Haszkovó forduló felé', ops: [['replace', 'SP1824', [MEGYEHAZ_PSZ(0)]], ['replace', 'SP1670', [PETOFI_1630(1)]], ['replace', 'SP1664', []], ['rename', 'Megyeház tér (Petőfi Színház) ▸ Haszkovó forduló felé']] },
  { id: '8Y', dir: 'Csererdő ▸ Haszkovó forduló felé', ops: [['replace', 'SP1670', []], ['replace', 'SP1664', []]] },
  { id: '15', dir: 'Haszkovó forduló ▸ Kádártai úti forduló felé', ops: [['replace', 'SP1670', [MEGYEHAZ_PSZ(15)]]] },
  { id: '15A', dir: 'Haszkovó forduló ▸ Kádártai úti forduló felé (15A)', ops: [['replace', 'SP1670', [MEGYEHAZ_PSZ(22)]], ['replace', 'SP1675', [{ name: 'Kádártai úti forduló', offset: 38, lat: 47.103334, lon: 17.929956, spId: 'VBUSZ_SP1882' }]]] },
  { id: '16', dir: 'Vámosi úti forduló ▸ Bakony Művek felé', ops: [['replace', 'SP1630', [MEGYEHAZ_PSZ(6)]], ['append', [CSERERDO_1635(28)]], ['rename', 'Vámosi úti forduló ▸ Csererdő felé']] },
  // Csererdőről indul (eddig Bakony Művekről, másik platformról); minden régi offset +1.
  { id: '16', dir: 'Bakony Művek ▸ Vámosi úti forduló felé', ops: [['shift', 'SP1750', 'SP1857', 1], ['replace', 'SP1750', [BAKONY_1633(1)]], ['replace', 'SP1664', [PETOFI_1630(23)]], ['prepend', [CSERERDO_1635(0)]], ['rename', 'Csererdő ▸ Vámosi úti forduló felé']] },
  { id: '28', dir: 'Vámosi úti forduló ▸ Csererdő felé', ops: [['replace', 'SP1824', [MEGYEHAZ_PSZ(5), PETOFI_1630(5)]]] },
  { id: '28', dir: 'Csererdő ▸ Vámosi úti forduló felé', ops: [['replace', 'SP1670', []], ['replace', 'SP1664', []]] },
  { id: '42', dir: 'Hotel ▸ körjárat (egyetem negyeden át)', ops: [['replace', 'SP1824', [MEGYEHAZ_PSZ(23)]], ['replace', 'SP1670', []]] },
  { id: '43', dir: 'Veszprém autóbusz-állomás ▸ Juhar utca felé', ops: [['replace', 'SP1664', [PETOFI_1630(3)]], ['replace', 'SP1824', [MEGYEHAZ_PSZ(14), PETOFI_1630(14)]]] },
];

const fmt = (s) => `    { name: "${s.name}", offset: ${s.offset}, lat: ${s.lat}, lon: ${s.lon}, spId: "${s.spId}" },`;
const STOP_RE = /^\s+\{ name: "([^"]+)", offset: (-?\d+), lat: ([0-9.]+), lon: ([0-9.]+), spId: "([^"]+)" \},$/;

const raw = fs.readFileSync(FILE, 'utf8');
const EOL = raw.includes('\r\n') ? '\r\n' : '\n';
let lines = raw.split(EOL);

for (const p of PATCHES) {
  // A blokk: `  id: "X",` ... `  direction: "...",` ... `  stops: [` ... `  ],`
  const dirIdx = lines.findIndex((l, i) => l === `  direction: "${p.dir}",` &&
    lines.slice(Math.max(0, i - 5), i).some(x => x === `  id: "${p.id}",`));
  if (dirIdx < 0) throw new Error(`Nem található: ${p.id} | ${p.dir}`);
  const start = lines.indexOf('  stops: [', dirIdx) + 1;
  const end = lines.indexOf('  ],', start);
  let stops = lines.slice(start, end).map(l => {
    const m = l.match(STOP_RE);
    if (!m) throw new Error(`Váratlan sor (${p.id} | ${p.dir}): ${l}`);
    return { name: m[1], offset: +m[2], lat: m[3], lon: m[4], spId: m[5] };
  });
  const findIdx = (sp) => {
    const hits = stops.map((s, i) => s.spId === 'VBUSZ_' + sp ? i : -1).filter(i => i >= 0);
    if (hits.length !== 1) throw new Error(`${p.id} | ${p.dir}: ${sp} előfordulásai: ${hits.length}`);
    return hits[0];
  };
  let newDir = null;
  for (const [op, a, b, c] of p.ops) {
    if (op === 'replace') { const i = findIdx(a); stops.splice(i, 1, ...b); }
    else if (op === 'shift') { const i = findIdx(a), j = findIdx(b); for (let k = i; k <= j; k++) stops[k] = { ...stops[k], offset: stops[k].offset + c }; }
    else if (op === 'prepend') stops = [...a, ...stops];
    else if (op === 'append') stops = [...stops, ...a];
    else if (op === 'rename') newDir = a;
    else throw new Error('Ismeretlen művelet: ' + op);
  }
  lines.splice(start, end - start, ...stops.map(fmt));
  if (newDir) lines[dirIdx] = `  direction: "${newDir}",`;
  console.log('OK', p.id, '|', p.dir, newDir ? `→ ${newDir}` : '');
}

fs.writeFileSync(FILE, lines.join(EOL));
console.log('Kész:', PATCHES.length, 'irány patchelve.');
