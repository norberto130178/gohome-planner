# Menetrend-ellenőrzés — javítások naplója

Forrás: `menetrend-fuzet-260601.pdf`  
Cél: `city-data.js` — `window.CITY_BUSES_FULL`  
Ellenőrzés dátuma: 2026-06-08

---

## Jelölések

- ✅ Hibátlan (egyezik a PDF-fel)
- 🔧 Javítva
- ➕ Hozzáadva (hiányzó adat)
- ⚠️ Pending (adat még nem áll rendelkezésre)

---

## 1-es busz (PDF: page ?)

### Visszafelé irány
| Típus | Óra | Volt | Lett | Megjegyzés |
|---|---|---|---|---|
| 🔧 schoolholiday | 16h | `[46]` | `[16, 46]` | Parser kihagyta a 16-os percet |
| 🔧 weekend | 16h | `[16, 46, 16]` | `[]` (üres) | PDF-ben nincs hétvégi 16h indulás |

---

## 2-es busz (PDF: page 4–5)

### Visszafelé irány — körjárat, Endrődi Sándor lakótelep-nél elvágva
| Típus | Mit | Volt | Lett | Megjegyzés |
|---|---|---|---|---|
| 🔧 direction label | — | `"Harmat utca ▸ Veszprém vasútállomás"` | `"Endrődi Sándor lakótelep ▸ Veszprém vasútállomás"` | Rossz vágási pont |
| 🔧 stops | első megálló | Harmat utca (offset 0) | Endrődi Sándor lakótelep (offset 0) | Körjárat vágása az Endrődinél |
| 🔧 workday + schoolholiday | 5h | `[47]` | `[4, 47]` | PDF-ben két indulás volt (szövegréteg-átfedés miatt parser csak a 47-et olvasta) |

### Odafelé irány
| Típus | Mit | Volt | Lett | Megjegyzés |
|---|---|---|---|---|
| ➕ stops | utolsó megálló | hiányzott | Endrődi Sándor lakótelep (offset 14) | Körjárat vágási pontja az odafelé irányban is kell |

---

## 3-as busz (PDF: page 6–7)

### Odafelé irány
| Típus | Óra | Volt | Lett |
|---|---|---|---|
| 🔧 workday | 13h | `[3]` | `[3, 13, 33, 53]` |
| 🔧 schoolholiday | 13h | `[33, 53]` | `[3, 13, 33, 53]` |
| 🔧 weekend | 13h | `[3, 13, 33, 53, 13, 23]` | `[23]` |
| 🔧 weekend | 22h | `[...]` | `[]` (törölve) | PDF-ben nincs 22h hétvégi indulás |

### Visszafelé irány
| Típus | Óra | Volt | Lett |
|---|---|---|---|
| 🔧 schoolholiday | 13h | `[43]` | `[13, 43]` |
| 🔧 weekend | 13h | `[13, 43, 13]` | `[]` (üres) | Parser garble |

---

## 4-es busz (PDF: page 8 — odafelé, page 10 — visszafelé)

> Page 8 és 10 összevont: 4-es és 4A adatok együtt. Szétválasztás: (A) jelölésű = 4A, jelöletlen = 4.

### Odafelé irány (Jutaspuszta ▸ Vámosi úti forduló)
| Típus | Mit | Megjegyzés |
|---|---|---|
| 🔧 teljes menetrend | Teljes csere | Az eredeti adat 4A járatot tartalmazott (A-jelölt indulások). Forrás: PDF page 8, annotáció nélküli értékek |

### Visszafelé irány (Vámosi úti forduló ▸ Jutaspuszta) — ÚJ
| Típus | Mit | Megjegyzés |
|---|---|---|
| ➕ teljes irány | Hozzáadva | Hiányzott a city-datából. Forrás: PDF page 10, (A) jelölés nélküli értékek |
| 🔧 megállók koordinátái | Első 7 megálló javítva | Rossz koordinátákon voltak (szórva a városon kívülre). Forrás: 4A visszafelé irány azonos megállói |

