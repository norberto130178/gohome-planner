// Ideiglenes, kézzel vezérelt patch-script: a felhasználóval együtt, útvonalanként átvizsgálva
// hiányzó (de valóban Nemesvámos belterületi, ténylegesen használt) megállókat ad hozzá a
// meglévő route.stops listákhoz. NEM ad hozzá "bejárati út"/"elágazás" jellegű, senki által nem
// használt csomópontokat, sem szomszédos falvak (Veszprémfajsz) megállóit — ezekről a user
// kifejezetten lemondott a 2026-08-21-i átvizsgálás során.
//
// Idempotens: minden bejegyzés ellenőrzi, hogy az utolsó megálló még a várt (bővítés előtti)
// állapot-e, mielőtt hozzáfűzi az újakat -- ha már meg van csinálva, kihagyja (nem hibázik el).
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const filePath = path.join(ROOT, 'intercity-data.js');
const raw = fs.readFileSync(filePath, 'utf8');
const startIdx = raw.indexOf('[');
const endIdx = raw.lastIndexOf('];');
const header = raw.slice(0, startIdx);
const buses = JSON.parse(raw.slice(startIdx, endIdx + 1));

const ABC_1 = { name: 'Nemesvámos, ABC', lat: 47.054271, lon: 17.873443, spId: 'VOLAN_hkir_557856_1', citySpId: null, platformCode: '' };
const FORDULO_1 = { name: 'Nemesvámos, autóbusz-forduló', lat: 47.050992, lon: 17.876490, spId: 'VOLAN_hkir_557862_1', citySpId: null, platformCode: '' };
const FORDULO_2 = { name: 'Nemesvámos, autóbusz-forduló', lat: 47.051129, lon: 17.876599, spId: 'VOLAN_hkir_557862_2', citySpId: null, platformCode: '' };

// 7361/iskola, 7363/iskola: bővítés ABC + autóbusz-forduló megállókkal, a váróterem UTÁN
// (valós GTFS: ...váróterem > ABC > forduló, majd a busz elhagyja a falut).
const simpleAdditions = [
  { id: '7361', dir: 'iskola' },
  { id: '7363', dir: 'iskola' },
];

for (const { id, dir } of simpleAdditions) {
  const r = buses.find(b => b.id === id && b.dir === dir);
  if (!r) throw new Error(id + '/' + dir + ' nem talalhato');
  const lastName = r.stops[r.stops.length - 1].name;
  if (lastName === 'Nemesvámos, autóbusz-forduló') {
    console.log(id + '/' + dir + ': mar bovitve, kihagyva.');
    continue;
  }
  if (lastName !== 'Nemesvámos, autóbusz-váróterem') {
    throw new Error(id + '/' + dir + ' varatlan utolso megallo: ' + lastName + ' -- megszakitva, nehogy rossz helyre szurjon be');
  }
  r.stops.push(ABC_1, FORDULO_1);
  console.log(id + '/' + dir + ' uj hossz:', r.stops.length, '-> utolso 3:', r.stops.slice(-3).map(s => s.name));
}

// 7366/iskola: a valós GTFS-ben a váróterem UTÁN a busz még bejárja a hurkot (ABC > forduló >
// ABC > váróterem-3), majd Nagyvázsony fele folytatja -- NEM tér vissza VP fele. Mivel a hurok
// visszafele fele (2. ABC + 3. váróterem) senkinek nem hasznos leszallasi/felszallasi pont
// (aki hazafele akar menni, mar az elso váróteremnel leszallhatott volna), a user döntése alapján
// itt is a fordulonál vágjuk el a rögzítést, egységesen a 7361/7363 mintájával.
{
  const r = buses.find(b => b.id === '7366' && b.dir === 'iskola');
  if (!r) throw new Error('7366/iskola nem talalhato');
  const lastName = r.stops[r.stops.length - 1].name;
  const lastSpId = r.stops[r.stops.length - 1].spId;
  if (lastSpId === 'VOLAN_hkir_557862_2') {
    console.log('7366/iskola: mar bovitve, kihagyva.');
  } else if (lastName !== 'Nemesvámos, autóbusz-váróterem') {
    throw new Error('7366/iskola varatlan utolso megallo: ' + lastName + ' -- megszakitva, nehogy rossz helyre szurjon be');
  } else {
    r.stops.push(ABC_1, FORDULO_2);
    console.log('7366/iskola uj hossz:', r.stops.length, '-> utolso 2:', r.stops.slice(-2).map(s => s.name + '/' + s.spId));
  }
}

const newJson = JSON.stringify(buses, null, 2);
fs.writeFileSync(filePath, header + newJson + ';\n');
console.log('Kiirva:', filePath);
