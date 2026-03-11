import { useState, useEffect } from "react";
import Login       from "./pages/Login.jsx";
import StudentView from "./pages/StudentView.jsx";
import ChairView   from "./pages/ChairView.jsx";
import HRView      from "./pages/HRView.jsx";
import Sidebar     from "./components/layout/Sidebar.jsx";
import Header      from "./components/layout/Header.jsx";
import Footer      from "./components/layout/Footer.jsx";

const defaultTab = { student:"evaluate", chairperson:"overview", hr:"overview" };

export default function App() {
  const [user,       setUser]       = useState(null);
  const [tab,        setTab]        = useState("");
  const [isDark,     setIsDark]     = useState(false);   // light mode default
  const [sideOpen,   setSideOpen]   = useState(false);

  // Apply light/dark class
  useEffect(() => {
    document.documentElement.classList.toggle("light", !isDark);
  }, [isDark]);

  // Close sidebar on desktop resize
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 768) setSideOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const login  = (u) => { setUser(u); setTab(defaultTab[u.role] || "overview"); };
  const logout = ()  => { setUser(null); setTab(""); setSideOpen(false); };
  const nav    = (k) => { setTab(k); setSideOpen(false); };

  // Login screen (no sidebar)
  if (!user) {
    return (
      <>
        <Login onLogin={login} isDark={isDark}/>
        <button
          onClick={() => setIsDark(d => !d)}
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          style={{ position:"fixed", top:"16px", right:"16px", width:"38px", height:"38px",
            borderRadius:"var(--radius-sm)",
            background: isDark ? "rgba(245,166,35,0.15)" : "rgba(0,0,0,0.20)",
            border: isDark ? "1px solid rgba(245,166,35,0.40)" : "1px solid rgba(0,0,0,0.20)",
            fontSize:"17px",
            display:"flex", alignItems:"center", justifyContent:"center",
            cursor:"pointer", zIndex:100,
            color: isDark ? "#F5A623" : "#0D0B06" }}>
          {isDark ? "☀" : "🌙"}
        </button>
      </>
    );
  }

  return (
    <div className="app-shell">
      <Sidebar
        user={user} activeTab={tab} onNavigate={nav}
        isOpen={sideOpen} onClose={() => setSideOpen(false)}
      />
      <div className="main-wrap" style={{ background:"var(--bg-base)" }}>
        <Header
          activeTab={tab} isDark={isDark}
          onToggleTheme={() => setIsDark(d => !d)}
          onLogout={logout}
          onMenuOpen={() => setSideOpen(o => !o)}
        />
        <main className="page-main">
          {user.role === "student"     && <StudentView activeTab={tab} onNavigate={nav}/>}
          {user.role === "chairperson" && <ChairView   activeTab={tab} onNavigate={nav}/>}
          {user.role === "hr"          && <HRView      activeTab={tab} onNavigate={nav}/>}
        </main>
        <Footer/>
      </div>
    </div>
  );
}