import { Menu, Search, Bell } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const titles = {'/':'Dashboard','/employees':'Employees','/departments':'Departments'};
export default function Navbar({onMenu}) {
  const location=useLocation();
  return <header className="topbar">
    <button className="icon-button mobile-menu" onClick={onMenu} aria-label="Open menu"><Menu/></button>
    <div className="crumb"><span>Workspace</span><b>/</b><strong>{titles[location.pathname] || 'Dashboard'}</strong></div>
    <div className="topbar-right"><label className="global-search"><Search size={17}/><input placeholder="Search anything..." aria-label="Search anything"/><kbd>⌘ K</kbd></label><button className="icon-button notification" aria-label="Notifications"><Bell size={19}/><i/></button><div className="profile"><div className="avatar">AD</div><div><strong>Admin User</strong><small>Administrator</small></div></div></div>
  </header>;
}