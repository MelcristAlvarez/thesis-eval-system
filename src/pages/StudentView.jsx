/**
 * StudentView.jsx
 * Student faculty evaluation form mapped exactly to the provided evaluation forms.
 * Features Part I (1-5 Likert scale with Remarks) and Part II (Qualities and Areas to Improve).
 * Integrated with auto-scroll validation, responsive inputs, and score calculation.
 */

import { useState } from "react";
import { getFacultyList, studentSubmissions, SEMESTER } from "../data/store.js";

/* *** Shared UI *** */
function Card({ children, style={} }) {
  return (
    <div style={{
      background:"#FFFFFF", border:"1px solid var(--border)",
      borderRadius:"14px", padding:"22px",
      boxShadow:"var(--shadow-card)", boxSizing: "border-box", ...style
    }}>{children}</div>
  );
}

/* *** Evaluation Questions (Mapped from Images) *** */

// Rating Scale for items 1-2: 5 Day 1, 4 Day 2, 3 Day 3, 2 Day 4, 1 Beyond Day 4
const part1Items1to2 = [
  { id: "q1", prompt: "1. has oriented us on the VMO of the university and the department" },
  { id: "q2", prompt: "2. has oriented us on the program outcomes and the course content (requirements, grading system, references, etc.)" }
];

// Rating Scale for items 3-24: 5 Always, 4 Often, 3 Sometimes, 2 Rarely, 1 Never
const part1Items3to24 = [
  { id: "q3", prompt: "3. explains and clarifies the objectives as specified in the module/syllabus/curriculum map/instructional material/course outline" },
  { id: "q4", prompt: "4. explains the lesson clearly" },
  { id: "q5", prompt: "5. relates subject matter to other disciplines and to real life situations" },
  { id: "q6", prompt: "6. asks relevant and thought-provoking questions" },
  { id: "q7", prompt: "7. uses a grading method based on the University's approved criteria" },
  { id: "q8", prompt: "8. comes/attends to class prepared" },
  { id: "q9", prompt: "9. conducts regular class/session" },
  { id: "q10", prompt: "10. starts and ends class with a prayer" },
  { id: "q11", prompt: "11. checks our attendance regularly" },
  { id: "q12", prompt: "12. encourages us to participate actively in discussions and activities" },
  { id: "q13", prompt: "13. uses varied teaching strategies to help us learn" },
  { id: "q14", prompt: "14. uses varied means of evaluating learning such as exercises, activities, tests, etc." },
  { id: "q15", prompt: "15. gives examinations/activities according to the given coverage" },
  { id: "q16", prompt: "16. uses appropriate teaching aids" },
  { id: "q17", prompt: "17. uses the language of instruction proficiently" },
  { id: "q18", prompt: "18. requires us to use textbooks, references and/or other instructional materials" },
  { id: "q19", prompt: "19. is prompt in returning corrected test papers and giving feedback to submitted outputs and requirements" },
  { id: "q20", prompt: "20. is available for consultation and/or advising" },
  { id: "q21", prompt: "21. motivates us to study more conscientiously" },
  { id: "q22", prompt: "22. promotes an open and orderly atmosphere in the classroom" },
  { id: "q23", prompt: "23. shows concern to improve our performance" },
  { id: "q24", prompt: "24. is well-groomed and dresses appropriately" },
];

// Part II Qualities
const qualitiesList = [
  "Approachable", "Techno Savvy", "Good Communicator", "Respectful",
  "Consistent", "Organized", "Enthusiastic", "Open-minded",
  "Professional", "Fair", "Humble", "With good sense of humor",
  "Friendly"
];

// Part II Areas for Improvement
const improvementAreas = [
  { id: "imp1", label: "Teaching Strategies" },
  { id: "imp2", label: "Use of instructional materials" },
  { id: "imp3", label: "Virtual Classroom/Classroom management" },
  { id: "imp4", label: "Other areas that I would like to suggest for this teacher to improve on" }
];

