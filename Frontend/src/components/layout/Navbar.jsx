import { NavLink } from 'react-router-dom';
import { MenuIcon } from '../common/Icons';

export function Navbar({ onOpenSidebar }) {
  return (
    <header className="mobile-header">
      <button
        type="button"
        className="btn btn-ghost btn-sm"
        onClick={onOpenSidebar}
        aria-label="Open navigation menu"
      >
        <MenuIcon size={20} />
      </button>

      <NavLink to="/dashboard" className="brand-link">
        <div className="brand-logo-mark" aria-hidden="true">
          <div className="brand-sphere" />
        </div>
        <span>ClubSphere</span>
      </NavLink>

      <div style={{ width: 32 }} />
    </header>
  );
}
