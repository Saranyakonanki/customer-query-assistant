const express = require("express");
const router = express.Router();
const db = require("../db");
const authenticateUser = require("../middleware/auth");

// ✅ Fetch messages for logged-in user
router.get("/", authenticateUser, async (req, res) => {
  const userId = req.user.id;

  try {
    const [results] = await db.query("SELECT * FROM messages WHERE user_id = ?", [userId]);
    res.status(200).json(results);
  } catch (err) {
    console.error("❌ Message Fetch Error:", err);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
});

// ✅ Send a message from logged-in user
router.post("/", authenticateUser, async (req, res) => {
  let { sender, message } = req.body;
  const userId = req.user.id;

  if (!sender || !message) {
    return res.status(400).json({ message: "sender and message are required" });
  }

  // Normalize sender
  sender = sender.toLowerCase().trim() === "assistant" ? "assistant" : "user";

  try {
    const [result] = await db.query(
      "INSERT INTO messages (user_id, sender, message) VALUES (?, ?, ?)",
      [userId, sender, message]
    );

    res.status(201).json({
      message: "Message sent successfully",
      id: result.insertId,
    });
  } catch (err) {
    console.error("❌ Message Insert Error:", err);
    res.status(500).json({ message: "Failed to send message" });
  }
});


module.exports = router;
