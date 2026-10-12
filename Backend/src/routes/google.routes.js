const express = require("express");
const router = express.Router();

const {
  connectGoogle,
  googleCallback,
  getGoogleStatus,
} = require('../controllers/google.controllers');

const { userAuth } = require('../middlewares/auth.middlewares');

// Start Google Calendar connection
router.get("/google/connect", userAuth, connectGoogle);

// Google redirects back here after consent
router.get("/google/callback", googleCallback);

// Check if the logged-in user has connected Google Calendar
router.get("/google/status", userAuth, getGoogleStatus);

module.exports = router;