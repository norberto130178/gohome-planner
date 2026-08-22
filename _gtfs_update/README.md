# GTFS menetrend-frissítő pipeline

Erről a mappáról tudni kell legközelebb, amikor a menetrendet (`city-data.js`,
`intercity-data.js`) friss hivatalos adatokkal kell összevetni/frissíteni.

## Hivatalos GTFS-források

- **Veszprém helyi buszok**: `https://gtfs.menetbrand.com/download/veszprem/`
- **VOLÁNBUSZ helyközi (országos, ~100MB)**: `https://gtfs.menetbrand.com/download/volanbusz/`

Mindkettő ingyenes, regisztráció/API-kulcs nélküli, közvetlen GET. Ez a
MenetBrand GTFS-tükre — ugyanezt a forrást használja a menetrend.app is a
vidéki (nem budapesti) járatokhoz. A VOLÁNBUSZ saját `volanbusz.hu/hu/menetrendek/gtfs`
oldala mostanra a MÁV-csoportra irányít át (cégadatos igénylőlap), ezért ez a
MenetBrand-tükör a praktikusabb út.

## Script-lánc (ebben a sorrendben futtatva)

1. `curl` a fenti két URL-re → `veszprem/gtfs.zip`, `volanbusz/gtfs.zip`, majd `unzip`
2. `01-date-profile.js` — a helyi feed naponkénti trip-számából empirikusan
   megtalálja, mikor vált a "tanítási időszak" (workday) a "nyári szünet"
   (schoolholiday) menetrendre. **Ezt minden frissítéskor újra kell futtatni**,
   a `03-extract-veszprem.js`-ben lévő `WORKDAY_CUTOFF` konstans be van égetve
   az adott GTFS-snapshothoz.
2. `02-day-signatures.js` — feltáró script, megmutatja a service_id-k
   napszak-mintázatát (`_HP`/`_SZ`/`_VV` szuffixumok jelentése).
3. `03-extract-veszprem.js` — kinyeri a helyi buszok menetrendjét
   workday/schoolholiday/weekend bontásban, `veszprem-extracted.json`-be.
4. `04-diff-veszprem.js` — összeveti a jelenlegi `city-data.js`-t a friss
   kinyert adattal, `veszprem-diff.json` riportot ír. **A konzol-összefoglaló
   mostantól (2026-08-22 óta) hangosan kiírja a `matchScore < 4` (RÉSZLEGES)
   párosításokat is** — ez a diffCount-tól FÜGGETLEN jelzés, mert az
   időpont-összevetés csak az anchor megállónál történik, a végállomás/
   megállólista helyességét nem garantálja. Ez fogta meg (utólag, kézi
   nyomozással) hogy a 4A busz "vissza" iránya hónapokig a 4-es busz adatával
   volt összekeverve (`city-data.js`), miközben minden korábbi futás
   diffCount:0-t mutatott. Mindig nézd át kézzel ezeket a sorokat — némelyik
   ártalmatlan (pl. egy vonalnak genuinely több, eltérő hosszúságú
   route-variánsa van, mint a 2/5/47-es busznál), de előfordulhat köztük
   valódi adathiba is, mint a 4A esetében volt.
5. `05-filter-intercity-trips.js` — az országos VOLÁNBUSZ GTFS-ből kiszűri a
   Nemesvámos-i vonalakat (`WANTED_LINES` tömb — **ha új vonal kerül be, ezt
   kézzel bővíteni kell**).
6. `06-filter-stop-times.js` — streamelve kiszűri a 100MB-os `stop_times.txt`-ből
   a releváns trip-eket (ne próbáld egyben `readFileSync`-elni, túl nagy).
7. `07-extract-intercity.js` — kinyeri a szűrt trip-ek teljes megálló-idő
   táblázatát, napszak-besorolással (a `calendar.txt` `service_desc` szövegéből,
   ld. lentebb).
8. `08-diff-intercity.js` — összeveti az `intercity-data.js`-t a friss adattal,
   a Nemesvámos-i megállóra (`autóbusz-váróterem`/`autóbusz-forduló`) horgonyozva.
9. `09-regenerate-intercity.js` — a jóváhagyott eltérések alapján teljesen
   újragenerálja az érintett irányok `trips` tömbjét (a `stops` listát
   érintetlenül hagyja).
10. `10-apply-intercity.js` — beírja az újragenerált adatot az
    `intercity-data.js`-be (JSON-parse → mező-csere → visszaírás, formátum
    megtartva).
