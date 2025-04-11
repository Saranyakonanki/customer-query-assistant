const express = require("express");
const router = express.Router();
const axios = require("axios");
const db = require("../db");
const authenticateUser = require("../middleware/auth");

router.post("/", authenticateUser, async (req, res) => {
  const { message } = req.body;
  const userId = req.user.id;

  try {
    const [policies] = await db.query("SELECT title, content FROM store_policies");
    const [products] = await db.query("SELECT name, price, stock FROM products");
    const [orders] = await db.query(
      `SELECT 
         o.id AS order_id,
         o.quantity,
         o.status,
         o.order_date,
         p.name AS product_name,
         p.price AS product_price
       FROM orders o
       JOIN products p ON o.product_id = p.id
       WHERE o.user_id = ?`,
      [userId]
    );
    const [refunds] = await db.query(
      "SELECT order_id, reason, is_approved, status, refund_date FROM refunds WHERE user_id = ?",
      [userId]
    );

    const policyContext = policies.map(p => `• ${p.title}: ${p.content}`).join("\n");
    const productContext = products.map(p => `• ${p.name}: ₹${p.price}, Stock: ${p.stock}`).join("\n");
    const orderContext = orders.map(o => {
      const total = o.quantity * o.product_price;
      return `• Order ID ${o.order_id} – ${o.quantity} x ${o.product_name} – ₹${total} (${o.status})`;
    }).join("\n");
    const refundContext = refunds.map(r => {
      const approvalStatus = r.status === "requested" ? "Pending review" :
                             r.status === "approved" ? "Approved" :
                             r.status === "rejected" ? "Denied" : "Processed";
      return `• Refund for Order #${r.order_id}: ${r.reason} - ${approvalStatus} (${new Date(r.refund_date).toLocaleString()})`;
    }).join("\n") || "No refund requests found.";

    const systemPrompt = 
`You are a helpful AI assistant. The following is the information available for the user (User ID: ${userId}):

📄 Store Policies:
${policyContext}

🛍️ Products:
${productContext}

📦 Your Orders:
${orderContext}

💰 Refund Requests:
${refundContext}

Please assist the user based on this information. Be polite, concise, and helpful.
`;

    const response = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
      model: "openai/gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ]
    }, {
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    const reply = response.data.choices[0].message.content;
    res.json({ reply }); // ❌ No DB insertion here — handled in frontend
  } catch (err) {
    console.error("💥 Chatbot error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = router;
