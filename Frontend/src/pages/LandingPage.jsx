import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/feedback/Button';
import { Badge } from '../components/feedback/Badge';
import {
  ClubsIcon,
  EventsIcon,
  DiscussionsIcon,
  ChatIcon,
  CalendarSyncIcon,
} from '../components/common/Icons';

export function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Header */}
      <header
        style={{
          borderBottom: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-surface)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <div
          className="container"
          style={{
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="brand-logo-mark" aria-hidden="true">
              <div className="brand-sphere" />
            </div>
            <span style={{ fontWeight: 700, fontSize: 'var(--text-lg)', color: 'var(--text-primary)' }}>
              ClubSphere
            </span>
          </div>

          <nav style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {isAuthenticated ? (
              <Button variant="primary" size="md" onClick={() => navigate('/dashboard')}>
                Open Dashboard
              </Button>
            ) : (
              <>
                <Button variant="ghost" size="md" onClick={() => navigate('/login')}>
                  Sign In
                </Button>
                <Button variant="primary" size="md" onClick={() => navigate('/register')}>
                  Get Started
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section
        style={{
          padding: '72px 0 56px',
          borderBottom: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-surface)',
        }}
      >
        <div className="container" style={{ maxWidth: '880px', textAlign: 'center' }}>
          <Badge variant="brand" size="md" style={{ marginBottom: '16px' }}>
            Campus Club &amp; Community Platform
          </Badge>

          <h1
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              color: 'var(--text-primary)',
              marginBottom: '20px',
            }}
          >
            One centralized platform for campus clubs, student discussions, and real-time coordination.
          </h1>

          <p
            style={{
              fontSize: 'var(--text-md)',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              maxWidth: '680px',
              margin: '0 auto 32px',
            }}
          >
            ClubSphere bridges college students and club organizers. Discover verified clubs,
            attend campus events with automated Google Calendar synchronization, engage in
            focused discussions, and chat in real-time.
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              flexWrap: 'wrap',
            }}
          >
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate(isAuthenticated ? '/clubs' : '/register')}
            >
              Explore Campus Clubs &rarr;
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => {
                const el = document.getElementById('preview-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              See How It Works
            </Button>
          </div>
        </div>
      </section>

      {/* Authentic Product Preview */}
      <section
        id="preview-section"
        style={{
          padding: '64px 0',
          backgroundColor: 'var(--bg-primary)',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div className="container" style={{ maxWidth: '1040px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 600, marginBottom: '8px' }}>
              Designed with restraint, built for student life
            </h2>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
              Everything students and club leaders need in an uncluttered, high-performance interface.
            </p>
          </div>

          {/* Interactive Feature Demo Tiles */}
          <div className="grid-2" style={{ gap: '24px' }}>
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--brand-subtle)',
                    color: 'var(--brand-fg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ClubsIcon size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 600 }}>Club Discovery &amp; Roster</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Verified student organizations</p>
                </div>
              </div>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Filter across engineering, arts, robotics, entrepreneurship, and sports societies.
                Join with one click, explore member rosters, and participate in club governance.
              </p>
            </div>

            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--brand-subtle)',
                    color: 'var(--brand-fg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <EventsIcon size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 600 }}>Google Calendar Sync</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Automatic schedule synchronization</p>
                </div>
              </div>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Never miss a workshop or campus hackathon. Published club events sync directly to your
                Google Calendar with dates, times, and venue locations.
              </p>
            </div>

            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--brand-subtle)',
                    color: 'var(--brand-fg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ChatIcon size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 600 }}>Real-Time Member Chat</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Socket.IO powered communication</p>
                </div>
              </div>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Coordinate in real time with fellow members. Persistent history, message deduplication,
                and secure room authorization ensure only verified members participate.
              </p>
            </div>

            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--brand-subtle)',
                    color: 'var(--brand-fg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <DiscussionsIcon size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 600 }}>Focused Club Discussions</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Structured proposals and feedback</p>
                </div>
              </div>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Avoid lost messages in unstructured feeds. Discussion boards allow club leadership to publish
                announcements and solicit threaded feedback from members.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          marginTop: 'auto',
          backgroundColor: 'var(--bg-surface)',
          borderTop: '1px solid var(--border-subtle)',
          padding: '32px 0',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
            &copy; {new Date().getFullYear()} ClubSphere. Built for college student communities.
          </div>
          <div style={{ display: 'flex', gap: '20px', fontSize: 'var(--text-xs)' }}>
            <Link to="/terms" style={{ color: 'var(--text-secondary)' }}>
              Terms of Service
            </Link>
            <Link to="/privacy" style={{ color: 'var(--text-secondary)' }}>
              Privacy Policy
            </Link>
            <Link to="/login" style={{ color: 'var(--text-secondary)' }}>
              Sign In
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
