const express = require('express')
const authrouter = require('./routes/auth.routes')
const clubrouter = require('./routes/club.routes')
const membershiprouter = require('./routes/membership.routes')
const eventrouter = require('./routes/events.routes')
const googleRoutes = require('./routes/google.routes')
const cookieparser = require('cookie-parser')

const app = express()

app.use(express.json())
app.use(cookieparser())

app.use('/api/auth', authrouter)
app.use('/api/clubs', clubrouter)
app.use('/api/clubs', membershiprouter)
app.use('/api/clubs', eventrouter)
app.use("/api/auth", googleRoutes);

module.exports = app