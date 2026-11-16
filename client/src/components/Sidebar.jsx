import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Building2, BriefcaseBusiness, X } from 'lucide-react';

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/employees', label: 'Employees', icon: Users },
  { to: '/departments', label: 'Departments', icon: Building2 }
];

export default function Sidebar({ mobileOpen, closeMobile }) {
  return <>
    {mobileOpen && <button className="mobile-backdrop" onClick={closeMobile} aria-label="Close menu" />}
    <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
      <div className="brand"><span className="brand-mark"><BriefcaseBusiness size={21}/></span><span>Mini<span className="brand-accent">ERP</span><small>WORKSPACE</small></span><button className="sidebar-close" onClick={closeMobile}><X/></button></div>
      <div className="menu-caption">WORKSPACE</div>
      <nav className="side-nav">
        {links.map(({to,label,icon:Icon,end}) => <NavLink key={to} to={to} end={end} onClick={closeMobile} className={({isActive})=>`nav-link ${isActive?'active':''}`}><Icon size={19}/><span>{label}</span></NavLink>)}
      </nav>
      <div className="sidebar-bottom"><div className="help-card"><div className="help-dot">?</div><strong>Need help?</strong><p>Contact your administrator for support.</p></div><div className="sidebar-foot">MiniERP <span>v2.0</span></div></div>
    </aside>
  </>;
}