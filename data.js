// ============================================================
// GoHome Planner — Algoritmusok & segédfüggvények
// ============================================================
// A menetrendi adatok (SCHEDULES) a schedules.js-ben vannak.
// Ez a fájl csak az útvonaltervező logikát tartalmazza.
// ============================================================

// APP_VERSION az index.html-ben van definiálva (ott állítja be a cache bustert is)

// Valós gyalogos útvonal lekérése az OSRM ingyenes demo szerveréről (kulcs nélkül).
// Visszaad egy [lat,lon] koordinátatömböt Leafletnek, vagy null-t ha a lekérés
// sikertelen/időtúllépés (ilyenkor a hívó fél essen vissza légvonalra).
async function _osrmFoot(lat1, lon1, lat2, lon2) {
  try {
    const url = `https://router.project-osrm.org/route/v1/foot/${lon1},${lat1};${lon2},${lat2}?overview=full&geometries=geojson`;
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return null;
    const data = await res.json();
    const route = data?.routes?.[0];
    const coords = route?.geometry?.coordinates;
    if (!coords || coords.length < 2) return null;
    return { distance: route.distance, coords: coords.map(([lon, lat]) => [lat, lon]) };
  } catch (e) {
    return null;
  }
}

// Az OSRM gyalogos útvonala nem mindig szimmetrikus (pl. irányított gyalogút-jelölés
// miatt A→B és B→A eltérő hosszú utat adhat — valós, megfigyelt eset egy veszprémi
// park ösvényénél). Mivel a térképen csak megjelenítjük a vonalat (nem navigálunk),
// mindkét irányt lekérjük párhuzamosan, és a rövidebbet rajzoljuk ki.
window.fetchWalkingRoute = async function (lat1, lon1, lat2, lon2) {
  const [fwd, rev] = await Promise.all([
    _osrmFoot(lat1, lon1, lat2, lon2),
    _osrmFoot(lat2, lon2, lat1, lon1),
  ]);
  if (!fwd && !rev) return null;
  if (!rev || (fwd && fwd.distance <= rev.distance)) return fwd.coords;
  return rev.coords.slice().reverse();
};

// ESC-rétegzés segédje: amikor a megálló-néző modal egy ESC-lenyomásra záródik,
// __escGuardUntil védőidőt állít, hogy ugyanannak a lenyomásnak az ismétlődő
// keydown-jai ne érjék el az alatta lévő rétegeket (fullscreen-kilépés, másik
// modal). A billentyű felengedése azonnal törli a védelmet, így egy szándékos
// következő ESC már normálisan működik.
window.addEventListener('keyup', (e) => {
  if (e.key === 'Escape') window.__escGuardUntil = 0;
});

// Leaflet popup-tartalom egy megállóhoz: név + opcionális időcímke, és ha a megálló
// szerepel a városi hálózatban, egy "Indulások" gomb ami a megálló-nézőt nyitja meg
// (window.__openStopViewer — az aktuális oldal app-ja regisztrálja). DOM elemet ad
// vissza (nem HTML stringet), így a megállónevek escapelése nem probléma.
// `intercityLabel`/`cityLabel`: ha a hívó (pl. egy térképi pont) tudja a konkrét
// platform pontos (irány-specifikus) címkéjét, adja át itt -- egy megálló-NÉV
// (pl. "Nemesvámos, autóbusz-váróterem" vagy városi oldalon "Hotel") ugyanis
// 2-3 külön fizikai platformot is jelenthet, ezt névből egyértelműen nem lehet
// visszafejteni. A kettő kölcsönösen kizárja egymást (egy hívó vagy helyközi,
// vagy helyi kontextusban van).
window.stopPopupContent = function (stopName, timeText, lang, intercityLabel, cityLabel) {
  // lang nélkül hívva az oldal aktuális nyelvét használja (window.currentLang —
  // az app-state.jsx / city-app.jsx regisztrálja a saját localStorage-kulcsával).
  // A hívók `bindPopup(() => ...)` formában, lazy-n hívják, így a popup minden
  // megnyitáskor a friss nyelvvel épül fel.
  if (!lang) lang = (window.currentLang && window.currentLang()) || "hu";
  const t = (window.I18N && window.I18N[lang]) || (window.I18N && window.I18N.hu) || {};
  const wrap = document.createElement('div');
  wrap.style.fontFamily = 'Nunito, sans-serif';
  const title = document.createElement('b');
  title.textContent = stopName;
  wrap.appendChild(title);
  if (timeText) {
    const time = document.createElement('div');
    time.textContent = timeText;
    time.style.cssText = 'font-size:12px;font-weight:700;margin-top:2px;';
    wrap.appendChild(time);
  }
  const isCityStop = !intercityLabel && !cityLabel && (window.CITY_BUSES_FULL || []).some(b => b.stops.some(s => s.name === stopName));
  if (isCityStop || intercityLabel || cityLabel) {
    const btn = document.createElement('button');
    btn.textContent = '🚏 ' + (t.stopViewerDepartures || 'Indulások');
    btn.style.cssText = 'display:block;margin-top:6px;background:#1a2a3a;color:white;border:none;border-radius:8px;padding:4px 10px;font-size:11px;font-weight:800;cursor:pointer;font-family:Nunito,sans-serif;';
    btn.onclick = () => { if (window.__openStopViewer) window.__openStopViewer(intercityLabel || cityLabel || stopName, intercityLabel ? 'intercity' : 'city'); };
    wrap.appendChild(btn);

    // Nyitott popup élő nyelvváltása: a nyelvváltók 'gohome:langchange' eseményt
    // küldenek, erre a gomb felirata helyben frissül. Ha a popup már bezárult
    // (az elem kikerült a DOM-ból), a listener leiratkozik.
    const onLangChange = () => {
      if (!wrap.isConnected) { window.removeEventListener('gohome:langchange', onLangChange); return; }
      const l2 = (window.currentLang && window.currentLang()) || "hu";
      const t2 = (window.I18N && window.I18N[l2]) || (window.I18N && window.I18N.hu) || {};
      btn.textContent = '🚏 ' + (t2.stopViewerDepartures || 'Indulások');
    };
    window.addEventListener('gohome:langchange', onLangChange);
  }
  return wrap;
};

