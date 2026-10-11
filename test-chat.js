
const { io } = require("socket.io-client");

const SERVER_URL = "http://localhost:4212";

// Paste your own valid JWT here locally.
// Never commit this file with a real token.
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhYzYwOGM5OTFiNzcyYjJmYWFkMGMxMiIsImlhdCI6MTc5MTcxMzA5MX0.KeuVYhr4E35wMAAzd536klG28cge0tw0Rqd7Ygu9eCw";
const clubId = "6ac60bea91b772b2faad0c15";

const socket = io(SERVER_URL, {
  extraHeaders: {
    Cookie: `token=${token}`,
  },
});

socket.on("connect", () => {
  console.log("Connected:", socket.id);

  socket.emit("club:join", clubId, (response) => {
    console.log("Join response:", response);

    if (!response.success) {
      socket.disconnect();
      return;
    }

    socket.emit(
      "message:send",
      {
        clubId,
        content: "Hello from my Socket.IO test client!",
      },
      (sendResponse) => {
        console.log("Send response:", sendResponse);
      }
    );

    socket.emit("message:history", { clubId, limit: 10 }, (response) => {
      console.log("Message history:", response);
    });
  });
});

socket.on("message:new", (message) => {
  console.log("New message received:", message);
});

socket.on("connect_error", (error) => {
  console.error("Connection error:", error.message);
});

socket.on("disconnect", (reason) => {
  console.log("Disconnected:", reason);
});