---

## 4A busz (PDF: page 9 — odafelé, page 10 — visszafelé)

### Odafelé irány (Veszprém vasútállomás ▸ Vámosi úti forduló)
| Típus | Mit | Megjegyzés |
|---|---|---|
| 🔧 workday | Teljes csere | Felhasználó által megadott helyes adatok |
| ⚠️ schoolholiday | Hiányzik | Nem áll rendelkezésre — pending |
| ⚠️ weekend | Hiányzik | Nem áll rendelkezésre — pending |

---

## 5-ös busz (PDF: page ?)

### Odafelé irány
| Típus | Óra | Volt | Lett |
|---|---|---|---|
| 🔧 schoolholiday | 7h | `[40]` | `[8, 28]` |
| 🔧 schoolholiday | 8h | `[38]` | `[8, 38]` |
| 🔧 weekend | 7h | `[8, 28, 7, 38]` | `[38]` |
| 🔧 weekend | 8h | `[38, 8, 38]` | `[38]` |

---

## 6-os busz (PDF: page 13–14)

> Page 13 összevont oldal: 6-os és 16-os busz együtt. A hétvégi (V) jelölésű értékek a 16-os buszhoz tartoznak.

### Odafelé irány (Haszkovó forduló ▸ Vámosi úti forduló)
| Típus | Óra | Volt | Lett | Megjegyzés |
|---|---|---|---|---|
| 🔧 workday | 16h | `[1]` | `[1, 16, 32, 47]` | Parser garble |
| 🔧 workday | 17h | `[2]` | `[2, 17, 35, 55]` | Parser garble |
| 🔧 schoolholiday | 16h | `[32, 47]` | `[11, 31, 51]` | Parser garble |
| 🔧 schoolholiday | 17h | `[35, 55]` | `[11, 33, 55]` | Parser garble |
| 🔧 weekend | 8–11h | `[23(O), 23(V), 53]` | `[23(O), 53]` | 23(V) = 16-os busz indulása, nem a 6-osé |
| 🔧 weekend | 16h | `[11, 31, 51, 16, 23, 53]` | `[23, 53]` | Parser garble |
| 🔧 weekend | 17h | `[11, 33, 55, 17, 23, 53]` | `[23, 53]` | Parser garble |

### Visszafelé irány (Vámosi úti forduló ▸ Haszkovó forduló)
| Típus | Óra | Volt | Lett |
|---|---|---|---|
| 🔧 weekend | 9h | `[9, 39, 9, 9, 39(O)]` | `[9, 39(O)]` |

---

## 7-es busz (PDF: page 15–16) — körjárat, Cholnoky lakótelepnél elvágva

### Odafelé irány ✅ Hibátlan

### Visszafelé irány (Cholnoky lakótelep ▸ Haszkovó forduló)
| Típus | Óra | Volt | Lett |
|---|---|---|---|
| 🔧 schoolholiday | 8h | hiányzott | `[6]` |
| 🔧 schoolholiday | 11h | hiányzott | `[11]` |
| 🔧 schoolholiday | 13h | hiányzott | `[11]` |
| 🔧 weekend | 8h | `[6, 8, 11]` | `[11]` |
| 🔧 weekend | 11h | `[11, 11, 11]` | `[11]` |
| 🔧 weekend | 13h | `[11, 13, 11]` | `[11]` |

---

## 7A busz (PDF: page 17–18)

### Odafelé irány (Haszkovó forduló ▸ Ady E. utca / Cholnoky J. utca)
| Típus | Óra | Volt | Lett |
|---|---|---|---|
| 🔧 schoolholiday | 14h | hiányzott | `[14, 54]` |
| 🔧 schoolholiday | 22h | hiányzott | `[22]` |
| 🔧 weekend | 14h | `[54, 14, 26]` | `[26]` |
| 🔧 weekend | 22h | `[22, 22, 22]` | `[22]` |

