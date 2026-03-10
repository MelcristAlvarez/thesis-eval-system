/**
 * EvaluationForm.jsx
 * Student faculty evaluation form with star ratings and open-ended comments.
 */

import { useState } from "react";
import Card from "../components/ui/Card.jsx";
import StarRating from "../components/ui/StarRating.jsx";
import { evaluationCriteria } from "../data/mockData.js";

/* ── Faculty select options (CEAFA) ────────────────────── */
const facultyOptions = [
  { id: "F001", label: "Engr. Ramon L. Buenaventura — CE 311 Structural Analysis" },
  { id: "F002", label: "Arch. Celeste M. Fuentes — ARCH 501 Architectural Design V" },
  { id: "F003", label: "Engr. Dennis T. Quiambao — EE 402 Power Systems Engineering" },
  { id: "F004", label: "Prof. Marites G. Cabrera — FA 401 Visual Arts Studio IV" },
  { id: "F005", label: "Engr. Felix R. Soriano — ME 302 Thermodynamics II" },
];

/* ── Submission confirmation screen ───────────────────── */
function SubmissionSuccess({ onReset }) {
  return (
    <div
      className="animate-fade-up"
      style={{
        maxWidth: "520px",
        margin: "0 auto",
        textAlign: "center",
        padding: "60px 0",
      }}
    >
      <div style={{ fontSize: "56px", marginBottom: "20px" }}>✅</div>
      <h2 style={{ fontSize: "22px", fontWeight: 600, marginBottom: "12px" }}>
        Evaluation Submitted
      </h2>
      <p
        style={{
          fontSize: "14px",
          color: "#9AA3BC",
          lineHeight: 1.7,
          marginBottom: "28px",
        }}
      >
        Your feedback has been securely recorded. It will be processed by the
        AI engine alongside other submissions to generate grounded, explainable
        feedback at the end of the evaluation period.
      </p>
      <div
        style={{
          padding: "14px 18px",
          background: "rgba(45,212,191,0.06)",
          border: "1px solid rgba(45,212,191,0.15)",
          borderRadius: "12px",
          fontSize: "12px",
          color: "#9AA3BC",
          lineHeight: 1.6,
          marginBottom: "28px",
          textAlign: "left",
        }}
      >
        🔒 All data is stored locally on UST-Legazpi servers. Your identity is
        never linked to your comments in AI-generated reports.
      </div>
      <button
        onClick={onReset}
        style={{
          padding: "10px 24px",
          borderRadius: "8px",
          background: "transparent",
          border: "1px solid rgba(255,255,255,0.12)",
          color: "#F1F3F9",
          fontSize: "13px",
          fontWeight: 600,
          cursor: "pointer",
          transition: "border-color 0.15s",
        }}
      >
        Submit Another Evaluation
      </button>
    </div>
  );
}

