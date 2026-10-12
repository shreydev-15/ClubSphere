const Membership = require('../models/memberships.model');

// Check whether the user is a member of the club
async function isClubMember(req, res, next) {
  try {
    const { clubId } = req.params;
    const userId = req.user._id;

    const membership = await Membership.findOne({
      user: userId,
      club: clubId,
    });

    if (!membership) {
      return res.status(403).json({
        success: false,
        message: "You are not a member of this club",
      });
    }

    // Store membership for the next middleware/controller
    req.membership = membership;

    next();
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid club ID",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to verify club membership",
    });
  }
}

// Check whether the user is an admin of the club
async function isClubAdmin(req, res, next) {
  try {
    const { clubId } = req.params;
    const userId = req.user._id;

    const membership = await Membership.findOne({
      user: userId,
      club: clubId,
    });

    if (!membership || membership.role !== "clubAdmin") {
      return res.status(403).json({
        success: false,
        message: "Only club admins can perform this action",
      });
    }

    req.membership = membership;

    next();
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid club ID",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to verify club admin permissions",
    });
  }
}

module.exports = {
  isClubMember,
  isClubAdmin,
};