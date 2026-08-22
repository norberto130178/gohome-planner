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

### 8. Útvonal-változat jelzők a menetrend modalban
A menetrendben egyes indulási időknél betűjelölések vannak (pl. `A`, `N`, `V`) amelyek azt jelzik, hogy az adott járat rövidebb vagy eltérő útvonalon megy. Ezek jelenleg nem jelennek meg a modalban, az adatokból ki is vannak szűrve.
- Szükséges: a betűjelölések tárolása az adatstruktúrában és megjelenítése az időpontoknál (pl. tooltip vagy kis badge)
- Lásd még: 11. Útvonal-változat jelzők adatstruktúra

### 9. Compound annotációk kezelése a UI-ban
Egyes indulási időknél több betűjelölés is érvényes egyszerre — pl. `Hv` = "csak Hotelig" + "csak vasárnap". Ezek `n: 'Hv'` alakban vannak tárolva a `city-data.js`-ben, a `footnotes` objektumban viszont `H` és `V` külön-külön szerepelnek.
- A `timetable-modal.jsx` jelenleg `footnotes[n]`-t keres — `'Hv'` esetén nem talál semmit
- **Megoldás:** az annotáció kiírásánál az `n` értéket karakterenként split-elni, és mindegyikhez külön `footnotes[char]` lookup-ot végezni
- Ugyanez vonatkozik a tooltip/badge megjelenítésre is: mindkét annotációt külön sorban vagy vesszővel elválasztva felsorolni
- Érintett vonal jelenleg: **13-as busz** hétvégi indulásai (`Hv`)

### 10. Shape–indulás összerendelés (térképnézet pontosítása)
A 7-es, 10-es, 13-as buszoknál több GTFS shape létezik (különböző route variánsok), a térkép jelenleg heurisztikával választ közülük — ez nem mindig tökéletes.
- **Gyökér ok:** egy buszhoz minden megálló szerepel a `city-data.js`-ben (összes variáns), de egy adott indulás csak az egyik variáns shape-jéhez tartozik
- **Megoldás:** a betűjelölések bevezetésekor rendelni hozzá `shape_id`-t is — a GTFS `trips.txt`-ben a `trip_id → shape_id` kapcsolat megvan, ezt kell a menetrend adatokhoz kötni
- Ekkor egy konkrét induláshoz egyértelműen tudja a térkép a helyes shape-t kirajzolni, nincs szükség heurisztikára

## Adatstruktúra

### 11. Útvonal-változat jelzők (betűkódok az indulási időknél)
A menetrend PDF-ben egyes indulási időpontok után betű áll, amely azt jelzi, hogy az adott járat egy rövidebb vagy eltérő útvonalon közlekedik. A betűk jelentése oldalanként eltérő, a PDF Megjegyzés szekciójából kiolvasható.

Példák:
- `A`: "Vasútállomásig közlekedik" (rövidebb végállomás)
- `T`: "Tüzér utcai fordulóig közlekedik"
- `V`: "Valeo, főporta érintése nélkül közlekedik"
- `H`, `U`, `N`, `o`, `v` stb.: más-más jelentés vonalaként

**Jelenlegi állapot:** a betűket a parser levágatja, az információ elvész.

**Szükséges fejlesztés:**
- `departures` struktúrában eltárolni a jelölős időpontokat külön: `{ time: 10, note: 'A' }`
- Minden irányhoz `footnotes` mező: `{ 'A': 'Vasútállomásig közlekedik', ... }`
- Útvonaltervező logikában figyelembe venni: ha a célmegálló nincs a rövidített útvonalon, az adott indulást ne ajánlja

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
