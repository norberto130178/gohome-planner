# GoHome Planner — Claude Code instrukciók

## Verziókezelés

**Minden commit előtt frissítsd az APP_VERSION-t a `data.js`-ben.**

A verzió formátuma: `"v2.X"` — a minor számot növeld eggyel minden commitnál.

```js
// data.js elején:
window.APP_VERSION = "v2.4";
```

Ha commitot készítesz, ez az egyik első lépés legyen — ne hagyd ki.

## Git — commit és push

**SOHA ne commitolj és ne pusholj a felhasználó explicit kérése nélkül.**

Ez azt jelenti: ha a feladat kész, ne nyúlj a githez. Várj amíg a felhasználó azt mondja: „commitold" vagy „pushold". Addig csak a fájlok módosítása a dolgod.
