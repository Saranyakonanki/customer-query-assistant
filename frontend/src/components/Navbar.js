import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav style={{ padding: "10px", backgroundColor: "#f5f5f5" }}>
      <Link to="/home" style={{ margin: "10px" }}>Products</Link>
      <Link to="/policies" style={{ margin: "10px" }}>Policies</Link>
      <Link to="/orders" style={{ margin: "10px" }}>Orders</Link>
      <Link to="/refunds" style={{ margin: "10px" }}>Refunds</Link>
      <Link to="/chatbot" style={{ margin: "10px" }}>Chatbot</Link>
      <button onClick={handleLogout} style={{ margin: "10px", cursor: "pointer" }}>
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
