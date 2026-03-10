/**
 * Dashboard.jsx
 * Faculty performance overview page.
 * Bento-grid layout showing score summary, breakdown, and AI feedback.
 */

import { useState } from "react";
import Card from "../components/ui/Card.jsx";
import Badge from "../components/ui/Badge.jsx";
import ScoreBar from "../components/ui/ScoreBar.jsx";
import { selectedFaculty } from "../data/mockData.js";

/* ── Helper: score → bar colour ────────────────────────── */
function scoreColor(score) {
  if (score >= 4.5) return "#22C55E";
  if (score >= 4.0) return "#F59E0B";
  if (score >= 3.5) return "#60A5FA";
  return "#EF4444";
}

/* ── Stat tile (small bento cell) ──────────────────────── */
function StatTile({ label, value, sub, accent = "#F59E0B" }) {
  return (
    <Card hoverable>
      <p
        style={{
          fontSize: "11px",
          fontWeight: 700,
          letterSpacing: "0.07em",
          textTransform: "uppercase",
          color: "#5C6480",
          marginBottom: "12px",
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontFamily: "'Fraunces', serif",
          fontSize: "34px",
          fontWeight: 600,
          color: accent,
          lineHeight: 1,
          marginBottom: "6px",
        }}
      >
        {value}
      </p>
      <p style={{ fontSize: "12px", color: "#5C6480" }}>{sub}</p>
    </Card>
  );
}

