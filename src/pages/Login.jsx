import { useState } from "react";
import { USERS } from "../data/mockData.js";

function USTLogo({ isDark }) {
  const gold = isDark ? "#F5A623" : "#B87200";
  // Two proper semicircle arcs — prevents rotated/tumbled letter rendering
  const ringPath = "M 120,17 A 103,103 0 0,1 120,223 A 103,103 0 0,1 120,17";
  return (
    <svg width="240" height="240" viewBox="0 0 240 240" fill="none">
      <circle cx="120" cy="120" r="116" stroke={gold} strokeWidth="1.8"/>
      <circle cx="120" cy="120" r="108" stroke={gold} strokeWidth="0.5" opacity="0.35"/>
      <defs><path id="ring" d={ringPath}/></defs>
      <text fontSize="10" fontFamily="'Plus Jakarta Sans',sans-serif" fontWeight="700" fill={gold} letterSpacing="11.9">
        <textPath href="#ring" startOffset="1%">PERFORMANCE · EVALUATION · SYSTEM ·</textPath>
      </text>
      {/* Academic shield — centered at (120, 120) */}
      {/* Shield spans y=65 to y=178, center = y=121.5 ≈ 120 */}
      <path d="M 88,65 L 152,65 Q 160,65 160,75 L 160,128
               Q 160,158 120,178 Q 80,158 80,128 L 80,75
               Q 80,65 88,65 Z"
        fill="none" stroke={gold} strokeWidth="2.2"/>
      <path d="M 90,70 L 150,70 Q 156,70 156,79 L 156,127
               Q 156,153 120,171 Q 84,153 84,127 L 84,79
               Q 84,70 90,70 Z"
        fill="none" stroke={gold} strokeWidth="0.5" opacity="0.28"/>
      {/* Dominican cross — near top of shield */}
      <line x1="120" y1="78" x2="120" y2="91" stroke={gold} strokeWidth="1.3" opacity="0.60"/>
      <line x1="113" y1="85" x2="127" y2="85" stroke={gold} strokeWidth="1.3" opacity="0.60"/>
      {/* Horizontal divider */}
      <line x1="90" y1="112" x2="150" y2="112" stroke={gold} strokeWidth="0.8" opacity="0.45"/>
      {/* UST-L */}
      <text x="120" y="108" textAnchor="middle" fontSize="21"
        fontFamily="'Fraunces',serif" fontWeight="700" fill={gold}>UST-L</text>
      {/* Fine rule below UST-L */}
      <line x1="96" y1="117" x2="144" y2="117" stroke={gold} strokeWidth="0.7" opacity="0.38"/>
      {/* LEGAZPI */}
      <text x="120" y="132" textAnchor="middle" fontSize="7.5"
        fontFamily="'Plus Jakarta Sans',sans-serif" fontWeight="700"
        letterSpacing="3.5" fill={gold} opacity="0.68">LEGAZPI</text>
    </svg>
  );
}

