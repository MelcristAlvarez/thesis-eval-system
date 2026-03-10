/**
 * Login.jsx — UST-Legazpi brand colors: Thomasian Gold + Dominican Black
 */
import { useState } from "react";
import { USERS } from "../data/mockData.js";

function CircularBadge() {
  return (
    <svg width="164" height="164" viewBox="0 0 164 164" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer ring */}
      <circle cx="82" cy="82" r="80" stroke="#F5A623" strokeWidth="1.8"/>
      <circle cx="82" cy="82" r="73" stroke="#F5A623" strokeWidth="0.5" opacity="0.35"/>
      {/* Circular text */}
      <defs>
        <path id="ring" d="M82,82 m-68,0 a68,68 0 1,1 136,0 a68,68 0 1,1 -136,0"/>
      </defs>
      <text fontSize="10.2" fill="#F5A623" fontFamily="'Plus Jakarta Sans',sans-serif" fontWeight="600" letterSpacing="7.2">
        <textPath href="#ring" startOffset="3%">· PERFORMANCE EVALUATION SYSTEM ·</textPath>
      </text>
      {/* Hexagon */}
      <polygon points="82,20 126,46 126,98 82,124 38,98 38,46"
        fill="#0D0B06" stroke="#F5A623" strokeWidth="2"/>
      <polygon points="82,24 122,48 122,96 82,120 42,96 42,48"
        fill="none" stroke="#F5A623" strokeWidth="0.5" opacity="0.25"/>
      {/* Monogram */}
      <text x="82" y="76" textAnchor="middle" fontSize="20" fill="#F5A623"
        fontFamily="'Fraunces',serif" fontWeight="700">UST-L</text>
      <text x="82" y="95" textAnchor="middle" fontSize="7" fill="#F5A623" opacity="0.5"
        fontFamily="'Plus Jakarta Sans',sans-serif" letterSpacing="2.8">LEGAZPI</text>
    </svg>
  );
}

export default function Login({ onLogin, isDark }) {
  const [userId,   setUserId]   = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const fill = (id) => { setUserId(id); setPassword("123"); setError(""); };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    setTimeout(() => {
      const u = USERS[userId.trim().toLowerCase()];
      if (u && password === u.password) { onLogin(u); }
      else { setError("Invalid credentials. Please try again."); setLoading(false); }
    }, 550);
  };

  const inp = {
    width:"100%", padding:"12px 16px", marginBottom:"12px",
    background:"rgba(245,166,35,0.06)", border:"1px solid rgba(245,166,35,0.25)",
    borderRadius:"var(--radius-sm)", color:"#F5EDD6", fontSize:"14px",
    transition:"border-color 0.2s",
  };

  return (
    <div style={{
      minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center",
      background: isDark
        ? "radial-gradient(ellipse at 55% 40%, #2A1E00 0%, #150F00 45%, #0D0B06 100%)"
        : "radial-gradient(ellipse at 55% 40%, #F5DFA0 0%, #E8C96A 40%, #C8A020 100%)",
      padding:"24px",
    }}>
      <div className="anim-fade-up" style={{
        width:"100%", maxWidth:"420px", textAlign:"center",
        background: isDark ? "rgba(18,14,4,0.90)" : "rgba(255,252,240,0.92)",
        backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)",
        borderRadius:"20px", border:"1px solid rgba(245,166,35,0.22)",
        padding:"40px 36px 32px",
        boxShadow:"0 24px 60px rgba(0,0,0,0.65), inset 0 1px 0 rgba(245,166,35,0.08)",
      }}>
        {/* Logo */}
        <div style={{ display:"flex", justifyContent:"center", marginBottom:"20px" }}>
          <CircularBadge />
        </div>

        <p style={{ fontSize:"11px", letterSpacing:"0.16em", color:"#F5A623",
          fontWeight:700, textTransform:"uppercase", marginBottom:"4px" }}>
          UST – Legazpi
        </p>
        <h1 style={{ fontFamily:"'Fraunces',serif", fontSize:"24px", fontWeight:700,
          color: isDark ? "#F5EDD6" : "#1C1608", marginBottom:"28px", letterSpacing:"0.03em" }}>
          Faculty Portal
        </h1>

        {/* Quick-fill role hints */}
        <div style={{ display:"flex", gap:"6px", justifyContent:"center", marginBottom:"22px" }}>
          {[{id:"student",label:"Student"},{id:"chairperson",label:"Chairperson"},{id:"hr",label:"HR"}].map(r=>(
            <button key={r.id} onClick={()=>fill(r.id)}
              style={{ padding:"4px 12px", borderRadius:"99px",
                border:`1px solid ${userId===r.id?"rgba(245,166,35,0.60)":"rgba(245,166,35,0.25)"}`,
                background: userId===r.id?"rgba(245,166,35,0.14)":"transparent",
                color: userId===r.id?"#F5A623":"rgba(245,166,35,0.50)",
                fontSize:"11px", fontWeight:700, cursor:"pointer", transition:"all 0.15s" }}>
              {r.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ textAlign:"left" }}>
          <input type="text" placeholder="Employee / Student ID" value={userId}
            onChange={e=>{setUserId(e.target.value);setError("");}} style={inp}
            onFocus={e=>(e.target.style.borderColor="rgba(245,166,35,0.70)")}
            onBlur={e=>(e.target.style.borderColor="rgba(245,166,35,0.25)")}/>
          <input type="password" placeholder="Password" value={password}
            onChange={e=>{setPassword(e.target.value);setError("");}}
            style={{...inp, marginBottom:0}}
            onFocus={e=>(e.target.style.borderColor="rgba(245,166,35,0.70)")}
            onBlur={e=>(e.target.style.borderColor="rgba(245,166,35,0.25)")}/>

          {error && <p style={{color:"#E05252",fontSize:"12px",marginTop:"8px",textAlign:"center"}}>{error}</p>}

          <button type="submit" disabled={loading}
            style={{ width:"100%", marginTop:"18px", padding:"13px",
              borderRadius:"var(--radius-sm)",
              background: loading ? "rgba(245,166,35,0.45)" : "#F5A623",
              color:"#0D0B06", fontWeight:800, fontSize:"14px",
              letterSpacing:"0.10em", textTransform:"uppercase",
              border:"none", cursor:loading?"default":"pointer", transition:"background 0.2s" }}
            onMouseEnter={e=>{if(!loading) e.currentTarget.style.background="#C8850A";}}
            onMouseLeave={e=>{if(!loading) e.currentTarget.style.background="#F5A623";}}>
            {loading ? "Signing in…" : "Login"}
          </button>
        </form>

        <p style={{ marginTop:"22px", fontSize:"11px", color:"rgba(245,166,35,0.35)" }}>
          © 2026 University of Santo Tomas–Legazpi. All rights reserved.
        </p>
      </div>
    </div>
  );
}
