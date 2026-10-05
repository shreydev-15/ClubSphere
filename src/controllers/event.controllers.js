const Event = require('../models/events.models');
const clubmodel = require('../models/club.model');

// CREATE EVENT
async function createEvent(req, res) {
  try {
    const { clubId } = req.params;
    const { title, description, date, startTime, endTime, location } = req.body;

    // Check whether club exists
    const club = await clubmodel.findById(clubId);

    if (!club) {
      return res.status(404).json({
        success: false,
        message: "Club not found",
      });
    }

    // Create event
    const event = await Event.create({
      title,
      description,
      date,
      startTime,
      endTime,
      location,
      club: clubId,
      createdBy: req.user._id,
    });

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

    await event.save();

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

    const event = await Event.findOneAndDelete({
      _id: eventId,
      club: clubId,
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

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

