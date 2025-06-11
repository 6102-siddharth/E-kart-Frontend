import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebaseConfig';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  Timestamp,
} from 'firebase/firestore';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError('');
      try {
        if (!auth.currentUser) {
          setError('Please log in to view your orders.');
          setLoading(false);
          return;
        }

        const userId = auth.currentUser.uid;
        const ordersRef = collection(db, 'orders');
        const q = query(ordersRef, where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        const fetchedOrders = [];
        querySnapshot.forEach((doc) => {
          fetchedOrders.push({ id: doc.id, ...doc.data() });
        });
        setOrders(fetchedOrders);
      } catch (err) {
        setError('Failed to fetch orders.');
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      const orderDocRef = doc(db, 'orders', orderId);
      await updateDoc(orderDocRef, {
        status: 'Cancelled',
      });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: 'Cancelled' } : order
        )
      );
      toast.success('Order cancelled successfully.');
    } catch (error) {
      setError(`Failed to cancel order ${orderId}.`);
      console.error('Error cancelling order:', error);
      toast.error('Failed to cancel order.');
    }
  };

  if (loading) {
    return (
      <div className="font-sans bg-gray-100 min-h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
          <p className="text-lg text-gray-600 mt-2">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="font-sans bg-gray-100 min-h-screen flex justify-center items-center">
        <div className="text-center">
          <p className="text-red-500 text-lg" role="alert">
            {error}
          </p>
          <a
            href="/login"
            className="inline-block mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
          >
            Log In
          </a>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="font-sans bg-gray-100 min-h-screen flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            No Orders Yet
          </h2>
          <p className="text-gray-600 mb-6">
            You haven't placed any orders. Start shopping now!
          </p>
          <a
            href="/explore"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300"
          >
            Shop Now
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans bg-gray-100 min-h-screen">
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-8">
          Your Orders
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Order ID: {order.id.slice(0, 8)}...
                  </h3>
                  <span
                    className={`text-sm font-medium px-3 py-1 rounded-full ${
                      order.status === 'Cancelled'
                        ? 'bg-red-100 text-red-600'
                        : order.status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-600'
                        : 'bg-green-100 text-green-600'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-2">
                  <span className="font-semibold">Order Date:</span>{' '}
                  {order.orderDate instanceof Timestamp
                    ? format(order.orderDate.toDate(), 'dd MMMM yyyy, h:mm a')
                    : 'N/A'}
                </p>
                <p className="text-gray-600 text-sm mb-2">
                  <span className="font-semibold">Payment Method:</span>{' '}
                  {order.paymentMethod || 'N/A'}
                </p>
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-gray-800 mb-2">
                    Shipping Address:
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {order.shippingAddress || 'N/A'}
                  </p>
                </div>
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-gray-800 mb-2">
                    User Details:
                  </h4>
                  <p className="text-gray-600 text-sm">
                    <span className="font-semibold">Name:</span>{' '}
                    {order.userDetails?.name || 'N/A'}
                  </p>
                  <p className="text-gray-600 text-sm">
                    <span className="font-semibold">Mobile:</span>{' '}
                    {order.userDetails?.mobileNo || 'N/A'}
                  </p>
                </div>
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-gray-800 mb-2">
                    Items:
                  </h4>
                  <ul className="space-y-4">
                    {order.items?.map((item, index) => (
                      <li key={index} className="flex items-center">
                        <img
                          src={item.imageUrl || '/images/placeholder-image.png'}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-md mr-4"
                          loading="lazy"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/images/placeholder-image.png';
                          }}
                        />
                        <div>
                          <p className="text-gray-800 font-medium">{item.name}</p>
                          <p className="text-gray-500 text-xs">
                            Camera ID: {item.cameraId}
                          </p>
                          <p className="text-gray-600 text-sm">
                            <span className="font-semibold">Qty:</span>{' '}
                            {item.quantity}
                          </p>
                          <p className="text-gray-600 text-sm">
                            <span className="font-semibold">Price:</span> ₹
                            {item.price.toFixed(2)}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-6 flex justify-between items-center">
                  <p className="text-lg font-semibold text-gray-800">
                    Total: ₹{order.totalAmount?.toFixed(2) || 'N/A'}
                  </p>
                  {(order.status === 'Pending' || order.status === 'Processing') && (
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
                      aria-label={`Cancel order ${order.id}`}
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default OrdersPage;