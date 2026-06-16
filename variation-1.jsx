/* ============================================================
   Variation 1 — Playful Timeline
   Napló-szerű, világos, barátságos, domináns nagy óra + timeline
   ============================================================ */

function MobileSettingsPill({ state, setState }) {
  const [open, setOpen] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState(false);
  const sheetRef = React.useRef(null);
  const dragStartY = React.useRef(null);
  const isDragging = React.useRef(false);
  const lastScrollY = React.useRef(0);

  React.useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      const delta = y - lastScrollY.current;
      lastScrollY.current = y;
      if (delta > 8) setCollapsed(true);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
    dragStartY.current = null;
    isDragging.current = false;
    if (sheetRef.current) { sheetRef.current.style.transition = ""; sheetRef.current.style.transform = ""; }
    if (dy > 80) { setOpen(false); setCollapsed(false); }
  }

  const isNow = state.mode === "now";
  const timePresets = state.direction === "school"
    ? ["06:00","06:30","07:00","07:30","08:00","08:30"]
    : ["13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30"];

  const activeDay = (state.dayPickerOptions || [])[state.activeDayOffset] || { label: "Ma" };
  const dirLabel = state.direction === "school" ? "🏫 Iskolába" : "🏠 Haza";
  const timeLabel = isNow ? "Most" : state.customTime;
  const flags = [
    state.direction === "school" && state.schoolFilter ? "🎒" : null,
    state.schoolHoliday ? "🏖️" : null,
  ].filter(Boolean);

  function setTime(t) { setState({ ...state, mode: "custom", customTime: t }); }
  function goNow() { setState({ ...state, mode: "now" }); }

  const hp = state.homeStopPicker || {};

  return (
    <>
      <button className={"mobile-pill" + (collapsed ? " pill-collapsed" : "")} onClick={() => setOpen(true)}>
        <span style={{fontSize:13, opacity:0.6}}>⚙️</span>
        <div className="pill-extras">
          <span className="pill-sep" />
          <span className="pill-chip pill-hl">{dirLabel}</span>
          <span className="pill-chip">{activeDay.label}</span>
          <span className="pill-chip">{timeLabel}</span>
          {flags.length > 0 && <span className="pill-chip">{flags.join(" ")}</span>}
        </div>
      </button>

      <div className={"settings-scrim" + (open ? " open" : "")} onClick={() => { setOpen(false); setCollapsed(false); }} />
      <div ref={sheetRef} className={"settings-sheet" + (open ? " open" : "")}
        onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
        <div className="sheet-handle" />
        <div className="sheet-head">
          <span className="sheet-head-title">Tervezés</span>
          <button className="sheet-close" onClick={() => { setOpen(false); setCollapsed(false); }}>✕</button>
        </div>

        <div className="sec-title">Irány</div>
        <div className="sheet-row" style={{paddingBottom:8, borderBottom:"none"}}>
          <span className="row-icon">🔀</span>
          <div style={{display:"flex", gap:6}}>
            <button className={"sel-pill" + (state.direction==="school" ? " on green" : "")}
              onClick={() => setState({...state, direction:"school"})}>🏫 Iskolába</button>
            <button className={"sel-pill" + (state.direction==="home" ? " on blue" : "")}
              onClick={() => setState({...state, direction:"home"})}>🏠 Haza</button>
          </div>
        </div>
        {state.direction === "home" && hp.stops && (
          <div style={{padding:"4px 20px 12px 59px"}}>
            <window.DestinationPickerWidget
              stops={hp.stops} linesMap={hp.linesMap}
              value={hp.value} onSelect={hp.onSelect} onClear={hp.onClear}
              query={hp.query} onQueryChange={hp.onQueryChange}
              lang={state.lang} isMobile={true}
            />
          </div>
        )}

        <div className="sec-title">Nap</div>
        <div className="day-chips-grid">
          {(state.dayPickerOptions || []).map(o => {
            const short = o.offset === 1 ? (state.lang === "hu" ? "Hol" : "Tom") : o.label.slice(0, 3);
            return (
              <button key={o.offset}
                className={"day-pill" + (state.activeDayOffset===o.offset ? " on" : "") + (o.offset===0 ? " today" : "")}
                onClick={() => setState({...state, dayOffset: o.offset, mode: o.offset===0 && isNow ? "now" : state.mode==="now" ? "custom" : state.mode})}>
                {short}
              </button>
            );
          })}
        </div>

        <div className="sec-title">Indulási idő</div>
        <div style={{padding:"0 20px 14px"}}>
          <div style={{display:"flex", gap:5, flexWrap:"wrap", marginBottom:10}}>
            <button className={"sel-pill" + (isNow ? " on" : "")} onClick={goNow}>⏱ Most</button>
            {timePresets.map(t => (
              <button key={t} className={"sel-pill" + (!isNow && state.customTime===t ? " on" : "")}
                onClick={() => setTime(t)}>{t}</button>
            ))}
          </div>
          <input type="time" value={isNow ? "" : state.customTime}
            onChange={e => setTime(e.target.value)}
            placeholder="egyéni…"
            className="v1-time-input"
            style={{fontSize:14, padding:"6px 10px", borderRadius:10}} />
        </div>

        <div className="sec-title">Szűrők</div>
        {state.direction === "school" && (
          <div className="sheet-row">
            <span className="row-icon">🎒</span>
            <div className="row-label">
              <strong>Reggeli szűrő</strong>
              <small>Csak 10:00 előtt érkező járatok</small>
            </div>
            <button className={"toggle" + (state.schoolFilter ? " on" : "")}
              onClick={() => state.setSchoolFilter(f => !f)} />
          </div>
        )}
        <div className="sheet-row">
          <span className="row-icon">🏖️</span>
          <div className="row-label">
            <strong>Tanszünet</strong>
            <small>Szünetidőszak menetrendje</small>
          </div>
          <button className={"toggle" + (state.schoolHoliday ? " on" : "")}
            onClick={state.toggleSchoolHoliday} />
        </div>
        <div style={{height:20}} />
      </div>
    </>
  );
}

