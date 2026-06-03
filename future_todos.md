# GoHome Planner — Future TODOs

## Adatstruktúra

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
