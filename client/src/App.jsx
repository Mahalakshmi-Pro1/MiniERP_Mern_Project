import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';
import Navbar from './components/Navbar.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Employees from './pages/Employees.jsx';
import Departments from './pages/Departments.jsx';

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return <div className="app-shell">
    <Sidebar mobileOpen={mobileOpen} closeMobile={() => setMobileOpen(false)} />
    <div className="main-area">
      <Navbar onMenu={() => setMobileOpen(v => !v)} />
      <div className="content-area">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  </div>;
}