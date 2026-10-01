const express = require("express");
const router = express.Router();

const {
  joinClub,
  leaveClub,
  getClubMembers,
} = require('../controllers/membership.controllers');

const { userAuth } = require('../middlewares/auth.middlewares');

// Join a club
router.post('/:clubId/join', userAuth, joinClub);

// Leave a club
router.delete('/:clubId/leave', userAuth, leaveClub);

// Get all members of a club
router.get('/:clubId/members', userAuth, getClubMembers);

module.exports = router;