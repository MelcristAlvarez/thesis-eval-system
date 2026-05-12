/**
 * ChairView.jsx
 * Chair eval criteria mapped exactly to HRMO-Form 03.4A.1 and Classroom Observation Tool
 * Integrated with Local Storage for live prototype updates
 * Module 3 Administrative Dashboard with Full-Page Evidence Drill-down
 */
import { useState } from "react";
import { getFacultyList, updateFaculty, aiFeedbackMap, SEMESTER } from "../data/store.js";

/* *** Shared UI *** */
function Card({ children, style={}, onClick, onMouseEnter, onMouseLeave }) {
  return (
    <div 
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{ background:"#FFFFFF", border:"1.5px solid rgba(26,50,112,0.15)",
      borderRadius:"var(--radius-md)", padding:"20px", boxShadow:"var(--shadow-card)", ...style }}>
      {children}
    </div>
  );
}

function ScoreBar({ score, max=5 }) {
  const numericScore = Number(score) || 0;
  const pct = `${(numericScore/max)*100}%`;
  return (
    <div style={{ width:"100%", height:"5px", background:"var(--border)", borderRadius:"99px", overflow:"hidden" }}>
      <div style={{ width:pct, height:"100%", background:"var(--gold)", borderRadius:"99px", transition:"width 0.7s ease" }}/>
    </div>
  );
}

function StatusChip({ status }) {
  const map = { 
    excellent: { l:"Excellent", c:"var(--success)", bg:"var(--success-dim)", border:"var(--success-border)" }, 
    good: { l:"Very Satisfactory", c:"var(--gold)", bg:"var(--gold-dim)", border:"var(--amber-border)" },
    average: { l:"Satisfactory", c:"var(--text-second)", bg:"var(--bg-elevated)", border:"var(--border)" }, 
    needsSupport: { l:"Fair", c:"var(--danger)", bg:"var(--danger-dim)", border:"var(--danger)" } 
  };
  const s = map[status] || map.average;
  return (
    <span style={{ display: "inline-block", whiteSpace: "nowrap", fontSize:"12px", fontWeight:700, color:s.c, background:s.bg, border:`1px solid ${s.border}`, borderRadius:"99px", padding:"4px 12px" }}>
      {s.l}
    </span>
  );
}

function RatingRow({ label, score, colorOverride }) {
  const numericScore = Number(score) || 0;
  const color = colorOverride || (numericScore >= 4.5 ? "var(--success)" : "var(--gold)");
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

/* ── Dynamic Numerical Rating (1-5) with Hover Labels ── */
function NumericalRating({ value, onChange, labels }) {
    const [hover, setHover] = useState(0);
    const active = hover || value;
  
    const colors = [
      { n:1, color:"#B83030", bg:"rgba(184,48,48,0.08)", border:"rgba(184,48,48,0.30)" },
      { n:2, color:"#C8680A", bg:"rgba(200,104,10,0.08)", border:"rgba(200,104,10,0.30)" },
      { n:3, color:"#A07800", bg:"rgba(160,120,0,0.08)", border:"rgba(160,120,0,0.30)" },
      { n:4, color:"#5A8A20", bg:"rgba(90,138,32,0.08)", border:"rgba(90,138,32,0.30)" },
      { n:5, color:"#1E6E3E", bg:"rgba(30,110,62,0.08)", border:"rgba(30,110,62,0.30)" }
    ];
  
    const currentMeta = active > 0 ? colors[active - 1] : null;
    const currentLabel = active > 0 && labels ? labels[active - 1] : "Select a rating";
  
    return (
      <div style={{ textAlign:"left" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"10px", flexWrap:"wrap" }}>
          <div style={{ display: "flex", gap: "6px" }}>
              {colors.map(item => {
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
                      width:"40px", height:"40px", borderRadius:"8px",
                      border:`2px solid ${isFilled ? item.border : "var(--border)"}`,
                      background: isSelected ? item.color : isFilled ? item.bg : "#FFFFFF",
                      color: isSelected ? "#FFFFFF" : isFilled ? item.color : "var(--text-muted)",
                      fontFamily:"var(--font-display)", fontSize:"16px", fontWeight:700,
                      cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
                      transition:"all 0.15s cubic-bezier(0.34,1.36,0.64,1)",
                      transform: (isSelected || isHovered) ? "scale(1.08)" : "scale(1)",
                      boxShadow: isSelected ? `0 4px 12px ${item.border}` : "none",
                      }}>
                      {item.n}
                  </button>
                  );
              })}
          </div>
          <div style={{ height:"28px", display:"flex", alignItems:"center", marginLeft: "6px" }}>
            {currentMeta ? (
              <span style={{ fontSize:"12px", fontWeight:700, color: currentMeta.color, background: currentMeta.bg, border:`1px solid ${currentMeta.border}`, borderRadius:"99px", padding:"4px 14px", transition:"all 0.15s" }}>
                {currentLabel}
              </span>
            ) : (
              <span style={{ fontSize:"12px", color:"var(--text-muted)", fontStyle:"italic" }}>
                Hover or select to view rubric
              </span>
            )}
          </div>
        </div>
      </div>
    );
}

const adminRubricLabels = ["Poor", "Fair", "Satisfactory", "Very Satisfactory", "Excellent"];

