const mongoose = require("mongoose");

const membershipSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "clubmodel",
      required: true,
    },

    role: {
      type: String,
      enum: ["clubAdmin", "member"],
      default: "member",   
    },
  },
  { timestamps: true }
);

// Prevent duplicate memberships
membershipSchema.index(
  { user: 1, club: 1 },
  { unique: true }
);

const Membership = mongoose.model(
  "Membership",
  membershipSchema
);

module.exports = Membership;