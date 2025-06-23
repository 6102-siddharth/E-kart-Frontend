import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

//All images path
import available from '../assets/available.jpg';
import warrenty from '../assets/warrenty.jpg';
import securepay from '../assets/securepay.jpg'
 
const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch featured cameras
  useEffect(() => {
    const fetchCameras = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/cameras`);
        // Assuming the API supports a query for featured products or limit to 3
        setFeaturedProducts(response.data.slice(0, 3)); // Limit to 3 for homepage
      } catch (err) {
        setError('Failed to load featured cameras.');
        console.error('Error fetching cameras:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCameras();
  }, []);

  // Placeholder testimonials (replace with API call if needed)
  const testimonials = [
    {
      id: 1,
      name: 'John Doe',
      text: 'Great quality cameras and excellent customer service!',
      rating: 5,
    },
    {
      id: 2,
      name: 'Sarah Smith',
      text: 'Easy to install and works perfectly for my home.',
      rating: 4,
    },
  ];

  return (
    <div className="font-sans">
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center h-[500px] flex items-center justify-center text-center text-white"
        style={{ backgroundImage: `url('/images/cctv-hero-bg.jpg')` }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Secure Your Space with Top-Quality CCTV Cameras
          </h1>
          <p className="text-lg md:text-xl mb-6">
            Your trusted source for advanced security solutions.
          </p>
          <Link to="/explore">
            <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300">
              Explore Cameras
            </button>
          </Link>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="container mx-auto py-12">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
          Featured CCTV Cameras
        </h2>
        {error && (
          <p className="text-red-500 text-center mb-4" role="alert">
            {error}
          </p>
        )}
        {loading ? (
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
            <p className="text-gray-600 mt-2">Loading cameras...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-4"
              >
                <Link to={`/product/${product.id}`}>
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-48 object-contain mb-4"
                    loading="lazy"
                  />
                </Link>
                <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{product.specs}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-blue-600">₹{product.price}</span>
                  <Link to={`/product/${product.id}`}>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors duration-300">
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Testimonials Section */}
      <section className="bg-gray-100 py-12">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
            What Our Customers Say
          </h2>
          <div className="flex flex-col md:flex-row gap-6">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white rounded-lg shadow-md p-6 flex-1"
              >
                <p className="text-gray-600 mb-4" >"{testimonial.text}"</p>
                <div className="flex items-center">
                  <span className="font-semibold text-gray-800">{testimonial.name}</span>
                  <span className="ml-2 text-yellow-500">
                    {'★'.repeat(testimonial.rating)}
                    {'☆'.repeat(5 - testimonial.rating)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Signals Section */}
      <section className="container mx-auto py-12 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Why Choose Us?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-4">
            <img
              src={warrenty}
              alt="Warranty Icon"
              className="w-25 h-25 mx-auto mb-4"
              loading="lazy"
            />
            <h3 className="text-xl font-semibold text-gray-800">2-Year Warranty</h3>
            <p className="text-gray-600">Shop with confidence with our extended warranty.</p>
          </div>
          <div className="p-4">
            <img
              src= {securepay}
              alt="Secure Payments Icon"
              className="w-25 h-25 mx-auto mb-4"
              loading="lazy"
            />
            <h3 className="text-xl font-semibold text-gray-800">Secure Payments</h3>
            <p className="text-gray-600">100% safe and secure transactions.</p>
          </div>
          <div className="p-4">
            <img
              src={available}
              alt="Support Icon"
              className="w-25 h-25 mx-auto mb-4"
              loading="lazy"
            />
            <h3 className="text-xl font-semibold text-gray-800">24/7 Support</h3>
            <p className="text-gray-600">Our team is here to help anytime.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto text-center">
          <p className="mb-4">CCTV Camera Store © 2025. All rights reserved.</p>
          <div className="flex justify-center gap-4">
            <Link to="/contact" className="hover:text-orange-500 transition-colors">
              Contact
            </Link>
            <Link to="/Terms" className="hover:text-orange-500 transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;