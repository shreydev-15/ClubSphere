import { createBrowserRouter, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AppLayout } from '../components/layout/AppLayout';

import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { DashboardPage } from '../pages/DashboardPage';
import { ExploreClubsPage } from '../pages/ExploreClubsPage';
import { ClubDetailsPage } from '../pages/ClubDetailsPage';
import { MyClubsPage } from '../pages/MyClubsPage';
import { EventsPage } from '../pages/EventsPage';
import { DiscussionsPage } from '../pages/DiscussionsPage';
import { DiscussionDetailsPage } from '../pages/DiscussionDetailsPage';
import { ChatPage } from '../pages/ChatPage';
import { ProfilePage } from '../pages/ProfilePage';
import { TermsPage } from '../pages/TermsPage';
import { PrivacyPage } from '../pages/PrivacyPage';
import { NotFoundPage } from '../pages/NotFoundPage';

// Protected Route Guard
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--bg-primary)',
        }}
      >
        <span className="spinner" style={{ width: '28px', height: '28px', color: 'var(--brand-primary)' }} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

// Public Only Route Guard (redirects already authenticated users away from Login/Register)
function PublicOnlyRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/terms',
    element: <TermsPage />,
  },
  {
    path: '/privacy',
    element: <PrivacyPage />,
  },
  {
    path: '/login',
    element: (
      <PublicOnlyRoute>
        <LoginPage />
      </PublicOnlyRoute>
    ),
  },
  {
    path: '/register',
    element: (
      <PublicOnlyRoute>
        <RegisterPage />
      </PublicOnlyRoute>
    ),
  },
  {
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/dashboard',
        element: <DashboardPage />,
      },
      {
        path: '/clubs',
        element: <ExploreClubsPage />,
      },
      {
        path: '/clubs/:clubId',
        element: <ClubDetailsPage />,
      },
      {
        path: '/clubs/:clubId/discussions/:discussionId',
        element: <DiscussionDetailsPage />,
      },
      {
        path: '/my-clubs',
        element: <MyClubsPage />,
      },
      {
        path: '/events',
        element: <EventsPage />,
      },
      {
        path: '/discussions',
        element: <DiscussionsPage />,
      },
      {
        path: '/chat',
        element: <ChatPage />,
      },
      {
        path: '/profile',
        element: <ProfilePage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
