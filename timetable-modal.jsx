/* ============================================================
   BusTimetableModal — busz menetrend nézet (modal/overlay)
   ============================================================ */

// Counter to safely manage body scroll lock with multiple potential modals
let _modalOpenCount = 0;

// dayType: "workday" | "schoolholiday" | "weekend"  (isWeekend kept for backward compat)
function BusTimetableModal({ busId, onClose, fromStop, isWeekend: isWeekendProp, dayType: dayTypeProp, nowMins: nowMinsProp, initialDep, lang }) {
  const U = window.BUS_UTILS;
  const fmt = (m) => U.fmtTime(m);
  const t = (window.I18N && window.I18N[lang || "hu"]) || window.I18N?.hu || {};

  const _now = new Date();
  const nowMins = nowMinsProp !== undefined ? nowMinsProp : _now.getHours() * 60 + _now.getMinutes();
  const isWeekend = isWeekendProp !== undefined ? isWeekendProp : (_now.getDay() === 0 || _now.getDay() === 6);
  const dayType = dayTypeProp || (isWeekend ? "weekend" : "workday");

  const [activeDayType, setActiveDayType] = React.useState(dayType);

  const [currentBusId, setCurrentBusId] = React.useState(busId);

  // Összes vonal ID-ja rendezve (navigációhoz)
  const allBusIds = React.useMemo(() => {
    const ids = [...new Set((window.CITY_BUSES_FULL || []).map(b => b.id))];
    return ids.sort((a, b) => {
      const na = parseFloat(a), nb = parseFloat(b);
      if (na !== nb) return na - nb;
      return a.localeCompare(b);
    });
  }, []);

  const currentIdx = allBusIds.indexOf(currentBusId);
  function goNext() { setCurrentBusId(allBusIds[(currentIdx + 1) % allBusIds.length]); }
  function goPrev() { setCurrentBusId(allBusIds[(currentIdx - 1 + allBusIds.length) % allBusIds.length]); }

  const allDirs = (window.CITY_BUSES_FULL || []).filter(b => b.id === currentBusId);

  function getDeps(bus) {
    let sched = bus.departures[activeDayType] || {};
    const deps = [];
    Object.entries(sched)
      .sort((a, b) => Number(a[0]) - Number(b[0]))
      .forEach(([h, rawMins]) => rawMins.forEach(raw => {
        const m = typeof raw === "object" ? raw.t : raw;
        const note = typeof raw === "object" ? raw.n : null;
        deps.push({ mins: Number(h) * 60 + m, note });
      }));
    return deps;
  }

  const dirData = allDirs.map(bus => {
    const deps = getDeps(bus);
    const nextIdx = deps.findIndex(d => d.mins >= nowMins);
    return { bus, deps, nextIdx: nextIdx >= 0 ? nextIdx : 0 };
  });

  // All hooks before any early return
  const [selected, setSelected] = React.useState(() => {
    const dirIdx = fromStop
      ? Math.max(0, allDirs.findIndex(b => b.stops[0].name === fromStop))
      : 0;
    const data = dirData[dirIdx];
    let depIdx = data?.nextIdx ?? 0;
    if (initialDep !== undefined && data?.deps?.length) {
      const exact = data.deps.findIndex(d => d.mins === initialDep);
      if (exact >= 0) depIdx = exact;
    }
    return { dirIdx, depIdx };
  });
  const [stopsOpen, setStopsOpen] = React.useState(false);
  const [mapOpen, setMapOpen] = React.useState(false);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const modalRef = React.useRef(null);
  const isMountRef = React.useRef(true);

  React.useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  // Vonalváltáskor reset — első mount-on kihagyjuk (az initialDep-et ne írja felül)
  React.useEffect(() => {
    if (isMountRef.current) { isMountRef.current = false; return; }
    setSelected({ dirIdx: 0, depIdx: dirData[0]?.nextIdx ?? 0 });
    setStopsOpen(false);
  }, [currentBusId]);

  React.useEffect(() => {
    _modalOpenCount++;
    document.body.style.overflow = 'hidden';
    return () => {
      _modalOpenCount--;
      if (_modalOpenCount === 0) document.body.style.overflow = '';
    };
  }, []);

  React.useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!allDirs.length) return null;

  function shortName(name) {
    return name.split(',')[0].split(' /')[0].split(' ▸')[0];
  }

  const bus0 = allDirs[0];
  const selDirIdx = Math.min(selected.dirIdx, allDirs.length - 1);
  const selBus = allDirs[selDirIdx];
  const selDepObj = dirData[selDirIdx]?.deps[selected.depIdx];
  const selDep = selDepObj?.mins;
  const middleCount = selBus.stops.length - 2;
  const isDesktop = window.innerWidth >= 640;

  const modal = (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        background: 'rgba(0,0,0,0.55)',
        display: 'flex',
        alignItems: isDesktop ? 'center' : 'flex-end',
        justifyContent: 'center',
      }}
    >
      <div ref={modalRef} style={{
        background: 'white',
        borderRadius: isDesktop ? 20 : '20px 20px 0 0',
        width: '100%',
        maxWidth: isFullscreen ? '100%' : (isDesktop ? 560 : 680),
        maxHeight: isFullscreen ? '100%' : (isDesktop ? '80vh' : '90vh'),
        height: isFullscreen ? '100%' : undefined,
        overflow: 'hidden', display: 'flex', flexDirection: 'column',
        boxShadow: isFullscreen ? 'none' : '0 8px 40px rgba(0,0,0,0.35)',
        fontFamily: 'Nunito, sans-serif',
      }}>

        {/* Header */}
        <div style={{
          background: bus0.color, color: 'white',
          padding: '16px 20px', display: 'flex', alignItems: 'center',
          gap: 12, flexShrink: 0,
          borderRadius: isDesktop ? '20px 20px 0 0' : '20px 20px 0 0',
        }}>
          <button onClick={goPrev} style={{
            background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%',
            width: 32, height: 32, cursor: 'pointer', color: 'white', fontSize: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>◀</button>
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            background: 'rgba(255,255,255,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, fontWeight: 900, flexShrink: 0,
          }}>{bus0.id}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 17, fontWeight: 900 }}>{bus0.label}</div>
            <div style={{ fontSize: 11, opacity: 0.8, display:'flex', gap:6, flexWrap:'wrap', alignItems:'center' }}>
              {(['workday','schoolholiday','weekend']).map(dt => {
                const label = dt === 'workday' ? (t.workday || 'Hétköznap') : dt === 'schoolholiday' ? (t.schoolHolidayLabel || 'Tanszünet') : (t.weekend || 'Hétvége');
                const hasData = allDirs.some(b => b.departures[dt] && Object.keys(b.departures[dt]).length > 0);
                if (!hasData && dt !== activeDayType) return null;
                return (
                  <button key={dt} onClick={() => setActiveDayType(dt)} style={{
                    background: activeDayType === dt ? 'white' : 'rgba(255,255,255,0.18)',
                    border: 'none', borderRadius: 6, padding:'2px 7px',
                    color: activeDayType === dt ? bus0.color : 'white',
                    fontSize:10, fontWeight:700, cursor:'pointer',
                    opacity: hasData ? 1 : 0.5,
                  }}>{label}</button>
                );
              })}
              {/* hidden placeholder to keep original text for compat */}
              <span style={{display:'none'}}>{isWeekend ? t.weekendSchedule : t.weekdaySchedule}</span>
            </div>
          </div>
          <button onClick={goNext} style={{
            background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%',
            width: 32, height: 32, cursor: 'pointer', color: 'white', fontSize: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>▶</button>
          <button
            onClick={() => setMapOpen(o => !o)}
            title="Útvonal a térképen"
            style={{
              background: mapOpen ? 'white' : 'rgba(255,255,255,0.25)',
              border: mapOpen ? `2px solid white` : '2px solid transparent',
              outline: mapOpen ? `2px solid ${bus0.color}` : 'none',
              outlineOffset: 2,
              borderRadius: '50%', width: 36, height: 36,
              cursor: 'pointer', color: mapOpen ? bus0.color : 'white', fontSize: 18,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}
          >🗺</button>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.25)', border: 'none',
              borderRadius: '50%', width: 36, height: 36,
              cursor: 'pointer', color: 'white', fontSize: 20, fontWeight: 900,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}
          >✕</button>
        </div>

        {/* Two-column timetable */}
        <div style={{ display: 'flex', flexShrink: 0, maxHeight: '40vh', overflow: 'hidden' }}>
          {dirData.map(({ bus, deps, nextIdx }, dirIdx) => (
            <div key={dirIdx} style={{
              flex: 1,
              borderRight: dirIdx < dirData.length - 1 ? '1px solid var(--line)' : 'none',
              display: 'flex', flexDirection: 'column', overflow: 'hidden',
            }}>
              <div style={{
                padding: '8px 10px', fontSize: 11, fontWeight: 800,
                background: '#f5f5f5', color: 'var(--ink-soft)',
                textAlign: 'center', flexShrink: 0,
                borderBottom: '1px solid var(--line)',
              }}>
                {shortName(bus.stops[0].name)}
              </div>
              <div style={{ overflowY: 'auto', flex: 1, padding: '8px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {deps.map(({ mins: dep, note }, i) => {
                    const isPast = dep < nowMins;
                    const isNext = i === nextIdx && selected.dirIdx === dirIdx;
                    const isSel = selected.dirIdx === dirIdx && selected.depIdx === i;
                    return (
                      <button
                        key={i}
                        onClick={() => setSelected({ dirIdx, depIdx: i })}
                        style={{
                          padding: '5px 8px', borderRadius: 8, border: 'none',
                          fontFamily: 'inherit', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                          background: isSel ? bus.color : 'var(--line)',
                          color: isSel ? 'white' : isPast ? 'var(--ink-soft)' : 'var(--ink)',
                          opacity: isPast && !isSel ? 0.4 : 1,
                          outline: isNext && !isSel ? `2px solid ${bus.color}` : 'none',
                          outlineOffset: 1,
                          transition: 'background 0.15s',
                          position: 'relative',
                        }}
                      >
                        {fmt(dep)}
                        {note && <sup style={{fontSize:9,fontWeight:900,marginLeft:1,verticalAlign:'super'}}>{note}</sup>}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Expandable stop details */}
        {middleCount > 0 && (
          <div style={{ flexShrink: 0, borderTop: '2px solid var(--line)' }}>
            <button
              onClick={() => setStopsOpen(o => !o)}
              style={{
                width: '100%', padding: '12px 20px',
                background: 'none', border: 'none', fontFamily: 'inherit',
                fontSize: 13, fontWeight: 700, cursor: 'pointer',
                color: 'var(--ink-soft)', display: 'flex', alignItems: 'center',
                gap: 8, justifyContent: 'center',
              }}
            >
              {stopsOpen ? `▲ ${t.hideStops || 'Megállók elrejtése'}` : `▼ ${middleCount} ${t.midStopsLabel || 'közbülső megálló'}`}
            </button>
            {stopsOpen && (
              <div style={{ maxHeight: '45vh', overflowY: 'auto' }}>
                <StopTimeline bus={selBus} selectedDep={selDep} nowMins={nowMins} fmt={fmt} lang={lang} />
              </div>
            )}
          </div>
        )}

        {/* Footnotes legend */}
        {allDirs.some(b => b.footnotes && Object.keys(b.footnotes).length > 0) && (
          <div style={{ flexShrink:0, borderTop:'1px solid var(--line)', padding:'8px 14px', background:'#fafafa' }}>
            {allDirs.filter(b => b.footnotes).map((b, di) => (
              Object.entries(b.footnotes).map(([k, v]) => (
                <div key={`${di}-${k}`} style={{ fontSize:11, color:'var(--ink-soft)', lineHeight:1.5 }}>
                  <sup style={{fontWeight:900}}>{k}</sup> {v}
                </div>
              ))
            ))}
          </div>
        )}

        {/* Térkép szekció */}
        {mapOpen && (
          <div style={{ flex: 1, minHeight: 320, borderTop: '2px solid var(--line)', display: 'flex', flexDirection: 'column' }}>
            <BusRouteMap bus={selBus} color={bus0.color} selectedDep={selDep} nowMins={nowMins} fmt={fmt}
              modalRef={modalRef} />
          </div>
        )}
      </div>
    </div>
  );

  return ReactDOM.createPortal(modal, document.body);
}

function StopTimeline({ bus, selectedDep, nowMins, fmt, lang }) {
  const t = (window.I18N && window.I18N[lang || "hu"]) || window.I18N?.hu || {};
  const stops = bus.stops;
  const first = stops[0];
  const last = stops[stops.length - 1];
  const middle = stops.slice(1, -1);
  const [midOpen, setMidOpen] = React.useState(false);

  function StopRow({ stop, prominent, isLast }) {
    const time = selectedDep !== undefined ? selectedDep + stop.offset : null;
    const isPast = time !== null && time < nowMins;
    return (
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <div style={{
          width: 46, textAlign: 'right', flexShrink: 0,
          fontWeight: prominent ? 800 : 700, fontSize: prominent ? 16 : 14,
          fontVariantNumeric: 'tabular-nums', paddingTop: prominent ? 1 : 3,
          color: isPast ? 'var(--ink-soft)' : 'var(--ink)',
        }}>
          {time !== null ? fmt(time) : ''}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
          <div style={{
            width: prominent ? 14 : 10, height: prominent ? 14 : 10,
            marginTop: prominent ? 2 : 4, borderRadius: '50%',
            background: isPast ? '#ccc' : bus.color,
            boxShadow: prominent && !isPast ? `0 0 0 3px ${bus.color}33` : 'none',
          }} />
          {!isLast && (
            <div style={{
              width: 2, minHeight: 20, flex: 1,
              background: isPast ? '#e0e0e0' : bus.color + '55',
              margin: '3px 0',
            }} />
          )}
        </div>
        <div style={{ paddingBottom: isLast ? 8 : 10, paddingTop: prominent ? 2 : 4 }}>
          <div style={{
            fontWeight: prominent ? 800 : 600, fontSize: prominent ? 15 : 13,
            color: isPast ? 'var(--ink-soft)' : 'var(--ink)',
          }}>{stop.name}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '16px 20px' }}>
      <StopRow stop={first} prominent isLast={false} />

      <div style={{ display: 'flex', gap: 14, alignItems: 'center', margin: '4px 0' }}>
        <div style={{ width: 46 }} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
          <div style={{ width: 2, height: 8, background: bus.color + '55' }} />
        </div>
        <button
          onClick={() => setMidOpen(o => !o)}
          style={{
            background: 'var(--line)', border: 'none', borderRadius: 10,
            padding: '5px 14px', fontSize: 12, fontWeight: 700, fontFamily: 'inherit',
            cursor: 'pointer', color: 'var(--ink-soft)',
          }}
        >
          {midOpen ? `▲ ${t.hideTimeline || 'Elrejtés'}` : `▼ ${middle.length} ${t.stopDetailsLabel || 'megálló részletei'}`}
        </button>
      </div>

      {midOpen && middle.map((stop, i) => (
        <StopRow key={i} stop={stop} prominent={false} isLast={false} />
      ))}

      {!midOpen && (
        <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 4 }}>
          <div style={{ width: 46 }} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
            <div style={{ width: 2, height: 16, background: bus.color + '55' }} />
          </div>
        </div>
      )}

      <StopRow stop={last} prominent isLast />
    </div>
  );
}

function BusRouteMap({ bus, color, selectedDep, nowMins, fmt, modalRef }) {
  const mapRef = React.useRef(null);
  const instanceRef = React.useRef(null);
  const busKey = `${bus.id}-${bus.direction}-${selectedDep ?? 'none'}`;

  React.useEffect(() => {
    const handler = () => setTimeout(() => instanceRef.current?.invalidateSize(), 100);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  React.useEffect(() => {
    if (!mapRef.current || instanceRef.current) return;

    const stops = bus.stops.filter(s => s.lat && s.lon);
    if (stops.length < 2) return;

    const map = L.map(mapRef.current, { zoomControl: true });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
    }).addTo(map);

    // Útvonal vonal — GTFS shape ha elérhető, fallback: légvonal
    const allStopCoords = stops.map(s => [s.lat, s.lon]);
    const shapes = (window.CITY_SHAPES || {})[bus.id];
    let routeCoords = null;

    if (shapes && shapes.length && window.nearestShapeIdx) {
      const first = stops[0], last = stops[stops.length - 1];
      const isCircular = first.name === last.name;

      if (isCircular) {
        const best = shapes.reduce((a, b) => b.coords.length > a.coords.length ? b : a, shapes[0]);
        routeCoords = best.coords;
      } else {
        // Shape kiválasztás: mindkét orientációt értékeljük endpoint távolság + lefedettség alapján
        const norm = s => s.toLowerCase().replace(/[.,]/g, '').trim();
        const lastN = norm(last.name);
        const END_THR = 0.0045; // ~500m

        // Mindkét orientáció: végpontok közel + legtöbb lefedett megálló
        let chosenCoords = null;
        {
          let bestScore = -1;
          for (const s of shapes) {
            for (const coords of [s.coords, [...s.coords].reverse()]) {
              const fi = window.nearestShapeIdx(coords, first.lat, first.lon);
              const ti = window.nearestShapeIdx(coords, last.lat, last.lon);
              if (fi >= ti) continue;
              const dF = Math.hypot(coords[fi][0]-first.lat, coords[fi][1]-first.lon);
              const dL = Math.hypot(coords[ti][0]-last.lat, coords[ti][1]-last.lon);
              if (dF > END_THR || dL > END_THR) continue;
              const covered = stops.filter(st => {
                const idx = window.nearestShapeIdx(coords, st.lat, st.lon);
                const p = coords[idx];
                return Math.hypot(p[0]-st.lat, p[1]-st.lon) < 0.00045;
              }).length;
              if (covered > bestScore) { bestScore = covered; chosenCoords = coords; }
            }
          }
        }

        // 3. Fallback: végpontkorlát nélkül, legtöbb lefedett
        if (!chosenCoords) {
          let bestScore = -1;
          for (const s of shapes) {
            for (const coords of [s.coords, [...s.coords].reverse()]) {
              const fi = window.nearestShapeIdx(coords, first.lat, first.lon);
              const ti = window.nearestShapeIdx(coords, last.lat, last.lon);
              if (fi >= ti) continue;
              const covered = stops.filter(st => {
                const idx = window.nearestShapeIdx(coords, st.lat, st.lon);
                const p = coords[idx];
                return Math.hypot(p[0]-st.lat, p[1]-st.lon) < 0.00045;
              }).length;
              if (covered > bestScore) { bestScore = covered; chosenCoords = coords; }
            }
          }
        }

        if (chosenCoords && chosenCoords.length >= 2) {
          const f = window.nearestShapeIdx(chosenCoords, first.lat, first.lon);
          const t = window.nearestShapeIdx(chosenCoords, last.lat, last.lon);

          // Wraparound: ha a megállók indexei visszaugranak (pl. 47-es busz),
          // min/max alapján vágjuk a shape-et
          const covIdxs = stops.map(s => window.nearestShapeIdx(chosenCoords, s.lat, s.lon))
            .filter((idx, i) => Math.hypot(chosenCoords[idx][0]-stops[i].lat, chosenCoords[idx][1]-stops[i].lon) < 0.00045);
          let isWraparound = false;
          for (let i = 1; i < covIdxs.length; i++) {
            if (covIdxs[i] < covIdxs[i-1] - 50) { isWraparound = true; break; }
          }
          const [sf, st] = isWraparound
            ? [Math.min(...covIdxs), Math.max(...covIdxs)]
            : [f, t];
          const seg = chosenCoords.slice(sf, st + 1);
          if (isWraparound) {
            const dFirst = Math.hypot(seg[0][0]-first.lat, seg[0][1]-first.lon) * 111000;
            if (dFirst > 50) {
              // Keresünk másik shape-t ami az első megállótól a shape kezdetéig vezet
              let prefix = null;
              for (const s of shapes) {
                const si = window.nearestShapeIdx(s.coords, first.lat, first.lon);
                const ti = window.nearestShapeIdx(s.coords, seg[0][0], seg[0][1]);
                if (si >= ti) continue;
                const dS = Math.hypot(s.coords[si][0]-first.lat, s.coords[si][1]-first.lon) * 111000;
                const dT = Math.hypot(s.coords[ti][0]-seg[0][0], s.coords[ti][1]-seg[0][1]) * 111000;
                if (dS < 100 && dT < 100) { prefix = s.coords.slice(si, ti + 1); break; }
              }
              routeCoords = prefix ? [...prefix, ...seg.slice(1)] : [[first.lat, first.lon], ...seg];
            } else {
              routeCoords = seg;
            }
          } else {
            routeCoords = seg;
          }
        }
      }
    }

    // Endpoints snappelése a pontos megálló-koordinátákra (shape nearest-point eltérés kiküszöbölése)
    const rawCoords = routeCoords || allStopCoords;
    const finalCoords = rawCoords.length >= 2 && routeCoords
      ? [[stops[0].lat, stops[0].lon], ...rawCoords.slice(1, -1), [stops[stops.length - 1].lat, stops[stops.length - 1].lon]]
      : rawCoords;
    L.polyline(finalCoords, { color, weight: 5, opacity: 0.85 }).addTo(map);

    // Megálló jelölők + iránnyilak a közbülsőkön
    stops.forEach((stop, i) => {
      const isTerminal = i === 0 || i === stops.length - 1;
      const time = selectedDep !== undefined ? selectedDep + stop.offset : null;
      const isPast = time !== null && time < nowMins;
      const r = isTerminal ? 9 : 6;

      L.circleMarker([stop.lat, stop.lon], {
        radius: r, color: 'white', weight: 2,
        fillColor: isPast ? '#bbb' : color, fillOpacity: 0.95,
      }).addTo(map).bindPopup(`<b>${stop.name}</b>${time !== null ? `<br>${fmt(time)}` : ''}`);

      if (time !== null) {
        const borderColor = isPast ? '#bbb' : color;
        const textColor = isPast ? '#aaa' : '#222';
        const labelHtml = `<div style="position:absolute;left:${r + 5}px;top:-10px;background:white;border:1.5px solid ${borderColor};border-radius:4px;padding:1px 6px;font-size:11px;font-weight:700;color:${textColor};white-space:nowrap;box-shadow:0 1px 3px rgba(0,0,0,0.15);">${fmt(time)}</div>`;
        L.marker([stop.lat, stop.lon], {
          icon: L.divIcon({ className: '', html: labelHtml, iconSize: [0, 0], iconAnchor: [0, 0] }),
          interactive: false, zIndexOffset: 200,
        }).addTo(map);
      }

      // Irányjel a közbülső megállókon
      if (!isTerminal && i > 0) {
        const prev = stops[i - 1], next = stops[i + 1] || stop;
        const dy = next.lat - prev.lat, dx = next.lon - prev.lon;
        const angle = Math.atan2(dx, dy) * 180 / Math.PI;
        const svg = `<svg xmlns="http://www.w3.org/2000/svg"
          style="position:absolute;left:-12px;top:-32px;transform-origin:12px 32px;transform:rotate(${angle}deg)"
          width="24" height="40">
          <polygon points="12,6 19,26 12,19 5,26" fill="black" stroke="white" stroke-width="2" stroke-linejoin="round"/>
        </svg>`;
        L.marker([stop.lat, stop.lon], {
          icon: L.divIcon({ className: '', html: svg, iconSize: [0, 0], iconAnchor: [0, 0] }),
          interactive: false, zIndexOffset: 100,
        }).addTo(map);
      }
    });

    instanceRef.current = map;
    setTimeout(() => {
      map.invalidateSize();
      map.fitBounds(allStopCoords, { padding: [30, 30] });
    }, 50);

    return () => { map.remove(); instanceRef.current = null; };
  }, [busKey]);

  function toggleFullscreen() {
    const el = modalRef?.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  const [fsState, setFsState] = React.useState(!!document.fullscreenElement);
  React.useEffect(() => {
    const h = () => setFsState(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', h);
    return () => document.removeEventListener('fullscreenchange', h);
  }, []);
  React.useEffect(() => {
    const h = (e) => { if (e.key === 'Escape' && document.fullscreenElement) document.exitFullscreen(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, []);

  return (
    <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div ref={mapRef} style={{ flex: 1, width: '100%' }} />
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

window.BusTimetableModal = BusTimetableModal;

// Menetrendek dropdown — közös komponens, főoldalon és city oldalon is elérhető
function TimetableDropdown({ onSelect, upward, tabStyle, bgColor, lang }) {
  const t = (window.I18N && window.I18N[lang || "hu"]) || window.I18N?.hu || {};
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  const buses = [...new Map((window.CITY_BUSES_FULL||[]).map(b=>[b.id,b])).values()];

  React.useEffect(() => {
    if (!open) return;
    function outside(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", outside);
    return () => document.removeEventListener("mousedown", outside);
  }, [open]);

  const dropPos = upward
    ? { bottom:"calc(100% + 6px)", left:"50%", transform:"translateX(-50%)" }
    : { top:"calc(100% + 6px)", left:0 };

  return (
    <div ref={ref} style={{
      position:"relative",
      flex: tabStyle ? 1 : undefined,
      display: tabStyle ? "flex" : "inline-block",
      background: bgColor || undefined,
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={tabStyle ? {
          flex:1, width:"100%", height:"100%", display:"flex", flexDirection:"column",
          alignItems:"center", justifyContent:"center", gap:2,
          background:"none", border:"none", cursor:"pointer",
          borderTop: open ? "2px solid #FFC93C" : "2px solid transparent",
        } : {
          display:"inline-flex", alignItems:"center", gap:6,
          background: bgColor || "var(--line)",
          color: bgColor ? "white" : "var(--ink)",
          border:"none", borderRadius:10, padding:"10px 14px", cursor:"pointer",
          fontFamily:"Nunito,sans-serif", fontSize:13, fontWeight:800,
          boxShadow: bgColor ? "0 8px 24px rgba(0,0,0,0.2)" : "none",
        }}
      >
        {tabStyle ? (
          <>
            <span style={{fontSize:18, lineHeight:1}}>🗓</span>
            <span style={{fontSize:10, fontWeight:700, fontFamily:"Nunito,sans-serif", color:"rgba(255,255,255,0.9)", letterSpacing:"0.02em"}}>{t.timetables || "Menetrendek"}</span>
          </>
        ) : (
          <>🗓 {t.timetables || "Menetrendek"} {open ? "▲" : "▼"}</>
        )}
      </button>
      {open && (
        <div style={{
          position:"absolute", ...dropPos,
          background:"white", borderRadius:14, padding:"12px 14px",
          boxShadow:"0 8px 28px rgba(0,0,0,0.15)", border:"2px solid var(--line)",
          display:"flex", gap:8, flexWrap:"wrap", zIndex:500, minWidth:220,
        }}>
          {buses.map(b => (
            <button key={b.id} title={b.label}
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
window.TimetableDropdown = TimetableDropdown;
