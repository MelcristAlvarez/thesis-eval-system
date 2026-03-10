/**
 * ScoreBar.jsx
 * Animated horizontal progress bar for score visualization.
 *
 * Props:
 *   score   {number}  - value (0–max)
 *   max     {number}  - maximum value (default 5)
 *   color   {string}  - bar fill color
 *   height  {number}  - bar height in px (default 6)
 */

export default function ScoreBar({
  score,
  max = 5,
  color = "#F59E0B",
  height = 6,
}) {
  const percentage = Math.min((score / max) * 100, 100);

  return (
    <div
      style={{
        width: "100%",
        height: `${height}px`,
        background: "rgba(255,255,255,0.06)",
        borderRadius: "99px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${percentage}%`,
          height: "100%",
          background: color,
          borderRadius: "99px",
          transition: "width 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
      />
    </div>
  );
}
