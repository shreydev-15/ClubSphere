import { useState, useEffect, useRef, useCallback } from 'react';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../feedback/Button';
import { Alert } from '../feedback/Alert';
import { Skeleton } from '../feedback/Skeleton';
import { SendIcon } from '../common/Icons';

export function ChatPanel({
  club,
  isMember,
}) {
  const { user } = useAuth();
  const {
    connected,
    connectionError,
    joinClub,
    leaveClub,
    sendMessage,
    fetchHistory,
    onNewMessage,
  } = useSocket();

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const messagesEndRef = useRef(null);
  const chatScrollContainerRef = useRef(null);
  const currentClubIdRef = useRef(null);

  const scrollToBottom = useCallback((smooth = true) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: smooth ? 'smooth' : 'auto',
      });
    }
  }, []);

  // Join club chat and load initial history
  useEffect(() => {
    if (!club?._id || !connected) {
      setHasJoined(false);
      setMessages([]);
      return;
    }

    if (!isMember) {
      setHasJoined(false);
      setError('You must be a member of this club to participate in the chat.');
      return;
    }

    let isSubscribed = true;
    currentClubIdRef.current = club._id;
    setError(null);
    setLoadingHistory(true);

    const initChat = async () => {
      try {
        // 1. Join club room
        await joinClub(club._id);
        if (!isSubscribed) return;
        setHasJoined(true);

        // 2. Load message history
        const historyRes = await fetchHistory(club._id, 50);
        if (isSubscribed && historyRes?.messages) {
          setMessages(historyRes.messages);
          if (historyRes.messages.length < 50) {
            setHasMore(false);
          }
          setTimeout(() => scrollToBottom(false), 50);
        }
      } catch (err) {
        if (isSubscribed) {
          setError(err.message || 'Failed to connect to club chat.');
          setHasJoined(false);
        }
      } finally {
        if (isSubscribed) setLoadingHistory(false);
      }
    };

    initChat();

    // Cleanup on club switch or unmount
    return () => {
      isSubscribed = false;
      if (currentClubIdRef.current) {
        leaveClub(currentClubIdRef.current);
      }
    };
  }, [club?._id, connected, isMember, joinClub, leaveClub, fetchHistory, scrollToBottom]);

  // Listen for real-time messages
  useEffect(() => {
    if (!hasJoined || !club?._id) return;

    const unsubscribe = onNewMessage((newMessage) => {
      if (!newMessage || newMessage.club !== club._id) return;

      setMessages((prev) => {
        // Deduplicate incoming message by _id
        const exists = prev.some((m) => m._id === newMessage._id);
        if (exists) return prev;
        return [...prev, newMessage];
      });

      setTimeout(() => scrollToBottom(true), 50);
    });

    return unsubscribe;
  }, [hasJoined, club?._id, onNewMessage, scrollToBottom]);

  // Handle message sending
  const handleSend = async (e) => {
    if (e) e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed || sending || !hasJoined) return;

    if (trimmed.length > 2000) {
      setError('Message cannot exceed 2000 characters.');
      return;
    }

    try {
      setSending(true);
      setError(null);
      const res = await sendMessage(club._id, trimmed);
      setInputText('');

      // If backend returned the created message, ensure it's in the list safely
      if (res?.data) {
        setMessages((prev) => {
          const exists = prev.some((m) => m._id === res.data._id);
          if (exists) return prev;
          return [...prev, res.data];
        });
        setTimeout(() => scrollToBottom(true), 50);
      }
    } catch (err) {
      setError(err.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  // Load older messages (pagination)
  const handleLoadOlder = async () => {
    if (loadingOlder || !hasMore || messages.length === 0) return;

    const oldestMessage = messages[0];
    if (!oldestMessage?._id) return;

    try {
      setLoadingOlder(true);
      const res = await fetchHistory(club._id, 30, oldestMessage._id);
      if (res?.messages) {
        if (res.messages.length < 30) {
          setHasMore(false);
        }
        setMessages((prev) => [...res.messages, ...prev]);
      }
    } catch (err) {
      console.error('Failed to load older messages:', err);
    } finally {
      setLoadingOlder(false);
    }
  };

  const formatMessageTime = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  if (!club) {
    return (
      <div className="chat-main" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Select a club to join the conversation.</p>
      </div>
    );
  }

  return (
    <div className="chat-main">
      <div className="chat-header">
        <div>
          <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text-primary)' }}>
            #{club.name}
          </h3>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            {club.category} &bull; {connected ? 'Online' : 'Reconnecting...'}
          </p>
        </div>
      </div>

      {error && (
        <div style={{ padding: '8px 16px' }}>
          <Alert variant="danger" onClose={() => setError(null)}>{error}</Alert>
        </div>
      )}

      {connectionError && (
        <div style={{ padding: '8px 16px' }}>
          <Alert variant="warning">Real-time connection interrupted. Reconnecting...</Alert>
        </div>
      )}

      <div className="chat-messages" ref={chatScrollContainerRef}>
        {hasMore && messages.length >= 50 && (
          <div style={{ textAlign: 'center', margin: '8px 0' }}>
            <Button
              variant="ghost"
              size="sm"
              loading={loadingOlder}
              onClick={handleLoadOlder}
            >
              Load previous messages
            </Button>
          </div>
        )}

        {loadingHistory ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Skeleton height="36px" width="60%" />
            <Skeleton height="44px" width="45%" style={{ alignSelf: 'flex-end' }} />
            <Skeleton height="36px" width="70%" />
          </div>
        ) : messages.length === 0 ? (
          <div style={{ textAlign: 'center', margin: 'auto', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>
              No messages in this channel yet.
            </p>
            <p style={{ fontSize: '12px' }}>
              Say hello and start coordinating with your fellow club members!
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isOwn =
              msg.sender?._id === user?.id ||
              msg.sender === user?.id ||
              msg.sender?._id === user?._id;

            const senderName =
              msg.sender?.fullname
                ? `${msg.sender.fullname.firstname} ${msg.sender.fullname.lastname || ''}`.trim()
                : isOwn
                ? 'You'
                : 'Member';

            return (
              <div
                key={msg._id}
                className={`message-item ${isOwn ? 'own' : 'other'}`}
              >
                {!isOwn && <span className="message-sender">{senderName}</span>}
                <div className="message-bubble">{msg.content}</div>
                <span className="message-time">{formatMessageTime(msg.createdAt)}</span>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-area" onSubmit={handleSend}>
        <input
          type="text"
          className="chat-input"
          placeholder={
            !isMember
              ? 'Join this club to send messages...'
              : !hasJoined
              ? 'Connecting to chat...'
              : 'Write a message... (Press Enter to send)'
          }
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={!isMember || !hasJoined || sending}
          maxLength={2000}
        />
        <Button
          variant="primary"
          size="md"
          type="submit"
          disabled={!inputText.trim() || !isMember || !hasJoined || sending}
          loading={sending}
          icon={SendIcon}
        >
          Send
        </Button>
      </form>
    </div>
  );
}