/* *** Row Component for Part I *** */
function QuestionRow({ item, rating, onRate, remark, onRemarkChange, error }) {
  return (
    <div id={`eval-item-${item.id}`} style={{ 
        display: "flex", flexWrap: "wrap", gap: "16px", padding: "12px 16px", 
        borderBottom: "1px solid var(--border)", alignItems: "center", 
        background: error ? "var(--danger-dim)" : "transparent",
        border: error ? "1px solid var(--danger)" : "1px solid transparent",
        borderRadius: "8px",
        transition: "all 0.2s"
    }}>
      <div style={{ flex: "1 1 250px", fontSize: "13px", color: "var(--text-primary)", lineHeight: 1.5, minWidth: "200px" }}>
          {item.prompt}
      </div>
      
      {/* 5 4 3 2 1 Rating Buttons */}
      <div style={{ display: "flex", gap: "4px", flexShrink: 0 }}>
        {[5, 4, 3, 2, 1].map(n => (
          <button
            key={n}
            onClick={() => onRate(n)}
            style={{
              width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center",
              border: `1px solid ${rating === n ? "var(--gold-darker)" : "var(--border)"}`, 
              background: rating === n ? "var(--gold-dim)" : "#FFFFFF",
              color: rating === n ? "var(--gold-darker)" : "var(--text-second)", 
              cursor: "pointer", fontSize: "13px", borderRadius: "4px",
              fontWeight: rating === n ? 700 : 500, transition: "all 0.15s"
            }}
          >
            {n}
          </button>
        ))}
      </div>

      {/* Remarks Input with strict box-sizing */}
      <div style={{ flex: "1 1 150px", minWidth: "120px", maxWidth: "250px", boxSizing: "border-box" }}>
        <input
          type="text"
          placeholder="Remarks (Optional)"
          value={remark || ""}
          onChange={(e) => onRemarkChange(e.target.value)}
          style={{ 
              width: "100%", padding: "8px 12px", fontSize: "12px", 
              border: "1px solid var(--border)", borderRadius: "6px",
              background: "var(--bg-input)", color: "var(--text-primary)",
              boxSizing: "border-box"
          }}
        />
      </div>
    </div>
  );
}

