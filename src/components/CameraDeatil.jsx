import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CartContext } from "../contexts/CartContext";
import axios from "axios";

function CameraDetail() {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const [camera, setCamera] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCameraDetails = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/cameras/${id}`);
        setCamera(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch camera");
        setLoading(false);
      }
    };

    fetchCameraDetails();
  }, [id]);

  const handleAddToCartClick = () => {
    if (camera) {
      addToCart(camera);
      alert(`${camera.name} added to cart!`);
    }
  };

  // Function to convert Firestore Timestamp to Date
  const formatTimestamp = (timestamp) => {
    if (!timestamp || !timestamp._seconds) {
      return "N/A";
    }
    // Convert seconds and nanoseconds to milliseconds
    const milliseconds = timestamp._seconds * 1000 + (timestamp._nanoseconds || 0) / 1000000;
    return new Date(milliseconds).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    });
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  }

  if (!camera) {
    return <div className="text-center py-10">Camera not found</div>;
  }

  // Format updatedAt
  const formattedUpdatedAt = formatTimestamp(camera.updatedAt);

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-blue-500 hover:underline mb-4 inline-block">
          ← Back to Products
        </Link>
        <div className="bg-white rounded-lg shadow-md p-6 md:flex md:space-x-6">
          {/* Camera Image */}
          <div className="md:w-1/2">
            <img
              src={camera.imageUrl}
              alt={camera.name}
              className="w-full h-96 object-contain rounded-lg"
              loading="lazy"
            />
          </div>
          {/* Camera Details */}
          <div className="md:w-1/2 mt-6 md:mt-0">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{camera.name}</h1>
            <p className="text-lg text-gray-600 mb-4">{camera.description}</p>
            <p className="text-2xl font-bold text-blue-600 mb-4">₹{camera.price}</p>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Product Details</h2>
              <ul className="list-disc list-inside text-gray-600">
                <li>Category: {camera.category || "N/A"}</li>
                <li>Stock: {camera.stock || "N/A"} units</li>
                <li>Last Updated: {formattedUpdatedAt}</li>
              </ul>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleAddToCartClick}
                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-3 px-6 rounded transition-colors duration-300"
                disabled={camera.stock === 0}
              >
                {camera.stock > 0 ? "Add to Cart" : "Out of Stock"}
              </button>
              <Link
                to="/"
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded transition-colors duration-300"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CameraDetail;