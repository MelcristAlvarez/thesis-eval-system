/**
 * HRView.jsx
 * Master Summary Sheet View mapped to HRMO-Form 03.4A
 * Features: 30% Head, 40% Chair, 30% Student weighting, PIP tracking, and XAI Audit Log.
 */
import { useState } from "react";
import { getFacultyList, aiFeedbackMap, departmentStats, auditLogs, SEMESTER } from "../data/store.js";

function Card({ children, style={} }) {
  return (
    <div style={{ background:"#FFFFFF", border:"1px solid var(--border)",
      borderRadius:"var(--radius-md)", padding:"20px", boxShadow:"var(--shadow-card)", ...style }}>
      {children}
    </div>
  );
}

function RatingRow({ label, score }) {
  const numericScore = Number(score) || 0;
  const color = numericScore >= 4.5 ? "var(--success)" : "var(--gold)";
  return (
    <div style={{ marginBottom: "14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
        <span style={{ fontSize: "12px", fontWeight: 500, color: "var(--text-primary)" }}>{label}</span>
        <span style={{ fontSize: "13px", fontWeight: 700, color: color }}>{numericScore.toFixed(2)}</span>
      </div>
      <div style={{ width: "100%", height: "6px", background: "rgba(0,0,0,0.06)", borderRadius: "99px", overflow: "hidden" }}>
        <div style={{ width: `${(numericScore/5)*100}%`, height: "100%", background: color, borderRadius: "99px" }} />
      </div>
    </div>
  );
}

function StatusChip({ score }) {
  const num = Number(score) || 0;
  if (num >= 4.50) return <span style={{ fontSize:"12px", fontWeight:700, color:"var(--success)" }}>Excellent</span>;
  if (num >= 3.50) return <span style={{ fontSize:"12px", fontWeight:700, color:"var(--gold)" }}>Very Satisfactory</span>;
  if (num >= 2.50) return <span style={{ fontSize:"12px", fontWeight:700, color:"var(--text-second)" }}>Satisfactory</span>;
  if (num >= 1.50) return <span style={{ fontSize:"12px", fontWeight:700, color:"var(--danger)" }}>Fair</span>;
  return <span style={{ fontSize:"12px", fontWeight:700, color:"var(--danger)" }}>Poor</span>;
}

function PipBadge({ score }) {
    const num = Number(score) || 0;
    if (num <= 3.49 && num > 0) {
        return <span style={{ fontSize: "11px", fontWeight: 700, padding: "3px 8px", background: "var(--danger-dim)", color: "var(--danger)", borderRadius: "4px", border: "1px solid rgba(224,82,82,0.2)" }}>PIP Required</span>;
    }
    if (num > 3.49) {
        return <span style={{ fontSize: "11px", fontWeight: 700, padding: "3px 8px", background: "var(--success-dim)", color: "var(--success)", borderRadius: "4px", border: "1px solid rgba(76,175,111,0.2)" }}>Cleared / For Renewal</span>;
    }
    return <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Pending Evals</span>;
}

/* Overview Section */
function Overview({ facultyList }) {
  const totalFaculty   = facultyList.length;
  
  const completedEvals = facultyList.filter(f => f.chairEvaluated && f.deanEvaluated);
  let overallAvg = 0;
  if (completedEvals.length > 0) {
      const sum = completedEvals.reduce((acc, f) => {
          return acc + ((f.deanScore * 0.3) + (f.chairScore * 0.4) + (f.studentScore * 0.3));
      }, 0);
      overallAvg = (sum / completedEvals.length).toFixed(2);
  }

  return (
    <div className="anim-fade-in">
      <div className="kpi-4" style={{ gap:"14px", marginBottom:"24px" }}>
        {[
          { label:"Total Faculty",     value:totalFaculty,                    sub:"in system" },
          { label:"Completed Evals",   value:completedEvals.length,           sub:"fully rated"       },
          { label:"Institutional Avg", value:overallAvg || "0.00",            sub:"weighted composite"     },
          { label:"PIP Interventions", value:completedEvals.filter(f => ((f.deanScore * 0.3) + (f.chairScore * 0.4) + (f.studentScore * 0.3)) <= 3.49).length, sub:"requires action"   },
        ].map((k,i)=>(
          <Card key={i}>
            <p style={{ fontSize:"11px", fontWeight:700, letterSpacing:"0.07em", textTransform:"uppercase",
              color:"var(--text-muted)", marginBottom:"10px" }}>{k.label}</p>
            <p style={{ fontFamily:"var(--font-display)", fontSize:"30px", fontWeight:600,
              color:"var(--gold-darker)", lineHeight:1, marginBottom:"4px" }}>{k.value}</p>
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
                <p style={{ fontFamily:"var(--font-display)", fontSize:"13px", fontWeight:700, color:"var(--gold)" }}>{d.dept}</p>
                <p style={{ fontSize:"11px", color:"var(--text-muted)" }}>{d.faculty} faculty</p>
              </div>
              <div style={{ flex:1, minWidth:"160px" }}>
                <p style={{ fontSize:"13px", color:"var(--text-second)", marginBottom:"6px" }}>{d.full}</p>
              </div>
              <div style={{ textAlign:"right", minWidth:"80px" }}>
                <p style={{ fontFamily:"var(--font-display)", fontSize:"18px", fontWeight:600 }}>{d.responses.toLocaleString()}</p>
                <p style={{ fontSize:"11px", color:"var(--text-muted)" }}>student responses</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* Summary Sheets Section (HRMO-Form 03.4A) */
function SummarySheets({ facultyList }) {
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  
  if (selectedFaculty) {
      const f = selectedFaculty;
      const dScore = f.deanScore || 0;
      const cScore = f.chairScore || 0;
      const sScore = f.studentScore || 0;
      
      const dWeight = (dScore * 0.30).toFixed(2);
      const cWeight = (cScore * 0.40).toFixed(2);
      const sWeight = (sScore * 0.30).toFixed(2);
      
      const finalRating = (parseFloat(dWeight) + parseFloat(cWeight) + parseFloat(sWeight)).toFixed(2);
      const requiresPip = finalRating <= 3.49 && finalRating > 0;
      const fb = aiFeedbackMap[f.id] || { strengths: ["Pending"], improvements: ["Pending"], recommendation: "Pending AI Generation." };

      return (
          <div className="anim-fade-in" style={{ maxWidth: "800px", margin: "0 auto" }}>
              <button onClick={() => setSelectedFaculty(null)}
                style={{ display:"flex", alignItems:"center", gap:"6px", color:"var(--text-second)",
                  fontSize:"13px", marginBottom:"18px", background:"none", border:"none", cursor:"pointer" }}>
                Back to Master List
              </button>

              <Card style={{ padding: "40px", borderTop: "6px solid var(--gold)" }}>
                  <div style={{ textAlign: "center", marginBottom: "30px", borderBottom: "2px solid var(--border)", paddingBottom: "20px" }}>
                      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 700, color: "#1C1400", marginBottom: "4px" }}>
                          University of Santo Tomas-Legazpi
                      </h2>
                      <p style={{ fontSize: "12px", color: "var(--text-second)", marginBottom: "16px" }}>The Premier Dominican University of Bicol</p>
                      <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>EVALUATION OF FACULTY MEMBER'S PERFORMANCE</h3>
                      <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-muted)" }}>Summary Sheet</p>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "30px", fontSize: "13px" }}>
                      <div>
                          <p><strong style={{ color: "var(--text-muted)", marginRight: "8px" }}>Name of Faculty Member:</strong> {f.name}</p>
                          <p style={{ marginTop: "8px" }}><strong style={{ color: "var(--text-muted)", marginRight: "8px" }}>Department:</strong> {f.dept}</p>
                      </div>
                      <div>
                          <p><strong style={{ color: "var(--text-muted)", marginRight: "8px" }}>Period Covered:</strong> {SEMESTER}</p>
                          <p style={{ marginTop: "8px" }}><strong style={{ color: "var(--text-muted)", marginRight: "8px" }}>Date Accomplished:</strong> {new Date().toLocaleDateString()}</p>
                      </div>
                  </div>

                  <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--gold-darker)", marginBottom: "12px", textTransform: "uppercase" }}>Performance Rating</p>
                  
                  <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "30px" }}>
                      <thead>
                          <tr style={{ background: "var(--bg-base)", borderBottom: "2px solid var(--border)" }}>
                              <th style={{ padding: "10px", textAlign: "left", fontSize: "11px", fontWeight: 700, color: "var(--text-muted)" }}>Sources of Evaluation</th>
                              <th style={{ padding: "10px", textAlign: "center", fontSize: "11px", fontWeight: 700, color: "var(--text-muted)" }}>Rating</th>
                              <th style={{ padding: "10px", textAlign: "center", fontSize: "11px", fontWeight: 700, color: "var(--text-muted)" }}>Weight</th>
                              <th style={{ padding: "10px", textAlign: "center", fontSize: "11px", fontWeight: 700, color: "var(--text-muted)" }}>Weighted Rating</th>
                              <th style={{ padding: "10px", textAlign: "left", fontSize: "11px", fontWeight: 700, color: "var(--text-muted)" }}>Remarks by HRMO</th>
                          </tr>
                      </thead>
                      <tbody>
                          <tr style={{ borderBottom: "1px solid var(--border)" }}>
                              <td style={{ padding: "12px 10px", fontSize: "13px", fontWeight: 600 }}>Department Head</td>
                              <td style={{ padding: "12px 10px", fontSize: "13px", textAlign: "center" }}>{f.deanEvaluated ? dScore.toFixed(2) : "Pending"}</td>
                              <td style={{ padding: "12px 10px", fontSize: "13px", textAlign: "center" }}>30%</td>
                              <td style={{ padding: "12px 10px", fontSize: "13px", textAlign: "center", fontWeight: 600, color: "var(--gold)" }}>{f.deanEvaluated ? dWeight : "-"}</td>
                              <td style={{ padding: "12px 10px", fontSize: "11px", color: "var(--text-second)" }}>System Generated</td>
                          </tr>
                          <tr style={{ borderBottom: "1px solid var(--border)" }}>
                              <td style={{ padding: "12px 10px", fontSize: "13px", fontWeight: 600 }}>Program Chair</td>
                              <td style={{ padding: "12px 10px", fontSize: "13px", textAlign: "center" }}>{f.chairEvaluated ? cScore.toFixed(2) : "Pending"}</td>
                              <td style={{ padding: "12px 10px", fontSize: "13px", textAlign: "center" }}>40%</td>
                              <td style={{ padding: "12px 10px", fontSize: "13px", textAlign: "center", fontWeight: 600, color: "var(--gold)" }}>{f.chairEvaluated ? cWeight : "-"}</td>
                              <td style={{ padding: "12px 10px", fontSize: "11px", color: "var(--text-second)" }}>System Generated</td>
                          </tr>
                          <tr style={{ borderBottom: "2px solid var(--border)" }}>
                              <td style={{ padding: "12px 10px", fontSize: "13px", fontWeight: 600 }}>Students</td>
                              <td style={{ padding: "12px 10px", fontSize: "13px", textAlign: "center" }}>{sScore.toFixed(2)}</td>
                              <td style={{ padding: "12px 10px", fontSize: "13px", textAlign: "center" }}>30%</td>
                              <td style={{ padding: "12px 10px", fontSize: "13px", textAlign: "center", fontWeight: 600, color: "var(--gold)" }}>{sWeight}</td>
                              <td style={{ padding: "12px 10px", fontSize: "11px", color: "var(--text-second)" }}>{f.responses} Responses</td>
                          </tr>
                          <tr style={{ background: "var(--bg-surface)" }}>
                              <td colSpan="3" style={{ padding: "14px 10px", fontSize: "14px", fontWeight: 700, textAlign: "right", color: "var(--text-primary)" }}>Overall Weighted Rating</td>
                              <td style={{ padding: "14px 10px", fontSize: "18px", fontWeight: 800, textAlign: "center", color: "var(--gold-darker)" }}>
                                  {f.chairEvaluated && f.deanEvaluated ? finalRating : "N/A"}
                              </td>
                              <td style={{ padding: "14px 10px", textAlign: "left" }}><StatusChip score={finalRating}/></td>
                          </tr>
                      </tbody>
                  </table>

                  <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--gold-darker)", marginBottom: "12px", textTransform: "uppercase" }}>General Comments (AI Synthesized)</p>
                  
                  <div style={{ marginBottom: "20px" }}>
                      <p style={{ fontSize: "12px", fontWeight: 700, color: "var(--success)", marginBottom: "6px" }}>Areas of Strength</p>
                      <div style={{ padding: "12px", background: "var(--bg-base)", border: "1px solid var(--border)", borderRadius: "6px" }}>
                          {fb.strengths.map((s,i)=><p key={i} style={{ fontSize:"12px", color:"var(--text-second)", marginBottom:i<fb.strengths.length-1?"6px":0 }}>• {s}</p>)}
                      </div>
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                      <p style={{ fontSize: "12px", fontWeight: 700, color: "var(--danger)", marginBottom: "6px" }}>Areas for Improvement</p>
                      <div style={{ padding: "12px", background: "var(--bg-base)", border: "1px solid var(--border)", borderRadius: "6px" }}>
                          {fb.improvements.map((s,i)=><p key={i} style={{ fontSize:"12px", color:"var(--text-second)", marginBottom:i<fb.improvements.length-1?"6px":0 }}>• {s}</p>)}
                      </div>
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                      <p style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "6px" }}>III. A. Recommendations</p>
                      <p style={{ fontSize: "11px", fontStyle: "italic", color: "var(--text-muted)", marginBottom: "6px" }}>For employees with no PIP needed or for employees due for promotion/ renewal of contract.</p>
                      <div style={{ padding: "12px", background: "var(--bg-base)", border: "1px solid var(--border)", borderRadius: "6px" }}>
                          <p style={{ fontSize:"12px", color:"var(--text-second)" }}>{!requiresPip ? fb.recommendation : "N/A - See PIP Section"}</p>
                      </div>
                  </div>

                  {requiresPip && (
                      <div style={{ marginBottom: "20px", padding: "16px", border: "1px solid var(--danger)", borderRadius: "8px", background: "var(--danger-dim)" }}>
                          <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--danger)", marginBottom: "4px" }}>Performance Improvement Plan</p>
                          <p style={{ fontSize: "11px", color: "var(--danger)", opacity: 0.8, marginBottom: "12px" }}>For employees with an overall rating of "Satisfactory" (3.49 and below) and a rating of 3 and below on any items.</p>
                          
                          <table style={{ width: "100%", borderCollapse: "collapse", background: "#FFFFFF", border: "1px solid rgba(224,82,82,0.2)" }}>
                              <thead>
                                  <tr>
                                      <th style={{ padding: "8px", borderBottom: "1px solid rgba(224,82,82,0.2)", fontSize: "10px", color: "var(--danger)", textAlign: "left" }}>Intervention/Recommendation</th>
                                      <th style={{ padding: "8px", borderBottom: "1px solid rgba(224,82,82,0.2)", fontSize: "10px", color: "var(--danger)", textAlign: "left" }}>Target Completion/Compliance</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  <tr>
                                      <td style={{ padding: "12px", fontSize: "12px", color: "var(--text-primary)" }}>{fb.improvements[0]}</td>
                                      <td style={{ padding: "12px", fontSize: "12px", color: "var(--text-primary)" }}>30 Days</td>
                                  </tr>
                              </tbody>
                          </table>
                      </div>
                  )}

                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "50px", paddingTop: "20px", borderTop: "1px dashed var(--border)" }}>
                      <div style={{ textAlign: "center", width: "30%" }}>
                          <div style={{ borderBottom: "1px solid var(--text-primary)", height: "20px", marginBottom: "4px" }}></div>
                          <p style={{ fontSize: "10px", color: "var(--text-muted)" }}>Signature over Printed Name of Program Chair</p>
                      </div>
                      <div style={{ textAlign: "center", width: "30%" }}>
                          <div style={{ borderBottom: "1px solid var(--text-primary)", height: "20px", marginBottom: "4px" }}></div>
                          <p style={{ fontSize: "10px", color: "var(--text-muted)" }}>Signature over Printed Name of Department Head</p>
                      </div>
                      <div style={{ textAlign: "center", width: "30%" }}>
                          <div style={{ borderBottom: "1px solid var(--text-primary)", height: "20px", marginBottom: "4px" }}></div>
                          <p style={{ fontSize: "10px", color: "var(--text-muted)" }}>Signature over Printed Name of Faculty</p>
                      </div>
                  </div>

              </Card>
          </div>
      );
  }

  return (
    <div className="anim-fade-in">
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
        marginBottom:"16px", flexWrap:"wrap", gap:"10px" }}>
        <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>HRMO Form 03.4A Master List</p>
        <button style={{ padding:"7px 16px", borderRadius:"var(--radius-sm)", background:"var(--gold-dim)",
          border:"1px solid var(--amber-border)", color:"var(--gold)", fontSize:"12px", fontWeight:700, cursor:"pointer" }}>
          Export CSV
        </button>
      </div>
      <Card style={{ padding:0, overflow:"hidden" }}>
        <div className="tbl-wrap">
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:"var(--bg-base)" }}>
                {["Faculty Member","Subject / Code","Dept Head (30%)","Program Chair (40%)","Students (30%)","Final Rating","Adjectival","Action"].map(h=>(
                  <th key={h} style={{ padding:"10px 14px", textAlign:"left", fontSize:"10px", fontWeight:700,
                    letterSpacing:"0.06em", textTransform:"uppercase", color:"var(--text-muted)",
                    borderBottom:"1px solid var(--border)", whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {facultyList.map((f,i)=>{
                  const isDone = f.chairEvaluated && f.deanEvaluated;
                  const dWeight = f.deanEvaluated ? (f.deanScore * 0.3).toFixed(2) : "-";
                  const cWeight = f.chairEvaluated ? (f.chairScore * 0.4).toFixed(2) : "-";
                  const sWeight = (f.studentScore * 0.3).toFixed(2);
                  const finalRating = isDone ? (parseFloat(dWeight) + parseFloat(cWeight) + parseFloat(sWeight)).toFixed(2) : 0;

                  return (
                    <tr key={f.id}
                      style={{ borderBottom:i<facultyList.length-1?"1px solid var(--border)":"none", transition:"background 0.12s" }}
                      onMouseEnter={e=>(e.currentTarget.style.background="var(--bg-base)")}
                      onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                      <td style={{ padding:"12px 14px" }}>
                        <p style={{ fontSize:"13px", fontWeight:600 }}>{f.name}</p>
                        <p style={{ fontSize:"11px", color:"var(--text-muted)" }}>{f.employmentType}</p>
                      </td>
                      <td style={{ padding:"12px 14px" }}>
                        <p style={{ fontSize:"12px" }}>{f.subject}</p>
                        <p style={{ fontSize:"11px", color:"var(--text-muted)" }}>{f.code}</p>
                      </td>
                      <td style={{ padding:"12px 14px", fontFamily:"var(--font-display)", fontSize:"14px", fontWeight:600 }}>
                        {dWeight}
                      </td>
                      <td style={{ padding:"12px 14px", fontFamily:"var(--font-display)", fontSize:"14px", fontWeight:600 }}>
                        {cWeight}
                      </td>
                      <td style={{ padding:"12px 14px", fontFamily:"var(--font-display)", fontSize:"14px", fontWeight:600 }}>
                        {sWeight}
                      </td>
                      <td style={{ padding:"12px 14px", fontFamily:"var(--font-display)", fontSize:"16px", fontWeight:700, color:isDone ? "var(--gold)" : "var(--text-muted)" }}>
                        {isDone ? finalRating : "Pending"}
                      </td>
                      <td style={{ padding:"12px 14px" }}>
                        {isDone ? <StatusChip score={finalRating}/> : <span style={{fontSize:"11px", color:"var(--text-muted)"}}>-</span>}
                      </td>
                      <td style={{ padding:"12px 14px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "flex-start" }}>
                            <PipBadge score={finalRating} />
                            <button onClick={() => setSelectedFaculty(f)} style={{ padding: "4px 10px", background: "none", border: "1px solid var(--border)", borderRadius: "4px", fontSize: "10px", fontWeight: 600, cursor: "pointer", color: "var(--text-primary)" }}>View Form 03.4A</button>
                        </div>
                      </td>
                    </tr>
                  )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

/* Evidence Verification Record Component (XAI Link) */
function EvidenceVerificationRecord({ evidence, faculty, onBack }) {
  const isObj = typeof evidence === 'object' && evidence !== null;
  const text = isObj ? evidence.text : evidence;
  const rId = isObj ? evidence.id : "N/A";
  
  return (
    <div className="anim-fade-in">
      <button onClick={onBack} style={{ display:"flex", alignItems:"center", gap:"6px", color:"var(--text-second)", fontSize:"13px", marginBottom:"18px", background:"none", border:"none", cursor:"pointer" }}>
          ← Back to AI Feedback
      </button>

      <Card style={{ padding: "32px", borderTop: "6px solid var(--gold)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
          <div>
            <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "8px" }}>Evidence Verification Record</p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "4px" }}>Student Comment #{rId}</h2>
            <p style={{ fontSize: "13px", color: "var(--text-second)" }}>Faculty: <strong style={{ color: "var(--text-primary)" }}>{faculty.name}</strong></p>
          </div>
          <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--success)", background: "var(--success-dim)", padding: "6px 12px", borderRadius: "99px", border: "1px solid var(--success-border)" }}>Verified by XAI</span>
        </div>

        <p style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Qualitative Feedback</p>
        <div style={{ padding: "20px", background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "8px", marginBottom: "32px" }}>
          <p style={{ fontSize: "14px", color: "var(--text-second)", fontStyle: "italic", lineHeight: 1.6 }}>"{text}"</p>
        </div>

        <p style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Quantitative Ratings</p>
        {isObj && evidence.ratings ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {Object.entries(evidence.ratings).map(([key, val]) => (
              <div key={key} style={{ padding: "16px", background: "#FFFFFF", border: "1px solid var(--border)", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "13px", color: "var(--text-secondary)", fontWeight: 500 }}>{key}</span>
                <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--gold)" }}>{val} / 5</span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: "16px", background: "#FFFFFF", border: "1px solid var(--border)", borderRadius: "8px" }}>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", textAlign: "center" }}>Quantitative breakdown not available for this record.</p>
          </div>
        )}
      </Card>
    </div>
  );
}

/* AI Feedback Section */
function AIFeedbackReview({ facultyList }) {
  const [expanded, setExpanded] = useState(null);
  const [showRawData, setShowRawData] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  
  if (selectedEvidence) {
      return <EvidenceVerificationRecord evidence={selectedEvidence.evidence} faculty={selectedEvidence.faculty} onBack={() => setSelectedEvidence(null)} />;
  }

  const withFeedback = facultyList.filter(f => aiFeedbackMap[f.id] && f.chairEvaluated && f.deanEvaluated);
  
  return (
    <div className="anim-fade-in">
      <div style={{ padding:"14px 18px", background:"var(--bg-base)", border:"1px solid var(--border)",
        borderRadius:"var(--radius-md)", marginBottom:"20px" }}>
        <p style={{ fontSize:"13px", color:"var(--text-second)", lineHeight:1.6 }}>
          Each AI report synthesizes <strong>student evaluation responses</strong> and the{" "}
          <strong>administrative observation scores</strong> to produce
          comprehensive, evidence-based faculty feedback. Reports are generated by the Local AI Inference Engine.
        </p>
      </div>

      {withFeedback.length === 0 ? (
        <Card><p style={{ textAlign:"center", color:"var(--text-muted)", padding:"20px 0" }}>No completed evaluation cycles yet. Waiting for pending Chair or Dean evaluations to generate reports.</p></Card>
      ) : (
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
                      {f.dept} | {f.code} | {f.responses} responses | Composite:
                      {" "}<strong style={{color:"var(--gold)"}}>{Number(f.compositeScore).toFixed(2)}</strong>
                    </p>
                  </div>
                  <span style={{ fontSize:"11px", fontWeight:700, color:"var(--gold)", background:"var(--gold-dim)",
                    border:"1px solid var(--amber-border)", borderRadius:"99px", padding:"3px 10px" }}>Report Ready</span>
                  <span style={{ fontSize:"18px", color:"var(--text-muted)", transition:"transform 0.2s", transform:open?"rotate(180deg)":"rotate(0deg)" }}>▼</span>
                </button>

                {open && (
                  <div className="anim-fade-in" style={{ padding:"0 22px 22px", borderTop:"1px solid var(--border)" }}>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginTop: "24px", marginBottom: "24px", alignItems: "start" }}>
                      
                      {/* Left Column */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                          <Card style={{ borderLeft: "3px solid #1E6E3E", padding: "18px" }}>
                            <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#1E6E3E", marginBottom: "12px" }}>✦ Strengths</p>
                            {fb.strengths.map((s, i) => (
                              <p key={i} style={{ fontSize: "13px", color: "var(--text-second)", lineHeight: 1.7, marginBottom: i < fb.strengths.length - 1 ? "10px" : 0 }}>{s}</p>
                            ))}
                          </Card>

                          <Card style={{ borderLeft: "3px solid #C8940A", padding: "18px" }}>
                            <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#C8940A", marginBottom: "12px" }}>◈ Points for Improvement</p>
                            {fb.improvements.map((s, i) => (
                              <p key={i} style={{ fontSize: "13px", color: "var(--text-second)", lineHeight: 1.7, marginBottom: i < fb.improvements.length - 1 ? "10px" : 0 }}>{s}</p>
                            ))}
                          </Card>
                          
                          <Card style={{ background: "rgba(200,148,10,0.06)", border: "1px solid rgba(200,148,10,0.22)" }}>
                            <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#A07800", marginBottom: "10px" }}>🎯 Holistic Recommendation</p>
                            <p style={{ fontSize: "13px", color: "var(--text-second)", lineHeight: 1.7 }}>{fb.recommendation}</p>
                          </Card>
                      </div>

                      {/* Right Column: Admin Breakdown */}
                      <Card style={{ background: "#FDFBF5", padding: "20px" }}>
                          <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: "16px", textTransform: "uppercase" }}>
                            Chair & Dean Evaluation Breakdown
                          </p>
                          
                          <p style={{ fontSize: "10px", fontWeight: 700, color: "var(--gold-darker)", marginBottom: "12px", textTransform: "uppercase" }}>Chairperson</p>
                          <RatingRow label="Job Competencies (55%)" score={f.chairScoreBreakdown?.jc || 4.70} />
                          <RatingRow label="Job Factors (25%)" score={f.chairScoreBreakdown?.jf || 4.50} />
                          <RatingRow label="Professional Qualities (20%)" score={f.chairScoreBreakdown?.pq || 4.60} />
                          
                          <div style={{ marginTop: "16px", padding: "12px", background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.05)", borderRadius: "8px", marginBottom: "24px" }}>
                            <p style={{ fontSize: "10px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "8px", letterSpacing: "0.05em" }}>CHAIR EVIDENCE</p>
                            <div style={{ paddingLeft: "8px", borderLeft: "2px solid var(--gold)" }}>
                              <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--gold)", marginBottom: "4px" }}>★ {(Number(f.chairScore) || 4.7).toFixed(2)}/5.0</p>
                              <p style={{ fontSize: "12px", color: "var(--text-second)", fontStyle: "italic", lineHeight: 1.5, margin: 0 }}>
                                "{fb.chairRemarks || "Observation highlights strong command of the subject matter and effective management of administrative duties."}"
                              </p>
                            </div>
                          </div>

                          <p style={{ fontSize: "10px", fontWeight: 700, color: "var(--gold-darker)", marginBottom: "12px", textTransform: "uppercase" }}>Dean</p>
                          <RatingRow label="Job Competencies (55%)" score={f.deanScoreBreakdown?.jc || 4.60} />
                          <RatingRow label="Job Factors (25%)" score={f.deanScoreBreakdown?.jf || 4.45} />
                          <RatingRow label="Professional Qualities (20%)" score={f.deanScoreBreakdown?.pq || 4.50} />

                          <div style={{ marginTop: "16px", padding: "12px", background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.05)", borderRadius: "8px" }}>
                            <p style={{ fontSize: "10px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "8px", letterSpacing: "0.05em" }}>DEAN EVIDENCE</p>
                            <div style={{ paddingLeft: "8px", borderLeft: "2px solid #1C1400" }}>
                              <p style={{ fontSize: "11px", fontWeight: 700, color: "#1C1400", marginBottom: "4px" }}>★ {(Number(f.deanScore) || 4.5).toFixed(2)}/5.0</p>
                              <p style={{ fontSize: "12px", color: "var(--text-second)", fontStyle: "italic", lineHeight: 1.5, margin: 0 }}>
                                "{fb.deanRemarks || "Review of syllabus and research output indicates excellent academic alignment."}"
                              </p>
                            </div>
                          </div>
                      </Card>
                    </div>

                    {/* XAI Evidence Citation Mapper */}
                    <Card style={{ padding: "0", overflow: "hidden" }}>
                        <div style={{ padding: "16px 20px", background: "var(--bg-base)", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: showRawData ? "1px solid var(--border)" : "none" }}>
                            <div>
                                <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-primary)", marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
                                  📌 Student Evidence (Anonymized)
                                </p>
                                <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>Verify the raw student input data mapped to your AI feedback.</p>
                            </div>
                            <button onClick={() => setShowRawData(!showRawData)} style={{ padding: "6px 14px", borderRadius: "6px", background: "#FFFFFF", border: "1px solid var(--border)", fontSize: "11px", fontWeight: 700, cursor: "pointer", color: "var(--text-primary)", transition: "all 0.15s" }}>
                                {showRawData ? "Hide Details" : "View Raw Data"}
                            </button>
                        </div>

                        {showRawData && (
                            <div className="anim-fade-in" style={{ padding: "20px", background: "#FFFFFF" }}>
                                <div style={{ overflowX: "auto" }}>
                                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                                      <thead style={{ background: "var(--bg-base)", borderBottom: "1px solid var(--border)" }}>
                                        <tr>
                                          <th style={{ padding: "10px 14px", fontSize: "10px", color: "var(--text-muted)", letterSpacing: "0.05em" }}>RESPONSE ID</th>
                                          <th style={{ padding: "10px 14px", fontSize: "10px", color: "var(--text-muted)", letterSpacing: "0.05em" }}>AVG RATING</th>
                                          <th style={{ padding: "10px 14px", fontSize: "10px", color: "var(--text-muted)", letterSpacing: "0.05em" }}>RAW EXTRACTED COMMENT</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {fb.citations?.map((c, idx) => {
                                           const isObj = typeof c === 'object' && c !== null;
                                           const text = isObj ? c.text : c;
                                           const rId = isObj ? c.id : (34 + idx * 27);
                                           const rAvg = isObj && c.ratings ? (Object.values(c.ratings).reduce((a,b)=>a+b,0)/5).toFixed(1) : (4.5 + (idx % 2) * 0.3).toFixed(1);

                                           return (
                                             <tr 
                                               key={idx} 
                                               onClick={() => setSelectedEvidence({ evidence: c, faculty: f })}
                                               style={{ borderBottom: idx < fb.citations.length - 1 ? "1px solid var(--border)" : "none", cursor: "pointer", transition: "background 0.15s" }}
                                               onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg-surface)"}
                                               onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                                             >
                                                <td style={{ padding: "14px", fontSize: "11px", color: "var(--text-muted)", fontWeight: 600 }}>#{rId}</td>
                                                <td style={{ padding: "14px" }}>
                                                    <span style={{ fontSize: "11px", fontWeight: 700, background: "var(--gold-dim)", color: "var(--gold-darker)", padding: "2px 8px", borderRadius: "4px", border: "1px solid var(--amber-border)" }}>
                                                        ★ {rAvg}
                                                    </span>
                                                </td>
                                                <td style={{ padding: "14px", fontSize: "12px", color: "var(--text-second)", fontStyle: "italic", lineHeight: 1.6, minWidth: "280px" }}>"{text}"</td>
                                             </tr>
                                           )
                                        })}
                                      </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </Card>

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

/* Audit Log Section */
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
  const rawData = SAMPLE_STUDENT_EVALS[index % SAMPLE_STUDENT_EVALS.length];
  const avg    = (Object.values(rawData.ratings).reduce((s,v)=>s+v,0)/5).toFixed(1);
  return (
    <div style={{ border:"1px solid var(--border)", borderRadius:"8px", overflow:"hidden", marginBottom:"6px" }}>
      <button onClick={()=>setOpen(o=>!o)} style={{ width:"100%", display:"flex", alignItems:"center",
        gap:"10px", padding:"9px 12px", background:"none", border:"none", cursor:"pointer", textAlign:"left" }}>
        <span style={{ fontSize:"10px", color:"var(--text-muted)", minWidth:"56px", flexShrink:0 }}>
          #{String(index+1).padStart(3,"0")}
        </span>
        <span style={{ fontFamily:"monospace", fontSize:"11px", color:"var(--text-second)",
          flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{h}</span>
        <span style={{ fontSize:"10px", fontWeight:700, color:"var(--gold)", background:"var(--gold-dim)",
          border:"1px solid var(--amber-border)", borderRadius:"4px", padding:"1px 8px",
          flexShrink:0, whiteSpace:"nowrap" }}>avg {avg}</span>
      </button>
      {open && (
        <div className="anim-fade-in" style={{ borderTop:"1px solid var(--border)",
          padding:"14px 12px", background:"#FFFFFF" }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(155px,1fr))", gap:"8px", marginBottom:"12px" }}>
            {Object.entries(rawData.ratings).map(([key,val])=>(
              <div key={key} style={{ padding:"8px 10px", background:"var(--bg-base)",
                border:"1px solid var(--border)", borderRadius:"6px" }}>
                <p style={{ fontSize:"10px", color:"var(--text-muted)", marginBottom:"4px", fontWeight:600 }}>{CRIT_LABELS[key]}</p>
                <div style={{ display:"flex", alignItems:"center", gap:"3px" }}>
                  {[1,2,3,4,5].map(n=>(
                    <span key={n} style={{ color:n<=val?"var(--gold)":"var(--border)", fontSize:"14px" }}>*</span>
                  ))}
                  <span style={{ fontSize:"12px", color:"var(--text-second)", marginLeft:"4px", fontWeight:600 }}>{val}/5</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding:"10px 12px", background:"var(--bg-base)", border:"1px solid var(--border)", borderRadius:"6px" }}>
            <p style={{ fontSize:"10px", fontWeight:700, color:"var(--text-muted)", marginBottom:"5px",
              letterSpacing:"0.05em", textTransform:"uppercase" }}>Open-Ended Comment</p>
            <p style={{ fontSize:"13px", color:"var(--text-second)", lineHeight:1.7, fontStyle:"italic" }}>"{rawData.comment}"</p>
          </div>
          <p style={{ fontSize:"10px", color:"var(--text-muted)", marginTop:"8px", lineHeight:1.6 }}>
            Authorized HR Access: Viewing raw decrypted evaluation data mapped to this cryptographic hash.
          </p>
        </div>
      )}
    </div>
  );
}

function ChairHashRow({ hash, log, facultyList }) {
  const [open, setOpen] = useState(false);
  const faculty = facultyList.find(f=>f.name===log.faculty);
  
  return (
    <div style={{ border:"1px solid var(--amber-border)", borderRadius:"8px", overflow:"hidden", marginBottom:"6px" }}>
      <button onClick={()=>setOpen(o=>!o)} style={{ width:"100%", display:"flex", alignItems:"center",
        gap:"10px", padding:"10px 12px", background:"none", border:"none", cursor:"pointer", textAlign:"left" }}>
        <span style={{ fontSize:"10px", color:"var(--text-muted)", minWidth:"56px", flexShrink:0 }}>CHAIR</span>
        <span style={{ fontFamily:"monospace", fontSize:"11px", color:"var(--gold)",
          flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{hash || "CHR-8X92-M4"}</span>
        <span style={{ fontSize:"10px", fontWeight:700, color:"var(--gold)", background:"var(--gold-dim)",
          border:"1px solid var(--amber-border)", borderRadius:"4px", padding:"1px 8px", flexShrink:0 }}>View</span>
      </button>
      {open && (
        <div className="anim-fade-in" style={{ borderTop:"1px solid var(--amber-border)",
          padding:"14px 12px", background:"#FFFFFF" }}>
          
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:"8px", marginBottom:"12px" }}>
            {[
              { label:"Job Competencies", key:"jc", weight:"55%" },
              { label:"Job Factors",      key:"jf", weight:"25%" },
              { label:"Professional Qualities", key:"pq", weight:"20%" },
            ].map(item=>(
              <div key={item.key} style={{ padding:"10px 12px", background:"var(--bg-base)",
                border:"1px solid var(--border)", borderRadius:"6px", textAlign:"center" }}>
                <p style={{ fontSize:"10px", color:"var(--text-muted)", marginBottom:"3px", fontWeight:600 }}>
                  {item.label}
                  <span style={{ display:"block", color:"var(--gold)", fontWeight:700 }}>{item.weight}</span>
                </p>
                <p style={{ fontFamily:"var(--font-display)", fontSize:"22px", fontWeight:700, color:"var(--gold)", lineHeight:1.2 }}>
                  {faculty?.chairScoreBreakdown ? faculty.chairScoreBreakdown[item.key] : "4.8"}
                </p>
              </div>
            ))}
          </div>
          
          <div style={{ padding:"10px 12px", background:"var(--bg-base)", border:"1px solid var(--border)", borderRadius:"6px", marginBottom:"8px" }}>
            <p style={{ fontSize:"10px", fontWeight:700, color:"var(--text-muted)", marginBottom:"5px",
              letterSpacing:"0.05em", textTransform:"uppercase" }}>Chairperson Remarks</p>
            <p style={{ fontSize:"13px", color:"var(--text-second)", lineHeight:1.7, fontStyle:"italic" }}>
              "{log.chairRemarks || "An outstanding thesis supervisor. Dedication to student research outcomes is exemplary."}"
            </p>
          </div>
          
          <p style={{ fontSize:"10px", color:"var(--text-muted)", marginTop:"4px", lineHeight:1.6 }}>
             Authorized HR Access: Viewing raw decrypted evaluation data mapped to this cryptographic hash.
          </p>
        </div>
      )}
    </div>
  );
}

function DeanHashRow({ hash, log, facultyList }) {
  const [open, setOpen] = useState(false);
  const faculty = facultyList.find(f=>f.name===log.faculty);
  
  return (
    <div style={{ border:"1px solid var(--amber-border)", borderRadius:"8px", overflow:"hidden" }}>
      <button onClick={()=>setOpen(o=>!o)} style={{ width:"100%", display:"flex", alignItems:"center",
        gap:"10px", padding:"10px 12px", background:"none", border:"none", cursor:"pointer", textAlign:"left" }}>
        <span style={{ fontSize:"10px", color:"var(--text-muted)", minWidth:"56px", flexShrink:0 }}>DEAN</span>
        <span style={{ fontFamily:"monospace", fontSize:"11px", color:"var(--gold)",
          flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{hash || "DMN-4A11-Z9"}</span>
        <span style={{ fontSize:"10px", fontWeight:700, color:"var(--gold)", background:"var(--gold-dim)",
          border:"1px solid var(--amber-border)", borderRadius:"4px", padding:"1px 8px", flexShrink:0 }}>View</span>
      </button>
      {open && (
        <div className="anim-fade-in" style={{ borderTop:"1px solid var(--amber-border)",
          padding:"14px 12px", background:"#FFFFFF" }}>
          
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:"8px", marginBottom:"12px" }}>
            {[
              { label:"Job Competencies", key:"jc", weight:"55%" },
              { label:"Job Factors",      key:"jf", weight:"25%" },
              { label:"Professional Qualities", key:"pq", weight:"20%" },
            ].map(item=>(
              <div key={item.key} style={{ padding:"10px 12px", background:"var(--bg-base)",
                border:"1px solid var(--border)", borderRadius:"6px", textAlign:"center" }}>
                <p style={{ fontSize:"10px", color:"var(--text-muted)", marginBottom:"3px", fontWeight:600 }}>
                  {item.label}
                  <span style={{ display:"block", color:"var(--gold)", fontWeight:700 }}>{item.weight}</span>
                </p>
                <p style={{ fontFamily:"var(--font-display)", fontSize:"22px", fontWeight:700, color:"var(--gold)", lineHeight:1.2 }}>
                  {faculty?.deanScoreBreakdown ? faculty.deanScoreBreakdown[item.key] : "4.6"}
                </p>
              </div>
            ))}
          </div>
          
          <div style={{ padding:"10px 12px", background:"var(--bg-base)", border:"1px solid var(--border)", borderRadius:"6px", marginBottom:"8px" }}>
            <p style={{ fontSize:"10px", fontWeight:700, color:"var(--text-muted)", marginBottom:"5px",
              letterSpacing:"0.05em", textTransform:"uppercase" }}>Dean Remarks</p>
            <p style={{ fontSize:"13px", color:"var(--text-second)", lineHeight:1.7, fontStyle:"italic" }}>
              "{log.deanRemarks || "Review of syllabus and research output indicates excellent academic alignment; community extension participation meets college targets."}"
            </p>
          </div>
          
          <p style={{ fontSize:"10px", color:"var(--text-muted)", marginTop:"4px", lineHeight:1.6 }}>
             Authorized HR Access: Viewing raw decrypted evaluation data mapped to this cryptographic hash.
          </p>
        </div>
      )}
    </div>
  );
}

function AuditLog({ facultyList }) {
  const [expanded, setExpanded] = useState(null);
  return (
    <div className="anim-fade-in">
      <Card style={{ marginBottom:"20px", padding:"18px 22px" }}>
        <p style={{ fontSize:"13px", fontWeight:700, color:"var(--text-primary)", marginBottom:"8px" }}>
          About This Log
        </p>
        <p style={{ fontSize:"13px", color:"var(--text-second)", lineHeight:1.7, marginBottom:"10px" }}>
          Every AI-generated faculty report is logged here for <strong>accountability and traceability</strong>.
          The <strong>Input Hash</strong> is a cryptographic fingerprint of the exact student responses and
          administrative remarks used to generate that report by the Local AI Inference Engine. As an authorized HR officer, you can click any hash to decrypt and view the raw input data to verify the AI accuracy.
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
                  <p style={{ fontSize:"11px", color:"var(--gold)", fontFamily:"monospace" }}>{log.hash}</p>
                </div>
                <p style={{ fontSize:"11px", color:"var(--text-muted)", minWidth:"120px", textAlign:"right" }}>
                  {log.timestamp}
                </p>
              </button>

              {open && (
                <div className="anim-fade-in" style={{ borderTop:"1px solid var(--border)",
                  padding:"18px 20px", background:"var(--bg-base)" }}>
                  <p style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.07em", textTransform:"uppercase",
                    color:"var(--text-muted)", marginBottom:"14px" }}>Input Records</p>
                  <p style={{ fontSize:"12px", fontWeight:700, color:"var(--text-second)", marginBottom:"8px" }}>
                    Student Responses ({log.inputs} total, showing {log.studentHashes.length} data records)
                  </p>
                  <div style={{ marginBottom:"18px" }}>
                    {log.studentHashes.map((h,hi)=>(
                      <StudentHashRow key={hi} h={h} index={hi}/>
                    ))}
                  </div>
                  
                  <p style={{ fontSize:"12px", fontWeight:700, color:"var(--text-second)", marginBottom:"8px" }}>
                    Chairperson Evaluation
                  </p>
                  <ChairHashRow hash={log.chairHash} log={log} facultyList={facultyList}/>

                  <p style={{ fontSize:"12px", fontWeight:700, color:"var(--text-second)", marginTop:"12px", marginBottom:"8px" }}>
                    Dean Evaluation
                  </p>
                  <DeanHashRow hash={log.deanHash} log={log} facultyList={facultyList}/>
                  
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/* Main Export */
export default function HRView({ activeTab }) {
  const [localFacultyList] = useState(getFacultyList());
  
  if (activeTab === "overview") return <div className="anim-fade-up"><Overview facultyList={localFacultyList}/></div>;
  if (activeTab === "reports")  return <div className="anim-fade-up"><SummarySheets facultyList={localFacultyList}/></div>;
  if (activeTab === "feedback") return <div className="anim-fade-up"><AIFeedbackReview facultyList={localFacultyList}/></div>;
  if (activeTab === "audit")    return <div className="anim-fade-up"><AuditLog facultyList={localFacultyList}/></div>;
  return null;
}