// Helyi buszok amik Csererdőt érintik (hazaút + iskolába tervező)
const HOME_BUS_IDS = ["3", "8", "8Y", "28"];

function _haversineM(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const φ1 = lat1 * Math.PI / 180, φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180, Δλ = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(Δφ/2)**2 + Math.cos(φ1)*Math.cos(φ2)*Math.sin(Δλ/2)**2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
}
window._haversineM = _haversineM;

// Nyári szünet dátumtartomány + "Automatikus / Mindig / Soha" mód kezelése.
// Megosztott a két app között (mindkettő betölti a data.js-t), mert ugyanaz a
// valós iskolai naptár — a mód (auto/on/off) viszont app-onként külön van elmentve,
// mert a kézi felülbírálás apponként eltérő lehet.
window.SchoolHolidayUtil = {
  getRange() {
    return {
      start: localStorage.getItem('schoolholiday.range.start') || '',
      end: localStorage.getItem('schoolholiday.range.end') || '',
    };
  },
  setRange(start, end) {
    if (start) localStorage.setItem('schoolholiday.range.start', start);
    else localStorage.removeItem('schoolholiday.range.start');
    if (end) localStorage.setItem('schoolholiday.range.end', end);
    else localStorage.removeItem('schoolholiday.range.end');
  },
  isInRange(date) {
    const { start, end } = this.getRange();
    if (!start || !end) return false;
    const d = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    return d >= start && d <= end;
  },
  // mode: 'auto' | 'on' | 'off'; date: a tervezéshez használt dátum (pl. `now`, ami a dayOffset-tel már el van tolva)
  resolve(mode, date) {
    if (mode === 'on') return true;
    if (mode === 'off') return false;
    return this.isInRange(date);
  },
};

// Busz megjelenítendő címkéje nyelvfüggően. A city-data.js `label` mezője csak
// magyarul létezik (pl. "1-es busz"); angol módban a tiszta `id`-ra esünk vissza
// ("Bus 1"), mert a magyar sorszám-toldalék ("-es"/"-os"/"-as") nem parse-olható
// megbízhatóan vissza angolra.
window.busLabel = function (bus, t) {
  if (!bus) return "";
  if (t && t._lang === "en") return "Bus " + bus.id;
  return bus.label;
};

// A city-data.js `direction` mezője szabad szöveg ("A ▸ B felé", néha "körjárat" vagy
// "(X-en át)" zárójeles kiegészítéssel) — csak magyarul létezik. Angol módban a
// domináns mintákat ("felé", "körjárat") lecseréljük; a ritka zárójeles útvonal-
// kiegészítők (pl. "(Sportuszodán át)") magyarul maradnak, mert szabad szöveges
// fordításuk megbízhatóan nem automatizálható.
window.busDirection = function (bus, t) {
  if (!bus) return "";
  if (!(t && t._lang === "en")) return bus.direction;
  return (bus.direction || "")
    .replace(/\s*felé\b/g, "")
    .replace(/körjárat/g, "circular route");
};

// GTFS shape segédfüggvény — mindkét nézetben elérhető (index.html + city.html)
window.nearestShapeIdx = function(shape, lat, lon) {
  let best = 0, bestD = Infinity;
  for (let i = 0; i < shape.length; i++) {
    const d = (shape[i][0]-lat)**2 + (shape[i][1]-lon)**2;
    if (d < bestD) { bestD = d; best = i; }
  }
  return best;
};

// ============================================================
// Segédfüggvények
// ============================================================

// Legjobb GTFS shape kiválasztása két koordináta között (ti-fi span alapján)
// Kezeli az új { coords, headsign, dir } formátumot és a régi [[lat,lon]] formátumot is
window.BUS_UTILS = {
  bestShape(shapes, fromLat, fromLon, toLat, toLon) {
    let best = null, bestScore = -Infinity;
    for (const entry of shapes) {
      const s = entry.coords || entry;
      const fi = window.nearestShapeIdx(s, fromLat, fromLon);
      const ti = window.nearestShapeIdx(s, toLat, toLon);
      if (ti > fi && ti - fi > bestScore) { bestScore = ti - fi; best = { s, fi, ti }; }
    }
    return best;
  },

  // Óra:perc → percek hajnaltól
  toMinutes(hm) {
    const [h, m] = hm.split(":").map(Number);
    return h * 60 + m;
  },

  // percek → "HH:MM" formátum
  fmtTime(totalMins) {
    const h = Math.floor(totalMins / 60) % 24;
    const m = totalMins % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  },

  // Nap típusa a dátumból; schoolHoliday=true esetén tanszüneti menetrend munkanapokon
  dayType(date, schoolHoliday = false) {
    const d = date.getDay(); // 0=vas, 6=szo
    if (d === 0 || d === 6) return "weekend";
    if (schoolHoliday) return "schoolholiday";
    return "workday";
  },

  // Egy busz departures objektumából → abszolút indulási idők [minutes[]]
  getDepartures(bus, dayType) {
    let dep = bus.departures[dayType] || {};
    const out = [];
    for (const hStr of Object.keys(dep)) {
      const h = Number(hStr);
      for (const rawM of dep[hStr]) {
        const m = typeof rawM === "object" ? rawM.t : rawM;
        out.push(h * 60 + m);
      }
    }
    return out.sort((a, b) => a - b);
  },

  // Egy buszon belül két megálló közötti menetidő (percben)
  travelTime(bus, fromStop, toStop) {
    const a = bus.stops.find((s) => s.name === fromStop);
    const b = bus.stops.find((s) => s.name === toStop);
    if (!a || !b) return null;
    return b.offset - a.offset;
  },

  // Egy busz egy megállójának offsetje (a kezdőponttól)
  stopOffset(bus, stopName) {
    const s = bus.stops.find((x) => x.name === stopName);
    return s ? s.offset : null;
  },

  // Megálló-e a buszon?
  busVisits(bus, stopName) {
    return bus.stops.some((s) => s.name === stopName);
  },
};

// ============================================================
// GTFS intercity ↔ city-data megálló névleképezések
// ============================================================

