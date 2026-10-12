import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/feedback/Input';
import { Button } from '../components/feedback/Button';
import { Alert } from '../components/feedback/Alert';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please provide your student email address and password.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await login({ email: email.trim(), password });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '24px 16px',
        backgroundColor: 'var(--bg-primary)',
      }}
    >
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--text-primary)',
              fontWeight: 700,
              fontSize: 'var(--text-lg)',
              marginBottom: '12px',
            }}
          >
            <div className="brand-logo-mark" aria-hidden="true">
              <div className="brand-sphere" />
            </div>
            <span>ClubSphere</span>
          </Link>
          <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 600 }}>Welcome Back</h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Sign in to access your clubs, events, and conversations.
          </p>
        </div>

        <div className="card" style={{ padding: '28px' }}>
          {error && <Alert variant="danger" onClose={() => setError(null)}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <Input
              id="login-email"
              label="Student Email"
              type="email"
              placeholder="e.g. alex.chen@campus.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />

            <Input
              id="login-password"
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              style={{ width: '100%', marginTop: '8px' }}
            >
              Sign In
            </Button>
          </form>
        </div>

        <p
          style={{
            textAlign: 'center',
            fontSize: 'var(--text-sm)',
            color: 'var(--text-secondary)',
            marginTop: '20px',
          }}
        >
          New to ClubSphere?{' '}
          <Link to="/register" style={{ fontWeight: 600, color: 'var(--brand-primary)' }}>
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
