// ============================================================
// Route Card — egy útvonal-javaslat megjelenítése
// ============================================================

function RouteCard({ route, index, isPrimary, t, style, isWeekend, dayType, nowMins }) {
  const [expanded, setExpanded] = React.useState(false);
  const [timetableInfo, setTimetableInfo] = React.useState(null);
  const [mapOpen, setMapOpen] = React.useState(false);
  const U = window.BUS_UTILS;

  const fmt = (m) => U.fmtTime(m);
  const totalMin = route.totalDuration;
  const totalH = Math.floor(totalMin / 60);
  const totalM = totalMin % 60;
  const totalStr = totalH > 0 ? `${totalH}${t.hour} ${totalM}${t.min}` : `${totalM} ${t.min}`;

  const busColor = route.localBus.color;

  return (
    <div className={`route-card ${style} ${isPrimary ? "primary" : ""}`}>
      {timetableInfo && (
        <window.BusTimetableModal busId={timetableInfo.busId} fromStop={timetableInfo.fromStop} onClose={() => setTimetableInfo(null)} isWeekend={isWeekend} dayType={dayType} nowMins={nowMins} />
      )}

      <div className="route-card-header">
        <span className="route-card-badge">
          {isPrimary ? `⭐ ${t.best}` : `${t.alternative} ${index}`}
        </span>
        <span className="route-card-total">
          🏠 {fmt(route.localArriveCsererdo)} · {totalStr}
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
      {route.homeStop && route.homeStop !== "Csererdő" && (
        <div style={{fontSize:12,opacity:0.7,marginBottom:4,fontWeight:700}}>📍 Leszállás: {route.homeStop}</div>
      )}

      <div className="route-steps">
        {/* Step 1: Indulás otthonról/iskolából */}
        <div className="route-step step-walk">
          <div className="step-time">{fmt(route.departLeaveHome)}</div>
          <div className="step-icon">🚶</div>
          <div className="step-body">
            <div className="step-title">{t.leaveAt}</div>
            <div className="step-sub">{t.school}</div>
          </div>
        </div>

        <div className="step-connector">
          <div className="connector-line" />
          <div className="connector-label">{t.walkTo}</div>
        </div>

        {/* Step 2: Helyközi busz */}
        <div className="route-step step-bus-1">
          <div className="step-time">{fmt(route.helykoziDep)}</div>
          <div className="step-icon bus-icon-regional">🚌</div>
          <div className="step-body">
            <div className="step-title">{t.catchBus} {route.helykoziLine && <span style={{background:'#2B1E3F',color:'#FFF7EC',padding:'2px 8px',borderRadius:8,fontSize:12,marginLeft:6}}>#{route.helykoziLine}</span>}</div>
            <div className="step-sub">Nemesvámos, autóbusz-váróterem → {route.transferStopShort || route.transferStop}</div>
          </div>
        </div>

        <div className="step-connector">
          <div className="connector-line" />
          <div className="connector-label">
            {route.helykoziArrive - route.helykoziDep} {t.min}
          </div>
        </div>

        {/* Step 3: Átszállás */}
        <div className="route-step step-transfer">
          <div className="step-time">{fmt(route.helykoziArrive)}</div>
          <div className="step-icon">🔄</div>
          <div className="step-body">
            <div className="step-title">{t.transfer}</div>
            <div className="step-sub">{route.transferStop}</div>
            <div className="wait-pill">
              ⏱ {route.waitAtTransfer} {t.min} {t.waitTime}
            </div>
          </div>
        </div>

        <div className="step-connector">
          <div className="connector-line" />
        </div>

        {/* Step 4: Helyi busz */}
        <div className="route-step step-bus-2">
          <div className="step-time">{fmt(route.localBoardAt)}</div>
          <div
            className="step-icon bus-icon-local"
            style={{ background: busColor, cursor: 'pointer' }}
            title="Menetrend megtekintése"
            onClick={() => setTimetableInfo({ busId: route.localBus.id, fromStop: route.localBus.stops[0].name })}
          >
            {route.localBus.id}
          </div>
          <div className="step-body">
            <div className="step-title">
              {t.takeLocal}{" "}
              <span style={{ color: busColor, fontWeight: 800 }}>
                {route.localBus.label}
              </span>
            </div>
            <div className="step-sub">{route.localBus.direction}</div>
          </div>
        </div>

        <div className="step-connector">
          <div className="connector-line" />
          <div className="connector-label">
            {route.localArriveCsererdo - route.localBoardAt} {t.min}
          </div>
        </div>

        {/* Step 5: Hazaérkezés */}
        <div className="route-step step-home">
          <div className="step-time">{fmt(route.localArriveCsererdo)}</div>
          <div className="step-icon step-icon-home">🏡</div>
          <div className="step-body">
            <div className="step-title" style={{ fontWeight: 800 }}>
              {route.homeStop && route.homeStop !== "Csererdő" ? route.homeStop : t.home}
            </div>
            <div className="step-sub">{t.arriveAt}</div>
          </div>
        </div>
      </div>

      <button
        className="route-expand-btn"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? t.hideMoreStops : t.showMoreStops} ▾
      </button>

      {mapOpen && <HomeRouteMap route={route} />}

      {expanded && (
        <div className="route-details">
          <div className="details-title">{t.thisBusPasses}</div>
          <div className="details-stops">
            {route.localBus.stops.map((s, i) => {
              const isTransfer = s.name === route.transferStop.replace("Veszprém, ", "") ||
                s.name === "Komakút tér / Pannon Egyetem" && route.transferStop.includes("Komakút");
              const isHome = s.name === "Csererdő";
              const transferOffset = U.stopOffset(route.localBus, route.localBus.stops.find(ss => route.transferStop.includes(ss.name.split(" /")[0]))?.name || s.name);
              const fromBoard = route.localBoardAt - (route.localBus.stops.find(ss => route.transferStop.includes(ss.name.split(" /")[0]))?.offset || 0);
              const absTime = fromBoard + s.offset;
              return (
                <div
                  key={i}
                  className={`detail-stop ${isHome ? "home" : ""}`}
                >
                  <span className="detail-stop-time">{fmt(absTime)}</span>
                  <span className="detail-stop-dot" style={{ background: busColor }} />
                  <span className="detail-stop-name">{s.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function normStop(name) {
  return (name || '').replace(/^Veszprém,\s*/, 'Veszprém ').trim();
}

function HomeRouteMap({ route }) {
  const mapRef = React.useRef(null);
  const containerRef = React.useRef(null);
  const instanceRef = React.useRef(null);
  const routeKey = `${route.helykoziLine}-${route.helykoziDep}-${route.transferStop}`;

  React.useEffect(() => {
    if (!mapRef.current || instanceRef.current) return;

    const map = L.map(mapRef.current, { zoomControl: true });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(map);

    const allCoords = [];
    const fmt = m => window.BUS_UTILS.fmtTime(m);

    // 1. Helyközi szakasz: Nemesvámos → transferStop
    const nemoLat = 47.056110, nemoLon = 17.870028;
    const homeShapes = (window.HOME_SHAPES || {})[route.helykoziLine] || [];
    const volanLat = route.transferLat, volanLon = route.transferLon;
    const hkColor = '#2B1E3F';

    if (volanLat && homeShapes.length) {
      const b = window.BUS_UTILS.bestShape(homeShapes, nemoLat, nemoLon, volanLat, volanLon);
      if (b) {
        const seg = [[nemoLat, nemoLon], ...b.s.slice(b.fi + 1, b.ti), [volanLat, volanLon]];
        L.polyline(seg, { color: hkColor, weight: 5, opacity: 0.85 }).addTo(map);
        allCoords.push(...seg);
      }
    }
    // Helyközi terminál jelölők időcímkével
    [[nemoLat, nemoLon, 'Nemesvámos, autóbusz-váróterem', route.helykoziDep],
     [volanLat, volanLon, route.transferStop, route.helykoziArrive]].forEach(([lat, lon, name, time]) => {
      if (!lat || !lon) return;
      L.circleMarker([lat, lon], { radius: 9, color: 'white', weight: 2, fillColor: hkColor, fillOpacity: 0.95 })
        .addTo(map).bindPopup(`<b>${name}</b>${time != null ? `<br>${fmt(time)}` : ''}`);
      if (time != null) {
        const labelHtml = `<div style="position:absolute;left:14px;top:-10px;background:white;border:1.5px solid ${hkColor};border-radius:4px;padding:1px 6px;font-size:11px;font-weight:700;color:#222;white-space:nowrap;box-shadow:0 1px 3px rgba(0,0,0,0.15);">${fmt(time)}</div>`;
        L.marker([lat, lon], { icon: L.divIcon({ className: '', html: labelHtml, iconSize: [0, 0], iconAnchor: [0, 0] }), interactive: false, zIndexOffset: 200 }).addTo(map);
      }
    });

    // 2. Helyi busz szakasz: transferStop → homeStop
    const localBus = route.localBus;
    const cityShapes = (window.CITY_SHAPES || {})[localBus.id] || [];
    const homeStopName = route.homeStop || 'Csererdő';
    const boardStopIdx = localBus.stops.findIndex(s => normStop(s.name) === normStop(route.transferStop) || route.transferStop?.includes(s.name.split(' /')[0]));
    const homeStopIdx  = localBus.stops.findIndex(s => s.name === homeStopName);
    const boardStop = localBus.stops[boardStopIdx];
    const homeStop  = localBus.stops[homeStopIdx];
    const localDep  = boardStop ? route.localBoardAt - boardStop.offset : null;

    if (boardStop?.lat && homeStop?.lat && cityShapes.length) {
      const b = window.BUS_UTILS.bestShape(cityShapes, boardStop.lat, boardStop.lon, homeStop.lat, homeStop.lon);
      if (b) {
        const seg = [[boardStop.lat, boardStop.lon], ...b.s.slice(b.fi + 1, b.ti), [homeStop.lat, homeStop.lon]];
        L.polyline(seg, { color: localBus.color, weight: 5, opacity: 0.85 }).addTo(map);
        allCoords.push(...seg);
      }
    }
    // Helyi busz megállók karikákkal, nyilakkal, időcímkékkel
    if (boardStopIdx >= 0 && homeStopIdx >= 0) {
      const segStops = localBus.stops.slice(boardStopIdx, homeStopIdx + 1).filter(s => s.lat && s.lon);
      segStops.forEach((stop, i) => {
        const isTerminal = i === 0 || i === segStops.length - 1;
        const r = isTerminal ? 9 : 6;
        const time = localDep !== null ? localDep + stop.offset : null;
        L.circleMarker([stop.lat, stop.lon], {
          radius: r, color: 'white', weight: 2,
          fillColor: localBus.color, fillOpacity: 0.95,
        }).addTo(map).bindPopup(`<b>${stop.name}</b>${time !== null ? `<br>${fmt(time)}` : ''}`);
        if (time !== null) {
          const labelHtml = `<div style="position:absolute;left:${r + 5}px;top:-10px;background:white;border:1.5px solid ${localBus.color};border-radius:4px;padding:1px 6px;font-size:11px;font-weight:700;color:#222;white-space:nowrap;box-shadow:0 1px 3px rgba(0,0,0,0.15);">${fmt(time)}</div>`;
          L.marker([stop.lat, stop.lon], {
            icon: L.divIcon({ className: '', html: labelHtml, iconSize: [0, 0], iconAnchor: [0, 0] }),
            interactive: false, zIndexOffset: 200,
          }).addTo(map);
        }
        if (!isTerminal && i > 0) {
          const prev = segStops[i - 1], next = segStops[i + 1] || stop;
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

    instanceRef.current = map;
    setTimeout(() => {
      map.invalidateSize();
      if (allCoords.length >= 2) map.fitBounds(allCoords, { padding: [24, 24] });
      else map.setView([47.09, 17.91], 13);
    }, 200);

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
    <div ref={containerRef} style={{ borderTop: '2px solid var(--line)', position: 'relative' }}>
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

window.RouteCard = RouteCard;

// ============================================================
// School Route Card — reggeli útvonal (Csererdő → Nemesvámos)
// ============================================================

function SchoolRouteCard({ route, index, isPrimary, t, isWeekend, dayType, nowMins }) {
  const U = window.BUS_UTILS;
  const [timetableInfo, setTimetableInfo] = React.useState(null);
  const [mapOpen, setMapOpen] = React.useState(false);
  const fmt = (m) => U.fmtTime(m);
  const totalMin = route.totalDuration;
  const totalH = Math.floor(totalMin / 60);
  const totalM = totalMin % 60;
  const totalStr = totalH > 0 ? `${totalH}${t.hour} ${totalM}${t.min}` : `${totalM} ${t.min}`;
  const busColor = route.localBus.color;
  const hasWalk = route.walkAfterBus > 0;

  return (
    <div className={`route-card ${isPrimary ? "primary" : ""}`}>
      {timetableInfo && (
        <window.BusTimetableModal busId={timetableInfo.busId} fromStop={timetableInfo.fromStop} onClose={() => setTimetableInfo(null)} isWeekend={isWeekend} dayType={dayType} nowMins={nowMins} />
      )}

      <div className="route-card-header">
        <span className="route-card-badge">
          {isPrimary ? `⭐ ${t.best}` : `${t.alternative} ${index}`}
        </span>
        <span className="route-card-total">
          🏫 {fmt(route.arriveSchool)} · {totalStr}
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
        {/* Step 1: Helyi busz Csererdőről */}
        <div className="route-step step-bus-2">
          <div className="step-time">{fmt(route.localBoardAt)}</div>
          <div
            className="step-icon bus-icon-local"
            style={{ background: busColor, cursor: 'pointer' }}
            title="Menetrend megtekintése"
            onClick={() => setTimetableInfo({ busId: route.localBus.id, fromStop: route.localBus.stops[0].name })}
          >
            {route.localBus.id}
          </div>
          <div className="step-body">
            <div className="step-title">
              {t.catchLocal}{" "}
              <span style={{ color: busColor, fontWeight: 800 }}>
                {route.localBus.label}
              </span>
            </div>
            <div className="step-sub">Csererdő → {route.transferStopShort}</div>
          </div>
        </div>

        <div className="step-connector">
          <div className="connector-line" />
          <div className="connector-label">
            {route.localArriveAtTransfer - route.localBoardAt} {t.min}
          </div>
        </div>

        {hasWalk && (
          <>
            <div className="route-step step-transfer">
              <div className="step-time">{fmt(route.localArriveAtTransfer)}</div>
              <div className="step-icon">🚶</div>
              <div className="step-body">
                <div className="step-title">{t.walkBetween}</div>
                <div className="step-sub">Petőfi Színház → Komakút tér</div>
              </div>
            </div>
            <div className="step-connector">
              <div className="connector-line" />
              <div className="connector-label">{route.walkAfterBus} {t.min}</div>
            </div>
          </>
        )}

        <div className="route-step step-transfer">
          <div className="step-time">{fmt(route.transferReadyAt)}</div>
          <div className="step-icon">🔄</div>
          <div className="step-body">
            <div className="step-title">{t.transfer}</div>
            <div className="step-sub">{hasWalk ? "Komakút tér / Pannon Egyetem" : route.transferStop}</div>
            <div className="wait-pill">
              ⏱ {route.waitAtTransfer} {t.min} {t.waitTime}
            </div>
          </div>
        </div>

        <div className="step-connector">
          <div className="connector-line" />
        </div>

        <div className="route-step step-bus-1">
          <div className="step-time">{fmt(route.helykoziDep)}</div>
          <div className="step-icon bus-icon-regional">🚌</div>
          <div className="step-body">
            <div className="step-title">
              {t.catchRegional}
              {route.helykoziLine && <span style={{background:'#2B1E3F',color:'#FFF7EC',padding:'2px 8px',borderRadius:8,fontSize:12,marginLeft:6}}>#{route.helykoziLine}</span>}
              {route.helykoziDepBuszall != null && <span style={{fontSize:12,marginLeft:6,opacity:0.7}}>({fmt(route.helykoziDepBuszall)})</span>}
            </div>
            <div className="step-sub">{(hasWalk ? "Komakút tér" : route.transferStopShort)} → Nemesvámos</div>
          </div>
        </div>

        <div className="step-connector">
          <div className="connector-line" />
          <div className="connector-label">
            {route.helykoziArrive - route.helykoziDep} {t.min}
          </div>
        </div>

        <div className="route-step step-transfer">
          <div className="step-time">{fmt(route.helykoziArrive)}</div>
          <div className="step-icon">🚏</div>
          <div className="step-body">
            <div className="step-title">{t.schoolStop}</div>
            <div className="step-sub">Nemesvámos, autóbusz-váróterem</div>
          </div>
        </div>

        <div className="step-connector">
          <div className="connector-line" />
          <div className="connector-label">{route.walkToSchool} {t.min} {t.walkLabel || "gyalog"}</div>
        </div>

        <div className="route-step step-home">
          <div className="step-time">{fmt(route.arriveSchool)}</div>
          <div className="step-icon step-icon-home">🏫</div>
          <div className="step-body">
            <div className="step-title" style={{ fontWeight: 800 }}>
              {t.arriveSchool}
            </div>
            <div className="step-sub">Nemesvámos, iskola</div>
          </div>
        </div>
      </div>
      {mapOpen && <SchoolRouteMap route={route} />}
    </div>
  );
}

function SchoolRouteMap({ route }) {
  const mapRef = React.useRef(null);
  const containerRef = React.useRef(null);
  const instanceRef = React.useRef(null);
  const routeKey = `${route.helykoziLine}-${route.helykoziDep}-${route.transferStop}`;

  React.useEffect(() => {
    if (!mapRef.current || instanceRef.current) return;

    const map = L.map(mapRef.current, { zoomControl: true });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(map);

    const allCoords = [];
    const fmt = m => window.BUS_UTILS.fmtTime(m);

    const nemoLat = 47.056110, nemoLon = 17.870028;
    const volanLat = route.transferLat, volanLon = route.transferLon;
    const hkColor = '#2B1E3F';

    // 1. Helyi busz: startStop → transferStop
    const localBus = route.localBus;
    const cityShapes = (window.CITY_SHAPES || {})[localBus.id] || [];
    const startStop = localBus.stops[0];
    const transferStopIdx = localBus.stops.findIndex(s => normStop(s.name) === normStop(route.transferStop) || route.transferStop?.includes(s.name.split(' /')[0]));
    const transferStop = localBus.stops[transferStopIdx];
    const localDep = startStop ? route.localBoardAt - startStop.offset : null;

    if (startStop?.lat && transferStop?.lat && cityShapes.length) {
      const b = window.BUS_UTILS.bestShape(cityShapes, startStop.lat, startStop.lon, transferStop.lat, transferStop.lon);
      if (b) {
        const seg = [[startStop.lat, startStop.lon], ...b.s.slice(b.fi + 1, b.ti), [transferStop.lat, transferStop.lon]];
        L.polyline(seg, { color: localBus.color, weight: 5, opacity: 0.85 }).addTo(map);
        allCoords.push(...seg);
      }
    }
    if (transferStopIdx >= 0) {
      const segStops = localBus.stops.slice(0, transferStopIdx + 1).filter(s => s.lat && s.lon);
      segStops.forEach((stop, i) => {
        const isTerminal = i === 0 || i === segStops.length - 1;
        const r = isTerminal ? 9 : 6;
        const time = localDep !== null ? localDep + stop.offset : null;
        L.circleMarker([stop.lat, stop.lon], { radius: r, color: 'white', weight: 2, fillColor: localBus.color, fillOpacity: 0.95 })
          .addTo(map).bindPopup(`<b>${stop.name}</b>${time !== null ? `<br>${fmt(time)}` : ''}`);
        if (time !== null) {
          const labelHtml = `<div style="position:absolute;left:${r + 5}px;top:-10px;background:white;border:1.5px solid ${localBus.color};border-radius:4px;padding:1px 6px;font-size:11px;font-weight:700;color:#222;white-space:nowrap;box-shadow:0 1px 3px rgba(0,0,0,0.15);">${fmt(time)}</div>`;
          L.marker([stop.lat, stop.lon], { icon: L.divIcon({ className: '', html: labelHtml, iconSize: [0, 0], iconAnchor: [0, 0] }), interactive: false, zIndexOffset: 200 }).addTo(map);
        }
        if (!isTerminal && i > 0) {
          const prev = segStops[i - 1], next = segStops[i + 1] || stop;
          const dy = next.lat - prev.lat, dx = next.lon - prev.lon;
          const angle = Math.atan2(dx, dy) * 180 / Math.PI;
          const svg = `<svg xmlns="http://www.w3.org/2000/svg" style="position:absolute;left:-12px;top:-32px;transform-origin:12px 32px;transform:rotate(${angle}deg)" width="24" height="40"><polygon points="12,6 19,26 12,19 5,26" fill="black" stroke="white" stroke-width="2" stroke-linejoin="round"/></svg>`;
          L.marker([stop.lat, stop.lon], { icon: L.divIcon({ className: '', html: svg, iconSize: [0, 0], iconAnchor: [0, 0] }), interactive: false, zIndexOffset: 100 }).addTo(map);
        }
      });
    }

    // 2. Helyközi: transferStop → Nemesvámos
    const homeShapes = (window.HOME_SHAPES || {})[route.helykoziLine] || [];
    if (volanLat && homeShapes.length) {
      const b = window.BUS_UTILS.bestShape(homeShapes, volanLat, volanLon, nemoLat, nemoLon);
      if (b) {
        const seg = [[volanLat, volanLon], ...b.s.slice(b.fi + 1, b.ti), [nemoLat, nemoLon]];
        L.polyline(seg, { color: hkColor, weight: 5, opacity: 0.85 }).addTo(map);
        allCoords.push(...seg);
      }
    }
    [[volanLat, volanLon, route.transferStop, route.helykoziDep],
     [nemoLat, nemoLon, 'Nemesvámos, autóbusz-váróterem', route.helykoziArrive]].forEach(([lat, lon, name, time]) => {
      if (!lat || !lon) return;
      L.circleMarker([lat, lon], { radius: 9, color: 'white', weight: 2, fillColor: hkColor, fillOpacity: 0.95 })
        .addTo(map).bindPopup(`<b>${name}</b>${time != null ? `<br>${fmt(time)}` : ''}`);
      if (time != null) {
        const labelHtml = `<div style="position:absolute;left:14px;top:-10px;background:white;border:1.5px solid ${hkColor};border-radius:4px;padding:1px 6px;font-size:11px;font-weight:700;color:#222;white-space:nowrap;box-shadow:0 1px 3px rgba(0,0,0,0.15);">${fmt(time)}</div>`;
        L.marker([lat, lon], { icon: L.divIcon({ className: '', html: labelHtml, iconSize: [0, 0], iconAnchor: [0, 0] }), interactive: false, zIndexOffset: 200 }).addTo(map);
      }
    });

    instanceRef.current = map;
    setTimeout(() => {
      map.invalidateSize();
      if (allCoords.length >= 2) map.fitBounds(allCoords, { padding: [24, 24] });
      else map.setView([47.09, 17.91], 13);
    }, 200);

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
    <div ref={containerRef} style={{ borderTop: '2px solid var(--line)', position: 'relative' }}>
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

window.SchoolRouteCard = SchoolRouteCard;