// GTFS megállónév → city-data.js megállónév (átszállási kereséshez)
const _GTFS_CITY_STOP = {
  "Veszprém, autóbusz-állomás":     "Veszprém autóbusz-állomás",
  "Veszprém, Komakút tér":          "Komakút tér / Pannon Egyetem",
  "Veszprém, Színház":              "Petőfi Színház",
  "Veszprém, Jutasi úti lakótelep": "Jutasi úti lakótelep",
  "Veszprém, vasútállomás":         "Veszprém vasútállomás",
};

// GTFS stop rövid megjelenítési neve (kártyán)
const _TRANSFER_SHORT = {
  "Veszprém, autóbusz-állomás": "Autóbusz-áll.",
  "Veszprém, Komakút tér":      "Komakút tér",
  "Veszprém, Színház":          "Petőfi Színház",
};

function _dayTypeCat(dayType) {
  return { workday: 'munkanap', schoolholiday: 'tanszunet', weekend: 'szabadnap' }[dayType] || 'munkanap';
}
window._dayTypeCat = _dayTypeCat;

// Megálló-néző (StopTimetableModal) "Helyközi" módjához: a Nemesvámos↔Veszprém korridor
// megállói FIZIKAI PLATFORMONKÉNT (spId), nem összevont névre — mert a legtöbb megállónévnek
// 2-4 ténylegesen külön fizikai pontja van (14-113 m egymástól, valódi külön tábla, nem
// adatzaj), és a HazaÚt route-tervező is már ma konkrét spId-alapú koordinátákkal dolgozik
// (transferLat/transferLon = icRoute.stops[idx].lat/lon) — egy jövőbeli térképi kattintás
// eleve egy konkrét platformra fog mutatni, ezért itt is annak megfelelő granularitás kell.
// Kézi címke-felülbírálás konkrét spId-kre — a debug-térképes (_debug-platforms.html)
// egyenkénti ellenőrzés során, helyismeret alapján derült ki, hogy az automatikus
// irány-alapú címke (iskola/haza -> Nemesvámos/Veszprém felé) félrevezető: a "Nemesvámos,
// autóbusz-váróterem" platformjai közül az egyiket (_1) valójában a helyközi iskolai
// vonalak (7361/7363/7366) használják, a másikat (_3) a Tapolca/Keszthely felé továbbmenő
// távolsági járatok (1625/7360/7364/7370) — ezt a GTFS route_long_name-ekből nem lehet
// tisztán, általánosan levezetni (a két csoport végpontjai is szórtak egymás között),
// ezért kézi felülbírálás, nem algoritmikus szabály.
const _INTERCITY_LABEL_OVERRIDES = {
  'VOLAN_hkir_557858_1': 'Nemesvámos, autóbusz-váróterem (Nemesvámos felé)',
  'VOLAN_hkir_557858_3': 'Nemesvámos, autóbusz-váróterem (Tapolca, Keszthely felé)',
  // ABC: a _2-t több vonal (7361/7363) is használja rendes, nem-hurkos áthaladásként —
  // ez a "rendes", Veszprém felé továbbhaladó platform. A _1-et kizárólag a 7366-os hurok
  // befelé tartó (a fordulót még el nem érő) szakasza érinti — irány-jelzővel egyértelmű,
  // sorszám ("1./2. előfordulás") helyett, ami félrevezető volt.
  'VOLAN_hkir_557856_1': 'Nemesvámos, ABC (Nemesvámos felé)',
  'VOLAN_hkir_557856_2': 'Nemesvámos, ABC (Veszprém felé)',
  // forduló: a _2 (pad+tető, OSM-mel megerősítve) a valódi, rendes Veszprém felé induló
  // platform (7361/7363/7366 haza-iránya mind innen indul) — hogy a 7366-os iskola-irányú
  // hurokja átmenetileg ÉRINTI ugyanezt a fizikai pontot, az a user szerint nem teszi
  // kétértelművé a platform funkcióját, ugyanaz a minta mint az ABC_2-nél.
  'VOLAN_hkir_557862_2': 'Nemesvámos, autóbusz-forduló (Veszprém felé)',
};

function _intercityPlatforms() {
  const bySpId = new Map();
  for (const route of window.INTERCITY_BUSES_FULL || []) {
    for (const s of route.stops) {
      if (!bySpId.has(s.spId)) bySpId.set(s.spId, { ...s, dirs: new Set() });
      bySpId.get(s.spId).dirs.add(route.dir);
    }
  }
  const platforms = Array.from(bySpId.values());

  // Címkézés, névvel csoportosítva:
  //  1) egyetlen fizikai pont a névhez -> puszta név, nincs mit megkülönböztetni.
  //  2) van GTFS platform_code -> azt használjuk (mindig egyedi egy néven belül).
  //  3) a maradék (kód nélküli) testvérek iránnyal csoportosítva: ha egy irányhoz csak
  //     egy platform tartozik, elég az irány-jelző; ha egy irányon (vagy a "vegyes"
  //     csoporton) belül több platform is van — pl. a Nemesvámos-i hurok, ahol a busz
  //     egy irányon belül kétszer érinti ugyanazt a nevet —, sorszámmal különböztetjük.
  const byName = new Map();
  for (const p of platforms) {
    if (!byName.has(p.name)) byName.set(p.name, []);
    byName.get(p.name).push(p);
  }
  for (const group of byName.values()) {
    if (group.length === 1) { group[0].label = group[0].name; continue; }
    const noCode = [];
    for (const p of group) {
      if (p.platformCode) p.label = `${p.name} – ${p.platformCode}. beálló`;
      else noCode.push(p);
    }
    const byDirKey = new Map();
    for (const p of noCode) {
      const key = p.dirs.size === 1 ? [...p.dirs][0] : '(vegyes)';
      if (!byDirKey.has(key)) byDirKey.set(key, []);
      byDirKey.get(key).push(p);
    }
    for (const [key, arr] of byDirKey) {
      const dirLabel = key === 'haza' ? 'Veszprém felé' : key === 'iskola' ? 'Nemesvámos felé' : null;
      arr.forEach((p, i) => {
        if (arr.length === 1) p.label = dirLabel ? `${p.name} (${dirLabel})` : p.name;
        else p.label = dirLabel ? `${p.name} (${dirLabel}, ${i + 1}. előfordulás)` : `${p.name} (${i + 1}. előfordulás)`;
      });
    }
  }
  for (const p of platforms) {
    if (_INTERCITY_LABEL_OVERRIDES[p.spId]) p.label = _INTERCITY_LABEL_OVERRIDES[p.spId];
  }
  return platforms;
}
window._intercityPlatforms = _intercityPlatforms; // debug/ellenőrzés céljából is elérhető