/* ── Main component ─────────────────────────────────────── */
export default function Dashboard() {
  const [showFullFeedback, setShowFullFeedback] = useState(false);
  const f = selectedFaculty;

  return (
    <div className="animate-fade-up">
      {/* ── Faculty identity bar ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "28px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #232840, #1C2030)",
              border: "1px solid rgba(245,158,11,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "'Fraunces', serif",
              fontSize: "20px",
              color: "#F59E0B",
              flexShrink: 0,
            }}
          >
            {f.name.split(" ").pop()[0]}
          </div>
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "4px" }}>
              {f.name}
            </h2>
            <p style={{ fontSize: "13px", color: "#9AA3BC" }}>
              {f.code} · {f.subject} · {f.program}
            </p>
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <Badge label="Evaluation Complete" variant="excellent" />
          <Badge label="AI Report Ready" variant="ai" />
        </div>
      </div>

      {/* ── Bento grid ── */}
      <div
        className="stagger"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(12, 1fr)",
          gap: "16px",
          marginBottom: "28px",
        }}
      >
        {/* Stat tiles — row 1 */}
        <div style={{ gridColumn: "span 3" }} className="animate-fade-up">
          <StatTile
            label="Composite Score"
            value={f.compositeScore.toFixed(2)}
            sub="out of 5.00"
            accent="#F59E0B"
          />
        </div>
        <div style={{ gridColumn: "span 3" }} className="animate-fade-up">
          <StatTile
            label="Student Responses"
            value={f.totalResponses}
            sub="this semester"
            accent="#2DD4BF"
          />
        </div>
        <div style={{ gridColumn: "span 3" }} className="animate-fade-up">
          <StatTile
            label="Chair Rating"
            value={(
              f.ratingBreakdown.reduce((a, r) => a + r.chairScore, 0)
              / f.ratingBreakdown.length
            ).toFixed(2)}
            sub="Program Chair"
            accent="#60A5FA"
          />
        </div>
        <div style={{ gridColumn: "span 3" }} className="animate-fade-up">
          <StatTile
            label="Feedback Quality"
            value="High"
            sub="AI confidence"
            accent="#22C55E"
          />
        </div>

        {/* ── Rating breakdown card ── */}
        <div style={{ gridColumn: "span 7" }} className="animate-fade-up">
          <Card style={{ height: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <h3 style={{ fontSize: "15px", fontWeight: 600, marginBottom: "2px" }}>
                  Criterion Breakdown
                </h3>
                <p style={{ fontSize: "12px", color: "#5C6480" }}>
                  Multi-rater weighted composite
                </p>
              </div>
              <div
                style={{
                  fontSize: "10px",
                  color: "#9AA3BC",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "6px",
                  padding: "4px 10px",
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                70% Students · 30% Chair
              </div>
            </div>

            {f.ratingBreakdown.map((r, i) => (
              <div key={i} style={{ marginBottom: i < f.ratingBreakdown.length - 1 ? "18px" : 0 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "7px",
                  }}
                >
                  <span style={{ fontSize: "13px", color: "#F1F3F9" }}>{r.criterion}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "11px", color: "#5C6480" }}>
                      👥 {r.studentScore.toFixed(2)} &nbsp;·&nbsp; 🏛 {r.chairScore.toFixed(2)}
                    </span>
                    <span
                      style={{
                        fontFamily: "'Fraunces', serif",
                        fontWeight: 600,
                        fontSize: "16px",
                        color: scoreColor(r.composite),
                        minWidth: "36px",
                        textAlign: "right",
                      }}
                    >
                      {r.composite.toFixed(2)}
                    </span>
                  </div>
                </div>
                <ScoreBar score={r.composite} color={scoreColor(r.composite)} height={5} />
              </div>
            ))}
          </Card>
        </div>

        {/* ── Rater composition card ── */}
        <div style={{ gridColumn: "span 5" }} className="animate-fade-up">
          <Card style={{ height: "100%" }}>
            <h3 style={{ fontSize: "15px", fontWeight: 600, marginBottom: "4px" }}>
              Evaluator Composition
            </h3>
            <p style={{ fontSize: "12px", color: "#5C6480", marginBottom: "20px" }}>
              360-degree multi-rater model
            </p>

            {[
              { label: "Students", weight: "70%", count: `${f.totalResponses} evaluators`, icon: "👥", color: "#60A5FA" },
              { label: "Program Chair", weight: "30%", count: "1 evaluator", icon: "🏛", color: "#F59E0B" },
            ].map((r, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  padding: "16px",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "12px",
                  marginBottom: i === 0 ? "10px" : 0,
                }}
              >
                <span style={{ fontSize: "24px" }}>{r.icon}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "13px", fontWeight: 600, color: "#F1F3F9", marginBottom: "2px" }}>
                    {r.label}
                  </p>
                  <p style={{ fontSize: "11px", color: "#5C6480" }}>{r.count}</p>
                </div>
                <span
                  style={{
                    fontFamily: "'Fraunces', serif",
                    fontSize: "22px",
                    fontWeight: 600,
                    color: r.color,
                  }}
                >
                  {r.weight}
                </span>
              </div>
            ))}

            <div
              style={{
                marginTop: "16px",
                padding: "12px 14px",
                background: "rgba(245,158,11,0.06)",
                border: "1px solid rgba(245,158,11,0.12)",
                borderRadius: "10px",
                fontSize: "11px",
                color: "#9AA3BC",
                lineHeight: 1.6,
              }}
            >
              Validated by Tatari et al. (2025) — 360° evaluation framework (p &lt; 0.001).
            </div>
          </Card>
        </div>
      </div>

      {/* ── AI Explainable Feedback block ── */}
      <Card
        style={{
          background: "#0F1218",
          border: "1px solid rgba(245,158,11,0.18)",
          boxShadow: "0 0 40px rgba(245,158,11,0.06)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
            marginBottom: showFullFeedback ? "24px" : 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span
              className="animate-pulse-dot"
              style={{
                display: "inline-block",
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#F59E0B",
                flexShrink: 0,
              }}
            />
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "2px" }}>
                AI-Guided Explainable Feedback
              </h3>
              <p style={{ fontSize: "11px", color: "#5C6480" }}>
                {f.aiFeedback.modelInfo}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowFullFeedback((v) => !v)}
            style={{
              padding: "8px 18px",
              borderRadius: "8px",
              background: showFullFeedback ? "rgba(245,158,11,0.12)" : "#F59E0B",
              color: showFullFeedback ? "#F59E0B" : "#0C0E13",
              border: showFullFeedback ? "1px solid rgba(245,158,11,0.25)" : "none",
              fontSize: "13px",
              fontWeight: 700,
              transition: "all 0.2s",
            }}
          >
            {showFullFeedback ? "Collapse" : "View Full Feedback →"}
          </button>
        </div>

        {/* Collapsed preview */}
        {!showFullFeedback && (
          <p
            style={{
              fontSize: "14px",
              color: "#9AA3BC",
              fontStyle: "italic",
              lineHeight: 1.7,
              marginTop: "20px",
              paddingTop: "20px",
              borderTop: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            "{f.aiFeedback.recommendation}"
          </p>
        )}

        {/* Expanded feedback */}
        {showFullFeedback && (
          <div className="animate-fade-in">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
                marginBottom: "16px",
              }}
            >
              {/* Strengths */}
              <div
                style={{
                  padding: "18px",
                  background: "rgba(34, 197, 94, 0.06)",
                  border: "1px solid rgba(34, 197, 94, 0.15)",
                  borderRadius: "12px",
                }}
              >
                <p
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.07em",
                    textTransform: "uppercase",
                    color: "#22C55E",
                    marginBottom: "12px",
                  }}
                >
                  ✦ Strengths
                </p>
                {f.aiFeedback.strengths.map((s, i) => (
                  <p
                    key={i}
                    style={{
                      fontSize: "13px",
                      color: "#9AA3BC",
                      lineHeight: 1.7,
                      marginBottom: i < f.aiFeedback.strengths.length - 1 ? "10px" : 0,
                    }}
                  >
                    {s}
                  </p>
                ))}
              </div>

              {/* Points of improvement */}
              <div
                style={{
                  padding: "18px",
                  background: "rgba(245, 158, 11, 0.06)",
                  border: "1px solid rgba(245, 158, 11, 0.15)",
                  borderRadius: "12px",
                }}
              >
                <p
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.07em",
                    textTransform: "uppercase",
                    color: "#F59E0B",
                    marginBottom: "12px",
                  }}
                >
                  ◈ Points of Possible Improvement
                </p>
                {f.aiFeedback.improvements.map((s, i) => (
                  <p
                    key={i}
                    style={{
                      fontSize: "13px",
                      color: "#9AA3BC",
                      lineHeight: 1.7,
                      marginBottom: i < f.aiFeedback.improvements.length - 1 ? "10px" : 0,
                    }}
                  >
                    {s}
                  </p>
                ))}
              </div>
            </div>

            {/* Evidence citations */}
            <div
              style={{
                padding: "16px 18px",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "12px",
                marginBottom: "16px",
              }}
            >
              <p
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  color: "#2DD4BF",
                  marginBottom: "12px",
                }}
              >
                📌 Evidence Citations — XAI Grounding
              </p>
              {f.aiFeedback.evidenceCitations.map((c, i) => (
                <p
                  key={i}
                  style={{
                    fontSize: "13px",
                    color: "#5C6480",
                    fontStyle: "italic",
                    lineHeight: 1.6,
                    paddingLeft: "14px",
                    borderLeft: "2px solid rgba(45,212,191,0.35)",
                    marginBottom: i < f.aiFeedback.evidenceCitations.length - 1 ? "10px" : 0,
                  }}
                >
                  {c}
                </p>
              ))}
            </div>

            {/* Recommendation */}
            <div
              style={{
                padding: "16px 18px",
                background: "rgba(245,158,11,0.06)",
                border: "1px solid rgba(245,158,11,0.18)",
                borderRadius: "12px",
              }}
            >
              <p
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  color: "#F59E0B",
                  marginBottom: "8px",
                }}
              >
                🎯 AI Recommendation
              </p>
              <p style={{ fontSize: "13px", color: "#9AA3BC", lineHeight: 1.7 }}>
                {f.aiFeedback.recommendation}
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