### Visszafelé irány ✅ Hibátlan

---

## 8-as busz (PDF: page 19–20)

> Page 19 összevont oldal: 8-as és 8A kifelé irány együtt. (A) jelölésű indulások = 8A (Iskola utcáig), többi = 8-as (Csererdőig).

### Odafelé irány (Haszkovó forduló ▸ Csererdő)
| Típus | Mit | Megjegyzés |
|---|---|---|
| 🔧 workday + schoolholiday | 8h: `58(A)`, 9–11h: `58(A)`, 17–18h: `58(A)`, 20h: `8(A)` kivéve | Átkerültek a 8A kifelé irányba |
| 🔧 weekend | 7–12h, 14–16h: `9(A)` kivéve | Átkerültek a 8A kifelé irányba |

### Visszafelé irány (Csererdő ▸ Haszkovó forduló) ✅ Hibátlan

---

## 8A busz (PDF: page 19 — kifelé összevonva a 8-assal, page 21 — visszafelé)

### Kifelé irány (Haszkovó forduló ▸ Iskola utca) — ÚJ
| Típus | Mit | Megjegyzés |
|---|---|---|
| ➕ teljes irány | Hozzáadva | Hiányzott a city-datából. A 8-as kifelé (A) jelölésű indulásaiból kivonva, annotáció nélkül |
| ➕ megállók | Haszkovó fordulótól Iskola utcáig | Bus 8 kifelé első 15 megállója |

### Visszafelé irány (Iskola utca ▸ Haszkovó forduló) ✅ Hibátlan

---

## 8Y busz (PDF: page 22) ✅ Hibátlan

## 16-os busz (PDF: page 34–35) ✅ Hibátlan

---

## 10-es busz (PDF: page 23–24)

### Odafelé irány (Veszprém vasútállomás ▸ Völgyhíd tér)
| Típus | Óra | Volt | Lett |
|---|---|---|---|
| 🔧 weekend | 20h | `[20, 20]` | `[]` (törölve) |

### Visszafelé irány (Juhar utca ▸ Veszprém vasútállomás) ✅ Hibátlan

---

## 11-es busz (PDF: page 25–26) ✅ Mindkét irány hibátlan

---

## 12-es busz (PDF: page 27) ✅ Hibátlan — körjárat, csak munkanapon/tanszünetben közlekedik

---

## 13-as busz (PDF: page 28–29)

### Odafelé irány (Kádártai úti forduló ▸ Völgyhíd tér)
| Típus | Mit | Megjegyzés |
|---|---|---|
| 🔧 weekend 7h, 9h, 11h | `n:'H'` → `n:'Hv'` | PDF-ben `Hv` = Hotelig + csak vasárnap. Az `n:'H'` verzió szombaton is megjelent volna tévesen. `footnotes`-ban `H` és `V` külön marad, a UI-nak compound annotációt kell kezelnie. |

### Visszafelé irány (Juhar utca ▸ Kádártai úti forduló) ✅ Hibátlan

---

## 15-ös busz (PDF: page 30–31)

### Odafelé irány (Kádártai úti forduló ▸ Haszkovó forduló)
| Típus | Óra | Volt | Lett |
|---|---|---|---|
| 🔧 weekend | 15h | `[15, 24]` | `[24]` |
| 🔧 weekend | 20h | `[20, 20]` | `[]` (törölve) |

### Visszafelé irány (Haszkovó forduló ▸ Kádártai úti forduló) ✅ Hibátlan

---

## 15A busz (PDF: page 32–33) ✅ Mindkét irány hibátlan — csak munkanapon közlekedik

---

## 18-as busz (PDF: page 36–37) ✅ Mindkét irány hibátlan

---

## 20-as busz (PDF: page 38–39)

