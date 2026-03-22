/**
 * Dean.jsx
 * DEAN eval criteria: Classroom Observation, Research, Community Extension, Performance
 */
import { useState } from "react";
import { facultyList, aiFeedbackMap, SEMESTER } from "../data/mockData.js";

/* ─── Shared UI ─────────────────────────────────────── */
function Card({ children, style = {} }) {
    return (
        <div style={{
            background: "#FFFFFF", border: "1.5px solid rgba(26,50,112,0.15)",
            borderRadius: "var(--radius-md)", padding: "20px", boxShadow: "var(--shadow-card)", ...style
        }}>
            {children}
        </div>
    );
}
function ScoreBar({ score, max = 5 }) {
    const pct = `${(score / max) * 100}%`;
    return (
        <div style={{ width: "100%", height: "5px", background: "var(--border)", borderRadius: "99px", overflow: "hidden" }}>
            <div style={{ width: pct, height: "100%", background: "var(--gold)", borderRadius: "99px", transition: "width 0.7s ease" }} />
        </div>
    );
}
function StatusChip({ status }) {
    const map = {
        excellent: { l: "Excellent", c: "var(--success)" }, good: { l: "Good", c: "var(--gold)" },
        average: { l: "Average", c: "var(--text-second)" }, needsSupport: { l: "Needs Support", c: "var(--danger)" }
    };
    const s = map[status] || map.average;
    return <span style={{ fontSize: "12px", fontWeight: 700, color: s.c }}>{s.l}</span>;
}

/* ─── 5-star input ──────────────────────────────────── */
function StarInput({ value, onChange }) {
    const [hover, setHover] = useState(0);
    const lbl = ["", "Poor", "Below Average", "Satisfactory", "Good", "Excellent"];
    return (
        <div style={{ display: "flex", alignItems: "center", gap: "3px", flexWrap: "wrap" }}>
            {[1, 2, 3, 4, 5].map(n => (
                <button key={n} type="button" onClick={() => onChange(n)}
                    onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)}
                    style={{
                        background: "none", border: "none", fontSize: "24px", lineHeight: 1, cursor: "pointer",
                        color: n <= (hover || value) ? "var(--gold)" : "var(--border)",
                        transform: hover === n ? "scale(1.2)" : "scale(1)", transition: "color 0.12s, transform 0.12s"
                    }}>★</button>
            ))}
            {(hover || value) > 0 && (
                <span style={{ fontSize: "12px", color: "var(--gold)", fontWeight: 600, marginLeft: "6px" }}>
                    {lbl[hover || value]}
                </span>
            )}
        </div>
    );
}

/* ── Chair evaluation criteria (CHED standard) ──────── */
const chairCriteria = [
    {
        id: "co", category: "Classroom Observation",
        weight: "40%",
        prompt: "Rate the faculty's classroom instruction: lesson delivery, use of instructional materials, classroom management, and alignment with learning outcomes.",
        items: ["Lesson plan preparation and adherence", "Use of varied instructional strategies", "Classroom management and student engagement", "Assessment alignment with learning outcomes"],
    },
    {
        id: "re", category: "Research & Publications",
        weight: "20%",
        prompt: "Evaluate the faculty's involvement in research activities, publications, conference presentations, or scholarly outputs during this evaluation period.",
        items: ["Active research engagement", "Publication or presentation outputs", "Contribution to departmental research agenda"],
    },
    {
        id: "ce", category: "Community Extension",
        weight: "20%",
        prompt: "Assess the faculty's participation in community extension programs, outreach activities, and contributions to the wider community.",
        items: ["Participation in extension programs", "Leadership or active role in outreach", "Reflection and documentation of service learning"],
    },
    {
        id: "pf", category: "Professional Performance",
        weight: "20%",
        prompt: "Rate the faculty's overall professional conduct: punctuality, compliance with institutional policies, teamwork, and contribution to departmental goals.",
        items: ["Punctuality and attendance", "Administrative compliance", "Collegial relationships and teamwork", "Contribution to department objectives"],
    },
];

