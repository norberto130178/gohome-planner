// ============================================================
// City Buses — Veszprém teljes helyi buszjárat-adatbázis
// ============================================================
// Forrás: menetrend-v2-text.txt (VeszprémGO, érvényes 2026. március 1-től)
// 53 oldalas menetrend, minden járat mindkét irányban
// ============================================================

window.CITY_BUSES_FULL = [

// ── LINE 1 ────────────────────────────────────────────────
{
  id: "1",
  color: "#26A69A",
  label: "1-es busz",
  direction: "Veszprém vasútállomás ▸ Aulich Lajos utca - Valeo, főporta felé",
  stops: [
    { name: "Veszprém vasútállomás", offset: 0 },
    { name: "Aulich Lajos utca", offset: 1 },
    { name: "Laktanya", offset: 2 },
    { name: "Jutasi úti lakótelep", offset: 3 },
    { name: "Jutasi út / Barátság park", offset: 4 },
    { name: "Petőfi Sándor utca", offset: 5 },
    { name: "Veszprém autóbusz-állomás", offset: 7 },
    { name: "Hotel", offset: 8 },
    { name: "Petőfi Színház", offset: 10 },
    { name: "Harmat utca", offset: 11 },
    { name: "Völgyhíd tér", offset: 12 },
    { name: "Pápai út 25.", offset: 13 },
    { name: "Pápai úti forduló (körforgalom)", offset: 14 },
    { name: "Pápai út / Henger utca", offset: 15 },
    { name: "BALLUFF / JOST", offset: 16 },
    { name: "Valeo", offset: 17 },
    { name: "Valeo, főporta", offset: 18 },
  ],
  departures: {
    workday: { 5: [15,25,54], 6: [35], 7: [5,40], 8: [20], 13: [23,53], 14: [23,53], 15: [23,53], 16: [23,53], 21: [20] },
    weekend: { 5: [25], 13: [23], 21: [25] }
  }
},
{
  id: "1",
  color: "#26A69A",
  label: "1-es busz",
  direction: "Valeo, főporta ▸ Jutasi út / Barátság park - Veszprém vasútállomás felé",
  stops: [
    { name: "Valeo, főporta", offset: 0 },
    { name: "Valeo", offset: 1 },
    { name: "BALLUFF / JOST", offset: 2 },
    { name: "Pápai út / Henger utca", offset: 3 },
    { name: "Pápai úti forduló (körforgalom)", offset: 4 },
    { name: "Pápai út 25.", offset: 5 },
    { name: "Völgyhíd tér", offset: 6 },
    { name: "Harmat utca", offset: 7 },
    { name: "Petőfi Színház", offset: 8 },
    { name: "Hotel", offset: 10 },
    { name: "Veszprém autóbusz-állomás", offset: 12 },
    { name: "Petőfi Sándor utca", offset: 13 },
    { name: "Jutasi út / Barátság park", offset: 15 },
    { name: "Jutasi úti lakótelep", offset: 16 },
    { name: "Laktanya", offset: 17 },
    { name: "Aulich Lajos utca", offset: 18 },
    { name: "Veszprém vasútállomás", offset: 19 },
  ],
  departures: {
    workday: { 6: [14,58], 7: [30], 8: [4,42], 13: [46], 14: [16,46], 15: [16,46], 16: [16,46], 17: [16], 22: [10] },
    weekend: { 6: [14], 14: [14], 22: [10] }
  }
},

// ── LINE 2 ────────────────────────────────────────────────
{
  id: "2",
  color: "#1565C0",
  label: "2-es busz",
  direction: "Veszprém vasútállomás ▸ Komakút tér / Pannon Egyetem felé",
  stops: [
    { name: "Veszprém vasútállomás", offset: 0 },
    { name: "Aulich Lajos utca", offset: 1 },
    { name: "Láhner György utca", offset: 2 },
    { name: "Aulich utca, garázstelep", offset: 2 },
    { name: "Deák Ferenc iskola", offset: 3 },
    { name: "Aradi vértanúk utca", offset: 4 },
    { name: "Laktanya", offset: 5 },
    { name: "Jutasi úti lakótelep", offset: 6 },
    { name: "Jutasi út / Barátság park", offset: 7 },
    { name: "Petőfi Sándor utca", offset: 8 },
    { name: "Veszprém autóbusz-állomás", offset: 9 },
    { name: "Hotel", offset: 10 },
    { name: "Petőfi Színház", offset: 12 },
    { name: "Harmat utca", offset: 13 },
    { name: "Endrődi Sándor lakótelep", offset: 14 },
    { name: "Endrődi Sándor utca", offset: 15 },
    { name: "Kiskőrösi utca", offset: 16 },
    { name: "Pázmándi utca", offset: 16 },
    { name: "Komakút tér / Pannon Egyetem", offset: 17 },
  ],
  departures: {
    workday: { 5: [32], 6: [7,47], 7: [20], 8: [0,40], 9: [20], 10: [0,40], 11: [20], 12: [0,40], 13: [10,40], 14: [10,40], 15: [10,40], 16: [10,40], 17: [10,40], 18: [20], 19: [0,40], 20: [40], 21: [40] },
    weekend: { 6: [20], 7: [20], 8: [20], 9: [20], 10: [20], 11: [20], 12: [20], 13: [20], 14: [20], 15: [20], 16: [20], 17: [20], 18: [20], 19: [20], 20: [20], 21: [40] }
  }
},
{
  id: "2",
  color: "#1565C0",
  label: "2-es busz",
  direction: "Endrődi Sándor lakótelep ▸ Veszprém vasútállomás felé",
  stops: [
    { name: "Endrődi Sándor lakótelep", offset: 0 },
    { name: "Endrődi Sándor utca", offset: 0 },
    { name: "Kiskőrösi utca", offset: 1 },
    { name: "Pázmándi utca", offset: 2 },
    { name: "Komakút tér / Pannon Egyetem", offset: 3 },
    { name: "Petőfi Színház", offset: 4 },
    { name: "Hotel", offset: 5 },
    { name: "Veszprém autóbusz-állomás", offset: 7 },
    { name: "Petőfi Sándor utca", offset: 8 },
    { name: "Jutasi út / Barátság park", offset: 9 },
    { name: "Jutasi úti lakótelep", offset: 10 },
    { name: "Laktanya", offset: 11 },
    { name: "Aradi vértanúk utca", offset: 12 },
    { name: "Deák Ferenc iskola", offset: 13 },
    { name: "Aulich utca, garázstelep", offset: 14 },
    { name: "Láhner György utca", offset: 15 },
    { name: "Veszprém vasútállomás", offset: 17 },
  ],
  departures: {
    workday: { 5: [47], 6: [25], 7: [5,41], 8: [19,59], 9: [39], 10: [19,59], 11: [39], 12: [19,59], 13: [29,59], 14: [29,59], 15: [30], 16: [0,30], 17: [0,28,58], 18: [37], 19: [16,56], 20: [56] },
    weekend: { 5: [25], 6: [35], 7: [35], 8: [37], 9: [37], 10: [37], 11: [37], 12: [37], 13: [37], 14: [37], 15: [37], 16: [37], 17: [37], 18: [37], 19: [35], 20: [35] }
  }
},

// ── LINE 3 ────────────────────────────────────────────────
{
  id: "3",
  color: "#EC407A",
  label: "3-as busz",
  direction: "Haszkovó forduló ▸ Csererdő felé",
  stops: [
    { name: "Haszkovó forduló", offset: 0 },
    { name: "Haszkovó utca", offset: 1 },
    { name: "Őrház utca", offset: 2 },
    { name: "Pipacs utca", offset: 3 },
    { name: "Petőfi Sándor utca", offset: 4 },
    { name: "Veszprém autóbusz-állomás", offset: 5 },
    { name: "Hotel", offset: 6 },
    { name: "Petőfi Színház", offset: 8 },
    { name: "Harmat utca", offset: 9 },
    { name: "Völgyhíd tér", offset: 10 },
    { name: "Pápai út 25.", offset: 11 },
    { name: "Tizenháromváros tér", offset: 12 },
    { name: "Dózsa György tér", offset: 13 },
    { name: "Vértanú utca", offset: 15 },
    { name: "Avar utca", offset: 16 },
    { name: "Ipar utca", offset: 17 },
    { name: "Fórum", offset: 19 },
    { name: "Házgyár", offset: 20 },
    { name: "Bakony Művek", offset: 21 },
    { name: "Csererdő", offset: 22 },
  ],
  departures: {
    workday: { 4: [55], 5: [8,18,28,48], 6: [8,26,44], 7: [0,16,33,53], 8: [13,43], 9: [13,43], 10: [13,43], 11: [13,43], 12: [13,43], 13: [3,13,33,53], 14: [13,33,53], 15: [13,33,53], 16: [13,33,53], 17: [13,43], 18: [13,43], 19: [13,43], 20: [13], 21: [17], 22: [15] },
    weekend: { 5: [18], 6: [18], 7: [18], 8: [18], 9: [18], 10: [18], 11: [18], 12: [18], 13: [23], 14: [18], 15: [18], 16: [18], 17: [18], 18: [18], 19: [18], 20: [18], 21: [23], 22: [15] }
  }
},
{
  id: "3",
  color: "#EC407A",
  label: "3-as busz",
  direction: "Csererdő ▸ Haszkovó forduló felé",
  stops: [
    { name: "Csererdő", offset: 0 },
    { name: "Bakony Művek", offset: 0 },
    { name: "Házgyár", offset: 1 },
    { name: "Fórum", offset: 2 },
    { name: "Ipar utca", offset: 3 },
    { name: "Avar utca", offset: 4 },
    { name: "Vértanú utca", offset: 5 },
    { name: "Dózsa György tér", offset: 6 },
    { name: "Tizenháromváros tér", offset: 7 },
    { name: "Pápai út 25.", offset: 8 },
    { name: "Völgyhíd tér", offset: 9 },
    { name: "Harmat utca", offset: 10 },
    { name: "Petőfi Színház", offset: 11 },
    { name: "Hotel", offset: 13 },
    { name: "Veszprém autóbusz-állomás", offset: 15 },
    { name: "Petőfi Sándor utca", offset: 16 },
    { name: "Pipacs utca", offset: 18 },
    { name: "Akácfa utca", offset: 18 },
    { name: "Őrház utca", offset: 19 },
    { name: "Haszkovó utca", offset: 20 },
    { name: "Haszkovó forduló", offset: 21 },
  ],
  departures: {
    workday: { 5: [0,20,40], 6: [0,17,34,52], 7: [12,32,52], 8: [13,43], 9: [13,43], 10: [13,43], 11: [13,43], 12: [13,43], 13: [13,43], 14: [0,10,22,42], 15: [2,22,42], 16: [2,12,22,42], 17: [11,41], 18: [11,41], 19: [6,41], 20: [11], 21: [11], 22: [10] },
    weekend: { 5: [25], 6: [10,45], 7: [45], 8: [45], 9: [45], 10: [45], 11: [45], 12: [45], 14: [5,45], 15: [45], 16: [45], 17: [45], 18: [45], 19: [45], 20: [45], 22: [10] }
  }
},

// ── LINE 4 (from Jutaspuszta) ─────────────────────────────
{
  id: "4",
  color: "#66BB6A",
  label: "4-es busz",
  direction: "Jutaspuszta ▸ Vámosi úti forduló felé",
  stops: [
    { name: "Jutaspuszta", offset: 0 },
    { name: "Kisréti utca", offset: 1 },
    { name: "Jutaspusztai elágazás", offset: 2 },
    { name: "Veszprém vasútállomás", offset: 10 },
    { name: "Aulich Lajos utca", offset: 11 },
    { name: "Laktanya", offset: 11 },
    { name: "Haszkovó utca", offset: 13 },
    { name: "Munkácsy Mihály utca", offset: 14 },
    { name: "Petőfi Sándor utca", offset: 15 },
    { name: "Veszprém autóbusz-állomás", offset: 16 },
    { name: "Hotel", offset: 17 },
    { name: "Megyeház tér", offset: 19 },
    { name: "Komakút tér / Pannon Egyetem", offset: 20 },
    { name: "Egyetem utca / ActiCity", offset: 21 },
    { name: "Egyetem utca / Stadion utca", offset: 23 },
    { name: "Stadion utca / Wartha Vince utca", offset: 24 },
    { name: "Stadion", offset: 25 },
    { name: "Szegfű utca", offset: 26 },
    { name: "József Attila utca / egyetemi kollégium", offset: 27 },
    { name: "Vámosi úti forduló", offset: 28 },
  ],
  departures: {
    workday: { 5: [11], 6: [9], 7: [0], 8: [0], 9: [0], 10: [0], 11: [0], 12: [0], 13: [0], 14: [0], 15: [0], 16: [0], 17: [0], 18: [0], 19: [0], 20: [0], 21: [0] },
    weekend: { 4: [58], 5: [58], 6: [57], 8: [0], 9: [0], 10: [0], 11: [0], 12: [0], 13: [0], 14: [0], 15: [0], 16: [0], 17: [0], 18: [0], 19: [0], 20: [28] }
  }
},

// ── LINE 4A (from Veszprém vasútállomás to Vámosi) ────────
{
  id: "4A",
  color: "#66BB6A",
  label: "4A-s busz",
  direction: "Veszprém vasútállomás ▸ Vámosi úti forduló felé",
  stops: [
    { name: "Veszprém vasútállomás", offset: 0 },
    { name: "Aulich Lajos utca", offset: 1 },
    { name: "Laktanya", offset: 1 },
    { name: "Haszkovó utca", offset: 3 },
    { name: "Munkácsy Mihály utca", offset: 4 },
    { name: "Petőfi Sándor utca", offset: 5 },
    { name: "Veszprém autóbusz-állomás", offset: 6 },
    { name: "Hotel", offset: 7 },
    { name: "Megyeház tér", offset: 9 },
    { name: "Komakút tér / Pannon Egyetem", offset: 10 },
    { name: "Egyetem utca / ActiCity", offset: 11 },
    { name: "Egyetem utca / Stadion utca", offset: 13 },
    { name: "Stadion utca / Wartha Vince utca", offset: 14 },
    { name: "Stadion", offset: 15 },
    { name: "Szegfű utca", offset: 16 },
    { name: "József Attila utca / egyetemi kollégium", offset: 17 },
    { name: "Vámosi úti forduló", offset: 18 },
  ],
  departures: {
    workday: { 5: [0,19,39,58], 6: [17,29,42,55], 7: [8,23,38,53], 8: [8,23,38], 9: [8,38], 10: [8,38], 11: [8,38], 12: [8,38], 13: [8,28,43], 14: [8,23,38,53], 15: [8,23,38,53], 16: [8,23,38,53], 17: [8,23,43], 18: [8,38], 19: [8,38], 20: [8,38], 21: [10,40], 22: [38] },
    weekend: { 5: [5], 6: [5], 7: [4,38], 8: [8,38], 9: [8,38], 10: [8,38], 11: [8,38], 12: [8,38], 13: [8,38], 14: [8,38], 15: [8,38], 16: [8,38], 17: [8,38], 18: [8,38], 19: [10,38], 20: [38], 21: [40], 22: [38] }
  }
},

// ── LINE 4/4A return: Vámosi -> Jutaspuszta ───────────────
{
  id: "4A",
  color: "#66BB6A",
  label: "4A-s busz",
  direction: "Vámosi úti forduló ▸ Jutaspuszta felé",
  stops: [
    { name: "Vámosi úti forduló", offset: 0 },
    { name: "József Attila utca / egyetemi kollégium", offset: 1 },
    { name: "Szegfű utca", offset: 2 },
    { name: "Stadion", offset: 3 },
    { name: "Stadion utca / Wartha Vince utca", offset: 4 },
    { name: "Egyetem utca / Stadion utca", offset: 5 },
    { name: "Egyetem utca / ActiCity", offset: 7 },
    { name: "Komakút tér / Pannon Egyetem", offset: 8 },
    { name: "Petőfi Színház", offset: 9 },
    { name: "Hotel", offset: 11 },
    { name: "Veszprém autóbusz-állomás", offset: 13 },
    { name: "Petőfi Sándor utca", offset: 14 },
    { name: "Munkácsy Mihály utca", offset: 15 },
    { name: "Haszkovó utca", offset: 17 },
    { name: "Laktanya", offset: 19 },
    { name: "Aulich Lajos utca", offset: 20 },
    { name: "Veszprém vasútállomás", offset: 21 },
    { name: "Kisréti utca", offset: 25 },
    { name: "Jutaspuszta", offset: 26 },
  ],
  departures: {
    workday: { 4: [48], 5: [25,45], 6: [0,15,30,44,58], 7: [12,27,43,59], 8: [14,34,54], 9: [24,54], 10: [24,54], 11: [24,54], 12: [24,44], 13: [2,22,37,52], 14: [7,22,37,52], 15: [9,24,39,54], 16: [9,24,43], 17: [2,22,40], 18: [2,25,55], 19: [25,55], 20: [25,57], 21: [30], 22: [0] },
    weekend: { 4: [52], 6: [0,55], 7: [25,55], 8: [25,55], 9: [25,55], 10: [25,55], 11: [25,55], 12: [25,55], 13: [25,55], 14: [25,55], 15: [25,55], 16: [25,55], 17: [25,55], 18: [25,55], 19: [57], 20: [57], 21: [30], 22: [0] }
  }
},

// ── LINE 5 ────────────────────────────────────────────────
{
  id: "5",
  color: "#AB47BC",
  label: "5-ös busz",
  direction: "Veszprém vasútállomás ▸ Kádártai úti forduló felé",
  stops: [
    { name: "Veszprém vasútállomás", offset: 0 },
    { name: "Tüzér utcai forduló", offset: 5 },
    { name: "Papvásár utca", offset: 6 },
    { name: "Tüzér utca", offset: 7 },
    { name: "Dózsa György tér", offset: 8 },
    { name: "Tizenháromváros tér", offset: 9 },
    { name: "Pápai út 25.", offset: 10 },
    { name: "Völgyhíd tér", offset: 11 },
    { name: "Harmat utca", offset: 12 },
    { name: "Petőfi Színház", offset: 13 },
    { name: "Hotel", offset: 15 },
    { name: "Kabay János utca", offset: 16 },
    { name: "Ady Endre utca", offset: 17 },
    { name: "Ady Endre utca / Cholnoky Jenő utca", offset: 18 },
    { name: "Cholnoky lakótelep", offset: 19 },
    { name: "Cholnoky forduló", offset: 20 },
    { name: "Hérics utca", offset: 21 },
    { name: "Lóczy Lajos utca", offset: 22 },
    { name: "Csillag utca", offset: 23 },
    { name: "Vilonyai utca", offset: 24 },
    { name: "Budapest út", offset: 25 },
    { name: "Bolgár Mihály utca", offset: 27 },
    { name: "Kádártai úti forduló", offset: 28 },
  ],
  departures: {
    workday: { 5: [26,56], 6: [22], 7: [7,40], 8: [38], 9: [38], 10: [38], 11: [38], 12: [38], 13: [38,58], 14: [38,58], 15: [38,58], 16: [38], 17: [38], 18: [38], 19: [38], 20: [38], 21: [38] },
    weekend: { 5: [26], 6: [26], 7: [38], 8: [38], 9: [38], 10: [38], 11: [38], 12: [38], 13: [38], 14: [38], 15: [38], 16: [38], 17: [38], 18: [38], 19: [38], 20: [38], 21: [38] }
  }
},
{
  id: "5",
  color: "#AB47BC",
  label: "5-ös busz",
  direction: "Kádártai úti forduló ▸ Veszprém vasútállomás felé",
  stops: [
    { name: "Kádártai úti forduló", offset: 0 },
    { name: "Bolgár Mihály utca", offset: 1 },
    { name: "Budapest út", offset: 2 },
    { name: "Vilonyai utca", offset: 3 },
    { name: "Csillag utca", offset: 4 },
    { name: "Lóczy Lajos utca", offset: 5 },
    { name: "Hérics utca", offset: 6 },
    { name: "Cholnoky forduló", offset: 7 },
    { name: "Cholnoky lakótelep", offset: 8 },
    { name: "Ady Endre utca / Cholnoky Jenő utca", offset: 9 },
    { name: "Ady Endre utca", offset: 10 },
    { name: "Diófa utca", offset: 11 },
    { name: "Hotel", offset: 13 },
    { name: "Petőfi Színház", offset: 15 },
    { name: "Harmat utca", offset: 16 },
    { name: "Völgyhíd tér", offset: 18 },
    { name: "Pápai út 25.", offset: 19 },
    { name: "Tizenháromváros tér", offset: 20 },
    { name: "Dózsa György tér", offset: 21 },
    { name: "Tüzér utca", offset: 22 },
    { name: "Papvásár utca", offset: 23 },
    { name: "Tüzér utcai forduló", offset: 24 },
    { name: "Jutaspusztai elágazás", offset: 25 },
    { name: "Veszprém vasútállomás", offset: 29 },
  ],
  departures: {
    workday: { 4: [41], 5: [11,53], 6: [27,54], 7: [11,45], 8: [45], 9: [45], 10: [45], 11: [45], 12: [45], 13: [15,55], 14: [15,53], 15: [13,53], 16: [13,53], 17: [50], 18: [50], 19: [50], 21: [0], 22: [10] },
    weekend: { 4: [46], 5: [54], 6: [54], 7: [54], 8: [54], 9: [54], 10: [54], 11: [54], 12: [54], 13: [54], 14: [54], 15: [54], 16: [54], 17: [54], 18: [54], 19: [54], 21: [0], 22: [10] }
  }
},

// ── LINE 6/16 (Haszkovó → Vámosi) ────────────────────────
{
  id: "6",
  color: "#FDD835",
  label: "6-os busz",
  direction: "Haszkovó forduló ▸ Vámosi úti forduló felé",
  stops: [
    { name: "Haszkovó forduló", offset: 0 },
    { name: "Aradi vértanúk utca", offset: 1 },
    { name: "Deák Ferenc iskola", offset: 2 },
    { name: "Március 15. utca", offset: 4 },
    { name: "Tölgyfa utca", offset: 5 },
    { name: "Bolgár Mihály utca", offset: 6 },
    { name: "Budapest út", offset: 7 },
    { name: "Viola utca", offset: 8 },
    { name: "Rózsa utca", offset: 9 },
    { name: "Hotel", offset: 11 },
    { name: "Megyeház tér", offset: 13 },
    { name: "Komakút tér / Pannon Egyetem", offset: 14 },
    { name: "Egyetem utca / ActiCity", offset: 15 },
    { name: "Dugovics Titusz utca", offset: 17 },
    { name: "Paál László utca", offset: 18 },
    { name: "Egry József utca", offset: 19 },
    { name: "Kemecse utca", offset: 20 },
    { name: "Stadion utca / Kemecse utca", offset: 21 },
    { name: "Vámosi úti forduló", offset: 23 },
  ],
  departures: {
    workday: { 4: [48], 5: [8,28,48], 6: [7,22,34,48], 7: [2,16,31,46], 8: [1,16,31,51], 9: [23,53], 10: [23,53], 11: [23,53], 12: [23,53], 13: [18,36,55], 14: [15,31,46], 15: [1,16,31,46], 16: [1,16,32,47], 17: [2,17,35,55], 18: [23,53], 19: [23,53], 20: [23,53], 21: [24,54] },
    weekend: { 4: [48], 5: [35], 6: [35], 7: [23,53], 8: [23,53], 9: [23,53], 10: [23,53], 11: [23,53], 12: [23,53], 13: [23,53], 14: [23,53], 15: [23,53], 16: [23,53], 17: [23,53], 18: [23,53], 19: [23], 20: [8], 21: [8,54] }
  }
},

// ── LINE 6 (Vámosi → Haszkovó) ───────────────────────────
{
  id: "6",
  color: "#FDD835",
  label: "6-os busz",
  direction: "Vámosi úti forduló ▸ Haszkovó forduló felé",
  stops: [
    { name: "Vámosi úti forduló", offset: 0 },
    { name: "Stadion utca / Kemecse utca", offset: 1 },
    { name: "Kemecse utca", offset: 2 },
    { name: "Egry József utca", offset: 4 },
    { name: "Paál László utca", offset: 5 },
    { name: "Dugovics Titusz utca", offset: 6 },
    { name: "Egyetem utca / ActiCity", offset: 8 },
    { name: "Komakút tér / Pannon Egyetem", offset: 10 },
    { name: "Petőfi Színház", offset: 12 },
    { name: "Hotel", offset: 14 },
    { name: "Rózsa utca", offset: 15 },
    { name: "Viola utca", offset: 17 },
    { name: "Budapest út", offset: 20 },
    { name: "Bolgár Mihály utca", offset: 22 },
    { name: "Tölgyfa utca", offset: 23 },
    { name: "Március 15. utca", offset: 24 },
    { name: "Deák Ferenc iskola", offset: 26 },
    { name: "Aradi vértanúk utca", offset: 27 },
    { name: "Haszkovó forduló", offset: 28 },
  ],
  departures: {
    workday: { 5: [10,35,52], 6: [7,22,36,50], 7: [5,20,35,49], 8: [4,23,43], 9: [7,37], 10: [7,37], 11: [7,37], 12: [7,32,52], 13: [12,29,44,59], 14: [14,29,44], 15: [0,16,31,46], 16: [1,16,32,50], 17: [10,30,50], 18: [12,37], 19: [8,38], 20: [8,40], 21: [10,45] },
    weekend: { 5: [22], 6: [28], 7: [8,38], 8: [7,37], 9: [7,37], 10: [7,37], 11: [7,37], 12: [7,37], 13: [7,37], 14: [7,37], 15: [7,37], 16: [7,37], 17: [7,37], 18: [7,37], 19: [22], 20: [24], 21: [45] }
  }
},

// ── LINE 7 (Haszkovó → Cholnoky forduló) ─────────────────
{
  id: "7",
  color: "#5C6BC0",
  label: "7-es busz",
  direction: "Haszkovó forduló ▸ Cholnoky forduló felé",
  stops: [
    { name: "Haszkovó forduló", offset: 0 },
    { name: "Haszkovó utca", offset: 1 },
    { name: "Munkácsy Mihály utca", offset: 3 },
    { name: "Petőfi Sándor utca", offset: 4 },
    { name: "Veszprém autóbusz-állomás", offset: 5 },
    { name: "Hotel", offset: 6 },
    { name: "Kórház", offset: 7 },
    { name: "Füredi utca", offset: 9 },
    { name: "Mester utca", offset: 10 },
    { name: "Almádi út", offset: 11 },
    { name: "Cholnoky lakótelep", offset: 13 },
    { name: "Ady Endre utca / Cholnoky Jenő utca", offset: 14 },
    { name: "Vilonyai utca", offset: 15 },
    { name: "Csillag utca", offset: 16 },
    { name: "Lóczy Lajos utca", offset: 17 },
    { name: "Hérics utca", offset: 17 },
    { name: "Cholnoky forduló", offset: 18 },
  ],
  departures: {
    workday: { 6: [24,52], 7: [19,49], 8: [55], 9: [55], 10: [55], 11: [55], 12: [56], 13: [57], 14: [47], 15: [17,47], 16: [17,48], 17: [55], 18: [55], 19: [55] },
    weekend: { 7: [56], 8: [56], 9: [56], 10: [56], 11: [56], 12: [56], 13: [56], 14: [56], 15: [56], 16: [56], 17: [56], 18: [56] }
  }
},

// ── LINE 7 (Cholnoky lakótelep → Haszkovó) ───────────────
{
  id: "7",
  color: "#5C6BC0",
  label: "7-es busz",
  direction: "Cholnoky lakótelep ▸ Haszkovó forduló felé",
  stops: [
    { name: "Cholnoky lakótelep", offset: 0 },
    { name: "Ady Endre utca / Cholnoky Jenő utca", offset: 1 },
    { name: "Vilonyai utca", offset: 2 },
    { name: "Csillag utca", offset: 3 },
    { name: "Lóczy Lajos utca", offset: 4 },
    { name: "Hérics utca", offset: 5 },
    { name: "Cholnoky forduló", offset: 6 },
    { name: "Almádi út", offset: 7 },
    { name: "Mester utca", offset: 8 },
    { name: "Füredidomb", offset: 10 },
    { name: "Kórház", offset: 11 },
    { name: "Hotel", offset: 13 },
    { name: "Veszprém autóbusz-állomás", offset: 15 },
    { name: "Petőfi Sándor utca", offset: 16 },
    { name: "Munkácsy Mihály utca", offset: 17 },
    { name: "Haszkovó utca", offset: 19 },
    { name: "Haszkovó forduló", offset: 20 },
  ],
  departures: {
    workday: { 6: [39], 7: [8,38], 8: [8], 9: [11], 10: [11], 11: [11], 12: [11], 13: [13], 14: [16], 15: [4,35], 16: [5,35], 17: [11], 18: [11], 19: [11], 20: [11] },
    weekend: { 8: [11], 9: [11], 10: [11], 11: [11], 12: [11], 13: [11], 14: [11], 15: [11], 16: [11], 17: [11], 18: [11], 19: [11] }
  }
},

// ── LINE 7A (Haszkovó → Ady Endre utca / Cholnoky) ───────
{
  id: "7A",
  color: "#5C6BC0",
  label: "7A-s busz",
  direction: "Haszkovó forduló ▸ Ady E. utca / Cholnoky J. utca felé",
  stops: [
    { name: "Haszkovó forduló", offset: 0 },
    { name: "Haszkovó utca", offset: 1 },
    { name: "Munkácsy Mihály utca", offset: 3 },
    { name: "Petőfi Sándor utca", offset: 4 },
    { name: "Veszprém autóbusz-állomás", offset: 6 },
    { name: "Hotel", offset: 8 },
    { name: "Kórház", offset: 9 },
    { name: "Radnóti Miklós tér", offset: 11 },
    { name: "Almádi út", offset: 12 },
    { name: "Cholnoky forduló", offset: 14 },
    { name: "Hérics utca", offset: 15 },
    { name: "Lóczy Lajos utca", offset: 16 },
    { name: "Ady Endre utca / Cholnoky Jenő utca", offset: 17 },
  ],
  departures: {
    workday: { 5: [12,32,51], 6: [10,39], 7: [5,34], 8: [4,19,34], 9: [25], 10: [25], 11: [25], 12: [25], 13: [22,39], 14: [17,32], 15: [2,32], 16: [2,32], 17: [4,19,35], 18: [25], 19: [25], 20: [25,56], 21: [27], 22: [22] },
    weekend: { 5: [38], 6: [38], 7: [23], 8: [26], 9: [26], 10: [26], 11: [26], 12: [26], 13: [26], 14: [26], 15: [26], 16: [26], 17: [26], 18: [26], 19: [25], 20: [10], 21: [10], 22: [22] }
  }
},

// ── LINE 7A (Ady Endre utca / Cholnoky → Haszkovó) ───────
{
  id: "7A",
  color: "#5C6BC0",
  label: "7A-s busz",
  direction: "Ady Endre utca / Cholnoky Jenő utca ▸ Haszkovó forduló felé",
  stops: [
    { name: "Ady Endre utca / Cholnoky Jenő utca", offset: 0 },
    { name: "Lóczy Lajos utca", offset: 1 },
    { name: "Hérics utca", offset: 2 },
    { name: "Cholnoky forduló", offset: 3 },
    { name: "Almádi út", offset: 4 },
    { name: "Radnóti Miklós tér", offset: 6 },
    { name: "Vörösmarty Mihály tér", offset: 7 },
    { name: "Hotel", offset: 8 },
    { name: "Veszprém autóbusz-állomás", offset: 10 },
    { name: "Petőfi Sándor utca", offset: 11 },
    { name: "Munkácsy Mihály utca", offset: 12 },
    { name: "Haszkovó utca", offset: 14 },
    { name: "Haszkovó forduló", offset: 15 },
  ],
  departures: {
    workday: { 5: [16,40,55], 6: [11,27,57], 7: [26,56], 8: [26,46], 9: [44], 10: [44], 11: [44], 12: [39,59], 13: [34,49], 14: [4,36,51], 15: [23,53], 16: [23,53], 17: [34,54], 18: [44], 19: [44], 20: [44], 21: [14], 22: [37] },
    weekend: { 5: [16], 6: [32], 7: [12,42], 8: [44], 9: [44], 10: [44], 11: [44], 12: [44], 13: [44], 14: [44], 15: [44], 16: [44], 17: [44], 18: [44], 19: [44], 20: [29], 21: [23], 22: [37] }
  }
},

// ── LINE 8/8A (Haszkovó → Csererdő) ─────────────────────
{
  id: "8",
  color: "#42A5F5",
  label: "8-as busz",
  direction: "Haszkovó forduló ▸ Csererdő felé",
  stops: [
    { name: "Haszkovó forduló", offset: 0 },
    { name: "Haszkovó utca", offset: 1 },
    { name: "Őrház utca", offset: 2 },
    { name: "Fecske utca", offset: 3 },
    { name: "Budapest út", offset: 4 },
    { name: "Vilonyai utca", offset: 5 },
    { name: "Ady Endre utca / Cholnoky Jenő utca", offset: 6 },
    { name: "Lóczy Lajos utca", offset: 7 },
    { name: "Hérics utca", offset: 7 },
    { name: "Cholnoky forduló", offset: 8 },
    { name: "Almádi út", offset: 9 },
    { name: "Mester utca", offset: 10 },
    { name: "Füredi utca", offset: 11 },
    { name: "Egyetem utca / ActiCity", offset: 12 },
    { name: "Komakút tér / Pannon Egyetem", offset: 13 },
    { name: "Iskola utca", offset: 14 },
    { name: "Harmat utca", offset: 15 },
    { name: "Völgyhíd tér", offset: 16 },
    { name: "Pápai út 25.", offset: 17 },
    { name: "Pápai úti forduló (körforgalom)", offset: 18 },
    { name: "Pápai út / Henger utca", offset: 19 },
    { name: "BALLUFF / JOST", offset: 20 },
    { name: "Valeo", offset: 21 },
    { name: "Valeo, főporta", offset: 22 },
    { name: "Házgyári út / Henger utca", offset: 24 },
    { name: "Bakony Művek", offset: 25 },
    { name: "Csererdő", offset: 26 },
  ],
  departures: {
    workday: { 5: [7,22,51], 6: [21,51], 7: [11,21,55], 8: [25,58], 9: [58], 10: [58], 11: [58], 12: [51], 13: [16,26,55], 14: [25,55], 15: [25,55], 16: [25,59], 17: [58], 18: [58], 20: [8], 21: [15] },
    weekend: { 5: [21], 7: [9], 8: [9], 9: [9], 10: [9], 11: [9], 12: [9], 13: [9], 14: [9], 15: [9], 16: [9], 17: [9], 21: [15] }
  }
},

// ── LINE 8 (Csererdő → Haszkovó) ─────────────────────────
{
  id: "8",
  color: "#42A5F5",
  label: "8-as busz",
  direction: "Csererdő ▸ Haszkovó forduló felé",
  stops: [
    { name: "Csererdő", offset: 0 },
    { name: "Bakony Művek", offset: 0 },
    { name: "Continental", offset: 1 },
    { name: "Valeo, főporta", offset: 3 },
    { name: "Valeo", offset: 4 },
    { name: "BALLUFF / JOST", offset: 5 },
    { name: "Pápai út / Henger utca", offset: 6 },
    { name: "Pápai úti forduló (körforgalom)", offset: 7 },
    { name: "Pápai út 25.", offset: 8 },
    { name: "Völgyhíd tér", offset: 9 },
    { name: "Harmat utca", offset: 10 },
    { name: "Petőfi Színház", offset: 11 },
    { name: "Megyeház tér", offset: 12 },
    { name: "Komakút tér / Pannon Egyetem", offset: 13 },
    { name: "Egyetem utca / ActiCity", offset: 14 },
    { name: "Füredi utca", offset: 16 },
    { name: "Mester utca", offset: 17 },
    { name: "Almádi út", offset: 18 },
    { name: "Cholnoky forduló", offset: 20 },
    { name: "Hérics utca", offset: 21 },
    { name: "Lóczy Lajos utca", offset: 22 },
    { name: "Ady Endre utca / Cholnoky Jenő utca", offset: 23 },
    { name: "Vilonyai utca", offset: 24 },
    { name: "Budapest út", offset: 25 },
    { name: "Fecske utca", offset: 26 },
    { name: "Őrház utca", offset: 27 },
    { name: "Haszkovó utca", offset: 28 },
    { name: "Haszkovó forduló", offset: 29 },
  ],
  departures: {
    workday: { 5: [41], 6: [7,37], 7: [34], 8: [3,33], 13: [35], 14: [7,35], 15: [4,34], 16: [4,34], 17: [11], 18: [8], 22: [10] },
    weekend: { 6: [7], 14: [7], 18: [8], 22: [10] }
  }
},

// ── LINE 8A (Iskola utca → Haszkovó) ─────────────────────
{
  id: "8A",
  color: "#42A5F5",
  label: "8A-s busz",
  direction: "Iskola utca ▸ Haszkovó forduló felé",
  stops: [
    { name: "Iskola utca", offset: 0 },
    { name: "Petőfi Színház", offset: 0 },
    { name: "Megyeház tér", offset: 1 },
    { name: "Komakút tér / Pannon Egyetem", offset: 2 },
    { name: "Egyetem utca / ActiCity", offset: 3 },
    { name: "Füredi utca", offset: 5 },
    { name: "Mester utca", offset: 6 },
    { name: "Almádi út", offset: 7 },
    { name: "Cholnoky forduló", offset: 9 },
    { name: "Hérics utca", offset: 10 },
    { name: "Lóczy Lajos utca", offset: 11 },
    { name: "Ady Endre utca / Cholnoky Jenő utca", offset: 12 },
    { name: "Vilonyai utca", offset: 13 },
    { name: "Budapest út", offset: 14 },
    { name: "Fecske utca", offset: 15 },
    { name: "Őrház utca", offset: 16 },
    { name: "Haszkovó utca", offset: 17 },
    { name: "Haszkovó forduló", offset: 18 },
  ],
  departures: {
    workday: { 9: [20], 10: [19], 11: [19], 12: [19], 13: [14], 19: [17], 20: [25] },
    weekend: { 7: [30], 8: [29], 9: [29], 10: [29], 11: [29], 12: [29], 13: [29], 15: [29], 16: [29] }
  }
},

// ── LINE 8Y (Csererdő → Haszkovó) ────────────────────────
{
  id: "8Y",
  color: "#42A5F5",
  label: "8Y-s busz",
  direction: "Csererdő ▸ Haszkovó forduló felé",
  stops: [
    { name: "Csererdő", offset: 0 },
    { name: "Bakony Művek", offset: 1 },
    { name: "Házgyár", offset: 2 },
    { name: "Fórum", offset: 3 },
    { name: "Ipar utca", offset: 4 },
    { name: "Avar utca", offset: 6 },
    { name: "Vértanú utca", offset: 7 },
    { name: "Dózsa György tér", offset: 8 },
    { name: "Tizenháromváros tér", offset: 10 },
    { name: "Pápai út 25.", offset: 11 },
    { name: "Völgyhíd tér", offset: 12 },
    { name: "Harmat utca", offset: 13 },
    { name: "Petőfi Színház", offset: 14 },
    { name: "Megyeház tér", offset: 15 },
    { name: "Komakút tér / Pannon Egyetem", offset: 16 },
    { name: "Szegfű utca", offset: 18 },
    { name: "Stadion", offset: 19 },
    { name: "Stadion utca / Wartha Vince utca", offset: 21 },
    { name: "Egyetem utca / Stadion utca", offset: 22 },
    { name: "Füredi utca", offset: 24 },
    { name: "Mester utca", offset: 25 },
    { name: "Almádi út", offset: 26 },
    { name: "Cholnoky forduló", offset: 28 },
    { name: "Hérics utca", offset: 29 },
    { name: "Lóczy Lajos utca", offset: 30 },
    { name: "Ady Endre utca / Cholnoky Jenő utca", offset: 31 },
    { name: "Vilonyai utca", offset: 32 },
    { name: "Budapest út", offset: 33 },
    { name: "Bolgár Mihály utca", offset: 35 },
    { name: "Tölgyfa utca", offset: 36 },
    { name: "Március 15. utca", offset: 37 },
    { name: "Deák Ferenc iskola", offset: 39 },
    { name: "Aradi vértanúk utca", offset: 40 },
    { name: "Haszkovó forduló", offset: 41 },
  ],
  departures: {
    workday: { 7: [4] },
    weekend: {}
  }
},

// ── LINE 10 (vasútállomás → Völgyhíd tér) ────────────────
{
  id: "10",
  color: "#FF7043",
  label: "10-es busz",
  direction: "Veszprém vasútállomás ▸ Völgyhíd tér felé",
  stops: [
    { name: "Veszprém vasútállomás", offset: 0 },
    { name: "Aulich Lajos utca", offset: 1 },
    { name: "Laktanya", offset: 1 },
    { name: "Jutasi úti lakótelep", offset: 2 },
    { name: "Jutasi út / Barátság park", offset: 3 },
    { name: "Petőfi Sándor utca", offset: 4 },
    { name: "Veszprém autóbusz-állomás", offset: 5 },
    { name: "Hotel", offset: 6 },
    { name: "Petőfi Színház", offset: 8 },
    { name: "Ranolder János tér", offset: 9 },
    { name: "Jókai utca / Ruttner-ház", offset: 10 },
    { name: "Patak tér (Veszprém Zoo)", offset: 11 },
    { name: "Dózsa György tér", offset: 12 },
    { name: "Vértanú utca", offset: 13 },
    { name: "Avar utca", offset: 14 },
    { name: "Juhar utca", offset: 15 },
    { name: "Dózsavárosi temető", offset: 16 },
    { name: "Tizenháromváros tér", offset: 17 },
    { name: "Pápai út 25.", offset: 18 },
    { name: "Völgyhíd tér", offset: 19 },
  ],
  departures: {
    workday: { 9: [0,40], 10: [20], 11: [0,40], 12: [20,55], 17: [25], 18: [0,40], 19: [20], 20: [20] },
    weekend: { 5: [50], 6: [50], 7: [50], 8: [50], 9: [50], 10: [50], 11: [50], 12: [50], 13: [50], 14: [50], 15: [50], 16: [50], 17: [50], 18: [50], 19: [50] }
  }
},

// ── LINE 10 (Juhar utca → vasútállomás) ──────────────────
{
  id: "10",
  color: "#FF7043",
  label: "10-es busz",
  direction: "Juhar utca ▸ Veszprém vasútállomás felé",
  stops: [
    { name: "Juhar utca", offset: 0 },
    { name: "Dózsavárosi temető", offset: 1 },
    { name: "Tizenháromváros tér", offset: 2 },
    { name: "Pápai út 25.", offset: 3 },
    { name: "Völgyhíd tér", offset: 4 },
    { name: "Patak tér (Veszprém Zoo)", offset: 6 },
    { name: "Jókai utca / Ruttner-ház", offset: 7 },
    { name: "Virág Benedek utca", offset: 8 },
    { name: "Hotel", offset: 10 },
    { name: "Veszprém autóbusz-állomás", offset: 12 },
    { name: "Petőfi Sándor utca", offset: 13 },
    { name: "Jutasi út / Barátság park", offset: 15 },
    { name: "Jutasi úti lakótelep", offset: 16 },
    { name: "Laktanya", offset: 17 },
    { name: "Aulich Lajos utca", offset: 18 },
    { name: "Veszprém vasútállomás", offset: 19 },
  ],
  departures: {
    workday: { 9: [19,59], 10: [39], 11: [19,59], 12: [39], 13: [14], 17: [44], 18: [19,59], 19: [37], 20: [37] },
    weekend: { 5: [5], 6: [5], 7: [5], 8: [5], 9: [8], 10: [8], 11: [8], 12: [8], 13: [8], 14: [8], 15: [8], 16: [8], 17: [8], 18: [8], 19: [8], 20: [5] }
  }
},

// ── LINE 11 (vasútállomás → Vámosi úti forduló) ──────────
{
  id: "11",
  color: "#00BCD4",
  label: "11-es busz",
  direction: "Veszprém vasútállomás ▸ Vámosi úti forduló felé",
  stops: [
    { name: "Veszprém vasútállomás", offset: 0 },
    { name: "Aulich Lajos utca", offset: 1 },
    { name: "Laktanya", offset: 2 },
    { name: "Haszkovó utca", offset: 4 },
    { name: "Őrház utca", offset: 5 },
    { name: "Fecske utca", offset: 6 },
    { name: "Budapest út", offset: 7 },
    { name: "Vilonyai utca", offset: 9 },
    { name: "Csillag utca", offset: 10 },
    { name: "Lóczy Lajos utca", offset: 11 },
    { name: "Hérics utca", offset: 12 },
    { name: "Cholnoky forduló", offset: 13 },
    { name: "Almádi út", offset: 14 },
    { name: "Mester utca", offset: 15 },
    { name: "Füredi utca", offset: 16 },
    { name: "Dugovics Titusz utca", offset: 18 },
    { name: "Paál László utca", offset: 19 },
    { name: "Egry József utca", offset: 20 },
    { name: "Kemecse utca", offset: 21 },
    { name: "Stadion utca / Kemecse utca", offset: 22 },
    { name: "Vámosi úti forduló", offset: 24 },
  ],
  departures: {
    workday: { 5: [30], 6: [30], 7: [0], 8: [6], 9: [16], 10: [16], 11: [16], 12: [16], 13: [6], 14: [6], 15: [6], 16: [6], 17: [16], 18: [16], 19: [16], 20: [36], 21: [36], 22: [36] },
    weekend: { 6: [36], 7: [36], 8: [36], 9: [36], 10: [36], 11: [36], 12: [36], 13: [36], 14: [36], 15: [36], 16: [36], 17: [36], 18: [36], 19: [36], 20: [36], 21: [36], 22: [36] }
  }
},

// ── LINE 11 (Vámosi úti forduló → vasútállomás) ──────────
{
  id: "11",
  color: "#00BCD4",
  label: "11-es busz",
  direction: "Vámosi úti forduló ▸ Veszprém vasútállomás felé",
  stops: [
    { name: "Vámosi úti forduló", offset: 0 },
    { name: "Stadion utca / Kemecse utca", offset: 1 },
    { name: "Kemecse utca", offset: 2 },
    { name: "Egry József utca", offset: 3 },
    { name: "Paál László utca", offset: 4 },
    { name: "Dugovics Titusz utca", offset: 5 },
    { name: "Füredi utca", offset: 6 },
    { name: "Mester utca", offset: 7 },
    { name: "Almádi út", offset: 8 },
    { name: "Cholnoky forduló", offset: 10 },
    { name: "Hérics utca", offset: 11 },
    { name: "Lóczy Lajos utca", offset: 12 },
    { name: "Csillag utca", offset: 13 },
    { name: "Vilonyai utca", offset: 14 },
    { name: "Budapest út", offset: 15 },
    { name: "Fecske utca", offset: 16 },
    { name: "Őrház utca", offset: 17 },
    { name: "Haszkovó utca", offset: 18 },
    { name: "Laktanya", offset: 20 },
    { name: "Aulich Lajos utca", offset: 21 },
    { name: "Veszprém vasútállomás", offset: 22 },
  ],
  departures: {
    workday: { 5: [15], 6: [0,55], 7: [30], 8: [32], 9: [40], 10: [40], 11: [40], 12: [40], 13: [31], 14: [31], 15: [31], 16: [31], 17: [40], 18: [39], 19: [38], 21: [0] },
    weekend: { 6: [0], 7: [0], 8: [0], 9: [0], 10: [0], 11: [0], 12: [0], 13: [0], 14: [0], 15: [0], 16: [0], 17: [0], 18: [0], 19: [0], 20: [0], 21: [0] }
  }
},

// ── LINE 11A (vasútállomás → Dugovics Titusz utca) ───────
{
  id: "11A",
  color: "#0097A7",
  label: "11A busz",
  direction: "Veszprém vasútállomás ▸ Dugovics Titusz utca felé",
  stops: [
    { name: "Veszprém vasútállomás", offset: 0 },
    { name: "Aulich Lajos utca", offset: 1 },
    { name: "Laktanya", offset: 2 },
    { name: "Haszkovó utca", offset: 4 },
    { name: "Őrház utca", offset: 5 },
    { name: "Fecske utca", offset: 6 },
    { name: "Budapest út", offset: 7 },
    { name: "Vilonyai utca", offset: 8 },
    { name: "Csillag utca", offset: 9 },
    { name: "Lóczy Lajos utca", offset: 10 },
    { name: "Hérics utca", offset: 11 },
    { name: "Cholnoky forduló", offset: 12 },
    { name: "Almádi út", offset: 13 },
    { name: "Mester utca", offset: 14 },
    { name: "Füredi utca", offset: 15 },
    { name: "Egyetem utca / Stadion utca", offset: 16 },
    { name: "Stadion utca / Wartha Vince utca", offset: 17 },
    { name: "Kemecse utca", offset: 20 },
    { name: "Egry József utca", offset: 21 },
    { name: "Paál László utca", offset: 22 },
    { name: "Dugovics Titusz utca", offset: 23 },
  ],
  departures: {
    workday: { 6: [0], 7: [36], 8: [36], 9: [36], 10: [36], 11: [36], 12: [36], 13: [36], 14: [36], 15: [36], 16: [36], 17: [36], 18: [36], 19: [36] },
    weekend: {}
  }
},

// ── LINE 11A (Egyetem utca → vasútállomás) ───────────────
{
  id: "11A",
  color: "#0097A7",
  label: "11A busz",
  direction: "Egyetem utca / Stadion utca ▸ Veszprém vasútállomás felé",
  stops: [
    { name: "Egyetem utca / Stadion utca", offset: 0 },
    { name: "Stadion utca / Wartha Vince utca", offset: 1 },
    { name: "Kemecse utca", offset: 3 },
    { name: "Egry József utca", offset: 5 },
    { name: "Paál László utca", offset: 6 },
    { name: "Dugovics Titusz utca", offset: 7 },
    { name: "Füredi utca", offset: 9 },
    { name: "Mester utca", offset: 10 },
    { name: "Almádi út", offset: 11 },
    { name: "Cholnoky forduló", offset: 13 },
    { name: "Hérics utca", offset: 14 },
    { name: "Lóczy Lajos utca", offset: 15 },
    { name: "Csillag utca", offset: 16 },
    { name: "Vilonyai utca", offset: 17 },
    { name: "Budapest út", offset: 18 },
    { name: "Fecske utca", offset: 19 },
    { name: "Őrház utca", offset: 20 },
    { name: "Haszkovó utca", offset: 21 },
    { name: "Laktanya", offset: 23 },
    { name: "Aulich Lajos utca", offset: 24 },
    { name: "Veszprém vasútállomás", offset: 26 },
  ],
  departures: {
    workday: { 6: [16], 7: [56], 8: [55], 9: [53], 10: [53], 11: [53], 12: [53], 13: [55], 14: [55], 15: [55], 16: [55], 17: [54], 18: [52], 19: [51] },
    weekend: {}
  }
},

// ── LINE 12 (autóbusz-állomás körjárat) ──────────────────
{
  id: "12",
  color: "#78909C",
  label: "12-es busz",
  direction: "Veszprém autóbusz-állomás ▸ körjárat",
  stops: [
    { name: "Veszprém autóbusz-állomás", offset: 0 },
    { name: "Csutorás utca", offset: 2 },
    { name: "Pajta utca / Kabóca Bábszínház", offset: 4 },
    { name: "Pajta utca / Aranyoskút utca", offset: 6 },
    { name: "Dózsa György tér", offset: 7 },
    { name: "Tizenháromváros tér", offset: 9 },
    { name: "Pápai út 25.", offset: 10 },
    { name: "Völgyhíd tér", offset: 11 },
    { name: "Patak tér (Veszprém Zoo)", offset: 12 },
    { name: "Jókai utca / Ruttner-ház", offset: 13 },
    { name: "Virág Benedek utca", offset: 14 },
    { name: "Hotel", offset: 16 },
    { name: "Veszprém autóbusz-állomás", offset: 19 },
  ],
  departures: {
    workday: { 8: [32], 10: [32], 14: [37] },
    weekend: {}
  }
},

// ── LINE 13 (Kádártai → Völgyhíd tér) ────────────────────
{
  id: "13",
  color: "#C6A700",
  label: "13-as busz",
  direction: "Kádártai úti forduló ▸ Völgyhíd tér felé",
  stops: [
    { name: "Kádártai úti forduló", offset: 0 },
    { name: "Bolgár Mihály utca", offset: 1 },
    { name: "Fecske utca", offset: 2 },
    { name: "Őrház utca", offset: 3 },
    { name: "Munkácsy Mihály utca", offset: 4 },
    { name: "Petőfi Sándor utca", offset: 5 },
    { name: "Veszprém autóbusz-állomás", offset: 7 },
    { name: "Hotel", offset: 9 },
    { name: "Petőfi Színház", offset: 11 },
    { name: "Ranolder János tér", offset: 12 },
    { name: "Jókai utca / Ruttner-ház", offset: 13 },
    { name: "Patak tér (Veszprém Zoo)", offset: 14 },
    { name: "Dózsa György tér", offset: 15 },
    { name: "Vértanú utca", offset: 16 },
    { name: "Avar utca", offset: 17 },
    { name: "Juhar utca", offset: 18 },
    { name: "Dózsavárosi temető", offset: 19 },
    { name: "Tizenháromváros tér", offset: 20 },
    { name: "Pápai út 25.", offset: 21 },
    { name: "Völgyhíd tér", offset: 22 },
  ],
  departures: {
    workday: { 5: [4,40], 6: [9,34,54], 7: [24,54], 8: [24], 13: [23,53], 14: [23,53], 15: [21,51], 16: [21,51] },
    weekend: {}
  }
},

// ── LINE 13 (Juhar utca → Kádártai) ──────────────────────
{
  id: "13",
  color: "#C6A700",
  label: "13-as busz",
  direction: "Juhar utca ▸ Kádártai úti forduló felé",
  stops: [
    { name: "Juhar utca", offset: 0 },
    { name: "Dózsavárosi temető", offset: 1 },
    { name: "Tizenháromváros tér", offset: 2 },
    { name: "Pápai út 25.", offset: 3 },
    { name: "Völgyhíd tér", offset: 4 },
    { name: "Patak tér (Veszprém Zoo)", offset: 6 },
    { name: "Jókai utca / Ruttner-ház", offset: 7 },
    { name: "Virág Benedek utca", offset: 8 },
    { name: "Hotel", offset: 11 },
    { name: "Veszprém autóbusz-állomás", offset: 14 },
    { name: "Petőfi Sándor utca", offset: 15 },
    { name: "Munkácsy Mihály utca", offset: 17 },
    { name: "Őrház utca", offset: 19 },
    { name: "Fecske utca", offset: 20 },
    { name: "Bolgár Mihály utca", offset: 21 },
    { name: "Kádártai úti forduló", offset: 22 },
  ],
  departures: {
    workday: { 5: [19,55], 6: [28,53], 7: [13,45], 8: [15,43], 13: [42], 14: [12,42], 15: [12,42], 16: [12,42], 17: [12] },
    weekend: {}
  }
},

// ── LINE 15 (Kádártai → Haszkovó) ────────────────────────
{
  id: "15",
  color: "#E65100",
  label: "15-ös busz",
  direction: "Kádártai úti forduló ▸ Haszkovó forduló felé",
  stops: [
    { name: "Kádártai úti forduló", offset: 0 },
    { name: "Bolgár Mihály utca", offset: 1 },
    { name: "Budapest út", offset: 2 },
    { name: "Vilonyai utca", offset: 4 },
    { name: "Csillag utca", offset: 5 },
    { name: "Lóczy Lajos utca", offset: 6 },
    { name: "Hérics utca", offset: 7 },
    { name: "Cholnoky forduló", offset: 8 },
    { name: "Cholnoky lakótelep", offset: 10 },
    { name: "Ady Endre utca / Cholnoky Jenő utca", offset: 11 },
    { name: "Ady Endre utca", offset: 12 },
    { name: "Diófa utca", offset: 13 },
    { name: "Hotel", offset: 16 },
    { name: "Petőfi Színház", offset: 18 },
    { name: "Harmat utca", offset: 19 },
    { name: "Völgyhíd tér", offset: 21 },
    { name: "Pápai út 25.", offset: 22 },
    { name: "Tizenháromváros tér", offset: 23 },
    { name: "Dózsa György tér", offset: 24 },
    { name: "Tüzér utca", offset: 25 },
    { name: "Papvásár utca", offset: 26 },
    { name: "Tüzér utcai forduló", offset: 27 },
    { name: "Jutaspusztai elágazás", offset: 28 },
    { name: "Laktanya", offset: 31 },
    { name: "Haszkovó forduló", offset: 32 },
  ],
  departures: {
    workday: { 7: [26], 8: [15], 9: [15], 10: [15], 11: [15], 12: [15], 17: [20], 18: [20], 19: [20], 20: [20] },
    weekend: { 7: [24], 8: [24], 9: [24], 10: [24], 11: [24], 12: [24], 13: [24], 14: [24], 15: [24], 16: [24], 17: [24], 18: [24], 19: [24] }
  }
},

// ── LINE 15 (Haszkovó → Kádártai) ────────────────────────
{
  id: "15",
  color: "#E65100",
  label: "15-ös busz",
  direction: "Haszkovó forduló ▸ Kádártai úti forduló felé",
  stops: [
    { name: "Haszkovó forduló", offset: 0 },
    { name: "Laktanya", offset: 0 },
    { name: "Aulich Lajos utca", offset: 1 },
    { name: "Tüzér utcai forduló", offset: 7 },
    { name: "Papvásár utca", offset: 8 },
    { name: "Tüzér utca", offset: 9 },
    { name: "Dózsa György tér", offset: 10 },
    { name: "Tizenháromváros tér", offset: 11 },
    { name: "Pápai út 25.", offset: 12 },
    { name: "Völgyhíd tér", offset: 13 },
    { name: "Harmat utca", offset: 14 },
    { name: "Petőfi Színház", offset: 15 },
    { name: "Hotel", offset: 17 },
    { name: "Kabay János utca", offset: 18 },
    { name: "Ady Endre utca", offset: 19 },
    { name: "Ady Endre utca / Cholnoky Jenő utca", offset: 20 },
    { name: "Cholnoky lakótelep", offset: 21 },
    { name: "Cholnoky forduló", offset: 22 },
    { name: "Hérics utca", offset: 23 },
    { name: "Lóczy Lajos utca", offset: 24 },
    { name: "Csillag utca", offset: 25 },
    { name: "Vilonyai utca", offset: 26 },
    { name: "Budapest út", offset: 27 },
    { name: "Bolgár Mihály utca", offset: 29 },
    { name: "Kádártai úti forduló", offset: 30 },
  ],
  departures: {
    workday: { 6: [4,50], 8: [6], 9: [6], 10: [6], 11: [6], 12: [6], 17: [6], 18: [6], 19: [6], 20: [6] },
    weekend: { 8: [6], 9: [6], 10: [6], 11: [6], 12: [6], 13: [6], 14: [6], 15: [6], 16: [6], 17: [6], 18: [6], 19: [6], 20: [6] }
  }
},

// ── LINE 15A (Kádártai → Haszkovó via Jutaspuszta) ───────
{
  id: "15A",
  color: "#BF360C",
  label: "15A busz",
  direction: "Kádártai úti forduló ▸ Haszkovó forduló felé (15A)",
  stops: [
    { name: "Kádártai úti forduló", offset: 0 },
    { name: "Bolgár Mihály utca", offset: 1 },
    { name: "Budapest út", offset: 2 },
    { name: "Vilonyai utca", offset: 3 },
    { name: "Csillag utca", offset: 4 },
    { name: "Lóczy Lajos utca", offset: 5 },
    { name: "Hérics utca", offset: 6 },
    { name: "Cholnoky forduló", offset: 7 },
    { name: "Cholnoky lakótelep", offset: 8 },
    { name: "Ady Endre utca / Cholnoky Jenő utca", offset: 9 },
    { name: "Ady Endre utca", offset: 10 },
    { name: "Diófa utca", offset: 11 },
    { name: "Hotel", offset: 13 },
    { name: "Petőfi Színház", offset: 15 },
    { name: "Harmat utca", offset: 16 },
    { name: "Völgyhíd tér", offset: 18 },
    { name: "Pápai út 25.", offset: 19 },
    { name: "Tizenháromváros tér", offset: 20 },
    { name: "Dózsa György tér", offset: 21 },
    { name: "Tüzér utca", offset: 22 },
    { name: "Papvásár utca", offset: 23 },
    { name: "Tüzér utcai forduló", offset: 24 },
    { name: "Kisréti utca", offset: 26 },
    { name: "Jutaspuszta", offset: 27 },
    { name: "Kisréti utca", offset: 28 },
    { name: "Jutaspusztai elágazás", offset: 29 },
    { name: "Láhner György utca", offset: 32 },
    { name: "Aulich utca, garázstelep", offset: 33 },
    { name: "Deák Ferenc iskola", offset: 34 },
    { name: "Aradi vértanúk utca", offset: 35 },
    { name: "Haszkovó forduló", offset: 36 },
  ],
  departures: {
    workday: { 6: [12,42], 13: [35], 14: [33], 15: [33], 16: [33] },
    weekend: {}
  }
},

// ── LINE 15A (Haszkovó → Kádártai via Jutaspuszta) ───────
{
  id: "15A",
  color: "#BF360C",
  label: "15A busz",
  direction: "Haszkovó forduló ▸ Kádártai úti forduló felé (15A)",
  stops: [
    { name: "Haszkovó forduló", offset: 0 },
    { name: "Aradi vértanúk utca", offset: 1 },
    { name: "Deák Ferenc iskola", offset: 2 },
    { name: "Aulich utca, garázstelep", offset: 3 },
    { name: "Láhner György utca", offset: 4 },
    { name: "Kisréti utca", offset: 8 },
    { name: "Jutaspuszta", offset: 9 },
    { name: "Kisréti utca", offset: 10 },
    { name: "Tüzér utcai forduló", offset: 13 },
    { name: "Papvásár utca", offset: 14 },
    { name: "Tüzér utca", offset: 15 },
    { name: "Dózsa György tér", offset: 16 },
    { name: "Tizenháromváros tér", offset: 18 },
    { name: "Pápai út 25.", offset: 19 },
    { name: "Völgyhíd tér", offset: 20 },
    { name: "Harmat utca", offset: 21 },
    { name: "Petőfi Színház", offset: 22 },
    { name: "Hotel", offset: 24 },
    { name: "Kabay János utca", offset: 25 },
    { name: "Ady Endre utca", offset: 27 },
    { name: "Ady Endre utca / Cholnoky Jenő utca", offset: 28 },
    { name: "Cholnoky lakótelep", offset: 29 },
    { name: "Cholnoky forduló", offset: 30 },
    { name: "Hérics utca", offset: 31 },
    { name: "Lóczy Lajos utca", offset: 32 },
    { name: "Csillag utca", offset: 33 },
    { name: "Vilonyai utca", offset: 34 },
    { name: "Budapest út", offset: 35 },
    { name: "Bolgár Mihály utca", offset: 37 },
    { name: "Kádártai úti forduló", offset: 37 },
  ],
  departures: {
    workday: { 7: [19], 13: [0], 14: [10], 15: [10], 16: [10] },
    weekend: {}
  }
},

// ── LINE 16 (Vámosi → Bakony Művek, vasárnaponként) ──────
{
  id: "16",
  color: "#009688",
  label: "16-os busz",
  direction: "Vámosi úti forduló ▸ Bakony Művek felé",
  stops: [
    { name: "Vámosi úti forduló", offset: 0 },
    { name: "Stadion utca / Kemecse utca", offset: 1 },
    { name: "Kemecse utca", offset: 2 },
    { name: "Egry József utca", offset: 3 },
    { name: "Paál László utca", offset: 4 },
    { name: "Dugovics Titusz utca", offset: 5 },
    { name: "Egyetem utca / ActiCity", offset: 7 },
    { name: "Komakút tér / Pannon Egyetem", offset: 8 },
    { name: "Petőfi Színház", offset: 9 },
    { name: "Hotel", offset: 11 },
    { name: "Rózsa utca", offset: 12 },
    { name: "Viola utca", offset: 13 },
    { name: "Budapest út", offset: 15 },
    { name: "Bolgár Mihály utca", offset: 16 },
    { name: "Tölgyfa utca", offset: 17 },
    { name: "Március 15. utca", offset: 18 },
    { name: "Deák Ferenc iskola", offset: 20 },
    { name: "Aradi vértanúk utca", offset: 21 },
    { name: "Laktanya", offset: 22 },
    { name: "Aulich Lajos utca", offset: 23 },
    { name: "Jutaspusztai elágazás", offset: 26 },
    { name: "Komfort", offset: 27 },
    { name: "Agroker", offset: 28 },
    { name: "Posta-garázs", offset: 29 },
    { name: "Házgyár", offset: 30 },
    { name: "Bakony Művek", offset: 31 },
  ],
  departures: {
    workday: {},
    weekend: { 6: [28], 7: [38], 8: [37], 9: [37], 10: [37] }
  }
},

// ── LINE 16 (Bakony Művek → Vámosi, vasárnaponként) ──────
{
  id: "16",
  color: "#009688",
  label: "16-os busz",
  direction: "Bakony Művek ▸ Vámosi úti forduló felé",
  stops: [
    { name: "Bakony Művek", offset: 0 },
    { name: "Házgyár", offset: 1 },
    { name: "Posta-garázs", offset: 2 },
    { name: "Komfort", offset: 3 },
    { name: "Jutaspusztai elágazás", offset: 4 },
    { name: "Laktanya", offset: 7 },
    { name: "Haszkovó forduló", offset: 9 },
    { name: "Aradi vértanúk utca", offset: 10 },
    { name: "Deák Ferenc iskola", offset: 11 },
    { name: "Március 15. utca", offset: 13 },
    { name: "Tölgyfa utca", offset: 14 },
    { name: "Bolgár Mihály utca", offset: 15 },
    { name: "Budapest út", offset: 16 },
    { name: "Viola utca", offset: 17 },
    { name: "Rózsa utca", offset: 18 },
    { name: "Hotel", offset: 20 },
    { name: "Megyeház tér", offset: 22 },
    { name: "Komakút tér / Pannon Egyetem", offset: 23 },
    { name: "Egyetem utca / ActiCity", offset: 24 },
    { name: "Dugovics Titusz utca", offset: 26 },
    { name: "Paál László utca", offset: 27 },
    { name: "Egry József utca", offset: 28 },
    { name: "Kemecse utca", offset: 29 },
    { name: "Stadion utca / Kemecse utca", offset: 30 },
    { name: "Vámosi úti forduló", offset: 32 },
  ],
  departures: {
    workday: {},
    weekend: { 8: [14], 9: [14], 10: [14], 11: [14] }
  }
},

// ── LINE 18 (autóbusz-állomás → Csatárhegy) ──────────────
{
  id: "18",
  color: "#795548",
  label: "18-as busz",
  direction: "Veszprém autóbusz-állomás ▸ Csatárhegy, Kilátó út felé",
  stops: [
    { name: "Veszprém autóbusz-állomás", offset: 0 },
    { name: "Csutorás utca", offset: 2 },
    { name: "Pajta utca / Kabóca Bábszínház", offset: 4 },
    { name: "Pajta utca / Aranyoskút utca", offset: 6 },
    { name: "Dózsa György tér", offset: 7 },
    { name: "Vértanú utca", offset: 8 },
    { name: "Avar utca", offset: 9 },
    { name: "Juhar utca", offset: 10 },
    { name: "Pápai út / Henger utca", offset: 12 },
    { name: "Csatárhegy, Lejtős út", offset: 18 },
    { name: "Csatárhegy, Kápolna út", offset: 18 },
    { name: "Csatárhegy, Kilátó út", offset: 19 },
  ],
  departures: {
    workday: { 5: [32], 6: [32], 7: [32], 9: [32], 11: [32], 13: [32], 15: [32], 16: [32], 18: [2], 19: [32] },
    weekend: { 5: [32], 8: [32], 11: [32], 14: [32], 17: [32], 20: [32] }
  }
},

// ── LINE 18 (Csatárhegy → autóbusz-állomás) ──────────────
{
  id: "18",
  color: "#795548",
  label: "18-as busz",
  direction: "Csatárhegy, Kilátó út ▸ Veszprém autóbusz-állomás felé",
  stops: [
    { name: "Csatárhegy, Kilátó út", offset: 0 },
    { name: "Csatárhegy, Kápolna út", offset: 0 },
    { name: "Csatárhegy, Lejtős út", offset: 1 },
    { name: "Csatárhegyi elágazás", offset: 3 },
    { name: "Pápai út / Henger utca", offset: 5 },
    { name: "Juhar utca", offset: 7 },
    { name: "Avar utca", offset: 8 },
    { name: "Vértanú utca", offset: 9 },
    { name: "Dózsa György tér", offset: 10 },
    { name: "Tizenháromváros tér", offset: 11 },
    { name: "Pápai út 25.", offset: 12 },
    { name: "Völgyhíd tér", offset: 13 },
    { name: "Patak tér (Veszprém Zoo)", offset: 14 },
    { name: "Jókai utca / Ruttner-ház", offset: 15 },
    { name: "Virág Benedek utca", offset: 16 },
    { name: "Hotel", offset: 18 },
    { name: "Veszprém autóbusz-állomás", offset: 20 },
  ],
  departures: {
    workday: { 5: [0], 6: [0], 7: [0], 8: [0], 10: [0], 12: [0], 14: [0], 16: [0], 17: [0], 18: [30], 20: [0] },
    weekend: { 6: [0], 9: [0], 12: [0], 15: [0], 18: [0], 21: [0] }
  }
},

// ── LINE 20 (autóbusz-állomás → Szabadságpuszta) ─────────
{
  id: "20",
  color: "#1A237E",
  label: "20-as busz",
  direction: "Veszprém autóbusz-állomás ▸ Szabadságpuszta, Laci-major felé",
  stops: [
    { name: "Veszprém autóbusz-állomás", offset: 0 },
    { name: "Hotel", offset: 1 },
    { name: "Radnóti Miklós tér", offset: 3 },
    { name: "Almádi út", offset: 4 },
    { name: "Tirat-Carmel utca", offset: 5 },
    { name: "Sepsiszentgyörgy utca", offset: 7 },
    { name: "Szabadságpuszta, magtár", offset: 11 },
    { name: "Szabadságpuszta, Laci-major", offset: 12 },
  ],
  departures: {
    workday: { 5: [35], 6: [20,45], 7: [45], 10: [55], 13: [55] },
    weekend: { 5: [35], 7: [55], 13: [55] }
  }
},

// ── LINE 20 (Szabadságpuszta → autóbusz-állomás) ─────────
{
  id: "20",
  color: "#1A237E",
  label: "20-as busz",
  direction: "Szabadságpuszta, Laci-major ▸ Veszprém autóbusz-állomás felé",
  stops: [
    { name: "Szabadságpuszta, Laci-major", offset: 0 },
    { name: "Szabadságpuszta, magtár", offset: 1 },
    { name: "Szabadságpuszta, bejárati út", offset: 3 },
    { name: "Sepsiszentgyörgy utca", offset: 5 },
    { name: "Tirat-Carmel utca", offset: 7 },
    { name: "Almádi út", offset: 8 },
    { name: "Radnóti Miklós tér", offset: 9 },
    { name: "Vörösmarty Mihály tér", offset: 10 },
    { name: "Hotel", offset: 11 },
    { name: "Veszprém autóbusz-állomás", offset: 13 },
  ],
  departures: {
    workday: { 11: [10], 14: [15], 15: [15], 16: [10], 17: [10], 20: [10] },
    weekend: { 14: [15], 17: [10], 20: [10] }
  }
},

// ── LINE 21 (Kádártai → Pápai úti forduló) ───────────────
{
  id: "21",
  color: "#558B2F",
  label: "21-es busz",
  direction: "Kádártai úti forduló ▸ Pápai úti forduló felé",
  stops: [
    { name: "Kádártai úti forduló", offset: 0 },
    { name: "Bolgár Mihály utca", offset: 0 },
    { name: "Fecske utca", offset: 1 },
    { name: "Őrház utca", offset: 2 },
    { name: "Haszkovó utca", offset: 3 },
    { name: "Aradi vértanúk utca", offset: 4 },
    { name: "Deák Ferenc iskola", offset: 5 },
    { name: "Aulich utca, garázstelep", offset: 6 },
    { name: "Láhner György utca", offset: 7 },
    { name: "Jutaspusztai elágazás", offset: 10 },
    { name: "Komfort", offset: 11 },
    { name: "Agroker", offset: 11 },
    { name: "Posta-garázs", offset: 12 },
    { name: "Házgyár", offset: 13 },
    { name: "Bakony Művek", offset: 14 },
    { name: "Continental", offset: 15 },
    { name: "Valeo, főporta", offset: 17 },
    { name: "Valeo", offset: 18 },
    { name: "BALLUFF / JOST", offset: 19 },
    { name: "Pápai út / Henger utca", offset: 20 },
    { name: "Pápai úti forduló (körforgalom)", offset: 21 },
    { name: "Pápai úti forduló", offset: 21 },
  ],
  departures: {
    workday: { 5: [22], 6: [22], 7: [12], 13: [22], 21: [22] },
    weekend: { 5: [22], 13: [22], 21: [22] }
  }
},

// ── LINE 21 (Pápai úti forduló → Kádártai) ───────────────
{
  id: "21",
  color: "#558B2F",
  label: "21-es busz",
  direction: "Pápai úti forduló ▸ Kádártai úti forduló felé",
  stops: [
    { name: "Pápai úti forduló", offset: 0 },
    { name: "Pápai úti forduló (körforgalom)", offset: 0 },
    { name: "Pápai út / Henger utca", offset: 1 },
    { name: "BALLUFF / JOST", offset: 2 },
    { name: "Valeo", offset: 3 },
    { name: "Valeo, főporta", offset: 4 },
    { name: "Continental", offset: 6 },
    { name: "Házgyári út / Henger utca", offset: 7 },
    { name: "Bakony Művek", offset: 8 },
    { name: "Házgyár", offset: 9 },
    { name: "Posta-garázs", offset: 10 },
    { name: "Komfort", offset: 11 },
    { name: "Jutaspusztai elágazás", offset: 12 },
    { name: "Láhner György utca", offset: 15 },
    { name: "Aulich utca, garázstelep", offset: 16 },
    { name: "Deák Ferenc iskola", offset: 17 },
    { name: "Aradi vértanúk utca", offset: 18 },
    { name: "Haszkovó utca", offset: 19 },
    { name: "Őrház utca", offset: 20 },
    { name: "Fecske utca", offset: 21 },
    { name: "Bolgár Mihály utca", offset: 22 },
    { name: "Kádártai úti forduló", offset: 23 },
  ],
  departures: {
    workday: { 6: [10], 14: [10], 15: [40], 16: [10], 22: [10] },
    weekend: { 6: [10], 14: [10], 22: [10] }
  }
},

// ── LINE 22 (autóbusz-állomás → Szabadságpuszta via Kórház) ──
{
  id: "22",
  color: "#B71C1C",
  label: "22-es busz",
  direction: "Veszprém autóbusz-állomás ▸ Szabadságpuszta, Laci-major felé (22)",
  stops: [
    { name: "Veszprém autóbusz-állomás", offset: 0 },
    { name: "Hotel", offset: 1 },
    { name: "Kórház", offset: 3 },
    { name: "Hunyadi János utca", offset: 5 },
    { name: "Szabadságpuszta, magtár", offset: 11 },
    { name: "Szabadságpuszta, Laci-major", offset: 12 },
  ],
  departures: {
    workday: { 14: [55], 15: [55], 16: [55], 19: [55] },
    weekend: { 10: [55], 16: [55], 19: [55] }
  }
},

// ── LINE 22 (Szabadságpuszta → autóbusz-állomás via Kórház) ──
{
  id: "22",
  color: "#B71C1C",
  label: "22-es busz",
  direction: "Szabadságpuszta, Laci-major ▸ Veszprém autóbusz-állomás felé (22)",
  stops: [
    { name: "Szabadságpuszta, Laci-major", offset: 0 },
    { name: "Szabadságpuszta, magtár", offset: 1 },
    { name: "Szabadságpuszta, bejárati út", offset: 3 },
    { name: "Füredidomb", offset: 7 },
    { name: "Kórház", offset: 8 },
    { name: "Hotel", offset: 9 },
    { name: "Veszprém autóbusz-állomás", offset: 11 },
  ],
  departures: {
    workday: { 5: [10], 6: [10,40], 7: [10], 8: [10] },
    weekend: { 5: [50], 8: [10], 11: [10] }
  }
},

// ── LINE 23/24 (autóbusz-állomás → Gyulafirátót) ─────────
{
  id: "23",
  color: "#6A1B9A",
  label: "23/24-es busz",
  direction: "Veszprém autóbusz-állomás ▸ Gyulafirátót, forduló felé",
  stops: [
    { name: "Veszprém autóbusz-állomás", offset: 0 },
    { name: "Rózsa utca", offset: 2 },
    { name: "Viola utca", offset: 4 },
    { name: "82-es út, bevásárlóközpont", offset: 8 },
    { name: "Büntetés-végrehajtási Intézet", offset: 10 },
    { name: "Kádárta, bejárati út", offset: 12 },
    { name: "Kádárta, felső", offset: 13 },
    { name: "Kádárta, bolt", offset: 14 },
    { name: "Kádárta, Vasút utca", offset: 16 },
    { name: "Kádárta, vasúti megállóhely", offset: 17 },
    { name: "Gyulafirátót, Posta utca", offset: 19 },
    { name: "Gyulafirátót, Vizi utca", offset: 20 },
    { name: "Gyulafirátót, felső", offset: 22 },
    { name: "Gyulafirátót, forduló", offset: 23 },
  ],
  departures: {
    workday: { 5: [0,34], 6: [35], 7: [0,20], 8: [5,32], 9: [35], 10: [32], 11: [35], 12: [33], 13: [2,33], 14: [5,32,37], 15: [5,32], 16: [3,32,55], 17: [15,32], 18: [3,32], 19: [5,35], 20: [5,35], 21: [5,35], 22: [35] },
    weekend: { 5: [34], 6: [35], 7: [33], 8: [32], 9: [35], 10: [32], 11: [33], 12: [32], 13: [33], 14: [32], 15: [33], 16: [32], 17: [33], 18: [32], 19: [35], 20: [35], 21: [35], 22: [35] }
  }
},

// ── LINE 23/24 (Gyulafirátót → autóbusz-állomás) ─────────
{
  id: "23",
  color: "#6A1B9A",
  label: "23/24-es busz",
  direction: "Gyulafirátót, forduló ▸ Veszprém autóbusz-állomás felé",
  stops: [
    { name: "Gyulafirátót, forduló", offset: 0 },
    { name: "Gyulafirátót, felső", offset: 1 },
    { name: "Gyulafirátót, Vizi utca", offset: 2 },
    { name: "Gyulafirátót, Posta utca", offset: 3 },
    { name: "Kádárta, vasúti megállóhely", offset: 5 },
    { name: "Kádárta, Vasút utca", offset: 6 },
    { name: "Kádárta, bolt", offset: 7 },
    { name: "Kádárta, felső", offset: 8 },
    { name: "Kádárta, bejárati út", offset: 10 },
    { name: "Büntetés-végrehajtási Intézet", offset: 12 },
    { name: "82-es út, bevásárlóközpont", offset: 15 },
    { name: "Viola utca", offset: 19 },
    { name: "Rózsa utca", offset: 20 },
    { name: "Veszprém autóbusz-állomás", offset: 22 },
  ],
  departures: {
    workday: { 4: [35,57], 5: [30,57], 6: [15,30,45,55], 7: [25,52], 8: [30], 9: [0], 10: [0], 11: [0], 12: [0], 13: [0,30], 14: [0,30], 15: [0,30], 16: [0,30], 17: [0,30], 18: [0,30], 19: [0,30], 20: [0,57], 21: [40] },
    weekend: { 4: [57], 5: [57], 7: [0], 8: [0], 9: [0], 10: [0], 11: [0], 12: [0], 13: [0], 14: [0], 15: [0], 16: [0], 17: [0], 18: [0], 19: [0], 20: [0], 21: [5] }
  }
},

// ── LINE 25 (Gyulafirátót → Papvásár utca) ───────────────
{
  id: "25",
  color: "#37474F",
  label: "25-ös busz",
  direction: "Gyulafirátót, forduló ▸ Papvásár utca felé",
  stops: [
    { name: "Gyulafirátót, forduló", offset: 0 },
    { name: "Gyulafirátót, felső", offset: 1 },
    { name: "Gyulafirátót, Vizi utca", offset: 5 },
    { name: "Gyulafirátót, Posta utca", offset: 6 },
    { name: "Kádárta, vasúti megállóhely", offset: 8 },
    { name: "Kádárta, Vasút utca", offset: 9 },
    { name: "Kádárta, bolt", offset: 10 },
    { name: "Kádárta, felső", offset: 11 },
    { name: "Kádárta, bejárati út", offset: 13 },
    { name: "Büntetés-végrehajtási Intézet", offset: 15 },
    { name: "82-es út, bevásárlóközpont", offset: 18 },
    { name: "Viola utca", offset: 22 },
    { name: "Rózsa utca", offset: 23 },
    { name: "Hotel", offset: 26 },
    { name: "Petőfi Színház", offset: 28 },
    { name: "Harmat utca", offset: 29 },
    { name: "Völgyhíd tér", offset: 31 },
    { name: "Pápai út 25.", offset: 32 },
    { name: "Tizenháromváros tér", offset: 33 },
    { name: "Dózsa György tér", offset: 34 },
    { name: "Vértanú utca", offset: 35 },
    { name: "Avar utca", offset: 36 },
    { name: "Papvásár utca", offset: 37 },
  ],
  departures: {
    workday: { 7: [5] },
    weekend: {}
  }
},

// ── LINE 28 (Vámosi → Csererdő) ──────────────────────────
{
  id: "28",
  color: "#F57F17",
  label: "28-as busz",
  direction: "Vámosi úti forduló ▸ Csererdő felé",
  stops: [
    { name: "Vámosi úti forduló", offset: 0 },
    { name: "Stadion utca / Kemecse utca", offset: 1 },
    { name: "Kemecse utca", offset: 2 },
    { name: "Egry József utca", offset: 3 },
    { name: "Paál László utca", offset: 4 },
    { name: "Dugovics Titusz utca", offset: 5 },
    { name: "Stadion utca / Wartha Vince utca", offset: 6 },
    { name: "Stadion", offset: 7 },
    { name: "Szegfű utca", offset: 8 },
    { name: "Komakút tér / Pannon Egyetem", offset: 10 },
    { name: "Iskola utca", offset: 11 },
    { name: "Harmat utca", offset: 13 },
    { name: "Völgyhíd tér", offset: 14 },
    { name: "Pápai út 25.", offset: 15 },
    { name: "Pápai úti forduló (körforgalom)", offset: 16 },
    { name: "Pápai út / Henger utca", offset: 17 },
    { name: "BALLUFF / JOST", offset: 18 },
    { name: "Valeo", offset: 19 },
    { name: "Valeo, főporta", offset: 20 },
    { name: "Házgyári út / Henger utca", offset: 22 },
    { name: "Bakony Művek", offset: 23 },
    { name: "Csererdő", offset: 24 },
  ],
  departures: {
    workday: { 5: [16], 13: [13], 21: [18] },
    weekend: {}
  }
},

// ── LINE 28 (Csererdő → Vámosi) ──────────────────────────
{
  id: "28",
  color: "#F57F17",
  label: "28-as busz",
  direction: "Csererdő ▸ Vámosi úti forduló felé",
  stops: [
    { name: "Csererdő", offset: 0 },
    { name: "Bakony Művek", offset: 1 },
    { name: "Continental", offset: 2 },
    { name: "Valeo, főporta", offset: 4 },
    { name: "Valeo", offset: 5 },
    { name: "BALLUFF / JOST", offset: 6 },
    { name: "Pápai út / Henger utca", offset: 7 },
    { name: "Pápai úti forduló (körforgalom)", offset: 8 },
    { name: "Pápai út 25.", offset: 10 },
    { name: "Völgyhíd tér", offset: 11 },
    { name: "Harmat utca", offset: 12 },
    { name: "Petőfi Színház", offset: 13 },
    { name: "Megyeház tér", offset: 14 },
    { name: "Komakút tér / Pannon Egyetem", offset: 15 },
    { name: "Szegfű utca", offset: 16 },
    { name: "Stadion", offset: 18 },
    { name: "Stadion utca / Wartha Vince utca", offset: 19 },
    { name: "Dugovics Titusz utca", offset: 20 },
    { name: "Paál László utca", offset: 21 },
    { name: "Egry József utca", offset: 22 },
    { name: "Kemecse utca", offset: 23 },
    { name: "Stadion utca / Kemecse utca", offset: 24 },
    { name: "Vámosi úti forduló", offset: 26 },
  ],
  departures: {
    workday: { 6: [6], 14: [6], 22: [9] },
    weekend: {}
  }
},

// ── LINE 42 (Hotel körjárat) ──────────────────────────────
{
  id: "42",
  color: "#880E4F",
  label: "42-es busz",
  direction: "Hotel ▸ körjárat (egyetem negyeden át)",
  stops: [
    { name: "Hotel", offset: 0 },
    { name: "Petőfi Színház", offset: 2 },
    { name: "Ranolder János tér", offset: 3 },
    { name: "Jókai utca / Ruttner-ház", offset: 4 },
    { name: "Patak tér (Veszprém Zoo)", offset: 5 },
    { name: "Dózsa György tér", offset: 6 },
    { name: "Vértanú utca", offset: 6 },
    { name: "Avar utca", offset: 7 },
    { name: "Juhar utca", offset: 8 },
    { name: "Dózsavárosi temető", offset: 9 },
    { name: "Tizenháromváros tér", offset: 10 },
    { name: "Pápai út 25.", offset: 11 },
    { name: "Völgyhíd tér", offset: 12 },
    { name: "Endrődi Sándor lakótelep", offset: 14 },
    { name: "Endrődi Sándor utca", offset: 15 },
    { name: "Szegfű utca", offset: 16 },
    { name: "József Attila utca / egyetemi kollégium", offset: 17 },
    { name: "Stadion utca / Kemecse utca", offset: 18 },
    { name: "Stadion utca / Wartha Vince utca", offset: 19 },
    { name: "Egyetem utca / Stadion utca", offset: 20 },
    { name: "Egyetem utca / ActiCity", offset: 21 },
    { name: "Komakút tér / Pannon Egyetem", offset: 22 },
    { name: "Iskola utca", offset: 23 },
    { name: "Petőfi Színház", offset: 23 },
    { name: "Hotel", offset: 24 },
  ],
  departures: {
    workday: { 4: [11], 23: [5] },
    weekend: { 4: [11], 23: [5] }
  }
},

// ── LINE 43 (autóbusz-állomás → Juhar utca, éjjeli) ──────
{
  id: "43",
  color: "#01579B",
  label: "43-as busz",
  direction: "Veszprém autóbusz-állomás ▸ Juhar utca felé",
  stops: [
    { name: "Veszprém autóbusz-állomás", offset: 0 },
    { name: "Hotel", offset: 1 },
    { name: "Megyeház tér", offset: 3 },
    { name: "Komakút tér / Pannon Egyetem", offset: 4 },
    { name: "Egyetem utca / ActiCity", offset: 5 },
    { name: "Dugovics Titusz utca", offset: 7 },
    { name: "Paál László utca", offset: 8 },
    { name: "Egry József utca", offset: 9 },
    { name: "Kemecse utca", offset: 10 },
    { name: "Stadion utca / Kemecse utca", offset: 11 },
    { name: "József Attila utca / egyetemi kollégium", offset: 11 },
    { name: "Kiskőrösi utca", offset: 12 },
    { name: "Pázmándi utca", offset: 12 },
    { name: "Komakút tér / Pannon Egyetem", offset: 13 },
    { name: "Iskola utca", offset: 14 },
    { name: "Ranolder János tér", offset: 15 },
    { name: "Jókai utca / Ruttner-ház", offset: 16 },
    { name: "Patak tér (Veszprém Zoo)", offset: 17 },
    { name: "Dózsa György tér", offset: 18 },
    { name: "Vértanú utca", offset: 18 },
    { name: "Avar utca", offset: 19 },
    { name: "Juhar utca", offset: 20 },
  ],
  departures: {
    workday: { 23: [30] },
    weekend: { 23: [30] }
  }
},

// ── LINE 47 (Hotel → Pápai út 25., éjjeli, hosszú) ───────
{
  id: "47",
  color: "#33691E",
  label: "47-es busz",
  direction: "Hotel ▸ Pápai út 25. felé",
  stops: [
    { name: "Hotel", offset: 0 },
    { name: "Veszprém autóbusz-állomás", offset: 2 },
    { name: "Petőfi Sándor utca", offset: 3 },
    { name: "Munkácsy Mihály utca", offset: 4 },
    { name: "Haszkovó utca", offset: 5 },
    { name: "Laktanya", offset: 6 },
    { name: "Aulich Lajos utca", offset: 7 },
    { name: "Veszprém vasútállomás", offset: 8 },
    { name: "Láhner György utca", offset: 10 },
    { name: "Aulich utca, garázstelep", offset: 10 },
    { name: "Deák Ferenc iskola", offset: 11 },
    { name: "Aradi vértanúk utca", offset: 12 },
    { name: "Haszkovó utca", offset: 13 },
    { name: "Őrház utca", offset: 14 },
    { name: "Fecske utca", offset: 15 },
    { name: "Budapest út", offset: 16 },
    { name: "Vilonyai utca", offset: 17 },
    { name: "Ady Endre utca / Cholnoky Jenő utca", offset: 18 },
    { name: "Lóczy Lajos utca", offset: 19 },
    { name: "Hérics utca", offset: 19 },
    { name: "Cholnoky forduló", offset: 20 },
    { name: "Almádi út", offset: 21 },
    { name: "Mester utca", offset: 22 },
    { name: "Füredidomb", offset: 23 },
    { name: "Kórház", offset: 24 },
    { name: "Hotel", offset: 26 },
    { name: "Petőfi Színház", offset: 28 },
    { name: "Harmat utca", offset: 29 },
    { name: "Völgyhíd tér", offset: 30 },
    { name: "Pápai út 25.", offset: 31 },
  ],
  departures: {
    workday: { 0: [16] },
    weekend: { 0: [16] }
  }
},

];
