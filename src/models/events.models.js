const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    date: {
      type: Date,
      required: true,
    },

    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "clubmodel",
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    googleEventId: {
  type: String,
  default: null,
},

googleCalendarOwner: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  default: null,
},

calendarSyncStatus: {
  type: String,
  enum: ["pending", "synced", "failed", "not_connected"],
  default: "not_connected",
},

  },
  {
    timestamps: true,
  }
);

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;