/* ── Overview tab ───────────────────────────────────── */
function Overview() {
    const avg = (facultyList.reduce((s, f) => s + f.compositeScore, 0) / facultyList.length).toFixed(2);
    const pending = facultyList.filter(f => !f.chairEvaluated).length;
    return (
        <div className="anim-fade-in">
            <div className="kpi-3" style={{ gap: "14px", marginBottom: "22px" }}>
                {[
                    { label: "Total Faculty", value: facultyList.length, sub: "in system" },
                    { label: "Dept. Average Score", value: avg, sub: "composite score" },
                    { label: "Pending Chair Evals", value: pending, sub: "awaiting your input" },
                ].map((k, i) => (
                    <Card key={i}>
                        <p style={{
                            fontSize: "11px", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase",
                            color: "var(--text-muted)", marginBottom: "10px"
                        }}>{k.label}</p>
                        <p style={{
                            fontFamily: "var(--font-display)", fontSize: "30px", fontWeight: 600,
                            color: "var(--gold-darker)", lineHeight: 1, marginBottom: "4px"
                        }}>{k.value}</p>
                        <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>{k.sub}</p>
                    </Card>
                ))}
            </div>
            <Card style={{ padding: 0, overflow: "hidden" }}>
                <div style={{ padding: "16px 22px", borderBottom: "1px solid var(--border)" }}>
                    <h3 style={{ fontSize: "15px", fontWeight: 600 }}>Faculty Summary</h3>
                    <p style={{ fontSize: "12px", color: "var(--text-second)", marginTop: "2px" }}>{SEMESTER}</p>
                </div>
                <div className="tbl-wrap">
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ background: "var(--bg-base)" }}>
                                {["Faculty", "Subject / Code", "Student", "Chair", "Composite", "Status", "Chair Eval"].map(h => (
                                    <th key={h} style={{
                                        padding: "10px 14px", textAlign: "left", fontSize: "10px", fontWeight: 700,
                                        letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-muted)",
                                        borderBottom: "1px solid var(--border)", whiteSpace: "nowrap"
                                    }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {facultyList.map((f, i) => (
                                <tr key={f.id}
                                    style={{ borderBottom: i < facultyList.length - 1 ? "1px solid var(--border)" : "none", transition: "background 0.12s" }}
                                    onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-base)")}
                                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                                    <td style={{ padding: "12px 14px" }}>
                                        <p style={{ fontSize: "13px", fontWeight: 600 }}>{f.name}</p>
                                        <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>{f.responses} responses</p>
                                    </td>
                                    <td style={{ padding: "12px 14px" }}>
                                        <p style={{ fontSize: "12px" }}>{f.subject}</p>
                                        <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>{f.code}</p>
                                    </td>
                                    <td style={{ padding: "12px 14px", fontFamily: "var(--font-display)", fontSize: "16px", fontWeight: 600 }}>{f.studentScore.toFixed(2)}</td>
                                    <td style={{ padding: "12px 14px", fontFamily: "var(--font-display)", fontSize: "16px", fontWeight: 600 }}>
                                        {f.chairEvaluated ? f.chairScore.toFixed(2) : <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>—</span>}
                                    </td>
                                    <td style={{ padding: "12px 14px", minWidth: "120px" }}>
                                        <p style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 600, color: "var(--gold)", marginBottom: "5px" }}>{f.compositeScore.toFixed(2)}</p>
                                        <ScoreBar score={f.compositeScore} />
                                    </td>
                                    <td style={{ padding: "12px 14px" }}><StatusChip status={f.status} /></td>
                                    <td style={{ padding: "12px 14px" }}>
                                        {f.chairEvaluated
                                            ? <span style={{ fontSize: "11px", color: "var(--success)", fontWeight: 700 }}>Done ✓</span>
                                            : <span style={{ fontSize: "11px", color: "var(--danger)", fontWeight: 700 }}>Pending</span>}
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

/* ── Submit Evaluation tab ──────────────────────────── */
function ChairEvalTab() {
    const [selected, setSelected] = useState(null);
    const [ratings, setRatings] = useState({});
    const [remarks, setRemarks] = useState("");
    const [submitted, setSubmitted] = useState(new Set(
        facultyList.filter(f => f.chairEvaluated).map(f => f.id)
    ));
    const [done, setDone] = useState(false);

    const pending = facultyList.filter(f => !submitted.has(f.id));
    const allRated = chairCriteria.every(c => ratings[c.id]);

    const handleSubmit = () => {
        if (!allRated) return;
        setSubmitted(p => new Set([...p, selected.id]));
        setDone(true);
    };

    const reset = () => { setSelected(null); setRatings({}); setRemarks(""); setDone(false); };

    /* ── Success screen ─ */
    if (done && selected) return (
        <div className="anim-fade-in" style={{ textAlign: "center", padding: "50px 0" }}>
            <div style={{ fontSize: "52px", marginBottom: "16px" }}>✅</div>
            <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}>Chair Evaluation Submitted</h3>
            <p style={{ fontSize: "13px", color: "var(--text-second)", maxWidth: "400px", margin: "0 auto 24px", lineHeight: 1.7 }}>
                Your evaluation for <strong>{selected.name}</strong> has been recorded.
                It carries a <strong style={{ color: "var(--gold)" }}>30% weight</strong> in the final composite score.
            </p>
            <button onClick={reset} style={{
                padding: "10px 24px", borderRadius: "var(--radius-sm)",
                background: "var(--gold)", color: "var(--text-on-gold)", fontWeight: 700, fontSize: "13px", border: "none", cursor: "pointer"
            }}>
                Evaluate Another →
            </button>
        </div>
    );

    /* ── Faculty picker ─ */
    if (!selected) return (
        <div className="anim-fade-in">
            <div style={{
                padding: "14px 18px", background: "var(--gold-dim)", border: "1px solid var(--amber-border)",
                borderRadius: "var(--radius-md)", marginBottom: "20px"
            }}>
                <p style={{ fontSize: "13px", color: "var(--text-second)", lineHeight: 1.6 }}>
                    Select a faculty member below to begin your structured classroom observation and
                    performance evaluation. Your ratings carry a{" "}
                    <strong style={{ color: "var(--gold)" }}>30% weight</strong> in the composite score.
                </p>
            </div>

            {pending.length === 0 ? (
                <Card><p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "13px", padding: "24px 0" }}>
                    ✓ All faculty evaluations submitted for this semester.</p></Card>
            ) : (
                <div className="card-list">
                    {pending.map(f => (
                        <Card key={f.id}
                            onClick={() => { setSelected(f); setRatings({}); setRemarks(""); setDone(false); }}
                            style={{
                                display: "flex", alignItems: "center", gap: "14px", padding: "16px 20px",
                                cursor: "pointer", transition: "border-color 0.15s"
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--gold-border)"; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; }}>
                            <div style={{
                                width: "40px", height: "40px", borderRadius: "10px", flexShrink: 0,
                                background: "var(--gold-dim)", border: "1px solid var(--amber-border)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontFamily: "var(--font-display)", fontSize: "16px", color: "var(--gold)", fontWeight: 700
                            }}>
                                {f.name.split(" ").slice(-1)[0][0]}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ fontWeight: 600, fontSize: "14px", marginBottom: "2px" }}>{f.name}</p>
                                <p style={{ fontSize: "12px", color: "var(--text-second)" }}>{f.dept} · {f.code} · {f.subject}</p>
                                <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                                    Student avg: <strong style={{ color: "var(--gold)" }}>{f.studentScore.toFixed(2)}</strong> ({f.responses} responses)
                                </p>
                            </div>
                            <div style={{ textAlign: "right", flexShrink: 0 }}>
                                <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--danger)" }}>Pending →</span>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Already evaluated */}
            {submitted.size > 0 && (
                <div style={{ marginTop: "20px" }}>
                    <p style={{
                        fontSize: "11px", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase",
                        color: "var(--text-muted)", marginBottom: "10px"
                    }}>Completed This Semester</p>
                    <div className="card-list">
                        {facultyList.filter(f => submitted.has(f.id)).map(f => (
                            <Card key={f.id} style={{
                                display: "flex", alignItems: "center", gap: "14px",
                                padding: "12px 18px", opacity: 0.65
                            }}>
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontSize: "13px", fontWeight: 600 }}>{f.name}</p>
                                    <p style={{ fontSize: "12px", color: "var(--text-second)" }}>{f.code} · {f.subject}</p>
                                </div>
                                <span style={{ fontSize: "11px", color: "var(--success)", fontWeight: 700 }}>Done ✓</span>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

    /* ── Evaluation form ─ */
    return (
        <div className="anim-fade-in" style={{ maxWidth: "680px" }}>
            <button onClick={() => setSelected(null)}
                style={{
                    display: "flex", alignItems: "center", gap: "6px", color: "var(--text-second)",
                    fontSize: "13px", marginBottom: "18px", background: "none", border: "none", cursor: "pointer"
                }}>
                ← Back to faculty list
            </button>

            <Card>
                {/* Faculty header */}
                <div style={{
                    padding: "14px 16px", background: "var(--gold-dim)", border: "1px solid var(--amber-border)",
                    borderRadius: "var(--radius-sm)", marginBottom: "24px"
                }}>
                    <p style={{ fontWeight: 700, fontSize: "15px", marginBottom: "2px" }}>{selected.name}</p>
                    <p style={{ fontSize: "12px", color: "var(--text-second)" }}>{selected.code} · {selected.subject} · {selected.dept}</p>
                    <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
                        Student avg: <strong style={{ color: "var(--gold)" }}>{selected.studentScore.toFixed(2)}</strong>
                        {" "}({selected.responses} responses) &nbsp;·&nbsp; Chair weight: <strong style={{ color: "var(--gold)" }}>30%</strong>
                    </p>
                </div>

                {/* Criteria */}
                {chairCriteria.map((c, ci) => (
                    <div key={c.id} style={{
                        marginBottom: "26px", paddingBottom: "26px",
                        borderBottom: ci < chairCriteria.length - 1 ? "1px solid var(--border)" : "none"
                    }}>
                        <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "6px", flexWrap: "wrap" }}>
                            <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--gold)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                                {c.category}
                            </p>
                            <span style={{
                                fontSize: "10px", color: "var(--text-muted)", background: "var(--bg-base)",
                                border: "1.5px solid rgba(26,50,112,0.15)", borderRadius: "4px", padding: "1px 7px", fontWeight: 600
                            }}>
                                Weight: {c.weight}
                            </span>
                        </div>
                        <p style={{ fontSize: "13px", color: "var(--text-second)", marginBottom: "10px", lineHeight: 1.6 }}>{c.prompt}</p>
                        {/* Sub-items as guide */}
                        <ul style={{ marginBottom: "12px", paddingLeft: "18px" }}>
                            {c.items.map((item, ii) => (
                                <li key={ii} style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.7 }}>{item}</li>
                            ))}
                        </ul>
                        <StarInput value={ratings[c.id] || 0} onChange={v => setRatings(r => ({ ...r, [c.id]: v }))} />
                        {!ratings[c.id] && <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px", fontStyle: "italic" }}>No rating yet</p>}
                    </div>
                ))}

                {/* Remarks */}
                <div style={{ marginBottom: "22px" }}>
                    <p style={{
                        fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
                        color: "var(--text-muted)", marginBottom: "8px"
                    }}>Chairperson Remarks <span style={{ fontWeight: 400, textTransform: "none" }}>(Optional)</span></p>
                    <textarea value={remarks} onChange={e => setRemarks(e.target.value)}
                        placeholder="Add professional observations, notable achievements, or specific areas for development..."
                        rows={4}
                        style={{
                            width: "100%", padding: "12px 14px", background: "var(--bg-input)",
                            border: "1.5px solid rgba(26,50,112,0.15)", borderRadius: "var(--radius-sm)",
                            color: "var(--text-primary)", fontSize: "13px", lineHeight: 1.6, resize: "vertical"
                        }}
                        onFocus={e => (e.target.style.borderColor = "var(--gold-border)")}
                        onBlur={e => (e.target.style.borderColor = "var(--border)")} />
                    <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
                        These remarks will be included in the AI feedback report and the audit trail.
                    </p>
                </div>

                {/* Submit */}
                {!allRated && (
                    <div style={{
                        padding: "10px 14px", background: "var(--danger-dim)", border: "1px solid rgba(224,82,82,0.22)",
                        borderRadius: "var(--radius-sm)", marginBottom: "16px"
                    }}>
                        <p style={{ fontSize: "12px", color: "var(--danger)", fontWeight: 600 }}>
                            Please rate all four criteria before submitting.
                        </p>
                    </div>
                )}
                <button onClick={handleSubmit} disabled={!allRated} style={{
                    width: "100%", padding: "13px", borderRadius: "var(--radius-sm)",
                    background: allRated ? "var(--gold)" : "rgba(245,166,35,0.20)",
                    color: allRated ? "#0D0B06" : "rgba(245,166,35,0.40)",
                    fontSize: "13px", fontWeight: 700, border: "none", cursor: allRated ? "pointer" : "not-allowed", transition: "all 0.2s"
                }}
                    onMouseEnter={e => { if (allRated) e.currentTarget.style.background = "var(--gold-deep)"; }}
                    onMouseLeave={e => { if (allRated) e.currentTarget.style.background = "var(--gold)"; }}>
                    Submit Chair Evaluation (30% Weight) →
                </button>
            </Card>
        </div>
    );
}

/* ── AI Feedback tab ────────────────────────────────── */
function AIFeedbackTab() {
    const [expanded, setExpanded] = useState(null);
    const withFeedback = facultyList.filter(f => aiFeedbackMap[f.id] && f.chairEvaluated);
    return (
        <div className="anim-fade-in">
            <div style={{
                padding: "14px 18px", background: "var(--gold-dim)", border: "1px solid var(--amber-border)",
                borderRadius: "var(--radius-md)", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px"
            }}>
                <span className="anim-pulse" style={{
                    width: "8px", height: "8px", borderRadius: "50%",
                    background: "var(--gold)", display: "inline-block", flexShrink: 0
                }} />
                <p style={{ fontSize: "13px", color: "var(--text-second)", lineHeight: 1.5 }}>
                    AI reports are available for faculty whose full evaluation cycle is complete.
                    Reports are generated locally — no data leaves the university's servers.
                </p>
            </div>
            {withFeedback.length === 0 ? (
                <Card><p style={{ textAlign: "center", color: "var(--text-muted)", padding: "20px 0" }}>No completed evaluation cycles yet.</p></Card>
            ) : (
                <div className="card-list">
                    {withFeedback.map(f => {
                        const fb = aiFeedbackMap[f.id];
                        const open = expanded === f.id;
                        return (
                            <Card key={f.id} style={{ padding: 0, overflow: "hidden" }}>
                                <button onClick={() => setExpanded(open ? null : f.id)}
                                    style={{
                                        width: "100%", padding: "18px 22px", display: "flex", alignItems: "center",
                                        gap: "14px", background: "none", border: "none", cursor: "pointer", textAlign: "left"
                                    }}>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontWeight: 600, fontSize: "14px", color: "var(--text-primary)", marginBottom: "2px" }}>{f.name}</p>
                                        <p style={{ fontSize: "12px", color: "var(--text-second)" }}>
                                            {f.code} · Composite: <strong style={{ color: "var(--gold)" }}>{f.compositeScore.toFixed(2)}</strong>
                                        </p>
                                    </div>
                                    <span style={{ fontSize: "20px", color: "var(--text-muted)", transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>⌄</span>
                                </button>
                                {open && (
                                    <div className="anim-fade-in" style={{ padding: "0 22px 22px", borderTop: "1px solid var(--border)" }}>
                                        <div className="grid-2" style={{ gap: "14px", marginTop: "18px", marginBottom: "14px" }}>
                                            <div style={{ padding: "14px", background: "var(--success-dim)", border: "1px solid rgba(76,175,111,0.18)", borderRadius: "var(--radius-sm)" }}>
                                                <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--success)", marginBottom: "8px" }}>✦ Strengths</p>
                                                {fb.strengths.map((s, i) => <p key={i} style={{ fontSize: "13px", color: "var(--text-second)", lineHeight: 1.7, marginBottom: i < fb.strengths.length - 1 ? "8px" : 0 }}>{s}</p>)}
                                            </div>
                                            <div style={{ padding: "14px", background: "var(--gold-dim)", border: "1px solid var(--amber-border)", borderRadius: "var(--radius-sm)" }}>
                                                <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "8px" }}>◈ Points for Improvement</p>
                                                {fb.improvements.map((s, i) => <p key={i} style={{ fontSize: "13px", color: "var(--text-second)", lineHeight: 1.7, marginBottom: i < fb.improvements.length - 1 ? "8px" : 0 }}>{s}</p>)}
                                            </div>
                                        </div>
                                        <div style={{ padding: "14px", background: "var(--bg-base)", border: "1.5px solid rgba(26,50,112,0.15)", borderRadius: "var(--radius-sm)", marginBottom: "12px" }}>
                                            <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "8px" }}>📌 Evidence (Student Responses)</p>
                                            {fb.citations.map((c, i) => <p key={i} style={{ fontSize: "13px", color: "var(--text-muted)", fontStyle: "italic", lineHeight: 1.6, paddingLeft: "12px", borderLeft: "2px solid var(--amber-border)", marginBottom: i < fb.citations.length - 1 ? "8px" : 0 }}>{c}</p>)}
                                        </div>
                                        <div style={{ padding: "14px", background: "var(--gold-dim)", border: "1px solid var(--amber-border)", borderRadius: "var(--radius-sm)" }}>
                                            <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "6px" }}>🎯 Recommendation</p>
                                            <p style={{ fontSize: "13px", color: "var(--text-second)", lineHeight: 1.7 }}>{fb.recommendation}</p>
                                        </div>
                                    </div>
                                )}
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

/* ── Main ───────────────────────────────────────────── */
export default function DeanView({ activeTab }) {
    if (activeTab === "overview") return <div className="anim-fade-up"><Overview /></div>;
    if (activeTab === "evaluate") return <div className="anim-fade-up"><ChairEvalTab /></div>;
    if (activeTab === "feedback") return <div className="anim-fade-up"><AIFeedbackTab /></div>;
    return null;
}