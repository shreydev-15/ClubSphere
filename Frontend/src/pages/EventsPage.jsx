import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { clubsService } from '../services/clubs.service';
import { eventsService } from '../services/events.service';
import { EventCard } from '../components/events/EventCard';
import { Input } from '../components/feedback/Input';
import { Button } from '../components/feedback/Button';
import { Badge } from '../components/feedback/Badge';
import { CardSkeleton } from '../components/feedback/Skeleton';
import { EmptyState } from '../components/feedback/EmptyState';
import { Alert } from '../components/feedback/Alert';
import { SearchIcon, EventsIcon, CalendarSyncIcon } from '../components/common/Icons';

export function EventsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [clubs, setClubs] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClubId, setSelectedClubId] = useState('All');

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
          <Button
            variant="secondary"
            size="md"
            icon={CalendarSyncIcon}
            onClick={() => navigate('/profile')}
          >
            Google Calendar Sync Status
          </Button>
        </div>
      </div>

      {error && <Alert variant="danger" onClose={() => setError(null)}>{error}</Alert>}

      {/* Calendar Notice Banner */}
      <div
        className="card"
        style={{
          backgroundColor: 'var(--brand-subtle)',
          borderColor: 'var(--brand-border)',
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
              backgroundColor: 'var(--brand-primary)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CalendarSyncIcon size={16} />
          </div>
          <div>
            <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--brand-fg)' }}>
              Automated Google Calendar Synchronization
            </p>
            <p style={{ fontSize: '12px', color: 'var(--brand-fg)', opacity: 0.85 }}>
              Connect your Google account in Settings to automatically add events for any club you belong to directly to your primary calendar.
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate('/profile')}>
          Manage Integration
        </Button>
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
