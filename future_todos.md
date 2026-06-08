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

### Munkanap/hétvége váltó
A menetrend modal jelenleg mindig az aktuális nap típusát mutatja (ha hétvége van, hétvégi menetrendet). Nincs lehetőség kézzel váltani a két nézet között.
- Megoldás: Munkanapos / Hétvégi toggle gomb a modal fejlécébe (pl. a buszszám alatt)
- Ha a felhasználó manuálisan vált, azt megjegyezni az adott session idejére

### Útvonal-változat jelzők a menetrend modalban
A menetrendben egyes indulási időknél betűjelölések vannak (pl. `A`, `N`, `V`) amelyek azt jelzik, hogy az adott járat rövidebb vagy eltérő útvonalon megy. Ezek jelenleg nem jelennek meg a modalban, az adatokból ki is vannak szűrve.
- Szükséges: a betűjelölések tárolása az adatstruktúrában és megjelenítése az időpontoknál (pl. tooltip vagy kis badge)
- Lásd még: Adatstruktúra / Útvonal-változat jelzők fejezet

### Shape–indulás összerendelés (térképnézet pontosítása)
A 7-es, 10-es, 13-as buszoknál több GTFS shape létezik (különböző route variánsok), a térkép jelenleg heurisztikával választ közülük — ez nem mindig tökéletes.
- **Gyökér ok:** egy buszhoz minden megálló szerepel a `city-data.js`-ben (összes variáns), de egy adott indulás csak az egyik variáns shape-jéhez tartozik
- **Megoldás:** a betűjelölések bevezetésekor rendelni hozzá `shape_id`-t is — a GTFS `trips.txt`-ben a `trip_id → shape_id` kapcsolat megvan, ezt kell a menetrend adatokhoz kötni
- Ekkor egy konkrét induláshoz egyértelműen tudja a térkép a helyes shape-t kirajzolni, nincs szükség heurisztikára

## Adatstruktúra

### Útvonal-változat jelzők (betűkódok az indulási időknél)
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

### Szombat/vasárnap külön menetrend
Az adatbázisban (`city-buses.js`) a hétvégi indulási idők `weekend` kulcs alatt egybe vannak vonva. Az eredeti VeszprémBusz menetrendben egyes járatok csak szombaton, mások csak vasárnap közlekednek.
- Új struktúra: `weekend` → `saturday` + `sunday` (vagy `weekend` marad a közös járatokhoz, `saturday`/`sunday` csak ahol eltér)
- `city-buses.js` összes bejegyzését felül kell vizsgálni az eredeti menetrend alapján
- `getDeps` logikát frissíteni a `timetable-modal.jsx`-ben és a tervezőben

### Munkaszüneti napok kezelése
Jelenleg csak szombat/vasárnap = hétvégi menetrend. Magyar ünnepnapokon szintén hétvégi menetrend kell.
- Rögzített ünnepek: jan 1, márc 15, ápr 4, máj 1, aug 20, okt 23, nov 1, dec 25-26
- Mozgó ünnepek: húsvét, pünkösd — képlettel számítható
- Áthelyezett munkanapok (pótszombatok) éves manuális lista
- Ezt a szombat/vasárnap szétválasztással együtt célszerű megoldani

## 4-es és 4A busz — menetrend és útvonal tisztázása szükséges

A PDF menetrend a 4-es és 4A busznál értelmezhetetlen módon össze van vonva — a két irány táblái és valószínűleg a két járat adatai is keverednek. A `city-data.js`-ben jelenleg csak egy irány van a 4-esnél (Jutaspuszta → Vámosi úti forduló), a visszaút hiányzik.
- **Teendő:** VGO oldalán és az eredeti PDF-ben manuálisan tisztázni a 4-es és 4A struktúráját (körjárat-e, hol a fordítópont, mik a helyes menetrendi idők)
- A GTFS-ben két trip van (dir:0 és dir:1) — ez alapul szolgálhat a visszaút rekonstruálásához

