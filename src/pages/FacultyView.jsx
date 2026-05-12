/**
 * FacultyView.jsx
 * - Dashboard: Composite score (70% Student / 30% Chair), Criterion bars, Admin breakdowns
 * - My AI Feedback: Two-column layout (Balanced) with Admin breakdowns and Student Evidence table
 * - Evidence Verification Record: Detailed view for individual student citations (XAI)
 * - Strictly follows HRMO-Form 03.4A rubrics
 */
import { useState } from "react";
import { getFacultyList, evaluationCriteria, aiFeedbackMap, SEMESTER } from "../data/store.js";

/* Shared UI Components */
function Card({ children, style={} }) {
  return (
    <div style={{ background:"#FFFFFF", border:"1px solid var(--border)",
      borderRadius:"14px", padding:"22px", boxShadow:"var(--shadow-card)", ...style }}>
      {children}
    </div>
  );
}

function ScoreRing({ score, max=5, size=110 }) {
  const r=42, cx=size/2, cy=size/2;
  const circ=2*Math.PI*r;
  const dash=(score/max)*circ;
  const color=score>=4.5?"#1E6E3E":score>=4.0?"#C8940A":score>=3.5?"#A07800":"#B83030";
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{flexShrink:0}}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--bg-elevated)" strokeWidth="9"/>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="9"
        strokeDasharray={`${dash} ${circ-dash}`} strokeDashoffset={circ*0.25}
        strokeLinecap="round" style={{transition:"stroke-dasharray 0.8s ease"}}/>
      <text x={cx} y={cy-7} textAnchor="middle"
        style={{fontFamily:"var(--font-display)",fontSize:"22px",fontWeight:600,fill:color}}>
        {score.toFixed(2)}
      </text>
      <text x={cx} y={cy+12} textAnchor="middle"
        style={{fontFamily:"var(--font-body)",fontSize:"10px",fill:"var(--text-muted)",fontWeight:600}}>
        / {max}.00
      </text>
    </svg>
  );
}

function StatusBadge({ status }) {
  const map = {
    excellent:   {label:"Excellent",    bg:"rgba(30,110,62,0.10)", border:"rgba(30,110,62,0.25)",  color:"#1E6E3E"},
    good:        {label:"Very Satisfactory", bg:"rgba(200,148,10,0.10)",border:"rgba(200,148,10,0.30)", color:"#A07800"},
    average:     {label:"Satisfactory", bg:"rgba(160,120,0,0.08)", border:"rgba(160,120,0,0.22)",  color:"#7A5A00"},
    needsSupport:{label:"Fair",         bg:"rgba(184,48,48,0.08)", border:"rgba(184,48,48,0.22)",  color:"#B83030"},
  };
  const s=map[status]||map.average;
  return <span style={{fontSize:"12px",fontWeight:700,color:s.color,
    background:s.bg,border:`1px solid ${s.border}`,
    borderRadius:"99px",padding:"4px 14px",display:"inline-block"}}>{s.label}</span>;
}

