import { useState } from "react";
import { facultyList, evaluationCriteria, studentSubmissions, SEMESTER } from "../data/mockData.js";

/* ── Shared Card ── */
function Card({ children, style={} }) {
  return (
    <div style={{
      background:"#FFFFFF", border:"1px solid var(--border)",
      borderRadius:"14px", padding:"22px",
      boxShadow:"var(--shadow-card)", ...style
    }}>{children}</div>
  );
}

/* ── Numerical Rating (1–5) ── */
const RATING_META = [
  { n:1, label:"Poor",           color:"#B83030", bg:"rgba(184,48,48,0.08)",    border:"rgba(184,48,48,0.30)"   },
  { n:2, label:"Below Average",  color:"#C8680A", bg:"rgba(200,104,10,0.08)",   border:"rgba(200,104,10,0.30)"  },
  { n:3, label:"Satisfactory",   color:"#A07800", bg:"rgba(160,120,0,0.08)",    border:"rgba(160,120,0,0.30)"   },
  { n:4, label:"Good",           color:"#5A8A20", bg:"rgba(90,138,32,0.08)",    border:"rgba(90,138,32,0.30)"   },
  { n:5, label:"Excellent",      color:"#1E6E3E", bg:"rgba(30,110,62,0.08)",    border:"rgba(30,110,62,0.30)"   },
];

function NumericalRating({ value, onChange }) {
  const [hover, setHover] = useState(0);
  const active = hover || value;
  const current = active > 0 ? RATING_META[active - 1] : null;

  return (
    <div style={{ textAlign:"center" }}>
      {/* Number buttons row */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center",
        gap:"10px", marginBottom:"10px" }}>
        {RATING_META.map(item => {
          const isSelected = item.n === value;
          const isHovered  = item.n === hover;
          const isFilled   = item.n <= (hover || value);
          return (
            <button
              key={item.n}
              type="button"
              onClick={() => onChange(item.n)}
              onMouseEnter={() => setHover(item.n)}
              onMouseLeave={() => setHover(0)}
              style={{
                width:"50px", height:"50px", borderRadius:"12px",
                border:`2px solid ${isFilled ? item.border : "rgba(180,160,80,0.20)"}`,
                background: isSelected
                  ? item.color
                  : isFilled
                    ? item.bg
                    : "rgba(255,255,255,0.70)",
                color: isSelected ? "#FFFFFF" : isFilled ? item.color : "rgba(160,140,60,0.45)",
                fontFamily:"var(--font-display)",
                fontSize:"22px", fontWeight:700, lineHeight:1,
                cursor:"pointer",
                display:"flex", flexDirection:"column", alignItems:"center",
                justifyContent:"center", gap:"0px",
                transition:"all 0.14s cubic-bezier(0.34,1.36,0.64,1)",
                transform: (isSelected || isHovered) ? "scale(1.08)" : "scale(1)",
                boxShadow: isSelected ? `0 4px 12px ${item.border}` : "none",
              }}>
              {item.n}
            </button>
          );
        })}
      </div>

      {/* Fixed-height label row — never shifts buttons */}
      <div style={{ height:"24px", display:"flex", alignItems:"center",
        justifyContent:"center" }}>
        {current ? (
          <span style={{
            fontSize:"11px", fontWeight:700, letterSpacing:"0.05em",
            color: current.color,
            background: current.bg,
            border:`1px solid ${current.border}`,
            borderRadius:"99px", padding:"3px 14px",
            transition:"all 0.15s",
          }}>
            {current.label}
          </span>
        ) : (
          <span style={{ fontSize:"11px", color:"rgba(140,120,60,0.45)", fontStyle:"italic" }}>
            Select a rating
          </span>
        )}
      </div>
    </div>
  );
}

