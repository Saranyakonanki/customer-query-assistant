const express = require("express");
const router = express.Router();
const db = require("../db");
const authenticateUser = require("../middleware/auth");

// 🔁 1. Create a new refund request (user must be logged in)
router.post("/", authenticateUser, async (req, res) => {
  const { order_id, reason } = req.body;
  const user_id = req.user.id;

  if (!order_id || !reason) {
    return res.status(400).json({ message: "Order ID and reason are required" });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO refunds (order_id, reason, user_id) VALUES (?, ?, ?)",
      [order_id, reason, user_id]
    );

    res.status(201).json({
      message: "Refund request submitted",
      refund_id: result.insertId,
    });
  } catch (err) {
    console.error("❌ Refund Request Error:", err);
    res.status(500).json({ message: "Failed to request refund" });
  }
});

// 🔁 2. Update refund status and approval (admin use case)
router.put("/:id", async (req, res) => {
  const refundId = req.params.id;
  const { status, is_approved } = req.body;

  if (!status || typeof is_approved === "undefined") {
    return res.status(400).json({ message: "Status and approval flag are required" });
  }

  try {
    await db.query(
      "UPDATE refunds SET status = ?, is_approved = ? WHERE id = ?",
      [status, is_approved, refundId]
    );

    const responseMessage = is_approved
      ? "✅ Refund approved successfully"
      : "🕵️‍♂️ Refund will be monitored by our executives for approval";

    res.status(200).json({ message: responseMessage });
  } catch (err) {
    console.error("❌ Refund Update Error:", err);
    res.status(500).json({ message: "Failed to update refund status" });
  }
});

// 🔁 3. Fetch all refund requests for the logged-in user
router.get("/", authenticateUser, async (req, res) => {
  const user_id = req.user.id;

  try {
    const [results] = await db.query(`
      SELECT 
        r.id AS refund_id,
        r.reason,
        r.status,
        r.is_approved,
        r.refund_date,
        o.id AS order_id,
        o.quantity,
        p.name AS product_name,
        p.price,
        (p.price * o.quantity) AS amount
      FROM refunds r
      JOIN orders o ON r.order_id = o.id
      JOIN products p ON o.product_id = p.id
      WHERE r.user_id = ?
    `, [user_id]);

    res.status(200).json(results);
  } catch (err) {
    console.error("❌ Fetch Refunds Error:", err);
    res.status(500).json({ message: "Failed to fetch refunds" });
  }
});



// 🔁 4. Fetch a single refund by ID (only if it belongs to the user)
router.get("/:id", authenticateUser, async (req, res) => {
  const refundId = req.params.id;
  const user_id = req.user.id;

  try {
    const [results] = await db.query(
      "SELECT * FROM refunds WHERE id = ? AND user_id = ?",
      [refundId, user_id]
    );

    if (results.length === 0) {
      return res.status(404).json({ message: "Refund not found or unauthorized" });
    }

    res.status(200).json(results[0]);
  } catch (err) {
    console.error("❌ Fetch Refund Error:", err);
    res.status(500).json({ message: "Failed to fetch refund" });
  }
});

module.exports = router;
