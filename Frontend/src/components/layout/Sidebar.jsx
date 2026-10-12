import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  DashboardIcon,
  ClubsIcon,
  EventsIcon,
  DiscussionsIcon,
  ChatIcon,
  ProfileIcon,
  AdminIcon,
  LogoutIcon,
  CloseIcon,
} from '../common/Icons';

export function Sidebar({ isOpen, onClose }) {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const first = name.firstname ? name.firstname[0] : '';
    const last = name.lastname ? name.lastname[0] : '';
    return (first + last).toUpperCase() || 'U';
  };

  return (
    <>
      {isOpen && (
        <div
          className="modal-overlay"
          style={{ zIndex: 99 }}
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <NavLink to="/dashboard" className="brand-link" onClick={onClose}>
            <div className="brand-logo-mark" aria-hidden="true">
              <div className="brand-sphere" />
            </div>
            <span>ClubSphere</span>
          </NavLink>
          {isOpen && (
            <button
              type="button"
              className="modal-close-btn"
              onClick={onClose}
              aria-label="Close navigation"
            >
              <CloseIcon size={16} />
            </button>
          )}
        </div>

        <nav className="sidebar-nav" aria-label="Main Navigation">
          <span className="nav-section-title">Navigation</span>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <DashboardIcon size={18} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink
            to="/clubs"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <ClubsIcon size={18} />
            <span>Explore Clubs</span>
          </NavLink>
          <NavLink
            to="/my-clubs"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <ClubsIcon size={18} />
            <span>My Clubs</span>
          </NavLink>
          <NavLink
            to="/events"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <EventsIcon size={18} />
            <span>Events</span>
          </NavLink>
          <NavLink
            to="/discussions"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <DiscussionsIcon size={18} />
            <span>Discussions</span>
          </NavLink>
          <NavLink
            to="/chat"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <ChatIcon size={18} />
            <span>Club Chat</span>
          </NavLink>

          <span className="nav-section-title">Account</span>
          <NavLink
            to="/profile"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <ProfileIcon size={18} />
            <span>Profile &amp; Settings</span>
          </NavLink>

          {isAdmin && (
            <>
              <span className="nav-section-title">Administration</span>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  color: 'var(--brand-primary)',
                  fontWeight: 600,
                }}
              >
                <AdminIcon size={14} />
                <span>Admin Privileges Active</span>
              </div>
            </>
          )}
        </nav>

        <div className="sidebar-footer">
          {user && (
            <div className="user-profile-summary">
              <div className="user-avatar">{getInitials(user.fullname)}</div>
              <div className="user-meta">
                <p className="user-meta-name">
                  {user.fullname?.firstname} {user.fullname?.lastname}
                </p>
                <p className="user-meta-email">{user.email}</p>
              </div>
            </div>
          )}
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={handleLogout}
            style={{ width: '100%', justifyContent: 'flex-start' }}
          >
            <LogoutIcon size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
