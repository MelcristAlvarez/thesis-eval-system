/**
 * StudentView.jsx
 * Student role — browse faculty to evaluate, submit form, view history.
 */

import { useState } from "react";
import { facultyList, evaluationCriteria, studentSubmissions, SEMESTER } from "../data/mockData.js";

/* ── Shared tiny helpers ─────────────────────────────────── */
function SectionLabel({ children }) {
  return (
    <p style={{ fontSize:"11px", fontWeight:700, letterSpacing:"0.07em",
      textTransform:"uppercase", color:"var(--text-muted)", marginBottom:"14px" }}>
      {children}
    </p>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{ background:"var(--bg-surface)", border:"1px solid var(--border)",
      borderRadius:"var(--radius-md)", padding:"22px", boxShadow:"var(--shadow-sm)", ...style }}>
      {children}
    </div>
  );
}

/* ── Star rating input ───────────────────────────────────── */
function StarInput({ value, onChange }) {
  const [hover, setHover] = useState(0);
  const labels = ["","Poor","Below Average","Satisfactory","Good","Excellent"];
  return (
    <div style={{ display:"flex", alignItems:"center", gap:"4px" }}>
      {[1,2,3,4,5].map(n => (
        <button key={n} type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)}
          style={{ background:"none", border:"none", padding:"2px", fontSize:"22px", lineHeight:1,
            cursor:"pointer", color: n<=(hover||value) ? "var(--amber)" : "var(--border)",
            transform: hover===n ? "scale(1.2)" : "scale(1)",
            transition:"color 0.12s, transform 0.12s" }}>
          ★
        </button>
      ))}
      {(hover||value) > 0 && (
        <span style={{ fontSize:"12px", color:"var(--amber)", fontWeight:600, marginLeft:"6px" }}>
          {labels[hover||value]}
        </span>
      )}
    </div>
  );
}

