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
    { key:"overview", icon:"🏛",  label:"Overview",         sub:"All departments"  },
    { key:"reports",  icon:"📊",  label:"Faculty Reports",  sub:"Scores & results" },
    { key:"feedback", icon:"🤖",  label:"AI Feedback",      sub:"Review reports"   },
    { key:"audit",    icon:"🔒",  label:"Audit Log",        sub:"XAI trail"        },
  ],
};

// Role labels — no "Portal" word, will be centered
const roleLabel = { student:"Student", chairperson:"Program Chair", hr:"HR Officer" };
const roleStyle = {
  student:     { bg:"rgba(76,175,111,0.12)",  border:"rgba(76,175,111,0.25)",  color:"#4CAF6F" },
  chairperson: { bg:"var(--ust-gold-dim)",    border:"var(--ust-gold-border)", color:"var(--ust-gold)" },
  hr:          { bg:"rgba(100,130,220,0.10)", border:"rgba(100,130,220,0.22)", color:"#7090DC" },
};

export default function Sidebar({ user, activeTab, onNavigate, isOpen, onClose }) {
  const items = navConfig[user.role] || [];
  const rs    = roleStyle[user.role] || roleStyle.chairperson;

  const handleNav = (key) => { onNavigate(key); if (onClose) onClose(); };

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`sidebar-overlay${isOpen ? " active" : ""}`}
        onClick={onClose}
      />

      <aside className={`sidebar${isOpen ? " open" : ""}`} style={{
        background:"var(--bg-surface)", borderRight:"1px solid var(--border)",
        display:"flex", flexDirection:"column",
      }}>

        {/* ── Brand row ───────────────────────────── */}
        <div style={{ padding:"18px 18px 0" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"14px" }}>
            <div style={{
              width:"38px", height:"38px", borderRadius:"10px", flexShrink:0,
              background:"linear-gradient(135deg,#F5A623,#C8850A)",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontFamily:"var(--font-display)", fontWeight:800, fontSize:"11px", color:"#0D0B06",
            }}>UST-L</div>
            <div>
              <p style={{ fontSize:"12px", fontWeight:700, color:"var(--text-primary)", lineHeight:1.2 }}>
                UST–Legazpi
              </p>
              <p style={{ fontSize:"9.5px", color:"var(--text-muted)", letterSpacing:"0.04em", textTransform:"uppercase", lineHeight:1.4 }}>
                Faculty Evaluation Portal
              </p>
            </div>
          </div>

          {/* ── User card ──────────────────────────── */}
          <div style={{
            background:"var(--bg-elevated)", border:"1px solid var(--border)",
            borderRadius:"12px", padding:"14px", marginBottom:"6px",
          }}>
            {/* Avatar + name row */}
            <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"12px" }}>
              <div style={{
                width:"40px", height:"40px", borderRadius:"12px", flexShrink:0,
                background:"linear-gradient(135deg,#F5A623,#C8850A)",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontFamily:"var(--font-display)", fontSize:"17px", fontWeight:700, color:"#0D0B06",
              }}>{user.avatar}</div>
              <div style={{ minWidth:0 }}>
                <p style={{ fontSize:"13px", fontWeight:700, color:"var(--text-primary)", lineHeight:1.2,
                  whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{user.name}</p>
                <p style={{ fontSize:"10px", color:"var(--text-muted)", marginTop:"2px",
                  whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{user.info}</p>
              </div>
            </div>

            {/* Role badge — CENTRED, no "Portal" */}
            <div style={{ display:"flex", justifyContent:"center" }}>
              <div style={{
                display:"inline-flex", alignItems:"center", gap:"5px",
                background:rs.bg, border:`1px solid ${rs.border}`,
                borderRadius:"6px", padding:"4px 14px",
              }}>
                <span style={{ width:"6px", height:"6px", borderRadius:"50%",
                  background:rs.color, display:"inline-block", flexShrink:0 }}/>
                <span style={{ fontSize:"11px", fontWeight:700, color:rs.color, letterSpacing:"0.04em" }}>
                  {roleLabel[user.role]}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Navigation ─────────────────────────── */}
        <nav style={{ flex:1, padding:"10px 12px" }}>
          <p style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase",
            color:"var(--text-muted)", padding:"0 6px", marginBottom:"6px" }}>Menu</p>
          {items.map(item => {
            const active = activeTab === item.key;
            return (
              <button key={item.key} onClick={() => handleNav(item.key)} style={{
                width:"100%", display:"flex", alignItems:"center", gap:"10px",
                padding:"10px", borderRadius:"10px", marginBottom:"3px",
                background: active ? "var(--ust-gold-dim)" : "transparent",
                border: active ? "1px solid var(--ust-gold-border)" : "1px solid transparent",
                color: active ? "var(--ust-gold)" : "var(--text-second)",
                cursor:"pointer", textAlign:"left", transition:"all 0.14s",
              }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background="var(--bg-base)"; e.currentTarget.style.color="var(--text-primary)"; }}}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background="transparent"; e.currentTarget.style.color="var(--text-second)"; }}}
              >
                <span style={{ fontSize:"16px", flexShrink:0 }}>{item.icon}</span>
                <div>
                  <p style={{ fontSize:"13px", fontWeight:active?700:500, lineHeight:1.2 }}>{item.label}</p>
                  <p style={{ fontSize:"10px", color:"var(--text-muted)", marginTop:"1px" }}>{item.sub}</p>
                </div>
              </button>
            );
          })}
        </nav>

        {/* ── Semester status ─────────────────────── */}
        <div style={{ padding:"13px 18px", borderTop:"1px solid var(--border)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
            <span className="anim-pulse" style={{ display:"inline-block", width:"6px", height:"6px",
              borderRadius:"50%", background:"var(--success)", flexShrink:0 }}/>
            <span style={{ fontSize:"10px", color:"var(--text-muted)" }}>2nd Sem · SY 2025–2026 · Open</span>
          </div>
        </div>
      </aside>
    </>
  );
}