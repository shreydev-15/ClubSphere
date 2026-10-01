const Membership = require('../models/memberships.model');
const clubmodel = require('../models/club.model');

// Join a club
async function joinClub(req, res) {
  try {
    const { clubId } = req.params;
    const userId = req.user._id;

    // 1. Check whether the club exists
    const club = await clubmodel.findById(clubId);

    if (!club) {
      return res.status(404).json({
        success: false,
        message: "Club not found",
      });
    }

    // 2. Check whether the user has already joined
    const existingMembership = await Membership.findOne({
      user: userId,
      club: clubId,
    });

    if (existingMembership) {
      return res.status(409).json({
        success: false,
        message: "You are already a member of this club",
      });
    }

    // 3. Create the membership
    const membership = await Membership.create({
      user: userId,
      club: clubId,
      role: "member",
    });

    // 4. Send response
    return res.status(201).json({
      success: true,
      message: "Successfully joined the club",
      membership,
    });
  } catch (error) {
    // Handle duplicate membership attempts
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You are already a member of this club",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to join club",
    });
  }
}

async function leaveClub(req, res) {
  try {
    const { clubId } = req.params;
    const userId = req.user._id;

    // 1. Check whether the club exists
    const club = await clubmodel.findById(clubId);

    if (!club) {
      return res.status(404).json({
        success: false,
        message: "Club not found",
      });
    }

    // 2. Find the user's membership
    const membership = await Membership.findOne({
      user: userId,
      club: clubId,
    });

    if (!membership) {
      return res.status(404).json({
        success: false,
        message: "You are not a member of this club",
      });
    }

    // 3. If the user is a club admin, check for other admins
    if (membership.role === "clubAdmin") {
      const adminCount = await Membership.countDocuments({
        club: clubId,
        role: "clubAdmin",
      });

      if (adminCount <= 1) {
        return res.status(400).json({
          success: false,
          message:
            "You are the only admin. Assign another admin before leaving.",
        });
      }
    }

    // 4. Delete the membership
    await Membership.findByIdAndDelete(membership._id);

    return res.status(200).json({
      success: true,
      message: "Successfully left the club",
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
      message: "Failed to leave club",
    });
  }
}

async function getClubMembers(req, res) {
  try {
    const { clubId } = req.params;

    // Check whether the club exists
    const club = await clubmodel.findById(clubId);

    if (!club) {
      return res.status(404).json({
        success: false,
        message: "Club not found",
      });
    }

    // Fetch all memberships for this club
    const members = await Membership.find({ club: clubId })
      .populate("user", "fullname.firstname fullname.lastname email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: members.length,
      members,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch club members",
    });
  }
}

module.exports = {
    joinClub,
    leaveClub,
    getClubMembers
}