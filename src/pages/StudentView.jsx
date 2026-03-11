import { useState } from "react";
import { facultyList, evaluationCriteria, studentSubmissions, SEMESTER } from "../data/mockData.js";

function Card({ children, style={} }) {
  return (
    <div style={{ background:"var(--bg-surface)", border:"1px solid var(--border)",
      borderRadius:"var(--radius-md)", padding:"20px", boxShadow:"var(--shadow-sm)", ...style }}>
      {children}
    </div>
  );
}

function StarRating({ value, onChange }) {
  const [hover, setHover] = useState(0);
  const labels = ["","Poor","Below Average","Satisfactory","Good","Excellent"];
  return (
    <div style={{ display:"flex", alignItems:"center", gap:"3px", flexWrap:"wrap" }}>
      {[1,2,3,4,5].map(n => (
        <button key={n} type="button" onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)}
          style={{ background:"none", border:"none", padding:"2px", fontSize:"24px", lineHeight:1,
            cursor:"pointer", color: n<=(hover||value) ? "var(--amber)" : "var(--border)",
            transform: hover===n ? "scale(1.2)" : "scale(1)",
            transition:"color 0.12s, transform 0.12s" }}>★</button>
      ))}
      {(hover||value) > 0 && (
        <span style={{ fontSize:"12px", color:"var(--amber)", fontWeight:600, marginLeft:"6px" }}>
          {labels[hover||value]}
        </span>
      )}
    </div>
  );
}

function EvalForm({ faculty, onClose, onSubmit }) {
  const [ratings, setRatings] = useState({});
  const [comment, setComment] = useState("");
  const [errors,  setErrors]  = useState({});
  const [done,    setDone]    = useState(false);

  const submit = () => {
    const e = {};
    evaluationCriteria.forEach(c => { if (!ratings[c.id]) e[c.id] = true; });
    if (comment.trim().length < 20) e.comment = true;
    if (Object.keys(e).length) { setErrors(e); return; }
    setDone(true);
    setTimeout(() => onSubmit(faculty.id), 1500);
  };

  if (done) return (
    <div style={{ textAlign:"center", padding:"44px 0" }}>
      <div style={{ fontSize:"52px", marginBottom:"14px" }}>✅</div>
      <h3 style={{ fontSize:"18px", fontWeight:600, marginBottom:"8px" }}>Evaluation Submitted</h3>
      <p style={{ fontSize:"13px", color:"var(--text-second)", maxWidth:"340px", margin:"0 auto", lineHeight:1.7 }}>
        Thank you. Your response has been recorded and will be processed at the end of the evaluation period.
      </p>
    </div>
  );

  return (
    <div>
      {/* Faculty tag */}
      <div style={{ padding:"12px 16px", background:"var(--amber-dim)",
        border:"1px solid var(--amber-border)", borderRadius:"var(--radius-sm)", marginBottom:"22px" }}>
        <p style={{ fontWeight:700, marginBottom:"2px" }}>{faculty.name}</p>
        <p style={{ fontSize:"12px", color:"var(--text-second)" }}>{faculty.code} · {faculty.subject}</p>
      </div>

      {/* Criteria */}
      {evaluationCriteria.map((c, i) => (
        <div key={c.id} style={{ marginBottom:"18px", paddingBottom:"18px",
          borderBottom: i < evaluationCriteria.length-1 ? "1px solid var(--border)" : "none" }}>
          <p style={{ fontSize:"10px", fontWeight:700, color:"var(--amber)", letterSpacing:"0.06em",
            textTransform:"uppercase", marginBottom:"4px" }}>{c.category}</p>
          <p style={{ fontSize:"13px", color:"var(--text-second)", marginBottom:"10px", lineHeight:1.6 }}>
            {c.prompt}
          </p>
          <StarRating
            value={ratings[c.id]||0}
            onChange={v => { setRatings(r=>({...r,[c.id]:v})); setErrors(e=>({...e,[c.id]:false})); }}
          />
          {errors[c.id] && <p style={{ fontSize:"11px", color:"var(--danger)", marginTop:"4px" }}>Please select a rating.</p>}
        </div>
      ))}

      {/* Open-ended comment */}
      <div style={{ marginBottom:"20px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"6px", flexWrap:"wrap" }}>
          <p style={{ fontSize:"11px", fontWeight:700, letterSpacing:"0.06em",
            textTransform:"uppercase", color:"var(--text-muted)" }}>Open-Ended Comments</p>
          <span style={{ fontSize:"10px", fontWeight:700, color:"var(--amber)",
            background:"var(--amber-dim)", border:"1px solid var(--amber-border)",
            borderRadius:"4px", padding:"1px 8px" }}>AI INPUT</span>
        </div>
        <p style={{ fontSize:"12px", color:"var(--text-muted)", marginBottom:"10px", lineHeight:1.6 }}>
          Your written comments feed the AI feedback engine. Be specific — the more detail, the more useful the report.
        </p>
        <textarea
          value={comment}
          onChange={e => { setComment(e.target.value); setErrors(er=>({...er,comment:false})); }}
          placeholder="e.g., 'Explains concepts clearly but the pace moves fast. More worked examples in lab sessions would help...'"
          rows={4}
          style={{ width:"100%", padding:"12px 14px", background:"var(--bg-input)",
            border:`1px solid ${errors.comment?"var(--danger)":"var(--border)"}`,
            borderRadius:"var(--radius-sm)", color:"var(--text-primary)",
            fontSize:"13px", lineHeight:1.6, resize:"vertical", transition:"border-color 0.15s" }}
          onFocus={e => (e.target.style.borderColor="var(--border-focus)")}
          onBlur={e  => (e.target.style.borderColor=errors.comment?"var(--danger)":"var(--border)")}
        />
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:"5px" }}>
          {errors.comment
            ? <p style={{ fontSize:"11px", color:"var(--danger)" }}>Minimum 20 characters required.</p>
            : <span/>}
          <p style={{ fontSize:"11px", color: comment.length>=20?"var(--success)":"var(--text-muted)" }}>
            {comment.length} chars
          </p>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display:"flex", gap:"10px" }}>
        <button onClick={onClose} style={{ flex:1, padding:"11px", borderRadius:"var(--radius-sm)",
          background:"transparent", border:"1px solid var(--border)",
          color:"var(--text-second)", fontSize:"13px", fontWeight:600, cursor:"pointer" }}>
          Cancel
        </button>
        <button onClick={submit} style={{ flex:2, padding:"11px", borderRadius:"var(--radius-sm)",
          background:"var(--amber)", color:"#0D0B06", fontSize:"13px", fontWeight:700, border:"none", cursor:"pointer" }}
          onMouseEnter={e=>(e.currentTarget.style.background="var(--amber-hover)")}
          onMouseLeave={e=>(e.currentTarget.style.background="var(--amber)")}>
          Submit Evaluation →
        </button>
      </div>
      <p style={{ textAlign:"center", marginTop:"10px", fontSize:"11px", color:"var(--text-muted)" }}>
        🔒 Your identity is never linked to your comments in AI-generated reports.
      </p>
    </div>
  );
}

