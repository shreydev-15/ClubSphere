# ClubSphere — College Club Management Platform

**A full-stack MERN application for managing college clubs, memberships, events, discussions, and real-time communication.**

[🌐 Live Demo](https://club-sphere-chi.vercel.app/) · [💻 GitHub Repository](https://github.com/shreydev-15/ClubSphere)

## Overview

ClubSphere is a full-stack web application designed to bring college clubs and their communities together on one platform. It simplifies club discovery, membership management, event organization, and communication while providing secure, role-based access to club features.

The project combines a React frontend with a Node.js and Express backend, MongoDB for persistent data storage, Socket.IO for real-time communication, and Google Calendar API integration for managing calendar events.

## Features

### 🔐 Authentication and Authorization
- JWT-based user authentication.
- Protected backend routes using authentication middleware.
- Role-based authorization for administrative operations.
- Club-level permissions that distinguish club administrators from regular members.

### 🏛️ Club Management
- Create, view, update, and delete clubs, subject to authorization.
- Browse available clubs and view individual club details.
- Join and leave clubs.
- Manage club membership and permissions.

### 📅 Event Management
- Create and manage club events.
- Restrict event management to authorized club administrators.
- Integrate Google Calendar using OAuth 2.0.
- Create, update, and delete corresponding Google Calendar events.
- Store event data in MongoDB.

### 💬 Discussions
- Create discussion topics within the platform.
- Add replies to discussions.
- Keep conversations organized around club-related topics.

### ⚡ Real-Time Club Chat
- Real-time messaging powered by Socket.IO.
- Club-specific chat rooms.
- Persistent message history stored in MongoDB.
- Server-side authentication and membership checks before accessing club chat.
- Message history retrieval with pagination support.

## Tech Stack

| Category | Technologies |
|---|---|
| Frontend | React.js, Vite, JavaScript |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT |
| Authorization | Custom middleware, role-based access control |
| Real-time communication | Socket.IO |
| External API integration | Google Calendar API |
| Third-party authorization | Google OAuth 2.0 |
| Deployment | Vercel (frontend), Render (backend) |
| Development tools | Git, GitHub, Postman, npm |

## Architecture

ClubSphere follows a client-server architecture.

```text
                 ┌──────────────────────┐
                 │   React + Vite UI    │
                 │      Frontend        │
                 └──────────┬───────────┘
                            │
                   HTTP / REST API
                   Socket.IO Events
                            │
                 ┌──────────▼───────────┐
                 │   Node.js + Express  │
                 │    Backend API       │
                 └──────────┬───────────┘
                            │
              ┌─────────────┼─────────────┐
              │             │             │
       ┌──────▼─────┐ ┌─────▼──────┐ ┌────▼──────────┐
       │  MongoDB   │ │ Socket.IO  │ │ Google       │
       │  Database  │ │ Chat Layer │ │ Calendar API │
       └────────────┘ └────────────┘ └───────────────┘
```

**Request flow:** The frontend communicates with the backend through REST APIs and Socket.IO. The backend validates authentication and permissions, interacts with MongoDB, and connects to Google Calendar through the authorized user's OAuth credentials.

## Getting Started

Follow these steps to run ClubSphere locally.

### Prerequisites

- Node.js and npm
- MongoDB database
- Git
- Google Cloud project and OAuth 2.0 credentials if you want to use Google Calendar integration

### 1. Clone the repository

```bash
git clone https://github.com/shreydev-15/ClubSphere.git
cd ClubSphere
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory and configure the environment variables expected by your backend code.

```env
PORT=4212
MONGODB_URI=your_mongodb_connection_string
JWT_TOKEN=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
GOOGLE_REDIRECT_URI=http://localhost:4212/api/auth/google/callback
```

**Important:** Check your database connection code for the exact MongoDB environment variable name. The example above uses `MONGODB_URI` as a placeholder if your code uses a different name.

For local Google Calendar authorization, configure the redirect URI in Google Cloud Console to match the URI used by your application.

Start the backend using the script configured in `backend/package.json`. For example, if your project defines a `dev` script:

```bash
npm run dev
```

### 3. Set up the frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Vite will display the local URL where you can access the frontend.

Configure the frontend's API base URL to point to your local backend. Use the environment variable name already expected by your frontend code.

### 4. Run the application

Ensure that MongoDB is accessible, the backend is running, and the frontend is configured to communicate with the backend.

Google Calendar features also require valid OAuth credentials, a matching redirect URI, and the required Calendar API enabled in Google Cloud Console.

## Deployment

- **Live frontend:** https://club-sphere-chi.vercel.app/
- **Backend deployment:** https://clubsphere-9w89.onrender.com/
- **Source code:** https://github.com/shreydev-15/ClubSphere

For production deployment, configure environment variables in your hosting provider rather than committing secrets to the repository. Also configure the production Google OAuth redirect URI, frontend/backend CORS settings, and any required Socket.IO connection settings.

## Security Considerations

ClubSphere implements several backend security practices:

- JWT verification for protected requests and socket connections.
- Server-side role and club-membership checks.
- Authorization checks for club-specific operations.
- Validation of incoming chat messages and club identifiers.
- Persistent data handling through Mongoose models.
- Separate OAuth credentials and saved Google account tokens for Calendar integration.

**Never commit your `.env` files, JWT secrets, Google client secrets, access tokens, or refresh tokens to GitHub.**

## What I Learned

Building ClubSphere helped me explore full-stack development beyond basic CRUD operations:

- Structuring a backend using models, controllers, routes, services, and middleware.
- Implementing JWT authentication and role-based authorization.
- Designing MongoDB schemas and relationships between users, clubs, memberships, events, and messages.
- Integrating Google Calendar through OAuth 2.0.
- Implementing real-time communication with Socket.IO.
- Persisting and retrieving chat history from MongoDB.
- Testing API endpoints and debugging frontend-backend integration.
- Deploying a full-stack application and configuring production environments.

## Future Improvements

- Add automated tests for API endpoints and authorization rules.
- Improve loading states, error handling, and accessibility.
- Add notifications for new events and club discussions.
- Strengthen monitoring and production error reporting.

## Author

**Shreyash**

B.Tech CSE-IT | Full-Stack Developer

- GitHub: [@shreydev-15](https://github.com/shreydev-15)
- Project: [ClubSphere](https://club-sphere-chi.vercel.app/)

---

If you find ClubSphere interesting, feel free to explore the repository and share feedback.

**Built with React, Node.js, Express, MongoDB, and a focus on learning real-world full-stack development.**
