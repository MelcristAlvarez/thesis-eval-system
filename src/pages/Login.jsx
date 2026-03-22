import { useState } from "react";
import { USERS } from "../data/mockData.js";

/**
 * Login — clean cream card with circular badge logo.
 * Matches the design shown in reference image 3.
 * Colors: warm cream bg, #A07800 gold accents, #1A1200 dark text.
 * No navy, no blue, no colored header bands.
 *
 * Ring text geometry (viewBox 220×220, cx=cy=110, ring-r=95):
 *   Two-arc construction for reliable full-circle text rendering.
 *   Circumference ≈ 597px. "PERFORMANCE · EVALUATION · SYSTEM ·" = 36 chars.
 *   fontSize 9.5, letterSpacing = (597/36) - ~5.7 ≈ 10.9
 */
function CircularBadge() {
  const gold = "#C8940A";
  const ringPath = "M 110,15 A 95,95 0 0,1 110,205 A 95,95 0 0,1 110,15";

  return (
    <svg width="220" height="220" viewBox="0 0 220 220" fill="none">
      {/* Outer border rings */}
      <circle cx="110" cy="110" r="107" stroke={gold} strokeWidth="1.6" />
      <circle cx="110" cy="110" r="98" stroke={gold} strokeWidth="0.5" opacity="0.40" />

      {/* Ring text */}
      <defs><path id="badge-ring" d={ringPath} /></defs>
      <text fontSize="9.5" fontFamily="'Plus Jakarta Sans',sans-serif"
        fontWeight="700" fill={gold} letterSpacing="10.9">
        <textPath href="#badge-ring" startOffset="1%">
          PERFORMANCE · EVALUATION · SYSTEM ·
        </textPath>
      </text>

      {/* Academic shield — centered at (110,110), spans y=55 to y=168 */}
      <path d="M 82,55 L 138,55 Q 146,55 146,65 L 146,115
               Q 146,144 110,162 Q 74,144 74,115 L 74,65
               Q 74,55 82,55 Z"
        fill="#FDFAF3" stroke={gold} strokeWidth="2" />
      {/* Inner shield outline */}
      <path d="M 84,60 L 136,60 Q 142,60 142,69 L 142,114
               Q 142,140 110,156 Q 78,140 78,114 L 78,69
               Q 78,60 84,60 Z"
        fill="none" stroke={gold} strokeWidth="0.5" opacity="0.30" />

      {/* Dominican cross at shield top */}
      <line x1="110" y1="68" x2="110" y2="80" stroke={gold} strokeWidth="1.2" opacity="0.65" />
      <line x1="104" y1="74" x2="116" y2="74" stroke={gold} strokeWidth="1.2" opacity="0.65" />

      {/* Horizontal divider */}
      <line x1="84" y1="102" x2="136" y2="102" stroke={gold} strokeWidth="0.8" opacity="0.40" />

      {/* UST-L wordmark */}
      <text x="110" y="98" textAnchor="middle" fontSize="19"
        fontFamily="'Fraunces',serif" fontWeight="700" fill={gold}>UST-L</text>

      {/* Fine rule */}
      <line x1="92" y1="107" x2="128" y2="107" stroke={gold} strokeWidth="0.6" opacity="0.35" />

      {/* LEGAZPI */}
      <text x="110" y="121" textAnchor="middle" fontSize="7"
        fontFamily="'Plus Jakarta Sans',sans-serif" fontWeight="700"
        letterSpacing="3" fill={gold} opacity="0.70">LEGAZPI</text>
    </svg>
  );
}

