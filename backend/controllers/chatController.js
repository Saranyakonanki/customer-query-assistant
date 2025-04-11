const db = require("../db");
const { generateResponse } = require("./nlpHelper");

const handleChat = async (req, res) => {
  const { userId, message } = req.body;

  try {
    const botReply = await generateResponse(message);

    // Save to DB (optional)
    db.query(
      "INSERT INTO chat_history (user_id, user_message, bot_response) VALUES (?, ?, ?)",
      [userId, message, botReply],
      (err) => {
        if (err) console.error("Failed to save chat:", err);
      }
    );

    res.status(200).json({ response: botReply });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = { handleChat };
