/* ============================================================
   Variation 1 — Playful Timeline
   Napló-szerű, világos, barátságos, domináns nagy óra + timeline
   ============================================================ */

function MobileSettingsPill({ state, setState, open, setOpen, onTimetable }) {
  const [collapsed, setCollapsed] = React.useState(false);
  const sheetRef = React.useRef(null);
  const closeButtonRef = React.useRef(null);
  const savedFocusRef = React.useRef(null);
  const dragStartY = React.useRef(null);
  const isDragging = React.useRef(false);
  const lastScrollY = React.useRef(0);

  React.useEffect(() => {
    if (open) {
      savedFocusRef.current = document.activeElement;
      closeButtonRef.current?.focus();
    } else if (savedFocusRef.current) {
      savedFocusRef.current.focus();
      savedFocusRef.current = null;
    }
  }, [open]);

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

  React.useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === 'Escape') { setOpen(false); setCollapsed(false); }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  React.useEffect(() => {
    if (!open || !sheetRef.current) return;
    const sheet = sheetRef.current;
    function trap(e) {
      if (e.key !== 'Tab') return;
      const focusable = Array.from(sheet.querySelectorAll(
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
    sheet.addEventListener('keydown', trap);
    return () => sheet.removeEventListener('keydown', trap);
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
    dragStartY.current = null;
    isDragging.current = false;
    if (sheetRef.current) { sheetRef.current.style.transition = ""; sheetRef.current.style.transform = ""; }
    if (dy > 80) { setOpen(false); setCollapsed(false); }
  }

  const t = window.I18N[state.lang] || window.I18N.hu;
  const isNow = state.mode === "now";
  const timePresets = state.direction === "school"
    ? ["06:00","06:30","07:00","07:30","08:00","08:30"]
    : ["13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30"];

  const activeDay = (state.dayPickerOptions || [])[state.activeDayOffset] || { label: "Ma" };
  const dirLabel = state.direction === "school" ? t.directionSchool : t.directionHome;
  const timeLabel = isNow ? t.now : state.customTime;
  const flags = [
    state.direction === "school" && state.schoolFilter ? "🎒" : null,
    state.schoolHoliday ? "🏖️" : null,
  ].filter(Boolean);

  function setTime(val) { setState({ ...state, mode: "custom", customTime: val }); }
  function goNow() { setState({ ...state, mode: "now" }); }

  const hp = state.homeStopPicker || {};

  return (
    <>
      <div className={"pill-container" + (collapsed ? " pill-collapsed" : "")}>
        <a href="city.html" className="fab-action"
          data-tooltip="VeszprémBusz"
          data-tooltip-dir="left"
          aria-label="VeszprémBusz">🚌</a>
        {onTimetable && window.TimetableDropdown && (
          <div className="fab-timetable-wrap">
            <window.TimetableDropdown onSelect={onTimetable} upward fabStyle lang={state.lang} />
          </div>
        )}
        <div className="mobile-pill" role="button" tabIndex={0} onClick={() => setOpen(true)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(true); } }} style={{cursor:"pointer"}}>
          <span style={{fontSize:15, padding:"5px 9px", opacity:0.8}}>⚙️</span>
          <span className="pill-sep-mid" />
          <div className="pill-extras pill-zone-chips">
            <span className="pill-chip pill-hl">{dirLabel}</span>
            <span className="pill-chip">{activeDay.label}</span>
            <span className="pill-chip">{timeLabel}</span>
            {flags.length > 0 && <span className="pill-chip">{flags.join(" ")}</span>}
          </div>
        </div>
      </div>

      <div className={"settings-scrim" + (open ? " open" : "")} onClick={() => { setOpen(false); setCollapsed(false); }} />
      <div ref={sheetRef} className={"settings-sheet" + (open ? " open" : "")}
        onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
        <div className="sheet-handle" />
        <div className="sheet-head">
          <span className="sheet-head-title">{t.planningTitle}</span>
          <a href="help.html" aria-label={state.lang==="hu" ? "Súgó" : "Help"} style={{marginLeft:"auto",marginRight:8,fontSize:15,fontWeight:900,color:"var(--ink-soft)",textDecoration:"none",lineHeight:1,padding:"4px 8px",borderRadius:8,background:"var(--line)"}}>?</a>
          <button ref={closeButtonRef} className="sheet-close" aria-label={state.lang==="hu" ? "Bezárás" : "Close"} onClick={() => { setOpen(false); setCollapsed(false); }}>✕</button>
        </div>

        <div className="sec-title">{t.directionLabel}</div>
        <div className="sheet-row" style={{paddingBottom:8, borderBottom:"none"}}>
          <span className="row-icon">🔀</span>
          <div style={{display:"flex", gap:6}}>
            <button className={"sel-pill" + (state.direction==="school" ? " on green" : "")}
              onClick={() => setState({...state, direction:"school"})}>{t.directionSchool}</button>
            <button className={"sel-pill" + (state.direction==="home" ? " on blue" : "")}
              onClick={() => setState({...state, direction:"home"})}>{t.directionHome}</button>
          </div>
        </div>
        {state.direction === "home" && hp.stops && (
          <div style={{padding:"4px 20px 12px 20px"}}>
            <window.DestinationPickerWidget
              stops={hp.stops} linesMap={hp.linesMap}
              value={hp.value} onSelect={hp.onSelect} onClear={hp.onClear}
              query={hp.query} onQueryChange={hp.onQueryChange}
              lang={state.lang} isMobile={true}
            />
          </div>
        )}

        <div className="sec-title">{t.daySection}</div>
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

        <div className="sec-title">{t.departureTime}</div>
        <div style={{padding:"0 20px 14px"}}>
          <div style={{display:"flex", gap:5, flexWrap:"wrap", marginBottom:10}}>
            <button className={"sel-pill" + (isNow ? " on" : "")} onClick={goNow}>{t.nowBtn}</button>
            {timePresets.map(preset => (
              <button key={preset} className={"sel-pill" + (!isNow && state.customTime===preset ? " on" : "")}
                onClick={() => setTime(preset)}>{preset}</button>
            ))}
          </div>
          <input type="time" value={isNow ? "" : state.customTime}
            onChange={e => setTime(e.target.value)}
            placeholder={t.customPlaceholder}
            aria-label={t.departureTime || (state.lang==="hu" ? "Egyedi indulási idő" : "Custom departure time")}
            className="v1-time-input"
            style={{fontSize:14, padding:"6px 10px", borderRadius:10}} />
        </div>

        <div className="sec-title">{t.filters}</div>
        {state.direction === "school" && (
          <div className="sheet-row">
            <span className="row-icon">🎒</span>
            <div className="row-label">
              <strong>{t.morningFilter}</strong>
              <small>{t.morningFilterSub}</small>
            </div>
            <button className={"toggle" + (state.schoolFilter ? " on" : "")}
              role="switch"
              aria-checked={state.schoolFilter}
              aria-label={t.morningFilter}
              onClick={() => state.setSchoolFilter(f => !f)} />
          </div>
        )}
        <div className="sheet-row">
          <span className="row-icon">🏖️</span>
          <div className="row-label">
            <strong>{t.schoolHolidayLabel}</strong>
            <small>{t.schoolHolidaySub}</small>
          </div>
          <button className={"toggle" + (state.schoolHoliday ? " on" : "")}
            role="switch"
            aria-checked={state.schoolHoliday}
            aria-label={t.schoolHolidayLabel}
            onClick={state.toggleSchoolHoliday} />
        </div>
        <div style={{height:16}} />
      </div>
    </>
  );
}

function V1Variation({ state, setState, t, langSwitcher, navLinks, onTimetable }) {
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
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const didPushHistory = React.useRef(false);
  const didPushSettingsHistory = React.useRef(false);
  const isNowMode = state.mode === "now";

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
  function openSettingsModal() {
    setSettingsOpen(true);
    history.pushState({ settingsModal: true }, "");
    didPushSettingsHistory.current = true;
  }
  function closeSettingsModal() {
    setSettingsOpen(false);
    if (didPushSettingsHistory.current) {
      didPushSettingsHistory.current = false;
      history.back();
    }
  }
  React.useEffect(() => {
    function onPop() {
      if (didPushHistory.current) {
        didPushHistory.current = false;
        setSheetOpen(false);
      }
      if (didPushSettingsHistory.current) {
        didPushSettingsHistory.current = false;
        setSettingsOpen(false);
      }
    }
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const isSchool = state.direction === "school";
  const subtitle = isSchool
    ? (state.schoolData ? `${t.subtitleSchool}: ${state.schoolData.name}` : (state.lang === "hu" ? "Hogy jutsz el az iskolába?" : "How to get to school?"))
    : (state.settingsHomeStop ? `${t.subtitleHome}: ${state.settingsHomeStop.name}` : t.appSubtitle);

  return (
    <div className="v1">
      {settingsOpen && <window.SchoolSettingsModal onClose={() => { closeSettingsModal(); state.refreshSettings?.(); }} lang={state.lang} />}
      <div className="v1-header" style={isMobile ? {flexDirection:"row",alignItems:"center",justifyContent:"space-between",gap:8} : {}}>
        <div style={isMobile ? {flex:1,minWidth:0} : {}}>
          <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:isMobile?undefined:"wrap"}}>
            <div className="v1-title">{t.appTitle} ✨</div>
            <div style={{fontSize:11,fontWeight:700,background:"linear-gradient(135deg,#7C3AED,#C026D3)",color:"white",padding:"2px 8px",borderRadius:6}}>{window.APP_VERSION}</div>
            {!isMobile && (
              <div style={{display:"flex",gap:6,alignItems:"center"}}>
                {langSwitcher}
                <button onClick={() => openSettingsModal()}
                  data-tooltip={state.lang==="hu" ? "Iskola és megálló beállítások" : "School & stop settings"}
                  data-tooltip-dir="down"
                  aria-label={state.lang==="hu" ? "Iskola és megálló beállítások" : "School & stop settings"}
                  style={{background:"var(--line)",border:"none",borderRadius:10,padding:"6px 10px",cursor:"pointer",fontSize:16,lineHeight:1,color:"var(--ink)"}}>⚙️</button>
              </div>
            )}
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
            <button onClick={() => openSettingsModal()} title="Beállítások" aria-label={state.lang==="hu" ? "Iskola és megálló beállítások" : "School & stop settings"} style={{background:"var(--line)",border:"none",borderRadius:10,padding:"6px 10px",cursor:"pointer",fontSize:16,lineHeight:1,color:"var(--ink)"}}>⚙️</button>
          </div>
        )}
        {!isMobile && (
          <div
            className="v1-clock"
            role="button"
            tabIndex={0}
            data-tooltip={isNowMode ? (state.lang==="hu" ? "Kattints: saját idő beállítása" : "Click: set custom time") : (state.lang==="hu" ? "Kattints: vissza a mosthoz" : "Click: back to now")}
            aria-label={isNowMode ? (state.lang==="hu" ? "Saját idő beállítása" : "Set custom time") : (state.lang==="hu" ? "Vissza a mosthoz" : "Back to now")}
            data-tooltip-dir="left"
            onClick={() => {
              if (isNowMode) { setState({ ...state, mode: "custom" }); openSheet(); }
              else { setState({ ...state, mode: "now" }); }
            }}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (isNowMode) { setState({ ...state, mode: "custom" }); openSheet(); }
                else { setState({ ...state, mode: "now" }); }
              }
            }}
            onMouseEnter={() => setClockHovered(true)}
            onMouseLeave={() => setClockHovered(false)}
            style={{
              cursor: "pointer", flexShrink: 0,
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
        )}
      </div>
      {isMobile && (
        <div style={{marginTop:4, marginBottom:10}}>
          <div className="v1-subtitle">{subtitle}</div>
        </div>
      )}

      <MobileSettingsPill state={state} setState={setState} open={sheetOpen} setOpen={v => v ? openSheet() : closeSheet()} onTimetable={onTimetable} />

      {hero && heroInfo && (
        <div className="v1-hero-banner">
          <div className="v1-hero-left">
            <div className="v1-hero-label">{t.leaveAtShort}</div>
            <div className="v1-hero-time">{U.fmtTime(hero.departLeaveHome)}</div>
            <div className="v1-hero-sub">{heroInfo.stateText}</div>
          </div>
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
            onClick={() => openSettingsModal()}
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
      <div className="app-footer">© 2026 Sándor Norbert</div>
    </div>
  );
}

window.V1Variation = V1Variation;