window.getIntercityStops = function () {
  return _intercityPlatforms().map(p => p.label).sort((a, b) => a.localeCompare(b, "hu"));
};

window.getIntercityRoutesForPlatformLabel = function (label) {
  const platform = _intercityPlatforms().find(p => p.label === label);
  if (!platform) return [];
  const seen = new Map();
  for (const route of window.INTERCITY_BUSES_FULL || []) {
    route.stops.forEach((s, idx) => {
      // "haza" irányban a tömb vége a valódi, szándékolt úticél (a busz ott
      // "hazaér", nincs értelme indulásként számolni) — "iskola" irányban viszont
      // a tömb vége SOHA nem valódi GTFS-végállomás, csak a modellezett szakasz
      // határa (a busz a valóságban folytatja az útját) — ott a végén álló
      // megálló is valódi érintett/felszállható pont.
      if (idx === route.stops.length - 1 && route.dir === 'haza') return;
      if (s.spId === platform.spId) seen.set(route.id, route);
    });
  }
  return Array.from(seen.values());
};

window.getIntercityDeparturesForPlatformLabel = function (label, dayType) {
  const platform = _intercityPlatforms().find(p => p.label === label);
  if (!platform) return [];
  const cat = _dayTypeCat(dayType);
  const out = [];
  for (const route of window.INTERCITY_BUSES_FULL || []) {
    const idx = route.stops.findIndex(s => s.spId === platform.spId);
    if (idx < 0) continue;
    for (const trip of route.trips) {
      if (!trip.dayTypes.includes(cat)) continue;
      const mins = trip.deps[idx];
      if (mins == null) continue;
      // Csak akkor valódi "indulás" innen, ha EZ a konkrét trip a kiválasztott
      // platform UTÁN is érint még (más fizikai pontú) megállót -- A MI SAJÁT
      // modellezett listánkban. Ha nincs ilyen a mi listánkban:
      // - "haza" irányban ez SZÁNDÉKOSAN azt jelenti, hogy megérkeztünk (Veszprém,
      //   autóbusz-állomás/vasútállomás) -- nem érdekes, hogy a busz a valóságban
      //   esetleg folytatja-e az útját Veszprémen belül, ez a mi szempontunkból a
      //   végpont, nincs értelme indulásként mutatni.
      // - "iskola" irányban viszont a tömb vége SOHA nem szándékolt végállomás,
      //   csak a modellezett Nemesvámos-i szakasz határa -- itt trip-enként eldől
      //   (a `continuesBeyondModel` mezővel, ld. 09-regenerate-intercity.js), hogy
      //   a valóságban folytatódik-e (pl. Veszprémfajsz felé) vagy ez a konkrét
      //   trip tényleg itt fordul meg.
      let toIdx = -1;
      for (let i = trip.deps.length - 1; i > idx; i--) {
        if (trip.deps[i] != null && route.stops[i].spId !== platform.spId) { toIdx = i; break; }
      }
      if (toIdx === -1 && !(route.dir === 'iskola' && trip.continuesBeyondModel)) continue;
      out.push({
        mins, note: null, bus: route,
        from: trip.origin || route.stops[0].name,
        to: toIdx === -1 ? null : route.stops[toIdx].name,
        // A VALÓDI GTFS-végállomás (nem a mi kurált szakaszunk vége) -- "iskola" irányban a
        // `to` gyakran csak a modellezett Nemesvámos-i szakasz határa (pl. "autóbusz-forduló"),
        // nem a busz tényleges célja (pl. Balatonfüred, Nagyvázsony) -- ez adja a teljes képet.
        terminus: trip.terminus || null,
      });
    }
  }
  return out;
};

// ============================================================
// Városi (helyi) megálló-néző — fizikai platformok (spId)
// ============================================================
// Ugyanaz a probléma mint a helyközinél, csak lényegesen szélesebb körben:
// nem csak körjáratokon belül (pl. 47-es "Hotel"), hanem a teljes
// hálózatban sok megállónév 2-3 KÜLÖNBÖZŐ VONAL között is 2-3 külön fizikai
// pontot takar (valós, ~10-20m-es eltérésekkel, nem adatzaj). A
// `_cityPlatforms()` spId-nkénti dedupét ad, fokozatosan bővülő
// disambiguáló címkével, csak annyi kontextust adva hozzá, amennyi a
// tényleges ütközés feloldásához szükséges:
//   1. egyedi név -> puszta név (a hálózat többsége, nincs változás)
//   2. ütköző név -> "{név} ({köv. megálló} felé)" -- ha ez már egyedi a
//      csoporton belül, marad ennyi
//   3. még mindig ütköző -> "{név} ({előző megálló} felől, {köv.} felé)"
//   4. végső, ritka eset (csak akkor, ha 2 platform indulási/érkezési
//      szomszédja is TELJESEN megegyezik) -> vonalszám(ok) hozzáfűzve
function _cityPlatforms() {
  const map = new Map();
  for (const bus of window.CITY_BUSES_FULL || []) {
    bus.stops.forEach((s, i) => {
      const isTerminus = i === bus.stops.length - 1;
      const prevName = i === 0 ? null : bus.stops[i - 1].name;
      const nextName = isTerminus ? null : bus.stops[i + 1].name;
      if (!map.has(s.spId)) map.set(s.spId, { ...s, prevName, nextName, routes: new Set() });
      map.get(s.spId).routes.add(bus.id);
    });
  }
  const platforms = Array.from(map.values());
  const byName = new Map();
  for (const p of platforms) {
    if (!byName.has(p.name)) byName.set(p.name, []);
    byName.get(p.name).push(p);
  }
  const dirText = (n) => n ? `${n} felé` : "végállomás";
  for (const [name, group] of byName) {
    if (group.length === 1) { group[0].label = name; continue; }
    // 2. szint: csak a köv. megálló
    const tryLabels = group.map(p => `${name} (${dirText(p.nextName)})`);
    if (new Set(tryLabels).size === group.length) {
      group.forEach((p, i) => p.label = tryLabels[i]);
      continue;
    }
    // 3. szint: előző + köv. megálló együtt
    const tryLabels2 = group.map(p => p.prevName
      ? `${name} (${p.prevName} felől, ${dirText(p.nextName)})`
      : `${name} (${dirText(p.nextName)})`);
    if (new Set(tryLabels2).size === group.length) {
      group.forEach((p, i) => p.label = tryLabels2[i]);
      continue;
    }
    // 4. szint: vonalszám(ok) hozzáfűzve a 2. szintű címkéhez -- garantáltan
    // egyedi, mert 2 külön spId-nek soha nem lehet pontosan ugyanaz a
    // vonal-halmaza (különben nem lenne 2 külön fizikai platform).
    group.forEach((p, i) => p.label = `${tryLabels[i]} – ${[...p.routes].sort((a, b) => a.localeCompare(b, "hu", { numeric: true })).join(", ")}. busz`);
  }
  return platforms;
}
window._cityPlatforms = _cityPlatforms;

