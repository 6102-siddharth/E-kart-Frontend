import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { auth } from "../firebaseConfig"; // Import auth

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]); // Initialize as empty array

  const fetchCartItems = async () => {
    try {
      const idToken = await auth.currentUser.getIdToken(); // Get Firebase ID token
      const response = await axios.get("http://localhost:5000/api/cart", {
        headers: { Authorization: `Bearer ${idToken}` }, // Send token in header
      });
      setCartItems(response.data); // Set cart items from API response
    } catch (error) {
      console.error("Error fetching cart from backend:", error);
      setCartItems([]); // If error, default to empty cart
    }
  };

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      if (user) {
        await fetchCartItems(); // Fetch cart when user logs in
      } else {
        setCartItems([]); // Clear cart when user logs out
      }
    });
    return () => unsubscribeAuth();
  }, []);

  const addToCart = async (camera) => {
    try {
      const idToken = await auth.currentUser.getIdToken();
      await axios.post(
        "http://localhost:5000/api/cart/add",
        {
          cameraId: camera.id,
          quantity: 1,
          name: camera.name,
          price: camera.price,
          imageUrl: camera.imageUrl,
        },
        {
          headers: { Authorization: `Bearer ${idToken}` },
        }
      );
      await fetchCartItems(); // Re-fetch cart after adding to sync with backend
    } catch (error) {
      console.error("Error adding item to cart in backend:", error);
      // Handle error (e.g., show error message to user)
    }
  };

  const removeFromCart = async (cameraId) => {
    try {
      const idToken = await auth.currentUser.getIdToken();
      await axios.delete(`http://localhost:5000/api/cart/remove/${cameraId}`, {
        headers: { Authorization: `Bearer ${idToken}` },
      });
      await fetchCartItems(); // Re-fetch cart after removal
    } catch (error) {
      console.error("Error removing item from cart in backend:", error);
      // Handle error
    }
  };

  const updateQuantity = async (cameraId, quantity) => {
    if (quantity <= 0) {
      return removeFromCart(cameraId); // If quantity is 0 or less, remove item
    }
    try {
      const idToken = await auth.currentUser.getIdToken();
      await axios.put(
        "http://localhost:5000/api/cart/updateQuantity",
        {
          cameraId: cameraId,
          quantity: quantity,
        },
        {
          headers: { Authorization: `Bearer ${idToken}` },
        }
      );
      await fetchCartItems(); // Re-fetch cart after quantity update
    } catch (error) {
      console.error("Error updating cart item quantity in backend:", error);
      // Handle error
    }
  };

  const clearCart = async () => {
    try {
      const idToken = await auth.currentUser.getIdToken();
      await axios.delete("http://localhost:5000/api/cart/clear", {
        headers: { Authorization: `Bearer ${idToken}` },
      });
      await fetchCartItems(); // Re-fetch empty cart
    } catch (error) {
      console.error("Error clearing cart in backend:", error);
      // Handle error
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const placeOrder = async () => {
    try {
      const idToken = await auth.currentUser.getIdToken();
      const response = await axios.post(
        "http://localhost:5000/api/orders",
        { cartItems },
        {
          headers: { Authorization: `Bearer ${idToken}` },
        }
      );

      if (response.status === 200) {
        // Order placed successfully
        console.log("Order placed successfully!");
        clearCart(); // Clear the cart
        alert("Order placed!");
      } else {
        console.error("Error placing order:", response.data);
        // Handle error (e.g., show error message to user)
      }
    } catch (error) {
      console.error("Error placing order:", error);
      // Handle error
    }
  };

  const contextValue = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    placeOrder,
  };

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};
