const Event = require('../models/events.models');
const clubmodel = require('../models/club.model');
const Membership = require('../models/memberships.model');
const GoogleAccount = require('../models/googleAccount.models');
const {
  createGoogleCalendarEvent,
  updateGoogleCalendarEvent,
  deleteGoogleCalendarEvent,
} = require('../services/calender.services');

function toGoogleEventData(event) {
  const date = new Date(event.date).toISOString().split("T")[0];

  return {
    summary: event.title,
    description: event.description || "",
    location: event.location || "",
    start: {
      dateTime: `${date}T${event.startTime}:00+05:30`,
      timeZone: "Asia/Kolkata",
    },
    end: {
      dateTime: `${date}T${event.endTime}:00+05:30`,
      timeZone: "Asia/Kolkata",
    },
  };
}

function getCalendarSyncStatus(syncs) {
  if (syncs.length === 0) return "not_connected";

  const syncedCount = syncs.filter((sync) => sync.status === "synced").length;

  if (syncedCount === syncs.length) return "synced";
  if (syncedCount === 0) return "failed";
  return "partial";
}

async function createMemberCalendarEvents(event, clubId, creatorId) {
  const memberIds = await Membership.distinct("user", { club: clubId });
  const recipientIds = [
    ...new Set([...memberIds.map(String), creatorId.toString()]),
  ];
  const googleAccounts = await GoogleAccount.find({
    user: { $in: recipientIds },
    refreshToken: { $exists: true, $nin: [null, ""] },
  }).select("user");

  return Promise.all(
    googleAccounts.map(async (googleAccount) => {
      try {
        const googleEvent = await createGoogleCalendarEvent(
          googleAccount.user,
          toGoogleEventData(event)
        );

        return {
          user: googleAccount.user,
          googleEventId: googleEvent.id,
          status: "synced",
        };
      } catch (error) {
        console.error(
          `Google Calendar sync failed for user ${googleAccount.user}:`,
          error.message
        );

        return {
          user: googleAccount.user,
          googleEventId: null,
          status: "failed",
        };
      }
    })
  );
}

// CREATE EVENT

async function createEvent(req, res) {
  try {
    const { clubId } = req.params;
    const {
      title,
      description,
      date,
      startTime,
      endTime,
      location,
    } = req.body;

    if (!clubId) {
      return res.status(400).json({
        success: false,
        message: "Club ID is required",
      });
    }

    if (
      !title ||
      !description ||
      !date ||
      !startTime ||
      !endTime ||
      !location
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Title, description, date, startTime, endTime and location are required",
      });
    }

    const club = await clubmodel.findById(clubId);

    if (!club) {
      return res.status(404).json({
        success: false,
        message: "Club not found",
      });
    }

    // 1. Create the event in MongoDB first
    const event = await Event.create({
      title,
      description,
      date,
      startTime,
      endTime,
      location,
      club: clubId,
      createdBy: req.user._id,
      calendarSyncStatus: "not_connected",
    });

    // Sync to the primary calendars of club members who connected Google.
    try {
      event.googleCalendarSyncs = await createMemberCalendarEvents(
        event,
        clubId,
        req.user._id
      );
      event.calendarSyncStatus = getCalendarSyncStatus(event.googleCalendarSyncs);

      const creatorSync = event.googleCalendarSyncs.find(
        (sync) => sync.user.toString() === req.user._id.toString()
      );
      if (creatorSync?.status === "synced") {
        event.googleEventId = creatorSync.googleEventId;
        event.googleCalendarOwner = req.user._id;
      }

      await event.save();
    } catch (calendarError) {
      console.error(
        "Google Calendar sync failed:",
        calendarError.message
      );

      event.calendarSyncStatus = "failed";
      await event.save();
    }

    // 3. Return the locally saved event, even if Google sync failed
    return res.status(201).json({
      success: true,
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid club ID",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create event",
      error: error.message,
    });
  }
}



