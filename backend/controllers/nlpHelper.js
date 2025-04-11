// Simple mock logic — replace with real ChatGPT integration later

const generateResponse = async (message) => {
    // Static responses for now (can integrate OpenAI API later)
    if (message.includes("refund")) return "Refunds are processed in 5-7 days.";
    if (message.includes("order status")) return "Please provide your Order ID.";
    if (message.includes("policy")) return "You can find our policies on our website.";
  
    return "I'm sorry, I didn't quite understand. Could you please rephrase?";
  };
  
  module.exports = { generateResponse };
  