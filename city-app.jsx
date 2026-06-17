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

// ── StopSearch ───────────────────────────────────────────────────────
function StopSearch({ value, onChange, placeholder, id }) {
  const [query, setQuery] = React.useState(value || "");
  const [open, setOpen] = React.useState(false);
  const [dropdownStyle, setDropdownStyle] = React.useState({});
  const ref = React.useRef(null);

  React.useEffect(() => { setQuery(value || ""); }, [value]);

  function calcAndOpen() {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setDropdownStyle({ position: 'fixed', top: rect.bottom + 4, left: rect.left, width: rect.width, maxHeight: 280 });
    }
    setOpen(true);
  }

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
    calcAndOpen();
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
        onFocus={calcAndOpen}
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
          ...dropdownStyle,
          zIndex: 9999, background: "white", border: "2px solid var(--line)",
          borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          overflowY: "auto"
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
  const containerRef = React.useRef(null);
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
    const fmt = m => window.BUS_UTILS.fmtTime(m);

    function drawSegment(bus, from, to, color) {
      const seg = getShapeSegment(bus, from, to);
      if (seg && seg.length >= 2) {
        L.polyline(seg, { color, weight: 5, opacity: 0.9 }).addTo(map);
        allCoords.push(...seg);
      } else {
        const stops = bus.stops;
        const fi = stops.findIndex(s => s.name === from);
        const ti = stops.findIndex(s => s.name === to);
        if (fi >= 0 && ti > fi) {
          const coords = stops.slice(fi, ti + 1).filter(s => s.lat).map(s => [s.lat, s.lon]);
          L.polyline(coords, { color, weight: 4, opacity: 0.7, dashArray: '6,4' }).addTo(map);
          allCoords.push(...coords);
        }
      }
    }

    function drawStops(bus, from, to, color, dep) {
      const stops = bus.stops;
      const fi = stops.findIndex(s => s.name === from);
      const ti = stops.findIndex(s => s.name === to);
      if (fi < 0 || ti < 0) return;
      const seg = stops.slice(fi, ti + 1).filter(s => s.lat && s.lon);
      seg.forEach((stop, i) => {
        const isTerminal = i === 0 || i === seg.length - 1;
        const r = isTerminal ? 9 : 6;
        const time = dep !== null ? dep + stop.offset : null;
        L.circleMarker([stop.lat, stop.lon], {
          radius: r, color: 'white', weight: 2,
          fillColor: color, fillOpacity: 0.95,
        }).addTo(map).bindPopup(`<b>${stop.name}</b>${time !== null ? `<br>${fmt(time)}` : ''}`);
        if (time !== null) {
          const labelHtml = `<div style="position:absolute;left:${r + 5}px;top:-10px;background:white;border:1.5px solid ${color};border-radius:4px;padding:1px 6px;font-size:11px;font-weight:700;color:#222;white-space:nowrap;box-shadow:0 1px 3px rgba(0,0,0,0.15);">${fmt(time)}</div>`;
          L.marker([stop.lat, stop.lon], {
            icon: L.divIcon({ className: '', html: labelHtml, iconSize: [0, 0], iconAnchor: [0, 0] }),
            interactive: false, zIndexOffset: 200,
          }).addTo(map);
        }
        if (!isTerminal && i > 0) {
          const prev = seg[i - 1], next = seg[i + 1] || stop;
          const dy = next.lat - prev.lat, dx = next.lon - prev.lon;
          const angle = Math.atan2(dx, dy) * 180 / Math.PI;
          const svg = `<svg xmlns="http://www.w3.org/2000/svg" style="position:absolute;left:-12px;top:-32px;transform-origin:12px 32px;transform:rotate(${angle}deg)" width="24" height="40"><polygon points="12,6 19,26 12,19 5,26" fill="black" stroke="white" stroke-width="2" stroke-linejoin="round"/></svg>`;
          L.marker([stop.lat, stop.lon], {
            icon: L.divIcon({ className: '', html: svg, iconSize: [0, 0], iconAnchor: [0, 0] }),
            interactive: false, zIndexOffset: 100,
          }).addTo(map);
        }
      });
    }

    if (route.type === 'direct') {
      drawSegment(route.bus1, fromStop, toStop, route.bus1.color);
      const fromOff = route.bus1.stops.find(s => s.name === fromStop)?.offset ?? 0;
      drawStops(route.bus1, fromStop, toStop, route.bus1.color, route.boardAt - fromOff);
    } else {
      const bus2DepStop = route.walkToStop || route.transferStopName;
      drawSegment(route.bus1, fromStop, route.transferStopName, route.bus1.color);
      drawSegment(route.bus2, bus2DepStop, toStop, route.bus2.color);
      if (route.walkTransfer) {
        const sA = route.bus1.stops.find(s => s.name === route.transferStopName);
        const sB = route.bus2.stops.find(s => s.name === bus2DepStop);
        if (sA?.lat && sB?.lat) {
          L.polyline([[sA.lat, sA.lon], [sB.lat, sB.lon]], { color: '#555', weight: 3, opacity: 0.7, dashArray: '6,5' }).addTo(map);
          allCoords.push([sA.lat, sA.lon], [sB.lat, sB.lon]);
        }
      }
      const fromOff1 = route.bus1.stops.find(s => s.name === fromStop)?.offset ?? 0;
      drawStops(route.bus1, fromStop, route.transferStopName, route.bus1.color, route.boardAt - fromOff1);
      const fromOff2 = route.bus2.stops.find(s => s.name === bus2DepStop)?.offset ?? 0;
      drawStops(route.bus2, bus2DepStop, toStop, route.bus2.color, route.boardAt2 - fromOff2);
    }

    if (allCoords.length >= 2) map.fitBounds(allCoords, { padding: [16, 16] });
    else if (allCoords.length === 1) map.setView(allCoords[0], 15);

    instanceRef.current = map;
    return () => { map.remove(); instanceRef.current = null; };
  }, [routeKey]);

  const [fsState, setFsState] = React.useState(false);
  React.useEffect(() => {
    const h = () => { setFsState(!!document.fullscreenElement); setTimeout(() => instanceRef.current?.invalidateSize(), 100); };
    document.addEventListener('fullscreenchange', h);
    return () => document.removeEventListener('fullscreenchange', h);
  }, []);
  React.useEffect(() => {
    const h = (e) => { if (e.key === 'Escape' && document.fullscreenElement) document.exitFullscreen(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, []);

  function toggleFullscreen() {
    if (!document.fullscreenElement) containerRef.current?.requestFullscreen();
    else document.exitFullscreen();
  }

  return (
    <div ref={containerRef} style={{ position: 'relative', borderTop: '2px solid var(--line)' }}>
      <div ref={mapRef} style={{ height: fsState ? '100%' : 300, width: '100%' }} />
      <button onClick={toggleFullscreen} title={fsState ? 'Kilépés' : 'Teljes képernyő'} style={{
        position: 'absolute', top: fsState ? 28 : 10, right: fsState ? 28 : 10, zIndex: 1000,
        background: '#1a73e8',
        border: '2px solid #1a73e8',
        borderRadius: 8, padding: '4px 8px', cursor: 'pointer',
        fontSize: 16, lineHeight: 1, boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
        color: 'white',
      }}>{fsState ? '✕' : '⛶'}</button>
    </div>
  );
}

function scrollCityCardBottom(cardEl) {
  if (!cardEl) return;
  const rect = cardEl.getBoundingClientRect();
  const extra = rect.bottom - window.innerHeight + 80;
  if (extra > 0) window.scrollTo({ top: window.pageYOffset + extra, behavior: 'smooth' });
}

function CityRouteCard({ route, index, isPrimary, fromStop, toStop, walkMin, isWeekend, nowMins, lang }) {
  const U = window.BUS_UTILS;
  const fmt = m => U.fmtTime(m);
  const t = (window.I18N && window.I18N[lang || "hu"]) || window.I18N?.hu || {};
  const [timetableInfo, setTimetableInfo] = React.useState(null);
  const [mapOpen, setMapOpen] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const cardRef = React.useRef(null);
  React.useEffect(() => {
    if (!mapOpen) return;
    setTimeout(() => scrollCityCardBottom(cardRef.current), 50);
  }, [mapOpen]);
  const totalMin = route.totalDuration;
  const totalStr = totalMin >= 60
    ? `${Math.floor(totalMin / 60)} ${t.hour || "h"} ${totalMin % 60} ${t.min || "min"}`
    : `${totalMin} ${t.min || "min"}`;

  const stops1 = route.bus1.stops;
  const boardIdx1 = stops1.findIndex(s => s.name === fromStop);
  const alightName1 = route.type === 'direct' ? toStop : route.transferStopName;
  const alightIdx1 = stops1.findIndex(s => s.name === alightName1);
  const fromBoard1 = route.boardAt - (boardIdx1 >= 0 ? stops1[boardIdx1].offset : 0);
  const visibleStops1 = boardIdx1 >= 0 && alightIdx1 >= 0 ? stops1.slice(boardIdx1, alightIdx1 + 1) : [];

  let visibleStops2 = [], fromBoard2 = 0;
  if (route.type === 'transfer' && route.bus2) {
    const stops2 = route.bus2.stops;
    const boardName2 = route.walkToStop || route.transferStopName;
    const boardIdx2 = stops2.findIndex(s => s.name === boardName2);
    const alightIdx2 = stops2.findIndex(s => s.name === toStop);
    fromBoard2 = route.boardAt2 - (boardIdx2 >= 0 ? stops2[boardIdx2].offset : 0);
    visibleStops2 = boardIdx2 >= 0 && alightIdx2 >= 0 ? stops2.slice(boardIdx2, alightIdx2 + 1) : [];
  }

  function openTimetable(bus, boardAtMins, boardStopName) {
    const boardOff = bus.stops.find(s => s.name === boardStopName)?.offset ?? 0;
    setTimetableInfo({ busId: bus.id, fromStop: bus.stops[0]?.name, initialDep: boardAtMins - boardOff });
  }

  const BusIcon = ({ bus, boardAt, boardStop }) => (
    <div
      className="city-bus-badge"
      style={{ background: bus.color, cursor: 'pointer' }}
      title="Menetrend megtekintése"
      onClick={() => openTimetable(bus, boardAt, boardStop)}
    >
      {bus.id}
    </div>
  );

  return (
    <div className={`route-card ${isPrimary ? "primary" : ""}`} ref={cardRef}>
      {timetableInfo && (
        <window.BusTimetableModal busId={timetableInfo.busId} fromStop={timetableInfo.fromStop} initialDep={timetableInfo.initialDep} onClose={() => setTimetableInfo(null)} isWeekend={isWeekend} nowMins={nowMins} lang={lang} />
      )}
      <div className="route-card-header">
        <span className="route-card-badge">
          {isPrimary ? `⭐ ${t.best || "Legjobb"}` : `${index}. ${t.altLabel || "alternatíva"}`}
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
                <div className="step-title">{t.departLabel || "Indulj el"}</div>
                <div className="step-sub">{walkMin} {t.walkToStopLabel || "perc gyaloglás a megállóhoz"}</div>
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
          <BusIcon bus={route.bus1} boardAt={route.boardAt} boardStop={fromStop} />
          <div className="step-body">
            <div className="step-title">
              {t.boardBus || "Szállj fel"} ·{" "}
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
              <div className="connector-label">{route.arriveAt - route.boardAt} {t.min}</div>
            </div>
            <div className="route-step">
              <div className="step-time">{fmt(route.arriveAt)}</div>
              <div className="step-icon step-icon-home">📍</div>
              <div className="step-body">
                <div className="step-title" style={{ fontWeight: 800 }}>{toStop}</div>
                <div className="step-sub">{t.arrivedLabel || "Megérkeztél"}</div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="step-connector">
              <div className="connector-line" />
              <div className="connector-label">{route.arriveAtTransfer - route.boardAt} {t.min}</div>
            </div>
            <div className="route-step">
              <div className="step-time">{fmt(route.arriveAtTransfer)}</div>
              <div className="step-icon">{route.walkTransfer ? "🚶" : "🔄"}</div>
              <div className="step-body">
                {route.walkTransfer ? (
                  <>
                    <div className="step-title">{route.transferStopName} → {route.walkToStop}</div>
                    <div className="step-sub">{route.walkTransfer.walkMin} {t.walkMinLabel || "perc gyalog"} · {route.walkTransfer.distM} m</div>
                    {route.waitAtTransfer - route.walkTransfer.walkMin > 0 && (
                      <div className="wait-pill">⏱ {route.waitAtTransfer - route.walkTransfer.walkMin} {t.waitLabel || "perc várakozás"}</div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="step-title">{t.transfer || "Átszállás"}</div>
                    <div className="step-sub">{route.transferStopName}</div>
                    <div className="wait-pill">⏱ {route.waitAtTransfer} {t.waitLabel || "perc várakozás"}</div>
                  </>
                )}
              </div>
            </div>
            <div className="step-connector">
              <div className="connector-line" />
            </div>
            <div className="route-step">
              <div className="step-time">{fmt(route.boardAt2)}</div>
              <BusIcon bus={route.bus2} boardAt={route.boardAt2} boardStop={route.walkToStop || route.transferStopName} />
              <div className="step-body">
                <div className="step-title">
                  {t.boardBus || "Szállj fel"} ·{" "}
                  <span style={{ color: route.bus2.color, fontWeight: 800 }}>
                    {route.bus2.label}
                  </span>
                </div>
                <div className="step-sub">{route.walkToStop || route.transferStopName}</div>
              </div>
            </div>
            <div className="step-connector">
              <div className="connector-line" />
              <div className="connector-label">{route.arriveAt - route.boardAt2} {t.min}</div>
            </div>
            <div className="route-step">
              <div className="step-time">{fmt(route.arriveAt)}</div>
              <div className="step-icon step-icon-home">📍</div>
              <div className="step-body">
                <div className="step-title" style={{ fontWeight: 800 }}>{toStop}</div>
                <div className="step-sub">{t.arrivedLabel || "Megérkeztél"}</div>
              </div>
            </div>
          </>
        )}
      </div>
      <button
        className="route-expand-btn"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? t.hideMoreStops : t.showMoreStops} ▾
      </button>

      {mapOpen && <CityRouteMap route={route} fromStop={fromStop} toStop={toStop} />}

      {expanded && (
        <div className="route-details">
          <div className="details-title">{route.bus1.label} {t.stopsOf || "megállói:"}</div>
          <div className="details-stops">
            {visibleStops1.map((s, i) => {
              const absTime = fromBoard1 + s.offset;
              return (
                <div key={i} className={`detail-stop${i === 0 ? " home" : ""}${i === visibleStops1.length - 1 ? " transfer" : ""}`}>
                  <span className="detail-stop-time">{fmt(absTime)}</span>
                  <span className="detail-stop-dot" style={{ background: route.bus1.color }} />
                  <span className="detail-stop-name">{s.name}</span>
                </div>
              );
            })}
          </div>
          {visibleStops2.length > 0 && (
            <>
              <div className="details-title" style={{ marginTop: 8 }}>{route.bus2.label} {t.stopsOf || "megállói:"}</div>
              <div className="details-stops">
                {visibleStops2.map((s, i) => {
                  const absTime = fromBoard2 + s.offset;
                  return (
                    <div key={i} className={`detail-stop${i === 0 ? " home" : ""}${i === visibleStops2.length - 1 ? " transfer" : ""}`}>
                      <span className="detail-stop-time">{fmt(absTime)}</span>
                      <span className="detail-stop-dot" style={{ background: route.bus2.color }} />
                      <span className="detail-stop-name">{s.name}</span>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}


// ── CityMobilePill ───────────────────────────────────────────────────
function CityMobilePill({ timeMode, setTimeMode, customTime, setCustomTime, dayOffset, setDayOffset, schoolHoliday, setSchoolHoliday, canPlan, plan, lang, onTimetable, open, openSheet, onClose }) {
  const t = window.I18N[lang] || window.I18N.hu;
  const [collapsed, setCollapsed] = React.useState(false);
  const sheetRef = React.useRef(null);
  const dragStartY = React.useRef(null);
  const isDragging = React.useRef(false);
  const lastScrollY = React.useRef(0);

  function close() { setCollapsed(false); onClose(); }

  React.useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      if (y - lastScrollY.current > 8) setCollapsed(true);
      lastScrollY.current = y;
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  React.useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === 'Escape') close();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  function onTouchStart(e) {
    if ((sheetRef.current?.scrollTop || 0) > 0) return;
    dragStartY.current = e.touches[0].clientY;
    isDragging.current = false;
  }
  function onTouchMove(e) {
    if (dragStartY.current === null) return;
    const dy = e.touches[0].clientY - dragStartY.current;
    if (dy > 0 && sheetRef.current) {
      isDragging.current = true;
      sheetRef.current.style.transition = "none";
      sheetRef.current.style.transform = `translateY(${dy}px)`;
    }
  }
  function onTouchEnd(e) {
    if (!isDragging.current || dragStartY.current === null) { dragStartY.current = null; return; }
    const dy = e.changedTouches[0].clientY - dragStartY.current;
    dragStartY.current = null; isDragging.current = false;
    if (sheetRef.current) { sheetRef.current.style.transition = ""; sheetRef.current.style.transform = ""; }
    if (dy > 80) close();
  }

  const isNow = timeMode === "now";
  const timePresets = ["06:00","07:00","08:00","09:00","10:00","12:00","14:00","16:00","18:00","20:00"];
  const dayOptions = Array.from({length:7}, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i);
    const locale = lang === "hu" ? "hu-HU" : "en-US";
    const full = d.toLocaleDateString(locale, { weekday: "long" });
    const short = i === 0 ? t.todayShort : i === 1 ? t.tomorrowShort : full.slice(0, 3);
    return { offset: i, label: i === 0 ? t.today : i === 1 ? t.tomorrow : full, short };
  });
  const activeDay = dayOptions[dayOffset] || dayOptions[0];

  function setTime(t) {
    setCustomTime(t); localStorage.setItem("city_customTime", t);
    setTimeMode("custom"); localStorage.setItem("city_timeMode", "custom");
    if (canPlan) plan({ timeMode: "custom", customTime: t });
  }
  function goNow() {
    setTimeMode("now"); localStorage.setItem("city_timeMode", "now");
    if (canPlan) plan({ timeMode: "now" });
  }
  return (
    <>
      <div className={"pill-container" + (collapsed ? " pill-collapsed" : "")}>
        <a href="index.html" className="fab-action"
          data-tooltip={lang === "hu" ? "HazaÚt" : "Home Planner"}
          data-tooltip-dir="left">🏠</a>
        {onTimetable && window.TimetableDropdown && (
          <div className="fab-timetable-wrap">
            <window.TimetableDropdown onSelect={onTimetable} upward fabStyle lang={lang} />
          </div>
        )}
        <div className="mobile-pill" onClick={openSheet} style={{cursor:"pointer"}}>
          <span style={{fontSize:15, padding:"5px 9px", opacity:0.8}}>⚙️</span>
          <span className="pill-sep-mid" />
          <div className="pill-extras pill-zone-chips">
            <span className="pill-chip pill-hl">{isNow ? t.now : customTime}</span>
            {!isNow && <span className="pill-chip">{activeDay.short}</span>}
            {schoolHoliday && <span className="pill-chip">🏖️</span>}
          </div>
        </div>
      </div>

      <div className={"settings-scrim" + (open ? " open" : "")} onClick={close} />
      <div ref={sheetRef} className={"settings-sheet" + (open ? " open" : "")}
        onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
        <div className="sheet-handle" />
        <div className="sheet-head">
          <span className="sheet-head-title">{t.cityPlanTitle}</span>
          <button className="sheet-close" onClick={close}>✕</button>
        </div>

        <div className="sec-title">{t.departureTime}</div>
        <div style={{padding:"0 20px 14px"}}>
          <div style={{display:"flex", gap:5, flexWrap:"wrap", marginBottom:10}}>
            <button className={"sel-pill" + (isNow ? " on" : "")} onClick={goNow}>{t.nowBtn}</button>
            {timePresets.map(tp => (
              <button key={tp} className={"sel-pill" + (!isNow && customTime===tp ? " on" : "")}
                onClick={() => setTime(tp)}>{tp}</button>
            ))}
          </div>
          <input type="time" value={isNow ? "" : customTime}
            onChange={e => setTime(e.target.value)}
            placeholder={t.customPlaceholder} className="v1-time-input"
            style={{fontSize:14, padding:"6px 10px", borderRadius:10}} />
        </div>

        <div className="sec-title">{t.daySection}</div>
        <div className="day-chips-grid">
          {dayOptions.map(o => (
            <button key={o.offset}
              className={"day-pill" + (dayOffset===o.offset ? " on" : "") + (o.offset===0 ? " today" : "")}
              onClick={() => {
                setDayOffset(o.offset);
                const newMode = o.offset === 0 && isNow ? "now" : "custom";
                if (newMode !== timeMode) { setTimeMode(newMode); localStorage.setItem("city_timeMode", newMode); }
                if (canPlan) plan({ dayOffset: o.offset, timeMode: newMode });
              }}>
              {o.short}
            </button>
          ))}
        </div>

        <div className="sec-title">{t.filters}</div>
        <div className="sheet-row">
          <span className="row-icon">🏖️</span>
          <div className="row-label">
            <strong>{t.schoolHolidayLabel}</strong>
            <small>{t.schoolHolidaySub}</small>
          </div>
          <button className={"toggle" + (schoolHoliday ? " on" : "")}
            onClick={() => {
              const v = !schoolHoliday; setSchoolHoliday(v);
              localStorage.setItem("city.schoolholiday", v ? "1" : "0");
              if (canPlan) plan({ schoolHoliday: v });
            }} />
        </div>
        <div style={{height:20}} />
      </div>
    </>
  );
}

// ── CityApp ──────────────────────────────────────────────────────────
function CityApp() {
  const U = window.BUS_UTILS;
  const [lang, setLang] = React.useState(() => localStorage.getItem("lang") || "hu");
  const t = window.I18N[lang] || window.I18N.hu;
  function switchLang(l) { setLang(l); localStorage.setItem("lang", l); }

  const [isMobile, setIsMobile] = React.useState(() => window.matchMedia("(max-width: 640px)").matches);
  React.useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const h = e => setIsMobile(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

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
  const [schoolHoliday, setSchoolHoliday] = React.useState(() => localStorage.getItem("city.schoolholiday") === "1");
  const [results, setResults] = React.useState(null);
  const [formCollapsed, setFormCollapsed] = React.useState(false);
  const [timetableBusId, setTimetableBusId] = React.useState(null);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const didPushHistory = React.useRef(false);

  function openSheet() {
    setSheetOpen(true);
    history.pushState({ sheet: true }, "");
    didPushHistory.current = true;
  }
  function closeSheet() {
    setSheetOpen(false);
    if (didPushHistory.current) {
      didPushHistory.current = false;
      history.back();
    }
  }
  React.useEffect(() => {
    function onPop() {
      if (didPushHistory.current) {
        didPushHistory.current = false;
        setSheetOpen(false);
      }
    }
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  const [planIsWeekend, setPlanIsWeekend] = React.useState(() => { const d = new Date(); return d.getDay() === 0 || d.getDay() === 6; });
  const [planNowMins, setPlanNowMins] = React.useState(() => { const d = new Date(); return d.getHours() * 60 + d.getMinutes(); });

  React.useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 15000);
    return () => clearInterval(id);
  }, []);

  const nowFmt = U.fmtTime(now.getHours() * 60 + now.getMinutes());
  const dateFmt = now.toLocaleDateString(lang === "hu" ? "hu-HU" : "en-US", { weekday: "long", month: "short", day: "numeric" });

  function plan(overrides = {}) {
    const effectiveMode = overrides.timeMode ?? timeMode;
    const effectiveTime = overrides.customTime ?? customTime;
    const effectiveOffset = overrides.dayOffset ?? dayOffset;
    const effectiveFrom = overrides.fromStop ?? fromStop;
    const effectiveTo = overrides.toStop ?? toStop;
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
      fromStop: effectiveFrom,
      toStop: effectiveTo,
      walkMin,
      maxResults: 6,
      schoolHoliday: overrides.schoolHoliday ?? schoolHoliday,
    });
    setResults(r);
    setPlanIsWeekend(planTime.getDay() === 0 || planTime.getDay() === 6);
    setPlanNowMins(planTime.getHours() * 60 + planTime.getMinutes());
    setFormCollapsed(true);
  }

  function swap() {
    const newFrom = toStop;
    const newTo = fromStop;
    setFromStop(newFrom); localStorage.setItem("city_from", newFrom);
    setToStop(newTo);     localStorage.setItem("city_to", newTo);
    if (newFrom && newTo && newFrom !== newTo) {
      plan({ fromStop: newFrom, toStop: newTo });
    } else {
      setResults(null); setFormCollapsed(false);
    }
  }

  const canPlan = fromStop && toStop && fromStop !== toStop;

  return (
    <div className="v1">
      {timetableBusId && (
        <window.BusTimetableModal busId={timetableBusId} onClose={() => setTimetableBusId(null)} isWeekend={planIsWeekend} nowMins={planNowMins} lang={lang} />
      )}
      {/* Header */}
      <div className="v1-header" style={isMobile ? {flexDirection:"row", alignItems:"center", justifyContent:"space-between", gap:8} : {}}>
        <div style={isMobile ? {flex:1, minWidth:0} : {}}>
          <div style={{display:"flex", alignItems:"center", gap:10}}>
            <div className="v1-title">VeszprémBusz 🚌</div>
            <div style={{fontSize:11,fontWeight:700,background:"linear-gradient(135deg,#7C3AED,#C026D3)",color:"white",padding:"2px 8px",borderRadius:6}}>{window.APP_VERSION}</div>
            <div style={{marginLeft:"auto", display:"flex", gap:4}}>
              <button className="tweaks-pill" style={lang==="hu"?{background:"var(--accent)",color:"white"}:{}} onClick={() => switchLang("hu")}>HU</button>
              <button className="tweaks-pill" style={lang==="en"?{background:"var(--accent)",color:"white"}:{}} onClick={() => switchLang("en")}>EN</button>
            </div>
          </div>
          {!isMobile && <div className="v1-subtitle">{t.citySubtitle}</div>}
        </div>
        {!isMobile && (
          <div
            className="v1-clock"
            onClick={() => { if (timeMode === "now") openSheet(); else { setTimeMode("now"); localStorage.setItem("city_timeMode","now"); if (canPlan) plan({ timeMode: "now" }); } }}
            style={{
              cursor:"pointer",
              background: timeMode !== "now" ? "var(--accent)" : undefined,
              color: timeMode !== "now" ? "white" : undefined,
              outline: timeMode === "now" ? "3px solid var(--sun)" : "3px solid var(--accent)",
              outlineOffset: 2,
              transition: "background 0.2s, outline 0.2s",
            }}
          >
            <div className="v1-clock-label">{timeMode === "now" ? (t.nowBtn || "MOST") : (t.customTimeLabel || "SAJÁT IDŐ")}</div>
            <div className="v1-clock-time">{timeMode === "now" ? nowFmt : customTime}</div>
            <div className="v1-clock-date">{dateFmt}</div>
          </div>
        )}
      </div>
      {isMobile && (
        <div style={{marginTop:4, marginBottom:10}}>
          <div className="v1-subtitle">{t.citySubtitle}</div>
        </div>
      )}


      {/* Planner form */}
      {formCollapsed && results !== null ? (
        <button onClick={() => setFormCollapsed(false)} style={{
          display:"flex", alignItems:"center", justifyContent:"space-between",
          background:"white", borderRadius:"var(--radius)",
          padding:"11px 14px", boxShadow:"var(--shadow)", marginBottom:12,
          border:"none", cursor:"pointer", fontFamily:"Nunito,sans-serif",
          textAlign:"left",
          width: isMobile ? "100%" : undefined,
          maxWidth: isMobile ? undefined : 580,
          margin: isMobile ? undefined : "0 auto 12px",
        }}>
          <div style={{display:"flex", flexDirection:"column", gap:2, minWidth:0}}>
            <div style={{fontSize:11, fontWeight:800, color:"var(--ink-soft)", textTransform:"uppercase", letterSpacing:"0.06em"}}>{t.routeSummaryLabel}</div>
            <div style={{fontSize:13, fontWeight:800, color:"var(--ink)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>
              {fromStop} → {toStop}
            </div>
          </div>
          <span style={{fontSize:18, color:"var(--ink-soft)", flexShrink:0, marginLeft:8}}>✎</span>
        </button>
      ) : (
      <div className="city-form-mobile" style={{
        background: "white", borderRadius: "var(--radius)",
        boxShadow: "var(--shadow)", marginBottom: 16, overflow: "hidden",
        maxWidth: isMobile ? undefined : 580, margin: isMobile ? undefined : "0 auto 16px",
      }}>
        <div style={{display:"flex", alignItems:"stretch"}}>
          <button onClick={swap} title={t.swapStops} style={{
            background:"none", border:"none", borderRight:"2px solid var(--line)",
            padding:"0 14px", cursor:"pointer", fontSize:20, fontWeight:900, color:"var(--ink-soft)",
            display:"flex", alignItems:"center", flexShrink:0,
          }}>⇅</button>
          <div style={{flex:1, minWidth:0}}>
            <div style={{padding:"10px 12px 8px"}}>
              <div className="city-stop-label">{t.fromLabel}</div>
              <StopSearch id="from-stop" value={fromStop}
                onChange={v => { setFromStop(v); localStorage.setItem("city_from", v); setResults(null); setFormCollapsed(false); }}
                placeholder={t.stopPlaceholder} />
            </div>
            <div style={{padding:"8px 12px 8px"}}>
              <div className="city-stop-label">{t.toLabel}</div>
              <StopSearch id="to-stop" value={toStop}
                onChange={v => { setToStop(v); localStorage.setItem("city_to", v); setResults(null); setFormCollapsed(false); }}
                placeholder={t.stopPlaceholder} />
            </div>
            <div style={{padding:"8px 10px 10px"}}>
              <button
                className="v1-btn primary"
                style={{ width:"100%", justifyContent:"center", opacity: canPlan ? 1 : 0.4, cursor: canPlan ? "pointer" : "not-allowed" }}
                onClick={canPlan ? plan : undefined}
              >{t.searchBtn}</button>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Results */}
      {results === null ? (
        <div className="v1-empty">
          <div className="v1-empty-emoji">🗺️</div>
          <div className="v1-empty-title">{t.selectStops}</div>
          <div className="v1-empty-hint">{t.selectStopsHint}</div>
        </div>
      ) : results.length === 0 ? (
        <div className="v1-empty">
          <div className="v1-empty-emoji">😔</div>
          <div className="v1-empty-title">{t.noRoutesCity}</div>
          <div className="v1-empty-hint">
            {t.noRoutesHintCity}{" "}
            <strong>{fromStop}</strong> → <strong>{toStop}</strong>{lang === "hu" ? " között." : "."}
          </div>
        </div>
      ) : (
        <>
          {/* Hero banner — best result */}
          <div className="city-hero-banner">
            <div>
              <div style={{ fontSize: 11, opacity: 0.85, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>
                {t.bestRoute}
              </div>
              <div style={{ fontSize: isMobile ? 28 : 52, fontWeight: 900, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
                {U.fmtTime(results[0].arriveAt)}
              </div>
              <div style={{ fontSize: 12, opacity: 0.9, marginTop: 3 }}>
                {toStop} · {results[0].totalDuration} {t.min}
              </div>
            </div>
            {!isMobile && (
              <div style={{ textAlign:"center" }}>
                <div style={{ fontSize:11, opacity:0.7, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:4 }}>
                  {lang === "hu" ? "Keresési idő" : "Search time"}
                </div>
                <div style={{ fontSize:42, fontWeight:900, lineHeight:1, fontVariantNumeric:"tabular-nums" }}>
                  {timeMode === "now" ? (t.nowBtn || "MOST") : customTime}
                </div>
                <div style={{ fontSize:13, opacity:0.85, marginTop:5 }}>
                  {dayOffset === 0 ? (t.today || "Ma") : dayOffset === 1 ? (t.tomorrow || "Holnap") : (() => { const d = new Date(); d.setDate(d.getDate() + dayOffset); return d.toLocaleDateString(lang === "hu" ? "hu-HU" : "en-US", { weekday: "long" }); })()}
                  {schoolHoliday ? " · 🏖️" : ""}
                </div>
              </div>
            )}
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, opacity: 0.85 }}>{results.length} {t.routesCount}</div>
              <div style={{ fontSize: isMobile ? 17 : 36, fontWeight: 900, lineHeight: 1, marginTop: 4 }}>
                {results[0].type === "direct" ? t.direct : t.oneTransfer}
              </div>
              <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>
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
                lang={lang}
              />
            ))}
          </div>
        </>
      )}

      <CityMobilePill
        timeMode={timeMode} setTimeMode={setTimeMode}
        customTime={customTime} setCustomTime={setCustomTime}
        dayOffset={dayOffset} setDayOffset={setDayOffset}
        schoolHoliday={schoolHoliday} setSchoolHoliday={setSchoolHoliday}
        canPlan={canPlan} plan={plan} lang={lang}
        onTimetable={id => setTimetableBusId(id)}
        open={sheetOpen} openSheet={openSheet} onClose={closeSheet}
      />


    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<CityApp />);