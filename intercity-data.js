// intercity-data.js — AUTO-GENERÁLT, ne szerkeszd kézzel
// Forrás: gtfs.menetbrand.com/download/volanbusz/ (VOLÁNBUSZ hivatalos GTFS-tükör)
// Frissítés: _gtfs_update/ scriptek (09-regenerate-intercity.js + 10-apply-intercity.js)
// Generálva: 2026-08-21

window.INTERCITY_BUSES_FULL = [
  {
    "id": "1625",
    "color": "#7B5EA7",
    "label": "1625-ös helyközi",
    "direction": "Veszprém, autóbusz-állomás ▸ Nemesvámos, autóbusz-váróterem",
    "dir": "iskola",
    "stops": [
      {
        "name": "Veszprém, autóbusz-állomás",
        "lat": 47.09559,
        "lon": 17.91388,
        "spId": "VOLAN_hkir_558455_9",
        "citySpId": "VBUSZ_SP1683",
        "platformCode": "9"
      },
      {
        "name": "Veszprém, Komakút tér",
        "lat": 47.089692,
        "lon": 17.907227,
        "spId": "VOLAN_hkir_558516_1",
        "citySpId": "VBUSZ_SP1621",
        "platformCode": ""
      },
      {
        "name": "Veszprém, József Attila utca",
        "lat": 47.085252,
        "lon": 17.899099,
        "spId": "VOLAN_hkir_558503_1",
        "citySpId": "VBUSZ_SP1620",
        "platformCode": ""
      },
      {
        "name": "Nemesvámos, Haribo",
        "lat": 47.06477,
        "lon": 17.873877,
        "spId": "VOLAN_hkir_557863_1",
        "citySpId": null,
        "platformCode": ""
      },
      {
        "name": "Nemesvámos, Köfém",
        "lat": 47.062377,
        "lon": 17.871959,
        "spId": "VOLAN_hkir_557864_1",
        "citySpId": null,
        "platformCode": ""
      },
      {
        "name": "Nemesvámos, Dózsa György utca",
        "lat": 47.059056,
        "lon": 17.873308,
        "spId": "VOLAN_hkir_557860_1",
        "citySpId": null,
        "platformCode": ""
      },
      {
        "name": "Nemesvámos, autóbusz-váróterem",
        "lat": 47.056432,
        "lon": 17.869564,
        "spId": "VOLAN_hkir_557858_3",
        "citySpId": null,
        "platformCode": ""
      }
    ],
    "trips": [
      {
        "dayTypes": [
          "munkanap",
          "tanszunet",
          "szabadnap"
        ],
        "deps": [
          1230,
          1232,
          1233,
          1238,
          1239,
          1240,
          1241
        ],
        "origin": "Veszprém, autóbusz-állomás",
        "originDep": 1230,
        "terminus": "Zalaegerszeg, autóbusz-állomás",
        "continuesBeyondModel": true
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet",
          "szabadnap"
        ],
        "deps": [
          450,
          452,
          453,
          null,
          null,
          null,
          null
        ],
        "origin": "Veszprém, autóbusz-állomás",
        "originDep": 450,
        "terminus": "Keszthely, autóbusz-állomás",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet",
          "szabadnap"
        ],
        "deps": [
          510,
          512,
          513,
          null,
          null,
          null,
          null
        ],
        "origin": "Veszprém, autóbusz-állomás",
        "originDep": 510,
        "terminus": "Zalaegerszeg, autóbusz-állomás",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet",
          "szabadnap"
        ],
        "deps": [
          630,
          632,
          633,
          null,
          null,
          null,
          null
        ],
        "origin": "Veszprém, autóbusz-állomás",
        "originDep": 630,
        "terminus": "Zalaegerszeg, autóbusz-állomás",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet",
          "szabadnap"
        ],
        "deps": [
          null,
          872,
          873,
          null,
          null,
          null,
          null
        ],
        "origin": "Veszprém, autóbusz-állomás",
        "originDep": 870,
        "terminus": "Lenti, autóbusz-állomás",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet",
          "szabadnap"
        ],
        "deps": [
          null,
          1112,
          1113,
          null,
          null,
          null,
          null
        ],
        "origin": "Veszprém, autóbusz-állomás",
        "originDep": 1110,
        "terminus": "Zalaegerszeg, autóbusz-állomás",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet",
          "szabadnap"
        ],
        "deps": [
          385,
          387,
          388,
          null,
          null,
          null,
          null
        ],
        "origin": "Veszprém, autóbusz-állomás",
        "originDep": 385,
        "terminus": "Zalaegerszeg, autóbusz-állomás",
        "continuesBeyondModel": false
      }
    ]
  },
  {
    "id": "7360",
    "color": "#E07020",
    "label": "7360-as helyközi",
    "direction": "Veszprém, vasútállomás ▸ Nemesvámos, autóbusz-váróterem",
    "dir": "iskola",
    "stops": [
      {
        "name": "Veszprém, vasútállomás",
        "lat": 47.118245,
        "lon": 17.911105,
        "spId": "VOLAN_hkir_558566_1",
        "citySpId": "VBUSZ_SP1856",
        "platformCode": "1"
      },
      {
        "name": "Veszprém, Jutasi úti lakótelep",
        "lat": 47.1074,
        "lon": 17.9113,
        "spId": "VOLAN_hkir_558506_2",
        "citySpId": "VBUSZ_SP1644",
        "platformCode": ""
      },
      {
        "name": "Veszprém, autóbusz-állomás",
        "lat": 47.095231,
        "lon": 17.913519,
        "spId": "VOLAN_hkir_558455_99",
        "citySpId": "VBUSZ_SP1694",
        "platformCode": ""
      },
      {
        "name": "Veszprém, autóbusz-állomás",
        "lat": 47.09559,
        "lon": 17.91388,
        "spId": "VOLAN_hkir_558455_9",
        "citySpId": "VBUSZ_SP1683",
        "platformCode": "9"
      },
      {
        "name": "Veszprém, Komakút tér",
        "lat": 47.089692,
        "lon": 17.907227,
        "spId": "VOLAN_hkir_558516_1",
        "citySpId": "VBUSZ_SP1621",
        "platformCode": ""
      },
      {
        "name": "Veszprém, József Attila utca",
        "lat": 47.085252,
        "lon": 17.899099,
        "spId": "VOLAN_hkir_558503_1",
        "citySpId": "VBUSZ_SP1620",
        "platformCode": ""
      },
      {
        "name": "Nemesvámos, Vilmapusztai elágazás",
        "lat": 47.070839,
        "lon": 17.880537,
        "spId": "VOLAN_hkir_557866_1",
        "citySpId": null,
        "platformCode": ""
      },
      {
        "name": "Nemesvámos, Haribo",
        "lat": 47.06477,
        "lon": 17.873877,
        "spId": "VOLAN_hkir_557863_1",
        "citySpId": null,
        "platformCode": ""
      },
      {
        "name": "Nemesvámos, Köfém",
        "lat": 47.062377,
        "lon": 17.871959,
        "spId": "VOLAN_hkir_557864_1",
        "citySpId": null,
        "platformCode": ""
      },
      {
        "name": "Nemesvámos, Dózsa György utca",
        "lat": 47.059056,
        "lon": 17.873308,
        "spId": "VOLAN_hkir_557860_1",
        "citySpId": null,
        "platformCode": ""
      },
      {
        "name": "Nemesvámos, autóbusz-váróterem",
        "lat": 47.056432,
        "lon": 17.869564,
        "spId": "VOLAN_hkir_557858_3",
        "citySpId": null,
        "platformCode": ""
      }
    ],
    "trips": [
      {
        "dayTypes": [
          "munkanap",
          "tanszunet"
        ],
        "deps": [
          null,
          null,
          null,
          null,
          387,
          389,
          393,
          396,
          397,
          398,
          399
        ],
        "origin": "Veszprém, autóbusz-állomás",
        "originDep": 385,
        "terminus": "Pula, faluház",
        "continuesBeyondModel": true
      },
      {
        "dayTypes": [
          "szabadnap"
        ],
        "deps": [
          null,
          null,
          null,
          null,
          387,
          389,
          393,
          396,
          397,
          398,
          399
        ],
        "origin": "Veszprém, autóbusz-állomás",
        "originDep": 385,
        "terminus": "Tótvázsony, autóbusz-váróterem",
        "continuesBeyondModel": true
      },
      {
        "dayTypes": [
          "szabadnap"
        ],
        "deps": [
          null,
          null,
          null,
          null,
          424,
          426,
          429,
          431,
          432,
          433,
          434
        ],
        "origin": "Veszprém, autóbusz-állomás",
        "originDep": 420,
        "terminus": "Nagyvázsony, autóbusz-váróterem",
        "continuesBeyondModel": true
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet",
          "szabadnap"
        ],
        "deps": [
          525,
          529,
          533,
          540,
          542,
          544,
          548,
          551,
          552,
          553,
          554
        ],
        "origin": "Veszprém, vasútállomás",
        "originDep": 525,
        "terminus": "Nagyvázsony, autóbusz-váróterem",
        "continuesBeyondModel": true
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet"
        ],
        "deps": [
          null,
          null,
          null,
          null,
          742,
          744,
          748,
          751,
          752,
          753,
          754
        ],
        "origin": "Veszprém, autóbusz-állomás",
        "originDep": 740,
        "terminus": "Nagyvázsony, autóbusz-váróterem",
        "continuesBeyondModel": true
      },
      {
        "dayTypes": [
          "szabadnap"
        ],
        "deps": [
          765,
          769,
          773,
          780,
          782,
          784,
          788,
          791,
          792,
          793,
          794
        ],
        "origin": "Veszprém, vasútállomás",
        "originDep": 765,
        "terminus": "Nagyvázsony, autóbusz-váróterem",
        "continuesBeyondModel": true
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet",
          "szabadnap"
        ],
        "deps": [
          null,
          null,
          null,
          970,
          972,
          974,
          978,
          981,
          982,
          983,
          984
        ],
        "origin": "Veszprém, autóbusz-állomás",
        "originDep": 970,
        "terminus": "Nagyvázsony, autóbusz-váróterem",
        "continuesBeyondModel": true
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet"
        ],
        "deps": [
          1000,
          1004,
          1008,
          1015,
          1017,
          1019,
          1023,
          1026,
          1027,
          1028,
          1029
        ],
        "origin": "Veszprém, vasútállomás",
        "originDep": 1000,
        "terminus": "Nagyvázsony, autóbusz-váróterem",
        "continuesBeyondModel": true
      },
      {
        "dayTypes": [
          "szabadnap"
        ],
        "deps": [
          1005,
          1009,
          1013,
          1020,
          1022,
          1024,
          1028,
          1031,
          1032,
          1033,
          1034
        ],
        "origin": "Veszprém, vasútállomás",
        "originDep": 1005,
        "terminus": "Nagyvázsony, autóbusz-váróterem",
        "continuesBeyondModel": true
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet",
          "szabadnap"
        ],
        "deps": [
          null,
          null,
          null,
          1110,
          1112,
          1114,
          1118,
          1121,
          1122,
          1123,
          1124
        ],
        "origin": "Veszprém, autóbusz-állomás",
        "originDep": 1110,
        "terminus": "Nagyvázsony, autóbusz-váróterem",
        "continuesBeyondModel": true
      },
      {
        "dayTypes": [
          "szabadnap"
        ],
        "deps": [
          1235,
          null,
          1240,
          1240,
          1242,
          1244,
          1248,
          1251,
          1252,
          1253,
          1254
        ],
        "origin": "Veszprém, vasútállomás",
        "originDep": 1235,
        "terminus": "Nagyvázsony, autóbusz-váróterem",
        "continuesBeyondModel": true
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet"
        ],
        "deps": [
          null,
          null,
          null,
          1085,
          1087,
          1088,
          null,
          null,
          null,
          null,
          null
        ],
        "origin": "Veszprém, autóbusz-állomás",
        "originDep": 1085,
        "terminus": "Nagyvázsony, autóbusz-váróterem",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet"
        ],
        "deps": [
          null,
          null,
          null,
          null,
          852,
          854,
          858,
          null,
          null,
          null,
          null
        ],
        "origin": "Veszprém, autóbusz-állomás",
        "originDep": 850,
        "terminus": "Nagyvázsony, autóbusz-váróterem",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet"
        ],
        "deps": [
          null,
          null,
          null,
          900,
          902,
          904,
          908,
          null,
          null,
          null,
          null
        ],
        "origin": "Veszprém, autóbusz-állomás",
        "originDep": 900,
        "terminus": "Nagyvázsony, autóbusz-váróterem",
        "continuesBeyondModel": false
      }
    ]
  },
  {
    "id": "7360",
    "color": "#E07020",
    "label": "7360-as helyközi",
    "direction": "Nemesvámos, autóbusz-váróterem ▸ Veszprém, vasútállomás",
    "dir": "haza",
    "stops": [
      {
        "name": "Nemesvámos, autóbusz-váróterem",
        "lat": 47.056285,
        "lon": 17.870066,
        "spId": "VOLAN_hkir_557858_2",
        "citySpId": null,
        "platformCode": ""
      },
      {
        "name": "Nemesvámos, Dózsa György utca",
        "lat": 47.059123,
        "lon": 17.873483,
        "spId": "VOLAN_hkir_557860_2",
        "citySpId": null,
        "platformCode": ""
      },
      {
        "name": "Nemesvámos, Köfém",
        "lat": 47.062506,
        "lon": 17.87195,
        "spId": "VOLAN_hkir_557864_2",
        "citySpId": null,
        "platformCode": ""
      },
      {
        "name": "Nemesvámos, Haribo",
        "lat": 47.06477,
        "lon": 17.873885,
        "spId": "VOLAN_hkir_557863_2",
        "citySpId": null,
        "platformCode": ""
      },
      {
        "name": "Nemesvámos, Vilmapusztai elágazás",
        "lat": 47.071187,
        "lon": 17.881172,
        "spId": "VOLAN_hkir_557866_2",
        "citySpId": null,
        "platformCode": ""
      },
      {
        "name": "Veszprém, József Attila utca",
        "lat": 47.085557,
        "lon": 17.899385,
        "spId": "VOLAN_hkir_558503_2",
        "citySpId": "VBUSZ_SP1667",
        "platformCode": ""
      },
      {
        "name": "Veszprém, Komakút tér",
        "lat": 47.089356,
        "lon": 17.907503,
        "spId": "VOLAN_hkir_558516_2",
        "citySpId": "VBUSZ_SP1668",
        "platformCode": ""
      },
      {
        "name": "Veszprém, Színház",
        "lat": 47.09187,
        "lon": 17.9061,
        "spId": "VOLAN_hkir_558558_2",
        "citySpId": "VBUSZ_SP1670",
        "platformCode": ""
      },
      {
        "name": "Veszprém, autóbusz-állomás",
        "lat": 47.095231,
        "lon": 17.913519,
        "spId": "VOLAN_hkir_558455_99",
        "citySpId": "VBUSZ_SP1694",
        "platformCode": ""
      },
      {
        "name": "Veszprém, autóbusz-állomás",
        "lat": 47.09545,
        "lon": 17.9132,
        "spId": "VOLAN_hkir_558455_16",
        "citySpId": "VBUSZ_SP1694",
        "platformCode": "16"
      },
      {
        "name": "Veszprém, Jutasi úti lakótelep",
        "lat": 47.107,
        "lon": 17.9116,
        "spId": "VOLAN_hkir_558506_1",
        "citySpId": "VBUSZ_SP1619",
        "platformCode": ""
      },
      {
        "name": "Veszprém, vasútállomás",
        "lat": 47.118012,
        "lon": 17.911086,
        "spId": "VOLAN_hkir_558566_99",
        "citySpId": "VBUSZ_SP1856",
        "platformCode": ""
      }
    ],
    "trips": [
      {
        "dayTypes": [
          "szabadnap"
        ],
        "deps": [
          307,
          308,
          309,
          310,
          312,
          315,
          317,
          318,
          320,
          null,
          null,
          null
        ],
        "origin": "Nagyvázsony, autóbusz-váróterem",
        "originDep": 270,
        "terminus": "Veszprém, autóbusz-állomás",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "szabadnap"
        ],
        "deps": [
          383,
          384,
          385,
          386,
          389,
          393,
          395,
          396,
          397,
          null,
          null,
          null
        ],
        "origin": "Nagyvázsony, autóbusz-váróterem",
        "originDep": 335,
        "terminus": "Veszprém, autóbusz-állomás",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet"
        ],
        "deps": [
          401,
          402,
          403,
          404,
          407,
          411,
          413,
          414,
          415,
          null,
          null,
          null
        ],
        "origin": "Pula, faluház",
        "originDep": 345,
        "terminus": "Veszprém, autóbusz-állomás",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet"
        ],
        "deps": [
          431,
          432,
          433,
          434,
          437,
          441,
          443,
          444,
          447,
          null,
          null,
          null
        ],
        "origin": "Nagyvázsony, autóbusz-váróterem",
        "originDep": 380,
        "terminus": "Veszprém, autóbusz-állomás",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "szabadnap"
        ],
        "deps": [
          588,
          589,
          590,
          591,
          594,
          598,
          600,
          601,
          602,
          602,
          604,
          610
        ],
        "origin": "Nagyvázsony, autóbusz-váróterem",
        "originDep": 540,
        "terminus": "Veszprém, vasútállomás",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet",
          "szabadnap"
        ],
        "deps": [
          643,
          644,
          645,
          646,
          649,
          653,
          655,
          656,
          657,
          657,
          659,
          665
        ],
        "origin": "Nagyvázsony, autóbusz-váróterem",
        "originDep": 595,
        "terminus": "Veszprém, vasútállomás",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "szabadnap"
        ],
        "deps": [
          797,
          798,
          799,
          800,
          802,
          805,
          807,
          808,
          809,
          null,
          null,
          null
        ],
        "origin": "Nagyvázsony, autóbusz-váróterem",
        "originDep": 755,
        "terminus": "Veszprém, autóbusz-állomás",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet"
        ],
        "deps": [
          875,
          876,
          877,
          878,
          881,
          885,
          887,
          888,
          890,
          null,
          null,
          null
        ],
        "origin": "Pula, faluház",
        "originDep": 830,
        "terminus": "Veszprém, autóbusz-állomás",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "szabadnap"
        ],
        "deps": [
          931,
          932,
          933,
          934,
          937,
          941,
          943,
          944,
          945,
          945,
          947,
          950
        ],
        "origin": "Nagyvázsony, autóbusz-váróterem",
        "originDep": 885,
        "terminus": "Veszprém, vasútállomás",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet"
        ],
        "deps": [
          1061,
          1062,
          1063,
          1064,
          1067,
          1071,
          1073,
          1074,
          1075,
          1075,
          1077,
          1083
        ],
        "origin": "Nagyvázsony, autóbusz-váróterem",
        "originDep": 1015,
        "terminus": "Veszprém, vasútállomás",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "szabadnap"
        ],
        "deps": [
          1102,
          1103,
          1104,
          1105,
          1108,
          1112,
          1114,
          1115,
          1116,
          null,
          null,
          null
        ],
        "origin": "Nagyvázsony, autóbusz-váróterem",
        "originDep": 1070,
        "terminus": "Veszprém, autóbusz-állomás",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "szabadnap"
        ],
        "deps": [
          1141,
          1142,
          1143,
          1144,
          1147,
          1151,
          1153,
          1154,
          1155,
          1155,
          1157,
          1160
        ],
        "origin": "Nagyvázsony, autóbusz-váróterem",
        "originDep": 1095,
        "terminus": "Veszprém, vasútállomás",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet"
        ],
        "deps": [
          1248,
          1249,
          1250,
          1251,
          1254,
          1258,
          null,
          1259,
          1260,
          null,
          null,
          null
        ],
        "origin": "Nagyvázsony, pulai elágazás",
        "originDep": 1202,
        "terminus": "Veszprém, autóbusz-állomás",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "szabadnap"
        ],
        "deps": [
          1273,
          1274,
          1275,
          1276,
          1279,
          1283,
          null,
          1284,
          1285,
          null,
          null,
          null
        ],
        "origin": "Nagyvázsony, autóbusz-váróterem",
        "originDep": 1230,
        "terminus": "Veszprém, autóbusz-állomás",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet",
          "szabadnap"
        ],
        "deps": [
          null,
          null,
          null,
          null,
          813,
          815,
          817,
          818,
          819,
          null,
          null,
          null
        ],
        "origin": "Nagyvázsony, autóbusz-váróterem",
        "originDep": 765,
        "terminus": "Veszprém, autóbusz-állomás",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet"
        ],
        "deps": [
          null,
          null,
          null,
          null,
          446,
          450,
          452,
          453,
          457,
          null,
          null,
          null
        ],
        "origin": "Nagyvázsony, autóbusz-váróterem",
        "originDep": 420,
        "terminus": "Veszprém, autóbusz-állomás",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "szabadnap"
        ],
        "deps": [
          null,
          null,
          null,
          null,
          444,
          448,
          450,
          451,
          452,
          null,
          null,
          null
        ],
        "origin": "Tótvázsony, autóbusz-váróterem",
        "originDep": 420,
        "terminus": "Veszprém, autóbusz-állomás",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet"
        ],
        "deps": [
          null,
          null,
          null,
          null,
          379,
          382,
          384,
          386,
          389,
          null,
          null,
          null
        ],
        "origin": "Nagyvázsony, autóbusz-váróterem",
        "originDep": 330,
        "terminus": "Veszprém, autóbusz-állomás",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet"
        ],
        "deps": [
          null,
          null,
          null,
          null,
          306,
          310,
          312,
          313,
          314,
          null,
          null,
          null
        ],
        "origin": "Nagyvázsony, autóbusz-váróterem",
        "originDep": 255,
        "terminus": "Veszprém, autóbusz-állomás",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet"
        ],
        "deps": [
          null,
          null,
          null,
          null,
          914,
          918,
          920,
          921,
          922,
          null,
          null,
          null
        ],
        "origin": "Nagyvázsony, autóbusz-váróterem",
        "originDep": 890,
        "terminus": "Veszprém, autóbusz-állomás",
        "continuesBeyondModel": false
      }
    ]
  },
  {
    "id": "7361",
    "color": "#C8162C",
    "label": "7361-es helyközi",
    "direction": "Veszprém, autóbusz-állomás ▸ Nemesvámos, autóbusz-váróterem",
    "dir": "iskola",
    "stops": [
      {
        "name": "Veszprém, autóbusz-állomás",
        "lat": 47.09564,
        "lon": 17.91386,
        "spId": "VOLAN_hkir_558455_10",
        "citySpId": "VBUSZ_SP1683",
        "platformCode": "10"
      },
      {
        "name": "Veszprém, Komakút tér",
        "lat": 47.089692,
        "lon": 17.907227,
        "spId": "VOLAN_hkir_558516_1",
        "citySpId": "VBUSZ_SP1621",
        "platformCode": ""
      },
      {
        "name": "Veszprém, József Attila utca",
        "lat": 47.085252,
        "lon": 17.899099,
        "spId": "VOLAN_hkir_558503_1",
        "citySpId": "VBUSZ_SP1620",
        "platformCode": ""
      },
      {
        "name": "Nemesvámos, Vilmapusztai elágazás",
        "lat": 47.070839,
        "lon": 17.880537,
        "spId": "VOLAN_hkir_557866_1",
        "citySpId": null,
        "platformCode": ""
      },
      {
        "name": "Nemesvámos, Haribo",
        "lat": 47.06477,
        "lon": 17.873877,
        "spId": "VOLAN_hkir_557863_1",
        "citySpId": null,
        "platformCode": ""
      },
      {
        "name": "Nemesvámos, Köfém",
        "lat": 47.062377,
        "lon": 17.871959,
        "spId": "VOLAN_hkir_557864_1",
        "citySpId": null,
        "platformCode": ""
      },
      {
        "name": "Nemesvámos, Dózsa György utca",
        "lat": 47.059056,
        "lon": 17.873308,
        "spId": "VOLAN_hkir_557860_1",
        "citySpId": null,
        "platformCode": ""
      },
      {
        "name": "Nemesvámos, autóbusz-váróterem",
        "lat": 47.05565,
        "lon": 17.870511,
        "spId": "VOLAN_hkir_557858_1",
        "citySpId": null,
        "platformCode": ""
      },
      {
        "name": "Nemesvámos, ABC",
        "lat": 47.054271,
        "lon": 17.873443,
        "spId": "VOLAN_hkir_557856_1",
        "citySpId": null,
        "platformCode": ""
      },
      {
        "name": "Nemesvámos, autóbusz-forduló",
        "lat": 47.050992,
        "lon": 17.87649,
        "spId": "VOLAN_hkir_557862_1",
        "citySpId": null,
        "platformCode": ""
      }
    ],
    "trips": [
      {
        "dayTypes": [
          "munkanap"
        ],
        "deps": [
          325,
          329,
          331,
          335,
          338,
          339,
          340,
          342,
          343,
          344
        ],
        "origin": "Veszprém, autóbusz-állomás",
        "originDep": 325,
        "terminus": "Nemesvámos, autóbusz-forduló",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet"
        ],
        "deps": [
          null,
          334,
          336,
          340,
          343,
          344,
          345,
          347,
          348,
          349
        ],
        "origin": "Veszprém, autóbusz-állomás",
        "originDep": 330,
        "terminus": "Veszprémfajsz, autóbusz-forduló",
        "continuesBeyondModel": true
      },
      {
        "dayTypes": [
          "szabadnap"
        ],
        "deps": [
          335,
          339,
          341,
          345,
          348,
          349,
          350,
          352,
          353,
          354
        ],
        "origin": "Veszprém, autóbusz-állomás",
        "originDep": 335,
        "terminus": "Veszprémfajsz, autóbusz-forduló",
        "continuesBeyondModel": true
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet"
        ],
        "deps": [
          350,
          354,
          356,
          360,
          363,
          364,
          365,
          367,
          368,
          369
        ],
        "origin": "Veszprém, autóbusz-állomás",
        "originDep": 350,
        "terminus": "Nemesvámos, autóbusz-forduló",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet"
        ],
        "deps": [
          360,
          364,
          366,
          370,
          373,
          374,
          375,
          377,
          378,
          379
        ],
        "origin": "Veszprém, autóbusz-állomás",
        "originDep": 360,
        "terminus": "Veszprémfajsz, autóbusz-forduló",
        "continuesBeyondModel": true
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet"
        ],
        "deps": [
          390,
          394,
          396,
          400,
          402,
          403,
          404,
          405,
          406,
          407
        ],
        "origin": "Veszprém, autóbusz-állomás",
        "originDep": 390,
        "terminus": "Veszprémfajsz, autóbusz-forduló",
        "continuesBeyondModel": true
      },
      {
        "dayTypes": [
          "szabadnap"
        ],
        "deps": [
          400,
          404,
          406,
          410,
          413,
          414,
          415,
          417,
          418,
          419
        ],
        "origin": "Veszprém, autóbusz-állomás",
        "originDep": 400,
        "terminus": "Veszprémfajsz, autóbusz-forduló",
        "continuesBeyondModel": true
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet"
        ],
        "deps": [
          405,
          409,
          411,
          415,
          418,
          419,
          420,
          422,
          423,
          424
        ],
        "origin": "Veszprém, autóbusz-állomás",
        "originDep": 405,
        "terminus": "Nemesvámos, autóbusz-forduló",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet"
        ],
        "deps": [
          null,
          419,
          421,
          425,
          428,
          429,
          430,
          432,
          433,
          434
        ],
        "origin": "Veszprém, autóbusz-állomás",
        "originDep": 415,
        "terminus": "Veszprémfajsz, autóbusz-forduló",
        "continuesBeyondModel": true
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet"
        ],
        "deps": [
          420,
          424,
          426,
          430,
          433,
          434,
          435,
          437,
          438,
          439
        ],
        "origin": "Veszprém, autóbusz-állomás",
        "originDep": 420,
        "terminus": "Nemesvámos, autóbusz-forduló",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "szabadnap"
        ],
        "deps": [
          425,
          429,
          431,
          435,
          438,
          439,
          440,
          442,
          443,
          444
        ],
        "origin": "Veszprém, autóbusz-állomás",
        "originDep": 425,
        "terminus": "Veszprémfajsz, autóbusz-forduló",
        "continuesBeyondModel": true
      },
      {
        "dayTypes": [
          "munkanap"
        ],
        "deps": [
          450,
          454,
          456,
          460,
          463,
          464,
          465,
          467,
          468,
          469
        ],
        "origin": "Veszprém, autóbusz-állomás",
        "originDep": 450,
        "terminus": "Nemesvámos, autóbusz-forduló",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet",
          "szabadnap"
        ],
        "deps": [
          485,
          489,
          491,
          495,
          498,
          499,
          500,
          502,
          503,
          504
        ],
        "origin": "Veszprém, autóbusz-állomás",
        "originDep": 485,
        "terminus": "Veszprémfajsz, autóbusz-forduló",
        "continuesBeyondModel": true
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet",
          "szabadnap"
        ],
        "deps": [
          540,
          544,
          546,
          550,
          553,
          554,
          555,
          557,
          558,
          559
        ],
        "origin": "Veszprém, autóbusz-állomás",
        "originDep": 540,
        "terminus": "Veszprémfajsz, autóbusz-forduló",
        "continuesBeyondModel": true
      },
      {
        "dayTypes": [
          "szabadnap"
        ],
        "deps": [
          630,
          634,
          636,
          640,
          643,
          644,
          645,
          647,
          648,
          649
        ],
        "origin": "Veszprém, autóbusz-állomás",
        "originDep": 630,
        "terminus": "Veszprémfajsz, autóbusz-forduló",
        "continuesBeyondModel": true
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet",
          "szabadnap"
        ],
        "deps": [
          630,
          634,
          636,
          640,
          643,
          644,
          645,
          647,
          648,
          649
        ],
        "origin": "Veszprém, autóbusz-állomás",
        "originDep": 630,
        "terminus": "Veszprémfajsz, autóbusz-forduló",
        "continuesBeyondModel": true
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet"
        ],
        "deps": [
          685,
          689,
          691,
          695,
          698,
          699,
          700,
          702,
          703,
          704
        ],
        "origin": "Veszprém, autóbusz-állomás",
        "originDep": 685,
        "terminus": "Veszprémfajsz, autóbusz-forduló",
        "continuesBeyondModel": true
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet",
          "szabadnap"
        ],
        "deps": [
          745,
          749,
          751,
          755,
          758,
          759,
          760,
          762,
          763,
          764
        ],
        "origin": "Veszprém, autóbusz-állomás",
        "originDep": 745,
        "terminus": "Veszprémfajsz, autóbusz-forduló",
        "continuesBeyondModel": true
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet"
        ],
        "deps": [
          795,
          799,
          801,
          805,
          808,
          809,
          810,
          812,
          813,
          814
        ],
        "origin": "Veszprém, autóbusz-állomás",
        "originDep": 795,
        "terminus": "Nemesvámos, autóbusz-forduló",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet",
          "szabadnap"
        ],
        "deps": [
          null,
          809,
          811,
          815,
          818,
          819,
          820,
          822,
          823,
          824
        ],
        "origin": "Veszprém, autóbusz-állomás",
        "originDep": 805,
        "terminus": "Veszprémfajsz, autóbusz-forduló",
        "continuesBeyondModel": true
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet"
        ],
        "deps": [
          null,
          854,
          856,
          860,
          863,
          864,
          865,
          867,
          868,
          869
        ],
        "origin": "Veszprém, autóbusz-állomás",
        "originDep": 850,
        "terminus": "Veszprémfajsz, autóbusz-forduló",
        "continuesBeyondModel": true
      },
      {
        "dayTypes": [
          "szabadnap"
        ],
        "deps": [
          null,
          854,
          856,
          860,
          863,
          864,
          865,
          867,
          868,
          869
        ],
        "origin": "Veszprém, autóbusz-állomás",
        "originDep": 850,
        "terminus": "Veszprémfajsz, autóbusz-forduló",
        "continuesBeyondModel": true
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet"
        ],
        "deps": [
          null,
          874,
          876,
          880,
          883,
          884,
          885,
          887,
          888,
          889
        ],
        "origin": "Veszprém, autóbusz-állomás",
        "originDep": 870,
        "terminus": "Veszprémfajsz, autóbusz-forduló",
        "continuesBeyondModel": true
      },
      {
        "dayTypes": [
          "munkanap"
        ],
        "deps": [
          885,
          889,
          891,
          895,
          898,
          899,
          900,
          902,
          903,
          904
        ],
        "origin": "Veszprém, autóbusz-állomás",
        "originDep": 885,
        "terminus": "Veszprémfajsz, autóbusz-forduló",
        "continuesBeyondModel": true
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet"
        ],
        "deps": [
          900,
          904,
          906,
          910,
          913,
          914,
          915,
          917,
          918,
          919
        ],
        "origin": "Veszprém, autóbusz-állomás",
        "originDep": 900,
        "terminus": "Veszprémfajsz, autóbusz-forduló",
        "continuesBeyondModel": true
      },
      {
        "dayTypes": [
          "szabadnap"
        ],
        "deps": [
          930,
          934,
          936,
          940,
          943,
          944,
          945,
          947,
          948,
          949
        ],
        "origin": "Veszprém, autóbusz-állomás",
        "originDep": 930,
        "terminus": "Veszprémfajsz, autóbusz-forduló",
        "continuesBeyondModel": true
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet"
        ],
        "deps": [
          940,
          944,
          946,
          950,
          953,
          954,
          955,
          957,
          958,
          959
        ],
        "origin": "Veszprém, autóbusz-állomás",
        "originDep": 940,
        "terminus": "Veszprémfajsz, autóbusz-forduló",
        "continuesBeyondModel": true
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet"
        ],
        "deps": [
          965,
          969,
          971,
          975,
          978,
          979,
          980,
          982,
          983,
          984
        ],
        "origin": "Veszprém, autóbusz-állomás",
        "originDep": 965,
        "terminus": "Veszprémfajsz, autóbusz-forduló",
        "continuesBeyondModel": true
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet"
        ],
        "deps": [
          1000,
          1004,
          1006,
          1010,
          1013,
          1014,
          1015,
          1017,
          1018,
          1019
        ],
        "origin": "Veszprém, autóbusz-állomás",
        "originDep": 1000,
        "terminus": "Veszprémfajsz, autóbusz-forduló",
        "continuesBeyondModel": true
      },
      {
        "dayTypes": [
          "szabadnap"
        ],
        "deps": [
          1030,
          1034,
          1036,
          1040,
          1043,
          1044,
          1045,
          1047,
          1048,
          1049
        ],
        "origin": "Veszprém, autóbusz-állomás",
        "originDep": 1030,
        "terminus": "Veszprémfajsz, autóbusz-forduló",
        "continuesBeyondModel": true
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet"
        ],
        "deps": [
          1030,
          1034,
          1036,
          1040,
          1043,
          1044,
          1045,
          1047,
          1048,
          1049
        ],
        "origin": "Veszprém, autóbusz-állomás",
        "originDep": 1030,
        "terminus": "Veszprémfajsz, autóbusz-forduló",
        "continuesBeyondModel": true
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet"
        ],
        "deps": [
          1085,
          1089,
          1091,
          1095,
          1098,
          1099,
          1100,
          1102,
          1103,
          1104
        ],
        "origin": "Veszprém, autóbusz-állomás",
        "originDep": 1085,
        "terminus": "Veszprémfajsz, autóbusz-forduló",
        "continuesBeyondModel": true
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet"
        ],
        "deps": [
          1140,
          1144,
          1146,
          1150,
          1153,
          1154,
          1155,
          1156,
          1157,
          1158
        ],
        "origin": "Veszprém, autóbusz-állomás",
        "originDep": 1140,
        "terminus": "Nemesvámos, autóbusz-forduló",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "szabadnap"
        ],
        "deps": [
          null,
          1184,
          1186,
          1189,
          1191,
          1192,
          1193,
          1194,
          1195,
          1196
        ],
        "origin": "Veszprém, autóbusz-állomás",
        "originDep": 1180,
        "terminus": "Veszprémfajsz, autóbusz-forduló",
        "continuesBeyondModel": true
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet"
        ],
        "deps": [
          null,
          1184,
          1186,
          1189,
          1191,
          1192,
          1193,
          1194,
          1195,
          1196
        ],
        "origin": "Veszprém, autóbusz-állomás",
        "originDep": 1180,
        "terminus": "Veszprémfajsz, autóbusz-forduló",
        "continuesBeyondModel": true
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet",
          "szabadnap"
        ],
        "deps": [
          1285,
          1289,
          1291,
          1295,
          1298,
          1299,
          1300,
          1302,
          1303,
          1304
        ],
        "origin": "Veszprém, autóbusz-állomás",
        "originDep": 1285,
        "terminus": "Veszprémfajsz, autóbusz-forduló",
        "continuesBeyondModel": true
      },
      {
        "dayTypes": [
          "szabadnap"
        ],
        "deps": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          334
        ],
        "origin": "Nemesvámos, autóbusz-forduló",
        "originDep": 334,
        "terminus": "Veszprémfajsz, autóbusz-forduló",
        "continuesBeyondModel": true
      }
    ]
  },
  {
    "id": "7361",
    "color": "#C8162C",
    "label": "7361-es helyközi",
    "direction": "Nemesvámos, autóbusz-forduló ▸ Veszprém, vasútállomás",
    "dir": "haza",
    "stops": [
      {
        "name": "Nemesvámos, autóbusz-forduló",
        "lat": 47.051129,
        "lon": 17.876599,
        "spId": "VOLAN_hkir_557862_2",
        "citySpId": null,
        "platformCode": ""
      },
      {
        "name": "Nemesvámos, ABC",
        "lat": 47.053806,
        "lon": 17.874041,
        "spId": "VOLAN_hkir_557856_2",
        "citySpId": null,
        "platformCode": ""
      },
      {
        "name": "Nemesvámos, autóbusz-váróterem",
        "lat": 47.056285,
        "lon": 17.870066,
        "spId": "VOLAN_hkir_557858_2",
        "citySpId": null,
        "platformCode": ""
      },
      {
        "name": "Nemesvámos, Dózsa György utca",
        "lat": 47.059123,
        "lon": 17.873483,
        "spId": "VOLAN_hkir_557860_2",
        "citySpId": null,
        "platformCode": ""
      },
      {
        "name": "Nemesvámos, Köfém",
        "lat": 47.062506,
        "lon": 17.87195,
        "spId": "VOLAN_hkir_557864_2",
        "citySpId": null,
        "platformCode": ""
      },
      {
        "name": "Nemesvámos, Haribo",
        "lat": 47.06477,
        "lon": 17.873885,
        "spId": "VOLAN_hkir_557863_2",
        "citySpId": null,
        "platformCode": ""
      },
      {
        "name": "Nemesvámos, Vilmapusztai elágazás",
        "lat": 47.071187,
        "lon": 17.881172,
        "spId": "VOLAN_hkir_557866_2",
        "citySpId": null,
        "platformCode": ""
      },
      {
        "name": "Veszprém, József Attila utca",
        "lat": 47.085557,
        "lon": 17.899385,
        "spId": "VOLAN_hkir_558503_2",
        "citySpId": "VBUSZ_SP1667",
        "platformCode": ""
      },
      {
        "name": "Veszprém, Komakút tér",
        "lat": 47.089356,
        "lon": 17.907503,
        "spId": "VOLAN_hkir_558516_2",
        "citySpId": "VBUSZ_SP1668",
        "platformCode": ""
      },
      {
        "name": "Veszprém, Színház",
        "lat": 47.09187,
        "lon": 17.9061,
        "spId": "VOLAN_hkir_558558_2",
        "citySpId": "VBUSZ_SP1670",
        "platformCode": ""
      },
      {
        "name": "Veszprém, autóbusz-állomás",
        "lat": 47.095231,
        "lon": 17.913519,
        "spId": "VOLAN_hkir_558455_99",
        "citySpId": "VBUSZ_SP1694",
        "platformCode": ""
      },
      {
        "name": "Veszprém, autóbusz-állomás",
        "lat": 47.09545,
        "lon": 17.9132,
        "spId": "VOLAN_hkir_558455_16",
        "citySpId": "VBUSZ_SP1694",
        "platformCode": "16"
      },
      {
        "name": "Veszprém, Jutasi úti lakótelep",
        "lat": 47.107,
        "lon": 17.9116,
        "spId": "VOLAN_hkir_558506_1",
        "citySpId": "VBUSZ_SP1619",
        "platformCode": ""
      },
      {
        "name": "Veszprém, vasútállomás",
        "lat": 47.118012,
        "lon": 17.911086,
        "spId": "VOLAN_hkir_558566_99",
        "citySpId": "VBUSZ_SP1856",
        "platformCode": ""
      }
    ],
    "trips": [
      {
        "dayTypes": [
          "munkanap",
          "tanszunet"
        ],
        "deps": [
          290,
          291,
          292,
          294,
          295,
          296,
          299,
          303,
          305,
          307,
          309,
          null,
          null,
          null
        ],
        "origin": "Nemesvámos, autóbusz-forduló",
        "originDep": 290,
        "terminus": "Veszprém, autóbusz-állomás",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet"
        ],
        "deps": [
          298,
          299,
          300,
          302,
          303,
          304,
          307,
          311,
          313,
          315,
          317,
          null,
          null,
          null
        ],
        "origin": "Veszprémfajsz, autóbusz-forduló",
        "originDep": 293,
        "terminus": "Veszprém, autóbusz-állomás",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "szabadnap"
        ],
        "deps": [
          342,
          343,
          344,
          346,
          347,
          348,
          351,
          355,
          357,
          359,
          361,
          null,
          null,
          null
        ],
        "origin": "Veszprémfajsz, autóbusz-forduló",
        "originDep": 337,
        "terminus": "Veszprém, autóbusz-állomás",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet"
        ],
        "deps": [
          360,
          361,
          362,
          364,
          365,
          366,
          369,
          373,
          375,
          377,
          379,
          null,
          null,
          null
        ],
        "origin": "Veszprémfajsz, autóbusz-forduló",
        "originDep": 355,
        "terminus": "Veszprém, autóbusz-állomás",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "szabadnap"
        ],
        "deps": [
          370,
          371,
          372,
          374,
          375,
          376,
          379,
          383,
          385,
          387,
          389,
          null,
          null,
          null
        ],
        "origin": "Veszprémfajsz, autóbusz-forduló",
        "originDep": 365,
        "terminus": "Veszprém, autóbusz-állomás",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet"
        ],
        "deps": [
          370,
          371,
          372,
          374,
          375,
          376,
          379,
          383,
          385,
          387,
          389,
          null,
          null,
          null
        ],
        "origin": "Nemesvámos, autóbusz-forduló",
        "originDep": 370,
        "terminus": "Veszprém, autóbusz-állomás",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "munkanap"
        ],
        "deps": [
          385,
          386,
          387,
          389,
          390,
          391,
          394,
          398,
          400,
          402,
          404,
          null,
          null,
          null
        ],
        "origin": "Nemesvámos, autóbusz-forduló",
        "originDep": 385,
        "terminus": "Veszprém, autóbusz-állomás",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet"
        ],
        "deps": [
          390,
          391,
          392,
          394,
          395,
          396,
          399,
          403,
          405,
          407,
          409,
          null,
          null,
          null
        ],
        "origin": "Veszprémfajsz, autóbusz-forduló",
        "originDep": 385,
        "terminus": "Veszprém, autóbusz-állomás",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet"
        ],
        "deps": [
          415,
          416,
          417,
          419,
          420,
          421,
          424,
          428,
          430,
          432,
          434,
          null,
          null,
          null
        ],
        "origin": "Veszprémfajsz, autóbusz-forduló",
        "originDep": 410,
        "terminus": "Veszprém, autóbusz-állomás",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet"
        ],
        "deps": [
          425,
          426,
          427,
          429,
          430,
          431,
          434,
          438,
          440,
          442,
          444,
          null,
          null,
          null
        ],
        "origin": "Nemesvámos, autóbusz-forduló",
        "originDep": 425,
        "terminus": "Veszprém, autóbusz-állomás",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "szabadnap"
        ],
        "deps": [
          430,
          431,
          432,
          434,
          435,
          436,
          439,
          443,
          445,
          447,
          449,
          null,
          null,
          null
        ],
        "origin": "Veszprémfajsz, autóbusz-forduló",
        "originDep": 425,
        "terminus": "Veszprém, autóbusz-állomás",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet"
        ],
        "deps": [
          440,
          441,
          442,
          444,
          445,
          446,
          449,
          453,
          455,
          457,
          459,
          null,
          null,
          null
        ],
        "origin": "Nemesvámos, autóbusz-forduló",
        "originDep": 440,
        "terminus": "Veszprém, autóbusz-állomás",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet"
        ],
        "deps": [
          445,
          446,
          447,
          449,
          450,
          451,
          454,
          458,
          460,
          462,
          464,
          null,
          null,
          null
        ],
        "origin": "Veszprémfajsz, autóbusz-forduló",
        "originDep": 440,
        "terminus": "Veszprém, autóbusz-állomás",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "szabadnap"
        ],
        "deps": [
          455,
          456,
          457,
          459,
          460,
          461,
          464,
          468,
          470,
          472,
          474,
          null,
          null,
          null
        ],
        "origin": "Veszprémfajsz, autóbusz-forduló",
        "originDep": 450,
        "terminus": "Veszprém, autóbusz-állomás",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "munkanap"
        ],
        "deps": [
          470,
          471,
          472,
          474,
          475,
          476,
          479,
          483,
          485,
          487,
          489,
          null,
          null,
          null
        ],
        "origin": "Nemesvámos, autóbusz-forduló",
        "originDep": 470,
        "terminus": "Veszprém, autóbusz-állomás",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet",
          "szabadnap"
        ],
        "deps": [
          515,
          516,
          517,
          519,
          520,
          521,
          524,
          528,
          530,
          532,
          534,
          null,
          null,
          null
        ],
        "origin": "Veszprémfajsz, autóbusz-forduló",
        "originDep": 510,
        "terminus": "Veszprém, autóbusz-állomás",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet",
          "szabadnap"
        ],
        "deps": [
          570,
          571,
          572,
          574,
          575,
          576,
          579,
          583,
          585,
          587,
          589,
          null,
          null,
          null
        ],
        "origin": "Veszprémfajsz, autóbusz-forduló",
        "originDep": 565,
        "terminus": "Veszprém, autóbusz-állomás",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet",
          "szabadnap"
        ],
        "deps": [
          660,
          661,
          662,
          664,
          665,
          666,
          669,
          673,
          675,
          677,
          679,
          null,
          null,
          null
        ],
        "origin": "Veszprémfajsz, autóbusz-forduló",
        "originDep": 655,
        "terminus": "Veszprém, autóbusz-állomás",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "szabadnap"
        ],
        "deps": [
          685,
          686,
          687,
          689,
          690,
          691,
          694,
          698,
          700,
          702,
          704,
          null,
          null,
          null
        ],
        "origin": "Veszprémfajsz, autóbusz-forduló",
        "originDep": 680,
        "terminus": "Veszprém, autóbusz-állomás",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet"
        ],
        "deps": [
          715,
          716,
          717,
          719,
          720,
          721,
          724,
          728,
          730,
          732,
          734,
          null,
          null,
          null
        ],
        "origin": "Veszprémfajsz, autóbusz-forduló",
        "originDep": 710,
        "terminus": "Veszprém, autóbusz-állomás",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet",
          "szabadnap"
        ],
        "deps": [
          775,
          776,
          777,
          779,
          780,
          781,
          784,
          788,
          790,
          792,
          794,
          null,
          null,
          null
        ],
        "origin": "Veszprémfajsz, autóbusz-forduló",
        "originDep": 770,
        "terminus": "Veszprém, autóbusz-állomás",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet"
        ],
        "deps": [
          825,
          826,
          827,
          829,
          830,
          831,
          834,
          838,
          840,
          842,
          844,
          null,
          null,
          null
        ],
        "origin": "Nemesvámos, autóbusz-forduló",
        "originDep": 825,
        "terminus": "Veszprém, autóbusz-állomás",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet",
          "szabadnap"
        ],
        "deps": [
          850,
          851,
          852,
          854,
          855,
          856,
          859,
          863,
          865,
          867,
          869,
          null,
          null,
          null
        ],
        "origin": "Veszprémfajsz, autóbusz-forduló",
        "originDep": 845,
        "terminus": "Veszprém, autóbusz-állomás",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet"
        ],
        "deps": [
          880,
          881,
          882,
          884,
          885,
          886,
          889,
          893,
          895,
          897,
          899,
          null,
          null,
          null
        ],
        "origin": "Veszprémfajsz, autóbusz-forduló",
        "originDep": 875,
        "terminus": "Veszprém, autóbusz-állomás",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "szabadnap"
        ],
        "deps": [
          880,
          881,
          882,
          884,
          885,
          886,
          889,
          893,
          895,
          897,
          899,
          null,
          null,
          null
        ],
        "origin": "Veszprémfajsz, autóbusz-forduló",
        "originDep": 875,
        "terminus": "Veszprém, autóbusz-állomás",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet"
        ],
        "deps": [
          900,
          901,
          902,
          904,
          905,
          906,
          909,
          913,
          915,
          917,
          919,
          null,
          null,
          null
        ],
        "origin": "Veszprémfajsz, autóbusz-forduló",
        "originDep": 895,
        "terminus": "Veszprém, autóbusz-állomás",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "munkanap"
        ],
        "deps": [
          922,
          923,
          924,
          926,
          927,
          928,
          931,
          935,
          937,
          939,
          941,
          null,
          null,
          null
        ],
        "origin": "Veszprémfajsz, autóbusz-forduló",
        "originDep": 917,
        "terminus": "Veszprém, autóbusz-állomás",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet"
        ],
        "deps": [
          935,
          936,
          937,
          939,
          940,
          941,
          944,
          948,
          950,
          952,
          954,
          null,
          null,
          null
        ],
        "origin": "Veszprémfajsz, autóbusz-forduló",
        "originDep": 930,
        "terminus": "Veszprém, autóbusz-állomás",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "szabadnap"
        ],
        "deps": [
          960,
          961,
          962,
          964,
          965,
          966,
          969,
          973,
          975,
          977,
          979,
          null,
          null,
          null
        ],
        "origin": "Veszprémfajsz, autóbusz-forduló",
        "originDep": 955,
        "terminus": "Veszprém, autóbusz-állomás",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet"
        ],
        "deps": [
          976,
          977,
          978,
          980,
          981,
          982,
          985,
          989,
          991,
          993,
          995,
          null,
          null,
          null
        ],
        "origin": "Veszprémfajsz, autóbusz-forduló",
        "originDep": 971,
        "terminus": "Veszprém, autóbusz-állomás",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet"
        ],
        "deps": [
          995,
          996,
          997,
          999,
          1000,
          1001,
          1004,
          1008,
          1010,
          1012,
          1014,
          null,
          null,
          null
        ],
        "origin": "Veszprémfajsz, autóbusz-forduló",
        "originDep": 990,
        "terminus": "Veszprém, autóbusz-állomás",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet"
        ],
        "deps": [
          1065,
          1066,
          1067,
          1069,
          1070,
          1071,
          1074,
          1078,
          1080,
          1082,
          1084,
          null,
          null,
          null
        ],
        "origin": "Veszprémfajsz, autóbusz-forduló",
        "originDep": 1060,
        "terminus": "Veszprém, autóbusz-állomás",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "szabadnap"
        ],
        "deps": [
          1065,
          1066,
          1067,
          1069,
          1070,
          1071,
          1074,
          1078,
          1080,
          1082,
          1084,
          1084,
          1086,
          1092
        ],
        "origin": "Veszprémfajsz, autóbusz-forduló",
        "originDep": 1060,
        "terminus": "Veszprém, vasútállomás",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet"
        ],
        "deps": [
          1115,
          1116,
          1117,
          1119,
          1120,
          1121,
          1124,
          1128,
          1130,
          1132,
          1134,
          null,
          null,
          null
        ],
        "origin": "Veszprémfajsz, autóbusz-forduló",
        "originDep": 1110,
        "terminus": "Veszprém, autóbusz-állomás",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet"
        ],
        "deps": [
          1230,
          1231,
          1232,
          1234,
          1235,
          1236,
          1239,
          1243,
          1245,
          1247,
          1249,
          null,
          null,
          null
        ],
        "origin": "Veszprémfajsz, autóbusz-forduló",
        "originDep": 1225,
        "terminus": "Veszprém, autóbusz-állomás",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet",
          "szabadnap"
        ],
        "deps": [
          1325,
          1326,
          1327,
          1329,
          1330,
          1331,
          1334,
          1338,
          1340,
          1342,
          1344,
          null,
          null,
          null
        ],
        "origin": "Veszprémfajsz, autóbusz-forduló",
        "originDep": 1320,
        "terminus": "Veszprém, autóbusz-állomás",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet"
        ],
        "deps": [
          null,
          null,
          null,
          null,
          855,
          856,
          859,
          863,
          865,
          867,
          null,
          870,
          null,
          null
        ],
        "origin": "Nemesvámos, Köfém",
        "originDep": 855,
        "terminus": "Veszprém, autóbusz-állomás",
        "continuesBeyondModel": false
      }
    ]
  },
  {
    "id": "7363",
    "color": "#A01020",
    "label": "7363-as helyközi",
    "direction": "Veszprém, autóbusz-állomás ▸ Nemesvámos, autóbusz-váróterem",
    "dir": "iskola",
    "stops": [
      {
        "name": "Veszprém, autóbusz-állomás",
        "lat": 47.09564,
        "lon": 17.91386,
        "spId": "VOLAN_hkir_558455_10",
        "citySpId": "VBUSZ_SP1683",
        "platformCode": "10"
      },
      {
        "name": "Veszprém, Komakút tér",
        "lat": 47.089692,
        "lon": 17.907227,
        "spId": "VOLAN_hkir_558516_1",
        "citySpId": "VBUSZ_SP1621",
        "platformCode": ""
      },
      {
        "name": "Veszprém, József Attila utca",
        "lat": 47.085252,
        "lon": 17.899099,
        "spId": "VOLAN_hkir_558503_1",
        "citySpId": "VBUSZ_SP1620",
        "platformCode": ""
      },
      {
        "name": "Nemesvámos, Vilmapusztai elágazás",
        "lat": 47.070839,
        "lon": 17.880537,
        "spId": "VOLAN_hkir_557866_1",
        "citySpId": null,
        "platformCode": ""
      },
      {
        "name": "Nemesvámos, Haribo",
        "lat": 47.06477,
        "lon": 17.873877,
        "spId": "VOLAN_hkir_557863_1",
        "citySpId": null,
        "platformCode": ""
      },
      {
        "name": "Nemesvámos, Köfém",
        "lat": 47.062377,
        "lon": 17.871959,
        "spId": "VOLAN_hkir_557864_1",
        "citySpId": null,
        "platformCode": ""
      },
      {
        "name": "Nemesvámos, Dózsa György utca",
        "lat": 47.059056,
        "lon": 17.873308,
        "spId": "VOLAN_hkir_557860_1",
        "citySpId": null,
        "platformCode": ""
      },
      {
        "name": "Nemesvámos, autóbusz-váróterem",
        "lat": 47.05565,
        "lon": 17.870511,
        "spId": "VOLAN_hkir_557858_1",
        "citySpId": null,
        "platformCode": ""
      },
      {
        "name": "Nemesvámos, ABC",
        "lat": 47.054271,
        "lon": 17.873443,
        "spId": "VOLAN_hkir_557856_1",
        "citySpId": null,
        "platformCode": ""
      },
      {
        "name": "Nemesvámos, autóbusz-forduló",
        "lat": 47.050992,
        "lon": 17.87649,
        "spId": "VOLAN_hkir_557862_1",
        "citySpId": null,
        "platformCode": ""
      }
    ],
    "trips": [
      {
        "dayTypes": [
          "munkanap",
          "tanszunet",
          "szabadnap"
        ],
        "deps": [
          440,
          442,
          444,
          448,
          450,
          451,
          452,
          453,
          454,
          455
        ],
        "origin": "Veszprém, autóbusz-állomás",
        "originDep": 440,
        "terminus": "Balatonfüred, autóbusz-állomás",
        "continuesBeyondModel": true
      }
    ]
  },
  {
    "id": "7363",
    "color": "#A01020",
    "label": "7363-as helyközi",
    "direction": "Nemesvámos, autóbusz-forduló ▸ Veszprém, autóbusz-állomás",
    "dir": "haza",
    "stops": [
      {
        "name": "Nemesvámos, autóbusz-forduló",
        "lat": 47.051129,
        "lon": 17.876599,
        "spId": "VOLAN_hkir_557862_2",
        "citySpId": null,
        "platformCode": ""
      },
      {
        "name": "Nemesvámos, ABC",
        "lat": 47.053806,
        "lon": 17.874041,
        "spId": "VOLAN_hkir_557856_2",
        "citySpId": null,
        "platformCode": ""
      },
      {
        "name": "Nemesvámos, autóbusz-váróterem",
        "lat": 47.056285,
        "lon": 17.870066,
        "spId": "VOLAN_hkir_557858_2",
        "citySpId": null,
        "platformCode": ""
      },
      {
        "name": "Nemesvámos, Dózsa György utca",
        "lat": 47.059123,
        "lon": 17.873483,
        "spId": "VOLAN_hkir_557860_2",
        "citySpId": null,
        "platformCode": ""
      },
      {
        "name": "Nemesvámos, Köfém",
        "lat": 47.062506,
        "lon": 17.87195,
        "spId": "VOLAN_hkir_557864_2",
        "citySpId": null,
        "platformCode": ""
      },
      {
        "name": "Nemesvámos, Haribo",
        "lat": 47.06477,
        "lon": 17.873885,
        "spId": "VOLAN_hkir_557863_2",
        "citySpId": null,
        "platformCode": ""
      },
      {
        "name": "Nemesvámos, Vilmapusztai elágazás",
        "lat": 47.071187,
        "lon": 17.881172,
        "spId": "VOLAN_hkir_557866_2",
        "citySpId": null,
        "platformCode": ""
      },
      {
        "name": "Veszprém, József Attila utca",
        "lat": 47.085557,
        "lon": 17.899385,
        "spId": "VOLAN_hkir_558503_2",
        "citySpId": "VBUSZ_SP1667",
        "platformCode": ""
      },
      {
        "name": "Veszprém, Komakút tér",
        "lat": 47.089356,
        "lon": 17.907503,
        "spId": "VOLAN_hkir_558516_2",
        "citySpId": "VBUSZ_SP1668",
        "platformCode": ""
      },
      {
        "name": "Veszprém, Színház",
        "lat": 47.09187,
        "lon": 17.9061,
        "spId": "VOLAN_hkir_558558_2",
        "citySpId": "VBUSZ_SP1670",
        "platformCode": ""
      },
      {
        "name": "Veszprém, autóbusz-állomás",
        "lat": 47.095231,
        "lon": 17.913519,
        "spId": "VOLAN_hkir_558455_99",
        "citySpId": "VBUSZ_SP1694",
        "platformCode": ""
      }
    ],
    "trips": [
      {
        "dayTypes": [
          "munkanap",
          "tanszunet"
        ],
        "deps": [
          610,
          611,
          612,
          613,
          614,
          615,
          617,
          621,
          623,
          624,
          625
        ],
        "origin": "Balatonfüred, autóbusz-állomás",
        "originDep": 580,
        "terminus": "Veszprém, autóbusz-állomás",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet",
          "szabadnap"
        ],
        "deps": [
          1030,
          1031,
          1032,
          1033,
          1034,
          1035,
          1037,
          1041,
          1043,
          1044,
          1045
        ],
        "origin": "Balatonfüred, autóbusz-állomás",
        "originDep": 1000,
        "terminus": "Veszprém, autóbusz-állomás",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "tanszunet"
        ],
        "deps": [
          1180,
          1181,
          1182,
          1183,
          1184,
          1185,
          1187,
          1191,
          1193,
          1194,
          1195
        ],
        "origin": "Balatonfüred, autóbusz-állomás",
        "originDep": 1150,
        "terminus": "Veszprém, autóbusz-állomás",
        "continuesBeyondModel": false
      }
    ]
  },
  {
    "id": "7364",
    "color": "#B06010",
    "label": "7364-es helyközi",
    "direction": "Veszprém, vasútállomás ▸ Nemesvámos, autóbusz-váróterem",
    "dir": "iskola",
    "stops": [
      {
        "name": "Veszprém, vasútállomás",
        "lat": 47.118245,
        "lon": 17.911105,
        "spId": "VOLAN_hkir_558566_1",
        "citySpId": "VBUSZ_SP1856",
        "platformCode": "1"
      },
      {
        "name": "Veszprém, Jutasi úti lakótelep",
        "lat": 47.1074,
        "lon": 17.9113,
        "spId": "VOLAN_hkir_558506_2",
        "citySpId": "VBUSZ_SP1644",
        "platformCode": ""
      },
      {
        "name": "Veszprém, autóbusz-állomás",
        "lat": 47.095231,
        "lon": 17.913519,
        "spId": "VOLAN_hkir_558455_99",
        "citySpId": "VBUSZ_SP1694",
        "platformCode": ""
      },
      {
        "name": "Veszprém, autóbusz-állomás",
        "lat": 47.09564,
        "lon": 17.91386,
        "spId": "VOLAN_hkir_558455_10",
        "citySpId": "VBUSZ_SP1683",
        "platformCode": "10"
      },
      {
        "name": "Veszprém, Komakút tér",
        "lat": 47.089692,
        "lon": 17.907227,
        "spId": "VOLAN_hkir_558516_1",
        "citySpId": "VBUSZ_SP1621",
        "platformCode": ""
      },
      {
        "name": "Veszprém, József Attila utca",
        "lat": 47.085252,
        "lon": 17.899099,
        "spId": "VOLAN_hkir_558503_1",
        "citySpId": "VBUSZ_SP1620",
        "platformCode": ""
      },
      {
        "name": "Nemesvámos, Vilmapusztai elágazás",
        "lat": 47.070839,
        "lon": 17.880537,
        "spId": "VOLAN_hkir_557866_1",
        "citySpId": null,
        "platformCode": ""
      },
      {
        "name": "Nemesvámos, Haribo",
        "lat": 47.06477,
        "lon": 17.873877,
        "spId": "VOLAN_hkir_557863_1",
        "citySpId": null,
        "platformCode": ""
      },
      {
        "name": "Nemesvámos, Köfém",
        "lat": 47.062377,
        "lon": 17.871959,
        "spId": "VOLAN_hkir_557864_1",
        "citySpId": null,
        "platformCode": ""
      },
      {
        "name": "Nemesvámos, Dózsa György utca",
        "lat": 47.059056,
        "lon": 17.873308,
        "spId": "VOLAN_hkir_557860_1",
        "citySpId": null,
        "platformCode": ""
      },
      {
        "name": "Nemesvámos, autóbusz-váróterem",
        "lat": 47.056432,
        "lon": 17.869564,
        "spId": "VOLAN_hkir_557858_3",
        "citySpId": null,
        "platformCode": ""
      }
    ],
    "trips": [
      {
        "dayTypes": [
          "munkanap",
          "tanszunet"
        ],
        "deps": [
          765,
          769,
          773,
          780,
          782,
          784,
          788,
          791,
          792,
          793,
          794
        ],
        "origin": "Veszprém, vasútállomás",
        "originDep": 765,
        "terminus": "Balatonfüred, autóbusz-állomás",
        "continuesBeyondModel": true
      },
      {
        "dayTypes": [
          "szabadnap"
        ],
        "deps": [
          null,
          null,
          null,
          780,
          782,
          784,
          788,
          791,
          792,
          793,
          794
        ],
        "origin": "Veszprém, autóbusz-állomás",
        "originDep": 780,
        "terminus": "Balatonfüred, autóbusz-állomás",
        "continuesBeyondModel": true
      }
    ]
  },
  {
    "id": "7364",
    "color": "#B06010",
    "label": "7364-es helyközi",
    "direction": "Nemesvámos, autóbusz-váróterem ▸ Veszprém, autóbusz-állomás",
    "dir": "haza",
    "stops": [
      {
        "name": "Nemesvámos, autóbusz-váróterem",
        "lat": 47.056285,
        "lon": 17.870066,
        "spId": "VOLAN_hkir_557858_2",
        "citySpId": null,
        "platformCode": ""
      },
      {
        "name": "Nemesvámos, Dózsa György utca",
        "lat": 47.059123,
        "lon": 17.873483,
        "spId": "VOLAN_hkir_557860_2",
        "citySpId": null,
        "platformCode": ""
      },
      {
        "name": "Nemesvámos, Köfém",
        "lat": 47.062506,
        "lon": 17.87195,
        "spId": "VOLAN_hkir_557864_2",
        "citySpId": null,
        "platformCode": ""
      },
      {
        "name": "Nemesvámos, Haribo",
        "lat": 47.06477,
        "lon": 17.873885,
        "spId": "VOLAN_hkir_557863_2",
        "citySpId": null,
        "platformCode": ""
      },
      {
        "name": "Nemesvámos, Vilmapusztai elágazás",
        "lat": 47.071187,
        "lon": 17.881172,
        "spId": "VOLAN_hkir_557866_2",
        "citySpId": null,
        "platformCode": ""
      },
      {
        "name": "Veszprém, József Attila utca",
        "lat": 47.085557,
        "lon": 17.899385,
        "spId": "VOLAN_hkir_558503_2",
        "citySpId": "VBUSZ_SP1667",
        "platformCode": ""
      },
      {
        "name": "Veszprém, Komakút tér",
        "lat": 47.089356,
        "lon": 17.907503,
        "spId": "VOLAN_hkir_558516_2",
        "citySpId": "VBUSZ_SP1668",
        "platformCode": ""
      },
      {
        "name": "Veszprém, Színház",
        "lat": 47.09187,
        "lon": 17.9061,
        "spId": "VOLAN_hkir_558558_2",
        "citySpId": "VBUSZ_SP1670",
        "platformCode": ""
      },
      {
        "name": "Veszprém, autóbusz-állomás",
        "lat": 47.095231,
        "lon": 17.913519,
        "spId": "VOLAN_hkir_558455_99",
        "citySpId": "VBUSZ_SP1694",
        "platformCode": ""
      }
    ],
    "trips": [
      {
        "dayTypes": [
          "munkanap",
          "tanszunet",
          "szabadnap"
        ],
        "deps": [
          506,
          507,
          508,
          509,
          511,
          515,
          517,
          518,
          519
        ],
        "origin": "Balatonfüred, autóbusz-állomás",
        "originDep": 445,
        "terminus": "Veszprém, autóbusz-állomás",
        "continuesBeyondModel": false
      }
    ]
  },
  {
    "id": "7366",
    "color": "#906030",
    "label": "7366-os helyközi",
    "direction": "Veszprém, vasútállomás ▸ Nemesvámos, autóbusz-váróterem",
    "dir": "iskola",
    "stops": [
      {
        "name": "Veszprém, vasútállomás",
        "lat": 47.118245,
        "lon": 17.911105,
        "spId": "VOLAN_hkir_558566_1",
        "citySpId": "VBUSZ_SP1856",
        "platformCode": "1"
      },
      {
        "name": "Veszprém, Jutasi úti lakótelep",
        "lat": 47.1074,
        "lon": 17.9113,
        "spId": "VOLAN_hkir_558506_2",
        "citySpId": "VBUSZ_SP1644",
        "platformCode": ""
      },
      {
        "name": "Veszprém, autóbusz-állomás",
        "lat": 47.095231,
        "lon": 17.913519,
        "spId": "VOLAN_hkir_558455_99",
        "citySpId": "VBUSZ_SP1694",
        "platformCode": ""
      },
      {
        "name": "Veszprém, autóbusz-állomás",
        "lat": 47.09559,
        "lon": 17.91388,
        "spId": "VOLAN_hkir_558455_9",
        "citySpId": "VBUSZ_SP1683",
        "platformCode": "9"
      },
      {
        "name": "Veszprém, Komakút tér",
        "lat": 47.089692,
        "lon": 17.907227,
        "spId": "VOLAN_hkir_558516_1",
        "citySpId": "VBUSZ_SP1621",
        "platformCode": ""
      },
      {
        "name": "Veszprém, József Attila utca",
        "lat": 47.085252,
        "lon": 17.899099,
        "spId": "VOLAN_hkir_558503_1",
        "citySpId": "VBUSZ_SP1620",
        "platformCode": ""
      },
      {
        "name": "Nemesvámos, Vilmapusztai elágazás",
        "lat": 47.070839,
        "lon": 17.880537,
        "spId": "VOLAN_hkir_557866_1",
        "citySpId": null,
        "platformCode": ""
      },
      {
        "name": "Nemesvámos, Haribo",
        "lat": 47.06477,
        "lon": 17.873877,
        "spId": "VOLAN_hkir_557863_1",
        "citySpId": null,
        "platformCode": ""
      },
      {
        "name": "Nemesvámos, Köfém",
        "lat": 47.062377,
        "lon": 17.871959,
        "spId": "VOLAN_hkir_557864_1",
        "citySpId": null,
        "platformCode": ""
      },
      {
        "name": "Nemesvámos, Dózsa György utca",
        "lat": 47.059056,
        "lon": 17.873308,
        "spId": "VOLAN_hkir_557860_1",
        "citySpId": null,
        "platformCode": ""
      },
      {
        "name": "Nemesvámos, autóbusz-váróterem",
        "lat": 47.05565,
        "lon": 17.870511,
        "spId": "VOLAN_hkir_557858_1",
        "citySpId": null,
        "platformCode": ""
      },
      {
        "name": "Nemesvámos, ABC",
        "lat": 47.054271,
        "lon": 17.873443,
        "spId": "VOLAN_hkir_557856_1",
        "citySpId": null,
        "platformCode": ""
      },
      {
        "name": "Nemesvámos, autóbusz-forduló",
        "lat": 47.051129,
        "lon": 17.876599,
        "spId": "VOLAN_hkir_557862_2",
        "citySpId": null,
        "platformCode": ""
      }
    ],
    "trips": [
      {
        "dayTypes": [
          "szabadnap"
        ],
        "deps": [
          525,
          529,
          533,
          540,
          542,
          544,
          548,
          550,
          551,
          552,
          553,
          554,
          555
        ],
        "origin": "Veszprém, vasútállomás",
        "originDep": 525,
        "terminus": "Nagyvázsony, autóbusz-váróterem",
        "continuesBeyondModel": true
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet",
          "szabadnap"
        ],
        "deps": [
          null,
          null,
          null,
          1275,
          1277,
          1278,
          1281,
          1283,
          1284,
          1285,
          1286,
          1287,
          1289
        ],
        "origin": "Veszprém, autóbusz-állomás",
        "originDep": 1275,
        "terminus": "Nagyvázsony, autóbusz-váróterem",
        "continuesBeyondModel": true
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet"
        ],
        "deps": [
          null,
          null,
          null,
          1350,
          1353,
          1354,
          1358,
          1360,
          1361,
          1362,
          1363,
          1364,
          1375
        ],
        "origin": "Veszprém, autóbusz-állomás",
        "originDep": 1350,
        "terminus": "Nagyvázsony, autóbusz-váróterem",
        "continuesBeyondModel": true
      },
      {
        "dayTypes": [
          "szabadnap"
        ],
        "deps": [
          null,
          null,
          null,
          1360,
          1363,
          1364,
          1368,
          1370,
          1371,
          1372,
          1373,
          1374,
          1385
        ],
        "origin": "Veszprém, autóbusz-állomás",
        "originDep": 1360,
        "terminus": "Nagyvázsony, autóbusz-váróterem",
        "continuesBeyondModel": true
      }
    ]
  },
  {
    "id": "7366",
    "color": "#906030",
    "label": "7366-os helyközi",
    "direction": "Nemesvámos, autóbusz-váróterem ▸ Veszprém, autóbusz-állomás",
    "dir": "haza",
    "stops": [
      {
        "name": "Nemesvámos, autóbusz-forduló",
        "lat": 47.051129,
        "lon": 17.876599,
        "spId": "VOLAN_hkir_557862_2",
        "citySpId": null,
        "platformCode": ""
      },
      {
        "name": "Nemesvámos, ABC",
        "lat": 47.053806,
        "lon": 17.874041,
        "spId": "VOLAN_hkir_557856_2",
        "citySpId": null,
        "platformCode": ""
      },
      {
        "name": "Nemesvámos, autóbusz-váróterem",
        "lat": 47.056285,
        "lon": 17.870066,
        "spId": "VOLAN_hkir_557858_2",
        "citySpId": null,
        "platformCode": ""
      },
      {
        "name": "Nemesvámos, Dózsa György utca",
        "lat": 47.059123,
        "lon": 17.873483,
        "spId": "VOLAN_hkir_557860_2",
        "citySpId": null,
        "platformCode": ""
      },
      {
        "name": "Nemesvámos, Köfém",
        "lat": 47.062506,
        "lon": 17.87195,
        "spId": "VOLAN_hkir_557864_2",
        "citySpId": null,
        "platformCode": ""
      },
      {
        "name": "Nemesvámos, Haribo",
        "lat": 47.06477,
        "lon": 17.873885,
        "spId": "VOLAN_hkir_557863_2",
        "citySpId": null,
        "platformCode": ""
      },
      {
        "name": "Nemesvámos, Vilmapusztai elágazás",
        "lat": 47.071187,
        "lon": 17.881172,
        "spId": "VOLAN_hkir_557866_2",
        "citySpId": null,
        "platformCode": ""
      },
      {
        "name": "Veszprém, József Attila utca",
        "lat": 47.085557,
        "lon": 17.899385,
        "spId": "VOLAN_hkir_558503_2",
        "citySpId": "VBUSZ_SP1667",
        "platformCode": ""
      },
      {
        "name": "Veszprém, Komakút tér",
        "lat": 47.089356,
        "lon": 17.907503,
        "spId": "VOLAN_hkir_558516_2",
        "citySpId": "VBUSZ_SP1668",
        "platformCode": ""
      },
      {
        "name": "Veszprém, Színház",
        "lat": 47.09187,
        "lon": 17.9061,
        "spId": "VOLAN_hkir_558558_2",
        "citySpId": "VBUSZ_SP1670",
        "platformCode": ""
      },
      {
        "name": "Veszprém, autóbusz-állomás",
        "lat": 47.095231,
        "lon": 17.913519,
        "spId": "VOLAN_hkir_558455_99",
        "citySpId": "VBUSZ_SP1694",
        "platformCode": ""
      }
    ],
    "trips": [
      {
        "dayTypes": [
          "munkanap",
          "tanszunet"
        ],
        "deps": [
          310,
          311,
          312,
          313,
          314,
          315,
          318,
          322,
          324,
          326,
          327
        ],
        "origin": "Monostorapáti, községháza",
        "originDep": 255,
        "terminus": "Veszprém, autóbusz-állomás",
        "continuesBeyondModel": false
      }
    ]
  },
  {
    "id": "7370",
    "color": "#D03010",
    "label": "7370-es helyközi",
    "direction": "Veszprém, vasútállomás ▸ Nemesvámos, autóbusz-váróterem",
    "dir": "iskola",
    "stops": [
      {
        "name": "Veszprém, vasútállomás",
        "lat": 47.118245,
        "lon": 17.911105,
        "spId": "VOLAN_hkir_558566_1",
        "citySpId": "VBUSZ_SP1856",
        "platformCode": "1"
      },
      {
        "name": "Veszprém, Jutasi úti lakótelep",
        "lat": 47.1074,
        "lon": 17.9113,
        "spId": "VOLAN_hkir_558506_2",
        "citySpId": "VBUSZ_SP1644",
        "platformCode": ""
      },
      {
        "name": "Veszprém, autóbusz-állomás",
        "lat": 47.095231,
        "lon": 17.913519,
        "spId": "VOLAN_hkir_558455_99",
        "citySpId": "VBUSZ_SP1694",
        "platformCode": ""
      },
      {
        "name": "Veszprém, autóbusz-állomás",
        "lat": 47.09559,
        "lon": 17.91388,
        "spId": "VOLAN_hkir_558455_9",
        "citySpId": "VBUSZ_SP1683",
        "platformCode": "9"
      },
      {
        "name": "Veszprém, Komakút tér",
        "lat": 47.089692,
        "lon": 17.907227,
        "spId": "VOLAN_hkir_558516_1",
        "citySpId": "VBUSZ_SP1621",
        "platformCode": ""
      },
      {
        "name": "Veszprém, József Attila utca",
        "lat": 47.085252,
        "lon": 17.899099,
        "spId": "VOLAN_hkir_558503_1",
        "citySpId": "VBUSZ_SP1620",
        "platformCode": ""
      },
      {
        "name": "Nemesvámos, Vilmapusztai elágazás",
        "lat": 47.070839,
        "lon": 17.880537,
        "spId": "VOLAN_hkir_557866_1",
        "citySpId": null,
        "platformCode": ""
      },
      {
        "name": "Nemesvámos, Haribo",
        "lat": 47.06477,
        "lon": 17.873877,
        "spId": "VOLAN_hkir_557863_1",
        "citySpId": null,
        "platformCode": ""
      },
      {
        "name": "Nemesvámos, Köfém",
        "lat": 47.062377,
        "lon": 17.871959,
        "spId": "VOLAN_hkir_557864_1",
        "citySpId": null,
        "platformCode": ""
      },
      {
        "name": "Nemesvámos, Dózsa György utca",
        "lat": 47.059056,
        "lon": 17.873308,
        "spId": "VOLAN_hkir_557860_1",
        "citySpId": null,
        "platformCode": ""
      },
      {
        "name": "Nemesvámos, autóbusz-váróterem",
        "lat": 47.056432,
        "lon": 17.869564,
        "spId": "VOLAN_hkir_557858_3",
        "citySpId": null,
        "platformCode": ""
      }
    ],
    "trips": [
      {
        "dayTypes": [
          "munkanap",
          "tanszunet"
        ],
        "deps": [
          null,
          null,
          null,
          325,
          327,
          329,
          333,
          336,
          337,
          338,
          339
        ],
        "origin": "Veszprém, autóbusz-állomás",
        "originDep": 325,
        "terminus": "Tapolca, vasútállomás",
        "continuesBeyondModel": true
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet",
          "szabadnap"
        ],
        "deps": [
          null,
          null,
          null,
          null,
          434,
          436,
          439,
          441,
          442,
          443,
          444
        ],
        "origin": "Veszprém, autóbusz-állomás",
        "originDep": 430,
        "terminus": "Tapolca, autóbusz-állomás",
        "continuesBeyondModel": true
      },
      {
        "dayTypes": [
          "szabadnap"
        ],
        "deps": [
          645,
          649,
          653,
          660,
          662,
          664,
          668,
          671,
          672,
          673,
          674
        ],
        "origin": "Veszprém, vasútállomás",
        "originDep": 645,
        "terminus": "Tapolca, autóbusz-állomás",
        "continuesBeyondModel": true
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet"
        ],
        "deps": [
          645,
          649,
          653,
          660,
          662,
          664,
          668,
          671,
          672,
          673,
          674
        ],
        "origin": "Veszprém, vasútállomás",
        "originDep": 645,
        "terminus": "Tapolca, Ipar utca",
        "continuesBeyondModel": true
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet",
          "szabadnap"
        ],
        "deps": [
          null,
          null,
          null,
          870,
          872,
          874,
          878,
          881,
          882,
          883,
          884
        ],
        "origin": "Veszprém, autóbusz-állomás",
        "originDep": 870,
        "terminus": "Taliándörögd, autóbusz-váróterem",
        "continuesBeyondModel": true
      },
      {
        "dayTypes": [
          "munkanap"
        ],
        "deps": [
          null,
          null,
          null,
          null,
          812,
          814,
          null,
          null,
          null,
          null,
          null
        ],
        "origin": "Veszprém, autóbusz-állomás",
        "originDep": 810,
        "terminus": "Tapolca, autóbusz-állomás",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet"
        ],
        "deps": [
          null,
          null,
          null,
          null,
          932,
          934,
          null,
          null,
          null,
          null,
          null
        ],
        "origin": "Veszprém, autóbusz-állomás",
        "originDep": 930,
        "terminus": "Tapolca, autóbusz-állomás",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet"
        ],
        "deps": [
          null,
          null,
          null,
          null,
          977,
          978,
          984,
          null,
          null,
          null,
          null
        ],
        "origin": "Veszprém, autóbusz-állomás",
        "originDep": 975,
        "terminus": "Tapolca, autóbusz-állomás",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet",
          "szabadnap"
        ],
        "deps": [
          null,
          null,
          null,
          null,
          1352,
          1353,
          null,
          null,
          null,
          null,
          null
        ],
        "origin": "Veszprém, autóbusz-állomás",
        "originDep": 1350,
        "terminus": "Tapolca, autóbusz-állomás",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet"
        ],
        "deps": [
          null,
          null,
          null,
          855,
          857,
          859,
          null,
          null,
          null,
          null,
          null
        ],
        "origin": "Veszprém, autóbusz-állomás",
        "originDep": 855,
        "terminus": "Tapolca, autóbusz-állomás",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet"
        ],
        "deps": [
          null,
          null,
          null,
          900,
          902,
          904,
          908,
          null,
          null,
          null,
          null
        ],
        "origin": "Veszprém, autóbusz-állomás",
        "originDep": 900,
        "terminus": "Tapolca, autóbusz-állomás",
        "continuesBeyondModel": false
      }
    ]
  },
  {
    "id": "7370",
    "color": "#D03010",
    "label": "7370-es helyközi",
    "direction": "Nemesvámos, autóbusz-váróterem ▸ Veszprém, vasútállomás",
    "dir": "haza",
    "stops": [
      {
        "name": "Nemesvámos, autóbusz-váróterem",
        "lat": 47.056285,
        "lon": 17.870066,
        "spId": "VOLAN_hkir_557858_2",
        "citySpId": null,
        "platformCode": ""
      },
      {
        "name": "Nemesvámos, Dózsa György utca",
        "lat": 47.059123,
        "lon": 17.873483,
        "spId": "VOLAN_hkir_557860_2",
        "citySpId": null,
        "platformCode": ""
      },
      {
        "name": "Nemesvámos, Köfém",
        "lat": 47.062506,
        "lon": 17.87195,
        "spId": "VOLAN_hkir_557864_2",
        "citySpId": null,
        "platformCode": ""
      },
      {
        "name": "Nemesvámos, Haribo",
        "lat": 47.06477,
        "lon": 17.873885,
        "spId": "VOLAN_hkir_557863_2",
        "citySpId": null,
        "platformCode": ""
      },
      {
        "name": "Nemesvámos, Vilmapusztai elágazás",
        "lat": 47.071187,
        "lon": 17.881172,
        "spId": "VOLAN_hkir_557866_2",
        "citySpId": null,
        "platformCode": ""
      },
      {
        "name": "Veszprém, József Attila utca",
        "lat": 47.085557,
        "lon": 17.899385,
        "spId": "VOLAN_hkir_558503_2",
        "citySpId": "VBUSZ_SP1667",
        "platformCode": ""
      },
      {
        "name": "Veszprém, Komakút tér",
        "lat": 47.089356,
        "lon": 17.907503,
        "spId": "VOLAN_hkir_558516_2",
        "citySpId": "VBUSZ_SP1668",
        "platformCode": ""
      },
      {
        "name": "Veszprém, Színház",
        "lat": 47.09187,
        "lon": 17.9061,
        "spId": "VOLAN_hkir_558558_2",
        "citySpId": "VBUSZ_SP1670",
        "platformCode": ""
      },
      {
        "name": "Veszprém, autóbusz-állomás",
        "lat": 47.095231,
        "lon": 17.913519,
        "spId": "VOLAN_hkir_558455_99",
        "citySpId": "VBUSZ_SP1694",
        "platformCode": ""
      },
      {
        "name": "Veszprém, autóbusz-állomás",
        "lat": 47.09545,
        "lon": 17.9132,
        "spId": "VOLAN_hkir_558455_16",
        "citySpId": "VBUSZ_SP1694",
        "platformCode": "16"
      },
      {
        "name": "Veszprém, Jutasi úti lakótelep",
        "lat": 47.107,
        "lon": 17.9116,
        "spId": "VOLAN_hkir_558506_1",
        "citySpId": "VBUSZ_SP1619",
        "platformCode": ""
      },
      {
        "name": "Veszprém, vasútállomás",
        "lat": 47.118012,
        "lon": 17.911086,
        "spId": "VOLAN_hkir_558566_99",
        "citySpId": "VBUSZ_SP1856",
        "platformCode": ""
      }
    ],
    "trips": [
      {
        "dayTypes": [
          "szabadnap"
        ],
        "deps": [
          316,
          317,
          318,
          319,
          322,
          326,
          328,
          330,
          331,
          null,
          null,
          null
        ],
        "origin": "Monostorapáti, községháza",
        "originDep": 245,
        "terminus": "Veszprém, autóbusz-állomás",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet",
          "szabadnap"
        ],
        "deps": [
          781,
          782,
          783,
          784,
          787,
          791,
          793,
          795,
          796,
          null,
          null,
          null
        ],
        "origin": "Tapolca, vasútállomás",
        "originDep": 645,
        "terminus": "Veszprém, autóbusz-állomás",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet"
        ],
        "deps": [
          1061,
          1062,
          1063,
          1064,
          1067,
          1071,
          1073,
          1074,
          1075,
          1075,
          1077,
          1083
        ],
        "origin": "Tapolca, autóbusz-állomás",
        "originDep": 980,
        "terminus": "Veszprém, vasútállomás",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet"
        ],
        "deps": [
          null,
          null,
          null,
          null,
          null,
          405,
          407,
          408,
          410,
          null,
          null,
          null
        ],
        "origin": "Tapolca, autóbusz-állomás",
        "originDep": 350,
        "terminus": "Veszprém, autóbusz-állomás",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet",
          "szabadnap"
        ],
        "deps": [
          null,
          null,
          null,
          null,
          null,
          774,
          776,
          777,
          780,
          null,
          null,
          null
        ],
        "origin": "Tapolca, autóbusz-állomás",
        "originDep": 715,
        "terminus": "Veszprém, autóbusz-állomás",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "szabadnap"
        ],
        "deps": [
          null,
          null,
          null,
          null,
          null,
          960,
          962,
          963,
          964,
          null,
          null,
          null
        ],
        "origin": "Tapolca, vasútállomás",
        "originDep": 855,
        "terminus": "Veszprém, autóbusz-állomás",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "szabadnap"
        ],
        "deps": [
          null,
          null,
          null,
          null,
          995,
          999,
          1001,
          1002,
          1003,
          null,
          null,
          null
        ],
        "origin": "Tapolca, autóbusz-állomás",
        "originDep": 863,
        "terminus": "Veszprém, autóbusz-állomás",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet"
        ],
        "deps": [
          null,
          null,
          null,
          null,
          994,
          998,
          1000,
          1001,
          1002,
          null,
          null,
          null
        ],
        "origin": "Tapolca, autóbusz-állomás",
        "originDep": 863,
        "terminus": "Veszprém, autóbusz-állomás",
        "continuesBeyondModel": false
      },
      {
        "dayTypes": [
          "munkanap",
          "tanszunet",
          "szabadnap"
        ],
        "deps": [
          null,
          null,
          null,
          null,
          371,
          375,
          377,
          378,
          379,
          null,
          null,
          null
        ],
        "origin": "Tapolca, autóbusz-állomás",
        "originDep": 285,
        "terminus": "Veszprém, autóbusz-állomás",
        "continuesBeyondModel": false
      }
    ]
  }
];
