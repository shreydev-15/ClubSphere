import { useNavigate } from 'react-router-dom';
import { Button } from '../components/feedback/Button';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '32px 16px',
      }}
    >
      <h1 style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--brand-primary)', letterSpacing: '-0.03em' }}>
        404
      </h1>
      <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 600, marginTop: '8px', color: 'var(--text-primary)' }}>
        Page Not Found
      </h2>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', maxWidth: '440px', margin: '12px auto 24px' }}>
        The page or resource you requested does not exist or may have been moved.
      </p>
      <Button variant="primary" size="md" onClick={() => navigate('/dashboard')}>
        Return to Dashboard
      </Button>
    </div>
  );
}
