import { Link } from 'react-router-dom';
import { Badge } from '../components/feedback/Badge';
import { BackIcon } from '../components/common/Icons';

export function TermsPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
      <Link
        to="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: 'var(--text-sm)',
          color: 'var(--brand-primary)',
          marginBottom: '24px',
        }}
      >
        <BackIcon size={14} />
        <span>Back to ClubSphere Home</span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700 }}>Terms of Service</h1>
        <Badge variant="warning" size="xs">Draft &mdash; Subject to Legal Review</Badge>
      </div>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginBottom: '32px' }}>
        Last updated: October 2026
      </p>

      <div className="card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', lineHeight: 1.6 }}>
        <section>
          <h2 style={{ fontSize: 'var(--text-md)', fontWeight: 600, marginBottom: '8px' }}>
            1. Acceptance of Terms
          </h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
            ClubSphere is an educational campus platform for college students and club administrators.
            By registering an account, joining clubs, posting discussions, or using club real-time chat,
            you agree to adhere to these Terms of Service and your institution's student code of conduct.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: 'var(--text-md)', fontWeight: 600, marginBottom: '8px' }}>
            2. Student Account Registration &amp; Security
          </h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
            Accounts require a valid student email, first name, last name, and password. You are responsible
            for maintaining the confidentiality of your session authentication credentials. You must immediately
            notify club administration or platform maintainers if you suspect unauthorized access to your account.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: 'var(--text-md)', fontWeight: 600, marginBottom: '8px' }}>
            3. Club Administration &amp; Membership
          </h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
            Club administrators have elevated rights to schedule events, moderate discussion topics, and oversee
            club settings. An administrator must assign an alternate administrator prior to departing a club.
            Actions that disrupt legitimate club operations, harass students, or falsify events are grounds for
            membership suspension.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: 'var(--text-md)', fontWeight: 600, marginBottom: '8px' }}>
            4. Real-Time Chat &amp; Community Guidelines
          </h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
            Chat messages are transmitted in real time via WebSockets and persisted to database storage for
            community continuity. Content must remain constructive, lawful, and free of hate speech, abuse,
            or spam. ClubSphere reserves the right to remove unauthorized or infringing messages.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: 'var(--text-md)', fontWeight: 600, marginBottom: '8px' }}>
            5. Third-Party Integrations (Google Calendar)
          </h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
            ClubSphere offers optional Google Calendar synchronization. Authorization is conducted directly
            via Google OAuth 2.0. By connecting, you permit ClubSphere to write and update club events on your
            primary Google Calendar. You may disconnect or revoke permissions through your Google Account settings
            at any time.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: 'var(--text-md)', fontWeight: 600, marginBottom: '8px' }}>
            6. Limitation of Liability
          </h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
            ClubSphere is provided on an &quot;as is&quot; and &quot;as available&quot; basis for student club coordination.
            Campus organizations and platform maintainers make no express warranties beyond good-faith service
            availability.
          </p>
        </section>
      </div>
    </div>
  );
}