/* *** Evaluation Form *** */
function EvalForm({ faculty, onClose, onSubmit }) {
  const [ratings, setRatings] = useState({});
  const [remarks, setRemarks] = useState({});
  const [qualities, setQualities] = useState([]);
  const [otherQualities, setOtherQualities] = useState("");
  
  const [improvements, setImprovements] = useState({});
  const [impRemarks, setImpRemarks] = useState({});
  const [otherImprovements, setOtherImprovements] = useState("");

  const [errors, setErrors] = useState({});
  const [submitResult, setSubmitResult] = useState(null);
  const [done, setDone] = useState(false);

  const handleRate = (id, val) => {
      setRatings(prev => ({ ...prev, [id]: val }));
      setErrors(prev => ({ ...prev, [id]: false }));
  };

  const handleRemark = (id, val) => setRemarks(prev => ({ ...prev, [id]: val }));

  const toggleQuality = (q) => {
      setQualities(prev => prev.includes(q) ? prev.filter(i => i !== q) : [...prev, q]);
  };

  const toggleImprovement = (id) => {
      setImprovements(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleImpRemark = (id, val) => setImpRemarks(prev => ({ ...prev, [id]: val }));

  const submit = () => {
    const e = {};
    const allItems = [...part1Items1to2, ...part1Items3to24];
    
    allItems.forEach(c => { 
        if (!ratings[c.id]) e[c.id] = true; 
    });
    
    if (Object.keys(e).length > 0) { 
        setErrors(e); 
        const firstErrorId = Object.keys(e)[0];
        const errorElement = document.getElementById(`eval-item-${firstErrorId}`);
        if (errorElement) {
            errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return; 
    }
    
    // Calculate the student average score based on the 24 questions
    const allRatingsValues = Object.values(ratings);
    const sum = allRatingsValues.reduce((acc, curr) => acc + curr, 0);
    const average = (sum / allRatingsValues.length).toFixed(2);

    setSubmitResult({
        totalQuestions: allRatingsValues.length,
        sum: sum,
        average: average
    });

    setDone(true);
  };

  if (done && submitResult) return (
    <div style={{ textAlign:"center", padding:"48px 0" }}>
      <div style={{ width:"72px", height:"72px", borderRadius:"50%", margin:"0 auto 18px",
        background:"var(--success-dim)", border:"2px solid var(--success-border)",
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:"32px" }}>✅</div>
      <h3 style={{ fontSize:"20px", fontWeight:600, color:"var(--text-primary)",
        marginBottom:"10px" }}>Evaluation Submitted</h3>
      <p style={{ fontSize:"13px", color:"var(--text-second)", maxWidth:"360px",
        margin:"0 auto 24px", lineHeight:1.7 }}>
        Your response has been securely recorded. Here is your calculated evaluation rating for this faculty member:
      </p>

      {/* Calculation Breakdown Card */}
      <div style={{ maxWidth: "350px", margin: "0 auto 30px", background: "var(--bg-base)", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px", textAlign: "left" }}>
         <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", fontSize: "13px" }}>
            <span style={{ color: "var(--text-muted)" }}>Total Score Points</span>
            <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{submitResult.sum}</span>
         </div>
         <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", fontSize: "13px" }}>
            <span style={{ color: "var(--text-muted)" }}>Total Questions Answered</span>
            <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{submitResult.totalQuestions}</span>
         </div>
         <div style={{ height: "1px", background: "var(--border)", margin: "12px 0" }} />
         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>Your Average Rating</span>
            <span style={{ fontSize: "20px", fontWeight: 800, color: "var(--gold)" }}>{submitResult.average}</span>
         </div>
      </div>

      <button onClick={() => onSubmit(faculty.id)} style={{ padding:"10px 24px", borderRadius:"8px", background:"var(--success)", color:"#FFFFFF", fontSize:"13px", fontWeight:700, border:"none", cursor:"pointer" }}>
        Return to Faculty List
      </button>
    </div>
  );

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
      
      <div style={{ padding: "16px 20px", marginBottom: "24px", background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
        <div>
            <p style={{ fontSize:"11px", fontWeight:700, letterSpacing:"0.05em", color:"var(--text-muted)", textTransform:"uppercase", marginBottom:"4px" }}>
                Teacher
            </p>
            <h3 style={{ fontSize:"16px", fontWeight:700, color: "var(--text-primary)" }}>{faculty.name}</h3>
        </div>
        <div style={{ textAlign: "right" }}>
            <p style={{ fontSize:"11px", fontWeight:700, letterSpacing:"0.05em", color:"var(--text-muted)", textTransform:"uppercase", marginBottom:"4px" }}>
                Subject & Schedule
            </p>
            <p style={{ fontSize:"14px", fontWeight:500, color: "var(--text-second)" }}>{faculty.code} - {faculty.subject}</p>
        </div>
      </div>

      <Card style={{ padding: 0, overflow: "hidden", marginBottom: "24px" }}>
          <div style={{ padding: "20px 24px", background: "var(--bg-base)", borderBottom: "1px solid var(--border)" }}>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px" }}>Part I</h3>
              <p style={{ fontSize: "13px", color: "var(--text-second)", lineHeight: 1.6 }}>
                  <strong>INSTRUCTION:</strong> Kindly indicate your evaluation of this teacher's performance in class by encircling the number that expresses your view. Giving general comments and suggestions in the space provided for Remarks is optional.
              </p>
          </div>

          {/* Section 1-2 */}
          <div style={{ padding: "16px 24px", background: "#FFFFFF", borderBottom: "1px solid var(--border)" }}>
              <div style={{ display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap" }}>
                  <p style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-primary)", width: "100%" }}>Rating Scale for items 1-2:</p>
                  {["5 - Day 1", "4 - Day 2", "3 - Day 3", "2 - Day 4", "1 - Beyond Day 4"].map(lbl => (
                      <span key={lbl} style={{ fontSize: "11px", padding: "4px 10px", background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "4px" }}>{lbl}</span>
                  ))}
              </div>
              <p style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "8px" }}>Questions: My professor/teacher...</p>
              
              {part1Items1to2.map(item => (
                  <QuestionRow key={item.id} item={item} rating={ratings[item.id]} onRate={(v) => handleRate(item.id, v)} remark={remarks[item.id]} onRemarkChange={(v) => handleRemark(item.id, v)} error={errors[item.id]} />
              ))}
          </div>

          {/* Section 3-24 */}
          <div style={{ padding: "16px 24px", background: "#FFFFFF" }}>
              <div style={{ display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap" }}>
                  <p style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-primary)", width: "100%" }}>Rating Scale for items 3-24:</p>
                  {["5 - Always", "4 - Often", "3 - Sometimes", "2 - Rarely", "1 - Never"].map(lbl => (
                      <span key={lbl} style={{ fontSize: "11px", padding: "4px 10px", background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "4px" }}>{lbl}</span>
                  ))}
              </div>
              <p style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "8px" }}>Questions: My professor/teacher...</p>
              
              {part1Items3to24.map((item) => (
                  <QuestionRow key={item.id} item={item} rating={ratings[item.id]} onRate={(v) => handleRate(item.id, v)} remark={remarks[item.id]} onRemarkChange={(v) => handleRemark(item.id, v)} error={errors[item.id]} />
              ))}
          </div>
      </Card>

      <Card style={{ padding: 0, overflow: "hidden", marginBottom: "24px", boxSizing: "border-box" }}>
          <div style={{ padding: "20px 24px", background: "var(--bg-base)", borderBottom: "1px solid var(--border)" }}>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px" }}>Part II</h3>
              <p style={{ fontSize: "13px", color: "var(--text-second)", lineHeight: 1.6 }}>
                  <strong>INSTRUCTION:</strong> Please check the box that would best fit the criteria below. Multiple answers are allowed. Giving general comments and suggestions in the space provided for Remarks is optional.
              </p>
          </div>

          <div style={{ padding: "24px" }}>
              <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "16px" }}>
                  1. What are the qualities that I like in this teacher?
              </p>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "12px", marginBottom: "16px" }}>
                  {qualitiesList.map(q => (
                      <label key={q} style={{ fontSize: "13px", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", padding: "8px", border: "1px solid var(--border)", borderRadius: "6px", background: qualities.includes(q) ? "var(--gold-dim)" : "transparent" }}>
                          <input type="checkbox" checked={qualities.includes(q)} onChange={() => toggleQuality(q)} style={{ cursor: "pointer" }} />
                          {q}
                      </label>
                  ))}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "13px", fontWeight: 500 }}>Others:</span>
                  <input type="text" value={otherQualities} onChange={(e) => setOtherQualities(e.target.value)} style={{ flex: 1, minWidth: "200px", padding: "8px 12px", fontSize: "13px", border: "1px solid var(--border)", borderRadius: "6px", boxSizing: "border-box" }} />
              </div>

              <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "16px", paddingTop: "24px", borderTop: "1px solid var(--border)" }}>
                  2. What areas would I like this teacher to improve on?
              </p>

              {improvementAreas.map((imp) => (
                  <div key={imp.id} style={{ display: "flex", gap: "16px", marginBottom: "12px", alignItems: "center", flexWrap: "wrap" }}>
                      <label style={{ fontSize: "13px", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", width: "100%", maxWidth: "350px", flexShrink: 0 }}>
                          <input type="checkbox" checked={improvements[imp.id] || false} onChange={() => toggleImprovement(imp.id)} style={{ cursor: "pointer" }} />
                          {imp.label}
                      </label>
                      <input type="text" placeholder="Remarks" value={impRemarks[imp.id] || ""} onChange={(e) => handleImpRemark(imp.id, e.target.value)} style={{ flex: "1 1 200px", padding: "8px 12px", fontSize: "13px", border: "1px solid var(--border)", borderRadius: "6px", background: "var(--bg-input)", boxSizing: "border-box" }} />
                  </div>
              ))}

              <div style={{ marginTop: "24px", width: "100%", boxSizing: "border-box" }}>
                  <p style={{ fontSize: "13px", color: "var(--text-second)", marginBottom: "8px" }}>Other areas that I would like to suggest for this teacher to improve on</p>
                  <textarea 
                      rows={3} 
                      value={otherImprovements} 
                      onChange={(e) => setOtherImprovements(e.target.value)} 
                      style={{ width: "100%", padding: "12px", fontSize: "13px", border: "1px solid var(--border)", borderRadius: "6px", resize: "vertical", boxSizing: "border-box" }}
                  />
              </div>
          </div>
      </Card>

      <div style={{ padding: "16px", background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "8px", marginBottom: "24px" }}>
          <p style={{ fontSize: "11px", color: "var(--text-muted)", lineHeight: 1.6 }}>
              <strong>PRIVACY POLICY:</strong> University of Santo Tomas-Legazpi respects and is committed to maintaining the privacy of all individuals who provide personal information to us. UST-Legazpi Privacy Policy governs how to deal with the collection, security, quality, use and disclosure of personal information in compliance with the Data Privacy Act of 2012 or the Republic Act No. 10173.
          </p>
      </div>

      {Object.keys(errors).length > 0 && (
          <div style={{ padding:"14px", background:"var(--danger-dim)", border:"1px solid rgba(224,82,82,0.22)", borderRadius:"8px", marginBottom:"16px", textAlign: "center" }}>
              <p style={{ fontSize:"13px", color:"var(--danger)", fontWeight:600 }}>
                  Please rate all questions in Part I before submitting. The missing items have been highlighted in red.
              </p>
          </div>
      )}

      <div style={{ display:"flex", gap:"12px", justifyContent: "flex-end" }}>
        <button onClick={onClose} style={{ padding:"12px 24px", borderRadius:"6px", background:"transparent", border:"1.5px solid var(--border)", color:"var(--text-second)", fontSize:"13px", fontWeight:600, cursor:"pointer" }}>
          Cancel
        </button>
        <button onClick={submit} style={{ padding:"12px 32px", borderRadius:"6px", background:"var(--success)", color:"#FFFFFF", fontSize:"13px", fontWeight:700, border:"none", cursor:"pointer", transition:"opacity 0.15s" }}
          onMouseEnter={e=>e.currentTarget.style.opacity="0.9"}
          onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
          Submit Evaluation
        </button>
      </div>

    </div>
  );
}