/* ── Evaluation form (inline) ────────────────────────────── */
function EvalForm({ faculty, onClose, onSubmit }) {
  const [ratings, setRatings]   = useState({});
  const [comment, setComment]   = useState("");
  const [errors, setErrors]     = useState({});
  const [done, setDone]         = useState(false);

  const handleSubmit = () => {
    const e = {};
    evaluationCriteria.forEach(c => { if (!ratings[c.id]) e[c.id] = true; });
    if (comment.trim().length < 20) e.comment = true;
    if (Object.keys(e).length) { setErrors(e); return; }
    setDone(true);
    setTimeout(() => onSubmit(faculty.id), 1400);
  };

  if (done) return (
    <div style={{ textAlign:"center", padding:"40px 0" }}>
      <div style={{ fontSize:"48px", marginBottom:"16px" }}>✅</div>
      <h3 style={{ fontSize:"18px", fontWeight:600, marginBottom:"8px" }}>Evaluation Submitted</h3>
      <p style={{ fontSize:"13px", color:"var(--text-second)" }}>
        Thank you. Your response has been recorded and will be processed at end of evaluation period.
      </p>
    </div>
  );

  return (
    <div>
      {/* Faculty header inside form */}
      <div style={{ padding:"16px 20px", background:"var(--amber-dim)", borderRadius:"var(--radius-sm)",
        border:"1px solid var(--amber-border)", marginBottom:"22px" }}>
        <p style={{ fontWeight:700, color:"var(--text-primary)", marginBottom:"2px" }}>{faculty.name}</p>
        <p style={{ fontSize:"12px", color:"var(--text-second)" }}>{faculty.code} · {faculty.subject}</p>
      </div>

      {/* Criteria */}
      {evaluationCriteria.map((c, i) => (
        <div key={c.id} style={{ marginBottom:"20px", paddingBottom:"20px",
          borderBottom: i<evaluationCriteria.length-1 ? "1px solid var(--border)" : "none" }}>
          <p style={{ fontSize:"10px", fontWeight:700, color:"var(--amber)", letterSpacing:"0.06em",
            textTransform:"uppercase", marginBottom:"5px" }}>{c.category}</p>
          <p style={{ fontSize:"13px", color:"var(--text-second)", marginBottom:"10px", lineHeight:1.6 }}>{c.prompt}</p>
          <StarInput value={ratings[c.id]||0} onChange={v => { setRatings(r=>({...r,[c.id]:v})); setErrors(e=>({...e,[c.id]:false})); }} />
          {errors[c.id] && <p style={{ fontSize:"11px", color:"var(--danger)", marginTop:"4px" }}>Please select a rating.</p>}
        </div>
      ))}

      {/* Comment */}
      <div style={{ marginBottom:"20px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"6px" }}>
          <p style={{ fontSize:"11px", fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase", color:"var(--text-muted)" }}>
            Open-Ended Comments
          </p>
          <span style={{ fontSize:"10px", fontWeight:700, color:"var(--amber)", background:"var(--amber-dim)",
            border:"1px solid var(--amber-border)", borderRadius:"4px", padding:"1px 7px" }}>AI INPUT</span>
        </div>
        <p style={{ fontSize:"12px", color:"var(--text-muted)", marginBottom:"10px", lineHeight:1.6 }}>
          Your written comments are analyzed by the AI engine to generate structured, evidence-based feedback for this faculty member.
          Please be specific — the more detail you provide, the more useful the output.
        </p>
        <textarea value={comment} onChange={e => { setComment(e.target.value); setErrors(er=>({...er,comment:false})); }}
          placeholder="e.g., 'The professor explains concepts clearly but the pace of derivations is fast. Having more worked examples would really help...'"
          rows={4}
          style={{ width:"100%", padding:"12px 14px", background:"var(--bg-input)", border:`1px solid ${errors.comment?"var(--danger)":"var(--border)"}`,
            borderRadius:"var(--radius-sm)", color:"var(--text-primary)", fontSize:"13px", lineHeight:1.6,
            resize:"vertical", transition:"border-color 0.15s" }}
          onFocus={e => (e.target.style.borderColor="var(--border-focus)")}
          onBlur={e => (e.target.style.borderColor=errors.comment?"var(--danger)":"var(--border)")}
        />
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:"5px" }}>
          {errors.comment && <p style={{ fontSize:"11px", color:"var(--danger)" }}>Minimum 20 characters required.</p>}
          <p style={{ fontSize:"11px", color:comment.length>=20?"var(--success)":"var(--text-muted)", marginLeft:"auto" }}>
            {comment.length} chars
          </p>
        </div>
      </div>

      <div style={{ display:"flex", gap:"10px" }}>
        <button onClick={onClose}
          style={{ flex:1, padding:"11px", borderRadius:"var(--radius-sm)", background:"transparent",
            border:"1px solid var(--border)", color:"var(--text-second)", fontSize:"13px", fontWeight:600 }}>
          Cancel
        </button>
        <button onClick={handleSubmit}
          style={{ flex:2, padding:"11px", borderRadius:"var(--radius-sm)", background:"var(--amber)",
            color:"#0A0906", fontSize:"13px", fontWeight:700, border:"none" }}
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

/* ── Main student view ───────────────────────────────────── */
export default function StudentView() {
  const [tab, setTab]               = useState("evaluate");
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [submitted, setSubmitted]   = useState(new Set(studentSubmissions.map(s=>s.facultyId)));
  const [deptFilter, setDeptFilter] = useState("ALL");

  const handleSubmit = (fid) => {
    setSubmitted(prev => new Set([...prev, fid]));
    setTimeout(() => setSelectedFaculty(null), 500);
  };

  const depts = ["ALL","CASE","CEAFA","CBMA","CHS"];
  const filtered = facultyList.filter(f => deptFilter==="ALL" || f.dept===deptFilter);

  return (
    <div className="anim-fade-up">
      {/* Tabs */}
      <div style={{ display:"flex", gap:"6px", marginBottom:"24px" }}>
        {[{k:"evaluate",l:"Evaluate Faculty"},{k:"history",l:"My Submissions"}].map(t=>(
          <button key={t.k} onClick={()=>setTab(t.k)}
            style={{ padding:"8px 18px", borderRadius:"var(--radius-sm)", fontSize:"13px", fontWeight:700,
              background: tab===t.k ? "var(--amber)" : "var(--bg-elevated)",
              color: tab===t.k ? "#0A0906" : "var(--text-second)",
              border: tab===t.k ? "none" : "1px solid var(--border)" }}>
            {t.l}
          </button>
        ))}
      </div>

      {/* ── Evaluate tab ── */}
      {tab==="evaluate" && !selectedFaculty && (
        <div className="anim-fade-in">
          <div style={{ display:"flex", gap:"8px", marginBottom:"20px", flexWrap:"wrap" }}>
            <p style={{ fontSize:"13px", color:"var(--text-second)", marginRight:"4px", alignSelf:"center" }}>Filter:</p>
            {depts.map(d=>(
              <button key={d} onClick={()=>setDeptFilter(d)}
                style={{ padding:"5px 14px", borderRadius:"99px", fontSize:"12px", fontWeight:600,
                  background: deptFilter===d ? "var(--amber-dim)" : "transparent",
                  color: deptFilter===d ? "var(--amber)" : "var(--text-muted)",
                  border: `1px solid ${deptFilter===d?"var(--amber-border)":"var(--border)"}` }}>
                {d}
              </button>
            ))}
          </div>

          <div style={{ display:"grid", gap:"12px" }}>
            {filtered.map(f => {
              const done = submitted.has(f.id);
              return (
                <Card key={f.id} style={{ display:"flex", alignItems:"center", gap:"16px", padding:"18px 22px" }}>
                  <div style={{ width:"40px", height:"40px", borderRadius:"10px", background:"var(--amber-dim)",
                    border:"1px solid var(--amber-border)", display:"flex", alignItems:"center",
                    justifyContent:"center", fontFamily:"var(--font-display)", fontSize:"16px",
                    color:"var(--amber)", fontWeight:700, flexShrink:0 }}>
                    {f.name.split(" ").pop()[0]}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontWeight:600, fontSize:"14px", marginBottom:"2px",
                      whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{f.name}</p>
                    <p style={{ fontSize:"12px", color:"var(--text-second)" }}>
                      {f.dept} · {f.code} · {f.subject}
                    </p>
                  </div>
                  {done ? (
                    <span style={{ fontSize:"11px", fontWeight:700, color:"var(--success)",
                      background:"var(--success-dim)", border:"1px solid rgba(34,197,94,0.20)",
                      borderRadius:"99px", padding:"4px 12px" }}>Submitted ✓</span>
                  ) : (
                    <button onClick={()=>setSelectedFaculty(f)}
                      style={{ padding:"7px 18px", borderRadius:"var(--radius-sm)", background:"var(--amber)",
                        color:"#0A0906", fontSize:"12px", fontWeight:700, border:"none", flexShrink:0 }}
                      onMouseEnter={e=>(e.currentTarget.style.background="var(--amber-hover)")}
                      onMouseLeave={e=>(e.currentTarget.style.background="var(--amber)")}>
                      Evaluate
                    </button>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Evaluation form ── */}
      {tab==="evaluate" && selectedFaculty && (
        <div className="anim-fade-in" style={{ maxWidth:"660px" }}>
          <button onClick={()=>setSelectedFaculty(null)}
            style={{ display:"flex", alignItems:"center", gap:"6px", color:"var(--text-second)",
              fontSize:"13px", marginBottom:"20px", background:"none", border:"none", cursor:"pointer" }}>
            ← Back to faculty list
          </button>
          <Card>
            <EvalForm faculty={selectedFaculty} onClose={()=>setSelectedFaculty(null)} onSubmit={handleSubmit} />
          </Card>
        </div>
      )}

      {/* ── History tab ── */}
      {tab==="history" && (
        <div className="anim-fade-in">
          <SectionLabel>Submitted Evaluations — {SEMESTER}</SectionLabel>
          {studentSubmissions.length === 0 ? (
            <p style={{ color:"var(--text-muted)", fontSize:"13px" }}>No submissions yet.</p>
          ) : (
            <div style={{ display:"grid", gap:"10px" }}>
              {studentSubmissions.map((s,i)=>(
                <Card key={i} style={{ display:"flex", alignItems:"center", gap:"16px", padding:"16px 20px" }}>
                  <div style={{ flex:1 }}>
                    <p style={{ fontWeight:600, fontSize:"13px", marginBottom:"2px" }}>{s.facultyName}</p>
                    <p style={{ fontSize:"12px", color:"var(--text-second)" }}>{s.subject} · Submitted {s.submittedAt}</p>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <p style={{ fontFamily:"var(--font-display)", fontSize:"22px", fontWeight:600,
                      color:"var(--amber)" }}>{s.avg.toFixed(1)}</p>
                    <p style={{ fontSize:"10px", color:"var(--text-muted)" }}>Your avg. rating</p>
                  </div>
                </Card>
              ))}
            </div>
          )}
          <p style={{ fontSize:"12px", color:"var(--text-muted)", marginTop:"16px" }}>
            You have {[...submitted].length} of {facultyList.length} faculty evaluations submitted.
          </p>
        </div>
      )}
    </div>
  );
}
