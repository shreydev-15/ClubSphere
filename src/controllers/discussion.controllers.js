const Discussion = require('../models/discussions.models');
const clubmodel = require('../models/club.model');

// Create a discussion
async function createDiscussion(req, res) {
  try {
    const { clubId } = req.params;
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required",
      });
    }

    const club = await clubmodel.findById(clubId);

    if (!club) {
      return res.status(404).json({
        success: false,
        message: "Club not found",
      });
    }

    const discussion = await Discussion.create({
      title,
      content,
      club: clubId,
      createdBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Discussion created successfully",
      discussion,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid club ID",
      });
    }

    console.error("Create discussion error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to create discussion",
    });
  }
}

// Get all discussions for a club
async function getClubDiscussions(req, res) {
  try {
    const { clubId } = req.params;

    const club = await clubmodel.findById(clubId);

    if (!club) {
      return res.status(404).json({
        success: false,
        message: "Club not found",
      });
    }

    const discussions = await Discussion.find({ club: clubId })
      .populate("createdBy", "fullname email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: discussions.length,
      discussions,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid club ID",
      });
    }

    console.error("Get discussions error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch discussions",
    });
  }
}

// Get one discussion
async function getDiscussionById(req, res) {
  try {
    const { clubId, discussionId } = req.params;

    const discussion = await Discussion.findOne({
      _id: discussionId,
      club: clubId,
    }).populate("createdBy", "fullname email");

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: "Discussion not found in this club",
      });
    }

    return res.status(200).json({
      success: true,
      discussion,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid club ID or discussion ID",
      });
    }

    console.error("Get discussion error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch discussion",
    });
  }
}

module.exports = {
  createDiscussion,
  getClubDiscussions,
  getDiscussionById,
};