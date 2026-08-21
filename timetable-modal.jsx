/* ============================================================
   BusTimetableModal — busz menetrend nézet (modal/overlay)
   ============================================================ */

// Counter to safely manage body scroll lock with multiple potential modals
let _modalOpenCount = 0;

/* ── StopSearch — kereshető megálló-választó (közös: city.html + index.html) ── */
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
function StopSearch({ value, onChange, placeholder, id, stopList }) {
  const [query, setQuery] = React.useState(value || "");
  const [open, setOpen] = React.useState(false);
  const [dropdownStyle, setDropdownStyle] = React.useState({});
  const ref = React.useRef(null);
  const skipNextOpenRef = React.useRef(false);
  const pendingFocusFirstRef = React.useRef(false);

  React.useEffect(() => { setQuery(value || ""); }, [value]);

  // A látható terület (visualViewport) figyelembevétele — mobilon a virtuális billentyűzet
  // csak a visualViewport-ot zsugorítja, a layout viewport-ot nem, így a `position:fixed`
  // dropdown enélkül a billentyűzet mögé/alá pozicionálódna. Kevés hely esetén felfelé nyílik.
  function reposition() {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const vv = window.visualViewport;
    const viewportH = vv ? vv.height + vv.offsetTop : window.innerHeight;
    const spaceBelow = viewportH - rect.bottom - 8;
    const spaceAbove = rect.top - (vv ? vv.offsetTop : 0) - 8;
    if (spaceBelow < 140 && spaceAbove > spaceBelow) {
      setDropdownStyle({
        position: 'fixed', bottom: window.innerHeight - rect.top + 4,
        left: rect.left, width: rect.width, maxHeight: Math.max(120, Math.min(280, spaceAbove)),
      });
    } else {
      setDropdownStyle({
        position: 'fixed', top: rect.bottom + 4,
        left: rect.left, width: rect.width, maxHeight: Math.max(120, Math.min(280, spaceBelow)),
      });
    }
  }

  function calcAndOpen() {
    if (skipNextOpenRef.current) { skipNextOpenRef.current = false; return; }
    reposition();
    setOpen(true);
  }

  React.useEffect(() => {
    if (!open) return;
    reposition();
    const vv = window.visualViewport;
    vv?.addEventListener('resize', reposition);
    vv?.addEventListener('scroll', reposition);
    window.addEventListener('resize', reposition);
    return () => {
      vv?.removeEventListener('resize', reposition);
      vv?.removeEventListener('scroll', reposition);
      window.removeEventListener('resize', reposition);
    };
  }, [open]);

  React.useEffect(() => {
    function outside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", outside);
    return () => document.removeEventListener("mousedown", outside);
  }, []);

  React.useEffect(() => {
    if (open && pendingFocusFirstRef.current) {
      pendingFocusFirstRef.current = false;
      ref.current?.querySelectorAll('[role="option"]')?.[0]?.focus();
    }
  }, [open]);

  const filtered = React.useMemo(() => {
    const source = stopList || ALL_STOPS;
    if (!query) return source;
    const norm = str => str.normalize("NFD").replace(/[̀-ͯ]/g, "");
    const queryWords = norm(query.toLowerCase().trim()).split(/\s+/);
    return source.filter(s => {
      const stopWords = norm(s.toLowerCase()).split(/[\s/\-,()+]+/).filter(Boolean);
      return queryWords.every(qw => stopWords.some(sw => sw.startsWith(qw)));
    });
  }, [query, stopList]);

  function select(stop) {
    onChange(stop);
    setQuery(stop);
    setOpen(false);
    skipNextOpenRef.current = true;
    ref.current?.querySelector('input')?.focus();
  }

  function handleChange(e) {
    setQuery(e.target.value);
    calcAndOpen();
    if (!e.target.value) onChange("");
  }

  function handleBlur(e) {
    const relatedTarget = e.relatedTarget;
    setTimeout(() => {
      if (!ref.current?.contains(relatedTarget)) {
        setOpen(false);
        setQuery(value || "");
      }
    }, 200);
  }

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <input
        id={id}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        value={query}
        onChange={handleChange}
        onClick={calcAndOpen}
        onBlur={handleBlur}
        onKeyDown={e => {
          if (e.key === "Escape") { setOpen(false); e.target.blur(); }
          else if (e.key === "Tab") { setOpen(false); }
          else if (e.key === "ArrowDown") {
            e.preventDefault();
            if (open) { ref.current?.querySelectorAll('[role="option"]')?.[0]?.focus(); }
            else { pendingFocusFirstRef.current = true; calcAndOpen(); }
          }
          else if (e.key === "ArrowUp") {
            e.preventDefault();
            if (open) {
              const items = ref.current?.querySelectorAll('[role="option"]');
              items?.[items.length - 1]?.focus();
            }
          }
        }}
        placeholder={placeholder}
        autoComplete="off"
        className="v1-time-input"
        style={{ width: "100%", fontSize: 14, paddingRight: query ? 32 : undefined }}
      />
      {query && (
        <button
          onMouseDown={e => e.preventDefault()}
          onClick={() => { setQuery(""); onChange(""); ref.current?.querySelector('input')?.focus(); }}
          onBlur={handleBlur}
          style={{
            position: "absolute", right: 4, top: "50%", transform: "translateY(-50%)",
            background: "none", border: "none", cursor: "pointer",
            fontSize: 18, color: "var(--ink-soft)", padding: 0, lineHeight: 1,
            minWidth: 44, minHeight: 44, display: "flex", alignItems: "center", justifyContent: "center",
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
              role="option"
              tabIndex={-1}
              onMouseDown={e => e.preventDefault()}
              onClick={() => select(stop)}
              onKeyDown={(e, idx2 = filtered.indexOf(stop)) => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(stop); }
                else if (e.key === 'Escape') { skipNextOpenRef.current = true; setOpen(false); ref.current?.querySelector('input')?.focus(); }
                else if (e.key === 'Tab') { setOpen(false); }
                else if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  const items = ref.current?.querySelectorAll('[role="option"]');
                  if (items && idx2 < items.length - 1) items[idx2 + 1].focus();
                }
                else if (e.key === 'ArrowUp') {
                  e.preventDefault();
                  const items = ref.current?.querySelectorAll('[role="option"]');
                  if (idx2 > 0) items[idx2 - 1].focus();
                  else ref.current?.querySelector('input')?.focus();
                }
              }}
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
window.StopSearch = StopSearch;


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

  const didPushRef = React.useRef(false);
  React.useEffect(() => {
    history.pushState({ timetableModal: true }, "");
    didPushRef.current = true;
    function onPop() {
      // Ha felettünk nyitva van a megálló-néző, ez a popstate az övé (az ő
      // pushState-jét zárja) — a mi state-ünk marad, ne záródjunk be vele.
      if (window.__stopViewerOpen) return;
      didPushRef.current = false;
      onClose();
    }
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  function handleClose() {
    if (didPushRef.current) {
      didPushRef.current = false;
      history.back();
    } else {
      onClose();
    }
  }

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
  const closeButtonRef = React.useRef(null);
  const triggerRef = React.useRef(null);

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
    const handler = (e) => { if (e.key === 'Escape' && !window.__stopViewerOpen && Date.now() > (window.__escGuardUntil || 0)) handleClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  React.useEffect(() => {
    triggerRef.current = document.activeElement;
    closeButtonRef.current?.focus();
    return () => { triggerRef.current?.focus(); };
  }, []);

  React.useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;
    function trap(e) {
      if (e.key !== 'Tab') return;
      const focusable = Array.from(modal.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      ));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
    modal.addEventListener('keydown', trap);
    return () => modal.removeEventListener('keydown', trap);
  }, []);

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
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        background: 'rgba(0,0,0,0.55)',
        display: 'flex',
        alignItems: isDesktop ? 'center' : 'flex-end',
        justifyContent: 'center',
      }}
    >
      <div ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${bus0.id} – ${window.busLabel(bus0, t)}`}
        style={{
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
          <button onClick={goPrev} aria-label={lang === "hu" ? "Előző járat" : "Previous bus"} style={{
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
            <div style={{ fontSize: 17, fontWeight: 900 }}>{window.busLabel(bus0, t)}</div>
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
          <button onClick={goNext} aria-label={lang === "hu" ? "Következő járat" : "Next bus"} style={{
            background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%',
            width: 32, height: 32, cursor: 'pointer', color: 'white', fontSize: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>▶</button>
          <button
            onClick={() => setMapOpen(o => !o)}
            title={t.routeOnMap || "Útvonal a térképen"}
            aria-label={t.routeOnMap || "Útvonal a térképen"}
            aria-pressed={mapOpen}
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
            ref={closeButtonRef}
            onClick={handleClose}
            aria-label={lang === "hu" ? "Bezárás" : "Close"}
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
              Object.entries(b.footnotes).map(([k, v]) => {
                const [huText, enText] = v.split(' / ');
                const text = lang === "hu" ? huText : (enText || huText);
                return (
                  <div key={`${di}-${k}`} style={{ fontSize:11, color:'var(--ink-soft)', lineHeight:1.5 }}>
                    <sup style={{fontWeight:900}}>{k}</sup> {text}
                  </div>
                );
              })
            ))}
          </div>
        )}

        {/* Térkép szekció */}
        {mapOpen && (
          <div style={{ flex: 1, minHeight: 320, borderTop: '2px solid var(--line)', display: 'flex', flexDirection: 'column' }}>
            <BusRouteMap bus={selBus} color={bus0.color} selectedDep={selDep} nowMins={nowMins} fmt={fmt}
              modalRef={modalRef} lang={lang} />
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

function BusRouteMap({ bus, color, selectedDep, nowMins, fmt, modalRef, lang }) {
  const t = (window.I18N && window.I18N[lang || "hu"]) || window.I18N?.hu || {};
  const mapRef = React.useRef(null);
  const instanceRef = React.useRef(null);
  const fitCoordsRef = React.useRef(null);
  const busKey = `${bus.id}-${bus.direction}-${selectedDep ?? 'none'}`;

  React.useEffect(() => {
    const handler = () => setTimeout(() => {
      instanceRef.current?.invalidateSize();
      if (fitCoordsRef.current) instanceRef.current?.fitBounds(fitCoordsRef.current, { padding: [30, 30] });
    }, 100);
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
      }).addTo(map).bindPopup(() => window.stopPopupContent(stop.name, time !== null ? fmt(time) : null));

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
    fitCoordsRef.current = allStopCoords;
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
    const h = (e) => { if (e.key === 'Escape' && !window.__stopViewerOpen && Date.now() > (window.__escGuardUntil || 0) && document.fullscreenElement) document.exitFullscreen(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, []);

  return (
    <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div ref={mapRef} style={{ flex: 1, width: '100%' }} />
      <button onClick={toggleFullscreen} title={fsState ? (t.exitFullscreen || 'Kilépés') : (t.fullscreen || 'Teljes képernyő')} aria-label={fsState ? (t.exitFullscreen || 'Kilépés') : (t.fullscreen || 'Teljes képernyő')} style={{
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
function TimetableDropdown({ onSelect, upward, tabStyle, fabStyle, bgColor, lang }) {
  const t = (window.I18N && window.I18N[lang || "hu"]) || window.I18N?.hu || {};
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  const panelRef = React.useRef(null);
  const savedFocusRef = React.useRef(null);
  const buses = [...new Map((window.CITY_BUSES_FULL||[]).map(b=>[b.id,b])).values()];

  React.useEffect(() => {
    if (!open) return;
    function outside(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    function onKey(e) { if (e.key === "Escape") setOpen(false); }
    document.addEventListener("mousedown", outside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", outside);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  React.useEffect(() => {
    if (open) {
      savedFocusRef.current = document.activeElement;
      panelRef.current?.querySelector('button')?.focus();
    } else if (savedFocusRef.current) {
      savedFocusRef.current.focus();
      savedFocusRef.current = null;
    }
  }, [open]);

  React.useEffect(() => {
    if (!open || !panelRef.current) return;
    const panel = panelRef.current;
    function trap(e) {
      if (e.key !== 'Tab') return;
      const buttons = Array.from(panel.querySelectorAll('button:not([disabled])'));
      if (!buttons.length) return;
      const first = buttons[0], last = buttons[buttons.length - 1];
      if (e.shiftKey) { if (document.activeElement === first) { e.preventDefault(); last.focus(); } }
      else { if (document.activeElement === last) { e.preventDefault(); first.focus(); } }
    }
    panel.addEventListener('keydown', trap);
    return () => panel.removeEventListener('keydown', trap);
  }, [open]);

  const dropPos = upward
    ? (fabStyle
        ? { bottom:"calc(100% + 6px)", right:0 }
        : { bottom:"calc(100% + 6px)", left:"50%", transform:"translateX(-50%)" })
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
        data-tooltip={fabStyle ? (t.timetables || "Menetrendek") : undefined}
        data-tooltip-dir={fabStyle ? "left" : undefined}
        aria-label={fabStyle ? (t.timetables || "Menetrendek") : undefined}
        style={fabStyle ? {
          width:44, height:44, borderRadius:"50%",
          background:"#1a2a3a", color:"white", border:"none",
          cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:22, boxShadow:"0 3px 14px rgba(0,0,0,0.28)",
          transition:"transform 0.15s, background 0.12s",
        } : tabStyle ? {
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
        {fabStyle ? "🗓" : tabStyle ? (
          <>
            <span style={{fontSize:18, lineHeight:1}}>🗓</span>
            <span style={{fontSize:10, fontWeight:700, fontFamily:"Nunito,sans-serif", color:"rgba(255,255,255,0.9)", letterSpacing:"0.02em"}}>{t.timetables || "Menetrendek"}</span>
          </>
        ) : (
          <>🗓 {t.timetables || "Menetrendek"} {open ? "▲" : "▼"}</>
        )}
      </button>
      {open && (
        <div ref={panelRef} style={{
          position:"absolute", ...dropPos,
          background:"white", borderRadius:14, padding:"12px 14px",
          boxShadow:"0 8px 28px rgba(0,0,0,0.15)", border:"2px solid var(--line)",
          display:"flex", gap:8, flexWrap:"wrap", zIndex:500, minWidth:220,
        }}>
          {buses.map(b => (
            <button key={b.id} title={window.busLabel(b, t)}
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

/* ============================================================
   StopTimetableModal — megálló-néző ("departure board")
   Egy kiválasztott megálló összes indulása, vonal-chipekkel
   szűrhetően, teljes napi listával, "most"-hoz görgetve.
   A megálló-keresőt a city-app.jsx StopSearch komponense adja
   (window.StopSearch) — ezért egyelőre csak a city.html oldalon
   használható.
   ============================================================ */
function StopTimetableModal({ onClose, dayType, lang, initialStop, initialMode }) {
  const U = window.BUS_UTILS;
  const fmt = (m) => U.fmtTime(m);
  const t = (window.I18N && window.I18N[lang || "hu"]) || window.I18N?.hu || {};

  const _now = new Date();
  const nowMins = _now.getHours() * 60 + _now.getMinutes();

  // initialStop: pl. térképi megállóra kattintva rögtön a listanézet nyílik, kereső nélkül
  const [selectedStop, setSelectedStop] = React.useState(initialStop || null);

  // Fullscreen térképnézetből nyitva a body-ba portalozott modal a fullscreen elem
  // mögé kerülne (a böngésző csak a fullscreen-elem leszármazottait mutatja) —
  // ezért a modalt magába a fullscreen elembe portalozzuk, így a térkép fullscreen
  // marad és a modal felette nyílik (✕-szel zárva fullscreen is marad).
  // ESC-re viszont a böngésző mindenképp kilép a fullscreenből (nem előzhető meg,
  // és az ESC keydown-t gyakran el is nyeli) — ilyenkor a modalt is bezárjuk, hogy
  // egyetlen ESC egyszerre zárja mindkettőt, ne maradjon ott a modal egy második
  // ESC-ig a térkép-konténerben ragadva (villódzás).
  const [portalTarget, setPortalTarget] = React.useState(() => document.fullscreenElement || document.body);
  const openedInFullscreenRef = React.useRef(!!document.fullscreenElement);
  React.useEffect(() => {
    const h = () => {
      if (openedInFullscreenRef.current && !document.fullscreenElement) {
        setPortalTarget(document.body);
        handleClose();
        return;
      }
      setPortalTarget(document.fullscreenElement || document.body);
    };
    document.addEventListener('fullscreenchange', h);
    return () => document.removeEventListener('fullscreenchange', h);
  }, []);

  // Globális jelző: amíg a megálló-néző nyitva van, az alatta lévő rétegek
  // (térkép-komponensek fullscreen-ESC kezelői, BusTimetableModal ESC-je)
  // ne reagáljanak az ESC-re — rétegzett zárás, mindig a legfelső záródik.
  React.useEffect(() => {
    window.__stopViewerOpen = true;
    return () => { window.__stopViewerOpen = false; };
  }, []);

  // Chromium Keyboard Lock: fullscreenből nyitva lefoglaljuk az ESC-et, így az
  // NEM lépteti ki a böngészőt a fullscreenből, hanem eljut a mi kezelőnkhöz és
  // csak a modalt zárja — a térkép fullscreenben marad. (Hosszan nyomott ESC
  // böngésző-garanciaként továbbra is kilép — arra a fullscreenchange ág zár.)
  // Nem támogatott böngészőben (Firefox/Safari) marad a fallback: egy ESC a
  // fullscreent és a modalt együtt zárja.
  React.useEffect(() => {
    if (openedInFullscreenRef.current && navigator.keyboard && navigator.keyboard.lock) {
      navigator.keyboard.lock(['Escape']).catch(() => {});
      return () => {
        // A lock feloldását megvárakoztatjuk az ESC felengedéséig (+ rövid ráhagyás):
        // ha a modal záró ESC-je közben oldanánk fel, a böngésző a keyup-ot / az
        // ismétlődő keydown-t már lock nélkül látná, és kiléptetné a fullscreent is.
        let done = false;
        const doUnlock = () => {
          if (done) return; done = true;
          window.removeEventListener('keyup', onUp);
          try { navigator.keyboard.unlock(); } catch (e) {}
        };
        const onUp = (e) => { if (e.key === 'Escape') setTimeout(doUnlock, 100); };
        window.addEventListener('keyup', onUp);
        setTimeout(doUnlock, 1200); // fallback, ha nem ESC zárta a modalt
      };
    }
  }, []);
  const [activeDayType, setActiveDayType] = React.useState(dayType || "workday");
  const [activeIds, setActiveIds] = React.useState(null); // null = minden vonal aktív
  const [viewMode, setViewMode] = React.useState(initialMode === 'intercity' ? 'intercity' : 'city'); // 'city' | 'intercity'
  const intercitySupported = !!window.INTERCITY_BUSES_FULL;

  // --- Modal boilerplate (history back, ESC, scroll-lock, fókusz) ---
  const didPushRef = React.useRef(false);
  React.useEffect(() => {
    history.pushState({ stopTimetableModal: true }, "");
    didPushRef.current = true;
    function onPop() { didPushRef.current = false; onClose(); }
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  function handleClose() {
    if (didPushRef.current) { didPushRef.current = false; history.back(); }
    else onClose();
  }

  React.useEffect(() => {
    _modalOpenCount++;
    document.body.style.overflow = 'hidden';
    return () => {
      _modalOpenCount--;
      if (_modalOpenCount === 0) document.body.style.overflow = '';
    };
  }, []);

  React.useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') { window.__escGuardUntil = Date.now() + 600; handleClose(); } };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const modalRef = React.useRef(null);
  const closeButtonRef = React.useRef(null);
  const triggerRef = React.useRef(null);
  React.useEffect(() => {
    triggerRef.current = document.activeElement;
    closeButtonRef.current?.focus();
    return () => { triggerRef.current?.focus(); };
  }, []);

  React.useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;
    function trap(e) {
      if (e.key !== 'Tab') return;
      const focusable = Array.from(modal.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      ));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
    modal.addEventListener('keydown', trap);
    return () => modal.removeEventListener('keydown', trap);
  }, []);

  // --- Adatok ---
  const dirsAtStop = React.useMemo(() => {
    if (!selectedStop || viewMode !== 'city') return [];
    return (window.CITY_BUSES_FULL || []).filter(b => U.busVisits(b, selectedStop));
  }, [selectedStop, viewMode]);

  const intercityDirsAtStop = React.useMemo(() => {
    if (!selectedStop || viewMode !== 'intercity' || !window.getIntercityRoutesForPlatformLabel) return [];
    return window.getIntercityRoutesForPlatformLabel(selectedStop);
  }, [selectedStop, viewMode]);

  // Egyedi vonalak a chipekhez (id szerint dedupelve, numerikusan rendezve)
  const lines = React.useMemo(() => {
    const map = new Map();
    for (const b of dirsAtStop) if (!map.has(b.id)) map.set(b.id, b);
    for (const b of intercityDirsAtStop) if (!map.has(b.id)) map.set(b.id, b);
    return [...map.values()].sort((a, b) => {
      const na = parseFloat(a.id), nb = parseFloat(b.id);
      if (na !== nb) return na - nb;
      return a.id.localeCompare(b.id);
    });
  }, [dirsAtStop, intercityDirsAtStop]);

  function isActive(id) {
    return activeIds === null ? true : activeIds.has(id);
  }
  function toggleLine(id) {
    const next = new Set(activeIds === null ? lines.map(l => l.id) : activeIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    setActiveIds(next);
  }

  // Összefésült indulási lista. A csak végállomásként érintett irányokat kihagyjuk
  // (oda csak érkezik a busz, nem indul tovább) — körjáratnál a megálló első
  // előfordulása számít, így az indulási oldala megmarad.
  const mergedDeps = React.useMemo(() => {
    const out = [];
    for (const bus of dirsAtStop) {
      if (!isActive(bus.id)) continue;
      const idx = bus.stops.findIndex(s => s.name === selectedStop);
      if (idx < 0 || idx === bus.stops.length - 1) continue;
      const off = bus.stops[idx].offset;
      const sched = bus.departures[activeDayType] || {};
      for (const [hStr, arr] of Object.entries(sched)) {
        const h = Number(hStr);
        for (const raw of arr) {
          const m = typeof raw === "object" ? raw.t : raw;
          const note = typeof raw === "object" ? raw.n : null;
          out.push({ mins: h * 60 + m + off, note, bus });
        }
      }
    }
    if (viewMode === 'intercity' && selectedStop && window.getIntercityDeparturesForPlatformLabel) {
      for (const e of window.getIntercityDeparturesForPlatformLabel(selectedStop, activeDayType)) {
        if (isActive(e.bus.id)) out.push(e);
      }
    }
    return out.sort((a, b) => a.mins - b.mins);
  }, [dirsAtStop, activeIds, activeDayType, selectedStop, viewMode]);

  const nextIdx = mergedDeps.findIndex(d => d.mins >= nowMins);

  // "Most"-hoz görgetés (lista közepére), megálló/nap/szűrő váltásnál újra
  const listRef = React.useRef(null);
  const nextRowRef = React.useRef(null);
  React.useEffect(() => {
    const list = listRef.current, row = nextRowRef.current;
    if (list && row) {
      list.scrollTop = row.offsetTop - list.clientHeight / 2 + row.clientHeight / 2;
    }
  }, [selectedStop, activeDayType, mergedDeps]);

  // Lábjegyzet-magyarázatok az aktuális listában előforduló jelölésekhez.
  // Vonalanként gyűjtjük, mert ugyanaz a betű más vonalon mást jelenthet;
  // az összetett jelöléseket (pl. "Hv") karakterenként bontjuk (backlog #9).
  const usedFootnotes = React.useMemo(() => {
    const map = new Map(); // "busId|char" -> { busId, color, char, text }
    for (const d of mergedDeps) {
      if (!d.note) continue;
      const fn = d.bus.footnotes || {};
      for (const ch of String(d.note)) {
        const raw = fn[ch] || fn[ch.toUpperCase()];
        if (!raw) continue;
        const key = d.bus.id + '|' + ch.toUpperCase();
        if (map.has(key)) continue;
        const [huText, enText] = raw.split(' / ');
        map.set(key, { busId: d.bus.id, color: d.bus.color, char: ch, text: lang === "hu" ? huText : (enText || huText) });
      }
    }
    return [...map.values()];
  }, [mergedDeps, lang]);

  const isDesktop = window.innerWidth >= 640;
  const headerColor = '#1a2a3a';

  const dayTabs = (['workday', 'schoolholiday', 'weekend']).map(dt => {
    const label = dt === 'workday' ? (t.workday || 'Hétköznap') : dt === 'schoolholiday' ? (t.schoolHolidayLabel || 'Tanszünet') : (t.weekend || 'Hétvége');
    const hasData = viewMode === 'intercity'
      ? intercityDirsAtStop.some(route => route.trips.some(tr => tr.dayTypes.includes(window._dayTypeCat(dt))))
      : dirsAtStop.some(b => b.departures[dt] && Object.keys(b.departures[dt]).length > 0);
    if (selectedStop && !hasData && dt !== activeDayType) return null;
    return (
      <button key={dt} onClick={() => setActiveDayType(dt)} style={{
        background: activeDayType === dt ? 'white' : 'rgba(255,255,255,0.18)',
        border: 'none', borderRadius: 6, padding: '2px 7px',
        color: activeDayType === dt ? headerColor : 'white',
        fontSize: 10, fontWeight: 700, cursor: 'pointer',
        opacity: hasData || !selectedStop ? 1 : 0.5,
      }}>{label}</button>
    );
  });

  const modal = (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        background: 'rgba(0,0,0,0.55)',
        display: 'flex',
        alignItems: isDesktop ? 'center' : 'flex-end',
        justifyContent: 'center',
      }}
    >
      <div ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label={selectedStop || (t.stopViewerTitle || "Megállók")}
        style={{
          background: 'white',
          borderRadius: isDesktop ? 20 : '20px 20px 0 0',
          width: '100%',
          maxWidth: isDesktop ? 560 : 680,
          maxHeight: isDesktop ? '80vh' : '90vh',
          minHeight: selectedStop ? (isDesktop ? '60vh' : '70vh') : undefined,
          overflow: 'hidden', display: 'flex', flexDirection: 'column',
          boxShadow: '0 8px 40px rgba(0,0,0,0.35)',
          fontFamily: 'Nunito, sans-serif',
        }}>

        {/* Fejléc */}
        <div style={{
          background: headerColor, color: 'white',
          padding: '16px 20px', display: 'flex', alignItems: 'center',
          gap: 12, flexShrink: 0,
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            background: 'rgba(255,255,255,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, flexShrink: 0,
          }}>🚏</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 17, fontWeight: 900, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {selectedStop || (t.stopViewerTitle || "Megállók")}
            </div>
            <div style={{ fontSize: 11, opacity: 0.8, display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
              {dayTabs}
            </div>
          </div>
          {selectedStop && (
            <button
              onClick={() => { setSelectedStop(null); setActiveIds(null); }}
              title={t.changeStop || "Megálló váltása"}
              aria-label={t.changeStop || "Megálló váltása"}
              style={{
                background: 'rgba(255,255,255,0.25)', border: 'none',
                borderRadius: '50%', width: 36, height: 36,
                cursor: 'pointer', color: 'white', fontSize: 16,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}
            >🔍</button>
          )}
          <button
            ref={closeButtonRef}
            onClick={handleClose}
            aria-label={lang === "hu" ? "Bezárás" : "Close"}
            style={{
              background: 'rgba(255,255,255,0.25)', border: 'none',
              borderRadius: '50%', width: 36, height: 36,
              cursor: 'pointer', color: 'white', fontSize: 20, fontWeight: 900,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}
          >✕</button>
        </div>

        {!selectedStop ? (
          /* Megálló-választó nézet */
          <div style={{ padding: '24px 20px 32px' }}>
            {intercitySupported && (
              <div role="radiogroup" style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
                {[['city', t.stopViewerCityMode || 'Helyi megállók'], ['intercity', t.stopViewerIntercityMode || 'Helyközi megállók']].map(([mode, label]) => (
                  <button key={mode} type="button" role="radio" aria-checked={viewMode === mode}
                    onClick={() => { setViewMode(mode); setActiveIds(null); }}
                    style={{
                      flex: 1, background: viewMode === mode ? 'var(--accent)' : 'var(--line)',
                      color: viewMode === mode ? 'white' : 'var(--ink)',
                      border: 'none', borderRadius: 10, padding: '8px 10px',
                      fontFamily: 'Nunito,sans-serif', fontSize: 12, fontWeight: 800, cursor: 'pointer',
                    }}
                  >{label}</button>
                ))}
              </div>
            )}
            <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--ink)', marginBottom: 12 }}>
              {t.stopViewerPick || "Melyik megálló indulásait nézzük?"}
            </div>
            {window.StopSearch ? (
              <window.StopSearch
                id="stop-viewer-search"
                value=""
                onChange={(s) => { if (s) { setSelectedStop(s); setActiveIds(null); } }}
                placeholder={t.stopSearchPlaceholder || "— Keress megálló névre —"}
                stopList={viewMode === 'intercity' && window.getIntercityStops ? window.getIntercityStops() : undefined}
              />
            ) : null}
          </div>
        ) : (
          <>
            {/* Vonal-chipek */}
            <div style={{
              display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center',
              padding: '10px 14px', borderBottom: '1px solid var(--line)', flexShrink: 0,
            }}>
              {lines.map(b => {
                const on = isActive(b.id);
                return (
                  <button key={b.id}
                    onClick={() => toggleLine(b.id)}
                    role="checkbox"
                    aria-checked={on}
                    aria-label={window.busLabel(b, t)}
                    style={{
                      width: 34, height: 34, borderRadius: '50%',
                      background: on ? b.color : 'var(--line)',
                      color: on ? 'white' : 'var(--ink-soft)',
                      border: 'none', cursor: 'pointer',
                      fontFamily: 'Nunito,sans-serif', fontSize: 12, fontWeight: 900,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: on ? '0 2px 6px rgba(0,0,0,0.18)' : 'none',
                      opacity: on ? 1 : 0.6,
                      transition: 'all 0.12s',
                    }}
                  >{b.id}</button>
                );
              })}
            </div>

            {/* Indulási lista */}
            <div ref={listRef} style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
              {mergedDeps.length === 0 ? (
                <div style={{ padding: '32px 20px', textAlign: 'center', fontSize: 13, color: 'var(--ink-soft)', fontWeight: 700 }}>
                  {activeIds !== null && activeIds.size === 0
                    ? (t.stopViewerNoLine || "Válassz legalább egy vonalat")
                    : (t.stopViewerNoDeps || "Ezen a napon nincs indulás erről a megállóról")}
                </div>
              ) : mergedDeps.map((d, i) => {
                const isPast = d.mins < nowMins;
                const isNext = i === nextIdx;
                return (
                  <div key={i} ref={isNext ? nextRowRef : null} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '7px 14px',
                    opacity: isPast ? 0.45 : 1,
                    background: isNext ? 'rgba(255,201,60,0.18)' : 'none',
                    borderLeft: isNext ? '4px solid #FFC93C' : '4px solid transparent',
                    borderBottom: '1px solid #f4f2ee',
                  }}>
                    <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 800, fontSize: 15, width: 52, flexShrink: 0, color: 'var(--ink)' }}>
                      {fmt(d.mins)}
                      {d.note && <sup style={{ fontSize: 9, fontWeight: 900, marginLeft: 1 }}>{d.note}</sup>}
                    </span>
                    <span style={{
                      width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                      background: d.bus.color, color: 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 900,
                    }}>{d.bus.id}</span>
                    <span style={{ flex: 1, minWidth: 0, fontSize: 12, fontWeight: 600, color: 'var(--ink-soft)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {d.from && (d.terminus || d.to) ? `${d.from} ▸ ${d.terminus || d.to}` : window.busDirection(d.bus, t)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Lábjegyzet-magyarázatok */}
            {usedFootnotes.length > 0 && (
              <div style={{ flexShrink: 0, borderTop: '1px solid var(--line)', padding: '8px 14px', background: '#fafafa', maxHeight: '20vh', overflowY: 'auto' }}>
                {usedFootnotes.map(f => (
                  <div key={f.busId + f.char} style={{ fontSize: 11, color: 'var(--ink-soft)', lineHeight: 1.5, display: 'flex', alignItems: 'baseline', gap: 5 }}>
                    <span style={{ background: f.color, color: 'white', borderRadius: 5, padding: '0 5px', fontSize: 10, fontWeight: 800, flexShrink: 0 }}>{f.busId}</span>
                    <span><sup style={{ fontWeight: 900 }}>{f.char}</sup> {f.text}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

  return ReactDOM.createPortal(modal, portalTarget);
}
window.StopTimetableModal = StopTimetableModal;
