/**
 * Sidebar — dark charcoal #1C1400 background matching official ust-legazpi.edu.ph
 * expanded navigation menu. Gold top accent bar (#F2B800). No navy anywhere.
 */

const navConfig = {
  student: [
    { key:"evaluate", label:"Evaluate Faculty",  sub:"Submit evaluation"  },
    { key:"history",  label:"My Submissions",    sub:"View your history"  },
  ],
  chairperson: [
    { key:"overview",  label:"Department Overview", sub:"Faculty summary"    },
    { key:"evaluate",  label:"Submit Evaluation",   sub:"Chair evaluation"   },
    { key:"feedback",  label:"AI Feedback Reports", sub:"View AI summaries"  },
  ],
  hr: [
    { key:"overview", label:"Overview",        sub:"All departments"   },
    { key:"reports",  label:"Faculty Reports", sub:"Scores & results"  },
    { key:"feedback", label:"AI Feedback",     sub:"Review reports"    },
    { key:"audit",    label:"Audit Log",       sub:"XAI trail"         },
  ],
};

const icons = {
  evaluate: (<svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>),
  history:  (<svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>),
  overview: (<svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>),
  reports:  (<svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>),
  feedback: (<svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>),
  audit:    (<svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>),
};

const roleLabel = { student:"Student", chairperson:"Program Chair", hr:"HR Officer" };
const roleDot   = { student:"#2E9E5E", chairperson:"#F2B800", hr:"#F2B800" };

export default function Sidebar({ user, activeTab, onNavigate, isOpen, onClose }) {
  const items = navConfig[user.role] || [];
  const dot   = roleDot[user.role];
  const handleNav = (key) => { onNavigate(key); if (onClose) onClose(); };

  return (
    <>
      <div className={`sidebar-overlay${isOpen?" active":""}`} onClick={onClose}/>
      <aside className={`sidebar${isOpen?" open":""}`}>

        {/* Gold top bar — mirrors official website navbar */}
        <div style={{ background:"#F2B800", padding:"14px 18px",
          display:"flex", alignItems:"center", gap:"10px" }}>
          <div style={{ width:"34px", height:"34px", borderRadius:"8px", flexShrink:0,
            background:"#1C1400", display:"flex", alignItems:"center", justifyContent:"center",
            fontFamily:"var(--font-display)", fontWeight:800, fontSize:"10px", color:"#F2B800" }}>
            UST-L
          </div>
          <div>
            <p style={{ fontSize:"12px", fontWeight:700, color:"#1A1200", lineHeight:1.2 }}>UST–Legazpi</p>
            <p style={{ fontSize:"9px", color:"rgba(0,0,0,0.52)", letterSpacing:"0.06em", textTransform:"uppercase" }}>
              Faculty Evaluation Portal
            </p>
          </div>
        </div>

        {/* User card */}
        <div style={{ padding:"16px 16px 0" }}>
          <div style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.10)",
            borderRadius:"10px", padding:"14px", marginBottom:"6px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"12px" }}>
              <div style={{ width:"38px", height:"38px", borderRadius:"10px", flexShrink:0,
                background:"#F2B800", display:"flex", alignItems:"center", justifyContent:"center",
                fontFamily:"var(--font-display)", fontSize:"16px", fontWeight:700, color:"#1A1200" }}>
                {user.avatar}
              </div>
              <div style={{ minWidth:0 }}>
                <p style={{ fontSize:"13px", fontWeight:600, color:"#FFFFFF", lineHeight:1.2,
                  whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{user.name}</p>
                <p style={{ fontSize:"10px", color:"rgba(255,255,255,0.45)", marginTop:"2px",
                  whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{user.info}</p>
              </div>
            </div>
            <div style={{ display:"flex", justifyContent:"center" }}>
              <div style={{ display:"inline-flex", alignItems:"center", gap:"5px",
                background:"rgba(242,184,0,0.15)", border:"1px solid rgba(242,184,0,0.35)",
                borderRadius:"6px", padding:"4px 14px" }}>
                <span style={{ width:"6px", height:"6px", borderRadius:"50%",
                  background:dot, display:"inline-block", flexShrink:0 }}/>
                <span style={{ fontSize:"11px", fontWeight:700, color:"#F2B800", letterSpacing:"0.04em" }}>
                  {roleLabel[user.role]}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ padding:"12px 12px", flex:1 }}>
          <p style={{ fontSize:"9.5px", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase",
            color:"rgba(255,255,255,0.28)", padding:"0 8px", marginBottom:"6px" }}>Navigation</p>
          {items.map(item => {
            const active = activeTab === item.key;
            return (
              <button key={item.key} onClick={()=>handleNav(item.key)} style={{
                width:"100%", display:"flex", alignItems:"center", gap:"11px",
                padding:"11px 10px", borderRadius:"9px", marginBottom:"2px",
                background:active?"rgba(242,184,0,0.14)":"transparent",
                border:active?"1px solid rgba(242,184,0,0.28)":"1px solid transparent",
                color:active?"#F2B800":"rgba(255,255,255,0.60)",
                cursor:"pointer", textAlign:"left", transition:"all 0.13s", position:"relative" }}
                onMouseEnter={e=>{if(!active){e.currentTarget.style.background="rgba(255,255,255,0.06)";e.currentTarget.style.color="rgba(255,255,255,0.85)";}}}
                onMouseLeave={e=>{if(!active){e.currentTarget.style.background="transparent";e.currentTarget.style.color="rgba(255,255,255,0.60)";}}}
              >
                {active && <span style={{ position:"absolute", left:0, top:"50%", transform:"translateY(-50%)",
                  width:"3px", height:"20px", background:"#F2B800", borderRadius:"0 3px 3px 0" }}/>}
                <span style={{ flexShrink:0, color:"inherit" }}>{icons[item.key]}</span>
                <div>
                  <p style={{ fontSize:"13px", fontWeight:active?700:500, lineHeight:1.2 }}>{item.label}</p>
                  <p style={{ fontSize:"10px", color:"rgba(255,255,255,0.30)", marginTop:"1px" }}>{item.sub}</p>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Semester status */}
        <div style={{ padding:"14px 20px", borderTop:"1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"7px" }}>
            <span className="anim-pulse" style={{ width:"6px", height:"6px", borderRadius:"50%",
              background:"#2E9E5E", display:"inline-block", flexShrink:0 }}/>
            <span style={{ fontSize:"10px", color:"rgba(255,255,255,0.35)" }}>
              2nd Sem · SY 2025–2026 · Open
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}