export default function Login({ onLogin, isDark }) {
  const [userId,  setUserId]  = useState("");
  const [password,setPassword]= useState("");
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const fill = (id) => { setUserId(id); setPassword("123"); setError(""); };
  const canSubmit = userId.trim().length > 0 && password.length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit || loading) return;
    setLoading(true); setError("");
    setTimeout(() => {
      const u = USERS[userId.trim().toLowerCase()];
      if (u && password === u.password) onLogin(u);
      else { setError("Invalid credentials. Please try again."); setLoading(false); }
    }, 550);
  };

  const gold   = isDark ? "#F5A623" : "#B87200";
  const border = isDark ? "rgba(245,166,35,0.26)" : "rgba(160,100,0,0.28)";
  const inp = { width:"100%", padding:"12px 16px", borderRadius:"10px",
    background: isDark?"rgba(245,166,35,0.07)":"rgba(255,255,255,0.90)",
    border:`1px solid ${border}`, color:isDark?"#F5EDD6":"#1C1208", fontSize:"14px",
    transition:"border-color 0.2s, box-shadow 0.2s" };
  const fo = (e) => { e.target.style.borderColor=gold; e.target.style.boxShadow=`0 0 0 3px ${isDark?"rgba(245,166,35,0.11)":"rgba(184,114,0,0.10)"}`; };
  const bl = (e) => { e.target.style.borderColor=border; e.target.style.boxShadow="none"; };

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center",
      background: isDark ? "radial-gradient(ellipse at 50% 40%, #2C1A00, #160C00 50%, #0D0B06)"
                         : "radial-gradient(ellipse at 50% 40%, #F0D060, #CEAA14 42%, #A88000)",
      padding:"24px" }}>
      <div className="anim-fade-up" style={{ width:"100%", maxWidth:"420px", textAlign:"center",
        background: isDark?"rgba(18,13,2,0.94)":"rgba(255,253,242,0.97)",
        backdropFilter:"blur(24px)", WebkitBackdropFilter:"blur(24px)", borderRadius:"22px",
        border: isDark?"1px solid rgba(245,166,35,0.18)":"1px solid rgba(160,100,0,0.18)",
        padding:"30px 32px 28px",
        boxShadow: isDark?"0 28px 64px rgba(0,0,0,0.72)":"0 20px 52px rgba(100,60,0,0.28)" }}>
        <div style={{ display:"flex", justifyContent:"center", marginBottom:"10px" }}>
          <USTLogo isDark={isDark}/>
        </div>
        <p style={{ fontSize:"10.5px", letterSpacing:"0.18em", color:gold, fontWeight:700, textTransform:"uppercase", marginBottom:"3px" }}>UST – Legazpi</p>
        <h1 style={{ fontFamily:"'Fraunces',serif", fontSize:"22px", fontWeight:700, color:isDark?"#F5EDD6":"#1C1208", marginBottom:"22px", lineHeight:1.3 }}>Faculty Evaluation Portal</h1>
        <div style={{ display:"flex", gap:"6px", justifyContent:"center", marginBottom:"18px", flexWrap:"wrap" }}>
          {[{id:"student",label:"Student"},{id:"chairperson",label:"Chairperson"},{id:"hr",label:"HR"}].map(r=>(
            <button key={r.id} onClick={()=>fill(r.id)} style={{ padding:"4px 14px", borderRadius:"99px",
              border:`1px solid ${userId===r.id?gold:border}`,
              background:userId===r.id?(isDark?"rgba(245,166,35,0.14)":"rgba(184,114,0,0.10)"):"transparent",
              color:userId===r.id?gold:(isDark?"rgba(245,166,35,0.42)":"rgba(140,88,0,0.52)"),
              fontSize:"11px", fontWeight:700, cursor:"pointer" }}>{r.label}</button>
          ))}
        </div>
        <form onSubmit={handleSubmit} style={{ textAlign:"left" }}>
          <input type="text" placeholder="Employee / Student ID" value={userId}
            onChange={e=>{setUserId(e.target.value);setError("");}} style={{...inp,marginBottom:"10px"}} onFocus={fo} onBlur={bl}/>
          <input type="password" placeholder="Password" value={password}
            onChange={e=>{setPassword(e.target.value);setError("");}} style={inp} onFocus={fo} onBlur={bl}/>
          {error&&<p style={{color:"#E05252",fontSize:"12px",marginTop:"8px",textAlign:"center"}}>{error}</p>}
          <button type="submit" disabled={!canSubmit||loading} style={{
            width:"100%", marginTop:"18px", padding:"13px", borderRadius:"10px",
            background:(!canSubmit||loading)?(isDark?"rgba(245,166,35,0.20)":"rgba(184,114,0,0.16)"):gold,
            color:(!canSubmit||loading)?(isDark?"rgba(245,166,35,0.35)":"rgba(120,78,0,0.38)"):"#0D0B06",
            fontWeight:800, fontSize:"14px", letterSpacing:"0.10em", textTransform:"uppercase",
            border:"none", cursor:(!canSubmit||loading)?"not-allowed":"pointer", transition:"all 0.2s",
            boxShadow:canSubmit?`0 4px 18px ${isDark?"rgba(245,166,35,0.28)":"rgba(160,100,0,0.30)"}`: "none" }}
            onMouseEnter={e=>{if(canSubmit&&!loading){e.currentTarget.style.background=isDark?"#C8850A":"#8C5800";e.currentTarget.style.transform="translateY(-1px)";}}}
            onMouseLeave={e=>{if(canSubmit&&!loading){e.currentTarget.style.background=gold;e.currentTarget.style.transform="translateY(0)";}}}
          >{loading?"Signing in…":"Login"}</button>
        </form>
        <p style={{ marginTop:"20px", fontSize:"11px", lineHeight:1.7, color:isDark?"rgba(200,160,80,0.48)":"rgba(100,65,0,0.50)" }}>
          © 2026 University of Santo Tomas–Legazpi.<br/>All rights reserved.
        </p>
      </div>
    </div>
  );
}