11. `11-add-platform-codes.js` — a `stops.txt` `platform_code` mezőjét
    beírja minden `intercity-data.js`-beli megálló-előfordulásba
    (`platformCode` mező) — ez adja a megálló-néző címkézési hierarchiájának
    legmagasabb prioritású forrását (`data.js` `_intercityPlatforms()`).
    Kell hozzá futtatás után `10-apply-intercity.js` után.
12. `12-verify-against-raw.js` — **független** ellenőrzés: KÖZVETLENÜL a
    nyers `trips.txt`+`calendar.txt`+`intercity-filtered-stop-times.json`
    fájlokból építi fel az "igazságot" (nem a pipeline saját extract/
    regenerate köztes kimenetét használja), és összeveti azzal, amit
    `getIntercityDeparturesForPlatformLabel` ténylegesen visszaadna minden
    app-beli platform × napszak kombinációra. **Minden érdemi módosítás után
    futtasd** — ez fogta meg a `09-regenerate-intercity.js` canonical-
    ordering hibáját ÉS a `getIntercityDeparturesForPlatformLabel`
    "üres indulási lista a modellezett szakasz végén" hibáját is
    (2026-08-21). A script maga a WANTED_LINES-ban szereplő ÖSSZES vonalat
    (jelenleg `7367`, `7376` is) beleszámolja az "igazságba" — ha ezek nem
    részei az app 13 modellezett route/dir-jének, a köztük lévő átfedő
    (megosztott, pl. "Veszprém, József Attila utca") megállóknál emiatt
    lesznek "raw-ban van, app-ban nincs" típusú, VÁRHATÓ eltérések — ez nem
    hiba, csak azt jelenti, hogy azok a vonalak nincsenek modellezve. Ha
    valódi hibát keresel, szűrj csak a 7 saját vonalra (`OUR_LINES`,
    ld. a script forrását egy módosított változatban, vagy egyszerűen nézd
    át kézzel az eltéréseket route_short_name szerint).

13. `14-generate-city-shapes.js` — legenerálja a `city-shapes.js`-t
    (városi buszok térkép-vonalai) a `veszprem/` mappa `shapes.txt`+
    `trips.txt`+`routes.txt`-jéből — UGYANABBÓL a snapshotból, mint a
    `03-extract-veszprem.js`, hogy a `shape_id`-k garantáltan egyezzenek a
    kettő közt (korábban egy külön, elavuló `_tmp_geocoding/` snapshotot
    használó, nem dokumentált szkript — `_temp/generate-city-shapes.js` —
    végezte ezt, most a rutin lánc része). A WANTED busz-lista a
    `city-data.js`-ből származik (nem kézzel karbantartott tömb).
14. `15-generate-dep-shapes.js` — legenerálja a `city-dep-shapes.js`-t:
    minden városi busz-induláshoz (busId+irány+napszak+perc) hozzárendeli a
    valódi GTFS `shape_id`-t, a `04-diff-veszprem.js`-ével azonos
    anchor-stop-illesztéssel. **Teljesen KÜLÖN fájl a `city-data.js`-től**
    (az kézi kurálás, tömör JS-literál formátumú, nem tiszta JSON — gépi
    visszaírás kockázatos lenne rá). A `timetable-modal.jsx` `BusRouteMap`-je
    ezt olvassa ki, hogy egy kiválasztott induláshoz a MEGFELELŐ GTFS
    shape-variánst rajzolja ki a térképre (nem egy végpont-távolság+
    megálló-lefedettség heurisztikával találgatva, ami igazoltan rossz
    variánst is választhatott — pl. a 13-as busz "Hotelig" rövidített
    indulásainál a teljes hosszú útvonalat rajzolta ki, 2026-08-22-én
    javítva). Kétséges esetek (egy percen belül több eltérő shapeId)
    kihagyva a lookupból — ilyenkor a `BusRouteMap` a régi heurisztikára
    esik vissza, változatlanul. Jelenleg 100%-os a lefedettség (2141/2141
    induláshoz sikerült shape_id-t rendelni).

**FONTOS jövőbeli GTFS-frissítéskor**: a `14`/`15` lépéseket IS újra kell
futtatni a `03-extract-veszprem.js` után (nem csak a helyközi 05-12 láncot)
— korábban a `city-shapes.js` generálása teljesen külön, nem dokumentált
folyamat volt, könnyű volt elfelejteni.

## Kézi, egyszeri patch-scriptek (nem a fenti automatikus lánc része)

