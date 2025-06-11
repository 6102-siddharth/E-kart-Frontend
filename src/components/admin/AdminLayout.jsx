import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { auth } from '../../firebaseConfig'; // Adjust path as needed

function AdminLayout() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigate('/login'); // Or your login page
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-gray-800 text-white p-5 space-y-4">
                <h2 className="text-2xl font-semibold mb-6">Admin Panel</h2>
                <nav className="space-y-2">
                    <NavLink
                        to="/admin/dashboard"
                        className={({ isActive }) =>
                            `block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 ${isActive ? 'bg-gray-900' : ''}`
                        }
                    >
                        Dashboard
                    </NavLink>
                    <NavLink
                        to="/admin/products"
                        className={({ isActive }) =>
                            `block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 ${isActive ? 'bg-gray-900' : ''}`
                        }
                    >
                        Manage Products
                    </NavLink>
                    <NavLink
                        to="/admin/orders"
                        className={({ isActive }) =>
                            `block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 ${isActive ? 'bg-gray-900' : ''}`
                        }
                    >
                        Manage Orders
                    </NavLink>
                    <NavLink
                        to="/admin/users"
                        className={({ isActive }) =>
                            `block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 ${isActive ? 'bg-gray-900' : ''}`
                        }
                    >
                        Manage Users
                    </NavLink>
                </nav>
                <button
                    onClick={handleLogout}
                    className="mt-auto w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                    Logout
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-10">
                <Outlet /> {/* Child routes will render here */}
            </div>
        </div>
    );
}

export default AdminLayout;