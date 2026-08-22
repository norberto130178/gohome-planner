# GoHome Planner — Future TODOs

## Technikai adósság / Refaktor (2026-06-07 elemzés alapján)

### ✅ 1. `nearestShapeIdx` konszolidálása — KÉSZ (2026-06-08)
Jelenleg 4 helyen van definiálva ugyanaz az algoritmus:
- `data.js:14` — globális `window.nearestShapeIdx` (ez az igazi)
- `route-card.jsx:196` és `:445` — lokális `nearestIdx` (HomeRouteMap, SchoolRouteMap)
- `city.html` inline — saját verzió

**Teendő:** `route-card.jsx` két `nearestIdx`-ét cseréld `window.nearestShapeIdx`-re. A `city.html`-beli saját verziót töröld, és ott is a globálisat használd.
**Kockázat ha nem csinálod:** Shape logika módosításakor valamelyik helyen elmarad a frissítés — néma hiba.

### ✅ 2. `bestShape` kiemelése közös helyre — KÉSZ (2026-06-08)
`route-card.jsx:205` és `:453` szószerinti másolat. Kerüljön `BUS_UTILS`-ba (`data.js`), mindkét komponens azt hívja.

### ✅ 3. `city.html` inline kód kiszervezése — KÉSZ (2026-06-08)
A `CityRouteMap` és shape logika jelenleg inline Babel scriptben van a `city.html`-ben — teljesen le van válva a többi komponenstől. Minden shape-javítás kétszeres munka amíg ez így van.
**Teendő:** A city-specifikus map és route logika kerüljön egy külön `city-map.js`-be amit a `city.html` betölt.

### ✅ 4. `CITY_BUSES` vs `CITY_BUSES_FULL` tisztázása — KÉSZ (2026-06-08)
`index.html` (HazaÚt) a `CITY_BUSES`-t (`city-buses.js`) használja, `city.html` a `CITY_BUSES_FULL`-t (`city-data.js`). Két hasonló adatstruktúra párhuzamosan karbantartva.
**Teendő:** Előbb megérteni mi a szándékos különbség, majd az `index.html`-t átállítani `CITY_BUSES_FULL`-ra és `city-buses.js`-t törölni.

### 5. Megálló név normalizálás centralizálása
`normStop()` csak `route-card.jsx`-ben van, de hasonló illesztési logika (`includes`, `split(' /')[0]`) több fájlban szétszórva hardkódolva.
**Teendő:** Globális `normalizeStopName()` helper `data.js`-ben / `BUS_UTILS`-ban.

### 6. Leaflet map inicializálás helper (alacsony prioritás)
3 helyen van `L.map() + tileLayer(...)` — `route-card.jsx` kétszer, `timetable-modal.jsx` egyszer.
**Teendő:** Közös `createLeafletMap(container)` helper ha tile layer konfig változna.

## Menetrend modal (city.html)

### ✅ 7. Munkanap/hétvége váltó — KÉSZ

### ✅ 8. Útvonal-változat jelzők a menetrend modalban — KÉSZ (2026-08-22-én ellenőrizve)
Megvalósítva: a `city-data.js` minden érintett indulásnál tárolja a `{t, n}` alakot (`n` = betűjelölés), minden érintett buszhoz van `footnotes` mező. A `timetable-modal.jsx` mindkét modalban (`BusTimetableModal` és `StopTimetableModal`) kirajzolja superscriptként az időpont mellett, plusz lábjegyzet-legenda a magyarázattal.

### ✅ 9. Compound annotációk kezelése a UI-ban — KÉSZ (2026-08-22-én ellenőrizve)
A `StopTimetableModal` (`timetable-modal.jsx` ~1373. sor, `usedFootnotes`) karakterenként bontja az `n` értéket, kis/nagybetű-független lookuppal (`fn[ch] || fn[ch.toUpperCase()]`) — a 13-as busz "Hv" jelölése (H + V külön footnote) helyesen mindkét magyarázatot megjeleníti. Az összes buszra (5,6,8,13,16,18,21,47) leellenőrizve: nincs olyan használt jelölés-karakter, aminek ne lenne footnote-szövege.

