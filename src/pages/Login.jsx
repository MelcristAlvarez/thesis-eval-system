import { useState } from "react";
// Assumed import path for users data, update as necessary
import { USERS } from "../data/mockData.js";
// Correct relative path for the university seal image
import logo from "../components/logo/UST-Legazpi_Seal.png";

/**
 * Login — split-panel design.
 * LEFT  : light brand panel, larger logo, single-line university name, tagline.
 * RIGHT : clean white form panel.
 * Lighter theme for improved visual accessibility.
 * Single smooth curve divider instead of two circular bumps.
 */

/* ── Decorative single-curve divider between panels ── */
function WaveDivider() {
  return (
    <div
      style={{
        position: "absolute",
        right: "-1px",
        top: 0,
        bottom: 0,
        width: "64px", // Slightly wider to accommodate a smooth, single curve
        pointerEvents: "none",
        zIndex: 2,
        overflow: "hidden",
      }}
    >
      <svg
        height="100%"
        width="64"
        viewBox="0 0 64 800"
        preserveAspectRatio="none"
      >
        {/* Changed from a double curve to a single sweeping curve */}
        <path
          d="M0 0 Q 64 400 0 800 L64 800 L64 0 Z"
          fill="#FDFAF3"
        />
      </svg>
    </div>
  );
}

