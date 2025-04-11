import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./Chatbot.css"; // Custom styles

const Chatbot = () => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/messages", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Normalize old data: default anything not "assistant" to "user"
        const normalized = res.data.map(msg => ({
          ...msg,
          sender: msg.sender.toLowerCase() === "assistant" ? "assistant" : "user"
        }));

        setChatHistory(normalized);
      } catch (err) {
        console.error("Failed to fetch messages", err);
      }
    };

    fetchMessages();
  }, []);

  useEffect(() => {
    if (chatEndRef.current) {
        chatEndRef.current.scrollIntoView({ behavior: "smooth" });
      }      
  }, [chatHistory]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const token = localStorage.getItem("token");
    try {
      // Save user message
      await axios.post("http://localhost:5000/api/messages", {
        sender: "user",
        message,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setChatHistory(prev => [...prev, { sender: "user", message }]);
      setMessage("");

      // Get assistant reply
      const res = await axios.post("http://localhost:5000/api/chatbot", { message }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const assistantMessage = res.data.reply;

      // Save assistant message
      await axios.post("http://localhost:5000/api/messages", {
        sender: "assistant",
        message: assistantMessage,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setChatHistory(prev => [...prev, { sender: "assistant", message: assistantMessage }]);
    } catch (err) {
      console.error("Error during chat", err);
    }
  };

  return (
    <div className="chatbot-wrapper">
      <div className="chat-history">
        {chatHistory.map((msg, idx) => (
          <div
            key={idx}
            className={`chat-message ${msg.sender === "user" ? "user-message" : "assistant-message"}`}
          >
            <div className="message-bubble">{msg.message}</div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="chat-input">
        <textarea
          rows="2"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;