> Page 42–43 a **22-es buszhoz** tartozik — a parser tévesen a 20-asba keverte.

### Odafelé irány (Veszprém autóbusz-állomás ▸ Szabadságpuszta, Laci-major)
| Típus | Mit | Megjegyzés |
|---|---|---|
| 🔧 schoolholiday | `{14,15,16,19:55}` → page 38 alapján: `{5:35, 6:20/45, 7:45, 10:55, 13:55}` | Page 42 (bus 22) adatai kerültek ide tévesen |
| 🔧 weekend | `{10,16,19:55}` → `{5:35, 7:55, 13:55}` | Page 42 (bus 22) adatai kerültek ide tévesen |

### Visszafelé irány (Szabadságpuszta, Laci-major ▸ Veszprém autóbusz-állomás)
| Típus | Mit | Megjegyzés |
|---|---|---|
| 🔧 schoolholiday | `{5:10, 6:10/40, 7:10, 8:10}` → page 39 alapján: `{11:10, 14:15, 15:15, 16:10, 17:10, 20:10}` | Page 43 (bus 22) adatai kerültek ide tévesen |
| 🔧 weekend 15h | `[15, 15]` → `[]` (törölve) | Garble |

---

## 21-es busz (PDF: page 40–41) ✅ Mindkét irány hibátlan

---

## 22-es busz (PDF: page 42–43)

### Odafelé irány
| Típus | Mit |
|---|---|
| 🔧 schoolholiday | Hiányzott — hozzáadva (= workday) |

### Visszafelé irány
| Típus | Mit |
|---|---|
| 🔧 schoolholiday | Hiányzott — hozzáadva (= workday) |

---

## Összesített statisztika (minden vonal vizsgálva)

| Vonal | Odafelé | Visszafelé |
|---|---|---|
| 1 | ✅ | 🔧 2 javítás |
| 2 | 🔧 1 megálló hozzáadva | 🔧 3 javítás (vágási pont + indulások) |
| 3 | 🔧 4 javítás | 🔧 2 javítás |
| 4 | 🔧 teljes csere | ➕ új irány, 🔧 koordináta javítás |
| 4A | 🔧 workday csere, ⚠️ tanszünet/hétvége | ✅ |
| 5 | 🔧 4 javítás | ✅ |
| 6 | 🔧 7 javítás | 🔧 1 javítás |
| 7 | ✅ | 🔧 6 javítás |
| 7A | 🔧 4 javítás | ✅ |
| 8 | 🔧 (A) indulások kiemelve | ✅ |
| 8A | ➕ új kifelé irány | ✅ |
| 8Y | ✅ | — |
| 10 | 🔧 1 javítás | ✅ |
| 11 | ✅ | ✅ |
| 12 | ✅ | — (körjárat) |
| 13 | 🔧 hétvégi annotáció javítva (H→Hv) | ✅ |
| 15 | 🔧 2 javítás | ✅ |
| 15A | ✅ | ✅ |
| 16 | ✅ | ✅ |
| 18 | ✅ | ✅ |
| 20 | 🔧 schoolholiday + weekend (bus 22 adat keveredett) | 🔧 schoolholiday (bus 22 adat) + 15h garble |
| 21 | ✅ | ✅ |
| 22 | 🔧 schoolholiday hiányzott | 🔧 schoolholiday hiányzott |
| 23 | ⚠️ TODO: 23U és 24 szétbontás szükséges | ⚠️ TODO: 23U és 24 szétbontás szükséges |
| 23U | ➕ hiányzik — létrehozandó | ➕ hiányzik — létrehozandó |
| 24 | ➕ hiányzik — létrehozandó | ➕ hiányzik — létrehozandó |
| 25 | ✅ | — |
| 28 | ✅ | 🔧 schoolholiday 6h hiányzott + weekend garble törölve |
| 42 | ✅ | — (körjárat) |
| 43 | ✅ | — |
| 47 | ✅ | — |