// Egy konkrét fizikai platform (spId) pontosított címkéje, ha van ilyen platform és
// a neve ambiguus (több platform is van ugyanazon a néven) -- egyébként a sima nevet
// adja vissza. A kártyákon ezzel jelezzük, PONTOSAN melyik megállóból indul/hova
// érkezik egy adott útvonal, azoknál a (kisebbségi, de valós) neveknél, ahol ez
// ténylegesen eltérő fizikai pontot jelenthet.
window.cityPlatformLabel = function (spId, fallbackName) {
  if (!spId) return fallbackName;
  const p = _cityPlatforms().find(x => x.spId === spId);
  return (p && p.label) || fallbackName;
};

window.getCityStops = function () {
  return _cityPlatforms().map(p => p.label).sort((a, b) => a.localeCompare(b, "hu"));
};

window.getCityRoutesForPlatformLabel = function (label) {
  const platform = _cityPlatforms().find(p => p.label === label);
  if (!platform) return [];
  const seen = new Map();
  for (const bus of window.CITY_BUSES_FULL || []) {
    bus.stops.forEach((s, idx) => {
      if (idx === bus.stops.length - 1) return; // végállomás, csak érkezés
      if (s.spId === platform.spId) seen.set(bus.id + '|' + bus.direction, bus);
    });
  }
  return Array.from(seen.values());
};

window.getCityDeparturesForPlatformLabel = function (label, dayType) {
  const platform = _cityPlatforms().find(p => p.label === label);
  if (!platform) return [];
  const out = [];
  for (const bus of window.CITY_BUSES_FULL || []) {
    const idx = bus.stops.findIndex(s => s.spId === platform.spId);
    if (idx < 0 || idx === bus.stops.length - 1) continue;
    const off = bus.stops[idx].offset;
    const sched = bus.departures[dayType] || {};
    for (const [hStr, arr] of Object.entries(sched)) {
      const h = Number(hStr);
      for (const raw of arr) {
        const m = typeof raw === "object" ? raw.t : raw;
        const note = typeof raw === "object" ? raw.n : null;
        out.push({ mins: h * 60 + m + off, note, bus });
      }
    }
  }
  return out.sort((a, b) => a.mins - b.mins);
};

// ============================================================
// Útvonaltervező — haza irány: Nemesvámos → Veszprém → hazafelé
// ============================================================