/* ── Main form component ────────────────────────────────── */
export default function EvaluationForm() {
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [ratings, setRatings] = useState({});
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const handleRatingChange = (id, value) => {
    setRatings((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: false }));
  };

  const handleSubmit = () => {
    const newErrors = {};
    if (!selectedFaculty) newErrors.faculty = true;
    evaluationCriteria.forEach((c) => {
      if (!ratings[c.id]) newErrors[c.id] = true;
    });
    if (comment.trim().length < 30) newErrors.comment = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitted(true);
  };

  const handleReset = () => {
    setSelectedFaculty("");
    setRatings({});
    setComment("");
    setErrors({});
    setSubmitted(false);
  };

  if (submitted) return <SubmissionSuccess onReset={handleReset} />;

  return (
    <div
      className="animate-fade-up"
      style={{ maxWidth: "700px", margin: "0 auto" }}
    >
      {/* Intro */}
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "6px" }}>
          Faculty Evaluation Form
        </h2>
        <p style={{ fontSize: "13px", color: "#9AA3BC", lineHeight: 1.6 }}>
          Your responses are confidential. Open-ended comments are used as input
          for the AI feedback engine — the more specific and constructive your
          comment, the more useful the generated feedback will be.
        </p>
      </div>

      {/* Faculty selector */}
      <Card style={{ marginBottom: "16px" }}>
        <label
          style={{
            display: "block",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.07em",
            textTransform: "uppercase",
            color: "#5C6480",
            marginBottom: "10px",
          }}
        >
          Select Faculty Member
        </label>
        <select
          value={selectedFaculty}
          onChange={(e) => {
            setSelectedFaculty(e.target.value);
            setErrors((prev) => ({ ...prev, faculty: false }));
          }}
          style={{
            width: "100%",
            padding: "11px 14px",
            background: "#1C2030",
            border: errors.faculty
              ? "1px solid rgba(239,68,68,0.5)"
              : "1px solid rgba(255,255,255,0.08)",
            borderRadius: "10px",
            color: selectedFaculty ? "#F1F3F9" : "#5C6480",
            fontSize: "13px",
            outline: "none",
            cursor: "pointer",
          }}
        >
          <option value="">— Choose a faculty member —</option>
          {facultyOptions.map((f) => (
            <option key={f.id} value={f.id}>
              {f.label}
            </option>
          ))}
        </select>
        {errors.faculty && (
          <p style={{ fontSize: "11px", color: "#EF4444", marginTop: "6px" }}>
            Please select a faculty member.
          </p>
        )}
      </Card>

      {/* Rating criteria */}
      <Card style={{ marginBottom: "16px" }}>
        <p
          style={{
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.07em",
            textTransform: "uppercase",
            color: "#5C6480",
            marginBottom: "20px",
          }}
        >
          Performance Criteria
        </p>

        {evaluationCriteria.map((c, i) => (
          <div
            key={c.id}
            style={{
              paddingBottom: i < evaluationCriteria.length - 1 ? "20px" : 0,
              marginBottom: i < evaluationCriteria.length - 1 ? "20px" : 0,
              borderBottom:
                i < evaluationCriteria.length - 1
                  ? "1px solid rgba(255,255,255,0.05)"
                  : "none",
            }}
          >
            <p
              style={{
                fontSize: "10px",
                fontWeight: 700,
                color: "#F59E0B",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                marginBottom: "5px",
              }}
            >
              {c.category}
            </p>
            <p
              style={{
                fontSize: "13px",
                color: "#9AA3BC",
                lineHeight: 1.6,
                marginBottom: "10px",
              }}
            >
              {c.prompt}
            </p>
            <StarRating
              value={ratings[c.id] || 0}
              onChange={(v) => handleRatingChange(c.id, v)}
            />
            {errors[c.id] && (
              <p style={{ fontSize: "11px", color: "#EF4444", marginTop: "5px" }}>
                Please provide a rating.
              </p>
            )}
          </div>
        ))}
      </Card>

      {/* Open-ended comment */}
      <Card style={{ marginBottom: "20px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "6px",
          }}
        >
          <p
            style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.07em",
              textTransform: "uppercase",
              color: "#5C6480",
            }}
          >
            Open-Ended Comments
          </p>
          <span
            style={{
              fontSize: "10px",
              fontWeight: 700,
              color: "#2DD4BF",
              background: "rgba(45,212,191,0.10)",
              border: "1px solid rgba(45,212,191,0.20)",
              borderRadius: "4px",
              padding: "1px 7px",
              letterSpacing: "0.04em",
            }}
          >
            AI INPUT
          </span>
        </div>
        <p
          style={{
            fontSize: "12px",
            color: "#5C6480",
            lineHeight: 1.6,
            marginBottom: "14px",
          }}
        >
          Share specific observations about this faculty member's teaching style,
          delivery, or engagement. Your comments are processed by the AI engine
          to generate structured, evidence-based feedback. (Minimum 30 characters)
        </p>
        <textarea
          value={comment}
          onChange={(e) => {
            setComment(e.target.value);
            if (e.target.value.trim().length >= 30) {
              setErrors((prev) => ({ ...prev, comment: false }));
            }
          }}
          placeholder="Be as specific as possible, e.g., 'The professor explains structural load calculations clearly, but the pace of derivations is fast. Having worked examples on board would help...'"
          rows={5}
          style={{
            width: "100%",
            padding: "14px",
            background: "#1C2030",
            border: errors.comment
              ? "1px solid rgba(239,68,68,0.5)"
              : "1px solid rgba(255,255,255,0.08)",
            borderRadius: "10px",
            color: "#F1F3F9",
            fontSize: "13px",
            lineHeight: 1.6,
            resize: "vertical",
            transition: "border-color 0.15s",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "rgba(245,158,11,0.40)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = errors.comment
              ? "rgba(239,68,68,0.5)"
              : "rgba(255,255,255,0.08)";
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "6px",
          }}
        >
          {errors.comment && (
            <p style={{ fontSize: "11px", color: "#EF4444" }}>
              Please write at least 30 characters.
            </p>
          )}
          <p
            style={{
              fontSize: "11px",
              color: comment.length >= 30 ? "#22C55E" : "#5C6480",
              marginLeft: "auto",
            }}
          >
            {comment.length} characters
          </p>
        </div>
      </Card>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        style={{
          width: "100%",
          padding: "14px",
          borderRadius: "12px",
          background: "#F59E0B",
          color: "#0C0E13",
          fontSize: "14px",
          fontWeight: 700,
          border: "none",
          cursor: "pointer",
          letterSpacing: "0.02em",
          transition: "opacity 0.15s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      >
        Submit Evaluation →
      </button>
      <p
        style={{
          textAlign: "center",
          marginTop: "12px",
          fontSize: "11px",
          color: "#5C6480",
        }}
      >
        🔒 Encrypted · Stored locally · Never linked to your identity
      </p>
    </div>
  );
}
