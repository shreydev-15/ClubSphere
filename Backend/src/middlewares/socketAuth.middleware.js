const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const User = require("../models/auth.models");

async function socketAuth(socket, next) {
  try {
    const rawCookie = socket.handshake.headers.cookie || "";

    let token = null;
    if (rawCookie) {
      try {
        const cookies = typeof cookie.parseCookie === 'function' ? cookie.parseCookie(rawCookie) : cookie.parse(rawCookie);
        token = cookies?.token;
      } catch (err) {
        // Fallback if parsing fails
      }
    }

    if (!token && socket.handshake.auth && socket.handshake.auth.token) {
      token = socket.handshake.auth.token;
    }

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