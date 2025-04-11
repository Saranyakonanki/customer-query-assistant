const express = require("express");
const router = express.Router();
const db = require("../db");
const jwt = require("jsonwebtoken");
require("dotenv").config(); // Load from .env

const SECRET_KEY = process.env.JWT_SECRET || "say_my_name";

// ✅ User Registration
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const [existingUsers] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: "User already exists. Please log in." });
    }

    // 🔐 Ideally hash the password here using bcrypt
    // const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, password] // Use hashedPassword instead in real case
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("❌ Registration Error:", err);
    res.status(500).json({ message: "Registration failed" });
  }
});

// ✅ User Login with JWT
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  console.log("📩 Login request received");
  console.log("📧 Email:", email);
  console.log("🔑 Password:", password);

  if (!email || !password) {
    console.log("⚠️ Missing email or password");
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    console.log("🚀 Attempting to query DB for user...");
    const [results] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    console.log("🔍 User query result:", results);

    if (results.length === 0) {
      console.log("🚫 User not found");
      return res.status(400).json({ message: "User not found. Please register first." });
    }

    const user = results[0];
    console.log("👤 Found user:", user);

    // 🔐 If you hash passwords, use bcrypt.compare here
    if (password !== user.password) {
      console.log("❌ Invalid password");
      return res.status(400).json({ message: "Invalid password. Try again." });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
      expiresIn: "1h",
    });

    console.log("✅ JWT Token created:", token);

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("❌ Login Error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
});

// ✅ Optional Logout
router.post("/logout", (req, res) => {
  res.status(200).json({ message: "Logout successful. Please remove token on client." });
});

module.exports = router;
