/**
 * StarRating.jsx
 * Interactive star rating input with hover preview.
 *
 * Props:
 *   value     {number}    - current rating (0–5)
 *   onChange  {function}  - callback(newValue)
 *   readOnly  {boolean}   - disables interaction (default false)
 */

import { useState } from "react";

const ratingLabels = ["", "Poor", "Below Average", "Satisfactory", "Good", "Excellent"];

export default function StarRating({ value = 0, onChange, readOnly = false }) {
  const [hovered, setHovered] = useState(0);
  const display = hovered || value;

  return (
    <div>
      <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => !readOnly && onChange && onChange(star)}
            onMouseEnter={() => !readOnly && setHovered(star)}
            onMouseLeave={() => !readOnly && setHovered(0)}
            style={{
              background: "none",
              border: "none",
              padding: "2px",
              fontSize: "22px",
              lineHeight: 1,
              cursor: readOnly ? "default" : "pointer",
              color: star <= display ? "#F59E0B" : "rgba(255,255,255,0.12)",
              transform: hovered === star && !readOnly ? "scale(1.2)" : "scale(1)",
              transition: "color 0.12s, transform 0.12s",
            }}
            aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
          >
            ★
          </button>
        ))}
        {!readOnly && display > 0 && (
          <span
            style={{
              fontSize: "12px",
              color: "#F59E0B",
              fontWeight: 600,
              marginLeft: "4px",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            {ratingLabels[display]}
          </span>
        )}
      </div>
    </div>
  );
}
