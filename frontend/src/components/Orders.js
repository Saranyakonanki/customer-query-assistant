import React, { useEffect, useState } from "react";
import axios from "axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Your Orders</h2>
      {loading ? (
        <p>Loading your orders...</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul>
          {orders.map((order, index) => (
            <li key={index}>
              <strong>Order ID:</strong> {order.id} <br />
              <strong>Status:</strong> {order.status} <br />
              <strong>Product:</strong> {order.product_name} <br />
              <strong>Placed On:</strong> {new Date(order.created_at).toLocaleString()}
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Orders;
