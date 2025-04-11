const express = require("express");
const cors = require("cors");
const db = require("./db");

const chatRoutes = require("./routes/messages");
const authRoutes = require("./routes/auth");
const orderRoutes = require("./routes/orders"); // 🆕 Added
const productRoutes = require("./routes/products"); // 🆕 Added
const policyRoutes = require("./routes/policies");
const refundRoutes = require("./routes/refunds");
const chatbotRoute = require("./routes/chatbot");





const app = express();
app.use(cors());
app.use(express.json());

console.log("✅ Registering Routes...");
app.use("/api/messages", chatRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);     // 🆕 Mount order routes
app.use("/api/products", productRoutes); // 🆕 Mount product routes
app.use("/api/policies", policyRoutes);
app.use("/api/refunds", refundRoutes);
app.use("/api/chatbot", chatbotRoute);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
