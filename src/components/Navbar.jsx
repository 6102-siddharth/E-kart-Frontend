import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import { signOut } from 'firebase/auth';
import { CartContext } from '../contexts/CartContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import logo from '../assets/logo.jpg'; // company logo

function Navbar() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully.');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out.');
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast.info('Please enter a search query.');
      return;
    }
    navigate(`/explore?search=${encodeURIComponent(searchQuery)}`);
    setSearchQuery('');
    if (isMenuOpen) toggleMenu();
  };

  // Calculate total items in cart
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="font-sans bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src={logo}
            alt="CCTV Camera Store Logo"
            className="h-20 w-auto"
            loading="lazy"
          />
          <span className="ml-2 text-xl font-bold text-gray-800 hidden md:block">
            CCTV Camera Store
          </span>
        </Link>

        {/* Search Bar (Desktop) */}
        <div className="hidden md:flex mx-4 lg:w-[600px]">
          <input
            type="text"
            placeholder="Search cameras..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full max-w-md p-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Search cameras"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-r-md"
            aria-label="Search"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </button>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center space-x-6">
          <li>
            <Link
              to="/"
              className="text-gray-600 hover:text-blue-500 transition-colors duration-300"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/explore"
              className="text-gray-600 hover:text-blue-500 transition-colors duration-300"
            >
              Explore
            </Link>
          </li>
          <li className="relative">
            <Link
              to="/cart"
              className="text-gray-600 hover:text-blue-500 transition-colors duration-300"
            >
              Cart
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs font-semibold rounded-full px-2 py-1">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </li>
          {currentUser ? (
            <>
              <li>
                <Link
                  to="/orders"
                  className="text-gray-600 hover:text-blue-500 transition-colors duration-300"
                >
                  Orders
                </Link>
              </li>
              {/* <li>
                <Link
                  to="/profile"
                  className="text-gray-600 hover:text-blue-500 transition-colors duration-300"
                >
                  Profile
                </Link>
              </li> */}
              <li>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-red-500 transition-colors duration-300"
                  aria-label="Log out"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  to="/login2"
                  className="text-gray-600 hover:text-blue-500 transition-colors duration-300"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
                >
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-600 hover:text-blue-500 focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
            ></path>
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <ul className="container mx-auto py-4 space-y-4">
            <li>
              <div className="flex">
                <input
                  type="text"
                  placeholder="Search cameras..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1 p-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Search cameras"
                />
                <button
                  onClick={handleSearch}
                  className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-r-md"
                  aria-label="Search"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                </button>
              </div>
            </li>
            <li>
              <Link
                to="/"
                className="block text-gray-600 hover:text-blue-500 transition-colors duration-300"
                onClick={toggleMenu}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/explore"
                className="block text-gray-600 hover:text-blue-500 transition-colors duration-300"
                onClick={toggleMenu}
              >
                Explore
              </Link>
            </li>
            <li className="relative">
              <Link
                to="/cart"
                className="block text-gray-600 hover:text-blue-500 transition-colors duration-300"
                onClick={toggleMenu}
              >
                Cart
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 right-0 bg-red-500 text-white text-xs font-semibold rounded-full px-2 py-1">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            </li>
            {currentUser ? (
              <>
                <li>
                  <Link
                    to="/orders"
                    className="block text-gray-600 hover:text-blue-500 transition-colors duration-300"
                    onClick={toggleMenu}
                  >
                    Orders
                  </Link>
                </li>
                <li>
                  <Link
                    to="/profile"
                    className="block text-gray-600 hover:text-blue-500 transition-colors duration-300"
                    onClick={toggleMenu}
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => {
                      handleLogout();
                      toggleMenu();
                    }}
                    className="block text-gray-600 hover:text-red-500 transition-colors duration-300"
                    aria-label="Log out"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/login2"
                    className="block text-gray-600 hover:text-blue-500 transition-colors duration-300"
                    onClick={toggleMenu}
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
                    onClick={toggleMenu}
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}

export default Navbar;