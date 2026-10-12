import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { clubsService } from '../services/clubs.service';
import { membershipsService } from '../services/memberships.service';
import { ClubCard } from '../components/clubs/ClubCard';
import { CreateClubModal } from '../components/clubs/CreateClubModal';
import { Button } from '../components/feedback/Button';
import { Input } from '../components/feedback/Input';
import { Alert } from '../components/feedback/Alert';
import { CardSkeleton } from '../components/feedback/Skeleton';
import { EmptyState } from '../components/feedback/EmptyState';
import { PlusIcon, SearchIcon, ClubsIcon } from '../components/common/Icons';

export function ExploreClubsPage() {
  const { user, isAdmin } = useAuth();

  const [clubs, setClubs] = useState([]);
  const [membershipMap, setMembershipMap] = useState({}); // { [clubId]: { isMember: boolean, role: string } }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [actionClubId, setActionClubId] = useState(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchClubsAndMemberships = async () => {
    try {
      setLoading(true);
      setError(null);

      const clubsRes = await clubsService.getAllClubs();
      const clubList = clubsRes?.clubs || [];
      setClubs(clubList);

      // Check memberships for current user
      const map = {};
      await Promise.all(
        clubList.map(async (c) => {
          try {
            const memberRes = await membershipsService.getClubMembers(c._id);
            const myMembership = memberRes?.members?.find(
              (m) =>
                m.user?._id === user?.id ||
                m.user?._id === user?._id ||
                m.user === user?.id
            );
            if (myMembership) {
              map[c._id] = { isMember: true, role: myMembership.role };
            } else {
              map[c._id] = { isMember: false, role: null };
            }
          } catch {
            map[c._id] = { isMember: false, role: null };
          }
        })
      );
      setMembershipMap(map);
    } catch (err) {
      setError(err.message || 'Failed to fetch campus clubs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchClubsAndMemberships();
    }
  }, [user]);

  const handleJoinClub = async (clubId) => {
    if (actionClubId) return;
    try {
      setActionClubId(clubId);
      setError(null);
      await membershipsService.joinClub(clubId);
      setMembershipMap((prev) => ({
        ...prev,
        [clubId]: { isMember: true, role: 'member' },
      }));
      setSuccessMsg('Successfully joined the club!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setError(err.message || 'Failed to join club');
    } finally {
      setActionClubId(null);
    }
  };

  const handleLeaveClub = async (clubId) => {
    if (actionClubId) return;
    try {
      setActionClubId(clubId);
      setError(null);
      await membershipsService.leaveClub(clubId);
      setMembershipMap((prev) => ({
        ...prev,
        [clubId]: { isMember: false, role: null },
      }));
      setSuccessMsg('Successfully left the club.');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setError(err.message || 'Failed to leave club');
    } finally {
      setActionClubId(null);
    }
  };

  const handleCreateClub = async (clubData) => {
    await clubsService.createClub(clubData);
    setSuccessMsg('Club registered successfully!');
    setTimeout(() => setSuccessMsg(null), 3000);
    fetchClubsAndMemberships();
  };

  // Derive available categories
  const categories = useMemo(() => {
    const set = new Set(clubs.map((c) => c.category));
    return ['All', ...Array.from(set)];
  }, [clubs]);

  // Filter clubs by query & category
  const filteredClubs = useMemo(() => {
    return clubs.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'All' || c.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [clubs, searchQuery, selectedCategory]);

  return (
    <div>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Explore Campus Clubs</h1>
            <p className="page-description">
              Discover official student clubs, connect with members, and participate in campus activities.
            </p>
          </div>
          {isAdmin && (
            <Button
              variant="primary"
              size="md"
              icon={PlusIcon}
              onClick={() => setIsCreateModalOpen(true)}
            >
              Create Club
            </Button>
          )}
        </div>
      </div>

      {error && <Alert variant="danger" onClose={() => setError(null)}>{error}</Alert>}
      {successMsg && <Alert variant="success" onClose={() => setSuccessMsg(null)}>{successMsg}</Alert>}

      {/* Filter and Search Bar */}
      <div className="filter-bar">
        <div style={{ flex: '1 1 280px', maxWidth: '400px' }}>
          <Input
            id="club-search"
            placeholder="Search clubs by name or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={SearchIcon}
            style={{ marginBottom: 0 }}
          />
        </div>

        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`badge ${selectedCategory === cat ? 'badge-brand' : 'badge-neutral'}`}
              style={{ cursor: 'pointer', padding: '6px 12px', fontSize: '12px' }}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid-3">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : filteredClubs.length === 0 ? (
        <EmptyState
          icon={ClubsIcon}
          title="No clubs found"
          description={
            searchQuery || selectedCategory !== 'All'
              ? 'No clubs matched your search criteria. Try a different search term or category.'
              : 'No campus clubs are currently active. Be the first to start one!'
          }
          action={
            (searchQuery || selectedCategory !== 'All') ? (
              <Button
                variant="secondary"
                size="md"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
              >
                Clear Filters
              </Button>
            ) : isAdmin ? (
              <Button
                variant="primary"
                size="md"
                icon={PlusIcon}
                onClick={() => setIsCreateModalOpen(true)}
              >
                Create First Club
              </Button>
            ) : null
          }
        />
      ) : (
        <div className="grid-3">
          {filteredClubs.map((club) => {
            const memberInfo = membershipMap[club._id];
            const isMember = memberInfo?.isMember || false;
            const isClubAdmin = memberInfo?.role === 'clubAdmin';

            return (
              <ClubCard
                key={club._id}
                club={club}
                isMember={isMember}
                isAdmin={isClubAdmin}
                onJoin={handleJoinClub}
                onLeave={handleLeaveClub}
                actionLoading={actionClubId === club._id}
              />
            );
          })}
        </div>
      )}

      {/* Admin Create Club Modal */}
      {isAdmin && (
        <CreateClubModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handleCreateClub}
        />
      )}
    </div>
  );
}
