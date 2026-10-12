import { Link } from 'react-router-dom';
import { Badge } from '../components/feedback/Badge';
import { BackIcon } from '../components/common/Icons';

export function PrivacyPage() {
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
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700 }}>Privacy Policy</h1>
        <Badge variant="warning" size="xs">Draft &mdash; Subject to Legal Review</Badge>
      </div>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginBottom: '32px' }}>
        Last updated: October 2026
      </p>

      <div className="card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', lineHeight: 1.6 }}>
        <section>
          <h2 style={{ fontSize: 'var(--text-md)', fontWeight: 600, marginBottom: '8px' }}>
            1. Information We Collect
          </h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            In accordance with ClubSphere&apos;s active technical architecture, we collect and store only data
            essential to platform features:
          </p>
          <ul style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <li><strong>Account Data:</strong> Full name (first name, last name), campus email address, and salt-hashed password (bcrypt).</li>
            <li><strong>Club Data:</strong> Club memberships, administrator roles, club descriptions, and categories.</li>
            <li><strong>Discussions &amp; Replies:</strong> Topic titles, content, timestamps, and author associations.</li>
            <li><strong>Real-Time Chat:</strong> Message text, timestamps, club channel IDs, and sender user references stored in MongoDB.</li>
            <li><strong>Google Calendar Tokens:</strong> If authorized by you, Google Account ID, OAuth access token, refresh token, and token expiry date.</li>
          </ul>
        </section>

        <section>
          <h2 style={{ fontSize: 'var(--text-md)', fontWeight: 600, marginBottom: '8px' }}>
            2. How We Use Collected Information
          </h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
            We use your data strictly to authenticate your sessions, restrict club chat rooms and discussions
            to verified club members, display club rosters, and synchronize scheduled club events to your primary
            Google Calendar. We do not sell student data, display commercial third-party advertisements, or profile
            users for behavioral monetization.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: 'var(--text-md)', fontWeight: 600, marginBottom: '8px' }}>
            3. Authentication &amp; Cookies
          </h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
            ClubSphere issues JSON Web Tokens (JWT) stored in HTTP cookies. These cookies are transmitted with
            credentialed requests to authenticate API calls and authorize real-time Socket.IO WebSocket connections.
            Logging out clears this authentication cookie immediately.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: 'var(--text-md)', fontWeight: 600, marginBottom: '8px' }}>
            4. Google Calendar Data Practices
          </h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
            When you connect Google Calendar, ClubSphere requests authorization under the
            <code>https://www.googleapis.com/auth/calendar.events</code> scope. This is used solely to insert,
            update, and remove calendar entries for events created in your clubs. We do not inspect, read, or
            export existing unrelated personal events from your calendar.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: 'var(--text-md)', fontWeight: 600, marginBottom: '8px' }}>
            5. Data Retention &amp; Deletion
          </h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
            Club data, discussion threads, and chat messages remain accessible to club members for as long as the
            organization remains active. If an authorized administrator deletes a club, all associated records,
            discussions, and club events are removed from the database.
          </p>
        </section>
      </div>
    </div>
  );
}
