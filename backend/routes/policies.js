// routes/policies.js
const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all store policies using async/await
router.get("/", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM store_policies");
    res.status(200).json(results);
  } catch (err) {
    console.error("❌ Failed to fetch policies:", err);
    res.status(500).json({ message: "Failed to fetch policies" });
  }
});

module.exports = router;