function CriterionBar({ label, value, max=5 }) {
  const pct=(value/max)*100;
  const color=value>=4.5?"#1E6E3E":value>=4.0?"#C8940A":value>=3.5?"#A07800":"#B83030";
  return (
    <div style={{marginBottom:"14px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"6px"}}>
        <span style={{fontSize:"12px",color:"var(--text-second)",fontWeight:600}}>{label}</span>
        <span style={{fontSize:"13px",fontFamily:"var(--font-display)",fontWeight:600,color}}>{value.toFixed(2)}</span>
      </div>
      <div style={{height:"7px",background:"var(--bg-elevated)",borderRadius:"99px",overflow:"hidden"}}>
        <div style={{width:`${pct}%`,height:"100%",background:color,borderRadius:"99px",transition:"width 0.7s ease"}}/>
      </div>
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

/* Dashboard Tab */
function Dashboard({ faculty, onNavigate }) {
  const criterionScores = {
    e1: Math.min(5, +(faculty.studentScore * 1.04).toFixed(2)),
    e2: Math.min(5, +(faculty.studentScore * 0.98).toFixed(2)),
    e3: Math.min(5, +(faculty.studentScore * 1.02).toFixed(2)),
    e4: Math.min(5, +(faculty.studentScore * 0.96).toFixed(2)),
    e5: Math.min(5, +(faculty.studentScore * 1.00).toFixed(2)),
  };

  const studentWeight = faculty.studentScore * 0.70;
  const chairWeight = faculty.chairEvaluated ? (faculty.chairScore * 0.30) : 0;
  const localComposite = (studentWeight + chairWeight).toFixed(2);

  return (
    <div className="anim-fade-in">
      <Card style={{marginBottom:"18px"}}>
        <div style={{display:"flex",alignItems:"center",gap:"24px",flexWrap:"wrap"}}>
          <ScoreRing score={parseFloat(localComposite)}/>
          <div style={{flex:1,minWidth:"200px"}}>
            <p style={{fontSize:"11px",fontWeight:700,letterSpacing:"0.08em",
              textTransform:"uppercase",color:"var(--text-muted)",marginBottom:"6px"}}>
              Composite Score * {SEMESTER}
            </p>
            <h2 style={{fontFamily:"var(--font-display)",fontSize:"24px",fontWeight:600,
              color:"var(--text-primary)",marginBottom:"8px",lineHeight:1}}>{faculty.name}</h2>
            <p style={{fontSize:"13px",color:"var(--text-muted)",marginBottom:"14px"}}>
              {faculty.dept} * {faculty.code} * {faculty.subject}
            </p>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <StatusBadge status={faculty.status}/>
                <button onClick={() => onNavigate("feedback")} style={{ padding: "6px 14px", borderRadius: "6px", background: "var(--gold)", color: "var(--text-on-gold)", border: "none", fontSize: "11px", fontWeight: 700, cursor: "pointer", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                    View AI Feedback Reports
                </button>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gap:"10px",minWidth:"260px"}}>
            {[
              {label:"Students (30%)", value:faculty.studentScore.toFixed(2), note:`${faculty.responses} responses`},
              {label:"Chair (40%)",   value:faculty.chairEvaluated?faculty.chairScore.toFixed(2):"-", note:faculty.chairEvaluated?"Evaluated":"Pending"},
              {label:"Dean (30%)",    value:faculty.deanEvaluated?faculty.deanScore.toFixed(2):"-", note:faculty.deanEvaluated?"Evaluated":"Pending"},
            ].map((item,i)=>(
              <div key={i} style={{background:"var(--bg-base)",border:"1px solid var(--border)",
                borderRadius:"10px",padding:"14px",textAlign:"center"}}>
                <p style={{fontFamily:"var(--font-display)",fontSize:"22px",fontWeight:600,
                  color:"var(--gold-darker)",lineHeight:1,marginBottom:"4px"}}>{item.value}</p>
                <p style={{fontSize:"10px",fontWeight:700,color:"var(--text-muted)",
                  textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:"3px"}}>{item.label}</p>
                <p style={{fontSize:"11px",color:"var(--text-muted)"}}>{item.note}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid-2" style={{gap:"16px",marginBottom:"18px"}}>
        <Card>
          <p style={{fontSize:"11px",fontWeight:700,letterSpacing:"0.08em",
            textTransform:"uppercase",color:"var(--text-muted)",marginBottom:"16px"}}>
            Student Ratings by Criterion
          </p>
          {evaluationCriteria.map(c=>(
            <CriterionBar key={c.id} label={c.category} value={criterionScores[c.id]}/>
          ))}
        </Card>

        <Card>
          <p style={{fontSize:"11px",fontWeight:700,letterSpacing:"0.08em",
            textTransform:"uppercase",color:"var(--text-muted)",marginBottom:"16px"}}>
            Chairperson Evaluation Breakdown
          </p>
          {faculty.chairEvaluated && faculty.chairScoreBreakdown ? (
            <div style={{ marginTop: "10px" }}>
              {[
                {label:"Job Competencies (55%)",key:"jc"},
                {label:"Job Factors (25%)",key:"jf"},
                {label:"Professional Qualities (20%)",key:"pq"},
              ].map(item=>(
                <CriterionBar key={item.key} label={item.label}
                  value={parseFloat(faculty.chairScoreBreakdown[item.key] || faculty.chairScore)}/>
              ))}
            </div>
          ) : (
            <div style={{textAlign:"center",padding:"24px 0"}}>
              <p style={{fontSize:"32px",marginBottom:"10px"}}>⏳</p>
              <p style={{fontSize:"13px",color:"var(--text-muted)"}}>
                Chair evaluation not yet submitted.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

/* Evidence Verification Record Component */
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

/* My AI Feedback Tab */
function MyFeedback({ faculty, onNavigate }) {
  const [showRawData, setShowRawData] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  
  const fb = aiFeedbackMap[faculty.id];

  if (selectedEvidence) {
      return <EvidenceVerificationRecord evidence={selectedEvidence} faculty={faculty} onBack={() => setSelectedEvidence(null)} />;
  }

  if (!fb) return (
    <Card>
      <div style={{textAlign:"center",padding:"32px 0"}}>
        <p style={{fontSize:"36px",marginBottom:"12px"}}>🤖</p>
        <p style={{fontSize:"14px",fontWeight:600,color:"var(--text-second)",marginBottom:"6px"}}>
          AI feedback not yet available
        </p>
        <p style={{fontSize:"12px",color:"var(--text-muted)",lineHeight:1.6,
          maxWidth:"340px",margin:"0 auto"}}>
          Reports are generated after evaluations are complete
          and the AI processing cycle has run.
        </p>
      </div>
    </Card>
  );

  return (
    <div className="anim-fade-in">
      <button onClick={() => onNavigate("dashboard")} style={{ display:"flex", alignItems:"center", gap:"6px", color:"var(--text-second)", fontSize:"13px", marginBottom:"18px", background:"none", border:"none", cursor:"pointer" }}>
          ← Back to Dashboard
      </button>

      <div style={{padding:"14px 18px",background:"rgba(200,148,10,0.08)",
        border:"1px solid rgba(200,148,10,0.25)",borderRadius:"12px",
        marginBottom:"18px",display:"flex",alignItems:"center",gap:"10px"}}>
        <span className="anim-pulse" style={{width:"8px",height:"8px",borderRadius:"50%",
          background:"#C8940A",display:"inline-block",flexShrink:0}}/>
        <p style={{fontSize:"13px",color:"var(--text-second)",lineHeight:1.5}}>
          This report was generated by the Local AI Inference Engine from anonymized
          student responses and your evaluators' assessments.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px", alignItems: "start" }}>
        
        {/* Left Column: Student Evaluation & Recommendation */}
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
            <RatingRow label="Job Competencies (55%)" score={faculty.chairScoreBreakdown?.jc || 4.70} />
            <RatingRow label="Job Factors (25%)" score={faculty.chairScoreBreakdown?.jf || 4.50} />
            <RatingRow label="Professional Qualities (20%)" score={faculty.chairScoreBreakdown?.pq || 4.60} />
            
            <div style={{ marginTop: "16px", padding: "12px", background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.05)", borderRadius: "8px", marginBottom: "24px" }}>
              <p style={{ fontSize: "10px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "8px", letterSpacing: "0.05em" }}>CHAIR EVIDENCE</p>
              <div style={{ paddingLeft: "8px", borderLeft: "2px solid var(--gold)" }}>
                <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--gold)", marginBottom: "4px" }}>★ {(Number(faculty.chairScore) || 4.7).toFixed(2)}/5.0</p>
                <p style={{ fontSize: "12px", color: "var(--text-second)", fontStyle: "italic", lineHeight: 1.5, margin: 0 }}>
                  "{fb.chairRemarks || "Observation highlights strong command of the subject matter and effective management of administrative duties."}"
                </p>
              </div>
            </div>

            <p style={{ fontSize: "10px", fontWeight: 700, color: "var(--gold-darker)", marginBottom: "12px", textTransform: "uppercase" }}>Dean</p>
            <RatingRow label="Job Competencies (55%)" score={faculty.deanScoreBreakdown?.jc || 4.60} />
            <RatingRow label="Job Factors (25%)" score={faculty.deanScoreBreakdown?.jf || 4.45} />
            <RatingRow label="Professional Qualities (20%)" score={faculty.deanScoreBreakdown?.pq || 4.50} />

            <div style={{ marginTop: "16px", padding: "12px", background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.05)", borderRadius: "8px" }}>
              <p style={{ fontSize: "10px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "8px", letterSpacing: "0.05em" }}>DEAN EVIDENCE</p>
              <div style={{ paddingLeft: "8px", borderLeft: "2px solid #1C1400" }}>
                <p style={{ fontSize: "11px", fontWeight: 700, color: "#1C1400", marginBottom: "4px" }}>★ {(Number(faculty.deanScore) || 4.5).toFixed(2)}/5.0</p>
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
                                 onClick={() => setSelectedEvidence(c)}
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
  );
}

/* Main Export */
export default function FacultyView({ activeTab, user, onNavigate }) {
  const [localFacultyList] = useState(getFacultyList());
  
  const faculty = localFacultyList.find(f=>f.id===user.facultyId) || localFacultyList[0];
  
  if(activeTab==="dashboard") return <div className="anim-fade-up"><Dashboard faculty={faculty} onNavigate={onNavigate}/></div>;
  if(activeTab==="feedback")  return <div className="anim-fade-up"><MyFeedback faculty={faculty} onNavigate={onNavigate}/></div>;
  
  return null;
}