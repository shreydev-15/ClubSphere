
const express = require("express");
const router = express.Router();

const {
  createDiscussion,
  getClubDiscussions,
  getDiscussionById,
} = require('../controllers/discussion.controllers');

// Replace these paths with your actual middleware file paths
const { userAuth } = require('../middlewares/auth.middlewares');
const clubmiddleware = require('../middlewares/club.middleware');

// Create a discussion (club members only)
router.post("/:clubId/discussions", userAuth, clubmiddleware.isClubAdmin, createDiscussion);

// Get all discussions in a club (club members only)
router.get("/:clubId/discussions", userAuth, clubmiddleware.isClubMember, getClubDiscussions);

// Get one discussion (club members only)
router.get(
  "/:clubId/discussions/:discussionId",
  userAuth,
  clubmiddleware.isClubMember,
  getDiscussionById
);

module.exports = router;
