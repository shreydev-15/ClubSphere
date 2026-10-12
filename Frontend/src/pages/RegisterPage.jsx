import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/feedback/Input';
import { Button } from '../components/feedback/Button';
import { Alert } from '../components/feedback/Alert';

export function RegisterPage() {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firstname.trim() || !lastname.trim() || !email.trim() || !password) {
      setError('All fields are required.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await register({
        firstname: firstname.trim(),
        lastname: lastname.trim(),
        email: email.trim(),
        password,
      });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your information.');
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
      <div style={{ width: '100%', maxWidth: '440px' }}>
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
          <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 600 }}>Create Your Account</h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Join campus clubs, participate in discussions, and coordinate events.
          </p>
        </div>

        <div className="card" style={{ padding: '28px' }}>
          {error && <Alert variant="danger" onClose={() => setError(null)}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Input
                id="reg-firstname"
                label="First Name"
                placeholder="Alex"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                required
                autoComplete="given-name"
              />
              <Input
                id="reg-lastname"
                label="Last Name"
                placeholder="Chen"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                required
                autoComplete="family-name"
              />
            </div>

            <Input
              id="reg-email"
              label="Campus Email"
              type="email"
              placeholder="alex.chen@campus.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />

            <Input
              id="reg-password"
              label="Password"
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />

            <Input
              id="reg-confirm-password"
              label="Confirm Password"
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              style={{ width: '100%', marginTop: '8px' }}
            >
              Register Account
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
          Already have an account?{' '}
          <Link to="/login" style={{ fontWeight: 600, color: 'var(--brand-primary)' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
