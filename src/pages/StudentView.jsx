import { useState } from "react";
import { facultyList, evaluationCriteria, studentSubmissions, SEMESTER } from "../data/mockData.js";

/* ── Shared Card ─────────────────────────────────── */
function Card({ children, style={} }) {
  return (
    <div style={{
      background:"#FFFFFF", border:"1px solid rgba(26,50,112,0.10)",
      borderRadius:"14px", padding:"22px",
      boxShadow:"0 1px 4px rgba(15,32,80,0.06), 0 4px 14px rgba(15,32,80,0.05)",
      ...style
    }}>{children}</div>
  );
}

/* ── Section label ───────────────────────────────── */
function SectionLabel({ children }) {
  return (
    <p style={{ fontSize:"10.5px", fontWeight:700, letterSpacing:"0.08em",
      textTransform:"uppercase", color:"var(--text-primary)", marginBottom:"5px" }}>
      {children}
    </p>
  );
}

/* ── Star Rating ─────────────────────────────────── */
/**
 * EmojiRating — 5 circles that show face emojis on hover/select.
 * Label appears BELOW the circles, never shifts their position.
 */
const EMOJI_DATA = [
  { emoji:"😞", label:"Poor",           activeColor:"#E05252", activeBg:"rgba(224,82,82,0.10)",     borderColor:"rgba(224,82,82,0.45)" },
  { emoji:"😕", label:"Below Average",  activeColor:"#D4780A", activeBg:"rgba(212,120,10,0.10)",    borderColor:"rgba(212,120,10,0.45)" },
  { emoji:"😐", label:"Satisfactory",   activeColor:"#A07800", activeBg:"rgba(160,120,0,0.10)",     borderColor:"rgba(160,120,0,0.45)"  },
  { emoji:"😊", label:"Good",           activeColor:"#5A8A20", activeBg:"rgba(90,138,32,0.10)",     borderColor:"rgba(90,138,32,0.45)"  },
  { emoji:"😄", label:"Excellent",      activeColor:"#1E7E3E", activeBg:"rgba(30,126,62,0.10)",     borderColor:"rgba(30,126,62,0.45)"  },
];

function EmojiRating({ value, onChange }) {
  const [hover, setHover] = useState(0);
  const active = hover || value;
  const current = active > 0 ? EMOJI_DATA[active - 1] : null;

  return (
    <div style={{ textAlign:"center" }}>
      {/* Circle row — fixed size, never moves */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"10px", marginBottom:"10px" }}>
        {EMOJI_DATA.map((item, i) => {
          const n        = i + 1;
          const isActive = n === (hover || value);
          const isFilled = n <= (hover || value);
          return (
            <button
              key={n} type="button"
              onClick={() => onChange(n)}
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(0)}
              style={{
                width:"52px", height:"52px", borderRadius:"50%",
                border: `2px solid ${isFilled ? item.borderColor : "rgba(180,160,80,0.22)"}`,
                background: isFilled ? item.activeBg : "rgba(255,255,255,0.70)",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize: isActive ? "26px" : "0px",    /* emoji shown when active, hidden when not */
                cursor:"pointer",
                transition:"all 0.16s cubic-bezier(0.34,1.56,0.64,1)",
                transform: isActive ? "scale(1.12)" : "scale(1)",
                boxShadow: isActive ? `0 4px 14px ${item.borderColor}` : "none",
                position:"relative", flexShrink:0,
              }}>
              {/* Always-visible small number dot when not active */}
              {!isFilled && hover === 0 && value === 0 && (
                <span style={{ fontSize:"16px", color:"rgba(180,150,60,0.35)", fontWeight:700, lineHeight:1 }}>
                  {n === 1 ? "☹" : n === 2 ? "😕" : n === 3 ? "😐" : n === 4 ? "🙂" : "😄"}
                </span>
              )}
              {/* Emoji shown when filled or hovered */}
              {(isFilled || hover === n) && (
                <span style={{ fontSize:"26px", lineHeight:1 }}>{item.emoji}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Label row — fixed height so layout never shifts */}
      <div style={{ height:"22px", display:"flex", alignItems:"center", justifyContent:"center" }}>
        {current ? (
          <span style={{
            fontSize:"12px", fontWeight:700, letterSpacing:"0.04em",
            color: current.activeColor,
            background: current.activeBg,
            border:`1px solid ${current.borderColor}`,
            borderRadius:"99px", padding:"3px 14px",
            transition:"color 0.15s",
          }}>
            {current.label}
          </span>
        ) : (
          <span style={{ fontSize:"12px", color:"rgba(140,120,60,0.45)", fontStyle:"italic" }}>
            Hover or tap to rate
          </span>
        )}
      </div>
    </div>
  );
}

/* ── Evaluation Form ─────────────────────────────── */
function EvalForm({ faculty, onClose, onSubmit }) {
  const [ratings, setRatings] = useState({});
  const [comment, setComment] = useState("");
  const [errors,  setErrors]  = useState({});
  const [done,    setDone]    = useState(false);

  const submit = () => {
    const e = {};
    evaluationCriteria.forEach(c=>{ if(!ratings[c.id]) e[c.id]=true; });
    if(comment.trim().length<50) e.comment=true;
    if(Object.keys(e).length){ setErrors(e); return; }
    setDone(true);
    setTimeout(()=>onSubmit(faculty.id), 1500);
  };

  if(done) return (
    <div style={{ textAlign:"center", padding:"48px 0" }}>
      <div style={{ width:"72px", height:"72px", borderRadius:"50%", margin:"0 auto 18px",
        background:"var(--success-dim)", border:"2px solid var(--success-border)",
        display:"flex", alignItems:"center", justifyContent:"center", fontSize:"32px" }}>✓</div>
      <h3 style={{ fontSize:"20px", fontWeight:600, color:"var(--text-primary)", marginBottom:"10px" }}>
        Evaluation Submitted
      </h3>
      <p style={{ fontSize:"13px", color:"var(--text-second)", maxWidth:"360px", margin:"0 auto", lineHeight:1.7 }}>
        Your response has been recorded and will be processed at the end of the evaluation period. Thank you.
      </p>
    </div>
  );

  return (
    /* CENTERED layout for evaluation form */
    <div style={{ maxWidth:"640px", margin:"0 auto" }}>
      {/* Faculty header */}
      <div style={{ textAlign:"center", padding:"20px 24px", marginBottom:"24px",
        background:"linear-gradient(135deg, #B88C00 0%, #F2B800 100%)",
        borderRadius:"12px", color:"var(--text-on-gold)" }}>
        <p style={{ fontSize:"11px", fontWeight:700, letterSpacing:"0.08em",
          color:"rgba(0,0,0,0.65)", textTransform:"uppercase", marginBottom:"4px" }}>
          Now Evaluating
        </p>
        <h3 style={{ fontFamily:"var(--font-display)", fontSize:"18px", fontWeight:700,
          marginBottom:"4px" }}>{faculty.name}</h3>
        <p style={{ fontSize:"12px", color:"rgba(255,255,255,0.70)" }}>
          {faculty.code} · {faculty.subject}
        </p>
      </div>

      <Card>
        {evaluationCriteria.map((c, i) => (
          <div key={c.id} style={{ marginBottom:"28px", paddingBottom:"28px", textAlign:"center",
            borderBottom:i<evaluationCriteria.length-1?"1px solid rgba(26,50,112,0.08)":"none" }}>
            {/* Category label */}
            <p style={{ fontSize:"11px", fontWeight:700, color:"var(--text-primary)", letterSpacing:"0.08em",
              textTransform:"uppercase", marginBottom:"6px" }}>{c.category}</p>
            {/* Prompt */}
            <p style={{ fontSize:"13px", color:"var(--text-second)", marginBottom:"16px",
              lineHeight:1.6, maxWidth:"480px", margin:"0 auto 16px" }}>{c.prompt}</p>
            {/* Stars — centered */}
            <EmojiRating value={ratings[c.id]||0}
              onChange={v=>{setRatings(r=>({...r,[c.id]:v}));setErrors(e=>({...e,[c.id]:false}));}}/>
            {errors[c.id] && (
              <p style={{ fontSize:"11px", color:"var(--danger)", marginTop:"6px",
                textAlign:"center" }}>Please select a rating.</p>
            )}
          </div>
        ))}

        {/* Open-ended comment */}
        <div style={{ marginTop:"4px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"8px",
            flexWrap:"wrap", justifyContent:"center" }}>
            <SectionLabel>Open-Ended Comments</SectionLabel>
            <span style={{ fontSize:"10px", fontWeight:700, color:"var(--text-primary)",
              background:"var(--gold-dim)", border:"1px solid var(--navy-border)",
              borderRadius:"4px", padding:"1px 8px", letterSpacing:"0.04em" }}>AI INPUT</span>
          </div>
          <p style={{ fontSize:"12px", color:"var(--text-muted)", marginBottom:"10px",
            lineHeight:1.6, textAlign:"center", maxWidth:"460px", margin:"0 auto 12px" }}>
            Your written comments feed the AI feedback engine. Be specific for more useful reports.
          </p>
          <textarea value={comment}
            onChange={e=>{setComment(e.target.value);setErrors(er=>({...er,comment:false}));}}
            placeholder="e.g., Explains concepts clearly but pace moves fast. More worked examples in lab sessions would help…"
            rows={4}
            style={{ width:"100%", padding:"13px 16px", background:"var(--bg-input)",
              border:`1.5px solid ${errors.comment?"var(--danger)":"var(--border)"}`,
              borderRadius:"10px", color:"var(--text-primary)", fontSize:"13px",
              lineHeight:1.7, resize:"vertical", transition:"border-color 0.15s, box-shadow 0.15s" }}
            onFocus={e=>{e.target.style.borderColor="var(--gold-border)";e.target.style.background="#FFFFFF";e.target.style.boxShadow="0 0 0 3px rgba(200,148,10,0.12)";}}
            onBlur={e=>{e.target.style.borderColor=errors.comment?"var(--danger)":"var(--border)";e.target.style.background="var(--bg-input)";e.target.style.boxShadow="none";}}/>
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:"5px" }}>
            {errors.comment
              ? <p style={{ fontSize:"11px", color:"var(--danger)" }}>Minimum 50 characters required.</p>
              : <span/>}
            <p style={{ fontSize:"11px", color:comment.length>=50?"var(--success)":"var(--text-muted)" }}>
              {comment.length} chars
            </p>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display:"flex", gap:"10px", marginTop:"24px" }}>
          <button onClick={onClose} className="btn-outline" style={{ flex:1 }}>Cancel</button>
          <button onClick={submit} style={{ flex:2, padding:"12px", borderRadius:"var(--radius-sm)",
            background:"var(--gold)", color:"var(--text-on-gold)", fontSize:"13px", fontWeight:700,
            border:"none", cursor:"pointer", transition:"all 0.15s",
            boxShadow:"0 2px 8px rgba(180,140,0,0.30)" }}
            onMouseEnter={e=>{e.currentTarget.style.background="var(--gold-deep)";e.currentTarget.style.transform="translateY(-1px)";}}
            onMouseLeave={e=>{e.currentTarget.style.background="var(--gold)";e.currentTarget.style.transform="translateY(0)";}}>
            Submit Evaluation →
          </button>
        </div>
        <p style={{ textAlign:"center", marginTop:"10px", fontSize:"11px", color:"var(--text-muted)" }}>
          🔒 Your identity is never linked to your comments in AI-generated reports.
        </p>
      </Card>
    </div>
  );
}

