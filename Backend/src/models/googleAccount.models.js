const mongoose = require("mongoose");

const googleAccountSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    googleId: {
      type: String,
      required: true,
    },

    accessToken: {
      type: String,
      default: null,
    },

    refreshToken: {
      type: String,
      default: null,
    },

    tokenExpiry: {
      type: Date,
      default: null,
    },

    scope: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const GoogleAccount = mongoose.model(
  "GoogleAccount",
  googleAccountSchema
);

module.exports = GoogleAccount;