/* ── Evaluation Form ── */
function EvalForm({ faculty, onClose, onSubmit }) {
  const [ratings, setRatings] = useState({});
  const [comment, setComment] = useState("");
  const [errors,  setErrors]  = useState({});
  const [done,    setDone]    = useState(false);

  const submit = () => {
    const e = {};
    evaluationCriteria.forEach(c=>{ if(!ratings[c.id]) e[c.id]=true; });
    if(comment.trim().length < 50) e.comment = true;
    if(Object.keys(e).length){ setErrors(e); return; }
    setDone(true);
    setTimeout(()=>onSubmit(faculty.id), 1500);
  };

  if(done) return (
    <div style={{ textAlign:"center", padding:"48px 0" }}>
      <div style={{ width:"72px", height:"72px", borderRadius:"50%", margin:"0 auto 18px",
        background:"rgba(30,110,62,0.10)", border:"2px solid rgba(30,110,62,0.25)",
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:"32px" }}>✓</div>
      <h3 style={{ fontSize:"20px", fontWeight:600, color:"var(--text-primary)",
        marginBottom:"10px" }}>Evaluation Submitted</h3>
      <p style={{ fontSize:"13px", color:"var(--text-second)", maxWidth:"360px",
        margin:"0 auto", lineHeight:1.7 }}>
        Your response has been recorded and will be processed at the end of the evaluation period.
      </p>
    </div>
  );

  return (
    /* CENTERED layout — max-width constrains width, not the textarea */
    <div style={{ maxWidth:"640px", margin:"0 auto", width:"100%", boxSizing:"border-box" }}>
      
      {/* UPDATED FACULTY HEADER BANNER
        Changed background to a light, pleasing tone and updated text colors 
        to dark charcoal for maximum readability.
      */}
      <div style={{ textAlign:"center", padding:"20px 24px", marginBottom:"24px",
        background:"#F9F5E8", // Light, warm background instead of dark gradient
        border: "1px solid rgba(160,120,0,0.20)", // Soft gold border
        borderRadius:"12px" }}>
        <p style={{ fontSize:"11px", fontWeight:700, letterSpacing:"0.08em",
          color:"#8A7A40", // Darkened gold for visibility
          textTransform:"uppercase", marginBottom:"4px" }}>
          Now Evaluating
        </p>
        <h3 style={{ fontFamily:"var(--font-display)", fontSize:"18px", fontWeight:700,
          color: "#1A1200", // Dark charcoal for the professor's name
          marginBottom:"4px" }}>{faculty.name}</h3>
        <p style={{ fontSize:"12px", color:"#5A4E00" }}> 
          {faculty.code} · {faculty.subject}
        </p>
      </div>

      <Card style={{ width:"100%", boxSizing:"border-box" }}>
        {evaluationCriteria.map((c, i) => (
          <div key={c.id} style={{ marginBottom:"28px", paddingBottom:"28px",
            textAlign:"center",
            borderBottom:i<evaluationCriteria.length-1?"1px solid var(--border)":"none" }}>
            <p style={{ fontSize:"11px", fontWeight:700, color:"var(--text-primary)",
              letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:"6px" }}>
              {c.category}
            </p>
            <p style={{ fontSize:"13px", color:"var(--text-second)", lineHeight:1.6,
              maxWidth:"480px", margin:"0 auto 16px" }}>{c.prompt}</p>
            <NumericalRating
              value={ratings[c.id]||0}
              onChange={v=>{setRatings(r=>({...r,[c.id]:v}));setErrors(e=>({...e,[c.id]:false}));}}/>
            {errors[c.id] && (
              <p style={{ fontSize:"11px", color:"var(--danger)", marginTop:"6px" }}>
                Please select a rating.
              </p>
            )}
          </div>
        ))}

        {/* Open-ended comment — contained inside the card, no overflow */}
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:"8px",
            justifyContent:"center", marginBottom:"8px" }}>
            <p style={{ fontSize:"11px", fontWeight:700, letterSpacing:"0.07em",
              textTransform:"uppercase", color:"var(--text-muted)" }}>
              Open-Ended Comments
            </p>
            <span style={{ fontSize:"10px", fontWeight:700, color:"var(--text-primary)",
              background:"rgba(160,120,0,0.10)", border:"1px solid rgba(160,120,0,0.25)",
              borderRadius:"4px", padding:"1px 8px", letterSpacing:"0.04em" }}>
              AI INPUT
            </span>
          </div>
          <p style={{ fontSize:"12px", color:"var(--text-muted)", marginBottom:"10px",
            lineHeight:1.6, textAlign:"center", maxWidth:"480px", margin:"0 auto 12px" }}>
            Your written comments feed the AI feedback engine. Be specific for more useful reports.
          </p>

          {/* Textarea — width 100% but inside a box-sized container */}
          <div style={{ width:"100%", boxSizing:"border-box" }}>
            <textarea
              value={comment}
              onChange={e=>{setComment(e.target.value);setErrors(er=>({...er,comment:false}));}}
              placeholder="e.g., Explains concepts clearly but pace moves fast. More worked examples in lab sessions would help…"
              rows={4}
              style={{
                width:"100%",
                boxSizing:"border-box",   /* prevents overflow beyond container */
                padding:"13px 16px",
                background:"var(--bg-input)",
                border:`1.5px solid ${errors.comment?"var(--danger)":"var(--border)"}`,
                borderRadius:"10px",
                color:"var(--text-primary)",
                fontSize:"13px", lineHeight:1.7, resize:"vertical",
                transition:"border-color 0.15s, box-shadow 0.15s",
                display:"block",
              }}
              onFocus={e=>{e.target.style.borderColor="var(--gold-border)";e.target.style.background="#FFFFFF";e.target.style.boxShadow="0 0 0 3px rgba(200,148,10,0.10)";}}
              onBlur={e=>{e.target.style.borderColor=errors.comment?"var(--danger)":"var(--border)";e.target.style.background="var(--bg-input)";e.target.style.boxShadow="none";}}
            />
            <div style={{ display:"flex", justifyContent:"space-between", marginTop:"5px" }}>
              {errors.comment
                ? <p style={{ fontSize:"11px", color:"var(--danger)" }}>Minimum 50 characters required.</p>
                : <span/>}
              <p style={{ fontSize:"11px",
                color:comment.length>=50?"var(--success)":"var(--text-muted)" }}>
                {comment.length} / 50 min
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display:"flex", gap:"10px", marginTop:"24px" }}>
          <button onClick={onClose} style={{ flex:1, padding:"12px",
            borderRadius:"var(--radius-sm)", background:"transparent",
            border:"1.5px solid var(--border)", color:"var(--text-second)",
            fontSize:"13px", fontWeight:600, cursor:"pointer" }}>
            Cancel
          </button>
          <button onClick={submit} style={{ flex:2, padding:"12px",
            borderRadius:"var(--radius-sm)",
            background:"var(--charcoal)", color:"#F2B800",
            fontSize:"13px", fontWeight:700, border:"none", cursor:"pointer",
            transition:"all 0.15s",
            boxShadow:"0 2px 8px rgba(0,0,0,0.25)" }}
            onMouseEnter={e=>{e.currentTarget.style.background="var(--charcoal-light)";e.currentTarget.style.transform="translateY(-1px)";}}
            onMouseLeave={e=>{e.currentTarget.style.background="var(--charcoal)";e.currentTarget.style.transform="translateY(0)";}}>
            Submit Evaluation →
          </button>
        </div>
        <p style={{ textAlign:"center", marginTop:"10px", fontSize:"11px",
          color:"var(--text-muted)" }}>
          🔒 Your identity is never linked to your comments in AI-generated reports.
        </p>
      </Card>
    </div>
  );
}

