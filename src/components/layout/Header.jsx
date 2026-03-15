const pageTitles = {
  evaluate: { title:"Evaluate Faculty",       sub:"Submit your faculty evaluation for this semester"  },
  history:  { title:"My Submissions",         sub:"Your submitted evaluations this semester"          },
  overview: { title:"Department Overview",    sub:"Faculty performance summary"                       },
  feedback: { title:"AI Feedback Reports",    sub:"Explainable AI-generated faculty feedback"         },
  reports:  { title:"Faculty Reports",        sub:"Evaluation results across all departments"         },
  audit:    { title:"Audit Log",              sub:"Traceable record of all AI-generated reports"      },
};

// Gray/neutral icons
const IcoMenu = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
    <path d="M3 12h18M3 6h18M3 18h18"/>
  </svg>
);
const IcoOut = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
  </svg>
);
const IcoBell = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/>
  </svg>
);

export default function Header({ activeTab, onLogout, onMenuOpen }) {
  const meta = pageTitles[activeTab] || { title:"Faculty Evaluation System", sub:"UST–Legazpi" };

  const iconBtn = {
    width:"36px", height:"36px", borderRadius:"var(--radius-sm)",
    background:"var(--bg-elevated)", border:"1px solid var(--border)",
    color:"#7A8AAE",                    // neutral gray
    display:"flex", alignItems:"center", justifyContent:"center",
    cursor:"pointer", flexShrink:0, transition:"all 0.14s",
  };

  return (
    <header style={{
      height:"var(--header-h)", position:"sticky", top:0, zIndex:100,
      background:"rgba(255,255,255,0.96)",
      backdropFilter:"blur(12px)", WebkitBackdropFilter:"blur(12px)",
      borderBottom:"2px solid var(--gold)",
      display:"flex", alignItems:"center", justifyContent:"space-between",
      padding:"0 24px", gap:"12px",
      boxShadow:"0 2px 8px rgba(180,140,0,0.10)",
    }}>

      {/* Left: hamburger + breadcrumb */}
      <div style={{ display:"flex", alignItems:"center", gap:"12px", minWidth:0 }}>
        <button className="hamburger" onClick={onMenuOpen} style={iconBtn}
          onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--gold-border)";e.currentTarget.style.color="var(--gold-darker)";}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(26,50,112,0.12)";e.currentTarget.style.color="#7A8AAE";}}>
          <IcoMenu/>
        </button>
        <div style={{ minWidth:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
            <h1 style={{ fontFamily:"var(--font-display)", fontSize:"17px", fontWeight:600,
              color:"var(--text-primary)", lineHeight:1.2,
              whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{meta.title}</h1>
          </div>
          <p style={{ fontSize:"11.5px", color:"var(--text-muted)", marginTop:"1px",
            whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{meta.sub}</p>
        </div>
      </div>

      {/* Right: notification + logout */}
      <div style={{ display:"flex", alignItems:"center", gap:"8px", flexShrink:0 }}>
        <button style={iconBtn}
          onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--gold-border)";e.currentTarget.style.color="var(--gold-darker)";}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(26,50,112,0.12)";e.currentTarget.style.color="#7A8AAE";}}>
          <IcoBell/>
        </button>

        <button onClick={onLogout} style={{
          display:"flex", alignItems:"center", gap:"7px",
          padding:"8px 14px", borderRadius:"var(--radius-sm)",
          background:"rgba(184,48,48,0.07)",
          border:"1px solid rgba(184,48,48,0.20)",
          color:"#B83030",
          fontSize:"12px", fontWeight:700, cursor:"pointer", transition:"all 0.14s",
        }}
          onMouseEnter={e=>{e.currentTarget.style.background="rgba(184,48,48,0.14)";e.currentTarget.style.borderColor="rgba(184,48,48,0.40)";}}
          onMouseLeave={e=>{e.currentTarget.style.background="rgba(184,48,48,0.07)";e.currentTarget.style.borderColor="rgba(184,48,48,0.20)";}}>
          <IcoOut/>
          <span className="logout-label">Log Out</span>
        </button>
      </div>
    </header>
  );
}