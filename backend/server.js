// FILE: server.js

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const recommendationRoutes = require("./routes/recommendations");

const app = express();
const PORT = process.env.PORT || 5000;

// ── CORS — allow everything, no restrictions ──
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(cors());
app.use(express.json());

// ── HEALTH CHECK ──
app.get("/", (req, res) => {
  res.json({ message: "WanderWise backend is working!" });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "WanderWise backend is running" });
});

// ── ROUTES ──
app.use("/api", recommendationRoutes);

// ── GLOBAL ERROR HANDLER ──
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ success: false, error: "Internal server error" });
});

// ── START SERVER ──
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ WanderWise backend running at http://localhost:${PORT}`);
});