function V1Variation({ state, setState, t, langSwitcher, navLinks }) {
  const routes = state.routes;
  const now = state.now;
  const isMobile = state.isMobile;
  const U = window.BUS_UTILS;

  const nowFmt = U.fmtTime(now.getHours() * 60 + now.getMinutes());
  const dateFmt = now.toLocaleDateString(state.lang === "hu" ? "hu-HU" : "en-US", {
    weekday: "long", month: "short", day: "numeric",
  });

  const hero = routes[0];
  let heroInfo = null;
  if (hero) {
    const nowMins = now.getHours() * 60 + now.getMinutes();
    const minsToLeave = hero.departLeaveHome - nowMins;
    let stateText = t.youHaveTime;
    if (minsToLeave <= 0) stateText = t.leaveNow;
    else if (minsToLeave <= 5) stateText = t.leaveSoon;
    heroInfo = { minsToLeave, stateText };
  }

  const [clockHovered, setClockHovered] = React.useState(false);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const isNowMode = state.mode === "now";

  const isSchool = state.direction === "school";
  const subtitle = isSchool
    ? (state.schoolData ? `Iskolába: ${state.schoolData.name}` : (state.lang === "hu" ? "Hogy jutsz el az iskolába?" : "How to get to school?"))
    : (state.settingsHomeStop ? `Hazaút: ${state.settingsHomeStop.name}` : t.appSubtitle);

  return (
    <div className="v1">
      {settingsOpen && <window.SchoolSettingsModal onClose={() => { setSettingsOpen(false); state.refreshSettings?.(); }} />}
      <div className="v1-header" style={isMobile ? {flexDirection:"row",alignItems:"center",justifyContent:"space-between",gap:8} : {}}>
        <div style={isMobile ? {flex:1,minWidth:0} : {}}>
          <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:isMobile?undefined:"wrap"}}>
            <div className="v1-title">{t.appTitle} ✨</div>
            <div style={{fontSize:11,fontWeight:700,background:"linear-gradient(135deg,#7C3AED,#C026D3)",color:"white",padding:"2px 8px",borderRadius:6}}>{window.APP_VERSION}</div>
            {!isMobile && langSwitcher}
          </div>
          {!isMobile && (
            <div style={{marginTop:6}}>
              <div className="v1-subtitle">{subtitle}</div>
            </div>
          )}
        </div>
        {isMobile && (
          <div style={{display:"flex",gap:6,alignItems:"center",flexShrink:0}}>
            {langSwitcher}
            <button onClick={() => setSettingsOpen(true)} title="Beállítások" style={{background:"var(--line)",border:"none",borderRadius:10,padding:"6px 10px",cursor:"pointer",fontSize:16,lineHeight:1,color:"var(--ink)"}}>⚙️</button>
          </div>
        )}
      </div>
      {isMobile && (
        <div style={{marginTop:4, marginBottom:10}}>
          <div className="v1-subtitle">{subtitle}</div>
        </div>
      )}

      {!isMobile && (
        <div style={{position:"absolute",right:32,top:24,display:"flex",flexDirection:"column",alignItems:"flex-end",gap:8}}>
          <div
            className="v1-clock"
            data-tooltip={isNowMode ? (state.lang==="hu" ? "Kattints: saját idő beállítása" : "Click: set custom time") : (state.lang==="hu" ? "Kattints: vissza a mosthoz" : "Click: back to now")}
            data-tooltip-dir="left"
            onClick={() => setState({ ...state, mode: isNowMode ? "custom" : "now" })}
            onMouseEnter={() => setClockHovered(true)}
            onMouseLeave={() => setClockHovered(false)}
            style={{
              cursor: "pointer",
              transform: clockHovered ? "translateY(-3px)" : "translateY(0)",
              transition: "transform 0.15s, box-shadow 0.15s, background 0.2s, outline 0.2s",
              boxShadow: clockHovered
                ? "0 10px 0 0 rgba(43,30,63,0.12), 0 24px 40px -12px rgba(43,30,63,0.3)"
                : undefined,
              background: isNowMode ? undefined : "var(--accent)",
              color: isNowMode ? undefined : "white",
              outline: isNowMode ? "3px solid var(--sun)" : "3px solid var(--accent)",
              outlineOffset: 2,
            }}
          >
            <div className="v1-clock-label">{isNowMode ? t.now_is : (state.lang === "hu" ? "SAJÁT IDŐ" : "CUSTOM")}</div>
            <div className="v1-clock-time">{nowFmt}</div>
            <div className="v1-clock-date">{dateFmt}</div>
          </div>
          <div
            data-tooltip={state.lang==="hu" ? (state.compactMode ? "Teljes nézetre váltás" : "Kompakt nézetre váltás") : (state.compactMode ? "Switch to full view" : "Switch to compact view")}
            data-tooltip-dir="left"
            style={{display:"flex",alignItems:"center",gap:7,cursor:"pointer",userSelect:"none"}}
            onClick={state.toggleCompact}
          >
            <span style={{fontSize:13,fontWeight:700,opacity:0.55}}>{state.lang==="hu"?"Kompakt":"Compact"}</span>
            <div style={{width:36,height:20,borderRadius:10,background:state.compactMode?"var(--accent)":"var(--line)",position:"relative",transition:"background 0.2s",flexShrink:0}}>
              <div style={{position:"absolute",top:2,left:state.compactMode?18:2,width:16,height:16,borderRadius:"50%",background:"white",transition:"left 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.2)"}} />
            </div>
          </div>
        </div>
      )}

      {isMobile && <MobileSettingsPill state={state} setState={setState} />}

      {!isMobile && (
        <div className="v1-toolbar" style={{alignItems:"flex-start"}}>
          <div style={{display:"flex",flexDirection:"column",gap:0}}>
            <div style={{display:"flex",flexDirection:"row",alignItems:"flex-start",gap:12,flexWrap:"wrap"}}>
              {state.DirectionPicker && state.DirectionPicker({})}
              {state.DayPicker && state.DayPicker({})}
            </div>
            {state.TransferPicker && state.TransferPicker({})}
          </div>
          <div style={{display:'flex',gap:8,alignItems:'center',alignSelf:'flex-end',marginLeft:'auto'}}>
            <button onClick={() => setSettingsOpen(true)} title="Beállítások" style={{fontSize:13,fontWeight:800,fontFamily:"Nunito,sans-serif",background:"var(--line)",color:"var(--ink)",border:"none",padding:"10px 14px",borderRadius:10,whiteSpace:"nowrap",cursor:"pointer",boxShadow:"0 8px 24px rgba(0,0,0,0.1)"}}>⚙️ Beállítások</button>
            <a href="city.html" style={{fontSize:13,fontWeight:800,fontFamily:"Nunito,sans-serif",textDecoration:"none",background:"#00796B",color:"white",padding:"10px 14px",borderRadius:10,whiteSpace:"nowrap",boxShadow:"0 8px 24px rgba(0,0,0,0.2)"}}>🚌 VeszprémBusz →</a>
          </div>
        </div>
      )}

      {hero && heroInfo && (
        <div className="v1-hero-banner">
          <div className="v1-hero-left">
            <div className="v1-hero-label">{t.leaveAtShort}</div>
            <div className="v1-hero-time">{U.fmtTime(hero.departLeaveHome)}</div>
            <div className="v1-hero-sub">{heroInfo.stateText}</div>
          </div>
          {state.mode === "custom" && !isMobile && (
            <div style={{position:"absolute",left:"50%",top:"50%",transform:"translate(-50%,-50%)",display:"flex",gap:6,flexWrap:"wrap",alignItems:"center",zIndex:2}}>
              <input
                type="time"
                value={state.customTime}
                className="v1-time-input"
                onChange={(e) => setState({ ...state, customTime: e.target.value })}
              />
              {(state.direction === "school" ? ["06:00","06:30","07:00","07:30","08:00","08:30"] : ["14:00","14:30","15:00","15:30","16:00","16:30"]).map((time) => (
                <button key={time} className={`v1-btn${state.customTime===time?" active":""}`}
                  onClick={() => setState({ ...state, customTime: time })}
                  data-tooltip={state.lang==="hu" ? `${time} beállítása` : `Set time to ${time}`}
                  style={{padding:'4px 10px',fontSize:13}}>
                  {time}
                </button>
              ))}
            </div>
          )}
          <div className="v1-hero-right" style={{display:"flex",alignItems:"center",gap:12,position:"relative",zIndex:1,flexShrink:0}}>
            <button
              className="v1-btn warn"
              onClick={() => setState({ ...state, missed: (state.missed || 0) + 1 })}
              aria-label={t.missedButton}
              data-tooltip={state.lang==="hu" ? "Lekéstem — következő járatra vált" : "Missed — switches to next departure"}
              data-tooltip-color="warn" data-tooltip-dir="up"
              style={{fontSize:12,padding:"4px 10px",whiteSpace:"nowrap"}}
            >
              😬 {t.missedButton}
            </button>
            <div style={{textAlign:"right",minWidth:"5ch"}}>
              <div className="v1-hero-countdown">{t.countdownToLeave}</div>
              <div className="v1-hero-count">
                {heroInfo.minsToLeave > 0 ? `${heroInfo.minsToLeave} ${t.min}` : "— "}
              </div>
            </div>
          </div>
        </div>
      )}


      {routes.notConfigured ? (
        <div className="v1-empty">
          <div className="v1-empty-emoji">⚙️</div>
          <div className="v1-empty-title">{state.lang === "hu" ? "Nincs beállítva iskola és megálló" : "School and stop not configured"}</div>
          <div className="v1-empty-hint">{state.lang === "hu" ? "A tervezőhöz add meg a lakóhelyed megállóját és a kiválasztott iskolát a beállításokban." : "Set your home stop and school in settings to enable route planning."}</div>
          <button
            onClick={() => setSettingsOpen(true)}
            style={{marginTop:16,fontSize:14,fontWeight:800,fontFamily:'Nunito,sans-serif',background:'var(--accent)',color:'white',border:'none',padding:'10px 20px',borderRadius:12,cursor:'pointer',boxShadow:'0 4px 16px rgba(0,0,0,0.15)'}}
          >⚙️ {state.lang === "hu" ? "Beállítások megnyitása" : "Open settings"}</button>
        </div>
      ) : routes.length > 0 ? (
        <div className="v1-routes" aria-live="polite" role="region" aria-label={state.lang==="hu"?"Útvonaltervek":"Route options"}>
          {routes.map((r, i) => {
            const isHely = state.schoolData?.helykoziOnly;
            const commonProps = { key: i, route: r, index: i, isPrimary: i === 0, t, isWeekend: now.getDay() === 0 || now.getDay() === 6, dayType: window.BUS_UTILS.dayType(now, state.schoolHoliday), nowMins: now.getHours() * 60 + now.getMinutes() };
            if (state.direction === "school" && isHely) {
              return <window.SchoolRouteCard {...commonProps} schoolData={state.schoolData} />;
            }
            if (state.direction === "home" && isHely) {
              return <window.RouteCard {...commonProps} style="" schoolData={state.schoolData} />;
            }
            return <window.CitySchoolRouteCard {...commonProps} direction={state.direction} schoolData={state.schoolData} />;
          })}
        </div>
      ) : (
        <div className="v1-empty">
          <div className="v1-empty-emoji">🌙</div>
          <div className="v1-empty-title">{t.noRoutes}</div>
          <div className="v1-empty-hint">
            {routes.hint === "weekendOnly" ? t.weekendOnly
              : routes.hint === "workdayOnly" ? t.workdayOnly
              : t.noRoutesHint}
          </div>
        </div>
      )}
    </div>
  );
}

window.V1Variation = V1Variation;