// GET ALL EVENTS OF A CLUB
async function getClubEvents(req, res) {
  try {
    const { clubId } = req.params;

    // Check whether club exists
    const club = await clubmodel.findById(clubId);

    if (!club) {
      return res.status(404).json({
        success: false,
        message: "Club not found",
      });
    }

    const events = await Event.find({ club: clubId })
      .populate("createdBy", "fullname email")
      .sort({ date: 1 });

    return res.status(200).json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid club ID",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to fetch events",
    });
  }
}


// GET ONE EVENT
async function getEventById(req, res) {
  try {
    const { clubId, eventId } = req.params;

    const event = await Event.findOne({
      _id: eventId,
      club: clubId,
    }).populate("createdBy", "fullname email");

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    return res.status(200).json({
      success: true,
      event,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid club ID or event ID",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to fetch event",
    });
  }
}


// UPDATE EVENT
async function updateEvent(req, res) {
  try {
    const { clubId, eventId } = req.params;

    const event = await Event.findOne({
      _id: eventId,
      club: clubId,
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const { title, description, date, startTime, endTime, location } =
      req.body;

    if (title !== undefined) event.title = title;
    if (description !== undefined) event.description = description;
    if (date !== undefined) event.date = date;
    if (startTime !== undefined) event.startTime = startTime;
    if (endTime !== undefined) event.endTime = endTime;
    if (location !== undefined) event.location = location;

    // Save changes in ClubSphere first
    await event.save();

    // Update each member's linked Google Calendar copy.
    if (event.googleCalendarSyncs?.length) {
      await Promise.all(
        event.googleCalendarSyncs.map(async (sync) => {
          if (!sync.googleEventId) return;

          try {
            await updateGoogleCalendarEvent(
              sync.user,
              sync.googleEventId,
              toGoogleEventData(event)
            );
            sync.status = "synced";
          } catch (calendarError) {
            console.error(
              `Google Calendar update failed for user ${sync.user}:`,
              calendarError.message
            );
            sync.status = "failed";
          }
        })
      );

      event.calendarSyncStatus = getCalendarSyncStatus(event.googleCalendarSyncs);
      await event.save();
    } else if (event.googleEventId && event.googleCalendarOwner) {
      try {
        await updateGoogleCalendarEvent(
          event.googleCalendarOwner,
          event.googleEventId,
          toGoogleEventData(event)
        );

        event.calendarSyncStatus = "synced";
      } catch (calendarError) {
        console.error(
          "Google Calendar update failed:",
          calendarError.message
        );

        event.calendarSyncStatus = "failed";
      }

      await event.save();
    }

    return res.status(200).json({
      success: true,
      message: "Event updated successfully",
      event,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid club ID or event ID",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update event",
    });
  }
}

// DELETE EVENT
async function deleteEvent(req, res) {
  try {
    const { clubId, eventId } = req.params;

    const event = await Event.findOne({
      _id: eventId,
      club: clubId,
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Delete each member's linked Google Calendar copy.
    if (event.googleCalendarSyncs?.length) {
      await Promise.all(
        event.googleCalendarSyncs.map(async (sync) => {
          if (!sync.googleEventId) return;

          try {
            await deleteGoogleCalendarEvent(sync.user, sync.googleEventId);
          } catch (calendarError) {
            console.error(
              `Google Calendar deletion failed for user ${sync.user}:`,
              calendarError.message
            );
          }
        })
      );
    } else if (event.googleEventId && event.googleCalendarOwner) {
      try {
        await deleteGoogleCalendarEvent(
          event.googleCalendarOwner,
          event.googleEventId
        );
      } catch (calendarError) {
        console.error(
          "Google Calendar deletion failed:",
          calendarError.message
        );
      }
    }

    // Delete the ClubSphere event
    await event.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid club ID or event ID",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to delete event",
    });
  }
}


module.exports = {
  createEvent,
  getClubEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};

