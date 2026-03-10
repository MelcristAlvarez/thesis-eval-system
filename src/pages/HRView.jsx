/**
 * HRView.jsx
 * HR Officer role — institutional view across all departments.
 * Tabs: Overview · Faculty Reports · AI Feedback · Audit Log
 */

import { useState } from "react";
import { facultyList, departmentStats, aiFeedbackMap, auditLogs, SEMESTER } from "../data/mockData.js";

/* ── Shared helpers ─────────────────────────────────────── */
function Card({ children, style={} }) {
  return (
    <div style={{ background:"var(--bg-surface)", border:"1px solid var(--border)",
      borderRadius:"var(--radius-md)", padding:"22px", boxShadow:"var(--shadow-sm)", ...style }}>
      {children}
    </div>
  );
}
function TabBtn({ label, active, onClick }) {
  return (
    <button onClick={onClick}
      style={{ padding:"8px 18px", borderRadius:"var(--radius-sm)", fontSize:"13px", fontWeight:700,
        background:active?"var(--amber)":"var(--bg-elevated)", color:active?"#0A0906":"var(--text-second)",
        border:active?"none":"1px solid var(--border)" }}>
      {label}
    </button>
  );
}
function ScoreBar({ score, max=5 }) {
  return (
    <div style={{ flex:1, height:"5px", background:"var(--border)", borderRadius:"99px", overflow:"hidden" }}>
      <div style={{ width:`${(score/max)*100}%`, height:"100%", background:"var(--amber)", borderRadius:"99px" }} />
    </div>
  );
}
function SectionLabel({ children }) {
  return (
    <p style={{ fontSize:"11px", fontWeight:700, letterSpacing:"0.07em", textTransform:"uppercase",
      color:"var(--text-muted)", marginBottom:"14px" }}>{children}</p>
  );
}

