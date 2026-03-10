/**
 * Card.jsx
 * Generic elevated surface card with optional hover lift.
 *
 * Props:
 *   children    {node}    - card content
 *   style       {object}  - additional inline styles
 *   hoverable   {boolean} - enables hover lift animation (default false)
 *   accent      {string}  - left border accent color (optional)
 *   className   {string}  - additional CSS classes
 */

export default function Card({
  children,
  style = {},
  hoverable = false,
  accent = null,
  className = "",
}) {
  return (
    <div
      className={className}
      style={{
        background: "#141720",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "18px",
        padding: "24px",
        position: "relative",
        overflow: "hidden",
        transition: hoverable ? "transform 0.2s ease, box-shadow 0.2s ease" : undefined,
        boxShadow: "0 4px 16px rgba(0,0,0,0.35)",
        ...(accent && {
          borderLeft: `3px solid ${accent}`,
        }),
        ...style,
      }}
      onMouseEnter={(e) => {
        if (hoverable) {
          e.currentTarget.style.transform = "translateY(-3px)";
          e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.45)";
        }
      }}
      onMouseLeave={(e) => {
        if (hoverable) {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.35)";
        }
      }}
    >
      {children}
    </div>
  );
}
