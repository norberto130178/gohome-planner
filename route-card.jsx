// ============================================================
// Route Card — egy útvonal-javaslat megjelenítése
// ============================================================

function RouteCard({ route, index, isPrimary, t, style, isWeekend, nowMins }) {
  const [expanded, setExpanded] = React.useState(isPrimary);
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
        <window.BusTimetableModal busId={timetableInfo.busId} fromStop={timetableInfo.fromStop} onClose={() => setTimetableInfo(null)} isWeekend={isWeekend} nowMins={nowMins} />
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
  const instanceRef = React.useRef(null);
  const routeKey = `${route.helykoziLine}-${route.helykoziDep}-${route.transferStop}`;

  React.useEffect(() => {
    if (!mapRef.current || instanceRef.current) return;

    const map = L.map(mapRef.current, { zoomControl: true });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(map);

    const allCoords = [];

    function addMarker(lat, lon, color, label) {
      L.circleMarker([lat, lon], {
        radius: 8, color: 'white', weight: 2.5,
        fillColor: color, fillOpacity: 1,
      }).addTo(map).bindPopup(label);
    }

    // 1. Helyközi szakasz: Nemesvámos → transferStop
    const nemoLat = 47.056110, nemoLon = 17.870028;
    const homeShapes = (window.HOME_SHAPES || {})[route.helykoziLine] || [];
    const volanLat = route.transferLat, volanLon = route.transferLon;

    if (volanLat && homeShapes.length) {
      const b = window.BUS_UTILS.bestShape(homeShapes, nemoLat, nemoLon, volanLat, volanLon);
      if (b) {
        const seg = [[nemoLat, nemoLon], ...b.s.slice(b.fi + 1, b.ti), [volanLat, volanLon]];
        L.polyline(seg, { color: '#2B1E3F', weight: 5, opacity: 0.85 }).addTo(map);
        allCoords.push(...seg);
        addMarker(nemoLat, nemoLon, '#2B1E3F', 'Nemesvámos, autóbusz-váróterem');
        addMarker(volanLat, volanLon, '#2B1E3F', route.transferStop);
      }
    }

    // 2. Helyi busz szakasz: transferStop → homeStop (koordináták route.localBus.stops-ból)
    const localBus = route.localBus;
    const cityShapes = (window.CITY_SHAPES || {})[localBus.id] || [];
    const homeStopName = route.homeStop || 'Csererdő';
    const boardStop = localBus.stops.find(s => normStop(s.name) === normStop(route.transferStop) || route.transferStop?.includes(s.name.split(' /')[0]));
    const homeStop  = localBus.stops.find(s => s.name === homeStopName);

    if (boardStop?.lat && homeStop?.lat && cityShapes.length) {
      const b = window.BUS_UTILS.bestShape(cityShapes, boardStop.lat, boardStop.lon, homeStop.lat, homeStop.lon);
      if (b) {
        const seg = [[boardStop.lat, boardStop.lon], ...b.s.slice(b.fi + 1, b.ti), [homeStop.lat, homeStop.lon]];
        L.polyline(seg, { color: localBus.color, weight: 5, opacity: 0.85 }).addTo(map);
        allCoords.push(...seg);
        addMarker(boardStop.lat, boardStop.lon, localBus.color, route.transferStop);
        addMarker(homeStop.lat, homeStop.lon, localBus.color, homeStopName);
      }
    }

    instanceRef.current = map;
    setTimeout(() => {
      map.invalidateSize();
      if (allCoords.length >= 2) map.fitBounds(allCoords, { padding: [24, 24] });
      else map.setView([47.09, 17.91], 13);
    }, 200);

    return () => { map.remove(); instanceRef.current = null; };
  }, [routeKey]);

  function toggleFullscreen() {
    const el = mapRef.current;
    if (!el) return;
    if (!document.fullscreenElement) el.requestFullscreen();
    else document.exitFullscreen();
  }

  return (
    <div style={{ borderTop: '2px solid var(--line)', position: 'relative' }}>
      <div ref={mapRef} style={{ height: 300, width: '100%' }} />
      <button onClick={toggleFullscreen} title="Teljes képernyő" style={{
        position: 'absolute', bottom: 10, right: 10, zIndex: 1000,
        background: 'white', border: '2px solid #ccc',
        borderRadius: 8, padding: '4px 8px', cursor: 'pointer',
        fontSize: 16, lineHeight: 1, boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
      }}>⛶</button>
    </div>
  );
}

