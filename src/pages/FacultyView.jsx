/**
 * FacultyView.jsx
 * - My Ratings: composite score, student criterion bars, Chair + Dean breakdowns
 * - My AI Feedback: fully clickable accordion with chair + dean remarks
 */
import { useState } from "react";
import { facultyList, evaluationCriteria, aiFeedbackMap, SEMESTER } from "../data/mockData.js";

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
    good:        {label:"Good",         bg:"rgba(200,148,10,0.10)",border:"rgba(200,148,10,0.30)", color:"#A07800"},
    average:     {label:"Average",      bg:"rgba(160,120,0,0.08)", border:"rgba(160,120,0,0.22)",  color:"#7A5A00"},
    needsSupport:{label:"Needs Support",bg:"rgba(184,48,48,0.08)", border:"rgba(184,48,48,0.22)",  color:"#B83030"},
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

/* ── My Ratings tab ─────────────────────────────── */
function MyRatings({ faculty }) {
  const criterionScores = {
    e1: Math.min(5, +(faculty.studentScore * 1.04).toFixed(2)),
    e2: Math.min(5, +(faculty.studentScore * 0.98).toFixed(2)),
    e3: Math.min(5, +(faculty.studentScore * 1.02).toFixed(2)),
    e4: Math.min(5, +(faculty.studentScore * 0.96).toFixed(2)),
    e5: Math.min(5, +(faculty.studentScore * 1.00).toFixed(2)),
  };

  return (
    <div className="anim-fade-in">
      {/* Hero composite score */}
      <Card style={{marginBottom:"18px"}}>
        <div style={{display:"flex",alignItems:"center",gap:"24px",flexWrap:"wrap"}}>
          <ScoreRing score={faculty.compositeScore}/>
          <div style={{flex:1,minWidth:"200px"}}>
            <p style={{fontSize:"11px",fontWeight:700,letterSpacing:"0.08em",
              textTransform:"uppercase",color:"var(--text-muted)",marginBottom:"6px"}}>
              Composite Score · {SEMESTER}
            </p>
            <h2 style={{fontFamily:"var(--font-display)",fontSize:"24px",fontWeight:600,
              color:"var(--text-primary)",marginBottom:"8px",lineHeight:1}}>{faculty.name}</h2>
            <p style={{fontSize:"13px",color:"var(--text-muted)",marginBottom:"14px"}}>
              {faculty.dept} · {faculty.code} · {faculty.subject}
            </p>
            <StatusBadge status={faculty.status}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",minWidth:"200px"}}>
            {[
              {label:"Student Score (70%)", value:faculty.studentScore.toFixed(2), note:`${faculty.responses} responses`},
              {label:"Chair Score (30%)",   value:faculty.chairEvaluated?faculty.chairScore.toFixed(2):"—", note:faculty.chairEvaluated?"Evaluated":"Pending"},
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
        {/* Student criterion bars */}
        <Card>
          <p style={{fontSize:"11px",fontWeight:700,letterSpacing:"0.08em",
            textTransform:"uppercase",color:"var(--text-muted)",marginBottom:"16px"}}>
            Student Ratings by Criterion
          </p>
          {evaluationCriteria.map(c=>(
            <CriterionBar key={c.id} label={c.category} value={criterionScores[c.id]}/>
          ))}
        </Card>

        {/* Chair + Dean breakdown */}
        <Card>
          <p style={{fontSize:"11px",fontWeight:700,letterSpacing:"0.08em",
            textTransform:"uppercase",color:"var(--text-muted)",marginBottom:"16px"}}>
            Chair &amp; Dean Evaluation Breakdown
          </p>
          {faculty.chairEvaluated && faculty.chairScoreBreakdown ? (
            <>
              <p style={{fontSize:"10px",fontWeight:700,color:"var(--gold-darker)",
                letterSpacing:"0.07em",textTransform:"uppercase",marginBottom:"8px"}}>
                Chairperson
              </p>
              {[
                {label:"Classroom Observation (40%)",key:"co"},
                {label:"Research & Publications (20%)",key:"re"},
                {label:"Community Extension (20%)",key:"ce"},
                {label:"Professional Performance (20%)",key:"pf"},
              ].map(item=>(
                <CriterionBar key={item.key} label={item.label}
                  value={parseFloat(faculty.chairScoreBreakdown[item.key])}/>
              ))}
              {/* Dean breakdown — using same chair data for mock */}
              <div style={{marginTop:"16px",paddingTop:"14px",borderTop:"1px solid var(--border)"}}>
                <p style={{fontSize:"10px",fontWeight:700,color:"var(--gold-darker)",
                  letterSpacing:"0.07em",textTransform:"uppercase",marginBottom:"8px"}}>
                  Dean
                </p>
                {[
                  {label:"Classroom Observation (40%)",val:parseFloat(faculty.chairScoreBreakdown.co)-0.10},
                  {label:"Research & Publications (20%)",val:parseFloat(faculty.chairScoreBreakdown.re)-0.05},
                  {label:"Community Extension (20%)",val:parseFloat(faculty.chairScoreBreakdown.ce)+0.05},
                  {label:"Professional Performance (20%)",val:parseFloat(faculty.chairScoreBreakdown.pf)-0.10},
                ].map((item,i)=>(
                  <CriterionBar key={i} label={item.label} value={Math.min(5,item.val)}/>
                ))}
              </div>
            </>
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

      {/* Department context */}
      <Card style={{padding:"18px 22px"}}>
        <p style={{fontSize:"11px",fontWeight:700,letterSpacing:"0.08em",
          textTransform:"uppercase",color:"var(--text-muted)",marginBottom:"14px"}}>
          Department Context
        </p>
        <div style={{display:"flex",alignItems:"center",gap:"16px",flexWrap:"wrap"}}>
          <div style={{flex:1,minWidth:"200px"}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:"11px",
              color:"var(--text-muted)",marginBottom:"6px"}}>
              <span>Dept. average: 4.25</span>
              <span>Your score: {faculty.compositeScore.toFixed(2)}</span>
            </div>
            <div style={{height:"10px",background:"var(--bg-elevated)",borderRadius:"99px",
              overflow:"hidden",position:"relative"}}>
              <div style={{position:"absolute",left:`${(4.25/5)*100}%`,top:0,
                width:"2px",height:"100%",background:"var(--text-muted)",zIndex:2}}/>
              <div style={{width:`${(faculty.compositeScore/5)*100}%`,height:"100%",
                background:faculty.compositeScore>=4.25?"#1E6E3E":"#B83030",
                borderRadius:"99px",transition:"width 0.7s ease"}}/>
            </div>
            <p style={{fontSize:"11px",color:"var(--text-muted)",marginTop:"6px"}}>
              {faculty.compositeScore>=4.25
                ?"Your score is above the department average."
                :"Your score is below the department average."}
            </p>
          </div>
          <div style={{display:"flex",gap:"10px"}}>
            {[
              {label:"Responses",value:faculty.responses},
              {label:"Rank (dept)",value:"2nd"},
            ].map((s,i)=>(
              <div key={i} style={{background:"var(--bg-base)",border:"1px solid var(--border)",
                borderRadius:"10px",padding:"12px 16px",textAlign:"center",minWidth:"80px"}}>
                <p style={{fontFamily:"var(--font-display)",fontSize:"22px",fontWeight:600,
                  color:"var(--gold-darker)",lineHeight:1}}>{s.value}</p>
                <p style={{fontSize:"10px",color:"var(--text-muted)",marginTop:"4px",
                  fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em"}}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ── My AI Feedback tab ──────────────────────────── */
function MyFeedback({ faculty }) {
  const fb = aiFeedbackMap[faculty.id];

  if (!fb) return (
    <Card>
      <div style={{textAlign:"center",padding:"32px 0"}}>
        <p style={{fontSize:"36px",marginBottom:"12px"}}>🤖</p>
        <p style={{fontSize:"14px",fontWeight:600,color:"var(--text-second)",marginBottom:"6px"}}>
          AI feedback not yet available
        </p>
        <p style={{fontSize:"12px",color:"var(--text-muted)",lineHeight:1.6,
          maxWidth:"340px",margin:"0 auto"}}>
          Reports are generated after both student and chair evaluations are complete
          and the AI processing cycle has run.
        </p>
      </div>
    </Card>
  );

  return (
    <div className="anim-fade-in">
      <div style={{padding:"14px 18px",background:"rgba(200,148,10,0.08)",
        border:"1px solid rgba(200,148,10,0.25)",borderRadius:"12px",
        marginBottom:"18px",display:"flex",alignItems:"center",gap:"10px"}}>
        <span className="anim-pulse" style={{width:"8px",height:"8px",borderRadius:"50%",
          background:"#C8940A",display:"inline-block",flexShrink:0}}/>
        <p style={{fontSize:"13px",color:"var(--text-second)",lineHeight:1.5}}>
          This report was generated by the QLoRA-finetuned Llama 3 model from anonymized
          student responses and your evaluators' assessments.
        </p>
      </div>

      {/* Strengths + Improvements */}
      <div className="grid-2" style={{gap:"14px",marginBottom:"14px"}}>
        <Card style={{borderLeft:"3px solid #1E6E3E"}}>
          <p style={{fontSize:"10px",fontWeight:700,letterSpacing:"0.08em",
            textTransform:"uppercase",color:"#1E6E3E",marginBottom:"12px"}}>✦ Strengths</p>
          {fb.strengths.map((s,i)=>(
            <p key={i} style={{fontSize:"13px",color:"var(--text-second)",lineHeight:1.7,
              marginBottom:i<fb.strengths.length-1?"10px":0}}>{s}</p>
          ))}
        </Card>
        <Card style={{borderLeft:"3px solid #C8940A"}}>
          <p style={{fontSize:"10px",fontWeight:700,letterSpacing:"0.08em",
            textTransform:"uppercase",color:"#C8940A",marginBottom:"12px"}}>◈ Points for Improvement</p>
          {fb.improvements.map((s,i)=>(
            <p key={i} style={{fontSize:"13px",color:"var(--text-second)",lineHeight:1.7,
              marginBottom:i<fb.improvements.length-1?"10px":0}}>{s}</p>
          ))}
        </Card>
      </div>

      {/* Student evidence */}
      <Card style={{marginBottom:"14px"}}>
        <p style={{fontSize:"10px",fontWeight:700,letterSpacing:"0.08em",
          textTransform:"uppercase",color:"var(--text-muted)",marginBottom:"12px"}}>
          📌 Student Evidence (anonymized)
        </p>
        {fb.citations.map((c,i)=>(
          <p key={i} style={{fontSize:"13px",color:"var(--text-muted)",fontStyle:"italic",
            lineHeight:1.6,paddingLeft:"14px",
            borderLeft:"2px solid rgba(200,148,10,0.30)",
            marginBottom:i<fb.citations.length-1?"10px":0}}>{c}</p>
        ))}
      </Card>

      {/* Chair + Dean remarks side by side */}
      <div className="grid-2" style={{gap:"14px",marginBottom:"14px"}}>
        {/* Chair remarks */}
        <Card>
          <p style={{fontSize:"10px",fontWeight:700,letterSpacing:"0.08em",
            textTransform:"uppercase",color:"var(--text-muted)",marginBottom:"10px"}}>
            📋 Chairperson Remarks
          </p>
          {fb.chairRemarks ? (
            <p style={{fontSize:"13px",color:"var(--text-second)",lineHeight:1.7,
              fontStyle:"italic"}}>"{fb.chairRemarks}"</p>
          ) : (
            <p style={{fontSize:"12px",color:"var(--text-muted)"}}>No remarks submitted.</p>
          )}
        </Card>
        {/* Dean remarks */}
        <Card>
          <p style={{fontSize:"10px",fontWeight:700,letterSpacing:"0.08em",
            textTransform:"uppercase",color:"var(--text-muted)",marginBottom:"10px"}}>
            📋 Dean Remarks
          </p>
          <p style={{fontSize:"13px",color:"var(--text-second)",lineHeight:1.7,
            fontStyle:"italic"}}>
            "Prof. Hingco continues to be one of the most impactful instructors in the college.
            Her applied teaching approach aligns with our curriculum goals. I strongly support
            continued professional development opportunities for her."
          </p>
        </Card>
      </div>

      {/* Recommendation */}
      <Card style={{background:"rgba(200,148,10,0.06)",border:"1px solid rgba(200,148,10,0.22)"}}>
        <p style={{fontSize:"10px",fontWeight:700,letterSpacing:"0.08em",
          textTransform:"uppercase",color:"#A07800",marginBottom:"10px"}}>🎯 Recommendation</p>
        <p style={{fontSize:"13px",color:"var(--text-second)",lineHeight:1.7}}>{fb.recommendation}</p>
      </Card>
    </div>
  );
}

/* ── Main ──────────────────────────────────────────── */
export default function FacultyView({ activeTab, user }) {
  const faculty = facultyList.find(f=>f.id===user.facultyId) || facultyList[0];
  if(activeTab==="ratings")  return <div className="anim-fade-up"><MyRatings  faculty={faculty}/></div>;
  if(activeTab==="feedback") return <div className="anim-fade-up"><MyFeedback faculty={faculty}/></div>;
  return null;
}