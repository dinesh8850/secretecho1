const { io } = require("socket.io-client");

const token = process.argv[2];

if (!token) {
  console.error("Usage: node test-socket.js YOUR_TOKEN_HERE");
  process.exit(1);
}

const socket = io("http://localhost:5000", {
  auth: { token },
});

socket.on("connect", () => {
  console.log("✅ Connected:", socket.id);
});

socket.on("new_message", (message) => {
  console.log("📩 New message received:", message);
});

socket.on("connect_error", (err) => {
  console.error("❌ Connection error:", err.message);
});
