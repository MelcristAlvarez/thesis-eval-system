/**
 * ChairView.jsx
 * Program Chairperson role — department overview, submit chair evaluation,
 * and review AI-generated explainable feedback.
 */

import { useState } from "react";
import { facultyList, evaluationCriteria, aiFeedbackMap, SEMESTER } from "../data/mockData.js";

/* ── Shared helpers ────────────────────────────────────── */
function Card({ children, style = {} }) {
  return (
    <div style={{ background:"var(--bg-surface)", border:"1px solid var(--border)",
      borderRadius:"var(--radius-md)", padding:"22px", boxShadow:"var(--shadow-sm)", ...style }}>
      {children}
    </div>
  );
}

function ScoreBar({ score, max=5 }) {
  return (
    <div style={{ width:"100%", height:"5px", background:"var(--border)", borderRadius:"99px", overflow:"hidden" }}>
      <div style={{ width:`${(score/max)*100}%`, height:"100%", background:"var(--amber)",
        borderRadius:"99px", transition:"width 0.7s ease" }} />
    </div>
  );
}

function TabBtn({ label, active, onClick }) {
  return (
    <button onClick={onClick}
      style={{ padding:"8px 18px", borderRadius:"var(--radius-sm)", fontSize:"13px", fontWeight:700,
        background: active ? "var(--amber)" : "var(--bg-elevated)",
        color: active ? "#0A0906" : "var(--text-second)",
        border: active ? "none" : "1px solid var(--border)" }}>
      {label}
    </button>
  );
}

/* ── Status label (text only, no rainbow) ─────────────── */
function StatusText({ status }) {
  const map = {
    excellent:    { label:"Excellent",     color:"var(--success)" },
    good:         { label:"Good",          color:"var(--amber)"   },
    average:      { label:"Average",       color:"var(--text-second)" },
    needsSupport: { label:"Needs Support", color:"var(--danger)"  },
  };
  const s = map[status] || map.average;
  return <span style={{ fontSize:"12px", fontWeight:700, color:s.color }}>{s.label}</span>;
}

/* ── Star rating input ─────────────────────────────────── */
function StarInput({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display:"flex", gap:"4px" }}>
      {[1,2,3,4,5].map(n => (
        <button key={n} type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)}
          style={{ background:"none", border:"none", fontSize:"22px", lineHeight:1,
            cursor:"pointer", color:n<=(hover||value)?"var(--amber)":"var(--border)",
            transform:hover===n?"scale(1.2)":"scale(1)", transition:"color 0.12s, transform 0.12s" }}>
          ★
        </button>
      ))}
    </div>
  );
}

