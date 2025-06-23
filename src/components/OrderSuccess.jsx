import { Link, useLocation } from 'react-router-dom';

function OrderSuccessPage() {
  const location = useLocation();
  const orderId = location.state?.orderId; // Safely access the orderId passed from checkout

  return (
    <div className="font-sans bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-4 py-12 text-center bg-white shadow-lg rounded-lg max-w-lg">
        <svg
          className="w-16 h-16 text-green-500 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Thank You For Your Order!
        </h2>
        <p className="text-gray-600 mb-6">
          Your order has been placed successfully. We have sent a confirmation email to you.
        </p>
        {orderId && (
            <p className="text-sm text-gray-500 mb-8">
                Your Order ID is: <span className='font-mono bg-gray-200 p-1 rounded'>{orderId}</span>
            </p>
        )}
        <div className="flex justify-center gap-4">
          <Link
            to="/explore"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300"
          >
            Continue Shopping
          </Link>
          <Link
            to="/profile/orders" // A link to where the user can see their order history
            className="inline-block bg-gray-700 hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300"
          >
            View My Orders
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccessPage;