/**
 * HRView.jsx
 * - Separate rubrics for Student vs. Administration (Chair/Dean)
 * - Faculty Reports table includes Dean scores and evaluation status
 * - Audit Log grants HR direct access to view raw decrypted data for XAI verification
 * - Safely handles string-based number inputs to prevent rendering crashes
 */
import { useState } from "react";
import { facultyList, departmentStats, aiFeedbackMap, auditLogs, SEMESTER } from "../data/mockData.js";

function Card({ children, style={} }) {
  return (
    <div style={{ background:"#FFFFFF", border:"1px solid var(--border)",
      borderRadius:"var(--radius-md)", padding:"20px", boxShadow:"var(--shadow-card)", ...style }}>
      {children}
    </div>
  );
}

function ScoreBar({ score, max=5 }) {
  const numericScore = Number(score) || 0;
  return (
    <div style={{ flex:1, height:"5px", background:"var(--border)", borderRadius:"99px", overflow:"hidden" }}>
      <div style={{ width:`${(numericScore/max)*100}%`, height:"100%", background:"var(--gold)", borderRadius:"99px" }}/>
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

/* Overview Section */
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
                <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                  <ScoreBar score={d.avgScore}/>
                  <p style={{ fontFamily:"var(--font-display)", fontSize:"16px", fontWeight:600, color:"var(--text-primary)", flexShrink:0 }}>{Number(d.avgScore).toFixed(2)}</p>
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

/* Faculty Reports Section */
function FacultyReports() {
  const [deptFilter, setDeptFilter] = useState("ALL");
  const depts    = ["ALL","CEAFA","CASE","CBMA","CHS"];
  const filtered = deptFilter==="ALL" ? facultyList : facultyList.filter(f=>f.dept===deptFilter);
  const sMap = { excellent:{c:"var(--success)",l:"Excellent"}, good:{c:"var(--gold)",l:"Good"},
    average:{c:"var(--text-second)",l:"Average"}, needsSupport:{c:"var(--danger)",l:"Needs Support"} };
  return (
    <div className="anim-fade-in">
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
        marginBottom:"16px", flexWrap:"wrap", gap:"10px" }}>
        <div style={{ display:"flex", gap:"6px", flexWrap:"wrap" }}>
          {depts.map(d=>(
            <button key={d} onClick={()=>setDeptFilter(d)} style={{ padding:"5px 14px", borderRadius:"99px", fontSize:"12px", fontWeight:600,
              background:deptFilter===d?"var(--gold-dim)":"transparent",
              color:deptFilter===d?"var(--gold)":"var(--text-muted)",
              border:`1px solid ${deptFilter===d?"var(--gold-border)":"var(--border)"}` }}>{d}</button>
          ))}
        </div>
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
                {["Faculty","Subject / Code","Student","Chair","Dean","Composite","Status","Admin Evals"].map(h=>(
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
                  onMouseEnter={e=>(e.currentTarget.style.background="var(--bg-base)")}
                  onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                  <td style={{ padding:"12px 14px" }}>
                    <p style={{ fontSize:"13px", fontWeight:600 }}>{f.name}</p>
                    <p style={{ fontSize:"11px", color:"var(--text-muted)" }}>{f.responses} responses</p>
                  </td>
                  <td style={{ padding:"12px 14px" }}>
                    <p style={{ fontSize:"12px" }}>{f.subject}</p>
                    <p style={{ fontSize:"11px", color:"var(--text-muted)" }}>{f.code}</p>
                  </td>
                  <td style={{ padding:"12px 14px", fontFamily:"var(--font-display)", fontSize:"16px", fontWeight:600 }}>
                    {Number(f.studentScore).toFixed(2)}
                  </td>
                  <td style={{ padding:"12px 14px", fontFamily:"var(--font-display)", fontSize:"16px", fontWeight:600 }}>
                    {f.chairEvaluated ? Number(f.chairScore).toFixed(2) : <span style={{ fontSize:"12px", color:"var(--text-muted)" }}>-</span>}
                  </td>
                  <td style={{ padding:"12px 14px", fontFamily:"var(--font-display)", fontSize:"16px", fontWeight:600 }}>
                    {f.deanEvaluated ? Number(f.deanScore).toFixed(2) : <span style={{ fontSize:"12px", color:"var(--text-muted)" }}>-</span>}
                  </td>
                  <td style={{ padding:"12px 14px", fontFamily:"var(--font-display)", fontSize:"18px", fontWeight:600, color:"var(--gold)" }}>
                    {Number(f.compositeScore).toFixed(2)}
                  </td>
                  <td style={{ padding:"12px 14px" }}>
                    <span style={{ fontSize:"12px", fontWeight:700, color:(sMap[f.status]||sMap.average).c }}>
                      {(sMap[f.status]||sMap.average).l}
                    </span>
                  </td>
                  <td style={{ padding:"12px 14px" }}>
                    <div style={{ fontSize:"11px", fontWeight:600, display:"flex", flexDirection:"column", gap:"2px" }}>
                      <span style={{ color: f.chairEvaluated ? "var(--success)" : "var(--danger)" }}>
                        Chair: {f.chairEvaluated ? "Done" : "Pending"}
                      </span>
                      <span style={{ color: f.deanEvaluated ? "var(--success)" : "var(--danger)" }}>
                        Dean: {f.deanEvaluated ? "Done" : "Pending"}
                      </span>
                    </div>
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

/* AI Feedback Section */
function AIFeedbackReview() {
  const [expanded, setExpanded] = useState(null);
  const [rawExpanded, setRawExpanded] = useState(null);
  const withFeedback = facultyList.filter(f=>aiFeedbackMap[f.id]);
  
  return (
    <div className="anim-fade-in">
      <div style={{ padding:"14px 18px", background:"var(--bg-base)", border:"1px solid var(--border)",
        borderRadius:"var(--radius-md)", marginBottom:"20px" }}>
        <p style={{ fontSize:"13px", color:"var(--text-second)", lineHeight:1.6 }}>
          Each AI report synthesizes <strong>student evaluation responses</strong> and the{" "}
          <strong>administrative observation scores</strong> to produce
          comprehensive, evidence-based faculty feedback.
        </p>
      </div>
      <div className="card-list">
        {withFeedback.map(f=>{
          const fb   = aiFeedbackMap[f.id];
          const open = expanded===f.id;
          const rawOpen = rawExpanded===f.id;
          return (
            <Card key={f.id} style={{ padding:0, overflow:"hidden" }}>
              <button onClick={()=>setExpanded(open?null:f.id)}
                style={{ width:"100%", padding:"16px 22px", display:"flex", alignItems:"center",
                  gap:"12px", background:"none", border:"none", cursor:"pointer", textAlign:"left" }}>
                <div style={{ flex:1 }}>
                  <p style={{ fontWeight:600, fontSize:"14px", color:"var(--text-primary)", marginBottom:"2px" }}>{f.name}</p>
                  <p style={{ fontSize:"12px", color:"var(--text-second)" }}>
                    {f.dept} - {f.code} - {f.responses} responses - Composite:
                    {" "}<strong style={{color:"var(--gold)"}}>{Number(f.compositeScore).toFixed(2)}</strong>
                  </p>
                </div>
                <span style={{ fontSize:"11px", fontWeight:700, color:"var(--gold)", background:"var(--gold-dim)",
                  border:"1px solid var(--amber-border)", borderRadius:"99px", padding:"3px 10px" }}>Report Ready</span>
              </button>

              {open && (
                <div className="anim-fade-in" style={{ padding:"0 22px 22px", borderTop:"1px solid var(--border)" }}>

                  {/* Dual Evaluation Breakdown Block */}
                  {f.chairEvaluated && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginTop: "24px", marginBottom: "20px" }}>
                      
                      {/* Left Column: Student Ratings & Evidence */}
                      <div style={{ padding: "20px", background: "#FFFFFF", border: "1px solid var(--border)", borderRadius: "8px", display: "flex", flexDirection: "column" }}>
                        <div>
                          <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: "20px" }}>
                            STUDENT RATINGS
                          </p>
                          <RatingRow label="Teaching Effectiveness" score={f.studentScoreBreakdown?.te || 4.52} />
                          <RatingRow label="Subject Matter Mastery" score={f.studentScoreBreakdown?.sm || 4.26} />
                          <RatingRow label="Communication & Clarity" score={f.studentScoreBreakdown?.cc || 4.44} />
                          <RatingRow label="Student Engagement" score={f.studentScoreBreakdown?.se || 4.18} />
                          <RatingRow label="Professional Conduct" score={f.studentScoreBreakdown?.pc || 4.35} />
                        </div>
                        
                        {/* Student Evidence directly under ratings */}
                        <div style={{ marginTop: "24px", padding: "14px", background: "var(--bg-base)", border: "1px solid var(--border)", borderRadius: "8px" }}>
                          <p style={{ fontSize: "10px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "12px", letterSpacing: "0.05em" }}>STUDENT EVIDENCE</p>
                          {fb.citations?.map((c,i)=>(
                            <div key={i} style={{ marginBottom: i<fb.citations.length-1?"14px":0, paddingLeft:"8px", borderLeft:"2px solid var(--gold)" }}>
                              <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--gold)", marginBottom: "4px" }}>
                                * {(4.5 + (i%2)*0.3).toFixed(1)}/5.0 <span style={{ color: "var(--text-muted)", fontWeight: 500, marginLeft: "4px" }}>- Response #{34 + i*27}</span>
                              </p>
                              <p style={{ fontSize:"12px", color:"var(--text-second)", fontStyle:"italic", lineHeight:1.5, margin:0 }}>"{c}"</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right Column: Chair & Dean Evaluation & Evidence */}
                      <div style={{ padding: "20px", background: "#FDFBF5", border: "1px solid var(--border)", borderRadius: "8px" }}>
                        <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: "16px" }}>
                          CHAIR & DEAN EVALUATION BREAKDOWN
                        </p>
                        
                        {/* Chairperson Section */}
                        <p style={{ fontSize: "10px", fontWeight: 700, color: "var(--gold-darker)", marginBottom: "12px", textTransform: "uppercase" }}>
                          Chairperson
                        </p>
                        <RatingRow label="Classroom Observation (40%)" score={f.chairScoreBreakdown?.co || 4.70} />
                        <RatingRow label="Research & Publications (20%)" score={f.chairScoreBreakdown?.re || 4.50} />
                        <RatingRow label="Community Extension (20%)" score={f.chairScoreBreakdown?.ce || 4.40} />
                        <RatingRow label="Professional Performance (20%)" score={f.chairScoreBreakdown?.pf || 4.60} />
                        
                        {/* Chair Evidence */}
                        <div style={{ marginTop: "16px", padding: "12px", background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.05)", borderRadius: "8px" }}>
                          <p style={{ fontSize: "10px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "8px", letterSpacing: "0.05em" }}>CHAIR EVIDENCE</p>
                          <div style={{ paddingLeft:"8px", borderLeft:"2px solid var(--gold)" }}>
                            <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--gold)", marginBottom: "4px" }}>* {(Number(f.chairScore) || 4.7).toFixed(2)}/5.0</p>
                            <p style={{ fontSize: "12px", color: "var(--text-second)", fontStyle: "italic", lineHeight: 1.5, margin: 0 }}>
                              "{fb.chairRemarks || "Observation highlights strong command of the subject matter and effective management of administrative duties."}"
                            </p>
                          </div>
                        </div>

                        {/* Dean Section */}
                        <p style={{ fontSize: "10px", fontWeight: 700, color: "var(--gold-darker)", marginTop: "24px", marginBottom: "12px", textTransform: "uppercase" }}>
                          Dean
                        </p>
                        <RatingRow label="Classroom Observation (40%)" score={f.deanScoreBreakdown?.co || 4.60} />
                        <RatingRow label="Research & Publications (20%)" score={f.deanScoreBreakdown?.re || 4.45} />
                        <RatingRow label="Community Extension (20%)" score={f.deanScoreBreakdown?.ce || 4.45} />
                        <RatingRow label="Professional Performance (20%)" score={f.deanScoreBreakdown?.pf || 4.50} />

                        {/* Dean Evidence */}
                        <div style={{ marginTop: "16px", padding: "12px", background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.05)", borderRadius: "8px" }}>
                          <p style={{ fontSize: "10px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "8px", letterSpacing: "0.05em" }}>DEAN EVIDENCE</p>
                          <div style={{ paddingLeft:"8px", borderLeft:"2px solid #1C1400" }}>
                            <p style={{ fontSize: "11px", fontWeight: 700, color: "#1C1400", marginBottom: "4px" }}>* {(Number(f.deanScore) || 4.5).toFixed(2)}/5.0</p>
                            <p style={{ fontSize: "12px", color: "var(--text-second)", fontStyle: "italic", lineHeight: 1.5, margin: 0 }}>
                              "{fb.deanRemarks || "Review of syllabus and research output indicates excellent academic alignment; community extension participation meets college targets."}"
                            </p>
                          </div>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* AI-generated content (Strengths & Improvements) */}
                  <div className="grid-2" style={{ gap:"12px", marginBottom:"12px" }}>
                    <div style={{ padding:"14px", background:"var(--success-dim)", border:"1px solid rgba(76,175,111,0.18)", borderRadius:"var(--radius-sm)" }}>
                      <p style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.07em", textTransform:"uppercase", color:"var(--success)", marginBottom:"8px" }}>Strengths</p>
                      {fb.strengths.map((s,i)=><p key={i} style={{ fontSize:"13px", color:"var(--text-second)", lineHeight:1.7, marginBottom:i<fb.strengths.length-1?"8px":0 }}>{s}</p>)}
                    </div>
                    <div style={{ padding:"14px", background:"var(--gold-dim)", border:"1px solid var(--amber-border)", borderRadius:"var(--radius-sm)" }}>
                      <p style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.07em", textTransform:"uppercase", color:"var(--gold)", marginBottom:"8px" }}>Points for Improvement</p>
                      {fb.improvements.map((s,i)=><p key={i} style={{ fontSize:"13px", color:"var(--text-second)", lineHeight:1.7, marginBottom:i<fb.improvements.length-1?"8px":0 }}>{s}</p>)}
                    </div>
                  </div>
                  
                  {/* Holistic Recommendation */}
                  <div style={{ padding:"12px 14px", background:"var(--gold-dim)", border:"1px solid var(--amber-border)", borderRadius:"var(--radius-sm)" }}>
                    <p style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.07em", textTransform:"uppercase", color:"var(--gold)", marginBottom:"6px" }}>
                      Holistic Recommendation (Student, Chair, & Dean Results)
                    </p>
                    <p style={{ fontSize:"13px", color:"var(--text-second)", lineHeight:1.7 }}>
                      {fb.recommendation} Based on the combined student feedback, chair observations, and dean academic review, it is highly recommended to continue leveraging these strengths while addressing the minor areas of improvement.
                    </p>
                  </div>

                  {/* Raw Data Toggle for HR */}
                  <div style={{ marginTop: "24px", borderTop: "1px solid var(--border)", paddingTop: "20px", textAlign: "center" }}>
                    <button onClick={() => setRawExpanded(rawOpen ? null : f.id)} style={{ padding: "8px 16px", borderRadius: "var(--radius-sm)", background: "#FFFFFF", border: "1px solid var(--border)", fontSize: "12px", fontWeight: 700, cursor: "pointer", color: "var(--text-primary)", transition: "all 0.15s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-base)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "#FFFFFF"; }}>
                      {rawOpen ? "Hide Raw Evaluator Data" : "View Raw Evaluator Data"}
                    </button>
                  </div>

                  {/* Expanded Raw Data Table */}
                  {rawOpen && (
                    <div className="anim-fade-in" style={{ marginTop: "16px", background: "#FFFFFF", border: "1px solid var(--border)", borderRadius: "8px", overflow: "x-auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                        <thead style={{ background: "var(--bg-base)", borderBottom: "1px solid var(--border)" }}>
                          <tr>
                            <th style={{ padding: "12px 14px", fontSize: "10px", color: "var(--text-muted)", letterSpacing: "0.05em" }}>ID</th>
                            <th style={{ padding: "12px 14px", fontSize: "10px", color: "var(--text-muted)", letterSpacing: "0.05em" }} title="Teaching Effectiveness">TE</th>
                            <th style={{ padding: "12px 14px", fontSize: "10px", color: "var(--text-muted)", letterSpacing: "0.05em" }} title="Subject Matter Mastery">SM</th>
                            <th style={{ padding: "12px 14px", fontSize: "10px", color: "var(--text-muted)", letterSpacing: "0.05em" }} title="Communication & Clarity">CC</th>
                            <th style={{ padding: "12px 14px", fontSize: "10px", color: "var(--text-muted)", letterSpacing: "0.05em" }} title="Student Engagement">SE</th>
                            <th style={{ padding: "12px 14px", fontSize: "10px", color: "var(--text-muted)", letterSpacing: "0.05em" }} title="Professional Conduct">PC</th>
                            <th style={{ padding: "12px 14px", fontSize: "10px", color: "var(--gold)", letterSpacing: "0.05em" }}>AVG</th>
                            <th style={{ padding: "12px 14px", fontSize: "10px", color: "var(--text-muted)", letterSpacing: "0.05em" }}>RAW COMMENT</th>
                          </tr>
                        </thead>
                        <tbody>
                          {SAMPLE_STUDENT_EVALS.map((evalData, idx) => {
                             const avg = ((evalData.ratings.e1 + evalData.ratings.e2 + evalData.ratings.e3 + evalData.ratings.e4 + evalData.ratings.e5) / 5).toFixed(1);
                             return (
                               <tr key={idx} style={{ borderBottom: idx < SAMPLE_STUDENT_EVALS.length - 1 ? "1px solid var(--border)" : "none" }}>
                                  <td style={{ padding: "14px", fontSize: "11px", color: "var(--text-muted)" }}>#{String(idx+1).padStart(3, '0')}</td>
                                  <td style={{ padding: "14px", fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>{evalData.ratings.e1}</td>
                                  <td style={{ padding: "14px", fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>{evalData.ratings.e2}</td>
                                  <td style={{ padding: "14px", fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>{evalData.ratings.e3}</td>
                                  <td style={{ padding: "14px", fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>{evalData.ratings.e4}</td>
                                  <td style={{ padding: "14px", fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>{evalData.ratings.e5}</td>
                                  <td style={{ padding: "14px", fontSize: "13px", fontWeight: 700, color: "var(--gold)" }}>{avg}</td>
                                  <td style={{ padding: "14px", fontSize: "12px", color: "var(--text-second)", fontStyle: "italic", lineHeight: 1.5, minWidth: "280px" }}>"{evalData.comment}"</td>
                               </tr>
                             )
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>
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

function ChairHashRow({ hash, log }) {
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
              { label:"Classroom Observation", key:"co", weight:"40%" },
              { label:"Research",              key:"re", weight:"20%" },
              { label:"Community Extension",   key:"ce", weight:"20%" },
              { label:"Performance",           key:"pf", weight:"20%" },
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

function DeanHashRow({ hash, log }) {
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
              { label:"Classroom Observation", key:"co", weight:"40%" },
              { label:"Research",              key:"re", weight:"20%" },
              { label:"Community Extension",   key:"ce", weight:"20%" },
              { label:"Performance",           key:"pf", weight:"20%" },
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

function AuditLog() {
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
          administrative remarks used to generate that report. As an authorized HR officer, you can click any hash to decrypt and view the raw input data to verify the AI accuracy.
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
                  <ChairHashRow hash={log.chairHash} log={log}/>

                  <p style={{ fontSize:"12px", fontWeight:700, color:"var(--text-second)", marginTop:"12px", marginBottom:"8px" }}>
                    Dean Evaluation
                  </p>
                  <DeanHashRow hash={log.deanHash} log={log}/>
                  
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
  if (activeTab === "overview") return <div className="anim-fade-up"><Overview/></div>;
  if (activeTab === "reports")  return <div className="anim-fade-up"><FacultyReports/></div>;
  if (activeTab === "feedback") return <div className="anim-fade-up"><AIFeedbackReview/></div>;
  if (activeTab === "audit")    return <div className="anim-fade-up"><AuditLog/></div>;
  return null;
}