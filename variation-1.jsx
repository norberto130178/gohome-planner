/* ============================================================
   Variation 1 — Playful Timeline
   Napló-szerű, világos, barátságos, domináns nagy óra + timeline
   ============================================================ */

function V1Variation({ state, setState, t, langSwitcher, navLinks }) {
  const routes = state.routes;
  const now = state.now;
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

  const isSchool = state.direction === "school";
  const subtitle = isSchool
    ? (state.lang === "hu" ? "Hogy jutsz el az iskolába? 🏫" : "How to get to school? 🏫")
    : t.appSubtitle;

  return (
    <div className="v1">
      <div className="v1-header">
        <div>
          <div className="v1-title">{t.appTitle} ✨</div>
          <div className="v1-subtitle">{subtitle}</div>
        </div>
        <div style={{display:"flex",alignItems:"flex-end",gap:12}}>
          {langSwitcher}
          <div className="v1-clock">
            <div className="v1-clock-label">{t.now_is}</div>
            <div className="v1-clock-time">{nowFmt}</div>
            <div className="v1-clock-date">{dateFmt}</div>
          </div>
          <div style={{fontSize:11,opacity:0.7,textAlign:"right",background:"rgba(0,0,0,0.08)",padding:"2px 6px",borderRadius:6}}>v{window.APP_VERSION}</div>
        </div>
      </div>

      <div className="v1-toolbar">
        {state.DirectionPicker && <state.DirectionPicker />}
        {state.DayPicker && <state.DayPicker />}
        {state.TransferPicker && <state.TransferPicker />}
        {state.StopPicker && <state.StopPicker />}
        <div style={{display:'flex',gap:6,flexWrap:'wrap',alignItems:'center'}}>
          <button
            className={`v1-btn ${state.mode === "now" ? "active" : ""}`}
            onClick={() => setState({ ...state, mode: "now" })}
            aria-pressed={state.mode === "now"}
          >
            🕐 {t.now}
          </button>
          <button
            className={`v1-btn ${state.mode === "custom" ? "active" : ""}`}
            onClick={() => setState({ ...state, mode: "custom" })}
            aria-pressed={state.mode === "custom"}
          >
            ⏰ {t.customTime}
          </button>
          {state.mode === "custom" && (
            <>
              <input
                type="time"
                value={state.customTime}
                className="v1-time-input"
                onChange={(e) => setState({ ...state, customTime: e.target.value })}
              />
              {(state.direction === "school" ? ["06:00","06:30","07:00","07:30","08:00","08:30"] : ["14:00","14:30","15:00","15:30","16:00","16:30"]).map((time) => (
                <button key={time} className={`v1-btn${state.customTime===time?" active":""}`}
                  onClick={() => setState({ ...state, customTime: time })}
                  style={{padding:'4px 10px',fontSize:13}}>
                  {time}
                </button>
              ))}
            </>
          )}
          <button className="v1-btn warn" onClick={() => setState({ ...state, missed: (state.missed || 0) + 1 })} aria-label={t.missedButton}>
            😬 {t.missedButton}
          </button>
          {state.direction === "school" && (
            <button
              className={`v1-btn${state.schoolFilter ? " active" : ""}`}
              onClick={() => setState({ ...state, schoolFilter: !state.schoolFilter })}
              aria-pressed={state.schoolFilter}
              title={state.lang === "hu" ? "Csak 10:00 előtt érkező járatok" : "Only buses arriving before 10:00"}
            >
              🎒 {state.lang === "hu" ? "Reggeli szűrő" : "Morning filter"}
            </button>
          )}
        </div>
        {navLinks}
      </div>

      {hero && heroInfo && (
        <div className="v1-hero-banner">
          <div className="v1-hero-left">
            <div className="v1-hero-label">{t.leaveAtShort}</div>
            <div className="v1-hero-time">{U.fmtTime(hero.departLeaveHome)}</div>
            <div className="v1-hero-sub">{heroInfo.stateText}</div>
          </div>
          <div className="v1-hero-right">
            <div className="v1-hero-countdown">{t.countdownToLeave}</div>
            <div className="v1-hero-count">
              {heroInfo.minsToLeave > 0 ? `${heroInfo.minsToLeave} ${t.min}` : "— "}
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
              />
            ) : (
              <window.RouteCard
                key={i}
                route={r}
                index={i}
                isPrimary={i === 0}
                t={t}
                style=""
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
