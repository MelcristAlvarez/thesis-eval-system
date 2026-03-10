/**
 * App.jsx
 * Root component. Manages authentication state, theme, and role-based routing.
 */
import { useState, useEffect } from "react";
import Login    from "./pages/Login.jsx";
import StudentView from "./pages/StudentView.jsx";
import ChairView   from "./pages/ChairView.jsx";
import HRView      from "./pages/HRView.jsx";
import Sidebar  from "./components/layout/Sidebar.jsx";
import Header   from "./components/layout/Header.jsx";
import Footer   from "./components/layout/Footer.jsx";

/* Role → default tab mapping */
const defaultTab = { student:"evaluate", chairperson:"overview", hr:"overview" };

export default function App() {
  const [user,    setUser]    = useState(null);
  const [tab,     setTab]     = useState("");
  const [isDark,  setIsDark]  = useState(true);

  /* Apply dark/light class to <html> */
  useEffect(() => {
    document.documentElement.classList.toggle("light", !isDark);
  }, [isDark]);

  const handleLogin = (u) => {
    setUser(u);
    setTab(defaultTab[u.role] || "overview");
  };

  const handleLogout = () => {
    setUser(null);
    setTab("");
  };

  /* Page content by role */
  const PageContent = () => {
    if (!user) return null;
    if (user.role === "student")     return <StudentView />;
    if (user.role === "chairperson") return <ChairView />;
    if (user.role === "hr")          return <HRView />;
    return null;
  };

  /* Login screen */
  if (!user) {
    return (
      <>
        <Login onLogin={handleLogin} isDark={isDark} />
        {/* Small theme toggle on login */}
        <button
          onClick={() => setIsDark(d => !d)}
          style={{ position:"fixed", top:"16px", right:"16px", width:"36px", height:"36px",
            borderRadius:"var(--radius-sm)", background:"rgba(255,255,255,0.08)",
            border:"1px solid rgba(255,255,255,0.12)", color:"rgba(255,255,255,0.6)",
            fontSize:"16px", display:"flex", alignItems:"center", justifyContent:"center",
            cursor:"pointer", zIndex:100 }}
          title="Toggle theme"
        >
          {isDark ? "☀" : "🌙"}
        </button>
      </>
    );
  }

  /* Authenticated shell */
  return (
    <div style={{ display:"flex", minHeight:"100vh" }}>
      <Sidebar
        user={user}
        activeTab={tab}
        onNavigate={setTab}
        onLogout={handleLogout}
      />
      <div style={{ marginLeft:"var(--sidebar-w)", flex:1, display:"flex",
        flexDirection:"column", minHeight:"100vh", background:"var(--bg-base)" }}>
        <Header
          activeTab={tab}
          user={user}
          isDark={isDark}
          onToggleTheme={() => setIsDark(d => !d)}
        />
        <main key={`${user.role}-${tab}`} style={{ flex:1, padding:"28px 32px", maxWidth:"1160px", width:"100%" }}>
          <PageContent />
        </main>
        <Footer />
      </div>
    </div>
  );
}