### 10. Shape–indulás összerendelés (térképnézet pontosítása) — MEGERŐSÍTETT, ÉLESBEN REPRODUKÁLT HIBA (2026-08-22)
A 7-es, 10-es, 13-as buszoknál több GTFS shape létezik, a térkép heurisztikával választ közülük — **ez a hiba valós, Puppeteerrel élesben is reprodukálva**: a 13-as busz 07:34-es, "Hv" (Hotelig közlekedik) jelölésű hétvégi indulásánál a térkép a TELJES 137 pontos hosszú útvonalat rajzolta ki a helyes, rövid (70 pontos, Hotelnél véget érő) shape helyett.
- **Gyökér ok:** egy buszhoz minden megálló szerepel a `city-data.js`-ben (összes variáns), de egy adott indulás csak az egyik variáns shape-jéhez tartozik — jelenleg nincs `shape_id` az indulás-adaton
- **Megoldás:** a betűjelöléssel együtt tárolni `shape_id`-t is (pl. `{t: 454, n: 'Hv', shapeId: '...'}`) — a GTFS `trips.txt`-ben a `trip_id → shape_id` kapcsolat megvan, a `_gtfs_update/03-extract-veszprem.js`-t kellene bővíteni ezzel
- Ekkor egy konkrét induláshoz egyértelműen tudja a térkép a helyes shape-t kirajzolni, nincs szükség heurisztikára
- A 7-es busz 2 shape-je valószínűleg csak sima oda-vissza irány-pár, nem valódi route-eltérés — ott lehet, hogy nincs is tényleges hiba, ezt még nem ellenőriztük konkrét esetre

## Adatstruktúra

### ✅ 11. Útvonal-változat jelzők (betűkódok az indulási időknél) — KÉSZ (2026-08-22-én ellenőrizve)
Megvalósítva: `departures` szerkezet `{t, n}` alakban tárolja a jelölős időpontokat, minden irányhoz van `footnotes` mező (`{ 'A': 'Vasútállomásig közlekedik', ... }`). **Egy rész még nem ellenőrzött**: hogy az útvonaltervező (`planCityRoutes` stb.) figyelembe veszi-e, ha a célmegálló nincs a rövidített útvonalon (pl. Hotelig rövidített indulást nem ajánlana-e tévesen egy Hotelen túli célhoz) — ezt legközelebb, ha ehhez a témához visszatérünk, külön meg kell nézni.

### ✅ 12. Szombat/vasárnap külön menetrend — KÉSZ

### ✅ 13. Munkaszüneti napok kezelése — KÉSZ

## 14. 4-es és 4A busz — menetrend és útvonal tisztázása szükséges

A PDF menetrend a 4-es és 4A busznál értelmezhetetlen módon össze van vonva — a két irány táblái és valószínűleg a két járat adatai is keverednek. A `city-data.js`-ben jelenleg csak egy irány van a 4-esnél (Jutaspuszta → Vámosi úti forduló), a visszaút hiányzik.
- **Teendő:** VGO oldalán és az eredeti PDF-ben manuálisan tisztázni a 4-es és 4A struktúráját (körjárat-e, hol a fordítópont, mik a helyes menetrendi idők)
- A GTFS-ben két trip van (dir:0 és dir:1) — ez alapul szolgálhat a visszaút rekonstruálásához

## 15. 11A busz koordináták

A 11A busznak van menetrendje a city-data.js-ben, de a VeszprémGO OTP rendszerben nincs aktív menetrend hozzá (üres arrivals, nem jelenik meg route-details-for-stop válaszokban). Valószínűleg csúcsidős/iskolai járat.
- Jelenleg directional algoritmust használ (menetirány-alapú SP választás) — ez elég pontos
- Ha a VGO rendszerbe kerül: újrafuttatni a scrape-route-stops.js-t és inject-coords.js-t

## Menetrend frissítés (új VeszprémBusz menetrend esetén)

### ✅ 16. PDF parser csere — ELAVULT, NEM KELL (2026-08-22)

Azóta megépült a `_gtfs_update/` pipeline (ld. `_gtfs_update/README.md`), ami a
hivatalos GTFS-forrásból (`gtfs.menetbrand.com`) frissíti mind a `city-data.js`-t,
mind az `intercity-data.js`-t — nincs többé szükség a nyomtatott PDF menetrend
szöveg-alapú kiolvasására. A `03-extract-veszprem.js`/`04-diff-veszprem.js` adja
a pontos, GTFS-forrású menetrend-adatot (kézi jóváhagyással beépítve), ez lecseréli
az itt leírt `parse-menetrend.js`/`pdfplumber` tervet. A `_tmp_geocoding/`-beli
PDF-alapú szkriptek (parse-menetrend.js, update-from-pdf.py/js, stb.) azóta
egyszeri, lezárt eszközök, nem kell tovább fejleszteni őket.

## VeszprémBusz teljes hálózat (city.html)

### ✅ 17. Hiányzó buszjáratok adatbázisa — KÉSZ

## Térképes nézet

### ✅ KÉSZ — Buszútvonalak megjelenítése térképen
- GPS koordináták + SP platform ID-k bekerültek a `city-data.js`-be (stop-editor2.html + manuális validálás)
- Leaflet.js + OpenStreetMap térképnézet a menetrend modalban (🗺 gomb), útvonal + megállók jelölőkkel
- Irány-helyes SP platform hozzárendelés (jobb-oldal szabály, `fix-rightside.js`)

## UI

### ✅ 18. Mission Board toggle — KÉSZ

### ✅ 19. Célállomás sor chip ugrálás — KÉSZ