window.planRoutes = function planRoutes({
  now, walkMin, maxResults,
  homeStop,
  boardStop,
  schoolHoliday,
}) {
  const U = window.BUS_UTILS;
  const dayType = U.dayType(now, schoolHoliday);
  const nowMins = now.getHours() * 60 + now.getMinutes();
  const earliestBoard = nowMins + walkMin;

  const targetStop = homeStop || "Csererdő";
  const busPool = (window.CITY_BUSES_FULL || []).filter(bus =>
    (homeStop || HOME_BUS_IDS.includes(bus.id)) && U.busVisits(bus, targetStop)
  );

  const icRoutes = (window.INTERCITY_BUSES_FULL || []).filter(r => r.dir === 'haza');
  const _cat = _dayTypeCat(dayType);
  const walkGraph = window.WALK_GRAPH || {};

  const routes = [];
  const seen = new Set();

  for (const icRoute of icRoutes) {
    // Felszállási megálló Nemesvámoson: alapból az autóbusz-váróterem, de a user
    // választhat más, ténylegesen a faluban lévő megállót is (boardStop paraméter).
    const boardStopIdx = icRoute.stops.findIndex(s => s.name === (boardStop || "Nemesvámos, autóbusz-váróterem"));
    if (boardStopIdx === -1) continue;

    for (const trip of (icRoute.trips || [])) {
      if (!trip.dayTypes.includes(_cat)) continue;
      const boardAtVaroterem = trip.deps[boardStopIdx];
      if (boardAtVaroterem == null || boardAtVaroterem < earliestBoard) continue;

      // Minden Veszprémi átszállási megálló ebben a járatban
      for (let vi = 0; vi < icRoute.stops.length; vi++) {
        const icVeszpStop = icRoute.stops[vi];
        if (!icVeszpStop.name.startsWith('Veszprém,')) continue;
        const cityStopName = _GTFS_CITY_STOP[icVeszpStop.name];
        if (!cityStopName) continue;

        const icArriveAtVeszp = trip.deps[vi];
        if (icArriveAtVeszp == null) continue;

        for (const bus of busPool) {
          if (bus.stops[0]?.name === "Csererdő") continue;
          if (!U.busVisits(bus, cityStopName)) continue;
          if (!U.busVisits(bus, targetStop)) continue;
          // Ha a megállónév TÖBBSZÖR szerepel ugyanezen a buszon (pl. "Petőfi Színház" a
          // 42-esnél, "Veszprém autóbusz-állomás" a 12-esnél, két külön fizikai ponton),
          // az első előfordulás (U.stopOffset/bus.stops.find névre keres) nem feltétlenül
          // a valódi platform, amit a helyközi busz is használ -- az icVeszpStop.citySpId-vel
          // egyező előfordulást kell előnyben részesíteni, különben rossz felszállási időt
          // és/vagy téves (hiányzó vagy felesleges) gyaloglás-jelzést számolnánk.
          const transferCandidates = bus.stops.filter(s => s.name === cityStopName);
          const busStopAtTransfer = transferCandidates.find(s => s.spId === icVeszpStop.citySpId) || transferCandidates[0];
          const transferOffset = busStopAtTransfer?.offset ?? null;
          if (transferOffset === null) continue;
          // Ld. a fenti indoklást: a targetStop (otthoni megálló) neve is szerepelhet
          // TÖBBSZÖR ugyanezen a buszon (pl. körjáratnál a végállomás a kör elején ÉS
          // végén -- "Veszprém autóbusz-állomás" a 12-esnél, "Hotel" a 42-es/47-esnél,
          // két külön fizikai ponton) -- minden előfordulást kipróbálunk, ami ténylegesen
          // KÉSŐBB van, mint az átszállás; a puszta U.stopOffset (első találat) körjáratnál
          // teljesen elrejthetett volna egy valós hazautat.
          const targetOccs = bus.stops.filter(s => s.name === targetStop);
          const validTargetOffsets = [...new Set(targetOccs.filter(s => s.offset > transferOffset).map(s => s.offset))];
          if (validTargetOffsets.length === 0) continue;

          let walkAtTransfer = null;
          if (busStopAtTransfer?.spId && icVeszpStop.citySpId && busStopAtTransfer.spId !== icVeszpStop.citySpId) {
            const edge = (walkGraph[icVeszpStop.citySpId] || []).find(n => n.spId === busStopAtTransfer.spId);
            if (edge) walkAtTransfer = { distM: edge.distM, walkMin: edge.walkMin };
          }
          const mustBoardBy = icArriveAtVeszp + (walkAtTransfer?.walkMin ?? 0);

          const localDeps = U.getDepartures(bus, dayType);
          for (const localDep of localDeps) {
            const localBoardAt = localDep + transferOffset;
            if (localBoardAt < mustBoardBy) continue;

            for (const targetOffset of validTargetOffsets) {
              const localArriveHome = localDep + targetOffset;

              const key = `${icRoute.id}-${boardAtVaroterem}-${bus.id}-${bus.direction}-${localDep}-${targetOffset}`;
              if (seen.has(key)) continue;
              seen.add(key);

              routes.push({
                departLeaveHome: boardAtVaroterem - walkMin,
                helykoziDep: boardAtVaroterem,
                helykoziArrive: icArriveAtVeszp,
                helykoziLine: icRoute.id,
                helykoziTripDeps: trip.deps,
                helykoziOrigin: trip.origin || null,
                helykoziOriginDep: trip.originDep ?? null,
                helykoziTerminus: trip.terminus || null,
                // A trip VALÓDI (GTFS-eredetű) origója (helykoziOrigin) attól függetlenül
                // fix, hogy a user melyik megállóból akar felszállni -- ez itt viszont a
                // TÉNYLEGESEN kiválasztott/használt nemesvámosi felszállási pont, amit a
                // kártyán a "honnan" szövegnél ezt kell mutatni, nem a helykoziOrigin-t.
                helykoziBoardStop: boardStop || "Nemesvámos, autóbusz-váróterem",
                transferStop: cityStopName,
                transferStopShort: _TRANSFER_SHORT[icVeszpStop.name] || icVeszpStop.name.replace('Veszprém, ', ''),
                transferStopId: icVeszpStop.name,
                transferLocalStop: cityStopName,
                transferLocalSpId: busStopAtTransfer?.spId || null,
                transferLat: icVeszpStop.lat,
                transferLon: icVeszpStop.lon,
                waitAtTransfer: localBoardAt - icArriveAtVeszp,
                ...(walkAtTransfer ? { walkAtTransfer } : {}),
                localBus: bus,
                localBoardAt,
                localArriveCsererdo: localArriveHome,
                homeStop: targetStop,
                totalDuration: localArriveHome - (boardAtVaroterem - walkMin),
              });
            }
          }
        }
      }
    }
  }

  routes.sort((a, b) => a.localArriveCsererdo - b.localArriveCsererdo);

  const filtered = [];
  const seenKey = new Set();
  for (const r of routes) {
    const k = `${r.helykoziDep}-${r.localBus.id}-${r.localBus.direction}-${r.localBoardAt}`;
    if (seenKey.has(k)) continue;
    seenKey.add(k);
    filtered.push(r);
  }

  const result = filtered.slice(0, maxResults);

  if (homeStop && result.length === 0) {
    const otherDay = dayType === "workday" ? "weekend" : "workday";
    const hasOtherDay = busPool.some(bus => {
      if (bus.stops[0]?.name === "Csererdő") return false;
      if (!U.busVisits(bus, targetStop)) return false;
      return U.getDepartures(bus, otherDay).length > 0;
    });
    if (hasOtherDay) result.hint = otherDay === "weekend" ? "weekendOnly" : "workdayOnly";
  }

  return result;
};

// ============================================================
// Reggeli útvonaltervező — Csererdő → Nemesvámos (iskolába)
// 1. Helyi busz fromStop-ról egy Veszprémi átszálláspontra
// 2. Opcionálisan séta a walk-graph alapján egy közeli megállóhoz
// 3. Helyközi busz az átszálláspontról Nemesvámosra
// ============================================================

