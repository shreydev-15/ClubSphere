const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const User = require("../models/auth.models");

async function socketAuth(socket, next) {
  try {
    const rawCookie = socket.handshake.headers.cookie || "";

    // Your installed cookie package uses parseCookie()
    const cookies = cookie.parseCookie(rawCookie);
    const token = cookies.token;

    if (!token) {
      return next(new Error("Unauthorized: token missing"));
    }

    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new Error("Unauthorized: user not found"));
    }

    socket.user = user;
    return next();
  } catch (error) {
    console.error("Socket JWT error:", error.name, error.message);
    return next(new Error("Unauthorized: invalid token"));
  }
}

module.exports = socketAuth;