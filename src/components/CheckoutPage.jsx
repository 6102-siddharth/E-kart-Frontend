import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../contexts/CartContext'; // Adjust path
import { auth } from '../firebaseConfig'; 
import { useEffect } from 'react';

function CheckoutPage() {
  // 1. Get data from contexts - This is the modern React way
  const { cartItems, getCartTotal, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  // 2. State for the form, loading, and errors
  const [name1, setName1] = useState('');
  const [currentUser, setCurrentUser] = useState();
  const [mobileNo, setMobileNo] = useState('');
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

   useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        setCurrentUser(user);
      });
      return () => unsubscribe();
    }, []);
  
  const totalAmount = getCartTotal();

  const handleCheckout = async (e) => {
    e.preventDefault();
    
    // 3. Validation
    if (!currentUser) {
      setError('You must be logged in to proceed.');
      navigate('/login'); // Redirect to login if not authenticated
      return;
    }
    if (!name1 || !mobileNo || !address) {
      setError('Please fill in all required fields.'+name1+mobileNo+address);
      return;
    }
    if (cartItems.length === 0) {
        setError('Your cart is empty.');
        return;
    }

    setIsLoading(true);
    setError('');

    // 4. Prepare order data for the backend
    const orderDetails = {
      userId: currentUser.uid,
      userEmail: currentUser.email,
      items: cartItems, // Send the full item details for the order history
      totalAmount: totalAmount,
      shippingAddress: address,
      userDetails: {
        name: name1,
        mobileNo: mobileNo,
      },
      status: 'Pending', // Initial status
    };

    try {
      // 5. Submit order to the backend
      const response = await axios.post(
        'http://localhost:5000/api/orders',
        orderDetails
      );

      // 6. Handle success: Clear cart and redirect
      if (response.status === 201) {
        clearCart(); // <--- THIS IS THE KEY STEP
        navigate('/order-success', { state: { orderId: response.data.id } });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
      console.error('Checkout error:', err);
    } finally {
      // 7. Always stop loading state
      setIsLoading(false);
    }
  };
  
  // If cart is empty, don't show the form.
  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty.</h2>
        <p className="text-gray-600">Please add items to your cart before proceeding to checkout.</p>
      </div>
    );
  }

  return (
    <div className="font-sans bg-gray-100 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Checkout</h2>
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row-reverse gap-8">
          
          {/* Order Summary */}
          <div className="md:w-2/5 bg-white p-6 rounded-lg shadow-md h-fit">
            <h3 className="text-xl font-bold border-b pb-4 mb-4">Your Order</h3>
            {cartItems.map(item => (
                <div key={item.id} className="flex justify-between items-center mb-3 text-sm">
                    <span className="text-gray-600">{item.name} <span className="text-xs">x {item.quantity}</span></span>
                    <span className='font-medium text-gray-800'>₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
            ))}
            <div className="border-t mt-4 pt-4 flex justify-between items-center font-bold text-lg">
                <span className="text-gray-800">Total</span>
                <span className="text-gray-900">₹{totalAmount.toFixed(2)}</span>
            </div>
          </div>
          
          {/* Checkout Form */}
          <div className="md:w-3/5 bg-white p-6 rounded-lg shadow-md">
            <form onSubmit={handleCheckout}>
              <h3 className="text-xl font-bold mb-4">Shipping Details</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input type="text" id="name" value={name1} onChange={(e) => setName1(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label htmlFor="mobileNo" className="block text-sm font-medium text-gray-700 mb-1">Mobile No.</label>
                  <input type="tel" id="mobileNo" value={mobileNo} onChange={(e) => setMobileNo(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Shipping Address</label>
                  <textarea id="address" value={address} onChange={(e) => setAddress(e.target.value)} required rows="4" className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              
              {error && <p className="text-red-500 bg-red-100 p-3 rounded mt-4 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Placing Order...' : `Place Order (₹${totalAmount.toFixed(2)})`}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;