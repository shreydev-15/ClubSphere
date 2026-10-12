
const Reply = require('../models/reply.models');
const Discussion = require('../models/discussions.models');

// Create a reply
async function createReply(req, res) {
  try {
    const { clubId, discussionId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Reply content is required",
      });
    }

    const discussion = await Discussion.findOne({
      _id: discussionId,
      club: clubId,
    });

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: "Discussion not found in this club",
      });
    }

    const reply = await Reply.create({
      content,
      discussion: discussionId,
      club: clubId,
      createdBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Reply created successfully",
      reply,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid club or discussion ID",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    console.error("Create reply error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to create reply",
    });
  }
}

// Get all replies for a discussion
async function getDiscussionReplies(req, res) {
  try {
    const { clubId, discussionId } = req.params;

    const discussion = await Discussion.findOne({
      _id: discussionId,
      club: clubId,
    });

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: "Discussion not found in this club",
      });
    }

    const replies = await Reply.find({
      discussion: discussionId,
      club: clubId,
    })
      .populate("createdBy", "fullname email")
      .sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      count: replies.length,
      replies,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid club or discussion ID",
      });
    }

    console.error("Get replies error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch replies",
    });
  }
}

module.exports = {
  createReply,
  getDiscussionReplies,
};
