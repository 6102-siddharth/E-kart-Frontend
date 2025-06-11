import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '../../firebaseConfig'; // Adjust path
import { useAdminAuth } from './AdminRoute'; 


function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [filterStatus, setFilterStatus] = useState(''); // e.g., 'pending', 'shipped', 'delivered'
    const [editingOrder, setEditingOrder] = useState(null); // Order being edited for status
    const [newStatus, setNewStatus] = useState('');
  const adminAuth = useAdminAuth();
  const authToken = adminAuth ? adminAuth.authToken : null;
    const currentUser = adminAuth ? adminAuth.currentUser : null;

    const API_URL = "http://localhost:5000/api/orders/admin";
    const ORDER_STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']; // Example statuses

    const fetchOrders = async () => {
        console.log("dada");
        
        setIsLoading(true);
       
        if (!authToken) {
            setError("Authentication required.");
            setIsLoading(false);
            return;
        }
        try {
            const params = filterStatus ? { status: filterStatus } : {};
            const response = await axios.get(API_URL, {
                headers: { Authorization: `Bearer ${authToken}` },
                params: params
            });
            setOrders(response.data);
            setError('');
        } catch (err) {
            setError("Failed to load orders. " + (err.response?.data?.message || err.message));
            console.error("Error fetching orders:", err);
        } finally {
            setIsLoading(false);
        }
    };

    // useEffect(() => {
    //     fetchOrders;
    // }, [filterStatus]); // Refetch when filterStatus changes
    
      useEffect(() => {
        if (authToken && currentUser) {
            fetchOrders();
        } else if (!isLoading && (!authToken || !currentUser) && adminAuth !== null) {
          
            console.warn("AdminOrders: authToken or currentUser is missing from AdminAuthContext. Current context:", adminAuth);
            setError("Authentication details are not fully available. Please try logging in again.");
            setIsLoading(false); 
           
        } else if (adminAuth === null && !isLoading) {
      
             console.error("AdminOrders: AdminAuthContext is null. Check component nesting.");
             setError("Critical error: Admin authentication context not found.");
             setIsLoading(false);
        }
    }, [authToken, currentUser, filterStatus]);

    const handleStatusFilterChange = (e) => {
        setFilterStatus(e.target.value);
    };

    const handleOpenStatusModal = (order) => {
        setEditingOrder(order);
        setNewStatus(order.status); // Pre-fill with current status
    };

    const handleUpdateStatus = async () => {
        if (!editingOrder || !newStatus) return;

        if (!authToken) {
            setError("Authentication required.");
            return;
        }
        
        try {
            await axios.put(`${API_URL}/${editingOrder.id}/status`, 
                { status: newStatus },
                { headers: { Authorization: `Bearer ${authToken}` } }
            );
            setEditingOrder(null); // Close modal
            fetchOrders; // Refresh list
        } catch (err) {
            setError("Failed to update order status. " + (err.response?.data?.message || err.message));
            console.error("Error updating status:", err);
        }
    };

    if (isLoading) return <p className="text-gray-600">Loading orders...</p>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Manage Orders</h1>
            
            {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-4">{error}</p>}

            <div className="mb-4">
                <label htmlFor="statusFilter" className="mr-2 text-gray-700">Filter by status:</label>
                <select
                    id="statusFilter"
                    value={filterStatus}
                    onChange={handleStatusFilterChange}
                    className="p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">All</option>
                    {ORDER_STATUSES.map(status => (
                        <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                    ))}
                </select>
            </div>

            {/* Status Update Modal (Simplified) */}
            {editingOrder && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
                        <h3 className="text-lg font-medium mb-4">Update Order Status for #{editingOrder.id.substring(0,8)}...</h3>
                        <select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded mb-4"
                        >
                            {ORDER_STATUSES.map(status => (
                                <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                            ))}
                        </select>
                        <div className="flex justify-end space-x-2">
                            <button onClick={() => setEditingOrder(null)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
                            <button onClick={handleUpdateStatus} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Update</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order ID</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User ID/Email</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-gray-900 whitespace-no-wrap">{order.id.substring(0,8)}...</p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                     {/* Assuming order.userEmail or order.userId exists */}
                                    <p className="text-gray-900 whitespace-no-wrap">{order.userEmail || order.userId?.substring(0,10)+'...' || 'N/A'}</p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-gray-900 whitespace-no-wrap">
                                        {new Date(order.createdAt?.seconds ? order.createdAt.seconds * 1000 : order.createdAt).toLocaleDateString()}
                                    </p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
                                    <p className="text-gray-900 whitespace-no-wrap">${parseFloat(order.totalAmount || 0).toFixed(2)}</p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        order.status === 'processing' ? 'bg-indigo-100 text-indigo-800' :
                                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                        'bg-gray-100 text-gray-800'
                                    }`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                                    <button
                                        onClick={() => handleOpenStatusModal(order)}
                                        className="text-indigo-600 hover:text-indigo-900"
                                    >
                                        Update Status
                                    </button>
                                    {/* Add View Details button later */}
                                </td>
                            </tr>
                        ))}
                        {orders.length === 0 && (
                            <tr>
                                <td colSpan="6" className="text-center py-10 text-gray-500">No orders found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminOrders;