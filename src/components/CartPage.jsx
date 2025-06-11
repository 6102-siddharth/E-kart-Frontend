import React, { useContext } from 'react';
import { CartContext } from '../contexts/CartContext';
import { Link } from 'react-router-dom';

function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal } =
    useContext(CartContext);

  const handleRemoveItem = (cameraId) => {
    removeFromCart(cameraId);
  };

  const handleQuantityChange = (cameraId, event) => {
    const quantity = parseInt(event.target.value, 10);
    if (!isNaN(quantity) && quantity > 0) {
      updateQuantity(cameraId, quantity);
    }
  };

  const handleClearCart = () => {
    clearCart();
  };

  const totalAmount = getCartTotal();

  if (cartItems.length === 0) {
    return (
      <div className="font-sans bg-gray-100 min-h-screen">
        <section className="container mx-auto px-4 py-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-6">
            Your Shopping Cart
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Your cart is currently empty. Explore our collection to find the perfect CCTV cameras!
          </p>
          <div className="text-center">
            <Link
              to="/explore"
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300"
            >
              Continue Shopping
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="font-sans bg-gray-100 min-h-screen">
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-6">
          Your Shopping Cart
        </h2>

        {/* Cart Items Table */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="hidden md:grid md:grid-cols-6 gap-4 text-gray-600 font-semibold border-b border-gray-200 pb-4">
            <div className="col-span-2">Product</div>
            <div>Price</div>
            <div>Quantity</div>
            <div>Total</div>
            <div>Actions</div>
          </div>
          <ul className="divide-y divide-gray-200">
            {cartItems.map((item) => (
              <li
                key={item.id}
                className="py-4 flex flex-col md:grid md:grid-cols-6 gap-4 items-center"
              >
                <div className="flex items-center col-span-2">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-md mr-4"
                    loading="lazy"
                  />
                  <h3 className="font-semibold text-gray-800">{item.name}</h3>
                </div>
                <div className="text-gray-700">${item.price.toFixed(2)}</div>
                <div className="flex items-center">
                  <input
                    type="number"
                    id={`quantity-${item.id}`}
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.id, e)}
                    className="w-16 p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label={`Quantity for ${item.name}`}
                  />
                </div>
                <div className="text-gray-700">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
                <div>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-red-500 hover:text-red-600 text-sm font-semibold transition-colors duration-300"
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Cart Summary */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white rounded-lg shadow-md p-6">
          <div className="mb-4 md:mb-0">
            <h4 className="text-xl font-bold text-gray-800">
              Total: ${totalAmount.toFixed(2)}
            </h4>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleClearCart}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300"
            >
              Clear Cart
            </button>
            <Link
              to={{
                pathname: '/checkout',
              }}
              state={{ cartItems: cartItems }}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CartPage;