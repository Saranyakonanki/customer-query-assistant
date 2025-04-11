import React, { useEffect, useState } from "react";
import axios from "axios";

const Refunds = () => {
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRefunds = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/refunds", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRefunds(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch refunds:", err);
        setLoading(false);
      }
    };

    fetchRefunds();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Your Refunds</h2>
      {loading ? (
        <p>Loading refunds...</p>
      ) : refunds.length === 0 ? (
        <p>No refunds found.</p>
      ) : (
        <ul>
          {refunds.map((refund, index) => (
            <li key={index}>
              <p><strong>Refund ID:</strong> {refund.refund_id}</p>
            <p><strong>Product:</strong> {refund.product_name}</p>
            <p><strong>Quantity:</strong> {refund.quantity}</p>
            <p><strong>Amount:</strong> ₹{refund.amount}</p>
            <p><strong>Status:</strong> {refund.status}</p>
            <p><strong>Date:</strong> {new Date(refund.refund_date).toLocaleString()}</p>

              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Refunds;
