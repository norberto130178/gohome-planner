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


## Menetrend modal (city.html)

### ✅ 7. Munkanap/hétvége váltó — KÉSZ

### ✅ 8. Útvonal-változat jelzők a menetrend modalban — KÉSZ (2026-08-22-én ellenőrizve)
Megvalósítva: a `city-data.js` minden érintett indulásnál tárolja a `{t, n}` alakot (`n` = betűjelölés), minden érintett buszhoz van `footnotes` mező. A `timetable-modal.jsx` mindkét modalban (`BusTimetableModal` és `StopTimetableModal`) kirajzolja superscriptként az időpont mellett, plusz lábjegyzet-legenda a magyarázattal.

### ✅ 9. Compound annotációk kezelése a UI-ban — KÉSZ (2026-08-22-én ellenőrizve)
A `StopTimetableModal` (`timetable-modal.jsx` ~1373. sor, `usedFootnotes`) karakterenként bontja az `n` értéket, kis/nagybetű-független lookuppal (`fn[ch] || fn[ch.toUpperCase()]`) — a 13-as busz "Hv" jelölése (H + V külön footnote) helyesen mindkét magyarázatot megjeleníti. Az összes buszra (5,6,8,13,16,18,21,47) leellenőrizve: nincs olyan használt jelölés-karakter, aminek ne lenne footnote-szövege.

### ✅ 10. Shape–indulás összerendelés (térképnézet pontosítása) — KÉSZ (2026-08-22, v3.31)
Megvalósítva: minden induláshoz valódi GTFS `shape_id` van hozzárendelve egy külön generált fájlban (`city-dep-shapes.js`, `_gtfs_update/15-generate-dep-shapes.js`), a `BusRouteMap` ezt használja közvetlenül a heurisztika helyett. 100%-os lefedettség. Részletek: [[project-pending-issues]] "Városi buszvonalak térkép shape-választása".

## Adatstruktúra

### ✅ 11. Útvonal-változat jelzők (betűkódok az indulási időknél) — KÉSZ (2026-08-22-én ellenőrizve)
Megvalósítva: `departures` szerkezet `{t, n}` alakban tárolja a jelölős időpontokat, minden irányhoz van `footnotes` mező (`{ 'A': 'Vasútállomásig közlekedik', ... }`). Egy kapcsolódó, nem ellenőrzött kérdés (kezeli-e az útvonaltervező a rövidített indulásokat helyesen) átkerült az útvonaltervező-hibáról szóló memória-tételbe ([[project-future-tasks]] "FONTOS: útvonaltervező...").

### ✅ 12. Szombat/vasárnap külön menetrend — KÉSZ

### ✅ 13. Munkaszüneti napok kezelése — KÉSZ

### ✅ 14. 4-es és 4A busz — KÉSZ (2026-08-22)

Megvalósítva/kijavítva: a 4-es busznak MÁR MINDKÉT iránya megvan, teljes adattal (ez a leírás elavult volt). A 4A busz "visszafelé" iránya viszont VALÓDI HIBÁT tartalmazott: a `city-data.js`-ben a 4-es busz saját visszaútjának adatával volt összekeverve/duplikálva (19 megálló, "Jutaspuszta"-ig, "Vámosi úti forduló ▸ Jutaspuszta felé" felirattal) — a `04-diff-veszprem.js` diff-riportja alapján kiderült, hogy a valódi GTFS `direction_id=1` trip-je "Vámosi úti forduló → Veszprém vasútállomás" (17 megálló, tükrözi a saját odairányát). Kijavítva a valódi GTFS-adatból kinyert megállólistával; a `departures` blokk már eleve helyes volt (csak a `stops` és a `direction` felirat volt rossz). A `04-diff-veszprem.js` mostantól hangosan jelzi a `matchScore < 4` részleges párosításokat a konzolon, hogy ez a fajta hiba ne maradhasson észrevétlen egy jövőbeli frissítésnél sem — ld. részletesen [[project-pending-issues]].

### 15. 11A busz koordináták — ELAVULT, A 11A NEM IS LÉTEZIK (2026-08-22-én ellenőrizve)

A `city-data.js`-ben jelenleg NINCS "11A" azonosítójú busz (ellenőrizve, 0 találat) — ez a tétel elavult, a busz azóta törölve/átnevezve lett. A sima "11-es" busznak mindkét iránya megvan, teljes adattal, nincs vele probléma.

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
