# GoHome Planner — Claude Code instrukciók

## Verziókezelés

**Minden commit előtt frissítsd a verziószámot 3 helyen — mindig ugyanaz az érték legyen mindháromban:**

1. `index.html` — `window.APP_VERSION` és `styles.css?v=`
2. `city.html` — `window.APP_VERSION` és `styles.css?v=`
3. `sw.js` — `const CACHE = 'hazaut-vX.XX';`

A verzió formátuma: `"v2.X"` — a minor számot növeld eggyel minden commitnál.

```html
<!-- index.html és city.html elején, az első <script> blokkban: -->
<script>window.APP_VERSION = "v3.9";</script>
<link rel="stylesheet" href="styles.css?v=v3.9">
```

```js
// sw.js elején:
const CACHE = 'hazaut-v3.9';
```

Ez cache-bust-olja az összes JS fájlt ÉS a styles.css-t is. A sw.js CACHE neve nélkül a telefon nem frissíti a cache-t deploy után. A `data.js`-ben nincs APP_VERSION, ne írd oda.

Ha commitot készítesz, ez az egyik első lépés legyen — ne hagyd ki.

## Git — commit és push

**SOHA ne commitolj és ne pusholj a felhasználó explicit kérése nélkül.**

Ez azt jelenti: ha a feladat kész, ne nyúlj a githez. Várj amíg a felhasználó azt mondja: „commitold" vagy „pushold". Addig csak a fájlok módosítása a dolgod.
