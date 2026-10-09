const Event = require('../models/events.models');
const clubmodel = require('../models/club.model');
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

    // 2. Attempt to sync with the creator's Google Calendar
    try {
      const googleEvent = await createGoogleCalendarEvent(
        req.user._id,
        toGoogleEventData(event)
      );

      event.googleEventId = googleEvent.id;
      event.googleCalendarOwner = req.user._id;
      event.calendarSyncStatus = "synced";

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

    // Sync changes to Google Calendar if linked
    if (event.googleEventId && event.googleCalendarOwner) {
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

    // Delete the linked Google Calendar event if one exists
    if (event.googleEventId && event.googleCalendarOwner) {
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

