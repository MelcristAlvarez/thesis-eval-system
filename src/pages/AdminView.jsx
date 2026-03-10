/**
 * AdminView.jsx
 * Program Chair administrative view with department table,
 * report export panel, and XAI audit log.
 */

import { useState } from "react";
import Card from "../components/ui/Card.jsx";
import Badge from "../components/ui/Badge.jsx";
import ScoreBar from "../components/ui/ScoreBar.jsx";
import { facultyList, auditLogs, DEPARTMENT_FULL } from "../data/mockData.js";

/* ── Sub-view tab pill ─────────────────────────────────── */
function TabPill({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "7px 16px",
        borderRadius: "8px",
        background: active ? "#F59E0B" : "rgba(255,255,255,0.04)",
        color: active ? "#0C0E13" : "#9AA3BC",
        border: active ? "none" : "1px solid rgba(255,255,255,0.08)",
        fontSize: "12px",
        fontWeight: 700,
        cursor: "pointer",
        transition: "all 0.15s",
      }}
    >
      {label}
    </button>
  );
}

/* ── Overview sub-view ─────────────────────────────────── */
function Overview() {
  const avg = (
    facultyList.reduce((s, f) => s + f.compositeScore, 0) / facultyList.length
  ).toFixed(2);
  const totalResponses = facultyList.reduce((s, f) => s + f.responses, 0);

  return (
    <div className="animate-fade-in">
      {/* KPI row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "14px",
          marginBottom: "24px",
        }}
      >
        {[
          { label: "Faculty Evaluated", value: facultyList.length, icon: "👤", color: "#F59E0B" },
          { label: "Total Responses",   value: totalResponses.toLocaleString(), icon: "📝", color: "#2DD4BF" },
          { label: "Dept. Average",     value: avg,   icon: "📊", color: "#60A5FA" },
          { label: "Reports Generated", value: `${facultyList.length}/${facultyList.length}`, icon: "🤖", color: "#22C55E" },
        ].map((k, i) => (
          <Card key={i} hoverable>
            <span style={{ fontSize: "22px" }}>{k.icon}</span>
            <p
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: "28px",
                fontWeight: 600,
                color: k.color,
                margin: "10px 0 4px",
                lineHeight: 1,
              }}
            >
              {k.value}
            </p>
            <p style={{ fontSize: "11px", color: "#5C6480", fontWeight: 600, letterSpacing: "0.04em" }}>
              {k.label}
            </p>
          </Card>
        ))}
      </div>

      {/* Faculty table */}
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <div
          style={{
            padding: "18px 24px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h3 style={{ fontSize: "15px", fontWeight: 600, marginBottom: "2px" }}>
              CEAFA Faculty Summary
            </h3>
            <p style={{ fontSize: "12px", color: "#5C6480" }}>
              {DEPARTMENT_FULL} · 1st Semester, AY 2025–2026
            </p>
          </div>
          <button
            style={{
              padding: "7px 16px",
              background: "rgba(245,158,11,0.10)",
              border: "1px solid rgba(245,158,11,0.20)",
              borderRadius: "8px",
              color: "#F59E0B",
              fontSize: "12px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Export PDF ↓
          </button>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "rgba(255,255,255,0.02)" }}>
                {["Faculty Member", "Program", "Subject", "Student Score", "Chair Score", "Composite", "Status", "Report"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "11px 16px",
                      textAlign: "left",
                      fontSize: "10px",
                      fontWeight: 700,
                      letterSpacing: "0.07em",
                      textTransform: "uppercase",
                      color: "#5C6480",
                      borderBottom: "1px solid rgba(255,255,255,0.06)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {facultyList.map((f, i) => (
                <tr
                  key={f.id}
                  style={{
                    borderBottom:
                      i < facultyList.length - 1
                        ? "1px solid rgba(255,255,255,0.04)"
                        : "none",
                    transition: "background 0.12s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.025)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td style={{ padding: "14px 16px" }}>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: "#F1F3F9" }}>{f.name}</p>
                    <p style={{ fontSize: "11px", color: "#5C6480" }}>{f.responses} responses</p>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: "12px", color: "#9AA3BC", whiteSpace: "nowrap" }}>{f.program}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <p style={{ fontSize: "12px", color: "#9AA3BC" }}>{f.subject}</p>
                    <p style={{ fontSize: "11px", color: "#5C6480" }}>{f.code}</p>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <p style={{ fontSize: "14px", fontWeight: 600, color: "#F1F3F9", fontFamily: "'Fraunces', serif" }}>
                      {f.studentScore.toFixed(2)}
                    </p>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <p style={{ fontSize: "14px", fontWeight: 600, color: "#F1F3F9", fontFamily: "'Fraunces', serif" }}>
                      {f.chairScore.toFixed(2)}
                    </p>
                  </td>
                  <td style={{ padding: "14px 16px", minWidth: "120px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span
                        style={{
                          fontFamily: "'Fraunces', serif",
                          fontSize: "16px",
                          fontWeight: 600,
                          color:
                            f.compositeScore >= 4.5
                              ? "#22C55E"
                              : f.compositeScore >= 4.0
                              ? "#F59E0B"
                              : f.compositeScore >= 3.7
                              ? "#60A5FA"
                              : "#EF4444",
                        }}
                      >
                        {f.compositeScore.toFixed(2)}
                      </span>
                    </div>
                    <div style={{ marginTop: "6px", width: "80px" }}>
                      <ScoreBar
                        score={f.compositeScore}
                        color={
                          f.compositeScore >= 4.5
                            ? "#22C55E"
                            : f.compositeScore >= 4.0
                            ? "#F59E0B"
                            : f.compositeScore >= 3.7
                            ? "#60A5FA"
                            : "#EF4444"
                        }
                        height={4}
                      />
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <Badge variant={f.status} />
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <button
                      style={{
                        padding: "5px 12px",
                        borderRadius: "6px",
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: "#9AA3BC",
                        fontSize: "11px",
                        fontWeight: 600,
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}
                    >
                      View →
                    </button>
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

/* ── Reports sub-view ──────────────────────────────────── */
function Reports() {
  const exports = [
    { title: "CEAFA Semester Summary",  desc: "Composite scores and rankings for all evaluated faculty.", format: "PDF" },
    { title: "AI Feedback Compilation", desc: "All AI-generated explainable reports in one document.", format: "PDF" },
    { title: "Raw Evaluation Data",     desc: "Anonymized numerical ratings and text responses.", format: "CSV" },
    { title: "Faculty Profile Update",  desc: "Structured data for integration with the HR system.", format: "JSON" },
  ];

  return (
    <div className="animate-fade-in">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
        {exports.map((r, i) => (
          <Card key={i} hoverable>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
              <p style={{ fontSize: "14px", fontWeight: 600, color: "#F1F3F9", flex: 1, paddingRight: "10px" }}>
                {r.title}
              </p>
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  color: "#60A5FA",
                  background: "rgba(96,165,250,0.10)",
                  border: "1px solid rgba(96,165,250,0.20)",
                  borderRadius: "4px",
                  padding: "2px 8px",
                  letterSpacing: "0.05em",
                  flexShrink: 0,
                }}
              >
                {r.format}
              </span>
            </div>
            <p style={{ fontSize: "12px", color: "#5C6480", lineHeight: 1.6, marginBottom: "16px" }}>
              {r.desc}
            </p>
            <button
              style={{
                padding: "7px 16px",
                borderRadius: "8px",
                background: "#F59E0B",
                color: "#0C0E13",
                border: "none",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Download {r.format} ↓
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ── Audit log sub-view ─────────────────────────────────── */
function AuditLog() {
  return (
    <div className="animate-fade-in">
      <Card style={{ marginBottom: "16px" }}>
        <p style={{ fontSize: "13px", color: "#9AA3BC", lineHeight: 1.6 }}>
          Every generated feedback report is logged with its input hash, model
          version, and timestamp. This enables full auditability — any faculty
          member can request a review of how their report was produced.
        </p>
      </Card>

      {auditLogs.map((log, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            padding: "16px 20px",
            background: "#141720",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "12px",
            marginBottom: "10px",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: log.status === "success" ? "#22C55E" : "#EF4444",
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1, minWidth: "180px" }}>
            <p style={{ fontSize: "13px", fontWeight: 600, color: "#F1F3F9", marginBottom: "2px" }}>
              {log.faculty}
            </p>
            <p style={{ fontSize: "11px", color: "#5C6480" }}>{log.subject}</p>
          </div>
          <div style={{ textAlign: "center", minWidth: "80px" }}>
            <p style={{ fontSize: "12px", color: "#9AA3BC", marginBottom: "1px" }}>{log.inputCount}</p>
            <p style={{ fontSize: "10px", color: "#5C6480" }}>inputs</p>
          </div>
          <div style={{ minWidth: "160px" }}>
            <p style={{ fontSize: "11px", color: "#5C6480", marginBottom: "2px" }}>Model version</p>
            <p style={{ fontSize: "12px", color: "#9AA3BC", fontFamily: "monospace" }}>{log.modelVersion}</p>
          </div>
          <div style={{ minWidth: "140px" }}>
            <p style={{ fontSize: "11px", color: "#5C6480", marginBottom: "2px" }}>Input hash</p>
            <p style={{ fontSize: "12px", color: "#2DD4BF", fontFamily: "monospace" }}>{log.hash}</p>
          </div>
          <div style={{ textAlign: "right", minWidth: "130px" }}>
            <p style={{ fontSize: "11px", color: "#5C6480" }}>{log.timestamp}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Main component ─────────────────────────────────────── */
export default function AdminView() {
  const [subView, setSubView] = useState("overview");

  const views = [
    { key: "overview", label: "Overview" },
    { key: "reports",  label: "Reports" },
    { key: "audit",    label: "Audit Log" },
  ];

  return (
    <div className="animate-fade-up">
      {/* Tab row */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
        {views.map((v) => (
          <TabPill
            key={v.key}
            label={v.label}
            active={subView === v.key}
            onClick={() => setSubView(v.key)}
          />
        ))}
      </div>

      {subView === "overview" && <Overview />}
      {subView === "reports"  && <Reports />}
      {subView === "audit"    && <AuditLog />}
    </div>
  );
}
