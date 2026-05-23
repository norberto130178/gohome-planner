/* ============================================================
   Shared App State — useAppState() hook
   Közös állapot a V1 és V2 UI-hoz
   ============================================================ */

const { useState, useEffect, useMemo } = React;

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
  const [allowedTransfers, setAllowedTransfers] = useState(["komakut","szinhaz","buszall"]);
  const [allowedTransfersSchool, setAllowedTransfersSchool] = useState(["komakut","buszall","szinhaz_walk"]);
  const [schoolFilter, setSchoolFilter] = useState(true);  // true = csak 10:00 előtt érkező járatok
  const [homeStop, setHomeStop] = useState(null);          // custom leszállási megálló (null = Csererdő)
  const [stopPickerOpen, setStopPickerOpen] = useState(false);
  const [stopPickerQuery, setStopPickerQuery] = useState("");

  // --- localStorage load ---
  useEffect(() => {
    const saved = localStorage.getItem("hazaut.lang");
    if (saved) setLang(saved);
    const savedT = localStorage.getItem("hazaut.transfers");
    if (savedT) { try { const p = JSON.parse(savedT); if (Array.isArray(p) && p.length) setAllowedTransfers(p); } catch(e){} }
    const savedTS = localStorage.getItem("hazaut.transfersSchool");
    if (savedTS) { try { const p = JSON.parse(savedTS); if (Array.isArray(p) && p.length) setAllowedTransfersSchool(p); } catch(e){} }
    // direction nem töltődik localStorage-ból — a smart default mindig az aktuális napszak alapján áll be
  }, []);

  // --- localStorage save ---
  useEffect(() => { localStorage.setItem("hazaut.lang", lang); }, [lang]);
  useEffect(() => { localStorage.setItem("hazaut.compact", compactMode ? "1" : "0"); }, [compactMode]);
  useEffect(() => { localStorage.setItem("hazaut.transfers", JSON.stringify(allowedTransfers)); }, [allowedTransfers]);
  useEffect(() => { localStorage.setItem("hazaut.transfersSchool", JSON.stringify(allowedTransfersSchool)); }, [allowedTransfersSchool]);
  useEffect(() => { localStorage.setItem("hazaut.direction", direction); }, [direction]);

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

  // --- Route planning ---
  // walkMin: délután 10 perc (suliból a megállóig), reggel 0 (Csererdő megálló közel)
  const routes = useMemo(() => {
    if (direction === "school") {
      return window.planSchoolRoutes({
        now, walkMin: 0, minTransfer: 3, maxResults: 6,
        allowedTransfers: allowedTransfersSchool,
        schoolStartMin: schoolFilter ? 10 * 60 : null,
      });
    }
    return window.planRoutes({
      now, walkMin: 10, minTransfer: 5, maxResults: 6, allowedTransfers, homeStop,
    });
  }, [now, allowedTransfers, allowedTransfersSchool, direction, schoolFilter, homeStop]);

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
  const state = { now, mode, customTime, missed, lang, routes, dayOffset, direction, schoolFilter, homeStop, compactMode };
  const toggleCompact = () => setCompactMode(c => !c);
  state.toggleCompact = toggleCompact;

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
      // Irányváltáskor a saját idő alapértéke is változik
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

  // --- Transfer toggle (direction-aware) ---
  const toggleTransfer = (id) => {
    if (direction === "school") {
      setAllowedTransfersSchool((prev) => {
        if (prev.includes(id)) {
          const next = prev.filter(x => x !== id);
          return next.length === 0 ? prev : next;
        }
        return [...prev, id];
      });
    } else {
      setAllowedTransfers((prev) => {
        if (prev.includes(id)) {
          const next = prev.filter(x => x !== id);
          return next.length === 0 ? prev : next;
        }
        return [...prev, id];
      });
    }
  };
  state.allowedTransfers = direction === "school" ? allowedTransfersSchool : allowedTransfers;
  state.toggleTransfer = toggleTransfer;

  // --- Transfer labels ---
  const TRANSFER_LABELS_HOME = {
    komakut: lang==="hu"?"Komak\u00fat t\u00e9r":"Komak\u00fat sq.",
    szinhaz: lang==="hu"?"Sz\u00ednh\u00e1z":"Theatre",
    buszall: lang==="hu"?"Aut\u00f3busz-\u00e1ll.":"Bus stn.",
  };
  const TRANSFER_LABELS_SCHOOL = {
    komakut: lang==="hu"?"Komak\u00fat t\u00e9r":"Komak\u00fat sq.",
    buszall: lang==="hu"?"Aut\u00f3busz-\u00e1ll.":"Bus stn.",
    szinhaz_walk: t.transferShinhaz,
  };
  const transferIds = direction === "school"
    ? ["komakut","buszall","szinhaz_walk"]
    : ["komakut","szinhaz","buszall"];
  const transferLabels = direction === "school" ? TRANSFER_LABELS_SCHOOL : TRANSFER_LABELS_HOME;
  const activeTransfers = direction === "school" ? allowedTransfersSchool : allowedTransfers;

  // --- Shared sub-components ---
  state.TransferPicker = (props) => {
    const labelColor = (props && props.labelColor) || '#6A5F7C';
    const wrapRef = React.useRef(null);
    React.useEffect(() => {
      const handler = (e) => {
        if (wrapRef.current && !wrapRef.current.contains(e.target)) setStopPickerOpen(false);
      };
      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }, []);
    const normalize = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
    const filtered = stopPickerQuery
      ? stopPickerAllStops.filter(s => normalize(s).includes(normalize(stopPickerQuery)))
      : stopPickerAllStops;
    return (
      <div ref={wrapRef} style={{display:'flex',gap:16,alignItems:'center',marginBottom:12}}>
        <div style={{display:'flex',gap:6,flexWrap:'wrap',alignItems:'center',flex:1,minWidth:0}}>
        <span style={{fontSize:12,fontWeight:800,color:labelColor,letterSpacing:'0.1em',textTransform:'uppercase',marginRight:4}}>
          🔄 {lang==="hu"?"\u00c1tsz\u00e1ll\u00e1s":"Transfer"}:
        </span>
        {transferIds.map((id) => (
          <button key={id} onClick={() => toggleTransfer(id)}
            className={`tweaks-pill ${activeTransfers.includes(id)?'active':''}`}
            aria-pressed={activeTransfers.includes(id)}
            aria-label={`${lang==="hu"?"Átszállás":"Transfer"}: ${transferLabels[id]}`}
            data-tooltip={activeTransfers.includes(id) ? (lang==="hu" ? "Kattints: kizár" : "Click: exclude") : (lang==="hu" ? "Kattints: bekapcsol" : "Click: enable")}
            {...(props && props.pillStyle && !activeTransfers.includes(id) ? {style: props.pillStyle} : {})}
            {...(props && props.pillActiveStyle && activeTransfers.includes(id) ? {style: props.pillActiveStyle} : {})}>
            {transferLabels[id]}
          </button>
        ))}
        {direction === "school" && (
          <div
            style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",marginLeft:4}}
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
        </div>
        {direction === "home" && (
          <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
            <span style={{fontSize:12,fontWeight:800,color:labelColor,letterSpacing:'0.1em',textTransform:'uppercase',marginRight:4}}>
              🏠 {lang==="hu"?"Célállomás":"Destination"}:
            </span>
            <div className="stop-picker-input-wrap">
              {homeStop ? (
                <button className="stop-picker-active-pill" onClick={() => setHomeStop(null)}
                  style={{cursor:'pointer',fontSize:13,fontWeight:800,background:'#FF6E9C',color:'#fff',padding:'5px 14px',borderRadius:10,border:'none',fontFamily:'inherit',whiteSpace:'nowrap'}}>
                  📍 {homeStop} ✕
                </button>
              ) : (
                <>
                  <input type="text" className="stop-picker-input"
                    placeholder={lang==="hu"?"Megálló keresése...":"Search stop..."}
                    value={stopPickerQuery}
                    onChange={(e) => { setStopPickerQuery(e.target.value); setStopPickerOpen(true); }}
                    onFocus={() => setStopPickerOpen(true)}
                  />
                </>
              )}
              {stopPickerOpen && !homeStop && filtered.length > 0 && (
                <div className="stop-picker-dropdown" onMouseDown={(e) => e.preventDefault()}>
                  {filtered.map(stop => (
                    <div key={stop} className="stop-picker-option"
                      onClick={() => { setHomeStop(stop); setStopPickerQuery(""); setStopPickerOpen(false); }}>
                      {stop}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  state.DirectionPicker = (props) => {
    const labelColor = (props && props.labelColor) || '#6A5F7C';
    return (
      <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:12,alignItems:'center'}}>
        <span style={{fontSize:12,fontWeight:800,color:labelColor,letterSpacing:'0.1em',textTransform:'uppercase',marginRight:4}}>
          🧭 {lang==="hu"?"Ir\u00e1ny":"Direction"}:
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
    if (compactMode) {
      return (
        <div style={{display:'flex',gap:6,alignItems:'center',marginBottom:12}}>
          <span style={{fontSize:12,fontWeight:800,color:labelColor,letterSpacing:'0.1em',textTransform:'uppercase',marginRight:4}}>
            📅 {lang==="hu"?"Nap":"Day"}:
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
      <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:12,alignItems:'center'}}>
        <span style={{fontSize:12,fontWeight:800,color:labelColor,letterSpacing:'0.1em',textTransform:'uppercase',marginRight:4}}>
          📅 {lang==="hu"?"Nap":"Day"}:
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

  // --- StopPicker (custom leszállási megálló) ---
  // FONTOS: open/query state a hook szintjén van (stopPickerOpen, stopPickerQuery)
  // hogy a 15s tick timer újrarenderelése ne resetje őket.
  const stopPickerAllStops = useMemo(() => {
    const buses = window.CITY_BUSES || [];
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

  state.StopPicker = (props) => {
    const wrapRef = React.useRef(null);

    React.useEffect(() => {
      const handler = (e) => {
        if (wrapRef.current && !wrapRef.current.contains(e.target)) setStopPickerOpen(false);
      };
      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }, []);

    if (direction !== "home") return null;

    const normalize = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const filtered = stopPickerQuery
      ? stopPickerAllStops.filter(s => normalize(s).includes(normalize(stopPickerQuery)))
      : stopPickerAllStops;

    const labelColor = (props && props.labelColor) || '#6A5F7C';

    return (
      <div ref={wrapRef} className="stop-picker" style={{marginBottom:12}}>
        <span style={{fontSize:12,fontWeight:800,color:labelColor,letterSpacing:'0.1em',textTransform:'uppercase',marginRight:4}}>
          🏠 {lang==="hu"?"Leszállás":"Get off at"}:
        </span>
        <div className="stop-picker-input-wrap">
          {homeStop ? (
            <button className="stop-picker-active-pill" onClick={() => setHomeStop(null)}
              style={{
                cursor:'pointer', fontSize: 13, fontWeight: 800,
                background: '#FF6E9C', color: '#fff',
                padding: '6px 14px', borderRadius: 10, border: 'none',
                fontFamily: 'inherit',
                ...(props && props.pillActiveStyle ? props.pillActiveStyle : {}),
              }}>
              📍 {homeStop} ✕
            </button>
          ) : (
            <>
              <input
                type="text"
                className="stop-picker-input"
                placeholder={lang==="hu"?"Megálló keresése...":"Search stop..."}
                value={stopPickerQuery}
                onChange={(e) => { setStopPickerQuery(e.target.value); setStopPickerOpen(true); }}
                onFocus={() => setStopPickerOpen(true)}
              />
              <span className="stop-picker-default">
                {lang==="hu"?"Csererdő (alap)":"Csererdő (default)"}
              </span>
            </>
          )}
          {stopPickerOpen && !homeStop && filtered.length > 0 && (
            <div className="stop-picker-dropdown"
              onMouseDown={(e) => e.preventDefault()}>
              {filtered.map(stop => (
                <div key={stop} className="stop-picker-option"
                  onClick={() => { setHomeStop(stop); setStopPickerQuery(""); setStopPickerOpen(false); }}>
                  {stop}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  state.StopPicker = () => null;

  return { state, setState, t, setLang };
}

window.useAppState = useAppState;