window.planSchoolRoutes = function planSchoolRoutes({
  now, walkMin, maxResults, schoolStartMin,
  schoolHoliday,
  fromStop,
  walkToSchool,
  walkToSchoolDist,
}) {
  fromStop = fromStop || "Csererdő";
  walkToSchool = walkToSchool != null ? walkToSchool : 10;
  const U = window.BUS_UTILS;
  const dayType = U.dayType(now, schoolHoliday);
  const nowMins = now.getHours() * 60 + now.getMinutes();
  const earliestBoard = nowMins + walkMin;

  const icRoutes = (window.INTERCITY_BUSES_FULL || []).filter(r => r.dir === 'iskola');
  const _cat = _dayTypeCat(dayType);
  const walkGraph = window.WALK_GRAPH || {};

  const routes = [];
  const seen = new Set();

  for (const icRoute of icRoutes) {
    // NÉV szerint horgonyzunk (nem a tömb utolsó indexére), mert a stops lista a jövőben
    // bővülhet a váróterem UTÁN is (pl. ABC, autóbusz-forduló) — ezek nem érintik a "hazaérkezés"
    // (Nemesvámos, autóbusz-váróterem) tényleges pontját, csak eltolnák a puszta index-alapú hivatkozást.
    const lastStopIdx = icRoute.stops.findIndex(s => s.name === "Nemesvámos, autóbusz-váróterem");

    // Veszprémi felszállási megállók indexei (a hazaérkezési megálló előtt)
    const veszpremBoardIdxs = icRoute.stops
      .map((s, i) => (i < lastStopIdx && s.name.startsWith('Veszprém,')) ? i : -1)
      .filter(i => i !== -1);

    for (const boardStopIdx of veszpremBoardIdxs) {
      const icBoardStop = icRoute.stops[boardStopIdx];
      const cityStopName = _GTFS_CITY_STOP[icBoardStop.name];
      if (!cityStopName) continue;

      const schoolBuses = (window.CITY_BUSES_FULL || []).filter(bus =>
        U.busVisits(bus, fromStop) && U.busVisits(bus, cityStopName)
      );

      for (const bus of schoolBuses) {
        // Ld. a planRoutes-beli indoklást: a megállónév többszöri előfordulása ugyanazon
        // a buszon (pl. "Petőfi Színház" a 42-esnél) esetén az icBoardStop.citySpId-vel
        // egyező előfordulást kell választani, nem az elsőt.
        const transferCandidates = bus.stops.filter(s => s.name === cityStopName);
        const busStopAtTransfer = transferCandidates.find(s => s.spId === icBoardStop.citySpId) || transferCandidates[0];
        const transOffset = busStopAtTransfer?.offset ?? null;
        if (transOffset === null) continue;
        // A fromStop (felszállási megálló) neve is szerepelhet TÖBBSZÖR ugyanezen a
        // buszon (pl. körjáratnál a végállomás a kör elején ÉS végén) -- minden
        // előfordulást kipróbálunk, ami ténylegesen KORÁBBAN van, mint az átszállás.
        const fromOccs = bus.stops.filter(s => s.name === fromStop);
        const validFromOffsets = [...new Set(fromOccs.filter(s => s.offset < transOffset).map(s => s.offset))];
        if (validFromOffsets.length === 0) continue;

        let walkAtTransfer = null;
        if (busStopAtTransfer?.spId && icBoardStop.citySpId && busStopAtTransfer.spId !== icBoardStop.citySpId) {
          const edge = (walkGraph[icBoardStop.citySpId] || []).find(n => n.spId === busStopAtTransfer.spId);
          if (edge) walkAtTransfer = { distM: edge.distM, walkMin: edge.walkMin };
        }
        const walkAtTransferMin = walkAtTransfer?.walkMin ?? 0;

        const localDeps = U.getDepartures(bus, dayType);
        for (const localDep of localDeps) {
          for (const fromOffset of validFromOffsets) {
          const boardAt = localDep + fromOffset;
          if (boardAt < earliestBoard) continue;
          const arriveAtTransfer = localDep + transOffset;
          const readyForHelykozi = arriveAtTransfer + walkAtTransferMin;

          const matchingTrip = (icRoute.trips || []).find(trip => {
            if (!trip.dayTypes.includes(_cat)) return false;
            const d = trip.deps[boardStopIdx];
            return d != null && d >= readyForHelykozi;
          });
          if (!matchingTrip) continue;

          const icDepAtStop = matchingTrip.deps[boardStopIdx];
          const icArriveSchool = matchingTrip.deps[lastStopIdx];
          if (icArriveSchool == null) continue;
          if (schoolStartMin != null && icArriveSchool > schoolStartMin) continue;

          // A trip VALÓDI kiindulópontjának idejét használjuk (nem egy fix "Veszprém,
          // autóbusz-állomás" index-lookupot) -- utóbbi néma hibát okozott rövidített
          // (pl. Komakút térről induló) trip-eknél: mivel azok sose érintik ténylegesen
          // az autóbusz-állomást, a régi kód a felszállási időre esett vissza, és úgy
          // tűnt mintha a busz "nulla perc alatt" ért volna oda -- ld. user screenshot.
          const helykoziDepBuszall = matchingTrip.originDep ?? icDepAtStop;

          const key = `${icBoardStop.name}-${bus.id}-${bus.direction}-${boardAt}-${icDepAtStop}`;
          if (seen.has(key)) continue;
          seen.add(key);

          routes.push({
            departLeaveHome: boardAt - walkMin,
            boardingStopName: fromStop,
            localBus: bus,
            localBoardAt: boardAt,
            localArriveAtTransfer: arriveAtTransfer,
            walkAfterBus: 0,
            walkAfterBusDist: null,
            transferReadyAt: readyForHelykozi,
            waitAtTransfer: icDepAtStop - readyForHelykozi,
            ...(walkAtTransfer ? { walkAtTransfer } : {}),
            helykoziDep: icDepAtStop,
            helykoziArrive: icArriveSchool,
            helykoziLine: icRoute.id,
            helykoziDepBuszall,
            helykoziOrigin: matchingTrip.origin || null,
            helykoziTerminus: matchingTrip.terminus || null,
            helykoziTripDeps: matchingTrip.deps,
            transferStop: cityStopName,
            transferStopShort: _TRANSFER_SHORT[icBoardStop.name] || icBoardStop.name.replace('Veszprém, ', ''),
            transferStopId: icBoardStop.name,
            transferLocalStop: cityStopName,
            transferLocalSpId: busStopAtTransfer?.spId || null,
            transferLat: icBoardStop.lat,
            transferLon: icBoardStop.lon,
            walkToSchool,
            walkToSchoolDist,
            arriveSchool: icArriveSchool + walkToSchool,
            totalDuration: (icArriveSchool + walkToSchool) - (boardAt - walkMin),
          });
          }
        }
      }
    }
  }

  // ── WALK-TRANSFER (WALK_GRAPH) ─────────────────────────────
  const walkBestMap = new Map();

  const _walkNodes = window.WALK_GRAPH_NODES || {};
  for (const [walkFromSpId, neighbors] of Object.entries(walkGraph)) {
    const walkFromStop = _walkNodes[walkFromSpId];
    if (!walkFromStop) continue;

    for (const icRoute of icRoutes) {
      // Ld. a fenti indoklást: név szerinti horgony, nem tömb-index.
      const lastStopIdx2 = icRoute.stops.findIndex(s => s.name === "Nemesvámos, autóbusz-váróterem");

      for (let boardStopIdx2 = 0; boardStopIdx2 < lastStopIdx2; boardStopIdx2++) {
        const icBoardStop = icRoute.stops[boardStopIdx2];
        if (!icBoardStop.name.startsWith('Veszprém,')) continue;
        const cityStopName = _GTFS_CITY_STOP[icBoardStop.name];
        if (!cityStopName) continue;
        if (!icBoardStop.citySpId) continue;

        const walkMatch = neighbors.find(n => n.spId === icBoardStop.citySpId && n.distM >= 100);
        if (!walkMatch) continue;

        const wMin = walkMatch.walkMin;
        const distM = walkMatch.distM;

        const walkBuses = (window.CITY_BUSES_FULL || []).filter(bus => U.busVisits(bus, fromStop));
        for (const bus of walkBuses) {
          // Ld. a fenti indoklást: a walkFromStop NÉV többször is szerepelhet ugyanazon a
          // buszon -- itt viszont pontosan tudjuk a keresett fizikai pont spId-jét
          // (walkFromSpId), ezért közvetlenül azzal keresünk, nem névvel.
          const walkStopObj = bus.stops.find(s => s.spId === walkFromSpId);
          if (!walkStopObj) continue;
          const walkOffset = walkStopObj.offset;
          if (walkOffset === null) continue;
          // Ld. a fenti indoklást: a fromStop név is szerepelhet TÖBBSZÖR ugyanezen a
          // buszon -- minden előfordulást kipróbálunk, ami ténylegesen KORÁBBAN van,
          // mint a gyaloglás kiindulópontja.
          const fromOccsWalk = bus.stops.filter(s => s.name === fromStop);
          const validFromOffsetsWalk = [...new Set(fromOccsWalk.filter(s => s.offset < walkOffset).map(s => s.offset))];
          if (validFromOffsetsWalk.length === 0) continue;

          const directOffset = U.stopOffset(bus, cityStopName);
          if (directOffset !== null && directOffset > walkOffset) continue;

          const localDeps = U.getDepartures(bus, dayType);
          for (const localDep of localDeps) {
            for (const fromOffset of validFromOffsetsWalk) {
            const boardAt = localDep + fromOffset;
            if (boardAt < earliestBoard) continue;
            const arriveAtWalkStop = localDep + walkOffset;
            const readyForHelykozi = arriveAtWalkStop + wMin;

            const matchingTrip2 = (icRoute.trips || []).find(trip => {
              if (!trip.dayTypes.includes(_cat)) return false;
              const d = trip.deps[boardStopIdx2];
              return d != null && d >= readyForHelykozi;
            });
            if (!matchingTrip2) continue;

            const icDepAtStop = matchingTrip2.deps[boardStopIdx2];
            const icArriveSchool = matchingTrip2.deps[lastStopIdx2];
            if (icArriveSchool == null) continue;
            if (schoolStartMin != null && icArriveSchool > schoolStartMin) continue;

            // Ld. a fenti indoklást: a trip valódi kiindulópontjának ideje, nem fix index-lookup.
            const helykoziDepBuszall = matchingTrip2.originDep ?? icDepAtStop;
            const walkKey = `${icBoardStop.name}-${bus.id}-${bus.direction}-${boardAt}-${icDepAtStop}`;
            const candidate = {
              departLeaveHome: boardAt - walkMin,
              boardingStopName: fromStop,
              localBus: bus,
              localBoardAt: boardAt,
              localArriveAtTransfer: arriveAtWalkStop,
              walkAfterBus: wMin,
              walkAfterBusDist: distM,
              transferReadyAt: readyForHelykozi,
              waitAtTransfer: icDepAtStop - readyForHelykozi,
              helykoziDep: icDepAtStop,
              helykoziArrive: icArriveSchool,
              helykoziLine: icRoute.id,
              helykoziDepBuszall,
              helykoziOrigin: matchingTrip2.origin || null,
              helykoziTerminus: matchingTrip2.terminus || null,
              helykoziTripDeps: matchingTrip2.deps,
              transferStop: cityStopName,
              transferStopShort: _TRANSFER_SHORT[icBoardStop.name] || icBoardStop.name.replace('Veszprém, ', ''),
              transferStopId: icBoardStop.name + "_walk",
              transferLocalStop: walkFromStop,
              transferLocalSpId: walkFromSpId,
              transferLat: icBoardStop.lat,
              transferLon: icBoardStop.lon,
              walkToSchool,
              walkToSchoolDist,
              arriveSchool: icArriveSchool + walkToSchool,
              totalDuration: (icArriveSchool + walkToSchool) - (boardAt - walkMin),
            };
            const prev = walkBestMap.get(walkKey);
            if (!prev || distM < prev.walkAfterBusDist) walkBestMap.set(walkKey, candidate);
            }
          }
        }
      }
    }
  }
  for (const r of walkBestMap.values()) routes.push(r);

  routes.sort((a, b) => a.arriveSchool - b.arriveSchool);

  const filtered = [];
  const seenKey = new Set();
  for (const r of routes) {
    const k = `${r.localBus.id}-${r.localBus.direction}-${r.localBoardAt}-${r.helykoziDep}`;
    if (seenKey.has(k)) continue;
    seenKey.add(k);
    filtered.push(r);
  }

  return filtered.slice(0, maxResults);
};
