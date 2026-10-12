import { useState, useEffect } from 'react';
import { Modal } from '../feedback/Modal';
import { Badge } from '../feedback/Badge';
import { Skeleton } from '../feedback/Skeleton';
import { Alert } from '../feedback/Alert';
import { membershipsService } from '../../services/memberships.service';

export function ClubMembersModal({ isOpen, onClose, clubId, clubName }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen || !clubId) return;

    let mounted = true;
    const fetchMembers = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await membershipsService.getClubMembers(clubId);
        if (mounted && res?.members) {
          setMembers(res.members);
        }
      } catch (err) {
        if (mounted) setError(err.message || 'Failed to load club members');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchMembers();
    return () => {
      mounted = false;
    };
  }, [isOpen, clubId]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${clubName || 'Club'} Roster`}
      description={`Active student members registered in this club (${members.length})`}
      maxWidth="600px"
    >
      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Skeleton height="40px" />
          <Skeleton height="40px" />
          <Skeleton height="40px" />
        </div>
      ) : members.length === 0 ? (
        <p style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)' }}>
          No registered members found.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '400px', overflowY: 'auto' }}>
          {members.map((m) => (
            <div
              key={m._id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                backgroundColor: 'var(--bg-primary)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div>
                <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {m.user?.fullname?.firstname} {m.user?.fullname?.lastname}
                </p>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{m.user?.email}</p>
              </div>
              <div>
                {m.role === 'clubAdmin' ? (
                  <Badge variant="warning" size="xs">Club Admin</Badge>
                ) : (
                  <Badge variant="neutral" size="xs">Member</Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}