/* ── Main Component ── */
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

  /* ── Evaluate tab ── */
  if(activeTab==="evaluate") {
    if(selected) return (
      <div className="anim-fade-in">
        <button onClick={()=>setSelected(null)}
          style={{ display:"flex", alignItems:"center", gap:"6px",
            color:"var(--text-second)", fontSize:"13px", marginBottom:"20px",
            background:"none", border:"none", cursor:"pointer", fontWeight:600 }}>
          <svg width="16" height="16" fill="none" stroke="currentColor"
            strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to faculty list
        </button>
        <EvalForm faculty={selected} onClose={()=>setSelected(null)} onSubmit={onSubmit}/>
      </div>
    );

    return (
      <div className="anim-fade-up">
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
          marginBottom:"20px", flexWrap:"wrap", gap:"10px" }}>
          <div>
            <h2 style={{ fontFamily:"var(--font-display)", fontSize:"22px", fontWeight:600,
              color:"var(--text-primary)", marginBottom:"2px" }}>Faculty Roster</h2>
            <p style={{ fontSize:"12px", color:"var(--text-muted)" }}>
              {sorted.filter(f=>!submitted.has(f.id)).length} evaluations remaining · {SEMESTER}
            </p>
          </div>
          <div style={{ display:"inline-flex", alignItems:"center", gap:"6px",
            padding:"6px 14px", background:"#FFFFFF",
            border:"1px solid var(--border)", borderRadius:"var(--radius-pill)",
            boxShadow:"var(--shadow-xs)" }}>
            <span style={{ width:"6px", height:"6px", borderRadius:"50%",
              background:"var(--success)" }}/>
            <span style={{ fontSize:"11px", fontWeight:700,
              color:"var(--text-primary)" }}>CEAFA · BSCS 3G</span>
          </div>
        </div>

        <div className="card-list">
          {sorted.map(f => {
            const done = submitted.has(f.id);
            return (
              <div key={f.id} style={{ display:"flex", alignItems:"center", gap:"14px",
                padding:"16px 20px", background:"#FFFFFF",
                border:`1px solid ${done?"var(--border)":"rgba(160,120,0,0.15)"}`,
                borderRadius:"12px",
                boxShadow: done?"none":"var(--shadow-xs)",
                opacity:done?0.60:1, transition:"all 0.2s" }}>
                <div style={{ width:"42px", height:"42px", borderRadius:"11px", flexShrink:0,
                  background: done ? "var(--bg-elevated)"
                    : "linear-gradient(135deg,#2C2000,#1C1400)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontFamily:"var(--font-display)", fontSize:"16px",
                  color:done?"var(--text-muted)":"#F2B800", fontWeight:700 }}>
                  {f.name.split(" ").slice(-1)[0][0]}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontWeight:600, fontSize:"14px", color:"var(--text-primary)",
                    marginBottom:"2px", whiteSpace:"nowrap", overflow:"hidden",
                    textOverflow:"ellipsis" }}>{f.name}</p>
                  <p style={{ fontSize:"12px", color:"var(--text-muted)",
                    whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                    {f.code} · {f.subject}
                  </p>
                </div>
                {done ? (
                  <span style={{ fontSize:"11px", fontWeight:700, color:"var(--success)",
                    background:"var(--success-dim)", border:"1px solid var(--success-border)",
                    borderRadius:"99px", padding:"5px 14px",
                    flexShrink:0, whiteSpace:"nowrap" }}>✓ Submitted</span>
                ) : (
                  <button onClick={()=>setSelected(f)} style={{
                    padding:"8px 18px", borderRadius:"var(--radius-sm)", flexShrink:0,
                    background:"transparent",
                    border:"1.5px solid var(--charcoal)", color:"var(--charcoal)",
                    fontSize:"12px", fontWeight:700, whiteSpace:"nowrap",
                    cursor:"pointer", transition:"all 0.15s" }}
                    onMouseEnter={e=>{e.currentTarget.style.background="var(--charcoal)";e.currentTarget.style.color="#F2B800";}}
                    onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color="var(--charcoal)";}}>
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

  /* ── History tab ── */
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
            border:"1px solid var(--border)", borderRadius:"14px" }}>
            <div style={{ fontSize:"40px", marginBottom:"12px" }}>📋</div>
            <p style={{ color:"var(--text-second)", fontSize:"14px",
              fontWeight:600, marginBottom:"4px" }}>No evaluations submitted yet</p>
            <p style={{ color:"var(--text-muted)", fontSize:"12px" }}>
              Head to Evaluate Faculty to get started.
            </p>
          </div>
        ) : (
          <div className="card-list">
            {studentSubmissions.map((s,i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:"16px",
                padding:"16px 22px", background:"#FFFFFF",
                border:"1px solid var(--border)", borderRadius:"12px",
                boxShadow:"var(--shadow-xs)" }}>
                <div style={{ flex:1 }}>
                  <p style={{ fontWeight:600, fontSize:"14px", marginBottom:"2px" }}>{s.facultyName}</p>
                  <p style={{ fontSize:"12px", color:"var(--text-muted)" }}>
                    {s.subject} · Submitted {s.submittedAt}
                  </p>
                </div>
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  <p style={{ fontFamily:"var(--font-display)", fontSize:"26px",
                    fontWeight:600, color:"var(--gold-darker)", lineHeight:1 }}>{s.avg.toFixed(1)}</p>
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