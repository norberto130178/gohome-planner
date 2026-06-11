# GoHome Planner — Claude Code instrukciók

## Verziókezelés

**Minden commit előtt frissítsd az APP_VERSION-t az `index.html`-ben.**

A verzió formátuma: `"v2.X"` — a minor számot növeld eggyel minden commitnál.

```html
<!-- index.html elején, az első <script> blokkban: -->
window.APP_VERSION = "v3.1";
```

Ez egyetlen változtatás — a cache buster automatikusan ebből az értékből generálódik az összes JS fájlhoz. A `data.js`-ben nincs APP_VERSION, ne írd oda.

Ha commitot készítesz, ez az egyik első lépés legyen — ne hagyd ki.

## Git — commit és push

**SOHA ne commitolj és ne pusholj a felhasználó explicit kérése nélkül.**

Ez azt jelenti: ha a feladat kész, ne nyúlj a githez. Várj amíg a felhasználó azt mondja: „commitold" vagy „pushold". Addig csak a fájlok módosítása a dolgod.
