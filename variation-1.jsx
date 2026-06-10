/* ============================================================
   Variation 1 — Playful Timeline
   Napló-szerű, világos, barátságos, domináns nagy óra + timeline
   ============================================================ */

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
    ? (state.lang === "hu" ? "Hogy jutsz el az iskolába? 🏫" : "How to get to school? 🏫")
    : t.appSubtitle;

  return (
    <div className="v1">
      {settingsOpen && <window.SchoolSettingsModal onClose={() => setSettingsOpen(false)} />}
      <div className="v1-header" style={isMobile ? {flexDirection:"row",alignItems:"flex-start",justifyContent:"space-between",gap:8} : {}}>
        <div>
          <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:isMobile?undefined:"wrap"}}>
            <div className="v1-title">{t.appTitle} ✨</div>
            <div style={{fontSize:11,fontWeight:700,background:"linear-gradient(135deg,#7C3AED,#C026D3)",color:"white",padding:"2px 8px",borderRadius:6}}>{window.APP_VERSION}</div>
            {!isMobile && langSwitcher}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10,marginTop:6}}>
            <div className="v1-subtitle">{subtitle}</div>
          </div>
        </div>
        {isMobile && (
          <div style={{display:"flex",gap:6,alignItems:"center"}}>
            {langSwitcher}
            <button onClick={() => setSettingsOpen(true)} title="Beállítások" style={{background:"var(--line)",border:"none",borderRadius:10,padding:"6px 10px",cursor:"pointer",fontSize:16,lineHeight:1,color:"var(--ink)"}}>⚙️</button>
          </div>
        )}
      </div>

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

      {isMobile && (
        <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:12,alignItems:"flex-start"}}>
          <div style={{display:"flex",gap:10,alignItems:"stretch",width:"100%"}}>
          <div
            className="v1-clock"
            data-tooltip={isNowMode ? (state.lang==="hu" ? "Kattints: saját idő beállítása" : "Click: set custom time") : (state.lang==="hu" ? "Kattints: vissza a mosthoz" : "Click: back to now")}
            data-tooltip-dir="down"
            onClick={() => setState({ ...state, mode: isNowMode ? "custom" : "now" })}
            onMouseEnter={() => setClockHovered(true)}
            onMouseLeave={() => setClockHovered(false)}
            style={{
              cursor: "pointer",
              flex: 1,
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
          {!isNowMode && (
            <div style={{display:'flex',flexDirection:'column',gap:6,background:'var(--accent)',borderRadius:12,padding:'8px 10px',flex:1}}>
              <input
                type="time"
                value={state.customTime}
                className="v1-time-input"
                style={{fontSize:13,padding:'6px 10px'}}
                onChange={(e) => setState({ ...state, customTime: e.target.value })}
              />
              <div style={{position:'relative',display:'inline-flex',alignItems:'center'}}>
                <select
                  value={state.customTime}
                  onChange={(e) => setState({ ...state, customTime: e.target.value })}
                  style={{fontFamily:'inherit',fontSize:12,fontWeight:700,padding:'6px 24px 6px 8px',borderRadius:10,border:'none',background:'rgba(255,255,255,0.2)',color:'white',cursor:'pointer',appearance:'none',WebkitAppearance:'none',width:'100%'}}
                >
                  {(state.direction === "school" ? ["06:00","06:30","07:00","07:30","08:00","08:30"] : ["14:00","14:30","15:00","15:30","16:00","16:30"]).map(time => (
                    <option key={time} value={time} style={{background:'#5B2D8E',color:'white'}}>{time}</option>
                  ))}
                </select>
                <span style={{position:'absolute',right:6,pointerEvents:'none',color:'white',fontSize:11}}>▾</span>
              </div>
            </div>
          )}
          </div>
        </div>
      )}

      <div className="v1-toolbar" style={{alignItems:"flex-start"}}>
        <div style={{display:"flex",flexDirection:"column",gap:isMobile?8:0,width:isMobile?"100%":undefined}}>
          <div style={{display:"flex",flexDirection:isMobile?"column":"row",alignItems:"flex-start",gap:isMobile?8:12,flexWrap:isMobile?undefined:"wrap"}}>
            {state.DirectionPicker && <state.DirectionPicker />}
            {state.DayPicker && <state.DayPicker />}
          </div>
          {state.TransferPicker && <state.TransferPicker />}
        </div>
        {!isMobile && (
          <div style={{display:'flex',gap:8,alignItems:'center',alignSelf:'flex-end',marginLeft:'auto'}}>
            <button onClick={() => setSettingsOpen(true)} title="Beállítások" style={{fontSize:13,fontWeight:800,fontFamily:"Nunito,sans-serif",background:"var(--line)",color:"var(--ink)",border:"none",padding:"10px 14px",borderRadius:10,whiteSpace:"nowrap",cursor:"pointer",boxShadow:"0 8px 24px rgba(0,0,0,0.1)"}}>⚙️ Beállítások</button>
            <a href="city.html" style={{fontSize:13,fontWeight:800,fontFamily:"Nunito,sans-serif",textDecoration:"none",background:"#00796B",color:"white",padding:"10px 14px",borderRadius:10,whiteSpace:"nowrap",boxShadow:"0 8px 24px rgba(0,0,0,0.2)"}}>🚌 VeszprémBusz →</a>
            <a href="mission.html" style={{fontSize:13,fontWeight:800,fontFamily:"Nunito,sans-serif",textDecoration:"none",background:"#0E1524",color:"#FFC93C",padding:"10px 14px",borderRadius:10,whiteSpace:"nowrap",boxShadow:"0 8px 24px rgba(0,0,0,0.2)"}}>🎮 Mission Board →</a>
          </div>
        )}
      </div>

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


      {routes.length > 0 ? (
        <div className="v1-routes" aria-live="polite" role="region" aria-label={state.lang==="hu"?"Útvonaltervek":"Route options"}>
          {routes.map((r, i) => (
            state.direction === "school" ? (
              <window.SchoolRouteCard
                key={i}
                route={r}
                index={i}
                isPrimary={i === 0}
                t={t}
                isWeekend={now.getDay() === 0 || now.getDay() === 6}
                dayType={window.BUS_UTILS.dayType(now, state.schoolHoliday)}
                nowMins={now.getHours() * 60 + now.getMinutes()}
              />
            ) : (
              <window.RouteCard
                key={i}
                route={r}
                index={i}
                isPrimary={i === 0}
                t={t}
                style=""
                isWeekend={now.getDay() === 0 || now.getDay() === 6}
                dayType={window.BUS_UTILS.dayType(now, state.schoolHoliday)}
                nowMins={now.getHours() * 60 + now.getMinutes()}
              />
            )
          ))}
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
