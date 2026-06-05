// ============================================================
// City Buses — Veszprém helyi buszjáratok (mindkét irány)
// ============================================================
// Forrás: menetrend-v2-text.txt (VeszprémGO, érvényes 2026. március 1-től)
// Koordináták: VeszprémGO OTP API (Playwright scrape, irányhelyes SP platformok)
// ============================================================

window.CITY_BUSES = [

  // ────────────────────────────────────────────────────────
  // 1 — Veszprém vasútállomás → Valeo, főporta
  // ────────────────────────────────────────────────────────
  {
    id: "1",
    color: "#26A69A",
    label: "1-es busz",
    direction: "Veszprém vasútállomás → Valeo, főporta",
    stops: [
      { name: "Veszprém vasútállomás", offset: 0, lat: 47.118503, lon: 17.91184 },
      { name: "Aulich Lajos utca", offset: 1, lat: 47.116015, lon: 17.913035 },
      { name: "Laktanya", offset: 2, lat: 47.11175, lon: 17.914588 },
      { name: "Jutasi úti lakótelep", offset: 3, lat: 47.107478, lon: 17.911354 },
      { name: "Jutasi út / Barátság park", offset: 4, lat: 47.103722, lon: 17.912269 },
      { name: "Petőfi Sándor utca", offset: 5, lat: 47.099945, lon: 17.913157 },
      { name: "Veszprém, autóbusz-állomás", offset: 7, lat: 47.094432, lon: 17.91276 },
      { name: "Hotel", offset: 8, lat: 47.092241, lon: 17.912316 },
      { name: "Petőfi Színház", offset: 10, lat: 47.091889, lon: 17.906204 },
      { name: "Harmat utca", offset: 11, lat: 47.094506, lon: 17.899853 },
      { name: "Völgyhíd tér", offset: 12, lat: 47.098864, lon: 17.894758 },
      { name: "Pápai út 25.", offset: 13, lat: 47.100082, lon: 17.891543 },
      { name: "Pápai úti forduló (körforgalom)", offset: 14, lat: 47.102541, lon: 17.884202 },
      { name: "Pápai út / Henger utca", offset: 15, lat: 47.104763, lon: 17.877518 },
      { name: "BALLUFF / JOST", offset: 16, lat: 47.107642, lon: 17.876678 },
      { name: "Valeo", offset: 17, lat: 47.109284, lon: 17.876829 },
      { name: "Valeo, főporta", offset: 18, lat: 47.108831, lon: 17.876594 },
    ],
    departures: {
      workday: { 5: [15,25,54], 6: [35], 7: [5,40], 8: [20], 13: [23,53], 14: [23,53], 15: [23,53], 16: [23,53], 18: [20], 21: [20] },
      weekend: { 5: [25], 7: [23], 13: [23], 14: [23], 15: [23], 16: [23], 17: [23], 21: [25] },
    },
  },

  // ────────────────────────────────────────────────────────
  // 3 — Haszkovó forduló → Csererdő
  // ────────────────────────────────────────────────────────
  {
    id: "3",
    color: "#EC407A",
    label: "3-as busz",
    direction: "Haszkovó forduló → Csererdő",
    stops: [
      { name: "Haszkovó forduló", offset: 0, lat: 47.109766, lon: 17.915543 },
      { name: "Haszkovó utca", offset: 1, lat: 47.107733, lon: 17.918168 },
      { name: "Őrház utca", offset: 2, lat: 47.10339, lon: 17.920092 },
      { name: "Pipacs utca", offset: 3, lat: 47.100954, lon: 17.917832 },
      { name: "Petőfi Sándor utca", offset: 4, lat: 47.099945, lon: 17.913157 },
      { name: "Veszprém, autóbusz-állomás", offset: 5, lat: 47.094432, lon: 17.91276 },
      { name: "Hotel", offset: 6, lat: 47.092241, lon: 17.912316 },
      { name: "Petőfi Színház", offset: 8, lat: 47.091889, lon: 17.906204 },
      { name: "Harmat utca", offset: 9, lat: 47.094506, lon: 17.899853 },
      { name: "Völgyhíd tér", offset: 10, lat: 47.098864, lon: 17.894758 },
      { name: "Pápai út 25.", offset: 11, lat: 47.100082, lon: 17.891543 },
      { name: "Tizenháromváros tér", offset: 12, lat: 47.100853, lon: 17.893333 },
      { name: "Dózsa György tér", offset: 13, lat: 47.10156, lon: 17.898559 },
      { name: "Vértanú utca", offset: 15, lat: 47.103651, lon: 17.896968 },
      { name: "Avar utca", offset: 16, lat: 47.10579, lon: 17.895749 },
      { name: "Ipar utca", offset: 17, lat: 47.109575, lon: 17.890032 },
      { name: "Fórum", offset: 19, lat: 47.11312, lon: 17.884401 },
      { name: "Házgyár", offset: 20, lat: 47.113063, lon: 17.876893 },
      { name: "Bakony Művek", offset: 21, lat: 47.115172, lon: 17.878363 },
      { name: "Csererdő", offset: 22, lat: 47.115026, lon: 17.870273 },
    ],
    departures: {
      workday: { 4: [55], 5: [8,18,28,48], 6: [8,26,44], 7: [0,16,33,53], 8: [13,43], 9: [13,43], 10: [13,43], 11: [13,43], 12: [13,43], 13: [3,13,33,53], 14: [13,33,53], 15: [13,33,53], 16: [13,33,53], 17: [13,43], 18: [13,43], 19: [13,43], 20: [13], 21: [17], 22: [15] },
      weekend: { 5: [18], 6: [18], 7: [18], 8: [18], 9: [18], 10: [18], 11: [18], 12: [18], 13: [23], 14: [18], 15: [18], 16: [18], 17: [18], 18: [18], 19: [18], 20: [18], 21: [23], 22: [15] },
    },
  },

  // ────────────────────────────────────────────────────────
  // 4 — Jutaspuszta → Vámosi úti forduló
  // ────────────────────────────────────────────────────────
  {
    id: "4",
    color: "#66BB6A",
    label: "4-es busz",
    direction: "Jutaspuszta → Vámosi úti forduló",
    stops: [
      { name: "Jutaspuszta", offset: 0, lat: 47.123808, lon: 17.901412 },
      { name: "Kisréti utca", offset: 1, lat: 47.120469, lon: 17.904218 },
      { name: "Jutaspusztai elágazás", offset: 2, lat: 47.123808, lon: 17.901412 },
      { name: "Veszprém vasútállomás", offset: 10, lat: 47.118492, lon: 17.9108 },
      { name: "Aulich Lajos utca", offset: 11, lat: 47.116015, lon: 17.913035 },
      { name: "Laktanya", offset: 11, lat: 47.110405, lon: 17.914382 },
      { name: "Haszkovó utca", offset: 13, lat: 47.107733, lon: 17.918168 },
      { name: "Munkácsy Mihály utca", offset: 14, lat: 47.103271, lon: 17.915362 },
      { name: "Petőfi Sándor utca", offset: 15, lat: 47.099945, lon: 17.913157 },
      { name: "Veszprém, autóbusz-állomás", offset: 16, lat: 47.094432, lon: 17.91276 },
      { name: "Hotel", offset: 17, lat: 47.092241, lon: 17.912316 },
      { name: "Megyeház tér", offset: 19, lat: 47.091226, lon: 17.907621 },
      { name: "Komakút tér / Pannon Egyetem", offset: 20, lat: 47.089683, lon: 17.907212 },
      { name: "Egyetem utca / ActiCity", offset: 21, lat: 47.086524, lon: 17.908604 },
      { name: "Egyetem utca / Stadion utca", offset: 23, lat: 47.08459, lon: 17.904639 },
      { name: "Stadion utca / Wartha Vince utca", offset: 24, lat: 47.08459, lon: 17.904639 },
      { name: "Stadion", offset: 25, lat: 47.084439, lon: 17.90485 },
      { name: "Szegfű utca", offset: 26, lat: 47.087357, lon: 17.901859 },
      { name: "József Attila utca / egyetemi kollégium", offset: 27, lat: 47.085345, lon: 17.899191 },
      { name: "Vámosi úti forduló", offset: 28, lat: 47.083255, lon: 17.89776 },
    ],
    departures: {
      workday: { 5: [11], 6: [9], 7: [0], 8: [0], 9: [0], 10: [0], 11: [0], 12: [0], 13: [0], 14: [0], 15: [0], 16: [0], 17: [0], 18: [0], 19: [0], 20: [0], 21: [0] },
      weekend: { 4: [58], 5: [58], 6: [57], 8: [0], 9: [0], 10: [0], 11: [0], 12: [0], 13: [0], 14: [0], 15: [0], 16: [0], 17: [0], 18: [0], 19: [0], 20: [28] },
    },
  },

  // ────────────────────────────────────────────────────────
  // 4A — Veszprém vasútállomás → Vámosi úti forduló
  // ────────────────────────────────────────────────────────
  {
    id: "4A",
    color: "#81C784",
    label: "4A busz",
    direction: "Veszprém vasútállomás → Vámosi úti forduló",
    stops: [
      { name: "Veszprém vasútállomás", offset: 0, lat: 47.118503, lon: 17.91184 },
      { name: "Aulich Lajos utca", offset: 1, lat: 47.116015, lon: 17.913035 },
      { name: "Laktanya", offset: 1, lat: 47.110405, lon: 17.914382 },
      { name: "Haszkovó utca", offset: 3, lat: 47.107733, lon: 17.918168 },
      { name: "Munkácsy Mihály utca", offset: 4, lat: 47.103271, lon: 17.915362 },
      { name: "Petőfi Sándor utca", offset: 5, lat: 47.099945, lon: 17.913157 },
      { name: "Veszprém, autóbusz-állomás", offset: 6, lat: 47.094432, lon: 17.91276 },
      { name: "Hotel", offset: 7, lat: 47.092241, lon: 17.912316 },
      { name: "Megyeház tér", offset: 9, lat: 47.091226, lon: 17.907621 },
      { name: "Komakút tér / Pannon Egyetem", offset: 10, lat: 47.089683, lon: 17.907212 },
      { name: "Egyetem utca / ActiCity", offset: 11, lat: 47.086524, lon: 17.908604 },
      { name: "Egyetem utca / Stadion utca", offset: 13, lat: 47.08459, lon: 17.904639 },
      { name: "Stadion utca / Wartha Vince utca", offset: 14, lat: 47.08459, lon: 17.904639 },
      { name: "Stadion", offset: 15, lat: 47.084439, lon: 17.90485 },
      { name: "Szegfű utca", offset: 16, lat: 47.087357, lon: 17.901859 },
      { name: "József Attila utca / egyetemi kollégium", offset: 17, lat: 47.085345, lon: 17.899191 },
      { name: "Vámosi úti forduló", offset: 18, lat: 47.083255, lon: 17.89776 },
    ],
    departures: {
      workday: { 5: [0,19,39,58], 6: [17,29,42,55], 7: [8,23,38,53], 8: [8,23,38], 9: [8,38], 10: [8,38], 11: [8,38], 12: [8,38], 13: [8,28,43], 14: [8,23,38,53], 15: [8,23,38,53], 16: [8,23,38,53], 17: [8,23,43], 18: [8,38], 19: [8,38], 20: [8,38], 21: [10,40], 22: [38] },
      weekend: { 5: [5], 6: [5], 7: [4,38], 8: [8,38], 9: [8,38], 10: [8,38], 11: [8,38], 12: [8,38], 13: [8,38], 14: [8,38], 15: [8,38], 16: [8,38], 17: [8,38], 18: [8,38], 19: [10,38], 20: [38], 21: [40], 22: [38] },
    },
  },

  // ────────────────────────────────────────────────────────
  // 5 — Veszprém vasútállomás → Kádártai úti forduló
  // ────────────────────────────────────────────────────────
  {
    id: "5",
    color: "#AB47BC",
    label: "5-ös busz",
    direction: "Veszprém vasútállomás → Kádártai úti forduló",
    stops: [
      { name: "Veszprém vasútállomás", offset: 0, lat: 47.118503, lon: 17.91184 },
      { name: "Tüzér utcai forduló", offset: 5, lat: 47.103323, lon: 17.901318 },
      { name: "Papvásár utca", offset: 6, lat: 47.105941, lon: 17.900889 },
      { name: "Tüzér utca", offset: 7, lat: 47.103323, lon: 17.901318 },
      { name: "Dózsa György tér", offset: 8, lat: 47.101928, lon: 17.897245 },
      { name: "Tizenháromváros tér", offset: 9, lat: 47.100724, lon: 17.891978 },
      { name: "Pápai út 25.", offset: 10, lat: 47.099937, lon: 17.891624 },
      { name: "Völgyhíd tér", offset: 11, lat: 47.099182, lon: 17.894188 },
      { name: "Harmat utca", offset: 12, lat: 47.0945, lon: 17.899751 },
      { name: "Petőfi Színház", offset: 13, lat: 47.09167, lon: 17.90534 },
      { name: "Hotel", offset: 15, lat: 47.092222, lon: 17.912679 },
      { name: "Kabay János utca", offset: 16, lat: 47.092055, lon: 17.916016 },
      { name: "Ady Endre utca", offset: 17, lat: 47.092792, lon: 17.925278 },
      { name: "Ady Endre utca / Cholnoky Jenő utca", offset: 18, lat: 47.092792, lon: 17.925278 },
      { name: "Cholnoky lakótelep", offset: 19, lat: 47.089911, lon: 17.923464 },
      { name: "Cholnoky forduló", offset: 20, lat: 47.087263, lon: 17.923479 },
      { name: "Hérics utca", offset: 21, lat: 47.089045, lon: 17.926894 },
      { name: "Lóczy Lajos utca", offset: 22, lat: 47.092555, lon: 17.929336 },
      { name: "Csillag utca", offset: 23, lat: 47.096346, lon: 17.92939 },
      { name: "Vilonyai utca", offset: 24, lat: 47.097514, lon: 17.927919 },
      { name: "Budapest út", offset: 25, lat: 47.099009, lon: 17.925338 },
      { name: "Bolgár Mihály utca", offset: 27, lat: 47.100618, lon: 17.926391 },
      { name: "Kádártai úti forduló", offset: 28, lat: 47.103334, lon: 17.929956 },
    ],
    departures: {
      workday: { 5: [26,56], 6: [22], 7: [7,40], 8: [38], 9: [38], 10: [38], 11: [38], 12: [38], 13: [38,58], 14: [38,58], 15: [38,58], 16: [38], 17: [38], 18: [38], 19: [38], 20: [38], 21: [38] },
      weekend: { 5: [26], 6: [26], 7: [38], 8: [38], 9: [38], 10: [38], 11: [38], 12: [38], 13: [38], 14: [38], 15: [38], 16: [38], 17: [38], 18: [38], 19: [38], 20: [38], 21: [38] },
    },
  },

  // ────────────────────────────────────────────────────────
  // 6 — Haszkovó forduló → Vámosi úti forduló
  // ────────────────────────────────────────────────────────
  {
    id: "6",
    color: "#FDD835",
    label: "6-os busz",
    direction: "Haszkovó forduló → Vámosi úti forduló",
    stops: [
      { name: "Haszkovó forduló", offset: 0, lat: 47.109766, lon: 17.915543 },
      { name: "Aradi vértanúk utca", offset: 1, lat: 47.109992, lon: 17.918867 },
      { name: "Deák Ferenc iskola", offset: 2, lat: 47.110694, lon: 17.92192 },
      { name: "Március 15. utca", offset: 4, lat: 47.105726, lon: 17.925248 },
      { name: "Tölgyfa utca", offset: 5, lat: 47.103627, lon: 17.927625 },
      { name: "Bolgár Mihály utca", offset: 6, lat: 47.100618, lon: 17.926391 },
      { name: "Budapest út", offset: 7, lat: 47.099318, lon: 17.925216 },
      { name: "Viola utca", offset: 8, lat: 47.096763, lon: 17.920946 },
      { name: "Rózsa utca", offset: 9, lat: 47.094846, lon: 17.917423 },
      { name: "Hotel", offset: 11, lat: 47.092241, lon: 17.912316 },
      { name: "Megyeház tér", offset: 13, lat: 47.091226, lon: 17.907621 },
      { name: "Komakút tér / Pannon Egyetem", offset: 14, lat: 47.089683, lon: 17.907212 },
      { name: "Egyetem utca / ActiCity", offset: 15, lat: 47.085373, lon: 17.908938 },
      { name: "Dugovics Titusz utca", offset: 17, lat: 47.08216, lon: 17.91074 },
      { name: "Paál László utca", offset: 18, lat: 47.078752, lon: 17.909309 },
      { name: "Egry József utca", offset: 19, lat: 47.078322, lon: 17.906013 },
      { name: "Kemecse utca", offset: 20, lat: 47.083132, lon: 17.901447 },
      { name: "Stadion utca / Kemecse utca", offset: 21, lat: 47.08459, lon: 17.904639 },
      { name: "Vámosi úti forduló", offset: 23, lat: 47.083255, lon: 17.89776 },
    ],
    departures: {
      workday: { 4: [48], 5: [8,28,48], 6: [7,22,34,48], 7: [2,16,31,46], 8: [1,16,31,51], 9: [23,53], 10: [23,53], 11: [23,53], 12: [23,53], 13: [18,36,55], 14: [15,31,46], 15: [1,16,31,46], 16: [1,16,32,47], 17: [2,17,35,55], 18: [23,53], 19: [23,53], 20: [23,53], 21: [24,54] },
      weekend: { 4: [48], 5: [35], 6: [35], 7: [23,53], 8: [23,53], 9: [23,53], 10: [23,53], 11: [23,53], 12: [23,53], 13: [23,53], 14: [23,53], 15: [23,53], 16: [23,53], 17: [23,53], 18: [23,53], 19: [23], 20: [8], 21: [8,54] },
    },
  },

  // ────────────────────────────────────────────────────────
  // 7 — Haszkovó forduló → Cholnoky forduló
  // ────────────────────────────────────────────────────────
  {
    id: "7",
    color: "#5C6BC0",
    label: "7-es busz",
    direction: "Haszkovó forduló → Cholnoky forduló",
    stops: [
      { name: "Haszkovó forduló", offset: 0, lat: 47.109766, lon: 17.915543 },
      { name: "Haszkovó utca", offset: 1, lat: 47.107733, lon: 17.918168 },
      { name: "Munkácsy Mihály utca", offset: 3, lat: 47.103271, lon: 17.915362 },
      { name: "Petőfi Sándor utca", offset: 4, lat: 47.099945, lon: 17.913157 },
      { name: "Veszprém, autóbusz-állomás", offset: 5, lat: 47.094432, lon: 17.91276 },
      { name: "Hotel", offset: 6, lat: 47.092241, lon: 17.912316 },
      { name: "Kórház", offset: 7, lat: 47.09008, lon: 17.911542 },
      { name: "Füredi utca", offset: 9, lat: 47.083278, lon: 17.911912 },
      { name: "Mester utca", offset: 10, lat: 47.08334, lon: 17.91807 },
      { name: "Almádi út", offset: 11, lat: 47.08445, lon: 17.920912 },
      { name: "Cholnoky lakótelep", offset: 13, lat: 47.091168, lon: 17.924473 },
      { name: "Ady Endre utca / Cholnoky Jenő utca", offset: 14, lat: 47.093237, lon: 17.927315 },
      { name: "Vilonyai utca", offset: 15, lat: 47.096641, lon: 17.927203 },
      { name: "Csillag utca", offset: 16, lat: 47.095691, lon: 17.929167 },
      { name: "Lóczy Lajos utca", offset: 17, lat: 47.092122, lon: 17.928916 },
      { name: "Hérics utca", offset: 17, lat: 47.090254, lon: 17.928026 },
      { name: "Cholnoky forduló", offset: 18, lat: 47.087259, lon: 17.924356 },
    ],
    departures: {
      workday: { 6: [24,52], 7: [19,49], 8: [55], 9: [55], 10: [55], 11: [55], 12: [56], 13: [57], 14: [47], 15: [17,47], 16: [17,48], 17: [55], 18: [55], 19: [55] },
      weekend: { 7: [56], 8: [56], 9: [56], 10: [56], 11: [56], 12: [56], 13: [56], 14: [56], 15: [56], 16: [56], 17: [56], 18: [56] },
    },
  },

  // ────────────────────────────────────────────────────────
  // 7A — Haszkovó forduló → Ady E. utca / Cholnoky J. utca
  // ────────────────────────────────────────────────────────
  {
    id: "7A",
    color: "#7986CB",
    label: "7A busz",
    direction: "Haszkovó forduló → Ady E. utca / Cholnoky J. utca",
    stops: [
      { name: "Haszkovó forduló", offset: 0, lat: 47.109766, lon: 17.915543 },
      { name: "Haszkovó utca", offset: 1, lat: 47.107733, lon: 17.918168 },
      { name: "Munkácsy Mihály utca", offset: 3, lat: 47.103271, lon: 17.915362 },
      { name: "Petőfi Sándor utca", offset: 4, lat: 47.099945, lon: 17.913157 },
      { name: "Veszprém, autóbusz-állomás", offset: 6, lat: 47.094432, lon: 17.91276 },
      { name: "Hotel", offset: 8, lat: 47.092241, lon: 17.912316 },
      { name: "Kórház", offset: 9, lat: 47.09008, lon: 17.911542 },
      { name: "Radnóti Miklós tér", offset: 11, lat: 47.08778, lon: 17.91703 },
      { name: "Almádi út", offset: 12, lat: 47.08445, lon: 17.920912 },
      { name: "Cholnoky forduló", offset: 14, lat: 47.087259, lon: 17.924356 },
      { name: "Hérics utca", offset: 15, lat: 47.089045, lon: 17.926894 },
      { name: "Lóczy Lajos utca", offset: 16, lat: 47.092555, lon: 17.929336 },
      { name: "Ady Endre utca / Cholnoky Jenő utca", offset: 17, lat: 47.094406, lon: 17.92654 },
    ],
    departures: {
      workday: { 5: [12,32,51], 6: [10,39], 7: [5,34], 8: [4,19,34], 9: [25], 10: [25], 11: [25], 12: [25], 13: [22,39], 14: [17,32], 15: [2,32], 16: [2,32], 17: [4,19,35], 18: [25], 19: [25], 20: [25,56], 21: [27], 22: [22] },
      weekend: { 5: [38], 6: [38], 7: [23], 8: [26], 9: [26], 10: [26], 11: [26], 12: [26], 13: [26], 14: [26], 15: [26], 16: [26], 17: [26], 18: [26], 19: [25], 20: [10], 21: [10], 22: [22] },
    },
  },

  // ────────────────────────────────────────────────────────
  // 8 — Haszkovó forduló → Csererdő
  // ────────────────────────────────────────────────────────
  {
    id: "8",
    color: "#42A5F5",
    label: "8-as busz",
    direction: "Haszkovó forduló → Csererdő",
    stops: [
      { name: "Haszkovó forduló", offset: 0, lat: 47.109766, lon: 17.915543 },
      { name: "Haszkovó utca", offset: 1, lat: 47.107733, lon: 17.918168 },
      { name: "Őrház utca", offset: 2, lat: 47.10339, lon: 17.920092 },
      { name: "Fecske utca", offset: 3, lat: 47.101529, lon: 17.924781 },
      { name: "Budapest út", offset: 4, lat: 47.099009, lon: 17.925338 },
      { name: "Vilonyai utca", offset: 5, lat: 47.097611, lon: 17.926908 },
      { name: "Ady Endre utca / Cholnoky Jenő utca", offset: 6, lat: 47.093357, lon: 17.924594 },
      { name: "Lóczy Lajos utca", offset: 7, lat: 47.092122, lon: 17.928916 },
      { name: "Hérics utca", offset: 7, lat: 47.090254, lon: 17.928026 },
      { name: "Cholnoky forduló", offset: 8, lat: 47.087263, lon: 17.923479 },
      { name: "Almádi út", offset: 9, lat: 47.085791, lon: 17.919692 },
      { name: "Mester utca", offset: 10, lat: 47.08384, lon: 17.918683 },
      { name: "Füredi utca", offset: 11, lat: 47.083421, lon: 17.914126 },
      { name: "Egyetem utca / ActiCity", offset: 12, lat: 47.086524, lon: 17.908604 },
      { name: "Komakút tér / Pannon Egyetem", offset: 13, lat: 47.089341, lon: 17.907516 },
      { name: "Iskola utca", offset: 14, lat: 47.091248, lon: 17.90528 },
      { name: "Harmat utca", offset: 15, lat: 47.094506, lon: 17.899853 },
      { name: "Völgyhíd tér", offset: 16, lat: 47.098864, lon: 17.894758 },
      { name: "Pápai út 25.", offset: 17, lat: 47.100082, lon: 17.891543 },
      { name: "Pápai úti forduló (körforgalom)", offset: 18, lat: 47.102541, lon: 17.884202 },
      { name: "Pápai út / Henger utca", offset: 19, lat: 47.104763, lon: 17.877518 },
      { name: "BALLUFF / JOST", offset: 20, lat: 47.107642, lon: 17.876678 },
      { name: "Valeo", offset: 21, lat: 47.109284, lon: 17.876829 },
      { name: "Valeo, főporta", offset: 22, lat: 47.109284, lon: 17.876829 },
      { name: "Házgyári út / Henger utca", offset: 24, lat: 47.113063, lon: 17.876893 },
      { name: "Bakony Művek", offset: 25, lat: 47.115172, lon: 17.878363 },
      { name: "Csererdő", offset: 26, lat: 47.115026, lon: 17.870273 },
    ],
    departures: {
      workday: { 5: [7,22,51], 6: [21,51], 7: [11,21,55], 8: [25], 12: [51], 13: [16,26,55], 14: [25,55], 15: [25,55], 16: [25,59], 21: [15] },
      weekend: { 5: [21], 13: [9], 17: [9], 21: [15] },
    },
  },

  // ────────────────────────────────────────────────────────
  // 13 — Kádártai úti forduló → Völgyhíd tér
  // ────────────────────────────────────────────────────────
  {
    id: "13",
    color: "#EF5350",
    label: "13-as busz",
    direction: "Kádártai úti forduló → Völgyhíd tér",
    stops: [
      { name: "Kádártai úti forduló", offset: 0, lat: 47.103334, lon: 17.929956 },
      { name: "Bolgár Mihály utca", offset: 1, lat: 47.101015, lon: 17.9267 },
      { name: "Fecske utca", offset: 2, lat: 47.102379, lon: 17.924002 },
      { name: "Őrház utca", offset: 3, lat: 47.103515, lon: 17.920281 },
      { name: "Munkácsy Mihály utca", offset: 4, lat: 47.103271, lon: 17.915362 },
      { name: "Petőfi Sándor utca", offset: 5, lat: 47.099945, lon: 17.913157 },
      { name: "Veszprém, autóbusz-állomás", offset: 7, lat: 47.094432, lon: 17.91276 },
      { name: "Hotel", offset: 9, lat: 47.092241, lon: 17.912316 },
      { name: "Petőfi Színház", offset: 11, lat: 47.091889, lon: 17.906204 },
      { name: "Ranolder János tér", offset: 12, lat: 47.09349, lon: 17.90524 },
      { name: "Jókai utca / Ruttner-ház", offset: 13, lat: 47.094981, lon: 17.904186 },
      { name: "Patak tér (Veszprém Zoo)", offset: 14, lat: 47.097141, lon: 17.901073 },
      { name: "Dózsa György tér", offset: 15, lat: 47.102019, lon: 17.898756 },
      { name: "Vértanú utca", offset: 16, lat: 47.103651, lon: 17.896968 },
      { name: "Avar utca", offset: 17, lat: 47.106102, lon: 17.895138 },
      { name: "Juhar utca", offset: 18, lat: 47.105956, lon: 17.887681 },
      { name: "Dózsavárosi temető", offset: 19, lat: 47.102816, lon: 17.892349 },
      { name: "Tizenháromváros tér", offset: 20, lat: 47.100724, lon: 17.891978 },
      { name: "Pápai út 25.", offset: 21, lat: 47.099937, lon: 17.891624 },
      { name: "Völgyhíd tér", offset: 22, lat: 47.098864, lon: 17.894758 },
    ],
    departures: {
      workday: { 5: [4,40], 6: [9,34,54], 7: [24,54], 8: [24], 9: [0,40], 10: [20], 11: [0,40], 12: [20,55], 13: [23,53], 14: [23,53], 15: [21,51], 16: [21,51], 17: [0], 18: [0], 19: [0], 20: [0], 21: [0] },
      weekend: {},
    },
  },

  // ────────────────────────────────────────────────────────
  // 16 — Vámosi úti forduló → Bakony Művek
  // ────────────────────────────────────────────────────────
  {
    id: "16",
    color: "#8D6E63",
    label: "16-os busz",
    direction: "Vámosi úti forduló → Bakony Művek",
    sundayOnly: true,
    stops: [
      { name: "Vámosi úti forduló", offset: 0, lat: 47.083255, lon: 17.89776 },
      { name: "Stadion utca / Kemecse utca", offset: 1, lat: 47.084439, lon: 17.90485 },
      { name: "Kemecse utca", offset: 2, lat: 47.083078, lon: 17.90108 },
      { name: "Egry József utca", offset: 3, lat: 47.078239, lon: 17.905549 },
      { name: "Paál László utca", offset: 4, lat: 47.07878, lon: 17.909659 },
      { name: "Dugovics Titusz utca", offset: 5, lat: 47.081957, lon: 17.910887 },
      { name: "Egyetem utca / ActiCity", offset: 7, lat: 47.086524, lon: 17.908604 },
      { name: "Komakút tér / Pannon Egyetem", offset: 8, lat: 47.089341, lon: 17.907516 },
      { name: "Petőfi Színház", offset: 9, lat: 47.091889, lon: 17.906204 },
      { name: "Hotel", offset: 11, lat: 47.092222, lon: 17.912679 },
      { name: "Rózsa utca", offset: 12, lat: 47.094078, lon: 17.916327 },
      { name: "Viola utca", offset: 13, lat: 47.096991, lon: 17.921773 },
      { name: "Budapest út", offset: 15, lat: 47.099009, lon: 17.925338 },
      { name: "Bolgár Mihály utca", offset: 16, lat: 47.101015, lon: 17.9267 },
      { name: "Tölgyfa utca", offset: 17, lat: 47.103358, lon: 17.928189 },
      { name: "Március 15. utca", offset: 18, lat: 47.106335, lon: 17.924849 },
      { name: "Deák Ferenc iskola", offset: 20, lat: 47.110931, lon: 17.922543 },
      { name: "Aradi vértanúk utca", offset: 21, lat: 47.110255, lon: 17.919595 },
      { name: "Laktanya", offset: 22, lat: 47.11175, lon: 17.914588 },
      { name: "Aulich Lajos utca", offset: 23, lat: 47.116015, lon: 17.913035 },
      { name: "Jutaspusztai elágazás", offset: 26, lat: 47.123808, lon: 17.901412 },
      { name: "Komfort", offset: 27, lat: 47.11642, lon: 17.896716 },
      { name: "Agroker", offset: 28, lat: 47.11582, lon: 17.892886 },
      { name: "Posta-garázs", offset: 29, lat: 47.114574, lon: 17.889031 },
      { name: "Házgyár", offset: 30, lat: 47.113063, lon: 17.876893 },
      { name: "Bakony Művek", offset: 31, lat: 47.115172, lon: 17.878363 },
    ],
    departures: {
      workday: {},
      weekend: { 6: [28], 7: [38], 8: [37], 9: [37], 10: [37] },
    },
  },

  // ────────────────────────────────────────────────────────
  // 28 — Vámosi úti forduló → Csererdő
  // ────────────────────────────────────────────────────────
  {
    id: "28",
    color: "#FFA726",
    label: "28-as busz",
    direction: "Vámosi úti forduló → Csererdő",
    stops: [
      { name: "Vámosi úti forduló", offset: 0, lat: 47.083255, lon: 17.89776 },
      { name: "Stadion utca / Kemecse utca", offset: 1, lat: 47.084439, lon: 17.90485 },
      { name: "Kemecse utca", offset: 2, lat: 47.083078, lon: 17.90108 },
      { name: "Egry József utca", offset: 3, lat: 47.078239, lon: 17.905549 },
      { name: "Paál László utca", offset: 4, lat: 47.07878, lon: 17.909659 },
      { name: "Dugovics Titusz utca", offset: 5, lat: 47.08216, lon: 17.91074 },
      { name: "Stadion utca / Wartha Vince utca", offset: 6, lat: 47.08459, lon: 17.904639 },
      { name: "Stadion", offset: 7, lat: 47.084439, lon: 17.90485 },
      { name: "Szegfű utca", offset: 8, lat: 47.087357, lon: 17.901859 },
      { name: "Komakút tér / Pannon Egyetem", offset: 10, lat: 47.089341, lon: 17.907516 },
      { name: "Iskola utca", offset: 11, lat: 47.091248, lon: 17.90528 },
      { name: "Harmat utca", offset: 13, lat: 47.094506, lon: 17.899853 },
      { name: "Völgyhíd tér", offset: 14, lat: 47.098864, lon: 17.894758 },
      { name: "Pápai út 25.", offset: 15, lat: 47.100082, lon: 17.891543 },
      { name: "Pápai úti forduló (körforgalom)", offset: 16, lat: 47.102541, lon: 17.884202 },
      { name: "Pápai út / Henger utca", offset: 17, lat: 47.104763, lon: 17.877518 },
      { name: "BALLUFF / JOST", offset: 18, lat: 47.107642, lon: 17.876678 },
      { name: "Valeo", offset: 19, lat: 47.109284, lon: 17.876829 },
      { name: "Valeo, főporta", offset: 20, lat: 47.109284, lon: 17.876829 },
      { name: "Házgyári út / Henger utca", offset: 22, lat: 47.113063, lon: 17.876893 },
      { name: "Bakony Művek", offset: 23, lat: 47.115172, lon: 17.878363 },
      { name: "Csererdő", offset: 24, lat: 47.115026, lon: 17.870273 },
    ],
    departures: {
      workday: { 5: [16], 13: [13], 21: [18] },
      weekend: {},
    },
  },

  // ────────────────────────────────────────────────────────
  // 6 — Vámosi úti forduló → Haszkovó forduló
  // ────────────────────────────────────────────────────────
  {
    id: "6",
    color: "#FDD835",
    label: "6-os busz",
    direction: "Vámosi úti forduló → Haszkovó forduló",
    stops: [
      { name: "Vámosi úti forduló", offset: 0, lat: 47.083255, lon: 17.89776 },
      { name: "Stadion utca / Kemecse utca", offset: 1, lat: 47.084439, lon: 17.90485 },
      { name: "Kemecse utca", offset: 2, lat: 47.083078, lon: 17.90108 },
      { name: "Egry József utca", offset: 4, lat: 47.078239, lon: 17.905549 },
      { name: "Paál László utca", offset: 5, lat: 47.07878, lon: 17.909659 },
      { name: "Dugovics Titusz utca", offset: 6, lat: 47.081957, lon: 17.910887 },
      { name: "Egyetem utca / ActiCity", offset: 8, lat: 47.086524, lon: 17.908604 },
      { name: "Komakút tér / Pannon Egyetem", offset: 10, lat: 47.089341, lon: 17.907516 },
      { name: "Petőfi Színház", offset: 12, lat: 47.091889, lon: 17.906204 },
      { name: "Hotel", offset: 14, lat: 47.092222, lon: 17.912679 },
      { name: "Rózsa utca", offset: 15, lat: 47.094078, lon: 17.916327 },
      { name: "Viola utca", offset: 17, lat: 47.096991, lon: 17.921773 },
      { name: "Budapest út", offset: 20, lat: 47.099009, lon: 17.925338 },
      { name: "Bolgár Mihály utca", offset: 22, lat: 47.101015, lon: 17.9267 },
      { name: "Tölgyfa utca", offset: 23, lat: 47.103358, lon: 17.928189 },
      { name: "Március 15. utca", offset: 24, lat: 47.106335, lon: 17.924849 },
      { name: "Deák Ferenc iskola", offset: 26, lat: 47.110931, lon: 17.922543 },
      { name: "Aradi vértanúk utca", offset: 27, lat: 47.110255, lon: 17.919595 },
      { name: "Haszkovó forduló", offset: 28, lat: 47.109766, lon: 17.915543 },
    ],
    departures: {
      workday: { 4: [48], 5: [10,35,52], 6: [7,22,36,50], 7: [5,20,35,49], 8: [4,23,43], 9: [7,37], 10: [7,37], 11: [7,37], 12: [7,32,52], 13: [12,29,44,59], 14: [14,29,44], 15: [0,16,31,46], 16: [1,16,32,50], 17: [10,30,50], 18: [12,37], 19: [8,38], 20: [8,40], 21: [10,45] },
      weekend: { 5: [22], 6: [28], 7: [8,38], 8: [7,37], 9: [7,37], 10: [7,37], 11: [7,37], 12: [7,37], 13: [7,37], 14: [7,37], 15: [7,37], 16: [7,37], 17: [7,37], 18: [7,37], 19: [22], 20: [24], 21: [45] },
    },
  },

  // ────────────────────────────────────────────────────────
  // 4 — Vámosi úti forduló → Jutaspuszta
  // ────────────────────────────────────────────────────────
  {
    id: "4",
    color: "#66BB6A",
    label: "4-es busz",
    direction: "Vámosi úti forduló → Jutaspuszta",
    stops: [
      { name: "Vámosi úti forduló", offset: 0, lat: 47.083255, lon: 17.89776 },
      { name: "József Attila utca / egyetemi kollégium", offset: 1, lat: 47.085433, lon: 17.899457 },
      { name: "Szegfű utca", offset: 2, lat: 47.087256, lon: 17.900836 },
      { name: "Stadion", offset: 3, lat: 47.08459, lon: 17.904639 },
      { name: "Stadion utca / Wartha Vince utca", offset: 4, lat: 47.084439, lon: 17.90485 },
      { name: "Egyetem utca / Stadion utca", offset: 5, lat: 47.084439, lon: 17.90485 },
      { name: "Egyetem utca / ActiCity", offset: 7, lat: 47.085373, lon: 17.908938 },
      { name: "Komakút tér / Pannon Egyetem", offset: 8, lat: 47.089341, lon: 17.907516 },
      { name: "Petőfi Színház", offset: 9, lat: 47.091889, lon: 17.906204 },
      { name: "Hotel", offset: 11, lat: 47.09223, lon: 17.9127 },
      { name: "Veszprém, autóbusz-állomás", offset: 13, lat: 47.095604, lon: 17.914159 },
      { name: "Petőfi Sándor utca", offset: 14, lat: 47.099838, lon: 17.913781 },
      { name: "Munkácsy Mihály utca", offset: 15, lat: 47.103029, lon: 17.915392 },
      { name: "Haszkovó utca", offset: 17, lat: 47.107307, lon: 17.918592 },
      { name: "Laktanya", offset: 19, lat: 47.11175, lon: 17.914588 },
      { name: "Aulich Lajos utca", offset: 20, lat: 47.114924, lon: 17.913904 },
      { name: "Veszprém vasútállomás", offset: 21, lat: 47.118503, lon: 17.91184 },
      { name: "Kisréti utca", offset: 25, lat: 47.120469, lon: 17.904218 },
      { name: "Jutaspuszta", offset: 26, lat: 47.123808, lon: 17.901412 },
    ],
    departures: {
      workday: { 6: [15], 7: [12], 8: [14], 9: [24], 10: [24], 11: [24], 12: [24], 13: [22], 14: [22], 15: [24], 16: [24], 17: [22], 18: [25], 19: [25], 20: [25], 21: [30] },
      weekend: { 6: [0], 7: [25], 8: [25], 9: [25], 10: [25], 11: [25], 12: [25], 13: [25], 14: [25], 15: [25], 16: [25], 17: [25], 18: [25], 19: [57], 21: [30] },
    },
  },

  // ────────────────────────────────────────────────────────
  // 7A — Ady E. utca → Haszkovó forduló
  // ────────────────────────────────────────────────────────
  {
    id: "7A",
    color: "#7986CB",
    label: "7A busz",
    direction: "Ady E. utca → Haszkovó forduló",
    stops: [
      { name: "Ady Endre utca / Cholnoky Jenő utca", offset: 0, lat: 47.094406, lon: 17.92654 },
      { name: "Lóczy Lajos utca", offset: 1, lat: 47.092122, lon: 17.928916 },
      { name: "Hérics utca", offset: 2, lat: 47.090254, lon: 17.928026 },
      { name: "Cholnoky forduló", offset: 3, lat: 47.087263, lon: 17.923479 },
      { name: "Almádi út", offset: 4, lat: 47.085879, lon: 17.920801 },
      { name: "Radnóti Miklós tér", offset: 6, lat: 47.089352, lon: 17.915199 },
      { name: "Vörösmarty Mihály tér", offset: 7, lat: 47.09053, lon: 17.912972 },
      { name: "Hotel", offset: 8, lat: 47.09223, lon: 17.9127 },
      { name: "Veszprém, autóbusz-állomás", offset: 10, lat: 47.095604, lon: 17.914159 },
      { name: "Petőfi Sándor utca", offset: 11, lat: 47.099838, lon: 17.913781 },
      { name: "Munkácsy Mihály utca", offset: 12, lat: 47.103029, lon: 17.915392 },
      { name: "Haszkovó utca", offset: 14, lat: 47.107307, lon: 17.918592 },
      { name: "Haszkovó forduló", offset: 15, lat: 47.109766, lon: 17.915543 },
    ],
    departures: {
      workday: { 5: [16,40,55], 6: [11,27,57], 7: [26,56], 8: [26,46], 9: [44], 10: [44], 11: [44], 12: [39,59], 13: [34,49], 14: [4,36,51], 15: [23,53], 16: [23,53], 17: [34,54], 18: [44], 19: [44], 20: [44], 21: [14], 22: [37] },
      weekend: { 5: [16], 6: [32], 7: [12,42], 8: [44], 9: [44], 10: [44], 11: [44], 12: [44], 13: [44], 14: [44], 15: [44], 16: [44], 17: [44], 18: [44], 19: [44], 20: [29], 21: [23], 22: [37] },
    },
  },

  // ────────────────────────────────────────────────────────
  // 5 — Kádártai úti forduló → Veszprém vasútállomás
  // ────────────────────────────────────────────────────────
  {
    id: "5",
    color: "#AB47BC",
    label: "5-ös busz",
    direction: "Kádártai úti forduló → Veszprém vasútállomás",
    stops: [
      { name: "Kádártai úti forduló", offset: 0, lat: 47.103334, lon: 17.929956 },
      { name: "Bolgár Mihály utca", offset: 1, lat: 47.101015, lon: 17.9267 },
      { name: "Budapest út", offset: 2, lat: 47.099318, lon: 17.925216 },
      { name: "Vilonyai utca", offset: 3, lat: 47.096641, lon: 17.927203 },
      { name: "Csillag utca", offset: 4, lat: 47.095691, lon: 17.929167 },
      { name: "Lóczy Lajos utca", offset: 5, lat: 47.092122, lon: 17.928916 },
      { name: "Hérics utca", offset: 6, lat: 47.090254, lon: 17.928026 },
      { name: "Cholnoky forduló", offset: 7, lat: 47.087259, lon: 17.924356 },
      { name: "Cholnoky lakótelep", offset: 8, lat: 47.091168, lon: 17.924473 },
      { name: "Ady Endre utca / Cholnoky Jenő utca", offset: 9, lat: 47.094406, lon: 17.92654 },
      { name: "Ady Endre utca", offset: 10, lat: 47.094406, lon: 17.92654 },
      { name: "Diófa utca", offset: 11, lat: 47.094431, lon: 17.917742 },
      { name: "Hotel", offset: 13, lat: 47.092241, lon: 17.912316 },
      { name: "Petőfi Színház", offset: 15, lat: 47.091889, lon: 17.906204 },
      { name: "Harmat utca", offset: 16, lat: 47.094506, lon: 17.899853 },
      { name: "Völgyhíd tér", offset: 18, lat: 47.098864, lon: 17.894758 },
      { name: "Pápai út 25.", offset: 19, lat: 47.100082, lon: 17.891543 },
      { name: "Tizenháromváros tér", offset: 20, lat: 47.100853, lon: 17.893333 },
      { name: "Dózsa György tér", offset: 21, lat: 47.10156, lon: 17.898559 },
      { name: "Tüzér utca", offset: 22, lat: 47.103479, lon: 17.901832 },
      { name: "Papvásár utca", offset: 23, lat: 47.105941, lon: 17.900889 },
      { name: "Tüzér utcai forduló", offset: 24, lat: 47.103479, lon: 17.901832 },
      { name: "Jutaspusztai elágazás", offset: 25, lat: 47.123808, lon: 17.901412 },
      { name: "Veszprém vasútállomás", offset: 29, lat: 47.118503, lon: 17.91184 },
    ],
    departures: {
      workday: { 4: [41], 5: [11,53], 6: [27,54], 7: [11,45], 8: [45], 9: [45], 10: [45], 11: [45], 12: [45], 13: [15,55], 14: [15,53], 15: [13,53], 16: [13,53], 17: [50], 18: [50], 19: [50], 21: [0], 22: [10] },
      weekend: { 4: [46], 5: [54], 6: [54], 7: [54], 8: [54], 9: [54], 10: [54], 11: [54], 12: [54], 13: [54], 14: [54], 15: [54], 16: [54], 17: [54], 18: [54], 19: [54], 21: [0], 22: [10] },
    },
  },

  // ────────────────────────────────────────────────────────
  // 7 — Cholnoky lakótelep → Haszkovó forduló
  // ────────────────────────────────────────────────────────
  {
    id: "7",
    color: "#5C6BC0",
    label: "7-es busz",
    direction: "Cholnoky lakótelep → Haszkovó forduló",
    stops: [
      { name: "Cholnoky lakótelep", offset: 0, lat: 47.089911, lon: 17.923464 },
      { name: "Ady Endre utca / Cholnoky Jenő utca", offset: 1, lat: 47.093237, lon: 17.927315 },
      { name: "Vilonyai utca", offset: 2, lat: 47.096641, lon: 17.927203 },
      { name: "Csillag utca", offset: 3, lat: 47.095691, lon: 17.929167 },
      { name: "Lóczy Lajos utca", offset: 4, lat: 47.092122, lon: 17.928916 },
      { name: "Hérics utca", offset: 5, lat: 47.090254, lon: 17.928026 },
      { name: "Cholnoky forduló", offset: 6, lat: 47.087263, lon: 17.923479 },
      { name: "Almádi út", offset: 7, lat: 47.085791, lon: 17.919692 },
      { name: "Mester utca", offset: 8, lat: 47.08384, lon: 17.918683 },
      { name: "Füredidomb", offset: 10, lat: 47.084643, lon: 17.913102 },
      { name: "Kórház", offset: 11, lat: 47.090289, lon: 17.911669 },
      { name: "Hotel", offset: 13, lat: 47.09223, lon: 17.9127 },
      { name: "Veszprém, autóbusz-állomás", offset: 15, lat: 47.095604, lon: 17.914159 },
      { name: "Petőfi Sándor utca", offset: 16, lat: 47.099838, lon: 17.913781 },
      { name: "Munkácsy Mihály utca", offset: 17, lat: 47.103029, lon: 17.915392 },
      { name: "Haszkovó utca", offset: 19, lat: 47.107307, lon: 17.918592 },
      { name: "Haszkovó forduló", offset: 20, lat: 47.109766, lon: 17.915543 },
    ],
    departures: {
      workday: { 6: [39], 7: [8,38], 8: [8], 9: [11], 10: [11], 11: [11], 12: [11], 13: [13], 14: [16], 15: [4,35], 16: [5,35], 17: [11], 18: [11], 19: [11], 20: [11] },
      weekend: { 8: [11], 9: [11], 10: [11], 11: [11], 12: [11], 13: [11], 14: [11], 15: [11], 16: [11], 17: [11], 18: [11], 19: [11] },
    },
  },

  // ────────────────────────────────────────────────────────
  // 13 — Juhar utca → Kádártai úti forduló
  // ────────────────────────────────────────────────────────
  {
    id: "13",
    color: "#EF5350",
    label: "13-as busz",
    direction: "Juhar utca → Kádártai úti forduló",
    stops: [
      { name: "Juhar utca", offset: 0, lat: 47.105861, lon: 17.888234 },
      { name: "Dózsavárosi temető", offset: 1, lat: 47.102816, lon: 17.892349 },
      { name: "Tizenháromváros tér", offset: 2, lat: 47.100724, lon: 17.891978 },
      { name: "Pápai út 25.", offset: 3, lat: 47.099937, lon: 17.891624 },
      { name: "Völgyhíd tér", offset: 4, lat: 47.098864, lon: 17.894758 },
      { name: "Patak tér (Veszprém Zoo)", offset: 6, lat: 47.097089, lon: 17.901053 },
      { name: "Jókai utca / Ruttner-ház", offset: 7, lat: 47.095711, lon: 17.902775 },
      { name: "Virág Benedek utca", offset: 8, lat: 47.093035, lon: 17.907074 },
      { name: "Hotel", offset: 11, lat: 47.092222, lon: 17.912679 },
      { name: "Veszprém, autóbusz-állomás", offset: 14, lat: 47.095604, lon: 17.914159 },
      { name: "Petőfi Sándor utca", offset: 15, lat: 47.099838, lon: 17.913781 },
      { name: "Munkácsy Mihály utca", offset: 17, lat: 47.103029, lon: 17.915392 },
      { name: "Őrház utca", offset: 19, lat: 47.10339, lon: 17.920092 },
      { name: "Fecske utca", offset: 20, lat: 47.101529, lon: 17.924781 },
      { name: "Bolgár Mihály utca", offset: 21, lat: 47.100618, lon: 17.926391 },
      { name: "Kádártai úti forduló", offset: 22, lat: 47.103334, lon: 17.929956 },
    ],
    departures: {
      workday: { 5: [19,55], 6: [28,53], 7: [13,45], 8: [15,43], 13: [42], 14: [12,42], 15: [12,42], 16: [12,42], 17: [12] },
      weekend: {},
    },
  }

];
