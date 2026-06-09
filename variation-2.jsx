/* ============================================================
   Variation 2 — Mission Board
   Sötét, játék-szerű "küldetés" UI. Minden útvonal egy küldetés.
   ============================================================ */

function V2Variation({ state, setState, t, langSwitcher }) {
  const routes = state.routes;
  const now = state.now;
  const U = window.BUS_UTILS;
  const nowFmt = U.fmtTime(now.getHours() * 60 + now.getMinutes());
  const dateFmt = now.toLocaleDateString(state.lang === "hu" ? "hu-HU" : "en-US", {
    weekday: "long", month: "short", day: "numeric",
  });

  const hero = routes[0];
  const nowMins = now.getHours() * 60 + now.getMinutes();
  const minsToLeave = hero ? hero.departLeaveHome - nowMins : null;
  const isSchool = state.direction === "school";

  return (
    <div className="v2">
      <div className="v2-header">
        <div>
          <div className="v2-mission-label">🎮 Mission #{(state.missed || 0) + 1}</div>
          <div className="v2-mission-title">{isSchool
            ? (state.lang === "hu" ? "Küldetés: Iskolába jutás" : "Mission: Get to School")
            : (state.lang === "hu" ? "Küldetés: Hazajutás" : "Mission: Get Home")}</div>
          <div className="v2-mission-sub">{isSchool
            ? (state.lang === "hu" ? "Célpont: Nemesvámos, iskola 🏫" : "Target: Nemesvámos, school 🏫")
            : (state.lang === "hu" ? `Célpont: ${state.homeStop || "Csererdő"} 🏡` : `Target: ${state.homeStop || "Csererdő"} 🏡`)}</div>
        </div>
        <div style={{display:"flex",alignItems:"flex-end",gap:12}}>
          {langSwitcher}
          <div className="v2-hud">
            <div className="v2-hud-label">{t.now_is}</div>
            <div className="v2-hud-time">{nowFmt}</div>
            <div style={{fontSize:11,opacity:0.6}}>{dateFmt}</div>
          </div>
          <div style={{fontSize:11,opacity:0.7,textAlign:"right",background:"rgba(255,255,255,0.1)",padding:"2px 6px",borderRadius:6}}>{window.APP_VERSION}</div>
        </div>
      </div>

      {hero && (
        <div className="v2-ready">
          <div className="v2-ready-title">
            {state.lang === "hu" ? "⚡ Indulj el" : "⚡ Leave"}
          </div>
          <div className="v2-ready-time">{U.fmtTime(hero.departLeaveHome)}</div>
          <div className="v2-ready-state">
            {minsToLeave > 5
              ? `${t.countdownToLeave}: ${minsToLeave} ${t.min}`
              : minsToLeave > 0
              ? `⚠ ${t.leaveSoon} (${minsToLeave} ${t.min})`
              : `🚀 ${t.leaveNow}`}
          </div>
        </div>
      )}

      <div className="v2-toolbar">
        {state.DirectionPicker && <state.DirectionPicker />}
        {state.DayPicker && <state.DayPicker />}
        {state.TransferPicker && <state.TransferPicker />}
        {state.StopPicker && <state.StopPicker />}
        <div style={{display:'flex',gap:6,flexWrap:'wrap',alignItems:'center'}}>
          <button className={`v2-btn ${state.mode === "now" ? "active" : ""}`} onClick={() => setState({ ...state, mode: "now" })} aria-pressed={state.mode === "now"}>
            🕐 {t.now}
          </button>
          <button className={`v2-btn ${state.mode === "custom" ? "active" : ""}`} onClick={() => setState({ ...state, mode: "custom" })} aria-pressed={state.mode === "custom"}>
            ⏰ {t.customTime}
          </button>
          {state.mode === "custom" && (
            <>
              <input type="time" value={state.customTime} className="v1-time-input"
                onChange={(e) => setState({ ...state, customTime: e.target.value })} />
              {(state.direction === "school" ? ["06:00","06:30","07:00","07:30","08:00","08:30"] : ["14:00","14:30","15:00","15:30","16:00","16:30"]).map((time) => (
                <button key={time} className={`v2-btn${state.customTime===time?" active":""}`}
                  onClick={() => setState({ ...state, customTime: time })}
                  style={{padding:'4px 10px',fontSize:13}}>
                  {time}
                </button>
              ))}
            </>
          )}
          <button className="v2-btn warn" onClick={() => setState({ ...state, missed: (state.missed || 0) + 1 })} aria-label={t.missedButton}>
            😬 {t.missedButton}
          </button>
          {state.direction === "school" && (
            <button
              className={`v2-btn${state.schoolFilter ? " active" : ""}`}
              onClick={() => setState({ ...state, schoolFilter: !state.schoolFilter })}
              aria-pressed={state.schoolFilter}
              title={state.lang === "hu" ? "Csak 10:00 előtt érkező járatok" : "Only buses arriving before 10:00"}
            >
              🎒 {state.lang === "hu" ? "Reggeli szűrő" : "Morning filter"}
            </button>
          )}
        </div>
      </div>

      {routes.length > 0 ? (
        <div className="v2-routes" aria-live="polite" role="region" aria-label={state.lang==="hu"?"Útvonaltervek":"Route options"}>
          {routes.map((r, i) => (
            isSchool ? (
            <div key={i} className={`v2-route ${i === 0 ? "primary" : ""}`}>
              <div className="v2-route-head">
                <div className="v2-route-rank">
                  <div className="v2-rank-num">{i + 1}</div>
                  <div className="v2-rank-label">
                    {i === 0 ? `⭐ ${t.best}` : `${t.option} ${i + 1}`}
                  </div>
                </div>
                <div className="v2-route-eta">
                  🏫 {U.fmtTime(r.arriveSchool)} · {r.totalDuration} {t.min}
                </div>
              </div>

              <div className="v2-timeline-v">
                <div className="v2-row">
                  <div className="v2-row-time">{U.fmtTime(r.localBoardAt)}</div>
                  <div className="v2-row-icon bus-local" style={{background: r.localBus.color}}>{r.localBus.id}</div>
                  <div className="v2-row-text">{r.localBus.label} · Csererdő</div>
                </div>
                <div className="v2-row-line"><span>{r.localArriveAtTransfer - r.localBoardAt} {t.min}</span></div>
                <div className="v2-row">
                  <div className="v2-row-time">{U.fmtTime(r.localArriveAtTransfer)}</div>
                  <div className="v2-row-icon">🔄</div>
                  <div className="v2-row-text">{r.transferStopShort}</div>
                </div>
                {r.walkAfterBus > 0 && (
                  <>
                    <div className="v2-row-line"><span>🚶 {r.walkAfterBus} {t.min}</span></div>
                    <div className="v2-row">
                      <div className="v2-row-time">{U.fmtTime(r.transferReadyAt)}</div>
                      <div className="v2-row-icon">🔄</div>
                      <div className="v2-row-text">Komakút tér</div>
                    </div>
                  </>
                )}
                <div className="v2-row-line"><span>⏱ {r.waitAtTransfer} {t.min} {t.waitTime}</span></div>
                <div className="v2-row">
                  <div className="v2-row-time">{U.fmtTime(r.helykoziDep)}</div>
                  <div className="v2-row-icon">🚌</div>
                  <div className="v2-row-text">#{r.helykoziLine} {r.helykoziDepBuszall != null && <span style={{opacity:0.7}}>({U.fmtTime(r.helykoziDepBuszall)})</span>}</div>
                </div>
                <div className="v2-row-line"><span>{r.helykoziArrive - r.helykoziDep} {t.min}</span></div>
                <div className="v2-row">
                  <div className="v2-row-time">{U.fmtTime(r.helykoziArrive)}</div>
                  <div className="v2-row-icon">🚏</div>
                  <div className="v2-row-text">Nemesvámos</div>
                </div>
                <div className="v2-row-line"><span>🚶 {r.walkToSchool} {t.min}</span></div>
                <div className="v2-row">
                  <div className="v2-row-time" style={{color:"#FFC93C"}}>{U.fmtTime(r.arriveSchool)}</div>
                  <div className="v2-row-icon">🏫</div>
                  <div className="v2-row-text" style={{color:"#FFC93C",fontWeight:800}}>{t.arriveSchool || (state.lang==="hu"?"Iskola":"School")}</div>
                </div>
              </div>
            </div>
            ) : (
            <div key={i} className={`v2-route ${i === 0 ? "primary" : ""}`}>
              <div className="v2-route-head">
                <div className="v2-route-rank">
                  <div className="v2-rank-num">{i + 1}</div>
                  <div className="v2-rank-label">
                    {i === 0 ? `⭐ ${t.best}` : `${t.option} ${i + 1}`}
                  </div>
                </div>
                <div className="v2-route-eta">
                  🏠 {U.fmtTime(r.localArriveCsererdo)} · {r.totalDuration} {t.min}
                </div>
              </div>

              <div className="v2-timeline-v">
                <div className="v2-row">
                  <div className="v2-row-time">{U.fmtTime(r.departLeaveHome)}</div>
                  <div className="v2-row-icon">🚶</div>
                  <div className="v2-row-text">{t.school}</div>
                </div>
                <div className="v2-row-line"><span>🚶 {r.helykoziDep - r.departLeaveHome} {t.min}</span></div>
                <div className="v2-row">
                  <div className="v2-row-time">{U.fmtTime(r.helykoziDep)}</div>
                  <div className="v2-row-icon">🚌</div>
                  <div className="v2-row-text">🚌 #{r.helykoziLine || ''} {t.departs}</div>
                </div>
                <div className="v2-row-line"><span>{r.helykoziArrive - r.helykoziDep} {t.min}</span></div>
                <div className="v2-row">
                  <div className="v2-row-time">{U.fmtTime(r.helykoziArrive)}</div>
                  <div className="v2-row-icon">🔄</div>
                  <div className="v2-row-text">{r.transferStop.replace("Veszprém, ", "")}</div>
                </div>
                <div className="v2-row-line"><span>⏱ {r.waitAtTransfer} {t.min} {t.waitTime}</span></div>
                <div className="v2-row">
                  <div className="v2-row-time">{U.fmtTime(r.localBoardAt)}</div>
                  <div className="v2-row-icon bus-local" style={{background: r.localBus.color}}>{r.localBus.id}</div>
                  <div className="v2-row-text">{r.localBus.label}</div>
                </div>
                <div className="v2-row-line"><span>{r.localArriveCsererdo - r.localBoardAt} {t.min}</span></div>
                <div className="v2-row">
                  <div className="v2-row-time" style={{color:"#FFC93C"}}>{U.fmtTime(r.localArriveCsererdo)}</div>
                  <div className="v2-row-icon">🏡</div>
                  <div className="v2-row-text" style={{color:"#FFC93C",fontWeight:800}}>{r.homeStop || t.home}</div>
                </div>
              </div>
            </div>
            )
          ))}
        </div>
      ) : (
        <div className="v1-empty" style={{ background: "rgba(255,255,255,0.08)", color: "#F3E9D2" }}>
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

window.V2Variation = V2Variation;
