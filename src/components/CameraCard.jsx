import React, { useContext } from "react";
import { CartContext } from "../contexts/CartContext"; // Import CartContext
import { Link } from 'react-router-dom';

function CameraCard({ camera, user }) {
  const { addToCart, placeOrder } = useContext(CartContext); // Use addToCart function from context

  const handleAddToCartClick = () => {
    addToCart(camera); // Call addToCart function from CartContext, passing the camera object
    alert(`${camera.name} added to cart!`); // Keep the alert for user feedback
  };
  // const handleOrder = () => {
  //   placeOrder(); // Call addToCart function from CartContext, passing the camera object
  //   alert(`ordered to cart!`); // Keep the alert for user feedback
  //   console.log(user.uid);
  // };

  return (
    <div
    key={camera.id}
    className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-4"
  >
    <Link to={`/product/${camera.id}`}>
      <img
        src={camera.imageUrl}
        alt={camera.name}
        className="w-full h-48 object-contain mb-4"
        loading="lazy"
      />
    </Link>
    <h3 className="text-lg font-semibold text-gray-800">{camera.name}</h3>
    <p className="text-sm text-gray-600 mb-2">{camera.specs}</p>
    <div className="flex justify-between items-center">
    <span className="text-lg font-bold text-blue-600">${camera.price}</span>
    </div>
    <div className="flex justify-between items-center">
      <Link to={`/product/${camera.id}`}>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors duration-300">
          View Details
        </button>
      </Link>
      <button
          onClick={handleAddToCartClick} // Call handleAddToCartClick on button click
          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
        >
          Add to Cart
        </button>
    </div>
  </div>
  );
}

export default CameraCard;
