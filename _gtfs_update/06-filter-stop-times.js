// Streams the 100MB national stop_times.txt and keeps only rows for our 231
// filtered intercity trip_ids. Avoids loading the whole file into memory at once.
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const DIR = path.join(__dirname, 'volanbusz');
const trips = JSON.parse(fs.readFileSync(path.join(__dirname, 'intercity-filtered-trips.json'), 'utf8'));
const wantedTripIds = new Set(trips.map(t => t.trip_id));
console.log('Wanted trip_ids:', wantedTripIds.size);

async function main() {
  const rl = readline.createInterface({
    input: fs.createReadStream(path.join(DIR, 'stop_times.txt')),
    crlfDelay: Infinity,
  });

  let header = null;
  let idx = null;
  const kept = [];
  let lineNo = 0;

  for await (const line of rl) {
    lineNo++;
    if (!header) {
      header = line.split(',').map(h => h.replace(/"/g, ''));
      idx = Object.fromEntries(header.map((h, i) => [h, i]));
      continue;
    }
    if (!line) continue;
    // trip_id is the first field and unquoted-simple in this feed; fast substring check before full split.
    const firstComma = line.indexOf(',');
    const tripId = line.slice(0, firstComma).replace(/^"|"$/g, '');
    if (!wantedTripIds.has(tripId)) continue;
    const fields = line.split(',').map(f => f.replace(/^"|"$/g, ''));
    kept.push({
      trip_id: tripId,
      arrival_time: fields[idx.arrival_time],
      departure_time: fields[idx.departure_time],
      stop_id: fields[idx.stop_id],
      stop_sequence: +fields[idx.stop_sequence],
    });
  }

  console.log('Scanned lines:', lineNo, '| kept rows:', kept.length);
  fs.writeFileSync(path.join(__dirname, 'intercity-filtered-stop-times.json'), JSON.stringify(kept));
}

main();
