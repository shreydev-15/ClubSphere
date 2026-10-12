
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "clubmodel",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Efficiently fetch recent messages for a club
messageSchema.index({ club: 1, createdAt: -1 });

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
