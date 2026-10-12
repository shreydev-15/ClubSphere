import { useNavigate } from 'react-router-dom';
import { Badge } from '../feedback/Badge';
import { Button } from '../feedback/Button';

export function ClubCard({
  club,
  isMember,
  isAdmin,
  onJoin,
  onLeave,
  actionLoading = false,
}) {
  const navigate = useNavigate();

  return (
    <div className="card club-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '12px' }}>
        <h3
          style={{
            fontSize: 'var(--text-md)',
            fontWeight: 600,
            cursor: 'pointer',
            lineHeight: 1.3,
          }}
          onClick={() => navigate(`/clubs/${club._id}`)}
        >
          {club.name}
        </h3>
        <Badge variant="brand" size="sm">
          {club.category}
        </Badge>
      </div>

      <p
        style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--text-secondary)',
          lineHeight: 1.5,
          flex: 1,
          marginBottom: '16px',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {club.description}
      </p>

      <div
        style={{
          paddingTop: '12px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
        }}
      >
        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          {isAdmin ? (
            <Badge variant="warning" size="xs">Admin</Badge>
          ) : isMember ? (
            <Badge variant="success" size="xs">Member</Badge>
          ) : (
            <span>Open Campus</span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate(`/clubs/${club._id}`)}
          >
            Details
          </Button>
          {isMember ? (
            <Button
              variant="outline"
              size="sm"
              loading={actionLoading}
              onClick={() => onLeave && onLeave(club._id)}
            >
              Leave
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              loading={actionLoading}
              onClick={() => onJoin && onJoin(club._id)}
            >
              Join
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
