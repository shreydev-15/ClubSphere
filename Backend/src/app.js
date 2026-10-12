const express = require('express')
const authrouter = require('./routes/auth.routes')
const clubrouter = require('./routes/club.routes')
const membershiprouter = require('./routes/membership.routes')
const eventrouter = require('./routes/events.routes')
const googleRoutes = require('./routes/google.routes')
const discussionrouter = require('./routes/discussion.routes')
const replyroutes = require('./routes/reply.routes')
const cookieparser = require('cookie-parser')
const cors = require('cors')

const app = express()

const allowedOrigins = [
  'http://localhost:5173',
  'https://club-sphere-chi.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app') ||
      origin === 'http://localhost:5173'
    ) {
      return callback(null, true);
    }
    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
}));

app.use(express.json())
app.use(cookieparser())

app.use('/api/auth', authrouter)
app.use('/api/clubs', clubrouter)
app.use('/api/clubs', membershiprouter)
app.use('/api/clubs', eventrouter)
app.use("/api/auth", googleRoutes);
app.use("/api/clubs", discussionrouter);
app.use('/api/clubs', replyroutes)

module.exports = app