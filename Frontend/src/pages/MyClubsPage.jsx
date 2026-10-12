import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { clubsService } from '../services/clubs.service';
import { membershipsService } from '../services/memberships.service';
import { Button } from '../components/feedback/Button';
import { Badge } from '../components/feedback/Badge';
import { CardSkeleton } from '../components/feedback/Skeleton';
import { EmptyState } from '../components/feedback/EmptyState';
import { Alert } from '../components/feedback/Alert';
import { ClubsIcon, ChatIcon, EventsIcon, DiscussionsIcon } from '../components/common/Icons';

export function MyClubsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [managedClubs, setManagedClubs] = useState([]);
  const [joinedClubs, setJoinedClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchMyClubs = async () => {
      try {
        setLoading(true);
        setError(null);

        const clubsRes = await clubsService.getAllClubs();
        const allClubs = clubsRes?.clubs || [];

        const managed = [];
        const joined = [];

        await Promise.all(
          allClubs.map(async (club) => {
            try {
              const membersRes = await membershipsService.getClubMembers(club._id);
              const myMembership = membersRes?.members?.find(
                (m) =>
                  m.user?._id === user?.id ||
                  m.user?._id === user?._id ||
                  m.user === user?.id
              );
              if (myMembership) {
                if (myMembership.role === 'clubAdmin') {
                  managed.push({ ...club, myRole: 'clubAdmin', memberCount: membersRes.members.length });
                } else {
                  joined.push({ ...club, myRole: 'member', memberCount: membersRes.members.length });
                }
              }
            } catch {
              // ignore failures for inaccessible clubs
            }
          })
        );

        if (mounted) {
          setManagedClubs(managed);
          setJoinedClubs(joined);
        }
      } catch (err) {
        if (mounted) setError(err.message || 'Failed to fetch your clubs');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    if (user) {
      fetchMyClubs();
    }

    return () => {
      mounted = false;
    };
  }, [user]);

  const totalClubs = managedClubs.length + joinedClubs.length;

  return (
    <div>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">My Campus Clubs</h1>
            <p className="page-description">
              Organizations you actively lead or participate in as a student member.
            </p>
          </div>
          <Button variant="secondary" size="md" onClick={() => navigate('/clubs')}>
            Explore More Clubs
          </Button>
        </div>
      </div>

      {error && <Alert variant="danger" onClose={() => setError(null)}>{error}</Alert>}

      {loading ? (
        <div className="grid-3">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : totalClubs === 0 ? (
        <EmptyState
          icon={ClubsIcon}
          title="You have not joined any campus clubs"
          description="Explore our campus registry to find academic, technical, cultural, and recreational student clubs."
          action={
            <Button variant="primary" size="lg" onClick={() => navigate('/clubs')}>
              Explore Campus Clubs
            </Button>
          }
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
          {/* Managed Clubs */}
          {managedClubs.length > 0 && (
            <section>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 600 }}>Clubs You Administer</h2>
                <Badge variant="warning" size="xs">Admin Access</Badge>
              </div>

              <div className="grid-3">
                {managedClubs.map((club) => (
                  <div key={club._id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h3
                        style={{ fontSize: 'var(--text-md)', fontWeight: 600, cursor: 'pointer' }}
                        onClick={() => navigate(`/clubs/${club._id}`)}
                      >
                        {club.name}
                      </h3>
                      <Badge variant="brand" size="xs">{club.category}</Badge>
                    </div>

                    <p
                      style={{
                        fontSize: 'var(--text-sm)',
                        color: 'var(--text-secondary)',
                        flex: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {club.description}
                    </p>

                    <div
                      style={{
                        paddingTop: '10px',
                        borderTop: '1px solid var(--border-subtle)',
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '8px',
                      }}
                    >
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={ChatIcon}
                        onClick={() => navigate(`/chat?clubId=${club._id}`)}
                      >
                        Chat
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/clubs/${club._id}`)}
                      >
                        Manage Hub
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Joined Clubs */}
          {joinedClubs.length > 0 && (
            <section>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 600 }}>Clubs You've Joined</h2>
                <Badge variant="success" size="xs">{joinedClubs.length} Active</Badge>
              </div>

              <div className="grid-3">
                {joinedClubs.map((club) => (
                  <div key={club._id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h3
                        style={{ fontSize: 'var(--text-md)', fontWeight: 600, cursor: 'pointer' }}
                        onClick={() => navigate(`/clubs/${club._id}`)}
                      >
                        {club.name}
                      </h3>
                      <Badge variant="brand" size="xs">{club.category}</Badge>
                    </div>

                    <p
                      style={{
                        fontSize: 'var(--text-sm)',
                        color: 'var(--text-secondary)',
                        flex: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {club.description}
                    </p>

                    <div
                      style={{
                        paddingTop: '10px',
                        borderTop: '1px solid var(--border-subtle)',
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '8px',
                      }}
                    >
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={ChatIcon}
                        onClick={() => navigate(`/chat?clubId=${club._id}`)}
                      >
                        Chat
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/clubs/${club._id}`)}
                      >
                        View Hub
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
