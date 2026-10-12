import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { clubsService } from '../services/clubs.service';
import { membershipsService } from '../services/memberships.service';
import { ChatPanel } from '../components/chat/ChatPanel';
import { EmptyState } from '../components/feedback/EmptyState';
import { Button } from '../components/feedback/Button';
import { CardSkeleton } from '../components/feedback/Skeleton';
import { Alert } from '../components/feedback/Alert';
import { ChatIcon, ClubsIcon } from '../components/common/Icons';

export function ChatPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [joinedClubs, setJoinedClubs] = useState([]);
  const [selectedClub, setSelectedClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const queryClubId = searchParams.get('clubId');

  useEffect(() => {
    let mounted = true;

    const fetchUserClubs = async () => {
      try {
        setLoading(true);
        setError(null);

        const clubsRes = await clubsService.getAllClubs();
        const allClubs = clubsRes?.clubs || [];

        const myClubs = [];
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
                myClubs.push(c);
              }
            } catch {
              // Ignore failures
            }
          })
        );

        if (!mounted) return;
        setJoinedClubs(myClubs);

        // Pick selected club
        if (myClubs.length > 0) {
          if (queryClubId) {
            const matched = myClubs.find((c) => c._id === queryClubId);
            setSelectedClub(matched || myClubs[0]);
          } else {
            setSelectedClub(myClubs[0]);
          }
        }
      } catch (err) {
        if (mounted) setError(err.message || 'Failed to fetch clubs for chat');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    if (user) {
      fetchUserClubs();
    }

    return () => {
      mounted = false;
    };
  }, [user, queryClubId]);

  const handleSelectClub = (club) => {
    setSelectedClub(club);
    setSearchParams({ clubId: club._id });
  };

  if (loading) {
    return (
      <div>
        <CardSkeleton />
      </div>
    );
  }

  if (joinedClubs.length === 0) {
    return (
      <div>
        <div className="page-header">
          <h1 className="page-title">Real-Time Club Chat</h1>
          <p className="page-description">
            Coordinate in real time with fellow members of your campus clubs.
          </p>
        </div>

        <EmptyState
          icon={ChatIcon}
          title="No club chat rooms available"
          description="You need to be an active member of at least one club to participate in real-time chat channels."
          action={
            <Button variant="primary" size="lg" onClick={() => navigate('/clubs')}>
              Explore &amp; Join Clubs
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div>
      <div className="page-header" style={{ marginBottom: '16px' }}>
        <h1 className="page-title">Real-Time Club Chat</h1>
        <p className="page-description">
          Instant messaging channels for your verified campus club communities.
        </p>
      </div>

      {error && <Alert variant="danger" onClose={() => setError(null)}>{error}</Alert>}

      <div className="chat-container">
        {/* Left pane: Club Channels */}
        <div className="chat-sidebar">
          <div className="chat-sidebar-header">
            <span>Your Club Channels ({joinedClubs.length})</span>
          </div>
          <div className="chat-club-list">
            {joinedClubs.map((club) => {
              const isSelected = selectedClub?._id === club._id;
              return (
                <div
                  key={club._id}
                  className={`chat-club-item ${isSelected ? 'active' : ''}`}
                  onClick={() => handleSelectClub(club)}
                >
                  <span className="chat-club-name">#{club.name}</span>
                  <span className="chat-club-category">{club.category}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right pane: Chat Messages and Composer */}
        <ChatPanel club={selectedClub} isMember={true} />
      </div>
    </div>
  );
}
