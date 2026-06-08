const STOP_LINES = (() => {
  const map = {};
  for (const bus of window.CITY_BUSES_FULL) {
    for (const s of bus.stops) {
      if (!map[s.name]) map[s.name] = [];
      if (!map[s.name].some(b => b.id === bus.id))
        map[s.name].push({ id: bus.id, color: bus.color });
    }
  }
  return map;
})();

const ALL_STOPS = window.getCityStops();

// ── TimetableDropdown ────────────────────────────────────────────────
function TimetableDropdown({ onSelect }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  const buses = [...new Map((window.CITY_BUSES_FULL||[]).map(b=>[b.id,b])).values()];

  React.useEffect(() => {
    if (!open) return;
    function outside(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", outside);
    return () => document.removeEventListener("mousedown", outside);
  }, [open]);

  return (
    <div ref={ref} style={{ position:"relative", display:"inline-block", marginTop:10 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display:"inline-flex", alignItems:"center", gap:6,
          background:"var(--line)", color:"var(--ink)", border:"none",
          borderRadius:10, padding:"7px 14px", cursor:"pointer",
          fontFamily:"Nunito,sans-serif", fontSize:13, fontWeight:800,
        }}
      >
        🗓 Menetrendek {open ? "▲" : "▼"}
      </button>
      {open && (
        <div style={{
          position:"absolute", top:"calc(100% + 6px)", left:0,
          background:"white", borderRadius:14, padding:"12px 14px",
          boxShadow:"0 8px 28px rgba(0,0,0,0.15)", border:"2px solid var(--line)",
          display:"flex", gap:8, flexWrap:"wrap", zIndex:500, minWidth:220,
        }}>
          {buses.map(b => (
            <button key={b.id}
              title={b.label}
              onClick={() => { onSelect(b.id); setOpen(false); }}
              style={{
                width:40, height:40, borderRadius:"50%",
                background:b.color, color:"white", border:"none",
                cursor:"pointer", fontFamily:"Nunito,sans-serif",
                fontSize:14, fontWeight:900,
                display:"flex", alignItems:"center", justifyContent:"center",
                boxShadow:"0 2px 6px rgba(0,0,0,0.15)",
              }}
            >{b.id}</button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── StopSearch ───────────────────────────────────────────────────────
function StopSearch({ value, onChange, placeholder, id }) {
  const [query, setQuery] = React.useState(value || "");
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => { setQuery(value || ""); }, [value]);

  React.useEffect(() => {
    function outside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", outside);
    return () => document.removeEventListener("mousedown", outside);
  }, []);

  const filtered = React.useMemo(() => {
    if (!query) return ALL_STOPS;
    const norm = str => str.normalize("NFD").replace(/[̀-ͯ]/g, "");
    const queryWords = norm(query.toLowerCase().trim()).split(/\s+/);
    return ALL_STOPS.filter(s => {
      const stopWords = norm(s.toLowerCase()).split(/[\s/\-,()+]+/).filter(Boolean);
      return queryWords.every(qw => stopWords.some(sw => sw.startsWith(qw)));
    });
  }, [query]);

  function select(stop) {
    onChange(stop);
    setQuery(stop);
    setOpen(false);
  }

  function handleChange(e) {
    setQuery(e.target.value);
    setOpen(true);
    if (!e.target.value) onChange("");
  }

  function handleBlur() {
    setTimeout(() => {
      setOpen(false);
      setQuery(value || "");
    }, 200);
  }

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <input
        id={id}
        type="text"
        value={query}
        onChange={handleChange}
        onFocus={() => setOpen(true)}
        onBlur={handleBlur}
        placeholder={placeholder}
        autoComplete="off"
        className="v1-time-input"
        style={{ width: "100%", fontSize: 14, paddingRight: query ? 32 : undefined }}
      />
      {query && (
        <button
          onMouseDown={e => e.preventDefault()}
          onClick={() => { setQuery(""); onChange(""); setOpen(true); }}
          style={{
            position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
            background: "none", border: "none", cursor: "pointer",
            fontSize: 18, color: "var(--ink-soft)", padding: "2px 4px", lineHeight: 1,
          }}
        >×</button>
      )}
      {open && filtered.length > 0 && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
          zIndex: 200, background: "white", border: "2px solid var(--line)",
          borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          maxHeight: 280, overflowY: "auto"
        }}>
          {filtered.map(stop => (
            <div
              key={stop}
              className="stop-option"
              onMouseDown={e => e.preventDefault()}
              onClick={() => select(stop)}
              style={{
                padding: "9px 14px", cursor: "pointer",
                borderBottom: "1px solid var(--line)",
                display: "flex", alignItems: "center", gap: 8,
                fontSize: 13, fontWeight: 700
              }}
            >
              <span style={{ flex: 1 }}>{stop}</span>
              <span style={{ display: "flex", gap: 3, flexWrap: "wrap", justifyContent: "flex-end" }}>
                {(STOP_LINES[stop] || []).slice(0, 5).map(b => (
                  <span key={b.id} style={{
                    background: b.color, color: "white", borderRadius: 6,
                    padding: "1px 6px", fontSize: 11, fontWeight: 800,
                    lineHeight: "16px"
                  }}>{b.id}</span>
                ))}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── CityRouteCard ────────────────────────────────────────────────────
// Kiválasztja a helyes GTFS shape-et és kiszeli a fromStop–toStop szakaszt
// A szelet elejére/végére a tényleges megálló koordinátát illeszti (nincs túllövés)
function getShapeSegment(bus, fromStopName, toStopName) {
  const shapes = (window.CITY_SHAPES || {})[bus.id];
  if (!shapes) return null;

  const fromStop = bus.stops.find(s => s.name === fromStopName);
  const toStop   = bus.stops.find(s => s.name === toStopName);
  if (!fromStop?.lat || !toStop?.lat) return null;

  const best = window.BUS_UTILS.bestShape(shapes, fromStop.lat, fromStop.lon, toStop.lat, toStop.lon);
  if (!best) return null;

  // Szelet: megálló koordináta + belső pontok + megálló koordináta
  const inner = best.s.slice(best.fi + 1, best.ti);
  return [
    [fromStop.lat, fromStop.lon],
    ...inner,
    [toStop.lat, toStop.lon],
  ];
}

function CityRouteMap({ route, fromStop, toStop }) {
  const mapRef = React.useRef(null);
  const instanceRef = React.useRef(null);
  const routeKey = `${route.type}-${route.bus1?.id}-${route.boardAt}-${fromStop}-${toStop}`;

  React.useEffect(() => {
    if (!mapRef.current) return;
    if (instanceRef.current) { instanceRef.current.remove(); instanceRef.current = null; }

    const map = L.map(mapRef.current, { zoomControl: true });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(map);

    const allCoords = [];

    function drawSegment(bus, from, to, color) {
      const seg = getShapeSegment(bus, from, to);
      if (seg && seg.length >= 2) {
        L.polyline(seg, { color, weight: 5, opacity: 0.9 }).addTo(map);
        allCoords.push(...seg);
        return { first: seg[0], last: seg[seg.length - 1] };
      } else {
        const stops = bus.stops;
        const fi = stops.findIndex(s => s.name === from);
        const ti = stops.findIndex(s => s.name === to);
        if (fi >= 0 && ti > fi) {
          const coords = stops.slice(fi, ti + 1).filter(s => s.lat).map(s => [s.lat, s.lon]);
          L.polyline(coords, { color, weight: 4, opacity: 0.7, dashArray: '6,4' }).addTo(map);
          allCoords.push(...coords);
          return coords.length >= 2 ? { first: coords[0], last: coords[coords.length - 1] } : null;
        }
        return null;
      }
    }

    function addMarker(pos, name, label, color) {
      if (!pos) return;
      L.circleMarker(pos, {
        radius: 8, color: 'white', weight: 2.5,
        fillColor: color, fillOpacity: 1,
      }).addTo(map).bindPopup(`<b>${label}</b><br>${name}`);
    }

    if (route.type === 'direct') {
      const seg = drawSegment(route.bus1, fromStop, toStop, route.bus1.color);
      addMarker(seg?.first, fromStop, 'Felszállás', route.bus1.color);
      addMarker(seg?.last,  toStop,   'Célállomás', route.bus1.color);
    } else {
      const seg1 = drawSegment(route.bus1, fromStop, route.transferStopName, route.bus1.color);
      const seg2 = drawSegment(route.bus2, route.transferStopName, toStop,   route.bus2.color);
      addMarker(seg1?.first, fromStop,               'Felszállás', route.bus1.color);
      addMarker(seg1?.last,  route.transferStopName, 'Átszállás',  route.bus1.color);
      addMarker(seg2?.first, route.transferStopName, 'Átszállás',  route.bus2.color);
      addMarker(seg2?.last,  toStop,                 'Célállomás', route.bus2.color);
    }

    if (allCoords.length >= 2) map.fitBounds(allCoords, { padding: [16, 16] });
    else if (allCoords.length === 1) map.setView(allCoords[0], 15);

    instanceRef.current = map;
    return () => { map.remove(); instanceRef.current = null; };
  }, [routeKey]);

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      mapRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  return (
    <div style={{ position: 'relative', borderTop: '2px solid var(--line)' }}>
      <div ref={mapRef} style={{ height: 280, width: '100%' }} />
      <button
        onClick={toggleFullscreen}
        title="Teljes képernyő"
        style={{
          position: 'absolute', bottom: 10, right: 10, zIndex: 1000,
          background: 'white', border: '2px solid var(--line)',
          borderRadius: 8, padding: '4px 8px', cursor: 'pointer',
          fontSize: 16, lineHeight: 1, boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
        }}
      >⛶</button>
    </div>
  );
}

function CityRouteCard({ route, index, isPrimary, fromStop, toStop, walkMin, isWeekend, nowMins }) {
  const U = window.BUS_UTILS;
  const fmt = m => U.fmtTime(m);
  const [timetableBusId, setTimetableBusId] = React.useState(null);
  const [mapOpen, setMapOpen] = React.useState(false);
  const totalMin = route.totalDuration;
  const totalStr = totalMin >= 60
    ? `${Math.floor(totalMin / 60)}ó ${totalMin % 60}p`
    : `${totalMin} perc`;

  const BusIcon = ({ bus }) => (
    <div
      className="city-bus-badge"
      style={{ background: bus.color, cursor: 'pointer' }}
      title="Menetrend megtekintése"
      onClick={() => setTimetableBusId(bus.id)}
    >
      {bus.id}
    </div>
  );

  return (
    <div className={`route-card ${isPrimary ? "primary" : ""}`}>
      {timetableBusId && (
        <window.BusTimetableModal busId={timetableBusId} onClose={() => setTimetableBusId(null)} isWeekend={isWeekend} nowMins={nowMins} />
      )}
      <div className="route-card-header">
        <span className="route-card-badge">
          {isPrimary ? "⭐ Legjobb" : `${index}. alternatíva`}
        </span>
        <span className="route-card-total">
          📍 {fmt(route.arriveAt)} · {totalStr}
          <button
            onClick={() => setMapOpen(o => !o)}
            title="Útvonal a térképen"
            style={{
              marginLeft: 8, background: mapOpen ? 'var(--accent)' : 'var(--line)',
              border: 'none', borderRadius: 8, padding: '2px 8px',
              cursor: 'pointer', fontSize: 14, color: mapOpen ? 'white' : 'var(--ink)',
              fontFamily: 'inherit', fontWeight: 800, verticalAlign: 'middle',
            }}
          >🗺</button>
        </span>
      </div>

      <div className="route-steps">
        {walkMin > 0 && (
          <>
            <div className="route-step">
              <div className="step-time">{fmt(route.departLeaveOrigin)}</div>
              <div className="step-icon">🚶</div>
              <div className="step-body">
                <div className="step-title">Indulj el</div>
                <div className="step-sub">{walkMin} perc gyaloglás a megállóhoz</div>
              </div>
            </div>
            <div className="step-connector">
              <div className="connector-line" />
            </div>
          </>
        )}

        {/* Board bus1 */}
        <div className="route-step">
          <div className="step-time">{fmt(route.boardAt)}</div>
          <BusIcon bus={route.bus1} />
          <div className="step-body">
            <div className="step-title">
              Szállj fel ·{" "}
              <span style={{ color: route.bus1.color, fontWeight: 800 }}>
                {route.bus1.label}
              </span>
            </div>
            <div className="step-sub">{fromStop}</div>
          </div>
        </div>

        {route.type === "direct" ? (
          <>
            <div className="step-connector">
              <div className="connector-line" />
              <div className="connector-label">{route.arriveAt - route.boardAt} perc</div>
            </div>
            <div className="route-step">
              <div className="step-time">{fmt(route.arriveAt)}</div>
              <div className="step-icon step-icon-home">📍</div>
              <div className="step-body">
                <div className="step-title" style={{ fontWeight: 800 }}>{toStop}</div>
                <div className="step-sub">Megérkeztél</div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="step-connector">
              <div className="connector-line" />
              <div className="connector-label">{route.arriveAtTransfer - route.boardAt} perc</div>
            </div>
            <div className="route-step">
              <div className="step-time">{fmt(route.arriveAtTransfer)}</div>
              <div className="step-icon">🔄</div>
              <div className="step-body">
                <div className="step-title">Átszállás</div>
                <div className="step-sub">{route.transferStopName}</div>
                <div className="wait-pill">⏱ {route.waitAtTransfer} perc várakozás</div>
              </div>
            </div>
            <div className="step-connector">
              <div className="connector-line" />
            </div>
            <div className="route-step">
              <div className="step-time">{fmt(route.boardAt2)}</div>
              <BusIcon bus={route.bus2} />
              <div className="step-body">
                <div className="step-title">
                  Szállj fel ·{" "}
                  <span style={{ color: route.bus2.color, fontWeight: 800 }}>
                    {route.bus2.label}
                  </span>
                </div>
                <div className="step-sub">{route.transferStopName}</div>
              </div>
            </div>
            <div className="step-connector">
              <div className="connector-line" />
              <div className="connector-label">{route.arriveAt - route.boardAt2} perc</div>
            </div>
            <div className="route-step">
              <div className="step-time">{fmt(route.arriveAt)}</div>
              <div className="step-icon step-icon-home">📍</div>
              <div className="step-body">
                <div className="step-title" style={{ fontWeight: 800 }}>{toStop}</div>
                <div className="step-sub">Megérkeztél</div>
              </div>
            </div>
          </>
        )}
      </div>
      {mapOpen && <CityRouteMap route={route} fromStop={fromStop} toStop={toStop} />}
    </div>
  );
}

// ── CityApp ──────────────────────────────────────────────────────────
function CityApp() {
  const U = window.BUS_UTILS;
  const [now, setNow] = React.useState(new Date());
  const [fromStop, setFromStop] = React.useState(() => localStorage.getItem("city_from") || "");
  const [toStop, setToStop] = React.useState(() => localStorage.getItem("city_to") || "");
  const [timeMode, setTimeMode] = React.useState(() => localStorage.getItem("city_timeMode") || "now");
  const [customTime, setCustomTime] = React.useState(() => {
    const saved = localStorage.getItem("city_customTime");
    if (saved) return saved;
    const d = new Date();
    return `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
  });
  const walkMin = 0;
  const [dayOffset, setDayOffset] = React.useState(0);
  const [results, setResults] = React.useState(null);
  const [timetableBusId, setTimetableBusId] = React.useState(null);
  const [planIsWeekend, setPlanIsWeekend] = React.useState(() => { const d = new Date(); return d.getDay() === 0 || d.getDay() === 6; });
  const [planNowMins, setPlanNowMins] = React.useState(() => { const d = new Date(); return d.getHours() * 60 + d.getMinutes(); });

  React.useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 15000);
    return () => clearInterval(id);
  }, []);

  const nowFmt = U.fmtTime(now.getHours() * 60 + now.getMinutes());
  const dateFmt = now.toLocaleDateString("hu-HU", { weekday: "long", month: "short", day: "numeric" });

  function plan(overrides = {}) {
    const effectiveMode = overrides.timeMode ?? timeMode;
    const effectiveTime = overrides.customTime ?? customTime;
    const effectiveOffset = overrides.dayOffset ?? dayOffset;
    let planTime;
    if (effectiveMode === "now") {
      planTime = new Date();
    } else {
      const [h, m] = effectiveTime.split(":").map(Number);
      planTime = new Date();
      planTime.setDate(planTime.getDate() + effectiveOffset);
      planTime.setHours(h, m, 0, 0);
    }
    const r = window.planCityRoutes({
      now: planTime,
      fromStop,
      toStop,
      walkMin,
      minTransfer: 2,
      maxResults: 6,
    });
    setResults(r);
    setPlanIsWeekend(planTime.getDay() === 0 || planTime.getDay() === 6);
    setPlanNowMins(planTime.getHours() * 60 + planTime.getMinutes());
  }

  function swap() {
    const tmp = fromStop;
    setFromStop(toStop); localStorage.setItem("city_from", toStop);
    setToStop(tmp);      localStorage.setItem("city_to", tmp);
    setResults(null);
  }

  const canPlan = fromStop && toStop && fromStop !== toStop;

  return (
    <div className="v1">
      {timetableBusId && (
        <window.BusTimetableModal busId={timetableBusId} onClose={() => setTimetableBusId(null)} isWeekend={planIsWeekend} nowMins={planNowMins} />
      )}

      {/* Header */}
      <div className="v1-header">
        <div>
          <div className="v1-title">VeszprémBusz 🚌</div>
          <div className="v1-subtitle">Veszprém helyi járatok — útvonaltervező</div>
          <TimetableDropdown onSelect={id => setTimetableBusId(id)} />
        </div>
        <div
          className="v1-clock"
          onClick={() => { setTimeMode(m => m === "now" ? "custom" : "now"); setResults(null); }}
          style={{
            cursor:"pointer",
            background: timeMode !== "now" ? "var(--accent)" : undefined,
            color: timeMode !== "now" ? "white" : undefined,
            outline: timeMode === "now" ? "3px solid var(--sun)" : "3px solid var(--accent)",
            outlineOffset: 2,
            transition: "background 0.2s, outline 0.2s",
          }}
        >
          <div className="v1-clock-label">{timeMode === "now" ? "MOSTANRA" : "SAJÁT IDŐ"}</div>
          <div className="v1-clock-time">{timeMode === "now" ? nowFmt : customTime}</div>
          <div className="v1-clock-date">{dateFmt}</div>
        </div>
      </div>

      {/* Custom time strip */}
      {timeMode === "custom" && (
        <div style={{
          background:"var(--accent)", borderRadius:"var(--radius)",
          padding:"14px 20px", marginBottom:16,
          display:"flex", gap:8, alignItems:"center", flexWrap:"wrap",
        }}>
          <input
            type="time"
            value={customTime}
            className="v1-time-input"
            onChange={e => { const t = e.target.value; setCustomTime(t); localStorage.setItem("city_customTime", t); if (canPlan) plan({ customTime: t }); }}
            style={{fontSize:15,fontWeight:800,minWidth:100}}
          />
          <div style={{width:1,height:28,background:"rgba(255,255,255,0.25)",flexShrink:0}} />
          {Array.from({length:5},(_,i) => {
            const d = new Date(); d.setDate(d.getDate()+i);
            const label = i===0?"Ma":i===1?"Holnap":d.toLocaleDateString("hu-HU",{weekday:"short"});
            const isSelected = dayOffset === i;
            return (
              <button key={i}
                onClick={() => { setDayOffset(i); if (canPlan) plan({ dayOffset: i }); }}
                style={{
                  padding:"6px 12px", borderRadius:10, border:"none",
                  fontFamily:"inherit", fontSize:13, fontWeight:800, cursor:"pointer",
                  background: isSelected ? "white" : "rgba(255,255,255,0.18)",
                  color: isSelected ? "var(--accent)" : "white",
                  transition:"background 0.15s",
                }}
              >{label}</button>
            );
          })}
          <div style={{width:1,height:28,background:"rgba(255,255,255,0.25)",flexShrink:0}} />
          {["06:00","08:00","10:00","12:00","14:00","16:00","18:00","20:00"].map(t => {
            const isSelected = customTime === t;
            return (
              <button key={t}
                onClick={() => { setCustomTime(t); localStorage.setItem("city_customTime", t); if (canPlan) plan({ customTime: t }); }}
                style={{
                  padding:"6px 10px", borderRadius:10, border:"none",
                  fontFamily:"inherit", fontSize:13, fontWeight:800, cursor:"pointer",
                  background: isSelected ? "white" : "rgba(255,255,255,0.18)",
                  color: isSelected ? "var(--accent)" : "white",
                  transition:"background 0.15s",
                }}
              >{t}</button>
            );
          })}
        </div>
      )}

      {/* Planner form */}
      <div style={{
        background: "white", borderRadius: "var(--radius)",
        padding: "20px 24px", boxShadow: "var(--shadow)", marginBottom: 20
      }}>
        {/* FROM / TO row */}
        <div className="city-form-row">
          <div className="city-stop-wrapper">
            <div className="city-stop-label">Honnan</div>
            <StopSearch
              id="from-stop"
              value={fromStop}
              onChange={v => { setFromStop(v); localStorage.setItem("city_from", v); setResults(null); }}
              placeholder="Megálló neve..."
            />
          </div>
          <button className="city-swap-btn" onClick={swap} title="Megállók cseréje">⇄</button>
          <div className="city-stop-wrapper">
            <div className="city-stop-label">Hova</div>
            <StopSearch
              id="to-stop"
              value={toStop}
              onChange={v => { setToStop(v); localStorage.setItem("city_to", v); setResults(null); }}
              placeholder="Megálló neve..."
            />
          </div>
        </div>

        {/* Plan row */}
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <button
            className="v1-btn primary"
            style={{ marginLeft: "auto", opacity: canPlan ? 1 : 0.4, cursor: canPlan ? "pointer" : "not-allowed" }}
            onClick={canPlan ? plan : undefined}
          >
            🔍 Útvonal keresése
          </button>
        </div>
      </div>

      {/* Results */}
      {results === null ? (
        <div className="v1-empty">
          <div className="v1-empty-emoji">🗺️</div>
          <div className="v1-empty-title">Válassz megállókat</div>
          <div className="v1-empty-hint">
            Írd be a kiindulási és célmegállót, majd kattints a keresésre.
          </div>
        </div>
      ) : results.length === 0 ? (
        <div className="v1-empty">
          <div className="v1-empty-emoji">😔</div>
          <div className="v1-empty-title">Nincs elérhető járat</div>
          <div className="v1-empty-hint">
            Ezen a napon és időpontban nem találtunk útvonalat{" "}
            <strong>{fromStop}</strong> → <strong>{toStop}</strong> között.
          </div>
        </div>
      ) : (
        <>
          {/* Hero banner — best result */}
          <div className="city-hero-banner">
            <div>
              <div style={{ fontSize: 12, opacity: 0.85, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>
                Legjobb útvonal
              </div>
              <div style={{ fontSize: 52, fontWeight: 900, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
                {U.fmtTime(results[0].arriveAt)}
              </div>
              <div style={{ fontSize: 15, opacity: 0.9, marginTop: 4 }}>
                {toStop} · {results[0].totalDuration} perc
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 14, opacity: 0.85 }}>{results.length} útvonal</div>
              <div style={{ fontSize: 36, fontWeight: 900, lineHeight: 1, marginTop: 4 }}>
                {results[0].type === "direct" ? "Közvetlen" : "1 átszállás"}
              </div>
              <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>
                {fromStop.length > 20 ? fromStop.slice(0, 20) + "…" : fromStop} →
              </div>
            </div>
          </div>

          <div className="city-results-grid">
            {results.map((r, i) => (
              <CityRouteCard
                key={i}
                route={r}
                index={i + 1}
                isPrimary={i === 0}
                fromStop={fromStop}
                toStop={toStop}
                walkMin={walkMin}
                isWeekend={planIsWeekend}
                nowMins={planNowMins}
              />
            ))}
          </div>
        </>
      )}

      {/* Navigation */}
      <div style={{ position: "fixed", bottom: 14, left: 14, zIndex: 9998 }}>
        <a href="index.html" style={{
          background: "#0E1524", color: "#FFC93C", textDecoration: "none",
          padding: "10px 14px", borderRadius: 10, fontWeight: 800, fontSize: 13,
          fontFamily: "Nunito,sans-serif", boxShadow: "0 8px 24px rgba(0,0,0,0.2)"
        }}>
          ← HazaÚt
        </a>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<CityApp />);