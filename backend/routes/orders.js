const express = require("express");
const router = express.Router();
const db = require("../db");
const authenticateUser = require("../middleware/auth");

// ✅ Place a new order (Authenticated)
router.post("/", authenticateUser, async (req, res) => {
  const { product_id, quantity } = req.body;
  const user_id = req.user.id;

  if (!product_id || !quantity) {
    return res.status(400).json({ message: "product_id and quantity are required" });
  }

  try {
    // Step 1: Check current stock
    const [stockResults] = await db.query("SELECT stock FROM products WHERE id = ?", [product_id]);
    const currentStock = stockResults[0]?.stock || 0;

    if (currentStock < quantity) {
      return res.status(400).json({ message: "Insufficient stock available" });
    }

    // Step 2: Insert order
    const [orderResult] = await db.query(
      "INSERT INTO orders (user_id, product_id, quantity, status) VALUES (?, ?, ?, 'pending')",
      [user_id, product_id, quantity]
    );

    // Step 3: Update stock
    await db.query(
      "UPDATE products SET stock = stock - ? WHERE id = ?",
      [quantity, product_id]
    );

    return res.status(201).json({
      message: "Order placed successfully",
      orderId: orderResult.insertId,
    });
  } catch (err) {
    console.error("❌ Error placing order:", err);
    return res.status(500).json({ message: "Failed to place order" });
  }
});

// ✅ Get all orders for logged-in user
router.get("/", authenticateUser, async (req, res) => {
  const userId = req.user.id;

  try {
    const [results] = await db.query("SELECT * FROM orders WHERE user_id = ?", [userId]);
    res.status(200).json(results);
  } catch (err) {
    console.error("❌ Failed to fetch orders:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

module.exports = router;