window.RouteCard = RouteCard;

// ============================================================
// School Route Card — reggeli útvonal (Csererdő → Nemesvámos)
// ============================================================

function SchoolRouteCard({ route, index, isPrimary, t, isWeekend, nowMins }) {
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
        <window.BusTimetableModal busId={timetableInfo.busId} fromStop={timetableInfo.fromStop} onClose={() => setTimetableInfo(null)} isWeekend={isWeekend} nowMins={nowMins} />
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
  const instanceRef = React.useRef(null);
  const routeKey = `${route.helykoziLine}-${route.helykoziDep}-${route.transferStop}`;

  React.useEffect(() => {
    if (!mapRef.current || instanceRef.current) return;

    const map = L.map(mapRef.current, { zoomControl: true });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(map);

    const allCoords = [];



    function addMarker(coord, color, label) {
      L.circleMarker(coord, { radius: 8, color: 'white', weight: 2.5, fillColor: color, fillOpacity: 1 })
        .addTo(map).bindPopup(label);
    }

    const nemoLat = 47.056110, nemoLon = 17.870028;
    const volanLat = route.transferLat, volanLon = route.transferLon;

    // 1. Helyi busz: Csererdő → transferStop (koordináták LOCAL_BUSES stops-ból)
    const localBus = route.localBus;
    const cityShapes = (window.CITY_SHAPES || {})[localBus.id] || [];
    const startStop    = localBus.stops[0];
    const transferStop = localBus.stops.find(s => normStop(s.name) === normStop(route.transferStop) || route.transferStop?.includes(s.name.split(' /')[0]));

    if (startStop?.lat && transferStop?.lat && cityShapes.length) {
      const b = window.BUS_UTILS.bestShape(cityShapes, startStop.lat, startStop.lon, transferStop.lat, transferStop.lon);
      if (b) {
        const seg = [[startStop.lat, startStop.lon], ...b.s.slice(b.fi + 1, b.ti), [transferStop.lat, transferStop.lon]];
        L.polyline(seg, { color: localBus.color, weight: 5, opacity: 0.85 }).addTo(map);
        allCoords.push(...seg);
        addMarker([startStop.lat, startStop.lon], localBus.color, startStop.name);
        addMarker([transferStop.lat, transferStop.lon], localBus.color, route.transferStop);
      }
    }

    // 2. Helyközi: transferStop → Nemesvámos (Volánbusz koordináta a route-ból)
    const homeShapes = (window.HOME_SHAPES || {})[route.helykoziLine] || [];
    if (volanLat && homeShapes.length) {
      const b = window.BUS_UTILS.bestShape(homeShapes, volanLat, volanLon, nemoLat, nemoLon);
      if (b) {
        const seg = [[volanLat, volanLon], ...b.s.slice(b.fi + 1, b.ti), [nemoLat, nemoLon]];
        L.polyline(seg, { color: '#2B1E3F', weight: 5, opacity: 0.85 }).addTo(map);
        allCoords.push(...seg);
        addMarker([volanLat, volanLon], '#2B1E3F', route.transferStop);
        addMarker([nemoLat, nemoLon], '#2B1E3F', 'Nemesvámos, autóbusz-váróterem');
      }
    }

    instanceRef.current = map;
    setTimeout(() => {
      map.invalidateSize();
      if (allCoords.length >= 2) map.fitBounds(allCoords, { padding: [24, 24] });
      else map.setView([47.09, 17.91], 13);
    }, 200);

    return () => { map.remove(); instanceRef.current = null; };
  }, [routeKey]);

  function toggleFullscreen() {
    const el = mapRef.current;
    if (!el) return;
    if (!document.fullscreenElement) el.requestFullscreen();
    else document.exitFullscreen();
  }

  return (
    <div style={{ borderTop: '2px solid var(--line)', position: 'relative' }}>
      <div ref={mapRef} style={{ height: 300, width: '100%' }} />
      <button onClick={toggleFullscreen} title="Teljes képernyő" style={{
        position: 'absolute', bottom: 10, right: 10, zIndex: 1000,
        background: 'white', border: '2px solid #ccc',
        borderRadius: 8, padding: '4px 8px', cursor: 'pointer',
        fontSize: 16, lineHeight: 1, boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
      }}>⛶</button>
    </div>
  );
}

window.SchoolRouteCard = SchoolRouteCard;
