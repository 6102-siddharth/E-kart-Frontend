import React from 'react';
import AdminRoute from './AdminRoute';

function AdminDashboard() {
    return (
        <div>
            <AdminRoute/>
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome to the admin panel. Select an option from the sidebar to get started.</p>
            {/* You can add summary cards here later, e.g., total products, pending orders, total users */}
        </div>
    );
}

export default AdminDashboard;