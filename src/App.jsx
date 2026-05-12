import { useState, useEffect } from "react";
import Login       from "./pages/Login.jsx";
import StudentView from "./pages/StudentView.jsx";
import ChairView   from "./pages/ChairView.jsx";
import HRView      from "./pages/HRView.jsx";
import DeanView    from "./pages/DeanView.jsx";
import FacultyView from "./pages/FacultyView.jsx";
import Sidebar     from "./components/layout/Sidebar.jsx";
import Header      from "./components/layout/Header.jsx";
import Footer      from "./components/layout/Footer.jsx";

// Fixed the landing tab for faculty from "ratings" to "dashboard"
const defaultTab = { student:"evaluate", chairperson:"overview", hr:"overview", dean:"overview", faculty:"dashboard" };

export default function App() {
  const [user,     setUser]     = useState(null);
  const [tab,      setTab]      = useState("");
  const [sideOpen, setSideOpen] = useState(false);

  // Always light mode, remove any leftover dark class
  useEffect(() => {
    document.documentElement.classList.remove("light");
    document.documentElement.classList.remove("dark");
  }, []);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 768) setSideOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const login  = (u) => { setUser(u); setTab(defaultTab[u.role] || "overview"); };
  
  // Logout function now strictly clears the LocalStorage data
  const logout = ()  => { 
      setUser(null); 
      setTab(""); 
      setSideOpen(false); 
      localStorage.clear(); // Wipes all mock data evaluated so far
  };
  
  const nav    = (k) => { setTab(k); setSideOpen(false); };

  if (!user) return <Login onLogin={login}/>;

  return (
    <div className="app-shell">
      <Sidebar
        user={user} activeTab={tab} onNavigate={nav}
        isOpen={sideOpen} onClose={()=>setSideOpen(false)}
      />
      <div className="main-wrap">
        <Header
          activeTab={tab}
          onLogout={logout}
          onMenuOpen={()=>setSideOpen(o=>!o)}
        />
        <main className="page-main">
          {user.role === "student"     && <StudentView activeTab={tab} onNavigate={nav}/>}
          {user.role === "chairperson" && <ChairView   activeTab={tab} onNavigate={nav}/>}
          {user.role === "hr"          && <HRView      activeTab={tab} onNavigate={nav}/>}
          {user.role === "dean"        && <DeanView    activeTab={tab} onNavigate={nav}/>}
          {user.role === "faculty"     && <FacultyView activeTab={tab} onNavigate={nav} user={user}/>}
        </main>
        <Footer/>
      </div>
    </div>
  );
}