// FILE: routes/recommendations.js

const express = require("express");
const router = express.Router();
const {
  getRecommendations,
} = require("../controllers/recommendationController");

// Handle both GET and OPTIONS for /recommendations
router.options("/recommendations", (req, res) => {
  res.sendStatus(200);
});

router.get("/recommendations", getRecommendations);

module.exports = router;
