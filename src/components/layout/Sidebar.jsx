/**
 * Sidebar.jsx — UST-Legazpi brand. Gold on black navigation.
 */
const navConfig = {
  student: [
    { key:"evaluate", icon:"✏️", label:"Evaluate Faculty",  sub:"Submit evaluation" },
    { key:"history",  icon:"📋", label:"My Submissions",    sub:"View your history" },
  ],
  chairperson: [
    { key:"overview",  icon:"📊", label:"Department Overview", sub:"Faculty summary"    },
    { key:"evaluate",  icon:"✏️", label:"Submit Evaluation",   sub:"Chair evaluation"  },
    { key:"feedback",  icon:"🤖", label:"AI Feedback Reports", sub:"View AI summaries" },
  ],
  hr: [
    { key:"overview",  icon:"🏛",  label:"Overview",         sub:"All departments"   },
    { key:"reports",   icon:"📊",  label:"Faculty Reports",  sub:"Scores & results"  },
    { key:"feedback",  icon:"🤖",  label:"AI Feedback",      sub:"Review reports"    },
    { key:"audit",     icon:"🔒",  label:"Audit Log",        sub:"XAI trail"         },
  ],
};
const roleLabel = { student:"Student Portal", chairperson:"Program Chair", hr:"HR Officer" };

export default function Sidebar({ user, activeTab, onNavigate, onLogout }) {
  const items = navConfig[user.role] || [];
  return (
    <aside style={{
      width:"var(--sidebar-w)", minHeight:"100vh",
      background:"var(--bg-surface)",
      borderRight:"1px solid var(--border)",
      display:"flex", flexDirection:"column",
      position:"fixed", top:0, left:0, bottom:0, zIndex:50, overflowY:"auto",
    }}>
      {/* Logo */}
      <div style={{ padding:"20px 18px 16px", borderBottom:"1px solid var(--border)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"10px" }}>
          <div style={{
            width:"38px", height:"38px", borderRadius:"10px", flexShrink:0,
            background:"linear-gradient(135deg, #F5A623 0%, #C8850A 100%)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontFamily:"var(--font-display)", fontWeight:800, fontSize:"11px", color:"#0D0B06",
          }}>UST-L</div>
          <div>
            <p style={{ fontSize:"12px", fontWeight:700, color:"var(--text-primary)", lineHeight:1.2 }}>UST–Legazpi</p>
            <p style={{ fontSize:"10px", color:"var(--text-muted)", letterSpacing:"0.05em", textTransform:"uppercase" }}>Faculty Portal</p>
          </div>
        </div>
        {/* User badge */}
        <div style={{ padding:"8px 10px", background:"var(--ust-gold-dim)",
          border:"1px solid var(--ust-gold-border)", borderRadius:"var(--radius-sm)" }}>
          <p style={{ fontSize:"11px", fontWeight:700, color:"var(--ust-gold)", marginBottom:"1px", lineHeight:1.2 }}>{user.name}</p>
          <p style={{ fontSize:"10px", color:"var(--text-muted)" }}>{roleLabel[user.role]}</p>
        </div>
      </div>

      {/* Nav items */}
      <nav style={{ flex:1, padding:"14px 12px" }}>
        <p style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase",
          color:"var(--text-muted)", padding:"0 6px", marginBottom:"8px" }}>Menu</p>
        {items.map(item => {
          const active = activeTab === item.key;
          return (
            <button key={item.key} onClick={()=>onNavigate(item.key)}
              style={{ width:"100%", display:"flex", alignItems:"center", gap:"10px",
                padding:"10px 10px", borderRadius:"10px", marginBottom:"4px",
                background: active ? "var(--ust-gold-dim)" : "transparent",
                border: active ? "1px solid var(--ust-gold-border)" : "1px solid transparent",
                color: active ? "var(--ust-gold)" : "var(--text-second)",
                cursor:"pointer", textAlign:"left", transition:"all 0.14s" }}
              onMouseEnter={e=>{ if(!active){ e.currentTarget.style.background="var(--bg-elevated)"; e.currentTarget.style.color="var(--text-primary)"; }}}
              onMouseLeave={e=>{ if(!active){ e.currentTarget.style.background="transparent"; e.currentTarget.style.color="var(--text-second)"; }}}>
              <span style={{ fontSize:"17px", flexShrink:0 }}>{item.icon}</span>
              <div>
                <p style={{ fontSize:"13px", fontWeight:active?700:500, lineHeight:1.2 }}>{item.label}</p>
                <p style={{ fontSize:"10px", color:"var(--text-muted)", marginTop:"1px" }}>{item.sub}</p>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding:"14px 18px", borderTop:"1px solid var(--border)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"6px", marginBottom:"10px" }}>
          <span className="anim-pulse" style={{ display:"inline-block", width:"6px", height:"6px",
            borderRadius:"50%", background:"var(--success)", flexShrink:0 }} />
          <span style={{ fontSize:"10px", color:"var(--text-muted)" }}>1st Sem · AY 2025–2026 · Open</span>
        </div>
        <button onClick={onLogout}
          style={{ width:"100%", padding:"8px", borderRadius:"var(--radius-sm)",
            background:"transparent", border:"1px solid var(--border)",
            color:"var(--text-muted)", fontSize:"12px", fontWeight:600,
            cursor:"pointer", transition:"all 0.14s" }}
          onMouseEnter={e=>{ e.currentTarget.style.borderColor="var(--danger)"; e.currentTarget.style.color="var(--danger)"; }}
          onMouseLeave={e=>{ e.currentTarget.style.borderColor="var(--border)"; e.currentTarget.style.color="var(--text-muted)"; }}>
          Log Out
        </button>
      </div>
    </aside>
  );
}