/* ── Main Component ─────────────────────────────────────── */
export default function StudentView({ activeTab }) {
  const [selected,  setSelected]  = useState(null);
  const [submitted, setSubmitted] = useState(new Set(studentSubmissions.map(s=>s.facultyId)));

  const onSubmit = (fid) => {
    setSubmitted(p => new Set([...p, fid]));
    setTimeout(() => setSelected(null), 600);
  };

  // Pending FIRST, submitted last — dimmed
  const sorted = [...facultyList].sort((a, b) =>
    (submitted.has(a.id) ? 1 : 0) - (submitted.has(b.id) ? 1 : 0)
  );

  /* ── Evaluate tab ───────────────────────────────────── */
  if (activeTab === "evaluate") {
    if (selected) {
      return (
        <div className="anim-fade-in" style={{ maxWidth:"660px" }}>
          <button onClick={()=>setSelected(null)} style={{ display:"flex", alignItems:"center", gap:"6px",
            color:"var(--text-second)", fontSize:"13px", marginBottom:"18px",
            background:"none", border:"none", cursor:"pointer" }}>
            ← Back to faculty list
          </button>
          <Card>
            <EvalForm faculty={selected} onClose={()=>setSelected(null)} onSubmit={onSubmit}/>
          </Card>
        </div>
      );
    }

    return (
      <div className="anim-fade-up">
        {/* Info bar — no dept filter (student is in one dept only) */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
          marginBottom:"16px", flexWrap:"wrap", gap:"8px" }}>
          <p style={{ fontSize:"12px", color:"var(--text-muted)" }}>
            {sorted.filter(f=>!submitted.has(f.id)).length} evaluation{sorted.filter(f=>!submitted.has(f.id)).length!==1?"s":""} remaining · {SEMESTER}
          </p>
          <span style={{ fontSize:"11px", fontWeight:700, color:"var(--text-muted)",
            background:"var(--bg-elevated)", border:"1px solid var(--border)",
            borderRadius:"99px", padding:"3px 10px" }}>CEAFA · BSCS 3G</span>
        </div>

        <div className="card-list">
          {sorted.map(f => {
            const done = submitted.has(f.id);
            return (
              <Card key={f.id} style={{ display:"flex", alignItems:"center", gap:"14px",
                padding:"14px 18px", opacity:done?0.55:1, transition:"opacity 0.2s" }}>
                {/* Avatar */}
                <div style={{ width:"38px", height:"38px", borderRadius:"10px", flexShrink:0,
                  background:"var(--amber-dim)", border:"1px solid var(--amber-border)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontFamily:"var(--font-display)", fontSize:"15px",
                  color:"var(--amber)", fontWeight:700 }}>
                  {f.name.split(" ").slice(-1)[0][0]}
                </div>
                {/* Info */}
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontWeight:600, fontSize:"14px", marginBottom:"2px",
                    whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{f.name}</p>
                  <p style={{ fontSize:"12px", color:"var(--text-second)",
                    whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                    {f.code} · {f.subject}
                  </p>
                </div>
                {/* Action */}
                {done ? (
                  <span style={{ fontSize:"11px", fontWeight:700, color:"var(--success)",
                    background:"var(--success-dim)", border:"1px solid rgba(76,175,111,0.22)",
                    borderRadius:"99px", padding:"5px 13px", flexShrink:0, whiteSpace:"nowrap" }}>
                    Submitted ✓
                  </span>
                ) : (
                  <button onClick={() => setSelected(f)} style={{
                    padding:"7px 16px", borderRadius:"var(--radius-sm)", flexShrink:0,
                    background:"transparent", border:"1.5px solid var(--amber)",
                    color:"var(--amber)", fontSize:"12px", fontWeight:700,
                    whiteSpace:"nowrap", cursor:"pointer", transition:"all 0.15s",
                  }}
                    onMouseEnter={e=>{ e.currentTarget.style.background="var(--amber)"; e.currentTarget.style.color="#0D0B06"; }}
                    onMouseLeave={e=>{ e.currentTarget.style.background="transparent"; e.currentTarget.style.color="var(--amber)"; }}>
                    Evaluate
                  </button>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  /* ── My Submissions tab ─────────────────────────────── */
  if (activeTab === "history") {
    const subs = [...submitted];
    return (
      <div className="anim-fade-up">
        <p style={{ fontSize:"11px", fontWeight:700, letterSpacing:"0.07em",
          textTransform:"uppercase", color:"var(--text-muted)", marginBottom:"16px" }}>
          Submitted Evaluations — {SEMESTER}
        </p>

        {subs.length === 0 ? (
          <Card>
            <div style={{ textAlign:"center", padding:"28px 0" }}>
              <p style={{ fontSize:"36px", marginBottom:"12px" }}>📋</p>
              <p style={{ color:"var(--text-muted)", fontSize:"14px", marginBottom:"4px" }}>No evaluations submitted yet.</p>
              <p style={{ color:"var(--text-muted)", fontSize:"12px" }}>Head to Evaluate Faculty to get started.</p>
            </div>
          </Card>
        ) : (
          <div className="card-list">
            {studentSubmissions.map((s, i) => (
              <Card key={i} style={{ display:"flex", alignItems:"center", gap:"16px", padding:"16px 20px" }}>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontWeight:600, fontSize:"13px", marginBottom:"2px" }}>{s.facultyName}</p>
                  <p style={{ fontSize:"12px", color:"var(--text-second)" }}>{s.subject} · Submitted {s.submittedAt}</p>
                </div>
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  <p style={{ fontFamily:"var(--font-display)", fontSize:"24px", fontWeight:600, color:"var(--amber)", lineHeight:1 }}>{s.avg.toFixed(1)}</p>
                  <p style={{ fontSize:"10px", color:"var(--text-muted)", marginTop:"2px" }}>avg rating</p>
                </div>
              </Card>
            ))}
          </div>
        )}

        <p style={{ fontSize:"12px", color:"var(--text-muted)", marginTop:"14px" }}>
          {subs.length} of {facultyList.length} evaluations submitted this semester.
        </p>
      </div>
    );
  }

  return null;
}