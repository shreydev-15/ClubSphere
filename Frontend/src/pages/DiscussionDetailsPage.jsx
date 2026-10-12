import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { discussionsService } from '../services/discussions.service';
import { repliesService } from '../services/replies.service';
import { clubsService } from '../services/clubs.service';
import { Button } from '../components/feedback/Button';
import { Textarea } from '../components/feedback/Textarea';
import { Alert } from '../components/feedback/Alert';
import { CardSkeleton } from '../components/feedback/Skeleton';
import { BackIcon, SendIcon } from '../components/common/Icons';

export function DiscussionDetailsPage() {
  const { clubId, discussionId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [club, setClub] = useState(null);
  const [discussion, setDiscussion] = useState(null);
  const [replies, setReplies] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch club info, discussion details, and replies in parallel
      const [clubRes, discRes, repliesRes] = await Promise.all([
        clubsService.getClubById(clubId),
        discussionsService.getDiscussionById(clubId, discussionId),
        repliesService.getDiscussionReplies(clubId, discussionId),
      ]);

      setClub(clubRes?.club || null);
      setDiscussion(discRes?.discussion || null);
      setReplies(repliesRes?.replies || []);
    } catch (err) {
      setError(err.message || 'Failed to load discussion topic or replies');
    } finally {
      setLoading(false);
    }
  }, [clubId, discussionId]);

  useEffect(() => {
    if (clubId && discussionId) {
      fetchData();
    }
  }, [clubId, discussionId, fetchData]);

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    const trimmed = replyText.trim();
    if (!trimmed || submitting) return;

    try {
      setSubmitting(true);
      setError(null);
      await repliesService.createReply(clubId, discussionId, { content: trimmed });
      setReplyText('');
      setSuccessMsg('Reply posted.');
      setTimeout(() => setSuccessMsg(null), 3000);

      // Refresh replies
      const repliesRes = await repliesService.getDiscussionReplies(clubId, discussionId);
      setReplies(repliesRes?.replies || []);
    } catch (err) {
      setError(err.message || 'Failed to submit reply');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div>
        <CardSkeleton />
      </div>
    );
  }

  if (!discussion) {
    return (
      <div>
        <Alert variant="danger">Discussion topic not found or access denied.</Alert>
        <Button variant="secondary" onClick={() => navigate(`/clubs/${clubId}`)}>
          Back to Club
        </Button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto' }}>
      {/* Back button */}
      <button
        type="button"
        className="btn btn-ghost btn-sm"
        style={{ marginBottom: '16px', paddingLeft: 0 }}
        onClick={() => navigate(`/clubs/${clubId}`)}
      >
        <BackIcon size={14} />
        <span>Back to {club?.name || 'Club'}</span>
      </button>

      {error && <Alert variant="danger" onClose={() => setError(null)}>{error}</Alert>}
      {successMsg && <Alert variant="success" onClose={() => setSuccessMsg(null)}>{successMsg}</Alert>}

      {/* Main Discussion Topic Card */}
      <div className="card" style={{ padding: '28px', marginBottom: '24px' }}>
        <div style={{ marginBottom: '16px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--brand-primary)' }}>
            {club?.name}
          </span>
          <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
            {discussion.title}
          </h1>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Posted by {discussion.createdBy?.fullname?.firstname} {discussion.createdBy?.fullname?.lastname} &bull; {formatDate(discussion.createdAt)}
          </p>
        </div>

        <div
          style={{
            fontSize: 'var(--text-base)',
            color: 'var(--text-primary)',
            lineHeight: 1.6,
            whiteSpace: 'pre-wrap',
            paddingTop: '16px',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          {discussion.content}
        </div>
      </div>

      {/* Replies Thread Section */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: 'var(--text-md)', fontWeight: 600, marginBottom: '16px' }}>
          Member Replies ({replies.length})
        </h2>

        {replies.length === 0 ? (
          <div
            className="card"
            style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--text-muted)', marginBottom: '24px' }}
          >
            <p style={{ fontSize: 'var(--text-sm)' }}>
              No replies to this topic yet. Share your thoughts below.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
            {replies.map((reply) => {
              const isOwn =
                reply.createdBy?._id === user?.id ||
                reply.createdBy === user?.id ||
                reply.createdBy?._id === user?._id;

              return (
                <div
                  key={reply._id}
                  className="card"
                  style={{
                    padding: '16px 20px',
                    backgroundColor: isOwn ? 'var(--brand-subtle)' : 'var(--bg-surface)',
                    borderColor: isOwn ? 'var(--brand-border)' : 'var(--border-subtle)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '8px',
                    }}
                  >
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {reply.createdBy?.fullname?.firstname} {reply.createdBy?.fullname?.lastname}{' '}
                      {isOwn && <span style={{ fontSize: '11px', color: 'var(--brand-primary)' }}>(You)</span>}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {formatDate(reply.createdAt)}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: 'var(--text-sm)',
                      color: 'var(--text-primary)',
                      lineHeight: 1.5,
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {reply.content}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* Reply Submission Form */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 600, marginBottom: '12px' }}>
            Contribute to this discussion
          </h3>
          <form onSubmit={handleReplySubmit}>
            <Textarea
              id="reply-content"
              placeholder="Write a constructive response, ask questions, or provide feedback..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              required
              rows={4}
              maxLength={2000}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
              <Button
                type="submit"
                variant="primary"
                size="md"
                loading={submitting}
                disabled={!replyText.trim() || submitting}
                icon={SendIcon}
              >
                Post Reply
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
