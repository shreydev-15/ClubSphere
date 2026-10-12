import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/auth.service';
import { clubsService } from '../services/clubs.service';
import { eventsService } from '../services/events.service';
import { EventCard } from '../components/events/EventCard';
import { Input } from '../components/feedback/Input';
import { Button } from '../components/feedback/Button';
import { Badge } from '../components/feedback/Badge';
import { CardSkeleton } from '../components/feedback/Skeleton';
import { EmptyState } from '../components/feedback/EmptyState';
import { Alert } from '../components/feedback/Alert';
import { SearchIcon, EventsIcon, CalendarSyncIcon, CheckIcon } from '../components/common/Icons';

export function EventsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [clubs, setClubs] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClubId, setSelectedClubId] = useState('All');

  // Google Calendar status
  const [googleStatus, setGoogleStatus] = useState(null); // null = loading, { connected: bool }
  const [googleConnectedJustNow, setGoogleConnectedJustNow] = useState(false);
  const [googleError, setGoogleError] = useState(null);

  // Detect redirect from Google OAuth callback
  useEffect(() => {
    const connected = searchParams.get('googleConnected');
    const err = searchParams.get('googleError');

    if (connected === 'true') {
      setGoogleConnectedJustNow(true);
      // Clear query param from URL without page reload
      setSearchParams({}, { replace: true });
    }

    if (err) {
      const messages = {
        cancelled: 'Google Calendar connection was cancelled.',
        missing_params: 'OAuth returned missing parameters. Please try again.',
        invalid_state: 'OAuth state was invalid. Please try again.',
        expired_state: 'OAuth session expired. Please reconnect.',
        no_token: 'Google did not return an access token. Please try again.',
        server_error: 'A server error occurred. Please try again later.',
      };
      setGoogleError(messages[err] || 'Google Calendar connection failed.');
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // Fetch Google Calendar connection status
  useEffect(() => {
    if (!user) return;
    authService.getGoogleStatus()
      .then((data) => setGoogleStatus(data))
      .catch(() => setGoogleStatus({ connected: false }));
  }, [user, googleConnectedJustNow]);

  useEffect(() => {
    let mounted = true;

    const loadAllEvents = async () => {
      try {
        setLoading(true);
        setError(null);

        const clubsRes = await clubsService.getAllClubs();
        const clubList = clubsRes?.clubs || [];
        if (!mounted) return;
        setClubs(clubList);

        const eventsPromises = clubList.map(async (c) => {
          try {
            const evRes = await eventsService.getClubEvents(c._id);
            return (evRes?.events || []).map((e) => ({
              ...e,
              clubName: c.name,
              clubCategory: c.category,
            }));
          } catch {
            return [];
          }
        });

        const allEvts = (await Promise.all(eventsPromises)).flat();
        allEvts.sort((a, b) => new Date(a.date) - new Date(b.date));

        if (mounted) {
          setEvents(allEvts);
        }
      } catch (err) {
        if (mounted) setError(err.message || 'Failed to load events');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    if (user) {
      loadAllEvents();
    }

    return () => {
      mounted = false;
    };
  }, [user]);

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const matchesSearch =
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesClub =
        selectedClubId === 'All' || e.club === selectedClubId;
      return matchesSearch && matchesClub;
    });
  }, [events, searchQuery, selectedClubId]);

  const isConnected = googleStatus?.connected;

  return (
    <div>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Campus Events</h1>
            <p className="page-description">
              Upcoming club workshops, hackathons, and meetings synchronized with Google Calendar.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {isConnected && (
              <Badge variant="success" size="sm">
                ✓ Google Calendar Synced
              </Badge>
            )}
            <Button
              variant={isConnected ? 'outline' : 'secondary'}
              size="md"
              icon={CalendarSyncIcon}
              onClick={() => navigate('/profile')}
            >
              {isConnected ? 'Manage Sync' : 'Google Calendar Sync'}
            </Button>
          </div>
        </div>
      </div>

      {/* Just connected success banner */}
      {googleConnectedJustNow && (
        <Alert
          variant="success"
          onClose={() => setGoogleConnectedJustNow(false)}
          style={{ marginBottom: '16px' }}
        >
          <strong>Google Calendar connected successfully!</strong> Club events you're enrolled in will automatically sync to your Google Calendar.
        </Alert>
      )}

      {/* Google error banner */}
      {googleError && (
        <Alert
          variant="danger"
          onClose={() => setGoogleError(null)}
          style={{ marginBottom: '16px' }}
        >
          {googleError}
        </Alert>
      )}

      {error && <Alert variant="danger" onClose={() => setError(null)}>{error}</Alert>}

      {/* Google Calendar sync status banner */}
      <div
        className="card"
        style={{
          backgroundColor: isConnected ? 'var(--status-success-bg, #f0fdf4)' : 'var(--brand-subtle)',
          borderColor: isConnected ? 'var(--status-success-border, #86efac)' : 'var(--brand-border)',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: isConnected ? 'var(--status-success-text, #16a34a)' : 'var(--brand-primary)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {isConnected ? <CheckIcon size={16} /> : <CalendarSyncIcon size={16} />}
          </div>
          <div>
            {isConnected ? (
              <>
                <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--status-success-text, #16a34a)' }}>
                  Google Calendar is synced
                </p>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', opacity: 0.9 }}>
                  New club events are automatically added to your primary Google Calendar.
                  {googleStatus?.connectedAt && (
                    <> Connected {new Date(googleStatus.connectedAt).toLocaleDateString()}.</>
                  )}
                </p>
              </>
            ) : (
              <>
                <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--brand-fg)' }}>
                  Automated Google Calendar Synchronization
                </p>
                <p style={{ fontSize: '12px', color: 'var(--brand-fg)', opacity: 0.85 }}>
                  Connect your Google account to automatically add events for clubs you belong to.
                </p>
              </>
            )}
          </div>
        </div>
        {!isConnected && (
          <Button variant="outline" size="sm" onClick={() => navigate('/profile')}>
            Connect Now
          </Button>
        )}
      </div>

      {/* Filter and Search */}
      <div className="filter-bar">
        <div style={{ flex: '1 1 280px', maxWidth: '380px' }}>
          <Input
            id="event-search"
            placeholder="Search events by title or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={SearchIcon}
            style={{ marginBottom: 0 }}
          />
        </div>

        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
          <button
            type="button"
            className={`badge ${selectedClubId === 'All' ? 'badge-brand' : 'badge-neutral'}`}
            style={{ cursor: 'pointer', padding: '6px 12px', fontSize: '12px' }}
            onClick={() => setSelectedClubId('All')}
          >
            All Clubs
          </button>
          {clubs.map((c) => (
            <button
              key={c._id}
              type="button"
              className={`badge ${selectedClubId === c._id ? 'badge-brand' : 'badge-neutral'}`}
              style={{ cursor: 'pointer', padding: '6px 12px', fontSize: '12px' }}
              onClick={() => setSelectedClubId(c._id)}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid-2">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : filteredEvents.length === 0 ? (
        <EmptyState
          icon={EventsIcon}
          title="No campus events found"
          description={
            searchQuery || selectedClubId !== 'All'
              ? 'No scheduled events match your current filter criteria.'
              : 'No upcoming events have been scheduled yet.'
          }
          action={
            (searchQuery || selectedClubId !== 'All') ? (
              <Button
                variant="secondary"
                size="md"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedClubId('All');
                }}
              >
                Reset Filters
              </Button>
            ) : (
              <Button variant="primary" size="md" onClick={() => navigate('/clubs')}>
                Explore Clubs
              </Button>
            )
          }
        />
      ) : (
        <div className="grid-2">
          {filteredEvents.map((evt) => (
            <EventCard
              key={evt._id}
              event={evt}
              clubName={evt.clubName}
              onView={() => navigate(`/clubs/${evt.club}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
