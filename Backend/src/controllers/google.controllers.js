const { google } = require("googleapis");
const jwt = require("jsonwebtoken");
const GoogleAccount = require('../models/googleAccount.models');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Step 1: Redirect the user to Google's consent screen
const connectGoogle = (req, res) => {
  try {
    const state = jwt.sign(
      { userId: req.user._id.toString() },
      process.env.JWT_TOKEN,
      { expiresIn: "10m" }
    );

    const authorizationUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: [
        "https://www.googleapis.com/auth/calendar.events",
        "openid",
        "email",
      ],
      state,
    });

    return res.redirect(authorizationUrl);
  } catch (error) {
    console.error("Google OAuth initiation failed:", error.message);
    return res.status(500).json({
      message: "Could not connect to Google Calendar",
    });
  }
};

// Step 2: Google redirects back here with a code
const googleCallback = async (req, res) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  // Normalise: strip trailing slash
  const baseUrl = frontendUrl.replace(/\/+$/, '');

  try {
    const { code, state, error } = req.query;

    if (error) {
      return res.redirect(`${baseUrl}/events?googleError=cancelled`);
    }

    if (!code || !state) {
      return res.redirect(`${baseUrl}/events?googleError=missing_params`);
    }

    // Validate state and identify the initiating ClubSphere user
    const decoded = jwt.verify(state, process.env.JWT_TOKEN);

    if (!decoded.userId) {
      return res.redirect(`${baseUrl}/events?googleError=invalid_state`);
    }

    // Exchange the authorization code for Google tokens
    const { tokens } = await oauth2Client.getToken(code);

    if (!tokens.access_token) {
      return res.redirect(`${baseUrl}/events?googleError=no_token`);
    }

    oauth2Client.setCredentials(tokens);

    // Retrieve the Google account's stable ID
    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: "v2",
    });

    const { data: googleUser } = await oauth2.userinfo.get();

    if (!googleUser.id) {
      return res.redirect(`${baseUrl}/events?googleError=no_google_id`);
    }

    const accountData = {
      googleId: googleUser.id,
      accessToken: tokens.access_token,
      tokenExpiry: tokens.expiry_date
        ? new Date(tokens.expiry_date)
        : null,
      scope: tokens.scope || null,
    };

    // Google may omit refresh_token on subsequent authorizations.
    // Preserve the previously stored refresh token in that case.
    if (tokens.refresh_token) {
      accountData.refreshToken = tokens.refresh_token;
    }

    await GoogleAccount.findOneAndUpdate(
      { user: decoded.userId },
      {
        $set: accountData,
        $setOnInsert: { user: decoded.userId },
      },
      { upsert: true, new: true, runValidators: true }
    );

    // Redirect back to the frontend Events page with success flag
    return res.redirect(`${baseUrl}/events?googleConnected=true`);
  } catch (error) {
    console.error("Google OAuth callback failed:", error.message);

    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.redirect(`${baseUrl}/events?googleError=expired_state`);
    }

    return res.redirect(`${baseUrl}/events?googleError=server_error`);
  }
};

// GET /api/auth/google/status — returns whether the authed user has connected Google Calendar
const getGoogleStatus = async (req, res) => {
  try {
    const account = await GoogleAccount.findOne({ user: req.user._id }).lean();

    if (!account) {
      return res.status(200).json({ connected: false });
    }

    return res.status(200).json({
      connected: true,
      googleId: account.googleId,
      connectedAt: account.createdAt,
      tokenExpiry: account.tokenExpiry,
      scope: account.scope,
    });
  } catch (error) {
    console.error("Google status check failed:", error.message);
    return res.status(500).json({ message: "Failed to fetch Google Calendar status" });
  }
};

module.exports = {
  connectGoogle,
  googleCallback,
  getGoogleStatus,
};
