import { NavLink } from 'react-router-dom';

const NAV = [
  { to: '/',             icon: '🏠', label: 'Overview'          },
  { to: '/methodology',  icon: '⚙️', label: 'Methodology'       },
  { to: '/demo',         icon: '🎵', label: 'Listen & Demo'     },
  { to: '/logs',         icon: '📋', label: 'Contribution Logs' },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="sidebar-logo-icon">🎹</span>
        <div>
          <div className="sidebar-logo-title">LSTM for Music Generation</div>
          <div className="sidebar-logo-sub">CS371 · Spring 2026</div>
        </div>
      </div>
      <nav className="sidebar-nav">
        {NAV.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
          >
            <span className="sidebar-link-icon">{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="sidebar-footer-text">Gettysburg College</div>
        <div className="sidebar-footer-sub">LSTM Melody Generation</div>
      </div>
    </aside>
  );
}
