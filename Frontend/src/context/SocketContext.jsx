import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

const SOCKET_SERVER_URL = (import.meta.env.VITE_SOCKET_URL || '').replace(/\/+$/, '');

export function SocketProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setConnected(false);
      }
      return;
    }

    // Connect to Socket.IO with credentials (cookies)
    const socket = io(SOCKET_SERVER_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      setConnectionError(null);
    });

    socket.on('connect_error', (err) => {
      setConnected(false);
      setConnectionError(err.message || 'Socket connection failed');
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setConnected(false);
    };
  }, [isAuthenticated]);

  const joinClub = useCallback((clubId) => {
    return new Promise((resolve, reject) => {
      if (!socketRef.current || !socketRef.current.connected) {
        return reject(new Error('Real-time connection is not active'));
      }
      socketRef.current.emit('club:join', clubId, (response) => {
        if (response?.success) {
          resolve(response);
        } else {
          reject(new Error(response?.message || 'Failed to join club chat'));
        }
      });
    });
  }, []);

  const leaveClub = useCallback((clubId) => {
    return new Promise((resolve) => {
      if (!socketRef.current || !socketRef.current.connected) {
        return resolve({ success: true });
      }
      socketRef.current.emit('club:leave', clubId, (response) => {
        resolve(response || { success: true });
      });
    });
  }, []);

  const sendMessage = useCallback((clubId, content) => {
    return new Promise((resolve, reject) => {
      if (!socketRef.current || !socketRef.current.connected) {
        return reject(new Error('Cannot send message: not connected'));
      }
      socketRef.current.emit('message:send', { clubId, content }, (response) => {
        if (response?.success) {
          resolve(response);
        } else {
          reject(new Error(response?.message || 'Failed to send message'));
        }
      });
    });
  }, []);

  const fetchHistory = useCallback((clubId, limit = 50, before = null) => {
    return new Promise((resolve, reject) => {
      if (!socketRef.current || !socketRef.current.connected) {
        return reject(new Error('Cannot load history: not connected'));
      }
      const payload = { clubId, limit };
      if (before) payload.before = before;

      socketRef.current.emit('message:history', payload, (response) => {
        if (response?.success) {
          resolve(response);
        } else {
          reject(new Error(response?.message || 'Failed to fetch messages'));
        }
      });
    });
  }, []);

  const onNewMessage = useCallback((handler) => {
    const socket = socketRef.current;
    if (!socket) return () => {};

    socket.on('message:new', handler);
    return () => {
      socket.off('message:new', handler);
    };
  }, []);

  const value = {
    socket: socketRef.current,
    connected,
    connectionError,
    joinClub,
    leaveClub,
    sendMessage,
    fetchHistory,
    onNewMessage,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}
