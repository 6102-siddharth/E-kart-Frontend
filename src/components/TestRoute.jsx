import React from "react";
import { useLocation } from "react-router-dom";

function TestRoute() {
  const location = useLocation();
  console.log("TestRoute - location.state:", location.state);
  const passedCartItems = location.state?.cartItems;

  return (
    <div>
      <h2>Test Route Component</h2>
      <p>Location State: {JSON.stringify(location.state)}</p>
      {passedCartItems && (
        <div>
          <h3>Received Cart Items:</h3>
          <ul>
            {passedCartItems.map((item) => (
              <li key={item.id}>
                {item.name} (Qty: {item.quantity})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default TestRoute;
