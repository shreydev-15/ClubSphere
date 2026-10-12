import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { clubsService } from '../services/clubs.service';
import { membershipsService } from '../services/memberships.service';
import { eventsService } from '../services/events.service';
import { discussionsService } from '../services/discussions.service';
import { Button } from '../components/feedback/Button';
import { Badge } from '../components/feedback/Badge';
import { Alert } from '../components/feedback/Alert';
import { Modal } from '../components/feedback/Modal';
import { Input } from '../components/feedback/Input';
import { Textarea } from '../components/feedback/Textarea';
import { CardSkeleton } from '../components/feedback/Skeleton';
import { EventCard } from '../components/events/EventCard';
import { CreateEventModal } from '../components/events/CreateEventModal';
import { DiscussionCard } from '../components/discussions/DiscussionCard';
import { CreateDiscussionModal } from '../components/discussions/CreateDiscussionModal';
import { ChatPanel } from '../components/chat/ChatPanel';
import {
  ClubsIcon,
  EventsIcon,
  DiscussionsIcon,
  ChatIcon,
  PlusIcon,
  TrashIcon,
  EditIcon,
  BackIcon,
} from '../components/common/Icons';

export function ClubDetailsPage() {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [club, setClub] = useState(null);
  const [members, setMembers] = useState([]);
  const [events, setEvents] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const [myMembership, setMyMembership] = useState(null);

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'events' | 'discussions' | 'members' | 'chat'
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Modals
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isDiscussionModalOpen, setIsDiscussionModalOpen] = useState(false);
  const [isEditClubModalOpen, setIsEditClubModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Edit club state
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCategory, setEditCategory] = useState('');

  const isMember = !!myMembership;
  const isClubAdmin = myMembership?.role === 'clubAdmin';

  const fetchClubDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Fetch Club Info
      const clubRes = await clubsService.getClubById(clubId);
      const clubData = clubRes?.club;
      setClub(clubData);
      if (clubData) {
        setEditName(clubData.name);
        setEditDescription(clubData.description);
        setEditCategory(clubData.category);
      }

      // 2. Fetch Members
      const membersRes = await membershipsService.getClubMembers(clubId);
      const memberList = membersRes?.members || [];
      setMembers(memberList);

      const foundMembership = memberList.find(
        (m) =>
          m.user?._id === user?.id ||
          m.user?._id === user?._id ||
          m.user === user?.id
      );
      setMyMembership(foundMembership || null);

      // 3. Fetch Events
      const eventsRes = await eventsService.getClubEvents(clubId);
      setEvents(eventsRes?.events || []);

      // 4. Fetch Discussions (only accessible to club members)
      if (foundMembership) {
        try {
          const discRes = await discussionsService.getClubDiscussions(clubId);
          setDiscussions(discRes?.discussions || []);
        } catch {
          setDiscussions([]);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to load club details');
    } finally {
      setLoading(false);
    }
  }, [clubId, user]);

  useEffect(() => {
    if (clubId && user) {
      fetchClubDetails();
    }
  }, [clubId, user, fetchClubDetails]);

  const handleJoinClub = async () => {
    try {
      setActionLoading(true);
      setError(null);
      await membershipsService.joinClub(clubId);
      setSuccessMsg('You have joined this club!');
      setTimeout(() => setSuccessMsg(null), 3000);
      fetchClubDetails();
    } catch (err) {
      setError(err.message || 'Failed to join club');
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeaveClub = async () => {
    try {
      setActionLoading(true);
      setError(null);
      await membershipsService.leaveClub(clubId);
      setSuccessMsg('You have left the club.');
      setTimeout(() => setSuccessMsg(null), 3000);
      fetchClubDetails();
    } catch (err) {
      setError(err.message || 'Failed to leave club');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateEvent = async (eventData) => {
    await eventsService.createEvent(clubId, eventData);
    setSuccessMsg('Event created and dispatched to calendar!');
    setTimeout(() => setSuccessMsg(null), 3000);
    const eventsRes = await eventsService.getClubEvents(clubId);
    setEvents(eventsRes?.events || []);
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await eventsService.deleteEvent(clubId, eventId);
      setSuccessMsg('Event deleted.');
      setTimeout(() => setSuccessMsg(null), 3000);
      setEvents((prev) => prev.filter((e) => e._id !== eventId));
    } catch (err) {
      setError(err.message || 'Failed to delete event');
    }
  };

  const handleCreateDiscussion = async (discussionData) => {
    await discussionsService.createDiscussion(clubId, discussionData);
    setSuccessMsg('Discussion topic posted!');
    setTimeout(() => setSuccessMsg(null), 3000);
    const discRes = await discussionsService.getClubDiscussions(clubId);
    setDiscussions(discRes?.discussions || []);
  };

  const handleUpdateClub = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      await clubsService.updateClub(clubId, {
        name: editName,
        description: editDescription,
        category: editCategory,
      });
      setSuccessMsg('Club details updated.');
      setIsEditClubModalOpen(false);
      fetchClubDetails();
    } catch (err) {
      setError(err.message || 'Failed to update club');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteClub = async () => {
    try {
      setActionLoading(true);
      await clubsService.deleteClub(clubId);
      navigate('/clubs');
    } catch (err) {
      setError(err.message || 'Failed to delete club');
      setIsDeleteModalOpen(false);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <CardSkeleton />
      </div>
    );
  }

  if (!club) {
    return (
      <div>
        <Alert variant="danger">Club not found.</Alert>
        <Button variant="secondary" onClick={() => navigate('/clubs')}>
          Back to Clubs
        </Button>
      </div>
    );
  }

  return (
    <div>
      {/* Back button */}
      <button
        type="button"
        className="btn btn-ghost btn-sm"
        style={{ marginBottom: '16px', paddingLeft: 0 }}
        onClick={() => navigate('/clubs')}
      >
        <BackIcon size={14} />
        <span>Back to Explore Clubs</span>
      </button>

      {/* Club Header Banner */}
      <div
        className="card"
        style={{
          padding: '28px',
          marginBottom: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Badge variant="brand" size="md">
                {club.category}
              </Badge>
              {isClubAdmin && <Badge variant="warning" size="xs">Club Admin</Badge>}
              {!isClubAdmin && isMember && <Badge variant="success" size="xs">Member</Badge>}
            </div>
            <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--text-primary)' }}>
              {club.name}
            </h1>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: '4px' }}>
              Founded by {club.createdBy?.fullname?.firstname} {club.createdBy?.fullname?.lastname} &bull; {members.length} student {members.length === 1 ? 'member' : 'members'}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isMember ? (
              <Button
                variant="outline"
                size="md"
                loading={actionLoading}
                onClick={handleLeaveClub}
              >
                Leave Club
              </Button>
            ) : (
              <Button
                variant="primary"
                size="md"
                loading={actionLoading}
                onClick={handleJoinClub}
              >
                Join Club
              </Button>
            )}

            {isClubAdmin && (
              <>
                <Button
                  variant="secondary"
                  size="md"
                  icon={EditIcon}
                  onClick={() => setIsEditClubModalOpen(true)}
                >
                  Edit Club
                </Button>
                <Button
                  variant="danger"
                  size="md"
                  icon={TrashIcon}
                  onClick={() => setIsDeleteModalOpen(true)}
                >
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {error && <Alert variant="danger" onClose={() => setError(null)}>{error}</Alert>}
      {successMsg && <Alert variant="success" onClose={() => setSuccessMsg(null)}>{successMsg}</Alert>}

      {/* Tabs navigation */}
      <div className="tab-nav">
        <button
          type="button"
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          Events ({events.length})
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'discussions' ? 'active' : ''}`}
          onClick={() => setActiveTab('discussions')}
        >
          Discussions ({discussions.length})
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'members' ? 'active' : ''}`}
          onClick={() => setActiveTab('members')}
        >
          Members ({members.length})
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          Live Chat
        </button>
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="grid-2">
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 600 }}>About This Club</h2>
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
              {club.description}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="card">
              <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 600, marginBottom: '12px' }}>
                Quick Actions
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Button
                  variant="secondary"
                  size="md"
                  icon={ChatIcon}
                  onClick={() => setActiveTab('chat')}
                >
                  Join Real-Time Chat
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  icon={EventsIcon}
                  onClick={() => setActiveTab('events')}
                >
                  Browse Club Events
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  icon={DiscussionsIcon}
                  onClick={() => setActiveTab('discussions')}
                >
                  View Discussion Topics
                </Button>
              </div>
            </div>

            <div className="card">
              <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 600, marginBottom: '8px' }}>
                Leadership &amp; Roster
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                Lead Organizer: {club.createdBy?.fullname?.firstname} {club.createdBy?.fullname?.lastname}
              </p>
              <Button variant="outline" size="sm" onClick={() => setActiveTab('members')}>
                View all {members.length} members &rarr;
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Events */}
      {activeTab === 'events' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 600 }}>Club Events</h2>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                Workshops, meetups, and general body meetings. Synced with Google Calendar.
              </p>
            </div>
            {isClubAdmin && (
              <Button
                variant="primary"
                size="md"
                icon={PlusIcon}
                onClick={() => setIsEventModalOpen(true)}
              >
                Create Event
              </Button>
            )}
          </div>

          {events.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '48px 16px' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
                No events currently scheduled for this club.
              </p>
              {isClubAdmin && (
                <Button
                  variant="primary"
                  size="md"
                  icon={PlusIcon}
                  style={{ marginTop: '16px' }}
                  onClick={() => setIsEventModalOpen(true)}
                >
                  Schedule First Event
                </Button>
              )}
            </div>
          ) : (
            <div className="grid-2">
              {events.map((evt) => (
                <EventCard
                  key={evt._id}
                  event={evt}
                  isClubAdmin={isClubAdmin}
                  onDelete={handleDeleteEvent}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Discussions */}
      {activeTab === 'discussions' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 600 }}>Discussion Threads</h2>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                Important announcements, feedback topics, and ideas proposed by club administrators.
              </p>
            </div>
            {isClubAdmin && (
              <Button
                variant="primary"
                size="md"
                icon={PlusIcon}
                onClick={() => setIsDiscussionModalOpen(true)}
              >
                New Discussion
              </Button>
            )}
          </div>

          {!isMember ? (
            <div className="card" style={{ textAlign: 'center', padding: '40px 16px' }}>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Club discussions are restricted to active club members.
              </p>
              <Button variant="primary" size="md" onClick={handleJoinClub}>
                Join Club to View Discussions
              </Button>
            </div>
          ) : discussions.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '48px 16px' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
                No discussions started yet in this club.
              </p>
              {isClubAdmin && (
                <Button
                  variant="primary"
                  size="md"
                  icon={PlusIcon}
                  style={{ marginTop: '16px' }}
                  onClick={() => setIsDiscussionModalOpen(true)}
                >
                  Start First Discussion
                </Button>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {discussions.map((disc) => (
                <DiscussionCard
                  key={disc._id}
                  discussion={disc}
                  clubId={clubId}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Members */}
      {activeTab === 'members' && (
        <div className="card">
          <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: '16px' }}>
            Active Club Members ({members.length})
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {members.map((m) => (
              <div
                key={m._id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
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
        </div>
      )}

      {/* Tab: Live Chat */}
      {activeTab === 'chat' && (
        <div style={{ height: '620px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
          <ChatPanel club={club} isMember={isMember} />
        </div>
      )}

      {/* Create Event Modal */}
      {isClubAdmin && (
        <CreateEventModal
          isOpen={isEventModalOpen}
          onClose={() => setIsEventModalOpen(false)}
          clubId={clubId}
          clubName={club.name}
          onSuccess={handleCreateEvent}
        />
      )}

      {/* Create Discussion Modal */}
      {isClubAdmin && (
        <CreateDiscussionModal
          isOpen={isDiscussionModalOpen}
          onClose={() => setIsDiscussionModalOpen(false)}
          clubId={clubId}
          clubName={club.name}
          onSuccess={handleCreateDiscussion}
        />
      )}

      {/* Edit Club Modal */}
      {isClubAdmin && (
        <Modal
          isOpen={isEditClubModalOpen}
          onClose={() => setIsEditClubModalOpen(false)}
          title="Edit Club Details"
          description="Update basic information about this club."
        >
          <form onSubmit={handleUpdateClub}>
            <Input
              id="edit-club-name"
              label="Club Name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              required
            />
            <Input
              id="edit-club-cat"
              label="Category"
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
              required
            />
            <Textarea
              id="edit-club-desc"
              label="Description"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              required
              rows={4}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
              <Button variant="secondary" onClick={() => setIsEditClubModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" loading={actionLoading}>
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Club Confirmation Modal */}
      {isClubAdmin && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Delete Club"
          description="Are you sure you want to delete this club? This action removes all club memberships, discussions, and events permanently."
        >
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
            <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteClub} loading={actionLoading}>
              Permanently Delete
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
