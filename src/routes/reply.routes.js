
const express = require("express");
const router = express.Router();

const {
  createReply,
  getDiscussionReplies,
} = require('../controllers/reply.controller');

const { userAuth } = require('../middlewares/auth.middlewares');
const { isClubMember } = require('../middlewares/club.middleware');

// Create a reply: club members only
router.post(
  "/:clubId/discussions/:discussionId/replies",
  userAuth,
  isClubMember,
  createReply
);

// Get replies: club members only
router.get(
  "/:clubId/discussions/:discussionId/replies",
  userAuth,
  isClubMember,
  getDiscussionReplies
);

module.exports = router;
