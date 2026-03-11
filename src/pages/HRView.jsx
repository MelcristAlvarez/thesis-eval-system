/**
 * HRView.jsx
 * - AI Feedback now includes chair evaluation scores & remarks
 * - Audit Log: no model version, faculty names are clickable to expand hashed inputs
 */
import { useState } from "react";
import { facultyList, departmentStats, aiFeedbackMap, auditLogs, SEMESTER } from "../data/mockData.js";

function Card({ children, style={} }) {
  return (
    <div style={{ background:"var(--bg-surface)", border:"1px solid var(--border)",
      borderRadius:"var(--radius-md)", padding:"20px", boxShadow:"var(--shadow-sm)", ...style }}>
      {children}
    </div>
  );
}
function ScoreBar({ score, max=5 }) {
  return (
    <div style={{ flex:1, height:"5px", background:"var(--border)", borderRadius:"99px", overflow:"hidden" }}>
      <div style={{ width:`${(score/max)*100}%`, height:"100%", background:"var(--amber)", borderRadius:"99px" }}/>
    </div>
  );
}

/* ── Overview ─────────────────────────────────────── */
function Overview() {
  const totalFaculty   = departmentStats.reduce((s,d)=>s+d.faculty,0);
  const totalResponses = departmentStats.reduce((s,d)=>s+d.responses,0);
  const overallAvg     = (departmentStats.reduce((s,d)=>s+d.avgScore*d.faculty,0)/totalFaculty).toFixed(2);
  return (
    <div className="anim-fade-in">
      <div className="kpi-4" style={{ gap:"14px", marginBottom:"24px" }}>
        {[
          { label:"Total Faculty",     value:totalFaculty,                    sub:"across all colleges" },
          { label:"Total Responses",   value:totalResponses.toLocaleString(), sub:"this semester"       },
          { label:"Overall Average",   value:overallAvg,                      sub:"composite score"     },
          { label:"AI Reports",        value:`${totalFaculty}/${totalFaculty}`,sub:"ready for review"   },
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
      <p style={{ fontSize:"11px", fontWeight:700, letterSpacing:"0.07em", textTransform:"uppercase",
        color:"var(--text-muted)", marginBottom:"14px" }}>Department Breakdown</p>
      <div className="card-list">
        {departmentStats.map((d,i)=>(
          <Card key={i} style={{ padding:"18px 22px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"16px", flexWrap:"wrap" }}>
              <div style={{ minWidth:"60px" }}>
                <p style={{ fontFamily:"var(--font-display)", fontSize:"13px", fontWeight:700, color:"var(--amber)" }}>{d.dept}</p>
                <p style={{ fontSize:"11px", color:"var(--text-muted)" }}>{d.faculty} faculty</p>
              </div>
              <div style={{ flex:1, minWidth:"160px" }}>
                <p style={{ fontSize:"13px", color:"var(--text-second)", marginBottom:"6px" }}>{d.full}</p>
                <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                  <ScoreBar score={d.avgScore}/>
                  <p style={{ fontFamily:"var(--font-display)", fontSize:"16px", fontWeight:600, color:"var(--text-primary)", flexShrink:0 }}>{d.avgScore.toFixed(2)}</p>
                </div>
              </div>
              <div style={{ textAlign:"right", minWidth:"80px" }}>
                <p style={{ fontFamily:"var(--font-display)", fontSize:"18px", fontWeight:600 }}>{d.responses.toLocaleString()}</p>
                <p style={{ fontSize:"11px", color:"var(--text-muted)" }}>responses</p>
              </div>
              <div style={{ textAlign:"right", minWidth:"80px" }}>
                <p style={{ fontSize:"13px", fontWeight:700, color:"var(--success)" }}>{d.evaluated}/{d.faculty}</p>
                <p style={{ fontSize:"11px", color:"var(--text-muted)" }}>evaluated</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ── Faculty Reports ──────────────────────────────── */
function FacultyReports() {
  const [deptFilter, setDeptFilter] = useState("ALL");
  const depts    = ["ALL","CEAFA","CASE","CBMA","CHS"];
  const filtered = deptFilter==="ALL" ? facultyList : facultyList.filter(f=>f.dept===deptFilter);
  const sMap = { excellent:{c:"var(--success)",l:"Excellent"}, good:{c:"var(--amber)",l:"Good"},
    average:{c:"var(--text-second)",l:"Average"}, needsSupport:{c:"var(--danger)",l:"Needs Support"} };
  return (
    <div className="anim-fade-in">
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
        marginBottom:"16px", flexWrap:"wrap", gap:"10px" }}>
        <div style={{ display:"flex", gap:"6px", flexWrap:"wrap" }}>
          {depts.map(d=>(
            <button key={d} onClick={()=>setDeptFilter(d)} style={{ padding:"5px 14px", borderRadius:"99px", fontSize:"12px", fontWeight:600,
              background:deptFilter===d?"var(--amber-dim)":"transparent",
              color:deptFilter===d?"var(--amber)":"var(--text-muted)",
              border:`1px solid ${deptFilter===d?"var(--amber-border)":"var(--border)"}` }}>{d}</button>
          ))}
        </div>
        <button style={{ padding:"7px 16px", borderRadius:"var(--radius-sm)", background:"var(--amber-dim)",
          border:"1px solid var(--amber-border)", color:"var(--amber)", fontSize:"12px", fontWeight:700, cursor:"pointer" }}>
          Export CSV ↓
        </button>
      </div>
      <Card style={{ padding:0, overflow:"hidden" }}>
        <div className="tbl-wrap">
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:"var(--bg-elevated)" }}>
                {["Faculty","Subject / Code","Student (70%)","Chair (30%)","Composite","Status","Chair Eval"].map(h=>(
                  <th key={h} style={{ padding:"10px 14px", textAlign:"left", fontSize:"10px", fontWeight:700,
                    letterSpacing:"0.06em", textTransform:"uppercase", color:"var(--text-muted)",
                    borderBottom:"1px solid var(--border)", whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((f,i)=>(
                <tr key={f.id}
                  style={{ borderBottom:i<filtered.length-1?"1px solid var(--border)":"none", transition:"background 0.12s" }}
                  onMouseEnter={e=>(e.currentTarget.style.background="var(--bg-elevated)")}
                  onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                  <td style={{ padding:"12px 14px" }}>
                    <p style={{ fontSize:"13px", fontWeight:600 }}>{f.name}</p>
                    <p style={{ fontSize:"11px", color:"var(--text-muted)" }}>{f.responses} responses</p>
                  </td>
                  <td style={{ padding:"12px 14px" }}>
                    <p style={{ fontSize:"12px" }}>{f.subject}</p>
                    <p style={{ fontSize:"11px", color:"var(--text-muted)" }}>{f.code}</p>
                  </td>
                  <td style={{ padding:"12px 14px", fontFamily:"var(--font-display)", fontSize:"16px", fontWeight:600 }}>{f.studentScore.toFixed(2)}</td>
                  <td style={{ padding:"12px 14px", fontFamily:"var(--font-display)", fontSize:"16px", fontWeight:600 }}>
                    {f.chairEvaluated ? f.chairScore.toFixed(2) : <span style={{ fontSize:"12px", color:"var(--text-muted)" }}>—</span>}
                  </td>
                  <td style={{ padding:"12px 14px", fontFamily:"var(--font-display)", fontSize:"18px", fontWeight:600, color:"var(--amber)" }}>{f.compositeScore.toFixed(2)}</td>
                  <td style={{ padding:"12px 14px" }}>
                    <span style={{ fontSize:"12px", fontWeight:700, color:(sMap[f.status]||sMap.average).c }}>
                      {(sMap[f.status]||sMap.average).l}
                    </span>
                  </td>
                  <td style={{ padding:"12px 14px" }}>
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

/* ── AI Feedback ──────────────────────────────────── */
function AIFeedbackReview() {
  const [expanded, setExpanded] = useState(null);
  const withFeedback = facultyList.filter(f=>aiFeedbackMap[f.id]);
  return (
    <div className="anim-fade-in">
      <div style={{ padding:"14px 18px", background:"var(--bg-elevated)", border:"1px solid var(--border)",
        borderRadius:"var(--radius-md)", marginBottom:"20px" }}>
        <p style={{ fontSize:"13px", color:"var(--text-second)", lineHeight:1.6 }}>
          Each AI report synthesizes <strong>student evaluation responses</strong> and the{" "}
          <strong>program chair's structured observation scores</strong> to produce
          comprehensive, evidence-based faculty feedback.
        </p>
      </div>
      <div className="card-list">
        {withFeedback.map(f=>{
          const fb   = aiFeedbackMap[f.id];
          const open = expanded===f.id;
          return (
            <Card key={f.id} style={{ padding:0, overflow:"hidden" }}>
              <button onClick={()=>setExpanded(open?null:f.id)}
                style={{ width:"100%", padding:"16px 22px", display:"flex", alignItems:"center",
                  gap:"12px", background:"none", border:"none", cursor:"pointer", textAlign:"left" }}>
                <div style={{ flex:1 }}>
                  <p style={{ fontWeight:600, fontSize:"14px", color:"var(--text-primary)", marginBottom:"2px" }}>{f.name}</p>
                  <p style={{ fontSize:"12px", color:"var(--text-second)" }}>
                    {f.dept} · {f.code} · {f.responses} responses · Composite:
                    {" "}<strong style={{color:"var(--amber)"}}>{f.compositeScore.toFixed(2)}</strong>
                  </p>
                </div>
                <span style={{ fontSize:"11px", fontWeight:700, color:"var(--amber)", background:"var(--amber-dim)",
                  border:"1px solid var(--amber-border)", borderRadius:"99px", padding:"3px 10px" }}>Report Ready</span>
                <span style={{ fontSize:"18px", color:"var(--text-muted)", transition:"transform 0.2s",
                  transform:open?"rotate(180deg)":"rotate(0deg)" }}>⌄</span>
              </button>

              {open && (
                <div className="anim-fade-in" style={{ padding:"0 22px 22px", borderTop:"1px solid var(--border)" }}>

                  {/* ── Chair evaluation scores block ────── */}
                  {f.chairEvaluated && (
                    <div style={{ marginTop:"18px", marginBottom:"16px", padding:"16px",
                      background:"var(--bg-elevated)", border:"1px solid var(--border)", borderRadius:"var(--radius-sm)" }}>
                      <p style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.07em", textTransform:"uppercase",
                        color:"var(--text-muted)", marginBottom:"12px" }}>📋 Chair Evaluation Summary</p>
                      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:"10px", marginBottom:"12px" }}>
                        {[
                          { label:"Classroom Obs.",     value:f.chairScoreBreakdown?.co || "4.6" },
                          { label:"Research",           value:f.chairScoreBreakdown?.re || "4.4" },
                          { label:"Community Ext.",     value:f.chairScoreBreakdown?.ce || "4.5" },
                          { label:"Performance",        value:f.chairScoreBreakdown?.pf || "4.7" },
                        ].map((item,i)=>(
                          <div key={i} style={{ padding:"10px 12px", background:"var(--bg-surface)",
                            border:"1px solid var(--border)", borderRadius:"8px", textAlign:"center" }}>
                            <p style={{ fontSize:"18px", fontWeight:700, fontFamily:"var(--font-display)",
                              color:"var(--amber)", lineHeight:1, marginBottom:"4px" }}>{item.value}</p>
                            <p style={{ fontSize:"10px", color:"var(--text-muted)", fontWeight:600 }}>{item.label}</p>
                          </div>
                        ))}
                      </div>
                      <div style={{ padding:"10px 12px", background:"var(--amber-dim)", border:"1px solid var(--amber-border)",
                        borderRadius:"8px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                        <p style={{ fontSize:"12px", color:"var(--text-second)", fontWeight:600 }}>Chair Score</p>
                        <p style={{ fontFamily:"var(--font-display)", fontSize:"20px", fontWeight:700, color:"var(--amber)" }}>
                          {f.chairScore.toFixed(2)}
                        </p>
                      </div>
                      {fb.chairRemarks && (
                        <div style={{ marginTop:"10px", padding:"10px 12px", background:"var(--bg-surface)",
                          border:"1px solid var(--border)", borderRadius:"8px" }}>
                          <p style={{ fontSize:"10px", fontWeight:700, color:"var(--text-muted)", marginBottom:"5px",
                            letterSpacing:"0.05em", textTransform:"uppercase" }}>Chairperson Remarks</p>
                          <p style={{ fontSize:"13px", color:"var(--text-second)", lineHeight:1.6, fontStyle:"italic" }}>
                            "{fb.chairRemarks}"
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── AI-generated content ─────────────── */}
                  <div className="grid-2" style={{ gap:"12px", marginBottom:"12px" }}>
                    <div style={{ padding:"14px", background:"var(--success-dim)", border:"1px solid rgba(76,175,111,0.18)", borderRadius:"var(--radius-sm)" }}>
                      <p style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.07em", textTransform:"uppercase", color:"var(--success)", marginBottom:"8px" }}>✦ Strengths</p>
                      {fb.strengths.map((s,i)=><p key={i} style={{ fontSize:"13px", color:"var(--text-second)", lineHeight:1.7, marginBottom:i<fb.strengths.length-1?"8px":0 }}>{s}</p>)}
                    </div>
                    <div style={{ padding:"14px", background:"var(--amber-dim)", border:"1px solid var(--amber-border)", borderRadius:"var(--radius-sm)" }}>
                      <p style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.07em", textTransform:"uppercase", color:"var(--amber)", marginBottom:"8px" }}>◈ Points for Improvement</p>
                      {fb.improvements.map((s,i)=><p key={i} style={{ fontSize:"13px", color:"var(--text-second)", lineHeight:1.7, marginBottom:i<fb.improvements.length-1?"8px":0 }}>{s}</p>)}
                    </div>
                  </div>
                  <div style={{ padding:"12px 14px", background:"var(--bg-elevated)", border:"1px solid var(--border)", borderRadius:"var(--radius-sm)", marginBottom:"10px" }}>
                    <p style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.07em", textTransform:"uppercase", color:"var(--text-muted)", marginBottom:"8px" }}>📌 Student Evidence</p>
                    {fb.citations.map((c,i)=><p key={i} style={{ fontSize:"13px", color:"var(--text-muted)", fontStyle:"italic", lineHeight:1.6, paddingLeft:"12px", borderLeft:"2px solid var(--amber-border)", marginBottom:i<fb.citations.length-1?"8px":0 }}>{c}</p>)}
                  </div>
                  <div style={{ padding:"12px 14px", background:"var(--amber-dim)", border:"1px solid var(--amber-border)", borderRadius:"var(--radius-sm)" }}>
                    <p style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.07em", textTransform:"uppercase", color:"var(--amber)", marginBottom:"6px" }}>🎯 Recommendation</p>
                    <p style={{ fontSize:"13px", color:"var(--text-second)", lineHeight:1.7 }}>{fb.recommendation}</p>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}


/* ── Audit Log ─────────────────────────────────────────────────────── */

const SAMPLE_STUDENT_EVALS = [
  { ratings:{ e1:5, e2:5, e3:4, e4:5, e5:5 }, comment:"Explains concepts very clearly and always makes sure everyone understands before moving on. The lab sessions are well-paced and the examples are practical." },
  { ratings:{ e1:4, e2:5, e3:4, e4:4, e5:5 }, comment:"Very knowledgeable about the subject. Sometimes the pace is fast but the professor is always willing to help after class." },
  { ratings:{ e1:5, e2:4, e3:5, e4:5, e5:4 }, comment:"Great at encouraging class participation. The open-ended discussions really help understand difficult topics more deeply." },
  { ratings:{ e1:4, e2:4, e3:4, e4:3, e5:5 }, comment:"Fair and professional. The course materials could be updated but the teaching style is very effective and engaging." },
  { ratings:{ e1:5, e2:5, e3:5, e4:4, e5:5 }, comment:"One of the best professors I have had. Always prepared and the feedback on our projects is detailed and constructive." },
];

const CRIT_LABELS = { e1:"Teaching Effectiveness", e2:"Subject Matter Mastery", e3:"Communication", e4:"Engagement", e5:"Professional Conduct" };

function StudentHashRow({ h, index }) {
  const [open, setOpen] = useState(false);
  const sample = SAMPLE_STUDENT_EVALS[index % SAMPLE_STUDENT_EVALS.length];
  const avg    = (Object.values(sample.ratings).reduce((s,v)=>s+v,0)/5).toFixed(1);
  return (
    <div style={{ border:"1px solid var(--border)", borderRadius:"8px", overflow:"hidden", marginBottom:"6px" }}>
      <button onClick={()=>setOpen(o=>!o)} style={{ width:"100%", display:"flex", alignItems:"center",
        gap:"10px", padding:"9px 12px", background:"none", border:"none", cursor:"pointer", textAlign:"left" }}>
        <span style={{ fontSize:"10px", color:"var(--text-muted)", minWidth:"56px", flexShrink:0 }}>
          #{String(index+1).padStart(3,"0")}
        </span>
        <span style={{ fontFamily:"monospace", fontSize:"11px", color:"var(--text-second)",
          flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{h}</span>
        <span style={{ fontSize:"10px", fontWeight:700, color:"var(--amber)", background:"var(--amber-dim)",
          border:"1px solid var(--amber-border)", borderRadius:"4px", padding:"1px 8px",
          flexShrink:0, whiteSpace:"nowrap" }}>avg {avg} ★</span>
        <span style={{ fontSize:"13px", color:"var(--text-muted)", transition:"transform 0.15s",
          transform:open?"rotate(180deg)":"rotate(0deg)", flexShrink:0 }}>⌄</span>
      </button>
      {open && (
        <div className="anim-fade-in" style={{ borderTop:"1px solid var(--border)",
          padding:"14px 12px", background:"var(--bg-surface)" }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(155px,1fr))", gap:"8px", marginBottom:"12px" }}>
            {Object.entries(sample.ratings).map(([key,val])=>(
              <div key={key} style={{ padding:"8px 10px", background:"var(--bg-elevated)",
                border:"1px solid var(--border)", borderRadius:"6px" }}>
                <p style={{ fontSize:"10px", color:"var(--text-muted)", marginBottom:"4px", fontWeight:600 }}>{CRIT_LABELS[key]}</p>
                <div style={{ display:"flex", alignItems:"center", gap:"3px" }}>
                  {[1,2,3,4,5].map(n=>(
                    <span key={n} style={{ color:n<=val?"var(--amber)":"var(--border)", fontSize:"14px" }}>★</span>
                  ))}
                  <span style={{ fontSize:"12px", color:"var(--text-second)", marginLeft:"4px", fontWeight:600 }}>{val}/5</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding:"10px 12px", background:"var(--bg-elevated)", border:"1px solid var(--border)", borderRadius:"6px" }}>
            <p style={{ fontSize:"10px", fontWeight:700, color:"var(--text-muted)", marginBottom:"5px",
              letterSpacing:"0.05em", textTransform:"uppercase" }}>Open-Ended Comment</p>
            <p style={{ fontSize:"13px", color:"var(--text-second)", lineHeight:1.7, fontStyle:"italic" }}>"{sample.comment}"</p>
          </div>
          {/* <p style={{ fontSize:"10px", color:"var(--text-muted)", marginTop:"8px", lineHeight:1.6 }}>
            This is a representative sample of the evaluation data mapped to this hash. Actual text is not retained after processing.
          </p> */}
        </div>
      )}
    </div>
  );
}

function ChairHashRow({ hash, log }) {
  const [open, setOpen] = useState(false);
  const faculty = facultyList.find(f=>f.name===log.faculty);
  return (
    <div style={{ border:"1px solid var(--amber-border)", borderRadius:"8px", overflow:"hidden" }}>
      <button onClick={()=>setOpen(o=>!o)} style={{ width:"100%", display:"flex", alignItems:"center",
        gap:"10px", padding:"10px 12px", background:"none", border:"none", cursor:"pointer", textAlign:"left" }}>
        <span style={{ fontSize:"10px", color:"var(--text-muted)", minWidth:"56px", flexShrink:0 }}>CHAIR</span>
        <span style={{ fontFamily:"monospace", fontSize:"11px", color:"var(--amber)",
          flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{hash}</span>
        <span style={{ fontSize:"10px", fontWeight:700, color:"var(--amber)", background:"var(--amber-dim)",
          border:"1px solid var(--amber-border)", borderRadius:"4px", padding:"1px 8px", flexShrink:0 }}>View</span>
        <span style={{ fontSize:"13px", color:"var(--text-muted)", transition:"transform 0.15s",
          transform:open?"rotate(180deg)":"rotate(0deg)", flexShrink:0 }}>⌄</span>
      </button>
      {open && faculty && (
        <div className="anim-fade-in" style={{ borderTop:"1px solid var(--amber-border)",
          padding:"14px 12px", background:"var(--bg-surface)" }}>
          {faculty.chairScoreBreakdown && (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:"8px", marginBottom:"12px" }}>
              {[
                { label:"Classroom Observation", key:"co", weight:"40%" },
                { label:"Research",              key:"re", weight:"20%" },
                { label:"Community Extension",   key:"ce", weight:"20%" },
                { label:"Performance",           key:"pf", weight:"20%" },
              ].map(item=>(
                <div key={item.key} style={{ padding:"10px 12px", background:"var(--bg-elevated)",
                  border:"1px solid var(--border)", borderRadius:"6px", textAlign:"center" }}>
                  <p style={{ fontSize:"10px", color:"var(--text-muted)", marginBottom:"3px", fontWeight:600 }}>
                    {item.label}
                    <span style={{ display:"block", color:"var(--amber)", fontWeight:700 }}>{item.weight}</span>
                  </p>
                  <p style={{ fontFamily:"var(--font-display)", fontSize:"22px", fontWeight:700, color:"var(--amber)", lineHeight:1.2 }}>
                    {faculty.chairScoreBreakdown[item.key]}
                  </p>
                </div>
              ))}
            </div>
          )}
          {log.chairRemarks && (
            <div style={{ padding:"10px 12px", background:"var(--bg-elevated)", border:"1px solid var(--border)", borderRadius:"6px", marginBottom:"8px" }}>
              <p style={{ fontSize:"10px", fontWeight:700, color:"var(--text-muted)", marginBottom:"5px",
                letterSpacing:"0.05em", textTransform:"uppercase" }}>Chairperson Remarks</p>
              <p style={{ fontSize:"13px", color:"var(--text-second)", lineHeight:1.7, fontStyle:"italic" }}>"{log.chairRemarks}"</p>
            </div>
          )}
          {/* <p style={{ fontSize:"10px", color:"var(--text-muted)", marginTop:"4px", lineHeight:1.6 }}>
            This is a representative sample of the chair evaluation data mapped to this hash. Actual text is not retained after processing.
          </p> */}
        </div>
      )}
    </div>
  );
}

function AuditLog() {
  const [expanded, setExpanded] = useState(null);
  return (
    <div className="anim-fade-in">
      <Card style={{ marginBottom:"20px", padding:"18px 22px" }}>
        <p style={{ fontSize:"13px", fontWeight:700, color:"var(--text-primary)", marginBottom:"8px" }}>
          📖 About This Log
        </p>
        <p style={{ fontSize:"13px", color:"var(--text-second)", lineHeight:1.7, marginBottom:"10px" }}>
          Every AI-generated faculty report is logged here for <strong>accountability and traceability</strong>.
          The <strong>Input Hash</strong> is a cryptographic fingerprint of the exact student responses and
          chair remarks used to generate that report, verifying that the output was not fabricated and that
          no identifiable student data is stored.
        </p>
        <p style={{ fontSize:"13px", color:"var(--text-second)", lineHeight:1.7 }}>
          Click any faculty row to expand its inputs. Inside, click any student hash or the
          chairperson hash to view the evaluation data it represents.
        </p>
      </Card>

      <div className="card-list">
        {auditLogs.map((log, i) => {
          const open = expanded === i;
          return (
            <Card key={i} style={{ padding:0, overflow:"hidden" }}>
              <button onClick={()=>setExpanded(open?null:i)}
                style={{ width:"100%", padding:"14px 20px", display:"flex", alignItems:"center",
                  gap:"14px", background:"none", border:"none", cursor:"pointer", textAlign:"left" }}>
                <span style={{ width:"8px", height:"8px", borderRadius:"50%", flexShrink:0,
                  background:log.status==="success"?"var(--success)":"var(--danger)" }}/>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontSize:"13px", fontWeight:600, color:"var(--text-primary)", marginBottom:"1px" }}>{log.faculty}</p>
                  <p style={{ fontSize:"11px", color:"var(--text-muted)" }}>{log.code}</p>
                </div>
                <div style={{ textAlign:"right", minWidth:"70px" }}>
                  <p style={{ fontSize:"13px", fontWeight:600, color:"var(--text-second)" }}>{log.inputs}</p>
                  <p style={{ fontSize:"10px", color:"var(--text-muted)" }}>inputs</p>
                </div>
                <div style={{ minWidth:"130px" }}>
                  <p style={{ fontSize:"10px", color:"var(--text-muted)", marginBottom:"1px" }}>Input Hash</p>
                  <p style={{ fontSize:"11px", color:"var(--amber)", fontFamily:"monospace" }}>{log.hash}</p>
                </div>
                <p style={{ fontSize:"11px", color:"var(--text-muted)", minWidth:"120px", textAlign:"right" }}>
                  {log.timestamp}
                </p>
                <span style={{ fontSize:"16px", color:"var(--text-muted)", transition:"transform 0.2s",
                  transform:open?"rotate(180deg)":"rotate(0deg)", flexShrink:0 }}>⌄</span>
              </button>

              {open && (
                <div className="anim-fade-in" style={{ borderTop:"1px solid var(--border)",
                  padding:"18px 20px", background:"var(--bg-elevated)" }}>
                  <p style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.07em", textTransform:"uppercase",
                    color:"var(--text-muted)", marginBottom:"14px" }}>Input Records: click any row to view sample evaluation data</p>
                  <p style={{ fontSize:"12px", fontWeight:700, color:"var(--text-second)", marginBottom:"8px" }}>
                    Student Responses ({log.inputs} total, showing {log.studentHashes.length} samples)
                  </p>
                  <div style={{ marginBottom:"18px" }}>
                    {log.studentHashes.map((h,hi)=>(
                      <StudentHashRow key={hi} h={h} index={hi}/>
                    ))}
                  </div>
                  <p style={{ fontSize:"12px", fontWeight:700, color:"var(--text-second)", marginBottom:"8px" }}>
                    Chairperson Evaluation
                  </p>
                  <ChairHashRow hash={log.chairHash} log={log}/>
                  <p style={{ fontSize:"11px", color:"var(--text-muted)", marginTop:"14px", lineHeight:1.6 }}>
                    These hashes confirm that the AI report was generated from these exact inputs.
                    {/* The actual response text is not retained after processing; only its cryptographic fingerprint is kept. */}
                  </p>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/* ── Main ─────────────────────────────────────────── */
export default function HRView({ activeTab }) {
  if (activeTab === "overview") return <div className="anim-fade-up"><Overview/></div>;
  if (activeTab === "reports")  return <div className="anim-fade-up"><FacultyReports/></div>;
  if (activeTab === "feedback") return <div className="anim-fade-up"><AIFeedbackReview/></div>;
  if (activeTab === "audit")    return <div className="anim-fade-up"><AuditLog/></div>;
  return null;
}