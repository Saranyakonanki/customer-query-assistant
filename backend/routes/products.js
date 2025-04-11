const express = require("express");
const router = express.Router();
const db = require("../db");

// Get all products
router.get("/", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM products");
    res.status(200).json(results);
  } catch (err) {
    console.error("❌ Failed to fetch products:", err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

// Add a new product
router.post("/", async (req, res) => {
  const { name, description, price, stock } = req.body;
  if (!name || !price || stock === undefined) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO products (name, description, price, stock) VALUES (?, ?, ?, ?)",
      [name, description, price, stock]
    );
    res.status(201).json({ message: "Product added", id: result.insertId });
  } catch (err) {
    console.error("❌ Failed to add product:", err);
    res.status(500).json({ message: "Failed to add product" });
  }
});

module.exports = router;
