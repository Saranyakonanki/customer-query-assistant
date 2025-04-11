import React, { useEffect, useState } from "react";
import axios from "axios";

const Policies = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/policies");
        setPolicies(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch policies:", err);
        setLoading(false);
      }
    };

    fetchPolicies();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Store Policies</h2>
      {loading ? (
        <p>Loading policies...</p>
      ) : (
        policies.map((policy, index) => (
          <div key={index} style={{ marginBottom: "20px" }}>
            <h3>{policy.title}</h3>
            <p>{policy.content}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Policies;
