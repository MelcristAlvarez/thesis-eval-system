/**
 * Badge.jsx
 * A small status/label pill component.
 *
 * Props:
 *   label   {string}  - text to display
 *   variant {string}  - "success" | "warning" | "danger" | "info" | "neutral"
 */

const variantMap = {
  excellent:    { color: "#22C55E", bg: "rgba(34, 197, 94, 0.12)",   border: "rgba(34, 197, 94, 0.25)"   },
  good:         { color: "#60A5FA", bg: "rgba(96, 165, 250, 0.12)",  border: "rgba(96, 165, 250, 0.25)"  },
  average:      { color: "#F59E0B", bg: "rgba(245, 158, 11, 0.12)",  border: "rgba(245, 158, 11, 0.25)"  },
  needsSupport: { color: "#EF4444", bg: "rgba(239, 68, 68, 0.12)",   border: "rgba(239, 68, 68, 0.25)"   },
  neutral:      { color: "#9AA3BC", bg: "rgba(154, 163, 188, 0.10)", border: "rgba(154, 163, 188, 0.20)" },
  ai:           { color: "#2DD4BF", bg: "rgba(45, 212, 191, 0.10)",  border: "rgba(45, 212, 191, 0.20)"  },
};

const labelMap = {
  excellent:    "Excellent",
  good:         "Good",
  average:      "Average",
  needsSupport: "Needs Support",
};

export default function Badge({ label, variant = "neutral", style = {} }) {
  const v = variantMap[variant] || variantMap.neutral;
  const displayLabel = label || labelMap[variant] || variant;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "2px 10px",
        borderRadius: "99px",
        fontSize: "11px",
        fontWeight: 700,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        color: v.color,
        background: v.bg,
        border: `1px solid ${v.border}`,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {displayLabel}
    </span>
  );
}