/* *** Form HRMO-Form 03.4A.1 and Classroom Observation Criteria *** */
const adminCriteria = [
  {
    section: "I. JOB COMPETENCIES (55%)",
    weight: 0.55,
    subsections: [
      {
        title: "A. Classroom Observation (30%)",
        items: [
          { id: "co_1", prompt: "1. Meets the objectives of the lesson by maintaining an organized learning." },
          { id: "co_2", prompt: "2. Demonstrates mastery of the subject matter." },
          { id: "co_3", prompt: "3. Explains concepts of the lesson within the grasp of the learners." },
          { id: "co_4", prompt: "4. Relates subject matter to other disciplines and to real life situations." },
          { id: "co_5", prompt: "5. Facilitates in summarizing the salient concepts of the lesson." },
          { id: "co_6", prompt: "6. Adopts instructional methods that encourage active student participation." },
          { id: "co_7", prompt: "7. Employs effective teaching aids." },
          { id: "co_8", prompt: "8. Employs appropriate assessment tools" },
          { id: "co_9", prompt: "9. Uses the language of instruction proficiently" },
          { id: "co_10", prompt: "10. Utilizes class time effectively" },
          { id: "co_11", prompt: "11. Speaks clearly with a well-modulated voice." },
          { id: "co_12", prompt: "12. Asks relevant and thought-provoking questions." },
          { id: "co_13", prompt: "13. Demonstrates enthusiasm for the subject matter." },
          { id: "co_14", prompt: "14. Promotes an open atmosphere yet maintains order in the classroom." },
          { id: "co_15", prompt: "15. Responds appropriately to students' questions and comments" },
          { id: "co_16_1", prompt: "16.1 examining the root causes of problems and suggesting effective solutions", parentPrompt: "16. Engages in teaching innovation by:" },
          { id: "co_16_2", prompt: "16.2 fostering new ideas, processes, and procedures" },
          { id: "co_16_3", prompt: "16.3 using ingenious methods, and creative or beyond the box thinking to achieve desired results" },
          { id: "co_17", prompt: "17. Makes use of outputs from required research for instruction." },
          { id: "co_18", prompt: "18. Applies learnings in the classroom to community engagement or involvement based on the Salamanca process." }
        ],
        hasObservationRemarks: true
      },
      {
        title: "B. Research and Production (15%)",
        fullTimeOnly: true,
        items: [
          { id: "jc_rp1", prompt: "1. Conducts research and attends research presentation or publication." },
          { id: "jc_rp2", prompt: "2. Produces modules, manuals, workbooks, reviewers, and creative works" }
        ]
      },
      {
        title: "C. Community Involvement (10%)",
        fullTimeOnly: true,
        items: [
          { id: "jc_ci3", prompt: "3. Attends to community involvement activities" }
        ]
      }
    ]
  },
  {
    section: "II. JOB FACTORS (25%)",
    weight: 0.25,
    subsections: [
      {
        title: "A. Service Excellence",
        items: [
          { id: "jf_se1", prompt: "1. Submits teaching requirements on time (e.g. syllabus, table of specifications, term exams, grades)" },
          { id: "jf_se2", prompt: "2. Submits required reports on time (e.g. make-up, substitution, curriculum review, other assignments)" },
          { id: "jf_se3", prompt: "3. Conducts student advising/consultation" },
          { id: "jf_se4", prompt: "4. Participates actively in planning, marketing, and enrolment duties" },
          { id: "jf_se5", prompt: "5. Engages in the University's quality management programs (accreditations, ISO, ISA, and other quality assurance activities)" },
          { id: "jf_se6", prompt: "6. Attends to meeting regularly" },
          { id: "jf_se7", prompt: "7. Reports punctually according to work schedule." },
          { id: "jf_se8", prompt: "8. Observes the specific University policies and procedures on:", subItems: ["8.1 Punctuality", "8.2 Cleanliness and orderliness in the classroom and workstation", "8.3 Clearance", "8.4 Proctoring and test administration", "8.5 Wearing of ID and uniform", "8.6 Workplace safety"] }
        ]
      },
      {
        title: "B. Faculty Engagement",
        items: [
          { id: "jf_fe9", prompt: "9. Complies with the timeframe given by the Professional Development Plan" },
          { id: "jf_fe10", prompt: "10. Engages and attends to in-house (identified by HRMO) and off-site (based on Oplan) non-formal training and development" },
          { id: "jf_fe11", prompt: "11. Attends to physical, psychosocial and spiritual well-being (i.e., physical wellness program, psychosocial and spiritual renewal programs)." },
          { id: "jf_fe12", prompt: "12. Attends to Institutional Activities and Advocacies:", instruction: "Please check the specific activity/ies that the employee attended, then rate the employee based on the corresponding rating reflected in the rubrics.", subItems: ["12.1 Masses", "12.2 Retreat/Recollection", "12.3 Popular Religious Practices (e.g. Marian Devotion)", "12.4 BEC", "12.5 Student's Orientation", "12.6 Pagtais (Institutional)", "12.7 INSET/ Departmental Pagtais", "12.8 Research trainings", "12.9 Recognition rites", "12.10 Moving-up/Completion/Graduation/Solemn Investiture", "12.11 Legazpi Thomasian identity activities", "12.12 Sports Fest and other physical wellness activities", "12.13 Sumpay", "12.14 Employees' Christmas Party", "12.15 Paskuhan", "12.16 University Week Opening Salvo", "12.17 Other institutional activities"] },
          { id: "jf_fe13", prompt: "13. Promotes different University Advocacies, with pro-life as prerequisite, on:", instruction: "Please rate the employee based on the corresponding rating reflected in the rubrics.", subItems: ["13.1 sanctity of marriage", "13.2 covenant of honesty", "13.3 justice and peace", "13.4 care for creation"] }
        ]
      }
    ]
  },
  {
    section: "III. PROFESSIONAL QUALITIES (20%)",
    weight: 0.20,
    subsections: [
      {
        title: null,
        items: [
          { id: "pq_1", prompt: "1. Establishes and maintains a positive image of the University by being an exemplar in upholding and protecting its name and integrity." },
          { id: "pq_2", prompt: "2. Manifests the following values and behavior of a Legazpi Thomasian faculty, enshrined in the institutional vision, mission, goals, objectives, and employee's Code of Conduct and Discipline:", instruction: "Please check the values and behavior observed from the employee; rate the employee based on the corresponding rating reflected in the rubrics.", subItems: ["2.1 life", "2.2 truth", "2.3 love", "2.4 gratitude"] },
          { id: "pq_3", prompt: "3. Deals with issues rather than personalities." },
          { id: "pq_4", prompt: "4. Receives with openness the suggestions and feedbacks" },
          { id: "pq_5", prompt: "5. Accepts consequences of errors or risks undertaken in the performance of duties." }
        ]
      }
    ]
  }
];

