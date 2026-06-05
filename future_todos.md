# GoHome Planner — Future TODOs

## Menetrend modal (city.html)

### Munkanap/hétvége váltó
A menetrend modal jelenleg mindig az aktuális nap típusát mutatja (ha hétvége van, hétvégi menetrendet). Nincs lehetőség kézzel váltani a két nézet között.
- Megoldás: Munkanapos / Hétvégi toggle gomb a modal fejlécébe (pl. a buszszám alatt)
- Ha a felhasználó manuálisan vált, azt megjegyezni az adott session idejére

### Útvonal-változat jelzők a menetrend modalban
A menetrendben egyes indulási időknél betűjelölések vannak (pl. `A`, `N`, `V`) amelyek azt jelzik, hogy az adott járat rövidebb vagy eltérő útvonalon megy. Ezek jelenleg nem jelennek meg a modalban, az adatokból ki is vannak szűrve.
- Szükséges: a betűjelölések tárolása az adatstruktúrában és megjelenítése az időpontoknál (pl. tooltip vagy kis badge)
- Lásd még: Adatstruktúra / Útvonal-változat jelzők fejezet

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