## 11A busz koordináták

A 11A busznak van menetrendje a city-data.js-ben, de a VeszprémGO OTP rendszerben nincs aktív menetrend hozzá (üres arrivals, nem jelenik meg route-details-for-stop válaszokban). Valószínűleg csúcsidős/iskolai járat.
- Jelenleg directional algoritmust használ (menetirány-alapú SP választás) — ez elég pontos
- Ha a VGO rendszerbe kerül: újrafuttatni a scrape-route-stops.js-t és inject-coords.js-t

## Menetrend frissítés (új VeszprémBusz menetrend esetén)

Ha új menetrend lép érvénybe, a `city-data.js` teljes újraépítése szükséges:
- Megálló-sorrend forrása: nyomtatott/PDF menetrend (a VGO OTP scraper csak 1-2 megállót ad vissza járatonként, nem alkalmas erre)
- SP platformok + koordináták: `stop-editor2.html` + `_tmp_geocoding/` eszközök újrafuttathatók
- Néhány járatnál (pl. 18-as, 28-as) a Continental megálló kimaradt az eredeti adatból — új menetrendnél ellenőrizni, hogy minden megálló szerepel-e
- A `fix-rightside.js` elemző/javító script újrafuttatható az irány-hozzárendelések ellenőrzéséhez

## VeszprémBusz teljes hálózat (city.html)

### Hiányzó buszjáratok adatbázisa
A city.html útvonaltervező jelenleg csak a GoHome tervező 12 vonalát tartalmazza. A teljes VeszprémBusz hálózathoz ~30 vonal kell teljesen.
- Koordináták: Playwright scraper már működik (OTP API + menetirány-logika), újra futtatható
- Menetrend (indulási idők): OTP API-ból esetleg kinyerhető Playwright-tal, vagy kézi bevitel
- Érdemes megnézni van-e trip/timetable endpoint az OTP-ban amit Playwright-on keresztül el lehet érni

## Térképes nézet

### 47-es busz — farmuci járat, külön vizsgálat kell
A 47-es egy szokatlan szerkezetű járat: a `city-data.js`-ben Hotel az első megálló, de a GTFS shape autóbusz-állomástól indul, és Hotel csak a shape közepén (index 274/331) jelenik meg. Emiatt a térképen a vonal az autóbusz-állomástól indul, nem Hoteltől.
- Meg kell nézni az eredeti menetrend PDF-ben: tényleg Hoteltől indul-e, vagy adatbeviteli hiba
- Ha valóban Hotel-induló speciális variáns, saját shape kell hozzá (jelenleg nincs a GTFS-ben)
- Ha hiba a city-data.js-ben, javítani a megállósorrendet

### ✅ KÉSZ — Buszútvonalak megjelenítése térképen
- GPS koordináták + SP platform ID-k bekerültek a `city-data.js`-be (stop-editor2.html + manuális validálás)
- Leaflet.js + OpenStreetMap térképnézet a menetrend modalban (🗺 gomb), útvonal + megállók jelölőkkel
- Irány-helyes SP platform hozzárendelés (jobb-oldal szabály, `fix-rightside.js`)

## UI

### Mission Board toggle
A Mission Board jelenleg külön oldal (`mission.html`). Terv: toggle legyen a HazaÚt és Mission Board nézet között oldalnavigáció nélkül.
- Előbb a Mission Board oldalt kell újratervezni, utána integrálni a főoldalba
- Egyszerre kell átgondolni a böngészős és mobilos nézetet

### Célállomás sor chip ugrálás
Az Átszállás sorban a chipek (Komakút, Színház, Autóbusz-áll.) ugranak amikor a Célállomás keresőmező input↔pink gomb módot vált.
- Megpróbált megközelítések (mind kudarc): CSS grid, `position:absolute`, flex-in-flex
- Alapos böngészős debug kell (DevTools layout panel) — mi változik pontosan rendereléskor
- Esetleg ResizeObserver / ref mért szélesség alapú megközelítés
