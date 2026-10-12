const express = require("express");

const router = express.Router();

const authmiddleware = require('../middlewares/auth.middlewares');
const clubMiddleware = require('../middlewares/club.middleware');
const eventcontrollers = require('../controllers/event.controllers');

// Create event
router.post(
  "/:clubId/events",
  authmiddleware.userAuth,
  clubMiddleware.isClubAdmin,
  eventcontrollers.createEvent
);

// Get all events of a club
router.get(
  "/:clubId/events",
  authmiddleware.userAuth,
  eventcontrollers.getClubEvents
);

// Get one event
router.get(
  "/:clubId/events/:eventId",
  authmiddleware.userAuth,
  eventcontrollers.getEventById
);

// Update event
router.patch(
  "/:clubId/events/:eventId",
  authmiddleware.userAuth,
  clubMiddleware.isClubAdmin,
  eventcontrollers.updateEvent
);

// Delete event
router.delete(
  "/:clubId/events/:eventId",
  authmiddleware.userAuth,
  clubMiddleware.isClubAdmin,
  eventcontrollers.deleteEvent
);

module.exports = router;