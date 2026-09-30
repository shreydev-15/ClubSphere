const Club = require('../models/club.model')

//create
async function createclub(req,res){
    try {
    const { name, description, category } = req.body;

    // Validate required fields
    if (!name || !description || !category) {
      return res.status(400).json({
        success: false,
        message: "Name, description and category are required",
      });
    }

    const club = await Club.create({
      name,
      description,
      category,
      createdBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Club created successfully",
      club,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create club",
      error: error.message,
    });
  }
};

// 2. Get all clubs
async function getAllClubs (req, res){
  try {
    const clubs = await Club.find()
      .populate("createdBy", "fullname email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: clubs.length,
      clubs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch clubs",
      error: error.message,
    });
  }
};

// 3. Get a single club by ID
async function getClubById (req, res) {
  try {
    const { clubId } = req.params;

    const club = await Club.findById(clubId)
      .populate("createdBy", "fullname email");

    if (!club) {
      return res.status(404).json({
        success: false,
        message: "Club not found",
      });
    }

    return res.status(200).json({
      success: true,
      club,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch club",
      error: error.message,
    });
  }
};


async function updateClub (req, res){
   try {
    const { clubId } = req.params;
    const { name, description, category } = req.body;

    const club = await Club.findById(clubId);

    if (!club) {
      return res.status(404).json({
        success: false,
        message: "Club not found",
      });
    }

    // Only the creator can update the club
    if (club.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this club",
      });
    }

    // Update only the permitted fields
    if (name !== undefined) club.name = name;
    if (description !== undefined) {
      club.description = description;
    }
    if (category !== undefined) club.category = category;

    await club.save();

    return res.status(200).json({
      success: true,
      message: "Club updated successfully",
      club,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update club",
      error: error.message,
    });
  }
};

// 5. Delete a club
async function deleteClub(req, res) {
  try {
    const { clubId } = req.params;

    const club = await Club.findById(clubId);

    if (!club) {
      return res.status(404).json({
        success: false,
        message: "Club not found",
      });
    }

    // Only the creator can delete the club
    if (club.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this club",
      });
    }

    await club.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Club deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete club",
      error: error.message,
    });
  }
};

module.exports = {
  createclub,
  getAllClubs,
  getClubById,
  updateClub,
  deleteClub
}

