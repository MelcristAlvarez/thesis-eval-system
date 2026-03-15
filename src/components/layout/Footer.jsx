export default function Footer() {
  return (
    <footer style={{ borderTop:"2px solid var(--gold)", padding:"14px 32px",
      display:"flex", alignItems:"center", justifyContent:"space-between",
      flexWrap:"wrap", gap:"8px", background:"var(--bg-surface)" }}>
      <p style={{ fontSize:"11px", color:"var(--text-muted)" }}>
        UST–Legazpi Faculty Evaluation System &copy; 2026
      </p>
      <p style={{ fontSize:"11px", color:"var(--text-muted)" }}>
        Powered by QLoRA Fine-Tuned Llama 3
      </p>
    </footer>
  );
}