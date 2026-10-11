
const Membership = require('../models/memberships.model');
const Club = require('../models/club.model');
const Message = require("../models/message.models");

function registerChatHandlers(io, socket) {
  // Join a club's chat room
  socket.on("club:join", async (clubId, callback) => {
    const respond = typeof callback === "function" ? callback : () => {};

    try {
      if (typeof clubId !== "string" || !/^[a-f\d]{24}$/i.test(clubId)) {
        return respond({
          success: false,
          message: "Valid club ID is required",
        });
      }

      const club = await Club.findById(clubId);

      if (!club) {
        return respond({ success: false, message: "Club not found" });
      }

      const membership = await Membership.findOne({
        user: socket.user._id,
        club: clubId,
      });

      if (!membership) {
        return respond({
          success: false,
          message: "You are not a member of this club",
        });
      }

      const roomName = `club:${clubId}`;
      await socket.join(roomName);

      return respond({
        success: true,
        message: "Joined club chat successfully",
        room: roomName,
      });
    } catch (error) {
      console.error("Club chat join error:", error.message);
      return respond({
        success: false,
        message: "Failed to join club chat",
      });
    }
  });

  // Leave a club's chat room
  socket.on("club:leave", async (clubId, callback) => {
    const respond = typeof callback === "function" ? callback : () => {};

    try {
      if (typeof clubId !== "string" || !/^[a-f\d]{24}$/i.test(clubId)) {
        return respond({
          success: false,
          message: "Valid club ID is required",
        });
      }

      await socket.leave(`club:${clubId}`);

      return respond({
        success: true,
        message: "Left club chat successfully",
      });
    } catch (error) {
      console.error("Club chat leave error:", error.message);
      return respond({
        success: false,
        message: "Failed to leave club chat",
      });
    }
  });

  // Send a message
  socket.on("message:send", async (data, callback) => {
    const respond = typeof callback === "function" ? callback : () => {};

    try {
      const { clubId, content } = data || {};

      if (typeof clubId !== "string" || !/^[a-f\d]{24}$/i.test(clubId)) {
        return respond({
          success: false,
          message: "Valid club ID is required",
        });
      }

      if (typeof content !== "string" || !content.trim()) {
        return respond({
          success: false,
          message: "Message content is required",
        });
      }

      const trimmedContent = content.trim();

      if (trimmedContent.length > 2000) {
        return respond({
          success: false,
          message: "Message cannot exceed 2000 characters",
        });
      }

      const membership = await Membership.findOne({
        user: socket.user._id,
        club: clubId,
      });

      if (!membership) {
        return respond({
          success: false,
          message: "You are not a member of this club",
        });
      }

      const roomName = `club:${clubId}`;

      if (!socket.rooms.has(roomName)) {
        return respond({
          success: false,
          message: "Join the club chat before sending messages",
        });
      }

      const message = await Message.create({
        content: trimmedContent,
        club: clubId,
        sender: socket.user._id,
      });

      const populatedMessage = await Message.findById(message._id)
        .populate("sender", "fullname email");

      io.to(roomName).emit("message:new", populatedMessage);

      return respond({
        success: true,
        message: "Message sent successfully",
        data: populatedMessage,
      });
    } catch (error) {
      console.error("Send message error:", error.message);
      return respond({
        success: false,
        message: "Failed to send message",
      });
    }
  });

  // Fetch message history
  socket.on("message:history", async (data, callback) => {
    const respond = typeof callback === "function" ? callback : () => {};

    try {
      const { clubId, limit = 50, before } = data || {};

      if (typeof clubId !== "string" || !/^[a-f\d]{24}$/i.test(clubId)) {
        return respond({
          success: false,
          message: "Valid club ID is required",
        });
      }

      const membership = await Membership.findOne({
        user: socket.user._id,
        club: clubId,
      });

      if (!membership) {
        return respond({
          success: false,
          message: "You are not a member of this club",
        });
      }

      if (!socket.rooms.has(`club:${clubId}`)) {
        return respond({
          success: false,
          message: "Join the club chat before fetching history",
        });
      }

      const parsedLimit = Number(limit);

      if (!Number.isInteger(parsedLimit) || parsedLimit < 1) {
        return respond({
          success: false,
          message: "Limit must be a positive integer",
        });
      }

      const query = { club: clubId };

      if (before) {
        if (typeof before !== "string" || !/^[a-f\d]{24}$/i.test(before)) {
          return respond({
            success: false,
            message: "Invalid pagination cursor",
          });
        }

        const cursorMessage = await Message.findOne({
          _id: before,
          club: clubId,
        }).select("createdAt");

        if (!cursorMessage) {
          return respond({
            success: false,
            message: "Pagination cursor not found",
          });
        }

        query.createdAt = { $lt: cursorMessage.createdAt };
      }

      const messages = await Message.find(query)
        .sort({ createdAt: -1, _id: -1 })
        .limit(Math.min(parsedLimit, 100))
        .populate("sender", "fullname email");

      return respond({
        success: true,
        count: messages.length,
        messages: messages.reverse(),
      });
    } catch (error) {
      console.error("Fetch message history error:", error.message);
      return respond({
        success: false,
        message: "Failed to fetch message history",
      });
    }
  });
}

module.exports = registerChatHandlers;