- `13-add-missing-stops.js` — a 2026-08-21-i útvonal-áttekintés során,
  útvonalanként a userrel egyeztetve hozzáadott hiányzó (de valóban
  Nemesvámos belterületi) megállók a `stops` listákhoz (`7361`/`7363`/`7366`
  `iskola`, plusz `7366` `haza`/`iskola` levágások a fordulónál). Idempotens
  (újrafuttatható, kihagyja a már megtörtént módosításokat), de **ne bővítsd
  tovább vakon** — minden route/dir-hez tartozó döntés a userrel egyeztetve,
  nyers GTFS trip-ek teljes kilistázásával lett meghozva, ne generalizálj egy
  mintatrip-ből. Ha legközelebb egy ÚJ GTFS-ben más/több stop jelenik meg,
  ugyanezt a manuális, route-onkénti átvizsgálási folyamatot kell megismételni
  — ez NEM automatizálható biztonságosan (a döntés mindig "ez tényleg
  Nemesvámos belterületi, ténylegesen használt megálló-e" jellegű ítélet).

## Amit tudni kell / ne ess bele ugyanabba a hibába

- **Ne az "első GTFS-sor" legyen az időpont-referencia egy irányhoz** — előfordul,
  hogy egy GTFS trip egy plusz megállóval kezdődik az app modelljében szereplő
  "első megálló" előtt (pl. a 2-es busz Endrődi iránya valójában a Harmat
  utcáról indul, 1 perccel korábban, minden egyes indulásnál). Mindig a
  konkrét megálló-azonosítóra (`stop_id`/`spId`) horgonyozz, ne pozícióra.
  Ha egy ilyen eltérés **100%-ban konzisztens** az összes trip-en, az valós
  hiányzó megálló, nem hiba a diffben — ha csak **egy kisebbség**-nél (kb.
  <20%) jelenik meg, az általában legit rövidített/alternatív útvonalváltozat,
  nem kell vele foglalkozni.
- A helyi feed `calendar_dates.txt`-je szuffixum-kódolt service_id-ket használ
  (`_HP`=hétköznap, `_SZ`=szombat-típus, `_VV`=vasárnap/ünnep-típus).
- A helyközi (országos) feed `calendar.txt` `service_desc` mezője emberi
  olvasható magyar szöveg (pl. "iskolai előadási napokon", "tanszünetben
  munkanapokon", "munkanapokon" — ez utóbbi **egész évben** fut, term-független).
- A `schedules.js`-ben lévő `window.SCHEDULES` objektumot **semelyik élő kód
  nem használja** — az `intercity-data.js` `INTERCITY_BUSES_FULL`-ja a
  ténylegesen futó adat (ezt olvassa a `data.js`).

## Mi NEM automatikus még

- A `city-data.js` (helyi buszok) frissítése **kézi jóváhagyást igényel** —
  a diff riportot át kell nézni, és a `04-diff-veszprem.js` kimenete alapján
  kézzel kell szerkeszteni a fájlt. Ez szándékos (a kézi átnézés fogta meg a
  Harmat utca-hiányt és egy saját anchor-hibát is).
- Az `intercity-data.js` **`stops` listája** (melyik fizikai megállókon halad
  át egy-egy route/dir) **szintén kézi kurálás**, a `09-regenerate-intercity.js`
  ezt SOSEM módosítja (csak a `trips`/idő adatokat generálja újra a meglévő
  `stops` lista alapján — ld. fent, 9. pont). Ez a "jó hír" a jövőbeli
  GTFS-frissítésekhez: **ha csak a MENETREND (idők, új/törölt indulások)
  változik**, elég újra futtatni a `05→06→07→09→10→11→12` láncot — a
  megálló-listát NEM kell újra manuálisan átvizsgálni. A `08-diff-intercity.js`
  jelzi, ha a friss GTFS-ben olyan eltérés van, ami arra utal, hogy egy route
  ténylegesen MÁS fizikai megállókon halad át, mint eddig (ritka, de
  előfordulhat) — csak EBBEN az esetben kell a 2026-08-21-i route-by-route
  átvizsgálási folyamatot (ld. `13-add-missing-stops.js` fejléce) megismételni,
  és csak az érintett route/dir-re, nem az egészre.
- A letöltési lépés (`curl`) nincs scriptbe rakva.
- A `veszprem/gtfs.zip` és `volanbusz/gtfs.zip` (és a kicsomagolt tartalmuk)
  nagy fájlok, nincsenek git alá véve — újra le kell tölteni, ha ez a mappa
  törlődik.
