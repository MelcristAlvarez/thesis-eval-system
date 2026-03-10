/**
 * Footer.jsx
 * Minimal page footer with institutional info.
 */

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "16px 32px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "8px",
        marginTop: "auto",
      }}
    >
      <span
        style={{
          fontSize: "11px",
          color: "#5C6480",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
      >
        © 2026 University of Santo Tomas–Legazpi · College of Engineering, Architecture, and Fine Arts
      </span>
      <span
        style={{
          fontSize: "11px",
          color: "#5C6480",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
      >
        Data stored locally · ISO 25010 Compliant · v1.0.0
      </span>
    </footer>
  );
}
