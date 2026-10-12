import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { clubsService } from '../services/clubs.service';
import { membershipsService } from '../services/memberships.service';
import { eventsService } from '../services/events.service';
import { discussionsService } from '../services/discussions.service';
import { Button } from '../components/feedback/Button';
import { Badge } from '../components/feedback/Badge';
import { Alert } from '../components/feedback/Alert';
import { CardSkeleton } from '../components/feedback/Skeleton';
import { EmptyState } from '../components/feedback/EmptyState';
import { EventCard } from '../components/events/EventCard';
import { DiscussionCard } from '../components/discussions/DiscussionCard';
import {
  ClubsIcon,
  EventsIcon,
  DiscussionsIcon,
  ChatIcon,
  CalendarSyncIcon,
} from '../components/common/Icons';

export function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allClubs, setAllClubs] = useState([]);
  const [myClubs, setMyClubs] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [recentDiscussions, setRecentDiscussions] = useState([]);

  useEffect(() => {
    let mounted = true;

    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Fetch all clubs from backend
        const clubsRes = await clubsService.getAllClubs();
        const clubs = clubsRes?.clubs || [];
        if (!mounted) return;
        setAllClubs(clubs);

        // 2. Identify which clubs the user belongs to by checking membership rosters
        const membershipPromises = clubs.map(async (club) => {
          try {
            const memberRes = await membershipsService.getClubMembers(club._id);
            const userMember = memberRes?.members?.find(
              (m) =>
                m.user?._id === user?.id ||
                m.user?._id === user?._id ||
                m.user === user?.id
            );
            return userMember ? { ...club, myRole: userMember.role } : null;
          } catch {
            return null;
          }
        });

        const resolvedJoinedClubs = (await Promise.all(membershipPromises)).filter(Boolean);
        if (!mounted) return;
        setMyClubs(resolvedJoinedClubs);

        // 3. For joined clubs, aggregate upcoming events & recent discussions
        if (resolvedJoinedClubs.length > 0) {
          const eventsPromises = resolvedJoinedClubs.map(async (c) => {
            try {
              const res = await eventsService.getClubEvents(c._id);
              return (res?.events || []).map((e) => ({ ...e, clubName: c.name }));
            } catch {
              return [];
            }
          });

          const discussionsPromises = resolvedJoinedClubs.map(async (c) => {
            try {
              const res = await discussionsService.getClubDiscussions(c._id);
              return (res?.discussions || []).map((d) => ({ ...d, clubName: c.name }));
            } catch {
              return [];
            }
          });

          const allEvents = (await Promise.all(eventsPromises)).flat();
          const allDiscussions = (await Promise.all(discussionsPromises)).flat();

          if (!mounted) return;
          // Sort events by date
          allEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
          setUpcomingEvents(allEvents.slice(0, 4));

          // Sort discussions by newest first
          allDiscussions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setRecentDiscussions(allDiscussions.slice(0, 4));
        }
      } catch (err) {
        if (mounted) setError(err.message || 'Failed to load dashboard data');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    if (user) {
      loadDashboardData();
    }

    return () => {
      mounted = false;
    };
  }, [user]);

  return (
    <div>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">
              Good day, {user?.fullname?.firstname || 'Student'}
            </h1>
            <p className="page-description">
              Welcome to your ClubSphere console. Here is what is happening across your campus societies.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button variant="secondary" size="md" onClick={() => navigate('/clubs')}>
              Explore Clubs
            </Button>
            <Button variant="primary" size="md" onClick={() => navigate('/chat')}>
              Club Chat
            </Button>
          </div>
        </div>
      </div>

      {error && <Alert variant="danger" onClose={() => setError(null)}>{error}</Alert>}

      {/* Metrics Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '32px',
        }}
      >
        <div className="card" style={{ padding: '20px' }}>
          <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            My Clubs
          </p>
          <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--brand-primary)', marginTop: '4px' }}>
            {loading ? '-' : myClubs.length}
          </p>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Upcoming Events
          </p>
          <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
            {loading ? '-' : upcomingEvents.length}
          </p>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Active Discussions
          </p>
          <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
            {loading ? '-' : recentDiscussions.length}
          </p>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Campus Organizations
          </p>
          <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
            {loading ? '-' : allClubs.length}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="grid-2">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : myClubs.length === 0 ? (
        <EmptyState
          icon={ClubsIcon}
          title="You haven't joined any campus clubs yet"
          description="Join clubs that match your interests to access private real-time member chats, attend verified events, and participate in discussions."
          action={
            <Button variant="primary" size="lg" onClick={() => navigate('/clubs')}>
              Browse &amp; Join Clubs
            </Button>
          }
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* My Clubs Strip */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 600 }}>My Campus Clubs</h2>
              <Button variant="ghost" size="sm" onClick={() => navigate('/my-clubs')}>
                View all ({myClubs.length}) &rarr;
              </Button>
            </div>

            <div className="grid-3">
              {myClubs.slice(0, 3).map((club) => (
                <div
                  key={club._id}
                  className="card"
                  style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3
                      style={{ fontSize: 'var(--text-md)', fontWeight: 600, cursor: 'pointer' }}
                      onClick={() => navigate(`/clubs/${club._id}`)}
                    >
                      {club.name}
                    </h3>
                    <Badge variant={club.myRole === 'clubAdmin' ? 'warning' : 'neutral'} size="xs">
                      {club.myRole === 'clubAdmin' ? 'Admin' : 'Member'}
                    </Badge>
                  </div>
                  <p
                    style={{
                      fontSize: 'var(--text-sm)',
                      color: 'var(--text-secondary)',
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
                      display: 'flex',
                      gap: '8px',
                      paddingTop: '8px',
                      borderTop: '1px solid var(--border-subtle)',
                      marginTop: 'auto',
                    }}
                  >
                    <Button
                      variant="secondary"
                      size="sm"
                      style={{ flex: 1 }}
                      onClick={() => navigate(`/chat?clubId=${club._id}`)}
                    >
                      Chat
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      style={{ flex: 1 }}
                      onClick={() => navigate(`/clubs/${club._id}`)}
                    >
                      Hub
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Upcoming Events & Recent Discussions Side-by-Side */}
          <div className="grid-2">
            {/* Upcoming Events Section */}
            <section>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 600 }}>Upcoming Events</h2>
                <Button variant="ghost" size="sm" onClick={() => navigate('/events')}>
                  All events &rarr;
                </Button>
              </div>

              {upcomingEvents.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--text-muted)' }}>
                  <p style={{ fontSize: 'var(--text-sm)' }}>No upcoming events scheduled right now.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {upcomingEvents.map((evt) => (
                    <EventCard
                      key={evt._id}
                      event={evt}
                      clubName={evt.clubName}
                      onView={() => navigate(`/clubs/${evt.club}`)}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Recent Discussions Section */}
            <section>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 600 }}>Recent Discussions</h2>
                <Button variant="ghost" size="sm" onClick={() => navigate('/discussions')}>
                  All topics &rarr;
                </Button>
              </div>

              {recentDiscussions.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--text-muted)' }}>
                  <p style={{ fontSize: 'var(--text-sm)' }}>No active discussion threads in your clubs.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {recentDiscussions.map((disc) => (
                    <DiscussionCard
                      key={disc._id}
                      discussion={disc}
                      clubId={disc.club}
                      clubName={disc.clubName}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
