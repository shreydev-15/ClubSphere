import { Badge } from '../feedback/Badge';
import { Button } from '../feedback/Button';
import { ClockIcon, MapPinIcon, CalendarSyncIcon, TrashIcon } from '../common/Icons';

export function EventCard({
  event,
  clubName,
  isClubAdmin = false,
  onDelete,
  onView,
}) {
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const getSyncBadge = (status) => {
    switch (status) {
      case 'synced':
        return <Badge variant="success" size="xs">Google Calendar Synced</Badge>;
      case 'partial':
        return <Badge variant="warning" size="xs">Partial Calendar Sync</Badge>;
      case 'failed':
        return <Badge variant="danger" size="xs">Calendar Sync Failed</Badge>;
      default:
        return <Badge variant="neutral" size="xs">Local Event</Badge>;
    }
  };

  return (
    <div className="card event-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
        <h4 style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--text-primary)' }}>
          {event.title}
        </h4>
        {getSyncBadge(event.calendarSyncStatus)}
      </div>

      {clubName && (
        <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--brand-primary)', marginBottom: '8px' }}>
          {clubName}
        </p>
      )}

      <p
        style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--text-secondary)',
          lineHeight: 1.5,
          flex: 1,
          marginBottom: '16px',
        }}
      >
        {event.description}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ClockIcon size={14} />
          <span>
            {formatDate(event.date)} &bull; {event.startTime} &ndash; {event.endTime}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <MapPinIcon size={14} />
          <span>{event.location}</span>
        </div>
      </div>

      <div style={{ paddingTop: '10px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          Host: {event.createdBy?.fullname?.firstname || 'Admin'}
        </span>
        <div style={{ display: 'flex', gap: '6px' }}>
          {onView && (
            <Button variant="secondary" size="sm" onClick={() => onView(event)}>
              Details
            </Button>
          )}
          {isClubAdmin && onDelete && (
            <Button variant="danger" size="sm" onClick={() => onDelete(event._id)}>
              <TrashIcon size={13} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