/* ── Overview tab ────────────────────────────────────────── */
function Overview() {
  const deptFaculty = facultyList; // Chair sees all (in real system, filtered by dept)
  const avg = (deptFaculty.reduce((s,f)=>s+f.compositeScore,0)/deptFaculty.length).toFixed(2);
  const pending = deptFaculty.filter(f=>!f.chairEvaluated).length;

  return (
    <div className="anim-fade-in">
      {/* KPI row */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"14px", marginBottom:"22px" }}>
        {[
          { label:"Total Faculty",        value:deptFaculty.length,             sub:"in system"          },
          { label:"Dept. Average Score",  value:avg,                            sub:"composite score"    },
          { label:"Pending Chair Evals",  value:pending,                        sub:"awaiting your input"},
        ].map((k,i)=>(
          <Card key={i}>
            <p style={{ fontSize:"11px", fontWeight:700, letterSpacing:"0.07em", textTransform:"uppercase",
              color:"var(--text-muted)", marginBottom:"10px" }}>{k.label}</p>
            <p style={{ fontFamily:"var(--font-display)", fontSize:"30px", fontWeight:600,
              color:"var(--amber)", lineHeight:1, marginBottom:"4px" }}>{k.value}</p>
            <p style={{ fontSize:"12px", color:"var(--text-muted)" }}>{k.sub}</p>
          </Card>
        ))}
      </div>

      {/* Faculty table */}
      <Card style={{ padding:0, overflow:"hidden" }}>
        <div style={{ padding:"16px 22px", borderBottom:"1px solid var(--border)" }}>
          <h3 style={{ fontSize:"15px", fontWeight:600 }}>Faculty Summary</h3>
          <p style={{ fontSize:"12px", color:"var(--text-second)", marginTop:"2px" }}>{SEMESTER}</p>
        </div>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:"var(--bg-elevated)" }}>
                {["Faculty","Dept","Subject","Student Score","Chair Score","Composite","Status","Chair Eval"].map(h=>(
                  <th key={h} style={{ padding:"10px 16px", textAlign:"left", fontSize:"10px", fontWeight:700,
                    letterSpacing:"0.06em", textTransform:"uppercase", color:"var(--text-muted)",
                    borderBottom:"1px solid var(--border)", whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {deptFaculty.map((f,i)=>(
                <tr key={f.id}
                  style={{ borderBottom:i<deptFaculty.length-1?"1px solid var(--border)":"none", transition:"background 0.12s" }}
                  onMouseEnter={e=>(e.currentTarget.style.background="var(--bg-elevated)")}
                  onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                  <td style={{ padding:"13px 16px" }}>
                    <p style={{ fontSize:"13px", fontWeight:600 }}>{f.name}</p>
                    <p style={{ fontSize:"11px", color:"var(--text-muted)" }}>{f.responses} responses</p>
                  </td>
                  <td style={{ padding:"13px 16px", fontSize:"12px", color:"var(--text-second)" }}>{f.dept}</td>
                  <td style={{ padding:"13px 16px" }}>
                    <p style={{ fontSize:"12px" }}>{f.subject}</p>
                    <p style={{ fontSize:"11px", color:"var(--text-muted)" }}>{f.code}</p>
                  </td>
                  <td style={{ padding:"13px 16px", fontFamily:"var(--font-display)", fontSize:"16px", fontWeight:600, color:"var(--text-primary)" }}>
                    {f.studentScore.toFixed(2)}
                  </td>
                  <td style={{ padding:"13px 16px", fontFamily:"var(--font-display)", fontSize:"16px", fontWeight:600, color:"var(--text-primary)" }}>
                    {f.chairEvaluated ? f.chairScore.toFixed(2) : <span style={{ color:"var(--text-muted)", fontSize:"12px" }}>—</span>}
                  </td>
                  <td style={{ padding:"13px 16px", minWidth:"120px" }}>
                    <p style={{ fontFamily:"var(--font-display)", fontSize:"18px", fontWeight:600, color:"var(--amber)", marginBottom:"5px" }}>
                      {f.compositeScore.toFixed(2)}
                    </p>
                    <ScoreBar score={f.compositeScore} />
                  </td>
                  <td style={{ padding:"13px 16px" }}><StatusText status={f.status} /></td>
                  <td style={{ padding:"13px 16px" }}>
                    {f.chairEvaluated
                      ? <span style={{ fontSize:"11px", color:"var(--success)", fontWeight:700 }}>Done ✓</span>
                      : <span style={{ fontSize:"11px", color:"var(--danger)", fontWeight:700 }}>Pending</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

/* ── Chair evaluation form tab ───────────────────────────── */
function ChairEvalTab() {
  const pending = facultyList.filter(f=>!f.chairEvaluated);
  const [selected, setSelected]   = useState(null);
  const [ratings, setRatings]     = useState({});
  const [remarks, setRemarks]     = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (Object.keys(ratings).length < evaluationCriteria.length) return;
    setSubmitted(true);
  };

  if (submitted) return (
    <div className="anim-fade-in" style={{ textAlign:"center", padding:"50px 0" }}>
      <div style={{ fontSize:"48px", marginBottom:"16px" }}>✅</div>
      <h3 style={{ fontSize:"18px", fontWeight:600, marginBottom:"8px" }}>Chair Evaluation Submitted</h3>
      <p style={{ fontSize:"13px", color:"var(--text-second)", maxWidth:"380px", margin:"0 auto" }}>
        Your evaluation for {selected?.name} has been recorded with 30% weighting and will be included in the composite score.
      </p>
      <button onClick={()=>{ setSelected(null); setRatings({}); setRemarks(""); setSubmitted(false); }}
        style={{ marginTop:"24px", padding:"9px 22px", borderRadius:"var(--radius-sm)", background:"var(--amber)",
          color:"#0A0906", fontWeight:700, fontSize:"13px", border:"none", cursor:"pointer" }}>
        Evaluate Another →
      </button>
    </div>
  );

  return (
    <div className="anim-fade-in">
      {!selected ? (
        <>
          <p style={{ fontSize:"13px", color:"var(--text-second)", marginBottom:"16px" }}>
            Select a faculty member below to submit your evaluation. Your ratings carry a <strong style={{color:"var(--amber)"}}>30% weight</strong> in the final composite score.
          </p>
          {pending.length === 0 ? (
            <Card>
              <p style={{ textAlign:"center", color:"var(--text-muted)", fontSize:"13px", padding:"20px 0" }}>
                All faculty evaluations have been submitted for this semester. ✓
              </p>
            </Card>
          ) : (
            <div style={{ display:"grid", gap:"10px" }}>
              {pending.map(f => (
                <Card key={f.id} style={{ display:"flex", alignItems:"center", gap:"14px", padding:"16px 20px", cursor:"pointer" }}
                  onClick={()=>setSelected(f)}>
                  <div style={{ width:"38px", height:"38px", borderRadius:"9px", background:"var(--amber-dim)",
                    border:"1px solid var(--amber-border)", display:"flex", alignItems:"center",
                    justifyContent:"center", fontSize:"15px", color:"var(--amber)", fontFamily:"var(--font-display)",
                    fontWeight:700, flexShrink:0 }}>{f.name.split(" ").pop()[0]}</div>
                  <div style={{ flex:1 }}>
                    <p style={{ fontWeight:600, fontSize:"13px", marginBottom:"2px" }}>{f.name}</p>
                    <p style={{ fontSize:"12px", color:"var(--text-second)" }}>{f.dept} · {f.code} · {f.subject}</p>
                  </div>
                  <span style={{ color:"var(--danger)", fontSize:"11px", fontWeight:700 }}>Pending →</span>
                </Card>
              ))}
            </div>
          )}
        </>
      ) : (
        <div style={{ maxWidth:"640px" }}>
          <button onClick={()=>setSelected(null)}
            style={{ display:"flex", alignItems:"center", gap:"6px", color:"var(--text-second)",
              fontSize:"13px", marginBottom:"18px", background:"none", border:"none", cursor:"pointer" }}>
            ← Back
          </button>
          <Card>
            <div style={{ padding:"14px 16px", background:"var(--amber-dim)", borderRadius:"var(--radius-sm)",
              border:"1px solid var(--amber-border)", marginBottom:"20px" }}>
              <p style={{ fontWeight:700, marginBottom:"2px" }}>{selected.name}</p>
              <p style={{ fontSize:"12px", color:"var(--text-second)" }}>{selected.code} · {selected.subject} · {selected.dept}</p>
              <p style={{ fontSize:"11px", color:"var(--text-muted)", marginTop:"4px" }}>
                Student avg. score: <strong style={{color:"var(--amber)"}}>{selected.studentScore.toFixed(2)}</strong> ({selected.responses} responses)
              </p>
            </div>

            {evaluationCriteria.map((c,i)=>(
              <div key={c.id} style={{ marginBottom:"18px", paddingBottom:"18px",
                borderBottom:i<evaluationCriteria.length-1?"1px solid var(--border)":"none" }}>
                <p style={{ fontSize:"10px", fontWeight:700, color:"var(--amber)", letterSpacing:"0.06em",
                  textTransform:"uppercase", marginBottom:"4px" }}>{c.category}</p>
                <p style={{ fontSize:"13px", color:"var(--text-second)", marginBottom:"9px", lineHeight:1.6 }}>{c.prompt}</p>
                <StarInput value={ratings[c.id]||0} onChange={v=>setRatings(r=>({...r,[c.id]:v}))} />
              </div>
            ))}

            <div style={{ marginBottom:"18px" }}>
              <p style={{ fontSize:"11px", fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase",
                color:"var(--text-muted)", marginBottom:"8px" }}>Remarks (Optional)</p>
              <textarea value={remarks} onChange={e=>setRemarks(e.target.value)}
                placeholder="Add professional observations or context about this faculty member's performance..."
                rows={3}
                style={{ width:"100%", padding:"12px 14px", background:"var(--bg-input)", border:"1px solid var(--border)",
                  borderRadius:"var(--radius-sm)", color:"var(--text-primary)", fontSize:"13px",
                  lineHeight:1.6, resize:"vertical" }}
                onFocus={e=>(e.target.style.borderColor="var(--border-focus)")}
                onBlur={e=>(e.target.style.borderColor="var(--border)")} />
            </div>

            <button onClick={handleSubmit}
              style={{ width:"100%", padding:"12px", borderRadius:"var(--radius-sm)", background:"var(--amber)",
                color:"#0A0906", fontSize:"13px", fontWeight:700, border:"none", cursor:"pointer" }}
              onMouseEnter={e=>(e.currentTarget.style.background="var(--amber-hover)")}
              onMouseLeave={e=>(e.currentTarget.style.background="var(--amber)")}>
              Submit Chair Evaluation (30% Weight) →
            </button>
          </Card>
        </div>
      )}
    </div>
  );
}

/* ── AI Feedback tab ─────────────────────────────────────── */
function AIFeedbackTab() {
  const [expanded, setExpanded] = useState(null);
  const withFeedback = facultyList.filter(f => aiFeedbackMap[f.id] && f.chairEvaluated);

  return (
    <div className="anim-fade-in">
      <div style={{ padding:"14px 18px", background:"var(--amber-dim)", border:"1px solid var(--amber-border)",
        borderRadius:"var(--radius-md)", marginBottom:"20px", display:"flex", alignItems:"center", gap:"10px" }}>
        <span className="anim-pulse" style={{ display:"inline-block", width:"8px", height:"8px",
          borderRadius:"50%", background:"var(--amber)", flexShrink:0 }} />
        <p style={{ fontSize:"13px", color:"var(--text-second)", lineHeight:1.5 }}>
          AI feedback is available for faculty whose evaluation cycle is complete (student + chair evaluations submitted).
          Reports are generated locally — no data leaves the university's servers.
        </p>
      </div>

      {withFeedback.length === 0 ? (
        <Card><p style={{ textAlign:"center", color:"var(--text-muted)", padding:"20px 0" }}>
          No completed evaluation cycles yet.</p></Card>
      ) : (
        <div style={{ display:"grid", gap:"10px" }}>
          {withFeedback.map(f => {
            const fb = aiFeedbackMap[f.id];
            const open = expanded===f.id;
            return (
              <Card key={f.id} style={{ padding:0, overflow:"hidden" }}>
                <button onClick={()=>setExpanded(open?null:f.id)} style={{ width:"100%", padding:"18px 22px",
                  display:"flex", alignItems:"center", gap:"14px", background:"none", border:"none", cursor:"pointer",
                  textAlign:"left" }}>
                  <div style={{ width:"38px", height:"38px", borderRadius:"9px", background:"var(--amber-dim)",
                    border:"1px solid var(--amber-border)", display:"flex", alignItems:"center",
                    justifyContent:"center", fontSize:"15px", color:"var(--amber)", fontWeight:700,
                    fontFamily:"var(--font-display)", flexShrink:0 }}>{f.name.split(" ").pop()[0]}</div>
                  <div style={{ flex:1 }}>
                    <p style={{ fontWeight:600, fontSize:"14px", color:"var(--text-primary)", marginBottom:"2px" }}>{f.name}</p>
                    <p style={{ fontSize:"12px", color:"var(--text-second)" }}>{f.code} · {f.subject} · Composite: <strong style={{color:"var(--amber)"}}>{f.compositeScore.toFixed(2)}</strong></p>
                  </div>
                  <span style={{ fontSize:"20px", color:"var(--text-muted)", transition:"transform 0.2s",
                    transform:open?"rotate(180deg)":"rotate(0deg)" }}>⌄</span>
                </button>

                {open && (
                  <div className="anim-fade-in" style={{ padding:"0 22px 22px", borderTop:"1px solid var(--border)" }}>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px", marginTop:"18px", marginBottom:"14px" }}>
                      <div style={{ padding:"16px", background:"var(--success-dim)", border:"1px solid rgba(34,197,94,0.15)",
                        borderRadius:"var(--radius-sm)" }}>
                        <p style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.07em", textTransform:"uppercase",
                          color:"var(--success)", marginBottom:"10px" }}>✦ Strengths</p>
                        {fb.strengths.map((s,i)=>(
                          <p key={i} style={{ fontSize:"13px", color:"var(--text-second)", lineHeight:1.7,
                            marginBottom:i<fb.strengths.length-1?"8px":0 }}>{s}</p>
                        ))}
                      </div>
                      <div style={{ padding:"16px", background:"var(--amber-dim)", border:"1px solid var(--amber-border)",
                        borderRadius:"var(--radius-sm)" }}>
                        <p style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.07em", textTransform:"uppercase",
                          color:"var(--amber)", marginBottom:"10px" }}>◈ Points of Possible Improvement</p>
                        {fb.improvements.map((s,i)=>(
                          <p key={i} style={{ fontSize:"13px", color:"var(--text-second)", lineHeight:1.7,
                            marginBottom:i<fb.improvements.length-1?"8px":0 }}>{s}</p>
                        ))}
                      </div>
                    </div>

                    <div style={{ padding:"14px 16px", background:"var(--bg-elevated)", border:"1px solid var(--border)",
                      borderRadius:"var(--radius-sm)", marginBottom:"12px" }}>
                      <p style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.07em", textTransform:"uppercase",
                        color:"var(--text-muted)", marginBottom:"10px" }}>📌 Evidence (Student Responses)</p>
                      {fb.citations.map((c,i)=>(
                        <p key={i} style={{ fontSize:"13px", color:"var(--text-muted)", fontStyle:"italic",
                          lineHeight:1.6, paddingLeft:"12px", borderLeft:"2px solid var(--amber-border)",
                          marginBottom:i<fb.citations.length-1?"8px":0 }}>{c}</p>
                      ))}
                    </div>

                    <div style={{ padding:"14px 16px", background:"var(--amber-dim)", border:"1px solid var(--amber-border)",
                      borderRadius:"var(--radius-sm)" }}>
                      <p style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.07em", textTransform:"uppercase",
                        color:"var(--amber)", marginBottom:"8px" }}>🎯 Recommendation</p>
                      <p style={{ fontSize:"13px", color:"var(--text-second)", lineHeight:1.7 }}>{fb.recommendation}</p>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── Main component ─────────────────────────────────────── */
export default function ChairView() {
  const [tab, setTab] = useState("overview");
  const tabs = [
    { k:"overview",  l:"Department Overview" },
    { k:"evaluate",  l:"Submit Evaluation"   },
    { k:"feedback",  l:"AI Feedback Reports" },
  ];

  return (
    <div className="anim-fade-up">
      <div style={{ display:"flex", gap:"6px", marginBottom:"24px", flexWrap:"wrap" }}>
        {tabs.map(t=>(
          <TabBtn key={t.k} label={t.l} active={tab===t.k} onClick={()=>setTab(t.k)} />
        ))}
      </div>
      {tab==="overview" && <Overview />}
      {tab==="evaluate" && <ChairEvalTab />}
      {tab==="feedback" && <AIFeedbackTab />}
    </div>
  );
}
