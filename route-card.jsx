// ============================================================
// Route Card — egy útvonal-javaslat megjelenítése
// ============================================================

function scrollCardBottom(cardEl) {
  if (!cardEl) return;
  const rect = cardEl.getBoundingClientRect();
  const extra = rect.bottom - window.innerHeight + 80;
  if (extra > 0) window.scrollTo({ top: window.pageYOffset + extra, behavior: 'smooth' });
}

function RouteCard({ route, index, isPrimary, t, style, isWeekend, dayType, nowMins, schoolData }) {
  const [expanded, setExpanded] = React.useState(false);
  const [timetableInfo, setTimetableInfo] = React.useState(null);
  const [mapOpen, setMapOpen] = React.useState(false);
  const cardRef = React.useRef(null);
  React.useEffect(() => {
    if (!mapOpen) return;
    setTimeout(() => scrollCardBottom(cardRef.current), 50);
  }, [mapOpen]);
  const U = window.BUS_UTILS;

  const fmt = (m) => U.fmtTime(m);
  const totalMin = route.totalDuration;
  const totalH = Math.floor(totalMin / 60);
  const totalM = totalMin % 60;
  const totalStr = totalH > 0 ? `${totalH}${t.hour} ${totalM}${t.min}` : `${totalM} ${t.min}`;

  const busColor = route.localBus.color;

  const localTransferStop = route.localBus.stops.find(ss => ss.name === route.transferLocalStop);
  const fromBoard = route.localBoardAt - (localTransferStop?.offset || 0);
  const localTransferIdx = localTransferStop ? route.localBus.stops.indexOf(localTransferStop) : 0;
  const localHomeIdx = route.localBus.stops.findIndex(ss => ss.name === route.homeStop);
  const visibleStops = route.localBus.stops.slice(localTransferIdx, localHomeIdx >= 0 ? localHomeIdx + 1 : undefined);

  return (
    <div ref={cardRef} className={`route-card ${style} ${isPrimary ? "primary" : ""}`}>
      {timetableInfo && (
        <window.BusTimetableModal busId={timetableInfo.busId} fromStop={timetableInfo.fromStop} initialDep={timetableInfo.initialDep} onClose={() => setTimetableInfo(null)} isWeekend={isWeekend} dayType={dayType} nowMins={nowMins} />
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
            <div className="step-sub">{schoolData?.name || t.school}</div>
          </div>
        </div>

        <div className="step-connector">
          <div className="connector-line" />
          <div className="connector-label">{t.walkTo}{route.walkToSchool ? ` · ${route.walkToSchool} ${t.min}${route.walkToSchoolDist ? ` (${route.walkToSchoolDist} m)` : ""}` : ""}</div>
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
          <div className="step-icon">{route.walkAtTransfer ? "🚶" : "🔄"}</div>
          <div className="step-body">
            {route.walkAtTransfer ? (
              <>
                <div className="step-title">{route.transferStop} → {route.transferStop}</div>
                <div className="step-sub">{route.walkAtTransfer.walkMin} {t.min} gyalog · {route.walkAtTransfer.distM} m</div>
                {route.waitAtTransfer - route.walkAtTransfer.walkMin > 0 && (
                  <div className="wait-pill">⏱ {route.waitAtTransfer - route.walkAtTransfer.walkMin} {t.min} {t.waitTime}</div>
                )}
              </>
            ) : (
              <>
                <div className="step-title">{t.transfer}</div>
                <div className="step-sub">{route.transferStop}</div>
                <div className="wait-pill">⏱ {route.waitAtTransfer} {t.min} {t.waitTime}</div>
              </>
            )}
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
            onClick={() => setTimetableInfo({ busId: route.localBus.id, fromStop: route.localBus.stops[0].name, initialDep: route.localBoardAt })}
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
            {visibleStops.map((s, i) => {
              const isTransfer = i === 0;
              const isHome = s.name === route.homeStop;
              const absTime = fromBoard + s.offset;
              return (
                <div
                  key={i}
                  className={`detail-stop${isHome ? " home" : ""}${isTransfer ? " transfer" : ""}`}
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

    // 1b. Gyalogos átszállás: helyközi érkezési pont → helyi busz peronra
    // 2. Helyi busz szakasz: transferStop → homeStop
    const localBus = route.localBus;
    const cityShapes = (window.CITY_SHAPES || {})[localBus.id] || [];
    const homeStopName = route.homeStop || 'Csererdő';
    const boardStopIdx = localBus.stops.findIndex(s => s.name === route.transferLocalStop);
    const homeStopIdx  = localBus.stops.findIndex(s => s.name === homeStopName);
    const boardStop = localBus.stops[boardStopIdx];
    const homeStop  = localBus.stops[homeStopIdx];
    const localDep  = boardStop ? route.localBoardAt - boardStop.offset : null;

    if (route.walkAtTransfer && volanLat && boardStop?.lat) {
      L.polyline([[volanLat, volanLon], [boardStop.lat, boardStop.lon]], {
        color: '#555', weight: 3, opacity: 0.7, dashArray: '6,5'
      }).addTo(map);
      allCoords.push([volanLat, volanLon], [boardStop.lat, boardStop.lon]);
    }

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

function walkArc(lat1, lon1, lat2, lon2, steps = 24) {
  const dLat = lat2 - lat1, dLon = lon2 - lon1;
  const len = Math.sqrt(dLat * dLat + dLon * dLon);
  if (len === 0) return [[lat1, lon1], [lat2, lon2]];
  const offset = len * 0.35;
  const ctrlLat = (lat1 + lat2) / 2 - (dLon / len) * offset;
  const ctrlLon = (lon1 + lon2) / 2 + (dLat / len) * offset;
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    pts.push([
      (1-t)*(1-t)*lat1 + 2*(1-t)*t*ctrlLat + t*t*lat2,
      (1-t)*(1-t)*lon1 + 2*(1-t)*t*ctrlLon + t*t*lon2,
    ]);
  }
  return pts;
}

// ── CitySchoolRouteMap — Leaflet térkép a városi iskolás útvonalhoz ──
function CitySchoolRouteMap({ route, direction, schoolData }) {
  const mapRef = React.useRef(null);
  const containerRef = React.useRef(null);
  const instanceRef = React.useRef(null);
  const routeKey = `${route.type}-${route.bus1?.id}-${route.boardAt}`;

  React.useEffect(() => {
    if (!mapRef.current || instanceRef.current) return;
    const map = L.map(mapRef.current, { zoomControl: true });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(map);
    const allCoords = [];
    const fmt = m => window.BUS_UTILS.fmtTime(m);

    const nearestStopName = route.nearestStopName || schoolData?.nearbyStops?.[0]?.name || '';
    const homeStopName = route.homeStopName || '';
    const bus1FromName = direction === "school" ? homeStopName : nearestStopName;
    const bus1ToName = route.type === "transfer" ? route.transferStopName : (direction === "school" ? nearestStopName : homeStopName);
    const bus2ToName = direction === "school" ? nearestStopName : homeStopName;

    function drawSeg(bus, fromName, toName, boardTime) {
      if (!bus || !fromName || !toName) return;
      const shapes = (window.CITY_SHAPES || {})[bus.id] || [];
      const fromIdx = bus.stops.findIndex(s => s.name === fromName);
      const toIdx = bus.stops.findIndex(s => s.name === toName);
      if (fromIdx < 0 || toIdx < 0 || toIdx <= fromIdx) return;
      const fromStop = bus.stops[fromIdx];
      const toStop = bus.stops[toIdx];
      if (!fromStop.lat || !toStop.lat) return;
      const busStart = boardTime - fromStop.offset;

      if (shapes.length) {
        const b = window.BUS_UTILS.bestShape(shapes, fromStop.lat, fromStop.lon, toStop.lat, toStop.lon);
        if (b) {
          const seg = [[fromStop.lat, fromStop.lon], ...b.s.slice(b.fi + 1, b.ti), [toStop.lat, toStop.lon]];
          L.polyline(seg, { color: bus.color, weight: 5, opacity: 0.85 }).addTo(map);
          allCoords.push(...seg);
        }
      }

      const segStops = bus.stops.slice(fromIdx, toIdx + 1).filter(s => s.lat && s.lon);
      segStops.forEach((stop, i) => {
        const isTerminal = i === 0 || i === segStops.length - 1;
        const r = isTerminal ? 9 : 6;
        const time = busStart + stop.offset;
        L.circleMarker([stop.lat, stop.lon], { radius: r, color: 'white', weight: 2, fillColor: bus.color, fillOpacity: 0.95 })
          .addTo(map).bindPopup(`<b>${stop.name}</b><br>${fmt(time)}`);
        if (isTerminal) {
          const labelHtml = `<div style="position:absolute;left:${r + 5}px;top:-10px;background:white;border:1.5px solid ${bus.color};border-radius:4px;padding:1px 6px;font-size:11px;font-weight:700;color:#222;white-space:nowrap;box-shadow:0 1px 3px rgba(0,0,0,0.15);">${fmt(time)}</div>`;
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

    drawSeg(route.bus1, bus1FromName, bus1ToName, route.boardAt);
    if (route.type === "transfer") {
      const bus2StartName = route.walkToStop || route.transferStopName;
      drawSeg(route.bus2, bus2StartName, bus2ToName, route.boardAt2);
      if (route.walkTransfer) {
        const sA = route.bus1.stops.find(s => s.name === route.transferStopName);
        const sB = route.bus2.stops.find(s => s.name === bus2StartName);
        if (sA?.lat && sB?.lat) {
          L.polyline([[sA.lat, sA.lon], [sB.lat, sB.lon]], {
            color: '#555', weight: 3, opacity: 0.7, dashArray: '6,5'
          }).addTo(map);
          allCoords.push([sA.lat, sA.lon], [sB.lat, sB.lon]);
        }
      }
    }

    if (direction === "school" && schoolData?.lat && schoolData?.lon) {
      const dropoff = schoolData.nearbyStops?.find(s => s.name === nearestStopName) || schoolData.nearbyStops?.[0];
      const lastBus = route.type === "transfer" ? route.bus2 : route.bus1;
      const dropoffBusStop = lastBus?.stops.find(s => s.name === nearestStopName);
      const dropoffLat = dropoffBusStop?.lat || dropoff?.lat;
      const dropoffLon = dropoffBusStop?.lon || dropoff?.lon;
      if (dropoffLat && dropoffLon) {
        L.polyline(walkArc(dropoffLat, dropoffLon, schoolData.lat, schoolData.lon), {
          color: '#333', weight: 2.5, opacity: 0.85, dashArray: '6 8',
        }).addTo(map);
      }
      L.marker([schoolData.lat, schoolData.lon], {
        icon: L.divIcon({ className: '', html: '<div style="font-size:22px;line-height:1;filter:drop-shadow(0 1px 3px rgba(0,0,0,0.35));">🏫</div>', iconSize: [22, 22], iconAnchor: [11, 11] }),
        zIndexOffset: 500,
      }).addTo(map).bindPopup(`<b>${schoolData.name}</b>`);
      if (route.arriveSchool != null) {
        const tHtml = `<div style="position:absolute;left:14px;top:-10px;background:white;border:1.5px solid #333;border-radius:4px;padding:1px 6px;font-size:11px;font-weight:700;color:#222;white-space:nowrap;box-shadow:0 1px 3px rgba(0,0,0,0.15);">${fmt(route.arriveSchool)}</div>`;
        L.marker([schoolData.lat, schoolData.lon], { icon: L.divIcon({ className: '', html: tHtml, iconSize: [0, 0], iconAnchor: [0, 0] }), interactive: false, zIndexOffset: 600 }).addTo(map);
      }
      allCoords.push([schoolData.lat, schoolData.lon]);
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
    const h = e => { if (e.key === 'Escape' && document.fullscreenElement) document.exitFullscreen(); };
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
        background: '#1a73e8', border: '2px solid #1a73e8',
        borderRadius: 8, padding: '4px 8px', cursor: 'pointer',
        fontSize: 16, lineHeight: 1, boxShadow: '0 2px 6px rgba(0,0,0,0.25)', color: 'white',
      }}>{fsState ? '✕' : '⛶'}</button>
    </div>
  );
}

// ── CitySchoolRouteCard — városi iskola útvonalkártya (planCityRoutes eredményéhez) ──
function CitySchoolRouteCard({ route, index, isPrimary, t, isWeekend, dayType, nowMins, direction, schoolData }) {
  const [mapOpen, setMapOpen] = React.useState(false);
  const [timetableInfo, setTimetableInfo] = React.useState(null);
  const [expanded, setExpanded] = React.useState(false);
  const cardRef = React.useRef(null);
  React.useEffect(() => {
    if (!mapOpen) return;
    setTimeout(() => scrollCardBottom(cardRef.current), 50);
  }, [mapOpen]);
  const U = window.BUS_UTILS;
  const fmt = m => U.fmtTime(m);

  const finalArriveAt
 = direction === "school" ? (route.arriveSchool ?? route.arriveAt) : route.arriveAt;
  const totalMin = finalArriveAt - route.departLeaveHome;
  const totalH = Math.floor(totalMin / 60);
  const totalM = totalMin % 60;
  const totalStr = totalH > 0 ? `${totalH}${t.hour} ${totalM}${t.min}` : `${totalM} ${t.min}`;

  const walkMin = route.boardAt - route.departLeaveHome;
  const nearestStop = schoolData?.nearbyStops?.[0];
  const nearestStopName = route.nearestStopName || nearestStop?.name || "";
  const homeStopName = route.homeStopName || "";

  const bus2TravelMin = route.type === "transfer"
    ? route.arriveAt - route.boardAt2
    : route.arriveAt - route.boardAt;
  const bus1TravelMin = route.type === "transfer"
    ? route.arriveAtTransfer - route.boardAt
    : route.arriveAt - route.boardAt;

  const cityFromStop = direction === "school" ? route.homeStopName : route.nearestStopName;
  const cityToStop   = direction === "school" ? route.nearestStopName : route.homeStopName;
  const bus1Stops = route.bus1?.stops || [];
  const bus1FromIdx = bus1Stops.findIndex(s => s.name === cityFromStop);
  const bus1ToIdx   = route.type === "transfer"
    ? bus1Stops.findIndex(s => s.name === route.transferStopName)
    : bus1Stops.findIndex(s => s.name === cityToStop);
  const bus1FromBoard = route.boardAt - (bus1Stops[bus1FromIdx]?.offset || 0);
  const bus1Visible = bus1Stops.slice(
    bus1FromIdx >= 0 ? bus1FromIdx : 0,
    bus1ToIdx   >= 0 ? bus1ToIdx + 1 : undefined
  );
  let bus2Visible = [], bus2FromBoard = 0;
  if (route.type === "transfer") {
    const bus2Stops = route.bus2?.stops || [];
    const bus2DepName = route.walkToStop || route.transferStopName;
    const bus2FromIdx = bus2Stops.findIndex(s => s.name === bus2DepName);
    const bus2ToIdx   = bus2Stops.findIndex(s => s.name === cityToStop);
    bus2FromBoard = route.boardAt2 - (bus2Stops[bus2FromIdx]?.offset || 0);
    bus2Visible = bus2Stops.slice(
      bus2FromIdx >= 0 ? bus2FromIdx : 0,
      bus2ToIdx   >= 0 ? bus2ToIdx + 1 : undefined
    );
  }

  return (
    <div ref={cardRef} className={`route-card ${isPrimary ? "primary" : ""}`}>
      {timetableInfo && (
        <window.BusTimetableModal busId={timetableInfo.busId} fromStop={timetableInfo.fromStop} initialDep={timetableInfo.initialDep} onClose={() => setTimetableInfo(null)} isWeekend={isWeekend} dayType={dayType} nowMins={nowMins} />
      )}
      <div className="route-card-header">
        <span className="route-card-badge">
          {isPrimary ? `⭐ ${t.best}` : `${t.alternative} ${index}`}
        </span>
        <span className="route-card-total">
          {direction === "school" ? "🏫" : "🏠"} {fmt(finalArriveAt)} · {totalStr}
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
        {/* Indulás (gyaloglással ha van) */}
        <div className="route-step step-walk">
          <div className="step-time">{fmt(route.departLeaveHome)}</div>
          <div className="step-icon">🚶</div>
          <div className="step-body">
            <div className="step-title">{t.leaveAt}</div>
            <div className="step-sub">{direction === "school" ? homeStopName : nearestStopName}</div>
          </div>
        </div>

        <div className="step-connector">
          <div className="connector-line" />
          {walkMin > 0 && <div className="connector-label">{walkMin} {t.min} gyalog</div>}
        </div>

        {/* Busz 1 */}
        <div className="route-step step-bus-1">
          <div className="step-time">{fmt(route.boardAt)}</div>
          <div
            className="step-icon bus-icon-local"
            style={{ background: route.bus1.color, cursor: 'pointer' }}
            title="Menetrend megtekintése"
            onClick={() => setTimetableInfo({ busId: route.bus1.id, fromStop: route.bus1.stops[0].name, initialDep: route.boardAt })}
          >
            {route.bus1.id}
          </div>
          <div className="step-body">
            <div className="step-title">
              {t.takeLocal}{" "}
              <span style={{ color: route.bus1.color, fontWeight: 800 }}>{route.bus1.label}</span>
            </div>
            <div className="step-sub">{route.bus1.direction}</div>
          </div>
        </div>

        {route.type === "transfer" ? (
          <>
            <div className="step-connector">
              <div className="connector-line" />
              <div className="connector-label">{bus1TravelMin} {t.min}</div>
            </div>

            <div className="route-step step-transfer">
              <div className="step-time">{fmt(route.arriveAtTransfer)}</div>
              <div className="step-icon">{route.walkTransfer ? "🚶" : "🔄"}</div>
              <div className="step-body">
                <div className="step-title">{route.walkTransfer ? `${route.transferStopName} → ${route.walkToStop}` : (t.transfer + ": " + route.transferStopName)}</div>
                {route.walkTransfer
                  ? <div className="step-sub">{route.walkTransfer.walkMin} {t.min} gyalog · {route.walkTransfer.distM} m</div>
                  : <div className="wait-pill">⏱ {route.waitAtTransfer} {t.min} {t.waitTime}</div>
                }
                {route.walkTransfer && route.waitAtTransfer - route.walkTransfer.walkMin > 0 && (
                  <div className="wait-pill">⏱ {route.waitAtTransfer - route.walkTransfer.walkMin} {t.min} {t.waitTime}</div>
                )}
              </div>
            </div>

            <div className="step-connector"><div className="connector-line" /></div>

            <div className="route-step step-bus-2">
              <div className="step-time">{fmt(route.boardAt2)}</div>
              <div
                className="step-icon bus-icon-local"
                style={{ background: route.bus2.color, cursor: 'pointer' }}
                title="Menetrend megtekintése"
                onClick={() => setTimetableInfo({ busId: route.bus2.id, fromStop: route.bus2.stops[0].name, initialDep: route.boardAt2 })}
              >
                {route.bus2.id}
              </div>
              <div className="step-body">
                <div className="step-title">
                  {t.takeLocal}{" "}
                  <span style={{ color: route.bus2.color, fontWeight: 800 }}>{route.bus2.label}</span>
                </div>
                <div className="step-sub">{route.bus2.direction}</div>
              </div>
            </div>

            <div className="step-connector">
              <div className="connector-line" />
              <div className="connector-label">{bus2TravelMin} {t.min}</div>
            </div>
          </>
        ) : (
          <div className="step-connector">
            <div className="connector-line" />
            <div className="connector-label">{bus1TravelMin} {t.min}</div>
          </div>
        )}

        {/* Megérkezés a megállóba */}
        {direction === "school" ? (
          <>
            <div className="route-step">
              <div className="step-time">{fmt(route.arriveAt)}</div>
              <div className="step-icon">🚏</div>
              <div className="step-body">
                <div className="step-title">{nearestStopName}</div>
              </div>
            </div>
            {route.walkToSchool > 0 && (
              <>
                <div className="step-connector">
                  <div className="connector-line" />
                  <div className="connector-label">{route.walkToSchool} {t.min} gyalog{route.walkToSchoolDist ? ` (${route.walkToSchoolDist} m)` : ""}</div>
                </div>
                <div className="route-step step-home">
                  <div className="step-time">{fmt(route.arriveSchool)}</div>
                  <div className="step-icon">🏫</div>
                  <div className="step-body">
                    <div className="step-title" style={{ fontWeight: 800 }}>{schoolData?.name}</div>
                    <div className="step-sub">{t.arriveAt}</div>
                  </div>
                </div>
              </>
            )}
          </>
        ) : (
          <div className="route-step step-home">
            <div className="step-time">{fmt(route.arriveAt)}</div>
            <div className="step-icon step-icon-home">🏡</div>
            <div className="step-body">
              <div className="step-title" style={{ fontWeight: 800 }}>{homeStopName || t.home}</div>
              <div className="step-sub">{t.arriveAt}</div>
            </div>
          </div>
        )}
      </div>

      <button
        className="route-expand-btn"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? t.hideMoreStops : t.showMoreStops} ▾
      </button>

      {mapOpen && <CitySchoolRouteMap route={route} direction={direction} schoolData={schoolData} />}

      {expanded && (
        <div className="route-details">
          {route.type === "transfer" && (
            <div className="details-title">
              {t.thisBusPasses}{" "}
              <span style={{ background: route.bus1.color, color: '#fff', padding: '1px 7px', borderRadius: 7, fontSize: 12, fontWeight: 800 }}>{route.bus1.label}</span>
            </div>
          )}
          {route.type !== "transfer" && (
            <div className="details-title">{t.thisBusPasses}</div>
          )}
          <div className="details-stops">
            {bus1Visible.map((s, i) => {
              const isHome = s.name === route.homeStopName;
              const isTransfer = s.name === route.transferStopName;
              const absTime = bus1FromBoard + s.offset;
              return (
                <div key={i} className={`detail-stop${isHome ? " home" : ""}${isTransfer ? " transfer" : ""}`}>
                  <span className="detail-stop-time">{fmt(absTime)}</span>
                  <span className="detail-stop-dot" style={{ background: route.bus1.color }} />
                  <span className="detail-stop-name">{s.name}</span>
                </div>
              );
            })}
          </div>
          {route.type === "transfer" && (
            <>
              <div className="details-title" style={{ marginTop: 8 }}>
                {t.thisBusPasses}{" "}
                <span style={{ background: route.bus2.color, color: '#fff', padding: '1px 7px', borderRadius: 7, fontSize: 12, fontWeight: 800 }}>{route.bus2.label}</span>
              </div>
              <div className="details-stops">
                {bus2Visible.map((s, i) => {
                  const isHome = s.name === route.homeStopName;
                  const isTransfer = i === 0;
                  const absTime = bus2FromBoard + s.offset;
                  return (
                    <div key={i} className={`detail-stop${isHome ? " home" : ""}${isTransfer ? " transfer" : ""}`}>
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
window.CitySchoolRouteCard = CitySchoolRouteCard;

// ── SchoolSettingsModal ──────────────────────────────────────────────
function SchoolSettingsModal({ onClose }) {
  const schools = window.SCHOOLS || [];
  const [selected, setSelected] = React.useState(() => localStorage.getItem("selectedSchool") || "");
  const [showMap, setShowMap] = React.useState(false);
  const mapRef = React.useRef(null);
  const containerRef = React.useRef(null);
  const mapInstanceRef = React.useRef(null);
  const markersRef = React.useRef({});
  const stopMarkerRef = React.useRef(null);
  const [fsState, setFsState] = React.useState(false);

  const [homeStop, setHomeStop] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem('homeStop') || 'null'); } catch { return null; }
  });
  const [homeQuery, setHomeQuery] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem('homeStop') || 'null')?.name || ''; } catch { return ''; }
  });
  const [homeInputFocused, setHomeInputFocused] = React.useState(false);
  const [showHomeMap, setShowHomeMap] = React.useState(false);
  const homeMapRef = React.useRef(null);
  const homeContainerRef = React.useRef(null);
  const homeMapInstanceRef = React.useRef(null);
  const homeMarkersRef = React.useRef({});
  const [homeFsState, setHomeFsState] = React.useState(false);

  const allStops = React.useMemo(() => {
    const m = new Map();
    for (const bus of (window.CITY_BUSES_FULL || [])) {
      for (const stop of (bus.stops || [])) {
        if (stop.lat && !m.has(stop.name)) m.set(stop.name, { name: stop.name, lat: stop.lat, lon: stop.lon });
      }
    }
    return [...m.values()].sort((a, b) => a.name.localeCompare(b.name, 'hu'));
  }, []);

  const filteredStops = homeQuery.length >= 1
    ? allStops.filter(s => s.name.toLowerCase().includes(homeQuery.toLowerCase()))
    : allStops;

  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  React.useEffect(() => {
    const h = () => {
      const fs = !!document.fullscreenElement;
      setFsState(fs);
      setHomeFsState(fs);
      setTimeout(() => { mapInstanceRef.current?.invalidateSize(); homeMapInstanceRef.current?.invalidateSize(); }, 100);
    };
    document.addEventListener('fullscreenchange', h);
    return () => document.removeEventListener('fullscreenchange', h);
  }, []);

  React.useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') { if (document.fullscreenElement) document.exitFullscreen(); else onClose(); } };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, []);

  React.useEffect(() => {
    if (!showMap) {
      if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; }
      markersRef.current = {};
      return;
    }
    if (!mapRef.current || mapInstanceRef.current) return;

    if (!document.getElementById('school-popup-style')) {
      const s = document.createElement('style');
      s.id = 'school-popup-style';
      s.textContent = '.school-popup .leaflet-popup-content-wrapper{background:rgba(255,255,255,0.6);backdrop-filter:blur(3px);}.school-popup .leaflet-popup-tip{background:rgba(255,255,255,0.6);}';
      document.head.appendChild(s);
    }

    const map = L.map(mapRef.current, { zoomControl: true });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(map);

    const TYPE_COLOR = {
      altalanos: '#1565C0',
      gimnazium: '#6A1B9A',
      technikum: '#E65100',
      specialis: '#546E7A',
      osszetett: '#00695C',
    };

    const allCoords = [];
    for (const school of schools) {
      if (!school.lat || !school.lon) continue;
      const isSel = school.id === selected;
      const baseColor = TYPE_COLOR[school.type] || '#1565C0';
      const marker = L.circleMarker([school.lat, school.lon], {
        radius: isSel ? 13 : 9,
        color: 'white', weight: isSel ? 3 : 2,
        fillColor: isSel ? '#e53935' : baseColor,
        fillOpacity: 0.95,
      }).addTo(map);
      const nearest = school.nearbyStops?.[0];
      marker.bindPopup(
        `<b style="font-family:Nunito,sans-serif;font-size:13px">${school.name}</b>` +
        (nearest ? `<br><span style="font-size:11px;color:#555">${nearest.name} · ${nearest.dist}m · ~${Math.ceil(nearest.dist/80)} perc gyalog</span>` : '') +
        (school.helykoziOnly ? `<br><span style="font-size:11px;color:#888">Helyközi busz</span>` : ''),
        { className: 'school-popup' }
      );
      const ttOpts = { permanent: false, direction: 'top', offset: [0, -10] };
      marker.bindTooltip(school.name, ttOpts);
      marker.on('popupopen', () => marker.unbindTooltip());
      marker.on('popupclose', () => marker.bindTooltip(school.name, ttOpts));
      marker.on('click', () => setSelected(school.id));
      markersRef.current[school.id] = { marker, baseColor };
      allCoords.push([school.lat, school.lon]);
    }

    mapInstanceRef.current = map;

    const selSchool0 = schools.find(s => s.id === selected);
    const nearestStop0 = selSchool0?.nearbyStops?.[0];
    if (nearestStop0?.lat) {
      stopMarkerRef.current = L.marker([nearestStop0.lat, nearestStop0.lon], {
        icon: L.divIcon({
          className: '',
          html: '<div style="font-size:22px;line-height:1;filter:drop-shadow(0 1px 3px rgba(0,0,0,0.35));">📍</div>',
          iconSize: [22, 22], iconAnchor: [6, 22],
        }),
        interactive: false, zIndexOffset: 500,
      }).addTo(map);
    }

    setTimeout(() => {
      map.invalidateSize();
      if (allCoords.length >= 2) map.fitBounds(allCoords, { padding: [24, 24] });
      else map.setView([47.09, 17.91], 13);
    }, 200);

    return () => { map.remove(); mapInstanceRef.current = null; markersRef.current = {}; stopMarkerRef.current = null; };
  }, [showMap]);

  React.useEffect(() => {
    if (!mapInstanceRef.current) return;
    for (const [id, { marker, baseColor }] of Object.entries(markersRef.current)) {
      const isSel = id === selected;
      marker.setRadius(isSel ? 13 : 9);
      marker.setStyle({ fillColor: isSel ? '#e53935' : baseColor, weight: isSel ? 3 : 2 });
    }
    if (stopMarkerRef.current) { stopMarkerRef.current.remove(); stopMarkerRef.current = null; }
    const selSchool = schools.find(s => s.id === selected);
    const nearestStop = selSchool?.nearbyStops?.[0];
    if (nearestStop?.lat && mapInstanceRef.current) {
      stopMarkerRef.current = L.marker([nearestStop.lat, nearestStop.lon], {
        icon: L.divIcon({
          className: '',
          html: '<div style="font-size:22px;line-height:1;filter:drop-shadow(0 1px 3px rgba(0,0,0,0.35));">📍</div>',
          iconSize: [22, 22],
          iconAnchor: [6, 22],
        }),
        interactive: false,
        zIndexOffset: 500,
      }).addTo(mapInstanceRef.current);
    }
  }, [selected]);

  React.useEffect(() => {
    if (!showHomeMap) {
      if (homeMapInstanceRef.current) { homeMapInstanceRef.current.remove(); homeMapInstanceRef.current = null; }
      homeMarkersRef.current = {};
      return;
    }
    if (!homeMapRef.current || homeMapInstanceRef.current) return;

    const map = L.map(homeMapRef.current, { zoomControl: true });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(map);

    for (const stop of allStops) {
      const isSel = homeStop?.name === stop.name;
      const marker = L.circleMarker([stop.lat, stop.lon], {
        radius: isSel ? 11 : 6,
        color: 'white', weight: 2,
        fillColor: isSel ? '#1a73e8' : '#78909C',
        fillOpacity: isSel ? 1 : 0.75,
      }).addTo(map);
      marker.bindTooltip(stop.name, { permanent: false, direction: 'top', offset: [0, -8] });
      marker.on('click', () => { setHomeStop(stop); setHomeQuery(stop.name); });
      homeMarkersRef.current[stop.name] = marker;
    }

    homeMapInstanceRef.current = map;
    setTimeout(() => {
      map.invalidateSize();
      if (homeStop?.lat) map.setView([homeStop.lat, homeStop.lon], 15);
      else map.setView([47.094, 17.912], 13);
    }, 200);

    return () => { map.remove(); homeMapInstanceRef.current = null; homeMarkersRef.current = {}; };
  }, [showHomeMap]);

  React.useEffect(() => {
    if (!homeMapInstanceRef.current) return;
    for (const [name, marker] of Object.entries(homeMarkersRef.current)) {
      const isSel = homeStop?.name === name;
      marker.setRadius(isSel ? 11 : 6);
      marker.setStyle({ fillColor: isSel ? '#1a73e8' : '#78909C', fillOpacity: isSel ? 1 : 0.75 });
    }
    if (homeStop?.lat) homeMapInstanceRef.current.setView([homeStop.lat, homeStop.lon], 15);
  }, [homeStop]);

  function toggleFullscreen() {
    if (!document.fullscreenElement) containerRef.current?.requestFullscreen();
    else document.exitFullscreen();
  }

  function toggleHomeFullscreen() {
    if (!document.fullscreenElement) homeContainerRef.current?.requestFullscreen();
    else document.exitFullscreen();
  }

  function save() {
    localStorage.setItem("selectedSchool", selected);
    if (homeStop) localStorage.setItem('homeStop', JSON.stringify(homeStop));
    else localStorage.removeItem('homeStop');
    onClose();
  }

  const selectedSchool = schools.find(s => s.id === selected);

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 10000,
        background: "rgba(0,0,0,0.55)", display: "flex",
        alignItems: "center", justifyContent: "center", padding: 16,
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: "white", borderRadius: 20, padding: "24px 24px 20px",
        maxWidth: 540, width: "100%", maxHeight: "90vh", overflowY: "auto",
        boxShadow: "0 16px 48px rgba(0,0,0,0.3)", fontFamily: "Nunito, sans-serif",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div style={{ fontSize: 20, fontWeight: 900, color: "var(--ink)" }}>⚙ Beállítások</div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "var(--ink-soft)", padding: "0 4px", lineHeight: 1 }}>×</button>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-soft)", marginBottom: 8 }}>
            Melyik iskolába jársz?
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "stretch" }}>
            <select
              value={selected}
              onChange={e => setSelected(e.target.value)}
              style={{
                flex: 1, padding: "9px 12px", borderRadius: 10,
                border: "2px solid var(--line)", fontFamily: "Nunito, sans-serif",
                fontSize: 14, fontWeight: 700, color: "var(--ink)",
                background: "white", cursor: "pointer", outline: "none",
              }}
            >
              <option value="">— Válassz iskolát —</option>
              {schools.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <button
              onClick={() => setShowMap(o => !o)}
              title="Iskolák a térképen"
              style={{
                padding: "9px 14px", borderRadius: 10, border: "none",
                background: showMap ? "var(--accent)" : "var(--line)",
                color: showMap ? "white" : "var(--ink)",
                fontSize: 20, cursor: "pointer", transition: "all 0.15s", flexShrink: 0,
              }}
            >🗺</button>
          </div>
          {selectedSchool && selectedSchool.nearbyStops?.length > 0 && (() => {
            const stop = selectedSchool.nearbyStops[0];
            const mins = Math.ceil(stop.dist / 80);
            return (
              <div style={{ marginTop: 8, fontSize: 12, color: "var(--ink-soft)", fontWeight: 600 }}>
                {selectedSchool.helykoziOnly ? "Helyközi busz · legközelebbi megálló: " : "Legközelebbi megálló: "}
                <b style={{ color: "var(--ink)" }}>{stop.name}</b> ({stop.dist}m · ~{mins} perc gyalog)
              </div>
            );
          })()}
          {selectedSchool?.helykoziOnly && !selectedSchool.nearbyStops?.length && (
            <div style={{ marginTop: 8, fontSize: 12, color: "var(--ink-soft)", fontWeight: 600 }}>
              Helyközi busz szükséges (Nemesvámos)
            </div>
          )}
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-soft)", marginBottom: 8 }}>
            Hol szállsz fel reggel?
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <input
                  type="text"
                  placeholder="— Keress megálló névre —"
                  value={homeQuery}
                  onChange={e => { setHomeQuery(e.target.value); if (homeStop && e.target.value !== homeStop.name) setHomeStop(null); }}
                  onFocus={() => setHomeInputFocused(true)}
                  onBlur={() => setTimeout(() => setHomeInputFocused(false), 150)}
                  style={{ width: "100%", padding: "9px 36px 9px 12px", borderRadius: 10, border: "2px solid var(--line)", fontFamily: "Nunito, sans-serif", fontSize: 14, fontWeight: 700, color: "var(--ink)", background: "white", outline: "none", boxSizing: "border-box" }}
                />
                {(homeQuery || homeStop) && (
                  <button
                    onClick={() => { setHomeStop(null); setHomeQuery(''); }}
                    style={{ position: "absolute", right: 8, background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "var(--ink-soft)", lineHeight: 1, padding: "2px 4px" }}
                  >✕</button>
                )}
              </div>
              {homeInputFocused && (
                <div style={{ background: "white", border: "2px solid var(--line)", borderTop: "none", borderRadius: "0 0 10px 10px", maxHeight: 280, overflowY: "auto", boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }}>
                  {filteredStops.length === 0 && (
                    <div style={{ padding: "10px 12px", fontSize: 13, color: "var(--ink-soft)", fontStyle: "italic" }}>Nincs találat</div>
                  )}
                  {filteredStops.map(stop => (
                    <div
                      key={stop.name}
                      onMouseDown={e => { e.preventDefault(); setHomeStop(stop); setHomeQuery(stop.name); setHomeInputFocused(false); }}
                      style={{ padding: "8px 12px", cursor: "pointer", fontSize: 13, fontWeight: stop.name === homeStop?.name ? 800 : 700, color: stop.name === homeStop?.name ? "var(--accent)" : "var(--ink)", borderBottom: "1px solid var(--line)", background: stop.name === homeStop?.name ? "var(--bg)" : "white" }}
                      onMouseEnter={e => { if (stop.name !== homeStop?.name) e.currentTarget.style.background = "var(--bg)"; }}
                      onMouseLeave={e => { if (stop.name !== homeStop?.name) e.currentTarget.style.background = "white"; }}
                    >
                      {stop.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => setShowHomeMap(o => !o)}
              title="Megállók a térképen"
              style={{ padding: "9px 14px", borderRadius: 10, border: "none", background: showHomeMap ? "var(--accent)" : "var(--line)", color: showHomeMap ? "white" : "var(--ink)", fontSize: 20, cursor: "pointer", transition: "all 0.15s", flexShrink: 0 }}
            >🗺</button>
          </div>
        </div>

        {showHomeMap && (
          <div ref={homeContainerRef} style={{ position: "relative", marginBottom: 16, borderRadius: 12, overflow: "hidden", border: "2px solid var(--line)" }}>
            <div ref={homeMapRef} style={{ height: homeFsState ? "100%" : 300, width: "100%" }} />
            <button onClick={toggleHomeFullscreen} title={homeFsState ? "Kilépés" : "Teljes képernyő"} style={{
              position: "absolute", top: homeFsState ? 28 : 10, right: homeFsState ? 28 : 10, zIndex: 1000,
              background: "#1a73e8", border: "2px solid #1a73e8",
              borderRadius: 8, padding: "4px 8px", cursor: "pointer",
              fontSize: 16, lineHeight: 1, boxShadow: "0 2px 6px rgba(0,0,0,0.25)", color: "white",
            }}>{homeFsState ? "✕" : "⛶"}</button>
          </div>
        )}

        {showMap && (
          <>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 8 }}>
              {[
                { type: 'altalanos', color: '#1565C0', label: 'Általános' },
                { type: 'gimnazium', color: '#6A1B9A', label: 'Gimnázium' },
                { type: 'technikum', color: '#E65100', label: 'Technikum' },
                { type: 'specialis', color: '#546E7A', label: 'Speciális' },
                { type: 'osszetett', color: '#00695C', label: 'Összetett' },
              ].map(({ color, label }) => (
                <span key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, color: 'var(--ink-soft)' }}>
                  <span style={{ width: 12, height: 12, borderRadius: '50%', background: color, display: 'inline-block', flexShrink: 0, border: '2px solid white', boxShadow: '0 0 0 1px ' + color }} />
                  {label}
                </span>
              ))}
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, color: 'var(--ink-soft)' }}>
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#e53935', display: 'inline-block', flexShrink: 0, border: '2px solid white', boxShadow: '0 0 0 1px #e53935' }} />
                Kiválasztott
              </span>
            </div>
            <div ref={containerRef} style={{ borderTop: '2px solid var(--line)', position: 'relative', marginBottom: 16, borderRadius: 12, overflow: 'hidden' }}>
              <div ref={mapRef} style={{ height: fsState ? '100%' : 340, width: '100%' }} />
              <button onClick={toggleFullscreen} title={fsState ? 'Kilépés' : 'Teljes képernyő'} style={{
                position: 'absolute', top: fsState ? 28 : 10, right: fsState ? 28 : 10, zIndex: 1000,
                background: '#1a73e8', border: '2px solid #1a73e8',
                borderRadius: 8, padding: '4px 8px', cursor: 'pointer',
                fontSize: 16, lineHeight: 1, boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
                color: 'white',
              }}>{fsState ? '✕' : '⛶'}</button>
            </div>
          </>
        )}

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
          <button onClick={onClose} style={{
            padding: "9px 18px", borderRadius: 10, border: "2px solid var(--line)",
            background: "white", fontFamily: "Nunito, sans-serif",
            fontSize: 14, fontWeight: 800, cursor: "pointer", color: "var(--ink)",
          }}>Mégse</button>
          <button onClick={save} style={{
            padding: "9px 22px", borderRadius: 10, border: "none",
            background: "var(--accent)", color: "white", fontFamily: "Nunito, sans-serif",
            fontSize: 14, fontWeight: 800, cursor: "pointer",
          }}>Mentés</button>
        </div>
      </div>
    </div>
  );
}

window.SchoolSettingsModal = SchoolSettingsModal;

// ============================================================
// School Route Card — reggeli útvonal (Csererdő → Nemesvámos)
// ============================================================

function SchoolRouteCard({ route, index, isPrimary, t, isWeekend, dayType, nowMins, schoolData }) {
  const U = window.BUS_UTILS;
  const [timetableInfo, setTimetableInfo] = React.useState(null);
  const [mapOpen, setMapOpen] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const cardRef = React.useRef(null);
  React.useEffect(() => { setMapOpen(false); }, [schoolData?.id]);
  React.useEffect(() => {
    if (!mapOpen) return;
    setTimeout(() => scrollCardBottom(cardRef.current), 50);
  }, [mapOpen]);
  const fmt = (m) => U.fmtTime(m);
  const totalMin = route.totalDuration;
  const totalH = Math.floor(totalMin / 60);
  const totalM = totalMin % 60;
  const totalStr = totalH > 0 ? `${totalH}${t.hour} ${totalM}${t.min}` : `${totalM} ${t.min}`;
  const busColor = route.localBus.color;
  const hasWalk = route.walkAfterBus > 0;

  const schoolBoardingStop = route.localBus.stops.find(ss => ss.name === route.boardingStopName);
  const schoolTransferStop = route.localBus.stops.find(ss => ss.name === route.transferLocalStop);
  const schoolFromBoard = route.localBoardAt - (schoolBoardingStop?.offset || 0);
  const schoolBoardingIdx = schoolBoardingStop ? route.localBus.stops.indexOf(schoolBoardingStop) : 0;
  const schoolTransferIdx = schoolTransferStop ? route.localBus.stops.indexOf(schoolTransferStop) : route.localBus.stops.length - 1;
  const schoolVisibleStops = route.localBus.stops.slice(schoolBoardingIdx, schoolTransferIdx + 1);

  return (
    <div ref={cardRef} className={`route-card ${isPrimary ? "primary" : ""}`}>
      {timetableInfo && (
        <window.BusTimetableModal busId={timetableInfo.busId} fromStop={timetableInfo.fromStop} initialDep={timetableInfo.initialDep} onClose={() => setTimetableInfo(null)} isWeekend={isWeekend} dayType={dayType} nowMins={nowMins} />
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
            onClick={() => setTimetableInfo({ busId: route.localBus.id, fromStop: route.localBus.stops[0].name, initialDep: route.localBoardAt })}
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
            <div className="step-sub">{route.boardingStopName || "Csererdő"} → {hasWalk ? route.transferLocalStop : route.transferStopShort}</div>
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
                <div className="step-title">{route.walkAfterBus} {t.min} gyalog{route.walkAfterBusDist ? ` (${route.walkAfterBusDist} m)` : ""}</div>
                <div className="step-sub">{route.transferLocalStop} → {route.transferStopShort}</div>
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
          <div className="step-icon">{route.walkAtTransfer ? "🚶" : "🔄"}</div>
          <div className="step-body">
            {route.walkAtTransfer ? (
              <>
                <div className="step-title">{route.transferStop} → {route.transferStop}</div>
                <div className="step-sub">{route.walkAtTransfer.walkMin} {t.min} gyalog · {route.walkAtTransfer.distM} m</div>
                {route.waitAtTransfer - route.walkAtTransfer.walkMin > 0 && (
                  <div className="wait-pill">⏱ {route.waitAtTransfer - route.walkAtTransfer.walkMin} {t.min} {t.waitTime}</div>
                )}
              </>
            ) : (
              <>
                <div className="step-title">{t.transfer}</div>
                <div className="step-sub">{route.transferStop}</div>
                <div className="wait-pill">⏱ {route.waitAtTransfer} {t.min} {t.waitTime}</div>
              </>
            )}
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
            <div className="step-sub">{route.transferStopShort} → Nemesvámos</div>
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
          <div className="connector-label">{route.walkToSchool} {t.min} gyalog{route.walkToSchoolDist ? ` (${route.walkToSchoolDist} m)` : ""}</div>
        </div>

        <div className="route-step step-home">
          <div className="step-time">{fmt(route.arriveSchool)}</div>
          <div className="step-icon step-icon-home">🏫</div>
          <div className="step-body">
            <div className="step-title" style={{ fontWeight: 800 }}>{schoolData?.name || t.arriveSchool}</div>
            <div className="step-sub">{t.arriveSchool}</div>
          </div>
        </div>
      </div>

      <button
        className="route-expand-btn"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? t.hideMoreStops : t.showMoreStops} ▾
      </button>

      {mapOpen && <SchoolRouteMap route={route} schoolData={schoolData} />}

      {expanded && (
        <div className="route-details">
          <div className="details-title">{t.thisBusPasses}</div>
          <div className="details-stops">
            {schoolVisibleStops.map((s, i) => {
              const isHome = i === 0;
              const isTransfer = i === schoolVisibleStops.length - 1;
              const absTime = schoolFromBoard + s.offset;
              return (
                <div
                  key={i}
                  className={`detail-stop${isHome ? " home" : ""}${isTransfer ? " transfer" : ""}`}
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

function SchoolRouteMap({ route, schoolData }) {
  const mapRef = React.useRef(null);
  const containerRef = React.useRef(null);
  const instanceRef = React.useRef(null);
  const routeKey = `${route.helykoziLine}-${route.helykoziDep}-${route.transferStop}-${schoolData?.id}`;

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

    // 1. Helyi busz: boardingStop → transferStop
    const localBus = route.localBus;
    const cityShapes = (window.CITY_SHAPES || {})[localBus.id] || [];
    const boardingStopIdx = localBus.stops.findIndex(s => normStop(s.name) === normStop(route.boardingStopName));
    const startStop = localBus.stops[boardingStopIdx >= 0 ? boardingStopIdx : 0];
    const transferStopIdx = localBus.stops.findIndex(s => s.name === route.transferLocalStop);
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
      const fromIdx = boardingStopIdx >= 0 ? boardingStopIdx : 0;
      const segStops = localBus.stops.slice(fromIdx, transferStopIdx + 1).filter(s => s.lat && s.lon);
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

    // 1b. Gyalogos átszállás: helyi busz megálló → helyközi felszállóhely
    if ((route.walkAfterBus > 0 || route.walkAtTransfer) && transferStop?.lat && volanLat) {
      L.polyline([[transferStop.lat, transferStop.lon], [volanLat, volanLon]], {
        color: '#555', weight: 3, opacity: 0.7, dashArray: '6,5'
      }).addTo(map);
      allCoords.push([transferStop.lat, transferStop.lon], [volanLat, volanLon]);
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

    if (schoolData?.lat && schoolData?.lon) {
      L.polyline(walkArc(nemoLat, nemoLon, schoolData.lat, schoolData.lon), {
        color: '#333', weight: 2.5, opacity: 0.85, dashArray: '6 8',
      }).addTo(map);
      L.marker([schoolData.lat, schoolData.lon], {
        icon: L.divIcon({ className: '', html: '<div style="font-size:22px;line-height:1;filter:drop-shadow(0 1px 3px rgba(0,0,0,0.35));">🏫</div>', iconSize: [22, 22], iconAnchor: [11, 11] }),
        zIndexOffset: 500,
      }).addTo(map).bindPopup(`<b>${schoolData.name}</b>`);
      if (route.arriveSchool != null) {
        const tHtml = `<div style="position:absolute;left:14px;top:-10px;background:white;border:1.5px solid #555;border-radius:4px;padding:1px 6px;font-size:11px;font-weight:700;color:#222;white-space:nowrap;box-shadow:0 1px 3px rgba(0,0,0,0.15);">${fmt(route.arriveSchool)}</div>`;
        L.marker([schoolData.lat, schoolData.lon], { icon: L.divIcon({ className: '', html: tHtml, iconSize: [0, 0], iconAnchor: [0, 0] }), interactive: false, zIndexOffset: 600 }).addTo(map);
      }
      allCoords.push([schoolData.lat, schoolData.lon]);
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

window.SchoolRouteCard = SchoolRouteCard;
