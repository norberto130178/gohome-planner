const fs = require('fs');

function parseCsv(path) {
  const raw = fs.readFileSync(path, 'utf8').replace(/^﻿/, '');
  const lines = raw.split(/\r?\n/);
  const rows = [];
  let header = null;
  for (const line of lines) {
    if (line.length === 0) continue;
    const fields = splitCsvLine(line);
    if (!header) {
      header = fields;
      continue;
    }
    const obj = {};
    for (let i = 0; i < header.length; i++) obj[header[i]] = fields[i] ?? '';
    rows.push(obj);
  }
  return rows;
}

function splitCsvLine(line) {
  const out = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQuotes) {
      if (c === '"') {
        if (line[i + 1] === '"') { cur += '"'; i++; }
        else inQuotes = false;
      } else cur += c;
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ',') { out.push(cur); cur = ''; }
      else cur += c;
    }
  }
  out.push(cur);
  return out;
}

module.exports = { parseCsv };
