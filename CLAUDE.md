# GoHome Planner — Claude Code instrukciók

## Verziókezelés

**Minden commit előtt frissítsd az APP_VERSION-t az `index.html`-ben ÉS `city.html`-ben — mindig ugyanaz az érték legyen mindkettőben.**

A verzió formátuma: `"v2.X"` — a minor számot növeld eggyel minden commitnál.

```html
<!-- index.html és city.html elején, az első <script> blokkban: -->
<script>window.APP_VERSION = "v3.9";</script>
<link rel="stylesheet" href="styles.css?v=v3.9">
```

Ez cache-bust-olja az összes JS fájlt ÉS a styles.css-t is. A `data.js`-ben nincs APP_VERSION, ne írd oda.

Ha commitot készítesz, ez az egyik első lépés legyen — ne hagyd ki.

## Git — commit és push

**SOHA ne commitolj és ne pusholj a felhasználó explicit kérése nélkül.**

Ez azt jelenti: ha a feladat kész, ne nyúlj a githez. Várj amíg a felhasználó azt mondja: „commitold" vagy „pushold". Addig csak a fájlok módosítása a dolgod.
