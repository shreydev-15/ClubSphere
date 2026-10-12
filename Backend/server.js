require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");

const app = require("./src/app");
const socketAuth = require("./src/middlewares/socketAuth.middleware");
const registerChatHandlers = require("./src/sockets/chat.socket");
const connectDB = require("./src/db/db");

const server = http.createServer(app);

const allowedOrigins = [
  'http://localhost:5173',
  'https://club-sphere-chi.vercel.app',
  process.env.FRONTEND_URL,
].filter(Boolean);

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        origin === 'http://localhost:5173'
      ) {
        return callback(null, true);
      }
      return callback(new Error(`Socket origin ${origin} not allowed`));
    },
    credentials: true,
  },
});

// Make io accessible to controllers if needed later
app.set("io", io);

connectDB();

io.use(socketAuth);

io.on("connection", (socket) => {
  console.log("Authenticated socket connected:", socket.id);

   registerChatHandlers(io, socket);

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 4212;

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