/* ── Overview tab ────────────────────────────────────────── */
function Overview() {
  const totalFaculty = departmentStats.reduce((s,d)=>s+d.faculty,0);
  const totalResponses = departmentStats.reduce((s,d)=>s+d.responses,0);
  const overallAvg = (departmentStats.reduce((s,d)=>s+d.avgScore*d.faculty,0)/totalFaculty).toFixed(2);

  return (
    <div className="anim-fade-in">
      {/* System-wide KPIs */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"14px", marginBottom:"24px" }}>
        {[
          { label:"Total Faculty",      value:totalFaculty,                    sub:"across all colleges" },
          { label:"Total Responses",    value:totalResponses.toLocaleString(), sub:"this semester"        },
          { label:"Overall Average",    value:overallAvg,                      sub:"composite score"      },
          { label:"Reports Generated",  value:`${totalFaculty}/${totalFaculty}`,sub:"AI reports ready"    },
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

      {/* Per-department breakdown */}
      <SectionLabel>Department Breakdown</SectionLabel>
      <div style={{ display:"grid", gap:"10px" }}>
        {departmentStats.map((d,i)=>(
          <Card key={i} style={{ padding:"18px 22px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"16px", flexWrap:"wrap" }}>
              <div style={{ minWidth:"60px" }}>
                <p style={{ fontFamily:"var(--font-display)", fontSize:"13px", fontWeight:700,
                  color:"var(--amber)" }}>{d.dept}</p>
                <p style={{ fontSize:"11px", color:"var(--text-muted)" }}>{d.faculty} faculty</p>
              </div>
              <div style={{ flex:1, minWidth:"160px" }}>
                <p style={{ fontSize:"13px", color:"var(--text-second)", marginBottom:"6px" }}>{d.full}</p>
                <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                  <ScoreBar score={d.avgScore} />
                  <p style={{ fontFamily:"var(--font-display)", fontSize:"16px", fontWeight:600,
                    color:"var(--text-primary)", flexShrink:0 }}>{d.avgScore.toFixed(2)}</p>
                </div>
              </div>
              <div style={{ textAlign:"right", minWidth:"100px" }}>
                <p style={{ fontFamily:"var(--font-display)", fontSize:"18px", fontWeight:600,
                  color:"var(--text-second)" }}>{d.responses.toLocaleString()}</p>
                <p style={{ fontSize:"11px", color:"var(--text-muted)" }}>responses</p>
              </div>
              <div style={{ textAlign:"right", minWidth:"90px" }}>
                <p style={{ fontSize:"13px", fontWeight:700, color:"var(--success)" }}>
                  {d.evaluated}/{d.faculty}
                </p>
                <p style={{ fontSize:"11px", color:"var(--text-muted)" }}>evaluated</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ── Faculty Reports tab ─────────────────────────────────── */
function FacultyReports() {
  const [deptFilter, setDeptFilter] = useState("ALL");
  const depts = ["ALL","CASE","CEAFA","CBMA","CHS"];
  const filtered = deptFilter==="ALL" ? facultyList : facultyList.filter(f=>f.dept===deptFilter);

  return (
    <div className="anim-fade-in">
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
        marginBottom:"16px", flexWrap:"wrap", gap:"10px" }}>
        <div style={{ display:"flex", gap:"6px", flexWrap:"wrap" }}>
          {depts.map(d=>(
            <button key={d} onClick={()=>setDeptFilter(d)}
              style={{ padding:"5px 14px", borderRadius:"99px", fontSize:"12px", fontWeight:600,
                background:deptFilter===d?"var(--amber-dim)":"transparent",
                color:deptFilter===d?"var(--amber)":"var(--text-muted)",
                border:`1px solid ${deptFilter===d?"var(--amber-border)":"var(--border)"}` }}>
              {d}
            </button>
          ))}
        </div>
        <button style={{ padding:"7px 16px", borderRadius:"var(--radius-sm)", background:"var(--amber-dim)",
          border:"1px solid var(--amber-border)", color:"var(--amber)", fontSize:"12px", fontWeight:700 }}>
          Export CSV ↓
        </button>
      </div>

      <Card style={{ padding:0, overflow:"hidden" }}>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:"var(--bg-elevated)" }}>
                {["Faculty","Dept","Subject","Student (70%)","Chair (30%)","Composite","Status","Chair Eval"].map(h=>(
                  <th key={h} style={{ padding:"10px 14px", textAlign:"left", fontSize:"10px", fontWeight:700,
                    letterSpacing:"0.06em", textTransform:"uppercase", color:"var(--text-muted)",
                    borderBottom:"1px solid var(--border)", whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((f,i)=>({
                excellent:   { color:"var(--success)", label:"Excellent"     },
                good:        { color:"var(--amber)",   label:"Good"          },
                average:     { color:"var(--text-second)", label:"Average"   },
                needsSupport:{ color:"var(--danger)",  label:"Needs Support" },
              }[f.status] && (
                <tr key={f.id}
                  style={{ borderBottom:i<filtered.length-1?"1px solid var(--border)":"none", transition:"background 0.12s" }}
                  onMouseEnter={e=>(e.currentTarget.style.background="var(--bg-elevated)")}
                  onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                  <td style={{ padding:"12px 14px" }}>
                    <p style={{ fontSize:"13px", fontWeight:600 }}>{f.name}</p>
                    <p style={{ fontSize:"11px", color:"var(--text-muted)" }}>{f.responses} responses</p>
                  </td>
                  <td style={{ padding:"12px 14px", fontSize:"12px", color:"var(--text-second)" }}>{f.dept}</td>
                  <td style={{ padding:"12px 14px" }}>
                    <p style={{ fontSize:"12px" }}>{f.subject}</p>
                    <p style={{ fontSize:"11px", color:"var(--text-muted)" }}>{f.code}</p>
                  </td>
                  <td style={{ padding:"12px 14px", fontFamily:"var(--font-display)", fontSize:"16px", fontWeight:600 }}>
                    {f.studentScore.toFixed(2)}
                  </td>
                  <td style={{ padding:"12px 14px", fontFamily:"var(--font-display)", fontSize:"16px", fontWeight:600 }}>
                    {f.chairEvaluated ? f.chairScore.toFixed(2) : <span style={{ fontSize:"12px", color:"var(--text-muted)" }}>—</span>}
                  </td>
                  <td style={{ padding:"12px 14px" }}>
                    <p style={{ fontFamily:"var(--font-display)", fontSize:"18px", fontWeight:600, color:"var(--amber)" }}>
                      {f.compositeScore.toFixed(2)}
                    </p>
                  </td>
                  <td style={{ padding:"12px 14px" }}>
                    <span style={{ fontSize:"12px", fontWeight:700,
                      color:{ excellent:"var(--success)", good:"var(--amber)", average:"var(--text-second)", needsSupport:"var(--danger)" }[f.status] }}>
                      {{ excellent:"Excellent", good:"Good", average:"Average", needsSupport:"Needs Support" }[f.status]}
                    </span>
                  </td>
                  <td style={{ padding:"12px 14px" }}>
                    {f.chairEvaluated
                      ? <span style={{ fontSize:"11px", color:"var(--success)", fontWeight:700 }}>Done ✓</span>
                      : <span style={{ fontSize:"11px", color:"var(--danger)", fontWeight:700 }}>Pending</span>}
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

/* ── AI Feedback review tab ──────────────────────────────── */
function AIFeedbackReview() {
  const [expanded, setExpanded] = useState(null);
  const withFeedback = facultyList.filter(f=>aiFeedbackMap[f.id]);

  return (
    <div className="anim-fade-in">
      <div style={{ padding:"14px 18px", background:"var(--bg-elevated)", border:"1px solid var(--border)",
        borderRadius:"var(--radius-md)", marginBottom:"20px" }}>
        <p style={{ fontSize:"13px", color:"var(--text-second)", lineHeight:1.6 }}>
          AI-generated feedback reports are produced from student comments using a locally hosted language model.
          Each report cites specific student responses as evidence. All processing occurs on the university's own servers.
        </p>
      </div>
      <div style={{ display:"grid", gap:"10px" }}>
        {withFeedback.map(f=>{
          const fb = aiFeedbackMap[f.id];
          const open = expanded===f.id;
          return (
            <Card key={f.id} style={{ padding:0, overflow:"hidden" }}>
              <button onClick={()=>setExpanded(open?null:f.id)}
                style={{ width:"100%", padding:"16px 22px", display:"flex", alignItems:"center",
                  gap:"12px", background:"none", border:"none", cursor:"pointer", textAlign:"left" }}>
                <div style={{ flex:1 }}>
                  <p style={{ fontWeight:600, fontSize:"14px", color:"var(--text-primary)", marginBottom:"2px" }}>{f.name}</p>
                  <p style={{ fontSize:"12px", color:"var(--text-second)" }}>
                    {f.dept} · {f.code} · {f.responses} responses · Composite: <strong style={{color:"var(--amber)"}}>{f.compositeScore.toFixed(2)}</strong>
                  </p>
                </div>
                <span style={{ fontSize:"11px", fontWeight:700, color:"var(--amber)",
                  background:"var(--amber-dim)", border:"1px solid var(--amber-border)",
                  borderRadius:"99px", padding:"3px 10px" }}>Report Ready</span>
                <span style={{ fontSize:"18px", color:"var(--text-muted)", transition:"transform 0.2s",
                  transform:open?"rotate(180deg)":"rotate(0deg)" }}>⌄</span>
              </button>
              {open && (
                <div className="anim-fade-in" style={{ padding:"0 22px 22px", borderTop:"1px solid var(--border)" }}>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px", margin:"18px 0 12px" }}>
                    <div style={{ padding:"14px", background:"var(--success-dim)", border:"1px solid rgba(34,197,94,0.15)", borderRadius:"var(--radius-sm)" }}>
                      <p style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.07em", textTransform:"uppercase", color:"var(--success)", marginBottom:"8px" }}>✦ Strengths</p>
                      {fb.strengths.map((s,i)=><p key={i} style={{ fontSize:"13px", color:"var(--text-second)", lineHeight:1.7, marginBottom:i<fb.strengths.length-1?"8px":0 }}>{s}</p>)}
                    </div>
                    <div style={{ padding:"14px", background:"var(--amber-dim)", border:"1px solid var(--amber-border)", borderRadius:"var(--radius-sm)" }}>
                      <p style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.07em", textTransform:"uppercase", color:"var(--amber)", marginBottom:"8px" }}>◈ Points of Possible Improvement</p>
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

/* ── Audit Log tab ───────────────────────────────────────── */
function AuditLog() {
  return (
    <div className="anim-fade-in">
      <Card style={{ marginBottom:"16px", padding:"16px 20px" }}>
        <p style={{ fontSize:"13px", color:"var(--text-second)", lineHeight:1.6 }}>
          Every AI-generated report is logged with an input hash, model version, and timestamp.
          This provides a full audit trail — any generated report can be traced back to the exact
          student inputs that produced it, supporting transparency and non-repudiation.
        </p>
      </Card>
      <div style={{ display:"grid", gap:"8px" }}>
        {auditLogs.map((log,i)=>(
          <Card key={i} style={{ padding:"14px 20px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"16px", flexWrap:"wrap" }}>
              <span style={{ width:"8px", height:"8px", borderRadius:"50%",
                background:log.status==="success"?"var(--success)":"var(--danger)",
                display:"inline-block", flexShrink:0 }} />
              <div style={{ flex:1, minWidth:"160px" }}>
                <p style={{ fontSize:"13px", fontWeight:600, color:"var(--text-primary)", marginBottom:"1px" }}>{log.faculty}</p>
                <p style={{ fontSize:"11px", color:"var(--text-muted)" }}>{log.code}</p>
              </div>
              <div style={{ minWidth:"80px" }}>
                <p style={{ fontSize:"12px", color:"var(--text-second)" }}>{log.inputs}</p>
                <p style={{ fontSize:"10px", color:"var(--text-muted)" }}>inputs</p>
              </div>
              <div style={{ minWidth:"160px" }}>
                <p style={{ fontSize:"10px", color:"var(--text-muted)", marginBottom:"1px" }}>Model version</p>
                <p style={{ fontSize:"11px", color:"var(--text-second)", fontFamily:"monospace" }}>{log.modelVersion}</p>
              </div>
              <div style={{ minWidth:"130px" }}>
                <p style={{ fontSize:"10px", color:"var(--text-muted)", marginBottom:"1px" }}>Input hash</p>
                <p style={{ fontSize:"11px", color:"var(--amber)", fontFamily:"monospace" }}>{log.hash}</p>
              </div>
              <p style={{ fontSize:"11px", color:"var(--text-muted)", minWidth:"120px", textAlign:"right" }}>{log.timestamp}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ── Main component ─────────────────────────────────────── */
export default function HRView() {
  const [tab, setTab] = useState("overview");
  const tabs = [
    { k:"overview",  l:"Overview"         },
    { k:"reports",   l:"Faculty Reports"  },
    { k:"feedback",  l:"AI Feedback"      },
    { k:"audit",     l:"Audit Log"        },
  ];

  return (
    <div className="anim-fade-up">
      <div style={{ display:"flex", gap:"6px", marginBottom:"24px", flexWrap:"wrap" }}>
        {tabs.map(t=><TabBtn key={t.k} label={t.l} active={tab===t.k} onClick={()=>setTab(t.k)} />)}
      </div>
      {tab==="overview"  && <Overview />}
      {tab==="reports"   && <FacultyReports />}
      {tab==="feedback"  && <AIFeedbackReview />}
      {tab==="audit"     && <AuditLog />}
    </div>
  );
}
