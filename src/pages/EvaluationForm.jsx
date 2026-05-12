/**
 * EvaluationForm.jsx
 * Student faculty evaluation form with clickable faculty selection 
 * and criteria mapped to the official Classroom Observation Tool.
 */

import { useState } from "react";
import Card from "../components/ui/Card.jsx";
import StarRating from "../components/ui/StarRating.jsx";

// Faculty list matching the Department Overview dashboard
const facultyList = [
  { id: "F001", name: "Prof. Rowena M. Hingco", subject: "Application Development & Emerging Technologies", code: "CC 106 / CC 106.1" },
  { id: "F002", name: "Prof. Noel A. De Leon", subject: "Introduction to Intelligent Systems", code: "CS Elec 3 / CS Elec 3.1" },
  { id: "F003", name: "Prof. Diana R. Navarro", subject: "CS Free Elective 1", code: "CS Free Elec 1 / 1.1" },
  { id: "F004", name: "Prof. Sofia G. Balasta", subject: "Great Books", code: "GE 12-GB" },
  { id: "F005", name: "Prof. Vicente L. Bertillo", subject: "Christian Vision of the Human Society", code: "IO-RE 3" },
  { id: "F006", name: "Prof. Jose C. Damo", subject: "Networks & Communications", code: "NC 101 / NC 101.1" },
  { id: "F007", name: "Prof. Sherry Mae R. Llandelar", subject: "CS Thesis 1", code: "THS 101" }
];

// Mapped directly from the 3.4A.3 Classroom Observation Tool
const observationCriteria = [
  { id: "q1", category: "Lesson Delivery", prompt: "Meets the objectives of the lesson by maintaining an organized learning environment." },
  { id: "q2", category: "Subject Mastery", prompt: "Demonstrates mastery of the subject matter." },
  { id: "q3", category: "Comprehension", prompt: "Explains concepts of the lesson within the grasp of the learners." },
  { id: "q4", category: "Application", prompt: "Relates subject matter to other disciplines and to real life situations." },
  { id: "q5", category: "Engagement", prompt: "Adopts instructional methods that encourage active student participation." },
  { id: "q6", category: "Assessment", prompt: "Employs appropriate assessment tools and effective teaching aids." },
  { id: "q7", category: "Communication", prompt: "Uses the language of instruction proficiently and speaks clearly with a well-modulated voice." },
  { id: "q8", category: "Critical Thinking", prompt: "Asks relevant and thought-provoking questions." },
  { id: "q9", category: "Classroom Management", prompt: "Promotes an open atmosphere yet maintains order in the classroom." },
  { id: "q10", category: "Innovation & Community", prompt: "Engages in teaching innovation and applies learnings to community engagement based on the Salamanca process." }
];

// Submission confirmation screen
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

// Main form component
export default function EvaluationForm() {
  const [selectedFaculty, setSelectedFaculty] = useState(null);
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
    observationCriteria.forEach((c) => {
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
    setSelectedFaculty(null);
    setRatings({});
    setComment("");
    setErrors({});
    setSubmitted(false);
  };

  if (submitted) return <SubmissionSuccess onReset={handleReset} />;

  // Faculty Selection View
  if (!selectedFaculty) {
    return (
      <div className="animate-fade-up" style={{ maxWidth: "700px", margin: "0 auto" }}>
        <div style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "6px" }}>
            Select a Faculty Member
          </h2>
          <p style={{ fontSize: "13px", color: "#9AA3BC", lineHeight: 1.6 }}>
            Click on a professor below to begin their evaluation. Your responses remain completely anonymous.
          </p>
        </div>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {facultyList.map((f) => (
            <Card 
              key={f.id} 
              onClick={() => setSelectedFaculty(f)}
              style={{ 
                cursor: "pointer", 
                transition: "all 0.2s ease",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#F59E0B"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#F1F3F9", marginBottom: "4px" }}>{f.name}</h3>
                  <p style={{ fontSize: "12px", color: "#9AA3BC" }}>{f.code} | {f.subject}</p>
                </div>
                <span style={{ fontSize: "18px", color: "#F59E0B" }}>→</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Questionnaire View
  return (
    <div className="animate-fade-up" style={{ maxWidth: "700px", margin: "0 auto" }}>
      
      <button 
        onClick={() => setSelectedFaculty(null)}
        style={{
          background: "none", border: "none", color: "#9AA3BC", fontSize: "13px", 
          cursor: "pointer", marginBottom: "20px", display: "flex", alignItems: "center", gap: "6px"
        }}
      >
        ← Back to faculty list
      </button>

      <Card style={{ marginBottom: "20px", borderLeft: "4px solid #F59E0B" }}>
        <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#F1F3F9", marginBottom: "4px" }}>
          Evaluating: {selectedFaculty.name}
        </h2>
        <p style={{ fontSize: "13px", color: "#9AA3BC" }}>
          {selectedFaculty.code} | {selectedFaculty.subject}
        </p>
      </Card>

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
          Classroom Observation Criteria
        </p>

        {observationCriteria.map((c, i) => (
          <div
            key={c.id}
            style={{
              paddingBottom: i < observationCriteria.length - 1 ? "20px" : 0,
              marginBottom: i < observationCriteria.length - 1 ? "20px" : 0,
              borderBottom:
                i < observationCriteria.length - 1
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
          placeholder="Be as specific as possible. For example: The professor explains concepts clearly, but the pace is fast..."
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
        🔒 Encrypted | Stored locally | Never linked to your identity
      </p>
    </div>
  );
}