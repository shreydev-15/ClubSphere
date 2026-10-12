const express = require("express");
const router = express.Router();

const {
  connectGoogle,
  googleCallback,
} = require('../controllers/google.controllers');

const { userAuth } = require('../middlewares/auth.middlewares');

// Start Google Calendar connection
router.get("/google/connect", userAuth, connectGoogle);

// Google redirects back here after consent
router.get("/google/callback", googleCallback);

module.exports = router;