export default function Login({ onLogin }) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
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
      else { setError("Invalid ID or password. Please try again."); setLoading(false); }
    }, 550);
  };

  // Warm gold tones — no navy/blue
  const gold = "#C8940A";
  const goldDeep = "#A07800";
  const borderClr = "rgba(200,148,10,0.22)";

  const inp = {
    width: "100%", padding: "13px 16px", borderRadius: "10px",
    background: "#FFFFFF", border: `1.5px solid ${borderClr}`,
    color: "#1A1200", fontSize: "14px", transition: "all 0.18s",
  };
  const fo = (e) => {
    e.target.style.borderColor = gold;
    e.target.style.boxShadow = "0 0 0 3px rgba(160,120,0,0.09)";
  };
  const bl = (e) => {
    e.target.style.borderColor = borderClr;
    e.target.style.boxShadow = "none";
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "#FDF8E8",   /* warm cream page background */
      padding: "24px",
    }}>
      <div className="anim-fade-up" style={{
        width: "100%", maxWidth: "400px", textAlign: "center",
        background: "#FDFAF3",
        borderRadius: "20px",
        border: "1px solid rgba(160,120,0,0.18)",
        padding: "32px 32px 24px",
        boxShadow: "0 8px 40px rgba(100,80,0,0.14), 0 2px 8px rgba(100,80,0,0.08)",
      }}>

        {/* Circular badge logo */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
          <CircularBadge />
        </div>

        {/* Header text */}
        <p style={{
          fontSize: "11px", letterSpacing: "0.16em", color: gold,
          fontWeight: 700, textTransform: "uppercase", marginBottom: "4px"
        }}>
          UST – Legazpi
        </p>
        <h1 style={{
          fontFamily: "'Fraunces',serif", fontSize: "22px", fontWeight: 700,
          color: "#1A1200", marginBottom: "22px", lineHeight: 1.3
        }}>
          Faculty Evaluation Portal
        </h1>

        {/* Quick-fill role buttons */}
        <div style={{
          display: "flex", gap: "6px", justifyContent: "center",
          marginBottom: "20px", flexWrap: "wrap"
        }}>
          {[{ id: "student", label: "Student" }, { id: "chairperson", label: "Chairperson" }, { id: "hr", label: "HR" }, { id: "dean", label: "Dean" }].map(r => (
            <button key={r.id} onClick={() => fill(r.id)} style={{
              padding: "5px 16px", borderRadius: "99px",
              border: `1.5px solid ${userId === r.id ? gold : borderClr}`,
              background: userId === r.id ? gold : "transparent",
              color: userId === r.id ? "#FDFAF3" : "#8A7A40",
              fontSize: "12px", fontWeight: 700, cursor: "pointer", transition: "all 0.15s",
            }}>{r.label}</button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
          <input type="text" placeholder="Employee / Student ID" value={userId}
            onChange={e => { setUserId(e.target.value); setError(""); }}
            style={{ ...inp, marginBottom: "10px" }} onFocus={fo} onBlur={bl} />
          <input type="password" placeholder="Password" value={password}
            onChange={e => { setPassword(e.target.value); setError(""); }}
            style={inp} onFocus={fo} onBlur={bl} />

          {error && (
            <div style={{
              padding: "9px 14px", background: "rgba(184,48,48,0.07)",
              border: "1px solid rgba(184,48,48,0.20)", borderRadius: "8px", marginTop: "10px"
            }}>
              <p style={{ color: "#B83030", fontSize: "12px", fontWeight: 600 }}>{error}</p>
            </div>
          )}

          <button type="submit" disabled={!canSubmit || loading} style={{
            width: "100%", marginTop: "16px", padding: "14px",
            borderRadius: "10px",
            background: (!canSubmit || loading) ? "rgba(160,120,0,0.25)" : gold,
            color: (!canSubmit || loading) ? "rgba(160,120,0,0.45)" : "#FDFAF3",
            fontWeight: 800, fontSize: "14px", letterSpacing: "0.10em",
            textTransform: "uppercase", border: "none",
            cursor: (!canSubmit || loading) ? "not-allowed" : "pointer",
            transition: "all 0.18s",
            boxShadow: canSubmit ? "0 4px 16px rgba(160,120,0,0.28)" : "none",
          }}
            onMouseEnter={e => { if (canSubmit && !loading) { e.currentTarget.style.background = goldDeep; e.currentTarget.style.transform = "translateY(-1px)"; } }}
            onMouseLeave={e => { if (canSubmit && !loading) { e.currentTarget.style.background = gold; e.currentTarget.style.transform = "translateY(0)"; } }}
          >{loading ? "Signing in…" : "Login"}</button>
        </form>

        <p style={{
          marginTop: "20px", fontSize: "11px", lineHeight: 1.7,
          color: "rgba(160,120,0,0.55)"
        }}>
          © 2026 University of Santo Tomas–Legazpi.<br />All rights reserved.
        </p>
      </div>
    </div>
  );
}