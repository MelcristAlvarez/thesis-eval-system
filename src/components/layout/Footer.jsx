export default function Footer() {
  return (
    <footer style={{ borderTop:"1px solid var(--border)", padding:"14px 28px",
      display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"8px" }}>
      <p style={{ fontSize:"11px", color:"var(--text-muted)" }}>
        UST–Legazpi Faculty Evaluation System © 2026
      </p>
      <p style={{ fontSize:"11px", color:"var(--text-muted)" }}>
        Powered by QLoRA Fine-Tuned Llama 3
      </p>
    </footer>
  );
}