export default function Login({ onLogin }) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fill = (id) => {
    setUserId(id);
    setPassword("123");
    setError("");
  };
  const canSubmit = userId.trim().length > 0 && password.length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit || loading) return;
    setLoading(true);
    setError("");
    setTimeout(() => {
      const u = USERS[userId.trim().toLowerCase()];
      if (u && password === u.password) onLogin(u);
      else {
        setError("Invalid ID or password. Please try again.");
        setLoading(false);
      }
    }, 550);
  };

  const gold = "#C8940A";
  const borderClr = "rgba(160,120,0,0.20)";

  const inp = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "10px",
    background: "#F9F5E8",
    border: `1.5px solid ${borderClr}`,
    color: "#1A1200",
    fontSize: "14px",
    transition: "all 0.18s",
    boxSizing: "border-box",
  };
  const fo = (e) => {
    e.target.style.borderColor = gold;
    e.target.style.background = "#FFFFFF";
    e.target.style.boxShadow = "0 0 0 3px rgba(200,148,10,0.10)";
  };
  const bl = (e) => {
    e.target.style.borderColor = borderClr;
    e.target.style.background = "#F9F5E8";
    e.target.style.boxShadow = "none";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#FDFBF5",
        padding: "20px",
      }}
    >
      <div
        className="anim-fade-up"
        style={{
          display: "flex",
          width: "100%",
          maxWidth: "900px",
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow:
            "0 40px 80px rgba(0,0,0,0.10), 0 8px 24px rgba(0,0,0,0.05)",
          border: "1px solid rgba(200,148,10,0.15)",
          minHeight: "560px",
        }}
      >
        {/* ── LEFT PANEL — brand ── */}
        <div
          style={{
            flex: "0 0 46%",
            background: "#F4EFE0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "44px 40px",
            position: "relative",
            borderRight: "1px solid rgba(200,148,10,0.12)",
          }}
        >
          <WaveDivider />

          {/* Gold accent top bar */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: "0",
              height: "4px",
              background: `linear-gradient(90deg, #F2B800, #C8940A)`,
            }}
          />

          {/* ── LOGO (Increased Size) ── */}
          <div style={{ marginBottom: "28px" }}>
            <img
              src={logo}
              alt="University of Santo Tomas - Legazpi Seal"
              style={{ height: "150px", width: "auto" }}
            />
          </div>

          {/* University name - single line */}
          <h2
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: "20px",
              fontWeight: 800,
              color: "#1C1400",
              textAlign: "center",
              lineHeight: 1.2,
              marginBottom: "12px",
              whiteSpace: "nowrap",
            }}
          >
            University of Santo Tomas – Legazpi
          </h2>
          <div
            style={{
              width: "40px",
              height: "2px",
              background: gold,
              borderRadius: "99px",
              marginBottom: "16px",
            }}
          />
          <p
            style={{
              fontSize: "13px",
              color: "#3E3010",
              textAlign: "center",
              lineHeight: 1.7,
              maxWidth: "240px",
            }}
          >
            Faculty Performance Evaluation System
          </p>

          {/* Bottom semester tag */}
          <div
            style={{
              position: "absolute",
              bottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "7px",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#2E9E5E",
                display: "inline-block",
              }}
            />
            <span
              style={{
                fontSize: "10px",
                color: "#3E3010",
                letterSpacing: "0.04em",
              }}
            >
              2nd Sem · SY 2025–2026 · Open
            </span>
          </div>
        </div>

        {/* ── RIGHT PANEL — form ── */}
        <div
          style={{
            flex: 1,
            background: "#FDFAF3",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "48px 44px",
          }}
        >
          <div style={{ marginBottom: "28px" }}>
            <p
              style={{
                fontSize: "11px",
                letterSpacing: "0.16em",
                color: gold,
                fontWeight: 700,
                textTransform: "uppercase",
                marginBottom: "6px",
              }}
            >
              Welcome back
            </p>
            <h1
              style={{
                fontFamily: "'Fraunces',serif",
                fontSize: "26px",
                fontWeight: 800,
                color: "#1A1200",
                lineHeight: 1.2,
                marginBottom: "6px",
              }}
            >
              Faculty Evaluation Portal
            </h1>
            <p style={{ fontSize: "13px", color: "#8A7A40" }}>
              Sign in to continue to your dashboard.
            </p>
          </div>

          {/* Role quick-fill - single line layout */}
          <div
            style={{
              display: "flex",
              gap: "6px",
              marginBottom: "22px",
              flexWrap: "nowrap",
              overflowX: "auto",
            }}
          >
            {[
              { id: "student", label: "Student" },
              { id: "chairperson", label: "Chair" },
              { id: "hr", label: "HR" },
              { id: "dean", label: "Dean" },
              { id: "faculty", label: "Faculty" },
            ].map((r) => (
              <button
                key={r.id}
                onClick={(e) => {
                  e.preventDefault();
                  fill(r.id);
                }}
                style={{
                  padding: "4px 10px",
                  borderRadius: "99px",
                  fontSize: "10px",
                  fontWeight: 700,
                  border: `1.5px solid ${userId === r.id ? gold : borderClr}`,
                  background: userId === r.id ? gold : "transparent",
                  color: userId === r.id ? "#FDFAF3" : "#8A7A40",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  whiteSpace: "nowrap",
                }}
              >
                {r.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {/* ID field */}
            <div style={{ marginBottom: "14px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#5A4E00",
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  marginBottom: "7px",
                }}
              >
                Employee / Student ID
              </label>
              <input
                type="text"
                value={userId}
                placeholder="Enter your ID"
                onChange={(e) => {
                  setUserId(e.target.value);
                  setError("");
                }}
                style={inp}
                onFocus={fo}
                onBlur={bl}
              />
            </div>

            {/* Password field */}
            <div style={{ marginBottom: "6px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "7px",
                }}
              >
                <label
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "#5A4E00",
                    letterSpacing: "0.07em",
                    textTransform: "uppercase",
                  }}
                >
                  Password
                </label>
              </div>
              <input
                type="password"
                value={password}
                placeholder="••••••••"
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                style={inp}
                onFocus={fo}
                onBlur={bl}
              />
            </div>

            {error && (
              <div
                style={{
                  padding: "9px 14px",
                  background: "rgba(184,48,48,0.07)",
                  border: "1px solid rgba(184,48,48,0.20)",
                  borderRadius: "8px",
                  marginTop: "10px",
                  marginBottom: "4px",
                }}
              >
                <p
                  style={{ color: "#B83030", fontSize: "12px", fontWeight: 600 }}
                >
                  {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={!canSubmit || loading}
              style={{
                width: "100%",
                marginTop: "20px",
                padding: "14px",
                borderRadius: "10px",
                background:
                  !canSubmit || loading ? "rgba(200,148,10,0.22)" : "#1C1400",
                color: !canSubmit || loading ? "rgba(160,120,0,0.45)" : "#F2B800",
                fontWeight: 800,
                fontSize: "14px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                border: "none",
                cursor: !canSubmit || loading ? "not-allowed" : "pointer",
                transition: "all 0.18s",
                boxShadow: canSubmit ? "0 4px 16px rgba(0,0,0,0.25)" : "none",
              }}
              onMouseEnter={(e) => {
                if (canSubmit && !loading) {
                  e.currentTarget.style.background = "#2E2200";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }
              }}
              onMouseLeave={(e) => {
                if (canSubmit && !loading) {
                  e.currentTarget.style.background = "#1C1400";
                  e.currentTarget.style.transform = "translateY(0)";
                }
              }}
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p
            style={{
              marginTop: "24px",
              fontSize: "11px",
              lineHeight: 1.7,
              color: "rgba(140,120,0,0.50)",
              textAlign: "center",
            }}
          >
            © 2026 University of Santo Tomas–Legazpi. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}