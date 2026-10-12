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
  try {
    const { code, state, error } = req.query;

    if (error) {
      return res.status(400).json({
        message: "Google Calendar connection was cancelled or denied",
      });
    }

    if (!code || !state) {
      return res.status(400).json({
        message: "Missing authorization code or state",
      });
    }

    // Validate state and identify the initiating ClubSphere user
    const decoded = jwt.verify(state, process.env.JWT_TOKEN);

    if (!decoded.userId) {
      return res.status(400).json({
        message: "Invalid OAuth state",
      });
    }

    // Exchange the authorization code for Google tokens
    const { tokens } = await oauth2Client.getToken(code);

    if (!tokens.access_token) {
      return res.status(400).json({
        message: "Google did not provide an access token",
      });
    }

    oauth2Client.setCredentials(tokens);

    // Retrieve the Google account's stable ID
    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: "v2",
    });

    const { data: googleUser } = await oauth2.userinfo.get();

    if (!googleUser.id) {
      return res.status(400).json({
        message: "Could not identify the Google account",
      });
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

    return res.status(200).send(
      "Google Calendar connected successfully. You can close this page."
    );
  } catch (error) {
    console.error("Google OAuth callback failed:", error.message);

    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(400).json({
        message: "OAuth state is invalid or expired. Please try again.",
      });
    }

    return res.status(500).json({
      message: "Failed to connect Google Calendar",
    });
  }
};

module.exports = {
  connectGoogle,
  googleCallback,
};
