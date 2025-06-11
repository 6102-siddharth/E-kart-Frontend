import React, { useState, useEffect } from "react";
import { auth } from "../firebaseConfig"; // Firebase Auth
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom"; // For redirection

function CheckoutPage() {
  const location = useLocation();

  // Assume cartItems are passed as props
  const [address, setAddress] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [uid, setUid] = useState(null); // State to store user UID
  const navigate = useNavigate();

  console.log("CheckoutPage - location.state:", location.state);
  const cartItems = location.state?.cartItems || [];
  console.log("CheckoutPage - cartItems:", cartItems);

  useEffect(() => {
    // Get current user UID when component mounts
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUid(user.uid);
        console.log(cartItems);
      } else {
        // No user logged in, maybe redirect to login page
        console.log("No user logged in, redirecting to login");
        navigate("/login"); // Redirect to login page if not logged in
      }
    });

    return () => unsubscribe(); // Unsubscribe on unmount
  }, [navigate]);

  const handleCheckout = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!uid) {
      setError("User not logged in. Please login to checkout.");
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      setError("Your cart is empty. Add items to checkout.");
      return;
    }

    const orderDetails = {
      items: cartItems.map((item) => ({
        cameraId: item.id,
        quantity: item.quantity,
      })), // Assuming cartItem has 'id' and 'quantity'
      shippingAddress: address,
      userDetails: {
        name: name,
        mobileNo: mobileNo,
      },
      userId: uid, // Include UID in the order details
    };

    try {
      const response = await axios.post(
       `${import.meta.env.VITE_BACKEND_URL}/api/orders`,
        orderDetails
      ); // Backend API endpoint
      setSuccessMessage(response.data.message);
      console.log("Order placed:", response.data);
      // Optionally clear cart, redirect to order confirmation page etc.
      // For now, just clear the form and show success message.
      setAddress("");
      setMobileNo("");
      setName("");
      // Redirect to order confirmation page if you create one
      // navigate('/order-confirmation', { state: { orderId: response.data.orderId } });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order.");
      console.error("Checkout error:", err);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>
      {successMessage && (
        <p className="text-green-500 mb-2">{successMessage}</p>
      )}
      {error && <p className="text-red-500 mb-2">Error: {error}</p>}

      <form onSubmit={handleCheckout} className="max-w-md mx-auto">
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Name:
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="mobileNo"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Mobile No:
          </label>
          <input
            type="tel"
            id="mobileNo"
            value={mobileNo}
            onChange={(e) => setMobileNo(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="address"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Shipping Address:
          </label>
          <textarea
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows="4"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Checkout
        </button>
      </form>
    </div>
  );
}

export default CheckoutPage;
