import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import CameraCard from './CameraCard';
import { auth } from '../firebaseConfig';

function ExplorePage() {
  const [cameras, setCameras] = useState([]);
  const [query, setQuery] = useState(null)
  const [filteredCameras, setFilteredCameras] = useState([]);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState('default');
  const [priceFilter, setPriceFilter] = useState([0, 500]);
  const location = useLocation();

  useEffect(() => {  
    const fetchCameras = async () => {
      try {
        setLoading(true);
        // Get search query from URL
       
        const response = await axios.get('http://localhost:5000/api/cameras');
        setCameras(response.data);
        setFilteredCameras(response.data);
      } catch (err) {
        setError('Failed to load cameras.');
        console.error('Error fetching cameras:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCameras();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, [location.search]);




  // Handle price filter and sorting
  useEffect(() => {
    let filtered = [...cameras];
    setQuery(new URLSearchParams(location.search).get('search'));
    if (query) {
      filtered = filtered.filter((camera) =>
        camera.name.toLowerCase().includes(query.toLowerCase())
      );
    }
    filtered = filtered.filter(
      (camera) => camera.price >= priceFilter[0] && camera.price <= priceFilter[1]
    );
    if (sortOption === 'price-low-high') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-high-low') {
      filtered.sort((a, b) => b.price - a.price);
    }
    setFilteredCameras(filtered);
  }, [priceFilter, sortOption, cameras, query]);

  return (
    <div className="font-sans bg-gray-100 min-h-screen">
      {/* Hero Section */}
      <section className="bg-white py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-4">
            Explore Our CCTV Cameras
          </h2>
          <p className="text-lg text-gray-600 text-center mb-6">
            Find the perfect security solution for your home or business.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Sort Dropdown */}
          <div>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Sort cameras"
            >
              <option value="default">Sort By: Default</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
            </select>
          </div>
          {/* Price Filter */}
          <div>
            <label className="text-gray-600 mr-2">Price Range:</label>
            <input
              type="number"
              placeholder="Min"
              value={priceFilter[0]}
              onChange={(e) => setPriceFilter([+e.target.value, priceFilter[1]])}
              className="w-20 p-2 rounded-lg border border-gray-300 mr-2"
              aria-label="Minimum price"
            />
            <input
              type="number"
              placeholder="Max"
              value={priceFilter[1]}
              onChange={(e) => setPriceFilter([priceFilter[0], +e.target.value])}
              className="w-20 p-2 rounded-lg border border-gray-300"
              aria-label="Maximum price"
            />
          </div>
        </div>
      </section>

      {/* Camera Grid */}
      <section className="container mx-auto px-4 py-6">
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
        ) : filteredCameras.length === 0 ? (
          <p className="text-gray-600 text-center">No cameras found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCameras.map((camera) => (
              <CameraCard key={camera.id} camera={camera} user={currentUser} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default ExplorePage;