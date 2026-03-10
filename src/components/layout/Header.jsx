/**
 * Header.jsx — UST brand colors, sticky top bar.
 */
const pageTitles = {
  evaluate: { title:"Evaluate Faculty",       sub:"Submit your faculty evaluation for this semester"     },
  history:  { title:"My Submissions",         sub:"Your submitted evaluations this semester"             },
  overview: { title:"Department Overview",    sub:"Faculty performance summary — Tertiary Department"    },
  feedback: { title:"AI Feedback Reports",    sub:"Explainable AI-generated faculty feedback"            },
  reports:  { title:"Faculty Reports",        sub:"Evaluation results across all departments"            },
  audit:    { title:"Audit Log",              sub:"Traceable record of all AI-generated reports"         },
};
const Sun  = () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>;
const Moon = () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>;

export default function Header({ activeTab, user, isDark, onToggleTheme }) {
  const meta = pageTitles[activeTab] || { title:"Faculty Evaluation System", sub:"UST–Legazpi Tertiary Department" };
  return (
    <header style={{
      height:"var(--header-h)", position:"sticky", top:0, zIndex:40,
      background: isDark ? "rgba(13,11,6,0.90)" : "rgba(253,250,243,0.90)",
      backdropFilter:"blur(14px)", WebkitBackdropFilter:"blur(14px)",
      borderBottom:"1px solid var(--border)",
      display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 28px",
    }}>
      <div>
        <h1 style={{ fontFamily:"var(--font-display)", fontSize:"17px", fontWeight:600,
          color:"var(--text-primary)", lineHeight:1.2 }}>{meta.title}</h1>
        <p style={{ fontSize:"11px", color:"var(--text-muted)", marginTop:"1px" }}>{meta.sub}</p>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
        {/* Theme toggle */}
        <button onClick={onToggleTheme} title={isDark?"Light mode":"Dark mode"}
          style={{ width:"34px", height:"34px", borderRadius:"var(--radius-sm)",
            background:"var(--bg-elevated)", border:"1px solid var(--border)",
            color:"var(--text-second)", display:"flex", alignItems:"center",
            justifyContent:"center", cursor:"pointer" }}>
          {isDark ? <Sun /> : <Moon />}
        </button>
        {/* User chip */}
        <div style={{ display:"flex", alignItems:"center", gap:"8px",
          padding:"4px 12px 4px 5px", background:"var(--bg-elevated)",
          border:"1px solid var(--border)", borderRadius:"99px" }}>
          <div style={{ width:"26px", height:"26px", borderRadius:"50%",
            background:"linear-gradient(135deg,#F5A623,#C8850A)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:"12px", fontWeight:700, color:"#0D0B06" }}>{user.avatar}</div>
          <span style={{ fontSize:"12px", fontWeight:600, color:"var(--text-second)" }}>
            {user.name.split(" ")[0]}
          </span>
        </div>
      </div>
    </header>
  );
}
