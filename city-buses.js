// ============================================================
// City Buses — Veszprém helyi buszjáratok (mindkét irány)
// ============================================================
// Forrás: menetrend-v2-text.txt (VeszprémGO, érvényes 2026. március 1-től)
// Csak azok a járatok szerepelnek, amelyek áthaladnak legalább
// egy átszállóponton:
//   • Komakút tér / Pannon Egyetem
//   • Petőfi Színház
//   • Veszprém, autóbusz-állomás
//
// Indulási idők a KIINDULÓ megállótól értendők.
// Az egyes megállók offset-je percben van megadva.
// ============================================================

window.CITY_BUSES = [

  // ────────────────────────────────────────────────────────────
  // 1-es busz: Veszprém vasútállomás → Valeo, főporta
  // Átszálló: autóbusz-állomás (7'), Petőfi Színház (10')
  // ────────────────────────────────────────────────────────────
  {
    id: "1",
    color: "#26A69A",
    label: "1-es busz",
    direction: "Veszprém vasútállomás → Valeo, főporta",
    stops: [
      { name: "Veszprém vasútállomás", offset: 0 },
      { name: "Aulich Lajos utca", offset: 1 },
      { name: "Laktanya", offset: 2 },
      { name: "Jutasi úti lakótelep", offset: 3 },
      { name: "Jutasi út / Barátság park", offset: 4 },
      { name: "Petőfi Sándor utca", offset: 5 },
      { name: "Veszprém, autóbusz-állomás", offset: 7 },
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
      workday: {
        5: [15,25,54], 6: [35], 7: [5,40], 8: [20],
        13: [23,53], 14: [23,53], 15: [23,53], 16: [23,53],
        18: [20], 21: [20],
      },
      weekend: {
        5: [25], 7: [23],
        13: [23], 14: [23], 15: [23], 16: [23], 17: [23],
        21: [25],
      },
    },
  },

  // ────────────────────────────────────────────────────────────
  // 3-as busz: Haszkovó forduló → Csererdő
  // Átszálló: autóbusz-állomás (5'), Petőfi Színház (8')
  // ────────────────────────────────────────────────────────────
  {
    id: "3",
    color: "#EC407A",
    label: "3-as busz",
    direction: "Haszkovó forduló → Csererdő",
    stops: [
      { name: "Haszkovó forduló", offset: 0 },
      { name: "Haszkovó utca", offset: 1 },
      { name: "Őrház utca", offset: 2 },
      { name: "Pipacs utca", offset: 3 },
      { name: "Petőfi Sándor utca", offset: 4 },
      { name: "Veszprém, autóbusz-állomás", offset: 5 },
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
      workday: {
        4: [55], 5: [8,18,28,48], 6: [8,26,44], 7: [0,16,33,53],
        8: [13,43], 9: [13,43], 10: [13,43], 11: [13,43], 12: [13,43],
        13: [3,13,33,53], 14: [13,33,53], 15: [13,33,53], 16: [13,33,53],
        17: [13,43], 18: [13,43], 19: [13,43], 20: [13], 21: [17], 22: [15],
      },
      weekend: {
        5: [18], 6: [18], 7: [18], 8: [18], 9: [18], 10: [18], 11: [18],
        12: [18], 13: [23], 14: [18], 15: [18], 16: [18], 17: [18],
        18: [18], 19: [18], 20: [18], 21: [23], 22: [15],
      },
    },
  },

  // ────────────────────────────────────────────────────────────
  // 4-es busz: Jutaspuszta → Vámosi úti forduló
  // Átszálló: autóbusz-állomás (16'), Komakút tér (20')
  // ────────────────────────────────────────────────────────────
  {
    id: "4",
    color: "#66BB6A",
    label: "4-es busz",
    direction: "Jutaspuszta → Vámosi úti forduló",
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
      { name: "Veszprém, autóbusz-állomás", offset: 16 },
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
      workday: {
        5: [11], 6: [9], 7: [0], 8: [0], 9: [0], 10: [0], 11: [0], 12: [0],
        13: [0], 14: [0], 15: [0], 16: [0], 17: [0], 18: [0], 19: [0],
        20: [0], 21: [0],
      },
      weekend: {
        4: [58], 5: [58], 6: [57], 8: [0], 9: [0], 10: [0], 11: [0], 12: [0],
        13: [0], 14: [0], 15: [0], 16: [0], 17: [0], 18: [0], 19: [0],
        20: [28],
      },
    },
  },

  // ────────────────────────────────────────────────────────────
  // 4A busz: Veszprém vasútállomás → Vámosi úti forduló
  // Átszálló: autóbusz-állomás (6'), Komakút tér (10')
  // ────────────────────────────────────────────────────────────
  {
    id: "4A",
    color: "#81C784",
    label: "4A busz",
    direction: "Veszprém vasútállomás → Vámosi úti forduló",
    stops: [
      { name: "Veszprém vasútállomás", offset: 0 },
      { name: "Aulich Lajos utca", offset: 1 },
      { name: "Laktanya", offset: 1 },
      { name: "Haszkovó utca", offset: 3 },
      { name: "Munkácsy Mihály utca", offset: 4 },
      { name: "Petőfi Sándor utca", offset: 5 },
      { name: "Veszprém, autóbusz-állomás", offset: 6 },
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
      workday: {
        5: [0,19,39,58], 6: [17,29,42,55], 7: [8,23,38,53],
        8: [8,23,38], 9: [8,38], 10: [8,38], 11: [8,38], 12: [8,38],
        13: [8,28,43], 14: [8,23,38,53], 15: [8,23,38,53],
        16: [8,23,38,53], 17: [8,23,43], 18: [8,38], 19: [8,38],
        20: [8,38], 21: [10,40], 22: [38],
      },
      weekend: {
        5: [5], 6: [5], 7: [4,38], 8: [8,38], 9: [8,38], 10: [8,38],
        11: [8,38], 12: [8,38], 13: [8,38], 14: [8,38], 15: [8,38],
        16: [8,38], 17: [8,38], 18: [8,38], 19: [10,38], 20: [38],
        21: [40], 22: [38],
      },
    },
  },

  // ────────────────────────────────────────────────────────────
  // 5-ös busz: Veszprém vasútállomás → Kádártai úti forduló
  // Átszálló: Petőfi Színház (13')
  // Figyelem: a vasútállomástól DÓZSA felé kerül, nem a belvárosba!
  // ────────────────────────────────────────────────────────────
  {
    id: "5",
    color: "#AB47BC",
    label: "5-ös busz",
    direction: "Veszprém vasútállomás → Kádártai úti forduló",
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
      workday: {
        5: [26,56], 6: [22], 7: [7,40], 8: [38], 9: [38], 10: [38],
        11: [38], 12: [38], 13: [38,58], 14: [38,58], 15: [38,58],
        16: [38], 17: [38], 18: [38], 19: [38], 20: [38], 21: [38],
      },
      weekend: {
        5: [26], 6: [26], 7: [38], 8: [38], 9: [38], 10: [38], 11: [38],
        12: [38], 13: [38], 14: [38], 15: [38], 16: [38], 17: [38],
        18: [38], 19: [38], 20: [38], 21: [38],
      },
    },
  },

  // ────────────────────────────────────────────────────────────
  // 6-os busz: Haszkovó forduló → Vámosi úti forduló
  // Átszálló: Komakút tér (14')
  // ────────────────────────────────────────────────────────────
  {
    id: "6",
    color: "#FDD835",
    label: "6-os busz",
    direction: "Haszkovó forduló → Vámosi úti forduló",
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
      workday: {
        4: [48], 5: [8,28,48], 6: [7,22,34,48], 7: [2,16,31,46],
        8: [1,16,31,51], 9: [23,53], 10: [23,53], 11: [23,53], 12: [23,53],
        13: [18,36,55], 14: [15,31,46], 15: [1,16,31,46],
        16: [1,16,32,47], 17: [2,17,35,55], 18: [23,53], 19: [23,53],
        20: [23,53], 21: [24,54],
      },
      weekend: {
        4: [48], 5: [35], 6: [35], 7: [23,53], 8: [23,53], 9: [23,53],
        10: [23,53], 11: [23,53], 12: [23,53], 13: [23,53], 14: [23,53],
        15: [23,53], 16: [23,53], 17: [23,53], 18: [23,53], 19: [23],
        20: [8], 21: [8,54],
      },
    },
  },

  // ────────────────────────────────────────────────────────────
  // 7-es busz: Haszkovó forduló → Cholnoky forduló
  // Átszálló: autóbusz-állomás (5')
  // ────────────────────────────────────────────────────────────
  {
    id: "7",
    color: "#5C6BC0",
    label: "7-es busz",
    direction: "Haszkovó forduló → Cholnoky forduló",
    stops: [
      { name: "Haszkovó forduló", offset: 0 },
      { name: "Haszkovó utca", offset: 1 },
      { name: "Munkácsy Mihály utca", offset: 3 },
      { name: "Petőfi Sándor utca", offset: 4 },
      { name: "Veszprém, autóbusz-állomás", offset: 5 },
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
      workday: {
        6: [24,52], 7: [19,49], 8: [55], 9: [55], 10: [55], 11: [55],
        12: [56], 13: [57], 14: [47], 15: [17,47], 16: [17,48],
        17: [55], 18: [55], 19: [55],
      },
      weekend: {
        7: [56], 8: [56], 9: [56], 10: [56], 11: [56], 12: [56],
        13: [56], 14: [56], 15: [56], 16: [56], 17: [56], 18: [56],
      },
    },
  },

  // ────────────────────────────────────────────────────────────
  // 7A busz: Haszkovó forduló → Ady E. utca / Cholnoky J. utca
  // Átszálló: autóbusz-állomás (6')
  // ────────────────────────────────────────────────────────────
  {
    id: "7A",
    color: "#7986CB",
    label: "7A busz",
    direction: "Haszkovó forduló → Ady E. utca / Cholnoky J. utca",
    stops: [
      { name: "Haszkovó forduló", offset: 0 },
      { name: "Haszkovó utca", offset: 1 },
      { name: "Munkácsy Mihály utca", offset: 3 },
      { name: "Petőfi Sándor utca", offset: 4 },
      { name: "Veszprém, autóbusz-állomás", offset: 6 },
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
      workday: {
        5: [12,32,51], 6: [10,39], 7: [5,34], 8: [4,19,34],
        9: [25], 10: [25], 11: [25], 12: [25], 13: [22,39],
        14: [17,32], 15: [2,32], 16: [2,32], 17: [4,19,35],
        18: [25], 19: [25], 20: [25,56], 21: [27], 22: [22],
      },
      weekend: {
        5: [38], 6: [38], 7: [23], 8: [26], 9: [26], 10: [26], 11: [26],
        12: [26], 13: [26], 14: [26], 15: [26], 16: [26], 17: [26],
        18: [26], 19: [25], 20: [10], 21: [10], 22: [22],
      },
    },
  },

  // ────────────────────────────────────────────────────────────
  // 8-as busz: Haszkovó forduló → Csererdő (TELJES útvonal)
  // Átszálló: autóbusz-állomás (5'), Komakút tér (13')
  // FONTOS: Csak a Csererdőig menő járatok! ("A" = Iskola utcáig → kizárva)
  //         "V" jelöltek Valeo, főportát kihagyják, de Csererdőig mennek.
  // ────────────────────────────────────────────────────────────
  {
    id: "8",
    color: "#42A5F5",
    label: "8-as busz",
    direction: "Haszkovó forduló → Csererdő",
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
      workday: {
        5: [7,22,51], 6: [21,51], 7: [11,21,55], 8: [25],
        12: [51], 13: [16,26,55], 14: [25,55], 15: [25,55],
        16: [25,59], 21: [15],
      },
      weekend: {
        5: [21], 13: [9], 17: [9], 21: [15],
      },
    },
  },

  // ────────────────────────────────────────────────────────────
  // 13-as busz: Kádártai úti forduló → Völgyhíd tér
  // Átszálló: autóbusz-állomás (7'), Petőfi Színház (11')
  // Hétvégén gyakorlatilag nem közlekedik ezen az útvonalon.
  // ────────────────────────────────────────────────────────────
  {
    id: "13",
    color: "#EF5350",
    label: "13-as busz",
    direction: "Kádártai úti forduló → Völgyhíd tér",
    stops: [
      { name: "Kádártai úti forduló", offset: 0 },
      { name: "Bolgár Mihály utca", offset: 1 },
      { name: "Fecske utca", offset: 2 },
      { name: "Őrház utca", offset: 3 },
      { name: "Munkácsy Mihály utca", offset: 4 },
      { name: "Petőfi Sándor utca", offset: 5 },
      { name: "Veszprém, autóbusz-állomás", offset: 7 },
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
      workday: {
        5: [4,40], 6: [9,34,54], 7: [24,54], 8: [24],
        9: [0,40], 10: [20], 11: [0,40], 12: [20,55],
        13: [23,53], 14: [23,53], 15: [21,51], 16: [21,51],
        17: [0], 18: [0], 19: [0], 20: [0], 21: [0],
      },
      weekend: {},
    },
  },

  // ────────────────────────────────────────────────────────────
  // 16-os busz: Vámosi úti forduló → Bakony Művek
  // Átszálló: Komakút tér (8'), Petőfi Színház (9')
  // FIGYELEM: Csak vasárnap közlekedik! Munkanapokon nem megy.
  // ────────────────────────────────────────────────────────────
  {
    id: "16",
    color: "#8D6E63",
    label: "16-os busz",
    direction: "Vámosi úti forduló → Bakony Művek",
    sundayOnly: true,
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
      weekend: {
        6: [28], 7: [38], 8: [37], 9: [37], 10: [37],
      },
    },
  },

  // ────────────────────────────────────────────────────────────
  // 28-as busz: Vámosi úti forduló → Csererdő
  // Átszálló: Komakút tér (10')
  // Nagyon korlátozott menetrend!
  // ────────────────────────────────────────────────────────────
  {
    id: "28",
    color: "#FFA726",
    label: "28-as busz",
    direction: "Vámosi úti forduló → Csererdő",
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
      weekend: {},
    },
  },

  // ================================================================
  // FORDÍTOTT IRÁNYOK — átszállóponton ÁT a lakóterületek felé
  // ================================================================

  // ────────────────────────────────────────────────────────────
  // 6-os busz (fordított): Vámosi úti forduló → Haszkovó forduló
  // Átszálló: Komakút tér (10'), Petőfi Színház (12')
  // Kiváló menetrend! 2-3 járat/óra munkanapokon.
  // ────────────────────────────────────────────────────────────
  {
    id: "6",
    color: "#FDD835",
    label: "6-os busz",
    direction: "Vámosi úti forduló → Haszkovó forduló",
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
      workday: {
        4: [48], 5: [10,35,52], 6: [7,22,36,50], 7: [5,20,35,49],
        8: [4,23,43], 9: [7,37], 10: [7,37], 11: [7,37],
        12: [7,32,52], 13: [12,29,44,59], 14: [14,29,44],
        15: [0,16,31,46], 16: [1,16,32,50], 17: [10,30,50],
        18: [12,37], 19: [8,38], 20: [8,40], 21: [10,45],
      },
      weekend: {
        5: [22], 6: [28], 7: [8,38], 8: [7,37], 9: [7,37],
        10: [7,37], 11: [7,37], 12: [7,37], 13: [7,37], 14: [7,37],
        15: [7,37], 16: [7,37], 17: [7,37], 18: [7,37],
        19: [22], 20: [24], 21: [45],
      },
    },
  },

  // ────────────────────────────────────────────────────────────
  // 4-es busz (fordított): Vámosi úti forduló → Jutaspuszta
  // Átszálló: Komakút tér (8'), Petőfi Színház (9'), buszáll. (13')
  // Csak a NEM "A"-jelzésű járatok (a teljes Jutaspusztáig menők).
  // ────────────────────────────────────────────────────────────
  {
    id: "4",
    color: "#66BB6A",
    label: "4-es busz",
    direction: "Vámosi úti forduló → Jutaspuszta",
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
      { name: "Veszprém, autóbusz-állomás", offset: 13 },
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
      // Csak nem-A indulások (teljes útvonal Jutaspusztáig)
      workday: {
        6: [15], 7: [12], 8: [14], 9: [24], 10: [24], 11: [24], 12: [24],
        13: [22], 14: [22], 15: [24], 16: [24], 17: [22], 18: [25],
        19: [25], 20: [25], 21: [30],
      },
      weekend: {
        6: [0], 7: [25], 8: [25], 9: [25], 10: [25], 11: [25], 12: [25],
        13: [25], 14: [25], 15: [25], 16: [25], 17: [25], 18: [25],
        19: [57], 21: [30],
      },
    },
  },

  // ────────────────────────────────────────────────────────────
  // 7A busz (fordított): Ady E. utca / Cholnoky → Haszkovó forduló
  // Átszálló: autóbusz-állomás (10')
  // ────────────────────────────────────────────────────────────
  {
    id: "7A",
    color: "#7986CB",
    label: "7A busz",
    direction: "Ady E. utca → Haszkovó forduló",
    stops: [
      { name: "Ady Endre utca / Cholnoky Jenő utca", offset: 0 },
      { name: "Lóczy Lajos utca", offset: 1 },
      { name: "Hérics utca", offset: 2 },
      { name: "Cholnoky forduló", offset: 3 },
      { name: "Almádi út", offset: 4 },
      { name: "Radnóti Miklós tér", offset: 6 },
      { name: "Vörösmarty Mihály tér", offset: 7 },
      { name: "Hotel", offset: 8 },
      { name: "Veszprém, autóbusz-állomás", offset: 10 },
      { name: "Petőfi Sándor utca", offset: 11 },
      { name: "Munkácsy Mihály utca", offset: 12 },
      { name: "Haszkovó utca", offset: 14 },
      { name: "Haszkovó forduló", offset: 15 },
    ],
    departures: {
      workday: {
        5: [16,40,55], 6: [11,27,57], 7: [26,56], 8: [26,46],
        9: [44], 10: [44], 11: [44], 12: [39,59], 13: [34,49],
        14: [4,36,51], 15: [23,53], 16: [23,53], 17: [34,54],
        18: [44], 19: [44], 20: [44], 21: [14], 22: [37],
      },
      weekend: {
        5: [16], 6: [32], 7: [12,42], 8: [44], 9: [44], 10: [44],
        11: [44], 12: [44], 13: [44], 14: [44], 15: [44], 16: [44],
        17: [44], 18: [44], 19: [44], 20: [29], 21: [23], 22: [37],
      },
    },
  },

  // ────────────────────────────────────────────────────────────
  // 5-ös busz (fordított): Kádártai úti forduló → Veszprém vasútáll.
  // Átszálló: Petőfi Színház (15')
  // ────────────────────────────────────────────────────────────
  {
    id: "5",
    color: "#AB47BC",
    label: "5-ös busz",
    direction: "Kádártai úti forduló → Veszprém vasútállomás",
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
      workday: {
        4: [41], 5: [11,53], 6: [27,54], 7: [11,45], 8: [45],
        9: [45], 10: [45], 11: [45], 12: [45], 13: [15,55],
        14: [15,53], 15: [13,53], 16: [13,53], 17: [50],
        18: [50], 19: [50], 21: [0], 22: [10],
      },
      weekend: {
        4: [46], 5: [54], 6: [54], 7: [54], 8: [54], 9: [54],
        10: [54], 11: [54], 12: [54], 13: [54], 14: [54], 15: [54],
        16: [54], 17: [54], 18: [54], 19: [54], 21: [0], 22: [10],
      },
    },
  },

  // ────────────────────────────────────────────────────────────
  // 7-es busz (fordított): Cholnoky lakótelep → Haszkovó forduló
  // Átszálló: autóbusz-állomás (15')
  // ────────────────────────────────────────────────────────────
  {
    id: "7",
    color: "#5C6BC0",
    label: "7-es busz",
    direction: "Cholnoky lakótelep → Haszkovó forduló",
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
      { name: "Veszprém, autóbusz-állomás", offset: 15 },
      { name: "Petőfi Sándor utca", offset: 16 },
      { name: "Munkácsy Mihály utca", offset: 17 },
      { name: "Haszkovó utca", offset: 19 },
      { name: "Haszkovó forduló", offset: 20 },
    ],
    departures: {
      workday: {
        6: [39], 7: [8,38], 8: [8], 9: [11], 10: [11], 11: [11],
        12: [11], 13: [13], 14: [16], 15: [4,35], 16: [5,35],
        17: [11], 18: [11], 19: [11], 20: [11],
      },
      weekend: {
        8: [11], 9: [11], 10: [11], 11: [11], 12: [11], 13: [11],
        14: [11], 15: [11], 16: [11], 17: [11], 18: [11], 19: [11],
      },
    },
  },

  // ────────────────────────────────────────────────────────────
  // 13-as busz (fordított): Juhar utca → Kádártai úti forduló
  // Átszálló: autóbusz-állomás (14')
  // Csak munkanapokon közlekedik!
  // ────────────────────────────────────────────────────────────
  {
    id: "13",
    color: "#EF5350",
    label: "13-as busz",
    direction: "Juhar utca → Kádártai úti forduló",
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
      { name: "Veszprém, autóbusz-állomás", offset: 14 },
      { name: "Petőfi Sándor utca", offset: 15 },
      { name: "Munkácsy Mihály utca", offset: 17 },
      { name: "Őrház utca", offset: 19 },
      { name: "Fecske utca", offset: 20 },
      { name: "Bolgár Mihály utca", offset: 21 },
      { name: "Kádártai úti forduló", offset: 22 },
    ],
    departures: {
      workday: {
        5: [19,55], 6: [28,53], 7: [13,45], 8: [15,43],
        13: [42], 14: [12,42], 15: [12,42], 16: [12,42], 17: [12],
      },
      weekend: {},
    },
  },

];