/* ── Main Component ── */
export default function StudentView({ activeTab }) {
  const [facultyList] = useState(getFacultyList());
  const [selected,  setSelected]  = useState(null);
  const [submitted, setSubmitted] = useState(new Set(studentSubmissions.map(s=>s.facultyId)));

  const onSubmit = (fid) => {
    setSubmitted(p=>new Set([...p,fid]));
    setSelected(null);
  };

  const sorted = [...facultyList].sort((a,b)=>
    (submitted.has(a.id)?1:0)-(submitted.has(b.id)?1:0)
  );

  /* ── Evaluate tab ── */
  if(activeTab==="evaluate") {
    if(selected) return (
      <div className="anim-fade-in">
        <button onClick={()=>setSelected(null)}
          style={{ display:"flex", alignItems:"center", gap:"6px", color:"var(--text-second)", fontSize:"13px", marginBottom:"20px", background:"none", border:"none", cursor:"pointer", fontWeight:600 }}>
          ← Back to faculty list
        </button>
        <EvalForm faculty={selected} onClose={()=>setSelected(null)} onSubmit={onSubmit}/>
      </div>
    );

    return (
      <div className="anim-fade-up">
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"20px", flexWrap:"wrap", gap:"10px" }}>
          <div>
            <h2 style={{ fontFamily:"var(--font-display)", fontSize:"22px", fontWeight:600, color:"var(--text-primary)", marginBottom:"2px" }}>Faculty Roster</h2>
            <p style={{ fontSize:"12px", color:"var(--text-muted)" }}>
              {sorted.filter(f=>!submitted.has(f.id)).length} evaluations remaining · {SEMESTER}
            </p>
          </div>
          <div style={{ display:"inline-flex", alignItems:"center", gap:"6px", padding:"6px 14px", background:"#FFFFFF", border:"1px solid var(--border)", borderRadius:"var(--radius-pill)", boxShadow:"var(--shadow-xs)" }}>
            <span style={{ width:"6px", height:"6px", borderRadius:"50%", background:"var(--success)" }}/>
            <span style={{ fontSize:"11px", fontWeight:700, color:"var(--text-primary)" }}>CEAFA · BSCS 3G</span>
          </div>
        </div>

        <div className="card-list">
          {sorted.map(f => {
            const done = submitted.has(f.id);
            return (
              <div key={f.id} style={{ display:"flex", alignItems:"center", gap:"14px", padding:"16px 20px", background:"#FFFFFF", border:`1px solid ${done?"var(--border)":"rgba(160,120,0,0.15)"}`, borderRadius:"12px", boxShadow: done?"none":"var(--shadow-xs)", opacity:done?0.60:1, transition:"all 0.2s" }}>
                <div style={{ width:"42px", height:"42px", borderRadius:"11px", flexShrink:0, background: done ? "var(--bg-elevated)" : "var(--gold)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--font-display)", fontSize:"16px", color:done?"var(--text-muted)":"#FFFFFF", fontWeight:700 }}>
                  {f.name.split(" ").slice(-1)[0][0]}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontWeight:600, fontSize:"14px", color:"var(--text-primary)", marginBottom:"2px", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{f.name}</p>
                  <p style={{ fontSize:"12px", color:"var(--text-muted)", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                    {f.code} · {f.subject}
                  </p>
                </div>
                {done ? (
                  <span style={{ fontSize:"11px", fontWeight:700, color:"var(--success)", background:"var(--success-dim)", border:"1px solid var(--success-border)", borderRadius:"99px", padding:"5px 14px", flexShrink:0, whiteSpace:"nowrap" }}>✓ Submitted</span>
                ) : (
                  <button onClick={()=>setSelected(f)} style={{ padding:"8px 18px", borderRadius:"var(--radius-sm)", flexShrink:0, background:"transparent", border:"1.5px solid var(--charcoal)", color:"var(--charcoal)", fontSize:"12px", fontWeight:700, whiteSpace:"nowrap", cursor:"pointer", transition:"all 0.15s" }}
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
        <h2 style={{ fontFamily:"var(--font-display)", fontSize:"22px", fontWeight:600, color:"var(--text-primary)", marginBottom:"4px" }}>My Submissions</h2>
        <p style={{ fontSize:"12px", color:"var(--text-muted)", marginBottom:"20px" }}>
          {subs.length} of {facultyList.length} evaluations submitted · {SEMESTER}
        </p>
        {subs.length===0 ? (
          <div style={{ textAlign:"center", padding:"48px 0", background:"#FFFFFF", border:"1px solid var(--border)", borderRadius:"14px" }}>
            <div style={{ fontSize:"40px", marginBottom:"12px" }}>📋</div>
            <p style={{ color:"var(--text-second)", fontSize:"14px", fontWeight:600, marginBottom:"4px" }}>No evaluations submitted yet</p>
            <p style={{ color:"var(--text-muted)", fontSize:"12px" }}>
              Head to Evaluate Faculty to get started.
            </p>
          </div>
        ) : (
          <div className="card-list">
            {studentSubmissions.map((s,i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:"16px", padding:"16px 22px", background:"#FFFFFF", border:"1px solid var(--border)", borderRadius:"12px", boxShadow:"var(--shadow-xs)" }}>
                <div style={{ flex:1 }}>
                  <p style={{ fontWeight:600, fontSize:"14px", marginBottom:"2px" }}>{s.facultyName}</p>
                  <p style={{ fontSize:"12px", color:"var(--text-muted)" }}>
                    {s.subject} · Submitted {s.submittedAt}
                  </p>
                </div>
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  <p style={{ fontFamily:"var(--font-display)", fontSize:"26px", fontWeight:600, color:"var(--gold-darker)", lineHeight:1 }}>{s.avg.toFixed(1)}</p>
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