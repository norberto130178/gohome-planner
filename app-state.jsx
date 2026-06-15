/* ============================================================
   Shared App State — useAppState() hook
   Közös állapot a V1 és V2 UI-hoz
   ============================================================ */

const { useState, useEffect, useMemo } = React;

// ── DestinationPickerWidget — önálló, stabil komponens ──────────────
// Azért van a hook-on kívül definiálva, hogy ne mountolódjon újra
// minden hook re-rendernél (ami az input fókuszt elvesztette volna).
function DestinationPickerWidget({ stops, linesMap, value, onSelect, onClear, lang, isMobile, query: controlledQuery, onQueryChange }) {
  const [internalQuery, setInternalQuery] = React.useState("");
  const query = onQueryChange !== undefined ? controlledQuery : internalQuery;
  const setQuery = onQueryChange !== undefined ? onQueryChange : setInternalQuery;
  const [open, setOpen] = React.useState(false);
  const wrapRef = React.useRef(null);
  const labelColor = '#6A5F7C';

  React.useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const normalize = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const filtered = query ? stops.filter(s => normalize(s).includes(normalize(query))) : stops;

  return (
    <div ref={wrapRef} style={{display:"flex",alignItems:"center",gap:8}}>
      <span style={{fontSize:isMobile?10:12,fontWeight:800,color:labelColor,letterSpacing:'0.1em',textTransform:'uppercase',marginRight:4}}>
        🏠{!isMobile && <> {lang==="hu"?"Célállomás":"Destination"}:</>}
      </span>
      <div className="stop-picker-input-wrap">
        {value ? (
          <button onClick={onClear}
            style={{cursor:'pointer',fontSize:13,fontWeight:800,background:'#FF6E9C',color:'#fff',padding:'5px 14px',borderRadius:10,border:'none',fontFamily:'inherit',whiteSpace:'nowrap'}}>
            📍 {value} ✕
          </button>
        ) : (
          <input type="text" className="stop-picker-input"
            placeholder={lang==="hu"?"Megálló keresése...":"Search stop..."}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
          />
        )}
        {open && !value && filtered.length > 0 && (
          <div className="stop-picker-dropdown" onMouseDown={(e) => e.preventDefault()}>
            {filtered.map(stop => (
              <div key={stop} className="stop-picker-option"
                onClick={() => { onSelect(stop); setQuery(""); setOpen(false); }}
                style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8}}>
                <span style={{flex:1}}>{stop}</span>
                <span style={{display:"flex",gap:3,flexWrap:"wrap",justifyContent:"flex-end"}}>
                  {(linesMap[stop]||[]).slice(0,5).map(b => (
                    <span key={b.id} style={{background:b.color,color:"white",borderRadius:6,padding:"1px 6px",fontSize:11,fontWeight:800,lineHeight:"16px"}}>{b.id}</span>
                  ))}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
window.DestinationPickerWidget = DestinationPickerWidget;

function useAppState(options = {}) {
  // --- Smart defaults az aktuális idő alapján ---
  const initNow = new Date();
  const initHour = initNow.getHours();
  const initMin = initNow.getMinutes();
  const initMins = initHour * 60 + initMin;

  let initDirection, initMode, initCustomTime, initDayOffset;
  const initDayOfWeek = initNow.getDay(); // 0=vas, 6=szo
  const isWeekend = initDayOfWeek === 0 || initDayOfWeek === 6;

  if (isWeekend) {
    if (initDayOfWeek === 0 && initMins >= 17 * 60) {
      // Vasárnap este 5 után → holnap reggel, iskola irány
      initDirection = "school";
      initMode = "custom";
      initCustomTime = "06:20";
      initDayOffset = 1;
    } else {
      // Hétvégén (szombat, vagy vasárnap 17:00 előtt) mindig "most" módban, iskola irány
      initDirection = "school";
      initMode = "now";
      initCustomTime = "06:30";
      initDayOffset = 0;
    }
  } else if (initMins >= 17 * 60) {
    // Hétköznap este 5 után → holnap, iskola irány, 06:20-tól
    initDirection = "school";
    initMode = "custom";
    initCustomTime = "06:20";
    initDayOffset = 1;
  } else if (initMins >= 12 * 60) {
    // Hétköznap dél után → haza irány, 14:00-tól
    initDirection = "home";
    initMode = "custom";
    initCustomTime = "14:00";
    initDayOffset = 0;
  } else {
    // Hétköznap délelőtt → iskola irány, most
    initDirection = "school";
    initMode = "now";
    initCustomTime = "06:30";
    initDayOffset = 0;
  }

  const [lang, setLang] = useState("hu");
  const [compactMode, setCompactMode] = useState(() => localStorage.getItem("hazaut.compact") === "1");
  const [mode, setMode] = useState(initMode);
  const [customTime, setCustomTime] = useState(initCustomTime);
  const [dayOffset, setDayOffset] = useState(initDayOffset);
  const [missed, setMissed] = useState(0);
  const [tick, setTick] = useState(0);
  const [direction, setDirection] = useState(initDirection);
  const [schoolFilter, setSchoolFilter] = useState(true);
  const [schoolHoliday, setSchoolHoliday] = useState(() => localStorage.getItem("hazaut.schoolholiday") === "1");
  const [homeStop, setHomeStop] = useState(null);
  const [homeStopQuery, setHomeStopQuery] = useState("");
  const [settingsKey, setSettingsKey] = useState(0);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640);

  // --- localStorage load ---
  useEffect(() => {
    const saved = localStorage.getItem("hazaut.lang");
    if (saved) setLang(saved);
  }, []);

  // --- localStorage save ---
  useEffect(() => { localStorage.setItem("hazaut.lang", lang); }, [lang]);
  useEffect(() => { localStorage.setItem("hazaut.compact", compactMode ? "1" : "0"); }, [compactMode]);
  useEffect(() => { localStorage.setItem("hazaut.direction", direction); }, [direction]);
  useEffect(() => { localStorage.setItem("hazaut.schoolholiday", schoolHoliday ? "1" : "0"); }, [schoolHoliday]);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // --- Dynamic <html lang> ---
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);

  // --- 15s ticker ---
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 15000);
    return () => clearInterval(id);
  }, []);

  // --- `now` computation ---
  const now = useMemo(() => {
    const base = new Date();
    if (mode === "custom") {
      base.setDate(base.getDate() + dayOffset);
      const [h, m] = customTime.split(":").map(Number);
      base.setHours(h, m, 0, 0);
    }
    base.setMinutes(base.getMinutes() + missed);
    return base;
  }, [mode, customTime, missed, tick, dayOffset]);

  // --- Settings beolvasása (újraszámítódik ha settingsKey változik) ---
  const schoolData = useMemo(() => {
    const id = localStorage.getItem('selectedSchool') || '';
    return (window.SCHOOLS || []).find(s => s.id === id) || null;
  }, [settingsKey]);

  const settingsHomeStop = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('homeStop') || 'null'); } catch { return null; }
  }, [settingsKey]);

  // --- Route planning ---
  const routes = useMemo(() => {
    if (!settingsHomeStop || !schoolData) {
      return Object.assign([], { notConfigured: true });
    }

    const homeStopName = settingsHomeStop.name;
    const nearestStop = schoolData.nearbyStops?.[0];
    const schoolWalkMins = nearestStop ? Math.ceil(nearestStop.dist / 80) : 0;

    if (direction === "school") {
      if (schoolData.helykoziOnly) {
        return window.planSchoolRoutes({
          now, walkMin: 0, maxResults: 6,
          schoolStartMin: schoolFilter ? 10 * 60 : null,
          schoolHoliday,
          fromStop: homeStopName,
          walkToSchool: schoolWalkMins,
          walkToSchoolDist: nearestStop?.dist,
        });
      }
      if (!nearestStop) return [];
      const cityRoutes = window.planCityRoutes({
        now, walkMin: 0, maxResults: 6,
        fromStop: homeStopName,
        toStop: nearestStop.name,
        schoolHoliday,
      });
      cityRoutes.forEach(r => {
        r.departLeaveHome = r.departLeaveOrigin;
        r.walkToSchool = schoolWalkMins;
        r.walkToSchoolDist = nearestStop.dist;
        r.arriveSchool = r.arriveAt + schoolWalkMins;
        r.nearestStopName = nearestStop.name;
        r.homeStopName = homeStopName;
      });
      // Ha az átszálló megálló már 400m-en belül van az iskolától, a 2. busz felesleges —
      // egyszerűsítjük 1 buszossá, az átszálló megállónál szállunk le és gyalog megyünk
      const nearbyMap = new Map((schoolData.nearbyStops || []).map(s => [s.name, s]));
      const directRoutes = [];
      const bestConverted = new Map();
      for (const r of cityRoutes) {
        if (r.type !== "transfer") { directRoutes.push(r); continue; }
        const nearbyTs = nearbyMap.get(r.transferStopName);
        if (!nearbyTs) { directRoutes.push(r); continue; }
        const walk = Math.ceil(nearbyTs.dist / 80);
        const key = `${r.bus1.id}|${r.bus1.direction}|${r.boardAt}`;
        const candidate = { ...r, type: "direct", arriveAt: r.arriveAtTransfer,
          arriveSchool: r.arriveAtTransfer + walk, walkToSchool: walk,
          walkToSchoolDist: nearbyTs.dist, nearestStopName: r.transferStopName,
          totalDuration: r.arriveAtTransfer + walk - r.departLeaveHome };
        const existing = bestConverted.get(key);
        if (!existing || candidate.arriveSchool < existing.arriveSchool)
          bestConverted.set(key, candidate);
      }
      const seenDirect = new Set(directRoutes.map(r => `${r.bus1.id}|${r.bus1.direction}|${r.boardAt}`));
      return [...directRoutes, ...[...bestConverted.values()].filter(r => !seenDirect.has(`${r.bus1.id}|${r.bus1.direction}|${r.boardAt}`))]
        .sort((a, b) => (a.arriveSchool ?? a.arriveAt) - (b.arriveSchool ?? b.arriveAt));
    }

    // home direction
    if (schoolData.helykoziOnly) {
      const homeRoutes = window.planRoutes({
        now, walkMin: schoolWalkMins, maxResults: 6,
        homeStop: homeStopName, schoolHoliday,
      });
      homeRoutes.forEach(r => {
        r.walkToSchool = schoolWalkMins;
        r.walkToSchoolDist = nearestStop?.dist;
      });
      return homeRoutes;
    }
    if (!nearestStop) return [];
    const cityRoutes = window.planCityRoutes({
      now, walkMin: schoolWalkMins, maxResults: 6,
      fromStop: nearestStop.name,
      toStop: homeStopName,
      schoolHoliday,
    });
    cityRoutes.forEach(r => {
      r.departLeaveHome = r.departLeaveOrigin;
      r.homeStopName = homeStopName;
    });
    return cityRoutes;
  }, [now, direction, schoolFilter, schoolHoliday, settingsKey, settingsHomeStop, schoolData]);

  const t = window.I18N[lang];

  // --- Mode helpers ---
  const goToNow = () => { setMode("now"); setDayOffset(0); setMissed(0); };
  const goToCustom = (overrides = {}) => {
    setMode("custom");
    setMissed(0);
    if (overrides.dayOffset !== undefined) setDayOffset(overrides.dayOffset);
    if (overrides.customTime !== undefined) setCustomTime(overrides.customTime);
  };

  // --- State object & dispatcher ---
  const state = { now, mode, customTime, missed, lang, routes, dayOffset, direction, schoolFilter, schoolHoliday, homeStop, compactMode, isMobile, schoolData, settingsHomeStop };
  state.setSchoolFilter = setSchoolFilter;
  const toggleCompact = () => setCompactMode(c => !c);
  const toggleSchoolHoliday = () => setSchoolHoliday(v => !v);
  state.toggleCompact = toggleCompact;
  state.toggleSchoolHoliday = toggleSchoolHoliday;
  state.setHomeStop = setHomeStop;
  state.refreshSettings = () => setSettingsKey(k => k + 1);

  const setState = (s) => {
    if (s.mode !== undefined && s.mode !== mode) {
      if (s.mode === "now") { goToNow(); return; }
      if (s.mode === "custom") { goToCustom(); return; }
    }
    if (s.dayOffset !== undefined && s.dayOffset !== dayOffset) {
      if (s.dayOffset !== 0) { goToCustom({ dayOffset: s.dayOffset }); return; }
      goToNow(); return;
    }
    if (s.customTime !== undefined && s.customTime !== customTime) {
      if (mode === "now") goToCustom({ customTime: s.customTime });
      else setCustomTime(s.customTime);
      return;
    }
    if (s.missed !== undefined && s.missed !== missed) { setMissed(s.missed); return; }
    if (s.direction !== undefined && s.direction !== direction) {
      setDirection(s.direction);
      if (s.direction === "school") setCustomTime("06:30");
      else setCustomTime("13:30");
      return;
    }
    if (s.lang !== undefined && s.lang !== lang) { setLang(s.lang); return; }
    if (s.schoolFilter !== undefined && s.schoolFilter !== schoolFilter) { setSchoolFilter(s.schoolFilter); return; }
  };

  // --- Day picker ---
  const dayNames = { hu:["Vas","Hét","Kedd","Sze","Csüt","Pén","Szo"], en:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"] };
  const dayPickerOptions = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(); d.setDate(d.getDate() + i);
    const label = i===0 ? (lang==="hu"?"Ma":"Today") : i===1 ? (lang==="hu"?"Holnap":"Tom.") : dayNames[lang][d.getDay()];
    dayPickerOptions.push({ offset: i, label, date: d });
  }
  const activeDayOffset = mode === "now" ? 0 : dayOffset;

  // --- Stop data for DestinationPickerWidget ---
  const stopPickerAllStops = useMemo(() => {
    const buses = window.CITY_BUSES_FULL || [];
    const transferNames = new Set([
      "Komakút tér / Pannon Egyetem",
      "Petőfi Színház",
      "Veszprém, autóbusz-állomás",
    ]);
    const validSet = new Set();
    for (const bus of buses) {
      let afterTransfer = false;
      for (const stop of bus.stops) {
        if (transferNames.has(stop.name)) { afterTransfer = true; continue; }
        if (afterTransfer) validSet.add(stop.name);
      }
    }
    return Array.from(validSet).sort((a, b) => a.localeCompare(b, 'hu'));
  }, []);

  const stopLinesMap = useMemo(() => {
    const map = {};
    for (const bus of window.CITY_BUSES_FULL || []) {
      for (const s of bus.stops) {
        if (!map[s.name]) map[s.name] = [];
        if (!map[s.name].some(b => b.id === bus.id))
          map[s.name].push({ id: bus.id, color: bus.color });
      }
    }
    return map;
  }, []);

  state.stopPickerAllStops = stopPickerAllStops;
  state.stopLinesMap = stopLinesMap;
  state.dayPickerOptions = dayPickerOptions;
  state.activeDayOffset = activeDayOffset;
  state.homeStopPicker = {
    stops: stopPickerAllStops,
    linesMap: stopLinesMap,
    value: homeStop,
    onSelect: (stop) => { setHomeStop(stop); setHomeStopQuery(""); },
    onClear: () => { setHomeStop(null); setHomeStopQuery(""); },
    query: homeStopQuery,
    onQueryChange: setHomeStopQuery,
  };

  // --- Shared sub-components ---
  state.TransferPicker = (props) => {
    return (
      <div style={{display:'flex',flexDirection:isMobile?'column':'row',gap:isMobile?8:16,alignItems:isMobile?'flex-start':'center',marginBottom:isMobile?0:12}}>
        <div style={{display:'flex',gap:6,flexWrap:'wrap',alignItems:'center',flex:isMobile?undefined:1,minWidth:isMobile?undefined:0}}>
        {direction === "school" && (
          <div
            style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}}
            onClick={() => setSchoolFilter(f => !f)}
            data-tooltip={lang==="hu" ? "Csak 10:00 előtt érkező járatok" : "Only buses arriving before 10:00"}
          >
            <span style={{fontSize:13,fontWeight:700,userSelect:"none"}}>
              🎒 {lang==="hu" ? "Reggeli szűrő" : "Morning filter"}
            </span>
            <div style={{
              width:42, height:24, borderRadius:12, flexShrink:0,
              background: schoolFilter ? "var(--accent)" : "var(--line)",
              position:"relative", transition:"background 0.2s",
            }}>
              <div style={{
                position:"absolute",
                top:3, left: schoolFilter ? 21 : 3,
                width:18, height:18, borderRadius:"50%",
                background:"white",
                boxShadow:"0 1px 4px rgba(0,0,0,0.25)",
                transition:"left 0.2s",
              }} />
            </div>
          </div>
        )}
        {direction === "home" && (
          <window.DestinationPickerWidget
            stops={stopPickerAllStops}
            linesMap={stopLinesMap}
            value={homeStop}
            onSelect={(stop) => { setHomeStop(stop); setHomeStopQuery(""); }}
            onClear={() => { setHomeStop(null); setHomeStopQuery(""); }}
            query={homeStopQuery}
            onQueryChange={setHomeStopQuery}
            lang={lang}
            isMobile={isMobile}
          />
        )}
        <div
            style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}}
            onClick={toggleSchoolHoliday}
            data-tooltip={lang==="hu" ? "Tanszüneti menetrend (nyár, szünetek)" : "School holiday timetable (summer, breaks)"}
          >
            <span style={{fontSize:13,fontWeight:700,userSelect:"none"}}>
              {lang==="hu" ? "🏖️ Tanszünet" : "🏖️ School holiday"}
            </span>
            <div style={{
              width:42, height:24, borderRadius:12, flexShrink:0,
              background: schoolHoliday ? "var(--accent)" : "var(--line)",
              position:"relative", transition:"background 0.2s",
            }}>
              <div style={{
                position:"absolute",
                top:3, left: schoolHoliday ? 21 : 3,
                width:18, height:18, borderRadius:"50%",
                background:"white",
                boxShadow:"0 1px 4px rgba(0,0,0,0.25)",
                transition:"left 0.2s",
              }} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  state.DirectionPicker = (props) => {
    const labelColor = (props && props.labelColor) || '#6A5F7C';
    return (
      <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:isMobile?0:12,alignItems:'center'}}>
        <span style={{fontSize:isMobile?10:12,fontWeight:800,color:labelColor,letterSpacing:'0.1em',textTransform:'uppercase',marginRight:4}}>
          🧭{!isMobile && <> {lang==="hu"?"Irány":"Direction"}:</>}
        </span>
        <button onClick={() => setState({ ...state, direction: "school" })}
          className={`tweaks-pill ${direction==="school"?'active':''}`}
          aria-pressed={direction==="school"}
          aria-label={t.directionSchool}
          data-tooltip={lang==="hu" ? "Iskolába menetel" : "Going to school"}
          {...(props && props.pillStyle && direction!=="school" ? {style: props.pillStyle} : {})}
          {...(props && props.pillActiveStyle && direction==="school" ? {style: props.pillActiveStyle} : {})}>
          {t.directionSchool}
        </button>
        <button onClick={() => setState({ ...state, direction: "home" })}
          className={`tweaks-pill ${direction==="home"?'active':''}`}
          aria-pressed={direction==="home"}
          aria-label={t.directionHome}
          data-tooltip={lang==="hu" ? "Hazafelé menetel" : "Going home"}
          {...(props && props.pillStyle && direction!=="home" ? {style: props.pillStyle} : {})}
          {...(props && props.pillActiveStyle && direction==="home" ? {style: props.pillActiveStyle} : {})}>
          {t.directionHome}
        </button>
      </div>
    );
  };

  state.DayPicker = (props) => {
    const labelColor = (props && props.labelColor) || '#6A5F7C';
    if (compactMode || isMobile) {
      return (
        <div style={{display:'flex',gap:6,alignItems:'center',marginBottom:isMobile?0:12}}>
          <span style={{fontSize:10,fontWeight:800,color:labelColor,letterSpacing:'0.1em',textTransform:'uppercase',marginRight:4}}>
            📅{!isMobile && <> {lang==="hu"?"Nap":"Day"}:</>}
          </span>
          <select
            value={activeDayOffset}
            onChange={e => setState({ ...state, dayOffset: Number(e.target.value) })}
            data-tooltip={lang==="hu" ? "Nap kiválasztása" : "Select day"}
            style={{fontFamily:'inherit',fontSize:12,fontWeight:700,padding:'6px 10px',borderRadius:10,border:'none',background:'var(--line)',color:'var(--ink)',cursor:'pointer',appearance:'none',WebkitAppearance:'none',MozAppearance:'none'}}
          >
            {dayPickerOptions.map(o => (
              <option key={o.offset} value={o.offset}>
                {o.label} — {o.date.toLocaleDateString(lang==="hu"?"hu-HU":"en-US")}
              </option>
            ))}
          </select>
        </div>
      );
    }
    return (
      <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:isMobile?0:12,alignItems:'center'}}>
        <span style={{fontSize:isMobile?10:12,fontWeight:800,color:labelColor,letterSpacing:'0.1em',textTransform:'uppercase',marginRight:4}}>
          📅{!isMobile && <> {lang==="hu"?"Nap":"Day"}:</>}
        </span>
        {dayPickerOptions.map((o) => (
          <button key={o.offset} onClick={() => setState({ ...state, dayOffset: o.offset })}
            className={`tweaks-pill ${activeDayOffset===o.offset?'active':''}`}
            aria-current={activeDayOffset===o.offset ? "date" : undefined}
            aria-label={`${o.label} — ${o.date.toLocaleDateString(lang==="hu"?"hu-HU":"en-US")}`}
            data-tooltip={o.date.toLocaleDateString(lang==="hu"?"hu-HU":"en-US")}
            {...(props && props.pillStyle && activeDayOffset!==o.offset ? {style: props.pillStyle} : {})}
            {...(props && props.pillActiveStyle && activeDayOffset===o.offset ? {style: props.pillActiveStyle} : {})}
            >{o.label}</button>
        ))}
      </div>
    );
  };

  state.StopPicker = () => null;

  return { state, setState, t, setLang };
}

window.useAppState = useAppState;