/* ── Main Component ──────────────────────────────── */
export default function StudentView({ activeTab }) {
  const [selected,  setSelected]  = useState(null);
  const [submitted, setSubmitted] = useState(new Set(studentSubmissions.map(s=>s.facultyId)));

  const onSubmit = (fid) => {
    setSubmitted(p=>new Set([...p,fid]));
    setTimeout(()=>setSelected(null), 600);
  };

  const sorted = [...facultyList].sort((a,b)=>
    (submitted.has(a.id)?1:0)-(submitted.has(b.id)?1:0)
  );

  /* ── Evaluate tab ─────────────────────────────── */
  if(activeTab==="evaluate") {
    if(selected) return (
      <div className="anim-fade-in">
        <button onClick={()=>setSelected(null)}
          style={{ display:"flex", alignItems:"center", gap:"6px", color:"var(--text-second)",
            fontSize:"13px", marginBottom:"20px", background:"none", border:"none",
            cursor:"pointer", fontWeight:600 }}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to faculty list
        </button>
        <EvalForm faculty={selected} onClose={()=>setSelected(null)} onSubmit={onSubmit}/>
      </div>
    );

    return (
      <div className="anim-fade-up">
        {/* Stats bar */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
          marginBottom:"20px", flexWrap:"wrap", gap:"10px" }}>
          <div>
            <h2 style={{ fontFamily:"var(--font-display)", fontSize:"22px", fontWeight:600,
              color:"var(--text-primary)", marginBottom:"2px" }}>Faculty Roster</h2>
            <p style={{ fontSize:"12px", color:"var(--text-muted)" }}>
              {sorted.filter(f=>!submitted.has(f.id)).length} evaluations remaining · {SEMESTER}
            </p>
          </div>
          <div style={{ display:"inline-flex", alignItems:"center", gap:"6px", padding:"6px 14px",
            background:"#FFFFFF", border:"1px solid rgba(26,50,112,0.12)",
            borderRadius:"var(--radius-pill)", boxShadow:"var(--shadow-xs)" }}>
            <span style={{ width:"6px", height:"6px", borderRadius:"50%", background:"var(--success)" }}/>
            <span style={{ fontSize:"11px", fontWeight:700, color:"var(--text-primary)" }}>CEAFA · BSCS 3G</span>
          </div>
        </div>

        <div className="card-list">
          {sorted.map(f => {
            const done = submitted.has(f.id);
            return (
              <div key={f.id}
                style={{ display:"flex", alignItems:"center", gap:"14px", padding:"16px 20px",
                  background:"#FFFFFF", border:`1px solid ${done?"var(--border)":"var(--border)"}`,
                  borderRadius:"12px",
                  boxShadow: done?"none":"0 1px 4px rgba(15,32,80,0.06)",
                  opacity:done?0.60:1, transition:"all 0.2s" }}>
                {/* Faculty initial avatar */}
                <div style={{ width:"42px", height:"42px", borderRadius:"11px", flexShrink:0,
                  background: done ? "var(--bg-elevated)" : "linear-gradient(135deg,#1C1400,#3E3000)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontFamily:"var(--font-display)", fontSize:"16px",
                  color:done?"var(--text-muted)":"#FFFFFF", fontWeight:700 }}>
                  {f.name.split(" ").slice(-1)[0][0]}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontWeight:600, fontSize:"14px", color:"var(--text-primary)",
                    marginBottom:"2px", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                    {f.name}
                  </p>
                  <p style={{ fontSize:"12px", color:"var(--text-muted)",
                    whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                    {f.code} · {f.subject}
                  </p>
                </div>
                {done ? (
                  <span style={{ fontSize:"11px", fontWeight:700, color:"var(--success)",
                    background:"var(--success-dim)", border:"1px solid var(--success-border)",
                    borderRadius:"99px", padding:"5px 14px", flexShrink:0, whiteSpace:"nowrap" }}>
                    ✓ Submitted
                  </span>
                ) : (
                  <button onClick={()=>setSelected(f)} style={{
                    padding:"8px 18px", borderRadius:"var(--radius-sm)", flexShrink:0,
                    background:"transparent", border:"1.5px solid var(--gold-deep)",
                    color:"var(--text-primary)", fontSize:"12px", fontWeight:700,
                    whiteSpace:"nowrap", cursor:"pointer", transition:"all 0.15s",
                  }}
                    onMouseEnter={e=>{e.currentTarget.style.background="var(--gold)";e.currentTarget.style.color="var(--text-on-gold)";}}
                    onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color="var(--text-second)";}}>
                    Evaluate
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  /* ── History tab ──────────────────────────────── */
  if(activeTab==="history") {
    const subs = [...submitted];
    return (
      <div className="anim-fade-up">
        <h2 style={{ fontFamily:"var(--font-display)", fontSize:"22px", fontWeight:600,
          color:"var(--text-primary)", marginBottom:"4px" }}>My Submissions</h2>
        <p style={{ fontSize:"12px", color:"var(--text-muted)", marginBottom:"20px" }}>
          {subs.length} of {facultyList.length} evaluations submitted · {SEMESTER}
        </p>
        {subs.length===0 ? (
          <div style={{ textAlign:"center", padding:"48px 0", background:"#FFFFFF",
            border:"1px solid rgba(26,50,112,0.10)", borderRadius:"14px" }}>
            <div style={{ fontSize:"40px", marginBottom:"12px" }}>📋</div>
            <p style={{ color:"var(--text-second)", fontSize:"14px", fontWeight:600, marginBottom:"4px" }}>
              No evaluations submitted yet
            </p>
            <p style={{ color:"var(--text-muted)", fontSize:"12px" }}>
              Head to Evaluate Faculty to get started.
            </p>
          </div>
        ) : (
          <div className="card-list">
            {studentSubmissions.map((s,i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:"16px",
                padding:"16px 22px", background:"#FFFFFF",
                border:"1px solid rgba(26,50,112,0.10)", borderRadius:"12px",
                boxShadow:"var(--shadow-xs)" }}>
                <div style={{ flex:1 }}>
                  <p style={{ fontWeight:600, fontSize:"14px", marginBottom:"2px" }}>{s.facultyName}</p>
                  <p style={{ fontSize:"12px", color:"var(--text-muted)" }}>{s.subject} · Submitted {s.submittedAt}</p>
                </div>
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  <p style={{ fontFamily:"var(--font-display)", fontSize:"26px", fontWeight:600,
                    color:"var(--text-primary)", lineHeight:1 }}>{s.avg.toFixed(1)}</p>
                  <p style={{ fontSize:"10px", color:"var(--text-muted)", marginTop:"2px" }}>avg rating</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
  return null;
}