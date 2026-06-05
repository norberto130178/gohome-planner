/* ============================================================
   BusTimetableModal — busz menetrend nézet (modal/overlay)
   ============================================================ */

// Counter to safely manage body scroll lock with multiple potential modals
let _modalOpenCount = 0;

function BusTimetableModal({ busId, onClose, fromStop, isWeekend: isWeekendProp, nowMins: nowMinsProp }) {
  const U = window.BUS_UTILS;
  const fmt = (m) => U.fmtTime(m);

  const _now = new Date();
  const nowMins = nowMinsProp !== undefined ? nowMinsProp : _now.getHours() * 60 + _now.getMinutes();
  const isWeekend = isWeekendProp !== undefined ? isWeekendProp : (_now.getDay() === 0 || _now.getDay() === 6);

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
    const sched = (isWeekend ? bus.departures.weekend : bus.departures.workday) || {};
    const deps = [];
    Object.entries(sched)
      .sort((a, b) => Number(a[0]) - Number(b[0]))
      .forEach(([h, mins]) => mins.forEach(m => deps.push(Number(h) * 60 + m)));
    return deps;
  }

  const dirData = allDirs.map(bus => {
    const deps = getDeps(bus);
    const nextIdx = deps.findIndex(d => d >= nowMins);
    return { bus, deps, nextIdx: nextIdx >= 0 ? nextIdx : 0 };
  });

  // All hooks before any early return
  const [selected, setSelected] = React.useState(() => {
    const dirIdx = fromStop
      ? Math.max(0, allDirs.findIndex(b => b.stops[0].name === fromStop))
      : 0;
    return { dirIdx, depIdx: dirData[dirIdx]?.nextIdx ?? 0 };
  });
  const [stopsOpen, setStopsOpen] = React.useState(false);
  const [mapOpen, setMapOpen] = React.useState(false);

  // Vonalváltáskor reset
  React.useEffect(() => {
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

  if (!allDirs.length) return null;

  function shortName(name) {
    return name.split(',')[0].split(' /')[0].split(' ▸')[0];
  }

  const bus0 = allDirs[0];
  const selBus = allDirs[selected.dirIdx];
  const selDep = dirData[selected.dirIdx]?.deps[selected.depIdx];
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
      <div style={{
        background: 'white',
        borderRadius: isDesktop ? 20 : '20px 20px 0 0',
        width: '100%',
        maxWidth: isDesktop ? 560 : 680,
        maxHeight: isDesktop ? '80vh' : '90vh',
        overflow: 'hidden', display: 'flex', flexDirection: 'column',
        boxShadow: '0 8px 40px rgba(0,0,0,0.35)',
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
            <div style={{ fontSize: 11, opacity: 0.8 }}>
              {isWeekend ? 'Hétvégi' : 'Hétköznapi'} menetrend
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
              background: mapOpen ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.25)', border: 'none',
              borderRadius: '50%', width: 36, height: 36,
              cursor: 'pointer', color: 'white', fontSize: 18,
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
        <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
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
                  {deps.map((dep, i) => {
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
                        }}
                      >{fmt(dep)}</button>
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
              {stopsOpen ? '▲ Megállók elrejtése' : `▼ ${middleCount} közbülső megálló`}
            </button>
            {stopsOpen && (
              <div style={{ maxHeight: '45vh', overflowY: 'auto' }}>
                <StopTimeline bus={selBus} selectedDep={selDep} nowMins={nowMins} fmt={fmt} />
              </div>
            )}
          </div>
        )}

        {/* Térkép szekció */}
        {mapOpen && (
          <div style={{ flexShrink: 0, borderTop: '2px solid var(--line)' }}>
            <BusRouteMap bus={selBus} color={bus0.color} selectedDep={selDep} nowMins={nowMins} fmt={fmt} />
          </div>
        )}
      </div>
    </div>
  );

  return ReactDOM.createPortal(modal, document.body);
}

function StopTimeline({ bus, selectedDep, nowMins, fmt }) {
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
          {midOpen ? '▲ Elrejtés' : `▼ ${middle.length} megálló részletei`}
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

function BusRouteMap({ bus, color, selectedDep, nowMins, fmt }) {
  const mapRef = React.useRef(null);
  const instanceRef = React.useRef(null);

  React.useEffect(() => {
    if (!mapRef.current || instanceRef.current) return;

    const stops = bus.stops.filter(s => s.lat && s.lon);
    if (stops.length < 2) return;

    const map = L.map(mapRef.current, { zoomControl: true });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
    }).addTo(map);

    // Útvonal vonal
    const coords = stops.map(s => [s.lat, s.lon]);
    L.polyline(coords, { color, weight: 5, opacity: 0.85 }).addTo(map);

    // Megálló jelölők
    stops.forEach((stop, i) => {
      const isTerminal = i === 0 || i === stops.length - 1;
      const time = selectedDep !== undefined ? selectedDep + stop.offset : null;
      const isPast = time !== null && time < nowMins;
      const label = time !== null ? `${stop.name}\n${fmt(time)}` : stop.name;

      L.circleMarker([stop.lat, stop.lon], {
        radius: isTerminal ? 9 : 6,
        color: 'white',
        weight: 2,
        fillColor: isPast ? '#bbb' : color,
        fillOpacity: 0.95,
      }).addTo(map).bindPopup(`<b>${stop.name}</b>${time !== null ? `<br>${fmt(time)}` : ''}`);
    });

    map.fitBounds(coords, { padding: [16, 16] });
    instanceRef.current = map;

    return () => { map.remove(); instanceRef.current = null; };
  }, [bus, selectedDep]);

  return (
    <div ref={mapRef} style={{ height: 380, width: '100%' }} />
  );
}

window.BusTimetableModal = BusTimetableModal;
