const pageTitles = {
  evaluate: { title:"Evaluate Faculty",       sub:"Submit your faculty evaluation for this semester"  },
  history:  { title:"My Submissions",         sub:"Your submitted evaluations this semester"          },
  overview: { title:"Department Overview",    sub:"Faculty performance summary"                       },
  feedback: { title:"AI Feedback Reports",    sub:"Explainable AI-generated faculty feedback"         },
  reports:  { title:"Faculty Reports",        sub:"Evaluation results across all departments"         },
  audit:    { title:"Audit Log",              sub:"Traceable record of all AI-generated reports"      },
};

const IcoSun  = () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>;
const IcoMoon = () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>;
const IcoMenu = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M3 12h18M3 6h18M3 18h18"/></svg>;
const IcoOut  = () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>;

export default function Header({ activeTab, isDark, onToggleTheme, onLogout, onMenuOpen }) {
  const meta = pageTitles[activeTab] || { title:"Faculty Evaluation System", sub:"UST–Legazpi" };

  const iconBtn = {
    width:"36px", height:"36px", borderRadius:"var(--radius-sm)",
    background:"var(--bg-elevated)", border:"1px solid var(--border)",
    color:"var(--text-second)", display:"flex", alignItems:"center",
    justifyContent:"center", cursor:"pointer", flexShrink:0, transition:"all 0.14s",
  };

  return (
    <header style={{
      height:"var(--header-h)", position:"sticky", top:0, zIndex:100,
      background: isDark ? "rgba(13,11,6,0.93)" : "rgba(253,250,242,0.93)",
      backdropFilter:"blur(14px)", WebkitBackdropFilter:"blur(14px)",
      borderBottom:"1px solid var(--border)",
      display:"flex", alignItems:"center", justifyContent:"space-between",
      padding:"0 20px", gap:"12px",
    }}>

      {/* Left: hamburger + title */}
      <div style={{ display:"flex", alignItems:"center", gap:"10px", minWidth:0 }}>
        <button
          className="hamburger"
          onClick={onMenuOpen}
          style={iconBtn}
          onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--amber)";e.currentTarget.style.color="var(--amber)";}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.color="var(--text-second)";}}>
          <IcoMenu/>
        </button>
        <div style={{ minWidth:0 }}>
          <h1 style={{ fontFamily:"var(--font-display)", fontSize:"16px", fontWeight:600,
            color:"var(--text-primary)", lineHeight:1.2,
            whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{meta.title}</h1>
          <p style={{ fontSize:"11px", color:"var(--text-muted)", marginTop:"1px",
            whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{meta.sub}</p>
        </div>
      </div>

      {/* Right: theme + logout */}
      <div style={{ display:"flex", alignItems:"center", gap:"8px", flexShrink:0 }}>
        <button onClick={onToggleTheme} title={isDark?"Switch to Light":"Switch to Dark"} style={iconBtn}
          onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--amber)";e.currentTarget.style.color="var(--amber)";}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.color="var(--text-second)";}}>
          {isDark ? <IcoSun/> : <IcoMoon/>}
        </button>

        <button onClick={onLogout} style={{
          display:"flex", alignItems:"center", gap:"6px",
          padding:"8px 14px", borderRadius:"var(--radius-sm)",
          background: isDark ? "rgba(224,82,82,0.10)" : "rgba(192,57,43,0.07)",
          border: isDark ? "1px solid rgba(224,82,82,0.28)" : "1px solid rgba(192,57,43,0.25)",
          color: isDark ? "#E87878" : "#B03020",
          fontSize:"12px", fontWeight:700, cursor:"pointer", transition:"all 0.14s",
        }}
          onMouseEnter={e=>{e.currentTarget.style.background=isDark?"rgba(224,82,82,0.20)":"rgba(192,57,43,0.14)";e.currentTarget.style.borderColor=isDark?"rgba(224,82,82,0.55)":"rgba(192,57,43,0.50)";}}
          onMouseLeave={e=>{e.currentTarget.style.background=isDark?"rgba(224,82,82,0.10)":"rgba(192,57,43,0.07)";e.currentTarget.style.borderColor=isDark?"rgba(224,82,82,0.28)":"rgba(192,57,43,0.25)";}}>
          <IcoOut/>
          <span className="logout-label">Log Out</span>
        </button>
      </div>
    </header>
  );
}