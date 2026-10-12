import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/auth.service';
import { Button } from '../components/feedback/Button';
import { Badge } from '../components/feedback/Badge';
import { Alert } from '../components/feedback/Alert';
import {
  CalendarSyncIcon,
  LogoutIcon,
  CheckIcon,
} from '../components/common/Icons';

export function ProfilePage() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);
  const [googleStatus, setGoogleStatus] = useState(null);
  const [googleStatusLoading, setGoogleStatusLoading] = useState(true);
  const [connectingGoogle, setConnectingGoogle] = useState(false);

  useEffect(() => {
    if (!user) return;
    setGoogleStatusLoading(true);
    authService.getGoogleStatus()
      .then((data) => setGoogleStatus(data))
      .catch(() => setGoogleStatus({ connected: false }))
      .finally(() => setGoogleStatusLoading(false));
  }, [user]);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logout();
      navigate('/login');
    } catch {
      setLoggingOut(false);
    }
  };

  const handleConnectGoogle = () => {
    setConnectingGoogle(true);
    // Direct browser navigation to start Google Calendar OAuth consent flow
    window.location.href = authService.getGoogleConnectUrl();
  };

  const isConnected = googleStatus?.connected;

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto' }}>
      <div className="page-header">
        <h1 className="page-title">Profile &amp; Account Settings</h1>
        <p className="page-description">
          Manage your student identity, Google Calendar authorization, and active sessions.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* User Identity Card */}
        <div className="card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--brand-primary)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 'var(--text-lg)',
                fontWeight: 700,
              }}
            >
              {(user?.fullname?.firstname?.[0] || 'U') + (user?.fullname?.lastname?.[0] || '')}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 600 }}>
                  {user?.fullname?.firstname} {user?.fullname?.lastname}
                </h2>
                <Badge variant={isAdmin ? 'warning' : 'neutral'} size="xs">
                  {isAdmin ? 'System Administrator' : 'Student Member'}
                </Badge>
              </div>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {user?.email}
              </p>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              paddingTop: '20px',
              borderTop: '1px solid var(--border-subtle)',
            }}
          >
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                Account Identifier
              </span>
              <p style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', marginTop: '4px' }}>
                {user?.id || user?._id}
              </p>
            </div>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                Role Permissions
              </span>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', marginTop: '4px' }}>
                {isAdmin ? 'Club Creation & Global Admin' : 'Campus Student Member'}
              </p>
            </div>
          </div>
        </div>

        {/* Google Calendar Integration Card */}
        <div
          className="card"
          style={{
            padding: '28px',
            ...(isConnected ? {
              borderColor: 'var(--status-success-border, #86efac)',
              backgroundColor: 'var(--status-success-bg, #f0fdf4)',
            } : {}),
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: isConnected
                    ? 'var(--status-success-text, #16a34a)'
                    : 'var(--brand-subtle)',
                  color: isConnected ? '#FFFFFF' : 'var(--brand-fg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background-color 0.25s ease',
                }}
              >
                {isConnected ? <CheckIcon size={20} /> : <CalendarSyncIcon size={20} />}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 600 }}>Google Calendar Integration</h3>
                  {!googleStatusLoading && (
                    <Badge variant={isConnected ? 'success' : 'neutral'} size="xs">
                      {isConnected ? '● Connected' : '○ Not connected'}
                    </Badge>
                  )}
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {googleStatusLoading
                    ? 'Checking status...'
                    : isConnected
                      ? `Syncing club events to your Google Calendar${googleStatus?.connectedAt ? ` since ${new Date(googleStatus.connectedAt).toLocaleDateString()}` : ''}.`
                      : 'Automate schedule management for workshops and meetings'}
                </p>
              </div>
            </div>

            {!googleStatusLoading && (
              <Button
                variant={isConnected ? 'outline' : 'primary'}
                size="md"
                icon={isConnected ? CheckIcon : CalendarSyncIcon}
                onClick={handleConnectGoogle}
                loading={connectingGoogle}
              >
                {isConnected ? 'Reconnect Google Calendar' : 'Connect Google Calendar'}
              </Button>
            )}
          </div>

          {isConnected ? (
            <div
              style={{
                padding: '12px 16px',
                backgroundColor: 'rgba(255,255,255,0.6)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--status-success-border, #86efac)',
                fontSize: '12px',
                color: 'var(--text-secondary)',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              <span style={{ fontWeight: 600, color: 'var(--status-success-text, #16a34a)' }}>
                ✓ Active Sync Configuration:
              </span>
              <span>• Google Calendar Events scope (<code>calendar.events</code>) — authorized</span>
              <span>• OAuth tokens stored securely in MongoDB and refreshed automatically</span>
              <span>• Events from clubs you're actively enrolled in are synchronized</span>
              {googleStatus?.tokenExpiry && (
                <span>• Token valid until: {new Date(googleStatus.tokenExpiry).toLocaleString()}</span>
              )}
            </div>
          ) : (
            <>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>
                Connecting your Google Calendar enables ClubSphere to automatically dispatch events created
                in your clubs directly to your Google Calendar. This uses Google OAuth 2.0 with restricted calendar
                event permissions.
              </p>

              <div
                style={{
                  padding: '12px 16px',
                  backgroundColor: 'var(--bg-primary)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '12px',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
              >
                <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Verified Integration Scope:
                </span>
                <span>&bull; Google Calendar Events scope (<code>calendar.events</code>)</span>
                <span>&bull; OAuth tokens are stored securely in MongoDB and refreshed automatically</span>
                <span>&bull; Only events from clubs you are actively enrolled in will be synchronized</span>
              </div>
            </>
          )}
        </div>

        {/* Session & Sign Out Card */}
        <div className="card" style={{ padding: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--status-danger-text)' }}>
              Session Management
            </h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Sign out of this browser session. HttpOnly authentication cookies will be cleared.
            </p>
          </div>
          <Button
            variant="danger"
            size="md"
            icon={LogoutIcon}
            loading={loggingOut}
            onClick={handleLogout}
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
