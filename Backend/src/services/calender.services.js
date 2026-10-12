const { google } = require("googleapis");
const GoogleAccount = require("../models/googleAccount.models");

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Get an authenticated Google Calendar client for a user
async function getCalendarClient(userId) {
  const googleAccount = await GoogleAccount.findOne({
    user: userId,
  });

  if (!googleAccount) {
    throw new Error("Google Calendar is not connected");
  }

  if (!googleAccount.refreshToken) {
    throw new Error(
      "Google refresh token is missing. Reconnect Google Calendar."
    );
  }

  // Create a separate OAuth client for this user's connection
  const userOAuthClient = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  userOAuthClient.setCredentials({
    access_token: googleAccount.accessToken,
    refresh_token: googleAccount.refreshToken,
    expiry_date: googleAccount.tokenExpiry
      ? googleAccount.tokenExpiry.getTime()
      : undefined,
  });

  // Save refreshed tokens when Google provides them
  userOAuthClient.on("tokens", async (tokens) => {
    try {
      const updates = {};

      if (tokens.access_token) {
        updates.accessToken = tokens.access_token;
      }

      if (tokens.expiry_date) {
        updates.tokenExpiry = new Date(tokens.expiry_date);
      }

      if (tokens.refresh_token) {
        updates.refreshToken = tokens.refresh_token;
      }

      if (Object.keys(updates).length > 0) {
        await GoogleAccount.updateOne(
          { _id: googleAccount._id },
          { $set: updates }
        );
      }
    } catch (error) {
      console.error("Failed to save refreshed Google tokens");
    }
  });

  return google.calendar({
    version: "v3",
    auth: userOAuthClient,
  });
}

// Create an event in the user's primary Google Calendar
async function createGoogleCalendarEvent(userId, eventData) {
  const calendar = await getCalendarClient(userId);

  const response = await calendar.events.insert({
    calendarId: "primary",
    requestBody: {
      summary: eventData.summary,
      description: eventData.description,
      location: eventData.location,
      start: eventData.start,
      end: eventData.end,
    },
  });

  return response.data;
}

// Update an existing Google Calendar event
async function updateGoogleCalendarEvent(
  userId,
  googleEventId,
  eventData
) {
  const calendar = await getCalendarClient(userId);

  const response = await calendar.events.patch({
    calendarId: "primary",
    eventId: googleEventId,
    requestBody: eventData,
  });

  return response.data;
}

// Delete an event from Google Calendar
async function deleteGoogleCalendarEvent(userId, googleEventId) {
  const calendar = await getCalendarClient(userId);

  await calendar.events.delete({
    calendarId: "primary",
    eventId: googleEventId,
  });

  return true;
}

module.exports = {
  getCalendarClient,
  createGoogleCalendarEvent,
  updateGoogleCalendarEvent,
  deleteGoogleCalendarEvent,
};
