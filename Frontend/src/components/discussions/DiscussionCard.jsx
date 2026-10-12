import { useNavigate } from 'react-router-dom';
import { Button } from '../feedback/Button';

export function DiscussionCard({
  discussion,
  clubId,
  clubName,
}) {
  const navigate = useNavigate();

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div
      className="card card-clickable"
      onClick={() => navigate(`/clubs/${clubId || discussion.club}/discussions/${discussion._id}`)}
      style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
        <h4 style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--text-primary)' }}>
          {discussion.title}
        </h4>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          {formatDate(discussion.createdAt)}
        </span>
      </div>

      {clubName && (
        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--brand-primary)' }}>
          {clubName}
        </span>
      )}

      <p
        style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--text-secondary)',
          lineHeight: 1.5,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {discussion.content}
      </p>

      <div
        style={{
          paddingTop: '8px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '12px',
          color: 'var(--text-muted)',
        }}
      >
        <span>
          Started by {discussion.createdBy?.fullname?.firstname || 'Club Member'}
        </span>
        <Button variant="ghost" size="sm">
          View Thread &rarr;
        </Button>
      </div>
    </div>
  );
}