/* *** Overview tab *** */
function Overview({ facultyList }) {
  const avg     = (facultyList.reduce((s,f)=>s+f.compositeScore,0)/facultyList.length).toFixed(2);
  const pending = facultyList.filter(f=>!f.chairEvaluated).length;
  return (
    <div className="anim-fade-in">
      <div className="kpi-3" style={{ gap:"14px", marginBottom:"22px" }}>
        {[
          { label:"Total Faculty",       value:facultyList.length, sub:"in system"           },
          { label:"Dept. Average Score", value:avg,                sub:"composite score"     },
          { label:"Pending Chair Evals", value:pending,            sub:"awaiting your input" },
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
      <Card style={{ padding:0, overflow:"hidden" }}>
        <div style={{ padding:"16px 22px", borderBottom:"1px solid var(--border)" }}>
          <h3 style={{ fontSize:"15px", fontWeight:600 }}>Faculty Summary</h3>
          <p style={{ fontSize:"12px", color:"var(--text-second)", marginTop:"2px" }}>{SEMESTER}</p>
        </div>
        <div className="tbl-wrap">
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:"var(--bg-base)" }}>
                {["Faculty","Subject / Code","Student (30%)","Chair Eval (40%)","Dean Eval (30%)","Composite","Status"].map(h=>(
                  <th key={h} style={{ padding:"10px 14px", textAlign:"left", fontSize:"10px", fontWeight:700,
                    letterSpacing:"0.06em", textTransform:"uppercase", color:"var(--text-muted)",
                    borderBottom:"1px solid var(--border)", whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {facultyList.map((f,i)=>(
                <tr key={f.id}
                  style={{ borderBottom:i<facultyList.length-1?"1px solid var(--border)":"none", transition:"background 0.12s" }}
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
                  <td style={{ padding:"12px 14px", fontFamily:"var(--font-display)", fontSize:"16px", fontWeight:600 }}>{Number(f.studentScore).toFixed(2)}</td>
                  <td style={{ padding:"12px 14px" }}>
                    {f.chairEvaluated
                      ? <span style={{ fontSize:"14px", fontFamily:"var(--font-display)", fontWeight:600 }}>{Number(f.chairScore).toFixed(2)}</span>
                      : <span style={{ fontSize:"11px", color:"var(--danger)", fontWeight:700 }}>Pending</span>}
                  </td>
                  <td style={{ padding:"12px 14px" }}>
                    {f.deanEvaluated
                      ? <span style={{ fontSize:"14px", fontFamily:"var(--font-display)", fontWeight:600 }}>{Number(f.deanScore).toFixed(2)}</span>
                      : <span style={{ fontSize:"11px", color:"var(--danger)", fontWeight:700 }}>Pending</span>}
                  </td>
                  <td style={{ padding:"12px 14px", minWidth:"120px" }}>
                    <p style={{ fontFamily:"var(--font-display)", fontSize:"18px", fontWeight:600, color:"var(--gold)", marginBottom:"5px" }}>{Number(f.compositeScore).toFixed(2)}</p>
                    <ScoreBar score={f.compositeScore}/>
                  </td>
                  <td style={{ padding:"12px 14px" }}><StatusChip status={f.status}/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

/* *** Submit Evaluation tab *** */
function ChairEvalTab({ facultyList, preSelected, onBack, refreshData }) {
  const [selectedFaculty, setSelectedFaculty] = useState(preSelected || null);
  const [ratings, setRatings] = useState({});
  const [obsRemarks, setObsRemarks] = useState("");
  const [remarks, setRemarks] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitResult, setSubmitResult] = useState(null);

  const pending = facultyList.filter(f=>!f.chairEvaluated);

  const activeCriteria = adminCriteria.map(section => ({
      ...section,
      subsections: section.subsections.filter(sub => !sub.fullTimeOnly || selectedFaculty?.employmentType === "Full-Time")
  }));

  const handleSubmit = () => {
    const newErrors = {};
    activeCriteria.flatMap(section => section.subsections.flatMap(sub => sub.items)).forEach((item) => {
        if (!ratings[item.id]) newErrors[item.id] = true;
    });
    
    const needsObsRemarks = activeCriteria.some(section => section.subsections.some(sub => sub.hasObservationRemarks));
    if (needsObsRemarks && obsRemarks.trim().length < 80) newErrors.obsRemarks = true;
    if (remarks.trim().length < 80) newErrors.remarks = true;

    if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        const firstErrorId = Object.keys(newErrors)[0];
        const errorElement = document.getElementById(`eval-item-${firstErrorId}`);
        if (errorElement) {
            errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
        return;
    }

    const calcSectionMean = (index) => {
        const items = activeCriteria[index].subsections.flatMap(sub => sub.items);
        const sum = items.reduce((acc, item) => acc + (ratings[item.id] || 0), 0);
        return items.length > 0 ? (sum / items.length) : 0;
    };

    const jcMean = calcSectionMean(0);
    const jfMean = calcSectionMean(1);
    const pqMean = calcSectionMean(2);

    const jcWeight = jcMean * 0.55;
    const jfWeight = jfMean * 0.25;
    const pqWeight = pqMean * 0.20;

    const overallRating = (jcWeight + jfWeight + pqWeight).toFixed(2);
    
    let totalWeight = 0;
    let weightedSum = 0;

    weightedSum += selectedFaculty.studentScore * 0.30;
    totalWeight += 0.30;

    weightedSum += parseFloat(overallRating) * 0.40;
    totalWeight += 0.40;

    if (selectedFaculty.deanScore) {
        weightedSum += selectedFaculty.deanScore * 0.30;
        totalWeight += 0.30;
    }

    const newComposite = (weightedSum / totalWeight).toFixed(2);
    
    let newStatus = "average";
    if (newComposite >= 4.5) newStatus = "excellent";
    else if (newComposite >= 3.5) newStatus = "good";
    else if (newComposite >= 2.5) newStatus = "average";
    else newStatus = "needsSupport";

    const updatedFaculty = {
        ...selectedFaculty,
        chairEvaluated: true,
        chairScore: parseFloat(overallRating),
        compositeScore: parseFloat(newComposite),
        status: newStatus,
        chairScoreBreakdown: {
            jc: jcMean.toFixed(2), jf: jfMean.toFixed(2), pq: pqMean.toFixed(2)
        }
    };

    setSubmitResult({
        jcMean: jcMean.toFixed(2),
        jfMean: jfMean.toFixed(2),
        pqMean: pqMean.toFixed(2),
        jcWeight: jcWeight.toFixed(2),
        jfWeight: jfWeight.toFixed(2),
        pqWeight: pqWeight.toFixed(2),
        overallRating: overallRating
    });

    updateFaculty(updatedFaculty);
    refreshData();
    setSubmitted(true);
  };

  const handleReset = () => { 
      setSelectedFaculty(null); 
      setRatings({}); 
      setObsRemarks("");
      setRemarks(""); 
      setErrors({});
      setSubmitResult(null);
      setSubmitted(false); 
      if (onBack) onBack();
  };

  if (submitted && submitResult) return (
    <div className="anim-fade-in" style={{ textAlign:"center", padding:"40px 0" }}>
      <div style={{ fontSize:"52px", marginBottom:"16px" }}>✅</div>
      <h3 style={{ fontSize:"18px", fontWeight:600, marginBottom:"8px" }}>Program Chair Evaluation Submitted</h3>
      <p style={{ fontSize:"13px", color:"var(--text-second)", maxWidth:"400px", margin:"0 auto 24px", lineHeight:1.7 }}>
        Your evaluation has been securely recorded. Here is the mathematical breakdown of the administrative overall rating:
      </p>

      <div style={{ maxWidth: "450px", margin: "0 auto 30px", background: "var(--bg-base)", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px", textAlign: "left" }}>
         <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", fontSize: "13px" }}>
            <span style={{ color: "var(--text-muted)" }}>Job Competencies ({submitResult.jcMean} x 55%)</span>
            <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{submitResult.jcWeight}</span>
         </div>
         <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", fontSize: "13px" }}>
            <span style={{ color: "var(--text-muted)" }}>Job Factors ({submitResult.jfMean} x 25%)</span>
            <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{submitResult.jfWeight}</span>
         </div>
         <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", fontSize: "13px" }}>
            <span style={{ color: "var(--text-muted)" }}>Professional Qualities ({submitResult.pqMean} x 20%)</span>
            <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{submitResult.pqWeight}</span>
         </div>
         <div style={{ height: "1px", background: "var(--border)", margin: "12px 0" }} />
         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>Chair Overall Rating</span>
            <span style={{ fontSize: "20px", fontWeight: 800, color: "var(--gold)" }}>{submitResult.overallRating}</span>
         </div>
      </div>

      <button onClick={handleReset} style={{ padding:"10px 24px", borderRadius:"var(--radius-sm)",
        background:"var(--gold)", color:"var(--text-on-gold)", fontWeight:700, fontSize:"13px", border:"none", cursor:"pointer" }}>
        Evaluate Another Faculty
      </button>
    </div>
  );

  if (!selectedFaculty) return (
    <div className="anim-fade-in" style={{ maxWidth: "680px", margin: "0 auto" }}>
      <div style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "6px" }}>
              Select a Faculty Member
          </h2>
          <p style={{ fontSize: "13px", color: "var(--text-second)", lineHeight: 1.6 }}>
              Click on a professor below to begin their detailed administrative evaluation.
          </p>
      </div>

      {pending.length === 0 ? (
        <Card><p style={{ textAlign:"center", color:"var(--text-muted)", fontSize:"13px", padding:"24px 0" }}>
          ✓ All faculty evaluations submitted for this semester.</p></Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {pending.map(f=>(
            <Card key={f.id}
              onClick={()=>{ setSelectedFaculty(f); setRatings({}); setObsRemarks(""); setRemarks(""); }}
              style={{ display:"flex", alignItems:"center", gap:"14px", padding:"16px 20px",
                cursor:"pointer", transition:"border-color 0.15s" }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--gold)";}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)";}}>
              <div style={{ width:"40px", height:"40px", borderRadius:"10px", flexShrink:0,
                background:"var(--gold-dim)", border:"1px solid var(--amber-border)",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontFamily:"var(--font-display)", fontSize:"16px", color:"var(--gold)", fontWeight:700 }}>
                {f.name.split(" ").slice(-1)[0][0]}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ fontWeight:600, fontSize:"14px", marginBottom:"2px" }}>{f.name}</p>
                <p style={{ fontSize:"12px", color:"var(--text-second)" }}>{f.dept} - {f.code} - {f.subject}</p>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
                  <p style={{ fontSize:"11px", color:"var(--text-muted)" }}>
                    Student avg: <strong style={{color:"var(--gold)"}}>{Number(f.studentScore).toFixed(2)}</strong> ({f.responses} responses)
                  </p>
                  <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 8px", background: f.employmentType === "Full-Time" ? "var(--success-dim)" : "var(--gold-dim)", color: f.employmentType === "Full-Time" ? "var(--success)" : "var(--gold-darker)", borderRadius: "4px" }}>
                    {f.employmentType}
                  </span>
                </div>
              </div>
              <div style={{ textAlign:"right", flexShrink:0 }}>
                <span style={{ fontSize:"18px", color:"var(--gold)" }}>→</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="anim-fade-in" style={{ maxWidth:"720px", margin:"0 auto" }}>
      <button onClick={()=>{ setSelectedFaculty(null); if (onBack) onBack(); }}
        style={{ display:"flex", alignItems:"center", gap:"6px", color:"var(--text-second)",
          fontSize:"13px", marginBottom:"18px", background:"none", border:"none", cursor:"pointer", fontWeight:600 }}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        Back to faculty list
      </button>

      <Card style={{ marginBottom: "20px", borderLeft: "4px solid var(--gold)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
                <h2 style={{ fontSize: "18px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "4px" }}>
                    Evaluating: {selectedFaculty.name}
                </h2>
                <p style={{ fontSize: "13px", color: "var(--text-second)" }}>
                    {selectedFaculty.code} | {selectedFaculty.subject}
                </p>
            </div>
            <span style={{ fontSize: "11px", fontWeight: 700, padding: "4px 10px", background: "var(--gold-dim)", color: "var(--gold-darker)", borderRadius: "6px", border: "1px solid var(--amber-border)" }}>
                {selectedFaculty.employmentType} Rubric
            </span>
        </div>
      </Card>

      <div style={{ padding:"14px 18px", background:"var(--bg-base)", border:"1px solid var(--border)",
        borderRadius:"var(--radius-md)", marginBottom:"20px" }}>
        <p style={{ fontSize:"12px", color:"var(--text-second)", lineHeight: 1.6 }}>
          Kindly indicate your evaluation of the faculty member's performance using the 5-point Likert scale below.
        </p>
      </div>

      {activeCriteria.map((section, sIndex) => (
        <Card key={section.section} style={{ marginBottom: "16px" }}>
          <p style={{ fontSize: "14px", fontWeight: 700, letterSpacing: "0.05em", color: "var(--gold-darker)", marginBottom: "20px", borderBottom: "1px solid var(--border)", paddingBottom: "10px" }}>
            {section.section}
          </p>

          {section.subsections.map((sub, subIndex) => (
            <div key={subIndex} style={{ marginBottom: subIndex < section.subsections.length - 1 ? "24px" : "0" }}>
                {sub.title && (
                    <p style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "12px", textTransform: "uppercase" }}>
                        {sub.title}
                    </p>
                )}

                {sub.items.map((item, iIndex) => (
                    <div id={`eval-item-${item.id}`} key={item.id} style={{
                        padding: "16px",
                        marginBottom: "16px",
                        borderBottom: iIndex < sub.items.length - 1 ? "1px dashed var(--border)" : "none",
                        backgroundColor: errors[item.id] ? "var(--danger-dim)" : "transparent",
                        borderLeft: errors[item.id] ? "4px solid var(--danger)" : "4px solid transparent",
                        borderRadius: "8px",
                        transition: "all 0.3s ease"
                    }}>
                        {item.parentPrompt && (
                            <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "8px" }}>
                                {item.parentPrompt}
                            </p>
                        )}
                        <p style={{ fontSize: "13px", color: "var(--text-primary)", lineHeight: 1.6, marginBottom: "16px", fontWeight: item.parentPrompt ? 400 : 500 }}>
                            {item.prompt}
                        </p>

                        {item.instruction && (
                            <p style={{ fontSize: "11px", color: "var(--gold-darker)", fontStyle: "italic", marginBottom: "8px" }}>
                                {item.instruction}
                            </p>
                        )}

                        {item.subItems && (
                            <ul style={{ paddingLeft: "20px", marginBottom: "12px" }}>
                                {item.subItems.map((subItem, siIndex) => (
                                    <li key={siIndex} style={{ fontSize: "12px", color: "var(--text-second)", marginBottom: "4px" }}>
                                        {subItem}
                                    </li>
                                ))}
                            </ul>
                        )}
                        
                        <NumericalRating 
                            value={ratings[item.id] || 0} 
                            onChange={(v) => { 
                                setRatings(prev => ({ ...prev, [item.id]: v })); 
                                setErrors(prev => ({ ...prev, [item.id]: false })); 
                            }} 
                            labels={adminRubricLabels}
                        />
                        
                        {errors[item.id] && (
                            <p style={{ fontSize: "11px", color: "var(--danger)", marginTop: "12px", fontWeight: 600 }}>
                                Please provide a rating for this item.
                            </p>
                        )}
                    </div>
                ))}

                {/* Classroom Observation Suggestion Box */}
                {sub.hasObservationRemarks && (
                    <div id="eval-item-obsRemarks" style={{ 
                        marginTop: "16px", marginBottom: "8px", padding: "20px", 
                        backgroundColor: errors.obsRemarks ? "var(--danger-dim)" : "var(--bg-base)", 
                        borderRadius: "12px", 
                        border: errors.obsRemarks ? "1px solid var(--danger)" : "1px solid var(--border)",
                        transition: "all 0.3s ease" 
                    }}>
                        <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "12px" }}>
                            What specific suggestion can you give in how this particular class session could have been improved?
                        </p>
                        <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "12px", lineHeight: 1.6 }}>
                            Minimum 80 characters required. Be specific for more useful feedback reports.
                        </p>
                        <textarea
                            value={obsRemarks}
                            onChange={(e) => {
                                setObsRemarks(e.target.value);
                                if (e.target.value.trim().length >= 80) {
                                    setErrors(prev => ({ ...prev, obsRemarks: false }));
                                }
                            }}
                            placeholder="Enter specific suggestions for the class session..."
                            rows={5}
                            style={{
                                width: "100%", padding: "16px", background: "var(--bg-input)",
                                border: errors.obsRemarks ? "2px solid var(--danger)" : "1.5px solid var(--border)",
                                borderRadius: "12px", color: "var(--text-primary)", fontSize: "13px", lineHeight: 1.6,
                                resize: "vertical", minHeight: "140px", transition: "all 0.2s ease"
                            }}
                            onFocus={(e) => { e.target.style.borderColor = "var(--gold-border)"; e.target.style.background="#FFFFFF"; e.target.style.boxShadow="0 0 0 3px rgba(200,148,10,0.10)"; }}
                            onBlur={(e) => { e.target.style.borderColor = errors.obsRemarks ? "var(--danger)" : "var(--border)"; e.target.style.background="var(--bg-input)"; e.target.style.boxShadow="none"; }}
                        />
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
                            {errors.obsRemarks && (
                                <p style={{ fontSize: "11px", color: "var(--danger)", fontWeight: 600 }}>
                                    Please write at least 80 characters.
                                </p>
                            )}
                            <p style={{ fontSize: "11px", color: obsRemarks.length >= 80 ? "var(--success)" : "var(--text-muted)", marginLeft: "auto" }}>
                                {obsRemarks.length} / 80 min
                            </p>
                        </div>
                    </div>
                )}
            </div>
          ))}
        </Card>
      ))}

      <Card id="eval-item-remarks" style={{ 
          marginBottom: "24px", padding: "24px",
          backgroundColor: errors.remarks ? "var(--danger-dim)" : "#FFFFFF", 
          border: errors.remarks ? "1px solid var(--danger)" : "1.5px solid rgba(26,50,112,0.15)",
          transition: "all 0.3s ease" 
      }}>
        <p style={{ fontSize: "14px", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--text-primary)", marginBottom: "12px" }}>
            Program Chair Remarks
        </p>
        <p style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: "16px" }}>
            Share specific observations regarding classroom instruction, research outputs, and overall performance. Your comments are processed by the feedback engine to generate structured reports. (Minimum 80 characters required)
        </p>
        <textarea
            value={remarks}
            onChange={(e) => {
                setRemarks(e.target.value);
                if (e.target.value.trim().length >= 80) {
                    setErrors(prev => ({ ...prev, remarks: false }));
                }
            }}
            placeholder="Add professional observations, notable achievements, or specific areas for development..."
            rows={5}
            style={{
                width: "100%", padding: "16px", background: "var(--bg-input)",
                border: errors.remarks ? "2px solid var(--danger)" : "1.5px solid var(--border)",
                borderRadius: "12px", color: "var(--text-primary)", fontSize: "13px", lineHeight: 1.6,
                resize: "vertical", minHeight: "140px", transition: "all 0.2s ease"
            }}
            onFocus={(e) => { e.target.style.borderColor = "var(--gold-border)"; e.target.style.background="#FFFFFF"; e.target.style.boxShadow="0 0 0 3px rgba(200,148,10,0.10)"; }}
            onBlur={(e) => { e.target.style.borderColor = errors.remarks ? "var(--danger)" : "var(--border)"; e.target.style.background="var(--bg-input)"; e.target.style.boxShadow="none"; }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
            {errors.remarks && (
                <p style={{ fontSize: "11px", color: "var(--danger)", fontWeight: 600 }}>
                    Please write at least 80 characters.
                </p>
            )}
            <p style={{ fontSize: "11px", color: remarks.length >= 80 ? "var(--success)" : "var(--text-muted)", marginLeft: "auto" }}>
                {remarks.length} / 80 min
            </p>
        </div>
      </Card>

      {Object.keys(errors).length > 0 && (
          <div style={{ padding:"14px", background:"var(--danger-dim)", border:"1px solid rgba(224,82,82,0.22)", borderRadius:"8px", marginBottom:"16px", textAlign: "center" }}>
              <p style={{ fontSize:"13px", color:"var(--danger)", fontWeight:600 }}>
                  Please complete all required ratings and ensure comment minimums are met before submitting.
              </p>
          </div>
      )}

      <div style={{ display:"flex", gap:"12px", justifyContent: "flex-end" }}>
        <button onClick={handleReset} style={{ padding:"14px 24px", borderRadius:"10px", background:"transparent", border:"1.5px solid var(--border)", color:"var(--text-second)", fontSize:"13px", fontWeight:700, cursor:"pointer" }}>
          Cancel
        </button>
        <button onClick={handleSubmit} style={{ padding:"14px 32px", borderRadius:"10px", background:"var(--gold)", color:"#1C1400", fontSize:"13px", fontWeight:700, border:"none", cursor:"pointer", transition:"all 0.2s ease" }}
          onMouseEnter={e=>{e.currentTarget.style.background="var(--gold-darker)"; e.currentTarget.style.transform="translateY(-1px)";}}
          onMouseLeave={e=>{e.currentTarget.style.background="var(--gold)"; e.currentTarget.style.transform="translateY(0)";}}>
          Submit Chair Evaluation
        </button>
      </div>

    </div>
  );
}

/* ── Full Page Evidence Verification View ── */
function EvidenceDetailView({ evidence, onBack, facultyName }) {
    const isStudent = evidence.type === 'student';
    
    return (
        <div className="anim-fade-in" style={{ maxWidth: "800px", margin: "0 auto" }}>
            <button onClick={onBack}
                style={{ display:"flex", alignItems:"center", gap:"6px", color:"var(--text-second)",
                fontSize:"13px", marginBottom:"20px", background:"none", border:"none", cursor:"pointer", fontWeight:600 }}>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Back to Dashboard
            </button>

            <Card style={{ padding: "30px", borderTop: "4px solid var(--gold)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
                    <div>
                        <p style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.08em", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "6px" }}>
                            Evidence Verification Record
                        </p>
                        <h2 style={{ fontSize: "22px", fontWeight: 700, color: "var(--text-primary)" }}>
                            {isStudent ? `Student Comment #${evidence.data.id}` : `${evidence.type === 'chair' ? 'Program Chair' : 'Dean'} Evaluation Record`}
                        </h2>
                        <p style={{ fontSize: "14px", color: "var(--text-second)", marginTop: "4px" }}>Faculty: <strong>{facultyName}</strong></p>
                    </div>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "11px", fontWeight: 700, color: "var(--success)", background: "var(--success-dim)", border: "1px solid var(--success-border)", borderRadius: "99px", padding: "6px 14px" }}>
                        Verified by XAI
                    </span>
                </div>

                <div style={{ height: "1px", background: "var(--border)", marginBottom: "24px" }} />

                <div style={{ marginBottom: "32px" }}>
                    <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>
                        Qualitative Feedback
                    </p>
                    <div style={{ padding: "20px", background: "var(--bg-base)", border: "1px solid var(--border)", borderRadius: "10px" }}>
                        <p style={{ fontSize: "15px", color: "var(--text-primary)", fontStyle: "italic", lineHeight: 1.7, margin: 0 }}>
                            "{isStudent ? evidence.data.text : evidence.data.remarks}"
                        </p>
                    </div>
                </div>

                <div>
                    <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>
                        Quantitative Ratings
                    </p>
                    
                    {isStudent ? (
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                            {Object.entries(evidence.data.ratings).map(([key, val]) => (
                                <div key={key} style={{ padding: "16px", border: "1px solid var(--border)", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span style={{ fontSize: "13px", color: "var(--text-second)", fontWeight: 500 }}>{key}</span>
                                    <span style={{ fontSize: "16px", fontWeight: 700, color: "var(--gold-darker)" }}>{val} / 5</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                            <div style={{ padding: "16px", border: "1px solid var(--border)", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{ fontSize: "13px", color: "var(--text-second)", fontWeight: 500 }}>Job Competencies</span>
                                <span style={{ fontSize: "16px", fontWeight: 700, color: "var(--gold-darker)" }}>{evidence.data.breakdown?.jc || "4.70"} / 5</span>
                            </div>
                            <div style={{ padding: "16px", border: "1px solid var(--border)", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{ fontSize: "13px", color: "var(--text-second)", fontWeight: 500 }}>Job Factors</span>
                                <span style={{ fontSize: "16px", fontWeight: 700, color: "var(--gold-darker)" }}>{evidence.data.breakdown?.jf || "4.50"} / 5</span>
                            </div>
                            <div style={{ padding: "16px", border: "1px solid var(--border)", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center", gridColumn: "1 / -1" }}>
                                <span style={{ fontSize: "13px", color: "var(--text-second)", fontWeight: 500 }}>Professional Qualities</span>
                                <span style={{ fontSize: "16px", fontWeight: 700, color: "var(--gold-darker)" }}>{evidence.data.breakdown?.pq || "4.60"} / 5</span>
                            </div>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}

/* *** Administrative Dashboard *** */
function AdministrativeDashboard({ facultyList, onBack }) {
  const [selected, setSelected] = useState(null);
  const [evidenceView, setEvidenceView] = useState(null);
  
  const withFeedback = facultyList.filter(f => aiFeedbackMap[f.id] && f.chairEvaluated && f.deanEvaluated);
  
  if (evidenceView && selected) {
      return <EvidenceDetailView evidence={evidenceView} facultyName={selected.name} onBack={() => setEvidenceView(null)} />;
  }

  if (selected) {
    const f = selected;
    const fb = aiFeedbackMap[f.id];
    return (
        <div className="anim-fade-in" style={{ maxWidth: "1000px", margin: "0 auto" }}>
            <button onClick={() => setSelected(null)}
                style={{ display:"flex", alignItems:"center", gap:"6px", color:"var(--text-second)",
                fontSize:"13px", marginBottom:"18px", background:"none", border:"none", cursor:"pointer", fontWeight:600 }}>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Back to Reports
            </button>

            {/* Dashboard Header */}
            <Card style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
                <div>
                    <h2 style={{ fontSize: "22px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" }}>{f.name}</h2>
                    <p style={{ fontSize: "13px", color: "var(--text-second)" }}>{f.dept} - {f.code} - {f.subject}</p>
                </div>
                <div style={{ textAlign: "right", display: "flex", alignItems: "center", gap: "16px" }}>
                    <div>
                        <p style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "2px" }}>Composite Score</p>
                        <p style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 700, color: "var(--gold-darker)", lineHeight: 1 }}>{Number(f.compositeScore).toFixed(2)}</p>
                    </div>
                    <StatusChip status={f.status} />
                </div>
            </Card>

            {/* Bento Grid Analytics */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                
                {/* Quantitative Box 1: Tri-Rater Evaluation Breakdown */}
                <Card style={{ display: "flex", flexDirection: "column" }}>
                    <p style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.08em", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "20px" }}>
                        Tri-Rater Breakdown
                    </p>
                    <RatingRow label={`Student Evaluation (30% Weight)`} score={f.studentScore} />
                    <RatingRow label={`Program Chair (40% Weight)`} score={f.chairScore} />
                    <RatingRow label={`Department Head / Dean (30% Weight)`} score={f.deanScore} />
                    <div style={{ marginTop: "auto", paddingTop: "16px", borderTop: "1px solid var(--border)" }}>
                        <p style={{ fontSize: "11px", color: "var(--text-muted)", fontStyle: "italic", lineHeight: 1.5 }}>
                            * Scores reflect the weighted averages mathematically calculated from {f.responses} student respondents and the official administrative reviews.
                        </p>
                    </div>
                </Card>

                {/* Quantitative Box 2: Administrative HRMO Criteria */}
                <Card>
                    <p style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.08em", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "20px" }}>
                        Administrative Evaluation (HRMO)
                    </p>
                    <RatingRow label="Job Competencies (55%)" score={f.chairScoreBreakdown?.jc || 4.70} />
                    <RatingRow label="Job Factors (25%)" score={f.chairScoreBreakdown?.jf || 4.50} />
                    <RatingRow label="Professional Qualities (20%)" score={f.chairScoreBreakdown?.pq || 4.60} />
                </Card>

                {/* Qualitative Box 3: QLoRA Generated Synthesis */}
                <Card style={{ gridColumn: "1 / -1", borderLeft: "4px solid var(--gold)" }}>
                    <p style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.08em", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "16px" }}>
                        Guided Explainable Feedback
                    </p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                        <div style={{ padding: "16px", background: "var(--success-dim)", border: "1px solid var(--success-border)", borderRadius: "8px" }}>
                            <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--success)", textTransform: "uppercase", marginBottom: "10px" }}>Identified Strengths</p>
                            {fb.strengths.map((s, i) => <p key={i} style={{ fontSize: "13px", color: "var(--text-primary)", lineHeight: 1.6, marginBottom: i < fb.strengths.length - 1 ? "10px" : 0 }}>• {s}</p>)}
                        </div>
                        <div style={{ padding: "16px", background: "var(--gold-dim)", border: "1px solid var(--amber-border)", borderRadius: "8px" }}>
                            <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--gold-darker)", textTransform: "uppercase", marginBottom: "10px" }}>Points for Possible Improvement</p>
                            {fb.improvements.map((s, i) => <p key={i} style={{ fontSize: "13px", color: "var(--text-primary)", lineHeight: 1.6, marginBottom: i < fb.improvements.length - 1 ? "10px" : 0 }}>• {s}</p>)}
                        </div>
                    </div>
                </Card>

                {/* Qualitative Box 4: XAI Citation Mapper */}
                <Card style={{ gridColumn: "1 / -1" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                        <div>
                            <p style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.08em", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px" }}>
                                XAI Citation Mapper (Evidence Verification)
                            </p>
                            <p style={{ fontSize: "12px", color: "var(--text-second)" }}>
                                Click on any anonymized student comment below to view their full evaluation record that justifies the AI generation.
                            </p>
                        </div>
                        <span style={{ fontSize: "10px", fontWeight: 700, color: "var(--gold)", background: "var(--gold-dim)", border: "1px solid var(--amber-border)", borderRadius: "99px", padding: "3px 10px" }}>
                            Auditable Records
                        </span>
                    </div>
                    
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {fb.citations?.map((c, i) => (
                            <button key={i} onClick={() => setEvidenceView({ type: 'student', data: c })}
                                style={{ width: "100%", padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg-base)", border: "1px solid var(--border)", borderLeft: "3px solid var(--gold)", borderRadius: "0 8px 8px 0", cursor: "pointer", textAlign: "left", transition: "all 0.2s" }}
                                onMouseEnter={e => e.currentTarget.style.background = "#FFFFFF"}
                                onMouseLeave={e => e.currentTarget.style.background = "var(--bg-base)"}>
                                <div>
                                    <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "6px" }}>STUDENT COMMENT #{c.id}</p>
                                    <p style={{ fontSize: "13px", color: "var(--text-primary)", fontStyle: "italic", lineHeight: 1.5, margin: 0 }}>"{c.text}"</p>
                                </div>
                                <span style={{ fontSize: "18px", color: "var(--gold)", paddingLeft: "16px" }}>→</span>
                            </button>
                        ))}
                    </div>
                </Card>

                {/* Qualitative Box 5: Administrative Remarks */}
                <Card style={{ gridColumn: "1 / -1" }}>
                    <p style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.08em", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "8px" }}>
                        Administrative Remarks
                    </p>
                    <p style={{ fontSize: "12px", color: "var(--text-second)", marginBottom: "16px" }}>
                        Click to view the specific rubric breakdown that contributed to these remarks.
                    </p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                        <button onClick={() => setEvidenceView({ type: 'chair', data: { remarks: fb.chairRemarks, breakdown: f.chairScoreBreakdown } })}
                            style={{ padding: "20px", border: "1px solid var(--border)", borderRadius: "8px", background: "#FFFFFF", cursor: "pointer", textAlign: "left", transition: "all 0.2s", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = "var(--gold)"}
                            onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}>
                            <div>
                                <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "8px", textTransform: "uppercase" }}>Program Chair</p>
                                <p style={{ fontSize: "13px", color: "var(--text-primary)", fontStyle: "italic", lineHeight: 1.6 }}>"{fb.chairRemarks || "Observation highlights strong command of the subject matter and effective management of administrative duties."}"</p>
                            </div>
                            <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--gold)", marginTop: "16px", display: "flex", alignItems: "center", gap: "4px" }}>View Full Record →</span>
                        </button>
                        
                        <button onClick={() => setEvidenceView({ type: 'dean', data: { remarks: fb.deanRemarks, breakdown: f.deanScoreBreakdown } })}
                            style={{ padding: "20px", border: "1px solid var(--border)", borderRadius: "8px", background: "#FFFFFF", cursor: "pointer", textAlign: "left", transition: "all 0.2s", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = "var(--gold)"}
                            onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}>
                            <div>
                                <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "8px", textTransform: "uppercase" }}>Department Head / Dean</p>
                                <p style={{ fontSize: "13px", color: "var(--text-primary)", fontStyle: "italic", lineHeight: 1.6 }}>"{fb.deanRemarks || "Review of syllabus and research output indicates excellent academic alignment; community involvement meets college targets."}"</p>
                            </div>
                            <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--gold)", marginTop: "16px", display: "flex", alignItems: "center", gap: "4px" }}>View Full Record →</span>
                        </button>
                    </div>
                </Card>

                {/* Qualitative Box 6: Holistic Recommendation */}
                <Card style={{ gridColumn: "1 / -1", background: "var(--bg-base)", border: "1px solid var(--border)" }}>
                    <p style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.08em", color: "var(--gold-darker)", textTransform: "uppercase", marginBottom: "8px" }}>
                        Holistic Recommendation
                    </p>
                    <p style={{ fontSize: "14px", color: "var(--text-primary)", lineHeight: 1.7, fontWeight: 500 }}>
                        {fb.recommendation} 
                    </p>
                </Card>

            </div>
        </div>
    );
  }

  // Initial List View
  return (
    <div className="anim-fade-in">
      <div style={{ padding:"14px 18px", background:"var(--bg-base)", border:"1px solid var(--border)",
        borderRadius:"var(--radius-md)", marginBottom:"20px" }}>
        <p style={{ fontSize:"13px", color:"var(--text-second)", lineHeight:1.6 }}>
          Select a faculty member to view their detailed performance analytics.
        </p>
      </div>

      {withFeedback.length === 0 ? (
        <Card><p style={{ textAlign:"center", color:"var(--text-muted)", padding:"20px 0" }}>No completed evaluation cycles yet. Waiting for pending Chair or Dean evaluations.</p></Card>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
          {withFeedback.map(f => (
              <Card key={f.id} onClick={() => setSelected(f)} style={{ cursor: "pointer", transition: "border-color 0.2s", padding: "16px" }} onMouseEnter={e => e.currentTarget.style.borderColor = "var(--gold)"} onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                      <div>
                          <p style={{ fontWeight: 600, fontSize: "15px", color: "var(--text-primary)", marginBottom: "4px" }}>{f.name}</p>
                          <p style={{ fontSize: "12px", color: "var(--text-second)" }}>{f.dept} - {f.code}</p>
                      </div>
                      <StatusChip status={f.status} />
                  </div>
                  <div style={{ height: "1px", background: "var(--border)", margin: "12px 0" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>{f.responses} Student Responses</p>
                      <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--gold-darker)" }}>{Number(f.compositeScore).toFixed(2)}</p>
                  </div>
              </Card>
          ))}
        </div>
      )}
    </div>
  );
}

/* *** Main *** */
export default function ChairView({ activeTab }) {
  const [localFacultyList, setLocalFacultyList] = useState(getFacultyList());
  const [evaluatingFaculty, setEvaluatingFaculty] = useState(null);

  const refreshData = () => {
    setLocalFacultyList(getFacultyList());
  };

  if (activeTab === "overview") {
      return <div className="anim-fade-up"><Overview facultyList={localFacultyList} /></div>;
  }
  
  if (activeTab === "evaluate") {
      if (evaluatingFaculty) {
          return <div className="anim-fade-up"><ChairEvalTab facultyList={localFacultyList} preSelected={evaluatingFaculty} onBack={() => setEvaluatingFaculty(null)} refreshData={refreshData} /></div>;
      }
      return <div className="anim-fade-up"><ChairEvalTab facultyList={localFacultyList} preSelected={null} onBack={()=>{}} refreshData={refreshData}/></div>;
  }
  
  if (activeTab === "feedback") return <div className="anim-fade-up"><AdministrativeDashboard facultyList={localFacultyList} /></div>;
  return null;
}