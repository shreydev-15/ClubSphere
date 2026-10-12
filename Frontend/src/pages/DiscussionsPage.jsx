import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { clubsService } from '../services/clubs.service';
import { membershipsService } from '../services/memberships.service';
import { discussionsService } from '../services/discussions.service';
import { DiscussionCard } from '../components/discussions/DiscussionCard';
import { Input } from '../components/feedback/Input';
import { Button } from '../components/feedback/Button';
import { CardSkeleton } from '../components/feedback/Skeleton';
import { EmptyState } from '../components/feedback/EmptyState';
import { Alert } from '../components/feedback/Alert';
import { SearchIcon, DiscussionsIcon } from '../components/common/Icons';

export function DiscussionsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [discussions, setDiscussions] = useState([]);
  const [joinedClubs, setJoinedClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClubId, setSelectedClubId] = useState('All');

  useEffect(() => {
    let mounted = true;

    const loadDiscussions = async () => {
      try {
        setLoading(true);
        setError(null);

        const clubsRes = await clubsService.getAllClubs();
        const allClubs = clubsRes?.clubs || [];

        // Find joined clubs where user has membership
        const memberClubs = [];
        await Promise.all(
          allClubs.map(async (c) => {
            try {
              const membersRes = await membershipsService.getClubMembers(c._id);
              const isJoined = membersRes?.members?.some(
                (m) =>
                  m.user?._id === user?.id ||
                  m.user?._id === user?._id ||
                  m.user === user?.id
              );
              if (isJoined) {
                memberClubs.push(c);
              }
            } catch {
              // Ignore failures
            }
          })
        );

        if (!mounted) return;
        setJoinedClubs(memberClubs);

        // Fetch discussions from joined clubs
        const discPromises = memberClubs.map(async (c) => {
          try {
            const discRes = await discussionsService.getClubDiscussions(c._id);
            return (discRes?.discussions || []).map((d) => ({
              ...d,
              clubName: c.name,
            }));
          } catch {
            return [];
          }
        });

        const allDiscs = (await Promise.all(discPromises)).flat();
        allDiscs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        if (mounted) {
          setDiscussions(allDiscs);
        }
      } catch (err) {
        if (mounted) setError(err.message || 'Failed to fetch discussions');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    if (user) {
      loadDiscussions();
    }

    return () => {
      mounted = false;
    };
  }, [user]);

  const filteredDiscussions = useMemo(() => {
    return discussions.filter((d) => {
      const matchesSearch =
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesClub =
        selectedClubId === 'All' || d.club === selectedClubId;
      return matchesSearch && matchesClub;
    });
  }, [discussions, searchQuery, selectedClubId]);

  return (
    <div>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Club Discussions</h1>
            <p className="page-description">
              Participate in active discussions, announcements, and proposals across your campus clubs.
            </p>
          </div>
          <Button variant="secondary" size="md" onClick={() => navigate('/my-clubs')}>
            Browse My Clubs
          </Button>
        </div>
      </div>

      {error && <Alert variant="danger" onClose={() => setError(null)}>{error}</Alert>}

      {/* Filter and Search */}
      <div className="filter-bar">
        <div style={{ flex: '1 1 280px', maxWidth: '380px' }}>
          <Input
            id="disc-search"
            placeholder="Search discussions by topic or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={SearchIcon}
            style={{ marginBottom: 0 }}
          />
        </div>

        {joinedClubs.length > 0 && (
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
            <button
              type="button"
              className={`badge ${selectedClubId === 'All' ? 'badge-brand' : 'badge-neutral'}`}
              style={{ cursor: 'pointer', padding: '6px 12px', fontSize: '12px' }}
              onClick={() => setSelectedClubId('All')}
            >
              All My Clubs
            </button>
            {joinedClubs.map((c) => (
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
        )}
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : joinedClubs.length === 0 ? (
        <EmptyState
          icon={DiscussionsIcon}
          title="Join a club to participate in discussions"
          description="Club discussions are private to active members. Join clubs to view and post topics."
          action={
            <Button variant="primary" size="lg" onClick={() => navigate('/clubs')}>
              Explore Clubs
            </Button>
          }
        />
      ) : filteredDiscussions.length === 0 ? (
        <EmptyState
          icon={DiscussionsIcon}
          title="No discussions found"
          description={
            searchQuery || selectedClubId !== 'All'
              ? 'No topics match your current search filters.'
              : 'There are no active discussion topics in your clubs yet.'
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
            ) : null
          }
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredDiscussions.map((d) => (
            <DiscussionCard
              key={d._id}
              discussion={d}
              clubId={d.club}
              clubName={d.clubName}
            />
          ))}
        </div>
      )}
    </div>
  );
}
